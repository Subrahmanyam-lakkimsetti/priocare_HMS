const express = require('express');
const {
  authMiddleware,
  restrictTo,
} = require('../../../middlewares/auth.middleware');
const {
  createAppointment,
  getActiveAppointment,
  getAppointmnetByToken,
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

module.exports = {
  appointementRouter,
};
