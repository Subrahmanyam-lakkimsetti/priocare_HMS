import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchActiveAppointment } from '../patientThunks';
import { useNavigate, useLocation } from 'react-router-dom';
import NoAppointmentPage from './NoAppointmentPage';

const NAV_ITEMS = [
  {
    key: 'home',
    label: 'Dashboard',
    path: '/patient',
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
        />
      </svg>
    ),
  },
  {
    key: 'appointments',
    label: 'Appointments',
    path: '/patient/appointments',
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
    ),
  },
  {
    key: 'records',
    label: 'Medical Records',
    path: '/patient/records',
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
    ),
  },
  {
    key: 'profile',
    label: 'Profile',
    path: '/patient/profile',
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
        />
      </svg>
    ),
  },
];

const SEVERITY_CONFIG = {
  Critical: {
    bg: 'from-red-50 to-rose-50',
    border: 'border-red-200',
    badge: 'bg-red-100 text-red-700',
    dot: 'bg-red-500',
    accent: '#ef4444',
    glow: 'shadow-red-100',
  },
  High: {
    bg: 'from-orange-50 to-amber-50',
    border: 'border-orange-200',
    badge: 'bg-orange-100 text-orange-700',
    dot: 'bg-orange-500',
    accent: '#f97316',
    glow: 'shadow-orange-100',
  },
  Medium: {
    bg: 'from-yellow-50 to-amber-50',
    border: 'border-yellow-200',
    badge: 'bg-yellow-100 text-yellow-700',
    dot: 'bg-yellow-500',
    accent: '#eab308',
    glow: 'shadow-yellow-100',
  },
  Low: {
    bg: 'from-emerald-50 to-teal-50',
    border: 'border-emerald-200',
    badge: 'bg-emerald-100 text-emerald-700',
    dot: 'bg-emerald-500',
    accent: '#10b981',
    glow: 'shadow-emerald-100',
  },
};

