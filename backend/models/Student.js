const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Student = sequelize.define('Student', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  admissionNo: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  firstName: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  lastName: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  dateOfBirth: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  gender: {
    type: DataTypes.ENUM('male', 'female', 'other'),
    allowNull: false
  },
  bloodGroup: {
    type: DataTypes.ENUM('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'),
    allowNull: true
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  city: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  state: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  pincode: {
    type: DataTypes.STRING(10),
    allowNull: true
  },
  phoneNumber: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: true,
    validate: {
      isEmail: true
    }
  },
  parentName: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  parentPhone: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  parentEmail: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  class: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  section: {
    type: DataTypes.STRING(10),
    allowNull: true
  },
  rollNumber: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  admissionDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive', 'passed_out', 'transferred'),
    defaultValue: 'active'
  },
  photo: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  }
}, {
  tableName: 'students',
  timestamps: true
});

// Relationships
//Student.belongsTo(User, { foreignKey: 'userId', as: 'user' });

module.exports = Student;