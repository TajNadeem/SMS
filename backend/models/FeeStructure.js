const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const FeeStructure = sequelize.define('FeeStructure', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  class: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  academicYear: {
    type: DataTypes.STRING(20),
    allowNull: false,
    comment: 'e.g., 2024-2025'
  },
  feeType: {
    type: DataTypes.STRING(50),
    allowNull: false,
    comment: 'e.g., Tuition, Admission, Exam, Transport'
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  frequency: {
    type: DataTypes.ENUM('monthly', 'quarterly', 'half_yearly', 'yearly', 'one_time'),
    defaultValue: 'monthly'
  },
  dueDate: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    comment: 'Due date for the fee'
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive'),
    defaultValue: 'active'
  }
}, {
  tableName: 'fee_structures',
  timestamps: true
});

module.exports = FeeStructure;