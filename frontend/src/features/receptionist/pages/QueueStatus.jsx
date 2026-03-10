import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchQueueStatus } from '../receptionistThunks';
import TokenBadge from '../components/Tokenbadge';
import TokenDetailModal from '../components/Tokendetailmodal';

function ProgressBar({ value, total, color }) {
  const pct = total ? Math.min(100, Math.round((value / total) * 100)) : 0;
  return (
    <div className="h-1.25 rounded-sm bg-slate-100 overflow-hidden">
      <div
        style={{
          width: `${pct}%`,
          background: color,
          transition: 'width .7s ease',
        }}
        className="h-full rounded-sm"
      />
    </div>
  );
}

const STATS_CFG = [
  {
    key: 'waiting',
    label: 'Waiting',
    bg: '#fffbeb',
    border: '#fde68a',
    color: '#d97706',
    barColor: '#f59e0b',
  },
  {
    key: 'inSession',
    label: 'In Session',
    bg: '#eff6ff',
    border: '#bfdbfe',
    color: '#2563eb',
    barColor: '#3b82f6',
  },
  {
    key: 'completed',
    label: 'Completed',
    bg: '#f0fdf4',
    border: '#bbf7d0',
    color: '#16a34a',
    barColor: '#22c55e',
  },
];

export default function QueueStatus() {
  const dispatch = useDispatch();
  const { queueStatus, loading } = useSelector((s) => s.receptionist);
  const [selectedToken, setSelectedToken] = useState(null);
  const [mounted, setMounted] = useState(false);

  const refresh = () => dispatch(fetchQueueStatus());

  useEffect(() => {
    setMounted(true);
    refresh();
  }, [dispatch]);

  return (
    <>
      <style>{`
        @keyframes qs-spin     { to { transform: rotate(360deg); } }
        @keyframes qs-shimmer  { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
        .spinning              { animation: qs-spin .7s linear infinite; }
        .shimmer-card          { animation: qs-shimmer 1.4s infinite; background-size: 200% 100%; }
        .fade-up               { opacity: 0; transform: translateY(12px); transition: opacity .4s ease, transform .4s ease; }
        .fade-up.show          { opacity: 1; transform: translateY(0); }
        .d1                    { transition-delay: .07s; }
        .token-group-label::after { content: ''; flex: 1; height: 1px; background: #f1f5f9; }
      `}</style>

      <div
        className="min-h-screen bg-slate-100 px-8 pt-8 pb-12 max-sm:px-4 max-sm:pt-5 max-sm:pb-10"
        style={{
          fontFamily:
            "'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        }}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between gap-4 flex-wrap mb-7 pb-5 border-b border-slate-200 fade-up ${mounted ? 'show' : ''}`}
        >
          <div>
            <p className="text-[11px] font-semibold tracking-[.07em] uppercase text-slate-400 mb-1">
              Reception Portal
            </p>
            <h1 className="text-[22px] font-extrabold text-slate-900 tracking-[-0.4px] m-0 mb-1">
              Queue Status
            </h1>
            <p className="text-[13px] text-slate-400 flex items-center gap-1.5 flex-wrap">
              Live overview of all active doctor queues
            </p>
          </div>

          <button
            onClick={refresh}
            className="inline-flex items-center gap-1.75 px-4 py-2 rounded-[10px] border-[1.5px] border-slate-200 bg-white text-xs font-semibold text-slate-600 cursor-pointer whitespace-nowrap shrink-0 shadow-[0_1px_4px_rgba(15,23,42,.05)] transition-all duration-150 hover:bg-slate-50 hover:border-blue-200 hover:text-blue-600"
            style={{ fontFamily: 'inherit' }}
          >
            <span
              className={`inline-block text-sm transition-transform duration-300 ${loading.queue ? 'spinning' : ''}`}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="23 4 23 10 17 10" />
                <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
              </svg>
            </span>
            Refresh
          </button>
        </div>

        {/* Grid */}
        <div
          className={`grid grid-cols-2 gap-4.5 max-[780px]:grid-cols-1 fade-up d1 ${mounted ? 'show' : ''}`}
        >
          {loading.queue && queueStatus.length === 0 ? (
            [1, 2].map((i) => (
              <div
                key={i}
                className="h-80 rounded-[18px] shimmer-card"
                style={{
                  background:
                    'linear-gradient(90deg,#f1f5f9 25%,#e2e8f0 50%,#f1f5f9 75%)',
                }}
              />
            ))
          ) : queueStatus.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-[18px] py-16 px-6 text-center shadow-[0_2px_10px_rgba(15,23,42,.05)] col-span-full">
              <div className="text-[32px] mb-3.5">🏥</div>
              <p className="text-[15px] font-bold text-slate-500 mb-1">
                No queues active
              </p>
              <p className="text-[13px] text-slate-400">
                Doctor queues will appear here once patients are checked in.
              </p>
            </div>
          ) : (
            queueStatus.map((q) => {
              const total = q.totalAppointments || 1;
              const waiting = q.waitingCont ?? 0;
              const inSession = q.inConsultation?.length ?? 0;
              const completed = q.consultationsCompleted ?? 0;

              const statsData = [
                { ...STATS_CFG[0], val: waiting },
                { ...STATS_CFG[1], val: inSession },
                { ...STATS_CFG[2], val: completed },
              ];

              return (
                <div
                  key={q._id}
                  className="bg-white border border-slate-200 rounded-[18px] overflow-hidden shadow-[0_2px_10px_rgba(15,23,42,.05)] transition-all duration-200 hover:shadow-[0_6px_24px_rgba(15,23,42,.09)] hover:-translate-y-px"
                >
                  {/* Card Header */}
                  <div className="flex items-center justify-between gap-3 px-5 py-4.5 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0 border border-blue-200"
                        style={{
                          background:
                            'linear-gradient(135deg, #eff6ff, #dbeafe)',
                        }}
                      >
                        🩺
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">
                          Dr. {q.doctorDetails?.firstName}{' '}
                          {q.doctorDetails?.lastName}
                        </p>
                        <span className="inline-flex items-center text-[10px] font-bold text-blue-600 bg-blue-50 rounded-md px-2 py-0.5 border border-blue-200 mt-0.5">
                          {q.doctorDetails?.department}
                        </span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-[28px] font-extrabold text-slate-900 tracking-[-1px] leading-none">
                        {q.totalAppointments}
                      </p>
                      <p className="text-[10.5px] text-slate-400 font-medium mt-0.5">
                        total
                      </p>
                    </div>
                  </div>

                  {/* Stats Row */}
                  <div className="grid grid-cols-3 gap-px bg-slate-100 border-b border-slate-100">
                    {statsData.map((s) => (
                      <div
                        key={s.key}
                        className="py-3.5 px-3 text-center bg-white"
                      >
                        <p
                          className="text-2xl font-extrabold tracking-[-0.5px] leading-none"
                          style={{ color: s.color }}
                        >
                          {s.val}
                        </p>
                        <p
                          className="text-[11px] font-medium mt-1"
                          style={{ color: s.color }}
                        >
                          {s.label}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Progress Bars */}
                  <div className="flex flex-col gap-3 px-5 py-4 border-b border-slate-50">
                    {statsData.map((s) => (
                      <div key={s.key}>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
                            <span
                              className="w-1.75 h-1.75 rounded-full shrink-0"
                              style={{ background: s.barColor }}
                            />
                            {s.label}
                          </span>
                          <span className="text-[11.5px] text-slate-400 font-semibold">
                            {s.val} / {q.totalAppointments}
                          </span>
                        </div>
                        <ProgressBar
                          value={s.val}
                          total={total}
                          color={s.barColor}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Token Lists */}
                  {(q.waitingPatients?.length > 0 ||
                    q.inConsultation?.length > 0 ||
                    q.nonCheckedInPatients?.length > 0) && (
                    <div className="flex flex-col gap-3.5 px-5 py-4">
                      {q.nonCheckedInPatients?.length > 0 && (
                        <div>
                          <p className="text-[10px] font-bold tracking-[.08em] uppercase text-slate-400 mb-2 flex items-center gap-1.5 token-group-label">
                            📋 Not Checked In
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {q.nonCheckedInPatients.map((t) => (
                              <TokenBadge
                                key={t}
                                token={t}
                                onClick={setSelectedToken}
                              />
                            ))}
                          </div>
                        </div>
                      )}

                      {q.waitingPatients?.length > 0 && (
                        <div>
                          <p className="text-[10px] font-bold tracking-[.08em] uppercase text-slate-400 mb-2 flex items-center gap-1.5 token-group-label">
                            ⏳ Waiting
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {q.waitingPatients.map((t) => (
                              <TokenBadge
                                key={t}
                                token={t}
                                onClick={setSelectedToken}
                              />
                            ))}
                          </div>
                        </div>
                      )}

                      {q.inConsultation?.length > 0 && (
                        <div>
                          <p className="text-[10px] font-bold tracking-[.08em] uppercase text-slate-400 mb-2 flex items-center gap-1.5 token-group-label">
                            🩺 In Consultation
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {q.inConsultation.map((t) => (
                              <TokenBadge
                                key={t}
                                token={t}
                                onClick={setSelectedToken}
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
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