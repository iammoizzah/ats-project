const express = require('express');
const router = express.Router();
const {
  applyForJob,
  getMyApplications,
  getApplicationsByJob,
  getAllApplications,
  getApplicationById,
  updateApplicationStatus
} = require('../controllers/applicationController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

router.post('/', protect, authorizeRoles('candidate'), applyForJob);
router.get('/my', protect, authorizeRoles('candidate'), getMyApplications);
router.get('/all', protect, authorizeRoles('hr', 'admin'), getAllApplications);
router.get('/job/:jobId', protect, authorizeRoles('hr', 'admin'), getApplicationsByJob);
router.get('/:id', protect, getApplicationById);
router.put('/:id/status', protect, authorizeRoles('hr', 'admin'), updateApplicationStatus);

module.exports = router;