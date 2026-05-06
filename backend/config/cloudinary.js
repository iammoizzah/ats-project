const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Storage for resumes and cover letters (PDF)
const documentStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'ats/documents',
    allowed_formats: ['pdf', 'doc', 'docx'],
    resource_type: 'raw'
  }
});

// Storage for profile pictures (images)
const imageStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'ats/profiles',
    allowed_formats: ['jpg', 'jpeg', 'png'],
    resource_type: 'image'
  }
});

const uploadDocument = multer({ storage: documentStorage });
const uploadImage = multer({ storage: imageStorage });

module.exports = { cloudinary, uploadDocument, uploadImage };