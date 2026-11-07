# RoleWise

AI-assisted career preparation and interview readiness platform. Analyzes resumes against job descriptions, identifies skill gaps, generates targeted interview questions, and exports ATS-friendly resumes.

- **Live Application**: [https://role-wise.vercel.app](https://role-wise.vercel.app)
- **API Status**: [https://rolewise-backend-94co.onrender.com/api/health](https://rolewise-backend-94co.onrender.com/api/health)

## Overview

- **Resume and JD Matching**: Deterministic evaluation across technical stack, relevant experience, system architecture, and methodology.
- **ATS Keyword Radar**: Compares resume keywords against target requirements to identify matched terms and gaps.
- **Interactive Mock Practice**: Practice answers with speech-to-text or manual input and receive structured feedback.
- **7-Day Roadmap**: Step-by-step interview preparation checklist with progress tracking.
- **Multi-Role Comparison**: Benchmark candidate profile across multiple target engineering positions.
- **ATS Resume Generation**: Export single-page, ATS-compliant resumes in multiple templates (including standard campus and corporate formats).

## Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS, Lucide Icons
- **Backend**: Node.js, Express 4, Puppeteer
- **Database**: MongoDB Atlas, Mongoose
- **AI Model**: Google Gemini API (`gemini-3.6-flash`)

## Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB connection string
- Google Gemini API key

### 1. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in `backend/`:

```env
PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-3.6-flash
```

Run the backend:

```bash
npm run dev
```

### 2. Frontend Setup

```bash
cd ../frontend
npm install
```

Create a `.env` file in `frontend/`:

```env
VITE_API_URL=http://localhost:3000/api
```

Run the frontend:

```bash
npm run dev
```

Open `http://localhost:5173` in your browser.

## API Reference

### Authentication (`/api/auth`)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register new account |
| `POST` | `/api/auth/login` | Log in and set session cookie |
| `POST` | `/api/auth/logout` | Revoke token and clear session |
| `GET` | `/api/auth/me` | Get current user profile |

### Interview & Preparation (`/api/interview`)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/interview/generate` | Generate preparation report from JD and resume |
| `GET` | `/api/interview/reports` | List user reports |
| `GET` | `/api/interview/report/:id` | Get report by ID |
| `POST` | `/api/interview/evaluate-answer` | Evaluate technical or behavioral answer |
| `PATCH` | `/api/interview/report/:id/roadmap-progress` | Update roadmap checklist progress |
| `POST` | `/api/interview/compare-roles` | Compare profile across multiple roles |
| `GET` | `/api/interview/report/:id/pdf` | Export tailored ATS resume PDF |
| `DELETE` | `/api/interview/report/:id` | Delete report |

## License

ISC License.
