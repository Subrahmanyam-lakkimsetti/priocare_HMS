import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createProfile, updateProfile } from '../profileThunks';

const initialState = {
  firstName: '',
  lastName: '',
  age: '',
  gender: '',
  phoneNumber: '',
  address: '',
  bloodGroup: '',
  insuranceDetails: '',
  photo: null,
};

const fields = [
  'firstName',
  'lastName',
  'age',
  'gender',
  'phoneNumber',
  'address',
  'bloodGroup',
  'insuranceDetails',
];

const requiredFields = [
  'firstName',
  'lastName',
  'age',
  'gender',
  'phoneNumber',
  'address',
  'bloodGroup',
];

const validate = (form) => {
  const errors = {};
  if (!form.firstName.trim()) errors.firstName = 'First name is required.';
  if (!form.lastName.trim()) errors.lastName = 'Last name is required.';
  if (!form.age) {
    errors.age = 'Age is required.';
  } else if (Number(form.age) < 0 || Number(form.age) > 150) {
    errors.age = 'Enter a valid age.';
  }
  if (!form.gender) errors.gender = 'Please select a gender.';
  if (!form.phoneNumber.trim()) {
    errors.phoneNumber = 'Phone number is required.';
  } else if (!/^\d{10}$/.test(form.phoneNumber.trim())) {
    errors.phoneNumber = 'Enter a valid 10-digit phone number.';
  }
  if (!form.address.trim()) errors.address = 'Address is required.';
  if (!form.bloodGroup) errors.bloodGroup = 'Please select a blood group.';
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

const ProfileForm = ({ existingProfile, onDone }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
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
        formData.append(field, field === 'age' ? Number(value) : value);
      }
    });
    if (form.photo) formData.append('photo', form.photo);

    try {
      let result;
      if (existingProfile) {
        result = await dispatch(updateProfile(formData));
      } else {
        result = await dispatch(createProfile(formData));
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
      {/* Back Button — matches ProfileView style */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-5 transition-colors group"
      >
        <svg
          className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Back
      </button>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-3 py-1 mb-2">
                <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse" />
                <span className="text-cyan-200 text-xs font-semibold tracking-wide">
                  {existingProfile ? 'Edit Mode' : 'New Profile'}
                </span>
              </div>
              <h2 className="text-lg font-bold text-white">
                {existingProfile
                  ? 'Update your information'
                  : 'Set up your profile'}
              </h2>
              <p className="text-blue-200/70 text-xs mt-0.5">
                Fill in the required fields marked with *
              </p>
            </div>
            {/* Progress ring */}
            <div className="relative w-14 h-14 shrink-0">
              <svg className="w-14 h-14 -rotate-90" viewBox="0 0 56 56">
                <circle
                  cx="28"
                  cy="28"
                  r="22"
                  fill="none"
                  stroke="rgba(255,255,255,0.15)"
                  strokeWidth="5"
                />
                <circle
                  cx="28"
                  cy="28"
                  r="22"
                  fill="none"
                  stroke={progress === 100 ? '#34d399' : '#67e8f9'}
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 22}`}
                  strokeDashoffset={`${2 * Math.PI * 22 * (1 - progress / 100)}`}
                  className="transition-all duration-500"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white font-black text-xs">
                  {progress}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* API Error Banner */}
        {apiError && (
          <div className="mx-6 mt-5 flex items-start gap-3 px-4 py-3 rounded-xl bg-red-50 border border-red-200">
            <div className="shrink-0 mt-0.5 w-5 h-5 rounded-full bg-red-100 flex items-center justify-center">
              <svg
                className="w-3 h-3 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={3}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-red-700">
                Submission failed
              </p>
              <p className="text-xs text-red-600 mt-0.5">{apiError}</p>
            </div>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          noValidate
          className="flex flex-col gap-5 p-6"
        >
          {/* Name row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField label="First Name" required error={errors.firstName}>
              <input
                type="text"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                placeholder="John"
                className={inputClass(!!errors.firstName)}
              />
            </InputField>
            <InputField label="Last Name" required error={errors.lastName}>
              <input
                type="text"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                placeholder="Doe"
                className={inputClass(!!errors.lastName)}
              />
            </InputField>
          </div>

          {/* Age + Gender */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField label="Age" required error={errors.age}>
              <input
                type="number"
                name="age"
                min="0"
                max="150"
                value={form.age}
                onChange={handleChange}
                placeholder="28"
                className={inputClass(!!errors.age)}
              />
            </InputField>
            <InputField label="Gender" required error={errors.gender}>
              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                className={inputClass(!!errors.gender)}
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </InputField>
          </div>

          {/* Phone + Blood Group */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                placeholder="9876543210"
                maxLength="10"
                className={inputClass(!!errors.phoneNumber)}
              />
            </InputField>
            <InputField label="Blood Group" required error={errors.bloodGroup}>
              <select
                name="bloodGroup"
                value={form.bloodGroup}
                onChange={handleChange}
                className={inputClass(!!errors.bloodGroup)}
              >
                <option value="">Select blood group</option>
                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </InputField>
          </div>

          {/* Address */}
          <InputField label="Address" required error={errors.address}>
            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="123 Main Street, City, State"
              rows={3}
              className={`${inputClass(!!errors.address)} resize-none`}
            />
          </InputField>

          {/* Insurance */}
          <InputField label="Insurance Details">
            <input
              type="text"
              name="insuranceDetails"
              value={form.insuranceDetails}
              onChange={handleChange}
              placeholder="Provider name, policy number (optional)"
              className={inputClass(false)}
            />
          </InputField>

          {/* Photo Upload */}
          <InputField label="Profile Photo">
            <label
              className={`flex items-center gap-3 px-4 py-3 rounded-xl border border-dashed cursor-pointer transition-colors group ${
                form.photo
                  ? 'border-blue-400 bg-blue-50'
                  : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50/30'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                  form.photo
                    ? 'bg-blue-100'
                    : 'bg-gray-100 group-hover:bg-blue-100'
                }`}
              >
                <svg
                  className={`w-4 h-4 ${form.photo ? 'text-blue-600' : 'text-gray-500 group-hover:text-blue-600'}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                  />
                </svg>
              </div>
              <div>
                <p
                  className={`text-sm font-medium transition-colors ${form.photo ? 'text-blue-700' : 'text-gray-700 group-hover:text-blue-600'}`}
                >
                  {form.photo ? form.photo.name : 'Click to upload photo'}
                </p>
                <p className="text-xs text-gray-400">PNG, JPG up to 5MB</p>
              </div>
              <input
                type="file"
                name="photo"
                accept="image/*"
                onChange={handleChange}
                className="hidden"
              />
            </label>
          </InputField>

          {/* Error count summary */}
          {Object.keys(errors).filter((k) => errors[k]).length > 0 && (
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-50 border border-amber-200">
              <svg
                className="w-4 h-4 text-amber-500 shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="text-xs font-semibold text-amber-700">
                Please fix {Object.keys(errors).filter((k) => errors[k]).length}{' '}
                error
                {Object.keys(errors).filter((k) => errors[k]).length !== 1
                  ? 's'
                  : ''}{' '}
                before submitting.
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
            {existingProfile && onDone && (
              <button
                type="button"
                onClick={onDone}
                className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 disabled:opacity-60 text-white text-sm font-bold transition-colors shadow-sm"
            >
              {submitting && (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              )}
              {existingProfile ? 'Save Changes' : 'Create Profile'}
            </button>
            {!existingProfile && (
              <span className="text-xs text-gray-400 ml-1">
                {completedCount} of {requiredFields.length} required fields
                filled
              </span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileForm;
