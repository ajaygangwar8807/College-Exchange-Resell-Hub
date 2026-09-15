import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { adminService } from '../../services/adminService';
import { ShieldCheck, Save } from 'lucide-react';

const AdminProfile = () => {
  const { user } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    name: user?.name || 'System Admin',
    phone: user?.phone || '',
    profileImage: user?.profileImage || '',
    password: '',
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      setMessage('');
      const res = await adminService.updateAdminProfile(formData);
      if (res.success) {
        setMessage('Admin profile updated successfully!');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update admin profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white">Admin Profile Settings</h1>
        <p className="text-xs text-slate-400 mt-1">Manage system administrator account credentials</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-slate-950 p-8 rounded-3xl border border-slate-800 space-y-6 shadow-xl">
        {message && <div className="p-3 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 rounded-xl text-xs font-semibold">{message}</div>}
        {error && <div className="p-3 bg-rose-500/20 border border-rose-500/30 text-rose-400 rounded-xl text-xs font-semibold">{error}</div>}

        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Admin Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full p-3 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Phone Number</label>
          <input
            type="text"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full p-3 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">New Password (Leave blank to keep current)</label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            placeholder="••••••••"
            className="w-full p-3 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs shadow-md flex items-center space-x-2"
        >
          <Save className="w-4 h-4" />
          <span>{loading ? 'Saving...' : 'Save Admin Settings'}</span>
        </button>
      </form>
    </div>
  );
};

export default AdminProfile;
