import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { checkinPatient } from '../receptionistThunks';
import { clearLastCheckedIn } from '../receptionistSlice';
import ConfirmDialog from '../components/Confirmdialog';
import TokenDetailModal from '../components/Tokendetailmodal';

const SEV = {
  low: {
    bg: '#f0fdf4',
    border: '#bbf7d0',
    color: '#16a34a',
    dark: '#15803d',
    label: 'Low',
    icon: '🟢',
  },
  medium: {
    bg: '#fffbeb',
    border: '#fde68a',
    color: '#d97706',
    dark: '#b45309',
    label: 'Medium',
    icon: '🟡',
  },
  high: {
    bg: '#fff7ed',
    border: '#fed7aa',
    color: '#ea580c',
    dark: '#c2410c',
    label: 'High',
    icon: '🟠',
  },
  emergency: {
    bg: '#fff1f2',
    border: '#fecdd3',
    color: '#e11d48',
    dark: '#be123c',
    label: 'Critical',
    icon: '🔴',
  },
};

const AVATAR_COLORS = [
  '#2563eb',
  '#7c3aed',
  '#0891b2',
  '#16a34a',
  '#d97706',
  '#9333ea',
];

function fmt(d) {
  if (!d) return null;
  return new Date(d).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
function fmtDate(d) {
  if (!d) return null;
  return new Date(d).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export default function PatientCheckIn() {
  const [token, setToken] = useState('');
  const [pendingToken, setPendingToken] = useState(null);
  const [viewToken, setViewToken] = useState(null);
  const [mounted, setMounted] = useState(false);

  const dispatch = useDispatch();
  const {
    lastCheckedIn: apt,
    loading,
    checkinError,
  } = useSelector((s) => s.receptionist);

  useEffect(() => {
    setMounted(true);
    return () => dispatch(clearLastCheckedIn());
  }, [dispatch]);

  const handleRequest = () => {
    if (token.length === 4) setPendingToken(token.toUpperCase());
  };
  const handleConfirm = () => {
    dispatch(checkinPatient(pendingToken));
    setToken('');
    setPendingToken(null);
  };

  const patient = apt?.patientId || apt?.patientDetails || {};
  const doctor = apt?.doctorId || apt?.doctorDetails || {};
  const aptIsValid =
    !checkinError &&
    !!(apt && (patient?.firstName || patient?.lastName || apt.token));

  const sev = apt?.triage?.severityLevel;
  const sv = aptIsValid && sev ? SEV[sev] || SEV.low : null;
  const score = apt?.triage?.priorityScore;
  const firstName = patient?.firstName || '';
  const lastName = patient?.lastName || '';
  const fullName = [firstName, lastName].filter(Boolean).join(' ') || 'Patient';
  const initials =
    ((firstName[0] || '') + (lastName[0] || '')).toUpperCase() || '?';
  const doctorName = [doctor?.firstName, doctor?.lastName]
    .filter(Boolean)
    .join(' ');
  const avatarColor =
    AVATAR_COLORS[(firstName.charCodeAt(0) || 0) % AVATAR_COLORS.length];

  const tlSteps = aptIsValid
    ? [
        { label: 'Scheduled', value: fmtDate(apt.scheduledDate) },
        { label: 'Booked', value: fmt(apt.bookedOn) },
        { label: 'Checked In', value: fmt(apt.checkedInAt), active: true },
      ].filter((r) => r.value)
    : [];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700;9..40,800&display=swap');

        @keyframes spin   { to { transform: rotate(360deg); } }
        @keyframes fadeup { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:none; } }

        .fu    { opacity:0; transform:translateY(10px); transition:opacity .38s ease,transform .38s ease; }
        .fu.on { opacity:1; transform:none; }
        .d1    { transition-delay:.06s; }
        .d2    { transition-delay:.12s; }

        .pci-spin { width:14px; height:14px; border-radius:50%; border:2.5px solid rgba(255,255,255,.3); border-top-color:#fff; animation:spin .7s linear infinite; flex-shrink:0; }

        .pci-box-on { border-color:#2563eb !important; background:#eff6ff !important; color:#2563eb !important; box-shadow:0 0 0 3px rgba(37,99,235,.10) !important; }

        .pci-hint::before { content:''; width:4px; height:4px; border-radius:50%; background:#94a3b8; flex-shrink:0; }

        .pci-result { animation: fadeup .3s ease; }

        .pci-tl-step:not(:last-child)::after       { content:''; position:absolute; top:10px; left:calc(50% + 12px); width:calc(100% - 24px); height:2px; background:#f1f5f9; }
        .pci-tl-step.done:not(:last-child)::after  { background:#bbf7d0; }

        .pci-tl-dot  { width:6px; height:6px; border-radius:50%; background:#e2e8f0; }
        .pci-tl-ck   { display:none; color:#fff; }
        .pci-tl-step.done .pci-tl-dot  { display:none; }
        .pci-tl-step.done .pci-tl-ck   { display:block; }

        .pci-tl-step.done   .pci-tl-l  { color:#86efac; }
        .pci-tl-step.active .pci-tl-l  { color:#4ade80; font-weight:700; }
        .pci-tl-step.active .pci-tl-v  { color:#15803d; font-weight:700; }
      `}</style>

      <div
        className="min-h-screen bg-[#f1f5f9] px-8 pt-8 pb-13 max-[768px]:px-4 max-[768px]:pt-5 max-[768px]:pb-10"
        style={{ fontFamily: "'DM Sans', -apple-system, sans-serif" }}
      >
        {/* ── Page header ── */}
        <div
          className={`fu ${mounted ? 'on' : ''} flex items-start justify-between gap-4 flex-wrap mb-7 pb-5 border-b border-slate-200`}
        >
          <div>
            <p className="text-[11px] font-semibold tracking-[.07em] uppercase text-slate-400 mb-1">
              Reception Portal
            </p>
            <h1 className="text-[22px] font-extrabold text-slate-900 tracking-[-0.4px] m-0 mb-px">
              Patient Check-In
            </h1>
            <p className="text-[13px] text-slate-400">
              Enter the 4-character token to register a patient's arrival
            </p>
          </div>
        </div>

        {/* ── Grid ── */}
        <div className="grid grid-cols-[350px_1fr] gap-5 items-start max-[860px]:grid-cols-1">
          {/* ── LEFT ── */}
          <div>
            {/* Input card */}
            <div
              className={`fu d1 ${mounted ? 'on' : ''} bg-white border-[1.5px] border-slate-300 rounded-2xl p-5.5 mb-3.5 shadow-[0_4px_18px_rgba(15,23,42,.10)]`}
            >
              <label className="text-[11px] font-bold tracking-[.06em] uppercase text-slate-700 block mb-3">
                Appointment Token
              </label>

              {/* Char boxes */}
              <div className="flex gap-2 mb-3.5">
                {Array.from({ length: 4 }).map((_, i) => {
                  const ch = token[i];
                  return (
                    <div
                      key={i}
                      className={`flex-1 h-12.5 rounded-[10px] border-2 border-slate-300 bg-[#f1f5f9] flex items-center justify-center text-[22px] font-extrabold text-slate-900 transition-all duration-150 shadow-[0_1px_3px_rgba(15,23,42,.06)] ${ch ? 'pci-box-on' : ''}`}
                      style={{ fontFamily: "'Courier New', monospace" }}
                    >
                      {ch || <span className="text-[#d1d5db] text-sm">·</span>}
                    </div>
                  );
                })}
              </div>

              {/* Input */}
              <div className="relative mb-3">
                <input
                  value={token}
                  onChange={(e) => {
                    const v = e.target.value
                      .replace(/[^a-zA-Z0-9]/g, '')
                      .toUpperCase();
                    if (v.length <= 4) setToken(v);
                  }}
                  onKeyDown={(e) => e.key === 'Enter' && handleRequest()}
                  placeholder="G5H7"
                  maxLength={4}
                  autoComplete="off"
                  spellCheck={false}
                  autoFocus
                  className="w-full box-border py-3.25 pl-3.5 pr-12 border-2 border-slate-300 rounded-[10px] bg-slate-50 text-[22px] font-extrabold text-slate-900 tracking-[.2em] uppercase outline-none transition-all duration-150 shadow-[0_1px_3px_rgba(15,23,42,.06)] focus:border-blue-600 focus:bg-white focus:shadow-[0_0_0_3px_rgba(37,99,235,.12)] placeholder:text-slate-400 placeholder:font-medium placeholder:tracking-[.05em] placeholder:text-base"
                  style={{ fontFamily: "'Courier New', monospace" }}
                />
                <span
                  className={`absolute right-3.5 top-1/2 -translate-y-1/2 text-[11px] font-bold pointer-events-none transition-colors duration-150 ${token.length === 4 ? 'text-blue-600' : 'text-slate-400'}`}
                  style={{ fontFamily: 'monospace' }}
                >
                  {token.length}/4
                </span>
              </div>

              {/* Submit btn */}
              <button
                onClick={handleRequest}
                disabled={token.length !== 4 || loading.checkin}
                className="w-full py-3 rounded-[10px] border-none bg-blue-600 text-white text-sm font-bold cursor-pointer mb-3 flex items-center justify-center gap-2 transition-all duration-150 shadow-[0_2px_10px_rgba(37,99,235,.28)] hover:enabled:bg-blue-700 hover:enabled:-translate-y-px hover:enabled:shadow-[0_4px_16px_rgba(37,99,235,.38)] disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
                style={{ fontFamily: 'inherit' }}
              >
                {loading.checkin ? (
                  <>
                    <span className="pci-spin" />
                    Processing…
                  </>
                ) : (
                  <>
                    <svg
                      width="14"
                      height="14"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 11l3 3L22 4"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"
                      />
                    </svg>
                    Check In Patient
                  </>
                )}
              </button>

              {/* Hints */}
              <div className="flex flex-col gap-1.5">
                <div className="pci-hint flex items-center gap-1.75 text-xs text-slate-500">
                  4 characters — letters &amp; numbers only
                </div>
                <div className="pci-hint flex items-center gap-1.75 text-xs text-slate-500">
                  Press{' '}
                  <kbd className="px-1.5 py-px rounded bg-slate-100 border border-slate-200 text-[11px] font-semibold text-slate-600">
                    Enter
                  </kbd>{' '}
                  to submit
                </div>
              </div>
            </div>

            {/* Steps card */}
            <div
              className={`fu d2 ${mounted ? 'on' : ''} bg-white border-[1.5px] border-slate-300 rounded-2xl px-5 py-4.5 shadow-[0_4px_18px_rgba(15,23,42,.10)]`}
            >
              <p className="text-[11px] font-bold tracking-[.07em] uppercase text-slate-400 mb-3.5">
                How it works
              </p>
              {[
                {
                  n: 1,
                  title: 'Patient presents token',
                  desc: '4-character code from their confirmation',
                },
                {
                  n: 2,
                  title: 'Confirm check-in',
                  desc: 'Review patient details and approve',
                },
                {
                  n: 3,
                  title: 'Joins queue',
                  desc: 'Status updates and doctor is notified',
                },
              ].map(({ n, title, desc }) => (
                <div
                  key={n}
                  className="flex items-start gap-2.5 mb-2.5 last:mb-0"
                >
                  <div className="w-5.5 h-5.5 rounded-[7px] bg-blue-50 border border-blue-200 text-[10px] font-extrabold text-blue-600 flex items-center justify-center shrink-0">
                    {n}
                  </div>
                  <p className="text-[12.5px] text-slate-500 leading-[1.55]">
                    <b className="text-slate-700 font-semibold">{title}</b> —{' '}
                    {desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* ── RIGHT ── */}
          <div className={`fu d2 ${mounted ? 'on' : ''}`}>
            {/* Error */}
            {checkinError && (
              <div className="bg-white border-[1.5px] border-red-200 rounded-2xl py-12 px-6 flex flex-col items-center text-center gap-1.5">
                <div className="w-14 h-14 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center text-2xl mb-2.5">
                  🚫
                </div>
                <p className="text-[15px] font-bold text-red-600">
                  Check-In Failed
                </p>
                <p className="text-[13px] text-slate-400 leading-[1.6] max-w-60">
                  {checkinError}
                </p>
              </div>
            )}

            {/* Idle */}
            {!checkinError && !aptIsValid && (
              <div className="bg-white border-[1.5px] border-dashed border-slate-200 rounded-2xl py-14 px-6 flex flex-col items-center text-center gap-1.5">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-2xl mb-2.5">
                  🏥
                </div>
                <p className="text-[15px] font-bold text-slate-700">
                  Awaiting Check-In
                </p>
                <p className="text-[13px] text-slate-400 leading-[1.6] max-w-50">
                  Patient details will appear here after a successful check-in.
                </p>
              </div>
            )}

            {/* ── Result ── */}
            {aptIsValid && (
              <div className="pci-result flex flex-col gap-3">
                {/* Identity bar */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center gap-3.5 flex-wrap shadow-[0_1px_6px_rgba(15,23,42,.04)]">
                  <div
                    className="w-12 h-12 rounded-[13px] shrink-0 flex items-center justify-center text-base font-extrabold text-white tracking-[-0.5px]"
                    style={{ background: avatarColor }}
                  >
                    {initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[17px] font-extrabold text-slate-900 mb-1">
                      {fullName}
                    </p>
                    {doctorName && (
                      <p className="text-[12.5px] text-slate-500 font-medium flex items-start gap-1.25">
                        <svg
                          width="11"
                          height="11"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="shrink-0 mt-px"
                        >
                          <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                        </svg>
                        Dr. {doctorName}
                        {doctor?.department ? ` · ${doctor.department}` : ''}
                      </p>
                    )}
                    <div className="flex gap-1.5 flex-wrap mt-1.75">
                      {apt.token && (
                        <span
                          className="inline-flex items-center gap-1.25 px-2.5 py-0.75 rounded-[20px] text-[11px] font-bold bg-blue-50 border border-blue-200 text-blue-600 tracking-[.07em]"
                          style={{ fontFamily: "'Courier New', monospace" }}
                        >
                          🏷 {apt.token}
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1.25 px-2.5 py-0.75 rounded-[20px] text-[11px] font-bold bg-green-50 border border-green-200 text-green-600">
                        <span className="w-1.25 h-1.25 rounded-full bg-green-400 inline-block" />
                        Checked In
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setViewToken(apt.token)}
                    className="ml-auto shrink-0 px-3.5 py-2 rounded-[9px] border border-slate-200 bg-white text-xs font-bold text-blue-600 cursor-pointer flex items-center gap-1.25 transition-all duration-150 hover:bg-blue-50 hover:border-blue-200"
                    style={{ fontFamily: 'inherit' }}
                  >
                    <svg
                      width="13"
                      height="13"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                    Full Details
                  </button>
                </div>

                {/* Severity + Score boxes */}
                {sv && (
                  <div className="grid grid-cols-2 gap-3">
                    {/* Severity box */}
                    <div
                      className="rounded-[14px] p-[18px_20px] flex items-center gap-3.5 border-[1.5px]"
                      style={{ background: sv.bg, borderColor: sv.border }}
                    >
                      <div
                        className="w-11 h-11 rounded-xl shrink-0 flex items-center justify-center text-[22px] bg-white/60 border border-white/80"
                        style={{ borderColor: sv.border }}
                      >
                        <span>{sv.icon}</span>
                      </div>
                      <div style={{ color: sv.dark }}>
                        <p
                          className="text-[10.5px] font-semibold tracking-[.06em] uppercase mb-1 opacity-75"
                          style={{ color: sv.color }}
                        >
                          Severity
                        </p>
                        <p className="text-[22px] font-extrabold tracking-[-0.5px] leading-none">
                          {sv.label}
                        </p>
                        <p className="text-[11px] font-medium mt-0.75 opacity-65">
                          Triage level
                        </p>
                      </div>
                    </div>

                    {/* Priority score box */}
                    <div className="bg-white border border-slate-200 rounded-[14px] p-[18px_20px] flex items-center gap-3.5">
                      {score != null ? (
                        <div className="relative w-11 h-11 shrink-0">
                          <svg
                            className="-rotate-90"
                            width="44"
                            height="44"
                            viewBox="0 0 44 44"
                          >
                            <circle
                              cx="22"
                              cy="22"
                              r="18"
                              fill="none"
                              stroke="#f1f5f9"
                              strokeWidth="4"
                            />
                            <circle
                              cx="22"
                              cy="22"
                              r="18"
                              fill="none"
                              stroke={sv.color}
                              strokeWidth="4"
                              strokeDasharray={`${Math.min(score, 100) * 1.131} 113.1`}
                              strokeLinecap="round"
                            />
                          </svg>
                          <span className="absolute inset-0 flex items-center justify-center text-xs font-extrabold text-slate-900">
                            {score}
                          </span>
                        </div>
                      ) : (
                        <div className="w-11 h-11 rounded-full bg-slate-100 flex items-center justify-center text-lg shrink-0">
                          —
                        </div>
                      )}
                      <div>
                        <p className="text-[10.5px] font-semibold tracking-[.06em] uppercase text-slate-400 mb-1">
                          Priority Score
                        </p>
                        <p
                          className="text-[22px] font-extrabold tracking-[-0.5px] leading-none"
                          style={{ color: sv.color }}
                        >
                          {score ?? '—'}
                        </p>
                        <p className="text-[11px] text-slate-400 font-medium mt-0.75">
                          Out of 100
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Info tiles */}
                {(() => {
                  const tiles = [
                    patient?.age && { lbl: 'Age', val: `${patient.age} yrs` },
                    patient?.gender && { lbl: 'Gender', val: patient.gender },
                    patient?.phoneNumber && {
                      lbl: 'Phone',
                      val: patient.phoneNumber,
                    },
                    doctorName && { lbl: 'Doctor', val: `Dr. ${doctorName}` },
                    doctor?.department && {
                      lbl: 'Department',
                      val: doctor.department,
                    },
                    doctor?.consultationFee != null && {
                      lbl: 'Fee',
                      val: `₹${doctor.consultationFee}`,
                    },
                  ].filter(Boolean);
                  if (!tiles.length) return null;
                  return (
                    <div className="bg-white border border-slate-200 rounded-[14px] grid grid-cols-3 overflow-hidden shadow-[0_1px_5px_rgba(15,23,42,.04)] max-[560px]:grid-cols-2">
                      {tiles.map((t, i) => (
                        <div
                          key={i}
                          className="px-4 py-3.25 border-r border-slate-100 flex flex-col gap-0.5 last:border-r-0"
                        >
                          <span className="text-[10.5px] text-slate-400 font-medium">
                            {t.lbl}
                          </span>
                          <span className="text-[13.5px] text-slate-900 font-bold capitalize">
                            {t.val}
                          </span>
                        </div>
                      ))}
                    </div>
                  );
                })()}

                {/* Clinical notes */}
                {apt.triage &&
                  (apt.triage.symptoms?.length > 0 ||
                    apt.triage.description ||
                    apt.triage.comorbidities?.length > 0) && (
                    <div className="bg-white border border-slate-200 rounded-[14px] overflow-hidden shadow-[0_1px_5px_rgba(15,23,42,.04)]">
                      <div
                        className="w-full h-0.75"
                        style={{ background: sv?.color || '#ea580c' }}
                      />
                      <div className="px-4.5 py-3.5 flex flex-col gap-3.5">
                        {apt.triage.symptoms?.length > 0 && (
                          <div>
                            <p
                              className="text-[10.5px] font-bold tracking-[.07em] uppercase mb-2"
                              style={{ color: sv?.color || '#ea580c' }}
                            >
                              Symptoms
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                              {apt.triage.symptoms.map((s, i) => (
                                <span
                                  key={i}
                                  className="px-3 py-1.25 rounded-lg text-xs font-semibold capitalize"
                                  style={{
                                    background: sv?.bg || '#fff7ed',
                                    border: `1px solid ${sv?.border || '#fed7aa'}`,
                                    color: sv?.color || '#ea580c',
                                  }}
                                >
                                  {s}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {apt.triage.description && (
                          <div>
                            <p className="text-[10.5px] font-bold tracking-[.07em] uppercase text-slate-500 mb-2">
                              Description
                            </p>
                            <p
                              className="text-[13px] text-slate-700 leading-[1.7] bg-slate-50 rounded-[10px] px-3.5 py-3 border-l-[3px]"
                              style={{
                                borderLeftColor: sv?.border || '#fed7aa',
                              }}
                            >
                              {apt.triage.description}
                            </p>
                          </div>
                        )}

                        {apt.triage.comorbidities?.length > 0 && (
                          <div>
                            <p className="text-[10.5px] font-bold tracking-[.07em] uppercase text-slate-500 mb-2">
                              Comorbidities
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                              {apt.triage.comorbidities.map((c, i) => (
                                <span
                                  key={i}
                                  className="px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-600 capitalize"
                                >
                                  {c}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                {/* Timeline */}
                {tlSteps.length > 0 && (
                  <div className="bg-white border border-slate-200 rounded-[14px] overflow-hidden shadow-[0_1px_5px_rgba(15,23,42,.04)]">
                    <div className="px-4.5 py-2.5 border-b border-slate-100 text-[10.5px] font-bold tracking-[.08em] uppercase text-slate-400 flex items-center gap-1.75">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />
                      Timeline
                    </div>
                    <div className="flex px-5 py-4.5 gap-0 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                      {tlSteps.map((s, i) => (
                        <div
                          key={i}
                          className={`pci-tl-step done${s.active ? ' active' : ''} flex flex-col items-center flex-1 min-w-25 relative`}
                        >
                          <div className="w-5.5 h-5.5 rounded-full flex items-center justify-center shrink-0 mb-2.5 relative z-10 border-2 border-transparent bg-green-600 shadow-[0_2px_8px_rgba(22,163,74,.3)]">
                            <span className="pci-tl-ck">
                              <svg
                                width="9"
                                height="9"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="3.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                            </span>
                            <span className="pci-tl-dot" />
                          </div>
                          <div className="text-center">
                            <p className="pci-tl-l text-[10px] text-slate-400 font-medium mb-0.75">
                              {s.label}
                            </p>
                            <p className="pci-tl-v text-[10.5px] text-slate-600 font-semibold leading-[1.35]">
                              {s.value}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={!!pendingToken}
        title="Confirm Check-In"
        message={`Are you sure you want to check in the patient with token "${pendingToken}"? This will update their appointment status to Checked In.`}
        confirmLabel="Yes, Check In"
        confirmStyle="primary"
        onConfirm={handleConfirm}
        onCancel={() => setPendingToken(null)}
      />

      {viewToken && (
        <TokenDetailModal
          token={viewToken}
          onClose={() => setViewToken(null)}
        />
      )}
    </>
  );
}