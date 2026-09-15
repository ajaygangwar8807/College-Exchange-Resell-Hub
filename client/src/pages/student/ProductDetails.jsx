import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { productService } from '../../services/productService';
import { orderService } from '../../services/orderService';
import { inquiryService } from '../../services/inquiryService';
import { exchangeService } from '../../services/exchangeService';
import { reportService } from '../../services/reportService';
import { WishlistContext } from '../../context/WishlistContext';
import { AuthContext } from '../../context/AuthContext';
import ImageGallery from '../../components/products/ImageGallery';
import Loader from '../../components/common/Loader';
import ErrorMessage from '../../components/common/ErrorMessage';
import ConfirmModal from '../../components/common/ConfirmModal';
import { formatCurrency, formatDate } from '../../utils/formatters';
import {
  MapPin,
  Tag,
  ShieldCheck,
  Heart,
  ShoppingCart,
  Repeat,
  MessageSquare,
  Flag,
  User,
  Phone,
  Mail,
  CheckCircle,
  X,
  AlertCircle,
  Edit,
} from 'lucide-react';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { user, isAuthenticated } = useContext(AuthContext);
  const { isInWishlist, addToWishlist, removeFromWishlist } = useContext(WishlistContext);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // User's own listings (for exchange modal selection)
  const [myListings, setMyListings] = useState([]);
  const [selectedOfferedItem, setSelectedOfferedItem] = useState('');

  // Modals & form state
  const [buyModalOpen, setBuyModalOpen] = useState(false);
  const [inquiryModalOpen, setInquiryModalOpen] = useState(false);
  const [exchangeModalOpen, setExchangeModalOpen] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);

  const [inquiryMessage, setInquiryMessage] = useState('');
  const [exchangeMessage, setExchangeMessage] = useState('');
  const [reportReason, setReportReason] = useState('fake');
  const [reportDescription, setReportDescription] = useState('');

  const [actionSuccess, setActionSuccess] = useState('');
  const [actionError, setActionError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await productService.getProductById(id);
        if (res.success) {
          setProduct(res.data);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load product details.');
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

  // Load user's own available listings if logged in for exchange modal
  useEffect(() => {
    if (isAuthenticated) {
      productService.getMyListings().then((res) => {
        if (res.success) {
          const available = (res.data || []).filter(
            (p) => p._id !== id && p.status === 'available'
          );
          setMyListings(available);
          if (available.length > 0) setSelectedOfferedItem(available[0]._id);
        }
      });
    }
  }, [isAuthenticated, id]);

  if (loading) return <Loader fullScreen text="Loading product details..." />;
  if (error) return <ErrorMessage message={error} onRetry={() => window.location.reload()} />;
  if (!product) return <ErrorMessage message="Product listing not found" />;

  const isOwner = user && product.seller?._id === user._id;
  const inWishlist = isInWishlist(product._id);

  // Handle Buy Now Order
  const handleConfirmBuy = async () => {
    try {
      setActionLoading(true);
      setActionError('');
      const res = await orderService.createOrder(product._id);
      if (res.success) {
        setActionSuccess('Purchase order created successfully! Redirecting to orders...');
        setTimeout(() => navigate('/orders'), 1500);
      }
    } catch (err) {
      setActionError(err.response?.data?.message || 'Failed to create order');
    } finally {
      setActionLoading(false);
      setBuyModalOpen(false);
    }
  };

  // Handle Inquiry Send
  const handleSendInquiry = async (e) => {
    e.preventDefault();
    if (!inquiryMessage.trim()) return;

    try {
      setActionLoading(true);
      setActionError('');
      const res = await inquiryService.createInquiry(product._id, inquiryMessage);
      if (res.success) {
        setActionSuccess('Inquiry sent to seller! Check your dashboard for responses.');
        setInquiryModalOpen(false);
        setInquiryMessage('');
      }
    } catch (err) {
      setActionError(err.response?.data?.message || 'Failed to send inquiry');
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Exchange Request Send
  const handleSendExchange = async (e) => {
    e.preventDefault();
    if (!selectedOfferedItem) {
      setActionError('Please select one of your listings to offer in exchange');
      return;
    }

    try {
      setActionLoading(true);
      setActionError('');
      const res = await exchangeService.createExchangeRequest({
        requestedProductId: product._id,
        offeredProductId: selectedOfferedItem,
        message: exchangeMessage,
      });
      if (res.success) {
        setActionSuccess('Exchange proposal sent to seller!');
        setExchangeModalOpen(false);
        setExchangeMessage('');
      }
    } catch (err) {
      setActionError(err.response?.data?.message || 'Failed to send exchange request');
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Report Submission
  const handleSendReport = async (e) => {
    e.preventDefault();
    if (!reportDescription.trim()) return;

    try {
      setActionLoading(true);
      setActionError('');
      const res = await reportService.createReport({
        productId: product._id,
        reportedUserId: product.seller?._id,
        reason: reportReason,
        description: reportDescription,
      });
      if (res.success) {
        setActionSuccess('Report submitted to campus administration for review.');
        setReportModalOpen(false);
        setReportDescription('');
      }
    } catch (err) {
      setActionError(err.response?.data?.message || 'Failed to submit report');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Alert Feedback Messages */}
      {actionSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center justify-between font-medium text-sm animate-fadeIn">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{actionSuccess}</span>
          </div>
          <button onClick={() => setActionSuccess('')}><X className="w-4 h-4" /></button>
        </div>
      )}

      {actionError && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl flex items-center justify-between font-medium text-sm animate-fadeIn">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <span>{actionError}</span>
          </div>
          <button onClick={() => setActionError('')}><X className="w-4 h-4" /></button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Image Gallery */}
        <div className="lg:col-span-7">
          <ImageGallery images={product.images} />
        </div>

        {/* Right Column: Product Info & Actions */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            <div className="flex items-center justify-between text-xs font-semibold mb-2">
              <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full uppercase tracking-wider">
                {product.category}
              </span>
              <span className="text-slate-400">Listed on {formatDate(product.createdAt)}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
              {product.title}
            </h1>

            <div className="mt-4 flex items-baseline space-x-3">
              <span className="text-3xl font-black text-slate-900">
                {product.price > 0 ? formatCurrency(product.price) : 'Exchange Only'}
              </span>
              <span className="text-xs font-bold text-slate-500 uppercase px-2 py-0.5 bg-slate-100 rounded-md border border-slate-200">
                Condition: {product.condition}
              </span>
            </div>
          </div>

          {/* Location & Status Card */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2 text-xs text-slate-600">
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-indigo-600 shrink-0" />
              <span className="font-medium">Campus Pickup Location: <strong className="text-slate-800">{product.location}</strong></span>
            </div>
            <div className="flex items-center space-x-2">
              <Tag className="w-4 h-4 text-indigo-600 shrink-0" />
              <span className="font-medium">Listing Type: <strong className="text-slate-800 capitalize">{product.listingType}</strong></span>
            </div>
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-medium">Availability Status: <strong className="text-emerald-700 capitalize">{product.status}</strong></span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Item Description</h3>
            <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-line bg-white p-4 rounded-2xl border border-slate-100">
              {product.description}
            </p>
          </div>

          {/* Seller Profile Summary Card */}
          <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img
                src={product.seller?.profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100'}
                alt={product.seller?.name}
                className="w-12 h-12 rounded-full object-cover ring-2 ring-indigo-500/20"
              />
              <div>
                <h4 className="font-bold text-slate-800 text-sm">{product.seller?.name || 'Verified Student'}</h4>
                <p className="text-xs text-slate-500">{product.seller?.college || 'Computer Science Dept'}</p>
                <p className="text-[11px] text-indigo-600 font-semibold">{product.seller?.course} • {product.seller?.year}</p>
              </div>
            </div>

            {/* Seller contact detail */}
            {product.seller?.phone && (
              <div className="text-right">
                <a
                  href={`tel:${product.seller.phone}`}
                  className="p-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl inline-flex items-center space-x-1 text-xs font-bold transition"
                  title="Call Seller"
                >
                  <Phone className="w-4 h-4" />
                </a>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-2">
            {!isAuthenticated ? (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-center space-y-2">
                <p className="text-xs font-semibold text-amber-800">Log in with your student account to contact seller or buy this item.</p>
                <Link
                  to="/login"
                  className="inline-block px-5 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl shadow-md"
                >
                  Sign In Now
                </Link>
              </div>
            ) : isOwner ? (
              <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-2xl flex items-center justify-between">
                <span className="text-xs font-semibold text-indigo-900">This is your active listing.</span>
                <Link
                  to={`/edit-listing/${product._id}`}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs flex items-center space-x-1"
                >
                  <Edit className="w-4 h-4" />
                  <span>Edit Listing</span>
                </Link>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(product.listingType === 'sell' || product.listingType === 'both') && product.status === 'available' && (
                    <button
                      onClick={() => setBuyModalOpen(true)}
                      className="py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl transition shadow-lg shadow-indigo-200 flex items-center justify-center space-x-2"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span>Buy Now ({formatCurrency(product.price)})</span>
                    </button>
                  )}

                  {(product.listingType === 'exchange' || product.listingType === 'both') && product.status === 'available' && (
                    <button
                      onClick={() => setExchangeModalOpen(true)}
                      className="py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl transition shadow-lg shadow-emerald-200 flex items-center justify-center space-x-2"
                    >
                      <Repeat className="w-4 h-4" />
                      <span>Request Item Exchange</span>
                    </button>
                  )}
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setInquiryModalOpen(true)}
                    className="flex-1 py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl transition flex items-center justify-center space-x-2"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Send Buyer Inquiry</span>
                  </button>

                  <button
                    onClick={async () => {
                      if (inWishlist) await removeFromWishlist(product._id);
                      else await addToWishlist(product._id);
                    }}
                    className={`p-3 rounded-xl border transition ${
                      inWishlist
                        ? 'bg-rose-500 text-white border-rose-500'
                        : 'bg-white border-slate-200 text-slate-600 hover:text-rose-500'
                    }`}
                    title="Wishlist"
                  >
                    <Heart className={`w-5 h-5 ${inWishlist ? 'fill-current' : ''}`} />
                  </button>

                  <button
                    onClick={() => setReportModalOpen(true)}
                    className="p-3 bg-white border border-slate-200 text-slate-400 hover:text-rose-600 rounded-xl transition"
                    title="Report Suspicious Product"
                  >
                    <Flag className="w-5 h-5" />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* MODAL: Buy Now Confirmation */}
      <ConfirmModal
        isOpen={buyModalOpen}
        onClose={() => setBuyModalOpen(false)}
        onConfirm={handleConfirmBuy}
        title="Confirm Purchase Order"
        message={`Are you sure you want to place a purchase order for "${product.title}" for ${formatCurrency(product.price)}? The seller will confirm campus pickup.`}
        confirmText="Confirm Buy Order"
        loading={actionLoading}
      />

      {/* MODAL: Send Inquiry */}
      {inquiryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-lg">Send Message to Seller</h3>
              <button onClick={() => setInquiryModalOpen(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <form onSubmit={handleSendInquiry} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Your Message
                </label>
                <textarea
                  required
                  rows={4}
                  value={inquiryMessage}
                  onChange={(e) => setInquiryMessage(e.target.value)}
                  placeholder="Hi, is this item available for pickup near the library tomorrow?"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-indigo-500"
                ></textarea>
              </div>
              <button
                type="submit"
                disabled={actionLoading}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm transition shadow-md"
              >
                {actionLoading ? 'Sending...' : 'Send Inquiry Message'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Request Item Exchange */}
      {exchangeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-lg">Propose Item Exchange</h3>
              <button onClick={() => setExchangeModalOpen(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>

            {myListings.length === 0 ? (
              <div className="text-center py-6 space-y-3">
                <p className="text-sm text-slate-600">You don't have any active available listings to offer in exchange.</p>
                <Link
                  to="/sell"
                  onClick={() => setExchangeModalOpen(false)}
                  className="inline-block px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold"
                >
                  Create a Listing First
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSendExchange} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                    Select Your Item To Offer in Swap *
                  </label>
                  <select
                    value={selectedOfferedItem}
                    onChange={(e) => setSelectedOfferedItem(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-indigo-500"
                  >
                    {myListings.map((item) => (
                      <option key={item._id} value={item._id}>
                        {item.title} ({formatCurrency(item.price)})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                    Optional Note to Owner
                  </label>
                  <textarea
                    rows={3}
                    value={exchangeMessage}
                    onChange={(e) => setExchangeMessage(e.target.value)}
                    placeholder="Would you like to swap your book for my scientific calculator?"
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-indigo-500"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={actionLoading}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm transition shadow-md"
                >
                  {actionLoading ? 'Submitting...' : 'Send Exchange Proposal'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* MODAL: Report Product */}
      {reportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-lg">Report Suspicious Item</h3>
              <button onClick={() => setReportModalOpen(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <form onSubmit={handleSendReport} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Reason for Reporting
                </label>
                <select
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
                >
                  <option value="fake">Fake / Counterfeit Product</option>
                  <option value="scam">Potential Scam / Fraud</option>
                  <option value="inappropriate">Inappropriate / Off-Campus Item</option>
                  <option value="wrong_info">Misleading / Incorrect Information</option>
                  <option value="spam">Spam / Duplicate Post</option>
                  <option value="other">Other Reason</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Detailed Explanation *
                </label>
                <textarea
                  required
                  rows={4}
                  value={reportDescription}
                  onChange={(e) => setReportDescription(e.target.value)}
                  placeholder="Please describe why this listing should be reviewed by campus administration..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-indigo-500"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={actionLoading}
                className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-sm transition shadow-md"
              >
                {actionLoading ? 'Submitting...' : 'Submit Report'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
