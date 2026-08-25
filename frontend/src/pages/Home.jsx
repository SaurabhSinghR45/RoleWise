import React from "react";
import Navbar from "../components/Navbar";
import { useAuth } from "../features/auth/hooks/useAuth";
import {
  Sparkles,
  FileText,
  Target,
  BrainCircuit,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

const Home = () => {
  const { user } = useAuth();

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />

      <main style={{ flex: 1, padding: "3rem 1.5rem", maxWidth: "1200px", margin: "0 auto", width: "100%" }}>
        {/* Welcome Hero */}
        <section
          className="glass-panel"
          style={{
            padding: "3rem 2.5rem",
            position: "relative",
            overflow: "hidden",
            marginBottom: "2.5rem",
            border: "1px solid rgba(99, 102, 241, 0.25)",
            background: "linear-gradient(135deg, rgba(17, 24, 39, 0.9) 0%, rgba(30, 27, 75, 0.4) 100%)",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "-50%",
              right: "-10%",
              width: "400px",
              height: "400px",
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(99, 102, 241, 0.25), transparent 70%)",
              pointerEvents: "none",
            }}
          />

          <div style={{ position: "relative", zIndex: 1, maxWidth: "700px" }}>
            <div className="badge badge-success" style={{ marginBottom: "1rem" }}>
              <CheckCircle2 size={13} /> Active Session • Authenticated as {user?.email}
            </div>
            <h1 style={{ fontSize: "2.5rem", marginBottom: "0.85rem", lineHeight: 1.2 }}>
              Welcome back, <span className="gradient-text">{user?.username}</span>!
            </h1>
            <p style={{ fontSize: "1.1rem", color: "var(--text-secondary)", marginBottom: "1.75rem" }}>
              Rolewise transforms job descriptions and your resume into targeted interview preparation plans, expected technical questions, and ATS-optimized resumes.
            </p>

            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              <button className="btn btn-primary">
                <Sparkles size={18} />
                <span>Start New Role Prep</span>
                <ArrowRight size={16} />
              </button>
              <button className="btn btn-secondary">
                <FileText size={18} />
                <span>View Previous Reports</span>
              </button>
            </div>
          </div>
        </section>

        {/* Feature Cards Grid */}
        <section>
          <h2 style={{ fontSize: "1.4rem", marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Target size={20} style={{ color: "var(--accent-cyan)" }} />
            <span>AI Career Preparation Workflow</span>
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {/* Card 1 */}
            <div className="glass-panel" style={{ padding: "1.75rem" }}>
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "12px",
                  background: "rgba(99, 102, 241, 0.15)",
                  color: "var(--accent-primary)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "1.25rem",
                }}
              >
                <BrainCircuit size={24} />
              </div>
              <h3 style={{ fontSize: "1.15rem", marginBottom: "0.5rem" }}>
                1. AI Match & Gap Analysis
              </h3>
              <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>
                Upload your resume and paste target job descriptions. Gemini 2.5 Flash analyzes your readiness and identifies critical skill gaps.
              </p>
            </div>

            {/* Card 2 */}
            <div className="glass-panel" style={{ padding: "1.75rem" }}>
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "12px",
                  background: "rgba(6, 182, 212, 0.15)",
                  color: "var(--accent-cyan)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "1.25rem",
                }}
              >
                <Sparkles size={24} />
              </div>
              <h3 style={{ fontSize: "1.15rem", marginBottom: "0.5rem" }}>
                2. Technical & Behavioral Q&A
              </h3>
              <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>
                Get structured interview questions with interviewer intentions, model answers, and day-wise prep roadmaps tailored to the role.
              </p>
            </div>

            {/* Card 3 */}
            <div className="glass-panel" style={{ padding: "1.75rem" }}>
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "12px",
                  background: "rgba(16, 185, 129, 0.15)",
                  color: "var(--accent-emerald)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "1.25rem",
                }}
              >
                <FileText size={24} />
              </div>
              <h3 style={{ fontSize: "1.15rem", marginBottom: "0.5rem" }}>
                3. ATS Resume PDF Generation
              </h3>
              <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>
                Generate tailored ATS-friendly resumes compiled with Puppeteer and download formatted PDFs instantly.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;
