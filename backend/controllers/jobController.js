const Job = require('../models/Job');

// @route GET /api/jobs
// @access Public
const getJobs = async (req, res) => {
  try {
    const filter = { isActive: true };

    // Filter by branch if provided
    if (req.query.branch) {
      filter.branch = req.query.branch;
    }

    // Filter by department if provided
    if (req.query.department) {
      filter.department = req.query.department;
    }

    const jobs = await Job.find(filter)
      .populate('branch', 'name location')
      .populate('postedBy', 'name email')
      .sort({ createdAt: -1 });

    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route GET /api/jobs/all
// @access Private (HR/Admin)
const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find()
      .populate('branch', 'name location')
      .populate('postedBy', 'name email')
      .sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route GET /api/jobs/:id
// @access Public
const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('branch', 'name location')
      .populate('postedBy', 'name email');

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route POST /api/jobs
// @access Private (HR/Admin)
const createJob = async (req, res) => {
  const { title, department, description, requirements, seats, branch } = req.body;
  try {
    const job = await Job.create({
      title,
      department,
      description,
      requirements,
      seats,
      branch,
      postedBy: req.user._id
    });

    const populated = await job.populate('branch', 'name location');
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route PUT /api/jobs/:id
// @access Private (HR/Admin)
const updateJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate('branch', 'name location');

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route DELETE /api/jobs/:id
// @access Private (HR/Admin)
const deleteJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getJobs,
  getAllJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob
};