# PurrConnect

> **Connecting People With Their Purrfect Companion.**

**PurrConnect** is a full-stack feline discovery and adoption platform built to connect cats with caring individuals and families.

- **Purr** → Cats
- **Connect** → Connecting cats with suitable people and families

---

## Architecture Overview

```text
User Browser
    │
    ▼
Vercel (Production Frontend / Vite SPA)
    │
    ▼
Render (Production Backend REST API / Node.js + Express)
    │
    ▼
MongoDB Atlas (Cloud Database / Mongoose ODM)
```

---

## Features

### 🐾 Public Platform
- **Cat Discovery & Listings**: Explore available companion cats with high-resolution imagery, pricing, age, location, and breed.
- **Search, Filtering & Sorting**: Multi-parameter search by keyword, breed (Persian, British Shorthair, Ragdoll, Maine Coon, Siamese, Bengal, etc.), gender, age unit, location, and price range.
- **Cat Details & Gallery**: Comprehensive profiles with responsive thumbnail switcher, health status, vaccination badges, personality traits, and descriptions.
- **Interactive Favorites**: Client-side bookmarking with heart toggles persisted in `localStorage`.
- **Adoption Enquiry System**: Modal-based and dedicated contact page inquiry forms with client and server-side validation.
- **WhatsApp Integration**: One-click direct WhatsApp connection pre-filled with the feline's name and details.
- **Client Testimonials**: Verified adopter reviews with star ratings, locations, and feline references.
- **Responsive Navigation**: Mobile slide-out drawer, sticky header, and breadcrumbs.

### 🛡️ Administrative Portal
- **Admin Authentication**: Secure JWT-based login with bcrypt password hashing and administrative role verification.
- **Protected Routes**: Client-side route guards redirecting unauthenticated or non-admin visitors to `/admin/login`.
- **Metrics Dashboard (`/admin/dashboard`)**: Real-time aggregated statistics:
  - Total Cats
  - Available Cats
  - Reserved Cats
  - Sold Cats
  - Total Enquiries
  - New Enquiries
  - Total Testimonials
  - Recent enquiries review and recently added cats.
- **Cat Management (`/admin/cats`)**:
  - Full catalog table (desktop) and stacked cards (mobile) with zero horizontal overflow.
  - Create Cat (`/admin/cats/new`): Reusable form with personality tag manager and photo gallery URL manager.
  - Edit Cat (`/admin/cats/:id/edit`): Pre-populated editing with automatic slug maintenance.
  - Delete Cat: Confirmation modal with instant catalog refresh.
- **Enquiry Management (`/admin/enquiries`)**:
  - Filter inquiries by status (`new`, `contacted`, `closed`).
  - Update status directly from table or detail modal.
  - Direct email (`mailto:`) and phone (`tel:`) action links.
- **Testimonial Management (`/admin/testimonials`)**:
  - Live approval toggle (instantly show/hide reviews from public visitors).
  - Add and Edit review modals with rating selector and avatar previews.
  - Delete confirmation workflow.

---

## Tech Stack

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Language**: JavaScript (ES Modules)
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **HTTP Client**: Axios (with centralized request/response interceptors)
- **Icons**: Lucide React

### Backend
- **Runtime**: Node.js (v18+)
- **Framework**: Express 4
- **Database**: MongoDB & Mongoose ODM
- **Authentication**: JSON Web Tokens (`jsonwebtoken`) & `bcrypt`
- **Validation**: Zod schema validation
- **Security**: Helmet, CORS origin filtering
- **Logging**: Morgan

---

## Project Structure

