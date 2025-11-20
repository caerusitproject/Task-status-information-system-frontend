// src/components/TaskHeaderStrip.jsx
import { useState, useEffect } from "react";
import {
  Box,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  TextField,
  Button,
  Checkbox,
  ListItemText,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { ApplicationApi } from "../../api/applicationApi";

export default function TaskHeaderStrip({
  taskId,
  taskDbId,
  date,
  initialSelections = {},
  onHeaderChange,
  debouncedSave,
  colorCode,
  applications = [],    // ← from Timesheet.jsx
  reports = [],         // ← from Timesheet.jsx
  loadingHeaderData = true,
}) {

  console.log("TaskHeaderStrip received taskDbId:", taskDbId);  // ← ADD THIS
  console.log("TaskHeaderStrip received taskId:", taskId);
  const todayStr = new Date().toISOString().split("T")[0];
  const isToday = date === todayStr;

  const [selections, setSelections] = useState({
    apps: [],
    modules: [],
    reports: [],
  });

  const [anchorEl, setAnchorEl] = useState(null);
  const [menuType, setMenuType] = useState(""); // "app" | "report"
  const [submenuAnchor, setSubmenuAnchor] = useState(null);
  const [selectedAppForModules, setSelectedAppForModules] = useState(null);
  const [reportInput, setReportInput] = useState("");

  // Sync initialSelections from task (from backend)
    // ── CORRECTLY READ BOTH OLD AND NEW BACKEND FORMATS ──
  // ── PERFECTLY READS YOUR CURRENT BACKEND FORMAT ──
useEffect(() => {
  // Don't run while loading applications/reports
  if (loadingHeaderData) return;

  // CRITICAL FIX: Only run this effect ONCE when the task first loads
  // After that, NEVER overwrite user's current selections (prevents flashing/disappearing)
  if (selections.apps.length > 0 || selections.modules.length > 0 || selections.reports.length > 0) {
    return;
  }

  const apps = [];
  const modules = [];
  const reports = [];

  // === YOUR CURRENT BACKEND FORMAT (2025) ===
  if (initialSelections.appName?.appName) {
    apps.push(initialSelections.appName.appName);
  }

  if (Array.isArray(initialSelections.modulename)) {
    initialSelections.modulename.forEach((m) => {
      if (m.moduleName) modules.push(m.moduleName);
    });
  }

  if (Array.isArray(initialSelections.reportName)) {
    initialSelections.reportName.forEach((r) => {
      if (typeof r === "object" && r.reportName) {
        reports.push(r.reportName);
      } else if (typeof r === "string") {
        reports.push(r);
      }
    });
  }

  // === OLD FORMAT FALLBACK (for legacy data) ===
  if (Array.isArray(initialSelections.apps)) {
    apps.push(...initialSelections.apps.filter(Boolean));
  }
  if (Array.isArray(initialSelections.modules)) {
    modules.push(...initialSelections.modules.filter(Boolean));
  }
  if (Array.isArray(initialSelections.reports)) {
    reports.push(...initialSelections.reports.filter(Boolean));
  }

  // Only update if we actually found something
  if (apps.length > 0 || modules.length > 0 || reports.length > 0) {
    setSelections({
      apps: [...new Set(apps)],
      modules: [...new Set(modules)],
      reports: [...new Set(reports)],
    });
  }
}, [initialSelections?.updatedDate, loadingHeaderData]);

  const openMenu = (e) => {
    if (!isToday) return;
    setAnchorEl(e.currentTarget);
  };

  const closeMenu = () => {
    setAnchorEl(null);
    setMenuType("");
    setReportInput("");
  };

  const closeSubMenu = () => {
    setSubmenuAnchor(null);
    setSelectedAppForModules(null);
  };

  const isAppChecked = (appName) =>
    selections.modules.some(mod =>
      applications.find(a => a.name === appName)?.module.some(m => m.name === mod)
    );

  const toggleItem = (type, value) => {
    const newSel = { ...selections };

    if (type === "module") {
      const idx = newSel.modules.indexOf(value);
      if (idx > -1) {
        newSel.modules.splice(idx, 1);
      } else {
        newSel.modules.push(value);
      }

      // Auto manage parent app
      let parentApp = null;
      for (const app of applications) {
        if (app.module.some(m => m.name === value)) {
          parentApp = app.name;
          break;
        }
      }

      if (parentApp) {
        const appModules = applications.find(a => a.name === parentApp)?.module.map(m => m.name) || [];
        const selectedCount = appModules.filter(m => newSel.modules.includes(m)).length;

        if (selectedCount > 0 && !newSel.apps.includes(parentApp)) {
          newSel.apps.push(parentApp);
        } else if (selectedCount === 0) {
          newSel.apps = newSel.apps.filter(a => a !== parentApp);
        }
      }
    }

    if (type === "report") {
      const idx = newSel.reports.indexOf(value);
      if (idx > -1) {
        newSel.reports.splice(idx, 1);
      } else {
        newSel.reports.push(value);
      }
    }

    setSelections(newSel);
    saveToBackend(newSel);
    onHeaderChange?.(newSel);
  };

  const saveToBackend = (newSel) => {
  const payloadApplications = [];
  newSel.apps.forEach(appName => {
    const app = applications.find(a => a.name === appName);
    if (app) {
      const selectedModuleIds = newSel.modules
        .map(modName => app.module.find(m => m.name === modName)?.id)
        .filter(Boolean);
      if (selectedModuleIds.length > 0) {
        payloadApplications.push({
          applicationId: app.id,
          moduleIds: selectedModuleIds,
        });
      }
    }
  });

  const payloadReportIds = newSel.reports
    .map(name => reports.find(r => r.name === name)?.id)
    .filter(Boolean);

  // ← THIS LINE WAS WRONG → FIXED BELOW
  debouncedSave(taskDbId, {                    // ← taskDbId (number, e.g., 3)
    applications: payloadApplications.length > 0 ? payloadApplications : null,
    reportName: payloadReportIds.length > 0 ? payloadReportIds : null,
  }, date);
};

  const handleReportSave = async () => {
    const trimmed = reportInput.trim();
    if (!trimmed) return;

    try {
      await ApplicationApi.postReports({ reportName: trimmed });
      // Optionally refetch reports from parent, or just add locally
      toggleItem("report", trimmed);
    } catch (err) {
      alert("Failed to create report");
    }
    setReportInput("");
    closeMenu();
  };

  const openSubMenu = (event, appName) => {
    setSelectedAppForModules(appName);
    setSubmenuAnchor(event.currentTarget);
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "8px 16px",
          borderRadius: "6px",
          m: 0.5,
          border: "1px solid #e0e0e0",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
          <Typography sx={{ fontWeight: 600, fontSize: "0.875rem", color: "#f5f5f5", mr: 0.5 }}>
            Tages :
          </Typography>

          {isToday &&
            selections.apps.map((app) => (
              <Chip
                key={app}
                label={app}
                size="small"
                sx={{
                  bgcolor: colorCode,
                  color: "#000",
                  p: 1,
                  borderRadius: "999px",
                  fontWeight: 600,
                  fontSize: "0.875rem",
                }}
              />
            ))}

          {isToday &&
            selections.modules.map((mod) => (
              <Chip
                key={mod}
                label={mod}
                size="small"
                onDelete={() => toggleItem("module", mod)}
                sx={{
                  bgcolor: colorCode,
                  color: "#000",
                  p: 1,
                  borderRadius: "999px",
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  "& .MuiChip-deleteIcon": { color: "#000", opacity: 0.9 },
                }}
              />
            ))}

          {isToday &&
            selections.reports.map((rep) => (
              <Chip
                key={rep}
                label={rep}
                size="small"
                onDelete={() => toggleItem("report", rep)}
                sx={{
                  bgcolor: colorCode,
                  color: "#000",
                  p: 1,
                  borderRadius: "999px",
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  "& .MuiChip-deleteIcon": { color: "#000", opacity: 0.9 },
                }}
              />
            ))}
        </Box>
 {isToday &&(
        <IconButton size="small" onClick={openMenu} sx={{ color: "#fff" }}>
          <AddIcon fontSize="small" />
        </IconButton>
 )}
      </Box>

      {/* Main Menu */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl) && menuType === ""} onClose={closeMenu}>
        <MenuItem onClick={() => setMenuType("app")}>Application / Module</MenuItem>
        <MenuItem onClick={() => setMenuType("report")}>Report</MenuItem>
      </Menu>

      {/* Application → Module Submenu */}
      <Menu anchorEl={anchorEl} open={menuType === "app"} onClose={closeMenu}>
        {applications.map((app) => (
          <MenuItem
            key={app.id}
            onClick={(e) => openSubMenu(e, app.name)}
            sx={{ py: 0.5 }}
          >
            <Checkbox size="small" checked={isAppChecked(app.name)} />
            <ListItemText primary={app.name} />
            <KeyboardArrowRightIcon sx={{ ml: "auto" }} />
          </MenuItem>
        ))}
      </Menu>

      <Menu
        anchorEl={submenuAnchor}
        open={Boolean(submenuAnchor)}
        onClose={closeSubMenu}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
      >
        {selectedAppForModules &&
          applications
            .find(a => a.name === selectedAppForModules)
            ?.module.map((mod) => (
              <MenuItem
                key={mod.id}
                onClick={() => {
                  toggleItem("module", mod.name);
                  closeSubMenu();
                }}
                sx={{ py: 0.5 }}
              >
                <Checkbox size="small" checked={selections.modules.includes(mod.name)} />
                <ListItemText primary={mod.name} />
              </MenuItem>
            ))}
      </Menu>

      {/* Report Menu + Add New */}
      <Menu anchorEl={anchorEl} open={menuType === "report"} onClose={closeMenu} PaperProps={{ sx: { width: 320 } }}>
        <Box sx={{ p: 1, maxHeight: 400, overflow: "auto" }}>
          {reports.map((r) => (
            <MenuItem key={r.id} onClick={() => toggleItem("report", r.name)} sx={{ py: 0.5 }}>
              <Checkbox size="small" checked={selections.reports.includes(r.name)} />
              <ListItemText primary={r.name} />
            </MenuItem>
          ))}

          <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
            <TextField
              size="small"
              placeholder="New report name..."
              value={reportInput}
              onChange={(e) => setReportInput(e.target.value)}
              onKeyDown={(e) => e.stopPropagation()}
              fullWidth
            />
            <Button variant="contained" size="small" onClick={handleReportSave} disabled={!reportInput.trim()}>
              Add
            </Button>
          </Box>
        </Box>
      </Menu>
    </>
  );
}