import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { orderService } from '../../services/orderService';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { ShoppingBag, CheckCircle, XCircle, Eye, ArrowRight } from 'lucide-react';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [roleFilter, setRoleFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await orderService.getMyOrders();
      if (res.success) {
        setOrders(res.data || []);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      await orderService.updateOrderStatus(id, status);
      fetchOrders();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <Loader text="Loading your purchase orders..." />;

  const filteredOrders = orders.filter((o) => {
    if (roleFilter === 'buyer') return o.buyer?._id === o.buyer;
    if (roleFilter === 'seller') return o.seller?._id === o.seller;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Orders & Purchases</h1>
          <p className="text-xs text-slate-500 mt-1">Track your campus purchase orders and items you sold</p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center space-x-1 bg-slate-200/60 p-1 rounded-xl w-fit text-xs font-bold">
          <button
            onClick={() => setRoleFilter('all')}
            className={`px-3 py-1.5 rounded-lg transition ${roleFilter === 'all' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600'}`}
          >
            All Orders
          </button>
        </div>
      </div>

      {orders.length === 0 ? (
        <EmptyState
          icon={ShoppingBag}
          title="No Purchase Orders Yet"
          message="You haven't purchased or sold any products through purchase orders."
          actionText="Browse Marketplace"
          actionLink="/products"
        />
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4"
            >
              <div className="flex items-center space-x-4">
                <img
                  src={order.product?.images?.[0] || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=100'}
                  alt={order.product?.title}
                  className="w-16 h-16 rounded-2xl object-cover border border-slate-100 shrink-0"
                />
                <div>
                  <div className="flex items-center space-x-2 text-xs font-semibold text-slate-400 mb-1">
                    <span>Order #{order._id.slice(-6)}</span>
                    <span>•</span>
                    <span>{formatDate(order.createdAt)}</span>
                  </div>
                  <Link to={`/orders/${order._id}`} className="font-extrabold text-slate-800 hover:text-indigo-600 text-sm block">
                    {order.product?.title || 'Campus Item'}
                  </Link>
                  <p className="text-xs text-indigo-600 font-bold mt-1">
                    {formatCurrency(order.price)}
                  </p>
                </div>
              </div>

              {/* Status & Action */}
              <div className="flex items-center space-x-3 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-0 pt-3 sm:pt-0">
                <span className={`px-3 py-1 rounded-full text-xs font-extrabold capitalize ${
                  order.status === 'completed' ? 'bg-emerald-100 text-emerald-800' :
                  order.status === 'confirmed' ? 'bg-indigo-100 text-indigo-800' :
                  order.status === 'cancelled' ? 'bg-rose-100 text-rose-800' :
                  'bg-amber-100 text-amber-800'
                }`}>
                  {order.status}
                </span>

                <Link
                  to={`/orders/${order._id}`}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center space-x-1"
                >
                  <span>Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
