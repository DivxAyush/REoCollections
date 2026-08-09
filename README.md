# REo Collection

A premium, modern, mobile-first Indian fashion e-commerce platform built with React 19, Vite, Node.js, Express, and MongoDB.

---

## Project Structure

```
REo-Collection/
├── client/          ← Vite + React 19 + Tailwind CSS (Customer Frontend)
├── server/          ← Node.js + Express + MongoDB (REST API)
└── README.md
```

---

## Tech Stack

### Frontend
- React 19 + Vite (latest)
- Tailwind CSS
- Redux Toolkit + React Redux
- React Router v6
- Axios
- React Hook Form + Zod
- Lucide React
- Framer Motion
- Swiper

### Backend
- Node.js + Express.js
- MongoDB + Mongoose
- JWT Authentication
- bcryptjs
- Cloudinary (image storage)
- Multer
- Helmet + CORS + Rate Limiting

---

## Getting Started

### Prerequisites
- Node.js >= 18
- MongoDB (local or Atlas)
- Cloudinary account

### 1. Clone & Install

```bash
# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install
```

### 2. Environment Variables

**Client** — copy `client/.env.example` to `client/.env`:
```
VITE_API_BASE_URL=http://localhost:5000/api
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

**Server** — copy `server/.env.example` to `server/.env`:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/reo-collection
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=7d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLIENT_URL=http://localhost:5173
```

### 3. Seed Database

```bash
cd server
npm run seed
```

### 4. Run Development Servers

```bash
# Terminal 1 — Start server
cd server
npm run dev

# Terminal 2 — Start client
cd client
npm run dev
```

Client: http://localhost:5173  
API: http://localhost:5000

---

## API Documentation

Base URL: `http://localhost:5000/api`

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /auth/register | Register customer |
| POST | /auth/login | Login |
| POST | /auth/logout | Logout |
| GET | /auth/me | Current user |
| GET | /products | Product listing with filters |
| GET | /products/:slug | Product detail |
| GET | /homepage | Homepage data (banners, sections, products) |
| GET | /categories | Category list |
| GET | /banners/active | Active banners |
| GET | /cart | User cart |
| POST | /cart | Add to cart |
| GET | /wishlist | User wishlist |
| POST | /wishlist | Add to wishlist |
| POST | /orders | Create order |
| GET | /orders | User orders |

---

## Architecture Notes

- **Config-driven homepage**: All sections, banners, and content are API/database driven. No hardcoded content in frontend components.
- **Admin-ready**: Database models and API structure support future admin panel without frontend changes.
- **Guest cart/wishlist**: Persisted to localStorage for unauthenticated users, synced on login.
- **Image storage**: All images stored on Cloudinary. MongoDB stores only URL + public_id.
- **All files use .jsx**: No .js source files in the project (except tooling configs where .mjs is appropriate).

---

## License

Private — REo Collection. All rights reserved.
