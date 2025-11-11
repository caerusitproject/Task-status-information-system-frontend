// src/components/LegendPickerDialog.jsx
import { Dialog, DialogTitle, DialogContent, IconButton, Box, Typography } from "@mui/material";
import { X } from "lucide-react";
import { theme } from "../../theme/theme";

/**
 * Props:
 * - open: boolean
 * - onClose: () => void
 * - onSelect: (color: string) => void
 * - legends: Array<{ code: string, task_id: string }>  ← Required
 * - selectedColor?: string (optional)
 */
export default function LegendPickerDialog({
  open,
  onClose,
  onSelect,
  legends = [],
  selectedColor = null,
}) {
  // Empty state
  if (legends.length === 0) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="xs" PaperProps={{ sx: { width: 320, height: 240 } }}>
        <DialogTitle sx={{ bgcolor: "#222", color: "#fff", fontSize: "1rem", pb: 2 }}>
          Choose active task
          <IconButton onClick={onClose} sx={{ color: "#aaa", position: "absolute", right: 8, top: 8 }}>
            <X size={20} />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ display: "flex", alignItems: "center", justifyContent: "center", p: 3 }}>
          <Typography color="#aaa">No active tasks available.</Typography>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      PaperProps={{
        sx: {
          width: { xs: 320, sm: 540 },
          height: { xs: 380, sm: 450 },
          maxWidth: "none",
          bgcolor: "#1a1a1a",
          color: "#fff",
          borderRadius: 3,
          boxShadow: "0 12px 40px rgba(0,0,0,0.5)",
          m: 0,
        },
      }}
    >
      {/* Title */}
      <DialogTitle
        sx={{
          bgcolor: "#222",
          color: "#fff",
          fontWeight: 600,
          fontSize: { xs: "1rem", sm: "1.1rem" },
          pb: 2,
          pt: 2.5,
          textAlign: "center",
          position: "relative",
        }}
      >
        Choose active task
        <IconButton
          onClick={onClose}
          sx={{
            color: "#aaa",
            position: "absolute",
            right: 12,
            top: "50%",
            transform: "translateY(-50%)",
          }}
        >
          <X size={20} />
        </IconButton>
      </DialogTitle>

      {/* Content – Always centered with gap */}
      <DialogContent
        sx={{
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
          p: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 2,
          height: "100%",
          pb: 3,
        }}
      >
        {/* Grid of Colors */}
        <Box
          sx={{
            display: "grid",
            gap: { xs: 1.2, sm: 1.5 },
            gridTemplateColumns: "repeat(auto-fit, minmax(56px, 1fr))",
            justifyItems: "center",
            width: "100%",
            px: { xs: 2, sm: 3 },
            mt: 1,
          }}
        >
          {legends.map((legend) => {
            const { color_row: code, task_code: task_id } = legend;
            const isSelected = selectedColor === code;

            return (
              <Box
                key={code}
                onClick={() => {
                  onSelect(legend);
                  onClose();
                }}
                sx={{
                  position: "relative",
                  width: { xs: 50, sm: 56 },
                  height: { xs: 50, sm: 56 },
                  bgcolor: code,
                  borderRadius: 2.5,
                  cursor: "pointer",
                  border: isSelected ? "3px solid #fff" : "2px solid transparent",
                  boxShadow: isSelected
                    ? "0 0 0 2px #000, 0 0 14px rgba(255,255,255,0.4)"
                    : "0 3px 8px rgba(0,0,0,0.25)",
                  transition: "all 0.22s ease",
                  "&:hover": {
                    transform: "translateY(-4px) scale(1.1)",
                    boxShadow: "0 0 0 2px #000, 0 0 20px rgba(255,255,255,0.6)",
                    borderColor: "#fff",
                  },
                }}
              >
                <Typography
                  sx={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: { xs: "0.7rem", sm: "0.8rem" },
                    fontWeight: 700,
                    color: "#000",
                    textShadow: "0 0 3px rgba(255,255,255,0.5)",
                    pointerEvents: "none",
                  }}
                >
                  {task_id}
                </Typography>
              </Box>
            );
          })}
        </Box>
      </DialogContent>
    </Dialog>
  );
}