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
    color: '#dc2626',
    bg: '#fee2e2',
    border: '#fca5a5',
    label: 'Emergency',
  },
  critical: {
    color: '#dc2626',
    bg: '#fee2e2',
    border: '#fca5a5',
    label: 'Critical',
  },
  high: { color: '#ea580c', bg: '#ffedd5', border: '#fdba74', label: 'High' },
  medium: {
    color: '#ca8a04',
    bg: '#fefce8',
    border: '#fde047',
    label: 'Medium',
  },
  low: { color: '#16a34a', bg: '#f0fdf4', border: '#86efac', label: 'Low' },
};

function getSeverity(level) {
  return (
    SEVERITY[level?.toLowerCase()] || {
      color: '#64748b',
      bg: '#f8fafc',
      border: '#e2e8f0',
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
    <div className="ph-card" style={{ animationDelay: `${animDelay}ms` }}>
      {/* Severity accent bar */}
      <div className="ph-card-accent" style={{ background: sev.color }} />

      {/* Left: index + token */}
      <div className="ph-card-left">
        <div className="ph-card-num">{index + 1}</div>
        <div className="ph-card-token">#{appt.token}</div>
      </div>

      {/* Center: patient info */}
      <div className="ph-card-center">
        <div className="ph-card-name-row">
          <span className="ph-card-name">{name}</span>
          <div className="ph-card-pills">
            {age && <span className="ph-pill ph-pill-gray">{age}y</span>}
            {gender && <span className="ph-pill ph-pill-gray">{gender}</span>}
            {blood && <span className="ph-pill ph-pill-blue">🩸 {blood}</span>}
          </div>
        </div>

        {appt.triage?.description && (
          <p className="ph-card-complaint">"{appt.triage.description}"</p>
        )}

        {symptoms.length > 0 && (
          <div className="ph-card-symptoms">
            {symptoms.slice(0, 3).map((s, i) => (
              <span key={i} className="ph-symptom-tag">
                {s}
              </span>
            ))}
            {symptoms.length > 3 && (
              <span className="ph-symptom-more">
                +{symptoms.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>

      {/* Right: severity + time */}
      <div className="ph-card-right">
        <span
          className="ph-sev-badge"
          style={{
            background: sev.bg,
            color: sev.color,
            border: `1px solid ${sev.border}`,
          }}
        >
          {sev.label}
        </span>

        <div className="ph-card-time-block">
          <div className="ph-card-time-row">
            <svg
              width="10"
              height="10"
              fill="none"
              viewBox="0 0 24 24"
              stroke="#94a3b8"
              strokeWidth={2}
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <span className="ph-card-time-text">
              {formatTime(appt.consulationStartsAt)}
              {appt.consulationEndsAt && (
                <> – {formatTime(appt.consulationEndsAt)}</>
              )}
            </span>
          </div>
          {duration && (
            <div className="ph-card-duration">
              <svg
                width="10"
                height="10"
                fill="none"
                viewBox="0 0 24 24"
                stroke="#94a3b8"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {duration}
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
    <div className={`ph-group ${open ? 'ph-group-open' : ''}`}>
      {/* Header */}
      <button className="ph-group-btn" onClick={() => setOpen((o) => !o)}>
        <div className="ph-group-btn-left">
          {/* Date pill */}
          <div
            className={`ph-date-pill ${todayFlag ? 'ph-date-pill-today' : ''}`}
          >
            <svg
              width="12"
              height="12"
              fill="none"
              viewBox="0 0 24 24"
              stroke={todayFlag ? '#2563eb' : '#94a3b8'}
              strokeWidth={2}
            >
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <span className="ph-date-text">{group.label}</span>
            {todayFlag && <span className="ph-today-tag">Today</span>}
          </div>

          {/* Count */}
          <span className="ph-group-count">
            {group.items.length} consultation
            {group.items.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Chevron */}
        <div className={`ph-chevron ${open ? 'ph-chevron-open' : ''}`}>
          <svg
            width="15"
            height="15"
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

      {/* Collapsible cards */}
      <div
        className={`ph-group-body ${open ? 'ph-body-open' : 'ph-body-closed'}`}
      >
        <div className="ph-cards-list">
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
    <>
      <style>{`
        .ph-page {
          min-height: 100vh;
          background: #f8fafc;
          padding: 36px 28px 60px;
          max-width: 900px;
          margin: 0 auto;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }

        /* ── Header ── */
        .ph-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 28px;
          opacity: 0; transform: translateY(14px);
          transition: opacity 0.45s ease, transform 0.45s ease;
        }
        .ph-header.show { opacity: 1; transform: translateY(0); }

        .ph-eyebrow {
          font-size: 11px; font-weight: 600;
          letter-spacing: 0.09em; text-transform: uppercase;
          color: #94a3b8; margin-bottom: 6px;
        }
        .ph-title {
          font-size: 26px; font-weight: 700;
          color: #0f172a; letter-spacing: -0.4px; margin: 0 0 4px;
        }
        .ph-sub { font-size: 13px; color: #94a3b8; margin: 0; }

        .ph-stats {
          display: flex; gap: 12px; flex-shrink: 0;
        }
        .ph-stat {
          background: #fff; border: 1px solid #e2e8f0;
          border-radius: 12px; padding: 10px 16px;
          text-align: center; min-width: 72px;
        }
        .ph-stat-val {
          font-size: 22px; font-weight: 700;
          color: #0f172a; line-height: 1;
          letter-spacing: -0.5px;
        }
        .ph-stat-val.blue { color: #2563eb; }
        .ph-stat-label {
          font-size: 10.5px; color: #94a3b8;
          font-weight: 500; margin-top: 2px;
        }

        /* ── Groups wrapper ── */
        .ph-groups {
          display: flex; flex-direction: column; gap: 12px;
          opacity: 0; transform: translateY(14px);
          transition: opacity 0.45s ease 0.1s, transform 0.45s ease 0.1s;
        }
        .ph-groups.show { opacity: 1; transform: translateY(0); }

        /* ── Date group ── */
        .ph-group {
          background: #fff;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 1px 4px rgba(15,23,42,0.04);
          transition: box-shadow 0.2s, border-color 0.2s;
        }
        .ph-group:hover { box-shadow: 0 4px 16px rgba(15,23,42,0.08); }
        .ph-group.ph-group-open { border-color: #dbeafe; }

        /* Group button */
        .ph-group-btn {
          width: 100%; display: flex; align-items: center;
          justify-content: space-between;
          padding: 16px 20px;
          background: transparent; border: none;
          cursor: pointer; text-align: left;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          transition: background 0.15s;
        }
        .ph-group-btn:hover { background: #f8fafc; }
        .ph-group-open .ph-group-btn {
          background: #f8fafc;
          border-bottom: 1px solid #f1f5f9;
        }

        .ph-group-btn-left {
          display: flex; align-items: center; gap: 12px;
        }

        /* Date pill */
        .ph-date-pill {
          display: inline-flex; align-items: center; gap: 7px;
          background: #f1f5f9; border: 1px solid #e2e8f0;
          border-radius: 10px; padding: 6px 12px;
          transition: background 0.15s, border-color 0.15s;
        }
        .ph-date-pill-today {
          background: #eff6ff; border-color: #bfdbfe;
        }
        .ph-date-text {
          font-size: 13.5px; font-weight: 600; color: #0f172a;
        }
        .ph-today-tag {
          font-size: 10px; font-weight: 700;
          letter-spacing: 0.07em; text-transform: uppercase;
          background: #2563eb; color: #fff;
          border-radius: 5px; padding: 1px 6px;
        }
        .ph-group-count {
          font-size: 12px; color: #94a3b8; font-weight: 500;
        }

        /* Chevron */
        .ph-chevron {
          color: #94a3b8; flex-shrink: 0;
          transition: transform 0.25s cubic-bezier(.22,1,.36,1), color 0.15s;
        }
        .ph-chevron-open { transform: rotate(180deg); color: #2563eb; }

        /* Collapsible */
        .ph-group-body {
          overflow: hidden;
          transition: max-height 0.38s cubic-bezier(.22,1,.36,1), opacity 0.25s ease;
        }
        .ph-body-open   { max-height: 4000px; opacity: 1; }
        .ph-body-closed { max-height: 0;      opacity: 0; }

        .ph-cards-list {
          padding: 12px 16px 16px;
          display: flex; flex-direction: column; gap: 10px;
        }

        /* ── Appointment Card ── */
        .ph-card {
          display: flex;
          align-items: stretch;
          background: #fff;
          border: 1px solid #f1f5f9;
          border-radius: 12px;
          overflow: hidden;
          position: relative;
          transition: box-shadow 0.18s, border-color 0.18s, transform 0.18s;
          animation: ph-card-in 0.3s ease both;
        }
        @keyframes ph-card-in {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .ph-card:hover {
          border-color: #dbeafe;
          box-shadow: 0 4px 16px rgba(15,23,42,0.08);
          transform: translateY(-1px);
        }

        /* Accent bar */
        .ph-card-accent {
          width: 4px; flex-shrink: 0;
        }

        /* Left: number + token */
        .ph-card-left {
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          gap: 4px;
          padding: 14px 16px;
          border-right: 1px solid #f1f5f9;
          min-width: 64px; flex-shrink: 0;
          background: #fafafa;
        }
        .ph-card-num {
          font-size: 11px; font-weight: 700;
          color: #94a3b8; line-height: 1;
        }
        .ph-card-token {
          font-size: 14px; font-weight: 800;
          color: #2563eb; letter-spacing: -0.3px;
        }

        /* Center: patient info */
        .ph-card-center {
          flex: 1; padding: 14px 16px; min-width: 0;
        }
        .ph-card-name-row {
          display: flex; align-items: center;
          gap: 8px; flex-wrap: wrap; margin-bottom: 5px;
        }
        .ph-card-name {
          font-size: 15px; font-weight: 700;
          color: #0f172a; letter-spacing: -0.2px;
        }

        /* Pills */
        .ph-card-pills { display: flex; align-items: center; gap: 5px; flex-wrap: wrap; }
        .ph-pill {
          font-size: 10.5px; font-weight: 600;
          padding: 2px 8px; border-radius: 20px;
        }
        .ph-pill-gray  { background: #f1f5f9; color: #64748b; }
        .ph-pill-blue  { background: #eff6ff; color: #2563eb; border: 1px solid #bfdbfe; }

        /* Complaint */
        .ph-card-complaint {
          font-size: 12.5px; color: #64748b;
          font-style: italic; line-height: 1.45;
          margin: 0 0 7px;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }

        /* Symptoms */
        .ph-card-symptoms {
          display: flex; flex-wrap: wrap; gap: 5px;
        }
        .ph-symptom-tag {
          font-size: 11px; font-weight: 500;
          padding: 2px 8px; border-radius: 6px;
          background: #f8fafc; color: #475569;
          border: 1px solid #e2e8f0;
        }
        .ph-symptom-more {
          font-size: 11px; font-weight: 500;
          color: #94a3b8; padding: 2px 0;
        }

        /* Right: severity + time */
        .ph-card-right {
          display: flex; flex-direction: column;
          align-items: flex-end; justify-content: space-between;
          padding: 14px 18px;
          gap: 10px; flex-shrink: 0;
          border-left: 1px solid #f8fafc;
        }
        .ph-sev-badge {
          font-size: 11px; font-weight: 700;
          padding: 3px 10px; border-radius: 20px;
          letter-spacing: 0.03em;
          white-space: nowrap;
        }
        .ph-card-time-block {
          display: flex; flex-direction: column;
          align-items: flex-end; gap: 3px;
        }
        .ph-card-time-row {
          display: flex; align-items: center; gap: 4px;
        }
        .ph-card-time-text {
          font-size: 11.5px; font-weight: 500; color: #475569;
          white-space: nowrap;
        }
        .ph-card-duration {
          display: flex; align-items: center; gap: 4px;
          font-size: 11px; color: #94a3b8; font-weight: 500;
        }

        /* ── Loading ── */
        .ph-loading {
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          min-height: 300px; gap: 12px;
        }
        .ph-spinner {
          width: 32px; height: 32px;
          border: 2.5px solid #bfdbfe; border-top-color: #2563eb;
          border-radius: 50%;
          animation: ph-spin 0.75s linear infinite;
        }
        @keyframes ph-spin { to { transform: rotate(360deg); } }
        .ph-loading-text { font-size: 13px; color: #94a3b8; }

        /* ── Empty ── */
        .ph-empty {
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          min-height: 300px; text-align: center; gap: 8px;
        }
        .ph-empty-icon {
          width: 56px; height: 56px; border-radius: 18px;
          background: #f1f5f9; border: 1px solid #e2e8f0;
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 8px;
        }
        .ph-empty-title { font-size: 14px; font-weight: 600; color: #64748b; margin: 0; }
        .ph-empty-sub   { font-size: 12px; color: #cbd5e1; margin: 0; }

        @media (max-width: 640px) {
          .ph-page { padding: 24px 14px 40px; }
          .ph-stats { display: none; }
          .ph-card-right { padding: 12px 12px; }
          .ph-card-left  { min-width: 52px; padding: 12px 10px; }
        }
      `}</style>

      <div className="ph-page">
        {/* Header */}
        <div className={`ph-header ${mounted ? 'show' : ''}`}>
          <div>
            <p className="ph-eyebrow">Doctor Workspace</p>
            <h1 className="ph-title">Patient History</h1>
            <p className="ph-sub">
              All completed consultations, grouped by date
            </p>
          </div>
          {!loading && history.length > 0 && (
            <div className="ph-stats">
              <div className="ph-stat">
                <div className="ph-stat-val blue">{history.length}</div>
                <div className="ph-stat-label">Total</div>
              </div>
              <div className="ph-stat">
                <div className="ph-stat-val">{totalDays}</div>
                <div className="ph-stat-label">Days</div>
              </div>
            </div>
          )}
        </div>

        {/* Loading */}
        {loading && (
          <div className="ph-loading">
            <div className="ph-spinner" />
            <p className="ph-loading-text">Loading history…</p>
          </div>
        )}

        {/* Empty */}
        {!loading && history.length === 0 && (
          <div className="ph-empty">
            <div className="ph-empty-icon">
              <svg
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
                stroke="#cbd5e1"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <p className="ph-empty-title">No completed consultations yet</p>
            <p className="ph-empty-sub">
              Completed sessions will appear here once you finish consultations.
            </p>
          </div>
        )}

        {/* Groups */}
        {!loading && dateKeys.length > 0 && (
          <div className={`ph-groups ${mounted ? 'show' : ''}`}>
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
    </>
  );
}
