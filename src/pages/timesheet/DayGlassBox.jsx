// src/components/DayGlassBox.jsx
import { useState } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import { Plus } from "lucide-react";
import ColorPickerDialog from "./ColorPickerDialog";
import TaskCard from "./TaskCard";
import { theme } from "../../theme/theme";

export default function DayGlassBox({ day, isToday, onAddTask }) {
  const [colorDlgOpen, setColorDlgOpen] = useState(false);

  const handleColorSelect = (color) => {
    onAddTask(color); // adds the task to the parent state
    setColorDlgOpen(false);
  };

  return (
    <div
      style={{
        position: "relative",
        borderRadius: "0.75rem",
        background:
          "linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0.05))",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        border: "1px solid rgba(255,255,255,0.2)",
        boxShadow:
          "0 8px 32px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.3)",
        padding: "1.5rem",
        minHeight: "180px",
        display: "flex",
        gap: "1rem",
      }}
    >
      {/* ---------- LEFT SIDE – DATE + “+” (only for today) ---------- */}
      {isToday && (
        <Box
          sx={{
            width: "3rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 1,
            height: "100%",
            justifyContent: "space-between", // Pushes "+" to bottom
          }}
        >
          {/* Vertical date */}
          <Typography
            sx={{
              writingMode: "vertical-rl",
              textOrientation: "mixed",
              fontSize: "1rem",
              fontWeight: 600,
              color: theme.colors.text.primary,
              transform: "rotate(180deg)",
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

          {/* “+” button */}
          <IconButton
            onClick={() => setColorDlgOpen(true)}
            sx={{
              width: 40,
              height: 40,
              bgcolor: theme.colors.primary,
              color: "#fff",
              "&:hover": { bgcolor: theme.colors.primaryDark },
            }}
          >
            <Plus size={24} />
          </IconButton>
        </Box>
      )}

      {/* ---------- MAIN CONTENT AREA ---------- */}
      <Box sx={{ flex: 1 }}>
        {day.tasks.length === 0 ? (
          <Box
            sx={{
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#777",
              fontStyle: "italic",
            }}
          >
            No tasks for this day
          </Box>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {day.tasks.map((task) => (
              <TaskCard key={task.id} task={task} date={day.date} />
            ))}
          </Box>
        )}
      </Box>

      {/* ---------- COLOR PICKER DIALOG (only for today) ---------- */}
      {isToday && (
        <ColorPickerDialog
          open={colorDlgOpen}
          onClose={() => setColorDlgOpen(false)}
          onSelect={handleColorSelect}
        />
      )}
    </div>
  );
}