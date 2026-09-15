import React, { useContext } from 'react';
import { WishlistContext } from '../../context/WishlistContext';
import ProductCard from '../../components/products/ProductCard';
import EmptyState from '../../components/common/EmptyState';
import Loader from '../../components/common/Loader';
import { Heart } from 'lucide-react';

const Wishlist = () => {
  const { wishlistItems, loading } = useContext(WishlistContext);

  if (loading) return <Loader text="Loading saved items..." />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Saved Wishlist Items</h1>
        <p className="text-xs text-slate-500 mt-1">Textbooks, gear, and gadgets you bookmarked for later</p>
      </div>

      {wishlistItems.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="Wishlist is Empty"
          message="Click the heart icon on any campus listing to bookmark it here."
          actionText="Browse Marketplace"
          actionLink="/products"
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistItems.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
