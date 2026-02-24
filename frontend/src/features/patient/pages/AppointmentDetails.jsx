import { useSelector, useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { fetchAppointmentByToken } from '../patientThunks';

const SEVERITY_CONFIG = {
  critical: {
    gradient: 'from-red-600 to-rose-500',
    message:
      'You have been marked as critical. Medical staff are being notified immediately.',
  },
  high: {
    gradient: 'from-orange-500 to-amber-500',
    message:
      'You have been prioritized. Our team will attend to you very soon.',
  },
  medium: {
    gradient: 'from-blue-700 to-cyan-600',
    message: 'Your doctor will see you shortly. Please stay nearby.',
  },
  low: {
    gradient: 'from-green-600 to-teal-500',
    message:
      "Your case is non-urgent. Please wait comfortably — we'll call your token soon.",
  },
};

const STATUS_LABEL = {
  waiting: { label: 'Waiting', color: 'bg-yellow-100 text-yellow-700' },
  checked_in: { label: 'Checked In', color: 'bg-blue-100 text-blue-700' },
  called: { label: 'Called', color: 'bg-purple-100 text-purple-700' },
  'in-progress': {
    label: 'In Progress',
    color: 'bg-indigo-100 text-indigo-700',
  },
  in_consultation: {
    label: 'In Consultation',
    color: 'bg-indigo-100 text-indigo-700',
  },
  completed: { label: 'Completed', color: 'bg-green-100 text-green-700' },
};

export default function AppointmentDetails() {
  const { token } = useParams();
  const dispatch = useDispatch();
  const nav = useNavigate();

  const { activeAppointment: a, loadingAppointment } = useSelector(
    (s) => s.patient,
  );

  useEffect(() => {
    if (!a || a.token !== token) dispatch(fetchAppointmentByToken(token));
  }, [token, a, dispatch]);

  const formatTime = (t) =>
    t
      ? new Date(t).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        })
      : null;

  const steps = a
    ? [
        {
          label: 'Checked In',
          done: !!a.checkedInAt,
          time: formatTime(a.checkedInAt),
        },
        {
          label: 'Doctor Called',
          done: !!a.calledAt,
          time: formatTime(a.calledAt),
        },
        {
          label: 'Consultation Started',
          done: !!a.consulationStartsAt,
          time: formatTime(a.consulationStartsAt),
        },
        {
          label: 'Completed',
          done: !!a.consulationEndsAt,
          time: formatTime(a.consulationEndsAt),
        },
      ]
    : [];

  const currentStep = steps.filter((s) => s.done).length;
  const severity = a?.triage?.severityLevel?.toLowerCase() || 'low';
  const sevCfg = SEVERITY_CONFIG[severity] || SEVERITY_CONFIG.low;
  const statusCfg = STATUS_LABEL[a?.status] || {
    label: a?.status,
    color: 'bg-gray-100 text-gray-600',
  };

  const patientsAhead = a?.queuePosition ? a.queuePosition - 1 : 0;

  // Derive which "mode" the Live Queue card should show
  const isCalled = a?.status === 'called';
  const isInConsultation =
    a?.status === 'in_consultation' || a?.status === 'in-progress';
  const isCheckedIn = a?.status === 'checked_in';
  const isCompleted = a?.status === 'completed';

  /* ── Loading / Empty ─────────────────────────────────── */
  if (loadingAppointment)
    return (
      <div className="flex-1 flex items-center justify-center flex-col gap-4 min-h-screen">
        <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
        <p className="text-gray-500 text-sm">Loading appointment...</p>
      </div>
    );

  if (!a)
    return (
      <div className="flex-1 flex items-center justify-center flex-col gap-3 min-h-screen">
        <svg
          className="w-14 h-14 text-gray-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <p className="text-gray-500 font-medium">No appointment found</p>
        <button
          onClick={() => nav('/patient')}
          className="text-blue-600 text-sm hover:underline"
        >
          Back to Dashboard
        </button>
      </div>
    );

  /* ── Main ────────────────────────────────────────────── */
  return (
    <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-gray-50 pt-20">
      {/* Header */}
      <header className="fixed top-0 left-0 lg:left-64 right-0 z-20 bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-4 shadow-sm">
        <button
          onClick={() => nav('/patient')}
          className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-bold text-gray-900">
            Appointment Details
          </h1>
          <p className="text-sm text-gray-500">
            Token <span className="font-medium text-gray-700">#{a.token}</span>
          </p>
        </div>

        <span
          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold ${statusCfg.color}`}
        >
          <span className="w-2 h-2 rounded-full bg-current opacity-70" />
          {statusCfg.label}
        </span>
      </header>

      {/* Scrollable content */}
      <main className="flex-1 overflow-y-auto px-4 py-6 lg:px-8 lg:py-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* ── Called Banner ─────────────────────────────── */}
          {isCalled && (
            <div className="bg-purple-600 rounded-2xl px-6 py-4 flex items-center gap-4 shadow-lg animate-pulse-once">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center shrink-0">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-white font-bold text-base">
                  🔔 Your token has been called!
                </p>
                <p className="text-white/75 text-sm mt-0.5">
                  Please proceed to Dr. {a.doctorId?.firstName}{' '}
                  {a.doctorId?.lastName}'s room in the {a.doctorId?.department}{' '}
                  department now.
                </p>
              </div>
              <p className="text-white/60 text-xs shrink-0">
                Called at {formatTime(a.calledAt)}
              </p>
            </div>
          )}

          {/* ── In Consultation Banner ────────────────────── */}
          {isInConsultation && (
            <div className="bg-indigo-600 rounded-2xl px-6 py-4 flex items-center gap-4 shadow-lg">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center shrink-0">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-white font-bold text-base">
                  ✅ Consultation in progress
                </p>
                <p className="text-white/75 text-sm mt-0.5">
                  You are currently with Dr. {a.doctorId?.firstName}{' '}
                  {a.doctorId?.lastName}. Started at{' '}
                  {formatTime(a.consulationStartsAt)}.
                </p>
              </div>
            </div>
          )}

          {/* Hero Section */}
          <div
            className={`bg-gradient-to-br ${sevCfg.gradient} rounded-2xl p-6 text-white shadow-lg`}
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              {/* Token */}
              <div className="flex-1 min-w-[12rem]">
                <p className="text-white/60 text-xs font-semibold uppercase tracking-widest mb-1">
                  Your Token
                </p>
                <h2 className="text-6xl lg:text-8xl font-black tracking-widest leading-none">
                  {a.token}
                </h2>
              </div>

              {/* Queue Position */}
              <div className="text-right">
                <p className="text-white/60 text-xs font-semibold uppercase tracking-widest mb-1">
                  Queue Position
                </p>
                {/* Show position only when it makes sense */}
                {a.queuePosition ? (
                  <>
                    <p className="text-4xl lg:text-5xl font-black">
                      #{a.queuePosition}
                    </p>
                    <p className="text-white/60 text-sm mt-1">
                      {patientsAhead}{' '}
                      {patientsAhead === 1 ? 'patient' : 'patients'} ahead
                    </p>
                  </>
                ) : isCalled ? (
                  <>
                    <p className="text-2xl font-black">Called</p>
                    <p className="text-white/60 text-sm mt-1">
                      Head to the doctor's room
                    </p>
                  </>
                ) : isInConsultation ? (
                  <>
                    <p className="text-2xl font-black">With Doctor</p>
                    <p className="text-white/60 text-sm mt-1">
                      Consultation ongoing
                    </p>
                  </>
                ) : isCompleted ? (
                  <>
                    <p className="text-2xl font-black">Done</p>
                    <p className="text-white/60 text-sm mt-1">
                      Visit completed
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-4xl lg:text-5xl font-black">—</p>
                    <p className="text-white/60 text-sm mt-1">
                      Awaiting check-in
                    </p>
                  </>
                )}
              </div>

              {/* Doctor Info */}
              <div className="text-right min-w-[15rem]">
                <p className="text-white/60 text-xs font-semibold uppercase tracking-widest mb-2">
                  Assigned Doctor
                </p>
                <div className="flex items-center gap-3 justify-end">
                  <div>
                    <p className="font-bold text-white text-lg leading-tight">
                      Dr. {a.doctorId?.firstName} {a.doctorId?.lastName}
                    </p>
                    <p className="text-white/60 text-sm">
                      {a.doctorId?.department}
                    </p>
                  </div>
                  <div className="w-12 h-12 lg:w-14 lg:h-14 bg-white/20 rounded-full flex items-center justify-center text-white font-bold text-lg shrink-0 border-2 border-white/30">
                    {a.doctorId?.firstName?.[0]}
                    {a.doctorId?.lastName?.[0]}
                  </div>
                </div>
              </div>
            </div>

            {/* Status Message */}
            <div className="mt-4 bg-white/15 border border-white/20 rounded-xl px-4 py-3 flex items-start gap-2">
              <svg
                className="w-5 h-5 text-white/70 mt-0.5 shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="text-white/90 text-sm leading-relaxed">
                {sevCfg.message}
              </p>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Queue Status */}
              <div className="bg-white rounded-2xl border-2 border-blue-200 shadow-sm overflow-hidden">
                <div
                  className={`px-5 py-3 flex items-center justify-between ${
                    isCalled
                      ? 'bg-purple-600'
                      : isInConsultation
                        ? 'bg-indigo-600'
                        : isCompleted
                          ? 'bg-green-600'
                          : 'bg-blue-600'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {!isCompleted && (
                      <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                    )}
                    <h2 className="text-white font-bold text-sm tracking-wide uppercase">
                      {isCalled
                        ? 'You Have Been Called'
                        : isInConsultation
                          ? 'Consultation Status'
                          : isCompleted
                            ? 'Visit Complete'
                            : 'Live Queue Status'}
                    </h2>
                  </div>
                  <span className="text-white/70 text-xs">
                    {new Date().toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}{' '}
                    · {isCompleted ? 'Done' : 'Live'}
                  </span>
                </div>

                {/* ── checked_in: show queue info ── */}
                {isCheckedIn && (
                  <div className="p-5">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="rounded-xl border-2 border-blue-100 bg-blue-50 px-4 py-3">
                        <div className="flex items-center gap-1.5 mb-1">
                          <svg
                            className="w-4 h-4 text-blue-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          <p className="text-xs font-bold text-blue-400 uppercase">
                            Expected Start
                          </p>
                        </div>
                        <p className="text-2xl font-black text-blue-700">
                          {a.exceptedStartTime || '—'}
                        </p>
                      </div>
                      <div className="rounded-xl border-2 border-cyan-100 bg-cyan-50 px-4 py-3">
                        <div className="flex items-center gap-1.5 mb-1">
                          <svg
                            className="w-4 h-4 text-cyan-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          <p className="text-xs font-bold text-cyan-400 uppercase">
                            Expected End
                          </p>
                        </div>
                        <p className="text-2xl font-black text-cyan-700">
                          {a.exceptedEndTime || '—'}
                        </p>
                      </div>
                    </div>
                    <div className="mb-4">
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Queue Progress</span>
                        <span>{patientsAhead} ahead</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{
                            width: a.queuePosition
                              ? `${Math.min(
                                  100,
                                  ((20 - a.queuePosition) / 20) * 100,
                                )}%`
                              : '0%',
                          }}
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5">
                      <svg
                        className="w-4 h-4 text-amber-500 shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <p className="text-amber-700 text-xs font-medium">
                        Please remain nearby. Missing your call may delay your
                        consultation.
                      </p>
                    </div>
                  </div>
                )}

                {/* ── called: proceed to doctor ── */}
                {isCalled && (
                  <div className="p-5">
                    <div className="flex items-start gap-4 bg-purple-50 border border-purple-200 rounded-xl p-4 mb-4">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center shrink-0">
                        <svg
                          className="w-5 h-5 text-purple-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M17 8l4 4m0 0l-4 4m4-4H3"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-purple-800">
                          Please proceed to the doctor's room
                        </p>
                        <p className="text-xs text-purple-600 mt-1">
                          Head to {a.doctorId?.department}, 2nd Floor for your
                          consultation with Dr. {a.doctorId?.firstName}{' '}
                          {a.doctorId?.lastName}.
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
                        <p className="text-xs text-gray-400 mb-0.5">
                          Called at
                        </p>
                        <p className="text-lg font-black text-gray-800">
                          {formatTime(a.calledAt)}
                        </p>
                      </div>
                      <div className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
                        <p className="text-xs text-gray-400 mb-0.5">
                          Checked in at
                        </p>
                        <p className="text-lg font-black text-gray-800">
                          {formatTime(a.checkedInAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* ── in_consultation: currently with doctor ── */}
                {isInConsultation && (
                  <div className="p-5">
                    <div className="flex items-center gap-4 bg-indigo-50 border border-indigo-200 rounded-xl p-4 mb-4">
                      <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center shrink-0">
                        <svg
                          className="w-5 h-5 text-indigo-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-indigo-800">
                          Consultation in progress
                        </p>
                        <p className="text-xs text-indigo-600 mt-1">
                          You are currently being seen by Dr.{' '}
                          {a.doctorId?.firstName} {a.doctorId?.lastName}.
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
                        <p className="text-xs text-gray-400 mb-0.5">
                          Started at
                        </p>
                        <p className="text-lg font-black text-gray-800">
                          {formatTime(a.consulationStartsAt) || '—'}
                        </p>
                      </div>
                      <div className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
                        <p className="text-xs text-gray-400 mb-0.5">Est. End</p>
                        <p className="text-lg font-black text-gray-800">
                          {a.exceptedEndTime || '—'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* ── completed ── */}
                {isCompleted && (
                  <div className="p-5 flex items-center gap-4">
                    <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center shrink-0">
                      <svg
                        className="w-7 h-7 text-green-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-700">
                        Your visit has been completed
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Consultation ended at {formatTime(a.consulationEndsAt)}.
                        Thank you for visiting.
                      </p>
                    </div>
                  </div>
                )}

                {/* ── waiting / not yet checked in ── */}
                {!isCheckedIn &&
                  !isCalled &&
                  !isInConsultation &&
                  !isCompleted && (
                    <div className="p-5 flex items-center gap-4">
                      <div className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center shrink-0">
                        <svg
                          className="w-7 h-7 text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-700">
                          Queue info will appear once you check in
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          Please proceed to the check-in counter
                        </p>
                      </div>
                    </div>
                  )}
              </div>

              {/* Visit Info & Medical Info Combined */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <h2 className="text-base font-bold text-gray-900 mb-4">
                  Visit & Medical Info
                </h2>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-gray-400">Date</p>
                    <p className="text-sm font-semibold text-gray-800">
                      {new Date(a.scheduledDate).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Department</p>
                    <p className="text-sm font-semibold text-gray-800">
                      {a.doctorId?.department}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Doctor Experience</p>
                    <p className="text-sm font-semibold text-gray-800">
                      {a.doctorId?.experienceYears} years
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Status</p>
                    <p
                      className={`text-sm font-semibold ${statusCfg.color.split(' ')[1]}`}
                    >
                      {statusCfg.label}
                    </p>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-4">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                    Primary Concern
                  </p>
                  <p className="text-sm text-gray-800 bg-gray-50 rounded-xl p-3 mb-3">
                    {a.triage?.description || 'No description provided'}
                  </p>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                        Symptoms
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {a.triage?.symptoms?.length ? (
                          a.triage.symptoms.map((s) => (
                            <span
                              key={s}
                              className="bg-blue-100 text-blue-700 text-xs font-medium px-2.5 py-1 rounded-full"
                            >
                              {s}
                            </span>
                          ))
                        ) : (
                          <span className="text-gray-400 text-xs">
                            None reported
                          </span>
                        )}
                      </div>
                    </div>

                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                        Pre-existing Conditions
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {a.triage?.comorbidities?.length ? (
                          a.triage.comorbidities.map((c) => (
                            <span
                              key={c}
                              className="bg-orange-100 text-orange-700 text-xs font-medium px-2.5 py-1 rounded-full"
                            >
                              {c}
                            </span>
                          ))
                        ) : (
                          <span className="text-gray-400 text-xs">
                            None reported
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Visit Journey */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-bold text-gray-900">
                    Visit Journey
                  </h2>
                  <span className="text-xs text-gray-400 font-medium bg-gray-100 px-2.5 py-1 rounded-full">
                    {currentStep}/{steps.length}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-gray-100 rounded-full h-2 mb-4">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-700"
                    style={{
                      width: `${(currentStep / steps.length) * 100}%`,
                    }}
                  />
                </div>

                {/* Timeline */}
                <div className="space-y-3">
                  {steps.map((s, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                          s.done
                            ? 'bg-blue-600'
                            : i === currentStep
                              ? 'border-2 border-blue-400'
                              : 'border-2 border-gray-200'
                        }`}
                      >
                        {s.done ? (
                          <svg
                            className="w-4 h-4 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2.5}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        ) : i === currentStep ? (
                          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                        ) : (
                          <span className="text-xs font-bold text-gray-300">
                            {i + 1}
                          </span>
                        )}
                      </div>
                      <div className="flex-1">
                        <p
                          className={`text-sm font-semibold ${
                            s.done
                              ? 'text-gray-800'
                              : i === currentStep
                                ? 'text-blue-600'
                                : 'text-gray-400'
                          }`}
                        >
                          {s.label}
                        </p>
                      </div>
                      {s.time && (
                        <span className="text-xs text-gray-400">{s.time}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Stay Available — hidden once consultation is done */}
                {!isCompleted && (
                  <div
                    className={`rounded-2xl p-5 text-white ${
                      isCalled
                        ? 'bg-purple-600'
                        : isInConsultation
                          ? 'bg-indigo-600'
                          : 'bg-blue-600'
                    }`}
                  >
                    <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center mb-3">
                      <svg
                        className="w-5 h-5 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                        />
                      </svg>
                    </div>
                    <h3 className="font-bold text-sm mb-1">
                      {isCalled
                        ? 'Proceed Now'
                        : isInConsultation
                          ? 'In Session'
                          : 'Stay Available'}
                    </h3>
                    <p className="text-white/75 text-xs leading-relaxed">
                      {isCalled
                        ? "Your token has been called. Head to the doctor's room immediately."
                        : isInConsultation
                          ? 'Your consultation is underway. Please stay with your doctor.'
                          : "Keep your phone with you. You'll be notified when your doctor is ready."}
                    </p>
                  </div>
                )}

                {/* Need help? */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-7 h-7 bg-green-50 rounded-lg flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-green-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
                        />
                      </svg>
                    </div>
                    <h2 className="text-sm font-bold text-gray-900">
                      Need Help?
                    </h2>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed mb-3">
                    If your condition worsens, alert our staff immediately.
                  </p>
                  <button className="w-full bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 text-xs font-bold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2">
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
                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                      />
                    </svg>
                    Alert Staff
                  </button>
                </div>
              </div>

              {/* Additional Info */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <h3 className="text-sm font-bold text-gray-900 mb-3">
                  Additional Information
                </h3>
                <div className="space-y-2 text-sm">
                  <p className="flex items-center gap-2 text-gray-600">
                    <svg
                      className="w-4 h-4 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                    Reception: (555) 123-4567
                  </p>
                  <p className="flex items-center gap-2 text-gray-600">
                    <svg
                      className="w-4 h-4 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    {a.doctorId?.department}, 2nd Floor
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
