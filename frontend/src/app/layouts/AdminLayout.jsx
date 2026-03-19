import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { logoutUser } from '../../features/auth/authThunks';

import AdminSidebar from '../../features/admin/components/AdminSidebar';
import AdminDashboard from '../../features/admin/pages/AdminDashboard';
import StaffManagement from '../../features/admin/pages/StaffManagement';
import PatientsPage from '../../features/admin/pages/PatientsPage';
import AppointmentsPage from '../../features/admin/pages/AppointmentsPage';

const NAV_META = {
  dashboard: { title: 'Dashboard', sub: 'Hospital overview & live stats' },
  staff: { title: 'Staff Management', sub: 'Doctors & receptionists' },
  patients: { title: 'Patient Records', sub: 'All patient data & history' },
  appointments: { title: 'Appointments', sub: 'By department & status' },
};

export default function AdminLayout() {
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
    location.pathname === '/admin'
      ? 'dashboard'
      : location.pathname.includes('/admin/staff')
        ? 'staff'
        : location.pathname.includes('/admin/patients')
          ? 'patients'
          : location.pathname.includes('/admin/appointments')
            ? 'appointments'
            : 'dashboard';

  const meta = NAV_META[activeKey];
  const initials =
    [user?.firstName?.[0], user?.lastName?.[0]].filter(Boolean).join('') ||
    'AD';

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700;9..40,800&display=swap');
        @keyframes livepulse {
          0%, 100% { box-shadow: 0 0 0 3px rgba(34,197,94,.18); }
          50% { box-shadow: 0 0 0 6px rgba(34,197,94,.06); }
        }
      `}</style>

      <div
        className="min-h-screen bg-slate-100 flex overflow-hidden w-full"
        style={{ fontFamily: "'DM Sans', -apple-system, sans-serif" }}
      >
        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-slate-900/40 z-20 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <AdminSidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          activeKey={activeKey}
          user={user}
          onLogout={handleLogout}
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden lg:ml-64">
          {/* Desktop Topbar */}
          <header className="hidden lg:flex items-center justify-between gap-4 bg-white border-b border-slate-200 px-8 h-15 shrink-0 fixed top-0 left-64 right-0 z-30 shadow-sm">
            <div className="flex items-center gap-3">
              <button
                onClick={() => nav('/admin')}
                className="text-xs font-semibold text-slate-400 hover:text-blue-600 flex items-center gap-1 transition-colors"
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
              </button>
              <span className="text-slate-300">/</span>
              <span className="text-sm font-bold text-slate-900">
                {meta.title}
              </span>
              <div className="w-px h-5 bg-slate-200" />
              <span className="text-xs text-slate-400">{meta.sub}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 bg-green-50 border border-green-200 rounded-full px-3 py-1 text-xs font-bold text-green-600">
                <span
                  className="w-1.5 h-1.5 rounded-full bg-green-400"
                  style={{ animation: 'livepulse 2s infinite' }}
                />
                System Live
              </div>
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-full pl-1 pr-3 py-1">
                <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold text-white">
                  {initials}
                </div>
                <span className="text-xs font-semibold text-slate-700">
                  {[user?.firstName, user?.lastName]
                    .filter(Boolean)
                    .join(' ') || 'Admin'}
                </span>
              </div>
            </div>
          </header>

          {/* Mobile Topbar */}
          <header className="lg:hidden bg-white border-b border-slate-200 px-4 h-14 flex items-center gap-3 shrink-0 fixed top-0 left-0 right-0 z-30 shadow-sm">
            <button
              onClick={() => setSidebarOpen(true)}
              className="w-9 h-9 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center text-blue-600"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
              >
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
            <span className="text-base font-extrabold text-slate-900 flex-1">
              {meta.title}
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-xs font-extrabold text-white">
              {initials}
            </div>
          </header>

          {/* Routes */}
          <main className="flex-1 overflow-y-auto pt-15 max-lg:pt-14">
            <Routes>
              <Route index element={<AdminDashboard />} />
              <Route path="staff" element={<StaffManagement />} />
              <Route path="patients" element={<PatientsPage />} />
              <Route path="appointments" element={<AppointmentsPage />} />
            </Routes>
          </main>
        </div>
      </div>
    </>
  );
}