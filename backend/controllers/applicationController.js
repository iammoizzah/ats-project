const Application = require('../models/Application');
const Job = require('../models/Job');

// @route POST /api/applications
// @access Private (Candidate)
const applyForJob = async (req, res) => {
  const { jobId, resumeUrl, coverLetterUrl } = req.body;
  try {
    // Check job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check already applied
    const alreadyApplied = await Application.findOne({
      job: jobId,
      candidate: req.user._id
    });
    if (alreadyApplied) {
      return res.status(400).json({ message: 'You already applied for this job' });
    }

    const application = await Application.create({
      job: jobId,
      candidate: req.user._id,
      resumeUrl,
      coverLetterUrl
    });

    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route GET /api/applications/my
// @access Private (Candidate)
const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ candidate: req.user._id })
      .populate('job', 'title department')
      .populate({
        path: 'job',
        populate: { path: 'branch', select: 'name location' }
      })
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route GET /api/applications/job/:jobId
// @access Private (HR/Admin)
const getApplicationsByJob = async (req, res) => {
  try {
    const applications = await Application.find({ job: req.params.jobId })
      .populate('candidate', 'name email phone profilePicture')
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route GET /api/applications/all
// @access Private (HR/Admin)
const getAllApplications = async (req, res) => {
  try {
    const applications = await Application.find()
      .populate('candidate', 'name email phone')
      .populate('job', 'title department')
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route GET /api/applications/:id
// @access Private
const getApplicationById = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate('candidate', 'name email phone profilePicture')
      .populate('job', 'title department description');

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    res.json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route PUT /api/applications/:id/status
// @access Private (HR/Admin)
const updateApplicationStatus = async (req, res) => {
  const { status, hrNotes } = req.body;
  try {
    const application = await Application.findByIdAndUpdate(
      req.params.id,
      { status, hrNotes },
      { new: true }
    ).populate('candidate', 'name email');

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    res.json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  applyForJob,
  getMyApplications,
  getApplicationsByJob,
  getAllApplications,
  getApplicationById,
  updateApplicationStatus
};