// TimesheetHeader.jsx
import { Plus } from "lucide-react";
import { Box } from "@mui/material";
import WeekDropdown from "./WeekDropdown";
import { theme } from "../../theme/theme";

export default function TimesheetHeader({
  menuOpen,
  setMenuOpen,
  handleMenuSelect,
  isMobile,
  onWeekChange, // ← Receives setSelectedWeek from parent
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: theme.spacing.sm,
        width: "100%",
        flexWrap: isMobile ? "wrap" : "nowrap",
        flexDirection: isMobile ? "column" : "row",
        gap: isMobile ? theme.spacing.xs : theme.spacing.md,
      }}
    >
      <div
        style={{
          alignSelf: isMobile ? "flex-start" : "center",
          width: isMobile ? "100%" : "auto",
        }}
      >
        <WeekDropdown onWeekChange={onWeekChange} />
      </div>

      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          width: "100%",
          flexWrap: "nowrap",
          gap: 2,
          marginBottom: "0.3125rem",
          position: "relative",
        }}
      >
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: isMobile ? "0.75rem 1rem" : "0.75rem 2rem",
            backgroundColor: theme.colors.primary,
            color: theme.colors.white,
            border: "none",
            borderRadius: "0.5rem",
            fontSize: isMobile ? "0.875rem" : "1rem",
            fontWeight: 600,
            cursor: "pointer",
            boxShadow: theme.shadows.small,
            transition: theme.transitions.fast,
            whiteSpace: "nowrap",
            minWidth: "fit-content",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = theme.colors.primaryDark;
            e.currentTarget.style.boxShadow = theme.shadows.medium;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = theme.colors.primary;
            e.currentTarget.style.boxShadow = theme.shadows.small;
          }}
        >
          <Plus size={20} />
          Create Task
        </button>

        {menuOpen && (
          <div
            style={{
              position: "absolute",
              top: "calc(100% + 4px)",
              right: 0,
              left: "auto",
              width: "14rem",
              maxWidth: "14rem",
              backgroundColor: theme.colors.surface,
              borderRadius: "0.75rem",
              boxShadow: theme.shadows.large,
              zIndex: 1002,
              overflow: "hidden",
              border: `1px solid ${theme.colors.lightGray}`,
            }}
          >
            {["New Assignment", "Issue", "Change Request"].map((item, idx) => (
              <button
                key={idx}
                onClick={() =>
                  handleMenuSelect(
                    ["assignment", "issue", "change_request"][idx]
                  )
                }
                style={{
                  width: "100%",
                  textAlign: "left",
                  padding: "1rem 1.25rem",
                  backgroundColor: "transparent",
                  border: "none",
                  fontWeight: 500,
                  color: theme.colors.text.primary,
                  cursor: "pointer",
                  fontSize: "1rem",
                  transition: "background-color 0.2s ease",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor =
                    theme.colors.lightGray)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "transparent")
                }
              >
                {item}
              </button>
            ))}
          </div>
        )}
      </Box>
    </div>
  );
}
