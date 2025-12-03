import React, { useRef, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
} from "@mui/material";
import { Edit, ChevronDown, Trash2 } from "lucide-react";
import { theme as customTheme } from "../../../theme/theme";

/**
 * ModulesTab Component
 *
 * Presentational component - receives data and callbacks via props
 * No API calls, no state management
 * Parent (AdminConfig) handles all logic
 */
export default function ModulesTab({
  filteredModules,
  applications,
  selectedApplication,
  selectedAppId,
  setSelectedAppId,
  appDropdownOpen,
  setAppDropdownOpen,
  onEdit,
  onDelete,
}) {
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setAppDropdownOpen(false);
      }
    };

    if (appDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [appDropdownOpen, setAppDropdownOpen]);

  const handleApplicationSelect = (appId) => {
    setSelectedAppId(Number(appId));
    setAppDropdownOpen(false);
  };

  const handleEditClick = (item) => {
    onEdit(item);
  };

  const handleDeleteClick = (item) => {
    onDelete(item);
  };

  return (
    <>
      {/* Application Selector Dropdown */}
      <Box sx={{ mb: 3, display: "flex", justifyContent: "flex-end" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Typography sx={{ fontWeight: 600 }}>
            Filter by Application:
          </Typography>

          <div style={{ position: "relative", width: "260px" }} ref={dropdownRef}>
            {/* Dropdown Button */}
            <button
              onClick={() => setAppDropdownOpen(!appDropdownOpen)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
                padding: "0.65rem 1rem",
                backgroundColor: customTheme.colors.surface,
                color: customTheme.colors.text.primary,
                border: `1px solid ${customTheme.colors.lightGray}`,
                borderRadius: "0.5rem",
                fontSize: "0.95rem",
                fontWeight: 500,
                cursor: "pointer",
                transition: customTheme.transitions.fast,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor =
                  customTheme.colors.lightGray;
                e.currentTarget.style.borderColor =
                  customTheme.colors.mediumGray;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor =
                  customTheme.colors.surface;
                e.currentTarget.style.borderColor =
                  customTheme.colors.lightGray;
              }}
            >
              <span
                style={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {selectedApplication?.name || "Select Application"}
              </span>
              <ChevronDown
                size={18}
                style={{
                  marginLeft: "8px",
                  transition: "transform 0.2s",
                  transform: appDropdownOpen
                    ? "rotate(180deg)"
                    : "rotate(0deg)",
                }}
              />
            </button>

            {/* Dropdown Menu */}
            {appDropdownOpen && applications.length > 0 && (
              <div
                style={{
                  position: "absolute",
                  top: "calc(100% + 6px)",
                  left: 0,
                  width: "100%",
                  backgroundColor: customTheme.colors.surface,
                  borderRadius: "0.5rem",
                  boxShadow: customTheme.shadows.large,
                  border: `1px solid ${customTheme.colors.lightGray}`,
                  zIndex: 1000,
                  maxHeight: "200px",
                  overflowY: "auto",
                }}
              >
                {applications.map((app) => (
                  <button
                    key={app.id}
                    onClick={() => handleApplicationSelect(app.id)}
                    style={{
                      width: "100%",
                      textAlign: "left",
                      padding: "0.75rem 1rem",
                      backgroundColor:
                        Number(selectedAppId) === Number(app.id)
                          ? customTheme.colors.lightGray
                          : "transparent",
                      border: "none",
                      color: customTheme.colors.text.primary,
                      fontWeight:
                        Number(selectedAppId) === Number(app.id) ? 600 : 500,
                      cursor: "pointer",
                      transition: "background-color 0.2s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor =
                        customTheme.colors.lightGray)
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor =
                        Number(selectedAppId) === Number(app.id)
                          ? customTheme.colors.lightGray
                          : "transparent")
                    }
                  >
                    {app.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </Box>
      </Box>

      {/* Modules Table */}
      <Paper
        sx={{
          overflowX: "auto",
          borderRadius: customTheme.borderRadius.large,
          backgroundColor: customTheme.colors.surface,
        }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: customTheme.colors.darkGray }}>
              <TableCell
                sx={{
                  color: customTheme.colors.text.primary,
                  fontWeight: 600,
                }}
              >
                Name
              </TableCell>
              <TableCell
                sx={{
                  color: customTheme.colors.text.primary,
                  fontWeight: 600,
                }}
              >
                Description
              </TableCell>
              <TableCell
                sx={{
                  color: customTheme.colors.text.primary,
                  fontWeight: 600,
                }}
              >
                Application
              </TableCell>
              <TableCell
                align="right"
                sx={{
                  color: customTheme.colors.text.primary,
                  fontWeight: 600,
                }}
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredModules.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  align="center"
                  sx={{
                    color: customTheme.colors.text.secondary,
                    py: 3,
                  }}
                >
                  {!selectedAppId
                    ? "Select an Application to view modules"
                    : "No modules found"}
                </TableCell>
              </TableRow>
            ) : (
              filteredModules.map((item) => {
                const appName = applications.find(
                  (a) => a.id === item.app_id
                )?.name;
                return (
                  <TableRow
                    key={item.id}
                    sx={{
                      "&:hover": {
                        backgroundColor: `${customTheme.colors.lightGray}22`,
                      },
                    }}
                  >
                    <TableCell
                      sx={{ color: customTheme.colors.text.primary }}
                    >
                      {item.name}
                    </TableCell>
                    <TableCell
                      sx={{ color: customTheme.colors.text.secondary }}
                    >
                      {item.description || "-"}
                    </TableCell>
                    <TableCell
                      sx={{ color: customTheme.colors.primaryLight }}
                    >
                      {appName}
                    </TableCell>
                    <TableCell align="right">
                      <Box
                        sx={{
                          display: "flex",
                          gap: "8px",
                          justifyContent: "flex-end",
                        }}
                      >
                        <IconButton
                          onClick={() => handleEditClick(item)}
                          size="small"
                          title="Edit"
                        >
                          <Edit
                            size={18}
                            color={customTheme.colors.primary}
                          />
                        </IconButton>
                        {/* <IconButton
                          onClick={() => handleDeleteClick(item)}
                          size="small"
                          title="Delete"
                        >
                          <Trash2
                            size={18}
                            color={customTheme.colors.error}
                          />
                        </IconButton> */}
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </Paper>
    </>
  );
}