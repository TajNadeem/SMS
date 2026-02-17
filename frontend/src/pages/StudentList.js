import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { studentAPI } from '../services/studentAPI';
import './StudentList.css';
import Layout from '../components/Layout';

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [classFilter, setClassFilter] = useState('');
  const [stats, setStats] = useState(null);

  const navigate = useNavigate();

  // Fetch students
  const fetchStudents = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      if (classFilter) params.class = classFilter;

      const response = await studentAPI.getAllStudents(params);
      if (response.data.success) {
        setStudents(response.data.students);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch students');
    } finally {
      setLoading(false);
    }
  };

  // Fetch statistics
  const fetchStats = async () => {
    try {
      const response = await studentAPI.getStats();
      if (response.data.success) {
        setStats(response.data.stats);
      }
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  };

  useEffect(() => {
    fetchStudents();
    fetchStats();
  }, [search, classFilter]);

  // Delete student
  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      try {
        const response = await studentAPI.deleteStudent(id);
        if (response.data.success) {
          alert('Student deleted successfully');
          fetchStudents();
          fetchStats();
        }
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete student');
      }
    }
  };

  return (
    <Layout>
    <div className="student-list-container">
      <div className="page-header">
        <h1>👨‍🎓 Student Management</h1>
        <button 
          className="btn-primary"
          onClick={() => navigate('/students/add')}
        >
          + Add New Student
        </button>
      </div>

      {/* Statistics Cards */}
      {stats && (
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Students</h3>
            <p className="stat-number">{stats.total}</p>
          </div>
          <div className="stat-card">
            <h3>Active</h3>
            <p className="stat-number green">{stats.active}</p>
          </div>
          <div className="stat-card">
            <h3>Inactive</h3>
            <p className="stat-number red">{stats.inactive}</p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="filters-container">
        <input
          type="text"
          placeholder="🔍 Search by name, admission no, email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
        
        <select
          value={classFilter}
          onChange={(e) => setClassFilter(e.target.value)}
          className="filter-select"
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

      {/* Error Message */}
      {error && <div className="error-message">{error}</div>}

      {/* Loading */}
      {loading && <div className="loading">Loading students...</div>}

      {/* Students Table */}
      {!loading && students.length === 0 && (
        <div className="no-data">
          <p>No students found. Add your first student!</p>
        </div>
      )}

      {!loading && students.length > 0 && (
        <div className="table-container">
          <table className="students-table">
            <thead>
              <tr>
                <th>Admission No</th>
                <th>Name</th>
                <th>Class</th>
                <th>Section</th>
                <th>Contact</th>
                <th>Parent Phone</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id}>
                  <td>{student.admissionNo}</td>
                  <td className="student-name">
                    {student.firstName} {student.lastName}
                  </td>
                  <td>{student.class}</td>
                  <td>{student.section || '-'}</td>
                  <td>
                    {student.phoneNumber || '-'}
                    {student.email && <><br/><small>{student.email}</small></>}
                  </td>
                  <td>{student.parentPhone || '-'}</td>
                  <td>
                    <span className={`status-badge status-${student.status}`}>
                      {student.status}
                    </span>
                  </td>
                  <td className="actions-cell">
                    <button
                      className="btn-edit"
                      onClick={() => navigate(`/students/edit/${student.id}`)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(student.id, `${student.firstName} ${student.lastName}`)}
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

export default StudentList;