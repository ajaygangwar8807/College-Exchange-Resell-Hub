import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productService } from '../../services/productService';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import ConfirmModal from '../../components/common/ConfirmModal';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { PlusCircle, Edit, Trash2, CheckCircle2, Eye } from 'lucide-react';

const MyListings = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchMyListings = async () => {
    try {
      setLoading(true);
      const res = await productService.getMyListings();
      if (res.success) {
        setListings(res.data || []);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch your listings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyListings();
  }, []);

  const handleMarkSold = async (id) => {
    try {
      await productService.updateProduct(id, { status: 'sold' });
      fetchMyListings();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedProduct) return;
    try {
      setActionLoading(true);
      await productService.deleteProduct(selectedProduct._id);
      setDeleteModalOpen(false);
      fetchMyListings();
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <Loader text="Loading your product listings..." />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">My Listed Products</h1>
          <p className="text-xs text-slate-500 mt-1">Manage active items, mark as sold, or remove listings</p>
        </div>
        <Link
          to="/sell"
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md flex items-center space-x-2 w-fit"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Post New Item</span>
        </Link>
      </div>

      {error && <p className="text-rose-600 text-sm font-semibold">{error}</p>}

      {listings.length === 0 ? (
        <EmptyState
          title="No Active Listings"
          message="You haven't listed any items for sale or exchange yet."
          actionText="Create Listing"
          actionLink="/sell"
        />
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-4 px-6">Product</th>
                  <th className="py-4 px-4">Price</th>
                  <th className="py-4 px-4">Type</th>
                  <th className="py-4 px-4">Status</th>
                  <th className="py-4 px-4">Date Posted</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-medium">
                {listings.map((item) => (
                  <tr key={item._id} className="hover:bg-slate-50/60 transition">
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <img
                          src={item.images?.[0] || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=100'}
                          alt={item.title}
                          className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                        />
                        <div className="truncate max-w-xs">
                          <Link to={`/products/${item._id}`} className="font-bold text-slate-800 hover:text-indigo-600 transition truncate block">
                            {item.title}
                          </Link>
                          <span className="text-[11px] text-slate-400">{item.category} • {item.condition}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 font-bold text-slate-900">
                      {item.price > 0 ? formatCurrency(item.price) : 'Exchange'}
                    </td>
                    <td className="py-4 px-4 capitalize font-semibold text-slate-600">
                      {item.listingType}
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold capitalize ${
                        item.status === 'available' ? 'bg-emerald-100 text-emerald-800' :
                        item.status === 'sold' ? 'bg-indigo-100 text-indigo-800' :
                        item.status === 'exchanged' ? 'bg-purple-100 text-purple-800' :
                        'bg-slate-100 text-slate-600'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-slate-400">{formatDate(item.createdAt)}</td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Link
                          to={`/products/${item._id}`}
                          className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          to={`/edit-listing/${item._id}`}
                          className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition"
                          title="Edit Listing"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        {item.status === 'available' && (
                          <button
                            onClick={() => handleMarkSold(item._id)}
                            className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition"
                            title="Mark as Sold"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setSelectedProduct(item);
                            setDeleteModalOpen(true);
                          }}
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                          title="Remove Listing"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Remove Product Listing"
        message={`Are you sure you want to remove "${selectedProduct?.title}" from campus marketplace?`}
        confirmText="Remove Listing"
        isDanger={true}
        loading={actionLoading}
      />
    </div>
  );
};

export default MyListings;
