import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FileText,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Award,
  Layers,
  Eye,
  X,
  Sparkles,
  Download,
  Building2,
  ExternalLink,
} from "lucide-react";
import ThemeToggle from "../components/ThemeToggle";
import ProfileDropdown from "../components/ProfileDropdown";
import { useAuth } from "../features/auth/hooks/useAuth";
import FullResumePreviewModal from "../components/FullResumePreviewModal";

// SVG Crest for NIT Warangal Authentic Campus Template
const NitwLogoSvg = () => (
  <svg width="42" height="48" viewBox="0 0 100 115" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
    <ellipse cx="50" cy="55" rx="46" ry="48" stroke="#111827" strokeWidth="2.5" fill="#ffffff" />
    <ellipse cx="50" cy="55" rx="39" ry="41" stroke="#111827" strokeWidth="1.5" fill="none" />
    <circle cx="50" cy="55" r="24" stroke="#111827" strokeWidth="1.8" fill="#ffffff" />
    <path d="M 50 33 L 52 37 L 48 37 Z M 50 77 L 52 73 L 48 73 Z M 28 55 L 32 57 L 32 53 Z M 72 55 L 68 57 L 68 53 Z" fill="#111827" />
    <path d="M 40 55 A 10 10 0 0 1 60 55 Z" fill="#111827" />
    <line x1="50" y1="41" x2="50" y2="44" stroke="#111827" strokeWidth="1.5" />
    <line x1="43" y1="44" x2="45" y2="46" stroke="#111827" strokeWidth="1.5" />
    <line x1="57" y1="44" x2="55" y2="46" stroke="#111827" strokeWidth="1.5" />
    <path d="M 40 63 Q 50 60 50 65 Q 50 60 60 63 L 59 66 Q 50 63 50 67 Q 50 63 41 66 Z" fill="#111827" />
    <text x="50" y="87" fontFamily="Times New Roman, serif" fontSize="7" fontWeight="bold" textAnchor="middle" fill="#111827">
      WARANGAL
    </text>
  </svg>
);

export const RESUME_TEMPLATES_DATA = [
  {
    id: "nitw",
    category: "campus",
    name: "College Campus (NIT Warangal)",
    badge: "Official Campus Standard",
    badgeColor: "#1d4ed8",
    rating: "99.8% ATS Pass",
    description: "Official National Institute of Technology, Warangal academic placement format. Features the official institute crest, roll number, academic hierarchy, and structured project & responsibility taxonomy.",
    bestFor: "Campus Placements, SDE-1 / New Grad, Software Engineering, Research",
    font: "Times New Roman / Georgia",
    layout: "Single Column with Institute Seal & Table Rules",
    colors: ["#1e293b", "#1d4ed8", "#047857", "#4338ca", "#b45309"],
    highlights: [
      "Authentic NITW Crest with academic hierarchy header",
      "Explicit Roll No., Program, and right-aligned CGPA rules",
      "Dedicated Technical Skills & Interests taxonomy table",
      "Positions of Responsibility & Achievements sections",
    ],
  },
  {
    id: "classic",
    category: "classic",
    name: "Classic",
    badge: "Robust Career Stack",
    badgeColor: "#4f46e5",
    rating: "98.8% ATS Pass",
    description: "Classically structured resume template designed for comprehensive engineering backgrounds. Features a centered executive header, personal particulars grid, and detailed technology stacks.",
    bestFor: "Full Stack Developers, Backend Engineers, Distributed Systems",
    font: "Times New Roman / Georgia",
    layout: "Centered Header with Metadata Table & Horizontal Rules",
    colors: ["#1e293b", "#2563eb", "#7c3aed", "#dc2626", "#d97706"],
    highlights: [
      "Structured 2-row candidate metadata information table",
      "Categorized Backend, Cloud, Tooling & Practices stack",
      "Proven track record with Tier-1 enterprise tech recruiters",
      "Balanced typographic density for 8+ year careers",
    ],
  },
  {
    id: "traditional",
    category: "classic",
    name: "Traditional",
    badge: "Corporate Executive",
    badgeColor: "#475569",
    rating: "97.9% ATS Pass",
    description: "Classic full-page resume template with sizable resume sections. Centered serif typography with decorative section bullet markers, shaded profile banner, and clean alignment.",
    bestFor: "Engineering Managers, Tech Leads, Logistics & Operations",
    font: "Georgia / Times Serif",
    layout: "Formal Serif with Shaded Banner Headers & Bullet Markers",
    colors: ["#0f172a", "#334155", "#1e3a8a", "#14532d", "#701a75"],
    highlights: [
      "Formal centered name and full contact rule bar",
      "Shaded Profile & Experience section banner headers",
      "Clean dotted leader alignment connecting companies to dates",
      "Authoritative tone for senior and leadership profiles",
    ],
  },
  {
    id: "prime_ats",
    category: "ats",
    name: "Prime ATS",
    badge: "Modern Corporate Tech",
    badgeColor: "#0284c7",
    rating: "99.1% ATS Pass",
    description: "Modern professional layout featuring bold primary accent borders, structured 4-column technical skills matrix, optional profile photo slot, and high-impact summary statement.",
    bestFor: "Product Engineers, Financial Analysts, Senior Tech Specialists",
    font: "Helvetica Neue / Arial",
    layout: "Modern 4-Column Skills Grid with Accent Dividers",
    colors: ["#0284c7", "#4f46e5", "#ea580c", "#d97706", "#1e293b"],
    highlights: [
      "Signature primary accent headline and crisp divider bars",
      "4-column structured technical competency matrix",
      "Integrated key projects and system architecture section",
      "High visual hierarchy with modern executive spacing",
    ],
  },
  {
    id: "pure_ats",
    category: "ats",
    name: "Pure ATS",
    badge: "Maximum Machine Parsable",
    badgeColor: "#059669",
    rating: "100% ATS Benchmark",
    description: "Minimalist, zero-friction single-column resume format engineered specifically for high-volume enterprise parsers including Workday, Taleo, Greenhouse, and Lever.",
    bestFor: "Software Engineers, Quantitative Developers, High-Volume Job Applications",
    font: "Inter / System Sans-Serif",
    layout: "Pure Single Column with High-Parse Section Rules",
    colors: ["#0f172a", "#1d4ed8", "#7c3aed", "#b91c1c", "#b45309"],
    highlights: [
      "100% machine-readable hierarchy with standard headings",
      "Right-aligned dates, roles, and quantifiable impact metrics",
      "High-contrast formatting with zero parsing errors",
      "Optimized bullet point length for recruiter scanability",
    ],
  },
];

