import React, { useContext } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Repeat,
  MessageSquare,
  Heart,
  Star,
  Flag,
  User,
  PlusCircle,
} from 'lucide-react';

const StudentLayout = () => {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  const navItems = [
    { label: 'Overview', path: '/dashboard', icon: LayoutDashboard },
    { label: 'My Listings', path: '/my-listings', icon: Package },
    { label: 'Orders & Purchases', path: '/orders', icon: ShoppingBag },
    { label: 'Exchange Requests', path: '/exchanges', icon: Repeat },
    { label: 'Inquiries', path: '/inquiries', icon: MessageSquare },
    { label: 'Wishlist', path: '/wishlist', icon: Heart },
    { label: 'Reviews', path: '/reviews', icon: Star },
    { label: 'Report History', path: '/reports', icon: Flag },
    { label: 'My Profile', path: '/profile', icon: User },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow w-full">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full md:w-64 shrink-0">
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/80 sticky top-24">
              <div className="flex items-center space-x-3 p-3 mb-4 bg-indigo-50/70 rounded-xl border border-indigo-100">
                <img
                  src={user?.profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100'}
                  alt={user?.name}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-500/30"
                />
                <div className="overflow-hidden">
                  <h4 className="font-bold text-slate-800 text-sm truncate">{user?.name}</h4>
                  <p className="text-xs text-indigo-600 font-medium truncate">{user?.college || 'Student Portal'}</p>
                </div>
              </div>

              <Link
                to="/sell"
                className="w-full py-2.5 px-4 mb-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl flex items-center justify-center space-x-2 transition shadow-md shadow-indigo-200"
              >
                <PlusCircle className="w-4 h-4" />
                <span>+ Create New Listing</span>
              </Link>

              <nav className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const active = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition ${
                        active
                          ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
          </aside>

          {/* Main Dashboard Content Area */}
          <main className="flex-1 min-w-0">
            <Outlet />
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default StudentLayout;
