import React, { useState } from "react";
import { useAuth } from "../features/auth/hooks/useAuth";
import { Mail, Lock, User as UserIcon, AlertCircle, ArrowRight, X, Sparkles } from "lucide-react";

const AuthModal = ({ isOpen, onClose, initialMode = "login", onSuccess }) => {
  const [mode, setMode] = useState(initialMode); // 'login' | 'register'
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [localError, setLocalError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, register, authError, clearError } = useAuth();

  if (!isOpen) return null;

  const handleChange = (e) => {
    setLocalError("");
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");
    clearError();

    if (!formData.email.trim() || !formData.password) {
      setLocalError("Please enter your email and password.");
      return;
    }

    if (mode === "register" && !formData.username.trim()) {
      setLocalError("Please choose a candidate username.");
      return;
    }

    try {
      setIsSubmitting(true);
      let res;
      if (mode === "login") {
        res = await login({
          email: formData.email.trim(),
          password: formData.password,
        });
      } else {
        res = await register({
          username: formData.username.trim(),
          email: formData.email.trim(),
          password: formData.password,
        });
      }

      if (res.success) {
        if (onSuccess) onSuccess();
        onClose();
      } else if (res.message) {
        setLocalError(res.message);
      }
    } catch (err) {
      console.error("[Auth Modal Error]:", err);
      setLocalError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayError = localError || authError;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
        backgroundColor: "rgba(15, 23, 42, 0.6)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        animation: "fadeIn 0.2s ease-out",
      }}
      onClick={onClose}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "440px",
          backgroundColor: "var(--bg-secondary)",
          border: "1px solid var(--border-subtle)",
          borderRadius: "24px",
          padding: "2rem",
          boxShadow: "0 25px 60px -15px rgba(0, 0, 0, 0.45)",
          color: "var(--text-primary)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          type="button"
          style={{
            position: "absolute",
            top: "1.25rem",
            right: "1.25rem",
            background: "transparent",
            border: "none",
            color: "var(--text-muted)",
            cursor: "pointer",
            padding: "4px",
            borderRadius: "8px",
          }}
          title="Close"
        >
          <X size={20} />
        </button>

        {/* Brand Header */}
        <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "14px",
              background: "var(--gradient-primary)",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#ffffff",
              fontWeight: 800,
              fontSize: "1.45rem",
              boxShadow: "0 8px 20px rgba(99, 102, 241, 0.35)",
              marginBottom: "0.75rem",
            }}
          >
            R
          </div>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 800, letterSpacing: "-0.02em" }}>
            {mode === "login" ? "Sign in to RoleWise" : "Create Candidate Account"}
          </h2>
          <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginTop: "0.25rem" }}>
            {mode === "login"
              ? "Access tailored interview prep & ATS benchmarks"
              : "Start accelerating your interview conversion"}
          </p>
        </div>

        {/* Mode Switch Tabs */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "4px",
            background: "var(--bg-input)",
            border: "1px solid var(--border-subtle)",
            borderRadius: "12px",
            padding: "4px",
            marginBottom: "1.25rem",
          }}
        >
          <button
            type="button"
            onClick={() => {
              setMode("login");
              setLocalError("");
              clearError();
            }}
            style={{
              padding: "0.55rem 0",
              fontSize: "0.85rem",
              fontWeight: 600,
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              transition: "all 0.2s ease",
              background: mode === "login" ? "var(--bg-secondary)" : "transparent",
              color: mode === "login" ? "var(--text-primary)" : "var(--text-secondary)",
              boxShadow: mode === "login" ? "0 2px 6px rgba(0, 0, 0, 0.08)" : "none",
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("register");
              setLocalError("");
              clearError();
            }}
            style={{
              padding: "0.55rem 0",
              fontSize: "0.85rem",
              fontWeight: 600,
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              transition: "all 0.2s ease",
              background: mode === "register" ? "var(--bg-secondary)" : "transparent",
              color: mode === "register" ? "var(--text-primary)" : "var(--text-secondary)",
              boxShadow: mode === "register" ? "0 2px 6px rgba(0, 0, 0, 0.08)" : "none",
            }}
          >
            Create Account
          </button>
        </div>

        {/* Error Alert */}
        {displayError && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.75rem 1rem",
              background: "rgba(244, 63, 94, 0.12)",
              border: "1px solid rgba(244, 63, 94, 0.25)",
              borderRadius: "10px",
              color: "#f43f5e",
              fontSize: "0.85rem",
              marginBottom: "1rem",
            }}
          >
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>{displayError}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: "grid", gap: "1rem" }}>
          {mode === "register" && (
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "0.82rem",
                  fontWeight: 600,
                  marginBottom: "0.35rem",
                  color: "var(--text-primary)",
                }}
              >
                Candidate Name
              </label>
              <div style={{ position: "relative" }}>
                <UserIcon
                  size={16}
                  style={{
                    position: "absolute",
                    left: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "var(--text-muted)",
                  }}
                />
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="e.g. Saurabh Singh"
                  required
                  style={{
                    width: "100%",
                    padding: "0.65rem 0.75rem 0.65rem 2.4rem",
                    borderRadius: "10px",
                    border: "1px solid var(--border-subtle)",
                    background: "var(--bg-input)",
                    color: "var(--text-primary)",
                    fontSize: "0.9rem",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>
            </div>
          )}

          <div>
            <label
              style={{
                display: "block",
                fontSize: "0.82rem",
                fontWeight: 600,
                marginBottom: "0.35rem",
                color: "var(--text-primary)",
              }}
            >
              Email Address
            </label>
            <div style={{ position: "relative" }}>
              <Mail
                size={16}
                style={{
                  position: "absolute",
                  left: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "var(--text-muted)",
                }}
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="name@company.com"
                required
                style={{
                  width: "100%",
                  padding: "0.65rem 0.75rem 0.65rem 2.4rem",
                  borderRadius: "10px",
                  border: "1px solid var(--border-subtle)",
                  background: "var(--bg-input)",
                  color: "var(--text-primary)",
                  fontSize: "0.9rem",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>
          </div>

          <div>
            <label
              style={{
                display: "block",
                fontSize: "0.82rem",
                fontWeight: 600,
                marginBottom: "0.35rem",
                color: "var(--text-primary)",
              }}
            >
              Password
            </label>
            <div style={{ position: "relative" }}>
              <Lock
                size={16}
                style={{
                  position: "absolute",
                  left: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "var(--text-muted)",
                }}
              />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                style={{
                  width: "100%",
                  padding: "0.65rem 0.75rem 0.65rem 2.4rem",
                  borderRadius: "10px",
                  border: "1px solid var(--border-subtle)",
                  background: "var(--bg-input)",
                  color: "var(--text-primary)",
                  fontSize: "0.9rem",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-primary"
            style={{
              width: "100%",
              padding: "0.75rem",
              borderRadius: "10px",
              fontSize: "0.95rem",
              fontWeight: 600,
              marginTop: "0.5rem",
              cursor: isSubmitting ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
            }}
          >
            {isSubmitting ? (
              <span>Authenticating...</span>
            ) : mode === "login" ? (
              <>
                <span>Sign In</span>
                <ArrowRight size={16} />
              </>
            ) : (
              <>
                <span>Create Candidate Account</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        {/* Footer switch */}
        <div style={{ textAlign: "center", marginTop: "1.25rem", fontSize: "0.85rem", color: "var(--text-secondary)" }}>
          {mode === "login" ? (
            <>
              Don't have an account yet?{" "}
              <button
                type="button"
                onClick={() => {
                  setMode("register");
                  setLocalError("");
                  clearError();
                }}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "var(--accent-primary)",
                  fontWeight: 600,
                  cursor: "pointer",
                  padding: 0,
                }}
              >
                Create one now
              </button>
            </>
          ) : (
            <>
              Already registered?{" "}
              <button
                type="button"
                onClick={() => {
                  setMode("login");
                  setLocalError("");
                  clearError();
                }}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "var(--accent-primary)",
                  fontWeight: 600,
                  cursor: "pointer",
                  padding: 0,
                }}
              >
                Sign in
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
