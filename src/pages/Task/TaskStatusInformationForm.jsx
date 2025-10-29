
import { useState, useEffect } from "react"
import { theme } from '../../theme/theme'; // Reuse existing theme
import Button from '../../components/common/Button'; // Reuse custom Button
import Input from '../../components/common/Input'; // Reuse custom Input

// Reusable Radio Group Component
export const RadioGroup = ({ label, value, onChange, options, disabled = false }) => (
  <div style={{ marginBottom: theme.spacing.md }}>
    <label
      style={{
        display: "block",
        fontSize: "14px",
        fontWeight: "500",
        color: theme.colors.text.primary,
        marginBottom: theme.spacing.xs,
      }}
    >
      {label}
    </label>
    <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
      {options.map((opt) => (
        <label
          key={opt.value}
          style={{ display: "flex", alignItems: "center", gap: "8px", cursor: disabled ? "not-allowed" : "pointer" }}
        >
          <input
            type="radio"
            value={opt.value}
            checked={value === opt.value}
            onChange={(e) => !disabled && onChange(opt.value)}
            disabled={disabled}
            style={{ width: "20px", height: "20px" }}
          />
          {opt.label}
        </label>
      ))}
    </div>
  </div>
)

const TaskStatusInformationForm = ({ initialData, isEditMode, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    taskTitle: "",
    user: "",
    taskType: "Assign",
    ticketId: "",
    ticketingSystem: "",
    application: "",
    module: "",
    executionNote: "",
    status: "In-Progress",
  })

  useEffect(() => {
    if (initialData) {
      setFormData({
        taskTitle: initialData.taskTitle || "",
        user: initialData.user || "",
        taskType: initialData.taskType || "Assign",
        ticketId: initialData.ticketId || "",
        ticketingSystem: initialData.ticketingSystem || "",
        application: initialData.application || "",
        module: initialData.module || "",
        executionNote: initialData.executionNote || "",
        status: initialData.status || "In-Progress",
      })
    } else {
      setFormData({
        taskTitle: "",
        user: "",
        taskType: "Assign",
        ticketId: "",
        ticketingSystem: "",
        application: "",
        module: "",
        executionNote: "",
        status: "In-Progress",
      })
    }
  }, [initialData])

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (onSubmit) {
      onSubmit(formData)
    }
  }

  const isFieldDisabled = (field) => {
    if (!isEditMode) return false
    return !["executionNote", "status"].includes(field)
  }

  return (
    <div
      style={{
        backgroundColor: theme.colors.white,
        borderRadius: theme.borderRadius.medium,
        padding: theme.spacing.lg,
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        maxWidth: "600px",
        margin: "0 auto",
      }}
    >
      <div
        style={{
          background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.primaryDark} 100%)`,
          color: theme.colors.white,
          padding: `${theme.spacing.md} ${theme.spacing.lg}`,
          borderTopLeftRadius: theme.borderRadius.small,
          borderTopRightRadius: theme.borderRadius.small,
          margin: `-${theme.spacing.lg} -${theme.spacing.lg} ${theme.spacing.md} -${theme.spacing.lg}`,
          textAlign: "center",
        }}
      >
        <h2 style={{ margin: 0, fontSize: "1.5rem" }}>
          {isEditMode ? "Edit Task Status" : "Task Status Information Form"}
        </h2>
      </div>

      <form onSubmit={handleSubmit}>
        <Input
          label="Task Title"
          type="text"
          value={formData.taskTitle}
          onChange={(e) => handleChange("taskTitle", e.target.value)}
          placeholder="Enter task title"
          disabled={isFieldDisabled("taskTitle")}
        />

        <Input
          label="User"
          type="text"
          value={formData.user}
          onChange={(e) => handleChange("user", e.target.value)}
          placeholder="Enter user name"
          disabled={isFieldDisabled("user")}
        />

        <RadioGroup
          label="Task Type"
          value={formData.taskType}
          onChange={(value) => handleChange("taskType", value)}
          options={[
            { value: "Assign", label: "Assign" },
            { value: "Issue", label: "Issue" },
          ]}
          disabled={isFieldDisabled("taskType")}
        />

        <Input
          label="Ticket ID"
          type="text"
          value={formData.ticketId}
          onChange={(e) => handleChange("ticketId", e.target.value)}
          placeholder="Enter ticket ID"
          disabled={isFieldDisabled("ticketId")}
        />

        <Input
          label="Ticketing System"
          type="select"
          value={formData.ticketingSystem}
          onChange={(e) => handleChange("ticketingSystem", e.target.value)}
          options={[
            { value: "", label: "Select System" },
            { value: "JIRA", label: "JIRA" },
            { value: "ServiceNow", label: "ServiceNow" },
            { value: "Zendesk", label: "Zendesk" },
            { value: "Freshdesk", label: "Freshdesk" },
          ]}
          disabled={isFieldDisabled("ticketingSystem")}
        />

        <Input
          label="Application"
          type="select"
          value={formData.application}
          onChange={(e) => handleChange("application", e.target.value)}
          options={[
            { value: "", label: "Select Application" },
            { value: "Web Portal", label: "Web Portal" },
            { value: "Backend API", label: "Backend API" },
            { value: "Mobile App", label: "Mobile App" },
          ]}
          disabled={isFieldDisabled("application")}
        />

        <Input
          label="Module"
          type="text"
          value={formData.module}
          onChange={(e) => handleChange("module", e.target.value)}
          placeholder="Enter module"
          disabled={isFieldDisabled("module")}
        />

        <Input
          label="Execution Note"
          type="textarea"
          value={formData.executionNote}
          onChange={(e) => handleChange("executionNote", e.target.value)}
          placeholder="Enter execution notes"
          disabled={isFieldDisabled("executionNote")}
        />

        <Input
          label="Status"
          type="select"
          value={formData.status}
          onChange={(e) => handleChange("status", e.target.value)}
          options={[
            { value: "In-Progress", label: "In-Progress" },
            { value: "Not Started", label: "Not Started" },
            { value: "Completed", label: "Completed" },
            { value: "On Hold", label: "On Hold" },
          ]}
          disabled={isFieldDisabled("status")}
        />

        <div
          style={{ display: "flex", gap: theme.spacing.sm, justifyContent: "flex-end", marginTop: theme.spacing.md }}
        >
            <Button type="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="primary" onClick={handleSubmit}>
            {isEditMode ? "Update" : "Create"}
          </Button>
          
        </div>
      </form>
    </div>
  )
}

export default TaskStatusInformationForm
