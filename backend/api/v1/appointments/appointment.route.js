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
} = require('./appointment.controller');

const appointementRouter = express.Router();

appointementRouter.use(authMiddleware);

appointementRouter.post('/', restrictTo('patient'), createAppointment);

appointementRouter.get(
  '/me/active',
  restrictTo('patient'),
  getActiveAppointment,
);

appointementRouter.get('/token/:token', getAppointmnetByToken);

appointementRouter.get('/all', restrictTo('patient'), getAppointmentsForUser);

appointementRouter.get(
  '/:token/prescription',
  getPrescriptionByToken,
);

appointementRouter.patch(
  '/token/:token/cancel',
  restrictTo('patient'),
  cancelAppointment,
);

module.exports = {
  appointementRouter,
};
