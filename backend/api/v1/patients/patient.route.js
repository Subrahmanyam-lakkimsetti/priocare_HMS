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
} = require('./patient.controller');

const patientRouter = express.Router();

patientRouter.use(authMiddleware);
patientRouter.use(restrictTo('patient'));

// post
patientRouter.post(
  '/',
  validateInput(patientvalidationSchema),
  createPatientController,
);

// get
patientRouter.get('/me', getPatientController);

// patch
patientRouter.patch(
  '/me',
  validateInput(updatePatientValidationSchema),
  updatePatientController,
);

module.exports = {
  patientRouter,
};
