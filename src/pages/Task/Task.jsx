import { useState } from "react";
import { Plus } from "lucide-react";
import { theme } from "../../theme/theme"; // Reuse existing theme
import Button from "../../components/common/Button"; // Reuse custom Button
import Input from "../../components/common/Input"; // Reuse custom Input
import TaskCard from "./TaskCard";
import TaskStatusInformationForm from "./TaskStatusInformationForm";

// Mock initial data
const initialTasks = [
  {
    id: 1,
    taskTitle: "Fix Login Authentication Bug",
    user: "John Doe",
    taskType: "Issue",
    ticketId: "TICK-001",
    ticketingSystem: "JIRA",
    application: "Web Portal",
    module: "Authentication",
    executionNote: "Fixed session timeout issue and improved error handling",
    status: "Completed",
  },
  {
    id: 2,
    taskTitle: "Database Performance Optimization",
    user: "Jane Smith",
    taskType: "Assign",
    ticketId: "TICK-002",
    ticketingSystem: "ServiceNow",
    application: "Backend API",
    module: "Database",
    executionNote: "Added indexes to improve query performance by 40%",
    status: "In-Progress",
  },
  {
    id: 3,
    taskTitle: "Implement User Dashboard",
    user: "Mike Johnson",
    taskType: "Assign",
    ticketId: "TICK-003",
    ticketingSystem: "JIRA",
    application: "Web Portal",
    module: "Dashboard",
    executionNote: "Pending review from product team",
    status: "Not Started",
  },
];

const TaskList = () => {
  const [tasks, setTasks] = useState(initialTasks);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const handleCreateNew = () => {
    setEditingTask(null);
    setShowForm(true);
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleSave = (formData) => {
    if (editingTask) {
      // Update existing task - only execution note and status can be changed
      setTasks((prev) =>
        prev.map((t) =>
          t.id === editingTask.id
            ? {
                ...t,
                executionNote: formData.executionNote,
                status: formData.status,
              }
            : t
        )
      );
    } else {
      // Create new task
      setTasks((prev) => [
        ...prev,
        {
          ...formData,
          id: Date.now(),
        },
      ]);
    }
    setShowForm(false);
    setEditingTask(null);
  };

  const handleClose = () => {
    setShowForm(false);
    setEditingTask(null);
  };

  return (
    <div>
      <div>
        {/* Header Section */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: theme.spacing.xl,
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

          {/* Create New Task Button */}
          <div
            style={{
              flexShrink: 0,
              marginLeft: "auto",
              display: "flex",
              justifyContent: "flex-end",
              width: "100%",
              maxWidth: "200px",
            }}
          >
            <Button
              type="primary"
              onClick={handleCreateNew}
              size="medium"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
                fontSize: "16px",
                width: "100%",
              }}
            >
              + Create New Task
            </Button>
          </div>
        </div>

        {/* Task List Section */}
        <div>
          {tasks.length === 0 ? (
            <div
              style={{
                backgroundColor: theme.colors.white,
                borderRadius: theme.borderRadius.medium,
                padding: "60px 40px",
                textAlign: "center",
                color: theme.colors.text.secondary,
                border: `1px solid ${theme.colors.lightGray}`,
              }}
            >
              <p style={{ margin: 0, fontSize: "1rem" }}>
                No tasks yet. Click "Create New Task" to get started.
              </p>
            </div>
          ) : (
            <div>
              <p
                style={{
                  color: theme.colors.text.secondary,
                  fontSize: "0.9rem",
                  marginBottom: theme.spacing.md,
                }}
              >
                {tasks.length} task{tasks.length !== 1 ? "s" : ""} total
              </p>
              {tasks.map((task) => (
                <TaskCard key={task.id} task={task} onEdit={handleEdit} />
              ))}
            </div>
          )}
        </div>

        {/* Modal Overlay for Form */}
        {showForm && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1000,
              padding: theme.spacing.md,
            }}
            onClick={handleClose}
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
                onCancel={handleClose}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskList;
