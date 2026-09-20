# System Rules & Technical Architecture Guidelines (RULES.md)

**Official Project Name**: **BCA College Book Exchange / Resell Hub**  
**Project Type**: Final-Year BCA Project (Invertis University)  
**Version**: 1.0  

This document contains the non-negotiable architectural rules, business logic enforcement policies, security guidelines, and coding standards for the **BCA College Book Exchange / Resell Hub** project.

---

## 1. Project Identity and Scope
- **Official Name**: BCA College Book Exchange / Resell Hub.
- **Domain Scope**: A hyper-local peer-to-peer academic book and course material marketplace for college students.
- **Academic Focus**: Textbooks, notes, lab manuals, programming books, computer science references, and entrance exam preparation material. General marketplace items (furniture, appliances, electronics) are strictly out of scope.

## 2. Mandatory MERN Technology Stack
- **Database**: MongoDB with Mongoose ORM.
- **Backend**: Node.js & Express.js REST API with Helmet, CORS, and Express Rate Limit.
- **Frontend**: React.js initialized with Vite, styled using Tailwind CSS and Lucide React icons.
- **State & Routing**: React Router DOM v6, Context API (`AuthContext`, `ProductContext`, `WishlistContext`), Axios HTTP client.
- **Forbidden Stacks**: Do NOT replace MERN with Next.js, Supabase, Firebase, PostgreSQL, Prisma, GraphQL, or alternative full-stack frameworks.

## 3. JavaScript-Only Requirement (NON-NEGOTIABLE)
- **Allowed**: `.js` and `.jsx` files ONLY.
- **Forbidden**: `.ts`, `.tsx`, `tsconfig.json`, TypeScript interfaces, types, enums, generics, or type annotations.
- The entire application (client, server, tools, scripts) must remain 100% pure JavaScript.

## 4. Reading Project Documentation Before Coding
- Developers and AI coding agents MUST inspect and adhere to `README.md`, `PRD.md`, `RULES.md`, and `TASKS.md` before making architectural or code modifications.

## 5. Inspecting Existing Code Before Modifying It
- Always inspect authoritative source files using file viewing and grep tools before adding new endpoints, editing state schemas, or refactoring components.
- Never guess file paths, function signatures, model fields, or component prop structures.

## 6. Reusing Existing Components and Functionality
- Audit the codebase before writing custom utilities or visual components.
- Reuse existing UI components (`Loader`, `EmptyState`, `ErrorMessage`, `ConfirmModal`, `ProductCard`, `ProductFilter`), service APIs (`api.js`, `productService`), and context hooks (`useAuth`, `useFetch`).

## 7. No Unrelated File Modifications
- Touch ONLY files explicitly relevant to the requested task or bug fix.
- Do NOT refactor or touch unrelated controllers, routes, styles, or configuration files.

## 8. Book-Focused Domain Rules
- All products listed on the platform must be academic books, course textbooks, BCA notes, lab manuals, or entrance exam reference guides.
- Imagery, titles, descriptions, and categories must strictly reflect academic and study-related subject matter.

## 9. Book Metadata Schema Rules
- Every book product supports the following standard metadata attributes:
  - `author`: Writer/Author name(s)
  - `edition`: Book edition (e.g. 7th Edition)
  - `publisher`: Publication house
  - `subject`: Academic subject/topic (e.g. Database Management Systems)
  - `semester`: Target semester (`Sem 1` to `Sem 6`)
  - `course`: Target degree/course (`BCA`, `MCA`, `B.Sc CS`, etc.)
  - `isbn`: Standard ISBN number (optional)

## 10. Academic Categories
- The platform strictly enforces 9 academic book categories:
  1. `BCA Textbooks`
  2. `Programming Books`
  3. `DSA & Computer Science`
  4. `DBMS & Operating Systems`
  5. `Networking & Web Development`
  6. `BCA Notes & Lab Manuals`
  7. `Exam Preparation & Reference Books`
  8. `NIMCET / Entrance Preparation`
  9. `Other Academic Books`

## 11. Product Listing Types
- `sell`: Book available for purchase.
- `exchange`: Book available for direct item swap only.
- `both`: Open to either purchase or item exchange.

## 12. Product Conditions
- `New`: Unused condition.
- `Like New`: Minimal wear, no markings.
- `Good`: Normal wear, minor highlighting or notes.
- `Fair`: Visible wear, intact binding.
- `Used`: Well-used, complete pages.

## 13. Product Status Lifecycle
- `available`: Listed and open for purchase/exchange.
- `reserved`: Pending purchase order.
- `sold`: Purchase transaction completed.
- `exchanged`: Exchange transaction completed.
- `removed`: Soft-deleted by owner or admin.

## 14. Authentication Using JWT
- Authentication is token-based using JSON Web Tokens (JWT).
- Tokens are issued upon successful registration or login and passed via `Authorization: Bearer <token>` HTTP headers.
- Identity and user role (`student` vs `admin`) are derived exclusively from verified JWTs on the server.

