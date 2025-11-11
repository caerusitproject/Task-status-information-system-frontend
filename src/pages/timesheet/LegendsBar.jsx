import { theme } from "../../theme/theme";

export default function LegendsBar({ legends, onLegendClick }) {
  return (
    <div
      style={{
        backgroundColor: theme.colors.surface,
        borderRadius: "0.5rem",
        border: `0.0625rem solid ${theme.colors.lightGray}`,
        padding: "1rem 1.5rem",
        boxShadow: theme.shadows.medium,
        display: "flex",
        alignItems: "center",
        gap: "0.9rem",
        flexWrap: "wrap",
        marginBottom: "40px",
      }}
    >
      {legends.map((legend) => (
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
            <span style={{ color: "black", fontSize: "1rem", fontWeight: 600 }}>
              {legend.task_code}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}