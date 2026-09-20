import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Heart, Shield, BookOpen, Sparkles } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="space-y-4 md:col-span-1">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-xl text-white tracking-tight">
                College<span className="text-indigo-400">Hub</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              The official campus marketplace for students to buy, sell, and exchange textbooks, lab gear, notes, and dorm essentials safely.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-sm tracking-wider uppercase mb-4">
              Marketplace
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/products" className="hover:text-indigo-400 transition">
                  Browse All Items
                </Link>
              </li>
              <li>
                <Link to="/products?category=Books" className="hover:text-indigo-400 transition">
                  Textbooks & Guides
                </Link>
              </li>
              <li>
                <Link to="/products?category=Calculators" className="hover:text-indigo-400 transition">
                  Calculators & Electronics
                </Link>
              </li>
              <li>
                <Link to="/products?listingType=exchange" className="hover:text-indigo-400 transition">
                  Exchange Listings
                </Link>
              </li>
            </ul>
          </div>

          {/* Student Hub */}
          <div>
            <h4 className="text-white font-semibold text-sm tracking-wider uppercase mb-4">
              Student Hub
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/dashboard" className="hover:text-indigo-400 transition">
                  Student Dashboard
                </Link>
              </li>
              <li>
                <Link to="/sell" className="hover:text-indigo-400 transition">
                  Post a New Listing
                </Link>
              </li>
              <li>
                <Link to="/wishlist" className="hover:text-indigo-400 transition">
                  Saved Wishlist
                </Link>
              </li>
              <li>
                <Link to="/orders" className="hover:text-indigo-400 transition">
                  My Orders & Exchanges
                </Link>
              </li>
            </ul>
          </div>

          {/* Safety & Project Info */}
          <div>
            <h4 className="text-white font-semibold text-sm tracking-wider uppercase mb-4">
              Campus Security
            </h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-start space-x-2 text-slate-400">
                <Shield className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                <span>Verified student accounts & administration product moderation.</span>
              </div>
              <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/60 text-xs">
                <span className="font-semibold text-slate-200 block mb-1">BCA Final Year Project</span>
                <span>Full-Stack MERN Architecture with real MongoDB persistence.</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} BCA College Book Exchange / Resell Hub. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <span>Built with React, Express, Node.js & MongoDB</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
