# 🎓 College Exchange / Resell Hub

A full-stack **MERN-based college marketplace** where students can buy, sell, and exchange used academic and personal items within their college community.

The platform provides a secure and organized way for students to list products, discover items, send inquiries, place purchase requests, exchange products, manage wishlists, write reviews, and report inappropriate listings.

---

## 📌 Project Overview

**College Exchange / Resell Hub** is a student-focused marketplace developed as a final-year BCA project.

Students can use the platform to:

* 🛒 Buy used products
* 🏷️ Sell their unused items
* 🔄 Exchange products with other students
* 🔍 Search and filter listings
* ❤️ Save products to wishlist
* 💬 Send inquiries to sellers
* 📦 Manage purchase/order requests
* 🔄 Manage exchange requests
* ⭐ Review completed transactions
* 🚨 Report fake, inappropriate, or suspicious listings
* 👤 Manage their profile
* 📊 Track their marketplace activity

Administrators can manage users, products, orders, exchanges, inquiries, reports, and categories from a dedicated admin panel.

---

# ✨ Features

## 👨‍🎓 Student Features

### Authentication

* Student registration
* Student login
* JWT-based authentication
* Password hashing using bcrypt
* Protected routes
* Profile management
* Change password
* Automatic authentication state handling

### Product Marketplace

* Create product listings
* Edit own listings
* Remove own listings
* Upload multiple product images
* Product categories
* Product condition
* Selling price
* Exchange option
* Product location
* Listing status

### Search & Filtering

Students can search products using:

* Product name
* Category
* Price range
* Condition
* Listing type
* Sorting
* Pagination

### Wishlist

* Add products to wishlist
* Remove products from wishlist
* Prevent duplicate wishlist entries

### Inquiries

Students can:

* Send inquiry to seller
* View their inquiries
* Accept/reject/manage inquiry requests

### Orders

Students can:

* Send purchase/order request
* View order history
* Track order status
* Manage order details

### Exchange

Students can:

* Send exchange request
* Accept/reject exchange requests
* Track exchange status
* Complete exchange workflow

### Reviews

* Give 1–5 star rating
* Write reviews after completed transactions
* Prevent duplicate reviews

### Reports

Students can report:

* Fake listings
* Scam
* Inappropriate content
* Incorrect information
* Spam
* Other issues

---

# 🛡️ Admin Features

The project includes a dedicated admin panel.

### Admin Dashboard

Displays real database-based statistics such as:

* Total students
* Total products
* Total orders
* Total exchanges
* Total inquiries
* Pending reports
* Categories

### User Management

Admin can:

* View students
* Search users
* View user details
* Block users
* Unblock users
* Delete users where appropriate
* View user activity

Admin cannot delete their own account through normal admin management.

### Product Management

Admin can:

* View products
* Search products
* Filter products
* View product details
* Remove inappropriate listings
* Moderate marketplace content

### Order Management

Admin can:

* View orders
* View order details
* Update order status
* Monitor transactions

### Exchange Management

Admin can:

* View exchange requests
* Monitor exchange status
* Manage exchange records

### Inquiry Management

Admin can:

* View inquiries
* Monitor inquiry activity

### Report Management

Admin can:

* View reported products/users
* Review reports
* Update report status
* Resolve or reject reports

### Category Management

Admin can:

* Add categories
* Edit categories
* Activate/deactivate categories
* Manage marketplace categories safely

---

# 🧰 Tech Stack

## Frontend

* React.js
* Vite
* JavaScript
* JSX
* React Router DOM
* Axios
* Context API
* Tailwind CSS
* Lucide React

## Backend

* Node.js
* Express.js
* JavaScript
* REST API
* CommonJS

## Database

* MongoDB
* Mongoose

## Authentication & Security

* JWT
* bcryptjs
* Helmet
* CORS
* Express Rate Limit
* Request validation
* Role-based authorization
* Ownership checks

## Image Upload

* Multer
* Cloudinary

## Development & Testing

* Nodemon
* Postman
* npm

---

# JavaScript

---

# 📂 Project Structure

