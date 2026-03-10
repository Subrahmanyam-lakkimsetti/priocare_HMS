import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  fetchDashboardStats,
  fetchRecentCheckins,
} from '../receptionistThunks';
import TokenBadge from '../components/Tokenbadge';
import TokenDetailModal from '../components/Tokendetailmodal';

const PAGE_SIZE = 8;

const STAT_CFG = [
  {
    key: 'totalAppointments',
    label: 'Total Appointments',
    accent: '#2563eb',
    iconBg: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
    iconColor: '#ffffff',
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="4" width="18" height="18" rx="2.5" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
  },
  {
    key: 'checkedInPatients',
    label: 'Checked In',
    accent: '#16a34a',
    iconBg: 'linear-gradient(135deg, #16a34a 0%, #22c55e 100%)',
    iconColor: '#ffffff',
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
  },
  {
    key: 'waitingPatients',
    label: 'Waiting',
    accent: '#d97706',
    iconBg: 'linear-gradient(135deg, #d97706 0%, #f59e0b 100%)',
    iconColor: '#ffffff',
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
  {
    key: 'completedConsultations',
    label: 'Completed',
    accent: '#7c3aed',
    iconBg: 'linear-gradient(135deg, #7c3aed 0%, #8b5cf6 100%)',
    iconColor: '#ffffff',
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <polyline points="9 15 11 17 15 13" />
      </svg>
    ),
  },
];

function fmt(d) {
  if (!d) return '—';
  return new Date(d).toLocaleString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: 'short',
  });
}

