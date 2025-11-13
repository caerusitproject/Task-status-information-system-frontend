// Timesheet.jsx
import { useState, useRef, useEffect } from "react";
import { Box } from "@mui/material";
import { getWeekTasks } from "./mockApi";
import { TaskApi } from "../../api/taskApi";
import TimesheetHeader from "./TimesheetHeader";
import LegendsBar from "./LegendsBar";
import DayCard from "./DayCard";
import TaskFormDialog from "./TaskFormDialog";
import LegendPickerDialog from "./ColorPickerDialog";
import { theme } from "../../theme/theme";
import { Skeleton } from "@mui/material";

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

export default function Timesheet() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [taskType, setTaskType] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [colorDlgOpen, setColorDlgOpen] = useState(false);
  const [weekData, setWeekData] = useState({ week: [] });
  const [legends, setLegends] = useState([]);
  const [formData, setFormData] = useState({
    requestedBy: "",
    description: "",
    ticketId: "",
    srNo: "",
    status: "Reported",
    color: "",
    taskId: null,
  });
  const [errors, setErrors] = useState({});
  const colorDropdownRef = useRef(null);
  const colorButtonRef = useRef(null);
  const [colorOpen, setColorOpen] = useState(false);
  const menuRef = useRef(null);
  const [colors, setColors] = useState([]);
  const [selectedWeek, setSelectedWeek] = useState(null); // ← Holds full week object
  const [loadingTasks, setLoadingTasks] = useState(true);
  const todayStr = new Date().toISOString().split("T")[0];
  const [todayIsInSelectedWeek, setTodayIsInSelectedWeek] = useState(false);
  const config = formConfig[taskType];
  // Add this inside Timesheet() before return
  const today = new Date().toISOString().split("T")[0]; // already have todayStr

  // === Mobile Detection ===
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // === Load Legends & Colors ===
  const loadLegends = async () => {
    try {
      const res = await TaskApi.legends();
      setLegends(res.content || []);
    } catch (e) {
      console.error(e);
    }
  };
  const colorApi = async () => {
    try {
      const res = await TaskApi.colorPallette();
      setColors(res.content.map((item) => item.code));
    } catch (e) {
      console.error(e);
    }
  };
  useEffect(() => {
    loadLegends();
    colorApi();
  }, []);

  // === THIS IS THE useEffect YOU WANT TO RUN ON WEEK CHANGE ===
  useEffect(() => {
    if (!selectedWeek?.week) return;

    const loadTasks = async () => {
      try {
        setLoadingTasks(true);
        const { week } = await TaskApi.weekTasks(
          selectedWeek.startDate,
          selectedWeek.endDate
        );

        let days = week || [];

        // Only include today if it's in the selected week
        const today = new Date().toISOString().split("T")[0];
        const todayInWeek =
          selectedWeek.startDate <= today && today <= selectedWeek.endDate;

        if (todayInWeek && !days.some((d) => d.date === today)) {
          days.push({ date: today, tasks: [] });
        }

        // Sort newest first
        days.sort((a, b) => b.date.localeCompare(a.date));

        setWeekData({ week: days });
        setTodayIsInSelectedWeek(todayInWeek);
      } catch (e) {
        console.error("Failed to load tasks:", e);
        // Fallback to mock data (optional)
        const data = getWeekTasks();
        const days = (data.week || []).filter(
          (d) =>
            selectedWeek.startDate <= d.date && d.date <= selectedWeek.endDate
        );
        setWeekData({ week: days });
        setTodayIsInSelectedWeek(false);
      } finally {
        setLoadingTasks(false);
      }
    };

    loadTasks();
  }, [selectedWeek?.week]); // ← Triggers every time week number changes

  // === Click Outside Handlers ===
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target))
        setMenuOpen(false);
    };
    if (menuOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        colorDropdownRef.current &&
        !colorDropdownRef.current.contains(e.target) &&
        colorButtonRef.current &&
        !colorButtonRef.current.contains(e.target)
      )
        setColorOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // === Handlers ===
  const handleAddTask = (legend) => {
    const newTask = {
      taskId: legend.task_code,
      // hours: 0,
      // minutes: 0,
      ticketId: legend.ticket_id,
      colorCode: legend.color_row,
      taskType: legend.task_type,
      status: legend.status,
      //updatedDate: new Date().toISOString(),
      dailyAccomplishments: "",
      investigationRCA: "", // Required for issues
      resolutions: "",
    };
    setWeekData((prev) => ({
      week: prev.week.map((day) =>
        day.date === todayStr ? { ...day, tasks: [...day.tasks, newTask] } : day
      ),
    }));
  };

  const validateField = (name, value) => {
    const newErrors = { ...errors };
    delete newErrors[name];
    if (["requestedBy", "description", "ticketId"].includes(name)) {
      if (!value) newErrors[name] = "This field is required.";
      else if (value.length < 3)
        newErrors[name] = "Minimum 3 characters required.";
    }
    setErrors(newErrors);
  };

  const validateForm = () => {
    const newErrors = {};
    ["description"].forEach((field) => {
      const value = formData[field];
      if (!value) newErrors[field] = "This field is required.";
      else if (value.length < 3)
        newErrors[field] = "Minimum 3 characters required.";
    });
    if (!formData.color) newErrors.color = "Color is required.";
    if (!formData.status) newErrors.status = "Status is required.";
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
      status: type === "issue" ? "Reported" : "New",
      color: "",
      taskId: null,
    });
    setErrors({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    let payload = {};
    if (taskType === "issue") {
      payload = {
        reported_by: formData.requestedBy,
        ticket_id: formData.ticketId,
        statement_of_the_issue: formData.description,
        status: formData.status,
        color_row: formData.color,
        sr_no: formData.srNo || "",
      };
    } else {
      payload = {
        requested_by: formData.requestedBy,
        ticket_id: formData.ticketId,
        description: formData.description,
        status: formData.status,
        color_row: formData.color,
      };
    }

    try {
      if (formData.taskId) {
        await TaskApi.edit(formData.taskId, payload);
      } else {
        await TaskApi.create(taskType, payload);
      }
      await loadLegends();
      setFormOpen(false);
      setTaskType(null);
      setFormData({
        requestedBy: "",
        description: "",
        ticketId: "",
        srNo: "",
        status: "Reported",
        color: "",
        taskId: null,
      });
      setErrors({});
    } catch (err) {
      console.error("Save error:", err);
      alert("Error saving task!");
    }
  };

  const inferTaskType = (taskId) => {
    if (taskId.startsWith("AS-")) return "assignment";
    if (taskId.startsWith("IS-")) return "issue";
    if (taskId.startsWith("CR-")) return "change_request";
    return "assignment";
  };

  const handleLegendClick = async (legend) => {
    try {
      const { content: taskDetails } = await TaskApi.viewById(legend.task_code);
      const type = inferTaskType(taskDetails.task_code);

      setFormData({
        requestedBy: taskDetails.requestedBy || taskDetails.reportedBy || "",
        description:
          taskDetails.description || taskDetails.statement_of_the_issue || "",
        ticketId: taskDetails.ticket_id,
        srNo: taskDetails.sr_no || "",
        status: taskDetails.status || "In Progress",
        color: legend.color_row,
        taskId: taskDetails.task_code,
      });

      setTaskType(type);
      setFormOpen(true);
      setMenuOpen(false);
    } catch (err) {
      console.error("Failed to load task:", err);
      alert("Could not load task details.");
    }
  };

  const handleCancel = () => {
    setFormOpen(false);
    setTaskType(null);
    setErrors({});
    setColorOpen(false);
  };

  // Get task IDs already used TODAY
  const usedTaskIdsToday =
    weekData.week
      .find((day) => day.date === todayStr)
      ?.tasks.map((task) => task.taskId) || [];

  // Filter legends: exclude legends whose task_id is already used today
  const availableLegends = legends.filter(
    (legend) => !usedTaskIdsToday.includes(legend.task_code)
  );

  return (
    <div>
      <div ref={menuRef}>
        <TimesheetHeader
          menuOpen={menuOpen}
          setMenuOpen={setMenuOpen}
          handleMenuSelect={handleMenuSelect}
          isMobile={isMobile}
          onWeekChange={setSelectedWeek} // ← Pass setter directly
        />
      </div>

      <LegendsBar legends={legends} onLegendClick={handleLegendClick} />

      <div style={{ position: "relative" }}>
        {loadingTasks ? (
          Array(5)
            .fill(0)
            .map((_, i) => (
              <Skeleton
                key={i}
                variant="rectangular"
                height={200}
                sx={{
                  mb: 4,
                  borderRadius: "0.75rem",
                  background: {
                    xs: "rgba(255, 255, 255, 0.1)",
                    md: "linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0.05))",
                  },
                  backdropFilter: { xs: "blur(6px)", md: "blur(10px)" },
                  WebkitBackdropFilter: { xs: "blur(6px)", md: "blur(10px)" },
                  border: {
                    xs: "1px solid rgba(255,255,255,0.1)",
                    md: "1px solid rgba(255,255,255,0.2)",
                  },
                  boxShadow: {
                    xs: "0 4px 16px rgba(0,0,0,0.1)",
                    md: "0 8px 32px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.3)",
                  },
                }}
              />
            ))
        ) : weekData.week.length > 0 ? (
          weekData.week.map((day) => (
            <DayCard
              key={day.date}
              day={day}
              isToday={day.date === todayStr}
              onAddTask={() => setColorDlgOpen(true)}
              isMobile={isMobile}
              showToday={todayIsInSelectedWeek}
            />
          ))
        ) : (
          // ← NEW: No records message
          <Box
            sx={{
              minHeight: 200,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#aaa",
              fontStyle: "italic",
              fontSize: "1.1rem",
              textAlign: "center",
              p: 4,
            }}
          >
            No records present
          </Box>
        )}
      </div>

      <TaskFormDialog
        open={formOpen}
        config={config}
        formData={formData}
        errors={errors}
        colors={colors}
        colorOpen={colorOpen}
        colorButtonRef={colorButtonRef}
        colorDropdownRef={colorDropdownRef}
        isMobile={isMobile}
        statusOptions={statusOptions}
        onInputChange={handleInputChange}
        onColorSelect={(color) => {
          setFormData((prev) => ({ ...prev, color }));
          setColorOpen(false);
        }}
        setColorOpen={setColorOpen}
        onStatusChange={(e) =>
          setFormData((prev) => ({ ...prev, status: e.target.value }))
        }
        onSave={handleSave}
        onCancel={handleCancel}
      />

      <LegendPickerDialog
        open={colorDlgOpen}
        onClose={() => setColorDlgOpen(false)}
        onSelect={handleAddTask}
        legends={availableLegends}
        selectedColor={null}
      />
    </div>
  );
}
