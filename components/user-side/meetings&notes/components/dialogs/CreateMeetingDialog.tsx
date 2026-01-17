// app/components/user-side/meetings&notes/components/dialogs/CreateMeetingDialog.tsx
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
  Chip,
  Alert,
  InputAdornment,
} from '@mui/material';
import {
  Schedule,
  Groups,
  Business,
  People,
  Person,
  AccessTime,
  LocationOn,
  Description,
  VpnKey,
} from '@mui/icons-material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import type { MeetingFormData } from '../../types';

interface CreateMeetingDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: MeetingFormData) => Promise<void>;
  initialData?: Partial<MeetingFormData>;
}

export function CreateMeetingDialog({
  open,
  onClose,
  onSubmit,
  initialData,
}: CreateMeetingDialogProps) {
  const [formData, setFormData] = useState<MeetingFormData>({
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    startTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    endTime: new Date(Date.now() + 60 * 60 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    participants: [],
    meetingType: 'internal',
    location: '',
    agenda: [],
    notes: '',
    allowJoinBeforeHost: true,
    waitingRoom: false,
    autoRecord: false,
    isRecording: false,
    password: '',
    maxParticipants: 50,
    tags: [],
    color: '#667eea',
    priority: 'medium',
    reminderMinutes: [15, 30, 60],
    ...initialData,
  });

  const [currentParticipant, setCurrentParticipant] = useState('');
  const [currentTag, setCurrentTag] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const meetingTypes = [
    { value: 'internal', label: 'Internal Team Meeting', icon: <Groups /> },
    { value: 'client', label: 'Client Meeting', icon: <Business /> },
    { value: 'partner', label: 'Partner Meeting', icon: <People /> },
    { value: 'team', label: 'Team Meeting', icon: <Groups /> },
    { value: 'one-on-one', label: 'One-on-One Meeting', icon: <Person /> },
  ];

  const priorityOptions = [
    { value: 'low', label: 'Low', color: 'success' },
    { value: 'medium', label: 'Medium', color: 'warning' },
    { value: 'high', label: 'High', color: 'error' },
  ];

  const reminderOptions = [
    { value: 5, label: '5 minutes before' },
    { value: 15, label: '15 minutes before' },
    { value: 30, label: '30 minutes before' },
    { value: 60, label: '1 hour before' },
    { value: 1440, label: '1 day before' },
  ];

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleAddParticipant = () => {
    if (currentParticipant && validateEmail(currentParticipant)) {
      if (!formData.participants.includes(currentParticipant)) {
        setFormData({
          ...formData,
          participants: [...formData.participants, currentParticipant],
        });
      }
      setCurrentParticipant('');
    }
  };

  const handleRemoveParticipant = (email: string) => {
    setFormData({
      ...formData,
      participants: formData.participants.filter(p => p !== email),
    });
  };

  const handleAddTag = () => {
    if (currentTag.trim() && !formData.tags?.includes(currentTag.trim())) {
      setFormData({
        ...formData,
        tags: [...(formData.tags || []), currentTag.trim()],
      });
      setCurrentTag('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags?.filter(t => t !== tag) || [],
    });
  };

  const toggleReminder = (minutes: number) => {
    const currentReminders = formData.reminderMinutes || [];
    if (currentReminders.includes(minutes)) {
      setFormData({
        ...formData,
        reminderMinutes: currentReminders.filter(m => m !== minutes),
      });
    } else {
      setFormData({
        ...formData,
        reminderMinutes: [...currentReminders, minutes],
      });
    }
  };

  const handleSubmit = async () => {
    if (!formData.title.trim()) {
      setError('Meeting title is required');
      return;
    }

    setSaving(true);
    setError('');

    try {
      await onSubmit(formData);
      onClose();
      // Reset form
      setFormData({
        title: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        startTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        endTime: new Date(Date.now() + 60 * 60 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        participants: [],
        meetingType: 'internal',
        location: '',
        agenda: [],
        notes: '',
        allowJoinBeforeHost: true,
        waitingRoom: false,
        autoRecord: false,
        isRecording: false,
        password: '',
        maxParticipants: 50,
        tags: [],
        color: '#667eea',
        priority: 'medium',
        reminderMinutes: [15, 30, 60],
      });
    } catch (err) {
      setError('Failed to create meeting. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Dialog 
        open={open} 
        onClose={onClose} 
        maxWidth="md" 
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ pb: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Typography variant="h6" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Schedule color="primary" />
            {initialData?.title ? 'Edit Meeting' : 'Schedule New Meeting'}
          </Typography>
        </DialogTitle>
        
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 2 }}>
            {error && (
              <Alert severity="error" onClose={() => setError('')}>
                {error}
              </Alert>
            )}

            <TextField
              fullWidth
              label="Meeting Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              placeholder="Enter meeting title"
              variant="outlined"
            />

            <TextField
              fullWidth
              label="Description"
              multiline
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter meeting description"
              variant="outlined"
            />

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <DatePicker
                label="Date"
                value={new Date(formData.date)}
                onChange={(date) => {
                  if (date) {
                    setFormData({ ...formData, date: date.toISOString().split('T')[0] });
                  }
                }}
                slotProps={{ textField: { fullWidth: true } }}
              />
              <TimePicker
                label="Start Time"
                value={new Date(`2000-01-01T${formData.startTime}`)}
                onChange={(time) => {
                  if (time) {
                    setFormData({ ...formData, startTime: time.toTimeString().slice(0, 5) });
                  }
                }}
                slotProps={{ textField: { fullWidth: true } }}
              />
              <TimePicker
                label="End Time"
                value={new Date(`2000-01-01T${formData.endTime}`)}
                onChange={(time) => {
                  if (time) {
                    setFormData({ ...formData, endTime: time.toTimeString().slice(0, 5) });
                  }
                }}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </Stack>

            <FormControl fullWidth>
              <InputLabel>Meeting Type</InputLabel>
              <Select
                value={formData.meetingType}
                label="Meeting Type"
                onChange={(e) => setFormData({ ...formData, meetingType: e.target.value as any })}
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

            <FormControl fullWidth>
              <InputLabel>Priority</InputLabel>
              <Select
                value={formData.priority}
                label="Priority"
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
              >
                {priorityOptions.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    <Chip
                      label={option.label}
                      size="small"
                      color={option.color as any}
                      variant="outlined"
                    />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Invite Participants
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <TextField
                  fullWidth
                  value={currentParticipant}
                  onChange={(e) => setCurrentParticipant(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddParticipant()}
                  placeholder="participant@example.com"
                  variant="outlined"
                  size="small"
                  error={currentParticipant !== '' && !validateEmail(currentParticipant)}
                  helperText={currentParticipant !== '' && !validateEmail(currentParticipant) ? 'Invalid email format' : ''}
                />
                <Button
                  onClick={handleAddParticipant}
                  variant="contained"
                  disabled={!currentParticipant || !validateEmail(currentParticipant)}
                  sx={{ minWidth: 'auto' }}
                >
                  Add
                </Button>
              </Box>
              
              {formData.participants.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                    Participants ({formData.participants.length}):
                  </Typography>
                  <Stack spacing={1}>
                    {formData.participants.map(email => (
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
                        <Button
                          size="small"
                          onClick={() => handleRemoveParticipant(email)}
                          sx={{ color: 'error.main', minWidth: 'auto' }}
                        >
                          Remove
                        </Button>
                      </Box>
                    ))}
                  </Stack>
                </Box>
              )}
            </Box>

            <TextField
              fullWidth
              label="Location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="Enter meeting location or virtual meeting link"
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LocationOn color="action" />
                  </InputAdornment>
                ),
              }}
            />

            <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 1, p: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Meeting Settings
              </Typography>
              <Stack spacing={2}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.allowJoinBeforeHost}
                      onChange={(e) => setFormData({ ...formData, allowJoinBeforeHost: e.target.checked })}
                    />
                  }
                  label="Allow participants to join before host"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.waitingRoom}
                      onChange={(e) => setFormData({ ...formData, waitingRoom: e.target.checked })}
                    />
                  }
                  label="Enable waiting room"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.autoRecord}
                      onChange={(e) => setFormData({ ...formData, autoRecord: e.target.checked })}
                    />
                  }
                  label="Auto-record meeting"
                />
              </Stack>
            </Box>

            <TextField
              fullWidth
              label="Meeting Password (Optional)"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              type="password"
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <VpnKey color="action" />
                  </InputAdornment>
                ),
              }}
            />

            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Reminders
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {reminderOptions.map(option => (
                  <Chip
                    key={option.value}
                    label={option.label}
                    onClick={() => toggleReminder(option.value)}
                    color={formData.reminderMinutes?.includes(option.value) ? 'primary' : 'default'}
                    variant={formData.reminderMinutes?.includes(option.value) ? 'filled' : 'outlined'}
                    size="small"
                  />
                ))}
              </Stack>
            </Box>
          </Stack>
        </DialogContent>

        <DialogActions sx={{ p: 3, borderTop: 1, borderColor: 'divider' }}>
          <Button onClick={onClose} disabled={saving} sx={{ borderRadius: 2 }}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={saving}
            startIcon={<Schedule />}
            sx={{ borderRadius: 2, px: 3 }}
          >
            {saving ? 'Saving...' : initialData?.title ? 'Update Meeting' : 'Schedule Meeting'}
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
}