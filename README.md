# 🎓 BCA College Book Exchange / Resell Hub

A full-stack **MERN-based academic book marketplace** where college students can buy, sell, and exchange used textbooks, course materials, and study resources within their college community.

The platform provides a secure, organized way for students to list academic books, discover course materials, send seller inquiries, place purchase requests, exchange books across semesters, manage wishlists, submit seller reviews, and report inappropriate listings.

---

## 📌 Project Overview

**BCA College Book Exchange / Resell Hub** is a hyper-local, college-specific peer-to-peer academic book marketplace web application developed as a final-year BCA project for **Invertis University**.

### Project Purpose
A full-stack MERN-based platform where college students can buy, sell, and exchange used academic books and study material within their college community.

### Academic Focus Areas
The platform is specifically tailored for study material including:

* 📚 **Academic Textbooks** (BCA, MCA, B.Sc CS, B.Tech, etc.)
* 💻 **Programming Books** (C, C++, Java, Python, JavaScript, Go)
* 🧠 **DSA & Computer Science Books** (Algorithms, Data Structures, Theory of Computation)
* 🗄️ **DBMS & Operating Systems Books** (SQL, Database Concepts, Linux/OS Principles)
* 🌐 **Networking & Web Development Books** (Computer Networks, Full-Stack Web Dev)
* 📝 **BCA Notes & Lab Manuals** (Semester lecture notes, practical lab guides)
* 📖 **Exam Preparation & Reference Books** (Model papers, question banks)
* 🎯 **NIMCET / Entrance Preparation Books** (MCA entrance study guides)
* 📑 **Other Academic Books** (General reference books, mathematics, humanities)

Students can use the platform to:

* 🛒 **Buy** affordable used academic books from campus peers
* 🏷️ **Sell** books and study materials they no longer need
* 🔄 **Exchange** books with other students across semesters
* 🔍 **Search and filter** listings by title, author, subject, semester, and course
* ❤️ **Save** books to a personal wishlist
* 💬 **Send inquiries** to sellers for book availability
* 📦 **Place purchase/order requests** for campus pickup
* 🔄 **Propose and complete book exchanges**
* ⭐ **Review** completed transactions
* 🚨 **Report** fake, inappropriate, or suspicious book listings
* 👤 **Manage** student profile and academic details
* 📊 **Track** personal marketplace activity via student dashboard

Administrators can manage users, academic book listings, orders, exchange requests, inquiries, reports, and categories from a dedicated admin panel.

---

## ✨ Features

### 👨‍🎓 Student Features

#### Authentication & Profile Management
* Student registration (forced student role)
* Student login with JWT bearer tokens
* Password hashing using `bcryptjs`
* Protected route navigation
* Profile management (academic course, year, college, avatar)
* Password change functionality

#### Book Marketplace & Listing Management
* Create academic book listings with book-specific metadata
* Edit own book listings (details, price, status)
* Soft-remove own book listings
* Multiple book image uploads (Cloudinary / File upload)
* Categorization into academic book categories
* Book condition classification
* Listing type selection (Sale, Exchange, Both)
* Pickup location specifying campus spots

#### Book Search & Advanced Filtering
Students can search and filter academic books using:
* Title, Author, or Subject keywords
* Academic Category
* Semester (Sem 1 to Sem 6)
* Course (BCA, MCA, B.Sc CS, B.Tech, etc.)
* Price range
* Book condition
* Listing type (For Sale, For Exchange, Both)
* Sorting (Newest, Price: Low to High, Price: High to Low, Oldest)
* Server-side pagination

#### Wishlist
* Save books to personal wishlist
* Remove books from wishlist
* Duplicate wishlist entry prevention

#### Seller Inquiries
* Send inquiry messages to book sellers
* View sent and received inquiries
* Respond to buyer inquiries

#### Order Workflow (Campus Pickup)
* Send purchase/order requests for available books
* Track order status (`pending` → `confirmed` → `completed` / `cancelled`)
* View order history & transaction details

