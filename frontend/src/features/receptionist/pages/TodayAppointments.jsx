import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTodaysAppointments } from '../receptionistThunks';
import TokenBadge from '../components/Tokenbadge';
import TokenDetailModal from '../components/Tokendetailmodal';

const STATUS_TABS = [
  'all',
  'checked_in',
  'completed',
  'scheduled',
  'cancelled',
];

const STATUS_STYLE = {
  checked_in: {
    bg: '#f0fdf4',
    border: '#bbf7d0',
    color: '#16a34a',
    dot: '#22c55e',
    label: 'Checked In',
  },
  completed: {
    bg: '#eff6ff',
    border: '#bfdbfe',
    color: '#2563eb',
    dot: '#3b82f6',
    label: 'Completed',
  },
  scheduled: {
    bg: '#fffbeb',
    border: '#fde68a',
    color: '#d97706',
    dot: '#f59e0b',
    label: 'Scheduled',
  },
  cancelled: {
    bg: '#fff1f2',
    border: '#fecdd3',
    color: '#e11d48',
    dot: '#f43f5e',
    label: 'Cancelled',
  },
};

const TAB_LABELS = {
  all: 'All',
  checked_in: 'Checked In',
  completed: 'Completed',
  scheduled: 'Scheduled',
  cancelled: 'Cancelled',
};

function fmt(d) {
  if (!d) return '—';
  return new Date(d).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function fmtDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
  });
}

