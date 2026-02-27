import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updatePassword } from '../profileThunks';

const UpdatePasswordForm = () => {
  const dispatch = useDispatch();

  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updatePassword(passwords));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h4 className="text-lg font-semibold text-gray-900 mb-4">
        Update Password
      </h4>

      <div>
        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">
          Current Password
        </label>
        <input
          type="password"
          name="currentPassword"
          value={passwords.currentPassword}
          onChange={handleChange}
          placeholder="Enter current password"
          autoComplete="current-password"
          className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">
          New Password
        </label>
        <input
          type="password"
          name="newPassword"
          value={passwords.newPassword}
          onChange={handleChange}
          placeholder="Enter new password"
          autoComplete="new-password"
          className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">
          Confirm Password
        </label>
        <input
          type="password"
          name="confirmPassword"
          value={passwords.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm new password"
          autoComplete="new-password"
          className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all"
        />
      </div>

      <button
        type="submit"
        className="w-full px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg transition-colors"
      >
        Update Password
      </button>
    </form>
  );
};

export default UpdatePasswordForm;
