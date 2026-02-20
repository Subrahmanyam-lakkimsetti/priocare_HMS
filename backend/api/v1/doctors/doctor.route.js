const express = require('express');
const {
  createDotorController,
  getDoctors,
  getDoctor,
  updateDoctor,
  getMe,
} = require('./doctorAuth.controller');
const {
  authMiddleware,
  restrictTo,
} = require('../../../middlewares/auth.middleware');
const { validateInput } = require('../../../middlewares/validation.middleware');
const {
  doctorValidationSchema,
  updateDoctorValidationSchema,
} = require('./doctor.validation');
const {
  getQueue,
  callPatient,
  startConsultation,
} = require('./doctor.controller');
const { getAiSummary } = require('./doctor.service');

const doctorRouter = express.Router();

doctorRouter.use(authMiddleware);

// get
doctorRouter.get(
  '/all',
  restrictTo('admin', 'receptionist', 'nurse'),
  getDoctors,
);
doctorRouter.get('/id/:id', getDoctor);
doctorRouter.get('/me', restrictTo('doctor'), getMe);

doctorRouter.get('/queue', restrictTo('doctor', 'admin'), getQueue);

doctorRouter.get(
  '/appointment/token/:token',
  restrictTo('doctor'),
  getAiSummary,
);

// post
doctorRouter.post(
  '/',
  validateInput(doctorValidationSchema),
  restrictTo('doctor'),
  createDotorController,
);

// patch
doctorRouter.patch(
  '/:id',
  validateInput(updateDoctorValidationSchema),
  restrictTo('doctor'),
  updateDoctor,
);

doctorRouter.patch('/patients/callNext', restrictTo('doctor'), callPatient);

doctorRouter.patch(
  '/patients/start-consultation',
  restrictTo('doctor'),
  startConsultation,
);

module.exports = {
  doctorRouter,
};
