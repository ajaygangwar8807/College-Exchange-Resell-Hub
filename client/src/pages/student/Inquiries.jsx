import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { inquiryService } from '../../services/inquiryService';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import { formatDate } from '../../utils/formatters';
import { MessageSquare, ArrowRight, User } from 'lucide-react';

const Inquiries = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchInquiries = async () => {
    try {
      setLoading(true);
      const res = await inquiryService.getMyInquiries();
      if (res.success) {
        setInquiries(res.data || []);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch inquiries');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  if (loading) return <Loader text="Loading your buyer inquiries..." />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Buyer Inquiries</h1>
        <p className="text-xs text-slate-500 mt-1">Questions and messages sent regarding product listings</p>
      </div>

      {inquiries.length === 0 ? (
        <EmptyState
          icon={MessageSquare}
          title="No Inquiries Sent or Received"
          message="Inquiries will appear here when students ask about your items or when you inquire."
          actionText="Browse Items"
          actionLink="/products"
        />
      ) : (
        <div className="space-y-4">
          {inquiries.map((inquiry) => (
            <div
              key={inquiry._id}
              className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-3"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-3">
                  <img
                    src={inquiry.product?.images?.[0] || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=100'}
                    alt={inquiry.product?.title}
                    className="w-10 h-10 rounded-xl object-cover"
                  />
                  <div>
                    <Link to={`/products/${inquiry.product?._id}`} className="font-bold text-slate-800 hover:text-indigo-600 text-xs block">
                      {inquiry.product?.title}
                    </Link>
                    <span className="text-[10px] text-slate-400">
                      From: {inquiry.buyer?.name} to {inquiry.seller?.name}
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-semibold text-slate-400">{formatDate(inquiry.createdAt)}</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-700 italic border border-slate-100">
                "{inquiry.message}"
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Inquiries;
