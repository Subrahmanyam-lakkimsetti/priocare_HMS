import { useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { updateProfile } from '../profileThunks';
import ProfileForm from './ProfileForm';
import UpdatePasswordForm from './UpdatePasswordForm';

const InfoRow = ({ label, value }) => (
  <div className="flex flex-col gap-1">
    <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
      {label}
    </span>
    <span className="text-base text-gray-900 break-words">
      {value || <span className="text-gray-400 italic">Not provided</span>}
    </span>
  </div>
);

const Section = ({ title, children }) => (
  <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 hover:shadow-md transition-shadow">
    <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
      <span className="w-1 h-5 bg-indigo-500 rounded-full"></span>
      {title}
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">{children}</div>
  </div>
);

const ProfileView = ({ profile }) => {
  const dispatch = useDispatch();
  const [editing, setEditing] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const fileInputRef = useRef(null);

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Clear previous errors
    setUploadError(null);

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Image size should be less than 5MB');
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setUploadError('Please upload an image file (JPEG, PNG, etc.)');
      return;
    }

    // Show preview immediately
    const reader = new FileReader();
    reader.onload = (ev) => {
      setPhotoPreview(ev.target.result);
    };
    reader.readAsDataURL(file);

    // Upload
    setUploading(true);

    const formData = new FormData();
    formData.append('photo', file);

    try {
      const result = await dispatch(updateProfile(formData));

      // Handle error response from backend
      if (result?.error || result?.payload?.status === 'fail') {
        const errorMessage =
          result?.payload?.message || 'Failed to upload photo';
        setUploadError(errorMessage);
        // Revert preview on error
        setPhotoPreview(null);
      }
    } catch (error) {
      setUploadError(
        'Network error. Please check your connection and try again.',
      );
      setPhotoPreview(null);
    } finally {
      setUploading(false);
      // Clear the file input
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
        <ProfileForm
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
          <p className="text-sm font-semibold text-indigo-600 uppercase tracking-wider mb-1">
            My Account
          </p>
          <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
        </div>
      </div>

      {/* Hero Card */}
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl border border-gray-200 shadow-sm p-5">
        <div className="flex flex-col sm:flex-row items-start gap-5">
          {/* Avatar with upload overlay */}
          <div className="relative shrink-0">
            <div className="w-20 h-20 rounded-xl overflow-hidden bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center border-2 border-white shadow-md">
              {displayPhoto ? (
                <img
                  src={displayPhoto}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-2xl font-bold text-indigo-600">
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
              className="absolute -bottom-1 -right-1 w-7 h-7 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 rounded-lg flex items-center justify-center shadow-lg transition-colors"
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
              {profile.firstName} {profile.lastName}
            </h2>
            <p className="text-sm text-gray-600 mt-1 break-words">
              {profile.userId?.email}
            </p>
            <div className="flex flex-wrap items-center gap-2 mt-3">
              {profile.bloodGroup && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-50 text-red-700 text-xs font-medium border border-red-100">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                  Blood: {profile.bloodGroup}
                </span>
              )}
              {profile.gender && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-medium border border-gray-200 capitalize">
                  {profile.gender}
                </span>
              )}
              {profile.age && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-medium border border-gray-200">
                  {profile.age} yrs
                </span>
              )}
            </div>
          </div>

          {/* Edit button */}
          <button
            onClick={() => setEditing(true)}
            className="shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-colors shadow-sm"
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

        {/* Upload error message - now properly contained */}
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
        <Section title="Contact Information">
          <InfoRow label="Phone Number" value={profile.phoneNumber} />
          <InfoRow label="Address" value={profile.address} />
        </Section>

        <Section title="Medical Information">
          <InfoRow label="Blood Group" value={profile.bloodGroup} />
          <InfoRow label="Insurance Details" value={profile.insuranceDetails} />
        </Section>
      </div>

      {/* Account Info - Full Width */}
      <Section title="Account Information">
        <InfoRow label="Email Address" value={profile.userId?.email} />
        <InfoRow
          label="Profile Status"
          value={
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                profile.isTemporary
                  ? 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                  : 'bg-green-50 text-green-700 border border-green-200'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  profile.isTemporary ? 'bg-yellow-500' : 'bg-green-500'
                }`}
              />
              {profile.isTemporary ? 'Temporary' : 'Verified'}
            </span>
          }
        />
        <InfoRow
          label="Member Since"
          value={
            profile.createdAt
              ? new Date(profile.createdAt).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })
              : null
          }
        />
        <InfoRow
          label="Last Updated"
          value={
            profile.updatedAt
              ? new Date(profile.updatedAt).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })
              : null
          }
        />
      </Section>

      {/* Security Section */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <span className="w-1 h-5 bg-indigo-500 rounded-full"></span>
              Security
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Manage your password and account security
            </p>
          </div>
          <button
            onClick={() => setShowPasswordForm(!showPasswordForm)}
            className="shrink-0 flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-gray-700 text-sm font-medium transition-colors"
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
                d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z"
              />
            </svg>
            {showPasswordForm ? 'Cancel' : 'Change Password'}
          </button>
        </div>

        {showPasswordForm && (
          <div className="mt-5 pt-5 border-t border-gray-200">
            <UpdatePasswordForm onDone={() => setShowPasswordForm(false)} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileView;
