import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAiSummary } from '../doctorThunks';

function formatUpdatedAt(dateStr) {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

const SECTION_LABELS = {
  patientSnapshot: 'Patient Snapshot',
  reportedProblems: 'Reported Problems',
  relevantHistory: 'Relevant History',
  vitalObservations: 'Vital Observations',
  triageContext: 'Triage Context',
};

const SECTION_COLORS = {
  patientSnapshot: {
    bg: '#f5f3ff',
    border: '#ddd6fe',
    label: '#6d28d9',
    dot: '#7c3aed',
  },
  reportedProblems: {
    bg: '#fef2f2',
    border: '#fecaca',
    label: '#dc2626',
    dot: '#ef4444',
  },
  relevantHistory: {
    bg: '#eff6ff',
    border: '#bfdbfe',
    label: '#2563eb',
    dot: '#3b82f6',
  },
  vitalObservations: {
    bg: '#f0fdf4',
    border: '#bbf7d0',
    label: '#16a34a',
    dot: '#22c55e',
  },
  triageContext: {
    bg: '#fffbeb',
    border: '#fde68a',
    label: '#ca8a04',
    dot: '#eab308',
  },
  default: {
    bg: '#f5f3ff',
    border: '#ddd6fe',
    label: '#6d28d9',
    dot: '#7c3aed',
  },
};

const SKIP_KEYS = ['_id', '__v', 'token', 'aisummaryUpdatedAt', 'aiSummary'];

function SummarySection({ sectionKey, label, value }) {
  const items = Array.isArray(value) ? value : [value];
  const colors = SECTION_COLORS[sectionKey] || SECTION_COLORS.default;
  return (
    <div
      className="ai-section"
      style={{
        background: colors.bg,
        border: `1px solid ${colors.border}`,
      }}
    >
      <div className="ai-section-header">
        <span className="ai-section-dot" style={{ background: colors.dot }} />
        <p className="ai-section-label" style={{ color: colors.label }}>
          {label}
        </p>
      </div>
      <ul className="ai-section-list">
        {items.map((item, i) => (
          <li key={i} className="ai-section-item">
            <span
              className="ai-item-bullet"
              style={{ background: colors.dot }}
            />
            <p className="ai-item-text">
              {typeof item === 'string' ? item : JSON.stringify(item)}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function AiAssistant() {
  const dispatch = useDispatch();
  const summaryData = useSelector((s) => s.doctor.aiSummary);
  const activePatient = useSelector((s) => s.doctor.activePatient);
  const isConsulting = !!activePatient;

  const summaryContent = summaryData?.aiSummary;
  const updatedAt = summaryData?.aisummaryUpdatedAt;
  const hasSummary = !!summaryContent;
  const pollRef = useRef(null);

  useEffect(() => {
    const stop = () => {
      if (pollRef.current) {
        clearInterval(pollRef.current);
        pollRef.current = null;
      }
    };
    if (isConsulting && !hasSummary && activePatient?.token) {
      pollRef.current = setInterval(
        () => dispatch(fetchAiSummary(activePatient.token)),
        4000,
      );
    } else {
      stop();
    }
    return stop;
  }, [isConsulting, hasSummary, activePatient?.token, dispatch]);

  return (
    <>
      <style>{`
        .ai-root {
          background: #fff;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          box-shadow: 0 2px 8px rgba(15,23,42,0.04);
          height: 100%;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }

        /* ── Header ── */
        .ai-header {
          padding: 14px 16px 12px;
          border-bottom: 1px solid #f8fafc;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
        }
        .ai-header-left {
          display: flex;
          align-items: center;
          gap: 10px;
          min-width: 0;
        }
        .ai-header-icon {
          width: 34px; height: 34px;
          border-radius: 10px;
          background: #f5f3ff;
          border: 1px solid #ddd6fe;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .ai-header-title {
          font-size: 13.5px;
          font-weight: 700;
          color: #0f172a;
          margin: 0 0 1px;
        }
        .ai-header-updated {
          font-size: 10.5px;
          color: #94a3b8;
        }

        /* Status pills */
        .ai-pill {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 11px;
          font-weight: 600;
          padding: 3px 10px;
          border-radius: 20px;
          white-space: nowrap;
          flex-shrink: 0;
        }
        .ai-pill-generating {
          background: #fffbeb;
          color: #92400e;
          border: 1px solid #fde68a;
        }
        .ai-pill-ready {
          background: #f5f3ff;
          color: #6d28d9;
          border: 1px solid #ddd6fe;
        }
        .ai-pill-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        .ai-pill-dot.pulse { animation: ai-dot-pulse 1.5s infinite; }
        @keyframes ai-dot-pulse {
          0%,100% { opacity: 1; transform: scale(1); }
          50%      { opacity: 0.4; transform: scale(0.8); }
        }

        /* ── Body ── */
        .ai-body {
          flex: 1;
          overflow-y: auto;
          padding: 14px 14px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .ai-body::-webkit-scrollbar { width: 4px; }
        .ai-body::-webkit-scrollbar-track { background: transparent; }
        .ai-body::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 4px; }

        /* ── Empty / loading states ── */
        .ai-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          flex: 1;
          padding: 40px 20px;
          gap: 8px;
        }
        .ai-state-icon {
          width: 48px; height: 48px;
          border-radius: 14px;
          background: #f5f3ff;
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 6px;
          position: relative;
        }
        .ai-state-title {
          font-size: 13px;
          font-weight: 600;
          color: #475569;
          margin: 0;
        }
        .ai-state-sub {
          font-size: 11.5px;
          color: #94a3b8;
          margin: 0;
          line-height: 1.55;
          max-width: 180px;
        }

        /* Spinner ring */
        .ai-spin-ring {
          position: absolute;
          inset: 0;
          width: 48px; height: 48px;
          animation: ai-spin 1.2s linear infinite;
        }
        @keyframes ai-spin { to { transform: rotate(360deg); } }

        /* Bounce dots */
        .ai-dots {
          display: flex;
          gap: 5px;
          margin-top: 6px;
        }
        .ai-dot {
          width: 7px; height: 7px;
          border-radius: 50%;
          background: #a78bfa;
          animation: ai-bounce 1.1s ease-in-out infinite;
        }
        @keyframes ai-bounce {
          0%,80%,100% { transform: translateY(0); opacity: 0.5; }
          40%          { transform: translateY(-5px); opacity: 1; }
        }

        /* ── Summary sections ── */
        .ai-section {
          border-radius: 12px;
          padding: 12px 14px;
          animation: ai-section-in 0.3s ease both;
        }
        @keyframes ai-section-in {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .ai-section-header {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 8px;
        }
        .ai-section-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        .ai-section-label {
          font-size: 10.5px;
          font-weight: 700;
          letter-spacing: 0.07em;
          text-transform: uppercase;
          margin: 0;
        }
        .ai-section-list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .ai-section-item {
          display: flex;
          align-items: flex-start;
          gap: 8px;
        }
        .ai-item-bullet {
          width: 5px; height: 5px;
          border-radius: 50%;
          margin-top: 6px;
          flex-shrink: 0;
          opacity: 0.6;
        }
        .ai-item-text {
          font-size: 12.5px;
          color: #334155;
          line-height: 1.6;
          margin: 0;
        }

        /* Plain text fallback */
        .ai-plain {
          background: #f5f3ff;
          border: 1px solid #ddd6fe;
          border-radius: 12px;
          padding: 12px 14px;
        }
        .ai-plain-label {
          font-size: 10.5px;
          font-weight: 700;
          letter-spacing: 0.07em;
          text-transform: uppercase;
          color: #6d28d9;
          margin-bottom: 8px;
        }
        .ai-plain-text {
          font-size: 12.5px;
          color: #334155;
          line-height: 1.6;
          white-space: pre-wrap;
          margin: 0;
        }

        /* Gemini branding strip */
        .ai-footer-strip {
          padding: 8px 14px;
          border-top: 1px solid #f8fafc;
          display: flex;
          align-items: center;
          gap: 6px;
          flex-shrink: 0;
        }
        .ai-footer-text {
          font-size: 10.5px;
          color: #cbd5e1;
          font-weight: 500;
        }
      `}</style>

      <div className="ai-root">
        {/* Header */}
        <div className="ai-header">
          <div className="ai-header-left">
            <div className="ai-header-icon">
              <svg
                width="16"
                height="16"
                fill="none"
                viewBox="0 0 24 24"
                stroke="#7c3aed"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
            </div>
            <div>
              <p className="ai-header-title">AI Assistant</p>
              {updatedAt ? (
                <p className="ai-header-updated">
                  Updated {formatUpdatedAt(updatedAt)}
                </p>
              ) : (
                <p className="ai-header-updated">Powered by Gemini</p>
              )}
            </div>
          </div>

          {isConsulting && !hasSummary && (
            <span className="ai-pill ai-pill-generating">
              <span
                className="ai-pill-dot pulse"
                style={{ background: '#f59e0b' }}
              />
              Generating
            </span>
          )}
          {hasSummary && (
            <span className="ai-pill ai-pill-ready">
              <span className="ai-pill-dot" style={{ background: '#7c3aed' }} />
              Ready
            </span>
          )}
        </div>

        {/* Body */}
        <div className="ai-body">
          {/* Not consulting */}
          {!isConsulting && (
            <div className="ai-state">
              <div className="ai-state-icon">
                <svg
                  width="22"
                  height="22"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="#c4b5fd"
                  strokeWidth={1.6}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
              <p className="ai-state-title">AI summary inactive</p>
              <p className="ai-state-sub">
                Start a consultation to get AI‑powered clinical insights.
              </p>
            </div>
          )}

          {/* Consulting — waiting */}
          {isConsulting && !hasSummary && (
            <div className="ai-state">
              <div className="ai-state-icon">
                <svg className="ai-spin-ring" viewBox="0 0 48 48" fill="none">
                  <circle
                    cx="24"
                    cy="24"
                    r="20"
                    stroke="#ddd6fe"
                    strokeWidth="3"
                    strokeDasharray="28 100"
                    strokeLinecap="round"
                  />
                </svg>
                <svg
                  width="20"
                  height="20"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="#7c3aed"
                  strokeWidth={1.8}
                  style={{ position: 'relative', zIndex: 1 }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
              <p className="ai-state-title">Analysing patient data…</p>
              <p className="ai-state-sub">
                Reviewing vitals, triage &amp; history. Checking every few
                seconds.
              </p>
              <div className="ai-dots">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="ai-dot"
                    style={{ animationDelay: `${i * 0.18}s` }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Summary ready */}
          {hasSummary && (
            <>
              {typeof summaryContent === 'object' &&
                summaryContent !== null &&
                Object.entries(summaryContent).map(([key, value], idx) => {
                  if (SKIP_KEYS.includes(key) || !value) return null;
                  const label =
                    SECTION_LABELS[key] ||
                    key
                      .replace(/([A-Z])/g, ' $1')
                      .replace(/_/g, ' ')
                      .trim()
                      .replace(/\b\w/g, (c) => c.toUpperCase());
                  return (
                    <SummarySection
                      key={key}
                      sectionKey={key}
                      label={label}
                      value={value}
                      style={{ animationDelay: `${idx * 0.06}s` }}
                    />
                  );
                })}

              {typeof summaryContent === 'string' && (
                <div className="ai-plain">
                  <p className="ai-plain-label">Clinical Summary</p>
                  <p className="ai-plain-text">{summaryContent}</p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer branding */}
        <div className="ai-footer-strip">
          <svg
            width="11"
            height="11"
            fill="none"
            viewBox="0 0 24 24"
            stroke="#cbd5e1"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
            />
          </svg>
          <span className="ai-footer-text">
            AI-generated · Not a substitute for clinical judgment
          </span>
        </div>
      </div>
    </>
  );
}
