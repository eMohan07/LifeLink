# LifeLink — Smart Blood Donation & Emergency Donor Management

**LifeLink** is a role-based, full-stack MERN application designed for smart blood donation and emergency donor management. It combines a 2dsphere spatial proximity query engine, red blood cell compatibility matrices, 56-day donor cooldown rules, and a dedicated AI Service Layer for predictive medical logistics telemetry.

---

## 🔁 The Core Loop

Every feature across auth, dashboards, and hospital management feeds or consumes this single closed loop:

```
Emergency Request → Smart Donor Matching → Donor Response → Donation Tracking → Analytics → AI Insight
```

---

## 🏛️ High-Level Architecture (3-Tier + AI Service Layer)

```
CLIENT LAYER (React 18 + Vite + Tailwind CSS + Recharts)
  │
  ├── REST (JSON, HTTPS)
  v
API GATEWAY & DOMAIN SERVICES (Express.js + Node.js)
  ├── Auth Service (JWT + RBAC)
  ├── Donor Service (Profile & GeoJSON 2dsphere)
  ├── Hospital Service (Inventory Management)
  ├── Request Service (Emergency Lifecycle)
  ├── Pure Matching Engine (Compatibility + Cooldown + Proximity + Health Scores)
  ├── Notification Stub (In-App & Console Alerts)
  ├── Analytics Aggregation (Recharts Data Feed)
  └── AI Service Layer (/api/ai/* with strict rate limiting & LLM fallback)
  │
  v
DATA LAYER (MongoDB Atlas / In-Memory Mongo Fallback via Mongoose ODM)
```

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### 1. Backend Setup & Demo Seeding

```bash
cd server
npm install

# Run demo database seeding (uses MongoDB Memory Server if MONGODB_URI is not set)
npm run seed

# Start API server in dev mode (runs on port 5000)
npm run dev
```

### 2. Frontend Setup

```bash
cd client
npm install

# Start Vite client dev server (runs on port 5173 with proxy to 5000)
npm run dev
```

Access the application in your browser at `http://localhost:5173`.

---

## 🔑 Demo Account Credentials

After running `npm run seed` in `server/`, you can log in using any of the following pre-configured demo credentials:

| Role | Email | Password | Description |
| :--- | :--- | :--- | :--- |
| **Donor** | `donor1@lifelink.com` | `donor123` | Universal O- Negative standby donor |
| **Recipient** | `recipient@lifelink.com` | `recipient123` | Emergency request requester |
| **Hospital** | `hospital@lifelink.com` | `hospital123` | City General Emergency Hospital inventory manager |
| **Admin** | `admin@lifelink.com` | `admin123` | Superadmin command & AI Insights Panel |

---

## ⚙️ Environment Variables

Create `.env` in `server/` (optional for local testing; sensible fallbacks are provided out-of-the-box):

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/lifelink
JWT_SECRET=lifelink_secret_jwt_key_2026
OPENAI_API_KEY=your_openai_api_key_here
```

---

## 🎯 Verification & Testing

- **Pure Matching Engine Unit Test**: Run `node src/test_matching.js` inside `server/` to assert scoring rules.
- **Frontend Production Build**: Run `npm run build` inside `client/`.
