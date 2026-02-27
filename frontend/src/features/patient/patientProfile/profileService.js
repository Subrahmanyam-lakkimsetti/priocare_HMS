// features/patientProfile/profileService.js

import api from '../../../services/api';

export const getMyProfileRequest = () => api.get('/patients/me');

export const createProfileRequest = (formData) =>
  api.post('/patients', formData);

export const updateProfileRequest = (formData) =>
  api.patch('/patients/me', formData);

export const updatePasswordRequest = (payload) =>
  api.patch('/auth/me/updatePassword', payload);
