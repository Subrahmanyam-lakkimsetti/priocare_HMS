import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { fetchActiveAppointment } from '../../patient/patientThunks';

export default function Confirmation() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const goToAppointments = async () => {
    await dispatch(fetchActiveAppointment());
    navigate('/patient/appointments');
  };

  return (
    <div className="min-h-full flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Success card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          {/* Success Header */}
          <div className="bg-gradient-to-br from-green-600 to-emerald-600 px-6 py-12 text-center relative">
            {/* Decorative circles */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-8 -mb-8" />

            {/* Checkmark circle */}
            <div className="relative inline-flex mb-5">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center border-4 border-white/30">
                <svg
                  className="w-10 h-10 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>

            <h1 className="text-2xl font-bold text-white mb-1">
              Appointment Confirmed!
            </h1>
            <p className="text-emerald-100 text-sm">
              Your consultation has been successfully booked
            </p>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* What happens next */}
            <div className="mb-6">
              <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
                What happens next
              </h2>

              <div className="space-y-4">
                {/* Step 1 */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 font-bold text-sm">1</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      Case Analysis
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      AI has assigned a priority score to your case
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 font-bold text-sm">2</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      Doctor Assignment
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      A specialist has been assigned to review your case
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 font-bold text-sm">3</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      Stay Available
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Keep your phone nearby — your token will be called soon
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Token reminder */}
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-amber-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-medium text-amber-800">
                    Save your token number
                  </p>
                  <p className="text-xs text-amber-600">
                    You'll need it for check-in and tracking
                  </p>
                </div>
              </div>
            </div>

            {/* Single Action Button */}
            <button
              onClick={goToAppointments}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 px-4 rounded-xl text-sm transition-all active:scale-[0.98] shadow-sm"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              View My Appointments
            </button>
          </div>
        </div>

        {/* Emergency note */}
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-400 flex items-center justify-center gap-1.5">
            <svg
              className="w-3.5 h-3.5 text-red-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            If your condition worsens, visit the emergency desk immediately
          </p>
        </div>
      </div>
    </div>
  );
}
