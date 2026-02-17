const sequelize = require('../config/database');
const User = require('./User');
const Student = require('./Student');
const Teacher = require('./Teacher');
const Subject = require('./Subject');
const TeacherSubject = require('./TeacherSubject');
const Attendance = require('./Attendance');
const LeaveRequest = require('./LeaveRequest');
const FeeStructure = require('./FeeStructure');
const FeeInvoice = require('./FeeInvoice');
const Payment = require('./Payment');

// User relationships
Student.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasOne(Student, { foreignKey: 'userId', as: 'studentProfile' });

Teacher.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasOne(Teacher, { foreignKey: 'userId', as: 'teacherProfile' });

// Teacher-Subject many-to-many relationship
Teacher.belongsToMany(Subject, { 
  through: TeacherSubject, 
  foreignKey: 'teacherId',
  as: 'subjects'
});

Subject.belongsToMany(Teacher, { 
  through: TeacherSubject, 
  foreignKey: 'subjectId',
  as: 'teachers'
});

Teacher.hasMany(TeacherSubject, { foreignKey: 'teacherId', as: 'teacherSubjects' });
TeacherSubject.belongsTo(Teacher, { foreignKey: 'teacherId' });

Subject.hasMany(TeacherSubject, { foreignKey: 'subjectId', as: 'subjectTeachers' });
TeacherSubject.belongsTo(Subject, { foreignKey: 'subjectId' });

// Attendance relationships
Attendance.belongsTo(Student, { foreignKey: 'studentId', as: 'student' });
Student.hasMany(Attendance, { foreignKey: 'studentId', as: 'attendanceRecords' });

Attendance.belongsTo(Teacher, { foreignKey: 'markedBy', as: 'teacher' });
Teacher.hasMany(Attendance, { foreignKey: 'markedBy', as: 'markedAttendances' });

// Leave Request relationships
LeaveRequest.belongsTo(Student, { foreignKey: 'studentId', as: 'student' });
Student.hasMany(LeaveRequest, { foreignKey: 'studentId', as: 'leaveRequests' });

LeaveRequest.belongsTo(Teacher, { foreignKey: 'approvedBy', as: 'approver' });
Teacher.hasMany(LeaveRequest, { foreignKey: 'approvedBy', as: 'approvedLeaves' });

// Fee relationships
FeeInvoice.belongsTo(Student, { foreignKey: 'studentId', as: 'student' });
Student.hasMany(FeeInvoice, { foreignKey: 'studentId', as: 'invoices' });

Payment.belongsTo(FeeInvoice, { foreignKey: 'invoiceId', as: 'invoice' });
FeeInvoice.hasMany(Payment, { foreignKey: 'invoiceId', as: 'payments' });

Payment.belongsTo(Student, { foreignKey: 'studentId', as: 'student' });
Student.hasMany(Payment, { foreignKey: 'studentId', as: 'payments' });

Payment.belongsTo(User, { foreignKey: 'collectedBy', as: 'collector' });
User.hasMany(Payment, { foreignKey: 'collectedBy', as: 'collectedPayments' });

const db = {
  sequelize,
  User,
  Student,
  Teacher,
  Subject,
  TeacherSubject,
  Attendance,
  LeaveRequest,
  FeeStructure,
  FeeInvoice,
  Payment
};

// Sync database (creates tables)
const syncDatabase = async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log('✅ Database tables synchronized');
  } catch (error) {
    console.error('❌ Database sync error:', error.message);
  }
};

module.exports = { db, syncDatabase };