```text
purrconnect/
├── backend/
│   ├── postman/                     # Postman test collection
│   ├── src/
│   │   ├── config/                  # DB and environment configuration
│   │   ├── controllers/             # Express controllers (auth, cat, enquiry, testimonial, dashboard)
│   │   ├── middleware/              # Auth, validation, and error handling middleware
│   │   ├── models/                  # Mongoose models (User, Cat, Enquiry, Testimonial)
│   │   ├── routes/                  # Express API routes
│   │   ├── scripts/                 # Seed data and admin creation scripts
│   │   ├── services/                # Business logic services
│   │   ├── utils/                   # Helpers (AppError, apiResponse, pagination, slugify)
│   │   ├── validators/              # Zod validation schemas
│   │   ├── app.js                   # Express application setup
│   │   └── server.js                # Server entry point
│   ├── .env.example
│   ├── .gitignore
│   └── package.json
│
├── frontend/
│   ├── public/                      # Static assets
│   ├── src/
│   │   ├── components/
│   │   │   ├── admin/               # AdminLayout, ProtectedRoute, CatForm
│   │   │   ├── cats/                # CatCard, CatFilters, EnquiryModal, FavoriteButton
│   │   │   ├── common/              # EmptyState, ErrorMessage, LoadingSpinner
│   │   │   ├── home/                # FeaturedCats, Testimonials
│   │   │   └── layouts/             # Navbar, Footer, PublicLayout
│   │   ├── context/                 # AuthContext (JWT management & session sync)
│   │   ├── hooks/                   # useFavorites hook
│   │   ├── pages/
│   │   │   ├── admin/               # AdminLogin, Dashboard, Cats, CatCreate, CatEdit, Enquiries, Testimonials
│   │   │   ├── CatDetails.jsx       # Public feline profile
│   │   │   ├── Cats.jsx             # Public catalog & search
│   │   │   ├── Contact.jsx          # Public inquiry page
│   │   │   ├── Home.jsx             # Public landing page
│   │   │   └── NotFound.jsx         # 404 page
│   │   ├── services/                # API client services (api, auth, cat, enquiry, testimonial, dashboard)
│   │   ├── utils/                   # imageUtils (offline SVG fallbacks)
│   │   ├── App.jsx                  # Main routing configuration
│   │   ├── index.css                # Tailwind directives & styles
│   │   └── main.jsx                 # React root mount
│   ├── .env.example
│   ├── .gitignore
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   ├── vercel.json                  # SPA rewrites for Vercel
│   └── vite.config.js
│
├── .gitignore
└── README.md
```

---

## Environment Variables

### Backend (`backend/.env`)
| Variable | Description | Example |
|---|---|---|
| `PORT` | Port for Express server | `5000` |
| `NODE_ENV` | Environment mode | `development` or `production` |
| `MONGODB_URI` | MongoDB connection URI | `mongodb://127.0.0.1:27017/purrconnect` or Atlas URI |
| `CLIENT_URL` | Allowed frontend origin(s) | `http://localhost:5173` or `https://purrconnect.vercel.app` |
| `JWT_SECRET` | 32+ character cryptographic secret | `<generated random hex string>` |
| `JWT_EXPIRES_IN` | Token expiration period | `1d` |
| `ADMIN_NAME` | Used by `npm run create-admin` | `Admin User` |
| `ADMIN_EMAIL` | Admin login email | `admin@purrconnect.com` |
| `ADMIN_PASSWORD` | Admin initial password (min 8 chars) | `AdminSecret123` |

### Frontend (`frontend/.env`)
| Variable | Description | Example |
|---|---|---|
| `VITE_API_URL` | Base URL of the backend API | `http://localhost:5000/api` or `https://purrconnect-api.onrender.com/api` |

---

## Local Setup

### Prerequisites
- Node.js (v18.0.0 or higher)
- MongoDB (Running locally or MongoDB Atlas connection string)
- npm or yarn

### 1. Clone & Install

```bash
# Backend setup
cd backend
cp .env.example .env
# Edit .env with your MONGODB_URI and JWT_SECRET
npm install

# Seed demo cats, testimonials, and sample inquiries
npm run seed

# Create initial administrator account
npm run create-admin

# Start backend server
npm run dev
```

```bash
# Frontend setup (in a new terminal)
cd frontend
cp .env.example .env
npm install

# Start Vite development server
npm run dev
```

- **Frontend**: `http://localhost:5173`
- **Backend API**: `http://localhost:5000/api`
- **API Health**: `http://localhost:5000/api/health`
- **Admin Portal**: `http://localhost:5173/admin/login`

---

## API Documentation