export default function ReceptionDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { stats, recentCheckins, loading } = useSelector((s) => s.receptionist);
  const user = useSelector((s) => s.auth?.user);
  const [selectedToken, setSelectedToken] = useState(null);
  const [page, setPage] = useState(1);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    dispatch(fetchDashboardStats());
    dispatch(fetchRecentCheckins());
  }, [dispatch]);

  const h = new Date().getHours();
  const greeting =
    h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const totalPages = Math.max(1, Math.ceil(recentCheckins.length / PAGE_SIZE));
  const displayed = recentCheckins.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE,
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700;9..40,800&display=swap');

        @keyframes wave {
          0%,100%{ transform:rotate(0) }
          25%    { transform:rotate(20deg) }
          55%    { transform:rotate(-10deg) }
          75%    { transform:rotate(14deg) }
        }
        @keyframes pulse-dot {
          0%,100%{ box-shadow:0 0 0 3px rgba(34,197,94,.2) }
          50%    { box-shadow:0 0 0 6px rgba(34,197,94,.06) }
        }
        @keyframes shimmer {
          0%  { background-position:200% 0 }
          100%{ background-position:-200% 0 }
        }
        .rd-wave     { display:inline-block; animation:wave 1.8s ease .5s 1; }
        .rd-pulse    { animation:pulse-dot 2s infinite; }
        .rd-shimmer  { background:linear-gradient(90deg,#f1f5f9 25%,#e2e8f0 50%,#f1f5f9 75%); background-size:200% 100%; animation:shimmer 1.4s infinite; }
        .fu          { opacity:0; transform:translateY(10px); transition:opacity .38s ease,transform .38s ease; }
        .fu.on       { opacity:1; transform:translateY(0); }
        .d2          { transition-delay:.12s }
        .d3          { transition-delay:.18s }
        .d4          { transition-delay:.24s }

        /* Table row striping + hover — needs CSS for :nth-child & !important override */
        .rd-tr td               { background:#ffffff; }
        .rd-tr:nth-child(even) td { background:#fafcff; }
        .rd-tr:hover td         { background:#eff6ff !important; cursor:pointer; }

        /* Mobile breakpoint — hides table, shows cards */
        @media(max-width:700px){
          .rd-table-section { display:none; }
          .rd-mob           { display:block !important; }
        }
      `}</style>

      {/* Page wrapper */}
      <div
        className="min-h-screen bg-[#f1f5f9] w-full px-10 pt-8 pb-13 text-[#0f172a] max-[1200px]:px-8 max-[1200px]:pt-7 max-[768px]:px-4 max-[768px]:pt-5 max-[768px]:pb-10"
        style={{ fontFamily: "'DM Sans', -apple-system, sans-serif" }}
      >
        {/* ── Header ── */}
        <div
          className={`fu ${mounted ? 'on' : ''} bg-white border-[1.5px] border-slate-300 rounded-2xl px-8 py-6 mb-6 flex items-center justify-between gap-4 flex-wrap shadow-[0_4px_18px_rgba(15,23,42,.10)] max-[600px]:px-5 max-[600px]:py-4.5`}
        >
          <div>
            <p className="text-[11px] font-semibold tracking-[.07em] uppercase text-slate-400 mb-1.5">
              {today}
            </p>
            <h1 className="text-[22px] font-extrabold text-slate-900 tracking-[-0.4px] leading-[1.2]">
              {greeting}, {user?.firstName || 'Receptionist'}&nbsp;
              <span className="rd-wave">👋</span>
            </h1>
            <p className="text-[13px] text-slate-400 mt-1">
              Here's your reception overview for today.
            </p>
          </div>
          <div className="inline-flex items-center gap-1.5 bg-green-50 border border-green-200 rounded-[20px] px-3.5 py-1.5 text-[11.5px] font-bold text-green-600">
            <span className="rd-pulse w-1.5 h-1.5 rounded-full bg-green-400 shadow-[0_0_0_3px_rgba(34,197,94,.2)]" />
            PrioCare HMS · Live
          </div>
        </div>

        {/* ── Stats Grid ── */}
        <div
          className={`fu d2 ${mounted ? 'on' : ''} grid grid-cols-4 gap-4 mb-7 w-full max-[900px]:grid-cols-2 max-[480px]:grid-cols-2 max-[480px]:gap-2.5`}
        >
          {STAT_CFG.map((cfg) => (
            <div
              key={cfg.key}
              className="bg-white border-[1.5px] border-slate-200 rounded-2xl px-5 py-5.5 pb-4.5 relative overflow-hidden transition-all duration-200 shadow-[0_4px_18px_rgba(15,23,42,.08)] hover:-translate-y-0.75 hover:shadow-[0_12px_28px_rgba(15,23,42,.14)] hover:border-slate-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className="w-11 h-11 rounded-[13px] flex items-center justify-center shrink-0 shadow-[0_4px_12px_rgba(15,23,42,.16)] [&_svg]:w-5 [&_svg]:h-5"
                  style={{ background: cfg.iconBg, color: cfg.iconColor }}
                >
                  {cfg.icon}
                </div>
                <span className="text-[10px] font-bold bg-slate-100 text-slate-500 rounded-[20px] px-2.25 py-1 tracking-[.03em] border border-slate-200">
                  Today
                </span>
              </div>

              {loading.stats ? (
                <div className="rd-shimmer h-9 w-18 rounded-lg mb-2" />
              ) : (
                <p className="text-[36px] font-extrabold tracking-[-1.5px] leading-none text-slate-900 mb-1.5">
                  {stats?.[cfg.key] ?? '—'}
                </p>
              )}
              <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-[.06em]">
                {cfg.label}
              </p>

              {/* Accent bar */}
              <div
                className="absolute bottom-0 left-0 right-0 h-0.75 rounded-b-xs"
                style={{ background: cfg.accent }}
              />
            </div>
          ))}
        </div>

        {/* ── Section label ── */}
        <div
          className={`fu d3 ${mounted ? 'on' : ''} flex items-center justify-between mb-3.5 gap-2.5`}
        >
          <div className="flex items-center gap-2">
            <span className="w-0.75 h-3.5 rounded-sm bg-blue-600 shrink-0" />
            <span className="text-[15px] font-extrabold text-slate-900 tracking-[-0.3px]">
              Recent Check-ins
            </span>
          </div>
          {!loading.checkins && (
            <span className="text-[11.5px] font-bold bg-white text-slate-500 rounded-[20px] px-3 py-1 border-[1.5px] border-slate-200">
              {recentCheckins.length} total
            </span>
          )}
        </div>

        {/* ── Main Table Card ── */}
        <div
          className={`fu d4 ${mounted ? 'on' : ''} bg-white border-[1.5px] border-slate-300 rounded-2xl overflow-hidden shadow-[0_4px_18px_rgba(15,23,42,.10)] w-full`}
        >
          {/* Card bar */}
          <div className="flex items-center justify-between px-7 py-5 border-b border-slate-200 gap-3 flex-wrap bg-white">
            <div>
              <p className="text-sm font-extrabold text-slate-900 tracking-[-0.2px]">
                Recently Checked In
              </p>
              <p className="text-xs text-slate-400 mt-0.75 font-medium">
                Click any token to view full patient details
              </p>
            </div>
            <button
              onClick={() => navigate('/receptionist/checkin')}
              className="inline-flex items-center gap-1.75 px-4.5 py-2.25 rounded-[10px] bg-blue-600 text-white border-none text-[13px] font-bold cursor-pointer whitespace-nowrap shrink-0 shadow-[0_2px_10px_rgba(37,99,235,.28)] transition-all duration-150 hover:bg-blue-700 hover:-translate-y-px hover:shadow-[0_4px_16px_rgba(37,99,235,.38)]"
              style={{ fontFamily: 'inherit' }}
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
              >
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              New Check-in
            </button>
          </div>

          {/* Loading skeleton */}
          {loading.checkins ? (
            <div className="overflow-x-auto w-full">
              <table className="w-full border-collapse table-fixed">
                <colgroup>
                  <col style={{ width: 110 }} />
                  <col style={{ width: '22%' }} />
                  <col style={{ width: '30%' }} />
                  <col style={{ width: 140 }} />
                </colgroup>
                <tbody>
                  {[...Array(5)].map((_, i) => (
                    <tr key={i}>
                      <td className="px-4.5 py-4 first:pl-7">
                        <div
                          className="rd-shimmer h-3.25 rounded-[5px]"
                          style={{ width: 70 }}
                        />
                      </td>
                      <td className="px-4.5 py-4">
                        <div className="rd-shimmer h-3.25 rounded-[5px] w-4/5" />
                      </td>
                      <td className="px-4.5 py-4">
                        <div className="rd-shimmer h-3.25 rounded-[5px] w-3/4" />
                      </td>
                      <td className="px-4.5 py-4 last:pr-7">
                        <div
                          className="rd-shimmer h-3.25 rounded-[5px]"
                          style={{ width: 90 }}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : recentCheckins.length === 0 ? (
            /* Empty state */
            <div className="py-16 px-6 text-center">
              <div className="w-15 h-15 rounded-2xl bg-slate-100 text-[26px] flex items-center justify-center mx-auto mb-3.5 border-[1.5px] border-slate-200">
                🏥
              </div>
              <p className="text-[15px] font-bold text-slate-700 mb-1.5">
                No check-ins yet today
              </p>
              <p className="text-[13px] text-slate-400">
                Checked-in patients will appear here.
              </p>
            </div>
          ) : (
            <>
              {/* Desktop table */}
              <div className="rd-table-section overflow-x-auto w-full">
                <table className="w-full border-collapse table-fixed">
                  <colgroup>
                    <col style={{ width: 110 }} />
                    <col style={{ width: '22%' }} />
                    <col style={{ width: '30%' }} />
                    <col style={{ width: 140 }} />
                  </colgroup>
                  <thead>
                    <tr>
                      {['Token', 'Patient', 'Doctor', 'Checked In'].map(
                        (h, i) => (
                          <th
                            key={h}
                            className="px-4.5 py-2.75 text-[10.5px] font-bold tracking-[.07em] uppercase text-slate-400 bg-slate-50 border-b border-slate-200 text-left whitespace-nowrap first:pl-7 last:pr-7"
                          >
                            {h}
                          </th>
                        ),
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {displayed.map((c) => (
                      <tr className="rd-tr" key={c._id}>
                        <td className="px-4.5 py-3.5 border-b border-slate-100 align-middle pl-7">
                          <TokenBadge
                            token={c.token}
                            onClick={setSelectedToken}
                          />
                        </td>
                        <td className="px-4.5 py-3.5 border-b border-slate-100 align-middle">
                          <p className="text-[13.5px] font-bold text-slate-900 whitespace-nowrap overflow-hidden text-ellipsis">
                            {c.patientId?.firstName ||
                              c.patientDetails?.firstName}{' '}
                            {c.patientId?.lastName ||
                              c.patientDetails?.lastName}
                          </p>
                        </td>
                        <td className="px-4.5 py-3.5 border-b border-slate-100 align-middle">
                          <p className="text-[13px] font-semibold text-slate-700 whitespace-nowrap overflow-hidden text-ellipsis mb-1">
                            Dr.{' '}
                            {c.doctorId?.firstName ||
                              c.doctorDetails?.firstName}{' '}
                            {c.doctorId?.lastName || c.doctorDetails?.lastName}
                          </p>
                          <span className="inline-flex items-center text-[10px] font-bold text-blue-600 bg-blue-50 rounded-md px-2 py-0.5 whitespace-nowrap border border-blue-200">
                            {c.doctorId?.department ||
                              c.doctorDetails?.department}
                          </span>
                        </td>
                        <td className="px-4.5 py-3.5 border-b border-slate-100 align-middle pr-7">
                          <div className="inline-flex items-center gap-1.75">
                            <span className="w-1.25 h-1.25 rounded-full bg-slate-400 shrink-0" />
                            <p className="text-xs text-slate-500 font-medium whitespace-nowrap">
                              {fmt(c.checkedInAt)}
                            </p>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="rd-mob hidden">
                {displayed.map((c) => (
                  <div
                    key={c._id + '-m'}
                    onClick={() => setSelectedToken(c.token)}
                    className="flex items-center gap-3 px-5 py-3.75 border-b border-slate-100 cursor-pointer transition-colors duration-150 last:border-b-0 hover:bg-slate-50"
                  >
                    <TokenBadge token={c.token} onClick={setSelectedToken} />
                    <div className="flex-1 min-w-0">
                      <p className="text-[13.5px] font-bold text-slate-900 mb-0.75">
                        {c.patientId?.firstName || c.patientDetails?.firstName}{' '}
                        {c.patientId?.lastName || c.patientDetails?.lastName}
                      </p>
                      <p className="text-xs text-slate-500 font-medium">
                        Dr.{' '}
                        {c.doctorId?.firstName || c.doctorDetails?.firstName}{' '}
                        {c.doctorId?.lastName || c.doctorDetails?.lastName}
                      </p>
                    </div>
                    <p className="text-[11px] text-slate-400 shrink-0 bg-slate-100 px-2.25 py-1 rounded-[20px] font-semibold">
                      {fmt(c.checkedInAt)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Footer / Pagination */}
              <div className="px-7 py-3.5 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-3 flex-wrap text-xs text-slate-500 font-medium">
                <span>
                  Showing{' '}
                  <strong className="text-slate-700 font-bold">
                    {displayed.length}
                  </strong>{' '}
                  of{' '}
                  <strong className="text-slate-700 font-bold">
                    {recentCheckins.length}
                  </strong>{' '}
                  check-ins
                </span>
                {totalPages > 1 && (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="w-8 h-8 rounded-lg border-[1.5px] border-slate-200 bg-white flex items-center justify-center cursor-pointer text-slate-500 transition-all duration-150 hover:not-disabled:bg-slate-100 hover:not-disabled:border-slate-400 hover:not-disabled:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                      >
                        <polyline points="15 18 9 12 15 6" />
                      </svg>
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (n) => (
                        <button
                          key={n}
                          onClick={() => setPage(n)}
                          className={`min-w-8 h-8 px-1.5 rounded-lg border-[1.5px] text-xs font-bold cursor-pointer flex items-center justify-center transition-all duration-150 ${
                            n === page
                              ? 'bg-blue-600 border-blue-600 text-white shadow-[0_2px_8px_rgba(37,99,235,.28)]'
                              : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-100 hover:border-slate-400 hover:text-slate-900'
                          }`}
                          style={{ fontFamily: 'inherit' }}
                        >
                          {n}
                        </button>
                      ),
                    )}

                    <button
                      onClick={() =>
                        setPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={page === totalPages}
                      className="w-8 h-8 rounded-lg border-[1.5px] border-slate-200 bg-white flex items-center justify-center cursor-pointer text-slate-500 transition-all duration-150 hover:not-disabled:bg-slate-100 hover:not-disabled:border-slate-400 hover:not-disabled:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                      >
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {selectedToken && (
        <TokenDetailModal
          token={selectedToken}
          onClose={() => setSelectedToken(null)}
        />
      )}
    </>
  );
}