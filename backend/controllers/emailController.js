const sendEmail = require('../utils/sendEmail');
const Application = require('../models/Application');
const Interview = require('../models/Interview');
const User = require('../models/User');
const {
  shortlistTemplate,
  interviewTemplate,
  rejectionTemplate,
  customTemplate
} = require('../utils/emailTemplates');

const COMPANY_NAME = 'TechCorp Solutions';

// @route POST /api/email/shortlist/:applicationId
// @access Private (HR/Admin)
const sendShortlistEmail = async (req, res) => {
  try {
    const application = await Application.findById(req.params.applicationId)
      .populate('candidate', 'name email')
      .populate('job', 'title');

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    await sendEmail({
      to: application.candidate.email,
      subject: `🎉 You've been shortlisted — ${application.job.title}`,
      html: shortlistTemplate(
        application.candidate.name,
        application.job.title,
        COMPANY_NAME
      )
    });

    // Update status
    application.status = 'Shortlisted';
    await application.save();

    res.json({ message: `Shortlist email sent to ${application.candidate.email}` });
  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @route POST /api/email/interview/:interviewId
// @access Private (HR/Admin)
const sendInterviewEmail = async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.interviewId)
      .populate('candidate', 'name email')
      .populate('job', 'title');

    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    const date = new Date(interview.scheduledAt);
    const dateStr = date.toLocaleDateString('en-PK', {
      weekday: 'long', year: 'numeric',
      month: 'long', day: 'numeric'
    });
    const timeStr = date.toLocaleTimeString('en-PK', {
      hour: '2-digit', minute: '2-digit'
    });

    await sendEmail({
      to: interview.candidate.email,
      subject: `📅 Interview Scheduled — ${interview.job.title}`,
      html: interviewTemplate(
        interview.candidate.name,
        interview.job.title,
        dateStr,
        timeStr,
        interview.message,
        COMPANY_NAME
      )
    });

    res.json({ message: `Interview email sent to ${interview.candidate.email}` });
  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @route POST /api/email/reject/:applicationId
// @access Private (HR/Admin)
const sendRejectionEmail = async (req, res) => {
  try {
    const application = await Application.findById(req.params.applicationId)
      .populate('candidate', 'name email')
      .populate('job', 'title');

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    await sendEmail({
      to: application.candidate.email,
      subject: `Application Update — ${application.job.title}`,
      html: rejectionTemplate(
        application.candidate.name,
        application.job.title,
        COMPANY_NAME
      )
    });

    // Update status
    application.status = 'Rejected';
    await application.save();

    res.json({ message: `Rejection email sent to ${application.candidate.email}` });
  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @route POST /api/email/custom/:candidateId
// @access Private (HR/Admin)
const sendCustomEmail = async (req, res) => {
  const { subject, message } = req.body;
  try {
    const candidate = await User.findById(req.params.candidateId);

    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }

    await sendEmail({
      to: candidate.email,
      subject: subject || 'Message from HR',
      html: customTemplate(candidate.name, message, COMPANY_NAME)
    });

    res.json({ message: `Email sent to ${candidate.email}` });
  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  sendShortlistEmail,
  sendInterviewEmail,
  sendRejectionEmail,
  sendCustomEmail
};