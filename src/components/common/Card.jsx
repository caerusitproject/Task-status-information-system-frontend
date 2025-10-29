import React from 'react';
import { Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles'; // MUI hook
// Assuming theme.js is extended to MUI theme; for now, use custom

const Card = ({ title, children, icon }) => {
  const muiTheme = useTheme(); // MUI theme
  const customTheme = { /* Merge or import your theme.js */ }; // Placeholder; extend MUI theme in app

  const theme = { ...muiTheme, ...customTheme }; // Fallback to custom

  return (
    <Box
      sx={{
        backgroundColor: theme.colors.surface,
        p: theme.spacing.lg,
        borderRadius: theme.borderRadius.large,
        boxShadow: theme.shadows.medium,
        display: 'flex',
        flexDirection: 'column',
        gap: theme.spacing.sm,
      }}
    >
      {title && (
        <Typography
          variant="h6"
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: theme.spacing.sm,
            color: theme.colors.text.primary,
            fontWeight: 600,
          }}
        >
          {icon && <span>{icon}</span>}
          {title}
        </Typography>
      )}
      <Box sx={{ color: theme.colors.text.secondary }}>{children}</Box>
    </Box>
  );
};

export default Card;