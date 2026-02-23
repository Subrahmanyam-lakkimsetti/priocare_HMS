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
    bg: 'bg-red-50',
    border: 'border-red-200',
    badge: 'bg-red-100 text-red-700',
    dot: 'bg-red-500',
  },
  High: {
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    badge: 'bg-orange-100 text-orange-700',
    dot: 'bg-orange-500',
  },
  Medium: {
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    badge: 'bg-yellow-100 text-yellow-700',
    dot: 'bg-yellow-500',
  },
  Low: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    badge: 'bg-green-100 text-green-700',
    dot: 'bg-green-500',
  },
};

const STATUS_CONFIG = {
  waiting: { label: 'Waiting', color: 'bg-yellow-100 text-yellow-700' },
  'in-progress': { label: 'In Progress', color: 'bg-blue-100 text-blue-700' },
  completed: { label: 'Completed', color: 'bg-green-100 text-green-700' },
};

export default function PatientHome() {
  const dispatch = useDispatch();
  const nav = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { activeAppointment, loadingAppointment } = useSelector(
    (s) => s.patient,
  );
  // Mock user — replace with real selector
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
  const statusCfg = STATUS_CONFIG[activeAppointment?.status] || {
    label: activeAppointment?.status,
    color: 'bg-gray-100 text-gray-600',
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center gap-4 sticky top-0 z-10">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
          >
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
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-semibold text-gray-900">Dashboard</h1>
            <p className="text-xs text-gray-400 hidden sm:block">
              Welcome back, {user?.firstName}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            <span className="text-xs text-gray-500 font-medium">
              System Online
            </span>
          </div>
        </header>

        {/* Page body */}
        <main className="flex-1 p-6">
          {/* Loading */}
          {loadingAppointment && (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
              <p className="text-gray-500 text-sm">Loading your visit...</p>
            </div>
          )}

          {/* No appointment — CTA */}
          {!loadingAppointment && !activeAppointment && (
            <NoAppointmentPage
              firstName={user?.firstName}
              onStartConsultation={() => nav('/patient/intake')}
            />
          )}

          {/* Active appointment */}
          {!loadingAppointment && activeAppointment && (
            <div className="max-w-2xl mx-auto">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Your Active Consultation
                </h2>
                <p className="text-gray-500 mt-1 text-sm">
                  Click the card below to view full appointment details.
                </p>
              </div>

              {/* Appointment card */}
              <div
                onClick={() =>
                  nav(`/patient/appointment/${activeAppointment.token}`)
                }
                className={`border-2 ${sevConfig.border} ${sevConfig.bg} rounded-2xl p-6 cursor-pointer hover:shadow-lg transition-all duration-200 group mb-6`}
              >
                {/* Header row */}
                <div className="flex items-start justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-700 rounded-xl flex items-center justify-center text-white font-bold text-lg shrink-0">
                      {activeAppointment.doctorId?.firstName?.[0]}
                      {activeAppointment.doctorId?.lastName?.[0]}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-base">
                        Dr. {activeAppointment.doctorId?.firstName}{' '}
                        {activeAppointment.doctorId?.lastName}
                      </h3>
                      <p className="text-gray-500 text-sm">
                        {activeAppointment.doctorId?.department}
                      </p>
                    </div>
                  </div>
                  {/* Severity badge */}
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${sevConfig.badge}`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${sevConfig.dot}`}
                    />
                    {severity}
                  </span>
                </div>

                {/* Info grid */}
                <div className="grid grid-cols-2 gap-3 mb-5">
                  <div className="bg-white/70 rounded-xl p-3">
                    <p className="text-xs text-gray-400 font-medium mb-0.5">
                      Token Number
                    </p>
                    <p className="text-gray-900 font-bold text-lg tracking-wide">
                      {activeAppointment.token}
                    </p>
                  </div>
                  <div className="bg-white/70 rounded-xl p-3">
                    <p className="text-xs text-gray-400 font-medium mb-1">
                      Status
                    </p>
                    <span
                      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold ${statusCfg.color}`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
                      {statusCfg.label}
                    </span>
                  </div>
                </div>

                {/* CTA row */}
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-400">
                    Tap to view full appointment details
                  </p>
                  <span className="text-blue-600 font-semibold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                    View details
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
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

              {/* Quick info banner */}
              <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 flex items-center gap-3">
                <svg
                  className="w-5 h-5 text-blue-500 shrink-0"
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
                <p className="text-blue-700 text-sm">
                  Please remain available. Your doctor will call your token
                  number when ready.
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
