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

export const rescheduleAppointmentRequest = (token, payload) =>
  api.patch(`/appointments/token/${token}/reschedule`, payload);

// Manual assign - get available doctors based on symptoms/triage
export const getAvailableDoctorsRequest = (payload) =>
  api.post('/appointments/available-doctors', payload);

// Manual assign - create appointment with chosen doctor
export const createAppointmentManualAssignRequest = (payload) =>
  api.post('/appointments/manual-assign/create-appointment', payload);

export const getPrescriptionByAppointmentTokenRequest = (token) =>
  api.get(`/patients/appt/${token}/prescription`);

export const askAssistantRequest = (payload) =>
  api.post('/assistant/ask', payload);

export const getAssistantConversationRequest = (conversationId) =>
  api.get(`/assistant/conversations/${conversationId}`);

export const getAssistantConversationsRequest = (params) =>
  api.get('/assistant/conversations', { params });

export const escalateAssistantConversationRequest = (payload) =>
  api.post('/assistant/escalate', payload);

export const getAssistantAppointmentContextRequest = (appointmentId) => {
  if (appointmentId) {
    return api.get(`/assistant/appointment-context/${appointmentId}`);
  }

  return api.get('/assistant/appointment-context');
};

export const getIntakeAutofillRequest = (payload) =>
  api.post('/assistant/intake-autofill', payload);

export const getIntakeFromChatRequest = (payload) =>
  api.post('/assistant/intake-from-chat', payload);

export const deleteAssistantConversationRequest = (conversationId) =>
  api.delete(`/assistant/conversations/${conversationId}`);
