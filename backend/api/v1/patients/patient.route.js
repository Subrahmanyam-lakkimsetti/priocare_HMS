const express = require('express');
const { validateInput } = require('../../../middlewares/validation.middleware');
const { patientvalidationSchema } = require('./patient.validation');
const {
  authMiddleware,
  restrictTo,
} = require('../../../middlewares/auth.middleware');
const { createPatientController } = require('./patient.controller');

const patientRouter = express.Router();

patientRouter.use(authMiddleware);

patientRouter.post(
  '/',
  restrictTo('patient'),
  validateInput(patientvalidationSchema),
  createPatientController,
);

module.exports = {
  patientRouter,
};
