import api from '../../services/api';

export const createAppointmentRequest = (payload) =>
  api.post('/appointments', payload);

export const getActiveAppointmentRequest = () =>
  api.get('/appointments/me/active');

export const getAppointmentByTokenRequest = (token) =>
  api.get(`/appointments/token/${token}`);

export const getAllAppointmentsRequest = () => api.get('/appointments/all');

export const cancelAppointmentRequest = (token) =>
  api.patch(`/appointments/token/${token}/cancel`);

// Manual assign - get available doctors based on symptoms/triage
export const getAvailableDoctorsRequest = (payload) =>
  api.post('/appointments/available-doctors', payload);

// Manual assign - create appointment with chosen doctor
export const createAppointmentManualAssignRequest = (payload) =>
  api.post('/appointments/manual-assign/create-appointment', payload);
