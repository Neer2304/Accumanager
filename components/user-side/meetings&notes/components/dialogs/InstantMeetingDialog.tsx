// app/components/user-side/meetings&notes/components/dialogs/InstantMeetingDialog.tsx
"use client";

import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Button,
  Stack,
  Box,
  Typography,
} from '@mui/material';
import { VideoCall, Groups, Business, People } from '@mui/icons-material';

interface InstantMeetingDialogProps {
  open: boolean;
  onClose: () => void;
  onCreateMeeting: (meetingData: any) => Promise<boolean>;
}

export function InstantMeetingDialog({
  open,
  onClose,
  onCreateMeeting,
}: InstantMeetingDialogProps) {
  const [meetingForm, setMeetingForm] = useState({
    title: '',
    description: '',
    participants: [] as string[],
    meetingType: 'internal' as const,
    allowJoinBeforeHost: true,
    waitingRoom: false,
    autoRecord: false,
  });

  const meetingTypes = [
    { value: 'internal', label: 'Internal Team Meeting', icon: <Groups /> },
    { value: 'client', label: 'Client Meeting', icon: <Business /> },
    { value: 'partner', label: 'Partner Meeting', icon: <People /> },
    { value: 'team', label: 'Team Meeting', icon: <Groups /> },
  ];

  const handleCreateInstantMeeting = async () => {
    const meetingData = {
      ...meetingForm,
      title: meetingForm.title || 'Quick Meeting',
      date: new Date().toISOString().split('T')[0],
      startTime: new Date().toTimeString().split(' ')[0].substring(0, 5),
      endTime: new Date(Date.now() + 60 * 60 * 1000).toTimeString().split(' ')[0].substring(0, 5),
      status: 'ongoing' as const,
      meetingLink: `https://meet.accumanage.com/${Math.random().toString(36).substring(2, 15)}`,
      isRecording: false,
    };

    const success = await onCreateMeeting(meetingData);
    if (success) {
      onClose();
      setMeetingForm({
        title: '',
        description: '',
        participants: [],
        meetingType: 'internal',
        allowJoinBeforeHost: true,
        waitingRoom: false,
        autoRecord: false,
      });
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
      <DialogTitle sx={{ pb: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="h6" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <VideoCall color="primary" />
          Start Instant Meeting
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Meeting Title"
            value={meetingForm.title}
            onChange={(e) => setMeetingForm(prev => ({ ...prev, title: e.target.value }))}
            placeholder="Quick sync, Team standup, Client call..."
            variant="outlined"
          />
          
          <TextField
            fullWidth
            label="Description (Optional)"
            multiline
            rows={2}
            value={meetingForm.description}
            onChange={(e) => setMeetingForm(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Brief description of the meeting purpose..."
            variant="outlined"
          />
          
          <FormControl fullWidth variant="outlined">
            <InputLabel>Meeting Type</InputLabel>
            <Select
              value={meetingForm.meetingType}
              label="Meeting Type"
              onChange={(e) => setMeetingForm(prev => ({ ...prev, meetingType: e.target.value as any }))}
            >
              {meetingTypes.map(type => (
                <MenuItem key={type.value} value={type.value}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ color: 'primary.main' }}>{type.icon}</Box>
                    {type.label}
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <TextField
            fullWidth
            label="Invite Participants (Optional)"
            placeholder="email1@example.com, email2@example.com"
            onChange={(e) => setMeetingForm(prev => ({ 
              ...prev, 
              participants: e.target.value.split(',').map(p => p.trim()).filter(p => p)
            }))}
            variant="outlined"
            helperText="Separate multiple emails with commas"
          />

          <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 1, p: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Meeting Settings
            </Typography>
            <Stack spacing={2}>
              <FormControlLabel
                control={
                  <Switch
                    checked={meetingForm.allowJoinBeforeHost}
                    onChange={(e) => setMeetingForm(prev => ({ ...prev, allowJoinBeforeHost: e.target.checked }))}
                  />
                }
                label="Allow participants to join before host"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={meetingForm.waitingRoom}
                    onChange={(e) => setMeetingForm(prev => ({ ...prev, waitingRoom: e.target.checked }))}
                  />
                }
                label="Enable waiting room"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={meetingForm.autoRecord}
                    onChange={(e) => setMeetingForm(prev => ({ ...prev, autoRecord: e.target.checked }))}
                  />
                }
                label="Auto-record meeting"
              />
            </Stack>
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ p: 3, borderTop: 1, borderColor: 'divider' }}>
        <Button onClick={onClose} size="large" sx={{ borderRadius: 2 }}>
          Cancel
        </Button>
        <Button 
          onClick={handleCreateInstantMeeting} 
          variant="contained"
          startIcon={<VideoCall />}
          size="large"
          sx={{ px: 3, borderRadius: 2 }}
        >
          Start Meeting
        </Button>
      </DialogActions>
    </Dialog>
  );
}