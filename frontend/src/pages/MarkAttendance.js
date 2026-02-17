import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { attendanceAPI } from '../services/attendanceAPI';
import './MarkAttendance.css';
import Layout from '../components/Layout';

const MarkAttendance = () => {
  const navigate = useNavigate();
  const today = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    date: today,
    class: 'Grade 1',
    section: 'A'
  });

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (formData.class) {
      fetchAttendance();
    }
  }, [formData.date, formData.class, formData.section]);

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await attendanceAPI.getAttendanceByClass({
        date: formData.date,
        class: formData.class,
        section: formData.section
      });

      if (response.data.success) {
        // Map the data to include status
        const studentsData = response.data.data.map(item => ({
          ...item.student,
          attendanceId: item.attendance?.id || null,
          status: item.attendance?.status || 'present',
          remarks: item.attendance?.remarks || ''
        }));
        setStudents(studentsData);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch attendance');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleStatusChange = (studentId, status) => {
    setStudents(students.map(student => 
      student.id === studentId ? { ...student, status } : student
    ));
  };

  const handleRemarksChange = (studentId, remarks) => {
    setStudents(students.map(student => 
      student.id === studentId ? { ...student, remarks } : student
    ));
  };

  const handleMarkAll = (status) => {
    setStudents(students.map(student => ({ ...student, status })));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccessMessage('');

    try {
      const attendanceData = students.map(student => ({
        studentId: student.id,
        status: student.status,
        remarks: student.remarks
      }));

      const response = await attendanceAPI.bulkMarkAttendance({
        date: formData.date,
        class: formData.class,
        section: formData.section,
        attendanceData
      });

      if (response.data.success) {
        setSuccessMessage(`Attendance marked successfully for ${response.data.marked} students!`);
        setTimeout(() => {
          setSuccessMessage('');
        }, 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to mark attendance');
    } finally {
      setSaving(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      present: '#10b981',
      absent: '#ef4444',
      late: '#f59e0b',
      half_day: '#3b82f6',
      excused: '#8b5cf6'
    };
    return colors[status] || '#6b7280';
  };

  const calculateStats = () => {
    const total = students.length;
    const present = students.filter(s => s.status === 'present').length;
    const absent = students.filter(s => s.status === 'absent').length;
    const late = students.filter(s => s.status === 'late').length;
    const halfDay = students.filter(s => s.status === 'half_day').length;
    const excused = students.filter(s => s.status === 'excused').length;

    return { total, present, absent, late, halfDay, excused };
  };

  const stats = calculateStats();

  return (
    <Layout>
    <div className="mark-attendance-container">
      <div className="page-header">
        <h1>📋 Mark Attendance</h1>
        <button className="btn-back" onClick={() => navigate('/attendance')}>
          ← Back
        </button>
      </div>

      {successMessage && (
        <div className="success-message">{successMessage}</div>
      )}

      {error && <div className="error-message">{error}</div>}

      <div className="attendance-form-card">
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Date *</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                max={today}
              />
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
          </div>

          {/* Quick Actions */}
          <div className="quick-actions">
            <label>Mark All As:</label>
            <button
              type="button"
              className="btn-quick present"
              onClick={() => handleMarkAll('present')}
            >
              All Present
            </button>
            <button
              type="button"
              className="btn-quick absent"
              onClick={() => handleMarkAll('absent')}
            >
              All Absent
            </button>
          </div>

          {/* Statistics */}
          {students.length > 0 && (
            <div className="attendance-stats">
              <div className="stat-item">
                <span className="stat-label">Total:</span>
                <span className="stat-value">{stats.total}</span>
              </div>
              <div className="stat-item present">
                <span className="stat-label">Present:</span>
                <span className="stat-value">{stats.present}</span>
              </div>
              <div className="stat-item absent">
                <span className="stat-label">Absent:</span>
                <span className="stat-value">{stats.absent}</span>
              </div>
              <div className="stat-item late">
                <span className="stat-label">Late:</span>
                <span className="stat-value">{stats.late}</span>
              </div>
              <div className="stat-item half-day">
                <span className="stat-label">Half Day:</span>
                <span className="stat-value">{stats.halfDay}</span>
              </div>
              <div className="stat-item excused">
                <span className="stat-label">Excused:</span>
                <span className="stat-value">{stats.excused}</span>
              </div>
            </div>
          )}

          {/* Loading */}
          {loading && <div className="loading">Loading students...</div>}

          {/* Students List */}
          {!loading && students.length === 0 && (
            <div className="no-data">No students found in this class</div>
          )}

          {!loading && students.length > 0 && (
            <div className="students-attendance-list">
              <table className="attendance-table">
                <thead>
                  <tr>
                    <th>Roll No</th>
                    <th>Admission No</th>
                    <th>Student Name</th>
                    <th>Status</th>
                    <th>Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr key={student.id}>
                      <td>{student.rollNumber || '-'}</td>
                      <td>{student.admissionNo}</td>
                      <td className="student-name">
                        {student.firstName} {student.lastName}
                      </td>
                      <td>
                        <div className="status-buttons">
                          <button
                            type="button"
                            className={`status-btn ${student.status === 'present' ? 'active' : ''}`}
                            style={{ backgroundColor: student.status === 'present' ? getStatusColor('present') : '#e5e7eb' }}
                            onClick={() => handleStatusChange(student.id, 'present')}
                          >
                            P
                          </button>
                          <button
                            type="button"
                            className={`status-btn ${student.status === 'absent' ? 'active' : ''}`}
                            style={{ backgroundColor: student.status === 'absent' ? getStatusColor('absent') : '#e5e7eb' }}
                            onClick={() => handleStatusChange(student.id, 'absent')}
                          >
                            A
                          </button>
                          <button
                            type="button"
                            className={`status-btn ${student.status === 'late' ? 'active' : ''}`}
                            style={{ backgroundColor: student.status === 'late' ? getStatusColor('late') : '#e5e7eb' }}
                            onClick={() => handleStatusChange(student.id, 'late')}
                          >
                            L
                          </button>
                          <button
                            type="button"
                            className={`status-btn ${student.status === 'half_day' ? 'active' : ''}`}
                            style={{ backgroundColor: student.status === 'half_day' ? getStatusColor('half_day') : '#e5e7eb' }}
                            onClick={() => handleStatusChange(student.id, 'half_day')}
                          >
                            H
                          </button>
                          <button
                            type="button"
                            className={`status-btn ${student.status === 'excused' ? 'active' : ''}`}
                            style={{ backgroundColor: student.status === 'excused' ? getStatusColor('excused') : '#e5e7eb' }}
                            onClick={() => handleStatusChange(student.id, 'excused')}
                          >
                            E
                          </button>
                        </div>
                      </td>
                      <td>
                        <input
                          type="text"
                          className="remarks-input"
                          value={student.remarks}
                          onChange={(e) => handleRemarksChange(student.id, e.target.value)}
                          placeholder="Optional remarks"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Submit Button */}
          {students.length > 0 && (
            <div className="form-actions">
              <button type="submit" className="btn-primary" disabled={saving}>
                {saving ? 'Saving...' : 'Save Attendance'}
              </button>
            </div>
          )}
        </form>
      </div>

      {/* Legend */}
      <div className="legend-card">
        <h4>Status Legend:</h4>
        <div className="legend-items">
          <div className="legend-item">
            <span className="legend-badge" style={{ backgroundColor: getStatusColor('present') }}>P</span>
            <span>Present</span>
          </div>
          <div className="legend-item">
            <span className="legend-badge" style={{ backgroundColor: getStatusColor('absent') }}>A</span>
            <span>Absent</span>
          </div>
          <div className="legend-item">
            <span className="legend-badge" style={{ backgroundColor: getStatusColor('late') }}>L</span>
            <span>Late</span>
          </div>
          <div className="legend-item">
            <span className="legend-badge" style={{ backgroundColor: getStatusColor('half_day') }}>H</span>
            <span>Half Day</span>
          </div>
          <div className="legend-item">
            <span className="legend-badge" style={{ backgroundColor: getStatusColor('excused') }}>E</span>
            <span>Excused</span>
          </div>
        </div>
      </div>
    </div>
    </Layout>
  );
};

export default MarkAttendance;