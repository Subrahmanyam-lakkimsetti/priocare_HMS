const express = require('express');
const {
  registerSchema,
  loginScheema,
  updatePasswordScheema,
} = require('./auth.validation');
const { validateInput } = require('../../../middlewares/validation.middleware');
const {
  patientRegisterController,
  loginController,
  logoutController,
  getMe,
  updatePasswordController,
} = require('./auth.controller');
const { authMiddleware } = require('../../../middlewares/auth.middleware');

const authRouter = express.Router();

authRouter.post(
  '/patient/register',
  validateInput(registerSchema),
  patientRegisterController,
);

authRouter.post('/login', validateInput(loginScheema), loginController);

// protected routes
authRouter.use(authMiddleware);

authRouter.get('/me', getMe);

// patch
authRouter.patch(
  '/me/updatePassword',
  validateInput(updatePasswordScheema),
  updatePasswordController,
);

authRouter.post('/logout', logoutController);

module.exports = authRouter;
