import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const NAV_ICONS = {
  dashboard: (
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
        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
      />
    </svg>
  ),
  consultation: (
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
        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
      />
    </svg>
  ),
  patients: (
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
        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
      />
    </svg>
  ),
  profile: (
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
        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
      />
    </svg>
  ),
};

export default function DoctorSidebar({
  sidebarOpen,
  setSidebarOpen,
  activeKey,
  navItems,
  user,
  onLogout,
}) {
  const nav = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogoutConfirm = () => {
    setShowLogoutModal(false);
    onLogout();
  };

  return (
    <>
      <style>{`
        .sb-font { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }

        .sb-logo-tag {
          font-size: 9.5px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #94a3b8;
        }
        .sb-logo-icon-wrap {
          box-shadow: 0 2px 8px rgba(37,99,235,0.28);
        }

        .sb-user-chip {
          margin: 12px 12px 4px;
          background: #f8fafc;
          border: 1px solid #f1f5f9;
          border-radius: 12px;
          padding: 10px 12px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .sb-avatar {
          width: 30px; height: 30px;
          border-radius: 50%;
          background: #eff6ff;
          border: 1.5px solid #bfdbfe;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          font-size: 12px;
          font-weight: 700;
          color: #2563eb;
        }
        .sb-user-name {
          font-size: 12.5px;
          font-weight: 600;
          color: #0f172a;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .sb-user-role {
          font-size: 11px;
          color: #94a3b8;
          margin-top: 1px;
        }

        .sb-nav-btn-base {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 9px 12px;
          border-radius: 10px;
          border: none;
          cursor: pointer;
          font-size: 13.5px;
          font-weight: 500;
          text-align: left;
          transition: background 0.15s, color 0.15s;
          position: relative;
          background: transparent;
          color: #64748b;
        }
        .sb-nav-btn-base:hover { background: #f8fafc; color: #0f172a; }
        .sb-nav-btn-base:hover .sb-nav-icon-box { background: #f1f5f9; }

        .sb-nav-btn-active {
          background: #eff6ff !important;
          color: #2563eb !important;
          font-weight: 600;
        }
        .sb-nav-btn-active .sb-nav-icon-box { background: #dbeafe !important; }

        .sb-nav-icon-box {
          width: 28px; height: 28px;
          border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          transition: background 0.15s;
        }

        .sb-active-dot {
          position: absolute;
          right: 12px;
          width: 5px; height: 5px;
          border-radius: 50%;
          background: #2563eb;
          opacity: 0.5;
        }

        .sb-logout-btn {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 9px 12px;
          border-radius: 10px;
          border: none;
          background: transparent;
          cursor: pointer;
          font-size: 13.5px;
          font-weight: 500;
          color: #94a3b8;
          transition: background 0.15s, color 0.15s;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }
        .sb-logout-btn:hover { background: #fff1f2; color: #dc2626; }
        .sb-logout-btn:hover .sb-logout-icon-box { background: #fee2e2; }

        .sb-logout-icon-box {
          width: 28px; height: 28px;
          border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          transition: background 0.15s;
        }

        .logout-overlay {
          position: fixed;
          inset: 0;
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          animation: overlay-in 0.2s ease;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }
        @keyframes overlay-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .logout-backdrop {
          position: absolute;
          inset: 0;
          background: rgba(15,23,42,0.45);
          backdrop-filter: blur(4px);
        }
        .logout-modal {
          position: relative;
          z-index: 1;
          background: #ffffff;
          border-radius: 20px;
          padding: 32px 28px 28px;
          width: 100%;
          max-width: 380px;
          box-shadow: 0 20px 60px rgba(15,23,42,0.18);
          animation: modal-in 0.25s cubic-bezier(.22,1,.36,1);
        }
        @keyframes modal-in {
          from { opacity: 0; transform: scale(0.94) translateY(10px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        .logout-modal-icon-wrap {
          width: 52px; height: 52px;
          border-radius: 16px;
          background: #fff1f2;
          border: 1px solid #fecdd3;
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 20px;
        }
        .logout-modal-title {
          font-size: 17px;
          font-weight: 700;
          color: #0f172a;
          text-align: center;
          margin: 0 0 8px;
          letter-spacing: -0.2px;
        }
        .logout-modal-desc {
          font-size: 13px;
          color: #64748b;
          text-align: center;
          line-height: 1.6;
          margin: 0 0 20px;
        }
        .logout-modal-desc strong { color: #0f172a; font-weight: 600; }
        .logout-modal-divider {
          height: 1px;
          background: #f1f5f9;
          margin-bottom: 16px;
        }
        .logout-modal-warning {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          background: #fffbeb;
          border: 1px solid #fde68a;
          border-radius: 10px;
          padding: 10px 14px;
          margin-bottom: 20px;
          font-size: 12px;
          color: #92400e;
          line-height: 1.5;
        }
        .btn-confirm {
          width: 100%;
          padding: 11px;
          border-radius: 12px;
          border: none;
          background: #dc2626;
          color: #ffffff;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.15s, transform 0.15s;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          margin-bottom: 10px;
        }
        .btn-confirm:hover { background: #b91c1c; transform: translateY(-1px); }
        .btn-confirm:active { transform: translateY(0); }
        .btn-cancel {
          width: 100%;
          padding: 11px;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
          background: #ffffff;
          color: #475569;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.15s, border-color 0.15s, color 0.15s;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }
        .btn-cancel:hover { background: #f8fafc; border-color: #cbd5e1; color: #0f172a; }
      `}</style>

      {/* Sidebar */}
      <aside
        className={`
          fixed z-30
          w-64 shrink-0 bg-white border-r border-gray-100 h-screen
          flex flex-col sb-font
          transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 transition-transform duration-200
        `}
      >
        {/* Logo */}
        <div className="px-5 py-5 border-b border-gray-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center shrink-0 sb-logo-icon-wrap">
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </div>
            <div>
              <span className="text-base font-bold text-gray-900 leading-tight block">
                PrioCare
              </span>
              <span className="sb-logo-tag">HMS</span>
            </div>
          </div>

          {/* User chip */}
          {user?.name && (
            <div className="sb-user-chip">
              <div className="sb-avatar">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div style={{ minWidth: 0 }}>
                <div className="sb-user-name">Dr. {user.name}</div>
                <div className="sb-user-role">Physician</div>
              </div>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex flex-col gap-1 px-3 py-4 flex-1">
          <p className="text-xs text-gray-400 font-semibold px-3 mb-2 uppercase tracking-wider">
            Menu
          </p>
          {navItems?.map((item) => {
            const isActive = activeKey === item.key;
            return (
              <button
                key={item.key}
                onClick={() => {
                  nav(item.path);
                  setSidebarOpen(false);
                }}
                className={`sb-nav-btn-base ${isActive ? 'sb-nav-btn-active' : ''}`}
              >
                <span className="sb-nav-icon-box">{NAV_ICONS[item.key]}</span>
                {item.label}
                {isActive && <span className="sb-active-dot" />}
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        {onLogout && (
          <div className="px-3 py-4 border-t border-gray-50">
            <button
              className="sb-logout-btn"
              onClick={() => setShowLogoutModal(true)}
            >
              <span className="sb-logout-icon-box">
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
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
              </span>
              Sign out
            </button>
          </div>
        )}
      </aside>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="logout-overlay">
          <div
            className="logout-backdrop"
            onClick={() => setShowLogoutModal(false)}
          />
          <div className="logout-modal">
            <div className="logout-modal-icon-wrap">
              <svg
                width="22"
                height="22"
                fill="none"
                viewBox="0 0 24 24"
                stroke="#dc2626"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
            </div>

            <h2 className="logout-modal-title">Sign out of CareFlow?</h2>
            <p className="logout-modal-desc">
              You're signed in as <strong>Dr. {user?.name || 'Doctor'}</strong>.
              Any unsaved changes will be lost.
            </p>

            <div className="logout-modal-divider" />

            <div className="logout-modal-warning">
              <svg
                width="14"
                height="14"
                fill="none"
                viewBox="0 0 24 24"
                stroke="#d97706"
                strokeWidth={2}
                style={{ flexShrink: 0, marginTop: 1 }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
                />
              </svg>
              Make sure all active consultations are saved before signing out.
            </div>

            <button className="btn-confirm" onClick={handleLogoutConfirm}>
              <svg
                width="15"
                height="15"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Yes, sign me out
            </button>
            <button
              className="btn-cancel"
              onClick={() => setShowLogoutModal(false)}
            >
              Cancel, stay signed in
            </button>
          </div>
        </div>
      )}
    </>
  );
}
