import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { feeAPI } from '../services/feeAPI';
import './FeeDefaulters.css';
import Layout from '../components/Layout';

const FeeDefaulters = () => {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  const [defaulters, setDefaulters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [filters, setFilters] = useState({
    class: '',
    academicYear: `${currentYear}-${currentYear + 1}`
  });

  useEffect(() => {
    fetchDefaulters();
  }, [filters]);

  const fetchDefaulters = async () => {
    try {
      setLoading(true);
      const response = await feeAPI.getFeeDefaulters(filters);
      if (response.data.success) {
        setDefaulters(response.data.defaulters);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch defaulters');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const formatCurrency = (amount) => {
    return `₹${parseFloat(amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
  };

  const calculateDaysOverdue = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = today - due;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <Layout>
    <div className="fee-defaulters-container">
      <div className="page-header">
        <h1>⚠️ Fee Defaulters</h1>
        <button className="btn-back" onClick={() => navigate('/fees')}>
          ← Back
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {/* Filters */}
      <div className="filters-card">
        <div className="filters-grid">
          <div className="form-group">
            <label>Class</label>
            <select
              name="class"
              value={filters.class}
              onChange={handleFilterChange}
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
          </div>

          <div className="form-group">
            <label>Academic Year</label>
            <select
              name="academicYear"
              value={filters.academicYear}
              onChange={handleFilterChange}
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
        </div>
      </div>

      {/* Summary */}
      {!loading && defaulters.length > 0 && (
        <div className="summary-card">
          <h3>Summary</h3>
          <div className="summary-stats">
            <div className="summary-item">
              <span className="summary-label">Total Defaulters:</span>
              <span className="summary-value">{defaulters.length}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Total Outstanding:</span>
              <span className="summary-value">
                {formatCurrency(
                  defaulters.reduce((sum, d) => sum + parseFloat(d.balanceAmount), 0)
                )}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Defaulters Table */}
      {loading && <div className="loading">Loading defaulters...</div>}

      {!loading && defaulters.length === 0 && (
        <div className="no-data">
          <p>🎉 No fee defaulters found!</p>
        </div>
      )}

      {!loading && defaulters.length > 0 && (
        <div className="defaulters-table-container">
          <table className="defaulters-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Class</th>
                <th>Invoice No</th>
                <th>Fee Type</th>
                <th>Due Date</th>
                <th>Days Overdue</th>
                <th>Balance Amount</th>
                <th>Parent Contact</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {defaulters.map(defaulter => (
                <tr key={defaulter.id} className="defaulter-row">
                  <td>
                    <div className="student-cell">
                      <strong>
                        {defaulter.student.firstName} {defaulter.student.lastName}
                      </strong>
                      <small>{defaulter.student.admissionNo}</small>
                    </div>
                  </td>
                  <td>{defaulter.student.class} {defaulter.student.section}</td>
                  <td className="invoice-number">{defaulter.invoiceNumber}</td>
                  <td>{defaulter.feeType}</td>
                  <td className="due-date">{defaulter.dueDate}</td>
                  <td className="days-overdue">
                    <span className="overdue-badge">
                      {calculateDaysOverdue(defaulter.dueDate)} days
                    </span>
                  </td>
                  <td className="amount balance">{formatCurrency(defaulter.balanceAmount)}</td>
                  <td>
                    <div className="contact-cell">
                      {defaulter.student.parentPhone && (
                        <div>📱 {defaulter.student.parentPhone}</div>
                      )}
                      {defaulter.student.parentEmail && (
                        <div>📧 {defaulter.student.parentEmail}</div>
                      )}
                    </div>
                  </td>
                  <td>
                    <button
                      className="btn-collect"
                      onClick={() => navigate('/fees/collect', { 
                        state: { studentId: defaulter.student.id } 
                      })}
                    >
                      Collect Fee
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
    </Layout>
  );
};

export default FeeDefaulters;