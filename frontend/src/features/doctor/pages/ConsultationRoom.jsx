import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { fetchQueue, fetchActiveConsultation } from '../doctorThunks';

import QueuePanel from '../components/QueuePanel';
import ActiveConsultation from '../components/ActiveConsultation';
import AiAssistant from '../components/AiAssistant';
import DateSelector from '../components/DateSelector';

const toDateString = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const todayStr = () => toDateString(new Date());

export default function ConsultationRoom() {
  const dispatch = useDispatch();
  const [selectedDate, setSelectedDate] = useState(todayStr());
  const [mounted, setMounted] = useState(false);
  const hasMounted = useRef(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (hasMounted.current) return;
    hasMounted.current = true;
    dispatch(fetchActiveConsultation());
    dispatch(fetchQueue(todayStr()));
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchQueue(selectedDate));
  }, [selectedDate, dispatch]);

  const isToday = selectedDate === todayStr();

  return (
    <>
      <style>{`
        .cr-root {
          height: 100vh;
          background: #f8fafc;
          padding: 28px 24px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          display: flex;
          flex-direction: column;
          gap: 20px;
          overflow: hidden;
          box-sizing: border-box;
        }

        /* ── Top bar ── */
        .cr-topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
          flex-shrink: 0;
          opacity: 0;
          transform: translateY(12px);
          transition: opacity 0.45s ease, transform 0.45s ease;
        }
        .cr-topbar.show { opacity: 1; transform: translateY(0); }

        .cr-eyebrow {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #94a3b8;
          margin-bottom: 4px;
        }
        .cr-title {
          font-size: 22px;
          font-weight: 700;
          color: #0f172a;
          letter-spacing: -0.3px;
          margin: 0;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .cr-title-icon {
          width: 34px; height: 34px;
          background: #eff6ff;
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }

        /* Live badge */
        .cr-live-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #f0fdf4;
          border: 1px solid #bbf7d0;
          border-radius: 20px;
          padding: 5px 12px;
          font-size: 12px;
          font-weight: 600;
          color: #16a34a;
        }
        .cr-live-dot {
          width: 7px; height: 7px;
          border-radius: 50%;
          background: #16a34a;
          animation: live-pulse 2s infinite;
        }
        @keyframes live-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.4; transform: scale(0.8); }
        }

        /* Date selector wrapper */
        .cr-date-wrap {
          flex-shrink: 0;
          opacity: 0;
          transform: translateY(12px);
          transition: opacity 0.45s ease 0.08s, transform 0.45s ease 0.08s;
        }
        .cr-date-wrap.show { opacity: 1; transform: translateY(0); }

        /* ── Grid ── */
        .cr-grid {
          display: grid;
          grid-template-columns: minmax(300px, 1.2fr) minmax(0, 2fr) minmax(300px, 1.2fr);
          gap: 16px;
          flex: 1;
          min-height: 0;
          opacity: 0;
          transform: translateY(14px);
          transition: opacity 0.5s ease 0.16s, transform 0.5s ease 0.16s;
        }
        .cr-grid.show { opacity: 1; transform: translateY(0); }

        @media (max-width: 1200px) {
          .cr-grid { grid-template-columns: minmax(260px, 1fr) minmax(0, 1.6fr) minmax(260px, 1fr); }
        }
        @media (max-width: 1024px) {
          .cr-root { height: auto; overflow: auto; }
          .cr-grid { grid-template-columns: 1fr 1fr; }
          .cr-col-main { grid-column: span 2; order: -1; }
        }
        @media (max-width: 680px) {
          .cr-grid { grid-template-columns: 1fr; }
          .cr-col-main { grid-column: span 1; }
          .cr-root { padding: 20px 16px; }
        }

        /* Column panels */
        .cr-col {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          min-height: 0;
          box-shadow: 0 2px 8px rgba(15,23,42,0.04);
          transition: box-shadow 0.2s;
        }
        .cr-col:hover {
          box-shadow: 0 4px 18px rgba(15,23,42,0.08);
        }

        /* Column header strip */
        .cr-col-header {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 14px 16px 12px;
          border-bottom: 1px solid #f1f5f9;
          flex-shrink: 0;
        }
        .cr-col-header-icon {
          width: 28px; height: 28px;
          border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
        }
        .icon-bg-blue   { background: #eff6ff; }
        .icon-bg-indigo { background: #eef2ff; }
        .icon-bg-violet { background: #f5f3ff; }

        .cr-col-title {
          font-size: 13px;
          font-weight: 600;
          color: #0f172a;
          flex: 1;
        }
        .cr-col-subtitle {
          font-size: 11px;
          color: #94a3b8;
        }

        /* Column body — scrolls internally */
        .cr-col-body {
          flex: 1;
          overflow-y: auto;
          min-height: 0;
        }
        .cr-col-body::-webkit-scrollbar { width: 4px; }
        .cr-col-body::-webkit-scrollbar-track { background: transparent; }
        .cr-col-body::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 4px; }
      `}</style>

      <div className="cr-root">
        {/* ── Top bar ── */}
        <div className={`cr-topbar ${mounted ? 'show' : ''}`}>
          <div className="cr-title-group">
            <p className="cr-eyebrow">Doctor Workspace</p>
            <h1 className="cr-title">
              <span className="cr-title-icon">
                <svg
                  width="18"
                  height="18"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="#2563eb"
                  strokeWidth="1.8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </span>
              Consultation Room
            </h1>
          </div>
          {isToday && (
            <div className="cr-live-badge">
              <span className="cr-live-dot" />
              Live Session
            </div>
          )}
        </div>

        {/* ── Date Selector ── */}
        <div className={`cr-date-wrap ${mounted ? 'show' : ''}`}>
          <DateSelector
            selectedDate={selectedDate}
            onChange={setSelectedDate}
          />
        </div>

        {/* ── Three-column grid ── */}
        <div className={`cr-grid ${mounted ? 'show' : ''}`}>
          {/* Queue Panel */}
          <div className="cr-col">
            <div className="cr-col-header">
              <div className="cr-col-header-icon icon-bg-blue">
                <svg
                  width="14"
                  height="14"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="#2563eb"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 10h16M4 14h8"
                  />
                </svg>
              </div>
              <span className="cr-col-title">Patient Queue</span>
              <span className="cr-col-subtitle">{selectedDate}</span>
            </div>
            <div className="cr-col-body">
              <QueuePanel date={selectedDate} />
            </div>
          </div>

          {/* Active Consultation */}
          <div className="cr-col cr-col-main">
            <div className="cr-col-header">
              <div className="cr-col-header-icon icon-bg-indigo">
                <svg
                  width="14"
                  height="14"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="#4f46e5"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <span className="cr-col-title">Active Consultation</span>
              {isToday && (
                <span
                  className="cr-col-subtitle"
                  style={{ color: '#16a34a', fontWeight: 600 }}
                >
                  ● Now
                </span>
              )}
            </div>
            <div className="cr-col-body">
              <ActiveConsultation date={selectedDate} />
            </div>
          </div>

          {/* AI Assistant */}
          <div className="cr-col">
            <div className="cr-col-header">
              <div className="cr-col-header-icon icon-bg-violet">
                <svg
                  width="14"
                  height="14"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="#7c3aed"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <span className="cr-col-title">AI Assistant</span>
              <span className="cr-col-subtitle">Gemini</span>
            </div>
            <div className="cr-col-body">
              <AiAssistant />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
