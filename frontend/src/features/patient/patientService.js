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
