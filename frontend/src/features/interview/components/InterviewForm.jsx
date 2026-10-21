import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
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
  Check,
  PenTool,
  Layers,
  ExternalLink,
  Eye,
} from "lucide-react";
import FullResumePreviewModal from "../../../components/FullResumePreviewModal";
import "../../../styles/interview.css";

const TEMPLATE_OPTIONS = [
  {
    id: "nitw",
    name: "College Campus (NIT Warangal)",
    badge: "Official Campus Standard",
    badgeColor: "#1d4ed8",
    desc: "Academic placement standard with official NIT Warangal seal, roll number, and structured project sections.",
  },
  {
    id: "pure_ats",
    name: "Pure ATS (High Parse)",
    badge: "100% ATS Benchmark",
    badgeColor: "#059669",
    desc: "Minimalist, zero-friction single-column format engineered for enterprise ATS parsers.",
  },
  {
    id: "prime_ats",
    name: "Prime ATS (Modern Corporate)",
    badge: "Corporate & Tech",
    badgeColor: "#2563eb",
    desc: "Modern corporate layout with blue accent rules and 4-column structured skills grid.",
  },
  {
    id: "classic",
    name: "Classic Professional",
    badge: "Robust Career Stack",
    badgeColor: "#7c3aed",
    desc: "Categorized technical stacks, tooling proficiencies, and detailed project impact.",
  },
  {
    id: "traditional",
    name: "Traditional Executive",
    badge: "Formal & Corporate",
    badgeColor: "#475569",
    desc: "Formal serif typography with diamond bullets, profile header, and executive structure.",
  },
];

