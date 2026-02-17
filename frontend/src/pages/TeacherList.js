import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { teacherAPI } from '../services/teacherAPI';
import './TeacherList.css';
import Layout from '../components/Layout';

const TeacherList = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [stats, setStats] = useState(null);

  const navigate = useNavigate();

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;
      if (departmentFilter) params.department = departmentFilter;

      const response = await teacherAPI.getAllTeachers(params);
      if (response.data.success) {
        setTeachers(response.data.teachers);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch teachers');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await teacherAPI.getStats();
      if (response.data.success) {
        setStats(response.data.stats);
      }
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  };

  useEffect(() => {
    fetchTeachers();
    fetchStats();
  }, [search, statusFilter, departmentFilter]);

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      try {
        const response = await teacherAPI.deleteTeacher(id);
        if (response.data.success) {
          alert('Teacher deleted successfully');
          fetchTeachers();
          fetchStats();
        }
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete teacher');
      }
    }
  };

  return (
    <Layout>
    <div className="teacher-list-container">
      <div className="page-header">
        <h1>👨‍🏫 Teacher Management</h1>
        <div className="header-buttons">
          <button 
            className="btn-secondary"
            onClick={() => navigate('/subjects')}
          >
            Manage Subjects
          </button>
          <button 
            className="btn-primary"
            onClick={() => navigate('/teachers/add')}
          >
            + Add New Teacher
          </button>
        </div>
      </div>

      {stats && (
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Teachers</h3>
            <p className="stat-number">{stats.total}</p>
          </div>
          <div className="stat-card">
            <h3>Active</h3>
            <p className="stat-number green">{stats.active}</p>
          </div>
          <div className="stat-card">
            <h3>On Leave</h3>
            <p className="stat-number orange">{stats.onLeave}</p>
          </div>
          <div className="stat-card">
            <h3>Class Teachers</h3>
            <p className="stat-number blue">{stats.classTeachers}</p>
          </div>
        </div>
      )}

      <div className="filters-container">
        <input
          type="text"
          placeholder="🔍 Search by name, employee ID, email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
        
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="filter-select"
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="on_leave">On Leave</option>
          <option value="inactive">Inactive</option>
          <option value="resigned">Resigned</option>
        </select>

        <select
          value={departmentFilter}
          onChange={(e) => setDepartmentFilter(e.target.value)}
          className="filter-select"
        >
          <option value="">All Departments</option>
          <option value="Science">Science</option>
          <option value="Mathematics">Mathematics</option>
          <option value="Languages">Languages</option>
          <option value="Social Studies">Social Studies</option>
          <option value="Arts">Arts</option>
          <option value="Physical Education">Physical Education</option>
        </select>
      </div>

      {error && <div className="error-message">{error}</div>}
      {loading && <div className="loading">Loading teachers...</div>}

      {!loading && teachers.length === 0 && (
        <div className="no-data">
          <p>No teachers found. Add your first teacher!</p>
        </div>
      )}

      {!loading && teachers.length > 0 && (
        <div className="table-container">
          <table className="teachers-table">
            <thead>
              <tr>
                <th>Employee ID</th>
                <th>Name</th>
                <th>Department</th>
                <th>Designation</th>
                <th>Contact</th>
                <th>Subjects</th>
                <th>Class Teacher</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {teachers.map((teacher) => (
                <tr key={teacher.id}>
                  <td>{teacher.employeeId}</td>
                  <td className="teacher-name">
                    {teacher.firstName} {teacher.lastName}
                  </td>
                  <td>{teacher.department || '-'}</td>
                  <td>{teacher.designation || '-'}</td>
                  <td>
                    {teacher.phoneNumber}
                    <br/><small>{teacher.email}</small>
                  </td>
                  <td>
                    {teacher.subjects && teacher.subjects.length > 0 ? (
                      <div className="subjects-list">
                        {teacher.subjects.map((subject, idx) => (
                          <span key={idx} className="subject-badge">
                            {subject.subjectName}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-muted">No subjects</span>
                    )}
                  </td>
                  <td>
                    {teacher.isClassTeacher ? (
                      <span className="class-badge">
                        {teacher.assignedClass} {teacher.assignedSection}
                      </span>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td>
                    <span className={`status-badge status-${teacher.status}`}>
                      {teacher.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="actions-cell">
                    <button
                      className="btn-view"
                      onClick={() => navigate(`/teachers/view/${teacher.id}`)}
                    >
                      View
                    </button>
                    <button
                      className="btn-edit"
                      onClick={() => navigate(`/teachers/edit/${teacher.id}`)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(teacher.id, `${teacher.firstName} ${teacher.lastName}`)}
                    >
                      Delete
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

export default TeacherList;