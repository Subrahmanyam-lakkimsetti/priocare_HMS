const express = require('express');
const {
  restrictTo,
  authMiddleware,
} = require('../../../middlewares/auth.middleware');
const { validateInput } = require('../../../middlewares/validation.middleware');
const { doctorSchema } = require('./admin.validation');
const { createDoctorUser, createReceptionist } = require('./admin.controller');
const { getStats, getTodayStats } = require('./stats/admin.stats.controller');
const {
  getAllDoctorsByDepartment,
  deActivateDoctor,
  activateDoctor,
  deActivateReceptionist,
  activateReceptionist,
  getAllReceptionists,
  getAllStaffWithPendingProfiles,
  deletePendingStaff,
} = require('./staff/admin.staff.controller');
const {
  getPatientsWithStats,
  frequentelyVisitedPatients,
  deActivatePatient,
  activatePatient,
} = require('./patients/admin.patients.controller');
const {
  getAppointmentsByDepartment,
  cancelAppointment,
  appointmentByToken,
} = require('./appointments/admin.appointments.controller');

const adminRouter = express.Router();

adminRouter.use(authMiddleware, restrictTo('admin'));

// stats
adminRouter.get('/stats', getStats);

adminRouter.get('/today-stats', getTodayStats);

// staff
// by-department
adminRouter.get('/all-doctors', getAllDoctorsByDepartment);
adminRouter.get('/all-receptionists', getAllReceptionists);

adminRouter.get('/all-panding-staff', getAllStaffWithPendingProfiles);
adminRouter.delete('/delete-pending-staff-member/:id', deletePendingStaff);

// doctor
adminRouter.patch('/de-activate-doctor/:id', deActivateDoctor);
adminRouter.patch('/activate-doctor/:id', activateDoctor);

// receptionist
adminRouter.patch('/de-activate-receptionist/:id', deActivateReceptionist);
adminRouter.patch('/activate-receptionist/:id', activateReceptionist);

// patients
adminRouter.get('/all-patients', getPatientsWithStats);
adminRouter.get('/frequently-visit-patients', frequentelyVisitedPatients);

adminRouter.patch('/de-activate/patient/:id', deActivatePatient);
adminRouter.patch('/activate/patient/:id', activatePatient);

// appointments
adminRouter.get('/appointments-by-department', getAppointmentsByDepartment);
adminRouter.get('/appointment-by-token/:token', appointmentByToken);

adminRouter.patch('/cancel-appointment/:token', cancelAppointment);

// creation
adminRouter.post('/doctors', validateInput(doctorSchema), createDoctorUser);

adminRouter.post('/receptionists', createReceptionist);

module.exports = adminRouter;