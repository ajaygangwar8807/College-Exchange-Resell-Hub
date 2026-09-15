import React, { useContext } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingBag,
  Repeat,
  MessageSquare,
  AlertOctagon,
  FolderTree,
  User,
  LogOut,
  ShieldCheck,
} from 'lucide-react';

const AdminLayout = () => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { label: 'Dashboard Overview', path: '/admin', icon: LayoutDashboard },
    { label: 'Student Users', path: '/admin/users', icon: Users },
    { label: 'Product Listings', path: '/admin/products', icon: Package },
    { label: 'Marketplace Orders', path: '/admin/orders', icon: ShoppingBag },
    { label: 'Exchange Requests', path: '/admin/exchanges', icon: Repeat },
    { label: 'Inquiries', path: '/admin/inquiries', icon: MessageSquare },
    { label: 'Platform Reports', path: '/admin/reports', icon: AlertOctagon },
    { label: 'Categories', path: '/admin/categories', icon: FolderTree },
    { label: 'Admin Profile', path: '/admin/profile', icon: User },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col md:flex-row">
      {/* Admin Sidebar */}
      <aside className="w-full md:w-64 bg-slate-950 border-r border-slate-800 shrink-0 p-4 flex flex-col justify-between">
        <div>
          {/* Admin Header */}
          <div className="flex items-center space-x-3 p-3 mb-6 bg-amber-500/10 border border-amber-500/20 rounded-xl">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-sm">Campus Admin</h3>
              <p className="text-[11px] text-amber-400 font-semibold uppercase tracking-wider">Moderation Hub</p>
            </div>
          </div>

          {/* Nav list */}
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
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-slate-950' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Admin info */}
        <div className="pt-4 border-t border-slate-800 mt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <img
                src={user?.profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100'}
                alt={user?.name}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-amber-500/40"
              />
              <div className="overflow-hidden">
                <p className="text-xs font-semibold text-white truncate">{user?.name}</p>
                <p className="text-[10px] text-slate-400">System Admin</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Admin Content Viewport */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto bg-slate-900">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