const STATUS_CONFIG = {
  waiting: {
    label: 'Waiting',
    color: 'bg-amber-100 text-amber-700',
    bannerBg: 'bg-gradient-to-r from-amber-50 to-orange-50',
    bannerBorder: 'border-amber-200',
    bannerText: 'text-amber-900',
    iconBg: 'bg-amber-100',
    icon: (
      <svg
        className="w-5 h-5 text-amber-600"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    message:
      'Please have a seat and stay nearby. Your token will be called shortly — we appreciate your patience.',
  },
  'in-progress': {
    label: 'In Progress',
    color: 'bg-blue-100 text-blue-700',
    bannerBg: 'bg-gradient-to-r from-blue-50 to-indigo-50',
    bannerBorder: 'border-blue-200',
    bannerText: 'text-blue-900',
    iconBg: 'bg-blue-100',
    icon: (
      <svg
        className="w-5 h-5 text-blue-600"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
        />
      </svg>
    ),
    message:
      "Your consultation is currently underway. Please proceed to the doctor's room if you haven't already.",
  },
  completed: {
    label: 'Completed',
    color: 'bg-emerald-100 text-emerald-700',
    bannerBg: 'bg-gradient-to-r from-emerald-50 to-teal-50',
    bannerBorder: 'border-emerald-200',
    bannerText: 'text-emerald-900',
    iconBg: 'bg-emerald-100',
    icon: (
      <svg
        className="w-5 h-5 text-emerald-600"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    message:
      'Your consultation is complete. Please collect your prescription or follow-up instructions from the front desk.',
  },
};

function StatusDot({ status }) {
  if (status === 'in-progress') {
    return (
      <span className="relative flex h-2.5 w-2.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500" />
      </span>
    );
  }
  const dotColor =
    status === 'waiting'
      ? 'bg-amber-400'
      : status === 'completed'
        ? 'bg-emerald-500'
        : 'bg-gray-400';
  return <span className={`w-2 h-2 rounded-full ${dotColor}`} />;
}

const TIPS = [
  {
    icon: '📱',
    text: 'Keep your phone nearby in case the staff needs to reach you.',
  },
  {
    icon: '🪪',
    text: 'Have your ID and insurance card ready at the front desk.',
  },
  {
    icon: '🔔',
    text: 'Let reception know if your symptoms change significantly.',
  },
];

export default function PatientHome() {
  const dispatch = useDispatch();
  const nav = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { activeAppointment, loadingAppointment } = useSelector(
    (s) => s.patient,
  );
  const user = useSelector((s) => s.auth?.user) || {
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah@example.com',
  };

  useEffect(() => {
    dispatch(fetchActiveAppointment());
  }, []);

  const activeKey =
    location.pathname === '/patient'
      ? 'home'
      : NAV_ITEMS.find(
          (n) => location.pathname.startsWith(n.path) && n.path !== '/patient',
        )?.key || 'home';

  const severity = activeAppointment?.triage?.severityLevel;
  const sevConfig = SEVERITY_CONFIG[severity] || SEVERITY_CONFIG['Low'];
  const status = activeAppointment?.status;
  const statusCfg = STATUS_CONFIG[status] || {
    label: status,
    color: 'bg-gray-100 text-gray-600',
    bannerBg: 'bg-gray-50',
    bannerBorder: 'border-gray-200',
    bannerText: 'text-gray-700',
    iconBg: 'bg-gray-100',
    icon: (
      <svg
        className="w-5 h-5 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    message: 'Please check with the front desk for further assistance.',
  };

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Serif+Display:ital@0;1&display=swap');

        .patient-home * { font-family: 'DM Sans', sans-serif; }
        .serif { font-family: 'DM Serif Display', serif; }

        .card-hover {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .card-hover:hover {
          transform: translateY(-2px);
          box-shadow: 0 20px 40px -8px rgba(0,0,0,0.12);
        }

        .token-glow {
          animation: tokenPulse 3s ease-in-out infinite;
        }
        @keyframes tokenPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(99,102,241,0.15); }
          50% { box-shadow: 0 0 0 12px rgba(99,102,241,0); }
        }

        .slide-up {
          animation: slideUp 0.5s ease both;
        }
        .slide-up:nth-child(1) { animation-delay: 0ms; }
        .slide-up:nth-child(2) { animation-delay: 80ms; }
        .slide-up:nth-child(3) { animation-delay: 160ms; }
        .slide-up:nth-child(4) { animation-delay: 240ms; }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .dot-pattern {
          background-image: radial-gradient(circle, #e2e8f0 1px, transparent 1px);
          background-size: 20px 20px;
        }

        .avatar-ring {
          background: linear-gradient(135deg, #6366f1, #8b5cf6, #06b6d4);
          padding: 2px;
          border-radius: 14px;
        }
        .avatar-inner {
          background: #1e1b4b;
          border-radius: 12px;
        }

        .status-pill {
          backdrop-filter: blur(8px);
        }

        .tip-card {
          transition: background 0.2s ease;
        }
        .tip-card:hover {
          background: #f8fafc;
        }
      `}</style>

      <div
        className="patient-home min-h-screen flex"
        style={{ background: '#f8fafc' }}
      >
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/40 z-20 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <div className="flex-1 flex flex-col min-w-0">
          {/* ── Top bar ── */}
          <header
            className="fixed top-16 lg:top-0 left-0 lg:left-64 right-0 z-10 lg:z-20 border-b px-8 py-4 flex items-center gap-4"
            style={{
              background: 'rgba(255,255,255,0.85)',
              backdropFilter: 'blur(12px)',
              borderColor: '#e8edf2',
            }}
          >
            <div className="flex-1">
              <h1
                className="font-bold text-xl text-gray-900"
                style={{ letterSpacing: '-0.01em' }}
              >
                Dashboard
              </h1>
              <p
                className="text-xs text-gray-400 hidden sm:block mt-0.5"
                style={{ letterSpacing: '0.01em' }}
              >
                {greeting}, {user?.firstName}👋
              </p>
            </div>

            <div
              className="flex items-center gap-2 px-3 py-1.5 rounded-full"
              style={{ background: '#f0fdf4', border: '1px solid #bbf7d0' }}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-xs text-emerald-700 font-medium">
                System Online
              </span>
            </div>
          </header>

          {/* ── Main content ── */}
          <main className="flex-1 p-6 pt-26">
            {/* Loading */}
            {loadingAppointment && (
              <div className="flex flex-col items-center justify-center py-32 gap-5">
                <div
                  className="w-12 h-12 rounded-full"
                  style={{
                    border: '3px solid #e0e7ff',
                    borderTopColor: '#6366f1',
                    animation: 'spin 0.8s linear infinite',
                  }}
                />
                <p className="text-sm text-gray-400 font-medium">
                  Loading your visit...
                </p>
              </div>
            )}

            {/* No appointment */}
            {!loadingAppointment && !activeAppointment && (
              <NoAppointmentPage
                firstName={user?.firstName}
                onStartConsultation={() => nav('/patient/intake')}
              />
            )}

            {/* ── Active appointment ── */}
            {!loadingAppointment && activeAppointment && (
              <div className="max-w-4xl mx-auto space-y-4">
                {/* Page heading */}
                <div className="slide-up">
                  <p className="text-xs font-semibold uppercase tracking-widest text-indigo-400 mb-1">
                    Active Visit
                  </p>
                  <h2
                    className="font-sans font-bold text-3xl text-gray-900"
                    style={{ letterSpacing: '-0.02em' }}
                  >
                    your Consultation
                  </h2>
                </div>

                {/* ── Appointment card ── */}
                <div
                  className={`slide-up card-hover border-2 bg-linear-to-br ${sevConfig.bg} ${sevConfig.border} rounded-2xl overflow-hidden cursor-pointer`}
                  onClick={() =>
                    nav(`/patient/appointment/${activeAppointment.token}`)
                  }
                >
                  {/* Top section */}
                  <div className="p-6 pb-4">
                    {/* Doctor row */}
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center gap-3.5">
                        <div className="avatar-ring shrink-0">
                          <div className="avatar-inner w-12 h-12 flex items-center justify-center text-white font-bold text-base">
                            {activeAppointment.doctorId?.firstName?.[0]}
                            {activeAppointment.doctorId?.lastName?.[0]}
                          </div>
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 text-base leading-tight">
                            Dr. {activeAppointment.doctorId?.firstName}{' '}
                            {activeAppointment.doctorId?.lastName}
                          </h3>
                          <p className="text-sm text-gray-500 mt-0.5">
                            {activeAppointment.doctorId?.department}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${sevConfig.badge}`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${sevConfig.dot}`}
                        />
                        {severity}
                      </span>
                    </div>

                    {/* Token + Status grid */}
                    <div className="grid grid-cols-2 gap-3">
                      {/* Token number */}
                      <div
                        className="token-glow bg-white rounded-2xl p-4 flex flex-col gap-1"
                        style={{ border: '1.5px solid rgba(99,102,241,0.15)' }}
                      >
                        <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">
                          Token
                        </p>
                        <p
                          className="font-bold tracking-widest leading-none"
                          style={{ fontSize: '2rem', color: '#4338ca' }}
                        >
                          {activeAppointment.token}
                        </p>
                      </div>

                      {/* Status */}
                      <div
                        className="bg-white rounded-2xl p-4 flex flex-col gap-1"
                        style={{ border: '1.5px solid rgba(0,0,0,0.06)' }}
                      >
                        <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">
                          Current Status
                        </p>
                        <span
                          className={`inline-flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-xs font-bold w-fit mt-0.5 ${statusCfg.color}`}
                        >
                          <StatusDot status={status} />
                          {statusCfg.label}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* CTA footer */}
                  <div
                    className="px-6 py-3.5 flex items-center justify-between"
                    style={{
                      background: 'rgba(255,255,255,0.5)',
                      borderTop: '1px solid rgba(0,0,0,0.06)',
                    }}
                  >
                    <p className="text-xs text-gray-400">
                      Tap to view full details
                    </p>
                    <span
                      className="flex items-center gap-1.5 text-sm font-semibold"
                      style={{ color: '#6366f1' }}
                    >
                      View details
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
                          d="M13 7l5 5m0 0l-5 5m5-5H6"
                        />
                      </svg>
                    </span>
                  </div>
                </div>

                {/* ── While you wait ── */}
                <div
                  className="slide-up rounded-2xl overflow-hidden"
                  style={{ background: 'white', border: '1.5px solid #e8edf2' }}
                >
                  <div
                    className="px-5 py-4 dot-pattern"
                    style={{ borderBottom: '1px solid #f1f5f9' }}
                  >
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
                      While you wait
                    </p>
                  </div>
                  <div className="divide-y divide-gray-50">
                    {TIPS.map((tip) => (
                      <div
                        key={tip.text}
                        className="tip-card flex items-start gap-3.5 px-5 py-2"
                      >
                        <span className="text-lg shrink-0 mt-0.5">
                          {tip.icon}
                        </span>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {tip.text}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </>
  );
}
