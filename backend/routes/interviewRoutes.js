const express = require('express');
const router = express.Router();
const {
  scheduleInterview,
  getAllInterviews,
  getMyInterviews,
  updateInterview
} = require('../controllers/interviewController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

router.post('/', protect, authorizeRoles('hr', 'admin'), scheduleInterview);
router.get('/', protect, authorizeRoles('hr', 'admin'), getAllInterviews);
router.get('/my', protect, authorizeRoles('candidate'), getMyInterviews);
router.put('/:id', protect, authorizeRoles('hr', 'admin'), updateInterview);

module.exports = router;