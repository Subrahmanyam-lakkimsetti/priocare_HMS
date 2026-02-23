import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  createAppointmentRequest,
  getActiveAppointmentRequest,
  getAppointmentByTokenRequest,
  getAllAppointmentsRequest,
  cancelAppointmentRequest,
} from './patientService';

export const createAppointment = createAsyncThunk(
  'patient/createAppointment',
  async (intake, { rejectWithValue }) => {
    try {
      const payload = {
        scheduledDate: intake.scheduledDate,
        triage: {
          description: intake.description,
          symptoms: intake.symptoms,
          comorbidities: intake.comorbidities,
          age: Number(intake.age),
          vitals: intake.vitals,
        },
      };

      await createAppointmentRequest(payload);
      return true;
    } catch {
      return rejectWithValue('Unable to submit appointment');
    }
  },
);

export const fetchActiveAppointment = createAsyncThunk(
  'patient/fetchActiveAppointment',
  async (_, { rejectWithValue }) => {
    try {
      const res = await getActiveAppointmentRequest();
      return res.data.data;
    } catch {
      return rejectWithValue(null);
    }
  },
);

export const fetchAppointmentByToken = createAsyncThunk(
  'patient/fetchAppointmentByToken',
  async (token, { rejectWithValue }) => {
    try {
      const res = await getAppointmentByTokenRequest(token);
      return res.data.data;
    } catch {
      return rejectWithValue(null);
    }
  },
);

export const fetchAllAppointments = createAsyncThunk(
  'patient/appointments',
  async (_, { rejectWithValue }) => {
    try {
      const res = await getAllAppointmentsRequest();
      return res.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to load appointments',
      );
    }
  },
);

export const cancelAppointment = createAsyncThunk(
  'patient/cancelAppointment',
  async (id, { rejectWithValue }) => {
    try {
      await cancelAppointmentRequest(id);
      return id;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to cancel appointment',
      );
    }
  },
);