#### Book Exchange Workflow
* Propose direct book exchanges (e.g. exchanging Semester 1 books for Semester 2 required textbooks)
* Accept or reject exchange proposals
* Track exchange status (`pending` → `accepted` → `completed` / `rejected`)
* Automatic item status transition to `exchanged` upon completion

#### Reviews & Ratings
* Give 1–5 star ratings and written reviews after completed book transactions
* Duplicate review prevention (1 review per completed order)

#### Moderation & Reporting
* Report fake, scam, or inappropriate book listings and suspicious users
* Track status of submitted reports

---

### 🛡️ Admin Features

The project includes a dedicated admin moderation panel. Admin accounts manage:

* 👥 **Students/Users**: View registered students, search accounts, block/unblock users, delete users.
* 📚 **Academic Book Listings**: Moderate listings, view book details, soft-remove inappropriate listings, or restore items.
* 📦 **Orders**: Monitor order requests, view buyer/seller details, audit transactions.
* 🔄 **Exchange Requests**: Track book exchange proposals and transaction status.
* 💬 **Inquiries**: Audit buyer-seller inquiry communications.
* 🚨 **Reports**: Review flagged reports, block malicious users, or remove reported listings.
* 🏷️ **Academic Categories**: Add, edit, and activate/deactivate academic book categories.

---

## 📚 Book Categories

The platform supports 9 specialized academic book categories:

1. **BCA Textbooks**
2. **Programming Books**
3. **DSA & Computer Science**
4. **DBMS & Operating Systems**
5. **Networking & Web Development**
6. **BCA Notes & Lab Manuals**
7. **Exam Preparation & Reference Books**
8. **NIMCET / Entrance Preparation**
9. **Other Academic Books**

---

## 🧰 Tech Stack

### Frontend
* **React.js** (Vite build tool)
* **JavaScript & JSX**
* **React Router DOM v6**
* **Axios** (with JWT request interceptors)
* **Context API** (AuthContext, ProductContext, WishlistContext)
* **Tailwind CSS** (Responsive UI framework)
* **Lucide React** (Modern iconography)

### Backend
* **Node.js** & **Express.js**
* **JavaScript** (REST API)
* **CommonJS** module system
* **Helmet** & **CORS** (HTTP security headers)
* **Express Rate Limit** (API rate limiting)

### Database
* **MongoDB** (NoSQL Database)
* **Mongoose** (ORM / Schema modeling)

### Authentication & Security
* **JWT** (JSON Web Tokens)
* **bcryptjs** (Password hashing)
* **Request validation** & **ObjectId validation**
* **Role-based authorization** (`student` vs `admin`)
* **Ownership checks**

### Image Handling
* **Multer** (Multipart memory buffer handling)
* **Cloudinary API** (Cloud image storage with inline Data URI fallback)

## 🗄️ Database Models

The backend manages 9 core Mongoose schema models:

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

### Book Product Schema

The `Product` model includes the following fields:

* `title` (String, Required)
* `description` (String, Required)
* `category` (String, Required)
* `price` (Number, Default: 0)
* `condition` (Enum: `New`, `Like New`, `Good`, `Fair`, `Used`)
* `author` (String)
* `edition` (String)
* `publisher` (String)
* `subject` (String)
* `semester` (String)
* `course` (String)
* `isbn` (String)
* `images` ([String])
* `listingType` (Enum: `sell`, `exchange`, `both`)
* `location` (String)
* `status` (Enum: `available`, `reserved`, `sold`, `exchanged`, `removed`)
* `seller` (ObjectId ref: `User`)
* `timestamps` (`createdAt`, `updatedAt`)

### Listing Types
* `sell` - Book available for purchase
* `exchange` - Book available for item swap only
* `both` - Book open for either purchase or exchange

### Book Conditions
* `New`
* `Like New`
* `Good`
* `Fair`
* `Used`

