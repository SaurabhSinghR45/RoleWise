import React, { useEffect } from "react";
import Navbar from "../components/Navbar";
import { useAuth } from "../features/auth/hooks/useAuth";
import { useInterview } from "../features/interview/hooks/useInterview";
import InterviewForm from "../features/interview/components/InterviewForm";
import InterviewReport from "../features/interview/pages/InterviewReport";
import {
  FileText,
  Clock,
  ChevronRight,
  Sparkles,
  Trash2,
  CheckCircle2,
} from "lucide-react";

const Home = () => {
  const { user } = useAuth();
  const {
    reports,
    activeReport,
    isLoadingReports,
    fetchUserReports,
    fetchReportById,
    deleteReport,
    setActiveReport,
    clearActiveReport,
  } = useInterview();

  useEffect(() => {
    fetchUserReports();
  }, [fetchUserReports]);

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />

      <main
        style={{
          flex: 1,
          padding: "2.5rem 1.5rem 4rem 1.5rem",
          maxWidth: "1200px",
          margin: "0 auto",
          width: "100%",
        }}
      >
        {activeReport ? (
          <InterviewReport report={activeReport} onBack={clearActiveReport} />
        ) : (
          <div style={{ display: "grid", gap: "2.5rem" }}>
            {/* Form Section */}
            <InterviewForm onGenerated={setActiveReport} />

            {/* Past Reports History */}
            <div className="glass-panel" style={{ padding: "2rem" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "1.25rem",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                  <Clock size={20} style={{ color: "var(--accent-cyan)" }} />
                  <h3 style={{ fontSize: "1.25rem" }}>Your Previous Interview Reports</h3>
                </div>
                <span className="badge">
                  {reports.length} {reports.length === 1 ? "Report" : "Reports"} Saved
                </span>
              </div>

              {isLoadingReports && reports.length === 0 ? (
                <div style={{ padding: "2rem", textAlign: "center", color: "var(--text-secondary)" }}>
                  <div className="spinner" style={{ margin: "0 auto 0.75rem auto" }} />
                  <p>Loading previous reports...</p>
                </div>
              ) : reports.length === 0 ? (
                <div
                  style={{
                    padding: "2.5rem 1.5rem",
                    textAlign: "center",
                    background: "var(--bg-input)",
                    borderRadius: "var(--radius-sm)",
                    border: "1px dashed var(--border-subtle)",
                  }}
                >
                  <FileText size={32} style={{ color: "var(--text-muted)", margin: "0 auto 0.75rem auto" }} />
                  <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>
                    No interview reports generated yet. Fill out the form above to get your first tailored preparation plan!
                  </p>
                </div>
              ) : (
                <div style={{ display: "grid", gap: "0.85rem" }}>
                  {reports.map((r) => (
                    <div
                      key={r._id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "1rem 1.25rem",
                        background: "var(--bg-input)",
                        border: "1px solid var(--border-subtle)",
                        borderRadius: "var(--radius-sm)",
                        boxShadow: "var(--shadow-sm)",
                        transition: "all 0.2s ease",
                      }}
                    >
                      <div
                        style={{ flex: 1, cursor: "pointer", marginRight: "1rem" }}
                        onClick={() => fetchReportById(r._id)}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.3rem" }}>
                          <span
                            className={`badge ${
                              r.matchScore >= 75
                                ? "badge-success"
                                : r.matchScore >= 50
                                ? "severity-medium"
                                : "severity-high"
                            }`}
                          >
                            {r.matchScore}% Match
                          </span>
                          <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                            {new Date(r.createdAt).toLocaleDateString(undefined, {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                        <p
                          style={{
                            fontSize: "0.92rem",
                            color: "var(--text-primary)",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            maxWidth: "600px",
                          }}
                        >
                          {r.jobDescription.substring(0, 100)}...
                        </p>
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <button
                          onClick={() => fetchReportById(r._id)}
                          className="btn btn-secondary"
                          style={{ padding: "0.4rem 0.85rem", fontSize: "0.85rem" }}
                        >
                          <span>View</span>
                          <ChevronRight size={14} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (window.confirm("Are you sure you want to delete this report?")) {
                              deleteReport(r._id);
                            }
                          }}
                          className="btn btn-ghost"
                          style={{
                            background: "transparent",
                            border: "none",
                            color: "var(--text-muted)",
                            cursor: "pointer",
                            padding: "0.4rem",
                          }}
                          title="Delete report"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;
