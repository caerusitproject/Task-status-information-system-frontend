// src/components/TaskCard.jsx
import { useState, useEffect } from "react";
import { Box, Typography, IconButton, InputBase, Chip } from "@mui/material";
import TextareaAutosize from "react-textarea-autosize";
import { theme } from "../../theme/theme";
import AddIcon from "@mui/icons-material/Add";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Table,
  TableBody,
  TableRow,
  TableCell,
} from "@mui/material";

export default function TaskCard({ task: initialTask, debouncedSave }) {
  const [task, setTask] = useState(initialTask);
  //console.log("Tasks", task);
  useEffect(() => {
    setTask(initialTask);
  }, [initialTask]);

  const {
    id,
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

  const isIssue = taskType === "issue";
  const showResolution = isIssue && ["Resolved", "Completed"].includes(status);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [result, setResult] = useState("");
  // ── put this right after the other useState hooks ──
  useEffect(() => {
    const styleId = `ck-style-${taskId}`;
    const existing = document.getElementById(styleId);
    if (existing) existing.remove();

    const style = document.createElement("style");
    style.id = styleId;
    style.textContent = `
    #ck-wrapper-${taskId} .ck-editor__editable {
      background-color: ${colorCode} !important;
      min-height: 200px !important;
      padding: 12px !important;
    }
  `;
    document.head.appendChild(style);

    return () => {
      const el = document.getElementById(styleId);
      el?.remove();
    };
  }, [colorCode, taskId]);
  //const showC = // if its not ewua
  const textAreaRows = 8;

  const ticketDisplayValue = ticketId ? `Ticket : ${ticketId}` : "";
  const showFooter = ["Resolved", "Completed", "Updated"].includes(status);

  const showFooterUnderInvestigation =
    isIssue && ["Resolved", "Updated"].includes(status) && !!updatedDate;

  const showFooterUnderResolution =
    isIssue && status === "Completed" && !!updatedDate;

  const handleFieldChange = (field, value) => {
    const updated = { ...task, [field]: value };
    setTask(updated);
    debouncedSave(task.taskId, updated); // Pass camelCase updated
  };

  const handleStatus = (status) => {
    const updated = { ...task, status };
    setTask(updated);
    debouncedSave(task.taskId, updated); // Pass camelCase updated
  };
  const openQueryDialog = (setTask, task, debouncedSave) => {
    setQuery("");
    setResult("");
    setDialogOpen(true);
  };

  const handleSaveQuery = () => {
    const tableHtml = `
    <table border="1" style="width:100%; border-collapse: collapse; margin: 8px 0;">
      <tr><td style="padding:4px; background:#f0f0f0;"><strong>Query</strong></td></tr>
      <tr><td style="padding:4px;">${query.replace(/\n/g, "<br>")}</td></tr>
      <tr><td style="padding:4px; background:#f0f0f0;"><strong>Result</strong></td></tr>
      <tr><td style="padding:4px;">${result.replace(/\n/g, "<br>")}</td></tr>
    </table>
  `;

    // Append to current field (e.g., investigationRCA)
    const field = "investigationRCA"; // ← change per editor if needed
    const updated = { ...task, [field]: (task[field] || "") + tableHtml };

    setTask(updated);
    debouncedSave(task.taskId, updated);

    setDialogOpen(false);
  };
  return (
    <>
      <Box
        sx={{
          //backgroundColor: colorCode,
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
            //p: { xs: 1.5, md: 2 },
            pb: { xs: 1, md: 0 },
            minHeight: { xs: "120px", md: "auto" },
            display: "flex",
            flexDirection: "column",
            color: "#000",
            width: { xs: "100%", md: "auto" },
            overflow: "hidden",
          }}
        >
          {/* ---------- 1. Header strip (Investigation and RCA) ---------- */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              // backgroundColor: "#f5f5f5",
              padding: "8px 16px",
              borderRadius: "6px",
              m: 0.5,
              border: "1px solid #e0e0e0",
            }}
          >
            <Typography
              sx={{
                fontWeight: 600,
                fontSize: "0.875rem",
                color: "#f5f5f5",
              }}
            >
              Header Strip
            </Typography>

            <IconButton size="small" color="primary">
              <AddIcon fontSize="small" />
            </IconButton>
          </Box>

          {/* ---------- 2. The coloured content area ---------- */}
          <Box
            sx={{
              flex: 1,
              backgroundColor: colorCode, // colour starts here
              borderRadius: "6px",
              p: 1.5,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            {isIssue ? (
              <>
                {/* Always show Investigation & RCA */}
                <Typography
                  sx={{ fontWeight: 600, fontSize: "0.875rem", mb: 0.5 }}
                >
                  Investigation and RCA:
                </Typography>
                <Box id={`ck-wrapper-${taskId}`} sx={{ width: "100%" }}>
                  <CKEditor
                    editor={ClassicEditor}
                    data={investigationRCA || ""}
                    config={{
                      toolbar: [
                        "bold",
                        "italic",
                        "link",
                        "|",
                        "bulletedList",
                        "numberedList",
                      ],
                    }}
                    //                     onKeyDown={(event) => {
                    //                       console.log("event key down",event)
                    //           if (event.nativeEvent.ctrlKey && event.nativeEvent.key.toLowerCase() === "q") {
                    //             event.nativeEvent.preventDefault();
                    //             openQueryDialog(setTask, task, debouncedSave);
                    //           }
                    //         }}
                    //                     onReady={(editor) => {
                    //   editor.editing.view.document.on(
                    //     "keydown",
                    //     (evt, data) => {
                    //       console.log("CK key:", data.key, "ctrl?", data.ctrlKey);

                    //       if (data.ctrlKey && data.key.toLowerCase() === "q") {
                    //         data.preventDefault();
                    //         evt.stop();

                    //         openQueryDialog(setTask, task, debouncedSave);
                    //       }
                    //     },
                    //     { priority: "highest" }
                    //   );
                    // }}

                    onChange={(event, editor) => {
                      handleFieldChange("investigationRCA", editor.getData());
                    }}
                  />
                </Box>

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
                      hour12: true,
                    })}
                  </Box>
                )}

                {/* Show Resolution ONLY if status === "Resolved" or "Completed" */}
                {showResolution && (
                  <>
                    <Box
                      sx={{ borderTop: "1px solid rgba(0,0,0,0.7)", my: 1.5 }}
                    />
                    <Typography
                      sx={{ fontWeight: 600, fontSize: "0.875rem", mb: 0.5 }}
                    >
                      Resolution and steps taken to mitigate the issues:
                    </Typography>
                    <Box id={`ck-wrapper-${taskId}`} sx={{ width: "100%" }}>
                  <CKEditor
                    editor={ClassicEditor}
                     data={resolutions || ""}
                    config={{
                      toolbar: [
                        "bold",
                        "italic",
                        "link",
                        "|",
                        "bulletedList",
                        "numberedList",
                      ],
                    }}
                    //                     onKeyDown={(event) => {
                    //                       console.log("event key down",event)
                    //           if (event.nativeEvent.ctrlKey && event.nativeEvent.key.toLowerCase() === "q") {
                    //             event.nativeEvent.preventDefault();
                    //             openQueryDialog(setTask, task, debouncedSave);
                    //           }
                    //         }}
                    //                     onReady={(editor) => {
                    //   editor.editing.view.document.on(
                    //     "keydown",
                    //     (evt, data) => {
                    //       console.log("CK key:", data.key, "ctrl?", data.ctrlKey);

                    //       if (data.ctrlKey && data.key.toLowerCase() === "q") {
                    //         data.preventDefault();
                    //         evt.stop();

                    //         openQueryDialog(setTask, task, debouncedSave);
                    //       }
                    //     },
                    //     { priority: "highest" }
                    //   );
                    // }}

                    onChange={(event, editor) => {
                      handleFieldChange("investigationRCA", editor.getData());
                    }}
                  />
                </Box>
                    {/* <TextareaAutosize
                      value={resolutions || ""}
                      onChange={(e) =>
                        handleFieldChange("resolutions", e.target.value)
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
                      placeholder="Document the resolution steps and any measures taken to prevent recurrence..."
                    /> */}
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
                          hour12: true,
                        })}
                      </Box>
                    )}
                  </>
                )}
              </>
            ) : (
              <>
                <Typography
                  sx={{ fontWeight: 600, fontSize: "0.875rem", mb: 0.5 }}
                >
                  Daily Accomplishment:
                </Typography>
                <Box id={`ck-wrapper-${taskId}`} sx={{ width: "100%" }}>
                  <CKEditor
                    editor={ClassicEditor}
                     data={dailyAccomplishments || ""}
                    config={{
                      toolbar: [
                        "bold",
                        "italic",
                        "link",
                        "|",
                        "bulletedList",
                        "numberedList",
                      ],
                    }}
                    //                     onKeyDown={(event) => {
                    //                       console.log("event key down",event)
                    //           if (event.nativeEvent.ctrlKey && event.nativeEvent.key.toLowerCase() === "q") {
                    //             event.nativeEvent.preventDefault();
                    //             openQueryDialog(setTask, task, debouncedSave);
                    //           }
                    //         }}
                    //                     onReady={(editor) => {
                    //   editor.editing.view.document.on(
                    //     "keydown",
                    //     (evt, data) => {
                    //       console.log("CK key:", data.key, "ctrl?", data.ctrlKey);

                    //       if (data.ctrlKey && data.key.toLowerCase() === "q") {
                    //         data.preventDefault();
                    //         evt.stop();

                    //         openQueryDialog(setTask, task, debouncedSave);
                    //       }
                    //     },
                    //     { priority: "highest" }
                    //   );
                    // }}

                    onChange={(event, editor) => {
                      handleFieldChange("investigationRCA", editor.getData());
                    }}
                  />
                </Box>
               
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
                      hour12: true,
                    })}
                  </Box>
                )}
              </>
            )}
          </Box>
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
            sx={{
              display: "flex",
              gap: 0.5,
              justifyContent: "center",
              mt: 0.5,
            }}
          >
            <InputBase
              value={hours ?? ""}
              placeholder="HH"
              onChange={(e) => {
                const v = e.target.value;
                const n = v === "" ? "" : parseInt(v);
                if (v === "" || (!isNaN(n) && n >= 0 && n <= 24)) {
                  handleFieldChange("hours", n);
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
              placeholder="MM"
              value={
                task.minutes != null
                  ? String(task.minutes).padStart(2, "0")
                  : ""
              }
              onChange={(e) => {
                const v = e.target.value;
                const n = v === "" ? "" : parseInt(v);
                if (v === "" || (!isNaN(n) && n >= 0 && n <= 59)) {
                  handleFieldChange("minutes", n);
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
                  onClick={() => handleStatus("Updated")}
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
                    onClick={() => handleStatus("Resolved")}
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
                      onClick={() => handleStatus("Completed")}
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

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add Query & Result</DialogTitle>
        <DialogContent>
          <TextField
            label="Query (SQL)"
            multiline
            rows={4}
            fullWidth
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            sx={{ mt: 1 }}
          />
          <TextField
            label="Result"
            multiline
            rows={4}
            fullWidth
            value={result}
            onChange={(e) => setResult(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveQuery} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
