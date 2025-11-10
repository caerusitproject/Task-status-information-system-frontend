// WeekDropdown.jsx
import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { theme } from "../../theme/theme";

export default function WeekDropdown() {
  const [weekDropdownOpen, setWeekDropdownOpen] = useState(false);
  const [selectedWeek, setSelectedWeek] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  const [weekSetIndex, setWeekSetIndex] = useState(0);
  const weekDropdownRef = useRef(null);

  // Generate weeks for each set (each set has 5 weeks)
  const generateWeekSet = (setIndex) => {
    const weeks = [];
    const startDate = new Date(2025, 10, 10); // Starting from Nov 10, 2025

    for (let i = 0; i < 5; i++) {
      const start = new Date(startDate);
      start.setDate(start.getDate() + setIndex * 35 + i * 7);
      const end = new Date(start);
      end.setDate(end.getDate() + 4);

      weeks.push({
        id: i,
        start: `${String(start.getDate()).padStart(2, "0")}/${String(
          start.getMonth() + 1
        ).padStart(2, "0")}/${String(start.getFullYear()).slice(-2)}`,
        end: `${String(end.getDate()).padStart(2, "0")}/${String(
          end.getMonth() + 1
        ).padStart(2, "0")}/${String(end.getFullYear()).slice(-2)}`,
      });
    }
    return weeks;
  };

  const weekOptions = generateWeekSet(weekSetIndex);

  // Click outside handler
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        weekDropdownRef.current &&
        !weekDropdownRef.current.contains(event.target)
      ) {
        setWeekDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        marginBottom: theme.spacing.md,
      }}
    >
      {/* Previous Button */}
      <button
        onClick={() => setWeekSetIndex(Math.max(0, weekSetIndex - 1))}
        disabled={weekSetIndex === 0}
        style={{
          padding: "0.5rem 0.75rem",
          backgroundColor:
            weekSetIndex === 0 ? theme.colors.lightGray : theme.colors.surface,
          color: theme.colors.text.primary,
          border: `0.0625rem solid ${theme.colors.lightGray}`,
          borderRadius: "0.375rem",
          cursor: weekSetIndex === 0 ? "not-allowed" : "pointer",
          fontSize: "1rem",
          fontWeight: 600,
          opacity: weekSetIndex === 0 ? 0.5 : 1,
          transition: theme.transitions.fast,
        }}
        onMouseEnter={(e) => {
          if (weekSetIndex !== 0) {
            e.currentTarget.style.backgroundColor = theme.colors.lightGray;
            e.currentTarget.style.borderColor = theme.colors.mediumGray;
          }
        }}
        onMouseLeave={(e) => {
          if (weekSetIndex !== 0) {
            e.currentTarget.style.backgroundColor = theme.colors.surface;
            e.currentTarget.style.borderColor = theme.colors.lightGray;
          }
        }}
      >
        &lt;
      </button>

      {/* Dropdown */}
      <div
        ref={weekDropdownRef}
        style={{
          position: "relative",
          flex: 1,
        }}
      >
        <button
          onClick={() => setWeekDropdownOpen(!weekDropdownOpen)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.5rem 1rem",
            backgroundColor: theme.colors.surface,
            color: theme.colors.text.primary,
            border: `0.0625rem solid ${theme.colors.lightGray}`,
            borderRadius: "0.5rem",
            fontSize: "0.955rem",
            fontWeight: 500,
            cursor: "pointer",
            transition: theme.transitions.fast,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = theme.colors.lightGray;
            e.currentTarget.style.borderColor = theme.colors.mediumGray;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = theme.colors.surface;
            e.currentTarget.style.borderColor = theme.colors.lightGray;
          }}
        >
          <span
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: isMobile ? "80px" : "100%", // for mobile: shorten display
              display: "inline-block",
            }}
          >
            {weekOptions[selectedWeek].start} - {weekOptions[selectedWeek].end}
          </span>

          <ChevronDown
            size={16}
            style={{
              transform: weekDropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.2s ease",
            }}
          />
        </button>

        {weekDropdownOpen && (
          <div
            style={{
              position: "absolute",
              top: "calc(100% + 4px)",
              left: 0,
              width: "18rem",
              maxWidth: "100%",
              backgroundColor: theme.colors.surface,
              borderRadius: "0.5rem",
              boxShadow: theme.shadows.large,
              zIndex: 1002,
              border: `1px solid ${theme.colors.lightGray}`,
              overflow: "hidden",
            }}
          >
            {weekOptions.map((week) => (
              <button
                key={week.id}
                onClick={() => {
                  setSelectedWeek(week.id);
                  setWeekDropdownOpen(false);
                }}
                style={{
                  width: "100%",
                  textAlign: "left",
                  padding: "0.75rem 1rem",
                  backgroundColor:
                    selectedWeek === week.id
                      ? theme.colors.lightGray
                      : "transparent",
                  border: "none",
                  fontWeight: selectedWeek === week.id ? 600 : 500,
                  color: theme.colors.text.primary,
                  cursor: "pointer",
                  fontSize: "0.875rem",
                  transition: "background-color 0.2s ease",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor =
                    theme.colors.lightGray)
                }
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor =
                    selectedWeek === week.id
                      ? theme.colors.lightGray
                      : "transparent";
                }}
              >
                {week.start} - {week.end}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Next Button */}
      <button
        onClick={() => setWeekSetIndex(weekSetIndex + 1)}
        style={{
          padding: "0.5rem 0.75rem",
          backgroundColor: theme.colors.surface,
          color: theme.colors.text.primary,
          border: `0.0625rem solid ${theme.colors.lightGray}`,
          borderRadius: "0.375rem",
          cursor: "pointer",
          fontSize: "1rem",
          fontWeight: 600,
          transition: theme.transitions.fast,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = theme.colors.lightGray;
          e.currentTarget.style.borderColor = theme.colors.mediumGray;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = theme.colors.surface;
          e.currentTarget.style.borderColor = theme.colors.lightGray;
        }}
      >
        &gt;
      </button>
    </div>
  );
}
