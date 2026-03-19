import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  getStatsRequest,
  getTodayStatsRequest,
  getAllDoctorsRequest,
  getAllReceptionistsRequest,
  getPendingProfilesRequest,
  deletePendingStaffRequest,
  deActivateDoctorRequest,
  activateDoctorRequest,
  deActivateReceptionistRequest,
  activateReceptionistRequest,
  getAllPatientsRequest,
  getFrequentPatientsRequest,
  deActivatePatientRequest,
  activatePatientRequest,
  getAppointmentsByDepartmentRequest,
  getAppointmentByTokenRequest,
  cancelAppointmentRequest,
  createDoctorRequest,
  createReceptionistRequest,
} from './adminService';

export const fetchStats = createAsyncThunk('admin/fetchStats', async () => {
  const res = await getStatsRequest();
  return res.data.data;
});

export const fetchTodayStats = createAsyncThunk(
  'admin/fetchTodayStats',
  async (date) => {
    const res = await getTodayStatsRequest(date);
    return res.data.data;
  },
);

export const fetchAllDoctors = createAsyncThunk(
  'admin/fetchAllDoctors',
  async () => {
    const res = await getAllDoctorsRequest();
    return res.data.data;
  },
);

export const fetchAllReceptionists = createAsyncThunk(
  'admin/fetchAllReceptionists',
  async () => {
    const res = await getAllReceptionistsRequest();
    return res.data.data;
  },
);

export const fetchPendingProfiles = createAsyncThunk(
  'admin/fetchPendingProfiles',
  async (role) => {
    const res = await getPendingProfilesRequest(role);
    return { role, data: res.data.data };
  },
);

export const deletePendingStaff = createAsyncThunk(
  'admin/deletePendingStaff',
  async ({ id, role }, { rejectWithValue }) => {
    try {
      await deletePendingStaffRequest(id);
      return { id, role };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to delete');
    }
  },
);

export const deActivateDoctor = createAsyncThunk(
  'admin/deActivateDoctor',
  async (id) => {
    const res = await deActivateDoctorRequest(id);
    return res.data.data;
  },
);

export const activateDoctor = createAsyncThunk(
  'admin/activateDoctor',
  async (id) => {
    const res = await activateDoctorRequest(id);
    return res.data.data;
  },
);

export const deActivateReceptionist = createAsyncThunk(
  'admin/deActivateReceptionist',
  async (id) => {
    const res = await deActivateReceptionistRequest(id);
    return res.data.data;
  },
);

export const activateReceptionist = createAsyncThunk(
  'admin/activateReceptionist',
  async (id) => {
    const res = await activateReceptionistRequest(id);
    return res.data.data;
  },
);

export const fetchAllPatients = createAsyncThunk(
  'admin/fetchAllPatients',
  async () => {
    const res = await getAllPatientsRequest();
    return res.data.data;
  },
);

export const fetchFrequentPatients = createAsyncThunk(
  'admin/fetchFrequentPatients',
  async () => {
    const res = await getFrequentPatientsRequest();
    return res.data.data;
  },
);

export const deActivatePatient = createAsyncThunk(
  'admin/deActivatePatient',
  async (id) => {
    const res = await deActivatePatientRequest(id);
    return res.data.data;
  },
);

export const activatePatient = createAsyncThunk(
  'admin/activatePatient',
  async (id) => {
    const res = await activatePatientRequest(id);
    return res.data.data;
  },
);

export const fetchAppointmentsByDepartment = createAsyncThunk(
  'admin/fetchAppointmentsByDepartment',
  async () => {
    const res = await getAppointmentsByDepartmentRequest();
    return res.data.data;
  },
);

export const fetchAppointmentByToken = createAsyncThunk(
  'admin/fetchAppointmentByToken',
  async (token) => {
    const res = await getAppointmentByTokenRequest(token);
    return res.data.data;
  },
);

export const cancelAppointment = createAsyncThunk(
  'admin/cancelAppointment',
  async (token) => {
    const res = await cancelAppointmentRequest(token);
    return { token, data: res.data.data };
  },
);

export const createDoctor = createAsyncThunk(
  'admin/createDoctor',
  async (data, { rejectWithValue }) => {
    try {
      const res = await createDoctorRequest(data);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to create doctor',
      );
    }
  },
);

export const createReceptionist = createAsyncThunk(
  'admin/createReceptionist',
  async (data, { rejectWithValue }) => {
    try {
      const res = await createReceptionistRequest(data);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to create receptionist',
      );
    }
  },
);