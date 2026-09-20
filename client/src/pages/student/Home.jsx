import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { productService } from '../../services/productService';
import ProductCard from '../../components/products/ProductCard';
import {
  Search,
  BookOpen,
  Laptop,
  Calculator,
  Code,
  Database,
  FileText,
  ArrowRight,
  ShieldCheck,
  Repeat,
  Sparkles,
  Zap,
  Users,
} from 'lucide-react';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [latestProducts, setLatestProducts] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHomeProducts = async () => {
      try {
        setLoading(true);
        const res = await productService.getProducts({ limit: 8, sortBy: 'newest' });
        if (res.success) {
          const prods = res.data.products || [];
          setLatestProducts(prods.slice(0, 4));
          setFeaturedProducts(prods.slice(0, 8));
        }
      } catch (err) {
        console.error('Home data load error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHomeProducts();
  }, []);

  const handleHeroSearch = (e) => {
    e.preventDefault();
    if (searchKeyword.trim()) {
      navigate(`/products?keyword=${encodeURIComponent(searchKeyword.trim())}`);
    }
  };

  const categories = [
    { name: 'BCA Textbooks', icon: BookOpen, count: '120+ Books', query: 'BCA Textbooks' },
    { name: 'Programming Books', icon: Code, count: '85+ Books', query: 'Programming Books' },
    { name: 'DSA & CS Core', icon: FileText, count: '65+ Books', query: 'DSA & Computer Science' },
    { name: 'DBMS & Web Dev', icon: Database, count: '50+ Books', query: 'DBMS & Operating Systems' },
  ];

  return (
    <div className="space-y-16 pb-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-indigo-900 via-indigo-950 to-slate-900 text-white pt-20 pb-24 px-4 sm:px-6 lg:px-8">
        {/* Background glow effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-indigo-600/20 blur-3xl rounded-full pointer-events-none"></div>

        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-6">
          <div className="inline-flex items-center space-x-2 bg-indigo-500/20 border border-indigo-400/30 px-3.5 py-1.5 rounded-full text-indigo-300 text-xs font-semibold backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Official Campus Student Marketplace</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight">
            Buy, Sell & Exchange <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-indigo-200 to-indigo-400">
              Campus Gear Safely
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Trade used BCA textbooks, scientific calculators, lab equipment, and tech directly with verified students on campus. Zero commission.
          </p>

          {/* Hero Search Bar */}
          <form onSubmit={handleHeroSearch} className="max-w-2xl mx-auto pt-4">
            <div className="bg-white/10 backdrop-blur-md p-2 rounded-2xl border border-white/20 shadow-2xl flex flex-col sm:flex-row items-center gap-2">
              <div className="relative flex-1 w-full">
                <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  placeholder="Search by book title, author, calculator model..."
                  className="w-full pl-11 pr-4 py-3 bg-transparent text-white placeholder-slate-400 text-sm focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm rounded-xl transition shadow-lg shadow-indigo-600/40 flex items-center justify-center space-x-2"
              >
                <span>Search Items</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Quick Stats */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-8 text-xs text-slate-400 font-semibold border-t border-slate-800/80 max-w-xl mx-auto">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>100% Student Verified</span>
            </div>
            <div className="flex items-center space-x-2">
              <Repeat className="w-4 h-4 text-indigo-400" />
              <span>Direct Peer Exchange</span>
            </div>
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Instant Campus Pickup</span>
            </div>
          </div>
        </div>
      </section>

      {/* Browse Categories Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Browse Categories</h2>
            <p className="text-sm text-slate-500">Popular categories across all college courses</p>
          </div>
          <Link
            to="/products"
            className="text-sm font-bold text-indigo-600 hover:text-indigo-800 flex items-center space-x-1"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <Link
                key={idx}
                to={`/products?category=${cat.query}`}
                className="group p-6 bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-xl hover:border-indigo-200 transition-all duration-300 flex items-center space-x-4"
              >
                <div className="w-14 h-14 rounded-2xl bg-indigo-50 group-hover:bg-indigo-600 text-indigo-600 group-hover:text-white flex items-center justify-center transition duration-300 shrink-0">
                  <Icon className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-base group-hover:text-indigo-600 transition">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-slate-400 font-medium">{cat.count}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured Marketplace Listings */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Featured Campus Listings</h2>
            <p className="text-sm text-slate-500">Hand-picked items available for sale or exchange</p>
          </div>
          <Link
            to="/products"
            className="text-sm font-bold text-indigo-600 hover:text-indigo-800 flex items-center space-x-1"
          >
            <span>Explore Marketplace</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="bg-white rounded-2xl p-4 border border-slate-200 animate-pulse h-72"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* How It Works Section */}
      <section className="bg-slate-100/80 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">How BCA College Book Exchange Works</h2>
            <p className="text-sm text-slate-600 mt-2">
              Three simple steps to start saving money and recycling unused campus items.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-xs text-center space-y-4">
              <div className="w-16 h-16 bg-indigo-50 text-indigo-600 font-black text-xl rounded-2xl mx-auto flex items-center justify-center">
                1
              </div>
              <h3 className="font-bold text-lg text-slate-800">List Your Item</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Snap photos of your textbook or calculator, set a price or request an item exchange, and publish your listing in under 2 minutes.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-xs text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-600 font-black text-xl rounded-2xl mx-auto flex items-center justify-center">
                2
              </div>
              <h3 className="font-bold text-lg text-slate-800">Connect & Negotiate</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Receive direct buyer inquiries or item swap proposals from verified students at your campus library or canteen.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-xs text-center space-y-4">
              <div className="w-16 h-16 bg-amber-50 text-amber-600 font-black text-xl rounded-2xl mx-auto flex items-center justify-center">
                3
              </div>
              <h3 className="font-bold text-lg text-slate-800">Meetup & Complete</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Meet safely on campus to inspect the item, confirm order fulfillment, and leave a star rating review for the seller.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Student Call-To-Action Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-3xl p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between shadow-xl shadow-indigo-500/20 gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Have textbooks or notes gathering dust?
            </h2>
            <p className="text-indigo-100 text-sm max-w-xl">
              Turn your old course materials into cash or swap them for next semester's lab equipment today.
            </p>
          </div>
          <Link
            to="/sell"
            className="px-6 py-3.5 bg-white hover:bg-slate-100 text-indigo-700 font-extrabold rounded-2xl shadow-lg transition text-sm shrink-0"
          >
            Post a Listing Now
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
