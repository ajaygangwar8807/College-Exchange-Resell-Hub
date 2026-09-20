import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { WishlistContext } from '../../context/WishlistContext';
import { AuthContext } from '../../context/AuthContext';
import { formatCurrency, formatTimeAgo } from '../../utils/formatters';
import { Heart, MapPin, Tag, ArrowUpRight, Repeat, ShoppingCart } from 'lucide-react';

const ProductCard = ({ product }) => {
  const { isInWishlist, addToWishlist, removeFromWishlist } = useContext(WishlistContext);
  const { isAuthenticated } = useContext(AuthContext);

  const inWishlist = isInWishlist(product._id);

  const handleWishlistToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      window.location.href = '/login';
      return;
    }

    try {
      if (inWishlist) {
        await removeFromWishlist(product._id);
      } else {
        await addToWishlist(product._id);
      }
    } catch (err) {
      console.error('Wishlist error:', err);
    }
  };

  const getListingTypeBadge = () => {
    if (product.listingType === 'exchange') {
      return (
        <span className="bg-emerald-500/90 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg backdrop-blur-xs flex items-center space-x-1">
          <Repeat className="w-3 h-3" />
          <span>For Exchange</span>
        </span>
      );
    }
    if (product.listingType === 'both') {
      return (
        <span className="bg-indigo-600/90 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg backdrop-blur-xs flex items-center space-x-1">
          <Repeat className="w-3 h-3" />
          <span>Sale & Exchange</span>
        </span>
      );
    }
    return (
      <span className="bg-slate-900/80 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg backdrop-blur-xs flex items-center space-x-1">
        <ShoppingCart className="w-3 h-3" />
        <span>For Sale</span>
      </span>
    );
  };

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden">
      {/* Image Container */}
      <div className="relative aspect-4/3 overflow-hidden bg-slate-100">
        <img
          src={product.images?.[0] || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=800'}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-col space-y-1">
          {getListingTypeBadge()}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistToggle}
          className={`absolute top-3 right-3 p-2 rounded-xl transition shadow-md ${
            inWishlist
              ? 'bg-rose-500 text-white'
              : 'bg-white/90 backdrop-blur-md text-slate-600 hover:text-rose-500 hover:bg-white'
          }`}
          title={inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <Heart className={`w-4 h-4 ${inWishlist ? 'fill-current' : ''}`} />
        </button>

        {/* Condition Badge */}
        <div className="absolute bottom-3 left-3">
          <span className="bg-white/90 backdrop-blur-md text-slate-800 text-[11px] font-semibold px-2 py-0.5 rounded-md border border-slate-200/50">
            {product.condition}
          </span>
        </div>
      </div>

      {/* Details Container */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
              {product.category}
            </span>
            <span>{formatTimeAgo(product.createdAt)}</span>
          </div>

          <Link to={`/products/${product._id}`}>
            <h3 className="font-bold text-slate-800 text-base group-hover:text-indigo-600 transition line-clamp-1 mb-0.5">
              {product.title}
            </h3>
          </Link>

          {/* Book Author & Semester Badges */}
          <div className="flex items-center space-x-2 text-[11px] mb-2">
            {product.author && (
              <span className="text-slate-600 font-medium truncate">
                Author: <strong className="text-slate-800">{product.author}</strong>
              </span>
            )}
            {product.semester && (
              <span className="bg-amber-100 text-amber-800 font-extrabold px-2 py-0.5 rounded-md text-[10px] shrink-0">
                {product.semester}
              </span>
            )}
          </div>

          <p className="text-slate-500 text-xs line-clamp-2 mb-3 leading-relaxed">
            {product.description}
          </p>
        </div>

        <div>
          {/* Location & Seller */}
          <div className="flex items-center justify-between text-xs text-slate-500 border-t border-slate-100 pt-3 mb-3">
            <div className="flex items-center space-x-1 truncate max-w-[60%]">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{product.location}</span>
            </div>
            {product.seller?.name && (
              <span className="font-medium text-slate-700 truncate">
                by {product.seller.name.split(' ')[0]}
              </span>
            )}
          </div>

          {/* Price & Action */}
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                Asking Price
              </span>
              <span className="text-lg font-extrabold text-slate-900">
                {product.price > 0 ? formatCurrency(product.price) : 'Exchange Only'}
              </span>
            </div>

            <Link
              to={`/products/${product._id}`}
              className="px-3.5 py-2 bg-indigo-50 hover:bg-indigo-600 text-indigo-600 hover:text-white rounded-xl font-bold text-xs transition flex items-center space-x-1"
            >
              <span>Details</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
