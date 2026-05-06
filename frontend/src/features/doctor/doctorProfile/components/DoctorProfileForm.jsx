import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createDoctorProfile, updateDoctorProfile } from '../profileThunks';

const initialState = {
  firstName: '',
  lastName: '',
  specializations: '',
  department: '',
  experienceYears: '',
  consultationFee: '',
  MaxDailyAppointments: '20',
  workingHours: {
    start: '09:00',
    end: '17:00',
  },
  availableDays: [],
  photo: null,
};

const fields = [
  'firstName',
  'lastName',
  'specializations',
  'department',
  'experienceYears',
  'consultationFee',
  'workingHours',
  'availableDays',
];

const requiredFields = [
  'firstName',
  'lastName',
  'specializations',
  'department',
  'experienceYears',
  'consultationFee',
  'workingHours',
  'availableDays',
];

const DEPARTMENTS = [
  'Cardiology',
  'Neurology',
  'Orthopedics',
  'Pediatrics',
  'General Medicine',
  'Surgery',
  'Dermatology',
  'Psychiatry',
  'Ophthalmology',
  'ENT',
];

const AVAILABLE_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const toText = (value) => {
  if (Array.isArray(value)) {
    return value.join(', ');
  }

  return value ?? '';
};

const splitSpecializations = (value) =>
  String(value || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

const validate = (form) => {
  const errors = {};
  if (!form.firstName.trim()) errors.firstName = 'First name is required.';
  if (!form.lastName.trim()) errors.lastName = 'Last name is required.';
  if (!toText(form.specializations).trim())
    errors.specializations = 'Specializations are required.';
  if (!form.department) errors.department = 'Please select a department.';
  if (!form.experienceYears) {
    errors.experienceYears = 'Experience years is required.';
  } else if (
    Number(form.experienceYears) < 0 ||
    Number(form.experienceYears) > 70
  ) {
    errors.experienceYears = 'Enter a valid experience range (0-70 years).';
  }
  if (!form.consultationFee) {
    errors.consultationFee = 'Consultation fee is required.';
  } else if (Number(form.consultationFee) < 50) {
    errors.consultationFee = 'Consultation fee must be at least 50.';
  }
  if (!form.workingHours.start || !form.workingHours.end)
    errors.workingHours = 'Working hours are required.';
  if (!form.availableDays || form.availableDays.length === 0)
    errors.availableDays = 'Please select at least one available day.';
  return errors;
};

const InputField = ({ label, required, error, children }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
      {label} {required && <span className="text-red-400">*</span>}
    </label>
    {children}
    {error && (
      <span className="flex items-center gap-1.5 text-xs text-red-500 mt-0.5">
        <svg
          className="w-3 h-3 shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
          />
        </svg>
        {error}
      </span>
    )}
  </div>
);

const inputClass = (hasError) =>
  `w-full px-3.5 py-2.5 rounded-xl border text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 transition-all bg-white ${
    hasError
      ? 'border-red-300 focus:ring-red-400/20 focus:border-red-400'
      : 'border-gray-200 focus:ring-blue-500/20 focus:border-blue-400'
  }`;

const DoctorProfileForm = ({ existingProfile, onDone }) => {
  const dispatch = useDispatch();
  const [form, setForm] = useState(
    existingProfile
      ? {
          ...initialState,
          ...existingProfile,
          specializations: toText(existingProfile.specializations),
          workingHours:
            existingProfile.workingHours ?? initialState.workingHours,
          availableDays: Array.isArray(existingProfile.availableDays)
            ? existingProfile.availableDays
            : initialState.availableDays,
          photo: null,
        }
      : initialState,
  );
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setForm((prev) => ({ ...prev, photo: files[0] }));
    } else if (name.includes('workingHours.')) {
      const field = name.split('.')[1];
      setForm((prev) => ({
        ...prev,
        workingHours: { ...prev.workingHours, [field]: value },
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
    setApiError(null);
  };

  const handleDayToggle = (day) => {
    setForm((prev) => ({
      ...prev,
      availableDays: prev.availableDays.includes(day)
        ? prev.availableDays.filter((d) => d !== day)
        : [...prev.availableDays, day],
    }));
    if (errors.availableDays)
      setErrors((prev) => ({ ...prev, availableDays: null }));
    setApiError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError(null);

    const clientErrors = validate(form);
    if (Object.keys(clientErrors).length > 0) {
      setErrors(clientErrors);
      const firstErrorKey = Object.keys(clientErrors)[0];
      document
        .querySelector(`[name="${firstErrorKey}"]`)
        ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setSubmitting(true);
    const formData = new FormData();

    formData.append('firstName', form.firstName);
    formData.append('lastName', form.lastName);
    splitSpecializations(form.specializations).forEach((item) =>
      formData.append('specializations', item),
    );
    formData.append('department', form.department);
    formData.append('experienceYears', Number(form.experienceYears));
    formData.append('consultationFee', Number(form.consultationFee));
    formData.append('MaxDailyAppointments', Number(form.MaxDailyAppointments));
    formData.append('workingHours[start]', form.workingHours.start);
    formData.append('workingHours[end]', form.workingHours.end);
    form.availableDays.forEach((day) => formData.append('availableDays', day));
    if (form.photo) formData.append('photo', form.photo);

    try {
      let result;
      if (existingProfile) {
        result = await dispatch(updateDoctorProfile(formData));
      } else {
        result = await dispatch(createDoctorProfile(formData));
      }

      const isFail =
        result?.error ||
        result?.payload?.status === 'fail' ||
        result?.payload?.status === 'error';

      if (isFail) {
        const msg =
          result?.payload?.message ||
          result?.payload?.data?.message ||
          result?.error?.message ||
          'Something went wrong. Please try again.';
        setApiError(msg);
      } else {
        onDone?.();
      }
    } catch {
      setApiError('An unexpected error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const completedCount = requiredFields.filter((f) => {
    if (f === 'availableDays') return form.availableDays.length > 0;
    if (f === 'workingHours')
      return !!form.workingHours.start && !!form.workingHours.end;
    return !!form[f];
  }).length;
  const progress = Math.round((completedCount / requiredFields.length) * 100);

  return (
    <div className="w-full">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="bg-linear-to-r from-blue-900 via-blue-800 to-blue-900 px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white">
                {existingProfile ? 'Update Your' : 'Complete Your'} Medical
                Profile
              </h2>
              <p className="text-sm text-blue-100 mt-1">
                Provide your professional details for your medical practice
              </p>
            </div>
          </div>
          {/* Progress bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-blue-100">
                Progress
              </span>
              <span className="text-xs font-semibold text-blue-100">
                {progress}%
              </span>
            </div>
            <div className="h-2 bg-blue-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-linear-to-r from-blue-400 to-cyan-400 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-6 space-y-6">
          {apiError && (
            <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3">
              <div className="flex items-start gap-3">
                <svg
                  className="w-5 h-5 text-red-500 shrink-0 mt-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div>
                  <p className="text-sm font-medium text-red-800">Error</p>
                  <p className="text-xs text-red-600 mt-0.5">{apiError}</p>
                </div>
              </div>
            </div>
          )}

          {/* Basic Info */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <span className="w-1 h-5 bg-blue-500 rounded-full"></span>
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField label="First Name" required error={errors.firstName}>
                <input
                  type="text"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  className={inputClass(!!errors.firstName)}
                  placeholder="Dr. John"
                />
              </InputField>
              <InputField label="Last Name" required error={errors.lastName}>
                <input
                  type="text"
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  className={inputClass(!!errors.lastName)}
                  placeholder="Doe"
                />
              </InputField>
            </div>
          </div>

          {/* Professional Details */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <span className="w-1 h-5 bg-blue-500 rounded-full"></span>
              Professional Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label="Specializations"
                required
                error={errors.specializations}
              >
                <input
                  type="text"
                  name="specializations"
                  value={form.specializations}
                  onChange={handleChange}
                  className={inputClass(!!errors.specializations)}
                  placeholder="e.g., Cardiology, Internal Medicine"
                />
              </InputField>
              <InputField label="Department" required error={errors.department}>
                <select
                  name="department"
                  value={form.department}
                  onChange={handleChange}
                  className={inputClass(!!errors.department)}
                >
                  <option value="">Select Department</option>
                  {DEPARTMENTS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </InputField>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label="Experience (Years)"
                required
                error={errors.experienceYears}
              >
                <input
                  type="number"
                  name="experienceYears"
                  value={form.experienceYears}
                  onChange={handleChange}
                  className={inputClass(!!errors.experienceYears)}
                  placeholder="e.g., 10"
                  min="0"
                  max="70"
                />
              </InputField>
              <InputField
                label="Consultation Fee (₹)"
                required
                error={errors.consultationFee}
              >
                <input
                  type="number"
                  name="consultationFee"
                  value={form.consultationFee}
                  onChange={handleChange}
                  className={inputClass(!!errors.consultationFee)}
                  placeholder="e.g., 500"
                  min="50"
                />
              </InputField>
            </div>
          </div>

          {/* Working Hours */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <span className="w-1 h-5 bg-blue-500 rounded-full"></span>
              Working Hours
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label="Start Time"
                required
                error={errors.workingHours}
              >
                <input
                  type="time"
                  name="workingHours.start"
                  value={form.workingHours.start}
                  onChange={handleChange}
                  className={inputClass(false)}
                />
              </InputField>
              <InputField label="End Time" required error={errors.workingHours}>
                <input
                  type="time"
                  name="workingHours.end"
                  value={form.workingHours.end}
                  onChange={handleChange}
                  className={inputClass(false)}
                />
              </InputField>
            </div>
          </div>

          {/* Available Days */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <span className="w-1 h-5 bg-blue-500 rounded-full"></span>
              Available Days
            </h3>
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_DAYS.map((day) => (
                <button
                  key={day}
                  type="button"
                  onClick={() => handleDayToggle(day)}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                    form.availableDays.includes(day)
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
            {errors.availableDays && (
              <span className="flex items-center gap-1.5 text-xs text-red-500">
                <svg
                  className="w-3 h-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                  />
                </svg>
                {errors.availableDays}
              </span>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-6">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-6 py-3 rounded-xl bg-linear-to-r from-blue-600 to-cyan-600 text-white font-semibold shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {submitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="w-4 h-4 animate-spin"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Saving...
                </span>
              ) : (
                'Complete Profile'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DoctorProfileForm;
