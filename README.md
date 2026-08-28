# 🚀 Rolewise — Prepare for the role. Not just the interview.

<div align="center">

![Rolewise Banner](https://img.shields.io/badge/Rolewise-AI_Career_Prep-6366f1?style=for-the-badge&logo=rocket)
[![React 19](https://img.shields.io/badge/React-19.0-61dafb?style=flat-square&logo=react)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-20+-339933?style=flat-square&logo=nodedotjs)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.21-000000?style=flat-square&logo=express)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb)](https://www.mongodb.com/)
[![Google Gemini](https://img.shields.io/badge/Gemini_3.6-Flash-4285F4?style=flat-square&logo=google)](https://aistudio.google.com/)
[![Puppeteer](https://img.shields.io/badge/Puppeteer-ATS_PDF-40B5A4?style=flat-square&logo=puppeteer)](https://pptr.dev/)

**An enterprise-grade Full-Stack AI Career Preparation & ATS Resume Engineering Platform.**  
*Upload your resume, paste any target Job Description (JD), and receive deterministic match scoring, deep-dive technical & behavioral questions, a structured 7-day preparation roadmap, and a tailored 1-page ATS Resume PDF.*

</div>

---

## 🌟 Key Features

- **🎯 Dual-Layer Deterministic Match Scoring (Variance ≤ 1%)**:
  - Uses an explicit 4-part mathematical rubric (`Tech Stack 40%`, `Seniority & Exp 30%`, `Architecture 20%`, `Tools 10%`) + `temperature: 0.0` with Google Gemini 3.6 Flash.
  - Transparent sub-score metrics displayed on the dashboard for absolute user credibility.
- **⚡ SHA-256 Input-Hash Caching**:
  - Automatically identifies duplicate JD + Resume submissions to serve instant reports with 0% score discrepancy and 0 token latency.
- **📄 1-Page Tailored ATS Resume Generator**:
  - Powered by **Puppeteer** headless Chromium.
  - Automatically aligns candidate projects with target JD keywords using the Google XYZ action-verb formula in a single-column, 100% ATS parser-compliant format.
- **💻 Interactive Technical & Behavioral Q&A**:
  - Collapsible accordions showing *Interviewer Intention*, *Model Answers*, and *STAR framework* situational responses.
- **📅 7-Day Sprint Roadmap**:
  - Actionable day-by-day checklist guiding the candidate up to interview day.
- **🔐 Production Security & Authentication**:
  - JWT authentication stored in HTTP-Only, SameSite cookies.
  - Stateful token blacklisting with MongoDB 24h TTL index on logout.
  - In-memory PDF buffer extraction (Multer memory storage, no orphaned disk files).
- **🏛️ Strict 4-Layer React Architecture**:
  - `Layer 4 (API Services)` ➔ `Layer 3 (Context State)` ➔ `Layer 2 (Custom Hooks)` ➔ `Layer 1 (UI Components)`.

---

## 🏗️ System Architecture

```
                                  ROLEWISE ARCHITECTURE
                                  
      [ Client Browser ]  ◄── HTTPS (withCredentials) ──►  [ Frontend SPA (Vite + React 19) ]
              │                                                        │
              │                                                 Layer 4: Axios API
              ▼                                                        │
      [ Express 4 REST API ] ──────────────────────────────────────────┘
        ├── Auth Controller (bcrypt, JWT, Blacklist TTL)
        ├── Interview Controller (JD + PDF parser, SHA-256 Caching)
        ├── Gemini 3.6 Flash Engine (Deterministic 4-Part Rubric)
        └── Puppeteer Service (1-Page ATS Single-Column PDF Generator)
              │                                      │
              ▼                                      ▼
      [ MongoDB Atlas Cloud ]                [ Google GenAI Cloud ]
```

---

## 📁 Repository Structure

```
RoleWise/
├── frontend/                     # React 19 + Vite Frontend SPA
│   ├── src/
│   │   ├── components/           # Reusable UI (Navbar, ProtectedRoute, Orb)
│   │   ├── features/
│   │   │   ├── auth/             # Layer 1-4 Auth Feature (Login, Register, Context)
│   │   │   └── interview/        # Layer 1-4 Interview Feature (Report, Form, Context)
│   │   ├── pages/                # Home / Dashboard
│   │   ├── services/             # Axios API Client Configuration
│   │   └── styles/               # Glassmorphism Design Tokens & CSS
│   ├── vercel.json               # SPA routing rewrite configuration for Vercel
│   └── package.json
│
├── backend/                      # Node.js + Express REST API
│   ├── src/
│   │   ├── config/               # MongoDB Atlas connection handler
│   │   ├── controllers/          # Auth & Interview report controllers
│   │   ├── middlewares/          # JWT auth verification & Multer PDF parser
│   │   ├── models/               # User, Blacklist (TTL), InterviewReport models
│   │   ├── routes/               # Modular Express API routers
│   │   └── services/             # Gemini 3.6 Flash & Puppeteer PDF generators
│   ├── .puppeteerrc.cjs          # Chromium buildpack cache configuration
│   ├── Dockerfile                # Production container configuration
│   ├── render.yaml               # Render Infrastructure-As-Code configuration
│   ├── test_suite.js             # Automated API test suite (9/9 passed)
│   └── server.js                 # Server entry point
└── README.md
```

---

## 🛠️ Local Development Setup

### Prerequisites
- Node.js (v18 or v20+)
- MongoDB Atlas account (or local MongoDB)
- Google Gemini API Key ([Get free key from Google AI Studio](https://aistudio.google.com/app/apikey))

### 1. Clone the Repository
```bash
git clone https://github.com/SaurabhSinghR45/RoleWise.git
cd RoleWise
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in `backend/`:
```env
PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
CLIENT_URL=http://localhost:5173
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-3.6-flash
```

Run tests and start development server:
```bash
npm test            # Run automated 9-step test suite
npm run dev         # Start backend on http://localhost:3000
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
npm run dev         # Start frontend on http://localhost:5173
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🌐 Production Cloud Deployment Guide

### A. Deploy Frontend to Vercel (Recommended)
1. Push your repository to GitHub.
2. Log in to [Vercel](https://vercel.com/) and click **"Add New Project"**.
3. Import your `RoleWise` repository.
4. Set **Root Directory** to `frontend`.
5. Under **Environment Variables**, add:
   - `VITE_API_URL`: `https://your-backend-api.onrender.com/api`
6. Click **Deploy**. Vercel will automatically use `vercel.json` for SPA routing!

---

### B. Deploy Backend to Render (Recommended)
1. Log in to [Render](https://render.com/) and click **"New +" ➔ "Web Service"**.
2. Connect your GitHub repository.
3. Set **Root Directory** to `backend`.
4. Set **Runtime** to `Node` (or `Docker` for complete container isolation).
5. Build & Start Commands:
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
6. Under **Environment Variables**, add:
   - `NODE_ENV`: `production`
   - `PORT`: `10000`
   - `MONGODB_URI`: `your_mongodb_atlas_uri`
   - `JWT_SECRET`: `your_secure_jwt_secret`
   - `CLIENT_URL`: `https://your-rolewise-frontend.vercel.app`
   - `GEMINI_API_KEY`: `your_gemini_api_key`
   - `GEMINI_MODEL`: `gemini-3.6-flash`
7. Click **Deploy**.

---

## 📡 API Endpoints Reference

### Authentication (`/api/auth`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register new user & set JWT cookie | Public |
| `POST` | `/api/auth/login` | Authenticate user & set JWT cookie | Public |
| `POST` | `/api/auth/logout` | Revoke token to blacklist & clear cookie | Private |
| `GET` | `/api/auth/me` | Fetch authenticated user profile | Private |

### Interview & Career Preparation (`/api/interview`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/interview/generate` | Generate AI report from JD + Resume PDF | Private |
| `GET` | `/api/interview/reports` | Get all past reports for user | Private |
| `GET` | `/api/interview/report/:id` | Get detailed single report by ID | Private |
| `GET` | `/api/interview/report/:id/pdf` | Export & stream 1-Page ATS Resume PDF | Private |
| `DELETE` | `/api/interview/report/:id` | Delete report by ID | Private |
| `GET` | `/api/health` | Service health status check | Public |

---

## 📄 License
This project is licensed under the ISC License.

---

<div align="center">
  <sub>Built with ❤️ by Saurabh Singh. Prepare for the role. Not just the interview.</sub>
</div>