### Product Statuses
* `available` - Active on marketplace
* `reserved` - Pending purchase order
* `sold` - Transaction completed (sale)
* `exchanged` - Transaction completed (exchange)
* `removed` - Moderated or withdrawn by owner

---

## 🔐 Security Rules

* Passwords are hashed using `bcryptjs` before database persistence.
* Passwords are never returned in API responses.
* JWT authentication protects private endpoints via HTTP Bearer headers.
* Admin APIs require valid JWT with `role === 'admin'`.
* Public student registration strictly enforces `role: 'student'`.
* Blocked users (`isBlocked === true`) cannot post listings, place orders, make inquiries, or propose exchanges.
* Ownership validation ensures students can edit/delete only their own listings.
* Self-action prevention:
  * Users **cannot** buy their own book listings.
  * Users **cannot** send inquiries for their own book listings.
  * Users **cannot** initiate exchange requests on their own listings.
* Removed or sold products cannot be ordered or exchanged.
* Duplicate wishlist entries are strictly prevented.
* Reviews are allowed only after an order status reaches `completed`.
* Duplicate reviews are prevented (1 review per completed order).
* Role or user identity passed in request bodies is never trusted; identity is derived strictly from the verified JWT.

---

## 🌐 API Modules

The backend provides REST APIs under `/api`:

```text
/api/auth       - Registration, Login, Profile, Password management
/api/users      - User profile lookups
/api/products   - Academic book search, filtering, pagination, CRUD operations
/api/categories - Academic category management
/api/orders     - Purchase order creation and status tracking
/api/exchanges  - Book exchange proposals and completion
/api/inquiries  - Buyer-seller book inquiry messaging
/api/wishlist   - Saved books wishlist management
/api/reviews    - Seller rating and feedback submission
/api/reports    - Listing and user violation reporting
/api/admin      - System analytics, user blocking, listing moderation
```

---

## 💳 Payment & Handover Workflow

This is an academic project and does **not** include a real online payment gateway (such as Stripe or Razorpay). 

Orders represent a marketplace purchase request and campus handover workflow. Students connect on campus (e.g. library, canteen, computer lab) to inspect books, exchange funds or swap textbooks, and confirm order completion online.

---

## 🚀 Production Deployment Architecture

The application is designed to be deployed on **Render** using a single Web Service architecture:

* **Web Service (Render)**: Hosts both Backend (Node.js/Express) and Frontend (React build) together. Express serves the static production build from `client/dist` for non-API routes.
* **Database**: Hosted on **MongoDB Atlas** (cloud database cluster).
* **Media Storage**: Hosted on **Cloudinary** for book product images.

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory based on `.env.example`:

```env
PORT=5000
NODE_ENV=development

CLIENT_URL=http://localhost:5173

MONGO_URI=mongodb://127.0.0.1:27017/college_exchange_hub

JWT_SECRET=your_jwt_secret_key_here

ADMIN_EMAIL=admin@collegeexchange.edu
ADMIN_PASSWORD=your_admin_password_here

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

VITE_API_URL=http://localhost:5000/api
```

> 🔒 **Security Notice**: Real database connection strings, passwords, or secret keys are never hardcoded or committed to GitHub.

---

## 🚀 How to Run the Project (Project Kaise Run Karein)

Follow these step-by-step instructions to run the application locally on your computer.

### 📋 Prerequisites (Prerequisite Check)
1. **Node.js** (v16.x or higher) installed on your system. Verify with `node -v`.
2. **MongoDB** running locally on `mongodb://127.0.0.1:27017` **OR** a cloud connection string from **MongoDB Atlas**.

---

### 1️⃣ Step 1: Clone or Open Project Directory
Open your terminal (PowerShell, Command Prompt, or Git Bash) in the project root directory:
```bash
cd "College Exchange  Resell Hub"
```

---

