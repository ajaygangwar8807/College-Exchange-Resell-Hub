# Development Tasks & Milestone Checklist (TASKS.md)

Project: **College Exchange / Resell Hub** (BCA Final Year MERN Project)

---

## Phase 1: Project Setup & Architecture
- [x] Initialize client directory (Vite + React + JavaScript + Tailwind CSS)
- [x] Initialize server directory (Node.js + Express.js + Mongoose)
- [x] Create root `package.json` with scripts for `server:dev`, `client`, `seed:admin`, `seed:data`, and `build:client`
- [x] Configure `.env.example` and `.gitignore`

## Phase 2: Database Models & Configuration
- [x] Setup MongoDB connection with Mongoose (`server/config/db.js`)
- [x] Setup Cloudinary config with fallback inline Data URI support (`server/config/cloudinary.js`)
- [x] Implement `User.js` model (bcrypt pre-save hook, matchPassword method, role enum: `student`, `admin`)
- [x] Implement `Category.js` model (name, slug, description, isActive)
- [x] Implement `Product.js` model (seller ref, title, description, price, condition, images, listingType, status)
- [x] Implement `Order.js` model (buyer, seller, product, price, status, completedAt)
- [x] Implement `ExchangeRequest.js` model (requester, owner, requestedProduct, offeredProduct, status)
- [x] Implement `Inquiry.js` model (buyer, seller, product, message, status)
- [x] Implement `Wishlist.js` model (user ref, products array ref)
- [x] Implement `Review.js` model (reviewer, seller, order ref, rating 1-5, comment)
- [x] Implement `Report.js` model (reporter, reportedUser, product, reason, description, status)

## Phase 3: Backend Security, Middleware & Seeding
- [x] Implement JWT token generator (`server/utils/generateToken.js`)
- [x] Implement `authMiddleware.js` (JWT token verification, user lookup, block check)
- [x] Implement `adminMiddleware.js` (Role verification `req.user.role === 'admin'`)
- [x] Implement `errorMiddleware.js` (Centralized error handler & 404 handler)
- [x] Implement `uploadMiddleware.js` (Multer memory storage for image uploads)
- [x] Implement `rateLimitMiddleware.js` (API rate limiters)
- [x] Implement `seedAdmin.js` script (Creates admin user from env vars securely)
- [x] Implement `seedData.js` script (Seeds categories, demo student users, and realistic campus listings)

## Phase 4: Backend REST API Controllers & Routes
- [x] Auth Routes: `/api/auth/register`, `/api/auth/login`, `/api/auth/me`, `/api/auth/profile`, `/api/auth/change-password`
- [x] Category Routes: `/api/categories` (GET, POST, PATCH, DELETE)
- [x] Product Routes: `/api/products` (GET search/filter/pagination, GET :id, POST create, PATCH update, DELETE soft-remove, GET my-listings)
- [x] Order Routes: `/api/orders` (POST buy now, GET my orders, GET :id, PATCH update status)
- [x] Exchange Routes: `/api/exchanges` (POST request swap, GET my exchanges, GET :id, PATCH update status)
- [x] Inquiry Routes: `/api/inquiries` (POST inquiry, GET my inquiries, PATCH status)
- [x] Wishlist Routes: `/api/wishlist` (GET wishlist, POST add, DELETE remove)
- [x] Review Routes: `/api/reviews` (POST review for completed orders, GET seller reviews)
- [x] Report Routes: `/api/reports` (POST submit report, GET my reports)
- [x] Admin Routes: `/api/admin/stats` (Real MongoDB statistics), `/api/admin/users`, `/api/admin/products`, `/api/admin/orders`, `/api/admin/exchanges`, `/api/admin/inquiries`, `/api/admin/reports`, `/api/admin/profile`

## Phase 5: Frontend Infrastructure & Design System
- [x] Centralized Axios client (`client/src/services/api.js`) with JWT bearer interceptors & 401 handling
- [x] API Service wrappers (`authService`, `productService`, `orderService`, `exchangeService`, `inquiryService`, `wishlistService`, `reviewService`, `reportService`, `adminService`)
- [x] Context API Providers (`AuthContext`, `ProductContext`, `WishlistContext`)
- [x] Custom Hooks (`useAuth`, `useFetch`, `useDebounce`)
- [x] Common UI Components (`Navbar`, `Footer`, `Loader`, `EmptyState`, `ErrorMessage`, `ConfirmModal`)
- [x] Layouts & Route Guards (`MainLayout`, `StudentLayout`, `AdminLayout`, `ProtectedRoute`, `AdminRoute`)

## Phase 6: Frontend Public & Auth Pages
- [x] `Login.jsx` with instant viva demo credentials preset toggle
- [x] `Register.jsx` (forced student role)
- [x] `Home.jsx` (Hero, Category Grid, Featured Listings, How It Works, CTA)
- [x] `Products.jsx` (Search, Filter sidebar, Sort dropdown, Pagination controls)
- [x] `ProductDetails.jsx` (Image gallery, Seller card, Buy Now modal, Inquiry modal, Exchange swap modal, Report modal)

## Phase 7: Frontend Student Dashboard & Workflows
- [x] `Dashboard.jsx` (Real MongoDB stats & recent activity)
- [x] `CreateListing.jsx` (Post item for sale or exchange)
- [x] `EditListing.jsx` (Update product details & status)
- [x] `MyListings.jsx` (Manage active, sold, exchanged, and removed listings)
- [x] `Wishlist.jsx` (Saved items view)
- [x] `Orders.jsx` & `OrderDetails.jsx` (Purchase order management & seller rating modal)
- [x] `Exchanges.jsx` (Item swap proposals accept/reject/complete flow)
- [x] `Inquiries.jsx` (Buyer-seller message logs)
- [x] `Reviews.jsx` (Seller feedback log)
- [x] `Reports.jsx` (Submitted report status)
- [x] `Profile.jsx` (Academic details & password change)

## Phase 8: Frontend Complete Admin Moderation Panel
- [x] `AdminDashboard.jsx` (Real MongoDB live metrics & recent logs)
- [x] `AdminUsers.jsx` (Search students, suspend/block accounts, delete accounts)
- [x] `AdminProducts.jsx` (Moderate listings, soft remove/restore)
- [x] `AdminOrders.jsx` (Audit platform orders)
- [x] `AdminExchanges.jsx` (Audit exchange requests)
- [x] `AdminInquiries.jsx` (Audit inquiry logs)
- [x] `AdminReports.jsx` (Action flagged reports with block user / remove product triggers)
- [x] `AdminCategories.jsx` (Add, edit, and deactivate categories)
- [x] `AdminProfile.jsx` (Manage admin profile settings)

## Phase 9: Verification & Documentation
- [x] Build Verification: `npm run build` in client directory passed with 0 errors
- [x] Language Compliance: Confirmed 0 `.ts`/`.tsx` files exist in project source code
- [x] Documentation: Created `README.md`, `PRD.md`, `RULES.md`, and `TASKS.md`
