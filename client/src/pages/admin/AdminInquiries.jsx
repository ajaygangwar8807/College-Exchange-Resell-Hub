import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import Loader from '../../components/common/Loader';
import { formatDate } from '../../utils/formatters';

const AdminInquiries = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        setLoading(true);
        const res = await adminService.getInquiries();
        if (res.success) setInquiries(res.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchInquiries();
  }, []);

  if (loading) return <Loader text="Loading inquiry log..." />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white">Platform Inquiries</h1>
        <p className="text-xs text-slate-400 mt-1">Audit messages exchanged between buyers and sellers</p>
      </div>

      <div className="bg-slate-950 rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900 border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-4 px-6">Buyer</th>
                <th className="py-4 px-4">Seller</th>
                <th className="py-4 px-4">Product Item</th>
                <th className="py-4 px-4">Message Preview</th>
                <th className="py-4 px-6">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-xs font-medium">
              {inquiries.map((inq) => (
                <tr key={inq._id} className="hover:bg-slate-900/50 transition">
                  <td className="py-4 px-6 text-white font-bold">{inq.buyer?.name}</td>
                  <td className="py-4 px-4 text-slate-300">{inq.seller?.name}</td>
                  <td className="py-4 px-4 text-slate-300 max-w-xs truncate">{inq.product?.title}</td>
                  <td className="py-4 px-4 text-slate-400 italic max-w-sm truncate">"{inq.message}"</td>
                  <td className="py-4 px-6 text-slate-500">{formatDate(inq.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminInquiries;
