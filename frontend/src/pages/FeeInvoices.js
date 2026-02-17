import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { feeAPI } from '../services/feeAPI';
import './FeeInvoices.css';
import Layout from '../components/Layout';

const FeeInvoices = () => {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();
  const academicYear = `${currentYear}-${currentYear + 1}`;

  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    class: '',
    academicYear: academicYear
  });

  useEffect(() => {
    fetchInvoices();
  }, [filters]);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const response = await feeAPI.getAllInvoices(filters);
      if (response.data.success) {
        setInvoices(response.data.invoices);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch invoices');
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

  const getStatusColor = (status) => {
    const colors = {
      paid: '#10b981',
      partial: '#f59e0b',
      pending: '#ef4444',
      overdue: '#991b1b'
    };
    return colors[status] || '#6b7280';
  };

  return (
    <Layout>
    <div className="fee-invoices-container">
      <div className="page-header">
        <h1>📄 Fee Invoices</h1>
        <div className="header-actions">
          <button 
            className="btn-secondary"
            onClick={() => navigate('/fees/generate')}
          >
            + Generate Invoices
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

      {/* Filters */}
      <div className="filters-card">
        <div className="filters-grid">
          <div className="form-group">
            <label>Search Student</label>
            <input
              type="text"
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              placeholder="Name or admission no..."
            />
          </div>

          <div className="form-group">
            <label>Status</label>
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="partial">Partial</option>
              <option value="paid">Paid</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>

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

      {/* Invoices Table */}
      {loading && <div className="loading">Loading invoices...</div>}

      {!loading && invoices.length === 0 && (
        <div className="no-data">No invoices found</div>
      )}

      {!loading && invoices.length > 0 && (
        <div className="invoices-table-container">
          <table className="invoices-table">
            <thead>
              <tr>
                <th>Invoice No</th>
                <th>Student</th>
                <th>Class</th>
                <th>Fee Type</th>
                <th>Academic Year</th>
                <th>Total Amount</th>
                <th>Paid Amount</th>
                <th>Balance</th>
                <th>Due Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map(invoice => (
                <tr key={invoice.id}>
                  <td className="invoice-number">{invoice.invoiceNumber}</td>
                  <td>
                    <div className="student-cell">
                      <strong>
                        {invoice.student.firstName} {invoice.student.lastName}
                      </strong>
                      <small>{invoice.student.admissionNo}</small>
                    </div>
                  </td>
                  <td>{invoice.student.class} {invoice.student.section}</td>
                  <td>{invoice.feeType}</td>
                  <td>{invoice.academicYear}</td>
                  <td className="amount">{formatCurrency(invoice.totalAmount)}</td>
                  <td className="amount paid">{formatCurrency(invoice.paidAmount)}</td>
                  <td className="amount balance">{formatCurrency(invoice.balanceAmount)}</td>
                  <td>{invoice.dueDate}</td>
                  <td>
                    <span 
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(invoice.status) }}
                    >
                      {invoice.status}
                    </span>
                  </td>
                  <td>
                    {(invoice.status === 'pending' || invoice.status === 'partial') && (
                      <button
                        className="btn-pay"
                        onClick={() => navigate('/fees/collect', { 
                          state: { studentId: invoice.student.id } 
                        })}
                      >
                        Collect Fee
                      </button>
                    )}
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

export default FeeInvoices;