```text
College Exchange Resell Hub/
│
├── client/
│   ├── public/
│   │
│   └── src/
│       ├── components/
│       ├── context/
│       ├── hooks/
│       ├── layouts/
│       ├── pages/
│       ├── routes/
│       ├── services/
│       ├── utils/
│       ├── App.jsx
│       ├── main.jsx
│       └── index.css
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── scripts/
│   ├── utils/
│   ├── server.js
│   └── package.json
│
├── .env.example
├── .gitignore
├── README.md
└── package.json
```

---

# 🗄️ Database Models

The backend uses MongoDB with Mongoose.

Main models include:

```text
User
Category
Product
Order
ExchangeRequest
Inquiry
Wishlist
Review
Report
```

### User

Stores:

* Name
* Email
* Password hash
* Phone
* College
* Course
* Year
* Profile image
* Role
* Block status
* Preferences
* Timestamps

### Product

Stores:

* Seller
* Title
* Description
* Category
* Price
* Condition
* Images
* Listing type
* Location
* Status
* Timestamps

### Listing Types

```text
sell
exchange
both
```

### Product Conditions

```text
New
Like New
Good
Fair
Used
```

### Product Status

```text
available
reserved
sold
exchanged
removed
```

---

# 🔐 Authentication

Authentication is implemented using **JWT**.

### Registration

```http
POST /api/auth/register
```

### Login

```http
POST /api/auth/login
```

### Current User

```http
GET /api/auth/me
```

### Update Profile

```http
PATCH /api/auth/profile
```

### Change Password

```http
PATCH /api/auth/change-password
```

The backend identifies the logged-in user from the JWT token instead of trusting user identity or role information sent from the frontend.

---

# 👑 Admin Authorization

Admin APIs require:

1. Valid JWT
2. Authenticated user
3. `role === "admin"`

Students cannot access admin APIs.

Admin accounts should be created through the secure admin seed process rather than allowing normal public registration to create an admin account.

---

# 🔒 Security Rules

The application implements important business and security rules.

* Passwords are never returned in API responses.
* Passwords are hashed using bcrypt.
* JWT authentication protects private APIs.
* Admin APIs require admin authorization.
* Blocked users cannot perform restricted marketplace actions.
* Users can modify only their own listings.
* Users cannot modify another user's profile or marketplace data.
* Users cannot buy their own product.
* Users cannot send inquiries for their own product.
* Removed/sold products cannot be purchased.
* ObjectIds are validated.
* Duplicate wishlist entries are prevented.
* Duplicate reviews are prevented.
* Reviews are allowed only after completed transactions.
* Frontend role information is never trusted for authorization.
* Transaction history is preserved where required.

---

# 🌐 API Modules

The backend provides REST APIs for:

```text
Authentication
Users
Products
Categories
Orders
Exchanges
Inquiries
Wishlist
Reviews
Reports
Admin
```

Example product endpoints:

```http
GET    /api/products
GET    /api/products/:id
POST   /api/products
PATCH  /api/products/:id
DELETE /api/products/:id
```

Example wishlist endpoints:

```http
GET    /api/wishlist
POST   /api/wishlist/:productId
DELETE /api/wishlist/:productId
```

Example order endpoints:

```http
GET    /api/orders
POST   /api/orders
GET    /api/orders/:id
PATCH  /api/orders/:id
```

Example exchange endpoints:

```http
GET    /api/exchanges
POST   /api/exchanges
GET    /api/exchanges/:id
PATCH  /api/exchanges/:id
```

---

# ⚙️ Environment Variables

Create a `.env` file using `.env.example`.

Example:

```env
PORT=5000
NODE_ENV=development

CLIENT_URL=http://localhost:5173

MONGO_URI=mongodb://127.0.0.1:27017/college_exchange_hub

JWT_SECRET=your_strong_jwt_secret

ADMIN_EMAIL=admin@collegeexchange.edu
ADMIN_PASSWORD=your_admin_password

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

VITE_API_URL=http://localhost:5000/api
```

### Important

Never commit the real `.env` file to GitHub.

The following values must remain private:

```text
JWT_SECRET
ADMIN_PASSWORD
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET
MONGO_URI
```

---

# 📦 Installation

## 1. Clone Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

Go to the project:

```bash
cd College-Exchange-Resell-Hub
```

---

## 2. Install Dependencies

Install root dependencies:

```bash
npm install
```

Install server dependencies:

