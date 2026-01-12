import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from '@mui/material';
import { REVIEWS_CONTENT } from '../ReviewsContent';

interface DeleteDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteDialog = ({ open, onClose, onConfirm }: DeleteDialogProps) => {
  const { deleteDialog } = REVIEWS_CONTENT;

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{deleteDialog.title}</DialogTitle>
      <DialogContent>
        <Typography>
          {deleteDialog.message}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{deleteDialog.cancel}</Button>
        <Button onClick={onConfirm} color="error" variant="contained">
          {deleteDialog.confirm}
        </Button>
      </DialogActions>
    </Dialog>
  );
};