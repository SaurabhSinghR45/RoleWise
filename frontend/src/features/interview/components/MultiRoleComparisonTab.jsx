import React, { useState, useEffect } from "react";
import {
  Trophy,
  Sparkles,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Lightbulb,
  Plus,
  X,
  RotateCcw,
  Loader2,
  Layers,
  Compass,
  ArrowUpRight,
} from "lucide-react";
import { compareRolesApi } from "../services/interview.api";

const PRESET_ROLES = [
  "AI Full Stack Developer (Python + React)",
  "Backend Engineer (Python / FastAPI / Microservices)",
  "Frontend Engineer (React / TypeScript)",
  "GenAI / Machine Learning Systems Engineer",
  "DevOps & Cloud Platform Engineer",
  "Data Engineer & Analytics Architect",
];

const MultiRoleComparisonTab = ({ report }) => {
  const [selectedRoles, setSelectedRoles] = useState([
    "AI Full Stack Developer (Python + React)",
    "Backend Engineer (Python / FastAPI / Microservices)",
    "Frontend Engineer (React / TypeScript)",
    "GenAI / Machine Learning Systems Engineer",
  ]);

  const [customRoleInput, setCustomRoleInput] = useState("");
  const [comparisonData, setComparisonData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch comparison on mount
  useEffect(() => {
    fetchComparison(selectedRoles);
  }, []);

  const fetchComparison = async (rolesToCompare) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await compareRolesApi({
        reportId: report?._id,
        resumeText: report?.resumeText || "",
        selfDescription: report?.selfDescription || "",
        targetRoles: rolesToCompare,
      });

      if (res.success && res.comparison) {
        setComparisonData(res.comparison);
      }
    } catch (err) {
      console.error("Failed to compare target roles:", err);
      setError("Unable to generate multi-role comparison. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCustomRole = (e) => {
    e.preventDefault();
    const trimmed = customRoleInput.trim();
    if (trimmed && !selectedRoles.includes(trimmed)) {
      const updated = [...selectedRoles, trimmed];
      setSelectedRoles(updated);
      setCustomRoleInput("");
      fetchComparison(updated);
    }
  };

  const handleTogglePreset = (role) => {
    let updated;
    if (selectedRoles.includes(role)) {
      if (selectedRoles.length <= 2) {
        alert("Please keep at least 2 roles for comparison.");
        return;
      }
      updated = selectedRoles.filter((r) => r !== role);
    } else {
      if (selectedRoles.length >= 6) {
        alert("You can compare up to 6 target roles at once.");
        return;
      }
      updated = [...selectedRoles, role];
    }
    setSelectedRoles(updated);
    fetchComparison(updated);
  };

  const handleRemoveRole = (roleToRemove) => {
    if (selectedRoles.length <= 2) {
      alert("Please keep at least 2 roles for comparison.");
      return;
    }
    const updated = selectedRoles.filter((r) => r !== roleToRemove);
    setSelectedRoles(updated);
    fetchComparison(updated);
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "#10b981"; // Emerald
    if (score >= 70) return "#06b6d4"; // Cyan
    if (score >= 50) return "#f59e0b"; // Amber
    return "#f43f5e"; // Rose
  };

  const getVerdictBadge = (verdict, score) => {
    if (score >= 80) {
      return <span className="badge badge-success">🏆 {verdict || "Strong Fit"}</span>;
    }
    if (score >= 70) {
      return <span className="badge badge-primary">⚡ {verdict || "Good Fit"}</span>;
    }
    if (score >= 50) {
      return <span className="badge badge-warning">📌 {verdict || "Moderate Fit"}</span>;
    }
    return <span className="badge badge-danger">⚠️ {verdict || "Low Fit"}</span>;
  };

  return (
    <div className="multi-role-container">
      {/* Hero Best Fit Recommendation Banner */}
      {comparisonData?.recommendedBestRole && (
        <div className="best-fit-banner glass-panel">
          <div className="best-fit-header">
            <div className="crown-icon-wrap">
              <Trophy size={28} color="#fbbf24" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
                <Sparkles size={16} color="#fbbf24" />
                <span className="best-fit-eyebrow">
                  Top Recommended Career Track
                </span>
              </div>
              <h3 className="best-fit-role-title">
                {comparisonData.recommendedBestRole}
              </h3>
              <p className="best-fit-reasoning">
                {comparisonData.bestFitReasoning}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Role Customizer & Track Selector Bar */}
      <div className="role-customizer-card glass-panel">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem", flexWrap: "wrap", gap: "0.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Compass size={17} className="text-primary" />
            <h4 style={{ fontSize: "0.95rem", color: "#f8fafc", fontWeight: "700" }}>
              Target Role Benchmarks ({selectedRoles.length} Selected)
            </h4>
          </div>

          <button
            onClick={() => fetchComparison(selectedRoles)}
            disabled={isLoading}
            className="btn-reanalyze-roles"
          >
            {isLoading ? (
              <>
                <Loader2 size={14} className="spin" />
                <span>Benchmarking...</span>
              </>
            ) : (
              <>
                <RotateCcw size={14} />
                <span>Re-Analyze All Roles</span>
              </>
            )}
          </button>
        </div>

        {/* Selected Role Pills */}
        <div className="selected-roles-wrap">
          {selectedRoles.map((role) => (
            <span key={role} className="role-tag-pill active">
              <span>{role}</span>
              <button
                type="button"
                onClick={() => handleRemoveRole(role)}
                className="btn-remove-role-tag"
                title="Remove role"
              >
                ×
              </button>
            </span>
          ))}
        </div>

        {/* Preset & Custom Add Row */}
        <div className="presets-and-input-row">
          <div className="presets-wrap">
            <span style={{ fontSize: "0.76rem", color: "var(--text-muted)", marginRight: "0.25rem" }}>
              Quick Presets:
            </span>
            {PRESET_ROLES.map((preset) => {
              const isSelected = selectedRoles.includes(preset);
              return (
                <button
                  key={preset}
                  type="button"
                  onClick={() => handleTogglePreset(preset)}
                  className={`preset-pill-btn ${isSelected ? "selected" : ""}`}
                >
                  {isSelected ? "✓" : "+"} {preset.split(" (")[0]}
                </button>
              );
            })}
          </div>

          <form onSubmit={handleAddCustomRole} className="custom-role-form">
            <input
              type="text"
              placeholder="Add custom role (e.g. SRE, Solutions Architect)..."
              value={customRoleInput}
              onChange={(e) => setCustomRoleInput(e.target.value)}
              className="custom-role-input"
            />
            <button type="submit" className="btn-add-custom-role">
              <Plus size={14} />
              <span>Add</span>
            </button>
          </form>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="role-error-card glass-panel">
          <AlertCircle size={18} color="#f43f5e" />
          <span>{error}</span>
        </div>
      )}

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="role-loading-box glass-panel">
          <Loader2 size={32} className="spin text-primary" style={{ marginBottom: "0.75rem" }} />
          <h4 style={{ color: "#f8fafc", fontSize: "1.1rem" }}>
            Rolewise AI is Benchmarking Your Profile Across All Target Tracks...
          </h4>
          <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
            Evaluating project complexity, framework competencies, and ATS clearance probability for each role.
          </p>
        </div>
      )}

      {/* Comparative Roles List */}
      {!isLoading && comparisonData?.roleComparisons && (
        <div className="roles-comparison-grid">
          {comparisonData.roleComparisons.map((item, idx) => {
            const isTopRecommended = item.roleTitle === comparisonData.recommendedBestRole;
            const score = item.fitScore || 0;
            const barColor = getScoreColor(score);

            return (
              <div
                key={idx}
                className={`role-comparison-card glass-panel ${isTopRecommended ? "card-top-recommended" : ""}`}
              >
                {/* Card Header */}
                <div className="role-card-header">
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
                      {isTopRecommended && (
                        <span className="badge-best-fit-tag">
                          ★ #1 BEST FIT
                        </span>
                      )}
                      <h4 className="role-card-title">{item.roleTitle}</h4>
                    </div>

                    {/* Fit Meter */}
                    <div className="role-meter-wrap">
                      <div className="role-meter-bar-bg">
                        <div
                          className="role-meter-bar-fill"
                          style={{
                            width: `${score}%`,
                            backgroundColor: barColor,
                          }}
                        />
                      </div>
                      <span className="role-meter-pct" style={{ color: barColor }}>
                        {score}% Fit
                      </span>
                    </div>
                  </div>

                  <div>{getVerdictBadge(item.verdict, score)}</div>
                </div>

                {/* Strengths & Gaps 2-Column Split */}
                <div className="role-card-details-grid">
                  {/* Strengths */}
                  <div className="role-detail-col">
                    <div className="col-label text-success">
                      <CheckCircle2 size={14} />
                      <span>Key Match Assets</span>
                    </div>
                    <ul className="detail-list">
                      {(item.topStrengths || []).map((strength, sIdx) => (
                        <li key={sIdx} className="strength-bullet">
                          {strength}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Missing Gaps */}
                  <div className="role-detail-col">
                    <div className="col-label text-warning">
                      <AlertCircle size={14} />
                      <span>Requirements to Address</span>
                    </div>
                    <ul className="detail-list">
                      {(item.keyGaps || []).map((gap, gIdx) => (
                        <li key={gIdx} className="gap-bullet">
                          {gap}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Tactical Application Advice Box */}
                {item.applicationAdvice && (
                  <div className="role-advice-box">
                    <Lightbulb size={16} color="#fbbf24" style={{ flexShrink: 0, marginTop: "2px" }} />
                    <p style={{ fontSize: "0.82rem", color: "#cbd5e1", lineHeight: 1.45 }}>
                      <strong style={{ color: "#fbbf24" }}>Resume Strategy: </strong>
                      {item.applicationAdvice}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MultiRoleComparisonTab;
