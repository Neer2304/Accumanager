// components/dialogs/DeleteDialog.tsx
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
import { Delete, Warning } from '@mui/icons-material';

interface DeleteDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName?: string;
  itemType?: string;
}

export function DeleteDialog({
  open,
  onClose,
  onConfirm,
  itemName = 'this item',
  itemType = 'item',
}: DeleteDialogProps) {
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
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              bgcolor: alpha('#ea4335', 0.1),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Delete sx={{ color: '#ea4335', fontSize: 20 }} />
          </Box>
          <Typography variant="h6" fontWeight={600}>
            Delete {itemType}
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        <DialogContentText sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', mb: 2 }}>
          Are you sure you want to delete <strong>{itemName}</strong>? This action cannot be undone.
        </DialogContentText>
        
        <Box
          sx={{
            p: 1.5,
            borderRadius: 2,
            bgcolor: alpha('#ea4335', 0.05),
            border: `1px solid ${alpha('#ea4335', 0.2)}`,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <Warning sx={{ color: '#ea4335', fontSize: 18 }} />
          <Typography variant="caption" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
            This will permanently remove the {itemType} and all associated data.
          </Typography>
        </Box>
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
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          fullWidth
          sx={{
            bgcolor: '#ea4335',
            '&:hover': {
              bgcolor: '#d32f2f',
            },
            borderRadius: 2,
            py: 1,
          }}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}