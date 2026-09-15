import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import Loader from '../../components/common/Loader';
import { formatDate } from '../../utils/formatters';
import { Repeat } from 'lucide-react';

const AdminExchanges = () => {
  const [exchanges, setExchanges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExchanges = async () => {
      try {
        setLoading(true);
        const res = await adminService.getExchanges();
        if (res.success) setExchanges(res.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchExchanges();
  }, []);

  if (loading) return <Loader text="Loading item exchange requests..." />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white">Item Exchange Requests</h1>
        <p className="text-xs text-slate-400 mt-1">Audit barter exchange proposals across campus</p>
      </div>

      <div className="bg-slate-950 rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900 border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-4 px-6">Requester</th>
                <th className="py-4 px-4">Offered Item</th>
                <th className="py-4 px-4">Requested Item</th>
                <th className="py-4 px-4">Owner</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-6">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-xs font-medium">
              {exchanges.map((ex) => (
                <tr key={ex._id} className="hover:bg-slate-900/50 transition">
                  <td className="py-4 px-6 text-white font-bold">{ex.requester?.name}</td>
                  <td className="py-4 px-4 text-slate-300 max-w-xs truncate">{ex.offeredProduct?.title}</td>
                  <td className="py-4 px-4 text-slate-300 max-w-xs truncate">{ex.requestedProduct?.title}</td>
                  <td className="py-4 px-4 text-slate-300">{ex.owner?.name}</td>
                  <td className="py-4 px-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold capitalize ${
                      ex.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                    }`}>
                      {ex.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-slate-500">{formatDate(ex.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminExchanges;
