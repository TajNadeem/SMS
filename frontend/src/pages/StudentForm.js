import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { studentAPI } from '../services/studentAPI';
import './StudentForm.css';
import Layout from '../components/Layout';

const StudentForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    admissionNo: '',
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
    parentName: '',
    parentPhone: '',
    parentEmail: '',
    class: 'Grade 1',
    section: '',
    rollNumber: '',
    admissionDate: new Date().toISOString().split('T')[0],
    status: 'active'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch student data if editing
  useEffect(() => {
    if (isEditMode) {
      fetchStudent();
    }
  }, [id]);

  const fetchStudent = async () => {
    try {
      setLoading(true);
      const response = await studentAPI.getStudent(id);
      if (response.data.success) {
        setFormData(response.data.student);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch student');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
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
        response = await studentAPI.updateStudent(id, formData);
      } else {
        response = await studentAPI.createStudent(formData);
      }

      if (response.data.success) {
        alert(response.data.message);
        navigate('/students');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save student');
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditMode) {
    return <div className="loading">Loading student data...</div>;
  }

  return (
    <Layout>
    <div className="student-form-container">
      <div className="form-header">
        <h1>{isEditMode ? 'Edit Student' : 'Add New Student'}</h1>
        <button onClick={() => navigate('/students')} className="btn-back">
          ← Back to List
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="student-form">
        {/* Basic Information */}
        <div className="form-section">
          <h3>Basic Information</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Admission Number *</label>
              <input
                type="text"
                name="admissionNo"
                value={formData.admissionNo}
                onChange={handleChange}
                required
                placeholder="e.g., ADM2024001"
              />
            </div>

            <div className="form-group">
              <label>Admission Date *</label>
              <input
                type="date"
                name="admissionDate"
                value={formData.admissionDate}
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
                <option value="inactive">Inactive</option>
                <option value="passed_out">Passed Out</option>
                <option value="transferred">Transferred</option>
              </select>
            </div>
          </div>
        </div>

        {/* Academic Information */}
        <div className="form-section">
          <h3>Academic Information</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Class *</label>
              <select
                name="class"
                value={formData.class}
                onChange={handleChange}
                required
              >
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
              <label>Section</label>
              <select
                name="section"
                value={formData.section}
                onChange={handleChange}
              >
                <option value="">Select</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
              </select>
            </div>

            <div className="form-group">
              <label>Roll Number</label>
              <input
                type="text"
                name="rollNumber"
                value={formData.rollNumber}
                onChange={handleChange}
                placeholder="e.g., 001"
              />
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="form-section">
          <h3>Contact Information</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="Student phone"
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="student@email.com"
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

        {/* Parent Information */}
        <div className="form-section">
          <h3>Parent/Guardian Information</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Parent Name</label>
              <input
                type="text"
                name="parentName"
                value={formData.parentName}
                onChange={handleChange}
                placeholder="Parent/Guardian name"
              />
            </div>

            <div className="form-group">
              <label>Parent Phone</label>
              <input
                type="tel"
                name="parentPhone"
                value={formData.parentPhone}
                onChange={handleChange}
                placeholder="Parent phone"
              />
            </div>

            <div className="form-group">
              <label>Parent Email</label>
              <input
                type="email"
                name="parentEmail"
                value={formData.parentEmail}
                onChange={handleChange}
                placeholder="parent@email.com"
              />
            </div>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="form-actions">
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Saving...' : (isEditMode ? 'Update Student' : 'Add Student')}
          </button>
          <button 
            type="button" 
            className="btn-secondary" 
            onClick={() => navigate('/students')}
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

export default StudentForm;