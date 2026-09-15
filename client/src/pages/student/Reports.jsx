import React, { useState, useEffect } from 'react';
import { reportService } from '../../services/reportService';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import { formatDate } from '../../utils/formatters';
import { Flag, AlertOctagon } from 'lucide-react';

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const res = await reportService.getMyReports();
        if (res.success) {
          setReports(res.data || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  if (loading) return <Loader text="Loading your report submissions..." />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Submitted Reports</h1>
        <p className="text-xs text-slate-500 mt-1">Status of reports submitted to campus moderation</p>
      </div>

      {reports.length === 0 ? (
        <EmptyState
          icon={Flag}
          title="No Reports Filed"
          message="You haven't reported any suspicious products or users."
        />
      ) : (
        <div className="space-y-4">
          {reports.map((rep) => (
            <div key={rep._id} className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-2">
                  <AlertOctagon className="w-4 h-4 text-rose-600 shrink-0" />
                  <span className="font-bold text-slate-800 text-xs uppercase tracking-wider">
                    Reason: {rep.reason}
                  </span>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold capitalize ${
                  rep.status === 'resolved' ? 'bg-emerald-100 text-emerald-800' :
                  rep.status === 'rejected' ? 'bg-slate-100 text-slate-600' :
                  'bg-amber-100 text-amber-800'
                }`}>
                  {rep.status}
                </span>
              </div>

              <p className="text-xs text-slate-600 italic">"{rep.description}"</p>
              <span className="text-[10px] text-slate-400 block text-right">{formatDate(rep.createdAt)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Reports;
