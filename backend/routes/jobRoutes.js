const express = require('express');
const router = express.Router();
const {
  getJobs,
  getAllJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob
} = require('../controllers/jobController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

router.get('/', getJobs);
router.get('/all', protect, authorizeRoles('hr', 'admin'), getAllJobs);
router.get('/:id', getJobById);
router.post('/', protect, authorizeRoles('hr', 'admin'), createJob);
router.put('/:id', protect, authorizeRoles('hr', 'admin'), updateJob);
router.delete('/:id', protect, authorizeRoles('hr', 'admin'), deleteJob);

module.exports = router;