import React from 'react';
import { Box, CircularProgress, Typography, Backdrop } from '@mui/material';
import { theme } from '../../theme/theme'; // Adjusted import assuming default export

const CustomLoader = () => (
  <Backdrop
    sx={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 1400,
      backgroundColor: 'rgba(255, 255, 255, 0.8)', // Theme-neutral overlay
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
    open={true}
  >
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: theme.spacing.md }}>
      <CircularProgress
        size={48}
        sx={{
          color: theme.colors.primary,
          '& .MuiCircularProgress-circle': { strokeLinecap: 'round' },
        }}
      />
      <Typography
        variant="h6"
        sx={{
          color: theme.colors.text.primary,
          fontWeight: 'bold',
        }}
      >
        Loading...
      </Typography>
    </Box>
  </Backdrop>
);

export default CustomLoader;