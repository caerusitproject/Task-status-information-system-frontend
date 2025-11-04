// src/pages/tasks/TaskStatusInformationForm.jsx

import { useState, useEffect, useRef } from "react";
import { theme } from "../../theme/theme";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";

export const RadioGroup = ({
  label,
  value,
  onChange,
  options,
  disabled = false,
  error,
  required,
}) => (
  <div style={{ marginBottom: theme.spacing.md, width: "100%" }}>
    <label
      style={{
        display: "block",
        fontSize: "14px",
        fontWeight: "500",
        color: theme.colors.text.primary,
        marginBottom: theme.spacing.xs,
      }}
    >
      {label} {required && <span style={{ color: theme.colors.error }}>*</span>}
    </label>
    <div
      style={{
        display: "flex",
        gap: "16px",
        flexWrap: "wrap",
        padding: "8px 0",
      }}
    >
      {options.map((opt) => (
        <label
          key={opt.value}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            cursor: disabled ? "not-allowed" : "pointer",
            padding: "8px 12px",
            // border: `2px solid ${
            //   value === opt.value ? theme.colors.primary : theme.colors.border
            // }`,
            borderRadius: theme.borderRadius.small,
            backgroundColor:
              value === opt.value ? "rgba(61, 52, 230, 0.05)" : "transparent",
            transition: "all 0.2s",
            minWidth: "120px",
          }}
        >
          <input
            type="radio"
            value={opt.value}
            checked={value === opt.value}
            onChange={() => !disabled && onChange(opt.value)}
            disabled={disabled}
            style={{
              width: "18px",
              height: "18px",
              cursor: disabled ? "not-allowed" : "pointer",
              accentColor: theme.colors.primary,
            }}
          />
          <span style={{ fontSize: "14px", fontWeight: "500" }}>
            {opt.label}
          </span>
        </label>
      ))}
    </div>
    {error && (
      <p
        style={{
          color: theme.colors.error,
          fontSize: "12px",
          marginTop: theme.spacing.xs,
          display: "flex",
          alignItems: "center",
          gap: "4px",
        }}
      >
        <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
          <path d="M8 1a7 7 0 100 14A7 7 0 008 1zm0 11a1 1 0 110-2 1 1 0 010 2zm1-3H7V5h2v4z" />
        </svg>
        {error}
      </p>
    )}
  </div>
);

