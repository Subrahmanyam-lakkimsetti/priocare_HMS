// features/receptionist/receptionistProfile/profileService.js

import api from '../../../services/api';

export const getMyReceptionistProfileRequest = () =>
  api.get('/receptionists/me');

export const createReceptionistProfileRequest = (formData) =>
  api.post('/receptionists', formData);

export const updateReceptionistProfileRequest = (formData) =>
  api.patch('/receptionists/me', formData);
