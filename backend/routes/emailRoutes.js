const express = require('express');
const router = express.Router();
const {
  sendShortlistEmail,
  sendInterviewEmail,
  sendRejectionEmail,
  sendCustomEmail
} = require('../controllers/emailController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

router.post(
  '/shortlist/:applicationId',
  protect,
  authorizeRoles('hr', 'admin'),
  sendShortlistEmail
);

router.post(
  '/interview/:interviewId',
  protect,
  authorizeRoles('hr', 'admin'),
  sendInterviewEmail
);

router.post(
  '/reject/:applicationId',
  protect,
  authorizeRoles('hr', 'admin'),
  sendRejectionEmail
);

router.post(
  '/custom/:candidateId',
  protect,
  authorizeRoles('hr', 'admin'),
  sendCustomEmail
);

module.exports = router;