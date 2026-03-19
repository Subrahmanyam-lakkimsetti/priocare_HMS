import api from '../../services/api';

// Stats
export const getStatsRequest = () => api.get('/admin/stats');
export const getTodayStatsRequest = (date) =>
  api.get(`/admin/today-stats?date=${date}`);

// Staff
export const getAllDoctorsRequest = () => api.get('/admin/all-doctors');
export const getAllReceptionistsRequest = () =>
  api.get('/admin/all-receptionists');
export const getPendingProfilesRequest = (role) =>
  api.get(`/admin/all-panding-staff?role=${role}`);
export const deletePendingStaffRequest = (id) =>
  api.delete(`/admin/delete-pending-staff-member/${id}`);
export const deActivateDoctorRequest = (id) =>
  api.patch(`/admin/de-activate-doctor/${id}`);
export const activateDoctorRequest = (id) =>
  api.patch(`/admin/activate-doctor/${id}`);
export const deActivateReceptionistRequest = (id) =>
  api.patch(`/admin/de-activate-receptionist/${id}`);
export const activateReceptionistRequest = (id) =>
  api.patch(`/admin/activate-receptionist/${id}`);

// Patients
export const getAllPatientsRequest = () => api.get('/admin/all-patients');
export const getFrequentPatientsRequest = () =>
  api.get('/admin/frequently-visit-patients');
export const deActivatePatientRequest = (id) =>
  api.patch(`/admin/de-activate/patient/${id}`);
export const activatePatientRequest = (id) =>
  api.patch(`/admin/activate/patient/${id}`);

// Appointments
export const getAppointmentsByDepartmentRequest = () =>
  api.get('/admin/appointments-by-department');
export const getAppointmentByTokenRequest = (token) =>
  api.get(`/admin/appointment-by-token/${token}`);
export const cancelAppointmentRequest = (token) =>
  api.patch(`/admin/cancel-appointment/${token}`);

// Creation
export const createDoctorRequest = (data) => api.post('/admin/doctors', data);
export const createReceptionistRequest = (data) =>
  api.post('/admin/receptionists', data);