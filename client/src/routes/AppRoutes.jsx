import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Layouts
import MainLayout from '../layouts/MainLayout';
import StudentLayout from '../layouts/StudentLayout';
import AdminLayout from '../layouts/AdminLayout';

// Guards
import ProtectedRoute from './ProtectedRoute';
import AdminRoute from './AdminRoute';

// Public & Auth Pages
import Home from '../pages/student/Home';
import Products from '../pages/student/Products';
import ProductDetails from '../pages/student/ProductDetails';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';

// Student Pages
import Dashboard from '../pages/student/Dashboard';
import CreateListing from '../pages/student/CreateListing';
import EditListing from '../pages/student/EditListing';
import MyListings from '../pages/student/MyListings';
import Wishlist from '../pages/student/Wishlist';
import Orders from '../pages/student/Orders';
import OrderDetails from '../pages/student/OrderDetails';
import Exchanges from '../pages/student/Exchanges';
import Inquiries from '../pages/student/Inquiries';
import Reviews from '../pages/student/Reviews';
import Reports from '../pages/student/Reports';
import Profile from '../pages/student/Profile';

// Admin Pages
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminUsers from '../pages/admin/AdminUsers';
import AdminProducts from '../pages/admin/AdminProducts';
import AdminOrders from '../pages/admin/AdminOrders';
import AdminExchanges from '../pages/admin/AdminExchanges';
import AdminInquiries from '../pages/admin/AdminInquiries';
import AdminReports from '../pages/admin/AdminReports';
import AdminCategories from '../pages/admin/AdminCategories';
import AdminProfile from '../pages/admin/AdminProfile';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Pages wrapped in MainLayout */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* Protected Student Portal Pages wrapped in StudentLayout */}
      <Route
        element={
          <ProtectedRoute>
            <StudentLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/sell" element={<CreateListing />} />
        <Route path="/edit-listing/:id" element={<EditListing />} />
        <Route path="/my-listings" element={<MyListings />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/orders/:id" element={<OrderDetails />} />
        <Route path="/exchanges" element={<Exchanges />} />
        <Route path="/inquiries" element={<Inquiries />} />
        <Route path="/reviews" element={<Reviews />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/profile" element={<Profile />} />
      </Route>

      {/* Admin Panel Pages wrapped in AdminLayout */}
      <Route
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/products" element={<AdminProducts />} />
        <Route path="/admin/orders" element={<AdminOrders />} />
        <Route path="/admin/exchanges" element={<AdminExchanges />} />
        <Route path="/admin/inquiries" element={<AdminInquiries />} />
        <Route path="/admin/reports" element={<AdminReports />} />
        <Route path="/admin/categories" element={<AdminCategories />} />
        <Route path="/admin/profile" element={<AdminProfile />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
