const FeeStructure = require('../models/FeeStructure');
const FeeInvoice = require('../models/FeeInvoice');
const Payment = require('../models/Payment');
const Student = require('../models/Student');
const { Op } = require('sequelize');

// Generate unique invoice number
const generateInvoiceNumber = async () => {
  const year = new Date().getFullYear();
  const count = await FeeInvoice.count({
    where: {
      invoiceNumber: {
        [Op.like]: `INV${year}%`
      }
    }
  });
  return `INV${year}${String(count + 1).padStart(5, '0')}`;
};

// Generate unique receipt number
const generateReceiptNumber = async () => {
  const year = new Date().getFullYear();
  const count = await Payment.count({
    where: {
      receiptNumber: {
        [Op.like]: `RCP${year}%`
      }
    }
  });
  return `RCP${year}${String(count + 1).padStart(5, '0')}`;
};

// Get all fee structures
exports.getAllFeeStructures = async (req, res) => {
  try {
    const { class: className, academicYear, status } = req.query;

    const where = {};
    if (className) where.class = className;
    if (academicYear) where.academicYear = academicYear;
    if (status) where.status = status;

    const feeStructures = await FeeStructure.findAll({
      where,
      order: [['class', 'ASC'], ['feeType', 'ASC']]
    });

    res.json({
      success: true,
      feeStructures
    });

  } catch (error) {
    console.error('Get fee structures error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching fee structures',
      error: error.message
    });
  }
};

// Create fee structure
exports.createFeeStructure = async (req, res) => {
  try {
    const feeStructure = await FeeStructure.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Fee structure created successfully',
      feeStructure
    });

  } catch (error) {
    console.error('Create fee structure error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating fee structure',
      error: error.message
    });
  }
};

// Update fee structure
exports.updateFeeStructure = async (req, res) => {
  try {
    const feeStructure = await FeeStructure.findByPk(req.params.id);

    if (!feeStructure) {
      return res.status(404).json({
        success: false,
        message: 'Fee structure not found'
      });
    }

    await feeStructure.update(req.body);

    res.json({
      success: true,
      message: 'Fee structure updated successfully',
      feeStructure
    });

  } catch (error) {
    console.error('Update fee structure error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating fee structure',
      error: error.message
    });
  }
};

// Delete fee structure
exports.deleteFeeStructure = async (req, res) => {
  try {
    const feeStructure = await FeeStructure.findByPk(req.params.id);

    if (!feeStructure) {
      return res.status(404).json({
        success: false,
        message: 'Fee structure not found'
      });
    }

    await feeStructure.destroy();

    res.json({
      success: true,
      message: 'Fee structure deleted successfully'
    });

  } catch (error) {
    console.error('Delete fee structure error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting fee structure',
      error: error.message
    });
  }
};

// Generate invoices for a class
exports.generateInvoices = async (req, res) => {
  try {
    const { class: className, academicYear, feeType, studentIds } = req.body;

    // Get fee structure
    const feeStructure = await FeeStructure.findOne({
      where: { class: className, academicYear, feeType, status: 'active' }
    });

    if (!feeStructure) {
      return res.status(404).json({
        success: false,
        message: 'Fee structure not found for this class and fee type'
      });
    }

    // Get students
    const where = { class: className, status: 'active' };
    if (studentIds && studentIds.length > 0) {
      where.id = { [Op.in]: studentIds };
    }

    const students = await Student.findAll({ where });

    if (students.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No students found'
      });
    }

    // Generate invoices
    const invoices = [];
    for (const student of students) {
      // Check if invoice already exists
      const existingInvoice = await FeeInvoice.findOne({
        where: {
          studentId: student.id,
          academicYear,
          feeType,
          status: { [Op.in]: ['pending', 'partial'] }
        }
      });

      if (!existingInvoice) {
        const invoiceNumber = await generateInvoiceNumber();
        
        const invoice = await FeeInvoice.create({
          invoiceNumber,
          studentId: student.id,
          academicYear,
          feeType,
          totalAmount: feeStructure.amount,
          paidAmount: 0,
          balanceAmount: feeStructure.amount,
          dueDate: feeStructure.dueDate || new Date(),
          status: 'pending'
        });

        invoices.push(invoice);
      }
    }

    res.status(201).json({
      success: true,
      message: `Generated ${invoices.length} invoices successfully`,
      invoices
    });

  } catch (error) {
    console.error('Generate invoices error:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating invoices',
      error: error.message
    });
  }
};

// Get all invoices
exports.getAllInvoices = async (req, res) => {
  try {
    const { search, status, class: className, academicYear } = req.query;

    const where = {};
    
    if (status) where.status = status;
    if (academicYear) where.academicYear = academicYear;

    const studentWhere = {};
    if (className) studentWhere.class = className;
    
    if (search) {
      studentWhere[Op.or] = [
        { firstName: { [Op.like]: `%${search}%` } },
        { lastName: { [Op.like]: `%${search}%` } },
        { admissionNo: { [Op.like]: `%${search}%` } }
      ];
    }

    const invoices = await FeeInvoice.findAll({
      where,
      include: [{
        model: Student,
        as: 'student',
        where: studentWhere,
        attributes: ['id', 'admissionNo', 'firstName', 'lastName', 'class', 'section']
      }],
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      invoices
    });

  } catch (error) {
    console.error('Get invoices error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching invoices',
      error: error.message
    });
  }
};

