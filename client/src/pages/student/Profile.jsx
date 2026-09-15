import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { authService } from '../../services/authService';
import { User, Phone, BookOpen, Lock, Save, CheckCircle, AlertCircle } from 'lucide-react';

const Profile = () => {
  const { user, updateProfile } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    college: user?.college || 'School of Computer Science',
    course: user?.course || 'BCA',
    year: user?.year || '3rd Year',
    profileImage: user?.profileImage || '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [pwdMessage, setPwdMessage] = useState('');
  const [pwdError, setPwdError] = useState('');
  const [pwdLoading, setPwdLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      setMessage('');
      const res = await updateProfile(formData);
      if (res.success) {
        setMessage('Profile information updated successfully!');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!passwordData.currentPassword || !passwordData.newPassword) return;

    try {
      setPwdLoading(true);
      setPwdError('');
      setPwdMessage('');
      const res = await authService.changePassword(passwordData);
      if (res.success) {
        setPwdMessage('Password changed successfully!');
        setPasswordData({ currentPassword: '', newPassword: '' });
      }
    } catch (err) {
      setPwdError(err.response?.data?.message || 'Failed to change password');
    } finally {
      setPwdLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Student Profile & Settings</h1>
        <p className="text-xs text-slate-500 mt-1">Manage your campus details and security credentials</p>
      </div>

      {/* Profile Form */}
      <form onSubmit={handleProfileSubmit} className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
        <h3 className="font-bold text-slate-800 text-base border-b border-slate-100 pb-3">Personal & Academic Details</h3>

        {message && <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-semibold">{message}</div>}
        {error && <div className="p-3 bg-rose-50 text-rose-800 rounded-xl text-xs font-semibold">{error}</div>}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Phone Number
            </label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              College Department
            </label>
            <input
              type="text"
              name="college"
              value={formData.college}
              onChange={handleChange}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Course
            </label>
            <input
              type="text"
              name="course"
              value={formData.course}
              onChange={handleChange}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Year of Study
            </label>
            <select
              name="year"
              value={formData.year}
              onChange={handleChange}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
            >
              <option value="1st Year">1st Year</option>
              <option value="2nd Year">2nd Year</option>
              <option value="3rd Year">3rd Year</option>
              <option value="4th Year">4th Year</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Profile Image Avatar URL
          </label>
          <input
            type="url"
            name="profileImage"
            value={formData.profileImage}
            onChange={handleChange}
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-md transition flex items-center space-x-2"
        >
          <Save className="w-4 h-4" />
          <span>{loading ? 'Saving...' : 'Update Profile'}</span>
        </button>
      </form>

      {/* Change Password Form */}
      <form onSubmit={handlePasswordSubmit} className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
        <h3 className="font-bold text-slate-800 text-base border-b border-slate-100 pb-3">Change Account Password</h3>

        {pwdMessage && <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-semibold">{pwdMessage}</div>}
        {pwdError && <div className="p-3 bg-rose-50 text-rose-800 rounded-xl text-xs font-semibold">{pwdError}</div>}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Current Password
            </label>
            <input
              type="password"
              required
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              New Password
            </label>
            <input
              type="password"
              required
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={pwdLoading}
          className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs shadow-md transition"
        >
          {pwdLoading ? 'Updating Password...' : 'Change Password'}
        </button>
      </form>
    </div>
  );
};

export default Profile;
