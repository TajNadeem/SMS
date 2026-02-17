const Subject = require('../models/Subject');
const { Op } = require('sequelize');

// Get all subjects
exports.getAllSubjects = async (req, res) => {
  try {
    const { search, status } = req.query;

    const where = {};
    
    if (search) {
      where[Op.or] = [
        { subjectName: { [Op.like]: `%${search}%` } },
        { subjectCode: { [Op.like]: `%${search}%` } }
      ];
    }
    
    if (status) {
      where.status = status;
    }

    const subjects = await Subject.findAll({
      where,
      order: [['subjectName', 'ASC']]
    });

    res.json({
      success: true,
      subjects
    });

  } catch (error) {
    console.error('Get subjects error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching subjects',
      error: error.message
    });
  }
};

// Get single subject
exports.getSubject = async (req, res) => {
  try {
    const subject = await Subject.findByPk(req.params.id);

    if (!subject) {
      return res.status(404).json({
        success: false,
        message: 'Subject not found'
      });
    }

    res.json({
      success: true,
      subject
    });

  } catch (error) {
    console.error('Get subject error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching subject',
      error: error.message
    });
  }
};

// Create subject
exports.createSubject = async (req, res) => {
  try {
    const { subjectName, subjectCode, description, status } = req.body;

    const existingSubject = await Subject.findOne({ where: { subjectCode } });
    if (existingSubject) {
      return res.status(400).json({
        success: false,
        message: 'Subject code already exists'
      });
    }

    const subject = await Subject.create({
      subjectName,
      subjectCode,
      description,
      status: status || 'active'
    });

    res.status(201).json({
      success: true,
      message: 'Subject created successfully',
      subject
    });

  } catch (error) {
    console.error('Create subject error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating subject',
      error: error.message
    });
  }
};

// Update subject
exports.updateSubject = async (req, res) => {
  try {
    const subject = await Subject.findByPk(req.params.id);

    if (!subject) {
      return res.status(404).json({
        success: false,
        message: 'Subject not found'
      });
    }

    if (req.body.subjectCode && req.body.subjectCode !== subject.subjectCode) {
      const existingSubject = await Subject.findOne({
        where: { subjectCode: req.body.subjectCode }
      });
      if (existingSubject) {
        return res.status(400).json({
          success: false,
          message: 'Subject code already exists'
        });
      }
    }

    await subject.update(req.body);

    res.json({
      success: true,
      message: 'Subject updated successfully',
      subject
    });

  } catch (error) {
    console.error('Update subject error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating subject',
      error: error.message
    });
  }
};

// Delete subject
exports.deleteSubject = async (req, res) => {
  try {
    const subject = await Subject.findByPk(req.params.id);

    if (!subject) {
      return res.status(404).json({
        success: false,
        message: 'Subject not found'
      });
    }

    await subject.destroy();

    res.json({
      success: true,
      message: 'Subject deleted successfully'
    });

  } catch (error) {
    console.error('Delete subject error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting subject',
      error: error.message
    });
  }
};