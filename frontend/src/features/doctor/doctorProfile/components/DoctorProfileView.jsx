import { useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { updateDoctorProfile } from '../profileThunks';
import DoctorProfileForm from './DoctorProfileForm';

const InfoRow = ({ label, value }) => (
  <div className="flex flex-col gap-1">
    <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
      {label}
    </span>
    <span className="text-base text-gray-900 wrap-break-word">
      {value || <span className="text-gray-400 italic">Not provided</span>}
    </span>
  </div>
);

const Section = ({ title, children }) => (
  <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 hover:shadow-md transition-shadow">
    <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
      <span className="w-1 h-5 bg-blue-500 rounded-full"></span>
      {title}
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">{children}</div>
  </div>
);

const DoctorProfileView = ({ profile }) => {
  const dispatch = useDispatch();
  const [editing, setEditing] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const fileInputRef = useRef(null);

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadError(null);

    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Image size should be less than 5MB');
      return;
    }

    if (!file.type.startsWith('image/')) {
      setUploadError('Please upload an image file (JPEG, PNG, etc.)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      setPhotoPreview(ev.target.result);
    };
    reader.readAsDataURL(file);

    setUploading(true);

    const formData = new FormData();
    formData.append('photo', file);

    try {
      const result = await dispatch(updateDoctorProfile(formData));

      if (result?.error || result?.payload?.status === 'fail') {
        const errorMessage =
          result?.payload?.message || 'Failed to upload photo';
        setUploadError(errorMessage);
        setPhotoPreview(null);
      }
    } catch (error) {
      setUploadError(
        'Network error. Please check your connection and try again.',
      );
      setPhotoPreview(null);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  if (editing) {
    return (
      <div className="w-full">
        <button
          onClick={() => setEditing(false)}
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
          Back to Profile
        </button>
        <DoctorProfileForm
          existingProfile={profile}
          onDone={() => setEditing(false)}
        />
      </div>
    );
  }

  const displayPhoto = photoPreview || profile.photo || null;
  const initials =
    `${profile.firstName?.[0] || ''}${profile.lastName?.[0] || ''}`.toUpperCase();

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-5">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-1">
            My Account
          </p>
          <h1 className="text-2xl font-bold text-gray-900">Medical Profile</h1>
        </div>
      </div>

      {/* Hero Card */}
      <div className="bg-linear-to-br from-white to-gray-50 rounded-xl border border-gray-200 shadow-sm p-5">
        <div className="flex flex-col sm:flex-row items-start gap-5">
          {/* Avatar with upload overlay */}
          <div className="relative shrink-0">
            <div className="w-20 h-20 rounded-xl overflow-hidden bg-linear-to-br from-blue-50 to-cyan-50 flex items-center justify-center border-2 border-white shadow-md">
              {displayPhoto ? (
                <img
                  src={displayPhoto}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-2xl font-bold text-blue-600">
                  {initials || '?'}
                </span>
              )}
              {uploading && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-xl backdrop-blur-sm">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>

            {/* Camera upload button */}
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="absolute -bottom-1 -right-1 w-7 h-7 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 rounded-lg flex items-center justify-center shadow-lg transition-colors"
              title="Update photo"
            >
              <svg
                className="w-3.5 h-3.5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z"
                />
              </svg>
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoChange}
            />
          </div>

          {/* Name & info */}
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold text-gray-900">
              Dr. {profile.firstName} {profile.lastName}
            </h2>
            <p className="text-sm text-gray-600 mt-1 wrap-break-word">
              {profile.userId?.email}
            </p>
            <div className="flex flex-wrap items-center gap-2 mt-3">
              {profile.specializations && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium border border-blue-100">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  {profile.specializations}
                </span>
              )}
              {profile.experienceYears && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium border border-blue-100">
                  {profile.experienceYears}+ yrs
                </span>
              )}
            </div>
          </div>

          {/* Edit button */}
          <button
            onClick={() => setEditing(true)}
            className="shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors shadow-sm"
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
                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125"
              />
            </svg>
            Edit
          </button>
        </div>

        {/* Upload error message */}
        {uploadError && (
          <div className="mt-4">
            <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 flex items-start gap-3">
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
              <div className="flex-1">
                <p className="text-sm font-medium text-red-800">
                  Upload Failed
                </p>
                <p className="text-xs text-red-600 mt-0.5">{uploadError}</p>
              </div>
              <button
                onClick={() => setUploadError(null)}
                className="text-red-400 hover:text-red-600"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Information Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Section title="Professional Information">
          <InfoRow label="Specializations" value={profile.specializations} />
          <InfoRow label="Department" value={profile.department} />
          <InfoRow
            label="Experience"
            value={`${profile.experienceYears} years`}
          />
          <InfoRow
            label="Max Daily Appointments"
            value={profile.MaxDailyAppointments}
          />
        </Section>

        <Section title="Practice Details">
          <InfoRow
            label="Consultation Fee"
            value={`₹${profile.consultationFee}`}
          />
          <InfoRow
            label="Working Hours"
            value={`${profile.workingHours?.start} - ${profile.workingHours?.end}`}
          />
          <InfoRow
            label="Available Days"
            value={profile.availableDays?.join(', ')}
          />
          <InfoRow
            label="Status"
            value={
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                  profile.availabilityStatus === 'available'
                    ? 'bg-green-50 text-green-700 border-green-100'
                    : 'bg-gray-50 text-gray-700 border-gray-100'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    profile.availabilityStatus === 'available'
                      ? 'bg-green-500'
                      : 'bg-gray-500'
                  }`}
                />
                {profile.availabilityStatus}
              </span>
            }
          />
        </Section>
      </div>
    </div>
  );
};

export default DoctorProfileView;
