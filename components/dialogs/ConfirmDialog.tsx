// components/dialogs/ConfirmDialog.tsx
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Box,
  Typography,
  useTheme,
  alpha,
} from '@mui/material';
import { HelpOutline } from '@mui/icons-material';

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  severity?: 'info' | 'warning' | 'error' | 'success';
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  severity = 'warning',
}: ConfirmDialogProps) {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';

  const colors = {
    info: { bg: '#4285f4', light: alpha('#4285f4', 0.1) },
    warning: { bg: '#fbbc04', light: alpha('#fbbc04', 0.1) },
    error: { bg: '#ea4335', light: alpha('#ea4335', 0.1) },
    success: { bg: '#34a853', light: alpha('#34a853', 0.1) },
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          bgcolor: darkMode ? '#303134' : '#ffffff',
          border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
          boxShadow: darkMode 
            ? '0 8px 16px rgba(0,0,0,0.5)'
            : '0 8px 16px rgba(0,0,0,0.1)',
        }
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              bgcolor: colors[severity].light,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <HelpOutline sx={{ color: colors[severity].bg, fontSize: 20 }} />
          </Box>
          <Typography variant="h6" fontWeight={600}>
            {title}
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        <DialogContentText sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
          {message}
        </DialogContentText>
      </DialogContent>

      <DialogActions sx={{ p: 2, pt: 0, gap: 1 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          fullWidth
          sx={{
            borderColor: darkMode ? '#3c4043' : '#dadce0',
            color: darkMode ? '#e8eaed' : '#202124',
            '&:hover': {
              borderColor: darkMode ? '#5f6368' : '#bdc1c6',
              bgcolor: darkMode ? '#3c4043' : '#f8f9fa',
            },
            borderRadius: 2,
            py: 1,
          }}
        >
          {cancelText}
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          fullWidth
          sx={{
            bgcolor: colors[severity].bg,
            '&:hover': {
              bgcolor: severity === 'warning' ? '#e6a900' : 
                       severity === 'error' ? '#d32f2f' :
                       severity === 'success' ? '#2d9248' : '#3367d6',
            },
            borderRadius: 2,
            py: 1,
          }}
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}