// Get student invoices
exports.getStudentInvoices = async (req, res) => {
  try {
    const { studentId } = req.params;

    const invoices = await FeeInvoice.findAll({
      where: { studentId },
      include: [{
        model: Payment,
        as: 'payments',
        attributes: ['id', 'receiptNumber', 'amount', 'paymentDate', 'paymentMethod']
      }],
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      invoices
    });

  } catch (error) {
    console.error('Get student invoices error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching student invoices',
      error: error.message
    });
  }
};

// Record payment
exports.recordPayment = async (req, res) => {
  try {
    const {
      invoiceId,
      amount,
      paymentDate,
      paymentMethod,
      transactionId,
      chequeNumber,
      bankName,
      remarks
    } = req.body;

    // Get invoice
    const invoice = await FeeInvoice.findByPk(invoiceId);
    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found'
      });
    }

    // Validate payment amount
    if (parseFloat(amount) > parseFloat(invoice.balanceAmount)) {
      return res.status(400).json({
        success: false,
        message: 'Payment amount exceeds balance amount'
      });
    }

    // Generate receipt number
    const receiptNumber = await generateReceiptNumber();

    // Create payment
    const payment = await Payment.create({
      receiptNumber,
      invoiceId,
      studentId: invoice.studentId,
      amount,
      paymentDate: paymentDate || new Date(),
      paymentMethod,
      transactionId,
      chequeNumber,
      bankName,
      remarks,
      collectedBy: req.user.id
    });

    // Update invoice
    const newPaidAmount = parseFloat(invoice.paidAmount) + parseFloat(amount);
    const newBalanceAmount = parseFloat(invoice.totalAmount) - newPaidAmount;

    let newStatus = 'pending';
    if (newBalanceAmount === 0) {
      newStatus = 'paid';
    } else if (newPaidAmount > 0) {
      newStatus = 'partial';
    }

    await invoice.update({
      paidAmount: newPaidAmount,
      balanceAmount: newBalanceAmount,
      status: newStatus
    });

    // Get updated invoice with payment
    const updatedInvoice = await FeeInvoice.findByPk(invoiceId, {
      include: [{
        model: Payment,
        as: 'payments'
      }]
    });

    res.status(201).json({
      success: true,
      message: 'Payment recorded successfully',
      payment,
      invoice: updatedInvoice
    });

  } catch (error) {
    console.error('Record payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Error recording payment',
      error: error.message
    });
  }
};

// Get payment receipt
exports.getPaymentReceipt = async (req, res) => {
  try {
    const { id } = req.params;

    const payment = await Payment.findByPk(id, {
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['id', 'admissionNo', 'firstName', 'lastName', 'class', 'section']
        },
        {
          model: FeeInvoice,
          as: 'invoice',
          attributes: ['invoiceNumber', 'feeType', 'academicYear']
        }
      ]
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    res.json({
      success: true,
      payment
    });

  } catch (error) {
    console.error('Get payment receipt error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching payment receipt',
      error: error.message
    });
  }
};

// Get fee defaulters
exports.getFeeDefaulters = async (req, res) => {
  try {
    const { class: className, academicYear } = req.query;
    const today = new Date().toISOString().split('T')[0];

    const where = {
      status: { [Op.in]: ['pending', 'partial'] },
      dueDate: { [Op.lt]: today }
    };

    if (academicYear) where.academicYear = academicYear;

    const studentWhere = {};
    if (className) studentWhere.class = className;

    const defaulters = await FeeInvoice.findAll({
      where,
      include: [{
        model: Student,
        as: 'student',
        where: studentWhere,
        attributes: ['id', 'admissionNo', 'firstName', 'lastName', 'class', 'section', 'parentPhone', 'parentEmail']
      }],
      order: [['dueDate', 'ASC']]
    });

    res.json({
      success: true,
      defaulters
    });

  } catch (error) {
    console.error('Get defaulters error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching defaulters',
      error: error.message
    });
  }
};

// Get fee statistics
exports.getFeeStats = async (req, res) => {
  try {
    const { academicYear } = req.query;

    const where = {};
    if (academicYear) where.academicYear = academicYear;

    const totalInvoices = await FeeInvoice.count({ where });
    
    const totalAmount = await FeeInvoice.sum('totalAmount', { where });
    const paidAmount = await FeeInvoice.sum('paidAmount', { where });
    const balanceAmount = await FeeInvoice.sum('balanceAmount', { where });

    const paidInvoices = await FeeInvoice.count({
      where: { ...where, status: 'paid' }
    });

    const pendingInvoices = await FeeInvoice.count({
      where: { ...where, status: 'pending' }
    });

    const partialInvoices = await FeeInvoice.count({
      where: { ...where, status: 'partial' }
    });

    const overdueInvoices = await FeeInvoice.count({
      where: {
        ...where,
        status: { [Op.in]: ['pending', 'partial'] },
        dueDate: { [Op.lt]: new Date() }
      }
    });

    res.json({
      success: true,
      stats: {
        totalInvoices,
        totalAmount: totalAmount || 0,
        paidAmount: paidAmount || 0,
        balanceAmount: balanceAmount || 0,
        paidInvoices,
        pendingInvoices,
        partialInvoices,
        overdueInvoices,
        collectionPercentage: totalAmount > 0 
          ? ((paidAmount / totalAmount) * 100).toFixed(2)
          : 0
      }
    });

  } catch (error) {
    console.error('Get fee stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching fee statistics',
      error: error.message
    });
  }
};