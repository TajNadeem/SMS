const express = require('express');
const router = express.Router();
const {
  getAllStudents,
  getStudent,
  createStudent,
  updateStudent,
  deleteStudent,
  getStudentStats
} = require('../controllers/studentController');
const { protect, authorize } = require('../middleware/authMiddleware');

// All routes are protected
router.use(protect);

// Get statistics
router.get('/stats', getStudentStats);

// CRUD routes
router.get('/', getAllStudents);
router.get('/:id', getStudent);
router.post('/', authorize('admin', 'principal', 'reception'), createStudent);
router.put('/:id', authorize('admin', 'principal', 'reception'), updateStudent);
router.delete('/:id', authorize('admin', 'principal'), deleteStudent);

module.exports = router;