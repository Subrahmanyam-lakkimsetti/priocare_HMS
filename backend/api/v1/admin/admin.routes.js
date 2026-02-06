const express = require('express');
const {
  restrictTo,
  authMiddleware,
} = require('../../../middlewares/auth.middleware');
const { validateInput } = require('../../../middlewares/validation.middleware');
const { doctorSchema } = require('./admin.validation');
const { createDoctorUser } = require('./admin.controller');

const adminRouter = express.Router();

adminRouter.use(authMiddleware);

adminRouter.post(
  '/doctors',
  restrictTo('admin'),
  validateInput(doctorSchema),
  createDoctorUser,
);

module.exports = adminRouter;
