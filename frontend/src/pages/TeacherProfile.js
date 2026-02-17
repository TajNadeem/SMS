import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { teacherAPI } from '../services/teacherAPI';
import { subjectAPI } from '../services/subjectAPI';
import './TeacherProfile.css';
import Layout from '../components/Layout';

const TeacherProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Subject assignment
  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [allSubjects, setAllSubjects] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState([]);

  useEffect(() => {
    fetchTeacher();
    fetchAllSubjects();
  }, [id]);

  const fetchTeacher = async () => {
    try {
      setLoading(true);
      const response = await teacherAPI.getTeacher(id);
      if (response.data.success) {
        setTeacher(response.data.teacher);
        
        // Set currently assigned subjects
        if (response.data.teacher.subjects) {
          const assignments = response.data.teacher.subjects.map(subject => ({
            subjectId: subject.id,
            subjectName: subject.subjectName,
            class: subject.TeacherSubject?.class || '',
            section: subject.TeacherSubject?.section || ''
          }));
          setSelectedSubjects(assignments);
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch teacher');
    } finally {
      setLoading(false);
    }
  };

  const fetchAllSubjects = async () => {
    try {
      const response = await subjectAPI.getAllSubjects({ status: 'active' });
      if (response.data.success) {
        setAllSubjects(response.data.subjects);
      }
    } catch (err) {
      console.error('Failed to fetch subjects:', err);
    }
  };

  const handleAddSubject = () => {
    setSelectedSubjects([...selectedSubjects, { subjectId: '', class: '', section: '' }]);
  };

  const handleSubjectChange = (index, field, value) => {
    const updated = [...selectedSubjects];
    updated[index][field] = value;
    
    // Update subject name when subjectId changes
    if (field === 'subjectId') {
      const subject = allSubjects.find(s => s.id === parseInt(value));
      updated[index].subjectName = subject?.subjectName || '';
    }
    
    setSelectedSubjects(updated);
  };

  const handleRemoveSubject = (index) => {
    const updated = selectedSubjects.filter((_, i) => i !== index);
    setSelectedSubjects(updated);
  };

  const handleSaveSubjects = async () => {
    try {
      const subjects = selectedSubjects
        .filter(s => s.subjectId)
        .map(s => ({
          subjectId: parseInt(s.subjectId),
          class: s.class || null,
          section: s.section || null
        }));

      const response = await teacherAPI.assignSubjects(id, subjects);
      if (response.data.success) {
        alert('Subjects assigned successfully!');
        setShowSubjectModal(false);
        fetchTeacher();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to assign subjects');
    }
  };

  if (loading) {
    return <div className="loading">Loading teacher profile...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!teacher) {
    return <div className="error-message">Teacher not found</div>;
  }

  return (
    <Layout>
    <div className="teacher-profile-container">
      <div className="profile-header">
        <div className="header-left">
          <div className="teacher-avatar">
            {teacher.photo ? (
              <img src={teacher.photo} alt={teacher.firstName} />
            ) : (
              <div className="avatar-placeholder">
                {teacher.firstName[0]}{teacher.lastName[0]}
              </div>
            )}
          </div>
          <div className="teacher-info">
            <h1>{teacher.firstName} {teacher.lastName}</h1>
            <p className="employee-id">Employee ID: {teacher.employeeId}</p>
            <span className={`status-badge status-${teacher.status}`}>
              {teacher.status.replace('_', ' ')}
            </span>
          </div>
        </div>
        <div className="header-actions">
          <button 
            className="btn-primary"
            onClick={() => navigate(`/teachers/edit/${teacher.id}`)}
          >
            Edit Profile
          </button>
          <button 
            className="btn-back"
            onClick={() => navigate('/teachers')}
          >
            ← Back to List
          </button>
        </div>
      </div>

      <div className="profile-content">
        {/* Personal Information */}
        <div className="info-card">
          <h3>Personal Information</h3>
          <div className="info-grid">
            <div className="info-item">
              <label>Full Name:</label>
              <span>{teacher.firstName} {teacher.lastName}</span>
            </div>
            <div className="info-item">
              <label>Date of Birth:</label>
              <span>{teacher.dateOfBirth || 'N/A'}</span>
            </div>
            <div className="info-item">
              <label>Gender:</label>
              <span>{teacher.gender}</span>
            </div>
            <div className="info-item">
              <label>Blood Group:</label>
              <span>{teacher.bloodGroup || 'N/A'}</span>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="info-card">
          <h3>Contact Information</h3>
          <div className="info-grid">
            <div className="info-item">
              <label>Phone:</label>
              <span>{teacher.phoneNumber}</span>
            </div>
            <div className="info-item">
              <label>Email:</label>
              <span>{teacher.email}</span>
            </div>
            <div className="info-item">
              <label>Emergency Contact:</label>
              <span>{teacher.emergencyContactName || 'N/A'}</span>
            </div>
            <div className="info-item">
              <label>Emergency Number:</label>
              <span>{teacher.emergencyContact || 'N/A'}</span>
            </div>
            <div className="info-item full-width">
              <label>Address:</label>
              <span>
                {teacher.address || 'N/A'}
                {teacher.city && `, ${teacher.city}`}
                {teacher.state && `, ${teacher.state}`}
                {teacher.pincode && ` - ${teacher.pincode}`}
              </span>
            </div>
          </div>
        </div>

        {/* Professional Information */}
        <div className="info-card">
          <h3>Professional Information</h3>
          <div className="info-grid">
            <div className="info-item">
              <label>Qualification:</label>
              <span>{teacher.qualification || 'N/A'}</span>
            </div>
            <div className="info-item">
              <label>Experience:</label>
              <span>{teacher.experience ? `${teacher.experience} years` : 'N/A'}</span>
            </div>
            <div className="info-item">
              <label>Specialization:</label>
              <span>{teacher.specialization || 'N/A'}</span>
            </div>
            <div className="info-item">
              <label>Department:</label>
              <span>{teacher.department || 'N/A'}</span>
            </div>
            <div className="info-item">
              <label>Designation:</label>
              <span>{teacher.designation || 'N/A'}</span>
            </div>
            <div className="info-item">
              <label>Joining Date:</label>
              <span>{teacher.joiningDate}</span>
            </div>
          </div>
        </div>

        {/* Subjects Taught */}
        <div className="info-card">
          <div className="card-header">
            <h3>Subjects Taught</h3>
            <button 
              className="btn-secondary"
              onClick={() => setShowSubjectModal(true)}
            >
              Assign Subjects
            </button>
          </div>
          <div className="subjects-container">
            {teacher.subjects && teacher.subjects.length > 0 ? (
              <div className="subjects-grid">
                {teacher.subjects.map((subject) => (
                  <div key={subject.id} className="subject-card">
                    <h4>{subject.subjectName}</h4>
                    <p className="subject-code">{subject.subjectCode}</p>
                    {subject.TeacherSubject?.class && (
                      <p className="subject-class">
                        Class: {subject.TeacherSubject.class} 
                        {subject.TeacherSubject.section && ` - ${subject.TeacherSubject.section}`}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-data">No subjects assigned yet</p>
            )}
          </div>
        </div>

        {/* Class Teacher Info */}
        {teacher.isClassTeacher && (
          <div className="info-card">
            <h3>Class Teacher Assignment</h3>
            <div className="class-assignment">
              <div className="class-badge-large">
                {teacher.assignedClass} - {teacher.assignedSection}
              </div>
              <p>This teacher is assigned as the class teacher for the above class</p>
            </div>
          </div>
        )}

        {/* Bank & Salary Information */}
        <div className="info-card">
          <h3>Bank & Salary Information</h3>
          <div className="info-grid">
            <div className="info-item">
              <label>Monthly Salary:</label>
              <span>{teacher.salary ? `₹${parseFloat(teacher.salary).toLocaleString()}` : 'N/A'}</span>
            </div>
            <div className="info-item">
              <label>Bank Name:</label>
              <span>{teacher.bankName || 'N/A'}</span>
            </div>
            <div className="info-item">
              <label>Account Number:</label>
              <span>{teacher.accountNumber || 'N/A'}</span>
            </div>
            <div className="info-item">
              <label>IFSC Code:</label>
              <span>{teacher.ifscCode || 'N/A'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Subject Assignment Modal */}
      {showSubjectModal && (
        <div className="modal-overlay" onClick={() => setShowSubjectModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Assign Subjects</h2>
              <button 
                className="modal-close"
                onClick={() => setShowSubjectModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              {selectedSubjects.map((assignment, index) => (
                <div key={index} className="subject-assignment-row">
                  <select
                    value={assignment.subjectId}
                    onChange={(e) => handleSubjectChange(index, 'subjectId', e.target.value)}
                    className="subject-select"
                  >
                    <option value="">Select Subject</option>
                    {allSubjects.map(subject => (
                      <option key={subject.id} value={subject.id}>
                        {subject.subjectName} ({subject.subjectCode})
                      </option>
                    ))}
                  </select>

                  <select
                    value={assignment.class}
                    onChange={(e) => handleSubjectChange(index, 'class', e.target.value)}
                    className="class-select"
                  >
                    <option value="">All Classes</option>
                    <option value="Grade 1">Grade 1</option>
                    <option value="Grade 2">Grade 2</option>
                    <option value="Grade 3">Grade 3</option>
                    <option value="Grade 4">Grade 4</option>
                    <option value="Grade 5">Grade 5</option>
                    <option value="Grade 6">Grade 6</option>
                    <option value="Grade 7">Grade 7</option>
                    <option value="Grade 8">Grade 8</option>
                    <option value="Grade 9">Grade 9</option>
                    <option value="Grade 10">Grade 10</option>
                  </select>

                  <select
                    value={assignment.section}
                    onChange={(e) => handleSubjectChange(index, 'section', e.target.value)}
                    className="section-select"
                  >
                    <option value="">All Sections</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                  </select>

                  <button
                    type="button"
                    className="btn-remove"
                    onClick={() => handleRemoveSubject(index)}
                  >
                    Remove
                  </button>
                </div>
              ))}

              <button 
                type="button"
                className="btn-add-more"
                onClick={handleAddSubject}
              >
                + Add Another Subject
              </button>
            </div>
            <div className="modal-footer">
              <button 
                className="btn-primary"
                onClick={handleSaveSubjects}
              >
                Save Assignments
              </button>
              <button 
                className="btn-secondary"
                onClick={() => setShowSubjectModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </Layout>
  );
};

export default TeacherProfile;