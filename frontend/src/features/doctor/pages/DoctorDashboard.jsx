import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

export default function DoctorDashboard() {
  const nav = useNavigate();
  const user = useSelector((s) => s.auth?.user);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentHour = new Date().getHours();
  const greeting =
    currentHour < 12
      ? 'Good morning'
      : currentHour < 17
        ? 'Good afternoon'
        : 'Good evening';

  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  // Animation classes
  const fadeUp = (delay) =>
    `transition-all duration-500 ease-out translate-y-4 opacity-0 ${
      mounted ? 'translate-y-0 opacity-100' : ''
    } ${delay}`;

  return (
    <div className="min-h-screen bg-slate-100 flex justify-center p-6 md:p-8 font-sans">
      <div className="w-full max-w-275 mx-auto">
        {/* Header */}
        <div
          className={`
          bg-white border-2 border-slate-300 rounded-xl md:rounded-2xl 
          p-6 md:p-8 shadow-lg mb-8 
          flex flex-wrap items-center justify-between gap-5
          transition-all duration-500 ease-out translate-y-4 opacity-0
          ${mounted ? 'translate-y-0 opacity-100' : ''}
        `}
        >
          <div>
            <p className="text-xs font-semibold tracking-wider uppercase text-slate-400 mb-2">
              {today}
            </p>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-1">
              {greeting}, {user?.firstName || user?.name || 'Doctor'} 👋
            </h1>
            <p className="text-sm text-slate-400">
              Here's an overview of your workspace.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 bg-white border-2 border-slate-200 rounded-full py-2 px-5 text-sm font-bold text-blue-600 shadow-md shrink-0">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse shadow-lg shadow-blue-200"></span>
            Doctor Portal
          </div>
        </div>

        {/* Quick Actions Label */}
        <p
          className={`
          text-xs font-bold tracking-wider uppercase text-slate-500 mb-4
          flex items-center gap-3
          transition-all duration-500 delay-100 ease-out translate-y-4 opacity-0
          ${mounted ? 'translate-y-0 opacity-100' : ''}
        `}
        >
          <span className="w-1 h-4 bg-blue-600 rounded-sm"></span>
          Quick Actions
          <span className="flex-1 h-px bg-linear-to-r from-slate-200 to-transparent"></span>
        </p>

        {/* Quick Actions Cards */}
        <div
          className={`
          grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 mb-8
          transition-all duration-500 delay-200 ease-out translate-y-4 opacity-0
          ${mounted ? 'translate-y-0 opacity-100' : ''}
        `}
        >
          {/* Consultation Room - Blue Card */}
          <div
            className="bg-linear-to-br from-blue-600 to-blue-700 rounded-2xl p-7 md:p-8 cursor-pointer relative overflow-hidden group hover:-translate-y-1 transition-all duration-300 shadow-xl hover:shadow-2xl"
            onClick={() => nav('/doctor/consultation')}
          >
            <div className="absolute -top-12.5 -right-12.5 w-48 h-48 bg-white/10 rounded-full pointer-events-none"></div>

            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-6">
              <svg
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
                stroke="white"
                strokeWidth="1.8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>

            <h3 className="text-xl md:text-2xl font-extrabold text-white mb-2">
              Consultation Room
            </h3>
            <p className="text-sm text-white/70 leading-relaxed mb-6">
              View patient queue, manage consultations, and access AI summaries.
            </p>

            <div className="inline-flex items-center gap-2 text-white/90 font-bold text-sm group-hover:gap-3 transition-all">
              Open room
              <svg
                width="16"
                height="16"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </div>

          {/* Patient History - White Card */}
          <div
            className="bg-white border-2 border-slate-200 rounded-2xl p-7 md:p-8 cursor-pointer group hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-xl hover:border-blue-500"
            onClick={() => nav('/doctor/patients')}
          >
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-6">
              <svg
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
                stroke="#2563eb"
                strokeWidth="1.8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            </div>

            <h3 className="text-xl md:text-2xl font-extrabold text-slate-900 mb-2">
              Patient History
            </h3>
            <p className="text-sm text-slate-500 leading-relaxed mb-6">
              Review past consultations, records, and patient notes.
            </p>

            <div className="inline-flex items-center gap-2 text-blue-600 font-bold text-sm group-hover:gap-3 transition-all">
              View records
              <svg
                width="16"
                height="16"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* System Status Label */}
        <p
          className={`
          text-xs font-bold tracking-wider uppercase text-slate-500 mb-4
          flex items-center gap-3
          transition-all duration-500 delay-300 ease-out translate-y-4 opacity-0
          ${mounted ? 'translate-y-0 opacity-100' : ''}
        `}
        >
          <span className="w-1 h-4 bg-blue-600 rounded-sm"></span>
          System Status
          <span className="flex-1 h-px bg-linear-to-r from-slate-200 to-transparent"></span>
        </p>

        {/* Status Chips */}
        <div
          className={`
          grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5
          transition-all duration-500 delay-500 ease-out translate-y-4 opacity-0
          ${mounted ? 'translate-y-0 opacity-100' : ''}
        `}
        >
          {/* System */}
          <div className="bg-white border-2 border-slate-200 rounded-xl p-5 md:p-6 flex items-center gap-4 shadow-md hover:shadow-lg hover:border-blue-500 transition-all group hover:-translate-y-0.5">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#2563eb"
                strokeWidth="1.8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </div>
            <div>
              <p className="text-xs font-bold tracking-wider uppercase text-slate-400 mb-1">
                System
              </p>
              <p className="text-base font-bold text-slate-900 mb-0.5">
                PrioCare HMS
              </p>
              <p className="text-xs text-slate-500">Hospital Management</p>
            </div>
          </div>

          {/* AI Assistant */}
          <div className="bg-white border-2 border-slate-200 rounded-xl p-5 md:p-6 flex items-center gap-4 shadow-md hover:shadow-lg hover:border-purple-500 transition-all group hover:-translate-y-0.5">
            <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center shrink-0">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#7c3aed"
                strokeWidth="1.8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div>
              <p className="text-xs font-bold tracking-wider uppercase text-slate-400 mb-1">
                AI Assistant
              </p>
              <p className="text-base font-bold text-slate-900 mb-0.5">
                Gemini AI
              </p>
              <p className="text-xs text-slate-500">Triage & summaries</p>
            </div>
          </div>

          {/* Live Updates */}
          <div className="bg-white border-2 border-slate-200 rounded-xl p-5 md:p-6 flex items-center gap-4 shadow-md hover:shadow-lg hover:border-slate-400 transition-all group hover:-translate-y-0.5">
            <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center shrink-0 border border-slate-200">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#475569"
                strokeWidth="1.8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <div>
              <p className="text-xs font-bold tracking-wider uppercase text-slate-400 mb-1">
                Live Updates
              </p>
              <p className="text-base font-bold text-slate-900 mb-0.5">
                Socket Ready
              </p>
              <p className="text-xs text-slate-500">Real-time queue sync</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
