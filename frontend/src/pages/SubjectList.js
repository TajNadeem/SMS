import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { subjectAPI } from '../services/subjectAPI';
import './SubjectList.css';
import Layout from '../components/Layout';


const SubjectList = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [formData, setFormData] = useState({
    subjectName: '',
    subjectCode: '',
    description: '',
    status: 'active'
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchSubjects();
  }, [search]);

  const fetchSubjects = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;

      const response = await subjectAPI.getAllSubjects(params);
      if (response.data.success) {
        setSubjects(response.data.subjects);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch subjects');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (subject = null) => {
    if (subject) {
      setEditingSubject(subject);
      setFormData(subject);
    } else {
      setEditingSubject(null);
      setFormData({
        subjectName: '',
        subjectCode: '',
        description: '',
        status: 'active'
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingSubject(null);
    setFormData({
      subjectName: '',
      subjectCode: '',
      description: '',
      status: 'active'
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let response;
      if (editingSubject) {
        response = await subjectAPI.updateSubject(editingSubject.id, formData);
      } else {
        response = await subjectAPI.createSubject(formData);
      }

      if (response.data.success) {
        alert(response.data.message);
        handleCloseModal();
        fetchSubjects();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save subject');
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      try {
        const response = await subjectAPI.deleteSubject(id);
        if (response.data.success) {
          alert('Subject deleted successfully');
          fetchSubjects();
        }
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete subject');
      }
    }
  };

  return (
    <Layout>
    <div className="subject-list-container">
      <div className="page-header">
        <h1>📚 Subject Management</h1>
        <div className="header-buttons">
          <button 
            className="btn-back"
            onClick={() => navigate('/teachers')}
          >
            ← Back to Teachers
          </button>
          <button 
            className="btn-primary"
            onClick={() => handleOpenModal()}
          >
            + Add New Subject
          </button>
        </div>
      </div>

      <div className="filters-container">
        <input
          type="text"
          placeholder="🔍 Search subjects..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
      </div>

      {error && <div className="error-message">{error}</div>}
      {loading && <div className="loading">Loading subjects...</div>}

      {!loading && subjects.length === 0 && (
        <div className="no-data">
          <p>No subjects found. Add your first subject!</p>
        </div>
      )}

      {!loading && subjects.length > 0 && (
        <div className="subjects-grid">
          {subjects.map((subject) => (
            <div key={subject.id} className="subject-card-large">
              <div className="subject-header">
                <h3>{subject.subjectName}</h3>
                <span className={`status-badge status-${subject.status}`}>
                  {subject.status}
                </span>
              </div>
              <p className="subject-code">Code: {subject.subjectCode}</p>
              {subject.description && (
                <p className="subject-description">{subject.description}</p>
              )}
              <div className="subject-actions">
                <button
                  className="btn-edit"
                  onClick={() => handleOpenModal(subject)}
                >
                  Edit
                </button>
                <button
                  className="btn-delete"
                  onClick={() => handleDelete(subject.id, subject.subjectName)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Subject Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingSubject ? 'Edit Subject' : 'Add New Subject'}</h2>
              <button className="modal-close" onClick={handleCloseModal}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Subject Name *</label>
                  <input
                    type="text"
                    name="subjectName"
                    value={formData.subjectName}
                    onChange={handleChange}
                    required
                    placeholder="e.g., Mathematics"
                  />
                </div>

                <div className="form-group">
                  <label>Subject Code *</label>
                  <input
                    type="text"
                    name="subjectCode"
                    value={formData.subjectCode}
                    onChange={handleChange}
                    required
                    placeholder="e.g., MATH101"
                  />
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="3"
                    placeholder="Subject description (optional)"
                  />
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
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button type="submit" className="btn-primary">
                  {editingSubject ? 'Update Subject' : 'Add Subject'}
                </button>
                <button 
                  type="button" 
                  className="btn-secondary"
                  onClick={handleCloseModal}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
    </Layout>
  );
};

export default SubjectList;