import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  CircularProgress,
} from "@mui/material";
import { theme as customTheme } from "../../theme/theme";
import Button from "../../components/common/Button";
import Alert from "../../components/common/Alert";
import { ApplicationApi } from "../../api/applicationApi";
import { ModuleApi } from "../../api/moduleApi";
import { ClientApi } from "../../api/clientApi";
import ApplicationsTab from "./tabs/ApplicationsTab";
import ModulesTab from "./tabs/ModulesTab";
import ClientsTab from "./tabs/ClientsTab";

export default function AdminConfig() {
  // ==================== STATE ====================
  const [activeTab, setActiveTab] = useState(0);
  const [applications, setApplications] = useState([]);
  const [modules, setModules] = useState([]);
  const [clients, setClients] = useState([]);
  const [selectedAppId, setSelectedAppId] = useState("");
  const [loading, setLoading] = useState(false);
  const [appDropdownOpen, setAppDropdownOpen] = useState(false);

  // Dialog & Form State
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null);
  const [formData, setFormData] = useState({
    id: null,
    name: "",
    description: "",
  });

  // Alert State
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState("success");
  const [alertMessage, setAlertMessage] = useState("");

  // ==================== EFFECTS ====================
  // Load all initial data
  useEffect(() => {
    loadInitialData();
  }, []);

  // Auto-select first application when switching to Modules tab
  useEffect(() => {
    if (activeTab === 1 && applications.length > 0 && !selectedAppId) {
      setSelectedAppId(applications[0].id);
    }
  }, [activeTab, applications]);

  // ==================== API CALLS ====================
  const loadInitialData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadApplications(),
        loadModules(),
        loadClients(),
      ]);
    } catch (err) {
      showAlert("error", "Failed to load initial data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadApplications = async () => {
    try {
      const response = await ApplicationApi.view();
      setApplications(response?.rows?.length > 0 ? response.rows : []);
    } catch (err) {
      console.error("Error loading applications:", err);
      throw err;
    }
  };

  const loadModules = async () => {
    try {
      const response = await ModuleApi.view();
      setModules(response?.rows?.length > 0 ? response.rows : []);
    } catch (err) {
      console.error("Error loading modules:", err);
      throw err;
    }
  };

  const loadClients = async () => {
    try {
      const response = await ClientApi.view();
      setClients(response?.rows?.length > 0 ? response.rows : []);
    } catch (err) {
      console.error("Error loading clients:", err);
      throw err;
    }
  };

  // ==================== DERIVED DATA ====================
  const selectedApplication = applications.find(
    (app) => app.id === Number(selectedAppId)
  );

  const filteredModules = selectedAppId
    ? modules.filter((m) => m.app_id === Number(selectedAppId))
    : [];

  const currentType =
    activeTab === 0 ? "Application" : activeTab === 1 ? "Module" : "Client";

  const currentData =
    activeTab === 0
      ? applications
      : activeTab === 1
      ? filteredModules
      : clients;

  // ==================== HANDLERS ====================
  const showAlert = (severity, message) => {
    setAlertSeverity(severity);
    setAlertMessage(message);
    setAlertOpen(true);
  };

  const handleTabChange = (e, newValue) => {
    setActiveTab(newValue);
    setAppDropdownOpen(false);
  };

  const handleOpenDialog = (item = null) => {
    // Validation for Modules tab
    if (activeTab === 1 && !selectedAppId && !item) {
      showAlert("warning", "Please select an Application first.");
      return;
    }

    setFormData({
      id: item?.id || null,
      name: item?.name || "",
      description: item?.description || "",
    });
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setFormData({ id: null, name: "", description: "" });
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      showAlert("error", "Name is required.");
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      if (activeTab === 0) {
        await handleSaveApplication();
      } else if (activeTab === 1) {
        await handleSaveModule();
      } else {
        await handleSaveClient();
      }

      handleCloseDialog();
      showAlert("success", `${currentType} saved successfully!`);
    } catch (err) {
      showAlert("error", err?.message || `Failed to save ${currentType}`);
      console.error(err);
    }
  };

  const handleSaveApplication = async () => {
    if (formData.id) {
      // UPDATE
      await ApplicationApi.edit(formData.id, {
        applicationName: formData.name,
        applicationDescription: formData.description,
      });
    } else {
      // CREATE
      await ApplicationApi.create({
        applicationName: formData.name,
        applicationDescription: formData.description,
      });
    }
    // Refetch fresh data
    await loadApplications();
  };

  const handleSaveModule = async () => {
    if (formData.id) {
      // UPDATE
      await ModuleApi.edit(formData.id, {
        moduleName: formData.name,
        moduleDescription: formData.description,
        appid: selectedAppId,
      });
    } else {
      // CREATE
      await ModuleApi.create({
        moduleName: formData.name,
        moduleDescription: formData.description,
        appid: selectedAppId,
      });
    }
    // Refetch fresh data
    await loadModules();
  };

  const handleSaveClient = async () => {
    if (formData.id) {
      // UPDATE
      await ClientApi.edit(formData.id, {
        name: formData.name,
        description: formData.description,
      });
    } else {
      // CREATE
      await ClientApi.create({
        name: formData.name,
        description: formData.description,
      });
    }
    // Refetch fresh data
    await loadClients();
  };

  const handleDeleteClick = (item) => {
    setDeleteItem(item);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteItem) return;

    try {
      if (activeTab === 0) {
        await ApplicationApi.delete(deleteItem.id);
        setApplications((prev) => prev.filter((a) => a.id !== deleteItem.id));
      } else if (activeTab === 1) {
        await ModuleApi.delete(deleteItem.id);
        setModules((prev) => prev.filter((m) => m.id !== deleteItem.id));
      } else {
        await ClientApi.delete(deleteItem.id);
        setClients((prev) => prev.filter((c) => c.id !== deleteItem.id));
      }

      showAlert("success", `${currentType} deleted successfully!`);
      setDeleteDialogOpen(false);
      setDeleteItem(null);
    } catch (err) {
      showAlert("error", err?.message || `Failed to delete ${currentType}`);
      console.error(err);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setDeleteItem(null);
  };

  // ==================== RENDER ====================
  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "400px",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography
          variant="h4"
          sx={{ fontWeight: 700, color: customTheme.colors.text.primary }}
        >
          Admin Configuration
        </Typography>
        <Button
          variant="contained"
          onClick={() => handleOpenDialog()}
          sx={{
            backgroundColor: customTheme.colors.primary,
            textTransform: "none",
            borderRadius: customTheme.borderRadius.medium,
            padding: "10px 24px",
            fontWeight: 500,
            boxShadow: customTheme.shadows.small,
          }}
        >
          + {currentType}
        </Button>
      </Box>

      {/* Tabs */}
      <Paper
        sx={{
          mb: 3,
          borderRadius: customTheme.borderRadius.medium,
          backgroundColor: customTheme.colors.surface,
        }}
      >
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          sx={{
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: 600,
              color: customTheme.colors.text.secondary,
            },
            "& .Mui-selected": { color: customTheme.colors.primary },
            "& .MuiTabs-indicator": {
              backgroundColor: customTheme.colors.primary,
              height: 3,
            },
          }}
        >
          <Tab label="Applications" />
          <Tab label="Modules" />
          <Tab label="Clients" />
        </Tabs>
      </Paper>

      {/* Tab Content */}
      {activeTab === 0 && (
        <ApplicationsTab
          applications={applications}
          onEdit={handleOpenDialog}
          onDelete={handleDeleteClick}
        />
      )}

      {activeTab === 1 && (
        <ModulesTab
          filteredModules={filteredModules}
          applications={applications}
          selectedApplication={selectedApplication}
          selectedAppId={selectedAppId}
          setSelectedAppId={setSelectedAppId}
          appDropdownOpen={appDropdownOpen}
          setAppDropdownOpen={setAppDropdownOpen}
          onEdit={handleOpenDialog}
          onDelete={handleDeleteClick}
        />
      )}

      {activeTab === 2 && (
        <ClientsTab
          clients={clients}
          onEdit={handleOpenDialog}
          onDelete={handleDeleteClick}
        />
      )}

      {/* Add/Edit Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            backgroundColor: customTheme.colors.surface,
            color: customTheme.colors.text.primary,
          },
        }}
      >
        <DialogTitle>
          {formData.id
            ? `Edit ${currentType}`
            : activeTab === 1
            ? `Add Module to "${selectedApplication?.name}"`
            : `Create New ${currentType}`}
        </DialogTitle>
        <DialogContent dividers>
          <TextField
            autoFocus
            fullWidth
            label={`${currentType} Name`}
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            margin="normal"
            required
            sx={{
              "& .MuiInputLabel-root": {
                color: customTheme.colors.text.secondary,
              },
              "& .MuiOutlinedInput-root": {
                color: customTheme.colors.text.primary,
                "& fieldset": { borderColor: customTheme.colors.lightGray },
                "&:hover fieldset": {
                  borderColor: "#fff",
                },
                "&.Mui-focused fieldset": {
                  borderColor: customTheme.colors.primary,
                  borderWidth: "2px",
                },
              },
            }}
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
            sx={{
              "& .MuiInputLabel-root": {
                color: customTheme.colors.text.secondary,
              },
              "& .MuiOutlinedInput-root": {
                color: customTheme.colors.text.primary,
                "& fieldset": { borderColor: customTheme.colors.lightGray },
                "&:hover fieldset": {
                  borderColor: "#fff",
                },
                "&.Mui-focused fieldset": {
                  borderColor: customTheme.colors.primary,
                  borderWidth: "2px",
                },
              },
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button type="secondary" onClick={handleCloseDialog}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            sx={{ backgroundColor: customTheme.colors.primary }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete{" "}
            <strong>{deleteItem?.name}</strong>? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button type="secondary" onClick={handleDeleteCancel}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleDeleteConfirm}
            sx={{ backgroundColor: customTheme.colors.error }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Alert */}
      <Alert
        open={alertOpen}
        onClose={() => setAlertOpen(false)}
        severity={alertSeverity}
        message={alertMessage}
      />
    </div>
  );
}