const express = require('express');
const {
  authMiddleware,
  restrictTo,
} = require('../../../middlewares/auth.middleware');
const {
  createAppointment,
  getActiveAppointment,
  getAppointmnetByToken,
  getAppointmentsForUser,
  cancelAppointment,
  getPrescriptionByToken,
  getDoctorsAccordingToSpecilization,
  createAppointmentManualAssign,
} = require('./appointment.controller');

const appointementRouter = express.Router();

appointementRouter.use(authMiddleware);

appointementRouter.post('/', restrictTo('patient'), createAppointment);

// manual assign doctor
// for choosing the doctors
appointementRouter.post(
  '/available-doctors',
  getDoctorsAccordingToSpecilization,
);

// create appointment
appointementRouter.post(
  '/manual-assign/create-appointment',
  createAppointmentManualAssign,
);

appointementRouter.get(
  '/me/active',
  restrictTo('patient'),
  getActiveAppointment,
);

appointementRouter.get('/token/:token', getAppointmnetByToken);

appointementRouter.get('/all', restrictTo('patient'), getAppointmentsForUser);

appointementRouter.get('/:token/prescription', getPrescriptionByToken);

appointementRouter.patch(
  '/token/:token/cancel',
  restrictTo('patient'),
  cancelAppointment,
);

module.exports = {
  appointementRouter,
};
