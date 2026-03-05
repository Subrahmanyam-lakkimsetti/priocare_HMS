import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  startConsultation,
  endConsultation,
  fetchAiSummary,
} from '../doctorThunks';

const SEVERITY_CONFIG = {
  critical: {
    bg: '#fee2e2',
    text: '#dc2626',
    dot: '#ef4444',
    border: '#fecaca',
    badgeBg: '#fee2e2',
    badgeText: '#dc2626',
  },
  high: {
    bg: '#ffedd5',
    text: '#ea580c',
    dot: '#f97316',
    border: '#fed7aa',
    badgeBg: '#ffedd5',
    badgeText: '#ea580c',
  },
  medium: {
    bg: '#fefce8',
    text: '#ca8a04',
    dot: '#eab308',
    border: '#fde68a',
    badgeBg: '#fefce8',
    badgeText: '#ca8a04',
  },
  low: {
    bg: '#f0fdf4',
    text: '#16a34a',
    dot: '#22c55e',
    border: '#bbf7d0',
    badgeBg: '#f0fdf4',
    badgeText: '#16a34a',
  },
};

function formatTime(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

function DetailRow({ label, value }) {
  if (!value) return null;
  return (
    <div className="ac-detail-row">
      <span className="ac-detail-label">{label}</span>
      <span className="ac-detail-value">{value}</span>
    </div>
  );
}

function VitalPill({ label, value, unit, normal }) {
  if (!value) return null;
  const ok = normal === undefined ? null : normal;
  return (
    <div className="ac-vital">
      <div className="ac-vital-top">
        <span className="ac-vital-label">{label}</span>
        {ok !== null && (
          <span
            className="ac-vital-status"
            style={{
              background: ok ? '#f0fdf4' : '#fef2f2',
              color: ok ? '#16a34a' : '#dc2626',
              border: `1px solid ${ok ? '#bbf7d0' : '#fecaca'}`,
            }}
          >
            {ok ? 'Normal' : 'Abnormal'}
          </span>
        )}
      </div>
      <div className="ac-vital-value">
        {value} <span className="ac-vital-unit">{unit}</span>
      </div>
    </div>
  );
}

export default function ActiveConsultation({ date }) {
  const dispatch = useDispatch();
  const activePatient = useSelector((s) => s.doctor.activePatient);
  const calledPatient = useSelector((s) => s.doctor.calledPatient);

  const [bodyVisible, setBodyVisible] = useState(true);
  const [showEndModal, setShowEndModal] = useState(false);
  const [ending, setEnding] = useState(false);

  const handleStart = async () => {
    setBodyVisible(false);
    await new Promise((r) => setTimeout(r, 300));
    const res = await dispatch(startConsultation(date));
    if (res.payload?.token) dispatch(fetchAiSummary(res.payload.token));
    await new Promise((r) => setTimeout(r, 60));
    setBodyVisible(true);
  };

  const handleEndConfirm = async () => {
    if (!activePatient?.token) return;
    setEnding(true);
    setBodyVisible(false);
    await new Promise((r) => setTimeout(r, 280));
    await dispatch(endConsultation(activePatient.token));
    setBodyVisible(true);
    setEnding(false);
    setShowEndModal(false);
  };

  const patient = activePatient?.patient;
  const triage = activePatient?.triage;
  const vitals = triage?.vitals;
  const symptoms = triage?.symptoms || [];
  const severityLevel = triage?.severityLevel?.toLowerCase();
  const scfg = SEVERITY_CONFIG[severityLevel] || SEVERITY_CONFIG.low;

  return (
    <>
      <style>{`
        .ac-root {
          height: 100%;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }

        .ac-body {
          flex: 1;
          overflow-y: auto;
          padding: 16px 18px;
          display: flex;
          flex-direction: column;
          gap: 14px;
          min-height: 0;
        }
        .ac-body::-webkit-scrollbar { width: 4px; }
        .ac-body::-webkit-scrollbar-track { background: transparent; }
        .ac-body::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 4px; }

        .ac-empty {
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          text-align: center; flex: 1;
          padding: 48px 24px; gap: 10px;
        }
        .ac-empty-icon {
          width: 52px; height: 52px; border-radius: 16px;
          background: #eff6ff; display: flex; align-items: center;
          justify-content: center; margin-bottom: 4px;
        }
        .ac-empty-title { font-size: 13.5px; font-weight: 600; color: #475569; margin: 0; }
        .ac-empty-sub { font-size: 12px; color: #94a3b8; margin: 0; max-width: 220px; line-height: 1.5; }

        .ac-called-card {
          background: #fffbeb; border: 1px solid #fde68a;
          border-radius: 14px; padding: 16px;
        }
        .ac-called-top { display: flex; align-items: center; gap: 12px; margin-bottom: 14px; }
        .ac-called-icon {
          width: 38px; height: 38px; border-radius: 12px;
          background: #fef3c7; border: 1px solid #fde68a;
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
        .ac-called-eyebrow {
          font-size: 10.5px; font-weight: 600; letter-spacing: 0.07em;
          text-transform: uppercase; color: #92400e; margin-bottom: 2px;
        }
        .ac-called-token { font-size: 20px; font-weight: 700; color: #0f172a; letter-spacing: -0.3px; }
        .ac-called-time {
          display: flex; align-items: center; gap: 6px;
          font-size: 12px; color: #92400e; margin-bottom: 14px;
          background: #fef3c7; border-radius: 8px; padding: 6px 10px;
        }

        .ac-status-bar {
          display: flex; align-items: center; justify-content: space-between;
          background: #f0fdf4; border: 1px solid #bbf7d0;
          border-radius: 12px; padding: 10px 14px; flex-shrink: 0;
        }
        .ac-status-left { display: flex; align-items: center; gap: 8px; }
        .ac-status-dot {
          width: 8px; height: 8px; border-radius: 50%; background: #16a34a;
          animation: ac-pulse 2s infinite;
        }
        @keyframes ac-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.5; transform: scale(0.85); }
        }
        .ac-status-label { font-size: 11px; font-weight: 700; letter-spacing: 0.07em; text-transform: uppercase; color: #16a34a; }
        .ac-status-right { display: flex; align-items: center; gap: 12px; font-size: 11.5px; color: #64748b; }
        .ac-status-token { font-weight: 700; color: #0f172a; }

        .ac-section {
          background: #f8fafc; border: 1px solid #f1f5f9;
          border-radius: 14px; padding: 14px 16px;
        }
        .ac-section-title {
          font-size: 10.5px; font-weight: 600; letter-spacing: 0.08em;
          text-transform: uppercase; color: #94a3b8; margin-bottom: 12px;
        }
        .ac-detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px 16px; }
        .ac-detail-row { display: flex; flex-direction: column; gap: 2px; }
        .ac-detail-label { font-size: 10.5px; color: #94a3b8; font-weight: 500; }
        .ac-detail-value { font-size: 13px; font-weight: 600; color: #0f172a; }

        .ac-triage { border-radius: 14px; padding: 14px 16px; }
        .ac-triage-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; }
        .ac-severity-badge {
          display: inline-flex; align-items: center; gap: 5px;
          font-size: 11px; font-weight: 700; padding: 3px 10px;
          border-radius: 20px; letter-spacing: 0.04em;
        }
        .ac-severity-dot { width: 6px; height: 6px; border-radius: 50%; }
        .ac-score-badge {
          font-size: 11px; font-weight: 600; color: #64748b;
          background: #fff; border: 1px solid #e2e8f0;
          padding: 3px 10px; border-radius: 20px;
        }

        .ac-vitals-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-bottom: 12px; }
        .ac-vital { background: #fff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 10px; }
        .ac-vital-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px; gap: 4px; }
        .ac-vital-label { font-size: 10px; color: #94a3b8; font-weight: 500; }
        .ac-vital-status { font-size: 9px; font-weight: 600; padding: 1px 5px; border-radius: 6px; white-space: nowrap; }
        .ac-vital-value { font-size: 14px; font-weight: 700; color: #0f172a; }
        .ac-vital-unit { font-size: 10px; font-weight: 400; color: #94a3b8; }

        .ac-complaint { background: #fff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 10px 12px; margin-bottom: 12px; }
        .ac-complaint-label { font-size: 10px; color: #94a3b8; font-weight: 500; margin-bottom: 4px; }
        .ac-complaint-text { font-size: 13px; color: #334155; font-weight: 500; line-height: 1.5; }

        .ac-tags { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 4px; }
        .ac-tag { font-size: 11px; padding: 3px 9px; border-radius: 8px; font-weight: 500; }
        .ac-tag-symptom { background: #fff; border: 1px solid #e2e8f0; color: #475569; }
        .ac-tag-comorbidity { background: #f5f3ff; border: 1px solid #ddd6fe; color: #6d28d9; }
        .ac-tag-section-label { font-size: 10.5px; font-weight: 600; color: #94a3b8; margin-top: 8px; margin-bottom: 4px; }
        .ac-triage-source { font-size: 11px; color: #94a3b8; margin-top: 10px; }

        .ac-btn {
          width: 100%; padding: 11px; border-radius: 12px; border: none;
          font-size: 13.5px; font-weight: 600; cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          transition: background 0.18s, transform 0.15s, box-shadow 0.18s;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }
        .ac-btn-start {
          background: #2563eb; color: #fff;
          box-shadow: 0 2px 10px rgba(37,99,235,0.25);
        }
        .ac-btn-start:hover { background: #1d4ed8; transform: translateY(-1px); box-shadow: 0 4px 16px rgba(37,99,235,0.32); }
        .ac-btn-start:active { transform: translateY(0); }
        .ac-btn-end { background: #fff1f2; color: #dc2626; border: 1px solid #fecaca; }
        .ac-btn-end:hover { background: #dc2626; color: #fff; border-color: #dc2626; transform: translateY(-1px); }
        .ac-btn-end:active { transform: translateY(0); }

        .ac-footer { padding: 12px 18px 16px; border-top: 1px solid #f8fafc; flex-shrink: 0; }

        .ac-body-transition { transition: opacity 0.28s ease, transform 0.28s ease; }
        .ac-body-hidden { opacity: 0; transform: translateY(6px); pointer-events: none; }
        .ac-body-visible { opacity: 1; transform: translateY(0); }

        .ac-modal-overlay {
          position: fixed; inset: 0; z-index: 100;
          display: flex; align-items: center; justify-content: center;
          padding: 20px; animation: ac-overlay-in 0.2s ease;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }
        @keyframes ac-overlay-in { from { opacity: 0; } to { opacity: 1; } }
        .ac-modal-backdrop { position: absolute; inset: 0; background: rgba(15,23,42,0.45); backdrop-filter: blur(4px); }
        .ac-modal {
          position: relative; z-index: 1; background: #fff;
          border-radius: 20px; padding: 28px 24px 24px;
          width: 100%; max-width: 360px;
          box-shadow: 0 20px 60px rgba(15,23,42,0.18);
          animation: ac-modal-in 0.25s cubic-bezier(.22,1,.36,1);
        }
        @keyframes ac-modal-in {
          from { opacity: 0; transform: scale(0.94) translateY(10px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        .ac-modal-icon {
          width: 48px; height: 48px; border-radius: 14px;
          background: #fff1f2; border: 1px solid #fecaca;
          display: flex; align-items: center; justify-content: center; margin: 0 auto 16px;
        }
        .ac-modal-title { font-size: 16px; font-weight: 700; color: #0f172a; text-align: center; margin: 0 0 6px; letter-spacing: -0.2px; }
        .ac-modal-desc { font-size: 12.5px; color: #64748b; text-align: center; line-height: 1.6; margin: 0 0 18px; }
        .ac-modal-desc strong { color: #0f172a; font-weight: 600; }
        .ac-modal-divider { height: 1px; background: #f1f5f9; margin-bottom: 16px; }
        .ac-modal-patient {
          display: flex; align-items: center; gap: 10px;
          background: #f8fafc; border: 1px solid #f1f5f9;
          border-radius: 12px; padding: 10px 14px; margin-bottom: 16px;
        }
        .ac-modal-patient-icon {
          width: 32px; height: 32px; border-radius: 50%;
          background: #eff6ff; border: 1.5px solid #bfdbfe;
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
        .ac-modal-patient-token { font-size: 13px; font-weight: 700; color: #0f172a; }
        .ac-modal-patient-sub { font-size: 11px; color: #94a3b8; margin-top: 1px; }
        .ac-modal-actions { display: flex; flex-direction: column; gap: 8px; }
        .ac-modal-btn-confirm {
          width: 100%; padding: 11px; border-radius: 12px; border: none;
          background: #dc2626; color: #fff; font-size: 13.5px; font-weight: 600;
          cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px;
          transition: background 0.15s, transform 0.15s;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }
        .ac-modal-btn-confirm:hover { background: #b91c1c; transform: translateY(-1px); }
        .ac-modal-btn-confirm:active { transform: translateY(0); }
        .ac-modal-btn-confirm:disabled { background: #fca5a5; cursor: wait; }
        .ac-modal-btn-cancel {
          width: 100%; padding: 11px; border-radius: 12px;
          border: 1px solid #e2e8f0; background: #fff; color: #475569;
          font-size: 13.5px; font-weight: 500; cursor: pointer;
          transition: background 0.15s, border-color 0.15s;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }
        .ac-modal-btn-cancel:hover { background: #f8fafc; border-color: #cbd5e1; }
        .ac-end-spinner {
          width: 14px; height: 14px;
          border: 2px solid rgba(255,255,255,0.35);
          border-top-color: #fff; border-radius: 50%;
          animation: ac-spin 0.7s linear infinite;
        }
        @keyframes ac-spin { to { transform: rotate(360deg); } }
      `}</style>

      <div className="ac-root">
        <div
          className={`ac-body ac-body-transition ${bodyVisible ? 'ac-body-visible' : 'ac-body-hidden'}`}
        >
          {/* Empty */}
          {!calledPatient && !activePatient && (
            <div className="ac-empty">
              <div className="ac-empty-icon">
                <svg
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="#60a5fa"
                  strokeWidth={1.6}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <p className="ac-empty-title">No active consultation</p>
              <p className="ac-empty-sub">
                Call the next patient from the queue panel to start a session.
              </p>
            </div>
          )}

          {/* Called */}
          {calledPatient && !activePatient && (
            <div className="ac-called-card">
              <div className="ac-called-top">
                <div className="ac-called-icon">
                  <svg
                    width="18"
                    height="18"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="#d97706"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                  </svg>
                </div>
                <div>
                  <p className="ac-called-eyebrow">Patient Called</p>
                  <p className="ac-called-token">
                    Token #{calledPatient.tokenNumber}
                  </p>
                </div>
              </div>
              <div className="ac-called-time">
                <svg
                  width="13"
                  height="13"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                Called at{' '}
                {calledPatient.calledAt
                  ? new Date(calledPatient.calledAt).toLocaleTimeString(
                      'en-IN',
                      { hour: '2-digit', minute: '2-digit', hour12: true },
                    )
                  : '—'}
              </div>
              <button className="ac-btn ac-btn-start" onClick={handleStart}>
                <svg
                  width="15"
                  height="15"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Start Consultation
              </button>
            </div>
          )}

          {/* Active */}
          {activePatient && (
            <>
              <div className="ac-status-bar">
                <div className="ac-status-left">
                  <span className="ac-status-dot" />
                  <span className="ac-status-label">In Consultation</span>
                </div>
                <div className="ac-status-right">
                  <span>
                    Token{' '}
                    <span className="ac-status-token">
                      #{activePatient.token}
                    </span>
                  </span>
                  <span>
                    Started {formatTime(activePatient.consulationStartsAt)}
                  </span>
                </div>
              </div>

              {patient && (
                <div className="ac-section">
                  <p className="ac-section-title">Patient Information</p>
                  <div className="ac-detail-grid">
                    <DetailRow label="Full Name" value={patient.name} />
                    <DetailRow
                      label="Age"
                      value={patient.age ? `${patient.age} years` : null}
                    />
                    <DetailRow label="Gender" value={patient.gender} />
                    <DetailRow label="Blood Group" value={patient.bloodGroup} />
                    <DetailRow label="Phone" value={patient.phoneNumber} />
                    <DetailRow
                      label="Checked In"
                      value={formatTime(activePatient.checkedInAt)}
                    />
                  </div>
                </div>
              )}

              {triage && (
                <div
                  className="ac-triage"
                  style={{
                    background: scfg.bg + '66',
                    border: `1px solid ${scfg.border}`,
                  }}
                >
                  <div className="ac-triage-header">
                    <p className="ac-section-title" style={{ margin: 0 }}>
                      Triage Assessment
                    </p>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <span
                        className="ac-severity-badge"
                        style={{
                          background: scfg.badgeBg,
                          color: scfg.badgeText,
                          border: `1px solid ${scfg.border}`,
                        }}
                      >
                        <span
                          className="ac-severity-dot"
                          style={{ background: scfg.dot }}
                        />
                        {triage.severityLevel?.toUpperCase()}
                      </span>
                      {triage.priorityScore != null && (
                        <span className="ac-score-badge">
                          Score: {triage.priorityScore}
                        </span>
                      )}
                    </div>
                  </div>

                  {vitals && (
                    <div className="ac-vitals-grid">
                      <VitalPill
                        label="Heart Rate"
                        value={vitals.heartRate}
                        unit="bpm"
                        normal={
                          vitals.heartRate >= 60 && vitals.heartRate <= 100
                        }
                      />
                      <VitalPill
                        label="Blood Pressure"
                        value={vitals.bloodPressure}
                        unit=""
                        normal={vitals.bloodPressure === '120/80'}
                      />
                      <VitalPill
                        label="Temperature"
                        value={vitals.temperature}
                        unit="°C"
                        normal={
                          vitals.temperature >= 36.1 &&
                          vitals.temperature <= 37.2
                        }
                      />
                    </div>
                  )}

                  {triage.description && (
                    <div className="ac-complaint">
                      <p className="ac-complaint-label">Chief Complaint</p>
                      <p className="ac-complaint-text">
                        "{triage.description}"
                      </p>
                    </div>
                  )}

                  {symptoms.length > 0 && (
                    <>
                      <p className="ac-tag-section-label">Symptoms</p>
                      <div className="ac-tags">
                        {symptoms.map((s, i) => (
                          <span key={i} className="ac-tag ac-tag-symptom">
                            {s}
                          </span>
                        ))}
                      </div>
                    </>
                  )}

                  {triage.comorbidities?.length > 0 && (
                    <>
                      <p className="ac-tag-section-label">Comorbidities</p>
                      <div className="ac-tags">
                        {triage.comorbidities.map((c, i) => (
                          <span key={i} className="ac-tag ac-tag-comorbidity">
                            {c}
                          </span>
                        ))}
                      </div>
                    </>
                  )}

                  {triage.source && (
                    <p className="ac-triage-source">
                      Triage via {triage.source}
                    </p>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {activePatient && (
          <div className="ac-footer">
            <button
              className="ac-btn ac-btn-end"
              onClick={() => setShowEndModal(true)}
            >
              <svg
                width="15"
                height="15"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"
                />
              </svg>
              End Consultation
            </button>
          </div>
        )}
      </div>

      {showEndModal && (
        <div className="ac-modal-overlay">
          <div
            className="ac-modal-backdrop"
            onClick={() => !ending && setShowEndModal(false)}
          />
          <div className="ac-modal">
            <div className="ac-modal-icon">
              <svg
                width="20"
                height="20"
                fill="none"
                viewBox="0 0 24 24"
                stroke="#dc2626"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"
                />
              </svg>
            </div>
            <h2 className="ac-modal-title">End Consultation?</h2>
            <p className="ac-modal-desc">
              This will close the current session for{' '}
              <strong>Token #{activePatient?.token}</strong>. Make sure all
              notes are recorded before ending.
            </p>
            <div className="ac-modal-divider" />
            <div className="ac-modal-patient">
              <div className="ac-modal-patient-icon">
                <svg
                  width="14"
                  height="14"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="#2563eb"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <div>
                <div className="ac-modal-patient-token">
                  {activePatient?.patient?.name ||
                    `Token #${activePatient?.token}`}
                </div>
                <div className="ac-modal-patient-sub">
                  Started {formatTime(activePatient?.consulationStartsAt)}
                </div>
              </div>
            </div>
            <div className="ac-modal-actions">
              <button
                className="ac-modal-btn-confirm"
                onClick={handleEndConfirm}
                disabled={ending}
              >
                {ending ? (
                  <>
                    <span className="ac-end-spinner" /> Ending session…
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
                        d="M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"
                      />
                    </svg>
                    Yes, end consultation
                  </>
                )}
              </button>
              <button
                className="ac-modal-btn-cancel"
                onClick={() => setShowEndModal(false)}
                disabled={ending}
              >
                Cancel, continue session
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
