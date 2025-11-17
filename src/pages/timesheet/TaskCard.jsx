// src/components/TaskCard.jsx
import { useState, useEffect } from "react";
import { Box, Typography, IconButton, InputBase, Chip } from "@mui/material";
import TextareaAutosize from "react-textarea-autosize";
import { theme } from "../../theme/theme";
import AddIcon from "@mui/icons-material/Add";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import TaskHeaderStrip from "./TaskHeaderStrip";
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

export default function TaskCard({ task: initialTask, date, debouncedSave }) {
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
  console.log(task)

  const isIssue = taskType === "issue";
  const showResolution = isIssue && ["Resolved", "Completed"].includes(status);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [result, setResult] = useState("");
  const [showError, setShowError] = useState(false);
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

  /* FORCE FULL WIDTH TABLE */
  #ck-wrapper-${taskId} .ck-editor__editable table {
    width: 100% !important;
    min-width: 100% !important;
    table-layout: fixed !important;
  }

  #ck-wrapper-${taskId} .ck-editor__editable table td {
    width: auto !important;
    word-break: break-word;
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
    setShowError(false);
    setDialogOpen(true);
  };

  const onHeaderChange = (newSel) => {
    // If you need to do something else when header changes
    // e.g. console.log("Header changed:", newSel);
  };

  const handleSaveQuery = () => {
    const tableHtml = `
<table border="1" style="width:100% !important; min-width:100% !important; border-collapse: collapse; margin: 12px 0;">
      <tr><td style="padding:8px; background:#f0f0f0;"><strong>Query</strong></td></tr>
      <tr><td style="padding:8px;">${query.replace(/\n/g, "<br>")}</td></tr>
      <tr><td style="padding:8px; background:#f0f0f0;"><strong>Result</strong></td></tr>
      <tr><td style="padding:8px;">${result.replace(/\n/g, "<br>")}</td></tr>
    </table>
    <p></p>
  `;

    // Determine which field we are editing
    const field = isIssue ? "investigationRCA" : "dailyAccomplishments";
    const currentContent = task[field] || "";

    // Append the table HTML
    const newContent = currentContent + tableHtml;

    // Update React state (this will update CKEditor content)
    const updatedTask = { ...task, [field]: newContent };
    setTask(updatedTask);
    debouncedSave(task.taskId, updatedTask);

    // ——— THE IMPORTANT PART: move cursor after the table ———
    // correct cursor placement
    setTimeout(() => {
      const editor = window.lastActiveEditor;
      if (!editor) return;

      editor.model.change((writer) => {
        const endPos = writer.createPositionAt(
          editor.model.document.getRoot(),
          "end"
        );

        const paragraph = writer.createElement("paragraph");
        writer.insert(paragraph, endPos);
        writer.setSelection(paragraph, 0);
      });

      editor.editing.view.focus();
    }, 50);

    setQuery("");
    setResult("");
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
          <TaskHeaderStrip
            taskId={task.taskId}
            date={date}
            initialSelections={task.headerSelections || {}}
            onHeaderChange={onHeaderChange}
            debouncedSave={debouncedSave}
            colorCode={colorCode}
          />

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
                    onReady={(editor) => {
                      // Keep track of the last focused editor
                      editor.editing.view.document.on("focus", () => {
                        window.lastActiveEditor = editor;
                      });

                      // Your existing Ctrl+Q code
                      editor.editing.view.document.on(
                        "keydown",
                        (evt, data) => {
                          if (data.ctrlKey || data.metaKey) {
                            if (data.keyCode === 81) {
                              data.preventDefault();
                              evt.stop();
                              openQueryDialog();
                            }
                          }
                        },
                        { priority: "highest" }
                      );
                    }}
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
                        onReady={(editor) => {
                          // Keep track of the last focused editor
                          editor.editing.view.document.on("focus", () => {
                            window.lastActiveEditor = editor;
                          });

                          // Your existing Ctrl+Q code
                          editor.editing.view.document.on(
                            "keydown",
                            (evt, data) => {
                              if (data.ctrlKey || data.metaKey) {
                                if (data.keyCode === 81) {
                                  data.preventDefault();
                                  evt.stop();
                                  openQueryDialog();
                                }
                              }
                            },
                            { priority: "highest" }
                          );
                        }}
                        onChange={(event, editor) => {
                          handleFieldChange("resolutions", editor.getData());
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
                    onReady={(editor) => {
                      // Keep track of the last focused editor
                      editor.editing.view.document.on("focus", () => {
                        window.lastActiveEditor = editor;
                      });

                      // Your existing Ctrl+Q code
                      editor.editing.view.document.on(
                        "keydown",
                        (evt, data) => {
                          if (data.ctrlKey || data.metaKey) {
                            if (data.keyCode === 81) {
                              data.preventDefault();
                              evt.stop();
                              openQueryDialog();
                            }
                          }
                        },
                        { priority: "highest" }
                      );
                    }}
                    onChange={(event, editor) => {
                      handleFieldChange(
                        "dailyAccomplishments",
                        editor.getData()
                      );
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
            { sr_no && (
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
        PaperProps={{
          sx: {
            bgcolor: "#1e1e1e",
            color: "#fff",
            borderRadius: 3,
            boxShadow: "0 16px 60px rgba(0,0,0,0.7)",
            border: "1px solid rgba(255,255,255,0.08)",
            overflow: "hidden",
          },
        }}
      >
        {/* <DialogTitle
    sx={{
      bgcolor: theme.colors.primary || "#0066ff",
      color: "#fff",
      py: 2,
      textAlign: "center",
      fontWeight: 600,
      fontSize: "1.25rem",
    }}
  >
    Add Query & Result
  </DialogTitle> */}

        <DialogContent sx={{ pt: 4, pb: 2, px: 3 }}>
          {/* Query Field */}
          <TextField
            autoFocus
            label="Query (SQL / Logic)"
            required
            multiline
            rows={5}
            fullWidth
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            // Only show error + message after failed attempt
            error={showError && !query.trim()}
            helperText={showError && !query.trim() ? "Query is required" : " "}
            InputLabelProps={{ style: { color: "#ccc" } }}
            InputProps={{ style: { color: "#fff" } }}
            sx={{
              mb: 3,
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                bgcolor: "rgba(255,255,255,0.05)",
                "& fieldset": { borderColor: "rgba(255,255,255,0.2)" },
                "&:hover fieldset": { borderColor: "rgba(255,255,255,0.4)" },
                "&.Mui-focused fieldset": {
                  borderColor: theme.colors.primary || "#0066ff",
                },
                "&.Mui-error fieldset": { borderColor: "#ff6b6b" }, // red only when error
              },
              "& .MuiFormHelperText-root": {
                color: "#ff6b6b", // red message
                fontSize: "0.8rem",
              },
            }}
          />

          {/* Result Field */}
          <TextField
            label="Result / Observation"
            required
            multiline
            rows={5}
            fullWidth
            value={result}
            onChange={(e) => setResult(e.target.value)}
            error={showError && !result.trim()}
            helperText={
              showError && !result.trim() ? "Result is required" : " "
            }
            InputLabelProps={{ style: { color: "#ccc" } }}
            InputProps={{ style: { color: "#fff" } }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                bgcolor: "rgba(255,255,255,0.05)",
                "& fieldset": { borderColor: "rgba(255,255,255,0.2)" },
                "&:hover fieldset": { borderColor: "rgba(255,255,255,0.4)" },
                "&.Mui-focused fieldset": {
                  borderColor: theme.colors.primary || "#0066ff",
                },
                "&.Mui-error fieldset": { borderColor: "#ff6b6b" },
              },
              "& .MuiFormHelperText-root": {
                color: "#ff6b6b",
                fontSize: "0.8rem",
              },
            }}
          />
        </DialogContent>

        <DialogActions
          sx={{ px: 3, pb: 4, justifyContent: "flex-end", gap: 2 }}
        >
          <Button
            onClick={() => setDialogOpen(false)}
            style={{
              padding: "0.5rem 1.5rem",
              border: `0.0625rem solid ${theme.colors.lightGray}`,
              backgroundColor: theme.colors.surface,
              color: theme.colors.text.secondary,
              borderRadius: "0.375rem",
              fontSize: "0.875rem",
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            Cancel
          </Button>

          <Button
            onClick={() => {
              // Trigger validation only when clicking Insert
              if (!query.trim() || !result.trim()) {
                setShowError(true);
                return;
              }
              handleSaveQuery();
            }}
            style={{
              padding: "0.5rem 1.5rem",
              backgroundColor: theme.colors.primary,
              color: theme.colors.white,
              border: "none",
              borderRadius: "0.375rem",
              fontSize: "0.875rem",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
