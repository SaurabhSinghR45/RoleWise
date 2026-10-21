import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check, FileText } from "lucide-react";

export const TEMPLATE_OPTIONS = [
  { id: "nitw", label: "College Campus (NIT Warangal)", badge: "Official Campus" },
  { id: "classic", label: "Classic Professional", badge: "Engineering Stack" },
  { id: "traditional", label: "Traditional Executive", badge: "Corporate" },
  { id: "prime_ats", label: "Prime ATS (Corporate)", badge: "Modern Blue" },
  { id: "pure_ats", label: "Pure ATS (High Parse)", badge: "100% Parse" },
];

const CustomTemplateDropdown = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close when clicking outside
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

  const selectedOption = TEMPLATE_OPTIONS.find((t) => t.id === value) || TEMPLATE_OPTIONS[0];

  return (
    <div style={{ position: "relative", display: "inline-block" }} ref={dropdownRef}>
      {/* Trigger Button - Matches height and visual style of adjacent Export button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        style={{
          height: "46px",
          padding: "0 1.1rem",
          fontSize: "0.92rem",
          fontWeight: 600,
          color: "var(--text-primary)",
          backgroundColor: "var(--bg-input)",
          border: isOpen
            ? "1px solid var(--accent-primary)"
            : "1px solid var(--border-subtle)",
          borderRadius: "var(--radius-sm)",
          cursor: "pointer",
          outline: "none",
          boxShadow: isOpen
            ? "0 0 0 2px rgba(99, 102, 241, 0.2)"
            : "var(--shadow-sm)",
          display: "inline-flex",
          alignItems: "center",
          gap: "0.75rem",
          transition: "all 0.2s ease",
          userSelect: "none",
        }}
        className="custom-dropdown-trigger"
      >
        <span style={{ whiteSpace: "nowrap" }}>{selectedOption.label}</span>
        <ChevronDown
          size={16}
          style={{
            color: "var(--text-secondary)",
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s ease",
            flexShrink: 0,
          }}
        />
      </button>

      {/* Floating Menu Card (Styled like user's reference image 2) */}
      {isOpen && (
        <div
          role="listbox"
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            right: 0,
            minWidth: "270px",
            backgroundColor: "var(--bg-secondary)",
            border: "1px solid var(--border-subtle)",
            borderRadius: "16px",
            boxShadow: "0 14px 36px rgba(0, 0, 0, 0.14), 0 4px 12px rgba(0, 0, 0, 0.06)",
            padding: "0.5rem",
            zIndex: 100,
            animation: "fadeInDropdown 0.18s ease-out",
          }}
        >
          {TEMPLATE_OPTIONS.map((tmpl) => {
            const isSelected = tmpl.id === value;
            return (
              <div
                key={tmpl.id}
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  onChange(tmpl.id);
                  setIsOpen(false);
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "0.65rem 0.85rem",
                  borderRadius: "10px",
                  cursor: "pointer",
                  fontSize: "0.9rem",
                  fontWeight: isSelected ? 600 : 500,
                  color: isSelected ? "var(--accent-primary)" : "var(--text-primary)",
                  backgroundColor: isSelected
                    ? "rgba(99, 102, 241, 0.08)"
                    : "transparent",
                  transition: "all 0.15s ease",
                  userSelect: "none",
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.backgroundColor = "var(--bg-card-hover)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }
                }}
              >
                <span>{tmpl.label}</span>
                {isSelected && (
                  <Check size={16} style={{ color: "var(--accent-primary)", flexShrink: 0 }} />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CustomTemplateDropdown;
