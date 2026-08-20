# REo Collection 🛍️

A premium, modern, mobile-first Indian fashion e-commerce platform with a full-featured industrial-level Admin Panel. Built with React 19, Vite, Node.js, Express, and MongoDB.

---

## ✨ Features

### 🛒 Customer Storefront
- Responsive mobile-first design
- Hero banners with smooth animations
- Product listing with filters, sort, search
- Product detail page with size/color selection
- Wishlist with heart spark animation ❤️
- Cart with live sync (localStorage + server)
- Razorpay payment integration
- Order tracking with animated delivery timeline
- User account: Orders, Addresses, Profile, Wishlist
- Guest checkout support

### 🔐 Auth System
- JWT-based login / register
- Forgot password + reset via email
- Protected routes for account & checkout

### ⚙️ Admin Panel v2 (Industrial Level)
- **Premium dark sidebar** with collapsible mode (icon-only / full)
- **Mobile bottom navigation** bar
- **Animated Dashboard** — Revenue, Orders, Customers, Pending Action stats with counter animation + Order Breakdown progress bars
- **Orders Management** — Status tabs (Pending / Processing / Shipped / Delivered / Cancelled), live search, color-coded badges
- **Order Details** — Status update, tracking number, customer info
- **🖨️ Print Invoice** — A4 Blinkit/Flipkart style invoice via `window.print()`
- **📦 Inventory Manager** — Inline stock editing, low stock alerts 🔴🟡🟢, CSV export, bulk update API
- **Product Management** — Add / Edit / Delete products with Cloudinary image upload
- **Category Management** — CRUD with slug auto-generation
- **Banner Management** — Hero + Mobile banners with image size hints
- **User Management** — View all registered customers & admins

---

## 🏗️ Tech Stack

### Frontend
| Library | Version | Purpose |
|---------|---------|---------|
| React | 19 | UI framework |
| Vite | latest | Build tool |
| Tailwind CSS v4 | latest | Styling |
| Redux Toolkit | latest | State management |
| React Router | v6 | Routing |
| Framer Motion | latest | Animations |
| Lucide React | latest | Icons |
| Axios | latest | HTTP client |
| Swiper | latest | Carousels |

### Backend
| Library | Purpose |
|---------|---------|
| Node.js + Express | REST API |
| MongoDB + Mongoose | Database |
| JWT + bcryptjs | Authentication |
| Cloudinary + Multer | Image storage & upload |
| Razorpay | Payment gateway |
| Helmet + CORS | Security |
| express-rate-limit | Rate limiting |

---

## 🚀 Getting Started

### Prerequisites
- Node.js >= 18
- MongoDB (local or Atlas)
- Cloudinary account
- Razorpay account (for payments)

### Installation

```bash
# Clone the repo
git clone https://github.com/DivxAyush/REoCollections.git
cd REoCollections

# Install client dependencies
cd client && npm install

# Install server dependencies
cd ../server && npm install
```

### Environment Variables

**Server** (`server/.env`):
```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret
CLIENT_URL=http://localhost:5173
```

**Client** (`client/.env`):
```env
VITE_API_URL=http://localhost:5000/api
VITE_RAZORPAY_KEY_ID=your_key_id
```

### Run Locally

```bash
# Start server (from /server)
npm run dev

# Start client (from /client)
npm run dev
```

---

## 📁 Project Structure

```
REoCollections/
├── client/                  # React + Vite frontend
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── layouts/         # MainLayout, AdminLayout, AccountLayout
│   │   ├── pages/
│   │   │   ├── admin/       # Admin Panel pages
│   │   │   └── account/     # Customer account pages
│   │   ├── hooks/           # Custom hooks (useCart, useWishlist, useAuth...)
│   │   ├── redux/           # Redux slices & selectors
│   │   ├── services/        # API client & services
│   │   ├── constants/       # API endpoints, routes
│   │   └── styles/          # Global CSS + print styles
│
├── server/                  # Node.js + Express backend
│   ├── src/
│   │   ├── controllers/     # Route controllers
│   │   ├── models/          # Mongoose models
│   │   ├── routes/          # Express routes
│   │   └── middleware/      # Auth, error handler, admin guard
```

---

## 🖨️ Invoice Printing

Open any order in the Admin Panel → click **"Print Invoice"** → browser print dialog opens with a clean A4-formatted invoice (company header, itemized table, totals, payment details). No extra libraries needed — uses `window.print()` + `@media print` CSS.

---

## 📦 Inventory Management

Navigate to **Admin → Stock Manager** to:
- View all products with current stock levels
- Click any stock number to **edit it inline** (press Enter to save)
- Filter by: All / Out of Stock / Low Stock / In Stock
- **Export to CSV** for offline management
- Red/Yellow/Green color coding for critical stock levels

---

## 🌐 Deployment

- **Frontend:** Vercel (auto-deploy from `main` branch)
- **Backend:** Render (with health check endpoint at `/api/health`)

---

## 📄 License

Private — REo Collection. All rights reserved © 2026
