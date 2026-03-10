import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  getDashboardStatsRequest,
  getTodaysAppointmentsRequest,
  checkinPatientRequest,
  getQueueStatusRequest,
  getRecentCheckinsRequest,
  getAppointmentByTokenRequest,
} from './receptionistService';

export const fetchDashboardStats = createAsyncThunk(
  'receptionist/dashboard',
  async (_, { rejectWithValue }) => {
    try {
      const res = await getDashboardStatsRequest();
      return res.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to fetch stats',
      );
    }
  },
);

export const fetchTodaysAppointments = createAsyncThunk(
  'receptionist/appointments',
  async (_, { rejectWithValue }) => {
    try {
      const res = await getTodaysAppointmentsRequest();
      return res.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to fetch appointments',
      );
    }
  },
);

export const checkinPatient = createAsyncThunk(
  'receptionist/checkin',
  async (token, { rejectWithValue }) => {
    try {
      const res = await checkinPatientRequest(token);
      // Guard: only return if response has actual data
      const data = res.data?.data;
      if (
        !data ||
        res.data?.status === 'fail' ||
        res.data?.status === 'error'
      ) {
        return rejectWithValue(res.data?.message || 'Check-in failed');
      }
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Check-in failed');
    }
  },
);

export const fetchQueueStatus = createAsyncThunk(
  'receptionist/queue',
  async (_, { rejectWithValue }) => {
    try {
      const res = await getQueueStatusRequest();
      return res.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to fetch queue',
      );
    }
  },
);

export const fetchRecentCheckins = createAsyncThunk(
  'receptionist/recent',
  async (_, { rejectWithValue }) => {
    try {
      const res = await getRecentCheckinsRequest();
      return res.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to fetch check-ins',
      );
    }
  },
);

export const fetchAppointmentByToken = createAsyncThunk(
  'receptionist/appointmentByToken',
  async (token, { rejectWithValue }) => {
    try {
      const res = await getAppointmentByTokenRequest(token);
      // If API returns 200 but with status:"fail", treat as not found
      if (
        !res.data?.data ||
        res.data?.status === 'fail' ||
        res.data?.status === 'error'
      ) {
        return rejectWithValue(res.data?.message || 'No appointment found');
      }
      return res.data.data;
    } catch (err) {
      // API returned 4xx/5xx — also "not found"
      return rejectWithValue(
        err.response?.data?.message || 'No appointment found',
      );
    }
  },
);