// src/components/TaskCard.jsx
import { useState } from "react";
import { Box, Typography, IconButton, InputBase, Chip } from "@mui/material";
import TextareaAutosize from "react-textarea-autosize";
import { theme } from "../../theme/theme";

export default function TaskCard({ task: initialTask }) {
  const [task, setTask] = useState(initialTask);
  console.log("Tasks", task);

  const {
    taskId,
    colorCode,
    taskType,
    status,
    ticketId,
    sr_no,
    hours,
    minutes,
    dailyAccomplishments,
    investigationRCA,
    resolutions,
    updatedDate,
  } = task;

  const isIssue = taskType.toLowerCase() === "issue";
  const showResolution = isIssue && ["Resolved", "Completed"].includes(status);

  //const showC = // if its not ewua
  const textAreaRows = 4;

  const updateField = (field, value) => {
    setTask((prev) => ({ ...prev, [field]: value }));
  };

  const ticketDisplayValue = ticketId ? `Ticket : ${ticketId}` : "";
  const showFooter = ["Resolved", "Completed", "Updated"].includes(status);

  const showFooterUnderInvestigation =
    isIssue && status === "Resolved" && !!updatedDate;

  const showFooterUnderResolution =
    isIssue && status === "Completed" && !!updatedDate;

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
        flexDirection: { xs: "column", md: "row" }, // ← Stack on mobile
        gap: { xs: 0, md: 0 },
      }}
    >
      {/* LEFT – TASK ID (Only show if ticket exists) */}
      <Box
        sx={{
          bgcolor: "#2d2d2d",
          color: "#fff",
          width: { xs: "100%", md: "120px" },
          minHeight: { xs: "80px", md: "auto" },
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          p: 1,
        }}
      >
        {ticketId && taskType !== "ticket_less" && (
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
          flex: { xs: "1", md: 2 },
          p: { xs: 1.5, md: 2 },
          pb: { xs: 1, md: 0 },
          minHeight: { xs: "120px", md: "auto" },
          display: "flex",
          flexDirection: "column",
          color: "#000",
          width: { xs: "100%", md: "auto" },
          backgroundColor: colorCode,
          overflow: "hidden",
        }}
      >
        {isIssue ? (
          <>
            {/* Always show Investigation & RCA */}
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
              }}
              placeholder="Describe the investigation findings and the root cause of the issue..."
            />
            {showFooterUnderInvestigation && showFooter && updatedDate && (
              <Box
                sx={{
                  mt: 1,
                  textAlign: "right",
                  fontSize: "0.75rem",
                  color: "rgba(0,0,0,0.6)",
                  fontStyle: "italic",
                }}
              >
                {status} at{" "}
                {new Date(updatedDate).toLocaleString(undefined, {
                  hour: "2-digit",
                  minute: "2-digit",
                  month: "short",
                  day: "numeric",
                })}
              </Box>
            )}

            {/* Show Resolution ONLY if status === "Resolved" */}
            {showResolution && (
              <>
                <Box sx={{ borderTop: "1px solid rgba(0,0,0,0.7)", my: 1.5 }} />
                <Typography
                  sx={{ fontWeight: 600, fontSize: "0.875rem", mb: 0.5 }}
                >
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
                {showFooterUnderResolution && showFooter && updatedDate && (
                  <Box
                    sx={{
                      mb: 1,
                      textAlign: "right",
                      fontSize: "0.75rem",
                      color: "rgba(0,0,0,0.6)",
                      fontStyle: "italic",
                    }}
                  >
                    {status} at{" "}
                    {new Date(updatedDate).toLocaleString(undefined, {
                      hour: "2-digit",
                      minute: "2-digit",
                      month: "short",
                      day: "numeric",
                    })}
                  </Box>
                )}
              </>
            )}
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
            {updatedDate && showFooter && (
              <Box
                sx={{
                  mt: 1,
                  textAlign: "right",
                  fontSize: "0.75rem",
                  color: "rgba(0,0,0,0.6)",
                  fontStyle: "italic",
                }}
              >
                {status} at{" "}
                {new Date(updatedDate).toLocaleString(undefined, {
                  hour: "2-digit",
                  minute: "2-digit",
                  month: "short",
                  day: "numeric",
                })}
              </Box>
            )}
          </>
        )}
      </Box>

      {/* RIGHT – TIME + TICKET + U/R/C */}
      <Box
        sx={{
          bgcolor: "#3a3a3a",
          color: "#fff",
          width: { xs: "100%", md: "200px" },
          minHeight: { xs: "160px", md: "auto" },
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between", // push bottom section to bottom
          p: 1.5,
        }}
      >
        {/* HH:MM Section */}
        <Box
          sx={{ display: "flex", gap: 0.5, justifyContent: "center", mt: 0.5 }}
        >
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

        {/* SR + Ticket + URC Buttons */}
        <Box
          sx={{
            mt: 2,
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            flexGrow: 1,
            justifyContent: "flex-end", // keep bottom-aligned
            gap: 0.5,
          }}
        >
          {/* SR Number Chip */}
          {isIssue && task.sr_no && (
            <Chip
              label={`SR: ${task.sr_no}`}
              sx={{
                bgcolor: "#1a1a1a",
                color: "#fff",
                px: 1.5,
                py: 0.5,
                borderRadius: "999px",
                fontSize: "0.7rem",
                fontWeight: 600,
                maxWidth: "100%",
                width: "fit-content",
                mx: "auto",
                mb: 0.5,
              }}
            />
          )}

          {/* Ticket + U/R/C Group */}

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 0.6, // keep Ticket and Buttons close
            }}
          >
            {ticketId && taskType !== "ticket_less" && (
              <Chip
                label={ticketId}
                sx={{
                  bgcolor: "#000",
                  color: "#fff",
                  px: 1.5,
                  py: 0.5,
                  borderRadius: "999px",
                  fontSize: "0.75rem",
                  maxWidth: "100%",
                  width: "fit-content",
                  mx: "auto",
                }}
              />
            )}

            <Box sx={{ display: "flex", gap: 3, mt: 0.2 }}>
              {/* U */}
              <IconButton
                size="small"
                sx={{
                  bgcolor: colorCode,
                  color: "#000",
                  width: 36,
                  height: 36,
                  fontSize: "0.875rem",
                  fontWeight: "bold",
                  borderRadius: 1,
                  transition: "all 0.2s",
                  "&:hover": {
                    bgcolor: "#fff",
                    color: "#000",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                  },
                }}
              >
                U
              </IconButton>

              {/* R */}
              {ticketId && isIssue && (
                <IconButton
                  size="small"
                  sx={{
                    bgcolor: colorCode,
                    color: "#000",
                    width: 36,
                    height: 36,
                    fontSize: "0.875rem",
                    fontWeight: "bold",
                    borderRadius: 1,
                    transition: "all 0.2s",
                    "&:hover": {
                      bgcolor: "#fff",
                      color: "#000",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                    },
                  }}
                >
                  R
                </IconButton>
              )}

              {/* C */}
              {ticketId &&
                taskType !== "ticket_less" &&
                (!isIssue || ["Resolved", "Completed"].includes(status)) &&
                !(isIssue && task.sr_no?.trim()) && (
                  <IconButton
                    size="small"
                    sx={{
                      bgcolor: colorCode,
                      color: "#000",
                      width: 36,
                      height: 36,
                      fontSize: "0.875rem",
                      fontWeight: "bold",
                      borderRadius: 1,
                      transition: "all 0.2s",
                      "&:hover": {
                        bgcolor: "#fff",
                        color: "#000",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                      },
                    }}
                  >
                    C
                  </IconButton>
                )}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
