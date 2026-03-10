import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTreatedHistory } from '../doctorThunks';

// ── Helpers ──────────────────────────────────────────────────────

function formatTime(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

function formatDuration(start, end) {
  if (!start || !end) return null;
  const mins = Math.round((new Date(end) - new Date(start)) / 60000);
  if (mins < 60) return `${mins}m`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

function toLocalDateKey(dateStr) {
  if (!dateStr) return 'unknown';
  const d = new Date(dateStr);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function groupByDate(appointments) {
  const groups = {};
  appointments.forEach((appt) => {
    const rawDate = appt.consulationEndsAt || appt.scheduledDate;
    const dateKey = toLocalDateKey(rawDate);
    if (!groups[dateKey])
      groups[dateKey] = { label: formatDateLabel(rawDate), items: [] };
    groups[dateKey].items.push(appt);
  });
  return groups;
}

function formatDateLabel(dateStr) {
  if (!dateStr) return 'Unknown Date';
  if (isToday(dateStr)) return 'Today';
  if (isYesterday(dateStr)) return 'Yesterday';
  return new Date(dateStr).toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function isToday(dateStr) {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  const t = new Date();
  return (
    d.getFullYear() === t.getFullYear() &&
    d.getMonth() === t.getMonth() &&
    d.getDate() === t.getDate()
  );
}

function isYesterday(dateStr) {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  const y = new Date();
  y.setDate(y.getDate() - 1);
  return (
    d.getFullYear() === y.getFullYear() &&
    d.getMonth() === y.getMonth() &&
    d.getDate() === y.getDate()
  );
}

// ── Severity config ───────────────────────────────────────────────

const SEVERITY = {
  emergency: {
    bg: 'bg-rose-50',
    border: 'border-rose-200',
    text: 'text-rose-600',
    dot: 'bg-rose-500',
    label: 'Emergency',
  },
  critical: {
    bg: 'bg-rose-50',
    border: 'border-rose-200',
    text: 'text-rose-600',
    dot: 'bg-rose-500',
    label: 'Critical',
  },
  high: {
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    text: 'text-orange-600',
    dot: 'bg-orange-500',
    label: 'High',
  },
  medium: {
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    text: 'text-yellow-600',
    dot: 'bg-yellow-500',
    label: 'Medium',
  },
  low: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    text: 'text-green-600',
    dot: 'bg-green-500',
    label: 'Low',
  },
};

function getSeverity(level) {
  return (
    SEVERITY[level?.toLowerCase()] || {
      bg: 'bg-slate-50',
      border: 'border-slate-200',
      text: 'text-slate-600',
      dot: 'bg-slate-400',
      label: level || 'N/A',
    }
  );
}

// ── Appointment Card ──────────────────────────────────────────────

function AppointmentCard({ appt, index, animDelay }) {
  const pd = appt.patientDetails;
  const name = pd ? `${pd.firstName} ${pd.lastName}` : `Patient #${appt.token}`;
  const age = pd?.age ?? appt.triage?.age ?? null;
  const gender = pd?.gender ?? null;
  const blood = pd?.bloodGroup ?? null;
  const duration = formatDuration(
    appt.consulationStartsAt,
    appt.consulationEndsAt,
  );
  const sev = getSeverity(appt.triage?.severityLevel);
  const symptoms = appt.triage?.symptoms || [];

  return (
    <div
      className="group flex items-stretch bg-white border border-slate-200 rounded-xl overflow-hidden hover:border-blue-200 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 animate-in fade-in slide-in-from-bottom-1"
      style={{ animationDelay: `${animDelay}ms`, animationFillMode: 'both' }}
    >
      {/* Accent bar */}
      <div className={`w-1 shrink-0 ${sev.bg}`} />

      {/* Left - Token */}
      <div className="flex flex-col items-center justify-center gap-1 py-3 px-4 border-r border-slate-100 min-w-15 bg-slate-50/50">
        <span className="text-xs font-bold text-slate-400">#{index + 1}</span>
        <span className="text-sm font-extrabold text-blue-600 tracking-tight">
          {appt.token}
        </span>
      </div>

      {/* Center - Patient Info */}
      <div className="flex-1 py-3 px-4 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-1">
          <span className="text-base font-bold text-slate-900 tracking-tight">
            {name}
          </span>
          <div className="flex items-center gap-1.5 flex-wrap">
            {age && (
              <span className="text-xs font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                {age}y
              </span>
            )}
            {gender && (
              <span className="text-xs font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                {gender}
              </span>
            )}
            {blood && (
              <span className="text-xs font-semibold bg-blue-50 text-blue-600 border border-blue-200 px-2 py-0.5 rounded-full">
                🩸 {blood}
              </span>
            )}
          </div>
        </div>

        {appt.triage?.description && (
          <p className="text-sm text-slate-500 italic mb-1.5 truncate">
            "{appt.triage.description}"
          </p>
        )}

        {symptoms.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {symptoms.slice(0, 3).map((s, i) => (
              <span
                key={i}
                className="text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200 px-2 py-0.5 rounded-md"
              >
                {s}
              </span>
            ))}
            {symptoms.length > 3 && (
              <span className="text-xs font-medium text-slate-400 px-1 py-0.5">
                +{symptoms.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>

      {/* Right - Time & Severity */}
      <div className="flex flex-col items-end justify-between py-3 px-4 border-l border-slate-100 shrink-0">
        <div
          className={`text-xs font-bold px-3 py-1 rounded-full ${sev.bg} ${sev.text} border ${sev.border}`}
        >
          <span
            className={`inline-block w-1.5 h-1.5 rounded-full ${sev.dot} mr-1.5 align-middle`}
          ></span>
          {sev.label}
        </div>

        <div className="flex flex-col items-end gap-0.5 mt-1">
          <div className="flex items-center gap-1.5">
            <svg
              className="w-3 h-3 text-slate-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <span className="text-xs font-medium text-slate-600 whitespace-nowrap">
              {formatTime(appt.consulationStartsAt)}
              {appt.consulationEndsAt && (
                <> – {formatTime(appt.consulationEndsAt)}</>
              )}
            </span>
          </div>

          {duration && (
            <div className="flex items-center gap-1.5">
              <svg
                className="w-3 h-3 text-slate-400"
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
              <span className="text-xs text-slate-400 font-medium">
                {duration}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Collapsible Date Group ────────────────────────────────────────

function DateGroup({ dateKey, group, defaultOpen }) {
  const [open, setOpen] = useState(defaultOpen);
  const todayFlag = group.label === 'Today';

  return (
    <div
      className={`bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm transition-all ${open ? 'border-blue-200 shadow-md' : 'hover:shadow-md'}`}
    >
      <button
        className={`w-full flex items-center justify-between px-5 py-4 text-left font-sans transition-colors hover:bg-slate-50/80 ${open ? 'bg-slate-50/50 border-b border-slate-200' : ''}`}
        onClick={() => setOpen((o) => !o)}
      >
        <div className="flex items-center gap-3">
          <div
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border ${todayFlag ? 'bg-blue-50 border-blue-200' : 'bg-slate-100 border-slate-200'}`}
          >
            <svg
              className={`w-3.5 h-3.5 ${todayFlag ? 'text-blue-600' : 'text-slate-500'}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <span className="text-sm font-bold text-slate-900">
              {group.label}
            </span>
            {todayFlag && (
              <span className="text-[10px] font-bold uppercase bg-blue-600 text-white px-1.5 py-0.5 rounded">
                Today
              </span>
            )}
          </div>
          <span className="text-xs font-medium text-slate-400">
            {group.items.length} consultation
            {group.items.length !== 1 ? 's' : ''}
          </span>
        </div>

        <div
          className={`transition-transform duration-300 ${open ? 'rotate-180 text-blue-600' : 'text-slate-400'}`}
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </button>

      <div
        className={`transition-all duration-300 ease-in-out ${open ? 'max-h-500 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}
      >
        <div className="p-4 space-y-2.5">
          {group.items.map((appt, i) => (
            <AppointmentCard
              key={appt._id}
              appt={appt}
              index={i}
              animDelay={open ? i * 50 : 0}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────

export default function PatientHistory() {
  const dispatch = useDispatch();
  const history = useSelector((s) => s.doctor.patientHistory);
  const loading = useSelector((s) => s.doctor.historyLoading);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    dispatch(fetchTreatedHistory());
    setTimeout(() => setMounted(true), 20);
  }, [dispatch]);

  const grouped = groupByDate(history);
  const dateKeys = Object.keys(grouped);
  const totalDays = dateKeys.length;

  return (
    <div className="min-h-screen w-full px-8 py-8 md:px-10 md:py-8 lg:px-12 font-sans">
      {/* Header */}
      <div
        className={`
        bg-white border border-slate-200 rounded-xl p-6 md:p-7 shadow-md mb-7
        flex flex-wrap items-end justify-between gap-4
        transition-all duration-500 ease-out translate-y-1 opacity-0
        ${mounted ? 'translate-y-0 opacity-100' : ''}
      `}
      >
        <div>
          <p className="text-xs font-semibold tracking-wider uppercase text-slate-400 mb-1.5">
            Doctor Workspace
          </p>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-1">
            Patient History
          </h1>
          <p className="text-sm text-slate-400">
            All completed consultations, grouped by date
          </p>
        </div>

        {!loading && history.length > 0 && (
          <div className="flex gap-2">
            <div className="bg-white border border-slate-200 rounded-lg px-4 py-2 text-center min-w-17.5 shadow-sm">
              <div className="text-xl font-extrabold text-blue-600 leading-none">
                {history.length}
              </div>
              <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mt-1">
                Total
              </div>
            </div>
            <div className="bg-white border border-slate-200 rounded-lg px-4 py-2 text-center min-w-17.5 shadow-sm">
              <div className="text-xl font-extrabold text-slate-900 leading-none">
                {totalDays}
              </div>
              <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mt-1">
                Days
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex flex-col items-center justify-center min-h-75 gap-3">
          <div className="w-8 h-8 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
          <p className="text-sm text-slate-400">Loading history…</p>
        </div>
      )}

      {/* Empty */}
      {!loading && history.length === 0 && (
        <div className="flex flex-col items-center justify-center min-h-75 text-center gap-2">
          <div className="w-14 h-14 bg-slate-100 border border-slate-200 rounded-xl flex items-center justify-center mb-2">
            <svg
              className="w-7 h-7 text-slate-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          </div>
          <p className="text-sm font-bold text-slate-500">
            No completed consultations yet
          </p>
          <p className="text-xs text-slate-400">
            Completed sessions will appear here once you finish consultations.
          </p>
        </div>
      )}

      {/* Groups */}
      {!loading && dateKeys.length > 0 && (
        <div
          className={`
          space-y-3
          transition-all duration-500 delay-100 ease-out translate-y-1 opacity-0
          ${mounted ? 'translate-y-0 opacity-100' : ''}
        `}
        >
          {dateKeys.map((key, i) => (
            <DateGroup
              key={key}
              dateKey={key}
              group={grouped[key]}
              defaultOpen={i === 0}
            />
          ))}
        </div>
      )}
    </div>
  );
}
