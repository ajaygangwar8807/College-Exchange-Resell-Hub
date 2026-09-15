import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { orderService } from '../../services/orderService';
import { reviewService } from '../../services/reviewService';
import { AuthContext } from '../../context/AuthContext';
import Loader from '../../components/common/Loader';
import ErrorMessage from '../../components/common/ErrorMessage';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { ShoppingBag, CheckCircle, XCircle, Star, ArrowLeft, User, Phone, Mail } from 'lucide-react';

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Review Modal / Form
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState('');

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await orderService.getOrderById(id);
      if (res.success) {
        setOrder(res.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderDetails();
  }, [id]);

  const handleUpdateStatus = async (status) => {
    try {
      const res = await orderService.updateOrderStatus(id, status);
      if (res.success) {
        fetchOrderDetails();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update order status');
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      setReviewLoading(true);
      setReviewError('');
      const res = await reviewService.createReview({
        orderId: order._id,
        rating,
        comment,
      });
      if (res.success) {
        setReviewSubmitted(true);
        setReviewModalOpen(false);
      }
    } catch (err) {
      setReviewError(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setReviewLoading(false);
    }
  };

  if (loading) return <Loader text="Loading order details..." />;
  if (error) return <ErrorMessage message={error} />;
  if (!order) return <ErrorMessage message="Order not found" />;

  const isBuyer = user && order.buyer?._id === user._id;
  const isSeller = user && order.seller?._id === user._id;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center space-x-3">
        <button
          onClick={() => navigate('/orders')}
          className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 transition"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Order #{order._id.slice(-6)}</h1>
          <p className="text-xs text-slate-500">Placed on {formatDate(order.createdAt)}</p>
        </div>
      </div>

      {/* Main Order Card */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Status</span>
            <span className={`px-3 py-1 rounded-full text-xs font-extrabold capitalize ${
              order.status === 'completed' ? 'bg-emerald-100 text-emerald-800' :
              order.status === 'confirmed' ? 'bg-indigo-100 text-indigo-800' :
              order.status === 'cancelled' ? 'bg-rose-100 text-rose-800' :
              'bg-amber-100 text-amber-800'
            }`}>
              {order.status}
            </span>
          </div>

          <div className="text-right">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Total Agreed Price</span>
            <span className="text-2xl font-black text-slate-900">{formatCurrency(order.price)}</span>
          </div>
        </div>

        {/* Product Details */}
        <div className="flex items-center space-x-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
          <img
            src={order.product?.images?.[0] || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=100'}
            alt={order.product?.title}
            className="w-16 h-16 rounded-xl object-cover"
          />
          <div>
            <Link to={`/products/${order.product?._id}`} className="font-bold text-slate-800 hover:text-indigo-600 text-sm">
              {order.product?.title}
            </Link>
            <p className="text-xs text-slate-500 mt-1">{order.product?.category} • {order.product?.condition}</p>
          </div>
        </div>

        {/* Counterparty Contact Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Buyer</span>
            <h4 className="font-bold text-slate-800 text-sm">{order.buyer?.name}</h4>
            <p className="text-xs text-slate-500">{order.buyer?.college} ({order.buyer?.course})</p>
            <p className="text-xs text-indigo-600 font-semibold">{order.buyer?.email}</p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Seller</span>
            <h4 className="font-bold text-slate-800 text-sm">{order.seller?.name}</h4>
            <p className="text-xs text-slate-500">{order.seller?.college} ({order.seller?.course})</p>
            <p className="text-xs text-indigo-600 font-semibold">{order.seller?.email}</p>
          </div>
        </div>

        {/* Order Status Action Controls */}
        <div className="pt-4 border-t border-slate-100 space-y-3">
          {isSeller && order.status === 'pending' && (
            <div className="flex space-x-3">
              <button
                onClick={() => handleUpdateStatus('confirmed')}
                className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-md"
              >
                Confirm Pickup Order
              </button>
              <button
                onClick={() => handleUpdateStatus('cancelled')}
                className="py-3 px-4 bg-rose-50 text-rose-700 hover:bg-rose-100 font-bold rounded-xl text-xs"
              >
                Decline
              </button>
            </div>
          )}

          {(isSeller || isBuyer) && (order.status === 'confirmed' || order.status === 'pending') && (
            <button
              onClick={() => handleUpdateStatus('completed')}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-md flex items-center justify-center space-x-2"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Mark Order as Completed</span>
            </button>
          )}

          {/* Review Action for Buyer upon completion */}
          {isBuyer && order.status === 'completed' && !reviewSubmitted && (
            <button
              onClick={() => setReviewModalOpen(true)}
              className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs shadow-md flex items-center justify-center space-x-2"
            >
              <Star className="w-4 h-4" />
              <span>Leave Seller Rating & Review</span>
            </button>
          )}
        </div>
      </div>

      {/* Review Modal */}
      {reviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="font-bold text-slate-900 text-lg">Leave Seller Review</h3>
            {reviewError && <p className="text-xs text-rose-600 font-semibold">{reviewError}</p>}
            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Rating (1 to 5 Stars)
                </label>
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setRating(num)}
                      className={`p-2 rounded-xl border transition ${
                        rating >= num ? 'bg-amber-100 text-amber-600 border-amber-300' : 'bg-slate-50 text-slate-400'
                      }`}
                    >
                      <Star className="w-5 h-5 fill-current" />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Review Comment *
                </label>
                <textarea
                  required
                  rows={4}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Great seller! Book was in clean condition as described..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white"
                ></textarea>
              </div>

              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={() => setReviewModalOpen(false)}
                  className="flex-1 py-2.5 bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={reviewLoading}
                  className="flex-1 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold shadow-md"
                >
                  {reviewLoading ? 'Submitting...' : 'Submit Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetails;
