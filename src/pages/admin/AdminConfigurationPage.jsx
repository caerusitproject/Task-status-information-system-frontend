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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { Edit, X, ChevronDown } from "lucide-react"; // Lucide icons
import { theme as customTheme } from "../../theme/theme";
import Button from "../../components/common/Button";
import Alert from "../../components/common/Alert";
import { ApplicationApi } from "../../api/applicationApi";
import { ModuleApi } from "../../api/moduleApi";
import { ClientApi } from "../../api/clientApi";

export default function AdminConfig() {
  const [activeTab, setActiveTab] = useState(0);
  const [applications, setApplications] = useState([]);
  const [modules, setModules] = useState([]);
  const [clients, setClients] = useState([]);
  const [selectedAppId, setSelectedAppId] = useState("");
  const [open, setOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null);
  const [appDropdownOpen, setAppDropdownOpen] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    name: "",
    description: "",
    applicationId: null,
  });

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState("success");
  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {
    async function viewApplciaiton() {
      try {
        const viewApplications = await ApplicationApi.view();
        setApplications(
          viewApplications && viewApplications.rows?.length > 0
            ? viewApplications?.rows
            : []
        );
      } catch (err) {
        setAlertOpen(err && err.message);
      }
    }

    async function viewModules() {
      try {
        const viewModules = await ModuleApi.view();
        setModules(
          viewModules && viewModules.rows?.length > 0 ? viewModules?.rows : []
        );
      } catch (err) {
        setAlertOpen(err && err.message);
      }
    }
    async function viewClients() {
      try {
        const viewClients = await ClientApi.view();
        setClients(
          viewClients && viewClients.rows?.length > 0 ? viewClients?.rows : []
        );
      } catch (err) {
        setAlertOpen(err && err.message);
      }
    }

    viewApplciaiton();
    viewModules();
    viewClients();
  }, []);

  useEffect(() => {
    if (activeTab === 1 && applications.length > 0 && !selectedAppId) {
      setSelectedAppId(applications[0].id);
    }
  }, [activeTab, applications]);

  const selectedApplication = applications.find(
    (app) => app.id === Number(selectedAppId)
  );
  const filteredModules = selectedAppId
    ? modules.filter((m) => m.app_id === Number(selectedAppId))
    : [];

  const selectedClient = clients.find(
    (client) => client.id === Number(selectedAppId)
  );

  // console.log("filteredModules view___", filteredModules, selectedAppId);

  const handleTabChange = (e, newValue) => setActiveTab(newValue);

  const handleOpen = (item = null) => {
    console.log("application___", item);
    if (activeTab === 1 && !selectedAppId && !item) {
      setAlertSeverity("warning");
      setAlertMessage("Please select an Application first.");
      setAlertOpen(true);
      return;
    }
    setFormData({
      id: item?.id || null,
      name: item?.name || "",
      description: item?.description || "",
      applicationId: activeTab === 1 ? Number(selectedAppId) : null,
    });
    setOpen(true);
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      setAlertSeverity("error");
      setAlertMessage("Name is required.");
      setAlertOpen(true);
      return;
    }

    if (activeTab === 0) {
      if (formData.id) {
        setApplications((prev) =>
          prev.map((a) =>
            a.id === formData.id
              ? { ...a, name: formData.name, description: formData.description }
              : a
          )
        );
        const UpdateApplication = await ApplicationApi.edit(formData.id, {
          applicationName: formData.name,
          applicationDescription: formData.description,
        });
        console.log("Application Updated___", formData);
        setAlertMessage("Application updated!");
      } else {
        const newApp = {
          id: Math.max(...applications.map((a) => a.id), 0) + 1,
          ...formData,
        };
        setApplications((prev) => [...prev, newApp]);

        const createApi = await ApplicationApi.create({
          applicationName: newApp.name,
          applicationDescription: newApp.description,
        });

        console.log("Application Created___", newApp);
        setAlertMessage("Application created!");
      }
    } else if (activeTab === 1) {
      if (formData.id) {
        setModules((prev) =>
          prev.map((m) =>
            m.id === formData.id
              ? { ...m, name: formData.name, description: formData.description }
              : m
          )
        );
        const UpdateModule = await ModuleApi.edit(formData.id, {
          moduleName: formData.name,
          moduleDescription: formData.description,
          appid: selectedAppId,
        });
        setAlertMessage("Module updated!");
      } else {
        const newModule = {
          id: Math.max(...modules.map((m) => m.id), 0) + 1,
          applicationId: Number(selectedAppId),
          name: formData.name,
          description: formData.description,
        };
        const UpdateModule = await ModuleApi.create({
          moduleName: formData.name,
          moduleDescription: formData.description,
          appid: selectedAppId,
        });
        const viewModule = await ModuleApi.view(1);
        setModules(
          viewModule && viewModule.rows?.length > 0 ? viewModule?.rows : []
        );
        // setModules((prev) => [...prev, newModule]);
        setAlertMessage(`Module added to ${selectedApplication?.name}!`);
      }
    } else {
      if (formData.id) {
        // ---- UPDATE CLIENT ----
        try {
          const updateRes = await ClientApi.edit(formData.id, {
            name: formData.name,
            description: formData.description,
          });

          setClients((prev) =>
            prev.map((c) =>
              c.id === formData.id
                ? {
                    ...c,
                    name: formData.name,
                    description: formData.description,
                  }
                : c
            )
          );

          setAlertSeverity("success");
          setAlertMessage("Client updated!");
        } catch (err) {
          setAlertSeverity("error");
          setAlertMessage(err?.message || "Error updating client");
        }
      } else {
        // ---- CREATE CLIENT ----
        try {
          const createRes = await ClientApi.create({
            name: formData.name,
            description: formData.description,
          });

          // Fetch updated list (LIKE YOU ALREADY DO IN MODULE CREATE)
          const refreshed = await ClientApi.view();

          setClients(
            refreshed && refreshed.rows?.length > 0 ? refreshed.rows : []
          );

          setAlertSeverity("success");
          setAlertMessage("Client created!");
        } catch (err) {
          setAlertSeverity("error");
          setAlertMessage(err?.message || "Error creating client");
        }
      }
    }

    setAlertSeverity("success");
    setAlertOpen(true);
    setOpen(false);
    setFormData({ id: null, name: "", description: "", applicationId: null });
  };

  const handleDeleteClick = (item) => {
    setDeleteItem(item);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (activeTab === 0) {
      setApplications((prev) => prev.filter((a) => a.id !== deleteItem.id));
      setAlertMessage("Application deleted.");
    } else {
      setModules((prev) => prev.filter((m) => m.id !== deleteItem.id));
      setAlertMessage("Module deleted.");
    }
    setAlertSeverity("success");
    setAlertOpen(true);
    setDeleteConfirmOpen(false);
    setDeleteItem(null);
  };
  console.log("filtered Modules___", filteredModules);
  // const currentData = activeTab === 0 ? applications : filteredModules;
  const currentData =
    activeTab === 0
      ? applications
      : activeTab === 1
      ? filteredModules
      : clients;
  const currentType =
    activeTab === 0 ? "Application" : activeTab === 1 ? "Module" : "Client";

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
          onClick={() => handleOpen()}
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

      {/* Application Dropdown (Same Style as WeekDropdown) */}
      {activeTab === 1 && (
        <Box sx={{ mb: 1, mr: 2, display: "flex", justifyContent: "flex-end" }}>
          <Box sx={{ mt: 1, mr: 1 }}>
            <Typography>
              {" "}
              <strong>Applications :</strong>{" "}
            </Typography>
          </Box>

          <Box sx={{ mb: 2, display: "flex", justifyContent: "flex-end" }}>
            <div style={{ position: "relative", width: "260px" }}>
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
                  style={{ marginLeft: "8px", transition: "transform 0.2s" }}
                />
              </button>
              {appDropdownOpen && (
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
                      onClick={() => {
                        setSelectedAppId(app.id);
                        setAppDropdownOpen(false);
                      }}
                      style={{
                        width: "100%",
                        textAlign: "left",
                        padding: "0.75rem 1rem",
                        backgroundColor:
                          selectedAppId === app.id
                            ? customTheme.colors.lightGray
                            : "transparent",
                        border: "none",
                        color: customTheme.colors.text.primary,
                        fontWeight: selectedAppId === app.id ? 600 : 500,
                        cursor: "pointer",
                        transition: "background-color 0.2s",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor =
                          customTheme.colors.lightGray)
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor =
                          selectedAppId === app.id
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
      )}

      {/* Table */}
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
                sx={{ color: customTheme.colors.text.primary, fontWeight: 600 }}
              >
                Name
              </TableCell>
              <TableCell
                sx={{ color: customTheme.colors.text.primary, fontWeight: 600 }}
              >
                Description
              </TableCell>
              {activeTab === 1 && (
                <TableCell
                  sx={{
                    color: customTheme.colors.text.primary,
                    fontWeight: 600,
                  }}
                >
                  Application
                </TableCell>
              )}
              <TableCell
                align="right"
                sx={{ color: customTheme.colors.text.primary, fontWeight: 600 }}
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={activeTab === 1 ? 4 : 3}
                  align="center"
                  sx={{ color: customTheme.colors.text.secondary }}
                >
                  {activeTab === 1 && !selectedAppId
                    ? "Select an Application"
                    : `No ${currentType.toLowerCase()}s found`}
                </TableCell>
              </TableRow>
            ) : (
              currentData.map((item) => {
                const appName =
                  activeTab === 1
                    ? applications.find((a) => a.id === item.app_id)?.name
                    : null;
                return (
                  <TableRow
                    key={item.id}
                    sx={{
                      "&:hover": {
                        backgroundColor: `${customTheme.colors.lightGray}22`,
                      },
                    }}
                  >
                    {console.log("current date___", currentData)}
                    <TableCell sx={{ color: customTheme.colors.text.primary }}>
                      {item.name}
                    </TableCell>
                    <TableCell
                      sx={{ color: customTheme.colors.text.secondary }}
                    >
                      {item.description || "-"}
                    </TableCell>
                    {activeTab === 1 && (
                      <TableCell
                        sx={{ color: customTheme.colors.primaryLight }}
                      >
                        {appName}
                      </TableCell>
                    )}
                    <TableCell align="right">
                      <div
                        style={{
                          display: "flex",
                          gap: "8px",
                          justifyContent: "flex-end",
                        }}
                      >
                        <IconButton
                          onClick={() => handleOpen(item)}
                          size="small"
                        >
                          <Edit size={18} color={customTheme.colors.primary} />
                        </IconButton>
                        {/* <IconButton
                          onClick={() => handleDeleteClick(item)}
                          size="small"
                        >
                          <X size={18} color={customTheme.colors.error} />
                        </IconButton> */}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
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
            ? `Adding Module for "${selectedApplication?.name}"`
            : `Create New ${currentType}`}
        </DialogTitle>
        <DialogContent dividers>
          <TextField
            autoFocus
            fullWidth
            label={`${currentType} Name`}
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
          <Button type="secondary" onClick={() => setOpen(false)}>
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

      {/* Delete Confirmation */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete <strong>{deleteItem?.name}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button type="secondary" onClick={() => setDeleteConfirmOpen(false)}>
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

      <Alert
        open={alertOpen}
        onClose={() => setAlertOpen(false)}
        severity={alertSeverity}
        message={alertMessage}
      />
    </div>
  );
}
