import React, { useState, useRef } from "react";
import { useInterview } from "../hooks/useInterview";
import {
  UploadCloud,
  FileText,
  X,
  Sparkles,
  AlertCircle,
  BrainCircuit,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import "../../../styles/interview.css";

const InterviewForm = ({ onGenerated }) => {
  const [jobDescription, setJobDescription] = useState("");
  const [selfDescription, setSelfDescription] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [validationError, setValidationError] = useState("");

  const fileInputRef = useRef(null);
  const { generateReport, isGenerating, generationStep, interviewError, clearInterviewError } = useInterview();

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === "application/pdf" || file.name.endsWith(".pdf")) {
        setResumeFile(file);
        setValidationError("");
      } else {
        setValidationError("Only PDF resumes are supported.");
      }
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type === "application/pdf" || file.name.endsWith(".pdf")) {
        setResumeFile(file);
        setValidationError("");
      } else {
        setValidationError("Only PDF resumes are supported.");
      }
    }
  };

  const removeFile = () => {
    setResumeFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError("");
    clearInterviewError();

    if (!jobDescription.trim() || jobDescription.trim().length < 20) {
      setValidationError("Please enter a detailed Job Description (at least 20 characters).");
      return;
    }

    const formData = new FormData();
    formData.append("jobDescription", jobDescription.trim());
    if (selfDescription.trim()) {
      formData.append("selfDescription", selfDescription.trim());
    }
    if (resumeFile) {
      formData.append("resume", resumeFile);
    }

    const res = await generateReport(formData);
    if (res.success && onGenerated) {
      onGenerated(res.report);
    }
  };

  const displayError = validationError || interviewError;

  return (
    <div className="glass-panel" style={{ padding: "2.25rem", position: "relative" }}>
      {/* Title */}
      <div style={{ marginBottom: "1.75rem" }}>
        <h2 style={{ fontSize: "1.5rem", marginBottom: "0.4rem", display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <Sparkles className="gradient-text" size={24} />
          <span>Prepare for Your Target Role</span>
        </h2>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>
          Paste the job description and upload your resume to generate tailored interview questions, skill gap analysis, and a 7-day study plan.
        </p>
      </div>

      {/* Error Banner */}
      {displayError && (
        <div className="auth-alert auth-alert-error" style={{ marginBottom: "1.5rem" }}>
          <AlertCircle size={18} />
          <span>{displayError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Job Description */}
        <div className="form-group">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <label className="form-label" htmlFor="jobDescription">
              Job Description (JD) <span style={{ color: "var(--accent-rose)" }}>*</span>
            </label>
            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
              {jobDescription.length} chars
            </span>
          </div>
          <textarea
            id="jobDescription"
            rows={6}
            className="input-control"
            placeholder="Paste the complete job description, requirements, and responsibilities here..."
            value={jobDescription}
            onChange={(e) => {
              setJobDescription(e.target.value);
              setValidationError("");
            }}
            required
            style={{ resize: "vertical", fontFamily: "inherit" }}
          />
        </div>

        {/* PDF Resume Upload Dropzone */}
        <div className="form-group">
          <label className="form-label">
            Candidate Resume (PDF) <span style={{ color: "var(--text-muted)", fontWeight: "normal" }}>(Optional but recommended)</span>
          </label>

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,application/pdf"
            onChange={handleFileChange}
            style={{ display: "none" }}
            id="resume-upload-input"
          />

          {!resumeFile ? (
            <div
              className={`file-dropzone ${dragActive ? "drag-active" : ""}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <UploadCloud size={32} style={{ color: "var(--accent-primary)" }} />
              <div>
                <p style={{ fontWeight: 600, color: "var(--text-primary)", fontSize: "0.95rem" }}>
                  Click to browse or drag and drop your Resume PDF
                </p>
                <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                  Supports PDF up to 10MB
                </p>
              </div>
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0.85rem 1.25rem",
                background: "rgba(99, 102, 241, 0.1)",
                border: "1px solid rgba(99, 102, 241, 0.35)",
                borderRadius: "var(--radius-sm)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <FileText size={20} style={{ color: "var(--accent-primary)" }} />
                <div>
                  <p style={{ fontSize: "0.9rem", fontWeight: 600 }}>{resumeFile.name}</p>
                  <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                    {(resumeFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={removeFile}
                className="btn btn-ghost"
                style={{
                  background: "transparent",
                  border: "none",
                  color: "var(--text-muted)",
                  cursor: "pointer",
                  padding: "0.25rem",
                }}
                title="Remove file"
              >
                <X size={18} />
              </button>
            </div>
          )}
        </div>

        {/* Self Description / Extra Experience */}
        <div className="form-group">
          <label className="form-label" htmlFor="selfDescription">
            Additional Candidate Experience & Strengths <span style={{ color: "var(--text-muted)", fontWeight: "normal" }}>(Optional)</span>
          </label>
          <textarea
            id="selfDescription"
            rows={3}
            className="input-control"
            placeholder="e.g. 4 years in MERN stack, built high-scale microservices, led team of 3 engineers..."
            value={selfDescription}
            onChange={(e) => setSelfDescription(e.target.value)}
            style={{ resize: "vertical", fontFamily: "inherit" }}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="btn btn-primary"
          style={{ width: "100%", padding: "0.95rem", fontSize: "1rem", marginTop: "0.5rem" }}
          disabled={isGenerating}
        >
          <Sparkles size={18} />
          <span>Generate Role Preparation Report</span>
          <ArrowRight size={18} />
        </button>
      </form>

      {/* Generation Progress Modal */}
      {isGenerating && (
        <div className="generation-modal-backdrop">
          <div className="generation-modal-card">
            <div className="pulsing-orb">
              <BrainCircuit size={40} />
            </div>
            <h3 style={{ fontSize: "1.4rem", marginBottom: "0.75rem" }}>
              Rolewise AI is Analyzing Your Profile
            </h3>
            <p style={{ color: "var(--accent-cyan)", fontSize: "0.95rem", minHeight: "2.5rem", fontWeight: 500 }}>
              {generationStep || "Processing with Gemini 2.5 Flash..."}
            </p>
            <div style={{ display: "flex", justifyContent: "center", marginTop: "1.5rem" }}>
              <div className="spinner" style={{ width: "2rem", height: "2rem", borderWidth: "3px" }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InterviewForm;
