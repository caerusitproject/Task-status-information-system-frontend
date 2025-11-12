// WeekDropdown.jsx
import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { theme } from "../../theme/theme";
import { TaskApi } from "../../api/taskApi";

export default function WeekDropdown({ onWeekChange }) {
  const [weekDropdownOpen, setWeekDropdownOpen] = useState(false);
  const [weeks, setWeeks] = useState([]);
  const isMobile = window.innerWidth <= 768;
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [apiValue, setApiValue] = useState(1);
  const [loading, setLoading] = useState(true);
  const weekDropdownRef = useRef(null);

  const formatDate = (dateStr) => {
    const [year, month, day] = dateStr.split("-");
    return `${day}/${month}/${year.slice(-2)}`;
  };

  useEffect(() => {
    const fetchWeeks = async () => {
      try {
        setLoading(true);
        const today = new Date().toISOString().split("T")[0];
        const response = await TaskApi.weeks(today, apiValue);
        const weekList = response.content || [];
        weekList.sort((a, b) => a.week - b.week);
        setWeeks(weekList);
        if (weekList.length > 0) {
          setSelectedIndex(0);
          onWeekChange(weekList[0]); // ← Sends full week object
          //console.log("Weeks in week",weekList[0])
        }
      } catch (error) {
        console.error("Failed to load weeks:", error);
        setWeeks([]);
      } finally {
        setLoading(false);
      }
    };
    fetchWeeks();
  }, [apiValue, onWeekChange]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (weekDropdownRef.current && !weekDropdownRef.current.contains(event.target)) {
        setWeekDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (index) => {
    setSelectedIndex(index);
    setWeekDropdownOpen(false);
    onWeekChange(weeks[index]); // ← Sends selected week
  };

  if (loading) {
    return (
      <div style={{ padding: "0.5rem 1rem", color: theme.colors.text.secondary }}>
        Loading weeks...
      </div>
    );
  }

  if (weeks.length === 0) {
    return (
      <div style={{ padding: "0.5rem 1rem", color: theme.colors.error }}>
        No weeks available
      </div>
    );
  }

  const selectedWeek = weeks[selectedIndex];

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        marginBottom: theme.spacing.md,
        width: isMobile ? "100%" : "auto",
        maxWidth: isMobile ? "180px" : "none",
        flex: isMobile ? "1 1 60%" : "0 1 auto",
      }}
    >
      <button
        onClick={() => setApiValue(prev => prev - 1)}
        style={{
          padding: "0.5rem 0.75rem",
          backgroundColor: theme.colors.surface,
          color: theme.colors.text.primary,
          border: `0.0625rem solid ${theme.colors.lightGray}`,
          borderRadius: "0.375rem",
          cursor: "pointer",
          fontSize: "1rem",
          fontWeight: 600,
          opacity: 1,
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
         &lt;
      </button>

      <div ref={weekDropdownRef} style={{ position: "relative", flex: 1 }}>
        <button
          onClick={() => setWeekDropdownOpen(!weekDropdownOpen)}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0.5rem 1rem",
            backgroundColor: theme.colors.surface,
            color: theme.colors.text.primary,
            border: `0.0625rem solid ${theme.colors.lightGray}`,
            borderRadius: "0.5rem",
            fontSize: "0.955rem",
            fontWeight: 500,
            cursor: "pointer",
            width: "100%",
            textAlign: "left",
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
          <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", flex: 1 }}>
            {formatDate(selectedWeek.startDate)} - {formatDate(selectedWeek.endDate)}
          </span>
          <ChevronDown
            size={16}
            style={{
              transform: weekDropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.2s ease",
              marginLeft: "0.5rem",
            }}
          />
        </button>

        {weekDropdownOpen && (
          <div
            style={{
              position: "absolute",
              top: "calc(100% + 4px)",
              left: 0,
              width: "100%",
              maxHeight: "12rem",
              overflowY: "auto",
              backgroundColor: theme.colors.surface,
              borderRadius: "0.5rem",
              boxShadow: theme.shadows.large,
              zIndex: 1002,
              border: `1px solid ${theme.colors.lightGray}`,
            }}
          >
            {weeks.map((week, index) => (
              <button
                key={week.week}
                onClick={() => handleSelect(index)}
                style={{
                  width: "100%",
                  textAlign: "left",
                  padding: "0.75rem 1rem",
                  backgroundColor: selectedIndex === index ? theme.colors.lightGray : "transparent",
                  border: "none",
                  fontWeight: selectedIndex === index ? 600 : 500,
                  color: theme.colors.text.primary,
                  cursor: "pointer",
                  fontSize: "0.875rem",
                  transition: "background-color 0.2s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = theme.colors.lightGray)}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = selectedIndex === index ? theme.colors.lightGray : "transparent";
                }}
              >
                {formatDate(week.startDate)} - {formatDate(week.endDate)}
              </button>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={() => setApiValue(prev => prev + 1)}
        style={{
          padding: "0.5rem 0.75rem",
          backgroundColor: theme.colors.surface,
          color: theme.colors.text.primary,
          border: `0.0625rem solid ${theme.colors.lightGray}`,
          borderRadius: "0.375rem",
          cursor: "pointer",
          fontSize: "1rem",
          fontWeight: 600,
          opacity: 1,
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