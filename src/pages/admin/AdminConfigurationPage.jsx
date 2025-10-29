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

// Dummy API for Ticket Categories
const TicketCategoryAPI = {
  getAll: async () => {
    await new Promise((r) => setTimeout(r, 400));
    return {
      categories: [
        { id: 1, name: "Bug", description: "Issues or defects in system" },
        {
          id: 2,
          name: "Feature Request",
          description: "Request new functionality",
        },
        { id: 3, name: "Support", description: "General support inquiries" },
      ],
    };
  },
  create: async (data) => {
    await new Promise((r) => setTimeout(r, 400));
    console.log("Creating ticket category:", data);
    return { id: Date.now(), ...data };
  },
  update: async (id, data) => {
    await new Promise((r) => setTimeout(r, 400));
    console.log("Updating ticket category:", id, data);
    return { id, ...data };
  },
  delete: async (id) => {
    await new Promise((r) => setTimeout(r, 400));
    console.log("Deleting ticket category:", id);
    return { success: true };
  },
};

// Dummy API for Applications
const ApplicationAPI = {
  getAll: async () => {
    await new Promise((r) => setTimeout(r, 400));
    return {
      applications: [
        {
          id: 1,
          name: "HRMS",
          description: "Human Resource Management System",
        },
        { id: 2, name: "CRM", description: "Customer Relationship Management" },
        {
          id: 3,
          name: "Ticketing Portal",
          description: "Internal support and issue tracking",
        },
      ],
    };
  },
  create: async (data) => {
    await new Promise((r) => setTimeout(r, 400));
    console.log("Creating application:", data);
    return { id: Date.now(), ...data };
  },
  update: async (id, data) => {
    await new Promise((r) => setTimeout(r, 400));
    console.log("Updating application:", id, data);
    return { id, ...data };
  },
  delete: async (id) => {
    await new Promise((r) => setTimeout(r, 400));
    console.log("Deleting application:", id);
    return { success: true };
  },
};

export default function AdminConfig() {
  const [activeTab, setActiveTab] = useState(0);
  const [categories, setCategories] = useState([]);
  const [applications, setApplications] = useState([]);
  const [open, setOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null);
  const [formData, setFormData] = useState({
    id: null,
    name: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);

  const fetchCategories = async () => {
    setLoading(true);
    const data = await TicketCategoryAPI.getAll();
    setCategories(data.categories);
    setLoading(false);
  };

  const fetchApplications = async () => {
    setLoading(true);
    const data = await ApplicationAPI.getAll();
    setApplications(data.applications);
    setLoading(false);
  };

  useEffect(() => {
    fetchCategories();
    fetchApplications();
  }, []);

  const handleTabChange = (e, newValue) => setActiveTab(newValue);

  const handleOpen = (item = null) => {
    setFormData(item || { id: null, name: "", description: "" });
    setOpen(true);
  };

  const handleSave = async () => {
    const isTicket = activeTab === 0;
    const API = isTicket ? TicketCategoryAPI : ApplicationAPI;
    if (!formData.name.trim()) return;

    setLoading(true);
    if (formData.id) await API.update(formData.id, formData);
    else await API.create(formData);

    if (isTicket) fetchCategories();
    else fetchApplications();

    setOpen(false);
    setFormData({ id: null, name: "", description: "" });
    setLoading(false);
  };

  const handleDelete = (item) => {
    setDeleteItem(item);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    const isTicket = activeTab === 0;
    const API = isTicket ? TicketCategoryAPI : ApplicationAPI;
    setLoading(true);
    await API.delete(deleteItem.id);
    if (isTicket) fetchCategories();
    else fetchApplications();
    setLoading(false);
    setDeleteConfirmOpen(false);
  };

  const currentData = activeTab === 0 ? categories : applications;
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
          Admin Configration
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
              transition: "all 0.3s ease",
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
      <Paper
        sx={{ overflowX: "auto", borderRadius: customTheme.borderRadius.large }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: customTheme.colors.gray }}>
              <TableCell>
                <b>Name</b>
              </TableCell>
              <TableCell align="right">
                <b>Actions</b>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : currentData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  No {currentType.toLowerCase()}s found
                </TableCell>
              </TableRow>
            ) : (
              currentData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      onClick={() => handleOpen(item)}
                      size="small"
                      sx={{ color: customTheme.colors.primary }}
                    >
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDelete(item)}
                      size="small"
                      sx={{ color: customTheme.colors.error }}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Paper>

      {/* Add/Edit Dialog */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="sm"
      >
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
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
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
      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        fullWidth
        maxWidth="sm"
      >
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
