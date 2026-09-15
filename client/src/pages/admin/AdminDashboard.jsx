import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import Loader from '../../components/common/Loader';
import {
  Users,
  Package,
  ShoppingBag,
  Repeat,
  AlertOctagon,
  FolderTree,
  ShieldCheck,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { formatCurrency, formatTimeAgo } from '../../utils/formatters';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        setLoading(true);
        const res = await adminService.getStats();
        if (res.success) {
          setStats(res.data);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load MongoDB administration statistics');
      } finally {
        setLoading(false);
      }
    };
    fetchAdminStats();
  }, []);

  if (loading) return <Loader text="Querying MongoDB metrics for admin dashboard..." />;
  if (error) return <p className="text-rose-400 font-semibold p-4">{error}</p>;

  const statCards = [
    { label: 'Total Students', value: stats.totalStudents, subtitle: `${stats.blockedStudents} suspended`, icon: Users, color: 'text-amber-400 border-amber-500/20 bg-amber-500/10' },
    { label: 'Product Listings', value: stats.totalProducts, subtitle: `${stats.activeProducts} active available`, icon: Package, color: 'text-indigo-400 border-indigo-500/20 bg-indigo-500/10' },
    { label: 'Marketplace Orders', value: stats.totalOrders, subtitle: `${stats.pendingOrders} pending pickup`, icon: ShoppingBag, color: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/10' },
    { label: 'Item Swap Requests', value: stats.totalExchanges, subtitle: `${stats.pendingExchanges} pending swap`, icon: Repeat, color: 'text-purple-400 border-purple-500/20 bg-purple-500/10' },
    { label: 'Platform Reports', value: stats.totalReports, subtitle: `${stats.pendingReports} pending moderation`, icon: AlertOctagon, color: 'text-rose-400 border-rose-500/20 bg-rose-500/10' },
    { label: 'Active Categories', value: stats.totalCategories, subtitle: 'Campus classification', icon: FolderTree, color: 'text-blue-400 border-blue-500/20 bg-blue-500/10' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center space-x-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Real MongoDB Live Analytics</span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">Campus Moderation Dashboard</h1>
        </div>
      </div>

      {/* Grid Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div key={idx} className="bg-slate-950 p-6 rounded-3xl border border-slate-800 flex items-center justify-between shadow-xl">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">{card.label}</span>
                <h3 className="text-3xl font-black text-white">{card.value}</h3>
                <p className="text-xs text-slate-500 mt-1">{card.subtitle}</p>
              </div>
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border ${card.color}`}>
                <Icon className="w-7 h-7" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Log Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-4">
          <h3 className="font-extrabold text-white text-base">Recent Platform Orders</h3>
          <div className="space-y-3">
            {stats.recentOrders?.map((ord) => (
              <div key={ord._id} className="p-3 bg-slate-900 rounded-2xl border border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <h4 className="font-bold text-slate-200">{ord.product?.title || 'Product Item'}</h4>
                  <span className="text-slate-500">Buyer: {ord.buyer?.name} • {formatCurrency(ord.price)}</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-amber-400 uppercase">{ord.status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Reports */}
        <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-4">
          <h3 className="font-extrabold text-white text-base">Pending Flagged Reports</h3>
          <div className="space-y-3">
            {stats.recentReports?.map((rep) => (
              <div key={rep._id} className="p-3 bg-slate-900 rounded-2xl border border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <h4 className="font-bold text-rose-400 uppercase tracking-wider text-[11px]">Reason: {rep.reason}</h4>
                  <span className="text-slate-400">Reporter: {rep.reporter?.name}</span>
                </div>
                <span className="text-slate-500 text-[10px]">{formatTimeAgo(rep.createdAt)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
