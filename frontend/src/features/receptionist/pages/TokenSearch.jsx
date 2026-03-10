import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAppointmentByToken } from '../receptionistThunks';
import { clearTokenAppointment } from '../receptionistSlice';

const STATUS_STYLE = {
  checked_in: {
    bg: '#f0fdf4',
    border: '#bbf7d0',
    color: '#16a34a',
    label: 'Checked In',
  },
  completed: {
    bg: '#eff6ff',
    border: '#bfdbfe',
    color: '#2563eb',
    label: 'Completed',
  },
  scheduled: {
    bg: '#fffbeb',
    border: '#fde68a',
    color: '#d97706',
    label: 'Scheduled',
  },
  cancelled: {
    bg: '#fff1f2',
    border: '#fecdd3',
    color: '#e11d48',
    label: 'Cancelled',
  },
};
const SEV_STYLE = {
  low: { bg: '#f0fdf4', border: '#bbf7d0', color: '#16a34a' },
  medium: { bg: '#fffbeb', border: '#fde68a', color: '#d97706' },
  high: { bg: '#fff7ed', border: '#fed7aa', color: '#ea580c' },
  critical: { bg: '#fff1f2', border: '#fecdd3', color: '#e11d48' },
};
const AVATAR_PALETTES = [
  ['#2563eb', '#7c3aed'],
  ['#0891b2', '#2563eb'],
  ['#16a34a', '#0891b2'],
  ['#d97706', '#ea580c'],
];

