const express = require('express');
const {
  registerSchema,
  loginScheema,
  updatePasswordScheema,
  forgetPasswordSchema,
  resetPasswordScheema,
} = require('./auth.validation');
const { validateInput } = require('../../../middlewares/validation.middleware');
const {
  patientRegisterController,
  loginController,
  logoutController,
  getMe,
  updatePasswordController,
  forgetPasswordController,
  resetPasswordController,
} = require('./auth.controller');
const { authMiddleware } = require('../../../middlewares/auth.middleware');

const authRouter = express.Router();

authRouter.post(
  '/patient/register',
  validateInput(registerSchema),
  patientRegisterController,
);

// login
authRouter.post('/login', validateInput(loginScheema), loginController);

// forget password
authRouter.post(
  '/forgetPassword',
  validateInput(forgetPasswordSchema),
  forgetPasswordController,
);

authRouter.patch(
  '/reset-password/resetToken/:resettoken',
  validateInput(resetPasswordScheema),
  resetPasswordController,
);

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
