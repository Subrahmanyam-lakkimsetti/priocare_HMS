import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createDoctor } from '../adminThunks';
import { clearCreateState } from '../adminSlice';

function SuccessPopup({ email, onDone }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // trigger entrance animation
    requestAnimationFrame(() => setVisible(true));
    const t = setTimeout(onDone, 2000);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div
      className="fixed inset-0 z-60 flex items-center justify-center p-4"
      style={{ background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(6px)' }}
    >
      <div
        className={`bg-white rounded-2xl shadow-2xl px-8 py-8 max-w-sm w-full text-center
        transition-all duration-500 ease-out
        ${visible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-6 scale-95'}`}
      >
        {/* Animated check circle */}
        <div
          className="w-16 h-16 rounded-full bg-green-50 border-2 border-green-200 flex items-center justify-center mx-auto mb-4
          transition-all duration-700 delay-100"
          style={{ transform: visible ? 'scale(1)' : 'scale(0)' }}
        >
          <svg
            width="28"
            height="28"
            fill="none"
            viewBox="0 0 24 24"
            stroke="#16a34a"
            strokeWidth="2.5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h3 className="text-lg font-extrabold text-slate-900 mb-1">
          Doctor Account Created!
        </h3>
        <p className="text-sm text-slate-500 mb-1">Invite sent to</p>
        <p className="text-sm font-bold text-blue-600 break-all mb-4">
          {email}
        </p>
        <p className="text-xs text-slate-400">
          Redirecting to pending profiles...
        </p>
        {/* Progress bar */}
        <div className="mt-3 h-1 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 rounded-full"
            style={{
              width: visible ? '100%' : '0%',
              transition: 'width 2.8s linear',
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default function CreateDoctorModal({ onClose }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { createLoading, createError, createSuccess } = useSelector(
    (s) => s.admin,
  );
  const [email, setEmail] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (createSuccess) setShowSuccess(true);
  }, [createSuccess]);

  useEffect(() => () => dispatch(clearCreateState()), [dispatch]);

  const handleDone = () => {
    dispatch(clearCreateState());
    onClose();
    navigate('/admin/staff', {
      state: { scrollToPending: true, role: 'doctor' },
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createDoctor({ email }));
  };

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{
          background: 'rgba(15,23,42,0.55)',
          backdropFilter: 'blur(4px)',
        }}
        onClick={(e) =>
          e.target === e.currentTarget && !showSuccess && onClose()
        }
      >
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm">
          {/* Header */}
          <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
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
                    d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-base font-extrabold text-slate-900">
                  Add New Doctor
                </h2>
                <p className="text-xs text-slate-400">
                  Doctor fills details after login
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
            >
              <svg
                width="15"
                height="15"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2.2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
            {createError && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-2.5 flex items-center gap-2">
                <svg
                  width="14"
                  height="14"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {createError}
              </div>
            )}
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">
                Email Address <span className="text-red-400">*</span>
              </label>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="doctor@priocare.in"
                className="w-full border-2 border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 placeholder-slate-300 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
            <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 flex items-start gap-2">
              <svg
                width="14"
                height="14"
                fill="none"
                viewBox="0 0 24 24"
                stroke="#3b82f6"
                strokeWidth="2"
                className="mt-0.5 shrink-0"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
              <p className="text-xs text-blue-600 leading-relaxed">
                A temporary password will be sent to this email. The doctor can
                log in and complete their profile.
              </p>
            </div>
            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={createLoading}
                className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition-colors disabled:opacity-60 shadow-lg shadow-blue-200 flex items-center justify-center gap-2"
              >
                {createLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Sending...
                  </>
                ) : (
                  'Create Doctor'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {showSuccess && <SuccessPopup email={email} onDone={handleDone} />}
    </>
  );
}