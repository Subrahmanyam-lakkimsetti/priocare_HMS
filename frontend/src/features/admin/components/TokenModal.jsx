import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAppointmentByToken, cancelAppointment } from '../adminThunks';
import { clearTokenAppointment } from '../adminSlice';

/* ── Status config ── */
const STATUS_CONFIG = {
  completed: {
    bg: '#f0fdf4',
    text: '#16a34a',
    border: '#bbf7d0',
    dot: '#22c55e',
    label: 'Completed',
  },
  cancelled: {
    bg: '#fff1f2',
    text: '#dc2626',
    border: '#fecaca',
    dot: '#f87171',
    label: 'Cancelled',
  },
  checked_in: {
    bg: '#fffbeb',
    text: '#d97706',
    border: '#fde68a',
    dot: '#fbbf24',
    label: 'Checked In',
  },
  in_consultation: {
    bg: '#eff6ff',
    text: '#2563eb',
    border: '#bfdbfe',
    dot: '#60a5fa',
    label: 'In Consultation',
  },
  confirmed: {
    bg: '#f0fdf4',
    text: '#059669',
    border: '#a7f3d0',
    dot: '#34d399',
    label: 'Confirmed',
  },
  pending: {
    bg: '#f8fafc',
    text: '#64748b',
    border: '#e2e8f0',
    dot: '#94a3b8',
    label: 'Pending',
  },
};

function triageColor(score) {
  if (score >= 75)
    return {
      bg: '#fff1f2',
      bar: '#dc2626',
      text: '#dc2626',
      label: 'High Priority',
    };
  if (score >= 50)
    return {
      bg: '#fffbeb',
      bar: '#d97706',
      text: '#d97706',
      label: 'Medium Priority',
    };
  return {
    bg: '#f0fdf4',
    bar: '#16a34a',
    text: '#16a34a',
    label: 'Low Priority',
  };
}

function fmtTime(d) {
  if (!d) return null;
  return new Date(d).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

function fmtDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

/* ── Only keyframes Tailwind can't handle ── */
const MODAL_CSS = `
  @keyframes tmFadeIn   { from{opacity:0} to{opacity:1} }
  @keyframes tmSlideUp  { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
  @keyframes tmGrow     { from{height:0} to{height:100%} }
  @keyframes tmPop      { from{transform:scale(0);opacity:0} to{transform:scale(1);opacity:1} }
  @keyframes tmSpin     { to{transform:rotate(360deg)} }
  @keyframes tmScaleIn  { from{transform:scale(.85);opacity:0} to{transform:scale(1);opacity:1} }
  @keyframes tmScaleOut { from{transform:scale(1);opacity:1} to{transform:scale(.85);opacity:0} }

  .tm-overlay      { animation: tmFadeIn .2s ease both; }
  .tm-card         { animation: tmSlideUp .3s ease both; }
  .tm-line         { animation: tmGrow .8s ease .3s both; height:0; }
  .tm-dot          { animation: tmPop .3s ease both; }
  .tm-dot-1        { animation-delay:.4s }
  .tm-dot-2        { animation-delay:.6s }
  .tm-dot-3        { animation-delay:.8s }
  .tm-dot-4        { animation-delay:1.0s }
  .tm-dot-5        { animation-delay:1.2s }
  .tm-dot-6        { animation-delay:1.4s }
  .tm-spin-a       { animation: tmSpin .8s linear infinite; }
  .tm-confirm-in   { animation: tmScaleIn  .22s cubic-bezier(.34,1.56,.64,1) both; }
  .tm-confirm-out  { animation: tmScaleOut .18s ease both; }
  .tm-fadein       { animation: tmFadeIn .15s ease both; }

  .tm-scroll::-webkit-scrollbar       { width:4px; }
  .tm-scroll::-webkit-scrollbar-thumb { background:#e2e8f0; border-radius:4px; }
`;

/* ── Info field ── */
function InfoField({ label, value, mono }) {
  if (!value) return null;
  return (
    <div>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.08em] mb-0.5">
        {label}
      </p>
      <p
        className={`text-[13px] font-semibold text-slate-900 m-0 ${mono ? 'font-mono' : ''}`}
      >
        {value}
      </p>
    </div>
  );
}

/* ── Section heading ── */
function SecHead({ children, accent }) {
  return (
    <div className="flex items-center gap-2 mb-3.5">
      <span
        className="w-0.5 h-3.5 rounded inline-block shrink-0"
        style={{ background: accent, width: 3, height: 14 }}
      />
      <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">
        {children}
      </span>
    </div>
  );
}

