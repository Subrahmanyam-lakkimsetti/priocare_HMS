import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../../features/auth/authThunks';
import { useState } from 'react';

const NAV_ITEMS = [
  { key: 'home', label: 'Dashboard', path: '/patient' },
  { key: 'appointments', label: 'Appointments', path: '/patient/appointments' },
  { key: 'records', label: 'Medical Records', path: '/patient/records' },
  { key: 'profile', label: 'Profile', path: '/patient/profile' },
];

export default function PatientSidebar({ sidebarOpen, setSidebarOpen }) {
  const nav = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const user = useSelector((s) => s.auth?.user);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    nav('/', { replace: true });
    setShowLogoutModal(false);
  };

  const activeKey =
    location.pathname === '/patient'
      ? 'home'
      : NAV_ITEMS.find(
          (n) => location.pathname.startsWith(n.path) && n.path !== '/patient',
        )?.key || 'home';

  return (
    <>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowLogoutModal(false)}
          />

          {/* Modal */}
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-6 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Logout Confirmation
                </h3>
                <p className="text-sm text-gray-500">
                  Are you sure you want to logout?
                </p>
              </div>
            </div>

            {/* User Info */}
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  {user?.firstName?.[0]}
                  {user?.lastName?.[0]}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 rounded-xl text-sm font-medium text-white transition-colors flex items-center justify-center gap-2"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      <aside
        className={`fixed top-0 left-0 h-screen w-64 bg-white border-r border-gray-100 z-30 flex flex-col
  transform transition-transform duration-300 ease-in-out
  ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
  lg:translate-x-0`}
      >
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-6 py-5 border-b border-gray-100">
          <div className="w-8 h-8 bg-blue-700 rounded-lg flex items-center justify-center" />
          <span className="text-blue-900 text-xl font-bold tracking-tight">
            Prio<span className="text-cyan-600">Care</span>
          </span>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-2">
            Menu
          </p>

          {NAV_ITEMS.map((item) => {
            const isActive = activeKey === item.key;

            return (
              <button
                key={item.key}
                onClick={() => {
                  nav(item.path);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* User Section */}
        <div className="px-3 py-4 border-t border-gray-100">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors">
            <div className="w-8 h-8 bg-linear-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
              {user?.firstName?.[0]}
              {user?.lastName?.[0]}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800 truncate">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-gray-400 truncate">{user?.email}</p>
            </div>

            <button
              onClick={() => setShowLogoutModal(true)}
              className="p-2 rounded-lg hover:bg-red-50 transition-colors group"
              title="Logout"
            >
              <svg
                className="w-4 h-4 text-gray-400 group-hover:text-red-600 transition-colors"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
