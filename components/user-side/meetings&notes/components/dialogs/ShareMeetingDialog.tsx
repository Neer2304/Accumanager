// app/components/user-side/meetings&notes/components/dialogs/ShareMeetingDialog.tsx
"use client";

import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
  Box,
  Typography,
  IconButton,
  Tooltip,
} from '@mui/material';
import { Link, Send, CopyAll } from '@mui/icons-material';

interface ShareMeetingDialogProps {
  open: boolean;
  onClose: () => void;
  meetingLink: string;
  meetingTitle: string;
}

export function ShareMeetingDialog({
  open,
  onClose,
  meetingLink,
  meetingTitle,
}: ShareMeetingDialogProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(meetingLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const shareViaEmail = () => {
    const subject = `Join me for: ${meetingTitle}`;
    const body = `You're invited to join the meeting: ${meetingTitle}\n\nJoin here: ${meetingLink}`;
    window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
      <DialogTitle sx={{ pb: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="h6" fontWeight="bold">
          Share Meeting Link
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 2 }}>
          <Box>
            <Typography variant="subtitle1" fontWeight="600" gutterBottom>
              {meetingTitle}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Share this link with participants to join the meeting
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <TextField
              fullWidth
              value={meetingLink}
              InputProps={{
                readOnly: true,
                startAdornment: <Link sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
              size="small"
              variant="outlined"
            />
            <Tooltip title={copied ? "Copied!" : "Copy link"}>
              <IconButton 
                onClick={copyToClipboard} 
                color="primary"
                sx={{ 
                  border: 1, 
                  borderColor: 'primary.main',
                  borderRadius: 2 
                }}
              >
                <CopyAll />
              </IconButton>
            </Tooltip>
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ p: 3, borderTop: 1, borderColor: 'divider' }}>
        <Button onClick={onClose} sx={{ borderRadius: 2 }}>Close</Button>
        <Button 
          onClick={shareViaEmail}
          variant="contained"
          startIcon={<Send />}
          sx={{ borderRadius: 2 }}
        >
          Share via Email
        </Button>
      </DialogActions>
    </Dialog>
  );
}