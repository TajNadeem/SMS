import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { teacherAPI } from '../services/teacherAPI';
import './TeacherForm.css';
import Layout from '../components/Layout';

const TeacherForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    employeeId: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: 'male',
    bloodGroup: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    phoneNumber: '',
    email: '',
    emergencyContact: '',
    emergencyContactName: '',
    qualification: '',
    experience: '',
    specialization: '',
    joiningDate: new Date().toISOString().split('T')[0],
    salary: '',
    accountNumber: '',
    bankName: '',
    ifscCode: '',
    designation: '',
    department: '',
    isClassTeacher: false,
    assignedClass: '',
    assignedSection: '',
    status: 'active'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEditMode) {
      fetchTeacher();
    }
  }, [id]);

  const fetchTeacher = async () => {
    try {
      setLoading(true);
      const response = await teacherAPI.getTeacher(id);
      if (response.data.success) {
        setFormData(response.data.teacher);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch teacher');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let response;
      if (isEditMode) {
        response = await teacherAPI.updateTeacher(id, formData);
      } else {
        response = await teacherAPI.createTeacher(formData);
      }

      if (response.data.success) {
        alert(response.data.message);
        navigate('/teachers');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save teacher');
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditMode) {
    return <div className="loading">Loading teacher data...</div>;
  }

  return (
    <Layout>
    <div className="teacher-form-container">
      <div className="form-header">
        <h1>{isEditMode ? 'Edit Teacher' : 'Add New Teacher'}</h1>
        <button onClick={() => navigate('/teachers')} className="btn-back">
          ← Back to List
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="teacher-form">
        {/* Basic Information */}
        <div className="form-section">
          <h3>Basic Information</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Employee ID *</label>
              <input
                type="text"
                name="employeeId"
                value={formData.employeeId}
                onChange={handleChange}
                required
                placeholder="e.g., EMP2024001"
              />
            </div>

            <div className="form-group">
              <label>Joining Date *</label>
              <input
                type="date"
                name="joiningDate"
                value={formData.joiningDate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>First Name *</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                placeholder="First name"
              />
            </div>

            <div className="form-group">
              <label>Last Name *</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                placeholder="Last name"
              />
            </div>

            <div className="form-group">
              <label>Date of Birth</label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Gender *</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label>Blood Group</label>
              <select
                name="bloodGroup"
                value={formData.bloodGroup}
                onChange={handleChange}
              >
                <option value="">Select</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>

            <div className="form-group">
              <label>Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="active">Active</option>
                <option value="on_leave">On Leave</option>
                <option value="inactive">Inactive</option>
                <option value="resigned">Resigned</option>
              </select>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="form-section">
          <h3>Contact Information</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Phone Number *</label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
                placeholder="Phone number"
              />
            </div>

            <div className="form-group">
              <label>Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="teacher@email.com"
              />
            </div>

            <div className="form-group">
              <label>Emergency Contact Name</label>
              <input
                type="text"
                name="emergencyContactName"
                value={formData.emergencyContactName}
                onChange={handleChange}
                placeholder="Emergency contact name"
              />
            </div>

            <div className="form-group">
              <label>Emergency Contact Number</label>
              <input
                type="tel"
                name="emergencyContact"
                value={formData.emergencyContact}
                onChange={handleChange}
                placeholder="Emergency contact number"
              />
            </div>

            <div className="form-group full-width">
              <label>Address</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows="2"
                placeholder="Full address"
              />
            </div>

            <div className="form-group">
              <label>City</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="City"
              />
            </div>

            <div className="form-group">
              <label>State</label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="State"
              />
            </div>

            <div className="form-group">
              <label>Pincode</label>
              <input
                type="text"
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                placeholder="Pincode"
              />
            </div>
          </div>
        </div>

        {/* Professional Information */}
        <div className="form-section">
          <h3>Professional Information</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Qualification</label>
              <input
                type="text"
                name="qualification"
                value={formData.qualification}
                onChange={handleChange}
                placeholder="e.g., M.Ed, B.Ed, PhD"
              />
            </div>

            <div className="form-group">
              <label>Experience (Years)</label>
              <input
                type="number"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                placeholder="Years of experience"
                min="0"
              />
            </div>

            <div className="form-group">
              <label>Specialization</label>
              <input
                type="text"
                name="specialization"
                value={formData.specialization}
                onChange={handleChange}
                placeholder="e.g., Mathematics, Physics"
              />
            </div>

            <div className="form-group">
              <label>Department</label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
              >
                <option value="">Select Department</option>
                <option value="Science">Science</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Languages">Languages</option>
                <option value="Social Studies">Social Studies</option>
                <option value="Arts">Arts</option>
                <option value="Physical Education">Physical Education</option>
              </select>
            </div>

            <div className="form-group">
              <label>Designation</label>
              <input
                type="text"
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                placeholder="e.g., Senior Teacher, Principal"
              />
            </div>
          </div>
        </div>

        {/* Class Teacher Assignment */}
        <div className="form-section">
          <h3>Class Teacher Assignment</h3>
          <div className="form-grid">
            <div className="form-group full-width">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="isClassTeacher"
                  checked={formData.isClassTeacher}
                  onChange={handleChange}
                />
                <span>Is Class Teacher</span>
              </label>
            </div>

            {formData.isClassTeacher && (
              <>
                <div className="form-group">
                  <label>Assigned Class</label>
                  <select
                    name="assignedClass"
                    value={formData.assignedClass}
                    onChange={handleChange}
                  >
                    <option value="">Select Class</option>
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
                </div>

                <div className="form-group">
                  <label>Assigned Section</label>
                  <select
                    name="assignedSection"
                    value={formData.assignedSection}
                    onChange={handleChange}
                  >
                    <option value="">Select Section</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                  </select>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Bank & Salary Information */}
        <div className="form-section">
          <h3>Bank & Salary Information</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Monthly Salary</label>
              <input
                type="number"
                name="salary"
                value={formData.salary}
                onChange={handleChange}
                placeholder="Salary amount"
                min="0"
                step="0.01"
              />
            </div>

            <div className="form-group">
              <label>Bank Name</label>
              <input
                type="text"
                name="bankName"
                value={formData.bankName}
                onChange={handleChange}
                placeholder="Bank name"
              />
            </div>

            <div className="form-group">
              <label>Account Number</label>
              <input
                type="text"
                name="accountNumber"
                value={formData.accountNumber}
                onChange={handleChange}
                placeholder="Account number"
              />
            </div>

            <div className="form-group">
              <label>IFSC Code</label>
              <input
                type="text"
                name="ifscCode"
                value={formData.ifscCode}
                onChange={handleChange}
                placeholder="IFSC code"
              />
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Saving...' : (isEditMode ? 'Update Teacher' : 'Add Teacher')}
          </button>
          <button 
            type="button" 
            className="btn-secondary" 
            onClick={() => navigate('/teachers')}
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
    </Layout>
  );
};

export default TeacherForm;