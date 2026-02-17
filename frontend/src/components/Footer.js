import React from 'react';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-brand">
            <span className="brand-icon">🎓</span>
            <span className="brand-name">Nadeem Learning Center</span>
          </div>
          
          <div className="footer-links">
            <a 
              href="https://www.nadeemlearningcenter.org" 
              target="_blank" 
              rel="noopener noreferrer"
              className="footer-link"
            >
              🌐 Visit Our Website
            </a>
          </div>

          <div className="footer-info">
            <p>© {currentYear} Nadeem Learning Center. All rights reserved.</p>
            <p className="online-status">
              <span className="status-dot"></span>
              Online School Management System
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;