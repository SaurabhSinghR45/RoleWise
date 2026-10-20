import React, { useState } from "react";
import {
  X,
  CheckCircle2,
  Download,
  ZoomIn,
  ZoomOut,
  Maximize2,
  ArrowRight,
  ShieldCheck,
  Award,
  Layers,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Check,
} from "lucide-react";

// Official NIT Warangal Vector Crest
const NitwLogoSvg = () => (
  <svg width="50" height="58" viewBox="0 0 100 115" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
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

const FullResumePreviewModal = ({
  templateId = "nitw",
  isOpen = false,
  onClose,
  onSelectTemplate,
}) => {
  const [currentId, setCurrentId] = useState(templateId);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [accentColor, setAccentColor] = useState("#1e293b");

  // Keep internal currentId synced when prop changes
  React.useEffect(() => {
    if (templateId) {
      setCurrentId(templateId);
      if (templateId === "prime_ats") setAccentColor("#0284c7");
      else if (templateId === "classic") setAccentColor("#2563eb");
      else if (templateId === "traditional") setAccentColor("#0f172a");
      else if (templateId === "pure_ats") setAccentColor("#0f172a");
      else setAccentColor("#1e293b");
    }
  }, [templateId]);

  if (!isOpen) return null;

  const TEMPLATES = [
    { id: "nitw", name: "College Campus (NIT Warangal)", badge: "Campus Placement", rating: "99.8% ATS Pass" },
    { id: "classic", name: "Classic", badge: "Robust Career Stack", rating: "98.8% ATS Pass" },
    { id: "traditional", name: "Traditional", badge: "Corporate Executive", rating: "97.9% ATS Pass" },
    { id: "prime_ats", name: "Prime ATS", badge: "Modern Tech & Finance", rating: "99.1% ATS Pass" },
    { id: "pure_ats", name: "Pure ATS", badge: "100% Machine Parsable", rating: "100% ATS Benchmark" },
  ];

  const currentTemplateObj = TEMPLATES.find((t) => t.id === currentId) || TEMPLATES[0];

  const handleNext = () => {
    const idx = TEMPLATES.findIndex((t) => t.id === currentId);
    const nextIdx = (idx + 1) % TEMPLATES.length;
    setCurrentId(TEMPLATES[nextIdx].id);
  };

  const handlePrev = () => {
    const idx = TEMPLATES.findIndex((t) => t.id === currentId);
    const prevIdx = (idx - 1 + TEMPLATES.length) % TEMPLATES.length;
    setCurrentId(TEMPLATES[prevIdx].id);
  };

  const handleSelect = () => {
    if (onSelectTemplate) {
      onSelectTemplate(currentId);
    }
    onClose();
  };

  const PALETTE_COLORS = [
    "#0f172a", // Charcoal Slate
    "#1d4ed8", // Corporate Navy
    "#4f46e5", // Indigo Accent
    "#0284c7", // Sky Blue
    "#047857", // Deep Emerald
    "#b45309", // Warm Amber
    "#b91c1c", // Crimson
  ];

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex flex-col justify-between overflow-hidden"
      onClick={onClose}
    >
      {/* ─────────────────────────────────────────────────────────────
          1. TOP CONTROLS TOOLBAR
      ───────────────────────────────────────────────────────────── */}
      <header
        className="h-16 px-4 sm:px-6 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-white shrink-0 z-10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left: Template Selector Tabs */}
        <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto py-1 scrollbar-none">
          <div className="flex items-center bg-slate-800 rounded-lg p-1 border border-slate-700/80">
            {TEMPLATES.map((tmpl) => (
              <button
                key={tmpl.id}
                type="button"
                onClick={() => setCurrentId(tmpl.id)}
                className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all whitespace-nowrap cursor-pointer border-0 ${
                  currentId === tmpl.id
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "text-slate-300 hover:text-white hover:bg-slate-700/60"
                }`}
              >
                {tmpl.name}
              </button>
            ))}
          </div>

          <span className="hidden lg:inline-flex text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-800/80">
            <ShieldCheck size={13} className="mr-1 inline" /> {currentTemplateObj.rating}
          </span>
        </div>

        {/* Right Controls: Palette, Zoom & Close */}
        <div className="flex items-center gap-3 sm:gap-5">
          {/* Color Palette Selector */}
          <div className="hidden sm:flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1.5 rounded-lg border border-slate-700">
            <span className="text-[11px] font-bold text-slate-400 mr-1 uppercase tracking-wider">
              Accent:
            </span>
            {PALETTE_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setAccentColor(c)}
                style={{ backgroundColor: c }}
                className={`w-3.5 h-3.5 rounded-full border transition-all cursor-pointer ${
                  accentColor === c ? "ring-2 ring-white scale-125 border-white" : "border-transparent opacity-75 hover:opacity-100"
                }`}
                title={`Set accent color to ${c}`}
              />
            ))}
          </div>

          {/* Zoom Buttons */}
          <div className="flex items-center bg-slate-800 rounded-lg border border-slate-700 p-0.5">
            <button
              type="button"
              onClick={() => setZoomLevel((z) => Math.max(70, z - 10))}
              className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-700 rounded transition-colors cursor-pointer border-0"
              title="Zoom out"
            >
              <ZoomOut size={16} />
            </button>
            <span className="text-xs font-semibold px-2 text-slate-300 select-none">
              {zoomLevel}%
            </span>
            <button
              type="button"
              onClick={() => setZoomLevel((z) => Math.min(130, z + 10))}
              className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-700 rounded transition-colors cursor-pointer border-0"
              title="Zoom in"
            >
              <ZoomIn size={16} />
            </button>
          </div>

          {/* Close Modal */}
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 cursor-pointer transition-colors"
            title="Close Preview"
          >
            <X size={18} />
          </button>
        </div>
      </header>

      {/* ─────────────────────────────────────────────────────────────
          2. DOCUMENT CANVAS VIEWER (Full A4 Resume Sheet)
      ───────────────────────────────────────────────────────────── */}
      <main
        className="flex-1 overflow-y-auto overflow-x-auto p-4 sm:p-8 flex justify-center items-start bg-slate-900/60"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: "top center" }}
          className="transition-transform duration-150 w-full max-w-[820px] bg-white text-slate-900 rounded-sm shadow-2xl border border-slate-300/80 p-8 sm:p-12 font-serif text-[11px] leading-relaxed my-4"
        >
          {/* =========================================================
              TEMPLATE 1: NIT WARANGAL COLLEGE CAMPUS
          ========================================================== */}
          {currentId === "nitw" && (
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between pb-2 border-b border-black">
                <div className="flex items-center gap-4">
                  <NitwLogoSvg />
                  <div>
                    <h1 className="text-xl font-bold tracking-tight text-black">Your Name</h1>
                    <div className="text-xs text-black">Roll No.: 21CS042</div>
                    <div className="text-xs text-black">B.Tech • Computer Science and Engineering</div>
                    <div className="text-xs font-semibold text-black">
                      National Institute Of Technology, Warangal
                    </div>
                  </div>
                </div>

                <div className="text-right text-[11px] space-y-0.5 text-black">
                  <div>+91-9876543210</div>
                  <div>youremail@email.com</div>
                  <div>officialemail@nitw.ac.in</div>
                  <div>github.com/username</div>
                  <div>linkedin.com/in/username</div>
                </div>
              </div>

              {/* Education */}
              <div>
                <h2
                  className="font-bold text-xs uppercase tracking-wide border-b border-black pb-0.5 mb-1.5"
                  style={{ color: accentColor }}
                >
                  Education
                </h2>
                <div className="space-y-1.5">
                  <div>
                    <div className="flex justify-between font-bold text-[11.5px]">
                      <span>• National Institute of Technology, Warangal</span>
                      <span>2021 &mdash; 2025</span>
                    </div>
                    <div className="flex justify-between italic text-[11px] pl-3 text-slate-800">
                      <span>B.Tech in Computer Science and Engineering</span>
                      <span className="font-semibold not-italic">CGPA: 9.24 / 10</span>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between font-bold text-[11.5px]">
                      <span>• Delhi Public School, R.K. Puram</span>
                      <span>2019 &mdash; 2021</span>
                    </div>
                    <div className="flex justify-between italic text-[11px] pl-3 text-slate-800">
                      <span>Senior School Certificate Examination (CBSE, Class XII)</span>
                      <span className="font-semibold not-italic">Percentage: 96.8%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Experience */}
              <div>
                <h2
                  className="font-bold text-xs uppercase tracking-wide border-b border-black pb-0.5 mb-1.5"
                  style={{ color: accentColor }}
                >
                  Experience
                </h2>
                <div className="space-y-2.5">
                  <div>
                    <div className="flex justify-between font-bold text-[11.5px]">
                      <span>• Microsoft IDC</span>
                      <span>May 2024 &mdash; July 2024</span>
                    </div>
                    <div className="flex justify-between italic text-[11px] pl-3 text-slate-800 mb-1">
                      <span>Software Engineering Intern &mdash; Azure Core Infrastructure</span>
                      <span>Hyderabad, India</span>
                    </div>
                    <ul className="list-none pl-3 space-y-1 text-slate-800 text-[10.5px]">
                      <li className="relative pl-3">
                        <span className="absolute left-0">&ndash;</span>
                        Architected and deployed an event-driven telemetry ingestion pipeline handling 12,000+ metrics/second using Go and Apache Kafka.
                      </li>
                      <li className="relative pl-3">
                        <span className="absolute left-0">&ndash;</span>
                        Reduced p99 query latency by 38% through Redis multi-level caching strategies and indexed PostgreSQL read-replicas.
                      </li>
                      <li className="relative pl-3">
                        <span className="absolute left-0">&ndash;</span>
                        Authored 18+ automated end-to-end integration test suites achieving 94% test coverage across distributed worker nodes.
                      </li>
                    </ul>
                  </div>

                  <div>
                    <div className="flex justify-between font-bold text-[11.5px]">
                      <span>• TechCorp Labs</span>
                      <span>May 2023 &mdash; July 2023</span>
                    </div>
                    <div className="flex justify-between italic text-[11px] pl-3 text-slate-800 mb-1">
                      <span>Full Stack Engineering Intern</span>
                      <span>Bengaluru, India</span>
                    </div>
                    <ul className="list-none pl-3 space-y-1 text-slate-800 text-[10.5px]">
                      <li className="relative pl-3">
                        <span className="absolute left-0">&ndash;</span>
                        Developed automated containerized CI/CD deployment pipelines using GitHub Actions, decreasing build times from 45m to 12m.
                      </li>
                      <li className="relative pl-3">
                        <span className="absolute left-0">&ndash;</span>
                        Engineered responsive internal developer dashboard in React.js and Tailwind CSS, adopted by 180+ active engineering staff.
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Personal Projects */}
              <div>
                <h2
                  className="font-bold text-xs uppercase tracking-wide border-b border-black pb-0.5 mb-1.5"
                  style={{ color: accentColor }}
                >
                  Personal Projects
                </h2>
                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between font-bold text-[11.5px]">
                      <span>• Distributed Cloud Task Scheduler</span>
                      <span>Jan 2024 &mdash; Mar 2024</span>
                    </div>
                    <div className="italic text-[10.5px] pl-3 text-slate-700">
                      Go, gRPC, Redis, Docker, Kubernetes &bull; Fault-tolerant task orchestrator
                    </div>
                    <ul className="list-none pl-3 space-y-0.5 text-slate-800 text-[10.5px] mt-0.5">
                      <li className="relative pl-3">
                        <span className="absolute left-0">&ndash;</span>
                        Engineered leader election protocol with Raft consensus, managing 15k+ tasks/min with sub-15ms node failover recovery.
                      </li>
                      <li className="relative pl-3">
                        <span className="absolute left-0">&ndash;</span>
                        Integrated Prometheus telemetry metrics and Grafana dashboards for cluster resource and memory bottleneck tracking.
                      </li>
                    </ul>
                  </div>

                  <div>
                    <div className="flex justify-between font-bold text-[11.5px]">
                      <span>• RoleWise AI Interview & ATS Readiness Engine</span>
                      <span>Oct 2023 &mdash; Dec 2023</span>
                    </div>
                    <div className="italic text-[10.5px] pl-3 text-slate-700">
                      React, Node.js, FastAPI, PostgreSQL, Gemini Flash &bull; Multi-pillar ATS parser
                    </div>
                    <ul className="list-none pl-3 space-y-0.5 text-slate-800 text-[10.5px] mt-0.5">
                      <li className="relative pl-3">
                        <span className="absolute left-0">&ndash;</span>
                        Trained semantic matching algorithms to evaluate candidate resumes against complex enterprise job descriptions.
                      </li>
                      <li className="relative pl-3">
                        <span className="absolute left-0">&ndash;</span>
                        Benchmarked 99.8% parsing pass-rates across Workday, Taleo, and Greenhouse specifications with zero formatting errors.
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Technical Skills and Interests */}
              <div>
                <h2
                  className="font-bold text-xs uppercase tracking-wide border-b border-black pb-0.5 mb-1.5"
                  style={{ color: accentColor }}
                >
                  Technical Skills and Interests
                </h2>
                <div className="grid grid-cols-1 gap-1 text-[10.5px] pl-1">
                  <div><strong>Languages:</strong> C/C++, Python, Java, JavaScript, TypeScript, Go, SQL, Shell Scripting</div>
                  <div><strong>Developer Tools:</strong> Git, GitHub, Docker, Kubernetes, Linux, Postman, VS Code, Vite</div>
                  <div><strong>Frameworks & Libraries:</strong> React.js, Node.js, Express.js, FastAPI, Next.js, Redux, Tailwind CSS</div>
                  <div><strong>Cloud & Databases:</strong> PostgreSQL, MongoDB, Redis, MySQL, AWS (S3, EC2, Lambda), Firebase</div>
                  <div><strong>Soft Skills:</strong> Analytical Thinking, Agile Scrum Methodology, Technical Documentation, Mentorship</div>
                  <div><strong>Coursework:</strong> Data Structures & Algorithms, Operating Systems, DBMS, Computer Networks, System Design</div>
                </div>
              </div>

              {/* Positions of Responsibility */}
              <div>
                <h2
                  className="font-bold text-xs uppercase tracking-wide border-b border-black pb-0.5 mb-1.5"
                  style={{ color: accentColor }}
                >
                  Positions of Responsibility
                </h2>
                <div className="space-y-1 text-[10.5px]">
                  <div className="flex justify-between font-bold">
                    <span>• Lead Student Coordinator &mdash; Placement and Training Cell, NIT Warangal</span>
                    <span>July 2024 &mdash; Present</span>
                  </div>
                  <div className="flex justify-between font-bold">
                    <span>• Technical Head &mdash; Coding Club & Technozion Annual Tech Festival</span>
                    <span>Aug 2023 &mdash; April 2024</span>
                  </div>
                </div>
              </div>

              {/* Achievements */}
              <div>
                <h2
                  className="font-bold text-xs uppercase tracking-wide border-b border-black pb-0.5 mb-1.5"
                  style={{ color: accentColor }}
                >
                  Achievements
                </h2>
                <ul className="list-none pl-3 space-y-0.5 text-slate-800 text-[10.5px]">
                  <li className="relative pl-3">
                    <span className="absolute left-0">&bull;</span>
                    Global Rank 142 on LeetCode Weekly Contest out of 32,000+ international competitive programmers.
                  </li>
                  <li className="relative pl-3">
                    <span className="absolute left-0">&bull;</span>
                    National Finalist & 2nd Runner-Up at Smart India Hackathon (Ministry of Education, Govt. of India).
                  </li>
                  <li className="relative pl-3">
                    <span className="absolute left-0">&bull;</span>
                    Solved 800+ algorithmic problems across LeetCode, Codeforces (Candidate Master), and GeeksforGeeks.
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* =========================================================
              TEMPLATE 2: CLASSIC (Logan Mitchell Style)
          ========================================================== */}
          {currentId === "classic" && (
            <div className="space-y-4">
              {/* Header */}
              <div className="text-center pb-2">
                <h1 className="text-xl font-bold tracking-tight text-slate-900" style={{ color: accentColor }}>
                  Logan Mitchell, Software Engineer
                </h1>
                <div className="text-xs text-slate-600 mt-1">
                  San Francisco, CA &bull; (415) 555-0148 &bull; logan.mitchell.dev@gmail.com &bull; linkedin.com/in/logmi &bull; github.com/logmi-dev
                </div>
              </div>

              {/* Metadata 2x2 Table */}
              <div className="border border-slate-300 text-xs p-2 grid grid-cols-2 gap-x-4 gap-y-1 bg-slate-50/70">
                <div><strong>Date / Place of birth:</strong> 04/07/1989 Austin, Texas USA</div>
                <div><strong>Marital status:</strong> Married</div>
                <div><strong>Nationality / Gender:</strong> American / Male</div>
                <div><strong>Notice Period:</strong> Immediate / Available</div>
              </div>

              {/* Profile */}
              <div>
                <h2 className="font-bold text-xs uppercase tracking-wider border-b border-slate-900 pb-0.5 mb-1.5">
                  Profile
                </h2>
                <p className="text-[11px] text-slate-800 leading-relaxed text-justify">
                  Senior software engineer with 8+ years building high-throughput backend systems and developer platforms. Specializes in distributed systems, API design, and scaling services from prototype to millions of daily requests. Led teams of up to 6 engineers, mentored junior staff, and shipped systems that cut cloud infrastructure costs and improved reliability across multiple production environments.
                </p>
              </div>

              {/* Experience */}
              <div>
                <h2 className="font-bold text-xs uppercase tracking-wider border-b border-slate-900 pb-0.5 mb-2">
                  Experience
                </h2>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between font-bold text-xs">
                      <span>Senior Software Engineer &mdash; Northwind Analytics</span>
                      <span>San Francisco, CA</span>
                    </div>
                    <div className="text-xs text-slate-600 italic mb-1">Mar 2021 &mdash; Present</div>
                    <ul className="list-disc pl-4 space-y-1 text-[11px] text-slate-800">
                      <li>Redesigned the event-ingestion pipeline using Kafka and Go, increasing throughput from 8k to 65k events/sec while cutting p99 latency by 40%.</li>
                      <li>Led a 5-person team to migrate a monolith to microservices on Kubernetes, reducing deployment time from 45 minutes to under 5.</li>
                      <li>Designed and shipped a public API platform adopted by 120+ external partners, including versioning, rate limiting, and self-service API keys.</li>
                      <li>Cut monthly AWS spend by 30% ($42k/year) by right-sizing instances and introducing spot-instance autoscaling.</li>
                    </ul>
                  </div>

                  <div>
                    <div className="flex justify-between font-bold text-xs">
                      <span>Software Engineer II &mdash; Brightline Health</span>
                      <span>Remote</span>
                    </div>
                    <div className="text-xs text-slate-600 italic mb-1">Jul 2018 &mdash; Feb 2021</div>
                    <ul className="list-disc pl-4 space-y-1 text-[11px] text-slate-800">
                      <li>Built a real-time appointment scheduling service handling 200k+ daily requests with 99.95% uptime.</li>
                      <li>Owned migration from a shared MySQL instance to per-service PostgreSQL databases with zero downtime.</li>
                      <li>Introduced contract testing between 8 internal services, reducing integration-bug incidents by 60% quarter over quarter.</li>
                    </ul>
                  </div>

                  <div>
                    <div className="flex justify-between font-bold text-xs">
                      <span>Software Engineer &mdash; Fieldstone Labs</span>
                      <span>Austin, TX</span>
                    </div>
                    <div className="text-xs text-slate-600 italic mb-1">Jun 2016 &mdash; Jun 2018</div>
                    <ul className="list-disc pl-4 space-y-1 text-[11px] text-slate-800">
                      <li>Developed core REST APIs for an inventory-management SaaS product used by 300+ small-business customers.</li>
                      <li>Implemented automated test suite (Pytest) that raised backend coverage from 35% to 82%, catching regressions before release.</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Education */}
              <div>
                <h2 className="font-bold text-xs uppercase tracking-wider border-b border-slate-900 pb-0.5 mb-1.5">
                  Education
                </h2>
                <div className="flex justify-between font-bold text-xs">
                  <span>B.S. in Computer Science &mdash; University of Texas at Austin</span>
                  <span>Aug 2012 &mdash; May 2016</span>
                </div>
                <div className="text-[11px] text-slate-700 pl-2">
                  Relevant coursework: Distributed Systems, Operating Systems, Database Systems &bull; Teaching Assistant for Data Structures
                </div>
              </div>

              {/* Skills */}
              <div>
                <h2 className="font-bold text-xs uppercase tracking-wider border-b border-slate-900 pb-0.5 mb-1.5">
                  Skills
                </h2>
                <div className="space-y-1 text-[11px]">
                  <div><strong>LANGUAGES:</strong> Go, Python, TypeScript, Java, SQL</div>
                  <div><strong>BACKEND & INFRA:</strong> gRPC, REST, Kafka, PostgreSQL, Redis, Kubernetes, Docker, Terraform</div>
                  <div><strong>CLOUD & TOOLING:</strong> AWS (EKS, RDS, Lambda, S3), GCP, GitHub Actions, Datadog, Prometheus/Grafana</div>
                  <div><strong>PRACTICES:</strong> System design, microservices, CI/CD, on-call ownership, mentoring, code review</div>
                </div>
              </div>

              {/* Languages */}
              <div>
                <h2 className="font-bold text-xs uppercase tracking-wider border-b border-slate-900 pb-0.5 mb-1.5">
                  Languages
                </h2>
                <div className="text-[11px] space-x-6">
                  <span><strong>English:</strong> Native / Proficient</span>
                  <span><strong>Spanish:</strong> Fluent</span>
                  <span><strong>German:</strong> Working Proficiency</span>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================
              TEMPLATE 3: TRADITIONAL (Tiffany Giroux Style)
          ========================================================== */}
          {currentId === "traditional" && (
            <div className="space-y-4">
              {/* Centered Serif Header */}
              <div className="text-center">
                <h1 className="text-2xl font-normal tracking-wide text-slate-900">
                  Tiffany Giroux
                </h1>
                <div className="text-xs italic text-slate-700 mt-0.5">
                  Freight & Logistics Analyst
                </div>
                <div className="text-xs text-slate-600 mt-0.5">
                  18 Harmony Drive, Orlando, Florida 32767
                </div>
              </div>

              {/* Address / Contact Bar with solid double rule */}
              <div className="border-y-2 border-black py-1 flex justify-between text-xs font-semibold px-2">
                <span>001 415 570 5567</span>
                <span>tiffgiroux@hotmail.com</span>
              </div>

              {/* Shaded Profile Banner */}
              <div className="bg-slate-200 text-center font-bold text-xs uppercase tracking-widest py-1 border-y border-black">
                Profile
              </div>
              <p className="text-[11px] italic text-slate-800 leading-relaxed text-justify px-2">
                A highly skilled and organized Logistics, Distribution and Supply Chain professional with additional experience within bookkeeping and accounting. Possessing a resilient approach and analytical mind, able to work with detailed components through to the big picture. I have managed multiple systems and process development projects to facilitate increased effectiveness and reduced costs across all previous roles.
              </p>

              {/* Shaded Experience Banner */}
              <div className="bg-slate-200 text-center font-bold text-xs uppercase tracking-widest py-1 border-y border-black">
                Experience
              </div>
              <div className="space-y-3 px-1">
                <div>
                  <div className="flex justify-between font-bold text-xs">
                    <span>❖ Freight Audit & Logistics Analyst &mdash; Ford</span>
                    <span className="font-normal text-xs">July 2014 &mdash; Current</span>
                  </div>
                  <div className="text-xs italic text-slate-600 mb-1">Detroit, MI</div>
                  <p className="text-[11px] text-slate-800 mb-1">
                    Oversee collation and analysis of data, identifying opportunities for operational process improvements. Responsible for gathering and analyzing requirements, ensuring achievement of strategic organizational objectives through business process improvement and application project implementations.
                  </p>
                  <ul className="list-disc pl-5 space-y-0.5 text-[10.5px] text-slate-800">
                    <li>Improved efficiencies and achieved cost reductions of 13% across all freight activity.</li>
                    <li>Met all project deadlines, budget and quality expectations.</li>
                  </ul>
                </div>

                <div>
                  <div className="flex justify-between font-bold text-xs">
                    <span>❖ Senior Logistics Business Analyst &mdash; Honda</span>
                    <span className="font-normal text-xs">May 2012 &mdash; June 2014</span>
                  </div>
                  <p className="text-[11px] text-slate-800 mb-1">
                    Analyzed organizational logistics expenditure, preparing detailed monthly metrics and reports, tracking savings and presenting KPI data. Proactively mitigated budget variances through accurate forecasting of predicted expenditure.
                  </p>
                  <ul className="list-disc pl-5 space-y-0.5 text-[10.5px] text-slate-800">
                    <li>Provided recommendations for action regarding financial impact of routing, carrier rate, shipping mode, and distribution hub changes.</li>
                  </ul>
                </div>

                <div>
                  <div className="flex justify-between font-bold text-xs">
                    <span>❖ Senior Logistics Coordinator &mdash; Honda</span>
                    <span className="font-normal text-xs">May 2011 &mdash; May 2012</span>
                  </div>
                  <p className="text-[11px] text-slate-800">
                    Coordinated cross-dock shipments and freight vendor reconciliations with 99.4% SLA adherence.
                  </p>
                </div>
              </div>

              {/* Shaded Education Banner */}
              <div className="bg-slate-200 text-center font-bold text-xs uppercase tracking-widest py-1 border-y border-black">
                Education
              </div>
              <div className="space-y-1.5 px-1 text-xs">
                <div className="flex justify-between font-bold">
                  <span>❖ Postgraduate Diploma Management Studies</span>
                  <span className="font-normal">September 2009 &mdash; September 2010</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span>❖ Management Studies, University of Hertfordshire, Bedford</span>
                  <span className="font-normal">September 2007 &mdash; September 2009</span>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================
              TEMPLATE 4: PRIME ATS (Herman Walton Style)
          ========================================================== */}
          {currentId === "prime_ats" && (
            <div className="space-y-4 font-sans">
              {/* Header with Photo Slot */}
              <div className="flex items-start justify-between pb-2">
                <div>
                  <h1 className="text-2xl font-extrabold uppercase tracking-tight" style={{ color: accentColor }}>
                    HERMAN WALTON
                  </h1>
                  <div className="text-sm font-bold text-slate-800 uppercase tracking-wide">
                    FINANCIAL ANALYST
                  </div>
                  <div className="text-xs text-slate-600 mt-1">
                    Market Street 12, New York, 1021, The USA &bull; (412) 479-6342 &bull; herman@gmail.com
                  </div>
                </div>

                <div className="w-16 h-20 bg-slate-100 rounded border border-slate-300 flex flex-col items-center justify-center text-slate-400 text-xs shadow-xs">
                  <span className="font-bold text-[10px]">PHOTO</span>
                </div>
              </div>

              <div className="h-1 w-full" style={{ backgroundColor: accentColor }} />

              {/* Summary */}
              <div>
                <h2 className="font-extrabold text-xs uppercase tracking-wider mb-1" style={{ color: accentColor }}>
                  Summary
                </h2>
                <p className="text-[11px] text-slate-800 leading-relaxed text-justify">
                  Experienced and driven Financial Analyst with an impressive background of managing multi-million dollar budgets while providing analysis and account support within product development departments. Worked to reduce business expenses and developed logical and advantageous operating plan budgets. Experience creating quarterly accruals based on trends and forecasted expenses.
                </p>
              </div>

              {/* Professional Experience */}
              <div>
                <h2 className="font-extrabold text-xs uppercase tracking-wider mb-2" style={{ color: accentColor }}>
                  Professional Experience
                </h2>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between font-bold text-xs text-slate-900">
                      <span>Financial Analyst, GEO Corp.</span>
                      <span className="text-slate-600">Jan 2012 &mdash; Present</span>
                    </div>
                    <ul className="list-disc pl-5 space-y-1 text-[11px] text-slate-800 mt-1">
                      <li>Created budgets and ensured that labor and material costs were decreased by 15 percent.</li>
                      <li>Created financial reports on completed projects, indicating advantageous results.</li>
                      <li>Generated financial statements including cash flow charts and balance sheets.</li>
                      <li>Created analysis and performance reports for management teams to review.</li>
                      <li>Introduced and implemented a different type of software to enhance communication of different organization.</li>
                    </ul>
                  </div>

                  <div>
                    <div className="flex justify-between font-bold text-xs text-slate-900">
                      <span>Financial Analyst, Sisco Enterprises</span>
                      <span className="text-slate-600">Feb 2008 &mdash; Dec 2012</span>
                    </div>
                    <ul className="list-disc pl-5 space-y-1 text-[11px] text-slate-800 mt-1">
                      <li>Provide reports, ad-hoc analysis, annual operations plan budgets, monthly cash forecasts, and revenue forecasts.</li>
                      <li>Analyzed supplier contracts and advised in negotiations bringing down costs by 6%.</li>
                      <li>Created weekly labor finance reports and presented the results to management.</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Education */}
              <div>
                <h2 className="font-extrabold text-xs uppercase tracking-wider mb-1.5" style={{ color: accentColor }}>
                  Education
                </h2>
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <div>
                      <div className="font-bold">Diploma in Computer Engineering</div>
                      <div className="text-slate-600">University of Arizona</div>
                    </div>
                    <span className="font-semibold text-slate-600">Aug 2006 &mdash; Oct 2008</span>
                  </div>
                  <div className="flex justify-between">
                    <div>
                      <div className="font-bold">Bachelor in Computer Engineering</div>
                      <div className="text-slate-600">University of Arizona</div>
                    </div>
                    <span className="font-semibold text-slate-600">Aug 2004 &mdash; Oct 2006</span>
                  </div>
                </div>
              </div>

              {/* Technical Skills 4-Column Grid */}
              <div>
                <h2 className="font-extrabold text-xs uppercase tracking-wider mb-2" style={{ color: accentColor }}>
                  Technical Skills
                </h2>
                <div className="grid grid-cols-4 gap-2 text-xs">
                  <div className="bg-slate-50 p-2 rounded border border-slate-200 text-center font-medium">Solution Strategies</div>
                  <div className="bg-slate-50 p-2 rounded border border-slate-200 text-center font-medium">Analytical Thinker</div>
                  <div className="bg-slate-50 p-2 rounded border border-slate-200 text-center font-medium">Innovation</div>
                  <div className="bg-slate-50 p-2 rounded border border-slate-200 text-center font-medium">Agile Methodologies</div>
                  <div className="bg-slate-50 p-2 rounded border border-slate-200 text-center font-medium">Effective Team Leader</div>
                  <div className="bg-slate-50 p-2 rounded border border-slate-200 text-center font-medium">Market Assessment</div>
                  <div className="bg-slate-50 p-2 rounded border border-slate-200 text-center font-medium">Collaboration</div>
                  <div className="bg-slate-50 p-2 rounded border border-slate-200 text-center font-medium">Creative Problem Solving</div>
                </div>
              </div>

              {/* Additional Information */}
              <div>
                <h2 className="font-extrabold text-xs uppercase tracking-wider mb-1" style={{ color: accentColor }}>
                  Additional Information
                </h2>
                <ul className="list-disc pl-5 space-y-0.5 text-[11px] text-slate-800">
                  <li><strong>Languages:</strong> English, French</li>
                  <li><strong>Certificates:</strong> Financial Analyst License, AWS Certified Cloud Practitioner</li>
                  <li><strong>Awards/Activities:</strong> Most Innovative Employee of the Year (2011), Overall Best Employee Division Two (2009)</li>
                </ul>
              </div>
            </div>
          )}

          {/* =========================================================
              TEMPLATE 5: PURE ATS (Adam Jones Style)
          ========================================================== */}
          {currentId === "pure_ats" && (
            <div className="space-y-4 font-sans">
              {/* Header */}
              <div className="border-b border-slate-900 pb-2">
                <h1 className="text-2xl font-bold uppercase tracking-tight text-slate-900">
                  Adam Jones
                </h1>
                <div className="text-xs text-slate-700 mt-1">
                  Detroit, MI | a.jones@email.com | (555) 304-1739
                </div>
              </div>

              {/* Profile */}
              <div>
                <h2 className="font-bold text-xs uppercase tracking-wide text-slate-900 mb-1">
                  Profile
                </h2>
                <p className="text-[11px] text-slate-800 leading-relaxed text-justify">
                  Superior litigator, negotiator, and communicator with 13 years' experience developing various approaches to reach satisfactory resolutions and outwork the opposition. Specialize in administering bespoke, research-backed legal advice to business owners covering a range of matters, from transactions, risks, taxation, and intellectual property rights to contracts and agreements. Possess a resilient approach and analytical mind, able to work with detailed components through to the big picture, while ensuring legal compliance, brokering contractual terms, transactions, and settlements, and regulating legal paperwork.
                </p>
              </div>

              {/* Professional Experience */}
              <div>
                <h2 className="font-bold text-xs uppercase tracking-wide text-slate-900 mb-2">
                  Professional Experience
                </h2>
                <div className="space-y-3">
                  <div>
                    <div className="font-bold text-xs text-slate-900">
                      Lead Attorney and In-house counsel , The W Tax Group , Southfield, MI.
                    </div>
                    <div className="text-xs text-slate-600 mb-1">2014 to Present</div>
                    <ul className="list-disc pl-5 space-y-1 text-[11px] text-slate-800">
                      <li>As lead attorney, deliver viable solutions and advice to clients on how to best resolve unpaid tax debts, specializing in legal / business risk analysis, negotiations, compliance matters, and vendor relations.</li>
                      <li>Negotiate debt settlements or resolutions for unpaid debt as Revenue Officer Defense for diverse midsized businesses and individuals.</li>
                      <li>As In-House Counsel, draft and broker vendor contracts and administer evidence-backed legal / business advice to investors and stakeholders.</li>
                      <li>Position sales team to utilize solutions-based selling by explaining complicated tax issues in understandable terms.</li>
                      <li>Saved taxpayers $4.2M+ (93%) in tax debt through the Offer In Compromise Program, while representing 400+ individual and business tax debtors.</li>
                    </ul>
                  </div>

                  <div>
                    <div className="font-bold text-xs text-slate-900">
                      Attorney , Harrington Dragich PLLC. , Grosse Point Woods, MI.
                    </div>
                    <div className="text-xs text-slate-600 mb-1">2009 to 2013</div>
                    <ul className="list-disc pl-5 space-y-1 text-[11px] text-slate-800">
                      <li>Administered commercial litigation and corporate bankruptcy services for clients undergoing periods of financial distress.</li>
                      <li>Negotiated Chapter 11 plan as debtor counsel in consideration of diverse secured, priority, and unsecured debtor interests.</li>
                      <li>Applied in-depth knowledge of IRS administrative code and manual to resolve complex taxpayer liability issues.</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Education */}
              <div>
                <h2 className="font-bold text-xs uppercase tracking-wide text-slate-900 mb-1">
                  Education
                </h2>
                <div className="space-y-1 text-xs">
                  <div className="font-bold text-slate-900">
                    Loyola University Chicago School of Law, Chicago, IL
                  </div>
                  <div className="text-slate-700 italic pl-2">Juris Doctor</div>
                  <div className="font-bold text-slate-900 mt-1">
                    University of Michigan, Ann Arbor, MI
                  </div>
                  <div className="text-slate-700 italic pl-2">Bachelor of Arts in Psychology</div>
                </div>
              </div>

              {/* Areas of Expertise */}
              <div>
                <h2 className="font-bold text-xs uppercase tracking-wide text-slate-900 mb-1.5">
                  Areas of Expertise
                </h2>
                <div className="grid grid-cols-3 gap-2 text-xs text-slate-800 pl-1">
                  <div>&bull; Leadership Skills</div>
                  <div>&bull; Excellent Communication Skills</div>
                  <div>&bull; Strong Mediation Techniques</div>
                  <div>&bull; Legal Research</div>
                  <div>&bull; Corporate Contracts</div>
                  <div>&bull; Regulatory Compliance</div>
                </div>
              </div>

              {/* Footer */}
              <div className="text-right text-[10px] text-slate-400 pt-3">
                Page 1
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ─────────────────────────────────────────────────────────────
          3. BOTTOM ACTION BAR
      ───────────────────────────────────────────────────────────── */}
      <footer
        className="h-16 px-4 sm:px-8 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-white shrink-0 z-10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Navigation Arrows */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrev}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold flex items-center gap-1 text-slate-300 hover:text-white border border-slate-700 cursor-pointer transition-colors"
          >
            <ChevronLeft size={16} />
            <span className="hidden sm:inline">Previous Template</span>
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold flex items-center gap-1 text-slate-300 hover:text-white border border-slate-700 cursor-pointer transition-colors"
          >
            <span className="hidden sm:inline">Next Template</span>
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Selected Confirmation & CTA */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer transition-colors border-0"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSelect}
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer border-0"
          >
            <Check size={16} />
            <span>Select & Use This Template</span>
            <ArrowRight size={15} />
          </button>
        </div>
      </footer>
    </div>
  );
};

export default FullResumePreviewModal;
