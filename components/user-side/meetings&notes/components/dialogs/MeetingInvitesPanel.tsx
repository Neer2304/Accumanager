// app/components/user-side/meetings&notes/components/dialogs/MeetingInvitesPanel.tsx
"use client";

import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Button,
  Stack,
  Box,
  Typography,
  Badge,
  Avatar,
} from '@mui/material';
import { Notifications, MailOutline, Person, Check, Close } from '@mui/icons-material';
import type { MeetingInvite } from '@/components/user-side/meetings&notes/types';

interface MeetingInvitesPanelProps {
  open: boolean;
  onClose: () => void;
  invites: MeetingInvite[];
  onAcceptInvite: (inviteId: string) => Promise<void>;
  onDeclineInvite: (inviteId: string) => Promise<void>;
}

export function MeetingInvitesPanel({
  open,
  onClose,
  invites,
  onAcceptInvite,
  onDeclineInvite,
}: MeetingInvitesPanelProps) {
  const [tabValue, setTabValue] = useState(0);

  const pendingInvites = invites.filter(invite => invite.status === 'pending');
  const acceptedInvites = invites.filter(invite => invite.status === 'accepted');
  const declinedInvites = invites.filter(invite => invite.status === 'declined');

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{ sx: { borderRadius: 3, height: '80vh' } }}
    >
      <DialogTitle sx={{ pb: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="h6" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Notifications color="primary" />
          Meeting Invitations
          {pendingInvites.length > 0 && (
            <Badge
              badgeContent={pendingInvites.length}
              color="error"
              sx={{ ml: 1 }}
            />
          )}
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ p: 0 }}>
        <Tabs 
          value={tabValue} 
          onChange={(_, newValue) => setTabValue(newValue)}
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab
            label={
              <Badge badgeContent={pendingInvites.length} color="error">
                Pending
              </Badge>
            }
          />
          <Tab label={`Accepted (${acceptedInvites.length})`} />
          <Tab label={`Declined (${declinedInvites.length})`} />
        </Tabs>
        
        <List sx={{ p: 0 }}>
          {tabValue === 0 && (
            pendingInvites.length === 0 ? (
              <Box sx={{ p: 4, textAlign: 'center' }}>
                <MailOutline sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary">
                  No pending invitations
                </Typography>
              </Box>
            ) : (
              pendingInvites.map(invite => (
                <ListItem
                  key={invite._id}
                  divider
                  sx={{
                    bgcolor: !invite.read ? 'action.hover' : 'transparent',
                    transition: 'background-color 0.2s',
                  }}
                >
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                      <Person />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography variant="subtitle1" fontWeight="600">
                        {invite.meetingTitle}
                      </Typography>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          From: {invite.senderName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(invite.meetingTime).toLocaleString()}
                        </Typography>
                        {invite.message && (
                          <Typography variant="body2" sx={{ mt: 1 }}>
                            {invite.message}
                          </Typography>
                        )}
                      </Box>
                    }
                  />
                  <Stack spacing={1}>
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<Check />}
                      onClick={() => onAcceptInvite(invite._id)}
                      sx={{ borderRadius: 2 }}
                    >
                      Accept
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      color="error"
                      startIcon={<Close />}
                      onClick={() => onDeclineInvite(invite._id)}
                      sx={{ borderRadius: 2 }}
                    >
                      Decline
                    </Button>
                  </Stack>
                </ListItem>
              ))
            )
          )}
          
          {tabValue === 1 && (
            acceptedInvites.length === 0 ? (
              <Box sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="body1" color="text.secondary">
                  No accepted invitations
                </Typography>
              </Box>
            ) : (
              acceptedInvites.map(invite => (
                <ListItem key={invite._id} divider>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'success.main' }}>
                      <Check />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={invite.meetingTitle}
                    secondary={`Accepted on ${new Date(invite.updatedAt).toLocaleDateString()}`}
                  />
                </ListItem>
              ))
            )
          )}
          
          {tabValue === 2 && (
            declinedInvites.length === 0 ? (
              <Box sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="body1" color="text.secondary">
                  No declined invitations
                </Typography>
              </Box>
            ) : (
              declinedInvites.map(invite => (
                <ListItem key={invite._id} divider>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'error.main' }}>
                      <Close />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={invite.meetingTitle}
                    secondary={`Declined on ${new Date(invite.updatedAt).toLocaleDateString()}`}
                  />
                </ListItem>
              ))
            )
          )}
        </List>
      </DialogContent>
      <DialogActions sx={{ p: 3, borderTop: 1, borderColor: 'divider' }}>
        <Button onClick={onClose} sx={{ borderRadius: 2 }}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}