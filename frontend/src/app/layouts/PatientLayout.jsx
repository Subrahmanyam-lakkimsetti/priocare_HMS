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

  const nav = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const user = useSelector((s) => s.auth?.user);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    nav('/', { replace: true });
  };

  const activeKey =
    location.pathname === '/patient'
      ? 'home'
      : NAV_ITEMS.find(
          (n) => location.pathname.startsWith(n.path) && n.path !== '/patient',
        )?.key || 'home';

  return (
    <div className="min-h-screen bg-gray-50 flex overflow-hidden">
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

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile top bar */}
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

        {/* Internal Routing */}
        <main className="flex-1 overflow-y-auto">
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
