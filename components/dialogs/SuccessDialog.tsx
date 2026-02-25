// components/dialogs/SuccessDialog.tsx
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
import { CheckCircle } from '@mui/icons-material';

interface SuccessDialogProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  buttonText?: string;
}

export function SuccessDialog({
  open,
  onClose,
  title = 'Success!',
  message = 'Operation completed successfully.',
  buttonText = 'Done',
}: SuccessDialogProps) {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';

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
      <DialogTitle sx={{ pb: 1, textAlign: 'center' }}>
        <Box
          sx={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            bgcolor: alpha('#34a853', 0.1),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mx: 'auto',
            mb: 2,
          }}
        >
          <CheckCircle sx={{ color: '#34a853', fontSize: 32 }} />
        </Box>
        <Typography variant="h6" fontWeight={600}>
          {title}
        </Typography>
      </DialogTitle>

      <DialogContent>
        <DialogContentText 
          align="center" 
          sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}
        >
          {message}
        </DialogContentText>
      </DialogContent>

      <DialogActions sx={{ p: 2, pt: 0 }}>
        <Button
          onClick={onClose}
          variant="contained"
          fullWidth
          sx={{
            bgcolor: '#34a853',
            '&:hover': {
              bgcolor: '#2d9248',
            },
            borderRadius: 2,
            py: 1,
          }}
        >
          {buttonText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}