const TaskStatusInformationForm = ({
  initialData,
  isEditMode,
  onSubmit,
  onCancel,
  applications = [],
  ticketingSystems = [],
}) => {
  const [formData, setFormData] = useState({
    taskTitle: "",
    taskType: "Assignment",
    ticketId: "",
    ticketingSystem: "",
    application: "",
    module: "",
    executionNote: "",
    status: "NEW",
  });

  const [errors, setErrors] = useState({});

  const fieldRefs = useRef({
    taskTitle: useRef(null),
    taskType: useRef(null),
    ticketId: useRef(null),
    ticketingSystem: useRef(null),
    application: useRef(null),
    module: useRef(null),
    executionNote: useRef(null),
    status: useRef(null),
  }).current;

  useEffect(() => {
    if (initialData) {
      setFormData({
        taskTitle: initialData.taskTitle || "",
        taskType: initialData.taskType || "Assignment",
        ticketId: initialData.ticketId || "",
        ticketingSystem: initialData.ticketingSystem || "",
        application: initialData.application || "",
        module: initialData.module || "",
        executionNote: initialData.executionNote || "",
        status: initialData.status || "NEW",
      });
      setErrors({});
    }
  }, [initialData]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateField = (field, value) => {
    const trimmedValue = typeof value === "string" ? value.trim() : value;

    if (!trimmedValue || trimmedValue === "") {
      const fieldLabels = {
        taskTitle: "Task title is required",
        taskType: "Please select a task type",
        ticketId: "Ticket ID is required",
        ticketingSystem: "Please select a ticketing system",
        application: "Please select an application",
        module: "Module name is required",
        executionNote: "Execution note is required",
        status: "Please select a status",
      };
      return fieldLabels[field] || "This field is required";
    }

    if (field === "executionNote" && trimmedValue.length < 3) {
      return "Execution note must be at least 3 characters";
    }

    return undefined;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};
    const fields = Object.keys(formData);
    fields.forEach((field) => {
      const err = validateField(field, formData[field]);
      if (err) newErrors[field] = err;
    });

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      const firstErrorField = Object.keys(newErrors)[0];
      const ref = fieldRefs[firstErrorField];
      if (ref && ref.current) {
        ref.current.scrollIntoView({ behavior: "smooth", block: "center" });
        const inputEl = ref.current.querySelector("input, select, textarea");
        if (inputEl) {
          setTimeout(() => inputEl.focus(), 300);
        }
      }
      return;
    }

    if (onSubmit) onSubmit(formData);
  };

  const isFieldDisabled = (field) => {
    if (!isEditMode) return false;
    return !["executionNote", "status", ].includes(field);
  };

  const wrapWithRef = (field, element) => (
    <div ref={fieldRefs[field]} style={{ scrollMarginTop: "80px" }}>
      {element}
    </div>
  );

  return (
    <div
      style={{
        backgroundColor: theme.colors.white,
        //borderRadius: theme.borderRadius.medium,
        padding: theme.spacing.lg,
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        maxWidth: "700px",
        margin: "0 auto",
        scrollbarGutter: "none",
        scrollbarWidth: "thin", // for Firefox
        msOverflowStyle: "none", // hides default scrollbar space in IE/Edge
        overscrollBehavior: "contain",
        position: "relative",
        overflowY: "auto",
      }}
    >
      <div
        style={{
          background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.primaryDark} 100%)`,
          color: theme.colors.white,
          padding: `${theme.spacing.md} ${theme.spacing.lg}`,
          //borderTopLeftRadius: theme.borderRadius.small,
          // borderTopRightRadius: theme.borderRadius.medium,
          margin: `-${theme.spacing.lg} -${theme.spacing.lg} ${theme.spacing.md} -${theme.spacing.lg}`,
          textAlign: "center",
        }}
      >
        <h2 style={{ margin: 0, fontSize: "1.5rem" }}>
          {isEditMode ? "Edit Task Status" : "Task Status Information Form"}
        </h2>
      </div>

      <form onSubmit={handleSubmit} style={{ scrollBehavior: "smooth" }}>
        {wrapWithRef(
          "taskTitle",
          <Input
            label="Task Title"
            name="taskTitle"
            type="text"
            value={formData.taskTitle}
            onChange={(e) => handleChange("taskTitle", e.target.value)}
            placeholder="Enter task title"
            required
            errors={{ taskTitle: errors.taskTitle }}
            disabled={isFieldDisabled("taskTitle")}
          />
        )}

        {wrapWithRef(
          "taskType",
          <RadioGroup
            label="Task Type"
            value={formData.taskType}
            onChange={(value) => handleChange("taskType", value)}
            options={[
              { value: "Assignment", label: "Assignment" },
              { value: "Issue", label: "Issue" },
            ]}
            required
            disabled={isFieldDisabled("taskType")}
            error={errors.taskType}
          />
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: theme.spacing.md,
          }}
        >
          {wrapWithRef(
            "ticketId",
            <Input
              label="Ticket ID"
              name="ticketId"
              type="text"
              value={formData.ticketId}
              onChange={(e) => handleChange("ticketId", e.target.value)}
              placeholder="Enter ticket ID"
              required
              errors={{ ticketId: errors.ticketId }}
              disabled={isFieldDisabled("ticketId")}
            />
          )}

          {wrapWithRef(
            "ticketingSystem",
            <Input
              label="Ticketing System"
              name="ticketingSystem"
              type="select"
              value={formData.ticketingSystem}
              onChange={(e) => handleChange("ticketingSystem", e.target.value)}
              options={[
                { value: "", label: "Select System" },
                ...ticketingSystems,
              ]}
              required
              errors={{ ticketingSystem: errors.ticketingSystem }}
              disabled={isFieldDisabled("ticketingSystem")}
            />
          )}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: theme.spacing.md,
          }}
        >
          {wrapWithRef(
            "application",
            <Input
              label="Application"
              name="application"
              type="select"
              value={formData.application}
              onChange={(e) => handleChange("application", e.target.value)}
              options={[
                { value: "", label: "Select Application" },
                ...applications,
              ]}
              required
              errors={{ application: errors.application }}
              disabled={isFieldDisabled("application")}
            />
          )}

          {wrapWithRef(
            "module",
            <Input
              label="Module"
              name="module"
              type="text"
              value={formData.module}
              onChange={(e) => handleChange("module", e.target.value)}
              placeholder="Enter module"
              required
              errors={{ module: errors.module }}
              disabled={isFieldDisabled("module")}
            />
          )}
        </div>

        {wrapWithRef(
          "executionNote",
          <Input
            label="Progress Note"
            name="executionNote"
            type="textarea"
            value={formData.executionNote}
            onChange={(e) => handleChange("executionNote", e.target.value)}
            placeholder="Enter execution notes"
            required
            errors={{ executionNote: errors.executionNote }}
            disabled={isFieldDisabled("executionNote")}
          />
        )}

        {wrapWithRef(
          "status",
          <Input
            label="Status"
            name="status"
            type="select"
            value={formData.status}
            onChange={(e) => handleChange("status", e.target.value)}
            options={[
              { value: "NEW", label: "New" },
              { value: "IN_PROGRESS", label: "In-Progress" },
              { value: "COMPLETED", label: "Completed" },
              { value: "ON_HOLD", label: "On Hold" },
            ]}
            required
            errors={{ status: errors.status }}
            disabled={isFieldDisabled("status")}
          />
        )}

        <div
          style={{
            display: "flex",
            gap: theme.spacing.sm,
            justifyContent: "flex-end",
            marginTop: theme.spacing.md,
            flexWrap: "wrap",
          }}
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
  );
};

export default TaskStatusInformationForm;
