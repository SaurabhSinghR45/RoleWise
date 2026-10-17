import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../features/auth/hooks/useAuth";
import {
  User as UserIcon,
  Settings,
  Info,
  LogOut,
  ChevronDown,
  X,
  ShieldCheck,
  Calendar,
  Mail,
  UserCheck,
} from "lucide-react";

const ProfileDropdown = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleLogout = async () => {
    setIsOpen(false);
    await logout();
    navigate("/");
  };

  const handleSettingsClick = () => {
    setIsOpen(false);
    setShowSettingsModal(true);
  };

  // User display metadata
  const displayName = user?.username || "Saurabh Singh";
  const displayEmail = user?.email || "rampal72@gmail.com";

  return (
    <div style={{ position: "relative" }} ref={dropdownRef}>
      {/* Profile Trigger Pill */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        title="View Profile & Settings"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.55rem",
          padding: "0.4rem 0.85rem",
          height: "38px",
          background: "var(--bg-input)",
          border: isOpen
            ? "1px solid var(--accent-primary)"
            : "1px solid var(--border-subtle)",
          borderRadius: "var(--radius-full)",
          boxShadow: isOpen
            ? "0 0 0 2px rgba(99, 102, 241, 0.2)"
            : "var(--shadow-sm)",
          fontSize: "0.875rem",
          color: "var(--text-primary)",
          cursor: "pointer",
          outline: "none",
          transition: "all 0.2s ease",
          userSelect: "none",
        }}
        className="profile-pill-trigger"
      >
        <div
          style={{
            width: "24px",
            height: "24px",
            borderRadius: "50%",
            background: "rgba(99, 102, 241, 0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--accent-primary)",
            flexShrink: 0,
          }}
        >
          <UserIcon size={14} />
        </div>
        <span style={{ fontWeight: 600, maxWidth: "140px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {displayName}
        </span>
        <ChevronDown
          size={14}
          style={{
            color: "var(--text-muted)",
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s ease",
            marginLeft: "2px",
          }}
        />
      </button>

      {/* Floating Dropdown Card (Authentic to User Screenshot) */}
      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            right: 0,
            width: "250px",
            background: "var(--bg-card)",
            backgroundColor: "var(--bg-secondary)",
            border: "1px solid var(--border-subtle)",
            borderRadius: "16px",
            boxShadow: "0 14px 36px rgba(0, 0, 0, 0.16), 0 4px 12px rgba(0, 0, 0, 0.08)",
            padding: "1rem",
            zIndex: 100,
            animation: "fadeInDropdown 0.18s ease-out",
          }}
        >
          {/* User Bio Header */}
          <div style={{ marginBottom: "0.75rem", padding: "0 0.2rem" }}>
            <div
              style={{
                fontSize: "1rem",
                fontWeight: 700,
                color: "var(--text-primary)",
                lineHeight: 1.3,
              }}
            >
              {displayName}
            </div>
            <div
              style={{
                fontSize: "0.82rem",
                color: "var(--text-secondary)",
                marginTop: "2px",
                wordBreak: "break-all",
              }}
            >
              {displayEmail}
            </div>
          </div>

          {/* Divider */}
          <div
            style={{
              height: "1px",
              background: "var(--border-subtle)",
              margin: "0.6rem 0",
            }}
          />

          {/* Menu Options */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
            {/* Account Settings */}
            <button
              type="button"
              onClick={handleSettingsClick}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.85rem",
                width: "100%",
                padding: "0.6rem 0.75rem",
                borderRadius: "10px",
                background: "transparent",
                border: "none",
                color: "var(--text-primary)",
                fontSize: "0.92rem",
                fontWeight: 500,
                cursor: "pointer",
                textAlign: "left",
                transition: "all 0.15s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "var(--bg-card-hover)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              <Settings size={18} strokeWidth={1.8} style={{ color: "var(--text-secondary)" }} />
              <span>Account Settings</span>
            </button>

            {/* Log Out */}
            <button
              type="button"
              onClick={handleLogout}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.85rem",
                width: "100%",
                padding: "0.6rem 0.75rem",
                borderRadius: "10px",
                background: "transparent",
                border: "none",
                color: "#ef4444",
                fontSize: "0.92rem",
                fontWeight: 500,
                cursor: "pointer",
                textAlign: "left",
                transition: "all 0.15s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(239, 68, 68, 0.08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              <LogOut size={18} strokeWidth={1.8} style={{ color: "#ef4444" }} />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      )}

      {/* Account Settings Modal */}
      {showSettingsModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
            backgroundColor: "rgba(15, 23, 42, 0.65)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
          }}
          onClick={() => setShowSettingsModal(false)}
        >
          <div
            style={{
              position: "relative",
              width: "100%",
              maxWidth: "460px",
              backgroundColor: "var(--bg-secondary)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "20px",
              padding: "1.75rem",
              boxShadow: "0 20px 50px rgba(0, 0, 0, 0.3)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowSettingsModal(false)}
              style={{
                position: "absolute",
                top: "1.25rem",
                right: "1.25rem",
                background: "transparent",
                border: "none",
                color: "var(--text-muted)",
                cursor: "pointer",
              }}
            >
              <X size={20} />
            </button>

            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem" }}>
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "12px",
                  background: "var(--gradient-primary)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                }}
              >
                <Settings size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--text-primary)" }}>
                  Account Settings
                </h3>
                <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                  Manage your candidate profile and active session
                </p>
              </div>
            </div>

            <div style={{ display: "grid", gap: "1rem", marginTop: "1rem" }}>
              <div
                style={{
                  padding: "0.85rem",
                  background: "var(--bg-input)",
                  border: "1px solid var(--border-subtle)",
                  borderRadius: "12px",
                }}
              >
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>
                  Candidate Username
                </div>
                <div style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--text-primary)", marginTop: "2px" }}>
                  {displayName}
                </div>
              </div>

              <div
                style={{
                  padding: "0.85rem",
                  background: "var(--bg-input)",
                  border: "1px solid var(--border-subtle)",
                  borderRadius: "12px",
                }}
              >
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>
                  Registered Email
                </div>
                <div style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--text-primary)", marginTop: "2px" }}>
                  {displayEmail}
                </div>
              </div>

              <div
                style={{
                  padding: "0.85rem",
                  background: "var(--bg-input)",
                  border: "1px solid var(--border-subtle)",
                  borderRadius: "12px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>
                    Subscription Tier
                  </div>
                  <div style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--accent-primary)", marginTop: "2px" }}>
                    Pro AI Career Engine
                  </div>
                </div>
                <span className="badge badge-success" style={{ fontSize: "0.75rem", padding: "0.2rem 0.6rem" }}>
                  Active
                </span>
              </div>
            </div>

            <div style={{ marginTop: "1.5rem", display: "flex", justifyContent: "flex-end", gap: "0.75rem" }}>
              <button
                type="button"
                onClick={() => setShowSettingsModal(false)}
                className="btn btn-secondary"
                style={{ padding: "0.5rem 1.25rem", fontSize: "0.9rem" }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
