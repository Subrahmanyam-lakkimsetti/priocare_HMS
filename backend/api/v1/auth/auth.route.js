const express = require('express');
const { registerSchema, loginScheema } = require('./auth.validation');
const { validateInput } = require('../../../middlewares/validation.middleware');
const { patientRegisterController, loginController } = require('./auth.controller');

const authRouter = express.Router();

authRouter.post('/register', validateInput(registerSchema), patientRegisterController);

authRouter.post('/login', validateInput(loginScheema), loginController)

module.exports = authRouter;
