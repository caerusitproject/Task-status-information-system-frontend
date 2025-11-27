// Timesheet.jsx
import { useState, useRef, useEffect, useCallback } from "react";
import { Box } from "@mui/material";
import { TaskApi } from "../../api/taskApi";
import TimesheetHeader from "./TimesheetHeader";
import LegendsBar from "./LegendsBar";
import DayCard from "./DayCard";
import { getWeekTasks } from "./mockApi";
import TaskFormDialog from "./TaskFormDialog";
import LegendPickerDialog from "./ColorPickerDialog";
import { theme } from "../../theme/theme";
import { Skeleton } from "@mui/material";
import { ApplicationApi } from "../../api/applicationApi";
import { ClientApi } from "../../api/clientApi";
import { set } from "react-hook-form";

const statusOptions = [
  "Reported",
  "New",
  "In Progress",
  "On Hold",
  "Updated",
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
    client_id: "0",
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
  const [applications, setApplications] = useState([]); // real apps + modules
  const [clients, setClients] = useState([]);
  const [reports, setReports] = useState([]); // real reports list
  const [loadingHeaderData, setLoadingHeaderData] = useState(true);
  // Add this inside Timesheet() before return
  const today = new Date().toISOString().split("T")[0]; // already have todayStr
  const debouncedSaveRef = useRef(null);

  // const debouncedSave = useCallback(
  //   (Id, updateObj) => {
  //     // Cancel previous
  //     if (debouncedSaveRef.current) clearTimeout(debouncedSaveRef.current);

  //     // Optimistic UI (camelCase, no extras)
  //     const optimistic = {
  //       ...updateObj,
  //       updatedDate: new Date().toISOString(),
  //     };
  //     setWeekData((prev) => ({
  //       ...prev,
  //       week: prev.week.map((day) =>
  //         day.date === todayStr
  //           ? {
  //               ...day,
  //               tasks: day.tasks.map((t) =>
  //                 t.id === Id ? { ...t, ...optimistic } : t
  //               ),
  //             }
  //           : day
  //       ),
  //     }));

  //     // Schedule API (build exact snake_case payload)
  //     debouncedSaveRef.current = setTimeout(async () => {
  //       try {
  //         const isIssue = updateObj.taskType?.toLowerCase() === "issue";
  //         const payload = {
  //           id: updateObj.id,
  //           taskId: updateObj.taskId,
  //           ticketId: updateObj.ticketId,
  //           sr_no: updateObj.sr_no,
  //           colorCode: updateObj.colorCode,
  //           taskType: updateObj.taskType,
  //           status: updateObj.status,
  //           hour: updateObj.hours ?? "",
  //           minute: updateObj.minutes ?? "",
  //           updatedDate: optimistic.updatedDate,
  //           ...(isIssue
  //             ? {
  //                 rca_investigation: updateObj.investigationRCA ?? "",
  //                 resolution_and_steps: updateObj.resolutions ?? "",
  //               }
  //             : { daily_accomplishment: updateObj.dailyAccomplishments ?? "" }),
  //           //             ...(updateObj.headerSelections && {
  //           //   header_app: updateObj.headerSelections.app || "",
  //           //   header_module: updateObj.headerSelections.module || "",
  //           //   header_report: updateObj.headerSelections.report || "",
  //           // }),
  //         };
  //         if (updateObj.applications !== undefined) {
  //           payload.applications = updateObj.applications;
  //         }
  //         if (updateObj.reportName !== undefined) {
  //           payload.reportName = updateObj.reportName;
  //         }
  //         await TaskApi.updateTask(payload.id, payload); // ← Uncomment this
  //         //console.log("Expected api", payload.id, payload); // Keep for debugging
  //       } catch (e) {
  //         console.error("Auto-save failed", e);
  //       }
  //     }, 600);
  //   },
  //   [todayStr]
  // );

  const debouncedSave = useCallback(
    (taskDbId, partialUpdate, date) => {
      if (!taskDbId) return;

      if (debouncedSaveRef.current) clearTimeout(debouncedSaveRef.current);

      debouncedSaveRef.current = setTimeout(async () => {
        try {
          // Find original task (works for any date, not just today)
          let originalTask = null;
          weekData.week.forEach((day) => {
            if (day.date === date) {
              originalTask = day.tasks.find((t) => t.id === taskDbId);
            }
          });

          if (!originalTask) return;

          const isIssue = originalTask.taskType?.toLowerCase() === "issue";

          const payload = {
            id: taskDbId,
            taskId: originalTask.taskId,
            ticketId: originalTask.ticketId ?? null,
            sr_no: originalTask.sr_no ?? null,
            colorCode: originalTask.colorCode,
            taskType: originalTask.taskType,
            status: partialUpdate.status ?? originalTask.status,
            hour: partialUpdate.hours ?? originalTask.hours ?? "",
            minute: partialUpdate.minutes ?? originalTask.minutes ?? "",
            updatedDate: new Date().toISOString(),
            ...(isIssue
              ? {
                  rca_investigation:
                    partialUpdate.investigationRCA ??
                    originalTask.investigationRCA ??
                    "",
                  resolution_and_steps:
                    partialUpdate.resolutions ?? originalTask.resolutions ?? "",
                }
              : {
                  daily_accomplishment:
                    partialUpdate.dailyAccomplishments ??
                    originalTask.dailyAccomplishments ??
                    "",
                }),
            ...(partialUpdate.applications !== undefined && {
              applications: partialUpdate.applications,
            }),
            ...(partialUpdate.reportName !== undefined && {
              reportName: partialUpdate.reportName,
            }),
          };

          console.log("SAVING →", payload);
          await TaskApi.updateTask(taskDbId, payload);

          // Optimistic update
          setWeekData((prev) => ({
            ...prev,
            week: prev.week.map((day) =>
              day.date === date
                ? {
                    ...day,
                    tasks: day.tasks.map((t) =>
                      t.id === taskDbId
                        ? {
                            ...t,
                            ...partialUpdate,
                            updatedDate: payload.updatedDate,
                          }
                        : t
                    ),
                  }
                : day
            ),
          }));
        } catch (err) {
          console.error("Save failed:", err);
        }
      }, 600);
    },
    [weekData]
  );

  // === Mobile Detection ===
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Load Applications + Reports ONCE when Timesheet mounts
  useEffect(() => {
    const loadHeaderData = async () => {
      try {
        setLoadingHeaderData(true);
        const [appRes, reportRes, clientRes] = await Promise.all([
          ApplicationApi.view(), // → { rows: [{ id, name, module: [{id, name}] }] }
          ApplicationApi.getReports(), // → { rows: [{ id, name }] }
          ClientApi.view(),
        ]);

        setApplications(appRes.rows || []);
        setReports(reportRes.rows || []);
        setClients(clientRes.rows || []);
      } catch (err) {
        console.error("Failed to load applications/reports", err);
      } finally {
        setLoadingHeaderData(false);
      }
    };

    loadHeaderData();
  }, []); // ← Runs only once on mount

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
    //console.log("Selectedweek in Timesheet", selectedWeek?.week);
    if (selectedWeek?.length == 0 || selectedWeek == (undefined || null))
      return;

    const loadTasks = async () => {
      try {
        setLoadingTasks(true);

        let days = [];

        // 🟩 Try fetching data from actual API
        const { week } = await TaskApi.weekTasks(
          selectedWeek.startDate,
          selectedWeek.endDate
        );
        days = week || [];

        // 🟨 Fallback to mock data if API fails
        // const data = getWeekTasks();
        // days = data.week || [];

        // ✅ Only include today if it's in the selected week
        const today = new Date().toISOString().split("T")[0];
        const todayInWeek =
          selectedWeek.startDate <= today && today <= selectedWeek.endDate;

        if (todayInWeek && !days.some((d) => d.date === today)) {
          days.push({ date: today, tasks: [] });
        }

        // ✅ Sort newest first (latest date first)
        days.sort((a, b) => b.date.localeCompare(a.date));

        // ✅ Update state
        setWeekData({ week: days });

        // ✅ Mark if today is in the selected week
        setTodayIsInSelectedWeek(todayInWeek);
      } catch (e) {
        console.error("❌ Failed to load tasks completely:", e);
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
  const handleAddTask = async (legend) => {
    const taskId = legend.task_code;
    const taskType = legend.task_type?.toLowerCase(); // normalize case
    const now = new Date().toISOString(); // current ISO timestamp

    let newTask;

    if (taskType === "issue") {
      newTask = {
        taskId: legend.task_code,
        ticketId: legend.ticket_id,
        colorCode: legend.color_row,
        taskType: legend.task_type,
        sr_no: legend.sr_no,
        status: legend.status,
        rca_investigation: "",
        resolution_and_steps: "",
        hour: "",
        minute: "",
        updatedDate: now, // Include ISO timestamp
      };
    } else {
      newTask = {
        taskId: legend.task_code,
        ticketId: legend.ticket_id,
        colorCode: legend.color_row,
        taskType: legend.task_type,
        status: legend.status,
        daily_accomplishment: "",
        hour: "",
        minute: "",
        updatedDate: now, // Include ISO timestamp
      };
    }

    try {
      // Send task to backend API
      const response = await TaskApi.createTask(taskId, newTask);
      const view = await TaskApi.weekTasks(
        selectedWeek.startDate,
        selectedWeek.endDate
      );
      //console.log(response?.content?.id)
      newTask.id = response?.content?.id;
      newTask.client_id = response?.content?.client_id;
      setWeekData((prev) => ({
        ...prev,
        week: prev.week.map((day) =>
          day.date === todayStr
            ? { ...day, tasks: [...day.tasks, newTask] }
            : day
        ),
      }));

      // Optionally refresh legends or week tasks
      // loadLegends();
      // setSelectedWeek(selectedWeek);
    } catch (err) {
      console.error("Failed to create task:", err);
      // Optionally notify user
      // alert("Error creating task. Please try again.");
    }
  };
  console.log("week data___", weekData);
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
    if (!formData.client_id || formData.client_id === "0")
      newErrors.client_id = "Client ID is required.";
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
        client_id: [Number(formData.client_id)] || [],
      };
    } else {
      payload = {
        requested_by: formData.requestedBy,
        ticket_id: formData.ticketId,
        description: formData.description,
        status: formData.status,
        color_row: formData.color,
        client_id: [Number(formData.client_id)] || [],
      };
    }
    console.log("formData__", payload);
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
        client_id: taskDetails.client_id ? String(taskDetails.client_id) : "0",
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
              debouncedSave={debouncedSave}
              applications={applications}
              clients={clients}
              reports={reports}
              loadingHeaderData={loadingHeaderData}
            />
          ))
        ) : (
          // ← NEW: No records message
          <Box
            sx={{
              mb: 4,
              borderRadius: "0.75rem",
              minHeight: "200px", // 👈 ensures a minimum height
              display: "flex", // 👈 enables flexbox centering
              justifyContent: "center", // 👈 horizontally center
              alignItems: "center", // 👈 vertically center
              textAlign: "center", // 👈 keeps text centered if multiline
              fontWeight: 500,
              color: "rgba(255,255,255,0.8)",
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
        onClientChange={(e) =>
          setFormData((prev) => ({ ...prev, client_id: e.target.value }))
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
