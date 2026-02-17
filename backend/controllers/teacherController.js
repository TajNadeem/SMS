const Teacher = require('../models/Teacher');
const Subject = require('../models/Subject');
const TeacherSubject = require('../models/TeacherSubject');
const User = require('../models/User');
const { Op } = require('sequelize');

// Get all teachers
exports.getAllTeachers = async (req, res) => {
  try {
    const { search, status, department, page = 1, limit = 10 } = req.query;

    const where = {};
    
    if (search) {
      where[Op.or] = [
        { firstName: { [Op.like]: `%${search}%` } },
        { lastName: { [Op.like]: `%${search}%` } },
        { employeeId: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } }
      ];
    }
    
    if (status) {
      where.status = status;
    }

    if (department) {
      where.department = department;
    }

    const offset = (page - 1) * limit;

    const { count, rows } = await Teacher.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['username', 'email', 'status']
        },
        {
          model: Subject,
          as: 'subjects',
          through: { attributes: ['class', 'section'] }
        }
      ]
    });

    res.json({
      success: true,
      teachers: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit)
      }
    });

  } catch (error) {
    console.error('Get teachers error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching teachers',
      error: error.message
    });
  }
};

// Get single teacher
exports.getTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['username', 'email', 'status']
        },
        {
          model: Subject,
          as: 'subjects',
          through: { attributes: ['class', 'section'] }
        }
      ]
    });

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: 'Teacher not found'
      });
    }

    res.json({
      success: true,
      teacher
    });

  } catch (error) {
    console.error('Get teacher error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching teacher',
      error: error.message
    });
  }
};

// Create teacher
exports.createTeacher = async (req, res) => {
  try {
    const {
      employeeId,
      firstName,
      lastName,
      dateOfBirth,
      gender,
      bloodGroup,
      address,
      city,
      state,
      pincode,
      phoneNumber,
      email,
      emergencyContact,
      emergencyContactName,
      qualification,
      experience,
      specialization,
      joiningDate,
      salary,
      accountNumber,
      bankName,
      ifscCode,
      designation,
      department,
      isClassTeacher,
      assignedClass,
      assignedSection,
      status
    } = req.body;

    // Check if employee ID already exists
    const existingTeacher = await Teacher.findOne({ 
      where: { 
        [Op.or]: [
          { employeeId },
          { email }
        ]
      } 
    });
    
    if (existingTeacher) {
      return res.status(400).json({
        success: false,
        message: 'Employee ID or email already exists'
      });
    }

    // Create teacher
    const teacher = await Teacher.create({
      employeeId,
      firstName,
      lastName,
      dateOfBirth,
      gender,
      bloodGroup,
      address,
      city,
      state,
      pincode,
      phoneNumber,
      email,
      emergencyContact,
      emergencyContactName,
      qualification,
      experience,
      specialization,
      joiningDate,
      salary,
      accountNumber,
      bankName,
      ifscCode,
      designation,
      department,
      isClassTeacher: isClassTeacher || false,
      assignedClass,
      assignedSection,
      status: status || 'active'
    });

    res.status(201).json({
      success: true,
      message: 'Teacher created successfully',
      teacher
    });

  } catch (error) {
    console.error('Create teacher error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating teacher',
      error: error.message
    });
  }
};

// Update teacher
exports.updateTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findByPk(req.params.id);

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: 'Teacher not found'
      });
    }

    // Check if employee ID or email is being changed and already exists
    if (req.body.employeeId && req.body.employeeId !== teacher.employeeId) {
      const existingTeacher = await Teacher.findOne({
        where: { employeeId: req.body.employeeId }
      });
      if (existingTeacher) {
        return res.status(400).json({
          success: false,
          message: 'Employee ID already exists'
        });
      }
    }

    if (req.body.email && req.body.email !== teacher.email) {
      const existingTeacher = await Teacher.findOne({
        where: { email: req.body.email }
      });
      if (existingTeacher) {
        return res.status(400).json({
          success: false,
          message: 'Email already exists'
        });
      }
    }

    await teacher.update(req.body);

    res.json({
      success: true,
      message: 'Teacher updated successfully',
      teacher
    });

  } catch (error) {
    console.error('Update teacher error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating teacher',
      error: error.message
    });
  }
};

// Delete teacher
exports.deleteTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findByPk(req.params.id);

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: 'Teacher not found'
      });
    }

    await teacher.destroy();

    res.json({
      success: true,
      message: 'Teacher deleted successfully'
    });

  } catch (error) {
    console.error('Delete teacher error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting teacher',
      error: error.message
    });
  }
};

// Assign subjects to teacher
exports.assignSubjects = async (req, res) => {
  try {
    const { teacherId } = req.params;
    const { subjects } = req.body; // Array of { subjectId, class, section }

    const teacher = await Teacher.findByPk(teacherId);
    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: 'Teacher not found'
      });
    }

    // Delete existing assignments
    await TeacherSubject.destroy({ where: { teacherId } });

    // Create new assignments
    if (subjects && subjects.length > 0) {
      const assignments = subjects.map(s => ({
        teacherId: parseInt(teacherId),
        subjectId: s.subjectId,
        class: s.class || null,
        section: s.section || null
      }));

      await TeacherSubject.bulkCreate(assignments);
    }

    // Fetch updated teacher with subjects
    const updatedTeacher = await Teacher.findByPk(teacherId, {
      include: [{
        model: Subject,
        as: 'subjects',
        through: { attributes: ['class', 'section'] }
      }]
    });

    res.json({
      success: true,
      message: 'Subjects assigned successfully',
      teacher: updatedTeacher
    });

  } catch (error) {
    console.error('Assign subjects error:', error);
    res.status(500).json({
      success: false,
      message: 'Error assigning subjects',
      error: error.message
    });
  }
};

// Get teacher statistics
exports.getTeacherStats = async (req, res) => {
  try {
    const totalTeachers = await Teacher.count();
    const activeTeachers = await Teacher.count({ where: { status: 'active' } });
    const onLeave = await Teacher.count({ where: { status: 'on_leave' } });
    const classTeachers = await Teacher.count({ where: { isClassTeacher: true } });
    
    // Count by department
    const teachersByDepartment = await Teacher.findAll({
      attributes: [
        'department',
        [Teacher.sequelize.fn('COUNT', Teacher.sequelize.col('id')), 'count']
      ],
      group: ['department'],
      raw: true
    });

    res.json({
      success: true,
      stats: {
        total: totalTeachers,
        active: activeTeachers,
        onLeave: onLeave,
        classTeachers: classTeachers,
        byDepartment: teachersByDepartment
      }
    });

  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching statistics',
      error: error.message
    });
  }
};