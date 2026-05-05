import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import patientReducer from '../features/patient/patientSlice';
import profileReducer from '../features/patient/patientProfile/profileSlice';
import doctorProfileReducer from '../features/doctor/doctorProfile/profileSlice';
import doctorReducer from '../features/doctor/doctorSlice';
import receptionistProfileReducer from '../features/receptionist/receptionistProfile/profileSlice';
import receptionistReducer from '../features/receptionist/receptionistSlice';
import adminReducer from '../features/admin/adminSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    patient: patientReducer,
    profile: profileReducer,
    doctorProfile: doctorProfileReducer,
    doctor: doctorReducer,
    receptionistProfile: receptionistProfileReducer,
    receptionist: receptionistReducer,
    admin: adminReducer,
  },
});
