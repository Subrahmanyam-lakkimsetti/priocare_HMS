import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchAllAppointments, cancelAppointment } from '../patientThunks';

const STATUS_CONFIG = {
  confirmed: {
    label: 'Confirmed',
    gradient: 'from-blue-500 to-indigo-500',
    gradientBg: 'bg-gradient-to-br from-blue-500 to-indigo-500',
    light: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
    dot: 'bg-blue-500',
    ring: 'ring-blue-200',
    softBg: 'bg-blue-50/60',
  },
  checked_in: {
    label: 'Checked In',
    gradient: 'from-cyan-500 to-teal-500',
    gradientBg: 'bg-gradient-to-br from-cyan-500 to-teal-500',
    light: 'bg-cyan-50',
    text: 'text-cyan-700',
    border: 'border-cyan-200',
    dot: 'bg-cyan-500',
    ring: 'ring-cyan-200',
    softBg: 'bg-cyan-50/60',
  },
  in_progress: {
    label: 'In Progress',
    gradient: 'from-amber-400 to-orange-500',
    gradientBg: 'bg-gradient-to-br from-amber-400 to-orange-500',
    light: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
    dot: 'bg-amber-500',
    ring: 'ring-amber-200',
    softBg: 'bg-amber-50/60',
  },
  completed: {
    label: 'Completed',
    gradient: 'from-emerald-400 to-green-500',
    gradientBg: 'bg-gradient-to-br from-emerald-400 to-green-500',
    light: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    dot: 'bg-emerald-500',
    ring: 'ring-emerald-200',
    softBg: 'bg-emerald-50/60',
  },
  cancelled: {
    label: 'Cancelled',
    gradient: 'from-slate-300 to-slate-400',
    gradientBg: 'bg-gradient-to-br from-slate-300 to-slate-400',
    light: 'bg-slate-50',
    text: 'text-slate-500',
    border: 'border-slate-200',
    dot: 'bg-slate-300',
    ring: 'ring-slate-200',
    softBg: 'bg-slate-50/60',
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
  if (mode === 'datetime')
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  if (mode === 'time')
    return d.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  if (mode === 'day') return d.toLocaleDateString('en-US', { day: 'numeric' });
  if (mode === 'month')
    return d.toLocaleDateString('en-US', { month: 'short' });
  if (mode === 'year')
    return d.toLocaleDateString('en-US', { year: 'numeric' });
  if (mode === 'weekday')
    return d.toLocaleDateString('en-US', { weekday: 'long' });
  if (mode === 'shortdate')
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  return d.toLocaleDateString();
}

export default function PatientAppointments() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
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
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;600&display=swap');
        .appt-wrap { font-family: 'Inter', sans-serif; }
        .mono { font-family: 'JetBrains Mono', monospace; }
        .appt-card { transition: box-shadow 0.2s ease, transform 0.2s ease; }
        .appt-card:hover { transform: translateY(-2px); box-shadow: 0 12px 32px -6px rgba(0,0,0,0.10); }
        .pulse-dot { animation: pdot 2s infinite; }
        @keyframes pdot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(1.5)} }
        .divider-v { width: 1px; background: linear-gradient(to bottom, transparent, #e2e8f0 20%, #e2e8f0 80%, transparent); }
        .view-details-btn {
          position: relative;
          overflow: hidden;
        }
        .view-details-btn::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 60%);
          opacity: 0;
          transition: opacity 0.2s ease;
        }
        .view-details-btn:hover::after { opacity: 1; }
        .view-details-btn .arrow-icon {
          transition: transform 0.2s ease;
        }
        .view-details-btn:hover .arrow-icon { transform: translateX(3px); }
      `}</style>

      <div className="appt-wrap max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-end justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1.5">
              Your Appointments
            </h1>
            <p className="text-sm text-gray-400">
              All your scheduled and past visits in one place
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="bg-blue-50 text-blue-700 text-sm font-semibold px-3 py-1 rounded-full border border-blue-100">
              {appointments.length} total
            </span>
            <span className="bg-emerald-50 text-emerald-700 text-sm font-semibold px-3 py-1 rounded-full border border-emerald-100">
              {appointments.filter((a) => a.status === 'completed').length}{' '}
              completed
            </span>
            <span className="bg-amber-50 text-amber-700 text-sm font-semibold px-3 py-1 rounded-full border border-amber-100">
              {appointments.filter((a) => a.status === 'confirmed').length}{' '}
              upcoming
            </span>
          </div>
        </div>

        {/* Timeline */}
        <div className="relative">
          <div className="absolute left-6.75 top-6 bottom-6 w-px bg-linear-to-b from-blue-200 via-gray-200 to-gray-100 hidden sm:block" />

          <div className="space-y-5">
            {appointments.map((appt) => {
              const status =
                STATUS_CONFIG[appt.status] || STATUS_CONFIG.confirmed;
              const isCancelled = appt.status === 'cancelled';
              const isCompleted = appt.status === 'completed';
              const isActive = !isCancelled && !isCompleted;
              const initials = `${appt.doctorId?.firstName?.[0] || ''}${appt.doctorId?.lastName?.[0] || ''}`;
              const timelineEvents = [
                { label: 'Checked In', icon: '✓', time: appt.checkedInAt },
                { label: 'Doctor Called', icon: '📞', time: appt.calledAt },
                {
                  label: 'Consultation',
                  icon: '🩺',
                  time: appt.consulationStartsAt,
                },
              ].filter((t) => t.time);

              return (
                <div key={appt._id} className="flex gap-4 sm:gap-5 items-start">
                  {/* Timeline dot + date */}
                  <div className="hidden sm:flex flex-col items-center shrink-0 w-14 pt-5 gap-1.5">
                    <div
                      className={`w-5 h-5 rounded-full ${status.gradientBg} ring-4 ${status.ring} ring-offset-2 z-10 shadow-sm flex items-center justify-center`}
                    >
                      {isActive && appt.status !== 'confirmed' && (
                        <span className="w-1.5 h-1.5 rounded-full bg-white opacity-90 pulse-dot" />
                      )}
                    </div>
                    <p
                      className={`mono text-base font-bold leading-none ${status.text}`}
                    >
                      {fmt(appt.scheduledDate, 'day')}
                    </p>
                    <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">
                      {fmt(appt.scheduledDate, 'month')}
                    </p>
                  </div>

                  {/* Card */}
                  <div
                    className={`appt-card flex-1 bg-white rounded-2xl border overflow-hidden ${isCancelled ? 'border-slate-100 opacity-60' : 'border-slate-200 shadow-sm'}`}
                  >
                    {/* Top accent bar */}
                    <div
                      className={`h-1 w-full bg-linear-to-r ${status.gradient}`}
                    />

                    {/* Card body: two columns */}
                    <div className="flex min-h-0">
                      {/* ── LEFT COLUMN ── */}
                      <div
                        className={`w-[42%] shrink-0 p-4 flex flex-col gap-3 ${status.softBg} border-r border-slate-100`}
                      >
                        {/* Doctor */}
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-11 h-11 ${status.gradientBg} rounded-xl flex items-center justify-center shrink-0 shadow-sm`}
                          >
                            <span className="text-white font-bold text-sm">
                              {initials}
                            </span>
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-gray-900 text-sm leading-tight truncate">
                              Dr. {appt.doctorId?.firstName}{' '}
                              {appt.doctorId?.lastName}
                            </p>
                            {appt.doctorId?.department && (
                              <p
                                className={`text-xs font-semibold mt-0.5 ${status.text} truncate`}
                              >
                                {appt.doctorId.department}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Status + Token row */}
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${status.light} ${status.text} border ${status.border}`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${status.dot} ${isActive && appt.status !== 'confirmed' ? 'pulse-dot' : ''}`}
                            />
                            {status.label}
                          </span>
                          <span
                            className={`${status.gradientBg} text-white mono text-xs font-bold px-2.5 py-1 rounded-lg tracking-wider`}
                          >
                            #{appt.token}
                          </span>
                        </div>

                        {/* Divider */}
                        <div className="border-t border-white/70" />

                        {/* Scheduled date block */}
                        <div>
                          <p className="text-xs text-gray-400 font-medium mb-1 uppercase tracking-wide">
                            Scheduled
                          </p>
                          <div
                            className={`rounded-xl p-2.5 border ${status.border} bg-white/80 flex items-center gap-2.5`}
                          >
                            <div
                              className={`w-8 h-8 ${status.gradientBg} rounded-lg flex flex-col items-center justify-center shrink-0`}
                            >
                              <span className="text-white mono text-sm font-extrabold leading-none">
                                {fmt(appt.scheduledDate, 'day')}
                              </span>
                              <span className="text-white/80 text-[9px] font-semibold uppercase leading-none mt-0.5">
                                {fmt(appt.scheduledDate, 'month')}
                              </span>
                            </div>
                            <div>
                              <p className="text-xs font-bold text-gray-700">
                                {fmt(appt.scheduledDate, 'weekday')}
                              </p>
                              <p className="text-xs text-gray-400">
                                {fmt(appt.scheduledDate, 'shortdate')},{' '}
                                {fmt(appt.scheduledDate, 'year')}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Booked on */}
                        <div>
                          <p className="text-xs text-gray-400 font-medium mb-1 uppercase tracking-wide">
                            Booked On
                          </p>
                          <div className="flex items-center gap-2 text-xs text-gray-600">
                            <svg
                              className="w-3.5 h-3.5 text-gray-400 shrink-0"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2}
                            >
                              <circle cx="12" cy="12" r="9" />
                              <path strokeLinecap="round" d="M12 7v5l3 3" />
                            </svg>
                            <span className="font-medium">
                              {fmt(appt.createdAt)}
                            </span>
                          </div>
                        </div>

                        {/* Experience */}
                        {appt.doctorId?.experienceYears && (
                          <div className="flex items-center gap-1.5 text-xs text-gray-500">
                            <svg
                              className="w-3.5 h-3.5 text-gray-400"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                              />
                            </svg>
                            <span className="font-medium">
                              {appt.doctorId.experienceYears} years experience
                            </span>
                          </div>
                        )}

                        {/* Action buttons */}
                        <div
                          className={`mt-auto flex flex-col gap-2 ${appt.status === 'confirmed' ? '' : 'pt-1'}`}
                        >
                          {/* Cancel button — only for confirmed */}
                          {appt.status === 'confirmed' && (
                            <button
                              onClick={() =>
                                dispatch(cancelAppointment(appt.token))
                              }
                              className="group flex items-center justify-center gap-1.5 text-xs font-semibold text-red-500 hover:text-red-700 bg-white hover:bg-red-50 border border-red-200 hover:border-red-300 px-3 py-2 rounded-xl transition-all w-full"
                            >
                              <svg
                                className="w-3.5 h-3.5 transition-transform group-hover:rotate-90 duration-150"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2.5}
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                              Cancel Appointment
                            </button>
                          )}

                          {/* View Details button — always shown */}
                          <button
                            onClick={() =>
                              navigate(`/patient/appointment/${appt.token}`)
                            }
                            className={`view-details-btn group flex items-center justify-center gap-1.5 text-xs font-semibold text-white px-3 py-2 rounded-xl transition-all w-full bg-linear-to-r ${status.gradient} shadow-sm hover:shadow-md hover:opacity-95 active:scale-[0.98]`}
                          >
                            <svg
                              className="w-3.5 h-3.5 shrink-0"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2.5}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                              />
                            </svg>
                            View Details
                            <svg
                              className="w-3 h-3 shrink-0 arrow-icon"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2.5}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M9 5l7 7-7 7"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>

                      {/* ── RIGHT COLUMN ── */}
                      <div className="flex-1 p-4 flex flex-col gap-3 min-w-0">
                        {/* Chief Complaint */}
                        {appt.triage?.description ? (
                          <div>
                            <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-1.5">
                              Chief Complaint
                            </p>
                            <div
                              className={`rounded-xl px-3 py-2.5 border ${status.border} ${status.light}`}
                            >
                              <p
                                className={`text-sm font-semibold ${status.text} leading-relaxed`}
                              >
                                {appt.triage.description}
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-1.5">
                              Chief Complaint
                            </p>
                            <p className="text-xs text-gray-300 italic">
                              No complaint recorded
                            </p>
                          </div>
                        )}

                        {/* Symptoms */}
                        {appt.triage?.symptoms?.length > 0 && (
                          <div>
                            <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-1.5">
                              Symptoms
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                              {appt.triage.symptoms.map((s) => (
                                <span
                                  key={s}
                                  className="text-xs bg-white border border-gray-200 text-gray-600 font-medium px-2.5 py-1 rounded-full shadow-sm"
                                >
                                  {s}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Visit Timeline — horizontal */}
                        <div className="mt-auto pt-3 border-t border-gray-100">
                          <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-2.5">
                            Visit Timeline
                          </p>
                          {timelineEvents.length > 0 ? (
                            <div className="flex items-start gap-0">
                              {timelineEvents.map((t, i) => (
                                <div
                                  key={t.label}
                                  className="flex items-center flex-1 min-w-0"
                                >
                                  {/* Step */}
                                  <div className="flex flex-col items-center min-w-0 flex-1">
                                    <div
                                      className={`w-6 h-6 rounded-full ${status.gradientBg} flex items-center justify-center shadow-sm shrink-0`}
                                    >
                                      <span className="text-white text-[9px] font-bold">
                                        {i + 1}
                                      </span>
                                    </div>
                                    <p className="text-xs font-semibold text-gray-700 mt-1.5 text-center leading-tight px-1">
                                      {t.label}
                                    </p>
                                    <p
                                      className={`mono text-[10px] ${status.text} font-medium mt-0.5 text-center`}
                                    >
                                      {fmt(t.time, 'shortdate')}
                                    </p>
                                    <p
                                      className={`mono text-[10px] ${status.text} font-semibold text-center`}
                                    >
                                      {fmt(t.time, 'time')}
                                    </p>
                                  </div>
                                  {/* Connector line */}
                                  {i < timelineEvents.length - 1 && (
                                    <div
                                      className={`h-px flex-1 mx-1 -mt-7 ${status.dot} opacity-25 shrink-0 min-w-3`}
                                    />
                                  )}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-xs text-gray-300 italic">
                              Not started yet
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
