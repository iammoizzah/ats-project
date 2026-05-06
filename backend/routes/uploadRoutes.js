const express = require('express');
const router = express.Router();
const { uploadDocument, uploadImage } = require('../config/cloudinary');
const { protect } = require('../middleware/authMiddleware');

// @route POST /api/upload/document
// @access Private
router.post('/document', protect, uploadDocument.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    res.json({
      url: req.file.path,
      public_id: req.file.filename
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route POST /api/upload/image
// @access Private
router.post('/image', protect, uploadImage.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    res.json({
      url: req.file.path,
      public_id: req.file.filename
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;