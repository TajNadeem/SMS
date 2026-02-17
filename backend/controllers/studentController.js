const Student = require('../models/Student');
const User = require('../models/User');
const { Op } = require('sequelize');

// Get all students
exports.getAllStudents = async (req, res) => {
  try {
    const { search, class: className, status, page = 1, limit = 10 } = req.query;

    // Build filter conditions
    const where = {};
    
    if (search) {
      where[Op.or] = [
        { firstName: { [Op.like]: `%${search}%` } },
        { lastName: { [Op.like]: `%${search}%` } },
        { admissionNo: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } }
      ];
    }
    
    if (className) {
      where.class = className;
    }
    
    if (status) {
      where.status = status;
    }

    // Pagination
    const offset = (page - 1) * limit;

    const { count, rows } = await Student.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']],
      include: [{
        model: User,
        as: 'user',
        attributes: ['username', 'email', 'status']
      }]
    });

    res.json({
      success: true,
      students: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit)
      }
    });

  } catch (error) {
    console.error('Get students error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching students',
      error: error.message
    });
  }
};

// Get single student
exports.getStudent = async (req, res) => {
  try {
    const student = await Student.findByPk(req.params.id, {
      include: [{
        model: User,
        as: 'user',
        attributes: ['username', 'email', 'status']
      }]
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    res.json({
      success: true,
      student
    });

  } catch (error) {
    console.error('Get student error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching student',
      error: error.message
    });
  }
};

// Create student
exports.createStudent = async (req, res) => {
  try {
    const {
      admissionNo,
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
      parentName,
      parentPhone,
      parentEmail,
      class: className,
      section,
      rollNumber,
      admissionDate,
      status
    } = req.body;

    // Check if admission number already exists
    const existingStudent = await Student.findOne({ where: { admissionNo } });
    if (existingStudent) {
      return res.status(400).json({
        success: false,
        message: 'Admission number already exists'
      });
    }

    // Create student
    const student = await Student.create({
      admissionNo,
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
      parentName,
      parentPhone,
      parentEmail,
      class: className,
      section,
      rollNumber,
      admissionDate,
      status: status || 'active'
    });

    res.status(201).json({
      success: true,
      message: 'Student created successfully',
      student
    });

  } catch (error) {
    console.error('Create student error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating student',
      error: error.message
    });
  }
};

// Update student
exports.updateStudent = async (req, res) => {
  try {
    const student = await Student.findByPk(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Check if admission number is being changed and already exists
    if (req.body.admissionNo && req.body.admissionNo !== student.admissionNo) {
      const existingStudent = await Student.findOne({
        where: { admissionNo: req.body.admissionNo }
      });
      if (existingStudent) {
        return res.status(400).json({
          success: false,
          message: 'Admission number already exists'
        });
      }
    }

    await student.update(req.body);

    res.json({
      success: true,
      message: 'Student updated successfully',
      student
    });

  } catch (error) {
    console.error('Update student error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating student',
      error: error.message
    });
  }
};

// Delete student
exports.deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByPk(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    await student.destroy();

    res.json({
      success: true,
      message: 'Student deleted successfully'
    });

  } catch (error) {
    console.error('Delete student error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting student',
      error: error.message
    });
  }
};

// Get student statistics
exports.getStudentStats = async (req, res) => {
  try {
    const totalStudents = await Student.count();
    const activeStudents = await Student.count({ where: { status: 'active' } });
    const inactiveStudents = await Student.count({ where: { status: 'inactive' } });
    
    // Count by class
    const studentsByClass = await Student.findAll({
      attributes: [
        'class',
        [Student.sequelize.fn('COUNT', Student.sequelize.col('id')), 'count']
      ],
      group: ['class'],
      raw: true
    });

    res.json({
      success: true,
      stats: {
        total: totalStudents,
        active: activeStudents,
        inactive: inactiveStudents,
        byClass: studentsByClass
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