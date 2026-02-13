const express = require('express');
const {
  restrictTo,
  authMiddleware,
} = require('../../../middlewares/auth.middleware');
const { validateInput } = require('../../../middlewares/validation.middleware');
const { doctorSchema } = require('./admin.validation');
const { createDoctorUser, createReceptionist } = require('./admin.controller');

const adminRouter = express.Router();

adminRouter.use(authMiddleware);

adminRouter.post(
  '/doctors',
  restrictTo('admin'),
  validateInput(doctorSchema),
  createDoctorUser,
);

adminRouter.post('/receptionists', restrictTo('admin'), createReceptionist);

module.exports = adminRouter;
