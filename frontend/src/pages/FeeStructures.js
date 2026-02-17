import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { feeAPI } from '../services/feeAPI';
import './FeeStructures.css';
import Layout from '../components/Layout';

const FeeStructures = () => {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  const [structures, setStructures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingStructure, setEditingStructure] = useState(null);

  const [formData, setFormData] = useState({
    class: 'Grade 1',
    academicYear: `${currentYear}-${currentYear + 1}`,
    feeType: 'Tuition Fee',
    amount: '',
    frequency: 'monthly',
    dueDate: '',
    description: '',
    status: 'active'
  });

  useEffect(() => {
    fetchStructures();
  }, []);

  const fetchStructures = async () => {
    try {
      setLoading(true);
      const response = await feeAPI.getAllFeeStructures();
      if (response.data.success) {
        setStructures(response.data.feeStructures);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch fee structures');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (structure = null) => {
    if (structure) {
      setEditingStructure(structure);
      setFormData(structure);
    } else {
      setEditingStructure(null);
      setFormData({
        class: 'Grade 1',
        academicYear: `${currentYear}-${currentYear + 1}`,
        feeType: 'Tuition Fee',
        amount: '',
        frequency: 'monthly',
        dueDate: '',
        description: '',
        status: 'active'
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingStructure(null);
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
      if (editingStructure) {
        response = await feeAPI.updateFeeStructure(editingStructure.id, formData);
      } else {
        response = await feeAPI.createFeeStructure(formData);
      }

      if (response.data.success) {
        alert(response.data.message);
        handleCloseModal();
        fetchStructures();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save fee structure');
    }
  };

  const handleDelete = async (id, feeType) => {
    if (window.confirm(`Are you sure you want to delete ${feeType}?`)) {
      try {
        const response = await feeAPI.deleteFeeStructure(id);
        if (response.data.success) {
          alert('Fee structure deleted successfully');
          fetchStructures();
        }
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete fee structure');
      }
    }
  };

  const formatCurrency = (amount) => {
    return `₹${parseFloat(amount || 0).toLocaleString('en-IN')}`;
  };

  // Group structures by class and academic year
  const groupedStructures = structures.reduce((acc, structure) => {
    const key = `${structure.class} - ${structure.academicYear}`;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(structure);
    return acc;
  }, {});

  return (
    <Layout>
    <div className="fee-structures-container">
      <div className="page-header">
        <h1>⚙️ Fee Structures</h1>
        <div className="header-actions">
          <button 
            className="btn-primary"
            onClick={() => handleOpenModal()}
          >
            + Add Fee Structure
          </button>
          <button 
            className="btn-back"
            onClick={() => navigate('/fees')}
          >
            ← Back
          </button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}
      {loading && <div className="loading">Loading fee structures...</div>}

      {!loading && structures.length === 0 && (
        <div className="no-data">
          <p>No fee structures found. Add your first fee structure!</p>
        </div>
      )}

      {!loading && structures.length > 0 && (
        <div className="structures-groups">
          {Object.entries(groupedStructures).map(([groupKey, groupStructures]) => (
            <div key={groupKey} className="structure-group">
              <h3 className="group-header">{groupKey}</h3>
              <div className="structures-grid">
                {groupStructures.map(structure => (
                  <div key={structure.id} className="structure-card">
                    <div className="structure-header">
                      <h4>{structure.feeType}</h4>
                      <span className={`status-badge status-${structure.status}`}>
                        {structure.status}
                      </span>
                    </div>
                    <div className="structure-body">
                      <div className="structure-amount">
                        {formatCurrency(structure.amount)}
                      </div>
                      <div className="structure-details">
                        <div className="detail-row">
                          <span>Frequency:</span>
                          <strong>{structure.frequency}</strong>
                        </div>
                        {structure.dueDate && (
                          <div className="detail-row">
                            <span>Due Date:</span>
                            <strong>{structure.dueDate}</strong>
                          </div>
                        )}
                        {structure.description && (
                          <div className="detail-row full-width">
                            <span>Description:</span>
                            <p>{structure.description}</p>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="structure-actions">
                      <button
                        className="btn-edit"
                        onClick={() => handleOpenModal(structure)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() => handleDelete(structure.id, structure.feeType)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingStructure ? 'Edit Fee Structure' : 'Add Fee Structure'}</h2>
              <button className="modal-close" onClick={handleCloseModal}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
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
                    <label>Academic Year *</label>
                    <select
                      name="academicYear"
                      value={formData.academicYear}
                      onChange={handleChange}
                      required
                    >
                      {[...Array(3)].map((_, i) => {
                        const year = currentYear - 1 + i;
                        return (
                          <option key={year} value={`${year}-${year + 1}`}>
                            {year}-{year + 1}
                          </option>
                        );
                      })}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Fee Type *</label>
                    <input
                      type="text"
                      name="feeType"
                      value={formData.feeType}
                      onChange={handleChange}
                      required
                      placeholder="e.g., Tuition Fee, Exam Fee"
                    />
                  </div>

                  <div className="form-group">
                    <label>Amount *</label>
                    <input
                      type="number"
                      name="amount"
                      value={formData.amount}
                      onChange={handleChange}
                      required
                      step="0.01"
                      min="0"
                      placeholder="Enter amount"
                    />
                  </div>

                  <div className="form-group">
                    <label>Frequency *</label>
                    <select
                      name="frequency"
                      value={formData.frequency}
                      onChange={handleChange}
                      required
                    >
                      <option value="monthly">Monthly</option>
                      <option value="quarterly">Quarterly</option>
                      <option value="half_yearly">Half Yearly</option>
                      <option value="yearly">Yearly</option>
                      <option value="one_time">One Time</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Due Date</label>
                    <input
                      type="date"
                      name="dueDate"
                      value={formData.dueDate}
                      onChange={handleChange}
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

                  <div className="form-group full-width">
                    <label>Description</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows="3"
                      placeholder="Optional description"
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="submit" className="btn-primary">
                  {editingStructure ? 'Update Structure' : 'Add Structure'}
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

export default FeeStructures;