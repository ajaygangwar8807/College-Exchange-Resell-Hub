import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import Loader from '../../components/common/Loader';
import { formatDate } from '../../utils/formatters';
import { AlertOctagon, ShieldAlert, CheckCircle, XCircle } from 'lucide-react';

const AdminReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const res = await adminService.getReports();
      if (res.success) setReports(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleAction = async (id, status, action = null) => {
    try {
      await adminService.updateReportStatus(id, status, action);
      fetchReports();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update report');
    }
  };

  if (loading) return <Loader text="Fetching user reports for moderation..." />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white">Platform Moderation Reports</h1>
        <p className="text-xs text-slate-400 mt-1">Review flagged suspicious products, scams, or fake listings</p>
      </div>

      <div className="space-y-4">
        {reports.map((rep) => (
          <div key={rep._id} className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <ShieldAlert className="w-5 h-5 text-rose-500" />
                <span className="font-extrabold text-rose-400 text-xs uppercase tracking-wider">
                  Reason: {rep.reason}
                </span>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${
                rep.status === 'resolved' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
              }`}>
                {rep.status}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-300">
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Reporter</span>
                <span className="font-bold text-white">{rep.reporter?.name}</span>
                <span className="block text-[11px] text-slate-400">{rep.reporter?.college}</span>
              </div>

              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Reported Item</span>
                <span className="font-bold text-white">{rep.product?.title || 'User Report'}</span>
              </div>

              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Reported User</span>
                <span className="font-bold text-white">{rep.reportedUser?.name || 'N/A'}</span>
              </div>
            </div>

            <p className="text-xs text-slate-300 p-3 bg-slate-900 rounded-xl border border-slate-800 italic">
              "{rep.description}"
            </p>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-900">
              <span className="text-[11px] text-slate-500">Filed on {formatDate(rep.createdAt)}</span>

              <div className="flex items-center space-x-2">
                {rep.reportedUser && (
                  <button
                    onClick={() => handleAction(rep._id, 'resolved', 'block_user')}
                    className="px-3 py-1.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 font-bold rounded-xl text-xs"
                  >
                    Suspend User
                  </button>
                )}
                {rep.product && (
                  <button
                    onClick={() => handleAction(rep._id, 'resolved', 'remove_product')}
                    className="px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 font-bold rounded-xl text-xs"
                  >
                    Remove Product
                  </button>
                )}
                <button
                  onClick={() => handleAction(rep._id, 'resolved')}
                  className="px-3 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 font-bold rounded-xl text-xs"
                >
                  Mark Resolved
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminReports;
