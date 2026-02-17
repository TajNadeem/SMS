const express = require('express');
const router = express.Router();
const {
  getAllTeachers,
  getTeacher,
  createTeacher,
  updateTeacher,
  deleteTeacher,
  assignSubjects,
  getTeacherStats
} = require('../controllers/teacherController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/stats', getTeacherStats);
router.get('/', getAllTeachers);
router.get('/:id', getTeacher);
router.post('/', authorize('admin', 'principal'), createTeacher);
router.put('/:id', authorize('admin', 'principal'), updateTeacher);
router.delete('/:id', authorize('admin', 'principal'), deleteTeacher);
router.post('/:teacherId/subjects', authorize('admin', 'principal'), assignSubjects);

module.exports = router;