import React from "react";
import { useTheme } from "../context/theme.context";
import { Sun, Moon } from "lucide-react";

const ThemeToggle = ({ className = "", style = {} }) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`theme-toggle-btn ${className}`}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      title={`Switch to ${isDark ? "Light" : "Dark"} mode (Current: ${isDark ? "Dark" : "Light"})`}
      style={{
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: "38px",
        height: "38px",
        borderRadius: "var(--radius-sm)",
        background: isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(15, 23, 42, 0.05)",
        border: "1px solid var(--border-subtle)",
        cursor: "pointer",
        outline: "none",
        overflow: "hidden",
        boxShadow: isDark
          ? "0 2px 8px rgba(0, 0, 0, 0.2)"
          : "0 2px 8px rgba(15, 23, 42, 0.06)",
        transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        ...style,
      }}
    >
      {/* Sun Icon (Dark Mode Active) */}
      <span
        style={{
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fbbf24",
          transform: isDark ? "rotate(0deg) scale(1)" : "rotate(90deg) scale(0)",
          opacity: isDark ? 1 : 0,
          transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease",
          pointerEvents: "none",
        }}
      >
        <Sun size={19} />
      </span>

      {/* Moon Icon (Light Mode Active) */}
      <span
        style={{
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#4f46e5",
          transform: isDark ? "rotate(-90deg) scale(0)" : "rotate(0deg) scale(1)",
          opacity: isDark ? 0 : 1,
          transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease",
          pointerEvents: "none",
        }}
      >
        <Moon size={18} />
      </span>
    </button>
  );
};

export default ThemeToggle;

