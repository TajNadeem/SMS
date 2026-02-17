import React, { useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => {
    return location.pathname.startsWith(path) ? 'active' : '';
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand" onClick={() => navigate('/dashboard')}>
          <span className="brand-icon">🎓</span>
          <span className="brand-name">Nadeem Learning Center</span>
        </div>

        <div className="navbar-menu">
          <div 
            className={`nav-item ${isActive('/dashboard')}`}
            onClick={() => navigate('/dashboard')}
          >
            <span className="nav-icon">🏠</span>
            <span className="nav-text">Dashboard</span>
          </div>

          <div 
            className={`nav-item ${isActive('/students')}`}
            onClick={() => navigate('/students')}
          >
            <span className="nav-icon">👨‍🎓</span>
            <span className="nav-text">Students</span>
          </div>

          <div 
            className={`nav-item ${isActive('/teachers')}`}
            onClick={() => navigate('/teachers')}
          >
            <span className="nav-icon">👨‍🏫</span>
            <span className="nav-text">Teachers</span>
          </div>

          <div 
            className={`nav-item ${isActive('/attendance')}`}
            onClick={() => navigate('/attendance')}
          >
            <span className="nav-icon">📊</span>
            <span className="nav-text">Attendance</span>
          </div>

          <div 
            className={`nav-item ${isActive('/fees')}`}
            onClick={() => navigate('/fees')}
          >
            <span className="nav-icon">💰</span>
            <span className="nav-text">Fees</span>
          </div>
        </div>

        <div className="navbar-user">
          <div className="user-info">
            <span className="user-name">{user?.firstName || user?.username}</span>
            <span className="user-role">{user?.role}</span>
          </div>
          <button className="btn-logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;