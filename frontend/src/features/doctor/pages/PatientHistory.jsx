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
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
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
    gradient: 'from-rose-500 to-rose-600',
    badge: 'bg-rose-50 text-rose-700 border-rose-200',
    dot: 'bg-rose-500',
    label: 'Emergency',
    accent: '#ef4444',
  },
  critical: {
    gradient: 'from-rose-500 to-rose-600',
    badge: 'bg-rose-50 text-rose-700 border-rose-200',
    dot: 'bg-rose-500',
    label: 'Critical',
    accent: '#ef4444',
  },
  high: {
    gradient: 'from-orange-400 to-orange-500',
    badge: 'bg-orange-50 text-orange-700 border-orange-200',
    dot: 'bg-orange-400',
    label: 'High',
    accent: '#f97316',
  },
  medium: {
    gradient: 'from-amber-400 to-yellow-500',
    badge: 'bg-amber-50 text-amber-700 border-amber-200',
    dot: 'bg-amber-400',
    label: 'Medium',
    accent: '#f59e0b',
  },
  low: {
    gradient: 'from-emerald-400 to-teal-500',
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    dot: 'bg-emerald-500',
    label: 'Low',
    accent: '#10b981',
  },
};

function getSeverity(level) {
  return (
    SEVERITY[level?.toLowerCase()] || {
      gradient: 'from-slate-400 to-slate-500',
      badge: 'bg-slate-50 text-slate-600 border-slate-200',
      dot: 'bg-slate-400',
      label: level || 'N/A',
      accent: '#94a3b8',
    }
  );
}

// ── Icons ─────────────────────────────────────────────────────────

const ClockIcon = ({ className }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.8}
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const TimerIcon = ({ className }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.8}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const CalendarIcon = ({ className }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.8}
  >
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const ChevronIcon = ({ className }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2.5}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
);

const ClipboardIcon = ({ className }) => (
  <svg
    className={className}
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
);

