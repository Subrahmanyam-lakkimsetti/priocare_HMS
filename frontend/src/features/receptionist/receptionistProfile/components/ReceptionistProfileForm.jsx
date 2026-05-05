import { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  createReceptionistProfile,
  updateReceptionistProfile,
} from '../profileThunks';

const initialState = {
  firstName: '',
  lastName: '',
  phoneNumber: '',
  photo: null,
};

const fields = ['firstName', 'lastName', 'phoneNumber'];

const requiredFields = ['firstName', 'lastName', 'phoneNumber'];

const validate = (form) => {
  const errors = {};
  if (!form.firstName.trim()) errors.firstName = 'First name is required.';
  if (!form.lastName.trim()) errors.lastName = 'Last name is required.';
  if (!form.phoneNumber.trim()) {
    errors.phoneNumber = 'Phone number is required.';
  } else if (!/^\d{10}$/.test(form.phoneNumber.trim())) {
    errors.phoneNumber = 'Enter a valid 10-digit phone number.';
  }
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

const ReceptionistProfileForm = ({ existingProfile, onDone }) => {
  const dispatch = useDispatch();
  const [form, setForm] = useState(
    existingProfile ? { ...existingProfile, photo: null } : initialState,
  );
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setForm((prev) => ({ ...prev, photo: files[0] }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
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
    fields.forEach((field) => {
      const value = form[field];
      if (value !== '' && value !== null && value !== undefined) {
        formData.append(field, value);
      }
    });
    if (form.photo) formData.append('photo', form.photo);

    try {
      let result;
      if (existingProfile) {
        result = await dispatch(updateReceptionistProfile(formData));
      } else {
        result = await dispatch(createReceptionistProfile(formData));
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
    if (f === 'phoneNumber') return /^\d{10}$/.test(form[f]);
    return !!form[f];
  }).length;
  const progress = Math.round((completedCount / requiredFields.length) * 100);

  return (
    <div className="w-full">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="bg-linear-to-r from-sky-900 via-sky-800 to-sky-900 px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white">
                {existingProfile ? 'Update Your' : 'Complete Your'} Profile
              </h2>
              <p className="text-sm text-sky-100 mt-1">
                Provide your details to get started
              </p>
            </div>
          </div>
          {/* Progress bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-sky-100">Progress</span>
              <span className="text-xs font-semibold text-sky-100">
                {progress}%
              </span>
            </div>
            <div className="h-2 bg-sky-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-sky-400 to-cyan-400 transition-all duration-500"
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
              <span className="w-1 h-5 bg-sky-500 rounded-full"></span>
              Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField label="First Name" required error={errors.firstName}>
                <input
                  type="text"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  className={inputClass(!!errors.firstName)}
                  placeholder="John"
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

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <span className="w-1 h-5 bg-sky-500 rounded-full"></span>
              Contact Information
            </h3>
            <InputField
              label="Phone Number"
              required
              error={errors.phoneNumber}
            >
              <input
                type="tel"
                name="phoneNumber"
                value={form.phoneNumber}
                onChange={handleChange}
                className={inputClass(!!errors.phoneNumber)}
                placeholder="e.g., 9876543210"
                maxLength="10"
              />
            </InputField>
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-6">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-sky-600 to-cyan-600 text-white font-semibold shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
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

export default ReceptionistProfileForm;
