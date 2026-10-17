import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../features/auth/hooks/useAuth";
import ThemeToggle from "../components/ThemeToggle";
import ProfileDropdown from "../components/ProfileDropdown";
import AuthModal from "../components/AuthModal";
import {
  ArrowRight,
  Play,
  FileText,
  Brain,
  CheckCircle2,
  ExternalLink,
  Check,
  Paperclip,
  Sparkles,
} from "lucide-react";

const LandingPage = ({ initialAuthModal = null }) => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [authModalOpen, setAuthModalOpen] = useState(Boolean(initialAuthModal));
  const [authMode, setAuthMode] = useState(initialAuthModal === "register" ? "register" : "login");

  const openAuthModal = (mode = "login") => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const handleLaunch = () => {
    if (isAuthenticated) {
      navigate("/dashboard");
    } else {
      openAuthModal("login");
    }
  };

  const scrollToHowItWorks = () => {
    const el = document.getElementById("how-it-works");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/60 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white transition-colors duration-300">
      {/* ─────────────────────────────────────────────────────────────
          1. NAVBAR (Uniform across whole app)
      ───────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-white/85 dark:bg-slate-900/85 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand Logo - Clicking redirects to Landing Page */}
          <Link to="/" className="flex items-center gap-3 group text-decoration-none" title="RoleWise Home">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-blue-500 flex items-center justify-center text-white font-extrabold text-lg shadow-md shadow-indigo-500/25 group-hover:scale-105 transition-transform">
              R
            </div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                Rolewise
              </span>
              <span className="badge hidden sm:inline-flex" style={{ fontSize: "0.68rem", padding: "0.15rem 0.5rem" }}>
                <Sparkles size={11} /> AI Career Prep
              </span>
            </div>
          </Link>

          {/* Right Nav Actions */}
          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              to="/templates"
              style={{
                height: "38px",
                padding: "0 0.85rem",
                fontSize: "0.875rem",
                fontWeight: 600,
                color: "var(--text-primary)",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                borderRadius: "var(--radius-sm)",
                background: "var(--bg-input)",
                border: "1px solid var(--border-subtle)",
                boxShadow: "var(--shadow-sm)",
                transition: "all 0.2s ease",
              }}
              className="navbar-template-btn"
            >
              <FileText size={15} style={{ color: "var(--accent-primary)" }} />
              <span className="hidden sm:inline">Resume Templates</span>
              <span className="sm:hidden">Templates</span>
            </Link>

            {/* Harmonized Theme Toggle Button */}
            <ThemeToggle />

            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <ProfileDropdown />
                <Link
                  to="/dashboard"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm shadow-sm transition-all hover:shadow"
                >
                  <span>Dashboard</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  type="button"
                  onClick={() => openAuthModal("login")}
                  className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-medium text-xs sm:text-sm transition-colors cursor-pointer bg-transparent border-0 px-2 sm:px-3 py-1.5"
                >
                  Log In
                </button>
                <button
                  type="button"
                  onClick={() => openAuthModal("register")}
                  className="px-3 sm:px-4 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-800 dark:text-slate-100 font-semibold text-xs sm:text-sm transition-all shadow-xs hover:shadow cursor-pointer"
                >
                  Get Started
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ─────────────────────────────────────────────────────────────
          2. HERO SECTION
      ───────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
        {/* Subtle decorative background ambient glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-indigo-50/70 via-blue-50/30 dark:from-indigo-950/20 dark:via-transparent to-transparent pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column: Headline & CTAs (with removed as requested) */}
            <div className="lg:col-span-6 flex flex-col items-start text-left">
              {/* Badge Tag */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 text-xs font-semibold text-slate-600 dark:text-slate-300 tracking-wider uppercase mb-6 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-indigo-600 dark:bg-indigo-400 animate-pulse" />
                <span>INTERVIEW READINESS</span>
              </div>

              {/* Main Headline ("with" removed) */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.1] mb-6">
                Prepare Smarter{" "}
                <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-indigo-500 to-blue-500 dark:from-indigo-400 dark:via-indigo-300 dark:to-blue-400">
                  RoleWise
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed mb-8 max-w-xl">
                Simulate role-specific technical interviews, evaluate your resume against real job
                descriptions, and pinpoint exact skill gaps with instant AI feedback.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
                <button
                  onClick={handleLaunch}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-sm sm:text-base shadow-lg shadow-indigo-500/25 transition-all hover:shadow-indigo-500/35 hover:-translate-y-0.5 cursor-pointer border-0"
                >
                  {isAuthenticated ? "Launch Studio" : "Launch App"} <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={scrollToHowItWorks}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white font-semibold text-sm sm:text-base transition-all shadow-xs hover:shadow cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-slate-500 text-slate-500 dark:fill-slate-400 dark:text-slate-400" /> View Demo Role
                </button>
              </div>
            </div>

            {/* Right Column: Workbench Frame containing Recruiter Match & ATS Perfect guidance */}
            <div className="lg:col-span-6">
              <div className="relative rounded-2xl sm:rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xl shadow-indigo-500/10 p-5 sm:p-6 transition-all hover:shadow-indigo-500/15">
                {/* 1. Browser Header Bar */}
                <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 dark:border-slate-800 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-rose-400" />
                    <span className="w-3 h-3 rounded-full bg-amber-400" />
                    <span className="w-3 h-3 rounded-full bg-emerald-400" />
                  </div>

                  {/* Browser URL chip */}
                  <div className="px-3.5 py-1 rounded-full bg-slate-50 dark:bg-slate-800 border border-slate-200/70 dark:border-slate-700 text-slate-500 dark:text-slate-400 font-mono text-[11px] sm:text-xs">
                    rolewise.ai/session/sde-evaluation
                  </div>

                  {/* Live Evaluation Pill */}
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-[11px] font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping" />
                    Live AI Evaluation
                  </div>
                </div>

                {/* 2. Target Role Bar */}
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100 dark:border-slate-800/80">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                      TARGET ROLE
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 rounded-md border border-slate-200/60 dark:border-slate-700">
                      SDE-1 (Backend)
                    </span>
                  </div>
                </div>

                {/* 3. Recruiter Match & ATS Perfect Guidance Card (Replaced as requested) */}
                <div className="relative rounded-2xl bg-indigo-50/40 dark:bg-slate-950/60 border border-indigo-100/70 dark:border-slate-800 p-5 sm:p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
                    {/* Left Half: Recruiter Match Badge + ATS Perfect Title + Action */}
                    <div className="sm:col-span-5 flex flex-col items-start text-left">
                      {/* Recruiter Match Pill (Exact match to Image 3) */}
                      <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-[#eaf5f0] dark:bg-emerald-950/70 border border-[#cbe9dc] dark:border-emerald-800 text-[#0f2d25] dark:text-emerald-300 font-semibold text-xs mb-3 shadow-xs">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="shrink-0">
                          <circle cx="5" cy="12" r="3.5" fill="#93c5fd" />
                          <circle cx="19" cy="6" r="3" fill="#34d399" />
                          <circle cx="19" cy="12" r="3" fill="#6ee7b7" />
                          <circle cx="19" cy="18" r="3" fill="#a7f3d0" />
                          <path d="M8.5 11L16 7" stroke="#94a3b8" strokeWidth="1.5" />
                          <path d="M8.5 12H16" stroke="#94a3b8" strokeWidth="1.5" />
                          <path d="M8.5 13L16 17" stroke="#94a3b8" strokeWidth="1.5" />
                        </svg>
                        <span>Recruiter Match</span>
                      </div>

                      {/* Main Title: ATS perfect */}
                      <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">
                        ATS Perfect
                      </h3>

                      {/* Brief Description */}
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                        Tailor your profile, summary, and skills to pass automated ATS filters and meet recruiter requirements.
                      </p>

                      {/* Link Action */}
                      <button
                        onClick={handleLaunch}
                        className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors cursor-pointer border-0 bg-transparent p-0"
                      >
                        Create my resume <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Right Half: Stacked Steps (Step 1, Step 2, Step 3 Skills with Chips) */}
                    <div className="sm:col-span-7 flex flex-col space-y-2.5">
                      {/* Step 1 Card */}
                      <div className="bg-white dark:bg-slate-800 rounded-xl p-2.5 sm:p-3 shadow-sm border border-slate-100 dark:border-slate-700/80 flex items-center gap-2.5">
                        <div className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                        <div className="flex items-center gap-1.5 text-xs">
                          <span className="text-slate-400 font-medium">Step 1 •</span>
                          <span className="font-bold text-slate-800 dark:text-slate-100">Personal Details</span>
                        </div>
                      </div>

                      {/* Step 2 Card */}
                      <div className="bg-white dark:bg-slate-800 rounded-xl p-2.5 sm:p-3 shadow-sm border border-slate-100 dark:border-slate-700/80 flex items-center gap-2.5">
                        <div className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                        <div className="flex items-center gap-1.5 text-xs">
                          <span className="text-slate-400 font-medium">Step 2 •</span>
                          <span className="font-bold text-slate-800 dark:text-slate-100">Professional Summary</span>
                        </div>
                      </div>

                      {/* Step 3 Card (Active with Skills Chips) */}
                      <div className="bg-white dark:bg-slate-800 rounded-xl p-3 shadow-md border border-slate-200/90 dark:border-slate-700">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="w-3.5 h-3.5 rounded-full border-2 border-dashed border-blue-500 inline-block" />
                            <span className="text-xs text-slate-400 font-medium">Step 3 •</span>
                            <span className="text-xs font-bold text-slate-800 dark:text-slate-100">Skills</span>
                          </div>
                          <Paperclip size={13} className="text-slate-400" />
                        </div>

                        {/* 4 Skill Chips */}
                        <div className="grid grid-cols-2 gap-1.5">
                          <span className="bg-slate-100 dark:bg-slate-700/70 text-slate-700 dark:text-slate-200 text-[10px] sm:text-[11px] font-medium px-2 py-1 rounded-md flex items-center justify-between">
                            Management Skills <span className="text-slate-400 font-bold ml-1">+</span>
                          </span>
                          <span className="bg-slate-100 dark:bg-slate-700/70 text-slate-700 dark:text-slate-200 text-[10px] sm:text-[11px] font-medium px-2 py-1 rounded-md flex items-center justify-between">
                            Leadership & Team <span className="text-slate-400 font-bold ml-1">+</span>
                          </span>
                          <span className="bg-slate-100 dark:bg-slate-700/70 text-slate-700 dark:text-slate-200 text-[10px] sm:text-[11px] font-medium px-2 py-1 rounded-md flex items-center justify-between">
                            Computer Skills <span className="text-slate-400 font-bold ml-1">+</span>
                          </span>
                          <span className="bg-slate-100 dark:bg-slate-700/70 text-slate-700 dark:text-slate-200 text-[10px] sm:text-[11px] font-medium px-2 py-1 rounded-md flex items-center justify-between">
                            Analytical Thinking <span className="text-slate-400 font-bold ml-1">+</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          3. "HOW ROLEWISE WORKS" (3-Card Feature Grid)
      ───────────────────────────────────────────────────────────── */}
      <section id="how-it-works" className="py-20 bg-white dark:bg-slate-900 border-y border-slate-100 dark:border-slate-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
              How RoleWise Works
            </h2>
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300">
              Simplify your interview preparation in three easy steps. Designed for speed, depth, and
              actionable feedback.
            </p>
          </div>

          {/* 3-Card Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-8 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col">
              <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-6">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">
                1. Select Target Role & Upload JD
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Choose your target engineering position or paste/upload any job description to generate
                role-aligned question pools.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-8 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col">
              <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-6">
                <Brain className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">
                2. AI-Driven Mock Assessment
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Tackle real-time coding problems, system design trade-offs, and behavioral scenarios
                evaluated under realistic interview constraints.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-8 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col">
              <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-6">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">
                3. Actionable Gap Analysis & Roadmap
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Receive scored feedback across accuracy, complexity, and communication with a
                personalized study plan.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          4. "GET STARTED IN MINUTES" (Numbered Timeline List)
      ───────────────────────────────────────────────────────────── */}
      <section className="py-20 bg-slate-50/60 dark:bg-slate-950 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-3">
              Get Started in Minutes
            </h2>
            <p className="text-base text-slate-600 dark:text-slate-400">
              Zero setup required. Start your first mock session immediately.
            </p>
          </div>

          {/* 4 Stacked Horizontal Strip Cards */}
          <div className="max-w-4xl mx-auto space-y-4">
            {/* Step 01 */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-full border border-slate-100 dark:border-slate-800 p-4 sm:p-5 shadow-xs hover:border-slate-200 dark:hover:border-slate-700 hover:shadow-md transition-all flex items-center gap-4 sm:gap-6">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-full bg-blue-600 text-white font-bold text-sm sm:text-base flex items-center justify-center shrink-0 shadow-sm">
                01
              </div>
              <div className="text-left">
                <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                  Choose Your Role & Experience Level
                </h4>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                  Select from Frontend, Backend, Full Stack, or AI Engineer.
                </p>
              </div>
            </div>

            {/* Step 02 */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-full border border-slate-100 dark:border-slate-800 p-4 sm:p-5 shadow-xs hover:border-slate-200 dark:hover:border-slate-700 hover:shadow-md transition-all flex items-center gap-4 sm:gap-6">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-full bg-blue-600 text-white font-bold text-sm sm:text-base flex items-center justify-center shrink-0 shadow-sm">
                02
              </div>
              <div className="text-left">
                <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                  Sync Your Resume or Profile
                </h4>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                  Match your experience against industry interview benchmarks.
                </p>
              </div>
            </div>

            {/* Step 03 */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-full border border-slate-100 dark:border-slate-800 p-4 sm:p-5 shadow-xs hover:border-slate-200 dark:hover:border-slate-700 hover:shadow-md transition-all flex items-center gap-4 sm:gap-6">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-full bg-blue-600 text-white font-bold text-sm sm:text-base flex items-center justify-center shrink-0 shadow-sm">
                03
              </div>
              <div className="text-left">
                <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                  Simulate Interview Rounds
                </h4>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                  Practice DSA, system architecture, and CS fundamentals.
                </p>
              </div>
            </div>

            {/* Step 04 */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-full border border-slate-100 dark:border-slate-800 p-4 sm:p-5 shadow-xs hover:border-slate-200 dark:hover:border-slate-700 hover:shadow-md transition-all flex items-center gap-4 sm:gap-6">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-full bg-blue-600 text-white font-bold text-sm sm:text-base flex items-center justify-center shrink-0 shadow-sm">
                04
              </div>
              <div className="text-left">
                <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                  Review Scored Metrics & Fix Gaps
                </h4>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                  Turn weaknesses into strengths before interview day.
                </p>
              </div>
            </div>
          </div>

          {/* Centered CTA Button */}
          <div className="text-center mt-12">
            <button
              onClick={handleLaunch}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-base shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/35 hover:-translate-y-0.5 transition-all cursor-pointer border-0"
            >
              Launch RoleWise Studio <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          4.5 FAQ SECTION (Anchored by Profile dropdown FAQ option)
      ───────────────────────────────────────────────────────────── */}
      <section id="faq" className="py-16 sm:py-24 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 transition-colors duration-300">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
              HELP & FAQS
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-1">
              Frequently Asked Questions
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              Everything you need to know about preparing and exporting with RoleWise
            </p>
          </div>

          <div className="space-y-4">
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700">
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1.5">
                How does RoleWise evaluate my resume against target job postings?
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                RoleWise executes multi-pillar evaluation analyzing Technical Stack (40%), Experience Relevance (30%), System Architecture (20%), and Methodologies (10%), with targeted interview Q&A and 7-day roadmaps.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700">
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1.5">
                Are all 5 resume templates compatible with enterprise ATS scanners?
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Yes. Every template—from the College Campus (NIT Warangal) standard to Pure ATS and Prime ATS—is rigorously tested against modern ATS algorithms with zero multi-column parse collisions.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700">
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1.5">
                Can I compare my readiness across different roles?
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Yes. Under the Role Comparison tab, you can benchmark your current background against up to 6 target engineering tracks simultaneously.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          5. MINIMAL FOOTER
      ───────────────────────────────────────────────────────────── */}
      <footer className="mt-auto border-t border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 py-8 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          {/* Left: Brand & Copyright */}
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-md bg-gradient-to-tr from-indigo-600 to-blue-500 flex items-center justify-center text-white font-bold text-xs">
              R
            </div>
            <span className="font-bold text-slate-800 dark:text-slate-200">RoleWise</span>
            <span>© 2026 RoleWise. All rights reserved.</span>
          </div>

          {/* Right: Quick Links */}
          <div className="flex items-center gap-6">
            <a
              href="#how-it-works"
              className="hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              Docs
            </a>
            <a
              href="#faq"
              className="hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              FAQ
            </a>
            <Link
              to={isAuthenticated ? "/dashboard" : "/"}
              onClick={() => {
                if (!isAuthenticated) openAuthModal("login");
              }}
              className="hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              Dashboard
            </Link>
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              GitHub <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </footer>

      {/* Auth Modal with Backdrop Blur Popup */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authMode}
      />
    </div>
  );
};

export default LandingPage;
