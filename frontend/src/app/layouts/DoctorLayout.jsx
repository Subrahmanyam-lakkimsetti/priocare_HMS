import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { logoutUser } from '../../features/auth/authThunks';

import DoctorSidebar from '../../features/doctor/components/DoctorSidebar';
import DoctorDashboard from '../../features/doctor/pages/DoctorDashboard';
import ConsultationRoom from '../../features/doctor/pages/ConsultationRoom';
import PatientHistory from '../../features/doctor/pages/PatientHistory';
import DoctorProfile from '../../features/doctor/pages/DoctorProfile';

const NAV_ITEMS = [
  { key: 'dashboard', label: 'Dashboard', path: '/doctor' },
  {
    key: 'consultation',
    label: 'Consultation Room',
    path: '/doctor/consultation',
  },
  { key: 'patients', label: 'Patient History', path: '/doctor/patients' },
  { key: 'profile', label: 'My Profile', path: '/doctor/profile' },
];

const PAGE_META = {
  dashboard: { title: 'Dashboard', sub: 'Overview of your workspace' },
  consultation: {
    title: 'Consultation Room',
    sub: 'Manage your patient queue',
  },
  patients: {
    title: 'Patient History',
    sub: 'Browse past consultations & records',
  },
  profile: { title: 'My Profile', sub: 'Manage your account & preferences' },
};

export default function DoctorLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const nav = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const user = useSelector((s) => s.auth?.user);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    nav('/', { replace: true });
  };

  const activeKey =
    location.pathname === '/doctor'
      ? 'dashboard'
      : NAV_ITEMS.find(
          (n) => location.pathname.startsWith(n.path) && n.path !== '/doctor',
        )?.key || 'dashboard';

  const meta = PAGE_META[activeKey] || PAGE_META.dashboard;
  const initials =
    [user?.firstName?.[0], user?.lastName?.[0]].filter(Boolean).join('') ||
    'Dr';
  const fullName =
    [user?.firstName, user?.lastName].filter(Boolean).join(' ') || 'Doctor';

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700;9..40,800&display=swap');
        @keyframes livepulse {
          0%, 100% { box-shadow: 0 0 0 3px rgba(34,197,94,.18); }
          50%       { box-shadow: 0 0 0 6px rgba(34,197,94,.06); }
        }
      `}</style>

      <div
        className="min-h-screen bg-slate-100 flex overflow-hidden w-full"
        style={{ fontFamily: "'DM Sans', -apple-system, sans-serif" }}
      >
        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-slate-900/30 z-20 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <DoctorSidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          activeKey={activeKey}
          navItems={NAV_ITEMS}
          user={user}
          onLogout={handleLogout}
        />

        {/* Main workspace */}
        <div className="flex-1 flex flex-col min-w-0 w-full overflow-hidden lg:ml-64">
          {/* Desktop Topbar */}
          <header className="hidden lg:flex items-center justify-between gap-4 bg-white border-b border-slate-200 px-9 h-15.5 shrink-0 shadow-[0_2px_12px_rgba(15,23,42,0.07)] fixed top-0 left-64 right-0 z-30">
            <div className="flex items-center gap-3.5">
              {/* Breadcrumb */}
              <div className="flex items-center gap-2">
                <span
                  onClick={() => nav('/doctor')}
                  className="text-[12px] font-semibold text-slate-400 flex items-center gap-1 cursor-pointer tracking-[0.01em] transition-colors duration-150 hover:text-blue-600"
                >
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                  </svg>
                  Home
                </span>
                <span className="text-slate-300 text-[13px] leading-none">
                  /
                </span>
                <span className="text-[13px] font-bold text-slate-900 tracking-[-0.2px]">
                  {meta.title}
                </span>
              </div>

              {/* Divider */}
              <div className="w-px h-5.5 bg-slate-200 shrink-0" />

              <span className="text-[12px] text-slate-400 font-medium">
                {meta.sub}
              </span>
            </div>

            <div className="flex items-center gap-2.5">
              {/* Live badge */}
              <div className="inline-flex items-center gap-1.5 bg-green-50 border border-green-200 rounded-full px-3.25 py-1.25 text-[11px] font-bold text-green-600 whitespace-nowrap">
                <span
                  className="w-1.5 h-1.5 rounded-full bg-green-400 shrink-0"
                  style={{ animation: 'livepulse 2s infinite' }}
                />
                System Live
              </div>
            </div>
          </header>

          {/* Mobile Topbar */}
          <header className="lg:hidden bg-white border-b border-slate-200 px-5 h-14 flex items-center gap-3 shrink-0 fixed top-0 left-0 right-0 z-30 shadow-[0_2px_8px_rgba(15,23,42,0.06)]">
            <button
              onClick={() => setSidebarOpen(true)}
              className="w-8.5 h-8.5 rounded-[9px] border-[1.5px] border-slate-300 bg-slate-50 flex items-center justify-center cursor-pointer text-blue-600 shrink-0 transition-colors duration-150 hover:bg-blue-50 hover:border-blue-200"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
              >
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>

            <span className="text-[15px] font-extrabold text-slate-900 flex-1 tracking-[-0.3px]">
              {meta.title}
            </span>

            <div className="w-8 h-8 rounded-[9px] bg-blue-600 flex items-center justify-center text-[11px] font-extrabold text-white shrink-0 shadow-[0_2px_8px_rgba(37,99,235,0.3)]">
              {initials}
            </div>
          </header>

          {/* Routes */}
          <main className="flex-1 overflow-y-auto pt-15.5 lg:pt-15.5 max-lg:pt-14 w-full">
            <Routes>
              <Route index element={<DoctorDashboard />} />
              <Route path="consultation" element={<ConsultationRoom />} />
              <Route path="patients" element={<PatientHistory />} />
              <Route path="profile" element={<DoctorProfile />} />
            </Routes>
          </main>
        </div>
      </div>
    </>
  );
}