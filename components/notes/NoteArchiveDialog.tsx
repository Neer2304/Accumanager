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

interface NoteArchiveDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
  isArchived: boolean;
  darkMode?: boolean;
}

export function NoteArchiveDialog({ 
  open, 
  onClose, 
  onConfirm, 
  loading, 
  isArchived,
  darkMode = false 
}: NoteArchiveDialogProps) {
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
        {isArchived ? '📦 Restore Note' : '📥 Archive Note'}
      </DialogTitle>
      <DialogContent sx={{ pt: 3 }}>
        <Typography sx={{ 
          color: darkMode ? '#e8eaed' : '#202124',
          fontSize: '0.95rem',
          lineHeight: 1.6,
        }}>
          {isArchived 
            ? 'Restore this note to make it active again?' 
            : 'Archive this note? Archived notes can be restored later.'}
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
            backgroundColor: '#fbbc04',
            '&:hover': { backgroundColor: '#f9ab00' },
            '&.Mui-disabled': {
              backgroundColor: darkMode ? '#3c4043' : '#dadce0',
              color: darkMode ? '#9aa0a6' : '#5f6368',
            },
          }}
        >
          {loading ? 'Processing...' : (isArchived ? 'Restore' : 'Archive')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}