const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const cloudinary = require('../config/cloudinary.config');

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'priocare-patient-profiles',
    allowedFormats: ['jpg', 'png'],
  },
});

const upload = multer({ storage });

module.exports = upload;
