const express = require('express');
const {
  restrictTo,
  authMiddleware,
} = require('../../../middlewares/auth.middleware');
const upload = require('../../../utils/multer.util');
const {
  createReceptionistController,
  getReceptionists,
  getReceptionist,
  updateReceptionist,
  getMe,
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

// Profile endpoints
receptionistRouter.get('/me', getMe);
receptionistRouter.post(
  '/',
  upload.single('photo'),
  createReceptionistController,
);
receptionistRouter.patch('/me', upload.single('photo'), (req, res, next) => {
  req.params.id = req.data.id;
  updateReceptionist(req, res, next);
});
receptionistRouter.get('/all', getReceptionists);
receptionistRouter.get('/id/:id', getReceptionist);
receptionistRouter.patch('/:id', upload.single('photo'), updateReceptionist);

receptionistRouter.patch('/patient-checkin/token/:token', patientCheckin);

receptionistRouter.get('/dashboard', dashboardStats);

receptionistRouter.get('/appointments', todaysAppointments);

receptionistRouter.get('/appointments/token/:token', appointmentBytoken);

receptionistRouter.get('/queues', queueStats);

receptionistRouter.get('/checkins/recent', recentCheckins);

module.exports = receptionistRouter;
