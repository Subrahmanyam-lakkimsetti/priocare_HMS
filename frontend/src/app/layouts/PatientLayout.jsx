import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../../features/auth/authThunks';

import PatientHome from '../../features/patient/pages/PatientHome';
import IntakeFlow from '../../features/patient/pages/IntakeFlow';
import Confirmation from '../../features/patient/pages/Confirmation';
import AppointmentDetails from '../../features/patient/pages/AppointmentDetails';
import PatientSidebar from '../../components/shared/PatientSidebar';
import PatientAppointments from '../../features/patient/pages/PatientAppointments';
import ProfilePage from '../../features/patient/patientProfile/pages/ProfilePage';

const NAV_ITEMS = [
  { key: 'home', label: 'Dashboard', path: '/patient' },
  { key: 'appointments', label: 'Appointments', path: '/patient/appointments' },
  { key: 'records', label: 'Medical Records', path: '/patient/records' },
  { key: 'profile', label: 'Profile', path: '/patient/profile' },
];

export default function PatientLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const location = useLocation();
  const user = useSelector((s) => s.auth?.user);

  const activeKey =
    location.pathname === '/patient'
      ? 'home'
      : NAV_ITEMS.find(
          (n) => location.pathname.startsWith(n.path) && n.path !== '/patient',
        )?.key || 'home';

  return (
    <div className="min-h-screen bg-[#f1f5f9] flex">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <PatientSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Top Bar */}
        <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center gap-4 lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
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

          <h1 className="text-lg font-semibold text-gray-900">
            Patient Portal
          </h1>
        </header>

        {/* Desktop Fixed Header */}
        <header className="hidden lg:flex fixed top-0 left-63 right-0 z-30 bg-white border-b border-gray-100 px-8 h-15 items-center justify-between">
          <p className="text-sm font-medium text-gray-500">
            {NAV_ITEMS.find((n) => n.key === activeKey)?.label ?? 'Dashboard'}
          </p>

          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-xs font-semibold text-blue-600">
                {user?.name?.[0]?.toUpperCase() ?? 'P'}
              </span>
            </div>

            <span className="text-sm text-gray-700">
              {user?.name ?? 'Patient'}
            </span>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto pt-15">
          <Routes>
            <Route index element={<PatientHome />} />
            <Route path="intake" element={<IntakeFlow />} />
            <Route path="confirmation" element={<Confirmation />} />
            <Route path="appointment/:token" element={<AppointmentDetails />} />
            <Route path="appointments" element={<PatientAppointments />} />
            <Route path="profile" element={<ProfilePage />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}