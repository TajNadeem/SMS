const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Student = require('./Student');
const Teacher = require('./Teacher');

const Attendance = sequelize.define('Attendance', {
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
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('present', 'absent', 'late', 'half_day', 'excused'),
    allowNull: false,
    defaultValue: 'present'
  },
  class: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  section: {
    type: DataTypes.STRING(10),
    allowNull: true
  },
  markedBy: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'teachers',
      key: 'id'
    },
    comment: 'Teacher who marked the attendance'
  },
  remarks: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  timeIn: {
    type: DataTypes.TIME,
    allowNull: true
  },
  timeOut: {
    type: DataTypes.TIME,
    allowNull: true
  }
}, {
  tableName: 'attendance',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['studentId', 'date']
    },
    {
      fields: ['date']
    },
    {
      fields: ['class', 'section', 'date']
    }
  ]
});

module.exports = Attendance;