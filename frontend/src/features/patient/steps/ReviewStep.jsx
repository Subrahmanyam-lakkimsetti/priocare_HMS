import { useDispatch, useSelector } from 'react-redux';
import { closeReview } from '../patientSlice';
import { createAppointment } from '../patientThunks';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const AI_MESSAGES = [
  'Reading your symptoms and complaint...',
  'Cross-referencing with clinical triage models...',
  'Evaluating comorbidities and risk factors...',
  'Calculating your severity level...',
  'Assigning a priority score to your case...',
  'Scanning doctor availability and specialties...',
  'Matching the best available doctor for you...',
  'Finalizing your appointment details...',
  'Generating your unique token number...',
];

function AILoader() {
  const [msgIndex, setMsgIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const cycle = setInterval(() => {
      // fade out → change text → fade in
      setVisible(false);
      setTimeout(() => {
        setMsgIndex((i) => (i + 1) % AI_MESSAGES.length);
        setVisible(true);
      }, 400);
    }, 2200);
    return () => clearInterval(cycle);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Blurred backdrop over the form behind */}
      <div className="absolute inset-0 bg-white/60 backdrop-blur-md" />

      {/* Floating card */}
      <div className="relative z-10 bg-white rounded-2xl shadow-2xl border border-gray-100 w-full max-w-sm px-8 py-10 flex flex-col items-center text-center">
        {/* Spinner ring */}
        <div className="relative w-16 h-16 mb-6">
          <div className="absolute inset-0 rounded-full border-4 border-gray-100" />
          <div className="absolute inset-0 rounded-full border-4 border-blue-600 border-t-transparent animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <svg
              className="w-6 h-6 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
          </div>
        </div>

        <p className="text-base font-bold text-gray-900 mb-2">
          AI is analyzing your case
        </p>

        {/* Cycling message */}
        <p
          className="text-sm text-gray-500 leading-relaxed transition-opacity duration-400 min-h-10"
          style={{ opacity: visible ? 1 : 0 }}
        >
          {AI_MESSAGES[msgIndex]}
        </p>

        {/* Bouncing dots */}
        <div className="flex gap-1.5 mt-6">
          {[0, 1, 2].map((d) => (
            <div
              key={d}
              className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
              style={{ animationDelay: `${d * 150}ms` }}
            />
          ))}
        </div>

        <p className="text-xs text-gray-300 mt-5">
          This usually takes just a few seconds
        </p>
      </div>
    </div>
  );
}

export default function ReviewStep() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { intake, showReview, submitting, success } = useSelector(
    (s) => s.patient,
  );

  useEffect(() => {
    if (success) {
      dispatch(closeReview());
      navigate('/patient/confirmation');
    }
  }, [success]);

  if (!showReview) return null;
  if (submitting) return <AILoader />;

  const formattedDate = intake.scheduledDate
    ? new Date(intake.scheduledDate + 'T00:00:00').toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '—';

  const ROWS = [
    {
      label: 'Problem',
      value: intake.description,
      icon: (
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
            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
          />
        </svg>
      ),
    },
    {
      label: 'Symptoms',
      value: intake.symptoms?.length ? intake.symptoms.join(', ') : '—',
      icon: (
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
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          />
        </svg>
      ),
    },
    {
      label: 'Conditions',
      value: intake.comorbidities?.length
        ? intake.comorbidities.join(', ')
        : 'None reported',
      icon: (
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
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      ),
    },
    {
      label: 'Age',
      value: intake.age ? `${intake.age} years old` : '—',
      icon: (
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
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      ),
    },
    {
      label: 'Date',
      value: formattedDate,
      icon: (
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
      ),
    },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-br from-blue-700 to-cyan-600 px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/70 text-xs font-semibold uppercase tracking-wider mb-0.5">
                Almost done
              </p>
              <h2 className="text-xl font-bold text-white">
                Review Your Consultation
              </h2>
            </div>
            <button
              onClick={() => dispatch(closeReview())}
              className="w-8 h-8 bg-white/15 hover:bg-white/25 rounded-lg flex items-center justify-center text-white transition-colors"
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

        {/* Summary */}
        <div className="px-6 py-4">
          {ROWS.map(({ label, value, icon }) => (
            <div
              key={label}
              className="flex items-start gap-3 py-3 border-b border-gray-50 last:border-0"
            >
              <div className="w-7 h-7 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 text-gray-400 mt-0.5">
                {icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-0.5">
                  {label}
                </p>
                <p className="text-sm text-gray-800 font-medium leading-relaxed">
                  {value}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* AI note */}
        <div className="mx-6 mb-4 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 flex items-start gap-2.5">
          <svg
            className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
          <p className="text-xs text-blue-700 leading-relaxed">
            Our AI will analyze this and automatically assign the most suitable
            available doctor for your case.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 px-6 pb-6">
          <button
            onClick={() => dispatch(closeReview())}
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl border-2 border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50 hover:border-gray-300 transition-all"
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
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            Edit
          </button>

          <button
            onClick={() => dispatch(createAppointment(intake))}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-6 bg-blue-700 hover:bg-blue-800 text-white text-sm font-bold rounded-xl transition-all active:scale-95 shadow-sm"
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
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Confirm & Book
          </button>
        </div>
      </div>
    </div>
  );
}
