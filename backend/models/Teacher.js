const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Teacher = sequelize.define('Teacher', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  employeeId: {
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
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  emergencyContact: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  emergencyContactName: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  qualification: {
    type: DataTypes.STRING(200),
    allowNull: true
  },
  experience: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Years of experience'
  },
  specialization: {
    type: DataTypes.STRING(200),
    allowNull: true
  },
  joiningDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  salary: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  accountNumber: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  bankName: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  ifscCode: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  designation: {
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: 'e.g., Principal, Vice Principal, Senior Teacher, Junior Teacher'
  },
  department: {
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: 'e.g., Science, Mathematics, Languages'
  },
  isClassTeacher: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  assignedClass: {
    type: DataTypes.STRING(20),
    allowNull: true,
    comment: 'Class if teacher is class teacher'
  },
  assignedSection: {
    type: DataTypes.STRING(10),
    allowNull: true,
    comment: 'Section if teacher is class teacher'
  },
  status: {
    type: DataTypes.ENUM('active', 'on_leave', 'inactive', 'resigned'),
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
  tableName: 'teachers',
  timestamps: true
});

module.exports = Teacher;