### Public Endpoints
- `GET /api/health` — Service and database health check
- `POST /api/auth/login` — Authenticate admin or user credentials
- `GET /api/cats` — List cats (supports `search`, `breed`, `gender`, `location`, `status`, `minPrice`, `maxPrice`, `page`, `limit`, `sort`)
- `GET /api/cats/:id` — Fetch single cat by MongoDB `_id` or unique `slug`
- `POST /api/enquiries` — Submit an adoption enquiry
- `GET /api/testimonials` — List approved testimonials (optional query: `limit`)

### Protected Endpoints (Requires `Authorization: Bearer <JWT>`)
- `GET /api/auth/me` — Retrieve currently authenticated user profile
- `GET /api/dashboard/stats` — Retrieve platform live counts and recent items *(Admin only)*
- `POST /api/cats` — Create a new cat listing *(Admin only)*
- `PUT /api/cats/:id` — Update existing cat by ID *(Admin only)*
- `DELETE /api/cats/:id` — Remove cat listing *(Admin only)*
- `GET /api/enquiries` — Fetch paginated enquiries *(Admin only, query: `status`, `page`, `limit`)*
- `PUT /api/enquiries/:id` — Update enquiry status (`new`, `contacted`, `closed`) *(Admin only)*
- `GET /api/testimonials?approved=all` — Fetch all testimonials including pending *(Admin only)*
- `POST /api/testimonials` — Create a testimonial *(Admin only)*
- `PUT /api/testimonials/:id` — Update testimonial or toggle approval *(Admin only)*
- `DELETE /api/testimonials/:id` — Remove a testimonial *(Admin only)*

---

## Deployment Guide

### 1. Database — MongoDB Atlas
1. Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/atlas).
2. Create a database user with read/write privileges.
3. Under **Network Access**, add `0.0.0.0/0` (allow access from anywhere) so Render can connect.
4. Copy your connection string:
   `mongodb+srv://<user>:<password>@cluster.mongodb.net/purrconnect?retryWrites=true&w=majority`

### 2. Backend — Render
1. Create a new **Web Service** on [Render](https://render.com) connected to your GitHub repository.
2. Set **Root Directory** to `backend`.
3. Set **Build Command** to `npm install`.
4. Set **Start Command** to `node src/server.js`.
5. Add Environment Variables:
   - `NODE_ENV` = `production`
   - `MONGODB_URI` = `<Your MongoDB Atlas connection URI>`
   - `JWT_SECRET` = `<32+ random hex characters>`
   - `CLIENT_URL` = `https://<your-vercel-app>.vercel.app`
6. Deploy the web service and copy the provided URL (e.g., `https://purrconnect-api.onrender.com`).

### 3. Frontend — Vercel
1. Import your GitHub repository on [Vercel](https://vercel.com).
2. Set **Root Directory** to `frontend`.
3. Framework Preset: **Vite**.
4. Set Environment Variable:
   - `VITE_API_URL` = `https://purrconnect-api.onrender.com/api`
5. Deploy. The included `vercel.json` ensures client-side routing works seamlessly across refreshes.

---

## Testing & Quality Assurance

### Verification Checkpoints
- **Responsive Breakpoints Verified**:
  - `1440px` (Desktop): Full fixed sidebar, grid metrics, data tables.
  - `1024px` (Laptop): Compact layout, responsive 2/4 column stat cards.
  - `768px` (Tablet): Sidebar converts to slide-out drawer, touch friendly.
  - `390px` (Mobile): Complete mobile card view, zero horizontal scrolling.
- **Image Resilience**: SVG fallback data URIs ensure no image is ever broken even if external image CDNs go down.
- **Protected Routes**: Unauthenticated URL visits are intercepted and redirected to `/admin/login`.

---

## AI Tools Used
- Developed in pair-programming with **Google Antigravity** (DeepMind Agentic Architecture).

---

## Known Limitations
- Image URLs are currently stored as remote HTTPS links (Unsplash, CATAAS, Cloudinary, etc.) rather than on-premise binary storage.
- WhatsApp links trigger WhatsApp Web or mobile apps with pre-filled messages; actual messaging requires the user's active WhatsApp account.
