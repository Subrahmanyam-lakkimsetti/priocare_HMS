import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../../features/auth/authThunks';

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
    <>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
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
              onClick={handleLogout}
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
