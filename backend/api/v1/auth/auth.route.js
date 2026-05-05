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
  sendOtp,
  resendOtp,
  googleAuthCallback,
} = require('./auth.controller');
const { authMiddleware } = require('../../../middlewares/auth.middleware');
const passport = require('../../../config/passport.config');

const authRouter = express.Router();

authRouter.post('/send-otp', sendOtp);
authRouter.patch('/resend-otp', resendOtp);

authRouter.post(
  '/patient/register',
  validateInput(registerSchema),
  patientRegisterController,
);

// login
authRouter.post('/login', validateInput(loginScheema), loginController);

// Google OAuth routes
authRouter.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }),
);

authRouter.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: `${process.env.FRONTEND_URL}/login`,
  }),
  googleAuthCallback,
);

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
