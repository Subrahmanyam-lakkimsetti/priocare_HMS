const express = require('express');
const {
  restrictTo,
  authMiddleware,
} = require('../../../middlewares/auth.middleware');
const {
  createReceptionistController,
} = require('./receptionistAuth.controller');
const {
  patientCheckin,
  dashboardStats,
  todaysAppointments,
  appointmentBytoken,
  queueStats,
  recentCheckins,
} = require('./receptionist.controller');

const receptionistRouter = express.Router();

receptionistRouter.use(authMiddleware, restrictTo('receptionist'));

receptionistRouter.post('/', createReceptionistController);

receptionistRouter.patch('/patient-checkin/token/:token', patientCheckin);

receptionistRouter.get('/dashboard', dashboardStats);

receptionistRouter.get('/appointments', todaysAppointments);

receptionistRouter.get('/appointments/token/:token', appointmentBytoken);

receptionistRouter.get('/queues', queueStats);

receptionistRouter.get("/checkins/recent", recentCheckins)

module.exports = receptionistRouter;
