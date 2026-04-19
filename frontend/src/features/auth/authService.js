import api from '../../services/api';

export const loginRequest = async (credentials) => {
  const res = await api.post('/auth/login', credentials);
  return res.data;
};

export const logoutRequest = async () => {
  await api.post('/auth/logout');
};

export const getMeRequest = async () => {
  const res = await api.get('/auth/me');
  return res.data;
};

export const registerRequest = async (userData) => {
  const res = await api.post('/auth/patient/register', userData);
  return res.data;
};

export const sendOtpRequest = async ({ email }) => {
  const res = await api.post('/auth/send-otp', { email });
  return res.data;
};

export const resendOtpRequest = async ({ email }) => {
  const res = await api.patch('/auth/resend-otp', { email });
  return res.data;
};