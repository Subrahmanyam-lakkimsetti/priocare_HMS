const express = require('express');
const { registerSchema } = require('./auth.validation');
const { validate } = require('../../../utils/validation.util');
const { patientRegisterController } = require('./auth.controller');

const authRouter = express.Router();

authRouter.post('/register', validate(registerSchema), patientRegisterController);

module.exports = authRouter;
