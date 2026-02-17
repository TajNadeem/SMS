import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { attendanceAPI } from '../services/attendanceAPI';
import './AttendanceDashboard.css';
import Layout from '../components/Layout';

const AttendanceDashboard = () => {
  const navigate = useNavigate();
  const today = new Date().toISOString().split('T')[0];

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    startDate: today,
    endDate: today
  });

  useEffect(() => {
    fetchStats();
  }, [dateRange]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await attendanceAPI.getStats(dateRange);
      if (response.data.success) {
        setStats(response.data.stats);
      }
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (e) => {
    setDateRange({
      ...dateRange,
      [e.target.name]: e.target.value
    });
  };

  return (
    <Layout>
    <div className="attendance-dashboard-container">
      <div className="page-header">
        <h1>📊 Attendance Dashboard</h1>
        <button 
          className="btn-primary"
          onClick={() => navigate('/attendance/mark')}
        >
          + Mark Attendance
        </button>
      </div>

      {/* Date Filter */}
      <div className="filter-card">
        <div className="date-filters">
          <div className="form-group">
            <label>From Date:</label>
            <input
              type="date"
              name="startDate"
              value={dateRange.startDate}
              onChange={handleDateChange}
              max={today}
            />
          </div>
          <div className="form-group">
            <label>To Date:</label>
            <input
              type="date"
              name="endDate"
              value={dateRange.endDate}
              onChange={handleDateChange}
              max={today}
            />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions-grid">
        <div 
          className="action-card"
          onClick={() => navigate('/attendance/mark')}
        >
          <div className="action-icon">✍️</div>
          <h3>Mark Attendance</h3>
          <p>Mark daily attendance for classes</p>
        </div>

        <div 
          className="action-card"
          onClick={() => navigate('/attendance/reports')}
        >
          <div className="action-icon">📈</div>
          <h3>View Reports</h3>
          <p>Monthly and student-wise reports</p>
        </div>

        <div 
          className="action-card"
          onClick={() => navigate('/attendance/students')}
        >
          <div className="action-icon">👥</div>
          <h3>Student Attendance</h3>
          <p>View individual student records</p>
        </div>

        <div 
          className="action-card"
          onClick={() => navigate('/students')}
        >
          <div className="action-icon">⚙️</div>
          <h3>Settings</h3>
          <p>Configure attendance settings</p>
        </div>
      </div>

      {/* Statistics */}
      {loading && <div className="loading">Loading statistics...</div>}

      {!loading && stats && (
        <div className="stats-section">
          <h2>Overall Statistics</h2>
          <div className="stats-grid-large">
            <div className="stat-card-large total">
              <h3>Total Records</h3>
              <div className="stat-number">{stats.total}</div>
            </div>

            <div className="stat-card-large present">
              <h3>Present</h3>
              <div className="stat-number">{stats.present}</div>
              <div className="stat-percent">
                {stats.total > 0 ? ((stats.present / stats.total) * 100).toFixed(1) : 0}%
              </div>
            </div>

            <div className="stat-card-large absent">
              <h3>Absent</h3>
              <div className="stat-number">{stats.absent}</div>
              <div className="stat-percent">
                {stats.total > 0 ? ((stats.absent / stats.total) * 100).toFixed(1) : 0}%
              </div>
            </div>

            <div className="stat-card-large late">
              <h3>Late</h3>
              <div className="stat-number">{stats.late}</div>
            </div>

            <div className="stat-card-large half-day">
              <h3>Half Day</h3>
              <div className="stat-number">{stats.halfDay}</div>
            </div>

            <div className="stat-card-large excused">
              <h3>Excused</h3>
              <div className="stat-number">{stats.excused}</div>
            </div>
          </div>

          <div className="attendance-percentage">
            <h3>Attendance Percentage</h3>
            <div className="percentage-bar">
              <div 
                className="percentage-fill"
                style={{ width: `${stats.percentage}%` }}
              >
                <span>{stats.percentage}%</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    </Layout>
  );
};

export default AttendanceDashboard;