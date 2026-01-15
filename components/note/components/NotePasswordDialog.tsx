import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  Box,
} from '@mui/material';
import { Lock } from '@mui/icons-material';

interface NotePasswordDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (password: string) => void;
}

export function NotePasswordDialog({ open, onClose, onSubmit }: NotePasswordDialogProps) {
  const [password, setPassword] = useState('');

  const handleSubmit = () => {
    if (password) {
      onSubmit(password);
      setPassword('');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={1}>
          <Lock />
          <Typography variant="h6">Protected Note</Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          This note is password protected. Please enter the password to view it.
        </Typography>
        <TextField
          fullWidth
          type="password"
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
          autoFocus
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!password}
        >
          View Note
        </Button>
      </DialogActions>
    </Dialog>
  );
}