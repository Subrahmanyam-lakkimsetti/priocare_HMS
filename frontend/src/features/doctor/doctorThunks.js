import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  getQueueRequest,
  callNextPatientRequest,
  startConsultationRequest,
  endConsultationRequest,
  getAiSummaryRequest,
  getActiveConsultationRequest,
  getTreatedHistoryRequest,
} from './doctorService';

export const fetchQueue = createAsyncThunk(
  'doctor/fetchQueue',
  async (date) => {
    const res = await getQueueRequest(date);
    return res.data.data;
  },
);

export const callNextPatient = createAsyncThunk(
  'doctor/callNext',
  async (date) => {
    const res = await callNextPatientRequest(date);
    return res.data.data;
  },
);

export const startConsultation = createAsyncThunk(
  'doctor/startConsultation',
  async () => {
    const res = await startConsultationRequest();
    return res.data.data;
  },
);

export const endConsultation = createAsyncThunk(
  'doctor/endConsultation',
  async (token) => {
    await endConsultationRequest(token);
    return token;
  },
);

export const fetchAiSummary = createAsyncThunk(
  'doctor/fetchAiSummary',
  async (token) => {
    const res = await getAiSummaryRequest(token);
    return res.data.data;
  },
);

export const fetchActiveConsultation = createAsyncThunk(
  'doctor/fetchActiveConsultation',
  async (_, { dispatch }) => {
    const res = await getActiveConsultationRequest();
    const appointments = res.data.data;

    if (!Array.isArray(appointments)) return [];

    const active = appointments.find((a) => a.status === 'in_consultation');
    if (active?.token) {
      dispatch(fetchAiSummary(active.token));
    }

    return JSON.parse(JSON.stringify(appointments));
  },
);

export const fetchTreatedHistory = createAsyncThunk(
  'doctor/fetchTreatedHistory',
  async () => {
    const res = await getTreatedHistoryRequest();
    return JSON.parse(JSON.stringify(res.data.data));
  },
);
