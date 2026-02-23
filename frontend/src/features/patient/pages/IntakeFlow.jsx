import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import DescriptionStep from '../steps/DescriptionStep';
import SymptomsStep from '../steps/SymptomsStep';
import ConditionsStep from '../steps/ConditionsStep';
import AgeStep from '../steps/AgeStep';
import VitalsStep from '../steps/VitalsStep';
import DateStep from '../steps/DateStep';
import ReviewStep from '../steps/ReviewStep';
import { openReview, resetIntake } from '../patientSlice';

const STEPS = [
  {
    id: 'description',
    required: true,
    number: '01',
    label: 'Chief Complaint',
    sublabel: 'Describe what brought you here',
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.8}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
        />
      </svg>
    ),
    component: <DescriptionStep />,
    checkKey: 'description',
  },
  {
    id: 'symptoms',
    required: true,
    number: '02',
    label: 'Symptoms',
    sublabel: 'Select everything you are experiencing',
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.8}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
        />
      </svg>
    ),
    component: <SymptomsStep />,
    checkKey: 'symptoms',
  },
  {
    id: 'conditions',
    required: false,
    number: '03',
    label: 'Medical History',
    sublabel: 'Pre-existing conditions or allergies',
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.8}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
    ),
    component: <ConditionsStep />,
    checkKey: null,
  },
  {
    id: 'age',
    required: true,
    number: '04',
    label: 'Patient Age',
    sublabel: 'Used to match the right specialist',
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.8}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
        />
      </svg>
    ),
    component: <AgeStep />,
    checkKey: 'age',
  },
  {
    id: 'vitals',
    required: false,
    number: '05',
    label: 'Vitals',
    sublabel: 'Blood pressure, temperature if available',
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.8}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 12h2l2-8 4 16 4-8 2 8h2"
        />
      </svg>
    ),
    component: <VitalsStep />,
    checkKey: null,
  },
  {
    id: 'date',
    required: true,
    number: '06',
    label: 'Appointment Date',
    sublabel: 'Choose your preferred consultation date',
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.8}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
    ),
    component: <DateStep />,
    checkKey: 'date',
  },
];

