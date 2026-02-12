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
const getQueue = require('./doctor.controller');

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

doctorRouter.get(
  '/doctorId/:doctorId/queue',
  restrictTo('doctor', 'admin'),
  getQueue,
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

module.exports = {
  doctorRouter,
};
