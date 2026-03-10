import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAppointmentByToken } from '../receptionistThunks';
import { clearTokenAppointment } from '../receptionistSlice';

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

function Chip({ children, bg, border, color }) {
  return (
    <span
      className="inline-flex items-center gap-1.25 px-2.75 py-1 rounded-full text-[11px] font-bold whitespace-nowrap"
      style={{ background: bg, border: `1px solid ${border}`, color }}
    >
      {children}
    </span>
  );
}

function FieldItem({ label, value }) {
  if (!value && value !== 0) return null;
  return (
    <div className="px-3.5 py-2 border-b border-[#f8fafc] last:border-b-0">
      <p className="text-[10.5px] text-slate-400 font-medium mb-0.5">{label}</p>
      <p className="text-[13px] text-slate-900 font-semibold capitalize wrap-break-word leading-[1.4]">
        {value}
      </p>
    </div>
  );
}

function InfoCard({ title, icon, children, fullWidth }) {
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
    <div
      className={`bg-white border border-slate-200 rounded-[14px] overflow-hidden${fullWidth ? ' col-span-full' : ''}`}
    >
      <div className="flex items-center gap-1.75 px-3.5 py-2.5 bg-white border-b border-slate-100">
        <span className="w-5 h-5 rounded-[5px] bg-slate-100 flex items-center justify-center text-[11px] shrink-0">
          {icon}
        </span>
        <span className="text-[10px] font-bold tracking-[.08em] uppercase text-slate-400">
          {title}
        </span>
      </div>
      <div>{children}</div>
    </div>
  );
}

