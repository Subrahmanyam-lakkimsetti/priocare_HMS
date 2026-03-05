import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

export default function DoctorDashboard() {
  const nav = useNavigate();
  const user = useSelector((s) => s.auth?.user);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentHour = new Date().getHours();
  const greeting =
    currentHour < 12
      ? 'Good morning'
      : currentHour < 17
        ? 'Good afternoon'
        : 'Good evening';

  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <>
      <style>{`
        .dash-root {
          min-height: 100vh;
          background: #f8fafc;
          padding: 40px 32px;
          max-width: 960px;
          margin: 0 auto;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }

        /* Entrance animations */
        .fade-up {
          opacity: 0;
          transform: translateY(16px);
          transition: opacity 0.5s ease, transform 0.5s ease;
        }
        .fade-up.show { opacity: 1; transform: translateY(0); }
        .d1 { transition-delay: 0.05s; }
        .d2 { transition-delay: 0.13s; }
        .d3 { transition-delay: 0.21s; }
        .d4 { transition-delay: 0.29s; }

        /* ── Header ── */
        .header-wrap {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 36px;
        }
        .header-date {
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: #94a3b8;
          margin-bottom: 6px;
        }
        .header-greeting {
          font-size: 28px;
          font-weight: 700;
          color: #0f172a;
          margin: 0 0 4px;
          letter-spacing: -0.4px;
        }
        .header-sub {
          font-size: 13.5px;
          color: #64748b;
          font-weight: 400;
        }
        .header-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #eff6ff;
          border: 1px solid #bfdbfe;
          border-radius: 20px;
          padding: 6px 14px;
          font-size: 12px;
          font-weight: 600;
          color: #2563eb;
          white-space: nowrap;
          flex-shrink: 0;
          margin-top: 4px;
        }
        .badge-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #2563eb;
          animation: pulse-blue 2s infinite;
        }
        @keyframes pulse-blue {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.85); }
        }

        /* ── Section label ── */
        .section-label {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #94a3b8;
          margin-bottom: 14px;
        }

        /* ── Action Cards ── */
        .cards-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 16px;
        }
        @media (max-width: 580px) { .cards-grid { grid-template-columns: 1fr; } }

        .card {
          border-radius: 16px;
          padding: 28px 24px 24px;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          transition: transform 0.22s ease, box-shadow 0.22s ease;
        }
        .card:hover { transform: translateY(-2px); }

        /* Primary — blue */
        .card-blue {
          background: #2563eb;
          box-shadow: 0 4px 20px rgba(37,99,235,0.25);
        }
        .card-blue:hover {
          box-shadow: 0 8px 32px rgba(37,99,235,0.38);
        }
        .card-blue::after {
          content: '';
          position: absolute;
          top: -50px; right: -50px;
          width: 180px; height: 180px;
          background: rgba(255,255,255,0.06);
          border-radius: 50%;
          pointer-events: none;
        }

        /* Secondary — white */
        .card-white {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          box-shadow: 0 2px 10px rgba(15,23,42,0.05);
        }
        .card-white:hover {
          box-shadow: 0 6px 24px rgba(15,23,42,0.10);
          border-color: #c7d2fe;
        }

        .card-icon-wrap {
          width: 42px; height: 42px;
          border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 20px;
        }
        .icon-blue-inv  { background: rgba(255,255,255,0.15); }
        .icon-indigo    { background: #eef2ff; }

        .card-title-blue {
          font-size: 18px;
          font-weight: 700;
          color: #ffffff;
          margin: 0 0 6px;
          letter-spacing: -0.2px;
        }
        .card-desc-blue {
          font-size: 13px;
          color: rgba(255,255,255,0.65);
          line-height: 1.55;
          margin: 0;
        }
        .card-title-white {
          font-size: 18px;
          font-weight: 700;
          color: #0f172a;
          margin: 0 0 6px;
          letter-spacing: -0.2px;
        }
        .card-desc-white {
          font-size: 13px;
          color: #64748b;
          line-height: 1.55;
          margin: 0;
        }

        .card-cta {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          margin-top: 22px;
          font-size: 13px;
          font-weight: 600;
          transition: gap 0.18s ease;
        }
        .card:hover .card-cta { gap: 9px; }
        .cta-blue  { color: rgba(255,255,255,0.85); }
        .cta-indigo { color: #4f46e5; }

        /* ── Status Strip ── */
        .status-strip {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
        }
        @media (max-width: 580px) { .status-strip { grid-template-columns: 1fr; } }

        .status-chip {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          padding: 16px 18px;
          display: flex;
          align-items: center;
          gap: 12px;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .status-chip:hover {
          border-color: #c7d2fe;
          box-shadow: 0 4px 14px rgba(15,23,42,0.07);
        }

        .chip-indicator {
          width: 36px; height: 36px;
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .ind-blue   { background: #eff6ff; }
        .ind-indigo { background: #eef2ff; }
        .ind-slate  { background: #f1f5f9; }

        .chip-label {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: #94a3b8;
          margin-bottom: 2px;
        }
        .chip-value {
          font-size: 13px;
          font-weight: 700;
          color: #0f172a;
        }
        .chip-sub {
          font-size: 11px;
          color: #94a3b8;
          margin-top: 1px;
        }
      `}</style>

      <div className="dash-root">
        {/* ── Header ── */}
        <div className={`header-wrap fade-up ${mounted ? 'show' : ''}`}>
          <div>
            <p className="header-date">{today}</p>
            <h1 className="header-greeting">
              {greeting}, {user?.name || 'Doctor'} 👋
            </h1>
            <p className="header-sub">Here's an overview of your workspace.</p>
          </div>
          <div className="header-badge">
            <span className="badge-dot" />
            PrioCare HMS
          </div>
        </div>

        {/* ── Quick Actions ── */}
        <p className={`section-label fade-up d1 ${mounted ? 'show' : ''}`}>
          Quick Actions
        </p>
        <div className={`cards-grid fade-up d2 ${mounted ? 'show' : ''}`}>
          {/* Consultation Room */}
          <div
            className="card card-blue"
            onClick={() => nav('/doctor/consultation')}
          >
            <div className="card-icon-wrap icon-blue-inv">
              <svg
                width="20"
                height="20"
                fill="none"
                viewBox="0 0 24 24"
                stroke="white"
                strokeWidth="1.8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <h3 className="card-title-blue">Consultation Room</h3>
            <p className="card-desc-blue">
              View patient queue, manage consultations, and access AI summaries.
            </p>
            <div className="card-cta cta-blue">
              Open room
              <svg
                width="14"
                height="14"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </div>

          {/* Patient History */}
          <div
            className="card card-white"
            onClick={() => nav('/doctor/patients')}
          >
            <div className="card-icon-wrap icon-indigo">
              <svg
                width="20"
                height="20"
                fill="none"
                viewBox="0 0 24 24"
                stroke="#4f46e5"
                strokeWidth="1.8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            </div>
            <h3 className="card-title-white">Patient History</h3>
            <p className="card-desc-white">
              Review past consultations, records, and patient notes.
            </p>
            <div className="card-cta cta-indigo">
              View records
              <svg
                width="14"
                height="14"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* ── Status Strip ── */}
        <p className={`section-label fade-up d3 ${mounted ? 'show' : ''}`}>
          System Status
        </p>
        <div className={`status-strip fade-up d4 ${mounted ? 'show' : ''}`}>
          {[
            {
              ind: 'ind-blue',
              icon: (
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
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              ),
              label: 'System',
              value: 'PrioCare HMS',
              sub: 'Hospital Management',
            },
            {
              ind: 'ind-indigo',
              icon: (
                <svg
                  width="18"
                  height="18"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="#4f46e5"
                  strokeWidth="1.8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              ),
              label: 'AI Assistant',
              value: 'Gemini AI',
              sub: 'Triage & summaries',
            },
            {
              ind: 'ind-slate',
              icon: (
                <svg
                  width="18"
                  height="18"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="#475569"
                  strokeWidth="1.8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              ),
              label: 'Live Updates',
              value: 'Socket Ready',
              sub: 'Real-time queue sync',
            },
          ].map((item) => (
            <div className="status-chip" key={item.label}>
              <div className={`chip-indicator ${item.ind}`}>{item.icon}</div>
              <div>
                <p className="chip-label">{item.label}</p>
                <p className="chip-value">{item.value}</p>
                <p className="chip-sub">{item.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
