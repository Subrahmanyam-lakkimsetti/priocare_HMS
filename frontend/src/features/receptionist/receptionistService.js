import api from '../../services/api';

export const getDashboardStatsRequest = () => {
  const today = new Date().toISOString().split('T')[0];
  return api.get(`/receptionists/dashboard?date=${today}`);
};

export const getTodaysAppointmentsRequest = () => {
  const today = new Date().toISOString().split('T')[0];
  return api.get(`/receptionists/appointments?date=${today}`);
};

export const getQueueStatusRequest = () => {
  const today = new Date().toISOString().split('T')[0];
  return api.get(`/receptionists/queues?date=${today}`);
};

export const checkinPatientRequest = (token) =>
  api.patch(`/receptionists/patient-checkin/token/${token}`);

export const getRecentCheckinsRequest = () =>
  api.get('/receptionists/checkins/recent');

export const getAppointmentByTokenRequest = (token) =>
  api.get(`/receptionists/appointments/token/${token}`);