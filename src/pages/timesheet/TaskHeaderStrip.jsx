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
  Typography,
  Checkbox,
  ListItemText,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { theme } from "../../theme/theme";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

// Dummy + Dynamic Reports (will grow when user adds custom ones)

export default function TaskHeaderStrip({
  taskId,
  date,
  initialSelections = {},
  onHeaderChange,
  debouncedSave,
  colorCode,
}) {
  const baseDummyData = {
    applications: ["Oracle", "Salesforce", "SAP"],
    modulesByApp: {
      Oracle: ["Users", "Roles", "Audit Logs"],
      Salesforce: ["Leads", "Contacts", "Analytics"],
      SAP: ["Finance", "Inventory", "HR"],
    },
    // modules: [
    //   "User Management",
    //   "Reports",
    //   "Workflow",
    //   "Notifications",
    //   "Settings",
    // ],
    reports: [
      "Daily Sales",
      "User Activity",
      "Error Log",
      "Performance Report",
      "Audit Trail",
    ],
  };
  const todayStr = new Date().toISOString().split("T")[0];
  const isToday = date === todayStr;

  // Dynamic report list (starts with dummy + grows with custom entries)
  const [dynamicReports, setDynamicReports] = useState([
    // ...baseDummyData.reports,
  ]);
  const [submenuAnchor, setSubmenuAnchor] = useState(null);
  const [selectedAppForModules, setSelectedAppForModules] = useState(null);

  const [selections, setSelections] = useState({
    apps: Array.isArray(initialSelections.apps) ? initialSelections.apps : [],
    modules: Array.isArray(initialSelections.modules)
      ? initialSelections.modules
      : [],
    reports: Array.isArray(initialSelections.reports)
      ? initialSelections.reports
      : [],
  });

  const [anchorEl, setAnchorEl] = useState(null);
  const [menuType, setMenuType] = useState(""); // "app" | "module" | "report"
  const [reportInput, setReportInput] = useState("");

  // const baseDummyData = {
  //   applications: ["Oracle", "Salesforce", "SAP"],
  //   modulesByApp: {
  //     Oracle: ["Users", "Roles", "Audit Logs"],
  //     Salesforce: ["Leads", "Contacts", "Analytics"],
  //     SAP: ["Finance", "Inventory", "HR"],
  //   },
  // };

  // Sync from parent
  useEffect(() => {
    setSelections({
      apps: Array.isArray(initialSelections.apps) ? initialSelections.apps : [],
      modules: Array.isArray(initialSelections.modules)
        ? initialSelections.modules
        : [],
      reports: Array.isArray(initialSelections.reports)
        ? initialSelections.reports
        : [],
    });
  }, [initialSelections]);

  const openMenu = (e) => {
    if (!isToday) return;
    setAnchorEl(e.currentTarget);
  };

  const closeMenu = () => {
    setAnchorEl(null);
    setMenuType("");
    setReportInput("");
  };

  const saveSelection = (newSel) => {
    setSelections(newSel);
    debouncedSave(taskId, { headerSelections: { ...newSel } }, date);
    onHeaderChange?.(newSel);
  };

  // const toggleItem = (type, value) => {
  //   const key =
  //     type === "app" ? "apps" : type === "module" ? "modules" : "reports";
  //   const current = selections[key];

  //   const updated = current.includes(value)
  //     ? current.filter((i) => i !== value)
  //     : [...current, value];

  //   saveSelection({ ...selections, [key]: updated });
  // };

  // const toggleItem = (type, value) => {
  //   const key =
  //     type === "app" ? "apps" : type === "module" ? "modules" : "reports";

  //   const current = selections[key];

  //   let updated;

  //   if (type === "app") {
  //     // App should ONLY be added, never removed automatically
  //     if (!current.includes(value)) {
  //       updated = [...current, value]; // add app
  //     } else {
  //       updated = current; // ❗ keep it selected even if clicked again OR modules unselect
  //     }
  //   } else {
  //     // Normal toggle for modules and reports
  //     updated = current.includes(value)
  //       ? current.filter((i) => i !== value)
  //       : [...current, value];
  //   }

  //   saveSelection({ ...selections, [key]: updated });
  // };
  const toggleItem = (type, value) => {
    const newSelections = { ...selections };

    if (type === "app") {
      // Clicking an app: add it (user wants it), but it can be removed later if no modules
      if (!newSelections.apps.includes(value)) {
        newSelections.apps = [...newSelections.apps, value];
      }
      // Clicking again? Do nothing — can't manually deselect
    } else if (type === "module") {
      // Toggle module
      const wasSelected = newSelections.modules.includes(value);
      if (wasSelected) {
        newSelections.modules = newSelections.modules.filter(
          (m) => m !== value
        );
      } else {
        newSelections.modules = [...newSelections.modules, value];
      }

      // Find parent app
      let parentApp = null;
      for (const [app, modules] of Object.entries(baseDummyData.modulesByApp)) {
        if (modules.includes(value)) {
          parentApp = app;
          break;
        }
      }

      if (parentApp) {
        const appModules = baseDummyData.modulesByApp[parentApp];
        const selectedCount = appModules.filter((m) =>
          newSelections.modules.includes(m)
        ).length;

        // Rule: App must be selected ONLY if at least one module is selected
        if (selectedCount > 0) {
          if (!newSelections.apps.includes(parentApp)) {
            newSelections.apps = [...newSelections.apps, parentApp];
          }
        } else {
          // No modules selected → remove app, even if user clicked it earlier
          newSelections.apps = newSelections.apps.filter(
            (a) => a !== parentApp
          );
        }
      }
    } else if (type === "report") {
      newSelections.reports = newSelections.reports.includes(value)
        ? newSelections.reports.filter((r) => r !== value)
        : [...newSelections.reports, value];
    }

    // Final cleanup: Remove any app that has zero selected modules
    // This ensures consistency even if someone manually added an app with no modules
    const validApps = newSelections.apps.filter((app) => {
      const modules = baseDummyData.modulesByApp[app] || [];
      return modules.some((m) => newSelections.modules.includes(m));
    });

    newSelections.apps = validApps;

    saveSelection(newSelections);
  };

  const handleReportSave = () => {
    const trimmed = reportInput.trim();
    if (!trimmed) return;

    // Add to dynamic list if not already there
    if (!dynamicReports.includes(trimmed)) {
      setDynamicReports((prev) => [...prev, trimmed]);
    }

    // Also select it
    toggleItem("report", trimmed);
    setReportInput("");
  };

  const handleDelete = (type, value) => {
    const key =
      type === "app" ? "apps" : type === "module" ? "modules" : "reports";
    const updated = selections[key].filter((i) => i !== value);
    saveSelection({ ...selections, [key]: updated });
  };

  const closeSubMenu = () => {
    setSubmenuAnchor(null);
    setSelectedAppForModules(null);
  };

  const openSubMenu = (event, app) => {
    setSelectedAppForModules(app);
    setSubmenuAnchor(event.currentTarget);
  };

  const isAppChecked = (app) =>
    selections.modules.some((mod) =>
      baseDummyData?.modulesByApp[app]?.includes(mod)
    );

  return (
    <>
      {/* ────── YOUR ORIGINAL STYLE (UNCHANGED) ────── */}
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
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            flexWrap: "wrap",
          }}
        >
          <Typography
            sx={{
              fontWeight: 600,
              fontSize: "0.875rem",
              color: "#f5f5f5",
              mr: 0.5,
            }}
          >
            Tages :
          </Typography>

          {/* Multiple Apps */}
          {isToday &&
            selections.apps.map((app) => (
              <Chip
                key={app}
                label={app}
                size="small"
                onDelete={() => handleDelete("app", app)}
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

          {/* Multiple Modules */}
          {isToday &&
            selections.modules.map((mod) => (
              <Chip
                key={mod}
                label={mod}
                size="small"
                onDelete={() => handleDelete("module", mod)}
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

          {/* Multiple Reports */}
          {isToday &&
            selections.reports.map((rep) => (
              <Chip
                key={rep}
                label={rep}
                size="small"
                onDelete={() => handleDelete("report", rep)}
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

        {isToday && (
          <IconButton
            size="small"
            onClick={openMenu}
            sx={{ color: theme.colors.text.primary }}
          >
            <AddIcon fontSize="small" />
          </IconButton>
        )}
      </Box>

      {/* ────── MAIN MENU ────── */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl) && menuType === ""}
        onClose={closeMenu}
        PaperProps={{ sx: { minWidth: 180 } }}
      >
        <MenuItem onClick={() => setMenuType("app")}>
          Application / Module
        </MenuItem>
        {/* <MenuItem onClick={() => setMenuType("module")}>Module</MenuItem> */}
        <MenuItem onClick={() => setMenuType("report")}>Report</MenuItem>
      </Menu>

      {/* ────── APPLICATION (Beautiful Checkbox) ────── */}
      {/* <Menu anchorEl={anchorEl} open={menuType === "app"} onClose={closeMenu}>
        {baseDummyData.applications.map((app) => (
          <MenuItem key={app} onClick={() => toggleItem("app", app)} sx={{ py: 0.5 }}>
            <Checkbox
              size="small"
              checked={selections.apps.includes(app)}
              sx={{
                color: "#999",
                "&.Mui-checked": { color: theme.colors.primary },
              }}
            />
            <ListItemText primary={app} />
          </MenuItem>
        ))}
      </Menu> */}

      {/* ────── MODULE (Beautiful Checkbox) ────── */}
      {/* <Menu anchorEl={anchorEl} open={menuType === "module"} onClose={closeMenu}>
        {baseDummyData.modules.map((mod) => (
          <MenuItem key={mod} onClick={() => toggleItem("module", mod)} sx={{ py: 0.5 }}>
            <Checkbox
              size="small"
              checked={selections.modules.includes(mod)}
              sx={{
                color: "#999",
                "&.Mui-checked": { color: theme.colors.primary },
              }}
            />
            <ListItemText primary={mod} />
          </MenuItem>
        ))}
      </Menu> */}

      {/* ───── APPLICATION MENU ───── */}
      <Menu anchorEl={anchorEl} open={menuType === "app"} onClose={closeMenu}>
        {baseDummyData.applications.map((app) => (
          <MenuItem
            key={app}
            sx={{ py: 0.5 }}
            onClick={(e) => {
              toggleItem("app", app);
              openSubMenu(e, app);
            }} // <-- open submenu
          >
            {console.log("checkbox___", selections)}
            <Checkbox
              size="small"
              checked={isAppChecked(app)}
              sx={{
                color: "#999",
                "&.Mui-checked": { color: theme.colors.primary },
              }}
            />
            <ListItemText primary={app} />
            <span style={{ marginLeft: "auto" }}>
              <KeyboardArrowRightIcon />
            </span>{" "}
            {/* Right arrow */}
          </MenuItem>
        ))}
      </Menu>

      {/* ───── MODULE SUBMENU (Loads modules for selected app) ───── */}
      <Menu
        anchorEl={submenuAnchor}
        open={Boolean(submenuAnchor)}
        onClose={closeSubMenu}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
      >
        {selectedAppForModules &&
          baseDummyData.modulesByApp[selectedAppForModules]?.map((mod) => (
            <MenuItem
              key={mod}
              onClick={() => {
                toggleItem("module", mod);
                closeSubMenu();
              }}
              sx={{ py: 0.5 }}
            >
              <Checkbox
                size="small"
                checked={selections.modules.includes(mod)}
                sx={{
                  color: "#999",
                  "&.Mui-checked": { color: theme.colors.primary },
                }}
              />
              <ListItemText primary={mod} />
            </MenuItem>
          ))}
      </Menu>

      {/* ────── REPORT (Dynamic List + Custom Input) ────── */}
      <Menu
        anchorEl={anchorEl}
        open={menuType === "report"}
        onClose={closeMenu}
        PaperProps={{ sx: { width: 320 } }}
      >
        <Box sx={{ p: 1, maxHeight: 400, overflow: "auto" }}>
          {/* <Typography variant="subtitle2" gutterBottom>
            Select or add Report
          </Typography> */}

          {/* Dynamic Report List */}
          {dynamicReports.map((r) => (
            <MenuItem
              key={r}
              onClick={() => toggleItem("report", r)}
              sx={{ py: 0.5 }}
            >
              <Checkbox
                size="small"
                checked={selections.reports.includes(r)}
                sx={{
                  color: "#999",
                  "&.Mui-checked": { color: theme.colors.primary },
                }}
              />
              <ListItemText primary={r} />
            </MenuItem>
          ))}

          {/* Custom Report Input */}
          <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
            <TextField
              size="small"
              placeholder="New report name..."
              value={reportInput}
              onChange={(e) => setReportInput(e.target.value)}
              onKeyDown={(e) => e.stopPropagation()}
              fullWidth
            />
            <Button
              variant="contained"
              size="small"
              onClick={handleReportSave}
              disabled={!reportInput.trim()}
            >
              Add
            </Button>
          </Box>
        </Box>
      </Menu>
    </>
  );
}
