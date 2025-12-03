// src/pages/WeeklyReport.jsx
import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
} from "@mui/material";
import format from "date-fns/format";
import { theme } from "../../theme/theme";
import Input from "../../components/common/Input";
import CustomLoader from "../../components/common/CustomLoader";

// Mock API Data
const mockWeeklyData = {
  duration: "November 2025",
  generatedOn: "2025-11-04",
  weeks: [
    {
      week: "Week 1",
      totalTasks: 8,
      new: 2,
      completed: 0,
      inProgress: 0,
      blocked: 8,
      hours: 0.0,
    },
    {
      week: "Week 2",
      totalTasks: 2,
      new: 2,
      completed: 0,
      inProgress: 0,
      blocked: 2,
      hours: 24.0,
    },
    {
      week: "Week 3",
      totalTasks: 3,
      new: 2,
      completed: 0,
      inProgress: 3,
      blocked: 0,
      hours: 0.0,
    },
    {
      week: "Week 4",
      totalTasks: 2,
      new: 2,
      completed: 2,
      inProgress: 0,
      blocked: 0,
      hours: 0.0,
    },
  ],
};

const months = [
  { value: "01", label: "January" },
  { value: "02", label: "February" },
  { value: "03", label: "March" },
  { value: "04", label: "April" },
  { value: "05", label: "May" },
  { value: "06", label: "June" },
  { value: "07", label: "July" },
  { value: "08", label: "August" },
  { value: "09", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
];

const WeeklyReport = () => {
  const [month, setMonth] = useState("");
  const [data, setData] = useState({
    duration: "",
    generatedOn: "",
    weeks: [],
  });
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Auto-select current month
  useEffect(() => {
    const currentMonth = new Date().getMonth() + 1;
    const monthValue = currentMonth.toString().padStart(2, "0");
    setMonth(monthValue);
  }, []);

  // Fetch data on month change
  useEffect(() => {
    if (month) {
      fetchWeeklyData(month);
    }
  }, [month]);

  const fetchWeeklyData = async (selectedMonth) => {
    try {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 500));
      const selectedMonthLabel =
        months.find((m) => m.value === selectedMonth)?.label || selectedMonth;
      const fullData = {
        ...mockWeeklyData,
        duration: `${selectedMonthLabel} 2025`,
        generatedOn: format(new Date(), "yyyy-MM-dd"),
      };
      setData(fullData);
    } catch (err) {
      console.error("Failed to fetch weekly data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const totals = data.weeks.reduce(
    (acc, w) => ({
      totalTasks: acc.totalTasks + w.totalTasks,
      new: acc.new + w.new,
      completed: acc.completed + w.completed,
      inProgress: acc.inProgress + w.inProgress,
      blocked: acc.blocked + w.blocked,
      hours: acc.hours + w.hours,
    }),
    { totalTasks: 0, new: 0, completed: 0, inProgress: 0, blocked: 0, hours: 0 }
  );

  return (
    <div>
      <Box
      sx={{
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        alignItems: isMobile ? "flex-start" : "center",
        justifyContent: "space-between",
        gap: isMobile ? 1 : 2,
        mb: 2,
      }}
    >
      {/* Left side: Title + Duration */}
      <Box>
        <Typography variant="h5" fontWeight={600}>
          Weekly Summary Report
        </Typography>

        {!loading && data?.duration && (
          <Typography variant="body2" color="text.secondary">
            Duration: {data.duration} | Generated On:{" "}
            {format(new Date(data.generatedOn), "dd/MM/yyyy")}
          </Typography>
        )}
      </Box>

      {/* Right side: Select Month */}
      <Box sx={{ minWidth: isMobile ? "100%" : "33.33%" }}>
        <Input
          label="Select Month"
          type="select"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          options={months}
          required
        />
      </Box>
    </Box>

      {loading && (
        <div style={{ textAlign: "center", padding: theme.spacing.lg }}>
          <CustomLoader />
        </div>
      )}
      {!loading && (
        <TableContainer
          component={Paper}
          elevation={2}
          sx={{ borderRadius: 2, overflowX: "auto" }}
        >
          <Table size={isMobile ? "small" : "medium"}>
            <TableHead>
              <TableRow
                sx={{
                  backgroundColor: theme.colors.gray,
                  "& th": { fontWeight: 600, color: theme.colors.text.primary },
                }}
              >
                {[
                  "Week Start",
                  "Total Tasks",
                  "New",
                  "Completed",
                  "In Progress",
                  "Blocked",
                  "Total Hours",
                ].map((h) => (
                  <TableCell
                    key={h}
                    align="center"
                    sx={{
                      fontWeight: 600,
                      color: theme.colors.white, // Use white for contrast on gray header
                    }}
                  >
                    {h}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {data.weeks.map((row, i) => (
                <TableRow key={i} hover>
                  <TableCell align="center" sx={{ fontWeight: 500 }}>
                    {row.week}
                  </TableCell>
                  <TableCell align="center">{row.totalTasks}</TableCell>
                  <TableCell align="center" sx={{ color: "#9c27b0" }}>
                    {row.new}
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ color: theme.colors.success }}
                  >
                    {row.completed}
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ color: theme.colors.primary }}
                  >
                    {row.inProgress}
                  </TableCell>
                  <TableCell align="center" sx={{ color: theme.colors.error }}>
                    {row.blocked}
                  </TableCell>
                  <TableCell align="center">{row.hours.toFixed(1)}</TableCell>
                </TableRow>
              ))}
              <TableRow sx={{ backgroundColor: theme.colors.lightGray }}>
                <TableCell sx={{ fontWeight: 700 }}>TOTAL</TableCell>
                <TableCell align="center" sx={{ fontWeight: 600 }}>
                  {totals.totalTasks}
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ fontWeight: 600, color: "#9c27b0" }}
                >
                  {totals.new}
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ fontWeight: 600, color: theme.colors.success }}
                >
                  {totals.completed}
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ fontWeight: 600, color: theme.colors.primaryDark }}
                >
                  {totals.inProgress}
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ fontWeight: 600, color: theme.colors.error }}
                >
                  {totals.blocked}
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 600 }}>
                  {totals.hours.toFixed(1)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
};

export default WeeklyReport;