export default function TodayAppointments() {
  const dispatch = useDispatch();
  const { appointments, loading } = useSelector((s) => s.receptionist);
  const [activeTab, setActiveTab] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedToken, setSelectedToken] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    dispatch(fetchTodaysAppointments());
  }, [dispatch]);

  const filtered = appointments.filter((a) => {
    const matchTab = activeTab === 'all' || a.status === activeTab;
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      a.token?.toLowerCase().includes(q) ||
      a.patientDetails?.firstName?.toLowerCase().includes(q) ||
      a.patientDetails?.lastName?.toLowerCase().includes(q) ||
      a.doctorDetails?.firstName?.toLowerCase().includes(q) ||
      a.doctorDetails?.department?.toLowerCase().includes(q);
    return matchTab && matchSearch;
  });

  const counts = STATUS_TABS.reduce((acc, t) => {
    acc[t] =
      t === 'all'
        ? appointments.length
        : appointments.filter((a) => a.status === t).length;
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-[#f1f5f9] p-[32px_32px_48px] md:p-[20px_16px_40px] font-['DM_Sans',-apple-system,BlinkMacSystemFont,'Segoe_UI',sans-serif]">
      {/* Page header */}
      <div
        className={`opacity-0 translate-y-3 transition-all duration-400 ease-in-out ${mounted ? 'opacity-100 translate-y-0' : ''} mb-6 pb-5 border-b border-[#e2e8f0] flex items-center justify-between gap-4 flex-wrap`}
      >
        <div>
          <p className="text-[11px] font-semibold tracking-[.07em] uppercase text-[#94a3b8] mb-1">
            Reception Portal
          </p>
          <h1 className="text-[22px] font-extrabold text-[#0f172a] tracking-[-.4px] m-0 mb-0.75">
            Today's Appointments
          </h1>
          <p className="text-[13px] text-[#94a3b8]">
            Click any token to view full patient details
          </p>
        </div>
      </div>

      {/* Main card */}
      <div
        className={`opacity-0 translate-y-3 transition-all duration-400 ease-in-out delay-140 ${mounted ? 'opacity-100 translate-y-0' : ''} bg-white border border-[#e2e8f0] rounded-[18px] overflow-hidden shadow-[0_2px_10px_rgba(15,23,42,.05)]`}
      >
        {/* Toolbar: search + tabs in one unified bar */}
        <div className="flex items-center gap-0 border-b border-[#f1f5f9] md:flex-col md:items-stretch">
          {/* Search */}
          <div className="flex items-center gap-2.5 p-[14px_20px] border-r border-[#f1f5f9] min-w-65 shrink-0 md:border-r-0 md:border-b md:border-[#f1f5f9] md:min-w-0">
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#94a3b8"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              className="flex-1 border-none outline-none bg-transparent text-[13px] text-[#0f172a] font-inherit placeholder:text-[#94a3b8]"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, token, dept…"
            />
            {search && (
              <button
                className="bg-none border-none cursor-pointer p-0 text-[#94a3b8] flex items-center transition-colors duration-150 hover:text-[#475569]"
                onClick={() => setSearch('')}
              >
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
          </div>

          {/* Tabs */}
          <div className="flex items-center p-[10px_16px] gap-1 flex-1 flex-wrap overflow-x-auto scrollbar-none">
            {STATUS_TABS.map((tab) => (
              <button
                key={tab}
                className={`inline-flex items-center gap-1.5 py-1.5 px-3 rounded-lg text-[12.5px] font-semibold border border-transparent cursor-pointer bg-transparent text-[#64748b] transition-all duration-150 whitespace-nowrap shrink-0 hover:bg-[#f8fafc] hover:text-[#334155] hover:border-[#e2e8f0] ${
                  activeTab === tab
                    ? 'bg-[#2563eb]! text-white! border-[#2563eb]! shadow-[0_2px_8px_rgba(37,99,235,.25)]'
                    : ''
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {TAB_LABELS[tab]}
                {counts[tab] > 0 && (
                  <span
                    className={`text-[10px] font-bold min-w-4.5 h-4 rounded-lg px-1 flex items-center justify-center ${
                      activeTab === tab
                        ? 'bg-white/25'
                        : 'bg-black/8 text-inherit'
                    }`}
                  >
                    {counts[tab]}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        {loading.appointments ? (
          <div className="py-1">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="h-13.5 mx-6 rounded-[10px] bg-linear-to-r from-[#f1f5f9] via-[#e2e8f0] to-[#f1f5f9] bg-size-[200%_100%] animate-[ta-shimmer_1.4s_infinite] first:mt-4 last:mb-4 [&+&]:mt-2"
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-[64px_24px] text-center flex flex-col items-center gap-2.5">
            <div className="w-14 h-14 rounded-2xl bg-[#f1f5f9] flex items-center justify-center text-2xl mb-1">
              {search || activeTab !== 'all' ? '🔍' : '📋'}
            </div>
            <p className="text-[15px] font-bold text-[#475569]">
              {search || activeTab !== 'all'
                ? 'No matching appointments'
                : 'No appointments today'}
            </p>
            <p className="text-[13px] text-[#94a3b8] max-w-70 leading-[1.6]">
              {search || activeTab !== 'all'
                ? 'Try adjusting your search or selecting a different filter.'
                : 'Scheduled appointments will appear here automatically.'}
            </p>
            {(search || activeTab !== 'all') && (
              <button
                className="mt-1 py-2 px-4.5 rounded-lg border-[1.5px] border-[#e2e8f0] bg-white text-[12px] font-semibold text-[#2563eb] cursor-pointer font-inherit transition-colors duration-150 hover:bg-[#eff6ff] hover:border-[#bfdbfe]"
                onClick={() => {
                  setSearch('');
                  setActiveTab('all');
                }}
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden md:grid grid-cols-[96px_1fr_1fr_130px_80px_80px] p-[10px_24px] bg-[#f8fafc] border-b border-[#f1f5f9]">
              <span className="text-[10px] font-bold tracking-[.07em] uppercase text-[#94a3b8]">
                Token
              </span>
              <span className="text-[10px] font-bold tracking-[.07em] uppercase text-[#94a3b8]">
                Patient
              </span>
              <span className="text-[10px] font-bold tracking-[.07em] uppercase text-[#94a3b8]">
                Doctor
              </span>
              <span className="text-[10px] font-bold tracking-[.07em] uppercase text-[#94a3b8]">
                Status
              </span>
              <span className="text-[10px] font-bold tracking-[.07em] uppercase text-[#94a3b8]">
                Check-In
              </span>
              <span className="text-[10px] font-bold tracking-[.07em] uppercase text-[#94a3b8]">
                Booked
              </span>
            </div>

            {filtered.map((a) => {
              const ss = STATUS_STYLE[a.status] || {
                bg: '#f1f5f9',
                border: '#e2e8f0',
                color: '#64748b',
                dot: '#94a3b8',
                label: a.status,
              };
              return (
                <>
                  {/* Desktop row */}
                  <div
                    className="hidden md:grid grid-cols-[96px_1fr_1fr_130px_80px_80px] p-[14px_24px] items-center border-b border-[#f8fafc] transition-colors duration-100 last:border-b-0 hover:bg-[#fafbfc]"
                    key={a._id}
                  >
                    <div>
                      <TokenBadge token={a.token} onClick={setSelectedToken} />
                    </div>
                    <div>
                      <p className="text-[13.5px] font-semibold text-[#0f172a]">
                        {a.patientDetails?.firstName}{' '}
                        {a.patientDetails?.lastName}
                      </p>
                      <p className="text-[11.5px] text-[#94a3b8] mt-0.5">
                        {a.patientDetails?.phoneNumber}
                      </p>
                    </div>
                    <div>
                      <p className="text-[13px] font-medium text-[#334155]">
                        Dr. {a.doctorDetails?.firstName}{' '}
                        {a.doctorDetails?.lastName}
                      </p>
                      <p className="text-[11.5px] text-[#94a3b8] mt-0.5">
                        {a.doctorDetails?.department}
                      </p>
                    </div>
                    <div>
                      <span
                        className="inline-flex items-center gap-1.25 py-1 px-2.5 rounded-full text-[11px] font-bold border w-fit"
                        style={{
                          background: ss.bg,
                          borderColor: ss.border,
                          color: ss.color,
                        }}
                      >
                        <span className="w-1.25 h-1.25 rounded-full bg-current shrink-0" />
                        {ss.label}
                      </span>
                    </div>
                    <span className="text-[12px] text-[#475569] font-medium">
                      {fmt(a.checkedInAt)}
                    </span>
                    <span className="text-[12px] text-[#94a3b8]">
                      {fmtDate(a.bookedOn)}
                    </span>
                  </div>

                  {/* Mobile card */}
                  <div
                    className="md:hidden flex items-center gap-3 p-[14px_18px] border-b border-[#f8fafc] last:border-b-0 hover:bg-[#fafbfc]"
                    key={a._id + '-m'}
                  >
                    <TokenBadge token={a.token} onClick={setSelectedToken} />
                    <div className="flex-1 min-w-0">
                      <p className="text-[13.5px] font-semibold text-[#0f172a] whitespace-nowrap overflow-hidden text-ellipsis">
                        {a.patientDetails?.firstName}{' '}
                        {a.patientDetails?.lastName}
                      </p>
                      <p className="text-[12px] text-[#64748b] mt-0.5 whitespace-nowrap overflow-hidden text-ellipsis">
                        Dr. {a.doctorDetails?.firstName}{' '}
                        {a.doctorDetails?.lastName} ·{' '}
                        {a.doctorDetails?.department}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1.25 shrink-0">
                      <span
                        className="inline-flex items-center gap-1.25 py-1 px-2.5 rounded-full text-[11px] font-bold border"
                        style={{
                          background: ss.bg,
                          borderColor: ss.border,
                          color: ss.color,
                        }}
                      >
                        <span className="w-1.25 h-1.25 rounded-full bg-current shrink-0" />
                        {ss.label}
                      </span>
                      <span className="text-[12px] text-[#94a3b8]">
                        {fmt(a.checkedInAt)}
                      </span>
                    </div>
                  </div>
                </>
              );
            })}

            {/* Footer */}
            <div className="p-[12px_24px] border-t border-[#f1f5f9] flex items-center justify-between gap-2 bg-[#fafbfc]">
              <span className="text-[12px] text-[#94a3b8]">
                Showing{' '}
                <strong className="text-[#475569] font-semibold">
                  {filtered.length}
                </strong>{' '}
                of{' '}
                <strong className="text-[#475569] font-semibold">
                  {appointments.length}
                </strong>{' '}
                appointments
              </span>
              {(search || activeTab !== 'all') && (
                <button
                  className="bg-none border-none cursor-pointer text-[12px] font-semibold text-[#2563eb] font-inherit p-0 transition-opacity duration-150 hover:opacity-70"
                  onClick={() => {
                    setSearch('');
                    setActiveTab('all');
                  }}
                >
                  Clear filters
                </button>
              )}
            </div>
          </>
        )}
      </div>

      {selectedToken && (
        <TokenDetailModal
          token={selectedToken}
          onClose={() => setSelectedToken(null)}
        />
      )}

      <style jsx>{`
        @keyframes ta-shimmer {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }
        .scrollbar-none {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-none::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}