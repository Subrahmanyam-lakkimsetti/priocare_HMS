const express = require('express');
const authRouter = require('./auth/auth.route');
const { patientRouter } = require('./patients/patient.route');

const apiRouter = express.Router();

// Importing route modules
apiRouter.use('/auth', authRouter);
apiRouter.use('/patients', patientRouter);

module.exports = apiRouter;
