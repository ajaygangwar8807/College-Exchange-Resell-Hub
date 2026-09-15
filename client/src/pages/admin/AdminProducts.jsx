import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import Loader from '../../components/common/Loader';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { Package, Search, Trash2, RotateCcw, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await adminService.getProducts({ search, status: statusFilter });
      if (res.success) {
        setProducts(res.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [search, statusFilter]);

  const handleUpdateStatus = async (id, status) => {
    try {
      await adminService.updateProductStatus(id, status);
      fetchProducts();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status');
    }
  };

  if (loading) return <Loader text="Fetching all marketplace listings for moderation..." />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Product Moderation</h1>
          <p className="text-xs text-slate-400 mt-1">Review campus listings and remove inappropriate posts</p>
        </div>

        <div className="flex items-center space-x-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
          >
            <option value="All">All Statuses</option>
            <option value="available">Available</option>
            <option value="reserved">Reserved</option>
            <option value="sold">Sold</option>
            <option value="exchanged">Exchanged</option>
            <option value="removed">Removed</option>
          </select>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search product title..."
              className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
            />
          </div>
        </div>
      </div>

      <div className="bg-slate-950 rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900 border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-4 px-6">Listing Title</th>
                <th className="py-4 px-4">Category</th>
                <th className="py-4 px-4">Seller</th>
                <th className="py-4 px-4">Price</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-6 text-right">Moderation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-xs font-medium">
              {products.map((p) => (
                <tr key={p._id} className="hover:bg-slate-900/50 transition">
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      <img
                        src={p.images?.[0] || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=100'}
                        alt={p.title}
                        className="w-10 h-10 rounded-xl object-cover border border-slate-800"
                      />
                      <span className="font-bold text-white max-w-xs truncate">{p.title}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-slate-300">{p.category}</td>
                  <td className="py-4 px-4 text-slate-300">{p.seller?.name || 'Student'}</td>
                  <td className="py-4 px-4 font-bold text-amber-400">
                    {p.price > 0 ? formatCurrency(p.price) : 'Exchange'}
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold capitalize ${
                      p.status === 'available' ? 'bg-emerald-500/20 text-emerald-400' :
                      p.status === 'removed' ? 'bg-rose-500/20 text-rose-400' :
                      'bg-slate-800 text-slate-400'
                    }`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Link
                        to={`/products/${p._id}`}
                        target="_blank"
                        className="p-1.5 text-slate-400 hover:text-white rounded-lg"
                        title="View Public Page"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      {p.status !== 'removed' ? (
                        <button
                          onClick={() => handleUpdateStatus(p._id, 'removed')}
                          className="px-3 py-1.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 font-bold rounded-lg text-[11px]"
                        >
                          Remove
                        </button>
                      ) : (
                        <button
                          onClick={() => handleUpdateStatus(p._id, 'available')}
                          className="px-3 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 font-bold rounded-lg text-[11px]"
                        >
                          Restore
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminProducts;
