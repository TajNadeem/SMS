import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { attendanceAPI } from '../services/attendanceAPI';
import './AttendanceReports.css';
import Layout from '../components/Layout';

const AttendanceReports = () => {
  const navigate = useNavigate();
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();

  const [formData, setFormData] = useState({
    month: currentMonth,
    year: currentYear,
    class: 'Grade 1',
    section: ''
  });

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleGenerateReport = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await attendanceAPI.getMonthlyReport(formData);
      if (response.data.success) {
        setReport(response.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate report');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (percentage) => {
    if (percentage >= 90) return '#10b981';
    if (percentage >= 75) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <Layout>
    <div className="attendance-reports-container">
      <div className="page-header">
        <h1>📈 Monthly Attendance Report</h1>
        <button className="btn-back" onClick={() => navigate('/attendance')}>
          ← Back
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {/* Report Form */}
      <div className="report-form-card">
        <form onSubmit={handleGenerateReport}>
          <div className="form-row">
            <div className="form-group">
              <label>Month *</label>
              <select
                name="month"
                value={formData.month}
                onChange={handleChange}
                required
              >
                <option value="1">January</option>
                <option value="2">February</option>
                <option value="3">March</option>
                <option value="4">April</option>
                <option value="5">May</option>
                <option value="6">June</option>
                <option value="7">July</option>
                <option value="8">August</option>
                <option value="9">September</option>
                <option value="10">October</option>
                <option value="11">November</option>
                <option value="12">December</option>
              </select>
            </div>

            <div className="form-group">
              <label>Year *</label>
              <select
                name="year"
                value={formData.year}
                onChange={handleChange}
                required
              >
                {[...Array(5)].map((_, i) => {
                  const year = currentYear - 2 + i;
                  return <option key={year} value={year}>{year}</option>;
                })}
              </select>
            </div>

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
                <option value="">All</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
              </select>
            </div>

            <div className="form-group">
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Generating...' : 'Generate Report'}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Report Results */}
      {loading && <div className="loading">Generating report...</div>}

      {!loading && report && (
        <div className="report-results">
          <div className="report-header">
            <h2>
              Monthly Report - {formData.class} {formData.section && `Section ${formData.section}`}
            </h2>
            <p>
              {new Date(formData.year, formData.month - 1).toLocaleString('default', { month: 'long', year: 'numeric' })}
              {' '}({report.daysInMonth} days)
            </p>
          </div>

          {report.report.length === 0 ? (
            <div className="no-data">No students found in this class</div>
          ) : (
            <div className="report-table-container">
              <table className="report-table">
                <thead>
                  <tr>
                    <th>Roll No</th>
                    <th>Admission No</th>
                    <th>Student Name</th>
                    <th>Total Days</th>
                    <th>Present</th>
                    <th>Absent</th>
                    <th>Late</th>
                    <th>Half Day</th>
                    <th>Excused</th>
                    <th>Percentage</th>
                  </tr>
                </thead>
                <tbody>
                  {report.report.map((item) => (
                    <tr key={item.student.id}>
                      <td>{item.student.rollNumber || '-'}</td>
                      <td>{item.student.admissionNo}</td>
                      <td className="student-name">
                        {item.student.firstName} {item.student.lastName}
                      </td>
                      <td>{item.stats.total}</td>
                      <td className="status-cell present">{item.stats.present}</td>
                      <td className="status-cell absent">{item.stats.absent}</td>
                      <td className="status-cell late">{item.stats.late}</td>
                      <td className="status-cell half-day">{item.stats.halfDay}</td>
                      <td className="status-cell excused">{item.stats.excused}</td>
                      <td>
                        <span 
                          className="percentage-badge"
                          style={{ backgroundColor: getStatusColor(parseFloat(item.stats.percentage)) }}
                        >
                          {item.stats.percentage}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
    </Layout>
  );
};

export default AttendanceReports;