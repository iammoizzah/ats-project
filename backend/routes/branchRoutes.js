const express = require('express');
const router = express.Router();
const {
  getBranches,
  getBranchById,
  createBranch,
  updateBranch,
  deleteBranch
} = require('../controllers/branchController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

router.get('/', getBranches);
router.get('/:id', getBranchById);
router.post('/', protect, authorizeRoles('hr', 'admin'), createBranch);
router.put('/:id', protect, authorizeRoles('hr', 'admin'), updateBranch);
router.delete('/:id', protect, authorizeRoles('admin'), deleteBranch);

module.exports = router;