```bash
cd server
npm install
```

Install client dependencies:

```bash
cd ../client
npm install
```

Return to root:

```bash
cd ..
```

---

# 🗃️ Database Setup

The project supports MongoDB.

### Local MongoDB

Example:

```env
MONGO_URI=mongodb://127.0.0.1:27017/college_exchange_hub
```

### MongoDB Atlas

For deployment, use a MongoDB Atlas connection string:

```env
MONGO_URI=mongodb+srv://USERNAME:PASSWORD@CLUSTER.mongodb.net/college_exchange_hub
```

Make sure the MongoDB Atlas network access and database user are correctly configured.

---

# 👑 Seed Admin

After configuring MongoDB:

```bash
npm run seed:admin
```

This creates the admin account using:

```env
ADMIN_EMAIL
ADMIN_PASSWORD
```

---

# 🌱 Seed Demo Data

To add demo categories/users/listings:

```bash
npm run seed:data
```

---

# ▶️ Run the Application

## Start Backend

From the root directory:

```bash
npm run server:dev
```

Backend:

```text
http://localhost:5000
```

## Start Frontend

Open another terminal:

```bash
npm run client
```

Frontend:

```text
http://localhost:5173
```

---

# 🧪 Testing

The API can be tested using:

* Postman
* Browser
* curl
* Node.js test scripts

Important flows to test:

### Student Flow

```text
Register
   ↓
Login
   ↓
Browse Products
   ↓
View Product
   ↓
Wishlist / Inquiry / Order / Exchange
   ↓
Manage Dashboard
   ↓
Complete Transaction
   ↓
Submit Review
```

### Seller Flow

```text
Login
   ↓
Create Listing
   ↓
Upload Images
   ↓
Manage Listing
   ↓
Receive Inquiry / Order / Exchange
   ↓
Complete Transaction
```

### Admin Flow

```text
Admin Login
   ↓
Admin Dashboard
   ↓
Manage Users
   ↓
Manage Products
   ↓
Manage Orders
   ↓
Manage Exchanges
   ↓
Manage Inquiries
   ↓
Review Reports
   ↓
Manage Categories
```

---

# 💳 Payment System

This academic project does **not** include a real payment gateway.

Orders represent a marketplace purchase/request workflow for the college project.

A real payment gateway can be integrated later if required.

---

# 🚀 Production Environment

After deployment, update:

```env
CLIENT_URL=https://your-frontend-domain.com
```

Backend:

```env
MONGO_URI=your_mongodb_atlas_connection_string
```

Frontend:

```env
VITE_API_URL=https://your-backend-domain.com/api
```

Do not use:

```env
VITE_API_URL=http://localhost:5000/api
```

in production.

---

# 📱 Responsive Design

The frontend is designed for:

* 💻 Desktop
* 📱 Mobile
* 📟 Tablet

The UI uses:

* Responsive layouts
* Product cards
* Tables
* Search bars
* Filters
* Modals
* Toast notifications
* Loading states
* Empty states
* Error states
* Mobile navigation

---

# 🎯 Project Objectives

The main objectives of the project are:

1. Build a college-specific marketplace.
2. Provide a simple buying and selling platform for students.
3. Support product exchange between students.
4. Provide secure user authentication.
5. Store marketplace data using MongoDB.
6. Provide role-based admin management.
7. Implement real REST APIs.
8. Provide search and filtering functionality.
9. Provide wishlist, inquiry, order, exchange, review, and reporting systems.
10. Build a responsive and user-friendly web application.

---

# 🔮 Future Enhancements

Possible future improvements include:

* Online payment gateway
* Real-time chat
* Push notifications
* Email notifications
* College email verification
* Advanced recommendation system
* AI-based product recommendations
* Location-based marketplace search
* Fraud detection
* Image-based product verification
* Mobile application
* Advanced analytics dashboard

---

# 👨‍💻 Project Information

**Project:** College Exchange / Resell Hub

**Course:** Bachelor of Computer Applications (BCA)

**Institute:** Invertis University

**Project Type:** Final-Year BCA Project

**Technology:** MERN Stack

**Language:** JavaScript

---

# 📄 License

This project is developed for academic and educational purposes.

You may modify and extend the project according to your requirements.