const InterviewForm = ({ onGenerated }) => {
  const [jobDescription, setJobDescription] = useState("");
  const [jdFile, setJdFile] = useState(null);
  const [jdMode, setJdMode] = useState("text"); // "text" | "file"
  const [selectedTemplate, setSelectedTemplate] = useState(() => {
    return localStorage.getItem("rolewise_selected_template") || "nitw";
  });
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [previewTemplateId, setPreviewTemplateId] = useState("nitw");
  const [jdDragActive, setJdDragActive] = useState(false);
  const [selfDescription, setSelfDescription] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [validationError, setValidationError] = useState("");

  const fileInputRef = useRef(null);
  const jdFileInputRef = useRef(null);
  const { generateReport, isGenerating, generationStep, interviewError, clearInterviewError } = useInterview();

  // Resume Drag & Drop handlers
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
      const valid =
        file.type === "application/pdf" ||
        file.name.toLowerCase().endsWith(".pdf") ||
        file.name.toLowerCase().endsWith(".docx") ||
        file.name.toLowerCase().endsWith(".doc") ||
        file.name.toLowerCase().endsWith(".txt");
      if (valid) {
        setResumeFile(file);
        setValidationError("");
      } else {
        setValidationError("Please upload a valid resume file (PDF, DOCX, or TXT).");
      }
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setResumeFile(file);
      setValidationError("");
    }
  };

  const removeFile = () => {
    setResumeFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Job Description Drag & Drop handlers
  const handleJdDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setJdDragActive(true);
    } else if (e.type === "dragleave") {
      setJdDragActive(false);
    }
  };

  const processJdFile = (file) => {
    const ext = file.name.toLowerCase().substring(file.name.lastIndexOf("."));
    const allowed = [".pdf", ".docx", ".doc", ".txt"];
    if (!allowed.includes(ext) && !file.type.includes("pdf") && !file.type.includes("text")) {
      setValidationError("Only PDF (.pdf), Word (.doc, .docx), and Text (.txt) files are supported for JD.");
      return;
    }

    setJdFile(file);
    setValidationError("");

    // If text file, optionally read preview into jobDescription
    if (ext === ".txt" || file.type === "text/plain") {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result && typeof event.target.result === "string") {
          setJobDescription(event.target.result);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleJdDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setJdDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processJdFile(e.dataTransfer.files[0]);
    }
  };

  const handleJdFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      processJdFile(e.target.files[0]);
    }
  };

  const removeJdFile = () => {
    setJdFile(null);
    if (jdFileInputRef.current) {
      jdFileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError("");
    clearInterviewError();

    const hasText = jobDescription.trim().length >= 20;
    const hasFile = Boolean(jdFile);

    if (!hasText && !hasFile) {
      setValidationError("Please enter a detailed Job Description (at least 20 characters) or upload a JD document (.pdf, .docx, .doc, .txt).");
      return;
    }

    const formData = new FormData();
    if (jobDescription.trim()) {
      formData.append("jobDescription", jobDescription.trim());
    }
    if (jdFile) {
      formData.append("jdFile", jdFile);
    }
    if (selfDescription.trim()) {
      formData.append("selfDescription", selfDescription.trim());
    }
    if (resumeFile) {
      formData.append("resume", resumeFile);
    }
    formData.append("selectedTemplate", selectedTemplate);

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
          Provide the job description (type it or upload a PDF/Word document) and upload your resume to generate tailored interview questions, ATS match score, and a structured study plan.
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
        {/* Job Description (Dual Input: Write / Paste OR Upload PDF/DOC) */}
        <div className="form-group">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.6rem", flexWrap: "wrap", gap: "0.5rem" }}>
            <label className="form-label" style={{ margin: 0 }}>
              Job Description (JD) <span style={{ color: "var(--accent-rose)" }}>*</span>
            </label>

            {/* Input Mode Selector Tabs (Clean Lucide Icons, No Emojis) */}
            <div
              style={{
                display: "inline-flex",
                background: "var(--bg-secondary)",
                borderRadius: "var(--radius-sm)",
                padding: "3px",
                border: "1px solid var(--border-subtle)",
                fontSize: "0.8rem",
              }}
            >
              <button
                type="button"
                onClick={() => setJdMode("text")}
                style={{
                  padding: "4px 12px",
                  borderRadius: "var(--radius-sm)",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: 600,
                  fontSize: "0.8rem",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "5px",
                  background: jdMode === "text" ? "var(--accent-primary)" : "transparent",
                  color: jdMode === "text" ? "#ffffff" : "var(--text-secondary)",
                  transition: "all 0.2s ease",
                }}
              >
                <PenTool size={13} />
                <span>Text Input</span>
              </button>
              <button
                type="button"
                onClick={() => setJdMode("file")}
                style={{
                  padding: "4px 12px",
                  borderRadius: "var(--radius-sm)",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: 600,
                  fontSize: "0.8rem",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "5px",
                  background: jdMode === "file" ? "var(--accent-primary)" : "transparent",
                  color: jdMode === "file" ? "#ffffff" : "var(--text-secondary)",
                  transition: "all 0.2s ease",
                }}
              >
                <UploadCloud size={13} />
                <span>Upload Document</span>
              </button>
            </div>
          </div>

          {/* Mode 1: Direct Text Area */}
          {jdMode === "text" ? (
            <div>
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
                style={{ resize: "vertical", fontFamily: "inherit" }}
              />
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.4rem", fontSize: "0.75rem", color: "var(--text-muted)" }}>
                <span>{jobDescription.length} characters</span>
                {jdFile && (
                  <span style={{ color: "var(--accent-emerald)", fontWeight: 500, display: "inline-flex", alignItems: "center", gap: "4px" }}>
                    <CheckCircle2 size={13} />
                    <span>Attached: {jdFile.name}</span>
                  </span>
                )}
              </div>
            </div>
          ) : (
            /* Mode 2: JD File Upload Dropzone */
            <div>
              <input
                ref={jdFileInputRef}
                type="file"
                accept=".pdf,.doc,.docx,.txt,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
                onChange={handleJdFileChange}
                style={{ display: "none" }}
                id="jd-file-input"
              />

              {!jdFile ? (
                <div
                  className={`file-dropzone ${jdDragActive ? "drag-active" : ""}`}
                  onDragEnter={handleJdDrag}
                  onDragLeave={handleJdDrag}
                  onDragOver={handleJdDrag}
                  onDrop={handleJdDrop}
                  onClick={() => jdFileInputRef.current?.click()}
                  style={{
                    padding: "1.75rem 1rem",
                    border: "2px dashed var(--border-subtle)",
                    borderRadius: "var(--radius-sm)",
                    textAlign: "center",
                    cursor: "pointer",
                    background: jdDragActive ? "rgba(99, 102, 241, 0.08)" : "var(--bg-secondary)",
                    transition: "all 0.2s ease",
                  }}
                >
                  <UploadCloud size={32} style={{ color: "var(--accent-primary)", margin: "0 auto 0.5rem auto" }} />
                  <p style={{ fontWeight: 600, color: "var(--text-primary)", fontSize: "0.95rem", margin: "0 0 0.25rem 0" }}>
                    Click to browse or drag and drop your JD Document
                  </p>
                  <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", margin: 0 }}>
                    Supports PDF (.pdf), Word (.doc, .docx), or Text (.txt) up to 10MB
                  </p>
                </div>
              ) : (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0.85rem 1.25rem",
                    background: "rgba(16, 185, 129, 0.1)",
                    border: "1px solid rgba(16, 185, 129, 0.35)",
                    borderRadius: "var(--radius-sm)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <FileText size={22} style={{ color: "var(--accent-emerald)" }} />
                    <div>
                      <p style={{ fontSize: "0.9rem", fontWeight: 600, margin: 0 }}>{jdFile.name}</p>
                      <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", margin: "0.2rem 0 0 0" }}>
                        {(jdFile.size / 1024).toFixed(1)} KB • Document attached for AI analysis
                      </p>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <button
                      type="button"
                      onClick={() => setJdMode("text")}
                      style={{
                        background: "transparent",
                        border: "1px solid var(--border-subtle)",
                        borderRadius: "var(--radius-sm)",
                        color: "var(--text-secondary)",
                        cursor: "pointer",
                        fontSize: "0.75rem",
                        padding: "0.3rem 0.6rem",
                      }}
                    >
                      View / Add Text
                    </button>
                    <button
                      type="button"
                      onClick={removeJdFile}
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
                </div>
              )}
            </div>
          )}
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

        {/* Resume Template Selection */}
        <div className="form-group" style={{ marginTop: "1.25rem", marginBottom: "1.75rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.6rem" }}>
            <label className="form-label" style={{ margin: 0, display: "flex", alignItems: "center", gap: "6px" }}>
              <Layers size={15} style={{ color: "var(--accent-primary)" }} />
              <span>Target ATS Resume Template</span>
            </label>
            <Link
              to="/templates"
              target="_blank"
              style={{
                fontSize: "0.78rem",
                color: "var(--accent-primary)",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "3px",
                fontWeight: 600,
              }}
            >
              <span>Explore All 5 Templates</span>
              <ExternalLink size={12} />
            </Link>
          </div>

          <div className="template-selector-5col-grid">
            {TEMPLATE_OPTIONS.map((tmpl) => {
              const active = selectedTemplate === tmpl.id;
              return (
                <div
                  key={tmpl.id}
                  onClick={() => {
                    setSelectedTemplate(tmpl.id);
                    localStorage.setItem("rolewise_selected_template", tmpl.id);
                  }}
                  style={{
                    border: active
                      ? "2px solid var(--accent-primary)"
                      : "1px solid var(--border-subtle)",
                    background: active
                      ? "rgba(99, 102, 241, 0.08)"
                      : "var(--bg-secondary)",
                    borderRadius: "var(--radius-sm)",
                    padding: "0.75rem 0.75rem",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.35rem", gap: "4px" }}>
                    <span style={{ fontWeight: 700, fontSize: "0.82rem", color: "var(--text-primary)", lineHeight: 1.25 }}>
                      {tmpl.name}
                    </span>
                    <span
                      style={{
                        fontSize: "0.58rem",
                        fontWeight: 700,
                        padding: "2px 5px",
                        borderRadius: "4px",
                        color: "#ffffff",
                        backgroundColor: tmpl.badgeColor,
                        whiteSpace: "nowrap",
                        flexShrink: 0,
                      }}
                    >
                      {tmpl.badge}
                    </span>
                  </div>
                  <p style={{ fontSize: "0.74rem", color: "var(--text-muted)", margin: 0, lineHeight: 1.35 }}>
                    {tmpl.desc}
                  </p>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "0.6rem", paddingTop: "0.45rem", borderTop: "1px solid var(--border-subtle)" }}>
                    <span style={{ fontSize: "0.72rem", color: active ? "var(--accent-primary)" : "var(--text-muted)", fontWeight: 600, display: "inline-flex", alignItems: "center" }}>
                      {active ? (
                        <>
                          <Check size={12} style={{ marginRight: "3px" }} />
                          <span>Selected</span>
                        </>
                      ) : (
                        <span>Click to select</span>
                      )}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setPreviewTemplateId(tmpl.id);
                        setPreviewModalOpen(true);
                      }}
                      style={{
                        background: "transparent",
                        border: "none",
                        color: "var(--accent-primary)",
                        cursor: "pointer",
                        fontSize: "0.72rem",
                        fontWeight: 600,
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "3px",
                        padding: "2px 4px",
                      }}
                      title="Inspect complete full-page resume layout"
                    >
                      <Eye size={12} />
                      <span>Preview Full</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Full-Screen Whole Resume Preview Modal */}
          <FullResumePreviewModal
            isOpen={previewModalOpen}
            templateId={previewTemplateId}
            onClose={() => setPreviewModalOpen(false)}
            onSelectTemplate={(id) => {
              setSelectedTemplate(id);
              localStorage.setItem("rolewise_selected_template", id);
            }}
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
