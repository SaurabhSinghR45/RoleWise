# 🚀 Rolewise — Prepare for the role. Not just the interview.

<div align="center">

![Rolewise Banner](https://img.shields.io/badge/Rolewise-AI_Career_Platform-6366f1?style=for-the-badge&logo=rocket)
[![Live Demo](https://img.shields.io/badge/Live_App-role--wise.vercel.app-10b981?style=for-the-badge&logo=vercel)](https://role-wise.vercel.app/)
[![Backend API](https://img.shields.io/badge/Backend_API-Render_Cloud-46E3B7?style=for-the-badge&logo=render)](https://rolewise-backend-94co.onrender.com/api/health)

[![React 19](https://img.shields.io/badge/React-19.0-61dafb?style=flat-square&logo=react)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-20+-339933?style=flat-square&logo=nodedotjs)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.21-000000?style=flat-square&logo=express)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb)](https://www.mongodb.com/)
[![Google Gemini](https://img.shields.io/badge/Gemini_3.6-Flash-4285F4?style=flat-square&logo=google)](https://aistudio.google.com/)
[![Puppeteer](https://img.shields.io/badge/Puppeteer-ATS_PDF-40B5A4?style=flat-square&logo=puppeteer)](https://pptr.dev/)

**An enterprise-grade Full-Stack AI Career Preparation, Mock Interview Practice & ATS Resume Engineering Platform.**  
*Upload your resume, paste any target Job Description (JD), and receive deterministic sub-scores, live AI voice answer evaluations, Jobscan-style keyword density matrices, interactive 7-day preparation sprints, multi-role fit benchmarks, and tailored 1-page ATS Resume PDFs.*

[🌐 **Explore Live Demo**](https://role-wise.vercel.app/) • [⚡ **API Health Status**](https://rolewise-backend-94co.onrender.com/api/health)

</div>

---

## 🌟 Game-Changing Features

### 1. 🎙️ Interactive AI Mock Interview Practice (Answer Evaluator)
- **Real-Time Voice Dictation**: Integrated with the Web Speech API for hands-free speech-to-text response practice.
- **AI-Powered Evaluation**: Gemini 3.6 Flash grades candidate responses on an objective 0–100% scale.
- **STAR Framework & Technical Depth**: Identifies key concepts articulated well vs. critical trade-offs omitted.
- **Polished Model Answer Snippets**: Generates high-impact, senior-level response phrasings for every technical and behavioral question.

### 2. 🔍 Visual ATS Keyword Match & Gap Radar
- **Side-by-Side Keyword Matrix**: Evaluates resume keyword density against strict ATS parser requirements (Workday, Greenhouse, Lever).
- **Interactive Search & Filter Pills**: Instantly filter by *All*, *🟢 Matched in Resume (with occurrence counts)*, and *🔴 Missing Gaps*.
- **Domain Breakdown**: Categorized into *Languages*, *Frameworks & AI*, *Databases & Cloud*, *DevOps & Tools*, and *Architecture*.
- **Strategic Placement Guidance**: Provides actionable advice on naturally integrating keywords into experience bullets without keyword stuffing.

### 3. 📅 Interactive 7-Day Sprint Tracker with Cloud Persistence
- **SVG Readiness Progress Ring**: Real-time radial progress gauge tracking total preparation completeness.
- **Daily Sprint Cards (Days 1–7)**: Interactive checklist items with animated strike-throughs and one-click *Complete Day* toggles.
- **Multi-Device Cloud Persistence**: Checklists automatically sync to MongoDB Atlas via `PATCH /api/interview/report/:id/roadmap-progress` so candidates can prepare across desktop and mobile.

### 4. ⚖️ Multi-Role Target Comparison (Best Fit Analyzer)
- **Top Recommended Career Track**: Automatically identifies the single role where the candidate has the highest interview clearance probability.
- **Side-by-Side Role Benchmarks**: Compares candidate background across 4+ tech roles simultaneously (*AI Full Stack*, *Backend Python*, *Frontend React*, *GenAI/ML Systems Engineer*).
- **Interactive Role Customizer**: Test fit against preset tracks or add custom target job titles on the fly.

### 5. 📄 1-Page Tailored ATS Resume Generator
- **Powered by Puppeteer**: Headless Chromium generates a single-column, 100% ATS-compliant PDF.
- **Google XYZ Action-Verb Alignment**: Automatically reformulates candidate achievements to highlight target JD requirements.

### 6. 🎯 Deterministic Match Scoring & SHA-256 Caching
- **Mathematical 4-Part Rubric**: `Tech Stack 40%`, `Experience 30%`, `Architecture 20%`, `Tools & Methodology 10%` with `temperature: 0.0` ensuring zero score fluctuation.
- **SHA-256 Input Caching**: Deduplicates identical JD + Resume submissions for instant rendering with 0 token consumption.

### 7. 🔐 Enterprise Security & 4-Layer React Architecture
- **Cookie-Based JWT Auth**: HTTP-Only, SameSite cookies with a 24-hour MongoDB TTL token blacklist.
- **In-Memory PDF Buffer**: Zero unmanaged disk writes with Multer memory storage.
- **Strict 4-Layer Frontend**: `Layer 4 (API)` ➔ `Layer 3 (Context)` ➔ `Layer 2 (Hooks)` ➔ `Layer 1 (UI)`.

---

## 🏗️ System Architecture

```
                                  ROLEWISE ARCHITECTURE
                                  
      [ Client Browser ]  ◄── HTTPS (withCredentials) ──►  [ Frontend SPA (Vite + React 19) ]
              │                                                        │
              │                                                 Layer 4: Axios Client
              ▼                                                        │
      [ Express 4 REST API ] ──────────────────────────────────────────┘
        ├── Auth Controller (bcrypt, JWT, Blacklist TTL)
        ├── Interview Controller (JD + PDF parser, SHA-256 Caching)
        ├── Answer Evaluator (Web Speech API + Gemini 3.6 Flash)
        ├── ATS Keyword Radar Matrix & Multi-Role Fit Benchmark Engine
        ├── Roadmap Progress Cloud Synchronizer (MongoDB Persistence)
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
│   │   │   └── interview/        # Layer 1-4 Interview Feature
│   │   │       ├── components/   # AnswerPracticeWorkshop, KeywordRadarTab, RoadmapTrackerTab, MultiRoleComparisonTab
│   │   │       ├── context/      # Interview Context Provider
│   │   │       ├── hooks/        # Custom Interview Hooks
│   │   │       ├── pages/        # InterviewDashboard, InterviewReport, InterviewHistory
│   │   │       └── services/     # Axios API layer for Reports, Audio/Eval, Radar & Benchmarks
│   │   ├── pages/                # Home / Landing Page
│   │   ├── services/             # Central Axios Client
│   │   └── styles/               # Glassmorphism Design Tokens & CSS Animations
│   ├── vercel.json               # SPA routing rewrite configuration for Vercel
│   └── package.json
│
├── backend/                      # Node.js + Express REST API
│   ├── src/
│   │   ├── config/               # MongoDB Atlas connection handler
│   │   ├── controllers/          # Auth & Interview controllers (Reports, Practice, Benchmarks)
│   │   ├── middlewares/          # JWT auth verification & Multer PDF parser
│   │   ├── models/               # User, Blacklist (TTL), InterviewReport models
│   │   ├── routes/               # Express API routers (/auth, /interview)
│   │   └── services/             # Gemini 3.6 Flash & Puppeteer PDF generators
│   ├── .puppeteerrc.cjs          # Chromium buildpack cache configuration
│   ├── Dockerfile                # Production container configuration
│   ├── render.yaml               # Render Infrastructure-As-Code configuration
│   ├── test_suite.js             # Automated API test suite
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

Start the backend server:
```bash
npm run dev         # Start backend on http://localhost:3000
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```

Create a `.env` file in `frontend/`:
```env
VITE_API_URL=http://localhost:3000/api
```

Start the frontend development server:
```bash
npm run dev         # Start frontend on http://localhost:5173
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🌐 Production Cloud Deployment

| Component | Platform | Live URL | Deployment Config |
| :--- | :--- | :--- | :--- |
| **Frontend** | [Vercel](https://vercel.com/) | [https://role-wise.vercel.app/](https://role-wise.vercel.app/) | `vercel.json` (SPA rewrites) |
| **Backend** | [Render](https://render.com/) | [https://rolewise-backend-94co.onrender.com](https://rolewise-backend-94co.onrender.com) | `render.yaml` & `Dockerfile` |

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
| `GET` | `/api/interview/reports` | Get all past reports for authenticated user | Private |
| `GET` | `/api/interview/report/:id` | Get detailed single report by ID | Private |
| `POST` | `/api/interview/evaluate-answer` | 🎙️ Live AI evaluation of typed/spoken answer | Private |
| `PATCH` | `/api/interview/report/:id/roadmap-progress` | 📅 Save completed roadmap tasks to MongoDB | Private |
| `POST` | `/api/interview/compare-roles` | ⚖️ Multi-role target comparison & benchmark engine | Private |
| `GET` | `/api/interview/report/:id/pdf` | 📄 Export & stream 1-Page ATS Resume PDF | Private |
| `DELETE` | `/api/interview/report/:id` | Delete report by ID | Private |
| `GET` | `/api/health` | Service health status check | Public |

---

## 📄 License
This project is licensed under the ISC License.

---

<div align="center">
  <sub>Built with ❤️ by Saurabh Singh. Prepare for the role. Not just the interview.</sub>
</div>
