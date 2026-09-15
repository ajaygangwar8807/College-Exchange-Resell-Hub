import React, { useState, useEffect, useContext } from 'react';
import { reviewService } from '../../services/reviewService';
import { AuthContext } from '../../context/AuthContext';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import { formatDate } from '../../utils/formatters';
import { Star } from 'lucide-react';

const Reviews = () => {
  const { user } = useContext(AuthContext);
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      if (!user) return;
      try {
        setLoading(true);
        const res = await reviewService.getSellerReviews(user._id);
        if (res.success) {
          setReviews(res.data.reviews || []);
          setAvgRating(res.data.avgRating || 0);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, [user]);

  if (loading) return <Loader text="Loading your seller feedback..." />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Seller Reviews & Feedback</h1>
          <p className="text-xs text-slate-500 mt-1">Ratings and comments left by buyers on completed campus transactions</p>
        </div>

        {reviews.length > 0 && (
          <div className="flex items-center space-x-2 bg-amber-50 border border-amber-200 px-4 py-2 rounded-2xl">
            <Star className="w-5 h-5 text-amber-500 fill-current" />
            <span className="text-lg font-black text-amber-900">{avgRating}</span>
            <span className="text-xs text-amber-700 font-medium">({reviews.length} reviews)</span>
          </div>
        )}
      </div>

      {reviews.length === 0 ? (
        <EmptyState
          icon={Star}
          title="No Reviews Received Yet"
          message="Once buyers complete a purchase order with you, their ratings will appear here."
        />
      ) : (
        <div className="space-y-4">
          {reviews.map((rev) => (
            <div key={rev._id} className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-3">
                  <img
                    src={rev.reviewer?.profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100'}
                    alt={rev.reviewer?.name}
                    className="w-9 h-9 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-bold text-slate-800 text-xs">{rev.reviewer?.name}</h4>
                    <span className="text-[10px] text-slate-400">{rev.reviewer?.college}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-1 text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < rev.rating ? 'fill-current text-amber-400' : 'text-slate-200'}`}
                    />
                  ))}
                </div>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed font-medium">"{rev.comment}"</p>
              <span className="text-[10px] text-slate-400 block text-right">{formatDate(rev.createdAt)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Reviews;