## 15. Password Hashing Using bcryptjs
- User passwords MUST be hashed using `bcryptjs` (salt factor 10) before MongoDB insertion.
- Raw passwords or hashed passwords must NEVER be returned in API response bodies.

## 16. Role-Based Authorization
- Roles: `student` (default for public registration) and `admin`.
- Public registration strictly assigns `role: 'student'`. Public endpoints must never allow client-assigned `admin` role.
- Admin APIs under `/api/admin/*` require `req.user.role === 'admin'`.

## 17. Ownership Checks
- Students can edit, update status, or soft-remove ONLY their own book listings.
- Students can view ONLY their own orders, exchange requests, inquiries, wishlist, and reports.
- Backend controllers MUST verify `product.seller.toString() === req.user._id.toString()` before mutating listings.

## 18. Blocked-User Restrictions
- Suspended/blocked users (`isBlocked === true`):
  - CANNOT create or edit book listings.
  - CANNOT place purchase orders.
  - CANNOT send exchange proposals.
  - CANNOT submit buyer inquiries.
  - CAN view public marketplace pages.

## 19. API Validation and Error Handling
- Standard JSON response structure:
  - Success: `{ "success": true, "message": "...", "data": { ... } }`
  - Failure: `{ "success": false, "message": "..." }`
- HTTP status codes: `200 OK`, `201 Created`, `400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`, `500 Internal Server Error`.
- Centralized `errorMiddleware.js` handles unhandled exceptions.

## 20. MongoDB / Mongoose Rules
- All entities persist in a real MongoDB database via Mongoose models (`User`, `Category`, `Product`, `Order`, `ExchangeRequest`, `Inquiry`, `Wishlist`, `Review`, `Report`).
- ObjectIds must be validated via `mongoose.Types.ObjectId.isValid()` before querying.
- In-memory mock arrays must never be used as primary database storage.

## 21. Search and Filter Consistency
- Search queries perform full-text matching across `title`, `author`, `subject`, and `description`.
- Filtering supports `category`, `semester`, `course`, `condition`, `listingType`, `maxPrice`, `sortBy`, and `page`.
- Search and filter params must remain synced between URL query parameters, React state, and backend API parameters.

## 22. Cloudinary / Multer Image Upload Rules
- Image uploads use Multer memory storage buffers.
- Cloudinary upload API handles image storage, with automatic inline Data URI fallback if Cloudinary credentials are not configured in environment variables.

## 23. Frontend Component and UI Rules
- Built with React functional components and hooks.
- Styled using Tailwind CSS utility classes and Lucide React icons.
- Must provide clean visual feedback for loading (`Loader`), empty lists (`EmptyState`), and errors (`ErrorMessage`).

## 24. Responsive UI Requirements
- Viewports supported: Desktop (1024px+), Tablet (768px - 1023px), Mobile (<768px).
- Navigation switches to mobile responsive menus on narrow screens.
- Tables, filter sidebars, and product grids must collapse gracefully.

## 25. Admin Panel Rules
- Admin panel (`/admin/*`) is accessible ONLY to authenticated users with `role === 'admin'`.
- Admins can manage users (block/unblock/delete), moderate book listings (soft-remove/restore), monitor orders/exchanges/inquiries/reports, and manage academic categories.
- Admins CANNOT block or delete their own active admin account.

## 26. Environment Variable and Secret Management
- All sensitive credentials (`MONGO_URI`, `JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`) must be loaded strictly from `process.env`.
- Secrets must NEVER be hardcoded into source code files or committed to Git.
- Real production credentials must never be written into `README.md` or `.env.example`.

## 27. Git / GitHub Rules
- Never commit `.env` or `node_modules`.
- Commit messages should be concise, professional, and describe concrete technical changes.

## 28. Testing and Build Rules
- Running `npm run build` in `client/` must complete with 0 bundle errors.
- Running syntax verification (`node --check`) on backend entry points must exit cleanly with code 0.

## 29. Security Requirements
- Helmet for HTTP security header protection.
- CORS configured for allowed origin domain.
- Express Rate Limit enabled on API routes to mitigate brute-force attacks.
- Input validation to protect against NoSQL injection and XSS attacks.

## 30. AI Coding-Agent Workflow
- After modifying files, verify build status and backend syntax before concluding tasks.
- Provide concise summaries of work without unrequested code dumps.

## 31. Documentation Synchronization
- Any change to database schemas, API routes, or features MUST be reflected across `README.md`, `PRD.md`, `RULES.md`, and `TASKS.md`.

## 32. Definition of Done
- Code changes build cleanly (`npm run build`).
- 0 TypeScript files introduced.
- Existing security middleware, auth rules, and database persistent contracts remain intact.
- Features verified through empirical tests.

## 33. Priority Rules When Instructions Conflict
- In case of conflicting instructions, prioritize:
  1. Strict JavaScript-only rule (`.js`/`.jsx` only, 0 TypeScript).
  2. MERN Stack architecture constraints (MongoDB, Express, React, Node).
  3. Security rules (JWT, bcryptjs, ownership, admin authorization).
  4. Core project identity (**BCA College Book Exchange / Resell Hub**).
