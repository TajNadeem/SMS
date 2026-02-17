const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Student = require('./Student');

const LeaveRequest = sequelize.define('LeaveRequest', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  studentId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'students',
      key: 'id'
    }
  },
  startDate: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  endDate: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  reason: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  leaveType: {
    type: DataTypes.ENUM('sick', 'personal', 'family', 'other'),
    defaultValue: 'personal'
  },
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected'),
    defaultValue: 'pending'
  },
  approvedBy: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'teachers',
      key: 'id'
    }
  },
  approvalRemarks: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'leave_requests',
  timestamps: true
});

module.exports = LeaveRequest;