export default function TokenModal({ token, onClose }) {
  const dispatch = useDispatch();
  const { tokenAppointment: appt, tokenLoading } = useSelector((s) => s.admin);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmClosing, setConfirmClosing] = useState(false);

  useEffect(() => {
    if (token) dispatch(fetchAppointmentByToken(token));
    return () => dispatch(clearTokenAppointment());
  }, [token, dispatch]);

  const closeConfirm = () => {
    setConfirmClosing(true);
    setTimeout(() => {
      setShowConfirm(false);
      setConfirmClosing(false);
    }, 180);
  };

  const handleCancel = () => {
    if (!appt || appt.status === 'cancelled') return;
    setShowConfirm(true);
    setConfirmClosing(false);
  };

  const handleConfirmCancel = async () => {
    closeConfirm();
    await dispatch(cancelAppointment(token));
  };

  const statusCfg = STATUS_CONFIG[appt?.status] ?? STATUS_CONFIG.pending;
  const triage = appt?.triage?.priorityScore
    ? triageColor(appt.triage.priorityScore)
    : null;

  const timelineSteps = appt
    ? [
        { label: 'Booked', icon: '📋', time: appt.bookedOn, color: '#2563eb' },
        {
          label: 'Scheduled',
          icon: '📅',
          time: appt.scheduledDate,
          color: '#7c3aed',
          dateOnly: true,
        },
        {
          label: 'Checked In',
          icon: '✅',
          time: appt.checkedInAt,
          color: '#d97706',
        },
        { label: 'Called', icon: '📢', time: appt.calledAt, color: '#0891b2' },
        {
          label: 'Consultation Started',
          icon: '🩺',
          time: appt.consulationStartsAt,
          color: '#059669',
        },
        {
          label: 'Consultation Ended',
          icon: '🏁',
          time: appt.consulationEndsAt,
          color: '#16a34a',
        },
      ].filter((s) => s.time)
    : [];

  return (
    <>
      <style>{MODAL_CSS}</style>

      {/* ── OVERLAY ── */}
      <div
        className="tm-overlay fixed inset-0 z-50 flex items-center justify-center p-5 backdrop-blur-md"
        style={{ background: 'rgba(15,23,42,0.6)' }}
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        {/* ── CARD ── */}
        <div
          className="tm-card bg-white rounded-3xl w-full flex flex-col overflow-hidden"
          style={{
            maxWidth: 820,
            maxHeight: '92vh',
            boxShadow: '0 32px 80px rgba(0,0,0,.22)',
          }}
        >
          {/* ── HEADER BAND ── */}
          <div
            className="flex items-center justify-between gap-4 px-7 py-5.5 shrink-0"
            style={{ background: 'linear-gradient(135deg,#1e40af,#2563eb)' }}
          >
            <div className="flex items-center gap-4">
              {/* token badge */}
              <div
                className="px-4 py-2 rounded-xl border border-white/25"
                style={{ background: 'rgba(255,255,255,.15)' }}
              >
                <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest mb-0.5">
                  Token
                </p>
                <p className="font-mono text-[20px] font-extrabold text-white tracking-[0.08em] m-0">
                  #{token}
                </p>
              </div>

              <div>
                <p className="text-[10px] font-bold text-white/55 uppercase tracking-widest mb-1">
                  Appointment Details
                </p>
                {appt && (
                  <div className="flex items-center gap-2">
                    <span
                      className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full border"
                      style={{
                        background: statusCfg.bg,
                        color: statusCfg.text,
                        borderColor: statusCfg.border,
                      }}
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full inline-block"
                        style={{ background: statusCfg.dot }}
                      />
                      {statusCfg.label}
                    </span>
                    {appt.createdBy && (
                      <span className="text-[11px] text-white/55 font-medium">
                        Booked by {appt.createdBy}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* close button */}
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl flex items-center justify-center border-none cursor-pointer shrink-0 transition-colors hover:bg-white/25"
              style={{ background: 'rgba(255,255,255,.15)' }}
            >
              <svg
                width="16"
                height="16"
                fill="none"
                viewBox="0 0 24 24"
                stroke="white"
                strokeWidth="2.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* ── BODY ── */}
          {tokenLoading ? (
            <div className="flex-1 flex items-center justify-center p-16">
              <div className="tm-spin-a w-9 h-9 rounded-full border-[3px] border-blue-100 border-t-blue-600" />
            </div>
          ) : appt ? (
            <div
              className="tm-scroll flex-1 overflow-y-auto grid"
              style={{ gridTemplateColumns: '1fr 280px' }}
            >
              {/* ── LEFT PANEL ── */}
              <div className="flex flex-col gap-6 p-7 border-r border-slate-100">
                {/* Triage */}
                {triage && (
                  <div
                    className="rounded-2xl p-5 border"
                    style={{
                      background: triage.bg,
                      borderColor: `${triage.bar}33`,
                    }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className="text-[11px] font-bold uppercase tracking-[0.07em]"
                        style={{ color: triage.text }}
                      >
                        Triage Priority Score
                      </span>
                      <span
                        className="text-[11px] font-bold px-2 py-px rounded-full"
                        style={{
                          color: triage.text,
                          background: `${triage.bar}20`,
                        }}
                      >
                        {triage.label}
                      </span>
                    </div>
                    <div className="h-2 bg-slate-200 rounded-full overflow-hidden mb-1.5">
                      <div
                        className="h-full rounded-full transition-all duration-1000"
                        style={{
                          width: `${appt.triage.priorityScore}%`,
                          background: triage.bar,
                        }}
                      />
                    </div>
                    <div className="flex items-baseline justify-between">
                      <span
                        className="text-[28px] font-extrabold leading-none"
                        style={{ color: triage.text }}
                      >
                        {appt.triage.priorityScore}
                      </span>
                      <span className="text-xs font-semibold text-slate-400">
                        /100
                      </span>
                    </div>
                  </div>
                )}

                {/* Patient Info */}
                <div>
                  <SecHead accent="#2563eb">Patient Information</SecHead>
                  <div
                    className="bg-slate-50 border border-slate-100 rounded-2xl p-4 grid gap-3.5"
                    style={{ gridTemplateColumns: '1fr 1fr', columnGap: 20 }}
                  >
                    <InfoField
                      label="Full Name"
                      value={`${appt.patientDetails?.firstName} ${appt.patientDetails?.lastName}`}
                    />
                    <InfoField
                      label="Age / Gender"
                      value={`${appt.patientDetails?.age} yrs, ${appt.patientDetails?.gender}`}
                    />
                    <InfoField
                      label="Phone"
                      value={appt.patientDetails?.phoneNumber}
                      mono
                    />
                    <InfoField
                      label="Insurance"
                      value={appt.patientDetails?.insuranceDetails}
                    />
                    <div style={{ gridColumn: '1 / -1' }}>
                      <InfoField
                        label="Address"
                        value={appt.patientDetails?.address}
                      />
                    </div>
                  </div>
                </div>

                {/* Doctor Info */}
                <div>
                  <SecHead accent="#7c3aed">Doctor Information</SecHead>
                  <div
                    className="bg-violet-50 border border-violet-100 rounded-2xl p-4 grid gap-3.5"
                    style={{ gridTemplateColumns: '1fr 1fr', columnGap: 20 }}
                  >
                    <InfoField
                      label="Doctor Name"
                      value={`Dr. ${appt.doctorDetails?.firstName} ${appt.doctorDetails?.lastName}`}
                    />
                    <InfoField
                      label="Department"
                      value={appt.doctorDetails?.department}
                    />
                    <InfoField
                      label="Consultation Fee"
                      value={
                        appt.doctorDetails?.consultationFee
                          ? `₹${appt.doctorDetails.consultationFee}`
                          : null
                      }
                    />
                    <InfoField
                      label="Availability"
                      value={appt.doctorDetails?.availabilityStatus}
                    />
                    <InfoField
                      label="Working Hours"
                      value={
                        appt.doctorDetails?.workingHours?.start
                          ? `${appt.doctorDetails.workingHours.start} – ${appt.doctorDetails.workingHours.end}`
                          : null
                      }
                    />
                  </div>
                </div>

                {/* Cancel button — confirmed only */}
                {appt.status === 'confirmed' && (
                  <button
                    onClick={handleCancel}
                    className="w-full py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 font-bold text-[13px] cursor-pointer hover:bg-red-100 transition-colors"
                  >
                    ✕ Cancel Appointment
                  </button>
                )}
              </div>

              {/* ── RIGHT PANEL — TIMELINE ── */}
              <div className="bg-slate-50 p-6">
                <SecHead accent="#059669">Appointment Timeline</SecHead>

                <div className="relative pl-7">
                  {/* vertical gradient line */}
                  <div
                    className="absolute left-2.25 top-2.5 bottom-2.5 w-0.5 rounded overflow-hidden"
                    style={{
                      background: 'linear-gradient(to bottom,#2563eb,#059669)',
                    }}
                  >
                    <div
                      className="tm-line w-full"
                      style={{ background: 'inherit' }}
                    />
                  </div>

                  <div className="flex flex-col">
                    {timelineSteps.map((step, i) => {
                      const time = step.dateOnly ? null : fmtTime(step.time);
                      const date = fmtDate(step.time);
                      const isLast = i === timelineSteps.length - 1;
                      return (
                        <div
                          key={step.label}
                          className={`tm-dot tm-dot-${i + 1} relative flex items-start gap-3.5 ${isLast ? '' : 'pb-5.5'}`}
                        >
                          {/* dot */}
                          <div
                            className="absolute -left-7 top-0.5 w-5 h-5 rounded-full bg-white flex items-center justify-center z-10 border-[2.5px]"
                            style={{
                              borderColor: step.color,
                              boxShadow: `0 0 0 3px ${step.color}22`,
                            }}
                          >
                            <span style={{ fontSize: 10, lineHeight: 1 }}>
                              {step.icon}
                            </span>
                          </div>

                          {/* content card */}
                          <div
                            className="flex-1 bg-white rounded-xl px-3.5 py-2.5 shadow-sm border"
                            style={{ borderColor: `${step.color}33` }}
                          >
                            <p className="text-xs font-bold text-slate-900 mb-0.5">
                              {step.label}
                            </p>
                            <p className="text-[11px] text-slate-500 font-medium m-0">
                              {date}
                              {time && (
                                <span
                                  className="ml-1.5 font-bold rounded-md px-1.5 py-px text-[11px]"
                                  style={{
                                    color: step.color,
                                    background: `${step.color}14`,
                                  }}
                                >
                                  {time}
                                </span>
                              )}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Duration summary */}
                {appt.consulationStartsAt && appt.consulationEndsAt && (
                  <div className="mt-5 bg-green-50 border border-green-200 rounded-xl px-4 py-3 flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-slate-500">
                      Consultation Duration
                    </span>
                    <span className="text-sm font-extrabold text-green-600">
                      {Math.round(
                        (new Date(appt.consulationEndsAt) -
                          new Date(appt.consulationStartsAt)) /
                          60000,
                      ) || '<1'}{' '}
                      min
                    </span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-300 text-sm">
              No appointment data found
            </div>
          )}
        </div>
      </div>

      {/* ── CANCEL CONFIRM POPUP ── */}
      {showConfirm && (
        <div
          className="tm-fadein fixed inset-0 z-60 flex items-center justify-center backdrop-blur-sm"
          style={{ background: 'rgba(15,23,42,0.45)' }}
          onClick={(e) => e.target === e.currentTarget && closeConfirm()}
        >
          <div
            className={`${confirmClosing ? 'tm-confirm-out' : 'tm-confirm-in'} bg-white rounded-[20px] px-7 pt-7 pb-6 w-full max-w-sm text-center shadow-2xl`}
          >
            {/* icon */}
            <div className="w-14 h-14 rounded-full bg-red-50 border-2 border-red-200 flex items-center justify-center text-2xl mx-auto mb-4">
              ⚠️
            </div>

            <h3 className="text-[17px] font-extrabold text-slate-900 mb-2">
              Cancel Appointment?
            </h3>
            <p className="text-[13px] text-slate-500 mb-1.5 leading-relaxed">
              You're about to cancel appointment
            </p>

            <p className="font-mono text-[18px] font-extrabold text-red-600 tracking-[0.08em] bg-red-50 border border-red-200 rounded-xl px-4 py-1.5 inline-block mb-5">
              #{token}
            </p>

            <p className="text-xs text-slate-400 mb-6">
              This action cannot be undone.
            </p>

            <div className="flex gap-2.5">
              <button
                onClick={closeConfirm}
                className="flex-1 py-3 rounded-xl text-[13px] font-bold text-slate-600 bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Keep It
              </button>
              <button
                onClick={handleConfirmCancel}
                className="flex-1 py-3 rounded-xl text-[13px] font-bold text-white bg-red-600 border-none hover:bg-red-700 transition-colors cursor-pointer"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}