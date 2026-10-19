import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../features/auth/hooks/useAuth";
import { Sparkles, FileText } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import ProfileDropdown from "./ProfileDropdown";

const Navbar = () => {
  const { isAuthenticated } = useAuth();

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        backgroundColor: "var(--bg-card)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderBottom: "1px solid var(--border-subtle)",
        padding: "0.85rem 1.5rem",
      }}
    >
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Brand Logo - Redirects to Landing Page */}
        <Link
          to="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            textDecoration: "none",
          }}
          title="RoleWise Home"
        >
          <div
            style={{
              width: "38px",
              height: "38px",
              borderRadius: "10px",
              background: "var(--gradient-primary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#ffffff",
              fontWeight: "800",
              fontSize: "1.2rem",
              boxShadow: "0 4px 12px rgba(99, 102, 241, 0.35)",
            }}
          >
            R
          </div>
          <div>
            <span
              style={{
                fontSize: "1.25rem",
                fontWeight: "800",
                color: "var(--text-primary)",
                letterSpacing: "-0.03em",
              }}
            >
              Rolewise
            </span>
            <span
              className="badge"
              style={{
                marginLeft: "0.5rem",
                fontSize: "0.68rem",
                padding: "0.15rem 0.5rem",
                verticalAlign: "middle",
              }}
            >
              <Sparkles size={11} /> AI Career Prep
            </span>
          </div>
        </Link>

        {/* Right Navigation */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
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
            <span>Resume Templates</span>
          </Link>

          <ThemeToggle />

          {isAuthenticated ? (
            <ProfileDropdown />
          ) : (
            <div style={{ display: "flex", gap: "0.75rem" }}>
              <Link
                to="/login"
                className="btn btn-secondary"
                style={{ padding: "0.45rem 1rem", fontSize: "0.875rem" }}
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="btn btn-primary"
                style={{ padding: "0.45rem 1rem", fontSize: "0.875rem" }}
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
