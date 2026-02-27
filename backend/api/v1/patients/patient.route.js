const express = require('express');
const { validateInput } = require('../../../middlewares/validation.middleware');
const {
  patientvalidationSchema,
  updatePatientValidationSchema,
} = require('./patient.validation');
const {
  authMiddleware,
  restrictTo,
} = require('../../../middlewares/auth.middleware');
const {
  createPatientController,
  getPatientController,
  updatePatientController,
  getPatientByIdController,
} = require('./patient.controller');
const upload = require('../../../utils/multer.util');

const patientRouter = express.Router();

patientRouter.use(authMiddleware);

// get
patientRouter.get(
  '/patientId/:id',
  restrictTo('doctor', 'nurse', 'admin'),
  getPatientByIdController,
);

patientRouter.use(restrictTo('patient'));

// post
patientRouter.post(
  '/',
  upload.single('photo'),
  validateInput(patientvalidationSchema),
  createPatientController,
);

// get
patientRouter.get('/me', getPatientController);

// patch
patientRouter.patch(
  '/me',
  upload.single('photo'),
  validateInput(updatePatientValidationSchema),
  updatePatientController,
);

module.exports = {
  patientRouter,
};
