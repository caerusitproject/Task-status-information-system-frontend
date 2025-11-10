// src/components/TaskCard.jsx
import { useState } from "react";
import { Box, Typography, IconButton, InputBase, Chip } from "@mui/material";
import TextareaAutosize from "react-textarea-autosize";
import { theme } from "../../theme/theme";

export default function TaskCard({ task: initialTask }) {
  const [task, setTask] = useState(initialTask);

  const {
    taskId,
    colorCode,
    taskType,
    status,
    ticketId,
    hours,
    minutes,
    dailyAccomplishments,
    investigationRCA,
    resolutions,
  } = task;

  const isIssueResolved =
    taskType === "Issue" && ["Resolved", "Completed"].includes(status);

  const textAreaRows = 4;

  const updateField = (field, value) => {
    setTask((prev) => ({ ...prev, [field]: value }));
  };

  const ticketDisplayValue = ticketId ? `Ticket : ${ticketId}` : "";

  return (
    <Box
      sx={{
        backgroundColor: colorCode,
        overflow: "hidden",
        display: "flex",
        alignItems: "stretch",
        minHeight: "180px",
        mb: 0,
        boxShadow: theme.shadows.medium,
      }}
    >
      {/* LEFT – TASK ID (Only show if ticket exists) */}
      <Box
        sx={{
          bgcolor: "#2d2d2d",
          color: "#fff",
          width: "120px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          p: 1,
        }}
      >
        {ticketId && (
          <>
            <Typography
              variant="caption"
              sx={{ fontSize: "0.75rem", mb: 0.5, opacity: 0.8 }}
            >
              Task-ID
            </Typography>
            <Box
              sx={{
                bgcolor: "#000",
                color: "#fff",
                px: 1.5,
                py: 0.5,
                borderRadius: "999px",
                fontWeight: 600,
                fontSize: "0.875rem",
              }}
            >
              {taskId}
            </Box>
          </>
        )}
      </Box>

      {/* MIDDLE – EDITABLE CONTENT */}
      <Box
        sx={{
          flex: 1,
          p: 2,
          display: "flex",
          flexDirection: "column",
          color: "#000",
        }}
      >
        {isIssueResolved ? (
          <>
            <Typography sx={{ fontWeight: 600, fontSize: "0.875rem", mb: 0.5 }}>
              Investigation and RCA.
            </Typography>
            <TextareaAutosize
              value={investigationRCA || ""}
              onChange={(e) => updateField("investigationRCA", e.target.value)}
              minRows={textAreaRows}
              style={{
                width: "100%",
                border: "none",
                background: "transparent",
                resize: "none",
                fontSize: "0.875rem",
                fontFamily: "inherit",
                color: "#000",
                outline: "none",
                marginBottom: "0.75rem",
              }}
              placeholder="Describe the investigation findings and the root cause of the issue..."
            />

            <Box
              sx={{
                borderTop: "1px solid rgba(0,0,0,0.7)",
                my: 1.5,
              }}
            />

            <Typography sx={{ fontWeight: 600, fontSize: "0.875rem", mb: 0.5 }}>
              Resolution and steps taken to mitigate the issues.
            </Typography>
            <TextareaAutosize
              value={resolutions || ""}
              onChange={(e) => updateField("resolutions", e.target.value)}
              minRows={textAreaRows}
              style={{
                width: "100%",
                border: "none",
                background: "transparent",
                resize: "none",
                fontSize: "0.875rem",
                fontFamily: "inherit",
                color: "#000",
                outline: "none",
              }}
              placeholder="Document the resolution steps and any measures taken to prevent recurrence..."
            />
          </>
        ) : (
          <>
            <Typography sx={{ fontWeight: 600, fontSize: "0.875rem", mb: 0.5 }}>
              Enter Daily Accomplishment.
            </Typography>
            <TextareaAutosize
              value={dailyAccomplishments || ""}
              onChange={(e) =>
                updateField("dailyAccomplishments", e.target.value)
              }
              minRows={textAreaRows}
              style={{
                width: "100%",
                border: "none",
                background: "transparent",
                resize: "none",
                fontSize: "0.875rem",
                fontFamily: "inherit",
                color: "#000",
                outline: "none",
              }}
              placeholder="Summarize key accomplishments and progress for this task..."
            />
          </>
        )}
      </Box>

      {/* RIGHT – TIME + TICKET + U/R/C */}
      <Box
        sx={{
          bgcolor: "#3a3a3a",
          color: "#fff",
          width: "140px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          p: 1,
          pt: 1.5, // Push everything down slightly
        }}
      >
        {/* HH:MM – Moved down from top */}
        <Box sx={{ display: "flex", gap: 0.5, mt: 1 }}>
          <InputBase
            value={hours ?? ""}
            placeholder="HH"
            onChange={(e) => {
              const val = e.target.value;
              if (val === "") updateField("hours", "");
              else {
                const num = parseInt(val);
                if (!isNaN(num) && num >= 0 && num <= 24)
                  updateField("hours", num);
              }
            }}
            inputProps={{ min: 0, max: 24, style: { textAlign: "center" } }}
            sx={{
              bgcolor: "#fff",
              color: "#000",
              width: 36,
              height: 36,
              borderRadius: 1,
              fontWeight: 600,
              fontSize: "0.875rem",
              "& .MuiInputBase-input": { p: 0 },
            }}
          />
          <InputBase
            value={
              minutes !== undefined && minutes !== ""
                ? minutes.toString().padStart(2, "0")
                : ""
            }
            placeholder="MM"
            onChange={(e) => {
              const val = e.target.value;
              if (val === "") updateField("minutes", "");
              else {
                const num = parseInt(val);
                if (!isNaN(num) && num >= 0 && num <= 59)
                  updateField("minutes", num);
              }
            }}
            inputProps={{ min: 0, max: 59, style: { textAlign: "center" } }}
            sx={{
              bgcolor: "#fff",
              color: "#000",
              width: 36,
              height: 36,
              borderRadius: 1,
              fontWeight: 600,
              fontSize: "0.875rem",
              "& .MuiInputBase-input": { p: 0 },
            }}
          />
        </Box>

        {/* TICKET – Show only if ticketId exists, closer to buttons */}
        {/* TICKET + U/R/C — Grouped & pushed to bottom */}
        <Box
          sx={{
            mt: "auto", // Push to bottom
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2.4,
          }}
        >
          {/* Ticket ID */}

          {ticketId && (
            <Chip
              label={ticketId}
              sx={{
                bgcolor: "#000",
                color: "#fff",
                px: 1.5,
                py: 0.5,
                borderRadius: "999px",
                fontSize: "0.75rem",
                width: "100%",
                textAlign: "center",
                "& .MuiInputBase-input": { p: 0 },
              }}
            />
          )}

          {/* U/R/C Buttons */}
          <Box sx={{ display: "flex", gap: 0.5 }}>
            <IconButton
              size="small"
              sx={{
                bgcolor: colorCode,
                color: "#000",
                width: 28,
                height: 28,
                fontSize: "0.75rem",
                fontWeight: "bold",
                "&:hover": { filter: "brightness(0.9)" },
              }}
            >
              U
            </IconButton>
            {ticketId && (
              <>
                <IconButton
                  size="small"
                  sx={{
                    bgcolor: colorCode,
                    color: "#000",
                    width: 28,
                    height: 28,
                    fontSize: "0.75rem",
                    fontWeight: "bold",
                    "&:hover": { filter: "brightness(0.9)" },
                  }}
                >
                  R
                </IconButton>
                <IconButton
                  size="small"
                  sx={{
                    bgcolor: colorCode,
                    color: "#000",
                    width: 28,
                    height: 28,
                    fontSize: "0.75rem",
                    fontWeight: "bold",
                    "&:hover": { filter: "brightness(0.9)" },
                  }}
                >
                  C
                </IconButton>
              </>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
