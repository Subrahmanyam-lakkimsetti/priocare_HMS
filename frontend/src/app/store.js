import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import patientReducer from '../features/patient/patientSlice';
import profileReducer from '../features/patient/patientProfile/profileSlice';
import doctorReducer from '../features/doctor/doctorSlice';
import receptionistReducer from '../features/receptionist/receptionistSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    patient: patientReducer,
    profile: profileReducer,
    doctor: doctorReducer,
    receptionist: receptionistReducer,
  },
});
