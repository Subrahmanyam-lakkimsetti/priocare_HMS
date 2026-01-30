const express = require('express');
const { registerSchema, loginScheema } = require('./auth.validation');
const { validateInput } = require('../../../middlewares/validation.middleware');
const {
  patientRegisterController,
  loginController,
  logoutController,
  getMe,
} = require('./auth.controller');
const { authMiddleware } = require('../../../middlewares/auth.middleware');

const authRouter = express.Router();

authRouter.post(
  '/register',
  validateInput(registerSchema),
  patientRegisterController,
);

authRouter.post('/login', validateInput(loginScheema), loginController);

// protected routes
authRouter.use(authMiddleware);

authRouter.get('/me', getMe);
authRouter.post('/logout', logoutController);

module.exports = authRouter;
