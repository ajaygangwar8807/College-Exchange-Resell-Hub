# Product Requirement Document (PRD)

## Project Title
**College Exchange / Resell Hub** (BCA Final Year MERN Project)

---

## 1. Executive Summary

### 1.1 Problem Statement
Every semester, college students spend significant amounts of money purchasing textbooks, lab manuals, scientific calculators, drafting instruments, and dorm furniture. At the end of the semester, these items sit idle in dorm rooms or get discarded, while incoming students face the same high expenses. Existing general-purpose marketplaces (like eBay or Craigslist) lack college-specific trust, involve shipping costs, and are plagued by unverified users.

### 1.2 Proposed Solution
**College Exchange / Resell Hub** is a hyper-local, college-specific peer-to-peer marketplace web application. It enables verified college students to buy, sell, and exchange used academic items, tech gadgets, and dorm essentials directly within their campus community. Transactions occur via campus pickup with zero platform fees, supported by an administrative moderation panel for campus safety.

---

## 2. Goals & Objectives

- **Academic Goal**: Build a fully functional, production-ready **MERN Stack** (MongoDB, Express.js, React.js, Node.js) application suitable for BCA final year viva demonstration, project report, and portfolio presentation.
- **User Experience Goal**: Deliver a sleek, modern startup-grade marketplace UI using Tailwind CSS and Lucide React icons with responsive views for desktop, tablet, and mobile devices.
- **Security & Integrity Goal**: Enforce strict JWT role-based access control (`student` vs `admin`), password hashing, ownership validation, and administrative content moderation.

---

## 3. Target User Personas

1. **Student (Buyer / Seller / Swapper)**:
   - Registers using college credentials.
   - Lists unused textbooks, calculators, or lab gear for sale or exchange.
   - Browses, searches, and filters campus items.
   - Places purchase orders, proposes item swaps, sends inquiries, and leaves seller ratings.
2. **Campus Administrator / Moderator**:
   - Logs in securely via seeded admin credentials.
   - Views real-time MongoDB analytics (total students, active listings, sold items, orders, reports).
   - Suspends/blocks malicious users and removes inappropriate product listings.
   - Manages marketplace categories and reviews flagged reports.

---

## 4. Key Functional Modules & Requirements

### Module 1: User Authentication & Profile
- **Registration**: Allows new students to sign up with name, email, password, phone, college, course, and year. *Public registration strictly assigns `role: 'student'`.*
- **Authentication**: JWT-based login with hashed password comparison via `bcryptjs`.
- **Profile Management**: Students can update personal and academic details, avatar URL, and change account passwords.

### Module 2: Product Catalog & Browsing
- **Marketplace Browsing**: Displays active available listings across campus.
- **Search & Filtering**:
  - Full-text search by item title, description, and pickup location.
  - Filter by Category (Books, Notes, Electronics, Calculators, Lab Equipment, Bags, Furniture, Stationery, Other).
  - Filter by Item Condition (New, Like New, Good, Fair, Used).
  - Filter by Listing Type (For Sale, For Exchange, Both).
  - Filter by Maximum Price range.
  - Sorting (Newest, Price: Low to High, Price: High to Low, Oldest).
- **Backend Pagination**: Server-side pagination (12 items per page).

### Module 3: Product Listing Management
- **Create Listing**: Authenticated students post listings with title, description, category, condition, price, listing type, pickup location, and images.
- **Edit Listing**: Owners can update details or mark status (`available`, `reserved`, `sold`, `exchanged`, `removed`).
- **My Listings Dashboard**: Overview table showing active, sold, and removed items.

### Module 4: Order & Transaction Workflow (Academic Model)
- **Place Purchase Order**: Buyer clicks "Buy Now" for available sale items.
- **Order Status Flow**: `pending` → `confirmed` (by seller) → `completed` (upon campus pickup) / `cancelled`.
- **Completion Effect**: Automatically updates product status to `sold`.

### Module 5: Exchange Request Workflow
- **Swap Proposal**: Student A offers an item from their own active listings in exchange for Student B's item.
- **Exchange Status Flow**: `pending` → `accepted` / `rejected` → `completed`.
- **Completion Effect**: Updates both items' statuses to `exchanged`.

### Module 6: Buyer Inquiries & Wishlist
- **Inquiry System**: Direct messaging between buyer and seller regarding pickup availability or price negotiation.
- **Saved Wishlist**: Bookmarking items to personal wishlist with duplicate prevention.

### Module 7: Reviews & Ratings
- **Seller Feedback**: Only buyers of completed orders can leave 1 to 5-star ratings and written comments for sellers.

### Module 8: Moderation & Reports
- **Flagging**: Students can report fake, scam, or inappropriate listings/users.
- **Admin Moderation**: Admins review reports and take immediate action (suspend user, remove listing, resolve report).

### Module 9: Admin Moderation Panel
- **Live Analytics**: Real MongoDB aggregate counts (Total Students, Blocked Users, Active Listings, Sold Items, Orders, Exchanges, Reports).
- **User Management**: Search students, block/unblock accounts, or delete accounts.
- **Product Moderation**: Soft-delete or restore product listings.
- **Category Management**: CRUD operations on marketplace categories.

---

## 5. Technology Stack Specifications

- **Frontend**: React.js (Vite), JavaScript (JSX), Tailwind CSS, Lucide React, React Router DOM v6, Axios, Context API.
- **Backend**: Node.js, Express.js, JavaScript (CommonJS).
- **Database**: MongoDB & Mongoose ORM.
- **Security**: JWT, bcryptjs, Helmet, CORS, Express Rate Limit.
- **Strict Constraint**: 100% JavaScript ONLY (`.js`, `.jsx`). No TypeScript.

---

## 6. Non-Functional Requirements

1. **Performance**: Page load under 1.5s; API response time under 200ms.
2. **Security**: Password encryption, JWT expiration, input validation, ObjectId validation, CORS policy, rate limiting.
3. **Usability**: Responsive design across mobile, tablet, and desktop viewports; clean startup-grade aesthetic.
