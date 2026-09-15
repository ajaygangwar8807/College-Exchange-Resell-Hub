import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import Loader from '../../components/common/Loader';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { ShoppingBag } from 'lucide-react';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await adminService.getOrders();
        if (res.success) setOrders(res.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <Loader text="Loading system purchase orders..." />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white">System Purchase Orders</h1>
        <p className="text-xs text-slate-400 mt-1">Audit transactions and pickup confirmations between students</p>
      </div>

      <div className="bg-slate-950 rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900 border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-4 px-6">Order ID & Item</th>
                <th className="py-4 px-4">Buyer</th>
                <th className="py-4 px-4">Seller</th>
                <th className="py-4 px-4">Price</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-6">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-xs font-medium">
              {orders.map((o) => (
                <tr key={o._id} className="hover:bg-slate-900/50 transition">
                  <td className="py-4 px-6">
                    <span className="text-[10px] font-bold text-slate-500 block">#{o._id.slice(-6)}</span>
                    <span className="font-bold text-white block truncate max-w-xs">{o.product?.title || 'Item'}</span>
                  </td>
                  <td className="py-4 px-4 text-slate-300">{o.buyer?.name}</td>
                  <td className="py-4 px-4 text-slate-300">{o.seller?.name}</td>
                  <td className="py-4 px-4 font-bold text-amber-400">{formatCurrency(o.price)}</td>
                  <td className="py-4 px-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold capitalize ${
                      o.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                    }`}>
                      {o.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-slate-500">{formatDate(o.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;
