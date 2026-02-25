import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllAppointments, cancelAppointment } from '../patientThunks';

const STATUS_CONFIG = {
  confirmed: {
    label: 'Confirmed',
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
    dot: 'bg-blue-500',
  },
  checked_in: {
    label: 'Checked In',
    bg: 'bg-cyan-50',
    text: 'text-cyan-700',
    border: 'border-cyan-200',
    dot: 'bg-cyan-500',
  },
  in_progress: {
    label: 'In Progress',
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
    dot: 'bg-amber-500',
  },
  completed: {
    label: 'Completed',
    bg: 'bg-green-50',
    text: 'text-green-700',
    border: 'border-green-200',
    dot: 'bg-green-500',
  },
  cancelled: {
    label: 'Cancelled',
    bg: 'bg-red-50',
    text: 'text-red-600',
    border: 'border-red-200',
    dot: 'bg-red-400',
  },
};

function fmt(dateStr, mode = 'date') {
  const d = new Date(dateStr);
  if (mode === 'date')
    return d.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  if (mode === 'time')
    return d.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  return d.toLocaleDateString();
}

function InfoCell({ label, value, icon }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 text-gray-500">
        {icon}
      </div>
      <div>
        <p className="text-xs text-gray-400 font-medium mb-0.5">{label}</p>
        <p className="text-sm font-semibold text-gray-800">{value || '—'}</p>
      </div>
    </div>
  );
}

export default function PatientAppointments() {
  const dispatch = useDispatch();
  const { appointments, loadingAppointmentsList } = useSelector(
    (s) => s.patient,
  );

  useEffect(() => {
    dispatch(fetchAllAppointments());
  }, [dispatch]);

  if (loadingAppointmentsList) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
        <p className="text-sm text-gray-500 font-medium">
          Loading your appointments...
        </p>
      </div>
    );
  }

  if (!appointments?.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
        <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mb-5">
          <svg
            className="w-10 h-10 text-gray-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">
          No appointments yet
        </h3>
        <p className="text-sm text-gray-400 max-w-sm">
          Start a consultation to book your first appointment. We'll help you
          find the right doctor.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Your Appointments
          </h1>
          <div className="flex items-center gap-3">
            <span className="bg-blue-50 text-blue-700 text-sm font-semibold px-3 py-1 rounded-full">
              {appointments.length} total
            </span>
            <span className="text-sm text-gray-400">
              {appointments.filter((a) => a.status === 'completed').length}{' '}
              completed
            </span>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {appointments.map((appt) => {
            const status =
              STATUS_CONFIG[appt.status] || STATUS_CONFIG.confirmed;
            const isCancelled = appt.status === 'cancelled';
            const isCompleted = appt.status === 'completed';

            return (
              <div
                key={appt._id}
                className={`bg-white rounded-xl border-2 overflow-hidden transition-all ${
                  isCancelled
                    ? 'border-gray-100 opacity-70'
                    : isCompleted
                      ? 'border-gray-100 hover:border-gray-200'
                      : 'border-blue-100 hover:border-blue-200 hover:shadow-md'
                }`}
              >
                {/* Header with Status and Token */}
                <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${status.bg} ${status.text} ${status.border}`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${status.dot} ${!isCompleted && !isCancelled && appt.status !== 'confirmed' ? 'animate-pulse' : ''}`}
                    />
                    {status.label}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">Token</span>
                    <span className="bg-blue-700 text-white text-sm font-black px-3 py-1 rounded-lg tracking-wider">
                      {appt.token}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  {/* Doctor Info */}
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                      <span className="text-white font-bold text-lg">
                        {appt.doctorId?.firstName?.[0]}
                        {appt.doctorId?.lastName?.[0]}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-900">
                        Dr. {appt.doctorId?.firstName} {appt.doctorId?.lastName}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                          {appt.doctorId?.department}
                        </span>
                        <span className="text-xs text-gray-400">
                          {appt.doctorId?.experienceYears} yrs exp
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Key Info Grid */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-400 mb-1">Date</p>
                      <p className="text-sm font-semibold text-gray-800">
                        {fmt(appt.scheduledDate)}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-400 mb-1">Booked</p>
                      <p className="text-sm font-semibold text-gray-800">
                        {fmt(appt.createdAt)}
                      </p>
                    </div>
                  </div>

                  {/* Complaint */}
                  {appt.triage?.description && (
                    <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-3 mb-4">
                      <p className="text-xs text-blue-400 font-medium mb-1">
                        Chief Complaint
                      </p>
                      <p className="text-sm text-blue-700 font-medium">
                        {appt.triage.description}
                      </p>
                    </div>
                  )}

                  {/* Symptoms */}
                  {appt.triage?.symptoms?.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs text-gray-400 mb-2">Symptoms</p>
                      <div className="flex flex-wrap gap-1.5">
                        {appt.triage.symptoms.map((s) => (
                          <span
                            key={s}
                            className="text-xs bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Timeline (if available) */}
                  {(appt.checkedInAt ||
                    appt.calledAt ||
                    appt.consulationStartsAt) && (
                    <div className="border-t border-gray-100 pt-4 mt-2">
                      <p className="text-xs font-medium text-gray-400 mb-3">
                        Timeline
                      </p>
                      <div className="space-y-2">
                        {appt.checkedInAt && (
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">Checked In</span>
                            <span className="font-medium text-gray-700">
                              {fmt(appt.checkedInAt, 'time')}
                            </span>
                          </div>
                        )}
                        {appt.calledAt && (
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">Doctor Called</span>
                            <span className="font-medium text-gray-700">
                              {fmt(appt.calledAt, 'time')}
                            </span>
                          </div>
                        )}
                        {appt.consulationStartsAt && (
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">
                              Consultation Started
                            </span>
                            <span className="font-medium text-gray-700">
                              {fmt(appt.consulationStartsAt, 'time')}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Action - Cancel only for confirmed appointments */}
                  {appt.status === 'confirmed' && (
                    <div className="border-t border-gray-100 pt-4 mt-4">
                      <button
                        onClick={() => dispatch(cancelAppointment(appt.token))}
                        className="w-full flex items-center justify-center gap-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 px-4 py-2.5 rounded-lg transition-all"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                        Cancel Appointment
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