### 2️⃣ Step 2: Create Environment File (`.env`)
Create a `.env` file in the root directory (copy from `.env.example`):
```env
PORT=5000
NODE_ENV=development

CLIENT_URL=http://localhost:5173

MONGO_URI=mongodb://127.0.0.1:27017/college_exchange_hub

JWT_SECRET=bca_college_book_exchange_super_secret_jwt_key_2026

ADMIN_EMAIL=admin@collegeexchange.edu
ADMIN_PASSWORD=AdminPass123!

VITE_API_URL=http://localhost:5000/api
```

---

### 3️⃣ Step 3: Install All Dependencies
Run the following commands to install dependencies for root, backend server, and frontend client:

```bash
# 1. Install root dependencies
npm install

# 2. Install backend dependencies
cd server
npm install

# 3. Install frontend dependencies
cd ../client
npm install

# 4. Return to root directory
cd ..
```

---

### 4️⃣ Step 4: Seed Database (Admin & Sample Book Data)
Before starting the servers, populate your MongoDB database with the default Admin user and academic book categories:

```bash
# Create default Admin account
npm run seed:admin

# Create academic categories & demo BCA textbook listings
npm run seed:data
```

---

### 5️⃣ Step 5: Start the Backend & Frontend Servers

#### Option A: Running from Root Directory (Recommended)
Open **two terminal windows** in the root directory:

* **Terminal 1 (Backend Express Server)**:
  ```bash
  npm run server:dev
  ```
  *(Server runs at `http://localhost:5000`)*

* **Terminal 2 (Frontend React/Vite Client)**:
  ```bash
  npm run client
  ```
  *(Client opens at `http://localhost:5173`)*

#### Option B: Running from Subdirectories
* **Terminal 1 (Backend)**:
  ```bash
  cd server
  npm run dev
  ```

* **Terminal 2 (Frontend)**:
  ```bash
  cd client
  npm run dev
  ```

---

### 🔑 Default Demo Login Credentials

Once the application is running, open `http://localhost:5173` in your web browser. You can log in using these demo credentials:

* 👨‍🎓 **Student Demo Account**:
  - Email: `alex@college.edu`
  - Password: `StudentPass123!`
* 👑 **Admin Demo Account**:
  - Email: `admin@collegeexchange.edu`
  - Password: `AdminPass123!`

---

## 📂 Project Structure

```text
BCA College Book Exchange / Resell Hub/
│
├── client/
│   ├── public/
│   │
│   └── src/
│       ├── components/
│       │   ├── admin/
│       │   ├── common/
│       │   ├── dashboard/
│       │   └── products/
│       ├── context/
│       ├── hooks/
│       ├── layouts/
│       ├── pages/
│       │   ├── admin/
│       │   ├── auth/
│       │   └── student/
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

## 🎯 Project Objectives

1. Build a college-focused academic book marketplace.
2. Help students buy affordable used books.
3. Allow students to sell books they no longer need.
4. Enable student-to-student book exchange.
5. Provide book-specific search and filtering.
6. Provide secure authentication and authorization.
7. Store marketplace data using MongoDB.
8. Provide admin moderation and management.
9. Support wishlist, inquiry, order, exchange, review and reporting workflows.
10. Provide a responsive and user-friendly web application.

---

## 🔮 Future Enhancements

* Online payment gateway integration
* Real-time in-app chat between buyers and sellers
* Push & email notifications for orders and exchange updates
* College email domain verification (`@college.edu`)
* AI-based book recommendations
* Book recommendations based on student semester and subject
* ISBN barcode scanning for auto-filling book details
* Automated book cover image verification
* Automated fraud detection
* Mobile application (React Native)
* Advanced analytics dashboard for campus book trends

---

## 👨‍💻 Project Information

* **Project Name**: BCA College Book Exchange / Resell Hub
* **Course**: Bachelor of Computer Applications (BCA)
* **Institute**: Invertis University
* **Project Type**: Final-Year BCA Project
* **Technology**: MERN Stack (MongoDB, Express.js, React.js, Node.js)
* **Language**: JavaScript (JSX)

---

## 📄 License

This project is developed for academic and educational purposes as a final-year BCA project.
