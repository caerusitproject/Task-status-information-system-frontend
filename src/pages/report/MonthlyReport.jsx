// src/pages/MonthlyReport.jsx
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
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import CustomLoader from "../../components/common/CustomLoader";

// Mock API Data - Full month data
const mockFullMonthlyData = {
  duration: "November 2025",
  generatedOn: "2025-11-04",
  days: Array.from({ length: 30 }, (_, i) => {
    const day = i + 1;
    // simple demo distribution
    const total = Math.floor(Math.random() * 10) + 1;
    const newTasks = Math.min(Math.floor(total * 0.4), total);
    const completed = Math.min(Math.floor(total * 0.3), total - newTasks);
    const inProgress = Math.min(
      Math.floor(total * 0.2),
      total - newTasks - completed
    );
    const blocked = total - newTasks - completed - inProgress;
    return {
      day: `Day ${day}`,
      totalTasks: total,
      new: newTasks,
      completed,
      inProgress,
      blocked,
      hours: (Math.random() * 8).toFixed(1) * 1,
    };
  }),
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

const MonthlyReport = () => {
  const [month, setMonth] = useState("");
  const [days, setDays] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    nextPage: null,
    previousPage: null,
  });
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [data, setData] = useState({
    duration: "",
    generatedOn: "",
  });

  // Auto-select current month
  useEffect(() => {
    const currentMonth = new Date().getMonth() + 1;
    const monthValue = currentMonth.toString().padStart(2, "0");
    setMonth(monthValue);
  }, []);

  // Simulate fetch with pagination
  const fetchMonthlyData = async (
    selectedMonth = month,
    page = 1,
    limit = 10
  ) => {
    try {
      setLoading(true);
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      const selectedMonthLabel =
        months.find((m) => m.value === selectedMonth)?.label || selectedMonth;
      const fullData = {
        ...mockFullMonthlyData,
        duration: `${selectedMonthLabel} 2025`,
        generatedOn: format(new Date(), "yyyy-MM-dd"),
      };
      const daysData = fullData.days;
      const totalItems = daysData.length;
      const totalPages = Math.ceil(totalItems / limit);
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedRows = daysData.slice(startIndex, endIndex);

      setDays(paginatedRows);
      setData(fullData);
      setPagination({
        currentPage: page,
        totalPages,
        nextPage: page < totalPages ? page + 1 : null,
        previousPage: page > 1 ? page - 1 : null,
      });
    } catch (err) {
      console.error("Failed to fetch monthly data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (month) {
      fetchMonthlyData();
    }
  }, [month]);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handlePageChange = (direction) => {
    const nextPage =
      direction === "next" ? pagination.nextPage : pagination.previousPage;
    if (!nextPage) return;
    fetchMonthlyData(month, nextPage);
  };

  const totals = data.days
    ? data.days.reduce(
        (acc, w) => ({
          totalTasks: acc.totalTasks + w.totalTasks,
          new: acc.new + w.new,
          completed: acc.completed + w.completed,
          inProgress: acc.inProgress + w.inProgress,
          blocked: acc.blocked + w.blocked,
          hours: acc.hours + w.hours,
        }),
        {
          totalTasks: 0,
          new: 0,
          completed: 0,
          inProgress: 0,
          blocked: 0,
          hours: 0,
        }
      )
    : {
        totalTasks: 0,
        new: 0,
        completed: 0,
        inProgress: 0,
        blocked: 0,
        hours: 0,
      };

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
          Monthly Summary Report
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
        <>
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
                    "& th": {
                      fontWeight: 600,
                      color: theme.colors.text.primary,
                    },
                  }}
                >
                  {[
                    "Day",
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
                        color: theme.colors.white,
                      }}
                    >
                      {h}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {days.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      No data found
                    </TableCell>
                  </TableRow>
                ) : (
                  days.map((row, i) => (
                    <TableRow key={i} hover>
                      <TableCell align="center" sx={{ fontWeight: 500 }}>
                        {row.day}
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
                      <TableCell
                        align="center"
                        sx={{ color: theme.colors.error }}
                      >
                        {row.blocked}
                      </TableCell>
                      <TableCell align="center">
                        {row.hours.toFixed(1)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
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
                    sx={{ fontWeight: 600, color: theme.colors.primary }}
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
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              mt: 2,
              gap: 2,
            }}
          >
            <Button
              type="secondary"
              disabled={!pagination.previousPage}
              onClick={() => handlePageChange("prev")}
            >
              {"< Prev"}
            </Button>
            <Typography variant="body1">
              Page {pagination.currentPage} of {pagination.totalPages}
            </Typography>
            <Button
              type="secondary"
              disabled={!pagination.nextPage}
              onClick={() => handlePageChange("next")}
            >
              {"Next >"}
            </Button>
          </Box>
        </>
      )}
    </div>
  );
};

export default MonthlyReport;
