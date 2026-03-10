import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { fetchQueue, fetchActiveConsultation } from '../doctorThunks';

import QueuePanel from '../components/QueuePanel';
import ActiveConsultation from '../components/ActiveConsultation';
import AiAssistant from '../components/AiAssistant';
import DateSelector from '../components/DateSelector';

const toDateString = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const todayStr = () => toDateString(new Date());

export default function ConsultationRoom() {
  const dispatch = useDispatch();
  const [selectedDate, setSelectedDate] = useState(todayStr());
  const [mounted, setMounted] = useState(false);
  const hasMounted = useRef(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (hasMounted.current) return;
    hasMounted.current = true;
    dispatch(fetchActiveConsultation());
    dispatch(fetchQueue(todayStr()));
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchQueue(selectedDate));
  }, [selectedDate, dispatch]);

  const isToday = selectedDate === todayStr();

  return (
    <div className="h-screen px-10 py-8 flex flex-col gap-5 overflow-hidden box-border">
      {/* ── Top bar ── */}
      <div
        className={`
        flex items-center justify-between gap-4 flex-wrap shrink-0
        transition-all duration-450 ease-out translate-y-3 opacity-0
        ${mounted ? 'opacity-100 translate-y-0' : ''}
      `}
      >
        <div>
          <p className="text-[11px] font-semibold tracking-[0.08em] uppercase text-slate-400 mb-1">
            Doctor Workspace
          </p>
          <h1 className="text-[22px] font-extrabold text-slate-900 tracking-[-0.4px] m-0 flex items-center gap-2.5">
            <span className="w-8.5 h-8.5 bg-blue-50 rounded-[10px] flex items-center justify-center shrink-0">
              <svg
                width="18"
                height="18"
                fill="none"
                viewBox="0 0 24 24"
                stroke="#2563eb"
                strokeWidth="1.8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </span>
            Consultation Room
          </h1>
        </div>
        {isToday && (
          <div className="inline-flex items-center gap-1.5 bg-green-50 border border-green-200 rounded-full px-3.5 py-1 text-[11px] font-bold text-green-600">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_0_3px_rgba(34,197,94,0.2)] animate-[live-pulse_2s_infinite]" />
            Live Session
          </div>
        )}
      </div>

      {/* ── Date Selector ── */}
      <div
        className={`
        shrink-0
        transition-all duration-450 delay-75 ease-out translate-y-3 opacity-0
        ${mounted ? 'opacity-100 translate-y-0' : ''}
      `}
      >
        <DateSelector selectedDate={selectedDate} onChange={setSelectedDate} />
      </div>

      {/* ── Three-column grid ── */}
      <div
        className={`
        grid grid-cols-[minmax(300px,1.2fr)_minmax(0,2fr)_minmax(300px,1.2fr)] gap-4 flex-1 min-h-0
        transition-all duration-500 delay-150 ease-out translate-y-3.5 opacity-0
        ${mounted ? 'opacity-100 translate-y-0' : ''}
        
        /* Responsive overrides */
        max-[1200px]:grid-cols-[minmax(260px,1fr)_minmax(0,1.6fr)_minmax(260px,1fr)]
        max-[1024px]:grid-cols-[1fr_1fr] max-[1024px]:h-auto max-[1024px]:overflow-auto
        max-[680px]:grid-cols-[1fr] max-[680px]:px-4 max-[680px]:py-5
      `}
      >
        {/* Queue Panel */}
        <div className="bg-white border-[1.5px] border-slate-300 rounded-xl overflow-hidden flex flex-col min-h-0 shadow-md hover:shadow-lg hover:border-slate-400 transition-all duration-200">
          <div className="flex items-center gap-2 px-4 py-3.5 pb-3 border-b border-slate-200 shrink-0 bg-slate-50/80">
            <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center">
              <svg
                width="14"
                height="14"
                fill="none"
                viewBox="0 0 24 24"
                stroke="#2563eb"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 10h16M4 14h8"
                />
              </svg>
            </div>
            <span className="text-[13px] font-bold text-slate-900 flex-1">
              Patient Queue
            </span>
            <span className="text-[11px] text-slate-400 font-medium">
              {selectedDate}
            </span>
          </div>
          <div className="flex-1 overflow-y-auto min-h-0 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-200">
            <QueuePanel date={selectedDate} />
          </div>
        </div>

        {/* Active Consultation */}
        <div className="bg-white border-[1.5px] border-slate-300 rounded-xl overflow-hidden flex flex-col min-h-0 shadow-md hover:shadow-lg hover:border-slate-400 transition-all duration-200 max-[1024px]:col-span-2 max-[680px]:col-span-1">
          <div className="flex items-center gap-2 px-4 py-3.5 pb-3 border-b border-slate-200 shrink-0 bg-slate-50/80">
            <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center">
              <svg
                width="14"
                height="14"
                fill="none"
                viewBox="0 0 24 24"
                stroke="#4f46e5"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <span className="text-[13px] font-bold text-slate-900 flex-1">
              Active Consultation
            </span>
            {isToday && (
              <span className="text-[11px] font-bold text-green-600">
                ● Now
              </span>
            )}
          </div>
          <div className="flex-1 overflow-y-auto min-h-0 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-200">
            <ActiveConsultation date={selectedDate} />
          </div>
        </div>

        {/* AI Assistant */}
        <div className="bg-white border-[1.5px] border-slate-300 rounded-xl overflow-hidden flex flex-col min-h-0 shadow-md hover:shadow-lg hover:border-slate-400 transition-all duration-200">
          <div className="flex items-center gap-2 px-4 py-3.5 pb-3 border-b border-slate-200 shrink-0 bg-slate-50/80">
            <div className="w-7 h-7 rounded-lg bg-purple-50 flex items-center justify-center">
              <svg
                width="14"
                height="14"
                fill="none"
                viewBox="0 0 24 24"
                stroke="#7c3aed"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <span className="text-[13px] font-bold text-slate-900 flex-1">
              AI Assistant
            </span>
            <span className="text-[11px] text-slate-400 font-medium">
              Gemini
            </span>
          </div>
          <div className="flex-1 overflow-y-auto min-h-0 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-200">
            <AiAssistant />
          </div>
        </div>
      </div>

      {/* Custom animation keyframes via style tag */}
      <style>{`
        @keyframes live-pulse {
          0%, 100% { box-shadow: 0 0 0 3px rgba(34,197,94,0.18); }
          50% { box-shadow: 0 0 0 6px rgba(34,197,94,0.06); }
        }
      `}</style>
    </div>
  );
}
