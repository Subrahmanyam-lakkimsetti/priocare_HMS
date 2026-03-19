import { createSlice } from '@reduxjs/toolkit';
import {
  fetchStats,
  fetchTodayStats,
  fetchAllDoctors,
  fetchAllReceptionists,
  fetchPendingProfiles,
  deletePendingStaff,
  deActivateDoctor,
  activateDoctor,
  deActivateReceptionist,
  activateReceptionist,
  fetchAllPatients,
  fetchFrequentPatients,
  deActivatePatient,
  activatePatient,
  fetchAppointmentsByDepartment,
  fetchAppointmentByToken,
  cancelAppointment,
  createDoctor,
  createReceptionist,
} from './adminThunks';

const initialState = {
  // Stats
  stats: null,
  todayStats: null,
  statsLoading: false,
  todayStatsLoading: false,

  // Staff
  doctors: [],
  receptionists: [],
  pendingDoctors: [], // isProfileComplete: false, role: doctor
  pendingReceptionists: [], // isProfileComplete: false, role: receptionist
  staffLoading: false,

  // Patients
  patients: [],
  frequentPatients: [],
  patientsLoading: false,

  // Appointments
  appointmentsByDept: [],
  appointmentsLoading: false,

  // Token modal
  tokenAppointment: null,
  tokenLoading: false,

  // Creation
  createLoading: false,
  createError: null,
  createSuccess: false,

  error: null,
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    clearCreateState(state) {
      state.createLoading = false;
      state.createError = null;
      state.createSuccess = false;
    },
    clearTokenAppointment(state) {
      state.tokenAppointment = null;
    },
  },
  extraReducers: (builder) => {
    // Stats
    builder
      .addCase(fetchStats.pending, (state) => {
        state.statsLoading = true;
      })
      .addCase(fetchStats.fulfilled, (state, action) => {
        state.stats = action.payload;
        state.statsLoading = false;
      })
      .addCase(fetchStats.rejected, (state) => {
        state.statsLoading = false;
      });

    // Today Stats
    builder
      .addCase(fetchTodayStats.pending, (state) => {
        state.todayStatsLoading = true;
      })
      .addCase(fetchTodayStats.fulfilled, (state, action) => {
        state.todayStats = action.payload;
        state.todayStatsLoading = false;
      })
      .addCase(fetchTodayStats.rejected, (state) => {
        state.todayStatsLoading = false;
      });

    // Doctors
    builder
      .addCase(fetchAllDoctors.pending, (state) => {
        state.staffLoading = true;
      })
      .addCase(fetchAllDoctors.fulfilled, (state, action) => {
        state.doctors = action.payload;
        state.staffLoading = false;
      })
      .addCase(fetchAllDoctors.rejected, (state) => {
        state.staffLoading = false;
      });

    // Receptionists
    builder.addCase(fetchAllReceptionists.fulfilled, (state, action) => {
      state.receptionists = action.payload;
    });

    // Pending profiles (isProfileComplete: false)
    builder.addCase(fetchPendingProfiles.fulfilled, (state, action) => {
      const { role, data } = action.payload;
      if (role === 'doctor') state.pendingDoctors = data;
      else state.pendingReceptionists = data;
    });

    // Delete pending staff member (removes from list instantly)
    builder.addCase(deletePendingStaff.fulfilled, (state, action) => {
      const { id, role } = action.payload;
      if (role === 'doctor') {
        state.pendingDoctors = state.pendingDoctors.filter((u) => u._id !== id);
      } else {
        state.pendingReceptionists = state.pendingReceptionists.filter(
          (u) => u._id !== id,
        );
      }
    });

    // Deactivate/Activate Doctor
    builder
      .addCase(deActivateDoctor.fulfilled, (state, action) => {
        const updated = action.payload;
        state.doctors = state.doctors.map((dept) => ({
          ...dept,
          doctors: dept.doctors.map((d) =>
            d._id === updated._id ? { ...d, isActive: false } : d,
          ),
        }));
      })
      .addCase(activateDoctor.fulfilled, (state, action) => {
        const updated = action.payload;
        state.doctors = state.doctors.map((dept) => ({
          ...dept,
          doctors: dept.doctors.map((d) =>
            d._id === updated._id ? { ...d, isActive: true } : d,
          ),
        }));
      });

    // Deactivate/Activate Receptionist
    builder
      .addCase(deActivateReceptionist.fulfilled, (state, action) => {
        const updated = action.payload;
        state.receptionists = state.receptionists.map((r) =>
          r._id === updated._id ? { ...r, isActive: false } : r,
        );
      })
      .addCase(activateReceptionist.fulfilled, (state, action) => {
        const updated = action.payload;
        state.receptionists = state.receptionists.map((r) =>
          r._id === updated._id ? { ...r, isActive: true } : r,
        );
      });

    // Patients
    builder
      .addCase(fetchAllPatients.pending, (state) => {
        state.patientsLoading = true;
      })
      .addCase(fetchAllPatients.fulfilled, (state, action) => {
        state.patients = action.payload;
        state.patientsLoading = false;
      })
      .addCase(fetchAllPatients.rejected, (state) => {
        state.patientsLoading = false;
      });

    builder.addCase(fetchFrequentPatients.fulfilled, (state, action) => {
      state.frequentPatients = action.payload;
    });

    // Deactivate/Activate Patient
    builder
      .addCase(deActivatePatient.fulfilled, (state, action) => {
        const updated = action.payload;
        state.patients = state.patients.map((p) =>
          p._id === updated._id ? { ...p, isActive: false } : p,
        );
      })
      .addCase(activatePatient.fulfilled, (state, action) => {
        const updated = action.payload;
        state.patients = state.patients.map((p) =>
          p._id === updated._id ? { ...p, isActive: true } : p,
        );
      });

    // Appointments
    builder
      .addCase(fetchAppointmentsByDepartment.pending, (state) => {
        state.appointmentsLoading = true;
      })
      .addCase(fetchAppointmentsByDepartment.fulfilled, (state, action) => {
        state.appointmentsByDept = action.payload;
        state.appointmentsLoading = false;
      })
      .addCase(fetchAppointmentsByDepartment.rejected, (state) => {
        state.appointmentsLoading = false;
      });

    // Token modal
    builder
      .addCase(fetchAppointmentByToken.pending, (state) => {
        state.tokenLoading = true;
        state.tokenAppointment = null;
      })
      .addCase(fetchAppointmentByToken.fulfilled, (state, action) => {
        state.tokenAppointment = action.payload;
        state.tokenLoading = false;
      })
      .addCase(fetchAppointmentByToken.rejected, (state) => {
        state.tokenLoading = false;
      });

    // Cancel Appointment
    builder.addCase(cancelAppointment.fulfilled, (state, action) => {
      const { token } = action.payload;
      state.appointmentsByDept = state.appointmentsByDept.map((dept) => ({
        ...dept,
        appointments: dept.appointments.map((a) =>
          a.token === token ? { ...a, status: 'cancelled' } : a,
        ),
      }));
      if (state.tokenAppointment?.token === token) {
        state.tokenAppointment = {
          ...state.tokenAppointment,
          status: 'cancelled',
        };
      }
    });

    // Create
    builder
      .addCase(createDoctor.pending, (state) => {
        state.createLoading = true;
        state.createError = null;
        state.createSuccess = false;
      })
      .addCase(createDoctor.fulfilled, (state) => {
        state.createLoading = false;
        state.createSuccess = true;
      })
      .addCase(createDoctor.rejected, (state, action) => {
        state.createLoading = false;
        state.createError = action.payload;
      });

    builder
      .addCase(createReceptionist.pending, (state) => {
        state.createLoading = true;
        state.createError = null;
        state.createSuccess = false;
      })
      .addCase(createReceptionist.fulfilled, (state) => {
        state.createLoading = false;
        state.createSuccess = true;
      })
      .addCase(createReceptionist.rejected, (state, action) => {
        state.createLoading = false;
        state.createError = action.payload;
      });
  },
});

export const { clearCreateState, clearTokenAppointment } = adminSlice.actions;
export default adminSlice.reducer;