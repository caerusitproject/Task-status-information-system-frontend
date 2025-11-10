// src/components/ColorPickerDialog.jsx
import { Dialog, DialogTitle, DialogContent, IconButton, Box } from "@mui/material";
import { X } from "lucide-react";
import { theme } from "../../theme/theme";

const colors = [
  "#fcde72","#ff9c68","#7fc0ff","#ffcccc","#fcd05b","#e0caebff",
  "#ffb07a","#99ffe0","#f3d27fff","#ff7f7f","#b3d6ff","#e1b5fdbb",
  "#faca34","#ffb988","#ccfff7","#ff9999","#cce6ff","#ffb3b3",
  "#7fffd4","#ffc199","#d7aefc","#99ccff"
];

export default function ColorPickerDialog({ open, onClose, onSelect, selectedColor }) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: "#1a1a1a",
          color: "#fff",
          borderRadius: 2,
          boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontWeight: 600,
          fontSize: "1.1rem",
          bgcolor: "#222",
          color: "#fff",
          pb: 1.5,
          marginBottom: "10px",
        }}
      >
        Please choose active task
        <IconButton onClick={onClose} sx={{ color: "#aaa" }}>
          <X size={20} />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)",
            gap: 1.5,
            justifyItems: "center",
            
          }}
        >
          {colors.map((c) => (
            <Box
              key={c}
              onClick={() => {
                onSelect(c);
                onClose();
              }}
              sx={{
                width: 48,
                height: 48,
                bgcolor: c,
                borderRadius: 2,
                cursor: "pointer",
                border: selectedColor === c ? "3px solid #fff" : "2px solid transparent",
                boxShadow:
                  selectedColor === c
                    ? "0 0 0 2px #000, 0 0 12px rgba(255,255,255,0.3)"
                    : "0 2px 6px rgba(0,0,0,0.2)",
                transition: "all 0.2s ease",
                "&:hover": {
                  transform: "scale(1.12)",
                  boxShadow: "0 0 0 2px #000, 0 0 16px rgba(255,255,255,0.4)",
                  borderColor: "#fff",
                },
              }}
            />
          ))}
        </Box>
      </DialogContent>
    </Dialog>
  );
}