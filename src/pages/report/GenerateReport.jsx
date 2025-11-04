import React, { useState } from "react";
import { Box, Paper, Tabs, Tab } from "@mui/material";
import { theme as customTheme } from "../../theme/theme";

import MonthlyReport from "./MonthlyReport";
import WeeklyReport from "./WeeklyReport";
import IndividualReport from "./IndividualReport";

export default function GenerateReport() {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (e, newValue) => {
    setActiveTab(newValue);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 0:
        return <MonthlyReport />;
      case 1:
        return <WeeklyReport />;
      case 2:
        return <IndividualReport />;
      default:
        return null;
    }
  };

  return (
    <div>
      {/* Header */}
      {/* <Box
        sx={{
          display: "flex",
          alignItems: "center",
          marginBottom: "20px",
          justifyContent: "space-between",
          flexWrap: "nowrap",
          gap: 2,
        }}
      >
        <h1
          style={{
            fontSize: window.innerWidth < 640 ? "24px" : "32px",
            fontWeight: 700,
            color: customTheme.colors.text.primary,
            margin: 0,
          }}
        >
          Generate Report
        </h1>
      </Box> */}

      {/* Tabs */}
      <Paper sx={{ mb: 2, borderRadius: customTheme.borderRadius.medium }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: 500,
              fontSize: { xs: "13px", sm: "14px", md: "16px" }, // 👈 smaller on mobile
              minHeight: { xs: "42px", sm: "50px", md: "60px" }, // 👈 thinner height
              borderRadius: customTheme.borderRadius.small,
              color: customTheme.colors.text.secondary,
              minWidth: { xs: "90px", sm: "120px", md: "160px" }, // 👈 slimmer width
              marginRight: { xs: "4px", sm: "8px", md: "12px" }, // 👈 tighter spacing
              paddingX: { xs: 1, sm: 1.5, md: 2 },
            },
            "& .Mui-selected": {
              color: customTheme.colors.primary,
              backgroundColor: `${customTheme.colors.primaryLight}22`,
              fontWeight: 600,
            },
            "& .MuiTabs-indicator": {
              backgroundColor: customTheme.colors.primary,
              height: "3px", // 👈 thinner indicator
              borderRadius: "3px",
            },
          }}
        >
          <Tab label="Monthly Report" />
          <Tab label="Weekly Report" />
          <Tab label="Individual Report" />
        </Tabs>
      </Paper>

      {/* Tab Content */}
      <Box sx={{ marginTop: 2 }}>{renderContent()}</Box>
    </div>
  );
}