function fmtDateTime(d) {
  if (!d) return null;
  return new Date(d).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
function fmtDateOnly(d) {
  if (!d) return null;
  return new Date(d).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

const HOW_IT_WORKS = [
  {
    icon: '✏️',
    title: 'Enter Token',
    desc: "Type the 4-character token from the patient's receipt",
  },
  {
    icon: '🔍',
    title: 'Search',
    desc: 'Hit Search or press Enter to look up the record',
  },
  {
    icon: '📋',
    title: 'View Details',
    desc: 'Full appointment details appear instantly on screen',
  },
];
const QUICK_TIPS = [
  'Tokens are exactly 4 characters long',
  'Token lookup is case-insensitive',
  'Each token is unique to one appointment',
  "Use this to verify a patient's check-in status",
];

function Pill({ children, bg, border, color }) {
  return (
    <span
      className="inline-flex items-center gap-1.25 px-2.75 py-1 rounded-[20px] text-[11px] font-bold whitespace-nowrap"
      style={{ background: bg, border: `1px solid ${border}`, color }}
    >
      {children}
    </span>
  );
}

function InfoField({ label, value }) {
  if (!value && value !== 0) return null;
  return (
    <div className="p-[9px_16px] border-t border-r border-slate-50">
      <p className="text-[10.5px] text-slate-400 font-medium mb-0.5">{label}</p>
      <p className="text-[13px] text-slate-900 font-semibold capitalize wrap-break-word leading-[1.4]">
        {value}
      </p>
    </div>
  );
}

function SectionCard({
  title,
  icon,
  accent,
  accentBg,
  accentBorder,
  children,
}) {
  const kids = Array.isArray(children)
    ? children.flat().filter(Boolean)
    : children
      ? [children]
      : [];
  const hasContent = kids.some(
    (k) => k && k.props && k.props.value != null && k.props.value !== '',
  );
  if (!hasContent) return null;
  return (
    <div className="bg-white border border-slate-200 rounded-[14px] overflow-hidden shadow-[0_1px_6px_rgba(15,23,42,.04)]">
      <div
        className="flex items-center gap-2 px-4 py-2.75 bg-white"
        style={{ borderBottom: `2px solid ${accentBorder}` }}
      >
        <div
          className="w-5.5 h-5.5 rounded-md flex items-center justify-center text-[11px] shrink-0"
          style={{
            background: accentBg,
            border: `1px solid ${accentBorder}`,
            color: accent,
          }}
        >
          {icon}
        </div>
        <span
          className="text-[10.5px] font-bold tracking-[.08em] uppercase"
          style={{ color: accent }}
        >
          {title}
        </span>
      </div>
      <div className="grid grid-cols-2 max-[480px]:grid-cols-1">{children}</div>
    </div>
  );
}

export default function TokenSearch() {
  const [token, setToken] = useState('');
  const [searched, setSearched] = useState(false);
  const dispatch = useDispatch();
  const {
    tokenAppointment: apt,
    tokenLoading,
    tokenError,
  } = useSelector((s) => s.receptionist);

  const handleSearch = () => {
    if (token.length !== 4) return;
    setSearched(true);
    dispatch(fetchAppointmentByToken(token.trim().toUpperCase()));
  };
  const handleClear = () => {
    setToken('');
    setSearched(false);
    dispatch(clearTokenAppointment());
  };

  const aptIsValid = !!(
    apt &&
    (apt.patientDetails?.firstName ||
      apt.patientDetails?.lastName ||
      apt.doctorDetails?.firstName ||
      apt.token)
  );
  const st = aptIsValid
    ? STATUS_STYLE[apt.status] || STATUS_STYLE.scheduled
    : null;
  const sv =
    aptIsValid && apt?.triage?.severityLevel
      ? SEV_STYLE[apt.triage.severityLevel] || SEV_STYLE.low
      : null;
  const sev = apt?.triage?.severityLevel;

  const firstName = apt?.patientDetails?.firstName || '';
  const lastName = apt?.patientDetails?.lastName || '';
  const fullName = [firstName, lastName].filter(Boolean).join(' ');
  const initials =
    ((firstName[0] || '') + (lastName[0] || '')).toUpperCase() || '?';
  const [c1, c2] =
    AVATAR_PALETTES[(firstName.charCodeAt(0) || 0) % AVATAR_PALETTES.length];

  const showDefault = !searched && !tokenLoading && !tokenError;
  const showResult = !tokenLoading && aptIsValid;
  const showNotFound = !tokenLoading && searched && (!aptIsValid || tokenError);

  const timelineItems = aptIsValid
    ? [
        {
          label: 'Scheduled',
          value: fmtDateOnly(apt.scheduledDate),
          dot: '#94a3b8',
          filled: !!apt.scheduledDate,
        },
        {
          label: 'Booked',
          value: fmtDateTime(apt.bookedOn),
          dot: '#94a3b8',
          filled: !!apt.bookedOn,
        },
        {
          label: 'Checked In',
          value: fmtDateTime(apt.checkedInAt),
          dot: '#22c55e',
          filled: !!apt.checkedInAt,
        },
        {
          label: 'Called',
          value: fmtDateTime(apt.calledAt),
          dot: '#3b82f6',
          filled: !!apt.calledAt,
        },
        {
          label: 'Started',
          value: fmtDateTime(apt.consulationStartsAt),
          dot: '#f59e0b',
          filled: !!apt.consulationStartsAt,
        },
        {
          label: 'Ended',
          value: fmtDateTime(apt.consulationEndsAt),
          dot: '#7c3aed',
          filled: !!apt.consulationEndsAt,
        },
      ].filter((r) => r.value)
    : [];

  return (
    <>
      <style>{`
        @keyframes tsspin  { to { transform: rotate(360deg); } }
        @keyframes tsshim  { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
        .ts-spinner        { width:15px; height:15px; border-radius:50%; border:2.5px solid rgba(255,255,255,.3); border-top-color:#fff; animation:tsspin .7s linear infinite; flex-shrink:0; }
        .ts-skel           { border-radius:7px; background:linear-gradient(90deg,#f1f5f9 25%,#e2e8f0 50%,#f1f5f9 75%); background-size:200% 100%; animation:tsshim 1.4s infinite; margin-bottom:12px; }
        .ts-tl-step:not(:last-child)::after { content:''; position:absolute; top:11px; left:calc(50% + 13px); width:calc(100% - 26px); height:2px; background:#f1f5f9; }
        .ts-tl-step.done:not(:last-child)::after { background:linear-gradient(90deg,#bfdbfe,#f1f5f9); }
        .ts-tl-step.done .ts-tl-inner { display:none; }
        .ts-tl-step.done .ts-tl-check { display:block; color:#fff; }
        .ts-tl-check { display:none; }
        .ts-info-field-even:nth-child(even) { border-right: none; }
        .ts-triage-item-even:nth-child(even) { border-right: none; }
        .ts-doc-detail:nth-child(3n) { border-right: none; }
      `}</style>

      <div
        className="min-h-screen bg-slate-100 px-8 pt-8 pb-12 max-md:px-4 max-md:pt-5 max-md:pb-10"
        style={{
          fontFamily:
            "'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-7 pb-5 border-b border-slate-200 gap-4 flex-wrap">
          <div>
            <p className="text-[11px] font-semibold tracking-[.07em] uppercase text-slate-400 mb-1">
              Reception Portal
            </p>
            <h1 className="text-[22px] font-extrabold text-slate-900 tracking-[-0.4px] m-0 mb-0.75">
              Token Search
            </h1>
            <p className="text-[13px] text-slate-400">
              Look up any patient's appointment using their 4-character token
            </p>
          </div>
          <div className="inline-flex items-center gap-1.5 bg-blue-50 border border-blue-200 rounded-[20px] px-3.5 py-1.5 text-xs font-bold text-blue-600 whitespace-nowrap shrink-0">
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
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            Token Lookup
          </div>
        </div>

        {/* Two-col layout */}
        <div className="grid grid-cols-[350px_1fr] gap-5 items-start max-[900px]:grid-cols-1">
          {/* ── LEFT ── */}
          <div>
            {/* Search card */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5.5 mb-3.5 shadow-[0_1px_6px_rgba(15,23,42,.05)]">
              <p className="text-[11px] font-bold tracking-[.06em] uppercase text-slate-600 mb-2.5">
                Appointment Token
              </p>

              {/* Input */}
              <div className="relative mb-3">
                <svg
                  className="absolute left-3.25 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="7" width="20" height="14" rx="2" />
                  <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
                </svg>
                <input
                  value={token}
                  onChange={(e) =>
                    setToken(
                      e.target.value
                        .replace(/[^a-zA-Z0-9]/g, '')
                        .toUpperCase()
                        .slice(0, 4),
                    )
                  }
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="G5H7"
                  maxLength={4}
                  autoComplete="off"
                  spellCheck={false}
                  className="w-full py-3.25 pl-10 pr-12 rounded-[10px] border-[1.5px] border-slate-200 bg-slate-50 text-[20px] font-extrabold text-slate-900 tracking-[.2em] outline-none box-border uppercase transition-all duration-150 focus:border-blue-600 focus:bg-white focus:shadow-[0_0_0_3px_rgba(37,99,235,.08)] placeholder:text-slate-300 placeholder:font-normal placeholder:tracking-[.06em] placeholder:text-[15px]"
                  style={{ fontFamily: "'Courier New', monospace" }}
                />
                <span
                  className={`absolute right-3.25 top-1/2 -translate-y-1/2 text-[11px] font-bold pointer-events-none transition-colors duration-150 ${token.length === 4 ? 'text-blue-600' : 'text-slate-300'}`}
                  style={{ fontFamily: 'monospace' }}
                >
                  {token.length}/4
                </span>
              </div>

              {/* Search btn */}
              <button
                onClick={handleSearch}
                disabled={token.length !== 4 || tokenLoading}
                className="w-full py-3.25 rounded-[10px] border-none bg-blue-600 text-white text-sm font-bold cursor-pointer mb-2.5 transition-all duration-150 shadow-[0_2px_10px_rgba(37,99,235,.3)] flex items-center justify-center gap-2 hover:not-disabled:bg-blue-700 hover:not-disabled:shadow-[0_4px_16px_rgba(37,99,235,.4)] hover:not-disabled:-translate-y-px disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-y-0"
                style={{ fontFamily: 'inherit' }}
              >
                {tokenLoading ? (
                  <>
                    <span className="ts-spinner" />
                    Searching…
                  </>
                ) : (
                  <>
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="11" cy="11" r="8" />
                      <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    Search Token
                  </>
                )}
              </button>

              {/* Clear btn */}
              {searched && (
                <button
                  onClick={handleClear}
                  className="w-full py-2.75 rounded-[10px] border-[1.5px] border-slate-200 bg-white text-[13px] font-semibold text-slate-500 cursor-pointer mb-2.5 transition-all duration-150 flex items-center justify-center gap-1.5 hover:bg-slate-50 hover:text-slate-900"
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
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                  Clear Search
                </button>
              )}

              {/* Hint */}
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#94a3b8"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                Tokens are exactly 4 characters · Press Enter to search
              </div>
            </div>

            {/* Tips card */}
            <div className="bg-white border border-slate-200 rounded-2xl px-5 py-4.5 shadow-[0_1px_6px_rgba(15,23,42,.05)]">
              <p className="text-[11px] font-bold tracking-[.07em] uppercase text-slate-400 mb-2.5">
                Quick Tips
              </p>
              {QUICK_TIPS.map((tip, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2 py-1 text-[12.5px] text-slate-600 leading-normal"
                >
                  <div className="w-1.25 h-1.25 rounded-full bg-blue-600 shrink-0 mt-1.5" />
                  {tip}
                </div>
              ))}
            </div>
          </div>

          {/* ── RIGHT ── */}
          <div>
            {/* Default */}
            {showDefault && (
              <div className="bg-white border border-slate-200 rounded-2xl p-7 shadow-[0_1px_6px_rgba(15,23,42,.05)]">
                <p className="text-[15px] font-extrabold text-slate-900 mb-1">
                  How Token Search Works
                </p>
                <p className="text-[13px] text-slate-400 mb-6">
                  Pull up full appointment details in seconds.
                </p>
                <div className="flex flex-col gap-2.5 mb-5.5">
                  {HOW_IT_WORKS.map((s, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3.5 p-3.5 rounded-xl bg-slate-50 border border-slate-100"
                    >
                      <div className="w-9 h-9 rounded-[10px] bg-blue-50 border border-blue-200 flex items-center justify-center text-base shrink-0">
                        {s.icon}
                      </div>
                      <div>
                        <p className="text-[13px] font-bold text-slate-900 mb-0.5">
                          {s.title}
                        </p>
                        <p className="text-xs text-slate-500 leading-normal">
                          {s.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-[11px] font-bold tracking-[.06em] uppercase text-slate-400 mb-2.5">
                  Example Tokens
                </p>
                <div className="flex gap-2 flex-wrap">
                  {['G5H7', 'JP69', 'C5J2', 'GRZ6'].map((t) => (
                    <span
                      key={t}
                      className="px-3.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-sm font-extrabold text-blue-600 tracking-widest"
                      style={{ fontFamily: "'Courier New', monospace" }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Loading skeleton */}
            {tokenLoading && (
              <div className="bg-white border border-slate-200 rounded-2xl p-7">
                <div
                  className="ts-skel"
                  style={{
                    width: 54,
                    height: 54,
                    borderRadius: 14,
                    marginBottom: 20,
                  }}
                />
                {[85, 60, 75, 50, 70, 45, 80, 55].map((w, i) => (
                  <div
                    key={i}
                    className="ts-skel"
                    style={{ width: `${w}%`, height: 13 }}
                  />
                ))}
              </div>
            )}

            {/* Not found */}
            {showNotFound && (
              <div className="bg-white border-[1.5px] border-red-200 rounded-2xl py-10 px-7 text-center">
                <div className="w-14 h-14 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center mx-auto mb-4 text-2xl">
                  🔍
                </div>
                <p className="text-base font-extrabold text-slate-900 mb-2">
                  No Appointment Found
                </p>
                <p className="text-[13px] text-slate-500 leading-[1.7]">
                  We couldn't find any appointment linked to token{' '}
                  <span
                    className="font-extrabold text-red-600 bg-red-50 px-2 py-0.5 rounded-md border border-red-200"
                    style={{ fontFamily: "'Courier New', monospace" }}
                  >
                    {token}
                  </span>
                  .
                </p>
                <div className="mt-4.5 p-3.5 bg-slate-50 rounded-[10px] text-xs text-slate-400 leading-[1.8] text-left">
                  <strong className="text-slate-600">Things to check:</strong>
                  <br />
                  · Verify the token from the patient's printed receipt
                  <br />
                  · The appointment may have been cancelled
                  <br />· Try searching with a different token
                </div>
              </div>
            )}

            {/* Result */}
            {showResult && (
              <div className="flex flex-col gap-3.5">
                {/* Hero card */}
                <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-[0_2px_10px_rgba(15,23,42,.06)]">
                  <div
                    className="flex items-center gap-4 flex-wrap px-6 py-5 border-b border-[#e8edf8]"
                    style={{
                      background:
                        'linear-gradient(135deg,#fafbff 0%,#eef2ff 100%)',
                    }}
                  >
                    <div
                      className="w-13.5 h-13.5 rounded-[15px] shrink-0 flex items-center justify-center text-lg font-extrabold text-white tracking-[-0.5px] shadow-[0_4px_14px_rgba(37,99,235,.25)]"
                      style={{
                        background: `linear-gradient(135deg,${c1},${c2})`,
                      }}
                    >
                      {initials}
                    </div>
                    <div className="flex-1">
                      <p className="text-lg font-extrabold text-slate-900 mb-2 tracking-[-0.3px]">
                        {fullName || 'Unknown Patient'}
                      </p>
                      <div className="flex gap-1.5 flex-wrap">
                        {st && (
                          <Pill bg={st.bg} border={st.border} color={st.color}>
                            <span className="w-1.25 h-1.25 rounded-full bg-current inline-block" />
                            {st.label}
                          </Pill>
                        )}
                        {sv && sev && (
                          <Pill bg={sv.bg} border={sv.border} color={sv.color}>
                            <span className="capitalize">{sev} severity</span>
                          </Pill>
                        )}
                        {apt.triage?.priorityScore != null && (
                          <Pill bg="#f1f5f9" border="#e2e8f0" color="#64748b">
                            Priority {apt.triage.priorityScore}
                          </Pill>
                        )}
                        {apt.token && (
                          <span
                            className="px-2.75 py-1 rounded-[20px] text-[11px] font-extrabold bg-blue-50 border border-blue-200 text-blue-600 tracking-[.07em]"
                            style={{ fontFamily: "'Courier New', monospace" }}
                          >
                            🏷 {apt.token}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Quick stat strip */}
                  <div className="grid grid-cols-3 border-t border-slate-100 max-[500px]:grid-cols-2">
                    {apt.patientDetails?.age && (
                      <div className="px-5 py-3.5 border-r border-slate-100">
                        <p className="text-[10.5px] text-slate-400 font-medium mb-0.75 uppercase tracking-[.05em]">
                          Age
                        </p>
                        <p className="text-sm font-bold text-slate-900">
                          {apt.patientDetails.age} yrs
                        </p>
                      </div>
                    )}
                    {apt.patientDetails?.gender && (
                      <div className="px-5 py-3.5 border-r border-slate-100">
                        <p className="text-[10.5px] text-slate-400 font-medium mb-0.75 uppercase tracking-[.05em]">
                          Gender
                        </p>
                        <p className="text-sm font-bold text-slate-900 capitalize">
                          {apt.patientDetails.gender}
                        </p>
                      </div>
                    )}
                    {apt.patientDetails?.phoneNumber && (
                      <div className="px-5 py-3.5">
                        <p className="text-[10.5px] text-slate-400 font-medium mb-0.75 uppercase tracking-[.05em]">
                          Phone
                        </p>
                        <p className="text-sm font-bold text-slate-900">
                          {apt.patientDetails.phoneNumber}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* 2-col info grid */}
                <div className="grid grid-cols-2 gap-3.5 max-[640px]:grid-cols-1">
                  {/* Doctor card — full width */}
                  <div className="col-span-full bg-white border border-slate-200 rounded-[14px] overflow-hidden shadow-[0_1px_6px_rgba(15,23,42,.04)]">
                    <div className="flex items-center gap-2 px-4 py-2.75 border-b-2 border-green-200">
                      <div className="w-5.5 h-5.5 rounded-md bg-green-50 border border-green-200 flex items-center justify-center text-[11px] shrink-0 text-green-600">
                        🩺
                      </div>
                      <span className="text-[10.5px] font-bold tracking-[.08em] uppercase text-green-600">
                        Doctor Information
                      </span>
                    </div>
                    <div
                      className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-100"
                      style={{
                        background: 'linear-gradient(135deg,#f0fdf4,#dcfce7)',
                      }}
                    >
                      <div
                        className="w-10 h-10 rounded-[11px] shrink-0 flex items-center justify-center text-[13px] font-extrabold text-white uppercase shadow-[0_3px_10px_rgba(22,163,74,.25)]"
                        style={{
                          background: 'linear-gradient(135deg,#16a34a,#0891b2)',
                        }}
                      >
                        {apt.doctorDetails?.firstName?.[0]}
                        {apt.doctorDetails?.lastName?.[0]}
                      </div>
                      <div>
                        <p className="text-sm font-extrabold text-slate-900 mb-0.5">
                          Dr.{' '}
                          {[
                            apt.doctorDetails?.firstName,
                            apt.doctorDetails?.lastName,
                          ]
                            .filter(Boolean)
                            .join(' ') || '—'}
                        </p>
                        {apt.doctorDetails?.department && (
                          <p className="text-xs text-slate-500">
                            {apt.doctorDetails.department}
                          </p>
                        )}
                      </div>
                      {apt.doctorDetails?.availabilityStatus && (
                        <span
                          className="ml-auto shrink-0 inline-flex items-center gap-1.25 px-2.5 py-0.75 rounded-[20px] text-[11px] font-bold capitalize"
                          style={
                            apt.doctorDetails.availabilityStatus === 'available'
                              ? {
                                  background: '#f0fdf4',
                                  border: '1px solid #bbf7d0',
                                  color: '#16a34a',
                                }
                              : {
                                  background: '#f1f5f9',
                                  border: '1px solid #e2e8f0',
                                  color: '#64748b',
                                }
                          }
                        >
                          <span className="w-1.25 h-1.25 rounded-full bg-current" />
                          {apt.doctorDetails.availabilityStatus}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap">
                      {apt.doctorDetails?.consultationFee != null && (
                        <div className="ts-doc-detail flex items-start gap-2 p-[10px_14px] flex-1 min-w-32.5 border-r border-t border-slate-50">
                          <div className="w-6.5 h-6.5 rounded-[7px] bg-slate-50 border border-slate-100 flex items-center justify-center text-xs shrink-0">
                            💰
                          </div>
                          <div>
                            <p className="text-[10.5px] text-slate-400 mb-0.5">
                              Consultation Fee
                            </p>
                            <p className="text-[12.5px] text-slate-900 font-bold">
                              ₹{apt.doctorDetails.consultationFee}
                            </p>
                          </div>
                        </div>
                      )}
                      {apt.doctorDetails?.workingHours?.start &&
                        apt.doctorDetails?.workingHours?.end && (
                          <div className="ts-doc-detail flex items-start gap-2 p-[10px_14px] flex-1 min-w-32.5 border-r border-t border-slate-50">
                            <div className="w-6.5 h-6.5 rounded-[7px] bg-slate-50 border border-slate-100 flex items-center justify-center text-xs shrink-0">
                              🕐
                            </div>
                            <div>
                              <p className="text-[10.5px] text-slate-400 mb-0.5">
                                Working Hours
                              </p>
                              <p className="text-[12.5px] text-slate-900 font-bold">
                                {apt.doctorDetails.workingHours.start} –{' '}
                                {apt.doctorDetails.workingHours.end}
                              </p>
                            </div>
                          </div>
                        )}
                      {apt.doctorDetails?.department && (
                        <div className="ts-doc-detail flex items-start gap-2 p-[10px_14px] flex-1 min-w-32.5 border-t border-slate-50">
                          <div className="w-6.5 h-6.5 rounded-[7px] bg-slate-50 border border-slate-100 flex items-center justify-center text-xs shrink-0">
                            🏥
                          </div>
                          <div>
                            <p className="text-[10.5px] text-slate-400 mb-0.5">
                              Department
                            </p>
                            <p className="text-[12.5px] text-slate-900 font-bold">
                              {apt.doctorDetails.department}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Patient details */}
                  {(apt.patientDetails?.address ||
                    apt.patientDetails?.insuranceDetails) && (
                    <SectionCard
                      title="Patient Details"
                      icon="👤"
                      accent="#2563eb"
                      accentBg="#eff6ff"
                      accentBorder="#bfdbfe"
                    >
                      <InfoField
                        label="Address"
                        value={apt.patientDetails?.address}
                      />
                      <InfoField
                        label="Insurance"
                        value={apt.patientDetails?.insuranceDetails}
                      />
                    </SectionCard>
                  )}

                  {/* Triage card — full width */}
                  {apt.triage && (
                    <div className="col-span-full bg-white border border-slate-200 rounded-[14px] overflow-hidden shadow-[0_1px_6px_rgba(15,23,42,.04)]">
                      <div className="flex items-center gap-2 px-4 py-2.75 border-b-2 border-orange-200">
                        <div className="w-5.5 h-5.5 rounded-md bg-orange-50 border border-orange-200 flex items-center justify-center text-[11px] shrink-0">
                          🏥
                        </div>
                        <span className="text-[10.5px] font-bold tracking-[.08em] uppercase text-orange-600">
                          Clinical / Triage
                        </span>
                      </div>

                      {/* Vitals strip */}
                      {(apt.triage.vitals?.heartRate ||
                        apt.triage.vitals?.temperature ||
                        apt.triage.vitals?.bloodPressure) && (
                        <div className="flex border-t border-slate-50">
                          {apt.triage.vitals?.heartRate && (
                            <div className="flex-1 px-3.5 py-3 text-center border-r border-slate-50">
                              <p className="text-lg font-extrabold text-orange-600 mb-0.5">
                                {apt.triage.vitals.heartRate}
                              </p>
                              <p className="text-[10px] text-slate-400 font-medium">
                                BPM
                              </p>
                            </div>
                          )}
                          {apt.triage.vitals?.temperature && (
                            <div className="flex-1 px-3.5 py-3 text-center border-r border-slate-50">
                              <p className="text-lg font-extrabold text-orange-600 mb-0.5">
                                {apt.triage.vitals.temperature}°
                              </p>
                              <p className="text-[10px] text-slate-400 font-medium">
                                Temp
                              </p>
                            </div>
                          )}
                          {apt.triage.vitals?.bloodPressure && (
                            <div className="flex-1 px-3.5 py-3 text-center">
                              <p className="text-sm font-extrabold text-orange-600 mb-0.5">
                                {apt.triage.vitals.bloodPressure}
                              </p>
                              <p className="text-[10px] text-slate-400 font-medium">
                                BP
                              </p>
                            </div>
                          )}
                        </div>
                      )}

                      <div className="grid grid-cols-2 max-[480px]:grid-cols-1">
                        {apt.triage.symptoms?.length > 0 && (
                          <div className="col-span-full p-[10px_14px] border-t border-slate-50">
                            <p className="text-[10.5px] text-slate-400 font-medium mb-1">
                              Symptoms
                            </p>
                            <div className="flex flex-wrap gap-1.25 mt-1">
                              {apt.triage.symptoms.map((s, i) => (
                                <span
                                  key={i}
                                  className="px-2.25 py-0.75 rounded-[20px] bg-orange-50 border border-orange-200 text-[11px] font-semibold text-orange-600 capitalize"
                                >
                                  {s}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        {apt.triage.description && (
                          <div className="col-span-full p-[10px_14px] border-t border-slate-50">
                            <p className="text-[10.5px] text-slate-400 font-medium mb-1">
                              Description
                            </p>
                            <p className="text-[13px] text-slate-900 font-semibold wrap-break-word leading-[1.4]">
                              {apt.triage.description}
                            </p>
                          </div>
                        )}
                        {apt.triage.comorbidities?.length > 0 && (
                          <div className="col-span-full p-[10px_14px] border-t border-slate-50">
                            <p className="text-[10.5px] text-slate-400 font-medium mb-1">
                              Comorbidities
                            </p>
                            <p className="text-[13px] text-slate-900 font-semibold capitalize wrap-break-word leading-[1.4]">
                              {apt.triage.comorbidities.join(', ')}
                            </p>
                          </div>
                        )}
                        {apt.triage.source && (
                          <div className="p-[10px_14px] border-t border-r border-slate-50">
                            <p className="text-[10.5px] text-slate-400 font-medium mb-1">
                              AI Source
                            </p>
                            <p className="text-[13px] text-slate-900 font-semibold capitalize wrap-break-word leading-[1.4]">
                              {apt.triage.source}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Timeline — full width */}
                  {timelineItems.length > 0 && (
                    <div className="col-span-full bg-white border border-slate-200 rounded-[14px] overflow-hidden shadow-[0_1px_6px_rgba(15,23,42,.04)]">
                      <div className="flex items-center gap-2 px-4 py-2.75 border-b-2 border-blue-200">
                        <div className="w-5.5 h-5.5 rounded-md bg-blue-50 border border-blue-200 flex items-center justify-center text-[11px] shrink-0">
                          🕐
                        </div>
                        <span className="text-[10.5px] font-bold tracking-[.08em] uppercase text-blue-600">
                          Appointment Timeline
                        </span>
                      </div>
                      <div className="flex px-4 py-5 gap-0 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                        {timelineItems.map((r, i) => (
                          <div
                            key={i}
                            className="ts-tl-step done flex flex-col items-center flex-1 min-w-22.5 relative"
                          >
                            <div className="w-5.5 h-5.5 rounded-full border-2 border-blue-600 bg-blue-600 flex items-center justify-center shrink-0 mb-2.5 relative z-10 shadow-[0_2px_8px_rgba(37,99,235,.3)]">
                              <span className="ts-tl-check">
                                <svg
                                  width="9"
                                  height="9"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="3"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <polyline points="20 6 9 17 4 12" />
                                </svg>
                              </span>
                              <span className="ts-tl-inner w-1.5 h-1.5 rounded-full bg-slate-200" />
                            </div>
                            <div className="text-center px-1">
                              <p className="text-[10px] text-blue-300 font-medium mb-0.75 leading-[1.3]">
                                {r.label}
                              </p>
                              <p className="text-[10.5px] text-slate-900 font-bold leading-[1.3]">
                                {r.value}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}