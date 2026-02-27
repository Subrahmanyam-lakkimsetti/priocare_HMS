import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import patientReducer from '../features/patient/patientSlice';
import profileReducer from '../features/patient/patientProfile/profileSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    patient: patientReducer,
    profile: profileReducer,
  },
});
