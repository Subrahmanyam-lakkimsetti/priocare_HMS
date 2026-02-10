const express = require('express');
const {
  authMiddleware,
  restrictTo,
} = require('../../../middlewares/auth.middleware');
const { createAppointment } = require('./appointment.controller');

const appointementRouter = express.Router();

appointementRouter.use(authMiddleware);

appointementRouter.post('/', restrictTo('patient'), createAppointment);

module.exports = {
  appointementRouter,
};
