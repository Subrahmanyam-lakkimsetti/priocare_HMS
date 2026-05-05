// features/doctor/doctorProfile/profileService.js

import api from '../../../services/api';

export const getMyDoctorProfileRequest = () => api.get('/doctors/me');

export const createDoctorProfileRequest = (formData) =>
  api.post('/doctors', formData);

export const updateDoctorProfileRequest = (formData) =>
  api.patch('/doctors/me', formData);
