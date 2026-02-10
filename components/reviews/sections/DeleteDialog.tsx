import React from 'react';
import { Dialog } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { Typography } from '@mui/material';
import { Box } from 'lucide-react';

interface DeleteDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  darkMode?: boolean;
}

export const DeleteDialog = ({ open, onClose, onConfirm, darkMode = false }: DeleteDialogProps) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Delete Review"
      maxWidth="sm"
      fullWidth
    >
      <Typography variant="body1" sx={{ mb: 3, color: darkMode ? "#e8eaed" : "#202124" }}>
        Are you sure you want to delete your review? This action cannot be undone.
      </Typography>
      
      <Box>
        <Button
          variant="outlined"
          onClick={onClose}
          size="medium"
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={onConfirm}
          size="medium"
          color="error"
        >
          Delete Review
        </Button>
      </Box>
    </Dialog>
  );
};