import { useState } from "react"
import { ChevronDown, ChevronUp, Edit2 } from "lucide-react"
import { theme } from '../../theme/theme'; // Reuse existing theme
import Button from '../../components/common/Button'; // Reuse custom Button
const TaskCard = ({ task, onEdit }) => {
  const [expanded, setExpanded] = useState(false)

  const getStatusColor = (status) => {
    const statusColors = {
      Completed: { bg: "#e8f5e9", text: theme.colors.success },
      "In-Progress": { bg: "#fff3e0", text: theme.colors.warning },
      "Not Started": { bg: "#f3e5f5", text: "#9c27b0" },
      "On Hold": { bg: "#e3f2fd", text: theme.colors.primary },
    }
    return statusColors[status] || { bg: "#f5f5f5", text: theme.colors.text.secondary }
  }

  const statusColor = getStatusColor(task.status)

  return (
    <div
      style={{
        backgroundColor: theme.colors.white,
        borderRadius: theme.borderRadius.medium,
        padding: theme.spacing.lg,
        marginBottom: theme.spacing.md,
        boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
        transition: "all 0.3s ease",
        border: `1px solid ${theme.colors.lightGray}`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.12)"
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.08)"
      }}
    >
      {/* Header Section */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: theme.spacing.md,
          flexWrap: "wrap",
        }}
      >
        <div style={{ flex: 1, minWidth: "200px" }}>
          {/* Task Title */}
          <h3
            style={{
              margin: "0 0 8px 0",
              color: theme.colors.text.primary,
              fontSize: "1.125rem",
              fontWeight: "600",
              wordBreak: "break-word",
            }}
          >
            {task.taskTitle}
          </h3>

          {/* Ticket ID and Status */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: theme.spacing.md,
              flexWrap: "wrap",
              marginTop: theme.spacing.sm,
            }}
          >
            <p
              style={{
                margin: 0,
                color: theme.colors.text.secondary,
                fontSize: "0.875rem",
              }}
            >
              Ticket ID: <strong>{task.ticketId}</strong>
            </p>
            <span
              style={{
                display: "inline-block",
                padding: "4px 12px",
                borderRadius: "16px",
                fontSize: "0.8rem",
                fontWeight: "600",
                backgroundColor: statusColor.bg,
                color: statusColor.text,
              }}
            >
              {task.status}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div
          style={{
            display: "flex",
            gap: "8px",
            flexShrink: 0,
          }}
        >
          <button
            onClick={() => onEdit(task)}
            style={{
              backgroundColor: "transparent",
              border: "none",
              cursor: "pointer",
              padding: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: theme.borderRadius.small,
              color: theme.colors.primary,
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = `${theme.colors.primary}15`
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent"
            }}
            title="Edit task"
          >
            <Edit2 size={20} />
          </button>

          <button
            onClick={() => setExpanded(!expanded)}
            style={{
              backgroundColor: "transparent",
              border: "none",
              cursor: "pointer",
              padding: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: theme.borderRadius.small,
              color: theme.colors.primary,
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = `${theme.colors.primary}15`
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent"
            }}
            title={expanded ? "Collapse" : "Expand"}
          >
            {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
        </div>
      </div>

      {/* Expanded Details Section */}
      {expanded && (
        <div
          style={{
            marginTop: theme.spacing.lg,
            paddingTop: theme.spacing.lg,
            borderTop: `1px solid ${theme.colors.lightGray}`,
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: theme.spacing.md,
            }}
          >
            {/* Ticketing System */}
            <div>
              <p
                style={{
                  margin: 0,
                  color: theme.colors.text.secondary,
                  fontSize: "0.8rem",
                  fontWeight: "500",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                Ticketing System
              </p>
              <p
                style={{
                  margin: "6px 0 0 0",
                  color: theme.colors.text.primary,
                  fontWeight: "600",
                  fontSize: "0.95rem",
                }}
              >
                {task.ticketingSystem}
              </p>
            </div>

            {/* Application */}
            <div>
              <p
                style={{
                  margin: 0,
                  color: theme.colors.text.secondary,
                  fontSize: "0.8rem",
                  fontWeight: "500",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                Application
              </p>
              <p
                style={{
                  margin: "6px 0 0 0",
                  color: theme.colors.text.primary,
                  fontWeight: "600",
                  fontSize: "0.95rem",
                }}
              >
                {task.application}
              </p>
            </div>

            {/* Module */}
            <div>
              <p
                style={{
                  margin: 0,
                  color: theme.colors.text.secondary,
                  fontSize: "0.8rem",
                  fontWeight: "500",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                Module
              </p>
              <p
                style={{
                  margin: "6px 0 0 0",
                  color: theme.colors.text.primary,
                  fontWeight: "600",
                  fontSize: "0.95rem",
                }}
              >
                {task.module}
              </p>
            </div>
          </div>

          {/* Execution Note */}
          <div style={{ marginTop: theme.spacing.md }}>
            <p
              style={{
                margin: 0,
                color: theme.colors.text.secondary,
                fontSize: "0.8rem",
                fontWeight: "500",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              Execution Note
            </p>
            <p
              style={{
                margin: "6px 0 0 0",
                color: theme.colors.text.primary,
                fontSize: "0.95rem",
                lineHeight: "1.5",
              }}
            >
              {task.executionNote}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default TaskCard