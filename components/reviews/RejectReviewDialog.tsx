import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  TextField,
  Button,
  Box,
} from '@mui/material';
import { Cancel } from '@mui/icons-material';

interface RejectReviewDialogProps {
  open: boolean;
  review: {
    userName: string;
    comment: string;
  } | null;
  onClose: () => void;
  onReject: (reason: string) => void;
}

const RejectReviewDialog: React.FC<RejectReviewDialogProps> = ({
  open,
  review,
  onClose,
  onReject,
}) => {
  const [reason, setReason] = useState('');

  const handleSubmit = () => {
    onReject(reason);
    setReason('');
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Cancel color="error" />
          <Typography>Reject Review</Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        {review && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" color="text.secondary">
              Review by <strong>{review.userName}</strong>
            </Typography>
            <Typography variant="caption" color="text.secondary" display="block">
              "{review.comment.substring(0, 100)}..."
            </Typography>
          </Box>
        )}
        <TextField
          autoFocus
          fullWidth
          multiline
          rows={4}
          label="Rejection Reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Please provide a reason for rejection. This will be shared with the user..."
          variant="outlined"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button 
          onClick={handleSubmit} 
          color="error"
          variant="contained"
          startIcon={<Cancel />}
          disabled={!reason.trim()}
        >
          Reject Review
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RejectReviewDialog;