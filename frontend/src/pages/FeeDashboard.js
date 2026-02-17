import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { feeAPI } from '../services/feeAPI';
import './FeeDashboard.css';
import Layout from '../components/Layout';

const FeeDashboard = () => {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();
  const academicYear = `${currentYear}-${currentYear + 1}`;

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await feeAPI.getFeeStats({ academicYear });
      if (response.data.success) {
        setStats(response.data.stats);
      }
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return `₹${parseFloat(amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
  };

  return (
    <Layout>
    <div className="fee-dashboard-container">
      <div className="page-header">
        <h1>💰 Fee Management</h1>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions-grid">
        <div 
          className="action-card"
          onClick={() => navigate('/fees/collect')}
        >
          <div className="action-icon">💵</div>
          <h3>Collect Fee</h3>
          <p>Record fee payments</p>
        </div>

        <div 
          className="action-card"
          onClick={() => navigate('/fees/invoices')}
        >
          <div className="action-icon">📄</div>
          <h3>View Invoices</h3>
          <p>All fee invoices</p>
        </div>

        <div 
          className="action-card"
          onClick={() => navigate('/fees/structures')}
        >
          <div className="action-icon">⚙️</div>
          <h3>Fee Structures</h3>
          <p>Manage fee structures</p>
        </div>

        <div 
          className="action-card"
          onClick={() => navigate('/fees/defaulters')}
        >
          <div className="action-icon">⚠️</div>
          <h3>Defaulters</h3>
          <p>Overdue payments</p>
        </div>
      </div>

      {/* Statistics */}
      {loading && <div className="loading">Loading statistics...</div>}

      {!loading && stats && (
        <div className="stats-section">
          <h2>Financial Overview - {academicYear}</h2>
          
          <div className="stats-grid-large">
            <div className="stat-card-large total">
              <h3>Total Amount</h3>
              <div className="stat-amount">{formatCurrency(stats.totalAmount)}</div>
              <div className="stat-detail">{stats.totalInvoices} invoices</div>
            </div>

            <div className="stat-card-large collected">
              <h3>Collected</h3>
              <div className="stat-amount">{formatCurrency(stats.paidAmount)}</div>
              <div className="stat-detail">{stats.paidInvoices} paid invoices</div>
            </div>

            <div className="stat-card-large pending">
              <h3>Balance</h3>
              <div className="stat-amount">{formatCurrency(stats.balanceAmount)}</div>
              <div className="stat-detail">{stats.pendingInvoices + stats.partialInvoices} pending</div>
            </div>

            <div className="stat-card-large overdue">
              <h3>Overdue</h3>
              <div className="stat-amount">{stats.overdueInvoices}</div>
              <div className="stat-detail">Invoices overdue</div>
            </div>
          </div>

          <div className="collection-percentage">
            <h3>Collection Percentage</h3>
            <div className="percentage-bar">
              <div 
                className="percentage-fill"
                style={{ width: `${stats.collectionPercentage}%` }}
              >
                <span>{stats.collectionPercentage}%</span>
              </div>
            </div>
          </div>

          <div className="invoice-breakdown">
            <h3>Invoice Status Breakdown</h3>
            <div className="breakdown-grid">
              <div className="breakdown-item paid">
                <div className="breakdown-number">{stats.paidInvoices}</div>
                <div className="breakdown-label">Fully Paid</div>
              </div>
              <div className="breakdown-item partial">
                <div className="breakdown-number">{stats.partialInvoices}</div>
                <div className="breakdown-label">Partially Paid</div>
              </div>
              <div className="breakdown-item pending">
                <div className="breakdown-number">{stats.pendingInvoices}</div>
                <div className="breakdown-label">Pending</div>
              </div>
              <div className="breakdown-item overdue">
                <div className="breakdown-number">{stats.overdueInvoices}</div>
                <div className="breakdown-label">Overdue</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    </Layout>
  );
};

export default FeeDashboard;