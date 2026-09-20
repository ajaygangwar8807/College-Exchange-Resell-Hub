# System Rules & Technical Architecture Guidelines (RULES.md)

This document contains the non-negotiable architectural rules, business logic enforcement policies, and security guidelines for the **College Exchange / Resell Hub** project.

---

## 1. ABSOLUTE TECH STACK & LANGUAGE CONSTRAINTS

### 1.1 JavaScript-Only Rule (NON-NEGOTIABLE)
- **Allowed**: `.js` and `.jsx` files only.
- **Strictly FORBIDDEN**: `.ts`, `.tsx`, `tsconfig.json`, TypeScript interfaces, types, enums, generics, or type annotations.
- The entire frontend and backend must remain 100% JavaScript.

### 1.2 MERN Architecture
- **Database**: Real persistent MongoDB instance via Mongoose ORM (`MONGO_URI`). In-memory stores must NOT be used as the primary database.
- **Backend**: Node.js & Express.js REST API with Helmet, CORS, and Express Rate Limiters.
- **Frontend**: React.js initialized with Vite, styled using Tailwind CSS and Lucide React icons.

---

## 2. AUTHENTICATION & AUTHORIZATION RULES

### 2.1 Password Security
- Passwords must ALWAYS be hashed using `bcryptjs` before persisting to MongoDB (salt factor 10).
- API responses must NEVER expose password hashes or sensitive security credentials.

### 2.2 JWT Token Mechanics
- JWT payload contains `userId` and `role`.
- Passed via HTTP header: `Authorization: Bearer <token>`.
- Derived identity from JWT must be used for authorization; NEVER trust role, seller ID, or buyer ID sent from frontend body parameters.

### 2.3 Registration Enforcement
- Public registration (`POST /api/auth/register`) strictly assigns `role: 'student'`.
- Users must NEVER be able to choose, request, or submit an `admin` role during registration.

### 2.4 Admin Account Provisioning
- Admin accounts can ONLY be created via the secure seed script (`server/scripts/seedAdmin.js`) using environment variables `ADMIN_EMAIL` and `ADMIN_PASSWORD`.

### 2.5 Blocked User Restrictions
- Suspended/blocked users (`isBlocked === true`):
  - CANNOT create product listings or edit listings.
  - CANNOT place purchase orders.
  - CANNOT send exchange requests.
  - CANNOT submit buyer inquiries.
  - CAN view public marketplace pages.

---

## 3. MARKETPLACE BUSINESS RULES

### 3.1 Self-Action Prevention
- **Self-Purchase**: A user CANNOT place a purchase order on their own listing.
- **Self-Inquiry**: A user CANNOT send an inquiry message on their own listing.
- **Self-Exchange**: A user CANNOT initiate an exchange request for their own listing.

### 3.2 Ownership & Data Access Control
- A student can edit/delete ONLY their own product listings.
- A student can view ONLY their own orders, exchange requests, inquiries, wishlist, and reports.
- Admins have system-wide moderation authority to soft-remove products or block users, but CANNOT block or delete their own admin account.

### 3.3 Product Status Transitions
- **Listing Statuses**: `available` | `reserved` | `sold` | `exchanged` | `removed`.
- When a purchase order is created: Product status transitions from `available` → `reserved`.
- When an order is completed: Product status transitions from `reserved` → `sold`.
- When an order is cancelled: Product status reverts from `reserved` → `available`.
- When an exchange is completed: Both requested and offered products transition to `exchanged`.
- Removed items (`status === 'removed'`) are hidden from public browsing but preserved for transaction history.

### 3.4 Review & Rating Rules
- Only COMPLETED orders (`status === 'completed'`) can be reviewed.
- Only the buyer of the order can write a review for the seller.
- Maximum 1 review per completed order (duplicate review prevention).

### 3.5 Wishlist Rules
- Duplicate products in a user's wishlist are strictly prevented.

---

## 4. API & RESPONSE CONVENTIONS

### 4.1 Standard JSON Response Format

**Success Response**:
```json
{
  "success": true,
  "message": "Operation description",
  "data": { ... }
}
```

**Error Response**:
```json
{
  "success": false,
  "message": "Human readable error message"
}
```

### 4.2 Standard HTTP Status Codes
- `200 OK`: Successful GET / PATCH / DELETE
- `201 Created`: Successful resource creation (POST)
- `400 Bad Request`: Validation failure or business rule violation
- `401 Unauthorized`: Missing, invalid, or expired JWT token
- `403 Forbidden`: Admin access required or suspended user attempt
- `404 Not Found`: Resource or route does not exist
- `500 Internal Server Error`: Server exception (stack trace hidden in production)
