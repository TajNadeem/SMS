const express = require('express');
const router = express.Router();
const {
  markAttendance,
  bulkMarkAttendance,
  getAttendanceByClass,
  getStudentAttendance,
  getAttendanceStats,
  getMonthlyReport,
  deleteAttendance
} = require('../controllers/attendanceController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

// Mark attendance
router.post('/', authorize('admin', 'principal', 'teacher'), markAttendance);
router.post('/bulk', authorize('admin', 'principal', 'teacher'), bulkMarkAttendance);

// Get attendance
router.get('/class', getAttendanceByClass);
router.get('/student/:studentId', getStudentAttendance);
router.get('/stats', getAttendanceStats);
router.get('/monthly-report', getMonthlyReport);

// Delete attendance
router.delete('/:id', authorize('admin', 'principal'), deleteAttendance);

module.exports = router;