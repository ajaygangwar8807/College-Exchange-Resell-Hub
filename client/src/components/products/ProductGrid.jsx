import React from 'react';
import ProductCard from './ProductCard';
import EmptyState from '../common/EmptyState';
import Loader from '../common/Loader';

const ProductGrid = ({ products = [], loading = false, error = null }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
          <div key={n} className="bg-white rounded-2xl p-4 border border-slate-200 animate-pulse h-80 space-y-4">
            <div className="bg-slate-200 h-44 rounded-xl w-full"></div>
            <div className="bg-slate-200 h-4 rounded w-3/4"></div>
            <div className="bg-slate-200 h-3 rounded w-1/2"></div>
            <div className="bg-slate-200 h-8 rounded-xl w-full mt-4"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 bg-rose-50 border border-rose-200 text-rose-700 text-center rounded-2xl">
        <p className="font-semibold">{error}</p>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <EmptyState
        title="No Products Found"
        message="No campus listings matched your current filters or search keywords."
        actionText="Clear Filters"
        onAction={() => window.location.search = ''}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;
