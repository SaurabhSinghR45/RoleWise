import React, { useState } from "react";
import {
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  BookOpen,
  Calendar,
  Code2,
  Users,
  ChevronDown,
  ChevronUp,
  Download,
  Copy,
  Check,
  Loader2,
  FileText,
  Mic,
  Target,
  Compass,
} from "lucide-react";
import { downloadResumePdfApi } from "../services/interview.api";
import AnswerPracticeWorkshop from "../components/AnswerPracticeWorkshop";
import KeywordRadarTab from "../components/KeywordRadarTab";
import RoadmapTrackerTab from "../components/RoadmapTrackerTab";
import MultiRoleComparisonTab from "../components/MultiRoleComparisonTab";
import "../../../styles/interview.css";

const InterviewReport = ({ report, onBack }) => {
  const [activeTab, setActiveTab] = useState("overview"); // overview, keywords, technical, behavioral, roadmap, compare
  const [expandedQuestions, setExpandedQuestions] = useState({});
  const [practiceOpen, setPracticeOpen] = useState({});
  const [completedTasks, setCompletedTasks] = useState({});
  const [copiedId, setCopiedId] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!report) return null;

  const togglePractice = (id) => {
    setPracticeOpen((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const toggleQuestion = (idx) => {
    setExpandedQuestions((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  const toggleTask = (dayIdx, taskIdx) => {
    const key = `${dayIdx}-${taskIdx}`;
    setCompletedTasks((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownloadPDF = async () => {
    if (isDownloading) return;
    try {
      setIsDownloading(true);
      const blob = await downloadResumePdfApi(report._id);
      const url = window.URL.createObjectURL(new Blob([blob], { type: "application/pdf" }));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Rolewise_ATS_Resume_${report._id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (err) {
      console.error("Failed to download ATS Resume PDF:", err);
      alert("Failed to export ATS Resume PDF. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  const getScoreColorClass = (score) => {
    if (score >= 80) return "score-excellent";
    if (score >= 65) return "score-good";
    if (score >= 50) return "score-average";
    return "score-low";
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return "Strong Match";
    if (score >= 65) return "Good Fit";
    if (score >= 50) return "Moderate Fit";
    return "High Skill Gap";
  };

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto", width: "100%" }}>
      {/* Top Navigation & Actions */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1.75rem",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <button onClick={onBack} className="btn btn-secondary">
          <ArrowLeft size={16} />
          <span>Back to Dashboard</span>
        </button>

        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          <button
            onClick={() => handleCopy(JSON.stringify(report, null, 2), "full_report")}
            className="btn btn-secondary"
            title="Copy Report JSON"
          >
            {copiedId === "full_report" ? <Check size={16} /> : <Copy size={16} />}
            <span>{copiedId === "full_report" ? "Copied!" : "Copy Report"}</span>
          </button>

          <button
            onClick={handleDownloadPDF}
            disabled={isDownloading}
            className="btn btn-primary"
            style={{
              background: downloadSuccess 
                ? "linear-gradient(135deg, #10b981 0%, #059669 100%)"
                : "linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)",
            }}
            title="Download ATS-Optimized Resume PDF tailored to this Job Description"
          >
            {isDownloading ? (
              <>
                <Loader2 size={16} className="spinner" />
                <span>Generating ATS PDF...</span>
              </>
            ) : downloadSuccess ? (
              <>
                <Check size={16} />
                <span>PDF Downloaded!</span>
              </>
            ) : (
              <>
                <Download size={16} />
                <span>Download ATS Resume (PDF)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Header Match Score & Summary Banner */}
      <div
        className="glass-panel"
        style={{
          padding: "2.25rem",
          marginBottom: "2rem",
          display: "flex",
          alignItems: "center",
          gap: "2.5rem",
          flexWrap: "wrap",
          border: "1px solid rgba(99, 102, 241, 0.3)",
          background: "linear-gradient(145deg, rgba(17, 24, 39, 0.9) 0%, rgba(30, 27, 75, 0.35) 100%)",
        }}
      >
        {/* Score Circle */}
        <div className={`score-circle ${getScoreColorClass(report.matchScore)}`}>
          <span style={{ fontSize: "2.2rem", fontWeight: "800", lineHeight: 1 }}>
            {report.matchScore}%
          </span>
          <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "0.25rem" }}>
            Match Score
          </span>
        </div>

        {/* Summary Text */}
        <div style={{ flex: 1, minWidth: "280px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.5rem" }}>
            <span className="badge badge-success">
              <CheckCircle2 size={12} /> {getScoreLabel(report.matchScore)}
            </span>
            <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
              Generated on {new Date(report.createdAt || Date.now()).toLocaleDateString()}
            </span>
          </div>

          <h2 style={{ fontSize: "1.35rem", marginBottom: "0.5rem" }}>Executive Evaluation</h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", lineHeight: 1.6, marginBottom: "1.25rem" }}>
            {report.summary}
          </p>

          {/* Calibrated Rubric Sub-scores for Absolute Transparency */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
              gap: "0.75rem",
            }}
          >
            <div
              style={{
                background: "rgba(255, 255, 255, 0.04)",
                padding: "0.6rem 0.85rem",
                borderRadius: "8px",
                border: "1px solid rgba(255, 255, 255, 0.08)",
              }}
            >
              <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                Tech Stack
              </div>
              <div style={{ fontSize: "1.1rem", fontWeight: "700", color: "#6366f1", marginTop: "0.15rem" }}>
                {report.techSkillsScore ?? Math.round(report.matchScore * 0.4)}<span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: "normal" }}>/40</span>
              </div>
            </div>

            <div
              style={{
                background: "rgba(255, 255, 255, 0.04)",
                padding: "0.6rem 0.85rem",
                borderRadius: "8px",
                border: "1px solid rgba(255, 255, 255, 0.08)",
              }}
            >
              <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                Experience
              </div>
              <div style={{ fontSize: "1.1rem", fontWeight: "700", color: "#06b6d4", marginTop: "0.15rem" }}>
                {report.experienceScore ?? Math.round(report.matchScore * 0.3)}<span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: "normal" }}>/30</span>
              </div>
            </div>

            <div
              style={{
                background: "rgba(255, 255, 255, 0.04)",
                padding: "0.6rem 0.85rem",
                borderRadius: "8px",
                border: "1px solid rgba(255, 255, 255, 0.08)",
              }}
            >
              <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                Architecture
              </div>
              <div style={{ fontSize: "1.1rem", fontWeight: "700", color: "#ec4899", marginTop: "0.15rem" }}>
                {report.architectureScore ?? Math.round(report.matchScore * 0.2)}<span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: "normal" }}>/20</span>
              </div>
            </div>

            <div
              style={{
                background: "rgba(255, 255, 255, 0.04)",
                padding: "0.6rem 0.85rem",
                borderRadius: "8px",
                border: "1px solid rgba(255, 255, 255, 0.08)",
              }}
            >
              <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                Practices & Tools
              </div>
              <div style={{ fontSize: "1.1rem", fontWeight: "700", color: "#10b981", marginTop: "0.15rem" }}>
                {report.methodologiesScore ?? Math.round(report.matchScore * 0.1)}<span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: "normal" }}>/10</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="report-tabs">
        <button
          className={`report-tab-btn ${activeTab === "overview" ? "active" : ""}`}
          onClick={() => setActiveTab("overview")}
        >
          <AlertTriangle size={17} />
          <span>Skill Gaps ({report.skillGaps?.length || 0})</span>
        </button>

        <button
          className={`report-tab-btn ${activeTab === "keywords" ? "active" : ""}`}
          onClick={() => setActiveTab("keywords")}
        >
          <Target size={17} />
          <span>ATS Keyword Radar</span>
        </button>

        <button
          className={`report-tab-btn ${activeTab === "technical" ? "active" : ""}`}
          onClick={() => setActiveTab("technical")}
        >
          <Code2 size={17} />
          <span>Technical Q&A ({report.technicalQuestions?.length || 0})</span>
        </button>

        <button
          className={`report-tab-btn ${activeTab === "behavioral" ? "active" : ""}`}
          onClick={() => setActiveTab("behavioral")}
        >
          <Users size={17} />
          <span>Behavioral Q&A ({report.behavioralQuestions?.length || 0})</span>
        </button>

        <button
          className={`report-tab-btn ${activeTab === "roadmap" ? "active" : ""}`}
          onClick={() => setActiveTab("roadmap")}
        >
          <Calendar size={17} />
          <span>7-Day Roadmap</span>
        </button>

        <button
          className={`report-tab-btn ${activeTab === "compare" ? "active" : ""}`}
          onClick={() => setActiveTab("compare")}
        >
          <Compass size={17} />
          <span>Role Comparison</span>
        </button>
      </div>

      {/* TAB 0: ATS Keyword Radar (Feature 2) */}
      {activeTab === "keywords" && (
        <KeywordRadarTab report={report} />
      )}

      {/* TAB 5: Multi-Role Target Comparison (Feature 4) */}
      {activeTab === "compare" && (
        <MultiRoleComparisonTab report={report} />
      )}

      {/* TAB 1: Skill Gaps */}
      {activeTab === "overview" && (
        <div>
          <div style={{ marginBottom: "1.5rem" }}>
            <h3 style={{ fontSize: "1.2rem", marginBottom: "0.3rem" }}>Identified Skill Gaps & Recommendations</h3>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
              Focus your preparation on these key areas to maximize interview conversion.
            </p>
          </div>

          <div style={{ display: "grid", gap: "1rem" }}>
            {report.skillGaps?.map((gap, idx) => (
              <div
                key={idx}
                className="glass-panel"
                style={{
                  padding: "1.4rem 1.6rem",
                  borderLeft: `4px solid ${
                    gap.severity === "high"
                      ? "var(--accent-rose)"
                      : gap.severity === "medium"
                      ? "var(--accent-amber)"
                      : "var(--accent-emerald)"
                  }`,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.6rem" }}>
                  <h4 style={{ fontSize: "1.1rem" }}>{gap.skill}</h4>
                  <span className={`badge severity-${gap.severity}`}>
                    {gap.severity.toUpperCase()} PRIORITY
                  </span>
                </div>
                <div style={{ display: "flex", gap: "0.6rem", alignItems: "flex-start" }}>
                  <Lightbulb size={18} style={{ color: "var(--accent-amber)", flexShrink: 0, marginTop: "0.15rem" }} />
                  <p style={{ color: "var(--text-secondary)", fontSize: "0.92rem", lineHeight: 1.5 }}>
                    {gap.recommendation}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: Technical Questions */}
      {activeTab === "technical" && (
        <div>
          <div style={{ marginBottom: "1.5rem" }}>
            <h3 style={{ fontSize: "1.2rem", marginBottom: "0.3rem" }}>Targeted Technical Questions</h3>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
              Click on each question to view the interviewer's intention and model answer.
            </p>
          </div>

          <div>
            {report.technicalQuestions?.map((q, idx) => {
              const isExpanded = expandedQuestions[`tech-${idx}`];
              return (
                <div key={idx} className="accordion-item">
                  <div className="accordion-header" onClick={() => toggleQuestion(`tech-${idx}`)}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flex: 1 }}>
                      <span
                        style={{
                          width: "28px",
                          height: "28px",
                          borderRadius: "8px",
                          background: "rgba(99, 102, 241, 0.2)",
                          color: "var(--accent-primary)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: "700",
                          fontSize: "0.85rem",
                          flexShrink: 0,
                        }}
                      >
                        Q{idx + 1}
                      </span>
                      <span style={{ fontWeight: 600, fontSize: "1rem", color: "var(--text-primary)" }}>
                        {q.question}
                      </span>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                      <span className={`badge severity-${q.difficulty === "hard" ? "high" : q.difficulty === "medium" ? "medium" : "low"}`}>
                        {q.difficulty}
                      </span>
                      {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="accordion-content">
                      {/* Interviewer Intention */}
                      <div
                        style={{
                          padding: "1rem 1.25rem",
                          background: "rgba(99, 102, 241, 0.08)",
                          border: "1px solid rgba(99, 102, 241, 0.2)",
                          borderRadius: "var(--radius-sm)",
                          marginBottom: "1.25rem",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.35rem" }}>
                          <Lightbulb size={16} style={{ color: "var(--accent-cyan)" }} />
                          <span style={{ fontWeight: 700, fontSize: "0.85rem", color: "var(--accent-cyan)", textTransform: "uppercase" }}>
                            What the Interviewer is Assessing
                          </span>
                        </div>
                        <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                          {q.intention}
                        </p>
                      </div>

                      {/* Model Answer */}
                      <div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                            <BookOpen size={16} style={{ color: "var(--accent-emerald)" }} />
                            <span style={{ fontWeight: 700, fontSize: "0.85rem", color: "var(--accent-emerald)", textTransform: "uppercase" }}>
                              Recommended Model Answer
                            </span>
                          </div>
                          <button
                            onClick={() => handleCopy(q.expectedAnswer, `tech-ans-${idx}`)}
                            className="btn btn-ghost"
                            style={{ padding: "0.2rem 0.5rem", fontSize: "0.75rem", background: "transparent", border: "none", color: "var(--text-muted)", cursor: "pointer" }}
                          >
                            {copiedId === `tech-ans-${idx}` ? <Check size={14} /> : <Copy size={14} />}
                          </button>
                        </div>

                        <div
                          style={{
                            padding: "1.1rem 1.25rem",
                            background: "rgba(15, 23, 42, 0.8)",
                            border: "1px solid var(--border-subtle)",
                            borderRadius: "var(--radius-sm)",
                            fontSize: "0.92rem",
                            color: "#e2e8f0",
                            lineHeight: 1.6,
                            whiteSpace: "pre-line",
                          }}
                        >
                          {q.expectedAnswer}
                        </div>
                      </div>

                      {/* Interactive Answer Practice Workshop (Feature 1) */}
                      <div style={{ marginTop: "1.25rem" }}>
                        <button
                          type="button"
                          onClick={() => togglePractice(`tech-${idx}`)}
                          className="btn btn-secondary"
                          style={{
                            fontSize: "0.84rem",
                            padding: "0.45rem 0.9rem",
                            border: practiceOpen[`tech-${idx}`]
                              ? "1px solid var(--primary)"
                              : "1px solid var(--border-subtle)",
                            background: practiceOpen[`tech-${idx}`]
                              ? "rgba(99, 102, 241, 0.15)"
                              : "rgba(255, 255, 255, 0.04)",
                            color: practiceOpen[`tech-${idx}`]
                              ? "#a5b4fc"
                              : "var(--text-primary)",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.45rem",
                          }}
                        >
                          <Mic
                            size={15}
                            color={
                              practiceOpen[`tech-${idx}`]
                                ? "#818cf8"
                                : "var(--accent-primary)"
                            }
                          />
                          <span>
                            {practiceOpen[`tech-${idx}`]
                              ? "Close Practice Workshop"
                              : "🎙️ Practice Answering (Voice or Text)"}
                          </span>
                        </button>

                        {practiceOpen[`tech-${idx}`] && (
                          <AnswerPracticeWorkshop
                            question={q.question}
                            intention={q.intention}
                            expectedAnswer={q.expectedAnswer}
                            questionType="technical"
                          />
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: Behavioral Questions */}
      {activeTab === "behavioral" && (
        <div>
          <div style={{ marginBottom: "1.5rem" }}>
            <h3 style={{ fontSize: "1.2rem", marginBottom: "0.3rem" }}>Behavioral & Situational Questions</h3>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
              Frameworks and model responses structured around the STAR method.
            </p>
          </div>

          <div>
            {report.behavioralQuestions?.map((q, idx) => {
              const isExpanded = expandedQuestions[`beh-${idx}`];
              return (
                <div key={idx} className="accordion-item">
                  <div className="accordion-header" onClick={() => toggleQuestion(`beh-${idx}`)}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flex: 1 }}>
                      <span
                        style={{
                          width: "28px",
                          height: "28px",
                          borderRadius: "8px",
                          background: "rgba(6, 182, 212, 0.2)",
                          color: "var(--accent-cyan)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: "700",
                          fontSize: "0.85rem",
                          flexShrink: 0,
                        }}
                      >
                        B{idx + 1}
                      </span>
                      <span style={{ fontWeight: 600, fontSize: "1rem", color: "var(--text-primary)" }}>
                        {q.question}
                      </span>
                    </div>
                    {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </div>

                  {isExpanded && (
                    <div className="accordion-content">
                      {/* Interviewer Intention */}
                      <div
                        style={{
                          padding: "1rem 1.25rem",
                          background: "rgba(6, 182, 212, 0.08)",
                          border: "1px solid rgba(6, 182, 212, 0.2)",
                          borderRadius: "var(--radius-sm)",
                          marginBottom: "1.25rem",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.35rem" }}>
                          <Lightbulb size={16} style={{ color: "var(--accent-cyan)" }} />
                          <span style={{ fontWeight: 700, fontSize: "0.85rem", color: "var(--accent-cyan)", textTransform: "uppercase" }}>
                            Interviewer Intention
                          </span>
                        </div>
                        <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                          {q.intention}
                        </p>
                      </div>

                      {/* STAR Answer Guide */}
                      <div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                            <BookOpen size={16} style={{ color: "var(--accent-emerald)" }} />
                            <span style={{ fontWeight: 700, fontSize: "0.85rem", color: "var(--accent-emerald)", textTransform: "uppercase" }}>
                              STAR Framework Guide
                            </span>
                          </div>
                        </div>

                        <div
                          style={{
                            padding: "1.1rem 1.25rem",
                            background: "rgba(15, 23, 42, 0.8)",
                            border: "1px solid var(--border-subtle)",
                            borderRadius: "var(--radius-sm)",
                            fontSize: "0.92rem",
                            color: "#e2e8f0",
                            lineHeight: 1.6,
                            whiteSpace: "pre-line",
                          }}
                        >
                          {q.expectedAnswer}
                        </div>
                      </div>

                      {/* Interactive Answer Practice Workshop (Feature 1) */}
                      <div style={{ marginTop: "1.25rem" }}>
                        <button
                          type="button"
                          onClick={() => togglePractice(`beh-${idx}`)}
                          className="btn btn-secondary"
                          style={{
                            fontSize: "0.84rem",
                            padding: "0.45rem 0.9rem",
                            border: practiceOpen[`beh-${idx}`]
                              ? "1px solid var(--accent-cyan)"
                              : "1px solid var(--border-subtle)",
                            background: practiceOpen[`beh-${idx}`]
                              ? "rgba(6, 182, 212, 0.15)"
                              : "rgba(255, 255, 255, 0.04)",
                            color: practiceOpen[`beh-${idx}`]
                              ? "#67e8f9"
                              : "var(--text-primary)",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.45rem",
                          }}
                        >
                          <Mic
                            size={15}
                            color={
                              practiceOpen[`beh-${idx}`]
                                ? "#22d3ee"
                                : "var(--accent-cyan)"
                            }
                          />
                          <span>
                            {practiceOpen[`beh-${idx}`]
                              ? "Close Practice Workshop"
                              : "🎙️ Practice Answering (STAR Method)"}
                          </span>
                        </button>

                        {practiceOpen[`beh-${idx}`] && (
                          <AnswerPracticeWorkshop
                            question={q.question}
                            intention={q.intention}
                            expectedAnswer={q.expectedAnswer}
                            questionType="behavioral"
                          />
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 4: 7-Day Roadmap (Feature 3) */}
      {activeTab === "roadmap" && (
        <RoadmapTrackerTab report={report} />
      )}
    </div>
  );
};

export default InterviewReport;
