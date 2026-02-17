const Attendance = require('../models/Attendance');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const { Op } = require('sequelize');

// Mark attendance for a single student
exports.markAttendance = async (req, res) => {
  try {
    const { studentId, date, status, class: className, section, remarks, timeIn, timeOut } = req.body;

    // Check if attendance already exists
    const existingAttendance = await Attendance.findOne({
      where: { studentId, date }
    });

    if (existingAttendance) {
      // Update existing attendance
      await existingAttendance.update({
        status,
        class: className,
        section,
        markedBy: req.user.teacherProfile?.id || null,
        remarks,
        timeIn,
        timeOut
      });

      return res.json({
        success: true,
        message: 'Attendance updated successfully',
        attendance: existingAttendance
      });
    }

    // Create new attendance
    const attendance = await Attendance.create({
      studentId,
      date,
      status,
      class: className,
      section,
      markedBy: req.user.teacherProfile?.id || null,
      remarks,
      timeIn,
      timeOut
    });

    res.status(201).json({
      success: true,
      message: 'Attendance marked successfully',
      attendance
    });

  } catch (error) {
    console.error('Mark attendance error:', error);
    res.status(500).json({
      success: false,
      message: 'Error marking attendance',
      error: error.message
    });
  }
};

// Bulk mark attendance for a class
exports.bulkMarkAttendance = async (req, res) => {
  try {
    const { date, class: className, section, attendanceData } = req.body;
    // attendanceData format: [{ studentId, status, remarks }]

    const results = [];
    const errors = [];

    for (const record of attendanceData) {
      try {
        const existingAttendance = await Attendance.findOne({
          where: { studentId: record.studentId, date }
        });

        if (existingAttendance) {
          await existingAttendance.update({
            status: record.status,
            class: className,
            section,
            markedBy: req.user.teacherProfile?.id || null,
            remarks: record.remarks || null
          });
          results.push(existingAttendance);
        } else {
          const attendance = await Attendance.create({
            studentId: record.studentId,
            date,
            status: record.status,
            class: className,
            section,
            markedBy: req.user.teacherProfile?.id || null,
            remarks: record.remarks || null
          });
          results.push(attendance);
        }
      } catch (err) {
        errors.push({
          studentId: record.studentId,
          error: err.message
        });
      }
    }

    res.json({
      success: true,
      message: `Attendance marked for ${results.length} students`,
      marked: results.length,
      errors: errors.length,
      errorDetails: errors
    });

  } catch (error) {
    console.error('Bulk mark attendance error:', error);
    res.status(500).json({
      success: false,
      message: 'Error marking bulk attendance',
      error: error.message
    });
  }
};

// Get attendance by date and class
exports.getAttendanceByClass = async (req, res) => {
  try {
    const { date, class: className, section } = req.query;

    if (!date || !className) {
      return res.status(400).json({
        success: false,
        message: 'Date and class are required'
      });
    }

    const where = {
      date,
      class: className
    };

    if (section) {
      where.section = section;
    }

    const attendance = await Attendance.findAll({
      where,
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['id', 'admissionNo', 'firstName', 'lastName', 'rollNumber']
        },
        {
          model: Teacher,
          as: 'teacher',
          attributes: ['id', 'firstName', 'lastName']
        }
      ],
      order: [['student', 'rollNumber', 'ASC']]
    });

    // Get all students in the class
    const studentWhere = { class: className, status: 'active' };
    if (section) studentWhere.section = section;

    const allStudents = await Student.findAll({
      where: studentWhere,
      attributes: ['id', 'admissionNo', 'firstName', 'lastName', 'rollNumber'],
      order: [['rollNumber', 'ASC']]
    });

    // Combine with attendance data
    const attendanceMap = new Map(attendance.map(a => [a.studentId, a]));
    
    const result = allStudents.map(student => {
      const attendanceRecord = attendanceMap.get(student.id);
      return {
        student,
        attendance: attendanceRecord || null,
        status: attendanceRecord?.status || 'not_marked'
      };
    });

    res.json({
      success: true,
      data: result,
      total: allStudents.length,
      marked: attendance.length,
      unmarked: allStudents.length - attendance.length
    });

  } catch (error) {
    console.error('Get attendance error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching attendance',
      error: error.message
    });
  }
};

// Get attendance for a specific student
exports.getStudentAttendance = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { startDate, endDate, month, year } = req.query;

    const where = { studentId };

    if (startDate && endDate) {
      where.date = {
        [Op.between]: [startDate, endDate]
      };
    } else if (month && year) {
      const monthStart = `${year}-${String(month).padStart(2, '0')}-01`;
      const monthEnd = new Date(year, month, 0).toISOString().split('T')[0];
      where.date = {
        [Op.between]: [monthStart, monthEnd]
      };
    }

    const attendance = await Attendance.findAll({
      where,
      include: [
        {
          model: Teacher,
          as: 'teacher',
          attributes: ['id', 'firstName', 'lastName']
        }
      ],
      order: [['date', 'DESC']]
    });

    // Calculate statistics
    const stats = {
      total: attendance.length,
      present: attendance.filter(a => a.status === 'present').length,
      absent: attendance.filter(a => a.status === 'absent').length,
      late: attendance.filter(a => a.status === 'late').length,
      halfDay: attendance.filter(a => a.status === 'half_day').length,
      excused: attendance.filter(a => a.status === 'excused').length
    };

    stats.percentage = stats.total > 0 
      ? ((stats.present + stats.halfDay * 0.5) / stats.total * 100).toFixed(2)
      : 0;

    res.json({
      success: true,
      attendance,
      stats
    });

  } catch (error) {
    console.error('Get student attendance error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching student attendance',
      error: error.message
    });
  }
};

