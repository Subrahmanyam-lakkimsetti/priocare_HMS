import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchActiveAppointment } from '../patientThunks';
import { useNavigate, useLocation } from 'react-router-dom';
import NoAppointmentPage from './NoAppointmentPage';
import { getMyProfileRequest } from '../patientProfile/profileService';

const NAV_ITEMS = [
  { key: 'home', label: 'Dashboard', path: '/patient' },
  { key: 'appointments', label: 'Appointments', path: '/patient/appointments' },
  { key: 'records', label: 'Medical Records', path: '/patient/records' },
  { key: 'profile', label: 'Profile', path: '/patient/profile' },
];

const SEVERITY_CONFIG = {
  Critical: {
    bg: 'from-red-50 to-rose-50',
    border: 'border-red-200',
    badge: 'bg-red-100 text-red-700',
    dot: 'bg-red-500',
    accent: '#ef4444',
  },
  High: {
    bg: 'from-orange-50 to-amber-50',
    border: 'border-orange-200',
    badge: 'bg-orange-100 text-orange-700',
    dot: 'bg-orange-500',
    accent: '#f97316',
  },
  Medium: {
    bg: 'from-yellow-50 to-amber-50',
    border: 'border-yellow-200',
    badge: 'bg-yellow-100 text-yellow-700',
    dot: 'bg-yellow-500',
    accent: '#eab308',
  },
  Low: {
    bg: 'from-emerald-50 to-teal-50',
    border: 'border-emerald-200',
    badge: 'bg-emerald-100 text-emerald-700',
    dot: 'bg-emerald-500',
    accent: '#10b981',
  },
};

const STATUS_CONFIG = {
  waiting: {
    label: 'Waiting',
    color: 'bg-amber-100 text-amber-700',
    message:
      'Please have a seat and stay nearby. Your token will be called shortly — we appreciate your patience.',
  },
  'in-progress': {
    label: 'In Progress',
    color: 'bg-blue-100 text-blue-700',
    message:
      "Your consultation is currently underway. Please proceed to the doctor's room if you haven't already.",
  },
  completed: {
    label: 'Completed',
    color: 'bg-emerald-100 text-emerald-700',
    message:
      'Your consultation is complete. Please collect your prescription or follow-up instructions from the front desk.',
  },
};

function StatusDot({ status }) {
  if (status === 'in-progress') {
    return (
      <span className="relative flex h-2.5 w-2.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500" />
      </span>
    );
  }
  const dotColor =
    status === 'waiting'
      ? 'bg-amber-400'
      : status === 'completed'
        ? 'bg-emerald-500'
        : 'bg-gray-400';
  return <span className={`w-2 h-2 rounded-full ${dotColor}`} />;
}

const TIPS = [
  {
    icon: '📱',
    text: 'Keep your phone nearby in case the staff needs to reach you.',
  },
  {
    icon: '🪪',
    text: 'Have your ID and insurance card ready at the front desk.',
  },
  {
    icon: '🔔',
    text: 'Let reception know if your symptoms change significantly.',
  },
];

