// src/pages/tasks/TaskList.jsx  (filename was Task.jsx before)

import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { theme } from "../../theme/theme";
import Button from "../../components/common/Button";
import TaskCard from "./TaskCard";
import TaskStatusInformationForm from "./TaskStatusInformationForm";
import { TaskApi } from "../../api/taskApi";
import { TicketingSystemApi } from "../../api/ticketingSystemApi";
import { ApplicationApi } from "../../api/applicationApi";
import { useAuth } from "../../hooks/useAuth";
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

const TaskList = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    nextPage: null,
    previousPage: null,
  });
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [dropdowns, setDropdowns] = useState({
    applications: [],
    ticketingSystems: [],
  });
  const [appMap, setAppMap] = useState({});
  const [tickMap, setTickMap] = useState({});
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState("success"); // "success" | "error"
  const [alertMessage, setAlertMessage] = useState("");

  // Fetch dropdown data (no pagination)
  const fetchDropdowns = async () => {
    try {
      const [appsRes, tickRes] = await Promise.all([
        ApplicationApi.view(),
        TicketingSystemApi.view(),
      ]);
      const apps = appsRes.rows.map((a) => ({ value: a.id, label: a.name }));
      const ticks = tickRes.rows.map((t) => ({
        value: t.id,
        label: t.ticketing_system_name,
      }));
      setDropdowns({ applications: apps, ticketingSystems: ticks });

      // Build maps for labels
      const aMap = Object.fromEntries(appsRes.rows.map((a) => [a.id, a.name]));
      const tMap = Object.fromEntries(
        tickRes.rows.map((t) => [t.id, t.ticketing_system_name])
      );
      setAppMap(aMap);
      setTickMap(tMap);
    } catch (err) {
      console.error("Failed to load dropdowns:", err);
    }
  };

  // Fetch tasks with pagination + enrich with labels
  const fetchTasks = async (page = 1) => {
    setLoading(true);
    try {
      const res = await TaskApi.view(page, 5);
      setTasks(
        res.rows.map((t) => ({
          id: t.id,
          taskTitle: t.task_title,
          ticketId: t.ticket_id,
          taskType: t.task_type,
          application: t.application_id,
          applicationLabel:
            appMap[t.application_id] || `App ${t.application_id}`,
          ticketingSystem: t.ticketing_system_id,
          ticketingSystemLabel:
            tickMap[t.ticketing_system_id] || `Sys ${t.ticketing_system_id}`,
          module: t.module,
          executionNote: t.execution_note,
          status: t.status,
        }))
      );
      setPagination({
        currentPage: res.currentPage,
        totalPages: res.totalPages,
        nextPage: res.nextPage,
        previousPage: res.previousPage,
      });
    } catch (err) {
      console.error("Failed to fetch tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDropdowns();
  }, []);

  useEffect(() => {
    if (Object.keys(appMap).length && Object.keys(tickMap).length) {
      fetchTasks();
    }
  }, [appMap, tickMap]);

  const handleCreateNew = () => {
    setEditingTask(null);
    setShowForm(true);
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const statusMap = {
    New: "NEW",
    "In-Progress": "IN_PROGRESS",
    Completed: "COMPLETED",
    Blocked: "BLOCKED",
  };

  const handleSave = async (formData) => {
    const payload = {
      task_title: formData.taskTitle,
      task_type: formData.taskType,
      module: formData.module,
      application_id: Number(formData.application),
      ticketing_system_id: Number(formData.ticketingSystem),
      ticket_id: formData.ticketId,
      status: statusMap[formData.status] || formData.status,
      execution_note: formData.executionNote,
      created_by: user?.id,
    };

    try {
      let response;
      if (editingTask) {
        response = await TaskApi.edit(editingTask.id, {
          execution_note: formData.executionNote,
          status: statusMap[formData.status] || formData.status,
          task_type: formData.taskType,
        });
      } else {
        response = await TaskApi.create(payload);
      }

      // Show success message from API
      const successMsg =
        response?.message || (editingTask ? "Task updated!" : "Task created!");
      setAlertSeverity("success");
      setAlertMessage(successMsg);
      setAlertOpen(true);

      // Refetch tasks
      fetchTasks(pagination.currentPage);
      setShowForm(false);
      setEditingTask(null);
    } catch (err) {
      // Show error message
      const errorMsg =
        err.response?.data?.message || "Failed to save task. Please try again.";
      setAlertSeverity("error");
      setAlertMessage(errorMsg);
      setAlertOpen(true);
      console.error("Save failed:", err);
    }
  };

  const handleAlertClose = () => {
    setAlertOpen(false);
    setAlertMessage("");
  };

  const handlePageChange = (direction) => {
    const next =
      direction === "next" ? pagination.nextPage : pagination.previousPage;
    if (next) fetchTasks(next);
  };

  return (
    <div>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: theme.spacing.sm,
          flexWrap: "wrap",
          gap: theme.spacing.md,
        }}
      >
        <div>
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
              margin: "8px 0 0 0",
              color: theme.colors.text.secondary,
              fontSize: "0.95rem",
            }}
          >
            Manage and track your tasks efficiently
          </p>
        </div>
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end", // ✅ fixed typo: "fex-end" → "flex-end"
            alignItems: "center",
            width: "100%", // ✅ ensures it spans full width
            flexWrap: "nowrap", // ✅ prevents wrapping that could shift the button left
            gap: 2,
            // mt: 2,
            marginBottom: "5px", // optional margin-top for spacing
          }}
        >
          <Button
            type="primary"
            onClick={handleCreateNew}
            size="medium"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "16px",
            }}
          >
            + Create New Task
          </Button>
        </Box>
      </div>

      {/* Task List */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "40px" }}>Loading...</div>
      ) : tasks.length === 0 ? (
        <div
          style={{
            backgroundColor: theme.colors.white,
            borderRadius: theme.borderRadius.medium,
            padding: "60px 40px",
            textAlign: "center",
            border: `1px solid ${theme.colors.lightGray}`,
          }}
        >
          <p style={{ margin: 0, fontSize: "1rem" }}>
            No tasks yet. Click "Create New Task" to get started.
          </p>
        </div>
      ) : (
        <>
          {/* <p style={{ color: theme.colors.text.secondary, fontSize: "0.9rem", marginBottom: theme.spacing.md }}>
            {tasks.length} task{tasks.length !== 1 ? "s" : ""} total
          </p> */}
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} onEdit={handleEdit} />
          ))}

          {/* Pagination */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              marginTop: theme.spacing.lg,
              gap: theme.spacing.sm,
            }}
          >
            <Button
              type="secondary"
              disabled={!pagination.previousPage}
              onClick={() => handlePageChange("prev")}
            >
              {"< Prev"}
            </Button>
            <span
              style={{
                fontSize: "0.95rem",
                color: theme.colors.text.secondary,
              }}
            >
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>
            <Button
              type="secondary"
              disabled={!pagination.nextPage}
              onClick={() => handlePageChange("next")}
            >
              {"Next >"}
            </Button>
          </div>
        </>
      )}

      {/* Form Modal */}
      {showForm && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: theme.spacing.md,
          }}
          onClick={() => setShowForm(false)}
        >
          <div
            style={{
              backgroundColor: theme.colors.white,
              borderRadius: theme.borderRadius.medium,
              maxWidth: "600px",
              width: "100%",
              maxHeight: "90vh",
              overflowY: "auto",
              boxShadow: "0 20px 25px rgba(0,0,0,0.15)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <TaskStatusInformationForm
              initialData={editingTask}
              isEditMode={!!editingTask}
              onSubmit={handleSave}
              onCancel={() => {
                setShowForm(false);
                setEditingTask(null);
              }}
              applications={dropdowns.applications}
              ticketingSystems={dropdowns.ticketingSystems}
            />
          </div>
        </div>
      )}
      <Alert
        open={alertOpen}
        onClose={handleAlertClose}
        severity={alertSeverity}
        message={alertMessage}
        autoHideDuration={6000}
      />
    </div>
  );
};

export default TaskList;
