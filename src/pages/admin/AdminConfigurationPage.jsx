import React, { useState, useEffect } from "react";
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
import { Edit, Delete } from "@mui/icons-material";
import { theme as customTheme } from "../../theme/theme";
import Button from "../../components/common/Button";
import { TicketingSystemApi } from "../../api/ticketingSystemApi";
import { ApplicationApi } from "../../api/applicationApi";

export default function AdminConfig() {
  const [activeTab, setActiveTab] = useState(0);
  const [ticketingSystems, setTicketingSystems] = useState([]);
  const [applications, setApplications] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    nextPage: null,
    previousPage: null,
  });
  const [open, setOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null);
  const [formData, setFormData] = useState({
    id: null,
    name: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);

  // ✅ Fetch Ticketing Systems
  const fetchTicketingSystems = async (page = 1) => {
    try {
      setLoading(true);
      const res = await TicketingSystemApi.view(page, 5);
      setTicketingSystems(
        res?.rows?.map((item) => ({
          id: item.id,
          name: item.ticketing_system_name,
          description: item.ticketing_system_description,
        })) || []
      );
      setPagination({
        currentPage: res.currentPage,
        totalPages: res.totalPages,
        nextPage: res.nextPage,
        previousPage: res.previousPage,
      });
    } catch (err) {
      console.error("Failed to fetch ticketing systems:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch Applications
  const fetchApplications = async (page = 1) => {
    try {
      setLoading(true);
      const res = await ApplicationApi.view(page, 5);
      setApplications(
        res?.rows?.map((item) => ({
          id: item.id,
          name: item.name,
          description: item.description,
        })) || []
      );
      setPagination({
        currentPage: res.currentPage,
        totalPages: res.totalPages,
        nextPage: res.nextPage,
        previousPage: res.previousPage,
      });
    } catch (err) {
      console.error("Failed to fetch applications:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 0) fetchTicketingSystems();
    else fetchApplications();
  }, [activeTab]);

  const handleTabChange = (e, newValue) => {
    setActiveTab(newValue);
  };

  const handleOpen = (item = null) => {
    setFormData(item || { id: null, name: "", description: "" });
    setOpen(true);
  };

  const handleSave = async () => {
    const isTicket = activeTab === 0;
    const API = isTicket ? TicketingSystemApi : ApplicationApi;
    if (!formData.name.trim()) return;

    setLoading(true);
    try {
      if (formData.id) {
        const payload = isTicket
          ? {
              ticketSystemName: formData.name,
              ticketSystemDescription: formData.description,
            }
          : {
              applicationName: formData.name,
              applicationDescription: formData.description,
            };
        await API.edit(formData.id, payload);
      } else {
        const payload = isTicket
          ? {
              ticketSystemName: formData.name,
              ticketSystemDescription: formData.description,
            }
          : {
              applicationName: formData.name,
              applicationDescription: formData.description,
            };
        await API.create(payload);
      }
      isTicket ? fetchTicketingSystems() : fetchApplications();
    } catch (err) {
      console.error("Save failed:", err);
    } finally {
      setOpen(false);
      setFormData({ id: null, name: "", description: "" });
      setLoading(false);
    }
  };

  const handleDelete = (item) => {
    setDeleteItem(item);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    // Optional: implement delete API later
    setDeleteConfirmOpen(false);
  };

  const handlePageChange = (direction) => {
    const nextPage =
      direction === "next" ? pagination.nextPage : pagination.previousPage;
    if (!nextPage) return;
    activeTab === 0
      ? fetchTicketingSystems(nextPage)
      : fetchApplications(nextPage);
  };

  const currentData = activeTab === 0 ? ticketingSystems : applications;
  const currentType = activeTab === 0 ? "Ticketing System" : "Application";

  return (
    <div>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <h1
          style={{
            fontSize: window.innerWidth < 640 ? "24px" : "32px",
            fontWeight: 700,
            color: customTheme.colors.text.primary,
            margin: 0,
            flex: 1,
          }}
        >
          Admin Configuration
        </h1>

        <Button
          variant="contained"
          onClick={() => handleOpen()}
          sx={{
            backgroundColor: customTheme.colors.primary,
            textTransform: "none",
            borderRadius: customTheme.borderRadius.medium,
            padding: "10px 20px",
            fontWeight: 500,
            boxShadow: customTheme.shadows.small,
          }}
        >
          + {currentType}
        </Button>
      </Box>

      {/* Tabs */}
      <Paper sx={{ mb: 2, borderRadius: customTheme.borderRadius.large }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          sx={{
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: 500,
              fontSize: "16px",
              minHeight: "60px",
              borderRadius: customTheme.borderRadius.medium,
              color: customTheme.colors.text.secondary,
            },
            "& .Mui-selected": {
              color: customTheme.colors.primary,
              backgroundColor: `${customTheme.colors.primaryLight}22`,
              fontWeight: 600,
            },
            "& .MuiTabs-indicator": {
              backgroundColor: customTheme.colors.primary,
              height: "4px",
              borderRadius: "4px",
            },
          }}
        >
          <Tab label="Ticketing System" />
          <Tab label="Applications" />
        </Tabs>
      </Paper>

      {/* Table */}
      <Paper sx={{ overflowX: "auto", borderRadius: customTheme.borderRadius.large }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: customTheme.colors.gray }}>
              <TableCell><b>Name</b></TableCell>
              <TableCell><b>Description</b></TableCell>
              <TableCell align="right"><b>Actions</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={3} align="center">Loading...</TableCell></TableRow>
            ) : currentData.length === 0 ? (
              <TableRow><TableCell colSpan={3} align="center">No {currentType.toLowerCase()}s found</TableCell></TableRow>
            ) : (
              currentData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.description}</TableCell>
                  <TableCell align="right">
                    <IconButton onClick={() => handleOpen(item)} size="small" sx={{ color: customTheme.colors.primary }}>
                      <Edit fontSize="small" />
                    </IconButton>
                    {/* <IconButton onClick={() => handleDelete(item)} size="small" sx={{ color: customTheme.colors.error }}>
                      <Delete fontSize="small" />
                    </IconButton> */}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Paper>

      {/* Pagination */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center", mt: 2, gap: 2 }}>
        <Button
          disabled={!pagination.previousPage}
          onClick={() => handlePageChange("prev")}
        >
          {"< Prev"}
        </Button>
        <Typography variant="body1">
          Page {pagination.currentPage} of {pagination.totalPages}
        </Typography>
        <Button
          disabled={!pagination.nextPage}
          onClick={() => handlePageChange("next")}
        >
          {"Next >"}
        </Button>
      </Box>

      {/* Add/Edit Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>
          {formData.id ? `Edit ${currentType}` : `Create ${currentType}`}
        </DialogTitle>
        <DialogContent dividers>
          <TextField
            fullWidth
            label={`${currentType} Name`}
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            margin="normal"
            multiline
            rows={3}
          />
        </DialogContent>
        <DialogActions>
          <Button type="secondary" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={!formData.name.trim() || loading}
            sx={{ backgroundColor: customTheme.colors.primary }}
          >
            {loading ? "Saving..." : "Save"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete <b>{deleteItem?.name}</b>?
        </DialogContent>
        <DialogActions>
          <Button type="secondary" onClick={() => setDeleteConfirmOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="contained"
            sx={{ backgroundColor: customTheme.colors.error }}
            onClick={handleDeleteConfirm}
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
