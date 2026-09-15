import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { WishlistContext } from '../../context/WishlistContext';
import { productService } from '../../services/productService';
import { orderService } from '../../services/orderService';
import { exchangeService } from '../../services/exchangeService';
import { inquiryService } from '../../services/inquiryService';
import StatCard from '../../components/dashboard/StatCard';
import Loader from '../../components/common/Loader';
import { formatCurrency, formatTimeAgo } from '../../utils/formatters';
import {
  Package,
  ShoppingBag,
  Repeat,
  MessageSquare,
  Heart,
  PlusCircle,
  Clock,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const { wishlistCount } = useContext(WishlistContext);

  const [stats, setStats] = useState({
    totalListings: 0,
    activeListings: 0,
    soldListings: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalExchanges: 0,
    pendingExchanges: 0,
    totalInquiries: 0,
  });

  const [recentListings, setRecentListings] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [listingsRes, ordersRes, exchangesRes, inquiriesRes] = await Promise.all([
          productService.getMyListings(),
          orderService.getMyOrders(),
          exchangeService.getMyExchanges(),
          inquiryService.getMyInquiries(),
        ]);

        const myListings = listingsRes.data || [];
        const myOrders = ordersRes.data || [];
        const myExchanges = exchangesRes.data || [];
        const myInquiries = inquiriesRes.data || [];

        setStats({
          totalListings: myListings.length,
          activeListings: myListings.filter((p) => p.status === 'available').length,
          soldListings: myListings.filter((p) => p.status === 'sold' || p.status === 'exchanged').length,
          totalOrders: myOrders.length,
          pendingOrders: myOrders.filter((o) => o.status === 'pending').length,
          totalExchanges: myExchanges.length,
          pendingExchanges: myExchanges.filter((e) => e.status === 'pending').length,
          totalInquiries: myInquiries.length,
        });

        setRecentListings(myListings.slice(0, 3));
        setRecentOrders(myOrders.slice(0, 3));
      } catch (err) {
        console.error('Failed to load dashboard metrics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <Loader text="Loading your campus dashboard..." />;

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-900 to-indigo-800 text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center sm:text-left">
          <div className="inline-flex items-center space-x-2 bg-indigo-500/20 px-3 py-1 rounded-full text-indigo-300 text-xs font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Active Student Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">Welcome back, {user?.name}!</h1>
          <p className="text-indigo-200 text-xs sm:text-sm">
            {user?.college} • {user?.course} ({user?.year})
          </p>
        </div>

        <Link
          to="/sell"
          className="px-5 py-3 bg-white text-indigo-700 hover:bg-slate-100 font-extrabold rounded-2xl shadow-lg transition text-sm flex items-center space-x-2 shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Post New Item</span>
        </Link>
      </div>

      {/* Grid Statistics (Real MongoDB Metrics) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Active Listings"
          value={stats.activeListings}
          icon={Package}
          color="indigo"
          subtitle={`${stats.totalListings} total posted`}
        />
        <StatCard
          title="Campus Orders"
          value={stats.totalOrders}
          icon={ShoppingBag}
          color="emerald"
          subtitle={`${stats.pendingOrders} pending confirmation`}
        />
        <StatCard
          title="Exchange Swaps"
          value={stats.totalExchanges}
          icon={Repeat}
          color="purple"
          subtitle={`${stats.pendingExchanges} pending requests`}
        />
        <StatCard
          title="Inquiries & Saved"
          value={stats.totalInquiries}
          icon={MessageSquare}
          color="amber"
          subtitle={`${wishlistCount} items in wishlist`}
        />
      </div>

      {/* Recent Activity Rows */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Listings */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-extrabold text-slate-800 text-base">My Recent Listings</h3>
            <Link to="/my-listings" className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center space-x-1">
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentListings.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">You haven't posted any items yet.</p>
          ) : (
            <div className="space-y-3">
              {recentListings.map((item) => (
                <div key={item._id} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center space-x-3 truncate">
                    <img
                      src={item.images?.[0] || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=100'}
                      alt={item.title}
                      className="w-10 h-10 rounded-xl object-cover"
                    />
                    <div className="truncate">
                      <h4 className="font-bold text-slate-800 text-xs truncate">{item.title}</h4>
                      <p className="text-[11px] text-slate-400">{formatCurrency(item.price)} • {item.category}</p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                    item.status === 'available' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Orders */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-extrabold text-slate-800 text-base">Recent Purchase Orders</h3>
            <Link to="/orders" className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center space-x-1">
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">No active purchase orders.</p>
          ) : (
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <div key={order._id} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center space-x-3 truncate">
                    <ShoppingBag className="w-8 h-8 p-2 rounded-xl bg-indigo-100 text-indigo-600 shrink-0" />
                    <div className="truncate">
                      <h4 className="font-bold text-slate-800 text-xs truncate">{order.product?.title || 'Purchased Product'}</h4>
                      <p className="text-[11px] text-slate-400">{formatCurrency(order.price)} • {formatTimeAgo(order.createdAt)}</p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full capitalize ${
                    order.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {order.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
