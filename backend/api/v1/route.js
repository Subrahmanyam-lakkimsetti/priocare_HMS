const express = require('express');
const authRouter = require('./auth/auth.route');
const { patientRouter } = require('./patients/patient.route');
const adminRouter = require('./admin/admin.routes');
const { doctorRouter } = require('./doctors/doctor.route');
const { appointementRouter } = require('./appointments/appointment.route');

const apiRouter = express.Router();

// Importing route modules

apiRouter.use('/admin', adminRouter);

apiRouter.use('/auth', authRouter);
apiRouter.use('/patients', patientRouter);
apiRouter.use('/doctors', doctorRouter);

apiRouter.use('/appointments', appointementRouter);

module.exports = apiRouter;
