import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { closeDoctorPicker, selectDoctor } from '../patientSlice';
import { fetchAvailableDoctors } from '../patientThunks';

const severityColors = {
  low: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    dot: 'bg-emerald-500',
  },
  medium: {
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
    dot: 'bg-amber-500',
  },
  high: {
    bg: 'bg-red-50',
    text: 'text-red-700',
    border: 'border-red-200',
    dot: 'bg-red-500',
  },
};

function LoadingPulse({ message }) {
  return (
    <div className="flex flex-col items-center justify-center py-14 px-6 gap-4">
      {/* Animated rings */}
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-4 border-blue-100" />
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500 animate-spin" />
        <div
          className="absolute inset-2 rounded-full border-4 border-transparent border-t-cyan-400 animate-spin"
          style={{ animationDuration: '0.8s', animationDirection: 'reverse' }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <svg
            className="w-5 h-5 text-blue-600"
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
      <div className="text-center">
        <p className="text-gray-800 font-semibold text-base">{message}</p>
        <p className="text-gray-400 text-sm mt-1">
          This usually takes a few seconds
        </p>
      </div>
      {/* Step indicators */}
      <div className="flex flex-col gap-2 w-full max-w-xs mt-2">
        {[
          { label: 'Analysing your symptoms & vitals', done: true },
          { label: 'Identifying recommended specialization', done: true },
          { label: 'Finding available doctors', done: false },
        ].map((step, i) => (
          <div
            key={i}
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-gray-50 border border-gray-100"
          >
            <div
              className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${step.done ? 'bg-blue-500' : 'bg-gray-200'}`}
            >
              {step.done ? (
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
              ) : (
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" />
              )}
            </div>
            <span
              className={`text-xs font-medium ${step.done ? 'text-gray-700' : 'text-gray-400'}`}
            >
              {step.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function DoctorCard({ doctor, isSelected, onSelect }) {
  const initials =
    `${doctor.firstName?.[0] ?? ''}${doctor.lastName?.[0] ?? ''}`.toUpperCase();

  const availableSlots =
    (doctor.MaxDailyAppointments || 0) - (doctor.totalAppointments || 0);
  const isAvailable = availableSlots > 0;
  const availabilityPercentage =
    ((doctor.totalAppointments || 0) / (doctor.MaxDailyAppointments || 1)) *
    100;

  return (
    <div
      className={`rounded-xl border-2 transition-all duration-200 overflow-hidden ${
        isSelected
          ? 'border-blue-500 bg-gradient-to-br from-blue-50/50 to-white shadow-lg shadow-blue-100/50'
          : 'border-gray-100 bg-white hover:border-blue-200 hover:shadow-md hover:bg-gradient-to-br hover:from-blue-50/20 hover:to-white'
      }`}
    >
      <div className="p-4">
        <div className="flex gap-4">
          {/* Left Column - Profile */}
          <div className="flex-shrink-0">
            <div className="relative">
              <div
                className={`w-20 h-20 rounded-2xl flex items-center justify-center font-bold text-xl ${
                  isSelected
                    ? 'bg-blue-500 text-white'
                    : 'bg-gradient-to-br from-gray-100 to-gray-50 text-gray-600'
                } transition-all duration-200 shadow-sm`}
              >
                {initials}
              </div>
              {/* Availability Badge */}
              <div className="absolute -bottom-1 -right-1">
                <div
                  className={`w-4 h-4 rounded-full ${isAvailable ? 'bg-green-500' : 'bg-red-500'} border-2 border-white shadow-sm`}
                />
              </div>
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="flex-1 min-w-0">
            {/* Name and Specialization */}
            <div>
              <h3 className="font-bold text-gray-900 text-base">
                Dr. {doctor.firstName} {doctor.lastName}
              </h3>
              <p className="text-xs text-blue-600 font-semibold mt-0.5">
                {doctor.specializations?.slice(0, 2).join(' • ')}
                {doctor.specializations?.length > 2 &&
                  ` +${doctor.specializations.length - 2}`}
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-2 mt-3">
              <div className="flex items-center gap-1.5">
                <svg
                  className="w-3.5 h-3.5 text-amber-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-xs font-medium text-gray-700">
                  {doctor.experienceYears} years exp
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <svg
                  className="w-3.5 h-3.5 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-xs font-medium text-gray-700">
                  ₹{doctor.consultationFee}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <svg
                  className="w-3.5 h-3.5 text-blue-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-xs font-medium text-gray-700">
                  {doctor.workingHours?.start}–{doctor.workingHours?.end}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <svg
                  className="w-3.5 h-3.5 text-purple-500"
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
                <span className="text-xs font-medium text-gray-700">
                  {doctor.availableDays?.length} days/week
                </span>
              </div>
            </div>

            {/* Appointment Slots Progress Bar */}
            <div className="mt-3">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-medium text-gray-600">
                  Today's Appointments
                </span>
                <span className="text-xs font-semibold text-gray-700">
                  {doctor.totalAppointments || 0}/
                  {doctor.MaxDailyAppointments || 0}
                </span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    availabilityPercentage >= 80
                      ? 'bg-red-500'
                      : availabilityPercentage >= 50
                        ? 'bg-amber-500'
                        : 'bg-emerald-500'
                  }`}
                  style={{ width: `${Math.min(availabilityPercentage, 100)}%` }}
                />
              </div>
              {availableSlots > 0 ? (
                <p className="text-xs text-green-600 font-medium mt-1">
                  {availableSlots} slot{availableSlots !== 1 ? 's' : ''}{' '}
                  available today
                </p>
              ) : (
                <p className="text-xs text-red-600 font-medium mt-1">
                  Fully booked for today
                </p>
              )}
            </div>

            {/* Available Days Chips */}
            <div className="flex flex-wrap gap-1 mt-2">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => {
                const avail = doctor.availableDays?.includes(day);
                return (
                  <span
                    key={day}
                    className={`text-[10px] px-1.5 py-0.5 rounded font-medium transition-colors ${
                      avail
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    {day}
                  </span>
                );
              })}
            </div>

            {/* Select Button */}
            <button
              onClick={onSelect}
              className={`w-full mt-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                isSelected
                  ? 'bg-blue-500 text-white shadow-md shadow-blue-200'
                  : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700'
              }`}
            >
              {isSelected ? '✓ Doctor Selected' : 'Select Doctor'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DoctorPickerModal() {
  const dispatch = useDispatch();
  const {
    showDoctorPicker,
    loadingDoctors,
    availableDoctors,
    doctorPickerTriage,
    doctorsError,
    selectedDoctor,
    intake,
  } = useSelector((s) => s.patient);

  // Fetch when modal opens
  useEffect(() => {
    if (showDoctorPicker) {
      dispatch(fetchAvailableDoctors(intake));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showDoctorPicker]);

  if (!showDoctorPicker) return null;

  const severity = doctorPickerTriage?.severityLevel;
  const sevColors = severityColors[severity] || severityColors.medium;

  const handleSelectDoctor = (doctor) => {
    dispatch(selectDoctor(doctor));
  };

  const handleClose = () => {
    dispatch(closeDoctorPicker());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal - Wider than before */}
      <div className="relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-gray-100 shrink-0">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Choose Your Doctor
              </h2>
              <p className="text-sm text-gray-500 mt-0.5">
                {loadingDoctors
                  ? 'AI is analysing your details…'
                  : doctorsError
                    ? 'Something went wrong'
                    : `${availableDoctors.length} doctor${availableDoctors.length !== 1 ? 's' : ''} available for your appointment`}
              </p>
            </div>
            <button
              onClick={handleClose}
              className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors shrink-0"
            >
              <svg
                className="w-4 h-4 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Triage summary pill - only showing specialization (no score/severity) */}
          {!loadingDoctors && doctorPickerTriage && (
            <div className="flex flex-wrap gap-2 mt-3">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border bg-blue-50 text-blue-700 border-blue-200">
                <svg
                  className="w-3 h-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
                {doctorPickerTriage.recommendedSpecialization}
              </span>
            </div>
          )}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          {loadingDoctors ? (
            <LoadingPulse message="Analysing your health details…" />
          ) : doctorsError ? (
            <div className="flex flex-col items-center justify-center py-14 px-6 gap-3 text-center">
              <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-red-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <p className="text-gray-700 font-semibold">
                Unable to load doctors
              </p>
              <p className="text-gray-400 text-sm">{doctorsError}</p>
              <button
                onClick={() => dispatch(fetchAvailableDoctors(intake))}
                className="mt-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : availableDoctors.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-14 px-6 gap-3 text-center">
              <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-amber-500"
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
              </div>
              <p className="text-gray-700 font-semibold">
                No doctors available
              </p>
              <p className="text-gray-400 text-sm">
                No {doctorPickerTriage?.recommendedSpecialization} specialists
                are available on the selected date. Try a different date or use
                Auto-Assign.
              </p>
            </div>
          ) : (
            <div className="p-6">
              {/* Grid layout for side-by-side cards */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {availableDoctors.map((doctor) => (
                  <DoctorCard
                    key={doctor._id}
                    doctor={doctor}
                    isSelected={selectedDoctor?._id === doctor._id}
                    onSelect={() => handleSelectDoctor(doctor)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {!loadingDoctors && !doctorsError && availableDoctors.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/80 shrink-0">
            {selectedDoctor ? (
              <div className="flex items-center gap-3">
                <div className="flex-1 flex items-center gap-2.5 bg-blue-50 border border-blue-200 rounded-xl px-3 py-2">
                  <div className="w-7 h-7 bg-blue-500 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0">
                    {`${selectedDoctor.firstName?.[0]}${selectedDoctor.lastName?.[0]}`.toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-blue-500 font-medium">
                      Selected
                    </p>
                    <p className="text-sm font-semibold text-blue-800 truncate">
                      Dr. {selectedDoctor.firstName} {selectedDoctor.lastName}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold transition-colors active:scale-95 shrink-0"
                >
                  Confirm
                </button>
              </div>
            ) : (
              <p className="text-center text-xs text-gray-400 py-1">
                Select a doctor above to continue
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
