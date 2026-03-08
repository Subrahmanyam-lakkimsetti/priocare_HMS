import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { callNextPatient, fetchQueue } from '../doctorThunks';

const SEVERITY_CONFIG = {
  emergency: {
    bg: '#fef2f2',
    text: '#dc2626',
    dot: '#ef4444',
    border: '#fca5a5',
    cardBg: '#fff1f1',
    cardBorder: '#f87171',
    cardGlow: 'rgba(239,68,68,0.12)',
    cardAccent: '#ef4444',
  },
  high: {
    bg: '#fffbeb',
    text: '#d97706',
    dot: '#f59e0b',
    border: '#fcd34d',
    cardBg: '#fffdf0',
    cardBorder: '#fbbf24',
    cardGlow: 'rgba(245,158,11,0.12)',
    cardAccent: '#f59e0b',
  },
  medium: {
    bg: '#fefce8',
    text: '#ca8a04',
    dot: '#eab308',
    border: '#fde68a',
    cardBg: '#fefef5',
    cardBorder: '#facc15',
    cardGlow: 'rgba(234,179,8,0.10)',
    cardAccent: '#eab308',
  },
  low: {
    bg: '#f0fdf4',
    text: '#16a34a',
    dot: '#22c55e',
    border: '#bbf7d0',
    cardBg: '#f6fef9',
    cardBorder: '#86efac',
    cardGlow: 'rgba(34,197,94,0.10)',
    cardAccent: '#22c55e',
  },
};

function SeverityBadge({ level }) {
  const cfg = SEVERITY_CONFIG[level?.toLowerCase()] || SEVERITY_CONFIG.low;
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        fontSize: 11,
        fontWeight: 600,
        padding: '2px 8px',
        borderRadius: 20,
        background: cfg.bg,
        color: cfg.text,
        border: `1px solid ${cfg.border}`,
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          background: cfg.dot,
          flexShrink: 0,
        }}
      />
      {level ? level.charAt(0).toUpperCase() + level.slice(1) : 'N/A'}
    </span>
  );
}

/**
 * Safely parse a timestamp string and return a Date object in local time.
 * If the string has no timezone info (no 'Z' or '+'), treat it as UTC by appending 'Z'.
 */
function parseAsUTC(timestamp) {
  if (!timestamp) return null;
  const str = String(timestamp);
  // If already has timezone offset (Z, +HH:mm, -HH:mm), parse as-is
  // Otherwise append 'Z' to treat as UTC so JS converts to local time correctly
  const hasTimezone = /Z$|[+-]\d{2}:\d{2}$|[+-]\d{4}$/.test(str);
  return new Date(hasTimezone ? str : str + 'Z');
}

function getWaitingTime(checkedInAt) {
  if (!checkedInAt) return null;
  const checkedInDate = parseAsUTC(checkedInAt);
  if (!checkedInDate || isNaN(checkedInDate.getTime())) return null;

  const totalMins = Math.floor((Date.now() - checkedInDate.getTime()) / 60000);
  if (totalMins < 1) return 'Just arrived';
  if (totalMins < 60) return `${totalMins}m`;
  const hrs = Math.floor(totalMins / 60);
  const mins = totalMins % 60;
  return mins > 0 ? `${hrs}h ${mins}m` : `${hrs}h`;
}

function waitingColor(checkedInAt) {
  if (!checkedInAt) return '#94a3b8';
  const checkedInDate = parseAsUTC(checkedInAt);
  if (!checkedInDate || isNaN(checkedInDate.getTime())) return '#94a3b8';

  const mins = Math.floor((Date.now() - checkedInDate.getTime()) / 60000);
  if (mins >= 45) return '#ef4444';
  if (mins >= 20) return '#f97316';
  return '#94a3b8';
}

function waitingWeight(checkedInAt) {
  if (!checkedInAt) return 400;
  const checkedInDate = parseAsUTC(checkedInAt);
  if (!checkedInDate || isNaN(checkedInDate.getTime())) return 400;

  const mins = Math.floor((Date.now() - checkedInDate.getTime()) / 60000);
  return mins >= 20 ? 600 : 400;
}

