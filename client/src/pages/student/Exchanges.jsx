import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { exchangeService } from '../../services/exchangeService';
import { AuthContext } from '../../context/AuthContext';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import { formatDate } from '../../utils/formatters';
import { Repeat, ArrowRight, CheckCircle, XCircle } from 'lucide-react';

const Exchanges = () => {
  const { user } = useContext(AuthContext);
  const [exchanges, setExchanges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchExchanges = async () => {
    try {
      setLoading(true);
      const res = await exchangeService.getMyExchanges();
      if (res.success) {
        setExchanges(res.data || []);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch exchange requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExchanges();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      await exchangeService.updateExchangeStatus(id, status);
      fetchExchanges();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status');
    }
  };

  if (loading) return <Loader text="Loading item swap requests..." />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Exchange Requests</h1>
        <p className="text-xs text-slate-500 mt-1">Item swap proposals sent and received from other students</p>
      </div>

      {exchanges.length === 0 ? (
        <EmptyState
          icon={Repeat}
          title="No Exchange Requests"
          message="You haven't initiated or received any item exchange requests."
          actionText="Browse Marketplace"
          actionLink="/products"
        />
      ) : (
        <div className="space-y-4">
          {exchanges.map((item) => {
            const isOwner = user && item.owner?._id === user._id;
            return (
              <div
                key={item._id}
                className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6"
              >
                {/* Visual Exchange Swap Layout */}
                <div className="flex items-center space-x-3 w-full md:w-auto">
                  {/* Requested Item */}
                  <div className="flex items-center space-x-3">
                    <img
                      src={item.requestedProduct?.images?.[0] || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=100'}
                      alt="Requested"
                      className="w-14 h-14 rounded-xl object-cover border border-slate-200"
                    />
                    <div className="max-w-[140px] truncate">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Requested</span>
                      <h4 className="font-bold text-slate-800 text-xs truncate">{item.requestedProduct?.title}</h4>
                    </div>
                  </div>

                  <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <Repeat className="w-4 h-4" />
                  </div>

                  {/* Offered Item */}
                  <div className="flex items-center space-x-3">
                    <img
                      src={item.offeredProduct?.images?.[0] || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=100'}
                      alt="Offered"
                      className="w-14 h-14 rounded-xl object-cover border border-slate-200"
                    />
                    <div className="max-w-[140px] truncate">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Offered Swap</span>
                      <h4 className="font-bold text-slate-800 text-xs truncate">{item.offeredProduct?.title}</h4>
                    </div>
                  </div>
                </div>

                {/* Status & Actions */}
                <div className="flex items-center space-x-3 w-full md:w-auto justify-between md:justify-end border-t md:border-0 pt-3 md:pt-0">
                  <span className={`px-3 py-1 rounded-full text-xs font-extrabold capitalize ${
                    item.status === 'completed' ? 'bg-emerald-100 text-emerald-800' :
                    item.status === 'accepted' ? 'bg-indigo-100 text-indigo-800' :
                    item.status === 'rejected' ? 'bg-rose-100 text-rose-800' :
                    'bg-amber-100 text-amber-800'
                  }`}>
                    {item.status}
                  </span>

                  {isOwner && item.status === 'pending' && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleUpdateStatus(item._id, 'accepted')}
                        className="px-3 py-1.5 bg-emerald-600 text-white font-bold text-xs rounded-xl hover:bg-emerald-700 transition"
                      >
                        Accept Swap
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(item._id, 'rejected')}
                        className="px-3 py-1.5 bg-rose-50 text-rose-700 font-bold text-xs rounded-xl hover:bg-rose-100 transition"
                      >
                        Reject
                      </button>
                    </div>
                  )}

                  {item.status === 'accepted' && (
                    <button
                      onClick={() => handleUpdateStatus(item._id, 'completed')}
                      className="px-3 py-1.5 bg-indigo-600 text-white font-bold text-xs rounded-xl hover:bg-indigo-700 transition"
                    >
                      Complete Swap
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Exchanges;
