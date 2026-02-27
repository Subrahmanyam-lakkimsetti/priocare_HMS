import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyProfile } from '../profileThunks';
import ProfileForm from '../components/ProfileForm';
import ProfileView from '../components/ProfileView';

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { profile, loading } = useSelector((s) => s.profile);

  useEffect(() => {
    dispatch(fetchMyProfile());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          {/* Animated medical cross */}
          <div className="relative w-14 h-14">
            <div className="absolute inset-0 rounded-2xl bg-blue-100 animate-ping opacity-40" />
            <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center shadow-lg">
              <svg
                className="w-7 h-7 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M19 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2zm-2 9h-4v4h-2v-4H7v-2h4V6h2v4h4v2z" />
              </svg>
            </div>
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-gray-700">
              Loading your profile
            </p>
            <p className="text-xs text-gray-400 mt-0.5">
              Please wait a moment...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/60">
      <div className="px-6 py-8 max-w-4xl mx-auto">
        {!profile ? <ProfileForm /> : <ProfileView profile={profile} />}
      </div>
    </div>
  );
};

export default ProfilePage;
