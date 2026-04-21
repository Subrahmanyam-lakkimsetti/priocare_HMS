import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  createAppointmentRequest,
  getActiveAppointmentRequest,
  getAppointmentByTokenRequest,
  getAllAppointmentsRequest,
  cancelAppointmentRequest,
  rescheduleAppointmentRequest,
  getAvailableDoctorsRequest,
  createAppointmentManualAssignRequest,
  askAssistantRequest,
  getAssistantConversationRequest,
  getAssistantConversationsRequest,
  escalateAssistantConversationRequest,
  getAssistantAppointmentContextRequest,
  getIntakeAutofillRequest,
  deleteAssistantConversationRequest,
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
  async (token, { rejectWithValue }) => {
    try {
      const res = await cancelAppointmentRequest(token);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to cancel appointment',
      );
    }
  },
);

export const rescheduleAppointment = createAsyncThunk(
  'patient/rescheduleAppointment',
  async ({ token, scheduledDate, reason }, { rejectWithValue }) => {
    try {
      const res = await rescheduleAppointmentRequest(token, {
        scheduledDate,
        reason,
      });
      return res.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to reschedule appointment',
      );
    }
  },
);

// Fetch available doctors for manual assignment
export const fetchAvailableDoctors = createAsyncThunk(
  'patient/fetchAvailableDoctors',
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
      const res = await getAvailableDoctorsRequest(payload);
      return res.data.data.doctors;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to fetch doctors',
      );
    }
  },
);

// Create appointment with manually chosen doctor
export const createAppointmentManualAssign = createAsyncThunk(
  'patient/createAppointmentManualAssign',
  async ({ intake, doctorId, triageData }, { rejectWithValue }) => {
    try {
      const payload = {
        triageData: {
          description: intake.description,
          symptoms: intake.symptoms,
          comorbidities: intake.comorbidities,
          age: Number(intake.age),
          vitals: intake.vitals,
          priorityScore: triageData.priorityScore,
          severityLevel: triageData.severityLevel,
          recommendedSpecialization: triageData.recommendedSpecialization,
        },
        scheduledDate: intake.scheduledDate,
        doctorId,
      };
      await createAppointmentManualAssignRequest(payload);
      return true;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Unable to submit appointment',
      );
    }
  },
);

export const askPriocareAssistant = createAsyncThunk(
  'patient/askPriocareAssistant',
  async (payload, { rejectWithValue }) => {
    try {
      const askRes = await askAssistantRequest(payload);
      const askData = askRes.data?.data;

      if (askData?.conversationId) {
        const conversationRes = await getAssistantConversationRequest(
          askData.conversationId,
        );
        const conversation = conversationRes.data?.data;
        return {
          ask: askData,
          conversation,
        };
      }

      return {
        ask: askData,
        conversation: null,
      };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Assistant failed to respond',
      );
    }
  },
);

export const fetchAssistantConversation = createAsyncThunk(
  'patient/fetchAssistantConversation',
  async (conversationId, { rejectWithValue }) => {
    try {
      const res = await getAssistantConversationRequest(conversationId);
      return res.data?.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to load assistant conversation',
      );
    }
  },
);

export const fetchAssistantConversations = createAsyncThunk(
  'patient/fetchAssistantConversations',
  async (params, { rejectWithValue }) => {
    try {
      const res = await getAssistantConversationsRequest(params);
      return res.data?.data || [];
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to load conversations',
      );
    }
  },
);

export const escalateAssistantConversation = createAsyncThunk(
  'patient/escalateAssistantConversation',
  async (payload, { rejectWithValue }) => {
    try {
      const res = await escalateAssistantConversationRequest(payload);
      return res.data?.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to escalate conversation',
      );
    }
  },
);

export const fetchAssistantAppointmentContext = createAsyncThunk(
  'patient/fetchAssistantAppointmentContext',
  async (appointmentId, { rejectWithValue }) => {
    try {
      const res = await getAssistantAppointmentContextRequest(appointmentId);
      return res.data?.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to load assistant context',
      );
    }
  },
);

export const fetchIntakeAutofill = createAsyncThunk(
  'patient/fetchIntakeAutofill',
  async (payload, { rejectWithValue }) => {
    try {
      const res = await getIntakeAutofillRequest(payload);
      return res.data?.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Unable to generate intake suggestions',
      );
    }
  },
);

export const deleteAssistantConversation = createAsyncThunk(
  'patient/deleteAssistantConversation',
  async (conversationId, { rejectWithValue }) => {
    try {
      await deleteAssistantConversationRequest(conversationId);
      return conversationId;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to delete conversation',
      );
    }
  },
);
