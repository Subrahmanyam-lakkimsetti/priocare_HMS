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

  return (
    <div className="min-h-screen bg-gray-50 flex overflow-hidden">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-20 lg:hidden"
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

      {/* Main Workspace — offset by sidebar width on desktop */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden lg:ml-64">
        {/* Mobile Topbar */}
        <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center gap-4 lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100"
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
          <h1 className="text-lg font-semibold text-gray-900">Doctor Portal</h1>
        </header>

        {/* Routes */}
        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route index element={<DoctorDashboard />} />
            <Route path="consultation" element={<ConsultationRoom />} />
            <Route path="patients" element={<PatientHistory />} />
            <Route path="profile" element={<DoctorProfile />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
