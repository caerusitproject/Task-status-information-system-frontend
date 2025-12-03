import React from "react";
import {
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Box,
} from "@mui/material";
import { Edit, Trash2 } from "lucide-react";
import { theme as customTheme } from "../../../theme/theme";

/**
 * ApplicationsTab Component
 *
 * Presentational component - receives data via props
 * No API calls, no state management
 * Parent (AdminConfig) handles all logic
 */
export default function ApplicationsTab({
  applications,
  onEdit,
  onDelete,
}) {
  const handleEditClick = (item) => {
    onEdit(item);
  };

  const handleDeleteClick = (item) => {
    onDelete(item);
  };

  return (
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
          {applications.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={3}
                align="center"
                sx={{ color: customTheme.colors.text.secondary, py: 3 }}
              >
                No applications found
              </TableCell>
            </TableRow>
          ) : (
            applications.map((item) => (
              <TableRow
                key={item.id}
                sx={{
                  "&:hover": {
                    backgroundColor: `${customTheme.colors.lightGray}22`,
                  },
                }}
              >
                <TableCell sx={{ color: customTheme.colors.text.primary }}>
                  {item.name}
                </TableCell>
                <TableCell sx={{ color: customTheme.colors.text.secondary }}>
                  {item.description || "-"}
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
            ))
          )}
        </TableBody>
      </Table>
    </Paper>
  );
}