const UserIcon = ({ className }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.8}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    />
  </svg>
);

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
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      className="group relative bg-white rounded-2xl border border-slate-200/80 overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-blue-200 flex flex-col"
      style={{
        animationDelay: `${animDelay}ms`,
        animationFillMode: 'both',
        boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
      }}
    >
      {/* Top accent stripe */}
      <div className={`h-1 w-full bg-gradient-to-r ${sev.gradient}`} />

      {/* Card Body */}
      <div className="p-5 flex flex-col flex-1 gap-4">
        {/* Header Row */}
        <div className="flex items-start justify-between gap-3">
          {/* Avatar + Name */}
          <div className="flex items-center gap-3 min-w-0">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-bold shrink-0"
              style={{
                background: `linear-gradient(135deg, ${sev.accent}cc, ${sev.accent})`,
              }}
            >
              {initials || <UserIcon className="w-5 h-5" />}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-slate-900 truncate leading-tight">
                {name}
              </p>
              <p className="text-xs text-slate-400 font-medium mt-0.5">
                Token #{appt.token}
              </p>
            </div>
          </div>

          {/* Severity badge */}
          <span
            className={`shrink-0 inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${sev.badge}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${sev.dot}`} />
            {sev.label}
          </span>
        </div>

        {/* Demographics */}
        {(age || gender || blood) && (
          <div className="flex flex-wrap gap-1.5">
            {age && (
              <span className="text-xs font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                {age}y
              </span>
            )}
            {gender && (
              <span className="text-xs font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md capitalize">
                {gender}
              </span>
            )}
            {blood && (
              <span className="text-xs font-semibold bg-red-50 text-red-600 border border-red-100 px-2 py-0.5 rounded-md">
                🩸 {blood}
              </span>
            )}
          </div>
        )}

        {/* Description */}
        {appt.triage?.description && (
          <p className="text-xs text-slate-500 italic leading-relaxed line-clamp-2 border-l-2 border-slate-200 pl-3">
            {appt.triage.description}
          </p>
        )}

        {/* Symptoms */}
        {symptoms.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {symptoms.slice(0, 3).map((s, i) => (
              <span
                key={i}
                className="text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100 px-2 py-0.5 rounded-md"
              >
                {s}
              </span>
            ))}
            {symptoms.length > 3 && (
              <span className="text-xs text-slate-400 px-1 py-0.5">
                +{symptoms.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Footer - Time */}
        <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-slate-500">
            <ClockIcon className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-xs font-medium">
              {formatTime(appt.consulationStartsAt)}
              {appt.consulationEndsAt &&
                ` – ${formatTime(appt.consulationEndsAt)}`}
            </span>
          </div>
          {duration && (
            <div className="flex items-center gap-1 text-slate-400">
              <TimerIcon className="w-3.5 h-3.5" />
              <span className="text-xs font-semibold">{duration}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Collapsible Date Group ────────────────────────────────────────

function DateGroup({ dateKey, group, defaultOpen, globalIndex }) {
  const [open, setOpen] = useState(defaultOpen);
  const todayFlag = group.label === 'Today';
  const yesterdayFlag = group.label === 'Yesterday';

  return (
    <div className="space-y-3">
      {/* Section Header */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-4 group/btn"
      >
        {/* Date pill */}
        <div
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-semibold transition-all duration-200 ${
            todayFlag
              ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-200'
              : yesterdayFlag
                ? 'bg-slate-800 text-white border-slate-800'
                : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
          }`}
        >
          <CalendarIcon className="w-3.5 h-3.5" />
          {group.label}
        </div>

        {/* Count */}
        <span className="text-xs font-medium text-slate-400 whitespace-nowrap">
          {group.items.length} consultation{group.items.length !== 1 ? 's' : ''}
        </span>

        {/* Divider line */}
        <div className="flex-1 h-px bg-slate-200" />

        {/* Toggle */}
        <div
          className={`w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center transition-all duration-300 ${
            open
              ? 'bg-blue-50 border-blue-200 text-blue-600'
              : 'bg-white text-slate-400 group-hover/btn:border-slate-300'
          }`}
        >
          <ChevronIcon
            className={`w-3.5 h-3.5 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
          />
        </div>
      </button>

      {/* Grid */}
      <div
        className={`transition-all duration-300 ease-in-out ${open ? 'opacity-100' : 'opacity-0 overflow-hidden max-h-0'}`}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {group.items.map((appt, i) => (
            <AppointmentCard
              key={appt._id}
              appt={appt}
              index={i}
              animDelay={open ? i * 40 : 0}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Stat Card ─────────────────────────────────────────────────────

function StatCard({ value, label, icon, accent }) {
  return (
    <div
      className="bg-white rounded-2xl border border-slate-200/80 p-5 flex items-center gap-4"
      style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}
    >
      <div
        className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${accent}`}
      >
        {icon}
      </div>
      <div>
        <p className="text-2xl font-extrabold text-slate-900 leading-none tracking-tight">
          {value}
        </p>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-1">
          {label}
        </p>
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
    setTimeout(() => setMounted(true), 30);
  }, [dispatch]);

  const grouped = groupByDate(history);
  const dateKeys = Object.keys(grouped);
  const totalDays = dateKeys.length;

  // Compute severity breakdown
  const severityCounts = history.reduce((acc, a) => {
    const lvl = a.triage?.severityLevel?.toLowerCase() || 'unknown';
    acc[lvl] = (acc[lvl] || 0) + 1;
    return acc;
  }, {});
  const criticalCount =
    (severityCounts.emergency || 0) +
    (severityCounts.critical || 0) +
    (severityCounts.high || 0);

  return (
    <div
      className="min-h-screen w-full bg-slate-50/60 font-sans"
      style={{
        fontFamily: "'DM Sans', 'Plus Jakarta Sans', system-ui, sans-serif",
      }}
    >
      <div className="max-w-screen-2xl mx-auto px-6 md:px-8 lg:px-10 py-8 space-y-8">
        {/* ── Page Header ── */}
        <div
          className={`transition-all duration-500 ease-out ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}
        >
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg border border-blue-100 mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                Doctor Workspace
              </div>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Patient History
              </h1>
              <p className="text-sm text-slate-500 mt-1.5 font-medium">
                All completed consultations, grouped by session date
              </p>
            </div>

            {/* Divider */}
            <div className="hidden md:block flex-1 h-px bg-gradient-to-r from-slate-200 to-transparent mx-4" />
          </div>
        </div>

        {/* ── Stats Row ── */}
        {!loading && history.length > 0 && (
          <div
            className={`grid grid-cols-2 lg:grid-cols-4 gap-4 transition-all duration-500 delay-100 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}
          >
            <StatCard
              value={history.length}
              label="Total Consultations"
              accent="bg-blue-50 text-blue-600"
              icon={<ClipboardIcon className="w-5 h-5" />}
            />
            <StatCard
              value={totalDays}
              label="Active Days"
              accent="bg-violet-50 text-violet-600"
              icon={<CalendarIcon className="w-5 h-5" />}
            />
            <StatCard
              value={criticalCount}
              label="Critical Cases"
              accent="bg-rose-50 text-rose-600"
              icon={
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.8}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
                  />
                </svg>
              }
            />
            <StatCard
              value={
                Math.round((history.length / Math.max(totalDays, 1)) * 10) / 10
              }
              label="Avg / Day"
              accent="bg-emerald-50 text-emerald-600"
              icon={
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.8}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              }
            />
          </div>
        )}

        {/* ── Loading ── */}
        {loading && (
          <div className="flex flex-col items-center justify-center min-h-64 gap-4">
            <div className="w-10 h-10 border-2 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
            <p className="text-sm text-slate-400 font-medium">
              Loading patient history…
            </p>
          </div>
        )}

        {/* ── Empty ── */}
        {!loading && history.length === 0 && (
          <div className="flex flex-col items-center justify-center min-h-64 text-center gap-3 py-16">
            <div className="w-16 h-16 bg-white border border-slate-200 rounded-2xl flex items-center justify-center shadow-sm mb-2">
              <ClipboardIcon className="w-8 h-8 text-slate-300" />
            </div>
            <p className="text-base font-bold text-slate-600">
              No completed consultations yet
            </p>
            <p className="text-sm text-slate-400 max-w-xs">
              Completed sessions will appear here once you finish consultations.
            </p>
          </div>
        )}

        {/* ── Date Groups ── */}
        {!loading && dateKeys.length > 0 && (
          <div
            className={`space-y-8 transition-all duration-500 delay-150 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}
          >
            {dateKeys.map((key, i) => (
              <DateGroup
                key={key}
                dateKey={key}
                group={grouped[key]}
                defaultOpen={i === 0}
                globalIndex={i}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
