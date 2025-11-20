import { Box, Typography, IconButton } from "@mui/material";
import { Plus } from "lucide-react";
import TaskCard from "./TaskCard";
import { theme } from "../../theme/theme";
import { useEffect } from "react";

export default function DayCard({
  day,
  isToday,
  onAddTask,
  isMobile,
  showToday,
  debouncedSave,
  applications, // ← ADD
  reports, // ← ADD
  loadingHeaderData, // ← ADD
}) {
  return (
    <Box
      key={day.date}
      sx={{
        position: "relative",
        mb: 4,
        borderRadius: "0.75rem",
        background: {
          xs: "rgba(255, 255, 255, 0.1)",
          md: "linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0.05))",
        },
        backdropFilter: { xs: "blur(6px)", md: "blur(10px)" },
        WebkitBackdropFilter: { xs: "blur(6px)", md: "blur(10px)" },
        border: {
          xs: "1px solid rgba(255,255,255,0.1)",
          md: "1px solid rgba(255,255,255,0.2)",
        },
        boxShadow: {
          xs: "0 4px 16px rgba(0,0,0,0.1)",
          md: "0 8px 32px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.3)",
        },
        padding: {
          xs: "0.5rem 1rem",
          md: "1.5rem 3.5rem",
        },
      }}
    >
      {/* Date Strip */}
      <Box
        sx={{
          width: { xs: "100%", md: "3rem" },
          height: { xs: "auto", md: "100%" },
          position: { xs: "relative", md: "absolute" },
          left: { md: 0 },
          top: { md: 0 },
          display: "flex",
          flexDirection: { xs: "row", md: "column" },
          justifyContent: { xs: "space-between", md: "space-between" },
          alignItems: "center",
          padding: { xs: "0.75rem 1rem", md: "1rem 0" },
          paddingTop: { md: "2rem" },
          backgroundColor: { xs: "rgba(0,0,0,0.04)", md: "transparent" },
          //marginBottom:  { md: "12rem" },
        }}
      >
        <Typography
          sx={{
            writingMode: { xs: "horizontal-tb", md: "vertical-rl" },
            textOrientation: "mixed",
            fontSize: { xs: "0.875rem", md: "1rem" },
            fontWeight: 600,
            color: theme.colors.text.primary,
            letterSpacing: "0.05em",
            transform: { xs: "none", md: "rotate(180deg)" },
            textAlign: { xs: "center", md: "center" },
            flex: { xs: 1, md: "unset" },
          }}
        >
          {new Date(day.date)
            .toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })
            .toUpperCase()}
        </Typography>

        {isToday && showToday && (
          <IconButton
            onClick={onAddTask}
            sx={{
              width: { xs: 50, md: 40 }, // wider for rectangular shape
              height: { xs: 36, md: 40 }, // shorter height
              bgcolor: theme.colors.primary,
              color: "#fff",
              borderRadius: "0.5rem", // 👈 makes it rectangular (less rounded)
              "&:hover": { bgcolor: theme.colors.primaryDark },
              flexShrink: 0,
              marginBottom: { md: "0.5rem" },
              marginLeft: { md: "0.5rem" },
            }}
          >
            <Plus size={24} />
          </IconButton>
        )}
      </Box>

      {/* Tasks */}
      {/* Tasks */}
      <Box sx={{ minHeight: 180 }}>
        {day.tasks.length === 0 ? (
          isToday && showToday ? (
            <Box
              sx={{
                minHeight: 180,
                border: "0.0625rem dashed #d0d0d0",
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#777",
                fontStyle: "italic",
              }}
            >
              Please add today’s task
            </Box>
          ) : (
            <></>
          )
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {day.tasks.map((task, index) => (
              <Box
                key={task.taskId}
                sx={{
                  borderBottom:
                    index !== day.tasks.length - 1 ? "2px solid #fff" : "none",
                }}
              >
                <TaskCard
                  task={task}
                  date={day.date}
                  debouncedSave={debouncedSave}
                  applications={applications}
                  reports={reports}
                  loadingHeaderData={loadingHeaderData}
                />
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
}
