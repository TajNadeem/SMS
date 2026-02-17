const express = require('express');
const router = express.Router();
const {
  getAllFeeStructures,
  createFeeStructure,
  updateFeeStructure,
  deleteFeeStructure,
  generateInvoices,
  getAllInvoices,
  getStudentInvoices,
  recordPayment,
  getPaymentReceipt,
  getFeeDefaulters,
  getFeeStats
} = require('../controllers/feeController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

// Fee Structure
router.get('/structures', getAllFeeStructures);
router.post('/structures', authorize('admin', 'principal', 'accountant'), createFeeStructure);
router.put('/structures/:id', authorize('admin', 'principal', 'accountant'), updateFeeStructure);
router.delete('/structures/:id', authorize('admin', 'principal'), deleteFeeStructure);

// Invoices
router.post('/invoices/generate', authorize('admin', 'principal', 'accountant'), generateInvoices);
router.get('/invoices', getAllInvoices);
router.get('/invoices/student/:studentId', getStudentInvoices);

// Payments
router.post('/payments', authorize('admin', 'principal', 'accountant', 'reception'), recordPayment);
router.get('/payments/:id', getPaymentReceipt);

// Reports
router.get('/defaulters', getFeeDefaulters);
router.get('/stats', getFeeStats);

module.exports = router;