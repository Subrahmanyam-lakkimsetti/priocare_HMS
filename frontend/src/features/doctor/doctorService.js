import api from '../../services/api';

export const getQueueRequest = (date) => api.get(`/doctors/queue?date=${date}`);

export const callNextPatientRequest = (date) =>
  api.patch(`/doctors/patients/callNext?date=${date}`);

export const startConsultationRequest = () =>
  api.patch(`/doctors/patients/start-consultation`);

export const endConsultationRequest = (token) =>
  api.patch(`/doctors/patients/${token}/end-consultation`);

export const getAiSummaryRequest = (token) =>
  api.get(`/doctors/appointment/token/${token}`);

export const getActiveConsultationRequest = () =>
  api.get(`/doctors/patients/active`);

export const getTreatedHistoryRequest = () =>
  api.get(`/doctors/patients/treatment-complemented`);
