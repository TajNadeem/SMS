const express = require('express');
const router = express.Router();
const {
  getAllSubjects,
  getSubject,
  createSubject,
  updateSubject,
  deleteSubject
} = require('../controllers/subjectController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', getAllSubjects);
router.get('/:id', getSubject);
router.post('/', authorize('admin', 'principal'), createSubject);
router.put('/:id', authorize('admin', 'principal'), updateSubject);
router.delete('/:id', authorize('admin', 'principal'), deleteSubject);

module.exports = router;