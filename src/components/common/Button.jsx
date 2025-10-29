"use client"
import { ButtonBase } from "@mui/material"
import { theme } from "../../theme/theme"

const Button = ({ type = "primary", disabled = false, onClick, children, size = "medium", fullWidth = false }) => {
  const sizes = {
    small: { padding: `${theme.spacing.xs} ${theme.spacing.sm}`, fontSize: "13px" },
    medium: { padding: `${theme.spacing.sm} ${theme.spacing.md}`, fontSize: "14px" },
    large: { padding: `${theme.spacing.md} ${theme.spacing.lg}`, fontSize: "16px" },
  }

  const baseStyle = {
    borderRadius: theme.borderRadius.medium,
    fontWeight: 600,
    fontFamily: theme.typography?.fontFamily || '"Inter", sans-serif',
    cursor: disabled ? "not-allowed" : "pointer",
    transition: theme.transitions.medium,
    whiteSpace: "nowrap",
    display: "inline-block",
    width: fullWidth ? "100%" : "auto",
    opacity: disabled ? 0.7 : 1,
    border: "none",
    textTransform: "none",
    ...sizes[size],
  }

  const variants = {
    primary: { backgroundColor: theme.colors.primary, color: theme.colors.white },
    secondary: {
      backgroundColor: "transparent",
      color: theme.colors.primary,
      border: `2px solid ${theme.colors.primary}`,
    },
    tertiary: {
      backgroundColor: "transparent",
      color: theme.colors.text.secondary,
      border: `2px solid ${theme.colors.text.secondary}`,
    },
    white: {
      backgroundColor: theme.colors.white,
      color: theme.colors.text.primary,
      border: `1px solid ${theme.colors.lightGray}`,
    },
    error: { backgroundColor: theme.colors.error, color: theme.colors.white },
    success: { backgroundColor: theme.colors.success, color: theme.colors.white },
  }

  const hoverStyles = {
    primary: { backgroundColor: theme.colors.primaryDark },
    secondary: { backgroundColor: `${theme.colors.primary}15` },
    tertiary: { backgroundColor: `${theme.colors.text.secondary}20` },
    white: { backgroundColor: theme.colors.gray },
    error: { backgroundColor: `${theme.colors.error}CC` },
    success: { backgroundColor: `${theme.colors.success}CC` },
  }

  const style = { ...baseStyle, ...variants[type] }

  return (
    <ButtonBase
      disabled={disabled}
      onClick={!disabled ? onClick : undefined}
      sx={style}
      onMouseEnter={(e) => !disabled && Object.assign(e.currentTarget.style, hoverStyles[type])}
      onMouseLeave={(e) => !disabled && Object.assign(e.currentTarget.style, variants[type])}
      aria-label={typeof children === "string" ? children : "Button"}
    >
      {children}
    </ButtonBase>
  )
}

export default Button
