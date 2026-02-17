import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Layout from '../components/Layout';
import ImageSlider from '../components/ImageSlider';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="dashboard-container">
        <div className="dashboard-content">
          {/* Welcome Section with Slider */}
          <div className="welcome-section">
            <div className="welcome-slider">
              <ImageSlider />
            </div>
            
            <div className="welcome-info">
  <div className="welcome-header">
    <h2>Welcome back, {user?.firstName || user?.username}! 👋</h2>
    <div className="user-meta">
      <span className="meta-item">
        <span className="meta-icon">👤</span>
        {user?.role?.toUpperCase()}
      </span>
      <span className="meta-divider">•</span>
      <span className="meta-item">
        <span className="meta-icon">📧</span>
        {user?.email}
      </span>
      <span className="meta-divider">•</span>
      <span className="meta-item">
        <span className="meta-icon">🔑</span>
        {user?.username}
      </span>
    </div>
  </div>

  {/* Future content area */}
  <div className="info-content">
    <div className="quick-stats">
      <h3>Quick Overview</h3>
      <p className="placeholder-text">
        📊 Your personalized statistics and updates will appear here
      </p>
      {/* You can add more widgets here in the future like:
          - Today's attendance summary
          - Pending fee notifications
          - Recent announcements
          - Calendar events
      */}
    </div>
  </div>
</div>


          </div>

          {/* Dashboard Cards */}

          <div className="modules-section">
  <h2 className="section-title">Quick Access Modules</h2>
  
  <div className="modules-grid">
    <div className="module-card students" onClick={() => navigate('/students')}>
      <div className="module-icon-wrapper">
        <div className="module-icon">📚</div>
        <div className="icon-glow"></div>
      </div>
      <div className="module-content">
        <h3>Students</h3>
        <p>Manage student records, admissions, and profiles</p>
        <div className="module-stats">
          <span className="stat-badge">Active Module</span>
        </div>
      </div>
      <div className="module-arrow">→</div>
    </div>

    <div className="module-card teachers" onClick={() => navigate('/teachers')}>
      <div className="module-icon-wrapper">
        <div className="module-icon">👨‍🏫</div>
        <div className="icon-glow"></div>
      </div>
      <div className="module-content">
        <h3>Teachers</h3>
        <p>Manage faculty, subjects, and assignments</p>
        <div className="module-stats">
          <span className="stat-badge">Active Module</span>
        </div>
      </div>
      <div className="module-arrow">→</div>
    </div>

    <div className="module-card attendance" onClick={() => navigate('/attendance')}>
      <div className="module-icon-wrapper">
        <div className="module-icon">📊</div>
        <div className="icon-glow"></div>
      </div>
      <div className="module-content">
        <h3>Attendance</h3>
        <p>Track daily attendance and generate reports</p>
        <div className="module-stats">
          <span className="stat-badge">Active Module</span>
        </div>
      </div>
      <div className="module-arrow">→</div>
    </div>

    <div className="module-card fees" onClick={() => navigate('/fees')}>
      <div className="module-icon-wrapper">
        <div className="module-icon">💰</div>
        <div className="icon-glow"></div>
      </div>
      <div className="module-content">
        <h3>Fees</h3>
        <p>Manage fee collection, invoices, and payments</p>
        <div className="module-stats">
          <span className="stat-badge">Active Module</span>
        </div>
      </div>
      <div className="module-arrow">→</div>
    </div>
  </div>
</div>

        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;