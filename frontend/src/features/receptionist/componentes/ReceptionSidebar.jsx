import { useNavigate } from 'react-router-dom';

const NAV_ICONS = {
  dashboard: (
    <svg
      width="17"
      height="17"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.8}
    >
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  ),
  checkin: (
    <svg
      width="17"
      height="17"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.8}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 11l3 3L22 4" />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"
      />
    </svg>
  ),
  appointments: (
    <svg
      width="17"
      height="17"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.8}
    >
      <rect
        x="3"
        y="4"
        width="18"
        height="18"
        rx="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16 2v4M8 2v4M3 10h18"
      />
    </svg>
  ),
  queue: (
    <svg
      width="17"
      height="17"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.8}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"
      />
      <circle cx="9" cy="7" r="4" />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"
      />
    </svg>
  ),
  search: (
    <svg
      width="17"
      height="17"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.8}
    >
      <circle cx="11" cy="11" r="8" />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 21l-4.35-4.35"
      />
    </svg>
  ),
};

export default function ReceptionSidebar({
  sidebarOpen,
  setSidebarOpen,
  activeKey,
  navItems,
  user,
  onLogoutClick,
}) {
  const navigate = useNavigate();

  return (
    <aside
      className={`
        fixed top-0 left-0 h-full w-65
        bg-white border-r border-slate-200
        flex flex-col z-30
        transition-transform duration-280 ease-in-out
        font-sans
        max-lg:-translate-x-full
        ${sidebarOpen ? 'max-lg:translate-x-0' : ''}
      `}
    >
      {/* Logo */}
      <div className="px-5 pt-6 pb-5 border-b border-slate-100 flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-[10px] bg-blue-600 flex items-center justify-center shrink-0 shadow-[0_2px_8px_rgba(37,99,235,0.3)]">
          <svg
            width="18"
            height="18"
            fill="none"
            viewBox="0 0 24 24"
            stroke="white"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16M3 21h18M9 7h1m-1 4h1m4-4h1m-1 4h1"
            />
          </svg>
        </div>
        <div>
          <p className="text-[14px] font-bold text-slate-900">PrioCare HMS</p>
          <p className="text-[11px] text-slate-400 mt-px">Reception Portal</p>
        </div>
      </div>

      {/* User */}
      <div className="px-5 py-3.5 border-b border-slate-100 flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center text-[12px] font-bold text-blue-600 shrink-0">
          {user?.firstName?.[0]?.toUpperCase() || 'R'}
        </div>
        <div className="min-w-0">
          <p className="text-[13px] font-semibold text-slate-900 truncate">
            {user?.firstName} {user?.lastName}
          </p>
          <p className="text-[11px] text-slate-400 capitalize">
            {user?.role || 'Receptionist'}
          </p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2.5 py-3 overflow-y-auto">
        <p className="text-[10px] font-semibold tracking-[0.08em] uppercase text-slate-300 px-2.5 pb-2 pt-1">
          Menu
        </p>
        {navItems.map((item) => (
          <button
            key={item.key}
            onClick={() => {
              navigate(item.path);
              setSidebarOpen(false);
            }}
            className={`
              w-full flex items-center gap-2.5
              px-3 py-2.25 rounded-[10px]
              text-[13px] font-medium
              cursor-pointer border-none text-left
              transition-colors duration-150
              mb-0.5
              ${
                activeKey === item.key
                  ? 'bg-blue-50 text-blue-600 font-semibold [&_svg]:stroke-blue-600'
                  : 'bg-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }
            `}
          >
            {NAV_ICONS[item.key]}
            {item.label}
          </button>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-2.5 border-t border-slate-100">
        <button
          onClick={onLogoutClick}
          className="w-full flex items-center gap-2.5 px-3 py-2.25 rounded-[10px] text-[13px] font-medium cursor-pointer border-none bg-transparent text-slate-400 transition-colors duration-150 hover:bg-red-50 hover:text-red-500"
        >
          <svg
            width="16"
            height="16"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.8}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"
            />
          </svg>
          Sign Out
        </button>
      </div>
    </aside>
  );
}