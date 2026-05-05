const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  candidate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  resumeUrl: {
    type: String,   // Cloudinary URL
    required: true
  },
  coverLetterUrl: {
    type: String,   // Cloudinary URL
    default: ''
  },
  status: {
    type: String,
    enum: [
      'Submitted',
      'Under Review',
      'Shortlisted',
      'Interview Scheduled',
      'Rejected',
      'Selected'
    ],
    default: 'Submitted'
  },
  hrNotes: {
    type: String,
    default: ''
  }
}, { timestamps: true });

module.exports = mongoose.model('Application', applicationSchema);