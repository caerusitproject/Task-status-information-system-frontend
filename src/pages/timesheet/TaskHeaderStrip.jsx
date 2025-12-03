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
import { alpha } from "@mui/material/styles";
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
  applications = [],
  reports = [],
  loadingHeaderData = true,
  fetchReports,
}) {
  // console.log("TaskHeaderStrip received taskDbId:", taskDbId); // ← ADD THIS
  // console.log("TaskHeaderStrip received taskId:", taskId);
  // console.log("initialSelections:", initialSelections);
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
    if (
      selections.apps.length > 0 ||
      selections.modules.length > 0 ||
      selections.reports.length > 0
    ) {
      return;
    }

    const apps = [];
    const modules = [];
    const reports = [];

    // console.log("initialSelections:", initialSelections);
    // console.log("initialSelections.appName:", initialSelections?.appName);

    if (Array.isArray(initialSelections?.appName)) {
      // console.log("✔ appName is an array");

      initialSelections.appName.forEach((app, index) => {
        //console.log(`item[${index}]:`, app);

        if (app?.appName) {
          //console.log(" -> pushing:", app.appName);
          apps.push(app.appName);
        } else {
          // console.warn(" -> missing appName field:", app);
        }
      });
    } else {
      //console.warn("❌ initialSelections.appName is NOT an array");
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
    // if (Array.isArray(initialSelections.apps)) {
    //   apps.push(...initialSelections.apps.filter(Boolean));
    // }
    // if (Array.isArray(initialSelections.modules)) {
    //   modules.push(...initialSelections.modules.filter(Boolean));
    // }
    // if (Array.isArray(initialSelections.reports)) {
    //   reports.push(...initialSelections.reports.filter(Boolean));
    // }

    // Only update if we actually found something
    // console.log(
    //   `Parsed selections - Apps: ${apps}, Modules: ${modules}, Reports: ${reports}`
    // );
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
    selections.modules.some((mod) =>
      applications
        .find((a) => a.name === appName)
        ?.module.some((m) => m.name === mod)
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
        if (app.module.some((m) => m.name === value)) {
          parentApp = app.name;
          break;
        }
      }

      if (parentApp) {
        const appModules =
          applications
            .find((a) => a.name === parentApp)
            ?.module.map((m) => m.name) || [];
        const selectedCount = appModules.filter((m) =>
          newSel.modules.includes(m)
        ).length;

        if (selectedCount > 0 && !newSel.apps.includes(parentApp)) {
          newSel.apps.push(parentApp);
        } else if (selectedCount === 0) {
          newSel.apps = newSel.apps.filter((a) => a !== parentApp);
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
    newSel.apps.forEach((appName) => {
      const app = applications.find((a) => a.name === appName);
      if (app) {
        const selectedModuleIds = newSel.modules
          .map((modName) => app.module.find((m) => m.name === modName)?.id)
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
      .map((name) => reports.find((r) => r.name === name)?.id)
      .filter(Boolean);

    // ← THIS LINE WAS WRONG → FIXED BELOW
    debouncedSave(
      taskDbId,
      {
        // ← taskDbId (number, e.g., 3)
        applications:
          payloadApplications.length > 0 ? payloadApplications : null,
        reportName: payloadReportIds.length > 0 ? payloadReportIds : null,
      },
      date
    );
  };

 const handleReportSave = async () => {
  const trimmed = reportInput.trim();
  if (!trimmed) return;

  try {
    // 1. Create the report
    await ApplicationApi.postReports({ reportName: trimmed });

    // 2. Immediately refresh the reports list AND WAIT for the new data
    let updatedReports = [];
    if (fetchReports) {
      updatedReports = await fetchReports(); // ← this now returns the list
    }

    // 3. Find the newly created report BY NAME
    const newReport = updatedReports.find(r => r.name === trimmed);

    if (!newReport) {
      //console.error("Report created but not found in refreshed list");
      return;
    }

    // 4. NOW add it to selections — using the NAME (chip shows name)
    const newSel = {
      ...selections,
      reports: [...selections.reports, trimmed]
    };

    setSelections(newSel);

    // 5. Build payload using the FRESH reports list (critical!)
    const payloadReportIds = newSel.reports
      .map(name => updatedReports.find(r => r.name === name)?.id)
      .filter(Boolean);

    // 6. Save immediately with correct IDs
    debouncedSave(
      taskDbId,
      {
        applications: null, // or whatever you have
        reportName: payloadReportIds.length > 0 ? payloadReportIds : null,
      },
      date
    );

    // Optional: notify parent
    onHeaderChange?.(newSel);

  } catch (err) {
    console.error("Failed to create report:", err);
    //alert("Could not add report");
  } finally {
    setReportInput("");
    closeMenu();
  }
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

          {selections?.apps?.map((app, index) => {
           // console.log("Rendering chip:", app, "index:", index);
            return (
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
            );
          })}

          {selections.modules.map((mod) => {
            //console.log("Rendering mod chip:", mod);
            return (
              <Chip
                key={mod}
                label={mod}
                size="small"
                onDelete={() => toggleItem("module", mod)}
                sx={{
                  bgcolor: "#000",
                  color: colorCode,
                  borderWidth: "1px",
                  borderStyle: "solid",
                  borderColor: colorCode,
                  p: 1,
                  borderRadius: "999px",
                  fontWeight: 540,
                  fontSize: "0.875rem",
                  "& .MuiChip-deleteIcon": {
                    color: colorCode,
                    opacity: 1,
                    "&:hover": {
                      color: "#e0e0e0", // Slightly grayed white on hover
                    },
                  },
                }}
              />
            );
          })}

          {selections.reports.map((rep) => (
            <Chip
              key={rep}
              label={rep}
              size="small"
              onDelete={() => toggleItem("report", rep)}
              sx={{
                bgcolor: "#000",
                color: "#fff",
                borderWidth: "1px",
                borderStyle: "solid",
                borderColor: colorCode,
                p: 1,
                borderRadius: "999px",
                fontWeight: 500,
                fontSize: "0.875rem",
                "& .MuiChip-deleteIcon": {
                  color: colorCode,
                  opacity: 1,
                  "&:hover": {
                    color: "#e0e0e0", // Slightly grayed white on hover
                  },
                },
              }}
            />
          ))}
        </Box>
        {isToday && (
          <IconButton size="small" onClick={openMenu} sx={{ color: "#fff" }}>
            <AddIcon fontSize="small" />
          </IconButton>
        )}
      </Box>

      {/* Main Menu */}
      {/* Main Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl) && menuType === ""}
        onClose={closeMenu}
        PaperProps={{
          sx: {
            // GLOSSY GLASS PANEL
            background: "rgba(22, 22, 34, 0.85)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.18)",
            borderRadius: "18px",
            boxShadow: `
        0 16px 48px rgba(0, 0, 0, 0.55),
        inset 0 2px 0 rgba(255, 255, 255, 0.15),
        0 0 40px rgba(0, 0, 0, 0.4)
      `,
            overflow: "hidden",
            mt: 1.5,
            minWidth: 240,

            // Text & Typography
            color: "#fff",
            "& .MuiMenuItem-root": {
              color: "#fff",
              fontSize: "0.95rem",
              fontWeight: 500,
              py: 1.5,
              px: 2.5,
              borderRadius: "12px",
              mx: 1.5,
              my: 0.75,
              transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
              position: "relative",
              "&:hover": {
                bgcolor: "rgba(255, 255, 255, 0.16)",
                transform: "translateY(-3px) scale(1.01)",
                boxShadow: "0 12px 24px rgba(0,0,0,0.4)",
              },
              "&:active": {
                transform: "translateY(-1px)",
              },
            },

            // Checkboxes (for parent app selection)
            "& .MuiCheckbox-root": {
              color: "rgba(255, 255, 255, 0.7)",
              p: 1,
              "& .MuiSvgIcon-root": {
                fontSize: "1.4rem",
                filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.5))",
              },
            },
            "& .MuiCheckbox-root.Mui-checked": {
              color: colorCode || "#00ff88",
              "& .MuiSvgIcon-root": {
                filter: "drop-shadow(0 0 10px currentColor)",
              },
            },

            // Arrow icon (KeyboardArrowRightIcon)
            "& .MuiSvgIcon-root": {
              color: "rgba(255, 255, 255, 0.5)",
              fontSize: "1.4rem",
              transition: "all 0.2s ease",
            },
            "& .MuiMenuItem-root:hover .MuiSvgIcon-root": {
              color: "#fff",
              transform: "translateX(4px)",
            },

            // Subtle top highlight (premium glass effect)
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "2px",
              background:
                "linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)",
              pointerEvents: "none",
            },

            // Optional: faint inner border glow
            "&::after": {
              content: '""',
              position: "absolute",
              inset: 0,
              borderRadius: "18px",
              padding: "1px",
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.1), transparent 70%)",
              WebkitMask:
                "linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)",
              WebkitMaskComposite: "xor",
              maskComposite: "exclude",
              pointerEvents: "none",
            },
          },
        }}
      >
        <MenuItem onClick={() => setMenuType("app")}>
          Application / Module
        </MenuItem>
        <MenuItem onClick={() => setMenuType("report")}>Report</MenuItem>
      </Menu>

      {/* Application → Module Submenu */}
      <Menu
        anchorEl={anchorEl}
        open={menuType === "app"}
        onClose={closeMenu}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        PaperProps={{
          sx: {
            // GLOSSY GLASS PANEL
            background: "rgba(22, 22, 34, 0.85)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.18)",
            borderRadius: "18px",
            boxShadow: `
        0 16px 48px rgba(0, 0, 0, 0.55),
        inset 0 2px 0 rgba(255, 255, 255, 0.15),
        0 0 40px rgba(0, 0, 0, 0.4)
      `,
            overflow: "hidden",
            mt: 1.5,
            minWidth: 240,

            // Text & Typography
            color: "#fff",
            "& .MuiMenuItem-root": {
              color: "#fff",
              fontSize: "0.95rem",
              fontWeight: 500,
              py: 1.5,
              px: 2.5,
              borderRadius: "12px",
              mx: 1.5,
              my: 0.75,
              transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
              position: "relative",
              "&:hover": {
                bgcolor: "rgba(255, 255, 255, 0.16)",
                transform: "translateY(-3px) scale(1.01)",
                boxShadow: "0 12px 24px rgba(0,0,0,0.4)",
              },
              "&:active": {
                transform: "translateY(-1px)",
              },
            },

            // Checkboxes (for parent app selection)
            "& .MuiCheckbox-root": {
              color: "rgba(255, 255, 255, 0.7)",
              p: 1,
              "& .MuiSvgIcon-root": {
                fontSize: "1.4rem",
                filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.5))",
              },
            },
            "& .MuiCheckbox-root.Mui-checked": {
              color: colorCode || "#00ff88",
              "& .MuiSvgIcon-root": {
                filter: "drop-shadow(0 0 10px currentColor)",
              },
            },

            // Arrow icon (KeyboardArrowRightIcon)
            "& .MuiSvgIcon-root": {
              color: "rgba(255, 255, 255, 0.5)",
              fontSize: "1.4rem",
              transition: "all 0.2s ease",
            },
            "& .MuiMenuItem-root:hover .MuiSvgIcon-root": {
              color: "#fff",
              transform: "translateX(4px)",
            },

            // Subtle top highlight (premium glass effect)
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "2px",
              background:
                "linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)",
              pointerEvents: "none",
            },

            // Optional: faint inner border glow
            "&::after": {
              content: '""',
              position: "absolute",
              inset: 0,
              borderRadius: "18px",
              padding: "1px",
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.1), transparent 70%)",
              WebkitMask:
                "linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)",
              WebkitMaskComposite: "xor",
              maskComposite: "exclude",
              pointerEvents: "none",
            },
          },
        }}
      >
        {applications.map((app) => (
          <MenuItem
            key={app.id}
            onClick={(e) => openSubMenu(e, app.name)}
            sx={{ display: "flex", alignItems: "center" }}
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
        PaperProps={{
          sx: {
            // GLOSSY GLASS BACKGROUND
            background: "rgba(25, 25, 35, 0.82)",
            backdropFilter: "blur(18px)",
            WebkitBackdropFilter: "blur(18px)",
            border: "1px solid rgba(255, 255, 255, 0.18)",
            borderRadius: "16px",
            boxShadow: `
        0 12px 32px rgba(0, 0, 0, 0.5),
        inset 0 1px 0 rgba(255, 255, 255, 0.15),
        0 0 30px rgba(0, 0, 0, 0.3)
      `,
            mt: 0.5,
            ml: 1.5,
            overflow: "hidden",

            // Text & Items
            color: "#fff",
            "& .MuiMenuItem-root": {
              color: "#fff",
              fontSize: "0.925rem",
              fontWeight: 500,
              py: 1.1,
              px: 2,
              borderRadius: "10px",
              mx: 1,
              my: 0.5,
              transition: "all 0.22s cubic-bezier(0.4, 0, 0.2, 1)",
              "&:hover": {
                bgcolor: "rgba(255, 255, 255, 0.14)",
                transform: "translateY(-2px)",
                boxShadow: "0 6px 16px rgba(0,0,0,0.3)",
              },
              "&:active": {
                transform: "translateY(0)",
              },
            },

            // Checkboxes — clean & glossy
            "& .MuiCheckbox-root": {
              color: "rgba(255, 255, 255, 0.7)",
              p: 0.8,
              "& .MuiSvgIcon-root": {
                fontSize: "1.35rem",
              },
            },
            "& .MuiCheckbox-root.Mui-checked": {
              color: colorCode || "#00ff88",
              "& .MuiSvgIcon-root": {
                filter: "drop-shadow(0 0 8px currentColor)",
              },
            },

            // Optional: subtle inner highlight (premium touch)
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "1px",
              background:
                "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
              pointerEvents: "none",
            },
          },
        }}
      >
        {selectedAppForModules &&
          applications
            .find((a) => a.name === selectedAppForModules)
            ?.module.map((mod) => (
              <MenuItem
                key={mod.id}
                onClick={() => {
                  toggleItem("module", mod.name);
                  closeSubMenu();
                }}
              >
                <Checkbox
                  size="small"
                  checked={selections.modules.includes(mod.name)}
                />
                <ListItemText primary={mod.name} />
              </MenuItem>
            ))}
      </Menu>

      {/* Report Menu + Add New */}
      <Menu
        anchorEl={anchorEl}
        open={menuType === "report"}
        onClose={closeMenu}
        PaperProps={{
          sx: {
            width: 340,
            maxWidth: "95vw",
            // GLOSSY GLASS BACKGROUND
            background: "rgba(20, 20, 30, 0.75)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)", // Safari support
            border: "1px solid rgba(255, 255, 255, 0.15)",
            borderRadius: "16px",
            boxShadow: `
        0 8px 32px rgba(0, 0, 0, 0.4),
        inset 0 1px 0 rgba(255, 255, 255, 0.1),
        0 0 20px rgba(0, 0, 0, 0.3)
      `,
            overflow: "hidden",

            // Text & Items
            color: "#fff",
            "& .MuiMenuItem-root": {
              color: "#fff",
              fontSize: "0.925rem",
              py: 1,
              borderRadius: "8px",
              mx: 1,
              my: 0.5,
              transition: "all 0.2s ease",
              "&:hover": {
                bgcolor: "rgba(255, 255, 255, 0.12)",
                transform: "translateY(-1px)",
                boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
              },
            },

            // Checkboxes
            "& .MuiCheckbox-root": {
              color: "rgba(255, 255, 255, 0.6)",
              "&.Mui-checked": {
                color: colorCode || "#00ff88",
              },
            },

            // TextField – Glossy input
            "& .MuiTextField-root .MuiOutlinedInput-root": {
              color: "#fff",
              fontWeight: 500,
              background: "rgba(255, 255, 255, 0.08)",
              borderRadius: "12px",
              "& fieldset": { border: "none" },
              "&:hover": { background: "rgba(255, 255, 255, 0.15)" },
              "&.Mui-focused": {
                background: "rgba(255, 255, 255, 0.2)",
                boxShadow: `0 0 0 2px ${colorCode || "#00ff88"}40`,
              },
              "& .MuiOutlinedInput-input": {
                "&::placeholder": {
                  color: "rgba(255,255,255,0.6)",
                  opacity: 1,
                },
              },
            },

            // Add Button – Glossy with your color
            "& .MuiButton-root": {
              background: colorCode || "#00ff88",
              color: "#000",
              fontWeight: 700,
              textTransform: "none",
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
              "&:hover": {
                background: colorCode ? alpha(colorCode, 0.9) : "#00cc66",
                transform: "translateY(-2px)",
                boxShadow: "0 8px 20px rgba(0,0,0,0.4)",
              },
              "&:active": {
                transform: "translateY(0)",
              },
              "&:disabled": {
                background: "rgba(255,255,255,0.12)",
                color: "rgba(255,255,255,0.4)",
              },
            },
          },
        }}
      >
        <Box sx={{ p: 1.5, maxHeight: 400, overflow: "auto" }}>
          {/* Existing Reports */}
          {reports.length > 0 ? (
            reports.map((r) => (
              <MenuItem
                key={r.id}
                onClick={() => toggleItem("report", r.name)}
                sx={{ borderRadius: 1 }}
              >
                <Checkbox
                  size="small"
                  checked={selections.reports.includes(r.name)}
                />
                <ListItemText primary={r.name} />
              </MenuItem>
            ))
          ) : (
            <Typography
              variant="body2"
              sx={{ color: "rgba(255,255,255,0.5)", px: 2, py: 1 }}
            >
              No reports yet
            </Typography>
          )}

          {/* Divider */}
          <Box
            sx={{
              mx: 2,
              my: 1.5,
              borderTop: "1px solid rgba(255,255,255,0.12)",
            }}
          />

          {/* Add New Report */}
          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            <TextField
              size="small"
              placeholder="New report name..."
              value={reportInput}
              onChange={(e) => setReportInput(e.target.value)}
              onKeyDown={(e) => {
                e.stopPropagation();
                if (e.key === "Enter" && reportInput.trim()) {
                  handleReportSave();
                }
              }}
              fullWidth
              autoFocus
            />
            <Button
              variant="contained"
              size="small"
              onClick={handleReportSave}
              disabled={!reportInput.trim()}
              sx={{ minWidth: 64 }}
            >
              Add
            </Button>
          </Box>
        </Box>
      </Menu>
    </>
  );
}
