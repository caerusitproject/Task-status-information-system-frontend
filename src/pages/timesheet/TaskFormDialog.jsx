import { X, ChevronDown } from "lucide-react";
import { theme } from "../../theme/theme";

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
  // Focus state will be applied inline
};

const requiredStar = (
  <span style={{ color: theme.colors.error, fontWeight: "bold" }}>*</span>
);

export default function TaskFormDialog({
  open,
  config,
  formData,
  errors,
  colors,
  colorOpen,
  colorButtonRef,
  colorDropdownRef,
  isMobile,
  statusOptions,
  onInputChange,
  onColorSelect,
  onStatusChange,
  onSave,
  onCancel,
  setColorOpen,
}) {
  if (!open || !config) return null;

  return (
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
            onClick={onCancel}
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
          {/* Requested By */}
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
              onChange={onInputChange}
              style={inputStyle}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = theme.colors.primary;
                e.currentTarget.style.borderWidth = "0.125rem";
                e.currentTarget.style.backgroundColor = theme.colors.surface;
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = theme.colors.lightGray;
                e.currentTarget.style.borderWidth = "0.1rem";
                e.currentTarget.style.backgroundColor = theme.colors.background;
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

          {/* Description */}
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
              onChange={onInputChange}
              rows={4}
              style={{ ...inputStyle, resize: "vertical" }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = theme.colors.primary;
                e.currentTarget.style.borderWidth = "0.125rem";
                e.currentTarget.style.backgroundColor = theme.colors.surface;
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = theme.colors.lightGray;
                e.currentTarget.style.borderWidth = "0.1rem";
                e.currentTarget.style.backgroundColor = theme.colors.background;
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
              onChange={onInputChange}
              style={{
                ...inputStyle,
                opacity: formData.taskId ? 0.6 : 1,
                cursor: formData.taskId ? "not-allowed" : "text",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = theme.colors.primary;
                e.currentTarget.style.borderWidth = "0.125rem";
                e.currentTarget.style.backgroundColor = theme.colors.surface;
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = theme.colors.lightGray;
                e.currentTarget.style.borderWidth = "0.1rem";
                e.currentTarget.style.backgroundColor = theme.colors.background;
              }}
              readOnly={!!formData.taskId}
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

          {/* SR No */}
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
                onChange={onInputChange}
                style={inputStyle}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = theme.colors.primary;
                  e.currentTarget.style.borderWidth = "0.125rem";
                  e.currentTarget.style.backgroundColor = theme.colors.surface;
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = theme.colors.lightGray;
                  e.currentTarget.style.borderWidth = "0.1rem";
                  e.currentTarget.style.backgroundColor =
                    theme.colors.background;
                }}
              />
            </div>
          )}

          {/* Status + Color */}
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
                onChange={onStatusChange}
                style={{ ...inputStyle, cursor: "pointer" }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = theme.colors.primary;
                  e.currentTarget.style.borderWidth = "0.125rem";
                  e.currentTarget.style.backgroundColor = theme.colors.surface;
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = theme.colors.lightGray;
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
            </div>

            {/* Color */}
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
                onClick={() =>
                  !formData.taskId && setColorOpen((prev) => !prev)
                }
                style={{
                  ...inputStyle,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  cursor: formData.taskId ? "not-allowed" : "pointer",
                  opacity: formData.taskId ? 0.5 : 1,
                }}
                disabled={!!formData.taskId}
                onFocus={(e) => {
                  if (!formData.taskId) {
                    e.currentTarget.style.borderColor = theme.colors.primary;
                    e.currentTarget.style.borderWidth = "0.125rem";
                  }
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = theme.colors.lightGray;
                  e.currentTarget.style.borderWidth = "0.1rem";
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
                      onClick={() => onColorSelect(color)}
                      style={{
                        aspectRatio: "1",
                        backgroundColor: color,
                        border:
                          formData.color === color
                            ? "0.2rem solid #fff"
                            : "0.0625rem solid #fff",
                        borderRadius: "0.4rem",
                        cursor: "pointer",
                        boxShadow:
                          formData.color === color
                            ? "0 0 0 0.125rem #000"
                            : "none",
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
            onClick={onCancel}
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
          </button>
          <button
            onClick={onSave}
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
          </button>
        </div>
      </div>
    </div>
  );
}