export default function IntakeFlow() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const intake = useSelector((s) => s.patient.intake);
  const [showOptional, setShowOptional] = useState(false);

  const checks = {
    description: intake.description?.length > 10,
    symptoms: intake.symptoms?.length > 0,
    age: !!intake.age,
    date: !!intake.scheduledDate,
  };

  const completed = Object.values(checks).filter(Boolean).length;
  const progress = Math.round((completed / 4) * 100);
  const ready = completed === 4;

  // Separate required and optional steps
  const requiredSteps = STEPS.filter((step) => step.required);
  const optionalSteps = STEPS.filter((step) => !step.required);

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* LEFT PANEL */}
      <div className="hidden ml-60 xl:flex w-75 shrink-0 flex-col bg-linear-to-b from-blue-900 via-blue-800 to-blue-900 border-r border-blue-700/50 overflow-hidden h-screen">
        <div className="absolute top-0 right-0 w-40 h-40 bg-cyan-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-20 left-0 w-32 h-32 bg-blue-400/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col h-full px-6 py-8 overflow-y-auto">
          {/* Title */}
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-3 py-1 mb-4">
              <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse" />
              <span className="text-cyan-200 text-xs font-semibold tracking-wide">
                AI Analysis Ready
              </span>
            </div>
            <h2 className="text-xl font-bold text-white leading-tight">
              Consultation
              <br />
              Form
            </h2>
            <p className="text-blue-200/70 text-xs mt-2 leading-relaxed">
              Complete all required sections for accurate AI triage
            </p>
          </div>

          {/* Circular progress */}
          <div className="flex items-center gap-4 bg-white/10 border border-white/15 rounded-2xl p-4 mb-6">
            <div className="relative w-16 h-16 shrink-0">
              <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
                <circle
                  cx="32"
                  cy="32"
                  r="26"
                  fill="none"
                  stroke="rgba(255,255,255,0.15)"
                  strokeWidth="6"
                />
                <circle
                  cx="32"
                  cy="32"
                  r="26"
                  fill="none"
                  stroke={ready ? '#34d399' : '#67e8f9'}
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 26}`}
                  strokeDashoffset={`${2 * Math.PI * 26 * (1 - progress / 100)}`}
                  className="transition-all duration-700"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white font-black text-sm">
                  {progress}%
                </span>
              </div>
            </div>
            <div>
              <p className="text-white font-bold text-base">
                {completed}{' '}
                <span className="text-white/50 font-normal text-sm">of 4</span>
              </p>
              <p className="text-blue-200/70 text-xs mt-0.5">required done</p>
              {ready && (
                <p className="text-emerald-400 text-xs font-bold mt-1">
                  ✓ Ready to submit
                </p>
              )}
            </div>
          </div>

          {/* Steps list */}
          <div className="flex-1 space-y-1 overflow-y-auto">
            {STEPS.map((step) => {
              const done = step.checkKey ? checks[step.checkKey] : false;
              return (
                <div
                  key={step.id}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${done ? 'bg-white/15' : 'bg-white/5 opacity-70'}`}
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-bold transition-all ${
                      done
                        ? 'bg-cyan-400 text-blue-900'
                        : 'bg-white/10 text-white/40'
                    }`}
                  >
                    {done ? (
                      <svg
                        className="w-3.5 h-3.5"
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
                    ) : (
                      step.number
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-xs font-semibold truncate ${done ? 'text-white' : 'text-white/50'}`}
                    >
                      {step.label}
                    </p>
                    {!step.required && (
                      <span className="text-white/30 text-xs">Optional</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom tip */}
          <div className="mt-6 bg-white/8 border border-white/15 rounded-xl p-4">
            <p className="text-cyan-300 text-xs font-bold mb-1">
              💡 Better details = better care
            </p>
            <p className="text-white/50 text-xs leading-relaxed">
              Our AI reads your form to prioritize your case and find the most
              suitable doctor.
            </p>
          </div>
        </div>
      </div>

      {/* CENTER FORM AREA */}
      <div className="flex-1 min-w-0 overflow-y-auto">
        <div className="px-6 py-8 lg:px-10">
          {/* Header with Back button */}
          <div className="mb-6">
            <button
              onClick={handleGoBack}
              className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-4 transition-colors"
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
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              <span className="text-sm font-medium">Back</span>
            </button>

            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Tell us about your health concern
            </h1>
            <p className="text-gray-500">
              Please complete the required information below. Any additional
              details help us provide better care.
            </p>
          </div>

          {/* REQUIRED SECTIONS */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1 h-6 bg-blue-600 rounded-full"></div>
              <h2 className="text-lg font-semibold text-gray-900">
                Required Information
              </h2>
            </div>

            {requiredSteps.map((step) => {
              const done = checks[step.checkKey];

              return (
                <div
                  key={step.id}
                  className={`bg-white rounded-xl overflow-hidden transition-all duration-300 ${
                    done
                      ? 'border-l-4 border-green-500 shadow-sm'
                      : 'border-l-4 border-blue-500 shadow-sm hover:shadow-md'
                  }`}
                >
                  <div className="px-6 py-4 bg-gray-100">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          done ? 'bg-green-100' : 'bg-blue-100'
                        }`}
                      >
                        <span
                          className={`text-xs font-bold ${
                            done ? 'text-green-700' : 'text-blue-700'
                          }`}
                        >
                          {step.number}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-gray-900">
                            {step.label}
                          </h3>
                          <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
                            Required
                          </span>
                        </div>
                        <p className="text-xs text-gray-500">{step.sublabel}</p>
                      </div>
                      {done && (
                        <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                          ✓ Completed
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-6">{step.component}</div>
                </div>
              );
            })}
          </div>

          {/* OPTIONAL SECTIONS */}
          <div className="mt-8">
            <button
              onClick={() => setShowOptional(!showOptional)}
              className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-gray-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-gray-900">
                    Additional Information
                  </h3>
                  <p className="text-sm text-gray-500">
                    Optional - helps us understand your health better
                  </p>
                </div>
              </div>
              <svg
                className={`w-5 h-5 text-gray-400 transition-transform ${showOptional ? 'rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {showOptional && (
              <div className="mt-3 space-y-4">
                {optionalSteps.map((step) => (
                  <div
                    key={step.id}
                    className="bg-white rounded-xl border border-gray-200 overflow-hidden"
                  >
                    <div className="px-6 py-4 bg-gray-100">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                          {step.icon}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {step.label}
                          </h3>
                          <p className="text-xs text-gray-500">
                            {step.sublabel}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="p-6">{step.component}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action row */}
          <div className="flex gap-3 mt-8 mb-10">
            <button
              onClick={handleGoBack}
              className="px-6 py-3 rounded-xl text-sm font-medium text-gray-600 border border-gray-200 hover:bg-gray-50 active:scale-95 transition-all inline-flex items-center gap-2"
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
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back
            </button>

            <button
              onClick={() => dispatch(resetIntake())}
              className="px-6 py-3 rounded-xl text-sm font-medium text-gray-600 border border-gray-200 hover:bg-gray-50 active:scale-95 transition-all"
            >
              Clear Form
            </button>

            <button
              onClick={() => ready && dispatch(openReview())}
              className={`flex-1 py-3 px-6 rounded-xl text-sm font-bold active:scale-95 transition-all ${
                ready
                  ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              {ready
                ? 'Review & Submit'
                : `Complete ${4 - completed} more required section${4 - completed !== 1 ? 's' : ''}`}
            </button>
          </div>

          {/* Emergency notice */}
          <div className="p-4 bg-red-50 rounded-xl border border-red-100">
            <div className="flex items-start gap-3">
              <svg
                className="w-5 h-5 text-red-500 shrink-0 mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <div>
                <p className="text-sm font-semibold text-red-700">
                  Medical Emergency?
                </p>
                <p className="text-sm text-red-600">
                  Please do not use this form. Call emergency services (911) or
                  go to the nearest emergency room immediately.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="hidden xl:flex w-64 shrink-0 flex-col bg-gray-50/80 border-l border-gray-100 h-screen overflow-hidden">
        <div className="px-5 py-8 overflow-y-auto flex flex-col gap-5">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
              Completion Status
            </p>
            <div className="space-y-2">
              {STEPS.filter((s) => s.required).map((step) => {
                const done = step.checkKey ? checks[step.checkKey] : false;
                return (
                  <div
                    key={step.id}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-xl ${done ? 'bg-blue-50 border border-blue-100' : 'bg-white border border-gray-100'}`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${done ? 'bg-blue-600' : 'bg-gray-200'}`}
                    >
                      {done ? (
                        <svg
                          className="w-3 h-3 text-white"
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
                      ) : (
                        <span className="w-2 h-2 bg-gray-400 rounded-full" />
                      )}
                    </div>
                    <span
                      className={`text-xs font-semibold ${done ? 'text-blue-700' : 'text-gray-500'}`}
                    >
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-blue-700 rounded-2xl p-4 text-white">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center mb-3">
              <svg
                className="w-4 h-4 text-white"
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
            <p className="text-white font-bold text-xs mb-2">
              How AI Uses This
            </p>
            <ul className="space-y-1.5">
              {[
                'Assigns your priority score',
                'Picks the best available doctor',
                'Estimates your wait time',
              ].map((item) => (
                <li key={item} className="flex items-start gap-1.5">
                  <span className="text-cyan-300 mt-0.5">·</span>
                  <span className="text-white/70 text-xs leading-relaxed">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <svg
                className="w-4 h-4 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              <p className="text-xs font-bold text-gray-700">
                Your Data is Safe
              </p>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              All information is encrypted and only shared with your assigned
              doctor. HIPAA compliant.
            </p>
          </div>

          <div className="bg-red-50 border border-red-100 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-1.5">
              <svg
                className="w-4 h-4 text-red-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="text-xs font-bold text-red-600">Emergency?</p>
            </div>
            <p className="text-xs text-red-500 leading-relaxed">
              Do not use this form. Go to the emergency desk immediately.
            </p>
          </div>
        </div>
      </div>

      <ReviewStep />
    </div>
  );
}
