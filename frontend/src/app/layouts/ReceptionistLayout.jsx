import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { logoutUser } from '../../features/auth/authThunks';

import ReceptionSidebar from '../../features/receptionist/components/ReceptionSidebar';
import ReceptionDashboard from '../../features/receptionist/pages/ReceptionDashboard';
import PatientCheckIn from '../../features/receptionist/pages/PatientCheckIn';
import TodayAppointments from '../../features/receptionist/pages/TodayAppointments';
import QueueStatus from '../../features/receptionist/pages/QueueStatus';
import TokenSearch from '../../features/receptionist/pages/TokenSearch';
import ConfirmDialog from '../../features/receptionist/components/Confirmdialog';

const NAV_ITEMS = [
  { key: 'dashboard', label: 'Dashboard', path: '/receptionist' },
  { key: 'checkin', label: 'Patient Check-In', path: '/receptionist/checkin' },
  {
    key: 'appointments',
    label: "Today's Appointments",
    path: '/receptionist/appointments',
  },
  { key: 'queue', label: 'Queue Status', path: '/receptionist/queue' },
  { key: 'search', label: 'Token Search', path: '/receptionist/search' },
];

const PAGE_TITLES = {
  dashboard: 'Dashboard',
  checkin: 'Patient Check-In',
  appointments: "Today's Appointments",
  queue: 'Queue Status',
  search: 'Token Search',
};

