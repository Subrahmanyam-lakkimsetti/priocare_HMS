import { useDispatch, useSelector } from 'react-redux';
import {
  setAssignmentMode,
  openDoctorPicker,
  clearSelectedDoctor,
} from '../patientSlice';

export default function AssignmentModeSelector({ ready }) {
  const dispatch = useDispatch();
  const { assignmentMode, selectedDoctor } = useSelector((s) => s.patient);

  const handleChooseAuto = () => {
    dispatch(setAssignmentMode('auto'));
  };

  const handleChooseManual = () => {
    dispatch(setAssignmentMode('manual'));
  };

  const handleOpenPicker = () => {
    if (!ready) return;
    dispatch(openDoctorPicker());
  };

  const handleClearDoctor = (e) => {
    e.stopPropagation();
    dispatch(clearSelectedDoctor());
  };

  return (
    <div className="mt-8">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-1 h-6 bg-purple-500 rounded-full" />
        <h2 className="text-lg font-semibold text-gray-900">
          Doctor Assignment
        </h2>
      </div>
      <p className="text-sm text-gray-500 mb-4 ml-3">
        Choose how you'd like a doctor assigned to your appointment.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* AUTO ASSIGN OPTION */}
        <button
          onClick={handleChooseAuto}
          className={`relative text-left rounded-2xl border-2 p-5 transition-all duration-200 group ${
            assignmentMode === 'auto'
              ? 'border-blue-500 bg-blue-50 shadow-md shadow-blue-100'
              : 'border-gray-200 bg-white hover:border-blue-200 hover:shadow-sm'
          }`}
        >
          {/* Recommended badge */}
          <div className="absolute -top-3 left-4">
            <span className="inline-flex items-center gap-1 bg-blue-600 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              Recommended &amp; Most Preferable
            </span>
          </div>

          <div className="flex items-start gap-3 mt-1">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                assignmentMode === 'auto'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-500 group-hover:bg-blue-100 group-hover:text-blue-600'
              }`}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-bold text-gray-900 text-sm">Auto Assign</h3>
                {assignmentMode === 'auto' && (
                  <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                    <svg
                      className="w-2.5 h-2.5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">
                Our AI analyses your symptoms and automatically assigns the
                best-matched available doctor for optimal care.
              </p>
              <div className="flex flex-wrap gap-1.5 mt-2.5">
                {['AI-powered', 'Fastest', 'Best match'].map((tag) => (
                  <span
                    key={tag}
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${assignmentMode === 'auto' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'}`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </button>

        {/* CHOOSE DOCTOR OPTION */}
        <button
          onClick={handleChooseManual}
          disabled={!ready}
          className={`relative text-left rounded-2xl border-2 p-5 transition-all duration-200 group ${
            !ready
              ? 'opacity-50 cursor-not-allowed border-gray-100 bg-gray-50'
              : assignmentMode === 'manual'
                ? 'border-purple-500 bg-purple-50 shadow-md shadow-purple-100'
                : 'border-gray-200 bg-white hover:border-purple-200 hover:shadow-sm cursor-pointer'
          }`}
        >
          <div className="flex items-start gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                assignmentMode === 'manual'
                  ? 'bg-purple-500 text-white'
                  : 'bg-gray-100 text-gray-500 group-hover:bg-purple-100 group-hover:text-purple-600'
              }`}
            >
              <svg
                className="w-5 h-5"
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
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-bold text-gray-900 text-sm">
                  Choose Doctor
                </h3>
                {assignmentMode === 'manual' && (
                  <div className="w-4 h-4 bg-purple-500 rounded-full flex items-center justify-center">
                    <svg
                      className="w-2.5 h-2.5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">
                {ready
                  ? 'Browse available doctors matched to your condition and pick the one you prefer.'
                  : 'Complete all required sections first to unlock this option.'}
              </p>
              <div className="flex flex-wrap gap-1.5 mt-2.5">
                {['Your choice', 'AI-guided list', 'Full control'].map(
                  (tag) => (
                    <span
                      key={tag}
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${assignmentMode === 'manual' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-500'}`}
                    >
                      {tag}
                    </span>
                  ),
                )}
              </div>
            </div>
          </div>
        </button>
      </div>

      {/* Doctor selection button / selected doctor display — only in manual mode */}
      {assignmentMode === 'manual' && ready && (
        <div className="mt-4">
          {selectedDoctor ? (
            /* Selected doctor card */
            <div className="flex items-center gap-3 p-4 bg-purple-50 border-2 border-purple-300 rounded-2xl">
              <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0">
                {`${selectedDoctor.firstName?.[0]}${selectedDoctor.lastName?.[0]}`.toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-purple-500 font-semibold uppercase tracking-wide">
                  Selected Doctor
                </p>
                <p className="font-bold text-gray-900">
                  Dr. {selectedDoctor.firstName} {selectedDoctor.lastName}
                </p>
                <p className="text-xs text-gray-500">
                  {selectedDoctor.specializations?.join(', ')} ·{' '}
                  {selectedDoctor.experienceYears} yrs exp · ₹
                  {selectedDoctor.consultationFee}
                </p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={handleOpenPicker}
                  className="text-xs text-purple-600 font-semibold hover:text-purple-800 border border-purple-200 bg-white px-3 py-1.5 rounded-lg transition-colors"
                >
                  Change
                </button>
                <button
                  onClick={handleClearDoctor}
                  className="text-xs text-gray-400 hover:text-red-500 border border-gray-200 bg-white px-3 py-1.5 rounded-lg transition-colors"
                >
                  Remove
                </button>
              </div>
            </div>
          ) : (
            /* Pick doctor CTA */
            <button
              onClick={handleOpenPicker}
              className="w-full flex items-center justify-between px-5 py-4 bg-white border-2 border-dashed border-purple-300 rounded-2xl hover:border-purple-400 hover:bg-purple-50/50 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-purple-100 group-hover:bg-purple-200 rounded-xl flex items-center justify-center transition-colors">
                  <svg
                    className="w-5 h-5 text-purple-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="font-semibold text-gray-800 text-sm">
                    Browse Available Doctors
                  </p>
                  <p className="text-xs text-gray-400">
                    AI will analyse your details and show matched specialists
                  </p>
                </div>
              </div>
              <svg
                className="w-5 h-5 text-purple-400 group-hover:text-purple-600 transition-colors"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
