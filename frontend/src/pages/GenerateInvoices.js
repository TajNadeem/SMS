import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { feeAPI } from '../services/feeAPI';
import './GenerateInvoices.css';
import Layout from '../components/Layout';

const GenerateInvoices = () => {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  const [formData, setFormData] = useState({
    class: 'Grade 1',
    academicYear: `${currentYear}-${currentYear + 1}`,
    feeType: 'Tuition Fee'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await feeAPI.generateInvoices(formData);
      
      if (response.data.success) {
        setSuccess(response.data.message);
        setTimeout(() => {
          navigate('/fees/invoices');
        }, 2000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate invoices');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
    <div className="generate-invoices-container">
      <div className="page-header">
        <h1>📄 Generate Invoices</h1>
        <button className="btn-back" onClick={() => navigate('/fees/invoices')}>
          ← Back
        </button>
      </div>

      {success && <div className="success-message">{success}</div>}
      {error && <div className="error-message">{error}</div>}

      <div className="generate-form-card">
        <div className="form-info">
          <h3>⚠️ Important Information</h3>
          <ul>
            <li>Invoices will be generated for all active students in the selected class</li>
            <li>Only students without pending invoices for this fee type will receive new invoices</li>
            <li>Make sure the fee structure is created before generating invoices</li>
            <li>Students will not receive duplicate invoices for the same fee type and academic year</li>
          </ul>
        </div>

        <form onSubmit={handleSubmit}>
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

            <div className="form-group full-width">
              <label>Fee Type *</label>
              <input
                type="text"
                name="feeType"
                value={formData.feeType}
                onChange={handleChange}
                required
                placeholder="e.g., Tuition Fee, Exam Fee, Transport Fee"
              />
              <small>Make sure this fee type exists in the fee structure for the selected class</small>
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Generating...' : 'Generate Invoices'}
            </button>
            <button 
              type="button" 
              className="btn-secondary"
              onClick={() => navigate('/fees/invoices')}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
    </Layout>
  );
};

export default GenerateInvoices;