import { theme } from "../../theme/theme";
import { useState } from "react";
import { KeyboardArrowUp, KeyboardArrowDown } from "@mui/icons-material";

export default function LegendsBar({ legends, onLegendClick }) {
  const [expanded, setExpanded] = useState(false);

  const visibleLegends = legends.filter((l) => l.task_type !== "ticket_less");
  const isMobile = window.innerWidth <= 768; // Simple mobile detect

  return (
    <div
      style={{
        backgroundColor: theme.colors.surface,
        borderRadius: "1rem",
        border: `0.0625rem solid ${theme.colors.lightGray}`,
        padding: "1rem 1rem",
        boxShadow: theme.shadows.medium,
        marginBottom: "40px",
        minHeight: "5rem",
      }}
    >
      {/* Accordion Header – Always visible */}
      <div
        onClick={() => isMobile && setExpanded(!expanded)}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          cursor: isMobile ? "pointer" : "default",
          userSelect: "none",
        }}
      >
        {isMobile &&( <span style={{ fontWeight: 600, fontSize: "0.9rem" }}>
          Legends Box ({visibleLegends.length}) 
        </span>)}
        {isMobile &&
          (expanded ? (
            <KeyboardArrowUp
              sx={{
                fontSize: "1.8rem",
                transition: "transform 0.2s",
              }}
            />
          ) : (
            <KeyboardArrowDown
              sx={{
                fontSize: "1.8rem",
                transition: "transform 0.2s",
              }}
            />
          ))}
      </div>

      {/* Legends Grid – Collapsible */}
      <div
        style={{
          marginTop: isMobile ? "0.5rem" : 0,
          maxHeight: isMobile && !expanded ? "3.5rem" : "none",
          overflow: "hidden",
          transition: "max-height 0.3s ease",
          display: "flex",
          flexWrap: "wrap",
          gap: "0.9rem",
        }}
      >
        {visibleLegends.map((legend) => (
          <div
            key={legend.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.1rem",
              cursor: "pointer",
            }}
            onClick={() => onLegendClick(legend)}
          >
            <div
              style={{
                width: "4.75rem",
                height: "3rem",
                backgroundColor: legend.color_row,
                borderRadius: "0.4rem",
                border: `0.0625rem solid #92909065`,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <span
                style={{ color: "black", fontSize: "1rem", fontWeight: 600 }}
              >
                {legend.task_code}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