// Get attendance statistics
exports.getAttendanceStats = async (req, res) => {
  try {
    const { date, class: className, section, startDate, endDate } = req.query;

    const where = {};
    
    if (date) {
      where.date = date;
    } else if (startDate && endDate) {
      where.date = {
        [Op.between]: [startDate, endDate]
      };
    }

    if (className) {
      where.class = className;
    }

    if (section) {
      where.section = section;
    }

    const totalRecords = await Attendance.count({ where });
    const presentCount = await Attendance.count({ where: { ...where, status: 'present' } });
    const absentCount = await Attendance.count({ where: { ...where, status: 'absent' } });
    const lateCount = await Attendance.count({ where: { ...where, status: 'late' } });
    const halfDayCount = await Attendance.count({ where: { ...where, status: 'half_day' } });
    const excusedCount = await Attendance.count({ where: { ...where, status: 'excused' } });

    // Get class-wise breakdown
    const classwiseStats = await Attendance.findAll({
      attributes: [
        'class',
        'section',
        [Attendance.sequelize.fn('COUNT', Attendance.sequelize.col('id')), 'total'],
        [Attendance.sequelize.fn('SUM', 
          Attendance.sequelize.literal(`CASE WHEN status = 'present' THEN 1 ELSE 0 END`)
        ), 'present'],
        [Attendance.sequelize.fn('SUM', 
          Attendance.sequelize.literal(`CASE WHEN status = 'absent' THEN 1 ELSE 0 END`)
        ), 'absent']
      ],
      where,
      group: ['class', 'section'],
      raw: true
    });

    res.json({
      success: true,
      stats: {
        total: totalRecords,
        present: presentCount,
        absent: absentCount,
        late: lateCount,
        halfDay: halfDayCount,
        excused: excusedCount,
        percentage: totalRecords > 0 
          ? ((presentCount + halfDayCount * 0.5) / totalRecords * 100).toFixed(2)
          : 0
      },
      classwiseStats
    });

  } catch (error) {
    console.error('Get attendance stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching attendance statistics',
      error: error.message
    });
  }
};

// Get monthly attendance report
exports.getMonthlyReport = async (req, res) => {
  try {
    const { month, year, class: className, section } = req.query;

    if (!month || !year) {
      return res.status(400).json({
        success: false,
        message: 'Month and year are required'
      });
    }

    const monthStart = `${year}-${String(month).padStart(2, '0')}-01`;
    const daysInMonth = new Date(year, month, 0).getDate();
    const monthEnd = `${year}-${String(month).padStart(2, '0')}-${daysInMonth}`;

    const where = {
      date: {
        [Op.between]: [monthStart, monthEnd]
      }
    };

    if (className) where.class = className;
    if (section) where.section = section;

    // Get all students in class
    const studentWhere = { status: 'active' };
    if (className) studentWhere.class = className;
    if (section) studentWhere.section = section;

    const students = await Student.findAll({
      where: studentWhere,
      attributes: ['id', 'admissionNo', 'firstName', 'lastName', 'class', 'section', 'rollNumber'],
      order: [['rollNumber', 'ASC']]
    });

    // Get all attendance for the month
    const attendance = await Attendance.findAll({
      where,
      attributes: ['studentId', 'date', 'status'],
      raw: true
    });

    // Group attendance by student
    const attendanceByStudent = {};
    attendance.forEach(record => {
      if (!attendanceByStudent[record.studentId]) {
        attendanceByStudent[record.studentId] = [];
      }
      attendanceByStudent[record.studentId].push(record);
    });

    // Calculate stats for each student
    const report = students.map(student => {
      const studentAttendance = attendanceByStudent[student.id] || [];
      
      const stats = {
        total: studentAttendance.length,
        present: studentAttendance.filter(a => a.status === 'present').length,
        absent: studentAttendance.filter(a => a.status === 'absent').length,
        late: studentAttendance.filter(a => a.status === 'late').length,
        halfDay: studentAttendance.filter(a => a.status === 'half_day').length,
        excused: studentAttendance.filter(a => a.status === 'excused').length
      };

      stats.percentage = stats.total > 0
        ? ((stats.present + stats.halfDay * 0.5) / stats.total * 100).toFixed(2)
        : 0;

      return {
        student: student.toJSON(),
        attendance: studentAttendance,
        stats
      };
    });

    res.json({
      success: true,
      month,
      year,
      daysInMonth,
      report
    });

  } catch (error) {
    console.error('Get monthly report error:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating monthly report',
      error: error.message
    });
  }
};

// Delete attendance record
exports.deleteAttendance = async (req, res) => {
  try {
    const { id } = req.params;

    const attendance = await Attendance.findByPk(id);
    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: 'Attendance record not found'
      });
    }

    await attendance.destroy();

    res.json({
      success: true,
      message: 'Attendance record deleted successfully'
    });

  } catch (error) {
    console.error('Delete attendance error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting attendance',
      error: error.message
    });
  }
};