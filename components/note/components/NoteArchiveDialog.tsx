import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from '@mui/material';

interface NoteArchiveDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
  isArchived: boolean;
}

export function NoteArchiveDialog({ 
  open, 
  onClose, 
  onConfirm, 
  loading, 
  isArchived 
}: NoteArchiveDialogProps) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        {isArchived ? 'Restore Note' : 'Archive Note'}
      </DialogTitle>
      <DialogContent>
        <Typography>
          {isArchived 
            ? 'Restore this note to make it active again?' 
            : 'Archive this note? Archived notes can be restored later.'}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button onClick={onConfirm} variant="contained" disabled={loading}>
          {loading ? 'Processing...' : (isArchived ? 'Restore' : 'Archive')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}