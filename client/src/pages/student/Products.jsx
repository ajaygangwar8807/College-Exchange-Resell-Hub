import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productService } from '../../services/productService';
import ProductGrid from '../../components/products/ProductGrid';
import ProductFilter from '../../components/products/ProductFilter';
import ProductSearch from '../../components/products/ProductSearch';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Filter State initialized from URL query params
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || 'All',
    condition: searchParams.get('condition') || 'All',
    listingType: searchParams.get('listingType') || 'All',
    maxPrice: searchParams.get('maxPrice') || '',
    semester: searchParams.get('semester') || 'All',
    course: searchParams.get('course') || 'All',
  });

  const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'newest');
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);

  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Sync state with URL params & fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const params = {
          page,
          limit: 12,
          keyword,
          category: filters.category,
          condition: filters.condition,
          listingType: filters.listingType,
          maxPrice: filters.maxPrice,
          semester: filters.semester,
          course: filters.course,
          sortBy,
        };

        const res = await productService.getProducts(params);
        if (res.success) {
          setProducts(res.data.products || []);
          setTotalPages(res.data.pages || 1);
          setTotalCount(res.data.total || 0);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch marketplace listings.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [filters, keyword, sortBy, page]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const handleResetFilters = () => {
    setFilters({
      category: 'All',
      condition: 'All',
      listingType: 'All',
      maxPrice: '',
      semester: 'All',
      course: 'All',
    });
    setKeyword('');
    setSortBy('newest');
    setPage(1);
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Marketplace Listings</h1>
          <p className="text-sm text-slate-500 mt-1">
            Showing <span className="font-bold text-indigo-600">{totalCount}</span> active items across campus
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="w-full md:w-64 shrink-0">
          <div className="sticky top-24">
            <ProductFilter
              filters={filters}
              onFilterChange={handleFilterChange}
              onReset={handleResetFilters}
            />
          </div>
        </aside>

        {/* Main Product Listings View */}
        <main className="flex-1 min-w-0">
          <ProductSearch
            keyword={keyword}
            onSearchChange={(val) => {
              setKeyword(val);
              setPage(1);
            }}
            sortBy={sortBy}
            onSortChange={(val) => {
              setSortBy(val);
              setPage(1);
            }}
          />

          <ProductGrid products={products} loading={loading} error={error} />

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center space-x-2 mt-12">
              <button
                disabled={page <= 1}
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed text-slate-700 transition"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-sm font-semibold text-slate-700 px-4">
                Page {page} of {totalPages}
              </span>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed text-slate-700 transition"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Products;
