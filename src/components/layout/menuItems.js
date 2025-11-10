// menuItems.js
import React from "react";
import ReportIcon from "@mui/icons-material/Report";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ConfigIcon from "@mui/icons-material/Settings"; // Admin Config
import DescriptionIcon from "@mui/icons-material/Description";
import TaskIcon from "@mui/icons-material/Task";
const user = JSON.parse(localStorage.getItem("user"));
const userId = user?.id || 1; // fallback to 1 if not found
export const menuItems = [
  {
    path: "/report",
    label: "Report",
    icon: DescriptionIcon,
    key: "report",
    requiredRoles: ["ADMIN"],
  },
  {
    path: "/timesheet",
    label: "Timesheet",
    icon: AccessTimeIcon,
    key: "timesheet",
   requiredRoles: ["USER", "MANAGER", "HR", "ADMIN"],
  },
  {
    path: "/task-management",
    label: "Task Management",
    icon: TaskIcon,
    key: "task-management",
    requiredRoles: ["USER", "MANAGER", "HR", "ADMIN"],
  },
  {
    path: "/admin-config",
    label: "Admin Config",
    icon: ConfigIcon,
    key: "admin-config",
    requiredRoles: ["ADMIN"],
  },
];
