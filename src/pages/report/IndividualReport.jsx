// src/pages/IndividualReport.jsx
import React, { useState, useEffect } from "react";
import { theme } from "../../theme/theme";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
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
import CustomLoader from "../../components/common/CustomLoader";

// Mock API Data - Full month data (adapted for individual report)
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

const IndividualReport = () => {
  const [employee, setEmployee] = useState("");
  const [period, setPeriod] = useState("");
  const [month, setMonth] = useState("");
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [data, setData] = useState([]);
  const [totals, setTotals] = useState({});
  const [tableType, setTableType] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    nextPage: null,
    previousPage: null,
  });

  const employees = [
    { value: "emp1", label: "John Doe" },
    { value: "emp2", label: "Jane Smith" },
    { value: "emp3", label: "Mike Johnson" },
  ];

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

  // Auto-select current month
  useEffect(() => {
    const currentMonth = new Date().getMonth() + 1;
    setMonth(currentMonth.toString().padStart(2, "0"));
  }, []);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Fetch data when mandatory fields are filled
  const isFilled = employee && period && (period === "monthly" ? month : date);

  const fetchData = async () => {
    if (!isFilled) return;
    try {
      setLoading(true);
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      if (period === "monthly") {
        const selectedMonthLabel =
          months.find((m) => m.value === month)?.label || month;
        const fullData = {
          ...mockFullMonthlyData,
          duration: `${selectedMonthLabel} 2025`,
          generatedOn: format(new Date(), "yyyy-MM-dd"),
        };
        const daysData = fullData.days;
        const limit = 10;
        const page = pagination.currentPage;
        const totalItems = daysData.length;
        const totalPages = Math.ceil(totalItems / limit);
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedRows = daysData.slice(startIndex, endIndex);
        const calcTotals = daysData.reduce(
          (acc, row) => ({
            totalTasks: acc.totalTasks + row.totalTasks,
            new: acc.new + row.new,
            completed: acc.completed + row.completed,
            inProgress: acc.inProgress + row.inProgress,
            blocked: acc.blocked + row.blocked,
            hours: acc.hours + row.hours,
          }),
          {
            totalTasks: 0,
            new: 0,
            completed: 0,
            inProgress: 0,
            blocked: 0,
            hours: 0,
          }
        );
        setData(paginatedRows);
        setTotals(calcTotals);
        setPagination({
          currentPage: page,
          totalPages,
          nextPage: page < totalPages ? page + 1 : null,
          previousPage: page > 1 ? page - 1 : null,
        });
        setTableType("monthly");
      } else if (period === "daily") {
        const numTickets = Math.floor(Math.random() * 10) + 5;
        const statuses = ["New", "In Progress", "Completed", "Blocked"];
        const colors = {
          New: "#9c27b0",
          "In Progress": theme.colors.primary,
          Completed: theme.colors.success,
          Blocked: theme.colors.error,
        };
        const dailyData = Array.from({ length: numTickets }, (_, i) => ({
          taskTitle: `Task ${i + 1} for ${
            employees.find((emp) => emp.value === employee)?.label || employee
          }`,
          status: statuses[Math.floor(Math.random() * statuses.length)],
          totalHours: (Math.random() * 8 + 1).toFixed(1),
          statusColor:
            colors[statuses[Math.floor(Math.random() * statuses.length)]],
        }));
        setData(dailyData);
        setTableType("daily");
      }
    } catch (err) {
      console.error("Failed to fetch data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [employee, period, month, date, pagination.currentPage]);

  const handlePageChange = (direction) => {
    const nextPage =
      direction === "next" ? pagination.nextPage : pagination.previousPage;
    if (!nextPage) return;
    setPagination((prev) => ({ ...prev, currentPage: nextPage }));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return theme.colors.success;
      case "New":
        return "#9c27b0";
      case "In Progress":
        return theme.colors.primary;
      case "Blocked":
        return theme.colors.error;
      default:
        return "inherit";
    }
  };

  return (
    <div>
      <h1
        style={{
          fontSize: window.innerWidth < 640 ? "24px" : "32px",
          fontWeight: 700,
          color: theme.colors.text.primary,
          margin: 0,
        }}
      >
        Generate Individual Report
      </h1>

      <div style={{ padding: theme.spacing.md }}>
        {/* ---- Form ---- */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(250px, calc(33.333% - 16px)))",
            gap: theme.spacing.md,
            marginBottom: theme.spacing.lg,
          }}
        >
          <Input
            label="Select Employee"
            type="select"
            value={employee}
            onChange={(e) => setEmployee(e.target.value)}
            options={[{ value: "", label: "Select Employee" }, ...employees]}
            required
          />
          <Input
            label="Monthly/Daily"
            type="select"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            options={[
              { value: "", label: "Select" },
              { value: "monthly", label: "Monthly" },
              { value: "daily", label: "Daily" },
            ]}
            required
          />
          {period === "monthly" && (
            <Input
              label="Select Month"
              type="select"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              options={months}
              required
            />
          )}
          {period === "daily" && (
            <Input
              label="Select Date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          )}
        </div>

        {/* ---- Report Table ---- */}
        {loading && (
          <div style={{ textAlign: "center", padding: theme.spacing.lg }}>
            <CustomLoader/>
          </div>
        )}
        {!isFilled && !loading && (
          <div
            style={{
              textAlign: "center",
              padding: theme.spacing.lg,
              color: theme.colors.text.secondary,
            }}
          >
            Please fill all required fields to view the report.
          </div>
        )}
        {data.length > 0 && tableType === "monthly" && (
          <div>
            <Typography variant="h6" fontWeight={600} mb={2}>
              Monthly Summary Report for{" "}
              {employees.find((emp) => emp.value === employee)?.label ||
                employee}
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={3}>
              Duration: {mockFullMonthlyData.duration.replace("2025", "2025")} |
              Generated On: {format(new Date(), "dd/MM/yyyy")}
            </Typography>
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
                        sx={{ fontWeight: 600, color: theme.colors.white }}
                      >
                        {h}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.map((row, i) => (
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
                  ))}
                  <TableRow
                    sx={{
                      backgroundColor: theme.colors.gray,
                      "& th": {
                        fontWeight: 600,
                        color: theme.colors.text.primary,
                      },
                    }}
                  >
                    {" "}
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
          </div>
        )}
        {data.length > 0 && tableType === "daily" && (
          <div>
            <Typography variant="h6" fontWeight={600} mb={2}>
              Daily Report for{" "}
              {employees.find((emp) => emp.value === employee)?.label ||
                employee}{" "}
              on {format(new Date(date), "dd/MM/yyyy")}
            </Typography>
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
                    {["Task Title", "Task Status", "Total Hours"].map((h) => (
                      <TableCell
                        key={h}
                        align="left"
                        sx={{ fontWeight: 600, color: theme.colors.white }}
                      >
                        {h}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.map((row, i) => (
                    <TableRow key={i} hover>
                      <TableCell align="left">{row.taskTitle}</TableCell>
                      <TableCell
                        align="left"
                        sx={{ color: getStatusColor(row.status) }}
                      >
                        {row.status}
                      </TableCell>
                      <TableCell
                        align="left"
                      >
                        {row.totalHours}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        )}
      </div>
    </div>
  );
};

export default IndividualReport;
