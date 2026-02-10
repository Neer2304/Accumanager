import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
} from '@mui/material';

// Import Google-themed components
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface NoteDeleteDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
  darkMode?: boolean;
}

export function NoteDeleteDialog({ 
  open, 
  onClose, 
  onConfirm, 
  loading, 
  darkMode = false 
}: NoteDeleteDialogProps) {
  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: '16px',
          backgroundColor: darkMode ? '#303134' : '#ffffff',
          border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
          minWidth: 400,
        },
      }}
    >
      <DialogTitle sx={{ 
        color: darkMode ? '#e8eaed' : '#202124',
        borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
        fontWeight: 500,
      }}>
        Delete Note
      </DialogTitle>
      <DialogContent sx={{ pt: 3 }}>
        <Typography sx={{ 
          color: darkMode ? '#e8eaed' : '#202124',
          fontSize: '0.95rem',
          lineHeight: 1.6,
        }}>
          Are you sure you want to delete this note? This action cannot be undone.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ 
        p: 2,
        borderTop: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
      }}>
        <Button 
          onClick={onClose} 
          disabled={loading}
          sx={{
            color: darkMode ? '#e8eaed' : '#202124',
            '&:hover': {
              backgroundColor: darkMode ? '#3c4043' : '#f1f3f4',
            },
          }}
        >
          Cancel
        </Button>
        <Button 
          onClick={onConfirm} 
          variant="contained" 
          disabled={loading}
          sx={{
            backgroundColor: '#ea4335',
            '&:hover': { backgroundColor: '#d23c32' },
            '&.Mui-disabled': {
              backgroundColor: darkMode ? '#3c4043' : '#dadce0',
              color: darkMode ? '#9aa0a6' : '#5f6368',
            },
          }}
        >
          {loading ? 'Deleting...' : 'Delete'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}