// TaskForm.jsx
import { useState, useRef, useEffect } from "react";
import { Plus, ChevronDown, X } from "lucide-react";
import {
  Box,
  Typography,
  TextField,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tabs,
  Tab,
} from "@mui/material";
import Alert from "../../components/common/Alert";
import { theme } from "../../theme/theme";
import TaskCard from "./TaskCard";
import ColorPickerDialog from "./ColorPickerDialog";
import { getWeekTasks } from "./mockApi";
import { isSameDay } from "date-fns";
import WeekDropdown from "./WeekDropdown";
export default function TaskForm() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [taskType, setTaskType] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const colorDropdownRef = useRef(null);
  const colorButtonRef = useRef(null);
  const [colorOpen, setColorOpen] = useState(false);
  const [formData, setFormData] = useState({
    requestedBy: "",
    description: "",
    ticketId: "",
    srNo: "",
    status: "Reported",
    color: "",
  });
  const today = new Date();
  const [errors, setErrors] = useState({});
  //const [todayTasks, setTodayTasks] = useState([]); // <-- NEW
  const [colorDlgOpen, setColorDlgOpen] = useState(false); // <-- NEW
  //const TODAY = "2025-11-10";
  const [weekData, setWeekData] = useState({ week: [] }); // NEW: holds all days
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }

    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]); // Re-run when menu opens/closes

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        colorDropdownRef.current &&
        !colorDropdownRef.current.contains(event.target) &&
        colorButtonRef.current &&
        !colorButtonRef.current.contains(event.target)
      ) {
        setColorOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  useEffect(() => {
    const data = getWeekTasks();
    const todayStr = new Date().toISOString().split("T")[0]; // e.g., "2025-11-10"

    let updatedWeek = [...data.week];

    // If today is not in API response → add it with empty tasks
    if (!updatedWeek.some((d) => d.date === todayStr)) {
      updatedWeek.push({ date: todayStr, tasks: [] });
    }

    // Sort descending: today first, then older days
    updatedWeek.sort((a, b) => b.date.localeCompare(a.date));

    setWeekData({ week: updatedWeek });
  }, []);

  const colors = [
    "#fcde72", // yellow
    "#ff9c68", // orange
    "#7fc0ff", // blue
    "#ffcccc", // red
    "#fcd05b", // yellow
    "#e0caebff", // purple
    "#ffb07a", // orange
    "#99ffe0", // green
    "#f3d27fff", // yellow
    "#ff7f7f", // red
    "#b3d6ff", // blue
    "#e1b5fdbb", // purple
    "#faca34", // yellow
    "#ffb988", // orange
    "#ccfff7", // green
    "#ff9999", // red
    "#cce6ff", // blue
    "#ffb3b3", // red
    "#7fffd4", // green
    "#ffc199", // orange
    "#d7aefc", // purple
    "#99ccff", // blue
    // purple
  ];
  const handleAddTask = (color) => {
    const today = new Date().toISOString().split("T")[0]; // e.g., "2025-11-10"
    const newTask = {
      id: Date.now(),
      taskId: `NA-${String(Date.now()).slice(-3)}`,
      hours: 0,
      minutes: 0,
      ticketId: null,
      colorCode: color,
      taskType: "New assignment",
      status: "In Progress",
      updatedDate: new Date().toISOString(),
      dailyAccomplishments: "",
    };

    setWeekData((prev) => ({
      week: prev.week.map((day) =>
        day.date === today ? { ...day, tasks: [...day.tasks, newTask] } : day
      ),
    }));
  };

  const statusOptions = [
    "Reported",
    "New",
    "In Progress",
    "On Hold",
    "Resolved",
    "Completed",
  ];
  const formConfig = {
    assignment: {
      title: "Assignment",
      label1: "Requested By",
      label2: "Description",
      showSrNo: false,
    },
    change_request: {
      title: "Change Request",
      label1: "Requested By",
      label2: "Description",
      showSrNo: false,
    },
    issue: {
      title: "New Issue",
      label1: "Reported By",
      label2: "Statement of the Issue",
      showSrNo: true,
    },
  };
  const config = formConfig[taskType];

  const validateField = (name, value) => {
    const newErrors = { ...errors };
    delete newErrors[name];
    if (
      name === "requestedBy" ||
      name === "description" ||
      name === "ticketId"
    ) {
      if (!value) {
        newErrors[name] = "This field is required.";
      } else if (value.length < 3) {
        newErrors[name] = "Minimum 3 characters required.";
      } else if (!/^[a-zA-Z0-9\s]+$/.test(value)) {
        newErrors[name] = "Only alphanumeric and spaces allowed.";
      }
    }
    setErrors(newErrors);
  };

  const validateForm = () => {
    const newErrors = {};
    const fields = ["requestedBy", "description", "ticketId"];
    fields.forEach((field) => {
      const value = formData[field];
      if (!value) {
        newErrors[field] = "This field is required.";
      } else if (value.length < 3) {
        newErrors[field] = "Minimum 3 characters required.";
      } else if (!/^[a-zA-Z0-9\s]+$/.test(value)) {
        newErrors[field] = "Only alphanumeric and spaces allowed.";
      }
    });
    if (!formData.color) {
      newErrors.color = "Color is required.";
    }
    if (!formData.status) {
      newErrors.status = "Status is required.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleMenuSelect = (type) => {
    setTaskType(type);
    setMenuOpen(false);
    setFormOpen(true);
    setFormData({
      requestedBy: "",
      description: "",
      ticketId: "",
      srNo: "",
      status: "Reported",
      color: "",
    });
    setErrors({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const handleColorSelect = (color) => {
    setFormData((prev) => ({ ...prev, color }));
    setColorOpen(false);
  };

  const handleSave = async () => {
    if (!validateForm()) {
      alert("Please fix the errors before saving.");
      return;
    }
    try {
      const payload = {
        type: taskType,
        ...formData,
      };
      console.log("Saving task:", payload);
      await new Promise((resolve) => setTimeout(resolve, 500));
      alert("Task saved successfully!");
      setFormOpen(false);
      setTaskType(null);
    } catch (error) {
      alert("Error saving task!");
    }
  };

  const handleCancel = () => {
    setFormOpen(false);
    setTaskType(null);
    setErrors({});
    setColorOpen(false);
  };

  const inputStyle = {
    width: "100%",
    padding: "0.75rem",
    fontSize: "1rem",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    border: `0.1rem solid ${theme.colors.lightGray}`,
    borderRadius: "0.5rem",
    backgroundColor: theme.colors.background,
    transition: "all 0.2s ease",
    boxSizing: "border-box",
    outline: "none",
    color: theme.colors.text.primary,
  };

  const requiredStar = (
    <span style={{ color: theme.colors.error, fontWeight: "bold" }}>*</span>
  );

  return (
    <div>
      {/* Header + Create Button */}
      {/* <div>
          <h1
            style={{
              margin: 0,
              color: theme.colors.text.primary,
              fontSize: "2rem",
              fontWeight: "700",
            }}
          >
            Task Management
          </h1>
          <p
            style={{
              margin: "0.5rem 0 0 0",
              color: theme.colors.text.secondary,
              fontSize: "0.95rem",
            }}
          >
            Manage and track your tasks efficiently
          </p>
        </div> */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: theme.spacing.sm,
          width: "100%",
          flexWrap: isMobile ? "wrap" : "nowrap", // wrap on mobile
          flexDirection: isMobile ? "column" : "row", // stack on mobile
          gap: theme.spacing.md,
        }}
      >
        <WeekDropdown />
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
              padding: "0.75rem 2rem",
              backgroundColor: theme.colors.primary,
              color: theme.colors.white,
              border: "none",
              borderRadius: "0.5rem",
              fontSize: "1rem",
              fontWeight: 600,
              cursor: "pointer",
              boxShadow: theme.shadows.small,
              transition: theme.transitions.fast,
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
              {["New Assignment", "Issue", "Change Request"].map(
                (item, idx) => (
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
                )
              )}
            </div>
          )}
        </Box>
      </div>

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
        {colors.map((color, idx) => (
          <div
            key={idx}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.1rem",
            }}
          >
            <div
              style={{
                width: "4.75rem",
                height: "3rem",
                backgroundColor: color,
                borderRadius: "0.4rem",
                border: `0.0625rem solid #92909065`,
              }}
            />
          </div>
        ))}
      </div>
      {/* Empty State */}
      {!formOpen && (
        <div style={{ position: "relative" }}>
          {weekData.week.map((day) => (
            <Box
              key={day.date}
              sx={{
                position: "relative",
                // pl: "3.5rem",
                mb: 4, // Space between days
                borderRadius: "0.75rem",
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0.05))",
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.2)",
                boxShadow:
                  "0 8px 32px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.3)",
                padding: "1.5rem 3.5rem ",
              }}
            >
              {/* LEFT COLUMN – Date + "+" button */}
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  width: "3rem",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "1rem 0",
                  paddingTop: "4rem",
                }}
              >
                {/* Vertical Date - Bigger Font */}
                <div
                  style={{
                    writingMode: "vertical-rl",
                    textOrientation: "mixed",
                    fontSize: "1rem", // Bigger than before
                    fontWeight: 600,
                    color: theme.colors.text.primary,
                    letterSpacing: "0.05em",
                    transform: "rotate(180deg)", // Makes it read top-to-bottom
                  }}
                >
                  {/* Vertical Date */}
                  <Typography
                    sx={{
                      //writingMode: "vertical-rl",
                      textOrientation: "mixed",
                      fontSize: "1rem",
                      fontWeight: 600,
                      color: theme.colors.text.primary,
                      //transform: "rotate(360deg)",
                    }}
                  >
                    {new Date(day.date)
                      .toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })
                      .toUpperCase()}
                  </Typography>
                </div>

                {/* "+" Button */}
                {day.date === new Date().toISOString().split("T")[0] && (
                  <IconButton
                    onClick={() => setColorDlgOpen(true)}
                    sx={{
                      width: 40,
                      height: 40,
                      bgcolor: theme.colors.primary,
                      color: "#fff",
                      "&:hover": { bgcolor: theme.colors.primaryDark },
                    }}
                  >
                    <Plus size={24} />
                  </IconButton>
                )}
              </div>

              {/* MAIN CARD AREA – All Tasks for This Day */}
              <Box sx={{ minHeight: 180 }}>
                {day.tasks.length === 0 ? (
                  <Box
                    sx={{
                      minHeight: 180,
                      border: "0.0625rem dashed #d0d0d0",
                      borderRadius: 2,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#777",
                      fontStyle: "italic",
                    }}
                  >
                    Please add today’s task
                  </Box>
                ) : (
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 0 }}
                  >
                    {day.tasks.map((task, index) => (
                      <Box
                        key={task.id}
                        sx={{
                          borderBottom:
                            index !== day.tasks.length - 1
                              ? "2px solid #fff"
                              : "none",
                        }}
                      >
                        <TaskCard task={task} date={day.date} />
                      </Box>
                    ))}
                  </Box>
                )}
              </Box>
            </Box>
          ))}
        </div>
      )}

      {/* Form Dialog */}
      {formOpen && config && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 50,
            padding: "1rem",
          }}
        >
          <div
            style={{
              backgroundColor: theme.colors.surface,
              borderRadius: "0.75rem",
              boxShadow: theme.shadows.large,
              border: `0.0625rem solid ${theme.colors.lightGray}`,
              maxWidth: "31.25rem",
              width: "100%",
              maxHeight: "90vh",
              overflowY: "auto",
              fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            }}
          >
            {/* Header */}
            <div
              style={{
                borderBottom: `0.0625rem solid ${theme.colors.lightGray}`,
                padding: "0.625rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                position: "sticky",
                top: 0,
                backgroundColor: theme.colors.surface,
                zIndex: 1,
              }}
            >
              <h3
                style={{
                  fontSize: "1.25rem",
                  fontWeight: 600,
                  color: theme.colors.text.primary,
                  margin: 0,
                }}
              >
                {config.title}
              </h3>
              <button
                onClick={handleCancel}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: theme.colors.text.secondary,
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div style={{ padding: "1.5rem" }}>
              {/* Requested By / Reported By */}
              <div style={{ marginBottom: "1rem" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    color: theme.colors.text.secondary,
                    marginBottom: "0.5rem",
                  }}
                >
                  {config.label1} {requiredStar}
                </label>
                <input
                  type="text"
                  name="requestedBy"
                  value={formData.requestedBy}
                  onChange={handleInputChange}
                  style={inputStyle}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = theme.colors.primary;
                    e.currentTarget.style.borderWidth = "0.125rem";
                    e.currentTarget.style.backgroundColor =
                      theme.colors.surface;
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = theme.colors.lightGray;
                    e.currentTarget.style.borderWidth = "0.1rem";
                    e.currentTarget.style.backgroundColor =
                      theme.colors.background;
                  }}
                />
                {errors.requestedBy && (
                  <p
                    style={{
                      color: theme.colors.error,
                      fontSize: "0.75rem",
                      margin: "0.25rem 0 0 0",
                    }}
                  >
                    {errors.requestedBy}
                  </p>
                )}
              </div>

              {/* Description / Statement */}
              <div style={{ marginBottom: "1rem" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    color: theme.colors.text.secondary,
                    marginBottom: "0.5rem",
                  }}
                >
                  {config.label2} {requiredStar}
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  style={{
                    ...inputStyle,
                    resize: "vertical",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = theme.colors.primary;
                    e.currentTarget.style.borderWidth = "0.125rem";
                    e.currentTarget.style.backgroundColor =
                      theme.colors.surface;
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = theme.colors.lightGray;
                    e.currentTarget.style.borderWidth = "0.1rem";
                    e.currentTarget.style.backgroundColor =
                      theme.colors.background;
                  }}
                />
                {errors.description && (
                  <p
                    style={{
                      color: theme.colors.error,
                      fontSize: "0.75rem",
                      margin: "0.25rem 0 0 0",
                    }}
                  >
                    {errors.description}
                  </p>
                )}
              </div>

              {/* Ticket ID */}
              <div style={{ marginBottom: "1rem" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    color: theme.colors.text.secondary,
                    marginBottom: "0.5rem",
                  }}
                >
                  Ticket ID {requiredStar}
                </label>
                <input
                  type="text"
                  name="ticketId"
                  value={formData.ticketId}
                  onChange={handleInputChange}
                  style={inputStyle}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = theme.colors.primary;
                    e.currentTarget.style.borderWidth = "0.125rem";
                    e.currentTarget.style.backgroundColor =
                      theme.colors.surface;
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = theme.colors.lightGray;
                    e.currentTarget.style.borderWidth = "0.1rem";
                    e.currentTarget.style.backgroundColor =
                      theme.colors.background;
                  }}
                />
                {errors.ticketId && (
                  <p
                    style={{
                      color: theme.colors.error,
                      fontSize: "0.75rem",
                      margin: "0.25rem 0 0 0",
                    }}
                  >
                    {errors.ticketId}
                  </p>
                )}
              </div>

              {/* SR No (only for Issue) */}
              {config.showSrNo && (
                <div style={{ marginBottom: "1rem" }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.875rem",
                      fontWeight: 500,
                      color: theme.colors.text.secondary,
                      marginBottom: "0.5rem",
                    }}
                  >
                    SR No. (Optional)
                  </label>
                  <input
                    type="text"
                    name="srNo"
                    value={formData.srNo}
                    onChange={handleInputChange}
                    style={inputStyle}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = theme.colors.primary;
                      e.currentTarget.style.borderWidth = "0.125rem";
                      e.currentTarget.style.backgroundColor =
                        theme.colors.surface;
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor =
                        theme.colors.lightGray;
                      e.currentTarget.style.borderWidth = "0.1rem";
                      e.currentTarget.style.backgroundColor =
                        theme.colors.background;
                    }}
                  />
                </div>
              )}

              {/* Status & Color - Stacked in Mobile */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                  gap: "1rem",
                }}
              >
                {/* Status */}
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.875rem",
                      fontWeight: 500,
                      color: theme.colors.text.secondary,
                      marginBottom: "0.5rem",
                    }}
                  >
                    Status {requiredStar}
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        status: e.target.value,
                      }))
                    }
                    style={{
                      ...inputStyle,
                      cursor: "pointer",
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = theme.colors.primary;
                      e.currentTarget.style.borderWidth = "0.125rem";
                      e.currentTarget.style.backgroundColor =
                        theme.colors.surface;
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor =
                        theme.colors.lightGray;
                      e.currentTarget.style.borderWidth = "0.1rem";
                      e.currentTarget.style.backgroundColor =
                        theme.colors.background;
                    }}
                  >
                    {statusOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                  {errors.status && (
                    <p
                      style={{
                        color: theme.colors.error,
                        fontSize: "0.75rem",
                        margin: "0.25rem 0 0 0",
                      }}
                    >
                      {errors.status}
                    </p>
                  )}
                </div>

                {/* Color Selector */}
                <div style={{ position: "relative" }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.875rem",
                      fontWeight: 500,
                      color: theme.colors.text.secondary,
                      marginBottom: "0.5rem",
                    }}
                  >
                    Color {requiredStar}
                  </label>
                  <button
                    ref={colorButtonRef}
                    onClick={() => setColorOpen(!colorOpen)}
                    style={{
                      ...inputStyle,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      cursor: "pointer",
                      color: formData.color
                        ? theme.colors.text.primary
                        : theme.colors.text.secondary,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor =
                        theme.colors.mediumGray;
                      e.currentTarget.style.backgroundColor =
                        theme.colors.lightGray;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor =
                        theme.colors.lightGray;
                      e.currentTarget.style.backgroundColor =
                        theme.colors.background;
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                      }}
                    >
                      {formData.color && (
                        <div
                          style={{
                            height: "1rem",
                            width: "1rem",
                            backgroundColor: formData.color,
                            borderRadius: "0.125rem",
                            border: "0.0625rem solid rgba(255,255,255,0.3)",
                          }}
                        />
                      )}
                      <span style={{ fontSize: "0.875rem" }}>
                        {formData.color ? "Selected" : "Select Color"}
                      </span>
                    </div>
                    <ChevronDown size={16} />
                  </button>

                  {colorOpen && (
                    <div
                      ref={colorDropdownRef}
                      style={{
                        position: "absolute",
                        top: "100%",
                        left: 0,
                        right: 0,
                        marginTop: "0.5rem",
                        backgroundColor: theme.colors.surface,
                        border: `1px solid ${theme.colors.lightGray}`,
                        borderRadius: "0.5rem",
                        boxShadow: theme.shadows.large,
                        padding: "0.75rem",
                        zIndex: 1003,
                        display: "grid",
                        gridTemplateColumns: "repeat(4, 1fr)",
                        gap: "0.5rem",
                        maxHeight: "12rem",
                        overflowY: "auto",
                      }}
                    >
                      {colors.map((color) => (
                        <button
                          key={color}
                          onClick={() => handleColorSelect(color)}
                          style={{
                            aspectRatio: "1",
                            backgroundColor: color,
                            border:
                              formData.color === color
                                ? "0.2rem solid #fff"
                                : "0.0625rem solid #fff",
                            borderRadius: "0.4rem",
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                            boxShadow:
                              formData.color === color
                                ? "0 0 0 0.125rem #000"
                                : "none",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = "scale(1.1)";
                            e.currentTarget.style.opacity = "0.9";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "scale(1)";
                            e.currentTarget.style.opacity = "1";
                          }}
                        />
                      ))}
                    </div>
                  )}
                  {errors.color && (
                    <p
                      style={{
                        color: theme.colors.error,
                        fontSize: "0.75rem",
                        margin: "0.25rem 0 0 0",
                      }}
                    >
                      {errors.color}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div
              style={{
                borderTop: `0.0625rem solid ${theme.colors.lightGray}`,
                padding: "0.75rem 1.5rem",
                backgroundColor: theme.colors.surface,
                display: "flex",
                gap: "1rem",
                justifyContent: "flex-end",
              }}
            >
              <button
                onClick={handleCancel}
                style={{
                  padding: "0.5rem 1.5rem",
                  border: `0.0625rem solid ${theme.colors.lightGray}`,
                  backgroundColor: theme.colors.surface,
                  color: theme.colors.text.secondary,
                  borderRadius: "0.375rem",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = theme.colors.mediumGray;
                  e.currentTarget.style.backgroundColor =
                    theme.colors.lightGray;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = theme.colors.lightGray;
                  e.currentTarget.style.backgroundColor = theme.colors.surface;
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                style={{
                  padding: "0.5rem 1.5rem",
                  backgroundColor: theme.colors.primary,
                  color: theme.colors.white,
                  border: "none",
                  borderRadius: "0.375rem",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor =
                    theme.colors.primaryDark)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = theme.colors.primary)
                }
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
      <ColorPickerDialog
        open={colorDlgOpen}
        onClose={() => setColorDlgOpen(false)}
        onSelect={handleAddTask}
      />
    </div>
  );
}