export default function ReceptionistLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const nav = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const user = useSelector((s) => s.auth?.user);

  const handleLogout = async () => {
    setShowLogoutConfirm(false);
    await dispatch(logoutUser());
    nav('/', { replace: true });
  };

  const activeKey =
    location.pathname === '/receptionist'
      ? 'dashboard'
      : NAV_ITEMS.find(
          (n) =>
            location.pathname.startsWith(n.path) && n.path !== '/receptionist',
        )?.key || 'dashboard';

  const currentDate = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <>
      <style>{`
        .rl-root {
          min-height: 100vh;
          background: #f1f5f9;
          display: flex;
          overflow: hidden;
          font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }

        /* ── Overlay ── */
        .rl-overlay {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.3);
          z-index: 40;
          display: none;
        }
        .rl-overlay.open { display: block; }

        /* ── Main content area with fixed header ── */
        .rl-body {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-width: 0;
          margin-left: 260px;
          height: 100vh;
          overflow: hidden;
        }

        /* ── Fixed Desktop Header ── */
        .rl-desktop-header {
          height: 64px;
          background: #ffffff;
          border-bottom: 1px solid #e2e8f0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 24px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.02);
          flex-shrink: 0;
        }

        .rl-header-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .rl-header-logo {
          font-weight: 800;
          font-size: 18px;
          color: #2563eb;
          letter-spacing: -0.5px;
          background: linear-gradient(135deg, #2563eb, #7c3aed);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .rl-header-divider {
          width: 1px;
          height: 24px;
          background: #e2e8f0;
        }

        .rl-header-page {
          font-size: 14px;
          font-weight: 600;
          color: #475569;
        }

        .rl-header-page span {
          color: #94a3b8;
          font-weight: 400;
          margin-right: 6px;
        }

        .rl-header-right {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .rl-header-date {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          background: #f8fafc;
          border-radius: 30px;
          border: 1px solid #e2e8f0;
          font-size: 12px;
          color: #475569;
          font-weight: 500;
        }

        .rl-header-date svg {
          width: 14px;
          height: 14px;
          stroke: #64748b;
        }

        .rl-header-user {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 4px 12px 4px 6px;
          background: #f8fafc;
          border-radius: 30px;
          border: 1px solid #e2e8f0;
          cursor: pointer;
          transition: all 0.15s;
        }
        .rl-header-user:hover {
          background: #f1f5f9;
          border-color: #cbd5e1;
        }

        .rl-header-avatar {
          width: 30px;
          height: 30px;
          border-radius: 30px;
          background: linear-gradient(135deg, #2563eb, #7c3aed);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 700;
          color: white;
        }

        .rl-header-name {
          font-size: 13px;
          font-weight: 600;
          color: #1e293b;
        }

        .rl-header-chevron {
          width: 14px;
          height: 14px;
          stroke: #94a3b8;
          margin-left: 4px;
        }

        /* ── User dropdown ── */
        .rl-user-dropdown {
          position: absolute;
          top: 52px;
          right: 24px;
          background: white;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 8px 20px rgba(0,0,0,0.08);
          width: 180px;
          z-index: 50;
          overflow: hidden;
        }

        .rl-dropdown-item {
          padding: 10px 16px;
          font-size: 13px;
          color: #1e293b;
          cursor: pointer;
          transition: background 0.1s;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .rl-dropdown-item:hover {
          background: #f8fafc;
        }
        .rl-dropdown-item.logout {
          color: #ef4444;
          border-top: 1px solid #f1f5f9;
        }
        .rl-dropdown-item svg {
          width: 14px;
          height: 14px;
        }

        /* ── Scrollable content area ── */
        .rl-main {
          flex: 1;
          overflow-y: auto;
          scrollbar-width: thin;
          scrollbar-color: #cbd5e1 transparent;
        }
        .rl-main::-webkit-scrollbar { width: 5px; }
        .rl-main::-webkit-scrollbar-track { background: transparent; }
        .rl-main::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }

        /* ── Mobile top bar (hidden on desktop) ── */
        .rl-topbar {
          display: none;
          position: sticky;
          top: 0;
          z-index: 30;
          background: #ffffff;
          border-bottom: 1px solid #e2e8f0;
          padding: 0 16px;
          height: 56px;
          align-items: center;
          justify-content: space-between;
          box-shadow: 0 1px 8px rgba(15,23,42,0.06);
        }
        .rl-topbar-left { display: flex; align-items: center; gap: 12px; }
        .rl-topbar-title { font-size: 15px; font-weight: 700; color: #0f172a; }
        .rl-topbar-page { font-size: 13px; color: #64748b; font-weight: 500; }

        .rl-menu-btn {
          width: 36px; height: 36px;
          border-radius: 10px;
          border: 1px solid #e2e8f0;
          background: #f8fafc;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: background 0.15s, border-color 0.15s;
          flex-shrink: 0;
        }
        .rl-menu-btn:hover { background: #eff6ff; border-color: #bfdbfe; }
        .rl-menu-btn svg { width: 16px; height: 16px; stroke: #475569; stroke-width: 2; }

        .rl-user-chip {
          display: flex; align-items: center; gap: 8px;
          padding: 4px 10px 4px 4px;
          border-radius: 20px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
        }
        .rl-user-avatar {
          width: 28px; height: 28px; border-radius: 50%;
          background: linear-gradient(135deg, #2563eb, #7c3aed);
          display: flex; align-items: center; justify-content: center;
          font-size: 11px; font-weight: 700; color: white;
        }
        .rl-user-name { font-size: 12px; font-weight: 600; color: #334155; }

        /* ── Responsive ── */
        @media (max-width: 1023px) {
          .rl-body { margin-left: 0; }
          .rl-desktop-header { display: none; }
          .rl-topbar { display: flex; }
        }
      `}</style>

      <div className="rl-root">
        {/* Mobile overlay */}
        <div
          className={`rl-overlay ${sidebarOpen ? 'open' : ''}`}
          onClick={() => setSidebarOpen(false)}
        />

        {/* Sidebar */}
        <ReceptionSidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          activeKey={activeKey}
          navItems={NAV_ITEMS}
          user={user}
          onLogoutClick={() => setShowLogoutConfirm(true)}
        />

        {/* Main body with fixed header */}
        <div className="rl-body">
          {/* Desktop Fixed Header */}
          <header className="rl-desktop-header">
            <div className="rl-header-left">
              <div className="rl-header-divider" />
              <div className="rl-header-page">
                <span>Page /</span> {PAGE_TITLES[activeKey]}
              </div>
            </div>

            <div className="rl-header-right">
              <div className="rl-header-date">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                {currentDate}
              </div>
            </div>
          </header>

          {/* Mobile top bar */}
          <header className="rl-topbar">
            <div className="rl-topbar-left">
              <button
                className="rl-menu-btn"
                onClick={() => setSidebarOpen(true)}
              >
                <svg viewBox="0 0 24 24" fill="none">
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              </button>
              <div>
                <p className="rl-topbar-title">PrioCare HMS</p>
                <p className="rl-topbar-page">{PAGE_TITLES[activeKey]}</p>
              </div>
            </div>
            <div className="rl-user-chip">
              <div className="rl-user-avatar">
                {(user?.firstName?.[0] || 'R').toUpperCase()}
              </div>
              <span className="rl-user-name">
                {user?.firstName || 'Reception'}
              </span>
            </div>
          </header>

          {/* Scrollable page content */}
          <main className="rl-main">
            <Routes>
              <Route index element={<ReceptionDashboard />} />
              <Route path="checkin" element={<PatientCheckIn />} />
              <Route path="appointments" element={<TodayAppointments />} />
              <Route path="queue" element={<QueueStatus />} />
              <Route path="search" element={<TokenSearch />} />
            </Routes>
          </main>
        </div>
      </div>

      <ConfirmDialog
        isOpen={showLogoutConfirm}
        title="Sign out?"
        message="You'll be logged out of the Reception Portal. Any unsaved work will be lost."
        confirmLabel="Yes, Sign Out"
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutConfirm(false)}
      />
    </>
  );
}