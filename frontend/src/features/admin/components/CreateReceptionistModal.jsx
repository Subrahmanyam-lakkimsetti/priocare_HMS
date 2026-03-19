import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createReceptionist } from '../adminThunks';
import { clearCreateState } from '../adminSlice';

function SuccessPopup({ email, onDone }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
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
          className="w-16 h-16 rounded-full bg-green-50 border-2 border-green-200 flex items-center justify-center mx-auto mb-4"
          style={{
            transform: visible ? 'scale(1)' : 'scale(0)',
            transition: 'transform 0.5s ease-out 0.1s',
          }}
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
          Receptionist Account Created!
        </h3>
        <p className="text-sm text-slate-500 mb-1">Invite sent to</p>
        <p className="text-sm font-bold text-purple-600 break-all mb-4">
          {email}
        </p>
        <p className="text-xs text-slate-400">
          Redirecting to pending profiles...
        </p>
        <div className="mt-3 h-1 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-purple-500 rounded-full"
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

export default function CreateReceptionistModal({ onClose }) {
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
      state: { scrollToPending: true, role: 'receptionist' },
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createReceptionist({ email }));
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
              <div className="w-9 h-9 rounded-xl bg-purple-50 flex items-center justify-center">
                <svg
                  width="18"
                  height="18"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="#7c3aed"
                  strokeWidth="1.8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-base font-extrabold text-slate-900">
                  Add Receptionist
                </h2>
                <p className="text-xs text-slate-400">
                  Receptionist fills details after login
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
                placeholder="receptionist@priocare.in"
                className="w-full border-2 border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 placeholder-slate-300 focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>
            <div className="bg-purple-50 border border-purple-100 rounded-xl px-4 py-3 flex items-start gap-2">
              <svg
                width="14"
                height="14"
                fill="none"
                viewBox="0 0 24 24"
                stroke="#7c3aed"
                strokeWidth="2"
                className="mt-0.5 shrink-0"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
              <p className="text-xs text-purple-600 leading-relaxed">
                A temporary password will be sent to this email. The
                receptionist can log in and complete their profile.
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
                className="flex-1 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm rounded-xl transition-colors disabled:opacity-60 shadow-lg shadow-purple-200 flex items-center justify-center gap-2"
              >
                {createLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Sending...
                  </>
                ) : (
                  'Create Receptionist'
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