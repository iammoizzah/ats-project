const Interview = require('../models/Interview');
const Application = require('../models/Application');

// @route POST /api/interviews
// @access Private (HR/Admin)
const scheduleInterview = async (req, res) => {
  const { applicationId, scheduledAt, message } = req.body;
  try {
    const application = await Application.findById(applicationId)
      .populate('candidate job');

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    const interview = await Interview.create({
      application: applicationId,
      candidate: application.candidate._id,
      job: application.job._id,
      scheduledAt,
      message
    });

    // Update application status
    application.status = 'Interview Scheduled';
    await application.save();

    res.status(201).json(interview);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route GET /api/interviews
// @access Private (HR/Admin)
const getAllInterviews = async (req, res) => {
  try {
    const interviews = await Interview.find()
      .populate('candidate', 'name email phone')
      .populate('job', 'title department')
      .sort({ scheduledAt: 1 });

    res.json(interviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route GET /api/interviews/my
// @access Private (Candidate)
const getMyInterviews = async (req, res) => {
  try {
    const interviews = await Interview.find({ candidate: req.user._id })
      .populate('job', 'title department')
      .sort({ scheduledAt: 1 });

    res.json(interviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route PUT /api/interviews/:id
// @access Private (HR/Admin)
const updateInterview = async (req, res) => {
  try {
    const interview = await Interview.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }
    res.json(interview);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  scheduleInterview,
  getAllInterviews,
  getMyInterviews,
  updateInterview
};