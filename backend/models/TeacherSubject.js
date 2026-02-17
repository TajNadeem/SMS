const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TeacherSubject = sequelize.define('TeacherSubject', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  teacherId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'teachers',
      key: 'id'
    }
  },
  subjectId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'subjects',
      key: 'id'
    }
  },
  class: {
    type: DataTypes.STRING(20),
    allowNull: true,
    comment: 'Which class this teacher teaches this subject to'
  },
  section: {
    type: DataTypes.STRING(10),
    allowNull: true
  }
}, {
  tableName: 'teacher_subjects',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['teacherId', 'subjectId', 'class', 'section']
    }
  ]
});

module.exports = TeacherSubject;