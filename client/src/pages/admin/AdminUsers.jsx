import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import Loader from '../../components/common/Loader';
import ConfirmModal from '../../components/common/ConfirmModal';
import { formatDate } from '../../utils/formatters';
import { Users, Search, ShieldAlert, Trash2, CheckCircle2, XCircle } from 'lucide-react';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await adminService.getUsers({ search });
      if (res.success) {
        setUsers(res.data || []);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [search]);

  const handleToggleBlock = async (id, currentStatus) => {
    try {
      await adminService.toggleBlockUser(id, !currentStatus);
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to toggle block status');
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    try {
      setActionLoading(true);
      await adminService.deleteUser(selectedUser._id);
      setDeleteModalOpen(false);
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete user');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <Loader text="Fetching student user directory..." />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Student User Management</h1>
          <p className="text-xs text-slate-400 mt-1">Review student profiles, suspend accounts, or manage permissions</p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by student name or email..."
            className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      <div className="bg-slate-950 rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900 border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-4 px-6">Student</th>
                <th className="py-4 px-4">Role</th>
                <th className="py-4 px-4">College & Course</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-4">Joined</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-xs font-medium">
              {users.map((u) => (
                <tr key={u._id} className="hover:bg-slate-900/50 transition">
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      <img
                        src={u.profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100'}
                        alt={u.name}
                        className="w-9 h-9 rounded-full object-cover ring-2 ring-slate-800"
                      />
                      <div>
                        <span className="font-bold text-white block">{u.name}</span>
                        <span className="text-[11px] text-slate-400">{u.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 uppercase font-bold text-[11px] text-slate-300">
                    {u.role}
                  </td>
                  <td className="py-4 px-4 text-slate-300">
                    <div>{u.college}</div>
                    <div className="text-[11px] text-slate-500">{u.course} ({u.year})</div>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold capitalize ${
                      u.isBlocked ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    }`}>
                      {u.isBlocked ? 'Suspended' : 'Active'}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-slate-500">{formatDate(u.createdAt)}</td>
                  <td className="py-4 px-6 text-right">
                    {u.role !== 'admin' && (
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleToggleBlock(u._id, u.isBlocked)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                            u.isBlocked
                              ? 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400'
                              : 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-400'
                          }`}
                        >
                          {u.isBlocked ? 'Unblock' : 'Suspend'}
                        </button>
                        <button
                          onClick={() => {
                            setSelectedUser(u);
                            setDeleteModalOpen(true);
                          }}
                          className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition"
                          title="Delete User Account"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteUser}
        title="Delete Student Account"
        message={`Are you sure you want to permanently delete student account "${selectedUser?.name}" (${selectedUser?.email})?`}
        confirmText="Delete Account"
        isDanger={true}
        loading={actionLoading}
      />
    </div>
  );
};

export default AdminUsers;