const TemplatesPage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedTemplate, setSelectedTemplate] = useState(() => {
    return localStorage.getItem("rolewise_selected_template") || "nitw";
  });
  const [activeColors, setActiveColors] = useState({
    nitw: "#1e293b",
    classic: "#1e293b",
    traditional: "#0f172a",
    prime_ats: "#0284c7",
    pure_ats: "#0f172a",
  });
  const [previewModalTemplateId, setPreviewModalTemplateId] = useState("nitw");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleColorChange = (templateId, color) => {
    setActiveColors((prev) => ({
      ...prev,
      [templateId]: color,
    }));
  };

  const handleSelectTemplate = (templateId) => {
    setSelectedTemplate(templateId);
    localStorage.setItem("rolewise_selected_template", templateId);
    if (isAuthenticated) {
      navigate("/dashboard");
    } else {
      navigate("/login", { state: { from: "/dashboard", selectedTemplate: templateId } });
    }
  };

  const filteredTemplates =
    activeCategory === "all"
      ? RESUME_TEMPLATES_DATA
      : RESUME_TEMPLATES_DATA.filter((t) => t.category === activeCategory);

  return (
    <div className="min-h-screen bg-slate-50/70 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-300">
      {/* ─────────────────────────────────────────────────────────────
          1. PRODUCT NAVBAR
      ───────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 text-decoration-none group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-blue-500 flex items-center justify-center text-white font-extrabold text-lg shadow-md shadow-indigo-500/25 group-hover:scale-105 transition-transform">
              R
            </div>
            <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              RoleWise
            </span>
          </Link>

          <div className="flex items-center gap-4 sm:gap-6">
            <Link
              to="/templates"
              className="text-xs sm:text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5"
            >
              <FileText size={15} />
              <span>Resume Templates</span>
            </Link>

            <ThemeToggle />

            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <ProfileDropdown />
                <Link
                  to="/dashboard"
                  className="px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm transition-all shadow-sm"
                >
                  Dashboard
                </Link>
              </div>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm transition-all shadow-sm"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* ─────────────────────────────────────────────────────────────
          2. HERO SECTION
      ───────────────────────────────────────────────────────────── */}
      <section className="pt-10 pb-8 sm:pt-14 sm:pb-10 text-center max-w-4xl mx-auto px-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 mb-4 shadow-2xs">
          <ShieldCheck size={14} className="text-emerald-500" />
          <span>ATS TESTED & RECRUITER VERIFIED RESUME DESIGNS</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-3">
          Resume Templates
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Engineered for academic campus placement committees and enterprise Applicant Tracking Systems (ATS). Select your preferred design below to use during AI report generation.
        </p>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-7">
          <button
            onClick={() => setActiveCategory("all")}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer border ${
              activeCategory === "all"
                ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-transparent shadow-xs"
                : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300"
            }`}
          >
            All Templates (5)
          </button>
          <button
            onClick={() => setActiveCategory("campus")}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer border ${
              activeCategory === "campus"
                ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-transparent shadow-xs"
                : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300"
            }`}
          >
            Campus & College (1)
          </button>
          <button
            onClick={() => setActiveCategory("ats")}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer border ${
              activeCategory === "ats"
                ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-transparent shadow-xs"
                : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300"
            }`}
          >
            ATS High-Parse (2)
          </button>
          <button
            onClick={() => setActiveCategory("classic")}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer border ${
              activeCategory === "classic"
                ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-transparent shadow-xs"
                : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300"
            }`}
          >
            Classic & Executive (2)
          </button>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          3. TEMPLATES SHOWCASE CARDS (Visual Sheet Mockups Matching Screenshots)
      ───────────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTemplates.map((tmpl) => {
            const isSelected = selectedTemplate === tmpl.id;
            const accentColor = activeColors[tmpl.id] || tmpl.colors[0];

            return (
              <div
                key={tmpl.id}
                className={`rounded-2xl border transition-all duration-300 flex flex-col bg-white dark:bg-slate-900 shadow-sm hover:shadow-xl overflow-hidden ${
                  isSelected
                    ? "border-indigo-600 ring-2 ring-indigo-500/20"
                    : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                }`}
              >
                {/* Visual Resume Sheet Mockup Preview */}
                <div
                  className="bg-slate-100/80 dark:bg-slate-950 p-5 border-b border-slate-100 dark:border-slate-800 relative group flex items-center justify-center cursor-pointer"
                  onClick={() => {
                    setPreviewModalTemplateId(tmpl.id);
                    setIsModalOpen(true);
                  }}
                >
                  {/* Paper Sheet Preview */}
                  <div className="w-full bg-white text-slate-900 rounded-sm shadow-md border border-slate-200/80 p-4 font-serif text-[9px] leading-tight select-none pointer-events-none transform transition-transform group-hover:scale-[1.02]">
                    {/* 1. NIT Warangal Template Preview */}
                    {tmpl.id === "nitw" && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between pb-1 border-b border-black">
                          <div className="flex items-center gap-2">
                            <NitwLogoSvg />
                            <div>
                              <div className="font-bold text-[11px] text-slate-900">Your Name</div>
                              <div className="text-[8px] text-slate-700">Roll No.: 21CS042</div>
                              <div className="text-[8px] text-slate-700">B.Tech • Computer Science</div>
                              <div className="text-[8px] font-semibold text-slate-900">NIT Warangal</div>
                            </div>
                          </div>
                          <div className="text-right text-[7.5px] text-slate-600 space-y-0.5">
                            <div>+91-9876543210</div>
                            <div>youremail@email.com</div>
                            <div>official@nitw.ac.in</div>
                            <div>GitHub • LinkedIn</div>
                          </div>
                        </div>

                        <div>
                          <div className="font-bold uppercase text-[8.5px] border-b border-black pb-0.5 mb-1" style={{ color: accentColor }}>
                            Education
                          </div>
                          <div className="flex justify-between font-semibold text-[8px]">
                            <span>• National Institute of Technology, Warangal</span>
                            <span>2021-2025</span>
                          </div>
                          <div className="flex justify-between text-[7.5px] text-slate-600 pl-2">
                            <span>B.Tech in Computer Science and Engineering</span>
                            <span>CGPA: 9.24 / 10</span>
                          </div>
                        </div>

                        <div>
                          <div className="font-bold uppercase text-[8.5px] border-b border-black pb-0.5 mb-1" style={{ color: accentColor }}>
                            Experience
                          </div>
                          <div className="flex justify-between font-semibold text-[8px]">
                            <span>• Microsoft IDC &mdash; Software Engineer Intern</span>
                            <span>Summer 2024</span>
                          </div>
                          <div className="text-[7.5px] text-slate-600 pl-2">
                            – Built event telemetry pipelines reducing latency by 35%
                          </div>
                        </div>

                        <div>
                          <div className="font-bold uppercase text-[8.5px] border-b border-black pb-0.5 mb-1" style={{ color: accentColor }}>
                            Technical Skills & Interests
                          </div>
                          <div className="text-[7.5px] space-y-0.5">
                            <div><strong>Languages:</strong> C/C++, Python, Java, JavaScript, SQL</div>
                            <div><strong>Tools:</strong> Git, Docker, Kubernetes, Postman, Linux</div>
                            <div><strong>Frameworks:</strong> React.js, Node.js, Express.js, FastAPI</div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* 2. Classic Template Preview (Logan Mitchell) */}
                    {tmpl.id === "classic" && (
                      <div className="space-y-2">
                        <div className="text-center pb-1">
                          <div className="font-bold text-[11px]" style={{ color: accentColor }}>
                            Logan Mitchell, Software Engineer
                          </div>
                          <div className="text-[7.5px] text-slate-600">
                            San Francisco, CA • (415) 555-0148 • logan.mitchell.dev@gmail.com
                          </div>
                        </div>

                        <div className="border border-slate-300 text-[7px] p-1 flex justify-between bg-slate-50/50">
                          <div>Date/Place of birth: 04/07/1989 Austin, TX</div>
                          <div>Marital status: Married</div>
                          <div>Nationality: American</div>
                        </div>

                        <div>
                          <div className="font-bold uppercase text-[8px] border-b border-slate-800 pb-0.5 mb-1">
                            Profile
                          </div>
                          <p className="text-[7.5px] text-slate-600 leading-tight">
                            Senior software engineer with 8+ years building high-throughput backend systems and developer platforms.
                          </p>
                        </div>

                        <div>
                          <div className="font-bold uppercase text-[8px] border-b border-slate-800 pb-0.5 mb-1">
                            Experience
                          </div>
                          <div className="flex justify-between font-semibold text-[7.8px]">
                            <span>Senior Software Engineer &mdash; Northwind Analytics</span>
                            <span>San Francisco, CA</span>
                          </div>
                          <div className="text-[7px] text-slate-500 mb-0.5">Mar 2021 - Present</div>
                          <div className="text-[7.2px] text-slate-600 pl-2">
                            • Redesigned event-ingestion pipeline handling 200k+ events/sec
                          </div>
                        </div>

                        <div>
                          <div className="font-bold uppercase text-[8px] border-b border-slate-800 pb-0.5 mb-1">
                            Skills
                          </div>
                          <div className="text-[7px] space-y-0.5">
                            <div><strong>Languages:</strong> Go, Python, TypeScript, Java, SQL</div>
                            <div><strong>Backend & Infra:</strong> gRPC, REST, Kafka, Redis, Docker</div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* 3. Traditional Template Preview (Tiffany Giroux) */}
                    {tmpl.id === "traditional" && (
                      <div className="space-y-1.5 font-serif">
                        <div className="text-center">
                          <div className="font-normal text-[12px] tracking-wide text-slate-900">
                            Tiffany Giroux
                          </div>
                          <div className="text-[7.5px] italic text-slate-600">
                            Freight & Logistics Analyst
                          </div>
                          <div className="text-[7px] text-slate-500">18 Harmony Drive, Orlando, FL</div>
                        </div>

                        <div className="border-y border-black py-0.5 flex justify-between text-[7px] text-slate-800">
                          <span>001 415 570 5567</span>
                          <span>tiffgiroux@hotmail.com</span>
                        </div>

                        <div className="bg-slate-200 text-center font-bold text-[7.5px] uppercase tracking-wider py-0.5 border-y border-black">
                          Profile
                        </div>
                        <p className="text-[7px] italic text-slate-700 leading-tight px-1">
                          A highly skilled and organized Logistics, Distribution and Supply Chain professional with additional experience...
                        </p>

                        <div className="bg-slate-200 text-center font-bold text-[7.5px] uppercase tracking-wider py-0.5 border-y border-black">
                          Experience
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between font-bold text-[7.5px]">
                            <span>❖ Freight Audit & Logistics Analyst - Ford</span>
                            <span className="font-normal text-[7px]">July 2014 - Current</span>
                          </div>
                          <div className="text-[7px] text-slate-600 pl-2">
                            • Improved efficiencies and achieved cost reductions of 13% across all freight activity.
                          </div>
                        </div>

                        <div className="bg-slate-200 text-center font-bold text-[7.5px] uppercase tracking-wider py-0.5 border-y border-black">
                          Education
                        </div>
                        <div className="flex justify-between font-bold text-[7.5px]">
                          <span>❖ Postgraduate Diploma Management Studies</span>
                          <span className="font-normal text-[7px]">Sept 2009 - Sept 2010</span>
                        </div>
                      </div>
                    )}

                    {/* 4. Prime ATS Template Preview (Herman Walton) */}
                    {tmpl.id === "prime_ats" && (
                      <div className="space-y-1.5 font-sans">
                        <div className="flex justify-between items-start pb-1">
                          <div>
                            <div className="font-extrabold text-[12px] uppercase tracking-tight" style={{ color: accentColor }}>
                              HERMAN WALTON
                            </div>
                            <div className="font-bold text-[8.5px] text-slate-800 uppercase">
                              FINANCIAL ANALYST
                            </div>
                            <div className="text-[7px] text-slate-500 mt-0.5">
                              Market Street 12, New York • (412) 479-6342 • herman@gmail.com
                            </div>
                          </div>
                          <div className="w-8 h-10 bg-slate-200 rounded border border-slate-300 flex items-center justify-center text-[7px] text-slate-500">
                            Photo
                          </div>
                        </div>

                        <div className="h-0.5 w-full" style={{ backgroundColor: accentColor }} />

                        <div>
                          <div className="font-bold uppercase text-[7.8px] mb-0.5" style={{ color: accentColor }}>
                            Summary
                          </div>
                          <p className="text-[7px] text-slate-600 leading-tight">
                            Experienced and driven Financial Analyst with an impressive background managing multi-million dollar budgets...
                          </p>
                        </div>

                        <div>
                          <div className="font-bold uppercase text-[7.8px] mb-0.5" style={{ color: accentColor }}>
                            Professional Experience
                          </div>
                          <div className="flex justify-between font-bold text-[7.5px]">
                            <span>Financial Analyst, GEO Corp.</span>
                            <span className="font-semibold text-slate-500">Jan 2012 - Present</span>
                          </div>
                          <div className="text-[7px] text-slate-600 pl-2">
                            • Created budgets and ensured labor and material costs were decreased by 15 percent.
                          </div>
                        </div>

                        <div>
                          <div className="font-bold uppercase text-[7.8px] mb-0.5" style={{ color: accentColor }}>
                            Technical Skills
                          </div>
                          <div className="grid grid-cols-4 gap-1 text-[6.5px]">
                            <span className="bg-slate-100 p-0.5 rounded text-center">Solution Strategies</span>
                            <span className="bg-slate-100 p-0.5 rounded text-center">Analytical Thinker</span>
                            <span className="bg-slate-100 p-0.5 rounded text-center">Innovation</span>
                            <span className="bg-slate-100 p-0.5 rounded text-center">Agile Methodologies</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* 5. Pure ATS Template Preview (Adam Jones) */}
                    {tmpl.id === "pure_ats" && (
                      <div className="space-y-1.5 font-sans">
                        <div className="border-b border-slate-900 pb-1">
                          <div className="font-bold text-[12px] text-slate-900 uppercase">
                            Adam Jones
                          </div>
                          <div className="text-[7.5px] text-slate-600 mt-0.5">
                            Detroit, MI | a.jones@email.com | (555) 304-1739
                          </div>
                        </div>

                        <div>
                          <div className="font-bold text-[8px] uppercase tracking-wide text-slate-900 mb-0.5">
                            Profile
                          </div>
                          <p className="text-[7px] text-slate-700 leading-tight">
                            Superior litigator, negotiator, and communicator with 13 years' experience developing various approaches to reach resolutions...
                          </p>
                        </div>

                        <div>
                          <div className="font-bold text-[8px] uppercase tracking-wide text-slate-900 mb-0.5">
                            Professional Experience
                          </div>
                          <div className="font-semibold text-[7.5px]">
                            Lead Attorney and In-house counsel, The W Tax Group
                          </div>
                          <div className="text-[6.8px] text-slate-500 mb-0.5">2014 to Present</div>
                          <div className="text-[7px] text-slate-600 pl-2">
                            • Negotiate debt settlements or resolutions for unpaid debt as Revenue Officer Defense...
                          </div>
                        </div>

                        <div>
                          <div className="font-bold text-[8px] uppercase tracking-wide text-slate-900 mb-0.5">
                            Education
                          </div>
                          <div className="text-[7.2px] text-slate-800 font-semibold">
                            Loyola University Chicago School of Law, Chicago, IL &mdash; Juris Doctor
                          </div>
                        </div>

                        <div>
                          <div className="font-bold text-[8px] uppercase tracking-wide text-slate-900 mb-0.5">
                            Areas of Expertise
                          </div>
                          <div className="flex justify-between text-[6.8px] text-slate-700">
                            <span>• Leadership Skills</span>
                            <span>• Negotiation</span>
                            <span>• Legal Research</span>
                          </div>
                        </div>

                        <div className="text-right text-[6.5px] text-slate-400 pt-1">
                          Page 1
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Hover Overlay Button */}
                  <div className="absolute inset-0 bg-slate-900/30 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="px-3.5 py-1.5 rounded-lg bg-white text-slate-900 text-xs font-bold shadow-lg flex items-center gap-1.5">
                      <Eye size={14} />
                      <span>Quick Preview</span>
                    </span>
                  </div>
                </div>

                {/* Sub-preview Controls: Color Palette Dots & Format Badges (Matching Screenshot 2 & 3) */}
                <div className="px-6 py-3 bg-slate-50 dark:bg-slate-900/60 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  {/* Palette Dots */}
                  <div className="flex items-center gap-1.5">
                    {tmpl.colors.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleColorChange(tmpl.id, color);
                        }}
                        style={{ backgroundColor: color }}
                        className={`w-3.5 h-3.5 rounded-full border transition-all cursor-pointer ${
                          accentColor === color
                            ? "ring-2 ring-indigo-500 scale-125 border-white"
                            : "border-transparent opacity-80 hover:opacity-100"
                        }`}
                        title={`Select color ${color}`}
                      />
                    ))}
                  </div>

                  {/* Format Badges */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      PDF
                    </span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      DOCX
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className="text-[11px] font-bold px-2.5 py-0.5 rounded-md text-white tracking-wide"
                        style={{ backgroundColor: tmpl.badgeColor }}
                      >
                        {tmpl.badge}
                      </span>
                      <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                        {tmpl.rating}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                      {tmpl.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                      {tmpl.description}
                    </p>

                    {/* Highlights */}
                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1.5">
                      {tmpl.highlights.slice(0, 3).map((hl, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-400">
                          <CheckCircle2 size={13} className="text-emerald-500 shrink-0 mt-0.5" />
                          <span>{hl}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Card Action Buttons */}
                  <div className="mt-6 pt-3 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setPreviewModalTemplateId(tmpl.id);
                        setIsModalOpen(true);
                      }}
                      className="py-2.5 px-3 rounded-xl font-bold text-xs bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center gap-1.5 cursor-pointer border-0 transition-colors"
                      title="Inspect complete full-page resume layout"
                    >
                      <Eye size={14} />
                      <span>Full Preview</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSelectTemplate(tmpl.id)}
                      className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer border-0 ${
                        isSelected
                          ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20"
                          : "bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white"
                      }`}
                    >
                      <span>{isSelected ? "Active" : "Use Template"}</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          4. WHOLE RESUME FULL-PAGE PREVIEW MODAL
      ───────────────────────────────────────────────────────────── */}
      <FullResumePreviewModal
        isOpen={isModalOpen}
        templateId={previewModalTemplateId}
        onClose={() => setIsModalOpen(false)}
        onSelectTemplate={handleSelectTemplate}
      />

      {/* ─────────────────────────────────────────────────────────────
          5. FOOTER
      ───────────────────────────────────────────────────────────── */}
      <footer className="mt-auto border-t border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 py-8 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-md bg-gradient-to-tr from-indigo-600 to-blue-500 flex items-center justify-center text-white font-bold text-xs">
              R
            </div>
            <span className="font-bold text-slate-800 dark:text-slate-200">RoleWise</span>
            <span>&copy; 2026 RoleWise. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-6">
            <Link to="/" className="hover:text-slate-900 dark:hover:text-white transition-colors">
              Home
            </Link>
            <Link to="/templates" className="hover:text-slate-900 dark:hover:text-white transition-colors">
              Resume Templates
            </Link>
            <Link to={isAuthenticated ? "/dashboard" : "/login"} className="hover:text-slate-900 dark:hover:text-white transition-colors">
              Dashboard
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default TemplatesPage;
