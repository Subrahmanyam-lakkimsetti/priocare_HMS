const express = require('express');
const {
  restrictTo,
  authMiddleware,
} = require('../../../middlewares/auth.middleware');
const {
  createReceptionistController,
} = require('./receptionistAuth.controller');
const { patientCheckin } = require('./receptionist.controller');

const receptionistRouter = express.Router();

receptionistRouter.use(authMiddleware);
(receptionistRouter.use(restrictTo('receptionist')),
  receptionistRouter.post('/', createReceptionistController));

receptionistRouter.patch('/patient-checkin/token/:token', patientCheckin);

module.exports = receptionistRouter;