export default function TokenDetailModal({ token, onClose }) {
  const dispatch = useDispatch();
  const { tokenAppointment: apt, tokenLoading } = useSelector(
    (s) => s.receptionist,
  );

  useEffect(() => {
    if (token) dispatch(fetchAppointmentByToken(token));
    return () => dispatch(clearTokenAppointment());
  }, [token, dispatch]);

  if (!token) return null;

  const aptIsValid = !!(
    apt &&
    (apt.patientDetails?.firstName || apt.patientDetails?.lastName || apt.token)
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

  const timelineItems = [
    { label: 'Scheduled Date', value: fmtDateOnly(apt?.scheduledDate) },
    { label: 'Booked On', value: fmtDateTime(apt?.bookedOn) },
    { label: 'Checked In', value: fmtDateTime(apt?.checkedInAt) },
    { label: 'Called At', value: fmtDateTime(apt?.calledAt) },
    {
      label: 'Consultation Started',
      value: fmtDateTime(apt?.consulationStartsAt),
    },
    { label: 'Consultation Ended', value: fmtDateTime(apt?.consulationEndsAt) },
  ].filter((r) => r.value);

  return (
    <>
      <style>{`
        @keyframes tdm-bg   { from{opacity:0}                               to{opacity:1} }
        @keyframes tdm-rise { from{transform:translateY(16px);opacity:0}    to{transform:translateY(0);opacity:1} }
        @keyframes tdm-shim { 0%{background-position:200% 0} 100%{background-position:-200% 0} }

        .tdm-overlay { animation: tdm-bg   .18s ease; }
        .tdm-shell   { animation: tdm-rise .22s ease; }

        .skel {
          border-radius: 8px;
          background: linear-gradient(90deg,#f1f5f9 25%,#e2e8f0 50%,#f1f5f9 75%);
          background-size: 200% 100%;
          animation: tdm-shim 1.4s infinite;
        }

        /* timeline connector pseudo-elements */
        .tdm-tl-step:not(:last-child)::after {
          content:''; position:absolute; top:12px; left:calc(50% + 12px);
          width:calc(100% - 24px); height:2px;
          background:linear-gradient(90deg,#e2e8f0 0%,#f1f5f9 100%);
        }
        .tdm-tl-step.done:not(:last-child)::after {
          background:linear-gradient(90deg,#bfdbfe 0%,#e2e8f0 100%);
        }

        /* timeline node/check toggle */
        .tdm-tl-node-inner { width:7px; height:7px; border-radius:50%; background:#e2e8f0; }
        .tdm-tl-check       { display:none; color:#fff; }
        .tdm-tl-step.done .tdm-tl-node-inner { display:none; }
        .tdm-tl-step.done .tdm-tl-check      { display:block; }
        .tdm-tl-step.done .tdm-tl-label      { color:#6ea8fe; }

        /* triage grid nth-child */
        .tdm-triage-item:nth-child(even) { border-right:none; }

        /* sidebar scrollbar hide */
        .tdm-sidebar::-webkit-scrollbar { display:none; }

        /* content scrollbar */
        .tdm-content::-webkit-scrollbar       { width:4px; }
        .tdm-content::-webkit-scrollbar-thumb { background:#e2e8f0; border-radius:4px; }

        /* responsive */
        @media(max-width:580px){
          .tdm-body    { flex-direction:column; }
          .tdm-sidebar { width:100%; padding:18px; }
          .tdm-grid    { grid-template-columns:1fr !important; }
          .tdm-shell   { max-height:94vh; }
        }
      `}</style>

      {/* Overlay */}
      <div
        className="tdm-overlay fixed inset-0 z-200 flex items-center justify-center p-5 bg-[rgba(2,6,23,0.6)] backdrop-blur-xs"
        style={{
          fontFamily:
            "'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        }}
        onClick={onClose}
      >
        {/* Shell */}
        <div
          className="tdm-shell w-full max-w-205 max-h-[88vh] flex flex-col bg-white rounded-[22px] overflow-hidden shadow-[0_40px_100px_rgba(2,6,23,.3),0_0_0_1px_rgba(2,6,23,.08)]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* ── Top bar ── */}
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 shrink-0 bg-white">
            <div className="flex items-center">
              <span className="inline-flex items-center gap-1.25 bg-blue-50 border border-blue-200 rounded-full px-2.5 py-0.75 text-[11px] font-bold text-blue-600">
                <svg
                  width="11"
                  height="11"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                Patient Card
              </span>
              <span className="text-[12.5px] text-slate-400 ml-2.5">
                Appointment Details
              </span>
            </div>
            <button
              onClick={onClose}
              className="w-7.5 h-7.5 rounded-lg border-[1.5px] border-slate-200 bg-slate-50 flex items-center justify-center cursor-pointer text-slate-400 transition-all duration-150 hover:bg-red-50 hover:border-red-200 hover:text-red-500"
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* ── Body ── */}
          <div className="tdm-body flex flex-1 overflow-hidden min-h-0">
            {/* ── Sidebar ── */}
            <div
              className="tdm-sidebar w-55 shrink-0 border-r border-[#e8edf8] px-5 py-6 pb-5 flex flex-col gap-0 overflow-y-auto [scrollbar-width:none]"
              style={{
                background: 'linear-gradient(160deg, #fafbff 0%, #f0f4ff 100%)',
              }}
            >
              {tokenLoading ? (
                <>
                  <div
                    className="skel mb-3.5"
                    style={{ width: 58, height: 58, borderRadius: 16 }}
                  />
                  <div
                    className="skel mb-2"
                    style={{ width: '85%', height: 16 }}
                  />
                  <div
                    className="skel mb-5"
                    style={{ width: '55%', height: 11 }}
                  />
                  <div
                    className="skel mb-3.5"
                    style={{ width: '100%', height: 1 }}
                  />
                  {[70, 55, 80, 60].map((w, i) => (
                    <div
                      key={i}
                      className="skel mb-2.5"
                      style={{ width: `${w}%`, height: 11 }}
                    />
                  ))}
                </>
              ) : aptIsValid ? (
                <>
                  {/* Avatar */}
                  <div
                    className="w-14.5 h-14.5 rounded-2xl shrink-0 flex items-center justify-center text-[20px] font-extrabold text-white tracking-[-0.5px] mb-3.5 shadow-[0_4px_14px_rgba(37,99,235,.25)]"
                    style={{
                      background: `linear-gradient(135deg,${c1},${c2})`,
                    }}
                  >
                    {initials}
                  </div>

                  <p className="text-base font-extrabold text-slate-900 tracking-[-0.3px] leading-[1.3] mb-1.25">
                    {fullName}
                  </p>

                  {apt.patientDetails?.phoneNumber && (
                    <p className="text-xs text-slate-400 flex items-center gap-1.25 mb-0">
                      <svg
                        width="10"
                        height="10"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                      </svg>
                      {apt.patientDetails.phoneNumber}
                    </p>
                  )}

                  <div className="h-px bg-[#e8edf8] my-4" />
                  <p className="text-[9.5px] font-bold tracking-[.09em] uppercase text-[#b0bcd4] mb-3">
                    Personal Details
                  </p>

                  {apt.patientDetails?.age && (
                    <div className="flex items-start gap-2.25 mb-3">
                      <div className="w-6.5 h-6.5 rounded-lg shrink-0 bg-white border border-[#e8edf8] shadow-[0_1px_4px_rgba(37,99,235,.07)] flex items-center justify-center text-xs mt-px">
                        🎂
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 font-medium mb-0.5">
                          Age
                        </p>
                        <p className="text-[12.5px] text-slate-800 font-semibold leading-[1.3]">
                          {apt.patientDetails.age} yrs
                        </p>
                      </div>
                    </div>
                  )}
                  {apt.patientDetails?.gender && (
                    <div className="flex items-start gap-2.25 mb-3">
                      <div className="w-6.5 h-6.5 rounded-lg shrink-0 bg-white border border-[#e8edf8] shadow-[0_1px_4px_rgba(37,99,235,.07)] flex items-center justify-center text-xs mt-px">
                        👤
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 font-medium mb-0.5">
                          Gender
                        </p>
                        <p className="text-[12.5px] text-slate-800 font-semibold leading-[1.3] capitalize">
                          {apt.patientDetails.gender}
                        </p>
                      </div>
                    </div>
                  )}
                  {apt.patientDetails?.address && (
                    <div className="flex items-start gap-2.25 mb-3">
                      <div className="w-6.5 h-6.5 rounded-lg shrink-0 bg-white border border-[#e8edf8] shadow-[0_1px_4px_rgba(37,99,235,.07)] flex items-center justify-center text-xs mt-px">
                        📍
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 font-medium mb-0.5">
                          Address
                        </p>
                        <p className="text-[12.5px] text-slate-800 font-semibold leading-[1.3]">
                          {apt.patientDetails.address}
                        </p>
                      </div>
                    </div>
                  )}
                  {apt.patientDetails?.insuranceDetails && (
                    <div className="flex items-start gap-2.25 mb-3">
                      <div className="w-6.5 h-6.5 rounded-lg shrink-0 bg-white border border-[#e8edf8] shadow-[0_1px_4px_rgba(37,99,235,.07)] flex items-center justify-center text-xs mt-px">
                        🛡
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 font-medium mb-0.5">
                          Insurance
                        </p>
                        <p className="text-[12.5px] text-slate-800 font-semibold leading-[1.3]">
                          {apt.patientDetails.insuranceDetails}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Token block */}
                  <div className="mt-auto pt-4.5 border-t border-[#e8edf8]">
                    <p className="text-[9.5px] font-bold tracking-widest uppercase text-[#b0bcd4] mb-1.5">
                      Token
                    </p>
                    <p
                      className="text-[22px] font-black text-blue-600 tracking-widest"
                      style={{ fontFamily: "'Courier New', monospace" }}
                    >
                      {apt.token || token}
                    </p>
                  </div>
                </>
              ) : (
                <div>
                  <p className="text-[9.5px] font-bold tracking-widest uppercase text-[#b0bcd4] mb-1.5">
                    Token
                  </p>
                  <p
                    className="text-[22px] font-black text-blue-600 tracking-widest"
                    style={{ fontFamily: "'Courier New', monospace" }}
                  >
                    {token}
                  </p>
                </div>
              )}
            </div>

            {/* ── Content ── */}
            <div className="tdm-content flex-1 overflow-y-auto p-5 bg-slate-50 [scrollbar-width:thin] [scrollbar-color:#e2e8f0_transparent]">
              {tokenLoading ? (
                <div>
                  <div className="flex gap-2 mb-4">
                    {[80, 90, 70].map((w, i) => (
                      <div
                        key={i}
                        className="skel h-6 rounded-full"
                        style={{ width: w }}
                      />
                    ))}
                  </div>
                  <div className="tdm-grid grid grid-cols-2 gap-3">
                    {[130, 150, 120, 140].map((h, i) => (
                      <div
                        key={i}
                        className="skel rounded-[14px]"
                        style={{ height: h }}
                      />
                    ))}
                  </div>
                </div>
              ) : !aptIsValid ? (
                /* Not found */
                <div className="h-full flex flex-col items-center justify-center gap-2.5 p-10 text-center">
                  <div className="w-15 h-15 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center text-[26px] mb-1.5">
                    🔍
                  </div>
                  <p className="text-[15px] font-bold text-slate-900">
                    No appointment found
                  </p>
                  <p className="text-[13px] text-slate-400 max-w-65 leading-[1.6]">
                    Token{' '}
                    <strong
                      className="text-red-500"
                      style={{ fontFamily: 'monospace' }}
                    >
                      {token}
                    </strong>{' '}
                    doesn't match any record.
                  </p>
                </div>
              ) : (
                <>
                  {/* Status chips */}
                  <div className="flex gap-1.5 flex-wrap mb-4">
                    {st && (
                      <Chip bg={st.bg} border={st.border} color={st.color}>
                        <span className="w-1.25 h-1.25 rounded-full bg-current inline-block" />
                        {st.label}
                      </Chip>
                    )}
                    {sv && sev && (
                      <Chip bg={sv.bg} border={sv.border} color={sv.color}>
                        <span className="capitalize">{sev} severity</span>
                      </Chip>
                    )}
                    {apt.triage?.priorityScore != null && (
                      <Chip bg="#f1f5f9" border="#e2e8f0" color="#64748b">
                        Priority {apt.triage.priorityScore}
                      </Chip>
                    )}
                    {apt.scheduledDate && (
                      <Chip bg="#f8fafc" border="#e2e8f0" color="#475569">
                        <svg
                          width="10"
                          height="10"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <rect x="3" y="4" width="18" height="18" rx="2" />
                          <line x1="16" y1="2" x2="16" y2="6" />
                          <line x1="8" y1="2" x2="8" y2="6" />
                          <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                        {fmtDateOnly(apt.scheduledDate)}
                      </Chip>
                    )}
                  </div>

                  {/* Grid */}
                  <div className="tdm-grid grid grid-cols-2 gap-3">
                    {/* Doctor card — full width */}
                    <div className="col-span-full bg-white border border-slate-200 rounded-[14px] overflow-hidden">
                      <div className="flex items-center gap-1.75 px-3.5 py-2.5 bg-white border-b border-slate-100">
                        <span className="w-5 h-5 rounded-[5px] bg-slate-100 flex items-center justify-center text-[11px] shrink-0">
                          🩺
                        </span>
                        <span className="text-[10px] font-bold tracking-[.08em] uppercase text-slate-400">
                          Doctor Information
                        </span>
                      </div>

                      {/* Doctor hero strip */}
                      <div
                        className="flex items-center gap-3.5 px-4 py-3.5 border-b border-slate-100"
                        style={{
                          background:
                            'linear-gradient(135deg,#fafbff 0%,#f0f4ff 100%)',
                        }}
                      >
                        <div
                          className="w-11 h-11 rounded-xl shrink-0 flex items-center justify-center text-sm font-extrabold text-white tracking-[-0.3px] uppercase shadow-[0_3px_10px_rgba(37,99,235,.25)]"
                          style={{
                            background:
                              'linear-gradient(135deg,#2563eb,#7c3aed)',
                          }}
                        >
                          {apt.doctorDetails?.firstName?.[0]}
                          {apt.doctorDetails?.lastName?.[0]}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[15px] font-extrabold text-slate-900 mb-0.5">
                            Dr.{' '}
                            {[
                              apt.doctorDetails?.firstName,
                              apt.doctorDetails?.lastName,
                            ]
                              .filter(Boolean)
                              .join(' ') || '—'}
                          </p>
                          {apt.doctorDetails?.department && (
                            <p className="text-xs text-slate-500 font-medium">
                              {apt.doctorDetails.department}
                            </p>
                          )}
                        </div>
                        {apt.doctorDetails?.availabilityStatus && (
                          <span
                            className="inline-flex items-center gap-1.25 px-2.5 py-1 rounded-full text-[11px] font-bold shrink-0 capitalize"
                            style={
                              apt.doctorDetails.availabilityStatus ===
                              'available'
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
                            <span className="w-1.5 h-1.5 rounded-full bg-current" />
                            {apt.doctorDetails.availabilityStatus}
                          </span>
                        )}
                      </div>

                      {/* Doctor detail items */}
                      <div className="flex flex-wrap gap-0 px-2 py-1.5">
                        {apt.doctorDetails?.consultationFee != null && (
                          <div className="flex items-start gap-2.25 px-2.5 py-2.5 flex-1 min-w-37.5">
                            <div className="w-7 h-7 rounded-lg shrink-0 bg-slate-50 border border-slate-100 flex items-center justify-center text-[13px]">
                              💰
                            </div>
                            <div>
                              <p className="text-[10.5px] text-slate-400 font-medium mb-0.5">
                                Consultation Fee
                              </p>
                              <p className="text-[13px] text-slate-900 font-bold">
                                ₹{apt.doctorDetails.consultationFee}
                              </p>
                            </div>
                          </div>
                        )}
                        {apt.doctorDetails?.workingHours?.start &&
                          apt.doctorDetails?.workingHours?.end && (
                            <div className="flex items-start gap-2.25 px-2.5 py-2.5 flex-1 min-w-37.5">
                              <div className="w-7 h-7 rounded-lg shrink-0 bg-slate-50 border border-slate-100 flex items-center justify-center text-[13px]">
                                🕐
                              </div>
                              <div>
                                <p className="text-[10.5px] text-slate-400 font-medium mb-0.5">
                                  Working Hours
                                </p>
                                <p className="text-[13px] text-slate-900 font-bold">
                                  {apt.doctorDetails.workingHours.start} –{' '}
                                  {apt.doctorDetails.workingHours.end}
                                </p>
                              </div>
                            </div>
                          )}
                        {apt.doctorDetails?.department && (
                          <div className="flex items-start gap-2.25 px-2.5 py-2.5 flex-1 min-w-37.5">
                            <div className="w-7 h-7 rounded-lg shrink-0 bg-slate-50 border border-slate-100 flex items-center justify-center text-[13px]">
                              🏥
                            </div>
                            <div>
                              <p className="text-[10.5px] text-slate-400 font-medium mb-0.5">
                                Department
                              </p>
                              <p className="text-[13px] text-slate-900 font-bold">
                                {apt.doctorDetails.department}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Triage card — full width */}
                    {apt.triage && (
                      <div className="col-span-full bg-white border border-slate-200 rounded-[14px] overflow-hidden">
                        <div className="flex items-center gap-1.75 px-3.5 py-2.5 bg-white border-b border-slate-100">
                          <span className="w-5 h-5 rounded-[5px] bg-slate-100 flex items-center justify-center text-[11px] shrink-0">
                            🏥
                          </span>
                          <span className="text-[10px] font-bold tracking-[.08em] uppercase text-slate-400">
                            Clinical / Triage
                          </span>
                        </div>
                        <div className="grid grid-cols-2">
                          {apt.triage.symptoms?.length > 0 && (
                            <div className="col-span-full px-3.5 py-2.5 border-b border-[#f8fafc]">
                              <p className="text-[10.5px] text-slate-400 font-medium mb-1">
                                Symptoms
                              </p>
                              <div className="flex flex-wrap gap-1.25 mt-1">
                                {apt.triage.symptoms.map((s, i) => (
                                  <span
                                    key={i}
                                    className="px-2.25 py-0.75 rounded-full bg-blue-50 border border-blue-200 text-[11px] font-semibold text-blue-600 capitalize"
                                  >
                                    {s}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                          {apt.triage.description && (
                            <div className="col-span-full px-3.5 py-2.5 border-b border-[#f8fafc]">
                              <p className="text-[10.5px] text-slate-400 font-medium mb-1">
                                Description
                              </p>
                              <p className="text-[13px] text-slate-900 font-semibold wrap-break-word leading-[1.4]">
                                {apt.triage.description}
                              </p>
                            </div>
                          )}
                          {apt.triage.vitals?.heartRate && (
                            <div className="tdm-triage-item px-3.5 py-2.5 border-b border-r border-[#f8fafc]">
                              <p className="text-[10.5px] text-slate-400 font-medium mb-0.5">
                                Heart Rate
                              </p>
                              <p className="text-[13px] text-slate-900 font-semibold capitalize wrap-break-word leading-[1.4]">
                                {apt.triage.vitals.heartRate} bpm
                              </p>
                            </div>
                          )}
                          {apt.triage.vitals?.temperature && (
                            <div className="tdm-triage-item px-3.5 py-2.5 border-b border-r border-[#f8fafc]">
                              <p className="text-[10.5px] text-slate-400 font-medium mb-0.5">
                                Temperature
                              </p>
                              <p className="text-[13px] text-slate-900 font-semibold capitalize wrap-break-word leading-[1.4]">
                                {apt.triage.vitals.temperature}°
                              </p>
                            </div>
                          )}
                          {apt.triage.vitals?.bloodPressure && (
                            <div className="tdm-triage-item px-3.5 py-2.5 border-b border-r border-[#f8fafc]">
                              <p className="text-[10.5px] text-slate-400 font-medium mb-0.5">
                                Blood Pressure
                              </p>
                              <p className="text-[13px] text-slate-900 font-semibold capitalize wrap-break-word leading-[1.4]">
                                {apt.triage.vitals.bloodPressure}
                              </p>
                            </div>
                          )}
                          {apt.triage.comorbidities?.length > 0 && (
                            <div className="tdm-triage-item px-3.5 py-2.5 border-b border-r border-[#f8fafc]">
                              <p className="text-[10.5px] text-slate-400 font-medium mb-0.5">
                                Comorbidities
                              </p>
                              <p className="text-[13px] text-slate-900 font-semibold capitalize wrap-break-word leading-[1.4]">
                                {apt.triage.comorbidities.join(', ')}
                              </p>
                            </div>
                          )}
                          {apt.triage.source && (
                            <div className="tdm-triage-item px-3.5 py-2.5 border-b border-r border-[#f8fafc]">
                              <p className="text-[10.5px] text-slate-400 font-medium mb-0.5">
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
                      <div className="col-span-full bg-white border border-slate-200 rounded-[14px] overflow-hidden">
                        <div className="flex items-center gap-1.75 px-3.5 py-2.5 bg-white border-b border-slate-100">
                          <span className="w-5 h-5 rounded-[5px] bg-slate-100 flex items-center justify-center text-[11px] shrink-0">
                            🕐
                          </span>
                          <span className="text-[10px] font-bold tracking-[.08em] uppercase text-slate-400">
                            Appointment Timeline
                          </span>
                        </div>
                        <div className="flex flex-row flex-nowrap gap-0 px-4.5 py-4 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                          {timelineItems.map((r, i) => (
                            <div
                              key={i}
                              className="tdm-tl-step done flex flex-col items-center flex-1 min-w-22.5 relative"
                            >
                              <div className="w-6 h-6 rounded-full border-2 border-transparent bg-blue-600 flex items-center justify-center shrink-0 mb-2 relative z-10 shadow-[0_2px_8px_rgba(37,99,235,.3)] transition-all duration-200">
                                <span className="tdm-tl-check">
                                  <svg
                                    width="10"
                                    height="10"
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
                                <span className="tdm-tl-node-inner" />
                              </div>
                              <div className="text-center px-1">
                                <p className="tdm-tl-label text-[10px] text-slate-400 font-medium mb-0.75 leading-[1.3]">
                                  {r.label}
                                </p>
                                <p className="text-[11px] text-slate-900 font-bold leading-[1.3]">
                                  {r.value}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}