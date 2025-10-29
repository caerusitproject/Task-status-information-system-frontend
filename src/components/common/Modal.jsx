import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { theme } from '../../theme/theme'; // Extend to MUI if needed

const Modal = ({
  open,
  onClose,
  title,
  children,
  actions = [],
  maxWidth = 'sm',
  fullWidth = true,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: theme.borderRadius.large,
          boxShadow: theme.shadows.large,
        },
      }}
    >
      <DialogTitle sx={{ p: theme.spacing.lg, pb: theme.spacing.md }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ color: theme.colors.text.primary, fontWeight: 600 }}>
            {title}
          </Typography>
          <IconButton onClick={onClose} aria-label="close" sx={{ color: theme.colors.text.secondary }}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent sx={{ p: theme.spacing.lg, pb: theme.spacing.sm }}>
        {children}
      </DialogContent>
      {actions.length > 0 && (
        <DialogActions sx={{ p: theme.spacing.lg, pt: theme.spacing.sm }}>
          {actions.map((action, index) => (
            <Button
              key={index}
              onClick={action.onClick}
              variant={action.variant || 'contained'}
              color={action.color || 'primary'}
              disabled={action.disabled}
              sx={{ ml: theme.spacing.sm }}
            >
              {action.label}
            </Button>
          ))}
        </DialogActions>
      )}
    </Dialog>
  );
};

export default Modal;