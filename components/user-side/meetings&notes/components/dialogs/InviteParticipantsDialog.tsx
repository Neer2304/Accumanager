// app/components/user-side/meetings&notes/components/dialogs/InviteParticipantsDialog.tsx
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
  Chip,
} from '@mui/material';
import { PersonAdd, Send, Check, Close } from '@mui/icons-material';
import type { Meeting } from '@/components/user-side/meetings&notes/types';

interface InviteParticipantsDialogProps {
  open: boolean;
  onClose: () => void;
  meeting: Meeting | null;
  onSendInvitations: (data: { receiverEmails: string[]; message: string }) => Promise<void>;
}

export function InviteParticipantsDialog({
  open,
  onClose,
  meeting,
  onSendInvitations,
}: InviteParticipantsDialogProps) {
  const [emails, setEmails] = useState<string[]>([]);
  const [currentEmail, setCurrentEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleAddEmail = () => {
    if (currentEmail && validateEmail(currentEmail)) {
      if (!emails.includes(currentEmail)) {
        setEmails([...emails, currentEmail]);
      }
      setCurrentEmail('');
    }
  };

  const handleRemoveEmail = (emailToRemove: string) => {
    setEmails(emails.filter(email => email !== emailToRemove));
  };

  const handleSendInvitations = async () => {
    if (emails.length === 0) {
      alert('Please add at least one email address');
      return;
    }

    setSending(true);
    try {
      await onSendInvitations({
        receiverEmails: emails,
        message,
      });
      setSent(true);
      setTimeout(() => {
        setSent(false);
        onClose();
        setEmails([]);
        setMessage('');
      }, 2000);
    } catch (error) {
      console.error('Error sending invitations:', error);
      alert('Failed to send invitations');
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      handleAddEmail();
    }
  };

  if (!meeting) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
      <DialogTitle sx={{ pb: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="h6" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <PersonAdd color="primary" />
          Invite Participants
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 2 }}>
          <Box>
            <Typography variant="subtitle1" fontWeight="600" gutterBottom>
              {meeting.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {new Date(meeting.date).toLocaleDateString()} • {meeting.startTime} - {meeting.endTime}
            </Typography>
          </Box>

          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Add Email Addresses
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <TextField
                fullWidth
                value={currentEmail}
                onChange={(e) => setCurrentEmail(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="participant@example.com"
                variant="outlined"
                size="small"
                error={currentEmail !== '' && !validateEmail(currentEmail)}
                helperText={currentEmail !== '' && !validateEmail(currentEmail) ? 'Invalid email format' : ''}
              />
              <Button
                onClick={handleAddEmail}
                variant="contained"
                disabled={!currentEmail || !validateEmail(currentEmail)}
                sx={{ minWidth: 'auto' }}
              >
                Add
              </Button>
            </Box>
            
            {emails.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                  Invited participants ({emails.length}):
                </Typography>
                <Stack spacing={1}>
                  {emails.map(email => (
                    <Box
                      key={email}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        p: 1.5,
                        bgcolor: 'background.default',
                        borderRadius: 1,
                      }}
                    >
                      <Typography variant="body2">{email}</Typography>
                      <IconButton
                        size="small"
                        onClick={() => handleRemoveEmail(email)}
                        sx={{ color: 'error.main' }}
                      >
                        <Close fontSize="small" />
                      </IconButton>
                    </Box>
                  ))}
                </Stack>
              </Box>
            )}
          </Box>

          <TextField
            fullWidth
            label="Personal Message (Optional)"
            multiline
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Add a personal message for the invite..."
            variant="outlined"
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ p: 3, borderTop: 1, borderColor: 'divider' }}>
        <Button onClick={onClose} disabled={sending} sx={{ borderRadius: 2 }}>
          Cancel
        </Button>
        <Button
          onClick={handleSendInvitations}
          variant="contained"
          disabled={emails.length === 0 || sending || sent}
          startIcon={sent ? <Check /> : <Send />}
          sx={{ borderRadius: 2 }}
        >
          {sending ? 'Sending...' : sent ? 'Invitations Sent!' : 'Send Invitations'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}