export default function PatientHome() {
  const dispatch = useDispatch();
  const nav = useNavigate();
  const location = useLocation();
  const [profileExists, setProfileExists] = useState(true);
  const [profileBannerDismissed, setProfileBannerDismissed] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const { activeAppointment, loadingAppointment } = useSelector(
    (s) => s.patient,
  );
  const user = useSelector((s) => s.auth?.user) || {
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah@example.com',
  };

  useEffect(() => {
    dispatch(fetchActiveAppointment());
  }, []);

  useEffect(() => {
    getMyProfileRequest()
      .then(() => setProfileExists(true))
      .catch((err) => {
        if (err?.response?.status === 404) setProfileExists(false);
      });
  }, []);

  const severity = activeAppointment?.triage?.severityLevel;
  const sevConfig = SEVERITY_CONFIG[severity] || SEVERITY_CONFIG['Low'];
  const status = activeAppointment?.status;
  const statusCfg = STATUS_CONFIG[status] || {
    label: status,
    color: 'bg-gray-100 text-gray-600',
    message: 'Please check with the front desk for further assistance.',
  };

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const showProfileBanner = !profileExists && !profileBannerDismissed;

  return (
    <>
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .slide-up { animation: slideUp 0.5s ease both; }
        .slide-up:nth-child(1) { animation-delay: 0ms; }
        .slide-up:nth-child(2) { animation-delay: 80ms; }
        .slide-up:nth-child(3) { animation-delay: 160ms; }
        .slide-up:nth-child(4) { animation-delay: 240ms; }

        @keyframes tokenPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(99,102,241,0.15); }
          50%       { box-shadow: 0 0 0 12px rgba(99,102,241,0); }
        }
        .token-glow { animation: tokenPulse 3s ease-in-out infinite; }

        @keyframes bannerSlideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .profile-banner { animation: bannerSlideDown 0.4s cubic-bezier(0.16,1,0.3,1) both; }

        @keyframes backdropIn {
          from { opacity: 0; } to { opacity: 1; }
        }
        .modal-backdrop { animation: backdropIn 0.25s ease both; }

        @keyframes modalPopIn {
          from { opacity: 0; transform: scale(0.92) translateY(12px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        .modal-card { animation: modalPopIn 0.35s cubic-bezier(0.16,1,0.3,1) both; }

        .dot-pattern {
          background-image: radial-gradient(circle, #e2e8f0 1px, transparent 1px);
          background-size: 20px 20px;
        }

        .avatar-ring {
          background: linear-gradient(135deg, #6366f1, #8b5cf6, #06b6d4);
          padding: 2px;
          border-radius: 14px;
        }
        .avatar-inner {
          background: #1e1b4b;
          border-radius: 12px;
        }
      `}</style>

      {/* ── Page root: no local background, inherits global #f1f5f9 ── */}
      <div className="min-h-screen w-full font-sans">
        <main className="w-full px-10 py-8">
          {/* ── Profile Incomplete Banner ── */}
          {showProfileBanner && (
            <div className="profile-banner max-w-4xl mx-auto mb-5">
              <div className="relative flex items-center justify-between gap-4 px-5 py-4 rounded-2xl overflow-hidden bg-linear-to-r from-indigo-50 to-indigo-100 border border-indigo-200">
                {/* Decorative blob */}
                <div className="absolute right-24 -top-6 w-28 h-28 rounded-full opacity-20 pointer-events-none bg-indigo-400 blur-2xl" />

                <div className="flex items-center gap-3.5">
                  <div className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center bg-linear-to-br from-indigo-500 to-violet-500 shadow-lg shadow-indigo-200">
                    <svg
                      className="w-5 h-5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-indigo-900 leading-tight">
                      Your profile isn't set up yet
                    </p>
                    <p className="text-xs text-indigo-500 mt-0.5">
                      Add your details so your doctor has everything they need
                      before your visit.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => nav('/patient/profile')}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-linear-to-r from-indigo-500 to-violet-500 text-white shadow-md shadow-indigo-200 hover:scale-105 active:scale-95 transition-transform"
                  >
                    Complete Profile
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => setProfileBannerDismissed(true)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-indigo-300 hover:bg-indigo-200 hover:text-indigo-600 transition-colors"
                    aria-label="Dismiss"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Loading */}
          {loadingAppointment && (
            <div className="flex flex-col items-center justify-center py-32 gap-5">
              <div className="w-12 h-12 rounded-full border-[3px] border-indigo-100 border-t-indigo-500 animate-spin" />
              <p className="text-sm text-slate-400 font-medium">
                Loading your visit...
              </p>
            </div>
          )}

          {/* No appointment */}
          {!loadingAppointment && !activeAppointment && (
            <NoAppointmentPage
              firstName={user?.firstName}
              onStartConsultation={() => {
                if (!profileExists) setShowProfileModal(true);
                else nav('/patient/intake');
              }}
            />
          )}

          {/* ── Active appointment ── */}
          {!loadingAppointment && activeAppointment && (
            <div className="w-full max-w-4xl mx-auto space-y-4">
              {/* Page heading */}
              <div className="slide-up">
                <p className="text-xs font-semibold uppercase tracking-widest text-indigo-400 mb-1">
                  Active Visit
                </p>
                <h2 className="font-bold text-3xl text-slate-900 tracking-tight">
                  Your Consultation
                </h2>
              </div>

              {/* ── Appointment card ── */}
              <div
                className={`slide-up border-2 bg-linear-to-br ${sevConfig.bg} ${sevConfig.border} rounded-2xl overflow-hidden cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl`}
                onClick={() =>
                  nav(`/patient/appointment/${activeAppointment.token}`)
                }
              >
                {/* Top section */}
                <div className="p-6 pb-4">
                  {/* Doctor row */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-3.5">
                      <div className="avatar-ring shrink-0">
                        <div className="avatar-inner w-12 h-12 flex items-center justify-center text-white font-bold text-base">
                          {activeAppointment.doctorId?.firstName?.[0]}
                          {activeAppointment.doctorId?.lastName?.[0]}
                        </div>
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 text-base leading-tight">
                          Dr. {activeAppointment.doctorId?.firstName}{' '}
                          {activeAppointment.doctorId?.lastName}
                        </h3>
                        <p className="text-sm text-slate-500 mt-0.5">
                          {activeAppointment.doctorId?.department}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${sevConfig.badge}`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${sevConfig.dot}`}
                      />
                      {severity}
                    </span>
                  </div>

                  {/* Token + Status grid */}
                  <div className="grid grid-cols-2 gap-3">
                    {/* Token */}
                    <div className="token-glow bg-white rounded-2xl p-4 flex flex-col gap-1 border border-indigo-100">
                      <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                        Token
                      </p>
                      <p className="font-bold tracking-widest leading-none text-[2rem] text-indigo-700">
                        {activeAppointment.token}
                      </p>
                    </div>

                    {/* Status */}
                    <div className="bg-white rounded-2xl p-4 flex flex-col gap-1 border border-slate-100">
                      <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                        Current Status
                      </p>
                      <span
                        className={`inline-flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-xs font-bold w-fit mt-0.5 ${statusCfg.color}`}
                      >
                        <StatusDot status={status} />
                        {statusCfg.label}
                      </span>
                    </div>
                  </div>
                </div>

                {/* CTA footer */}
                <div className="px-6 py-3.5 flex items-center justify-between bg-white/50 border-t border-black/5">
                  <p className="text-xs text-slate-400">
                    Tap to view full details
                  </p>
                  <span className="flex items-center gap-1.5 text-sm font-semibold text-indigo-500">
                    View details
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </span>
                </div>
              </div>

              {/* ── While you wait ── */}
              <div className="slide-up bg-white border border-slate-200 rounded-2xl overflow-hidden">
                <div className="px-5 py-4 dot-pattern border-b border-slate-100">
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                    While you wait
                  </p>
                </div>
                <div className="divide-y divide-slate-50">
                  {TIPS.map((tip) => (
                    <div
                      key={tip.text}
                      className="flex items-start gap-3.5 px-5 py-3 hover:bg-slate-50 transition-colors"
                    >
                      <span className="text-lg shrink-0 mt-0.5">
                        {tip.icon}
                      </span>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        {tip.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ── Profile Required Modal ── */}
      {showProfileModal && (
        <div
          className="modal-backdrop fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/55 backdrop-blur-md"
          onClick={() => setShowProfileModal(false)}
        >
          <div
            className="modal-card relative w-full max-w-md rounded-3xl overflow-hidden bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top gradient band */}
            <div className="h-1.5 w-full bg-linear-to-r from-indigo-500 via-violet-500 to-cyan-500" />

            <div className="px-8 pt-8 pb-7">
              {/* Icon */}
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-linear-to-br from-indigo-50 to-indigo-100 border border-indigo-200">
                  <svg
                    className="w-8 h-8 text-indigo-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.75}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                    />
                  </svg>
                </div>
              </div>

              {/* Text */}
              <div className="text-center mb-7">
                <h3 className="font-bold text-slate-900 text-xl tracking-tight mb-2">
                  Profile Setup Required
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  To book a consultation, we need a few details about you first.
                  Your profile helps your doctor review your medical background
                  and provide the best possible care.
                </p>
              </div>

              {/* Checklist */}
              <div className="rounded-2xl px-5 py-4 mb-7 space-y-2.5 bg-slate-50 border border-slate-100">
                {[
                  'Personal & contact information',
                  'Medical history & existing conditions',
                  'Current medications & allergies',
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2.5">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 bg-indigo-100">
                      <svg
                        className="w-3 h-3 text-indigo-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={3}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4.5 12.75l6 6 9-13.5"
                        />
                      </svg>
                    </div>
                    <p className="text-xs text-slate-600 font-medium">{item}</p>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2.5">
                <button
                  onClick={() => {
                    setShowProfileModal(false);
                    nav('/patient/profile');
                  }}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-bold bg-linear-to-r from-indigo-500 to-violet-500 text-white shadow-lg shadow-indigo-200 hover:scale-[1.02] active:scale-[0.98] transition-transform"
                >
                  Set Up My Profile
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => setShowProfileModal(false)}
                  className="w-full py-2.5 rounded-2xl text-sm font-medium text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Maybe later
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
