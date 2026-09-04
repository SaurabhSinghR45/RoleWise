import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../features/auth/hooks/useAuth";
import { LogOut, User as UserIcon, Sparkles } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

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
          maxWidth: "1200px",
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Brand Logo */}
        <Link
          to="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            textDecoration: "none",
          }}
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
          <ThemeToggle />

          {isAuthenticated ? (
            <>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.4rem 0.85rem",
                  background: "rgba(255, 255, 255, 0.04)",
                  border: "1px solid var(--border-subtle)",
                  borderRadius: "var(--radius-full)",
                  fontSize: "0.875rem",
                  color: "var(--text-primary)",
                }}
              >
                <div
                  style={{
                    width: "24px",
                    height: "24px",
                    borderRadius: "50%",
                    background: "rgba(99, 102, 241, 0.25)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--accent-primary)",
                  }}
                >
                  <UserIcon size={14} />
                </div>
                <span style={{ fontWeight: 600 }}>{user?.username}</span>
              </div>

              <button
                onClick={handleLogout}
                className="btn btn-secondary"
                style={{
                  padding: "0.45rem 0.9rem",
                  fontSize: "0.85rem",
                  borderRadius: "var(--radius-sm)",
                }}
                title="Log Out"
              >
                <LogOut size={15} />
                <span>Logout</span>
              </button>
            </>
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