export default function QueuePanel({ date }) {
  const dispatch = useDispatch();
  const queue = useSelector((s) => s.doctor.queue);
  const loading = useSelector((s) => s.doctor.loading);
  const calledPatient = useSelector((s) => s.doctor.calledPatient);
  const activePatient = useSelector((s) => s.doctor.activePatient);

  const isQueueBusy = !!calledPatient || !!activePatient;

  const [calling, setCalling] = useState(false);
  const [calledId, setCalledId] = useState(null);
  const [phase, setPhase] = useState('idle');

  const callNext = async () => {
    if (!queue.length || loading || isQueueBusy || calling) return;
    const nextId = queue[0]?._id;
    setCalling(true);
    setPhase('calling');
    await new Promise((r) => setTimeout(r, 600));
    setCalledId(nextId);
    setPhase('called');
    await new Promise((r) => setTimeout(r, 500));
    await dispatch(callNextPatient(date));
    setPhase('done');
    await new Promise((r) => setTimeout(r, 400));
    dispatch(fetchQueue(date));
    setCalledId(null);
    setCalling(false);
    setPhase('idle');
  };

  return (
    <>
      <style>{`
        .qp-root {
          height: 100%;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }

        /* ── Fixed top section: title + count + button ── */
        .qp-fixed-top {
          flex-shrink: 0;
          padding: 16px 16px 14px;
          border-bottom: 1px solid #f1f5f9;
          background: #fff;
        }
        .qp-header-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
        }
        .qp-title  { font-size: 14px; font-weight: 700; color: #0f172a; margin: 0 0 2px; }
        .qp-subtitle { font-size: 11.5px; color: #94a3b8; }
        .qp-count-badge {
          width: 26px; height: 26px; border-radius: 50%;
          background: #2563eb; color: #fff;
          font-size: 11px; font-weight: 700;
          display: flex; align-items: center; justify-content: center;
        }

        /* ── Call button ── */
        .qp-call-btn {
          width: 100%; padding: 10px; border-radius: 12px; border: none;
          cursor: pointer; font-size: 13px; font-weight: 600;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          position: relative; overflow: hidden;
        }
        .qp-call-btn.ready {
          background: #2563eb; color: #fff;
          box-shadow: 0 2px 10px rgba(37,99,235,0.25);
        }
        .qp-call-btn.ready:hover {
          background: #1d4ed8; transform: translateY(-1px);
          box-shadow: 0 4px 16px rgba(37,99,235,0.35);
        }
        .qp-call-btn.ready:active { transform: translateY(0); }
        .qp-call-btn.busy { background: #f1f5f9; color: #94a3b8; cursor: not-allowed; }
        .qp-call-btn.calling-state { background: #1d4ed8; color: #fff; cursor: wait; }
        .qp-call-btn.ready::after {
          content: ''; position: absolute; inset: 0;
          background: rgba(255,255,255,0); transition: background 0.3s;
        }
        .qp-call-btn.ready:active::after { background: rgba(255,255,255,0.1); }

        .qp-spinner {
          width: 14px; height: 14px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff; border-radius: 50%;
          animation: qp-spin 0.7s linear infinite;
        }
        @keyframes qp-spin { to { transform: rotate(360deg); } }

        /* ── Scrollable cards only ── */
        .qp-list {
          flex: 1;
          overflow-y: auto;
          padding: 10px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          min-height: 0;
        }
        .qp-list::-webkit-scrollbar { width: 4px; }
        .qp-list::-webkit-scrollbar-track { background: transparent; }
        .qp-list::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 4px; }

        /* ── Empty state ── */
        .qp-empty {
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          padding: 48px 16px; text-align: center; flex: 1;
        }
        .qp-empty-icon {
          width: 44px; height: 44px; background: #f8fafc;
          border-radius: 14px; display: flex; align-items: center;
          justify-content: center; margin-bottom: 12px;
        }
        .qp-empty-text { font-size: 13px; font-weight: 500; color: #cbd5e1; }

        /* ── Patient cards ── */
        .qp-card {
          border-radius: 12px; border: 1px solid #e2e8f0;
          padding: 12px 12px 12px 16px; background: #fff;
          transition: background 0.15s, border-color 0.15s, transform 0.15s, opacity 0.15s, box-shadow 0.15s;
          cursor: default; position: relative;
          flex-shrink: 0;
        }
        .qp-card:hover { filter: brightness(0.97); transform: translateY(-1px); }
        .qp-card::before {
          content: ''; position: absolute;
          left: 0; top: 0; bottom: 0; width: 4px;
          border-radius: 12px 0 0 12px;
          background: var(--severity-dot, #e2e8f0);
        }
        .qp-card.flash { animation: qp-card-flash 0.5s ease forwards; }
        @keyframes qp-card-flash {
          0%   { background: #fff;    border-color: #e2e8f0; transform: scale(1);    box-shadow: none; }
          30%  { background: #eff6ff; border-color: #93c5fd; transform: scale(1.02); box-shadow: 0 4px 20px rgba(37,99,235,0.18); }
          60%  { background: #dbeafe; border-color: #60a5fa; transform: scale(1.01); }
          100% { background: #eff6ff; border-color: #93c5fd; transform: scale(1);    opacity: 0.6; }
        }
        .qp-card.exit { animation: qp-card-exit 0.4s cubic-bezier(.4,0,.2,1) forwards; }
        @keyframes qp-card-exit {
          from { opacity: 0.6; transform: translateY(0) scale(1); max-height: 200px; margin-bottom: 8px; }
          to   { opacity: 0; transform: translateY(-8px) scale(0.97); max-height: 0; margin-bottom: 0; padding: 0; border-width: 0; }
        }
        .qp-card.shift { animation: qp-card-shift 0.4s cubic-bezier(.22,1,.36,1) 0.3s both; }
        @keyframes qp-card-shift {
          from { transform: translateY(8px); }
          to   { transform: translateY(0); }
        }

        .qp-card-row1 { display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 6px; }
        .qp-card-left { display: flex; align-items: center; gap: 6px; min-width: 0; }
        .qp-position {
          width: 20px; height: 20px; border-radius: 6px;
          background: #f1f5f9; color: #64748b;
          font-size: 10px; font-weight: 700;
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
        .qp-token { font-size: 13px; font-weight: 700; color: #2563eb; }
        .qp-age   { font-size: 11px; color: #94a3b8; }
        .qp-description {
          font-size: 11.5px; color: #64748b;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
          margin-bottom: 6px; line-height: 1.4;
        }
        .qp-symptoms { display: flex; flex-wrap: wrap; gap: 4px; margin-bottom: 8px; }
        .qp-symptom-tag { font-size: 10.5px; padding: 2px 7px; background: #f1f5f9; color: #64748b; border-radius: 6px; }
        .qp-card-footer {
          display: flex; align-items: center; justify-content: space-between;
          padding-top: 8px; border-top: 1px solid #f8fafc;
        }
        .qp-wait-row { display: flex; align-items: center; gap: 4px; }
        .qp-expected { font-size: 11px; color: #94a3b8; }
        .qp-card.next-up { border-color: #bfdbfe; background: #fafcff; }
        .qp-next-label {
          display: inline-flex; align-items: center; gap: 4px;
          font-size: 10px; font-weight: 600; color: #2563eb;
          background: #dbeafe; border-radius: 6px; padding: 2px 7px; margin-bottom: 8px;
        }
      `}</style>

      <div className="qp-root">
        {/* ── Fixed: title + badge + call button — never scrolls ── */}
        <div className="qp-fixed-top">
          <div className="qp-header-row">
            <div>
              <p className="qp-title">Waiting Queue</p>
              <p className="qp-subtitle">
                {queue.length} patient{queue.length !== 1 ? 's' : ''} waiting
              </p>
            </div>
            {queue.length > 0 && (
              <div className="qp-count-badge">{queue.length}</div>
            )}
          </div>

          <button
            onClick={callNext}
            disabled={queue.length === 0 || loading || isQueueBusy || calling}
            className={`qp-call-btn ${
              calling
                ? 'calling-state'
                : queue.length === 0 || loading || isQueueBusy
                  ? 'busy'
                  : 'ready'
            }`}
          >
            {calling ? (
              <>
                <span className="qp-spinner" />
                Calling patient…
              </>
            ) : isQueueBusy ? (
              <>
                <svg
                  width="14"
                  height="14"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Consultation Active
              </>
            ) : (
              <>
                <svg
                  width="14"
                  height="14"
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
                Call Next Patient
              </>
            )}
          </button>
        </div>

        {/* ── Scrollable: patient cards only ── */}
        <div className="qp-list">
          {queue.length === 0 && !loading && (
            <div className="qp-empty">
              <div className="qp-empty-icon">
                <svg
                  width="22"
                  height="22"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="#cbd5e1"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
              <p className="qp-empty-text">No patients waiting</p>
            </div>
          )}

          {queue.map((p, idx) => {
            const severityLevel = p.triage?.severityLevel;
            const cfg =
              SEVERITY_CONFIG[severityLevel?.toLowerCase()] ||
              SEVERITY_CONFIG.low;
            const waitTime = getWaitingTime(p.checkedInAt);
            const wColor = waitingColor(p.checkedInAt);
            const wWeight = waitingWeight(p.checkedInAt);
            const symptoms = p.triage?.symptoms || [];
            const isNext = idx === 0 && !isQueueBusy && !calling;
            const isCalled = p._id === calledId;

            let cardClass = 'qp-card';
            if (isCalled && phase === 'called') cardClass += ' flash';
            if (isCalled && phase === 'done') cardClass += ' exit';
            if (!isCalled && phase !== 'idle') cardClass += ' shift';
            if (isNext && phase === 'idle') cardClass += ' next-up';

            return (
              <div
                key={p._id}
                className={cardClass}
                style={{
                  '--severity-dot': cfg.cardAccent,
                  borderColor: isCalled ? undefined : cfg.cardBorder,
                  background: isCalled ? undefined : cfg.cardBg,
                  boxShadow: isCalled
                    ? undefined
                    : `0 2px 8px ${cfg.cardGlow}, inset 0 0 0 1px ${cfg.cardBorder}`,
                }}
              >
                {isNext && (
                  <div className="qp-next-label">
                    <svg
                      width="9"
                      height="9"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                    Next up
                  </div>
                )}
                <div className="qp-card-row1">
                  <div className="qp-card-left">
                    <span className="qp-position">
                      {p.queuePosition ?? idx + 1}
                    </span>
                    <span className="qp-token">#{p.token}</span>
                    {p.triage?.age && (
                      <span className="qp-age">{p.triage.age}y</span>
                    )}
                  </div>
                  <SeverityBadge level={severityLevel} />
                </div>
                {p.triage?.description && (
                  <p className="qp-description">{p.triage.description}</p>
                )}
                {symptoms.length > 0 && (
                  <div className="qp-symptoms">
                    {symptoms.slice(0, 2).map((s, i) => (
                      <span key={i} className="qp-symptom-tag">
                        {s}
                      </span>
                    ))}
                    {symptoms.length > 2 && (
                      <span className="qp-symptom-tag">
                        +{symptoms.length - 2}
                      </span>
                    )}
                  </div>
                )}
                <div className="qp-card-footer">
                  <div className="qp-wait-row">
                    <svg
                      width="11"
                      height="11"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="#cbd5e1"
                      strokeWidth={2}
                    >
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                    <span
                      style={{
                        fontSize: 11,
                        color: wColor,
                        fontWeight: wWeight,
                      }}
                    >
                      {waitTime ? `Waiting ${waitTime}` : '—'}
                    </span>
                  </div>
                  {p.exceptedStartTime && (
                    <span className="qp-expected">~{p.exceptedStartTime}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
