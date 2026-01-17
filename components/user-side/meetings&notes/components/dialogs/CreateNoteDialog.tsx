// app/components/user-side/meetings&notes/components/dialogs/CreateNoteDialog.tsx
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
  IconButton,
  Slider,
} from '@mui/material';
import {
  Notes,
  PushPin,
  Lock,
  LockOpen,
  Label,
  ColorLens,
  Share,
  Palette,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import type { NoteFormData } from '../../types';
import Tooltip from '@mui/material/Tooltip';

interface CreateNoteDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: NoteFormData) => Promise<void>;
  initialData?: Partial<NoteFormData>;
  meetingId?: string;
}

export function CreateNoteDialog({
  open,
  onClose,
  onSubmit,
  initialData,
  meetingId,
}: CreateNoteDialogProps) {
  const [formData, setFormData] = useState<NoteFormData>({
    title: '',
    content: '',
    category: 'meeting',
    tags: [],
    isPinned: false,
    meetingId: meetingId || '',
    isEncrypted: false,
    color: '#ffffff',
    isShared: false,
    sharedWith: [],
    ...initialData,
  });

  const [currentTag, setCurrentTag] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [showColorPicker, setShowColorPicker] = useState(false);

  const categories = [
    { value: 'meeting', label: 'Meeting Notes' },
    { value: 'project', label: 'Project' },
    { value: 'personal', label: 'Personal' },
    { value: 'ideas', label: 'Ideas' },
    { value: 'todo', label: 'To-Do' },
    { value: 'research', label: 'Research' },
    { value: 'learning', label: 'Learning' },
  ];

  const colorOptions = [
    '#ffffff', '#fef3c7', '#dcfce7', '#dbeafe', '#f3e8ff', '#fce7f3', '#fee2e2', '#e0e7ff',
  ];

  const handleAddTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, currentTag.trim()],
      });
      setCurrentTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove),
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleSubmit = async () => {
    if (!formData.title.trim()) {
      setError('Note title is required');
      return;
    }

    if (!formData.content.trim()) {
      setError('Note content is required');
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
        content: '',
        category: 'meeting',
        tags: [],
        isPinned: false,
        meetingId: meetingId || '',
        isEncrypted: false,
        color: '#ffffff',
        isShared: false,
        sharedWith: [],
      });
      setCurrentTag('');
    } catch (err) {
      setError('Failed to save note. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleColorSelect = (color: string) => {
    setFormData({ ...formData, color });
    setShowColorPicker(false);
  };

  const wordCount = formData.content.trim().split(/\s+/).filter(word => word.length > 0).length;

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{ sx: { borderRadius: 3 } }}
    >
      <DialogTitle sx={{ pb: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="h6" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Notes color="primary" />
          {initialData?.title ? 'Edit Note' : 'Create New Note'}
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
            label="Note Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
            placeholder="Enter note title"
            variant="outlined"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={formData.isPinned}
                          onChange={(e) => setFormData({ ...formData, isPinned: e.target.checked })}
                          size="small"
                        />
                      }
                      label="Pin"
                      sx={{ m: 0 }}
                    />
                    <Tooltip title="Note Color">
                      <IconButton
                        size="small"
                        onClick={() => setShowColorPicker(!showColorPicker)}
                        sx={{ 
                          bgcolor: formData.color,
                          border: 1,
                          borderColor: 'divider',
                          '&:hover': { bgcolor: formData.color },
                        }}
                      >
                        <Palette fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </InputAdornment>
              ),
            }}
          />

          {showColorPicker && (
            <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 1, p: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Select Note Color
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {colorOptions.map(color => (
                  <IconButton
                    key={color}
                    size="small"
                    onClick={() => handleColorSelect(color)}
                    sx={{
                      width: 32,
                      height: 32,
                      bgcolor: color,
                      border: 2,
                      borderColor: formData.color === color ? 'primary.main' : 'transparent',
                      '&:hover': { bgcolor: color },
                    }}
                  />
                ))}
              </Stack>
            </Box>
          )}

          <TextField
            fullWidth
            label="Content"
            multiline
            rows={8}
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            required
            placeholder="Write your note here..."
            variant="outlined"
            helperText={`${wordCount} words`}
          />

          <FormControl fullWidth>
            <InputLabel>Category</InputLabel>
            <Select
              value={formData.category}
              label="Category"
              onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
            >
              {categories.map(category => (
                <MenuItem key={category.value} value={category.value}>
                  {category.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Tags
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <TextField
                fullWidth
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Add a tag and press Enter"
                variant="outlined"
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Label fontSize="small" color="action" />
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                onClick={handleAddTag}
                variant="outlined"
                disabled={!currentTag.trim()}
              >
                Add
              </Button>
            </Box>
            
            {formData.tags.length > 0 && (
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {formData.tags.map(tag => (
                  <Chip
                    key={tag}
                    label={tag}
                    onDelete={() => handleRemoveTag(tag)}
                    size="small"
                    deleteIcon={<DeleteIcon fontSize="small" />}
                    sx={{ fontSize: '0.875rem' }}
                  />
                ))}
              </Box>
            )}
          </Box>

          <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 1, p: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Note Settings
            </Typography>
            <Stack spacing={2}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isEncrypted}
                    onChange={(e) => setFormData({ ...formData, isEncrypted: e.target.checked })}
                  />
                }
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {formData.isEncrypted ? <Lock color="warning" /> : <LockOpen color="action" />}
                    <Typography variant="body2">
                      Encrypt Note
                      {formData.isEncrypted && ' (Secure)'}
                    </Typography>
                  </Box>
                }
              />
              
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isShared}
                    onChange={(e) => setFormData({ ...formData, isShared: e.target.checked })}
                  />
                }
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Share color="action" />
                    <Typography variant="body2">Share Note with Team</Typography>
                  </Box>
                }
              />
            </Stack>
          </Box>

          {formData.isEncrypted && (
            <Alert severity="warning" icon={<Lock />}>
              <Typography variant="body2" fontWeight="bold">
                Important: Note Encryption
              </Typography>
              <Typography variant="caption" display="block">
                This note will be encrypted. You'll need to enter the encryption key every time you want to view it.
                Make sure to save the encryption key securely.
              </Typography>
            </Alert>
          )}

          {formData.isShared && (
            <Alert severity="info" icon={<Share />}>
              <Typography variant="body2" fontWeight="bold">
                Note Sharing
              </Typography>
              <Typography variant="caption" display="block">
                This note will be shared with all team members. They will be able to view and edit this note.
              </Typography>
            </Alert>
          )}
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
          startIcon={<Notes />}
          sx={{ borderRadius: 2, px: 3 }}
        >
          {saving ? 'Saving...' : initialData?.title ? 'Update Note' : 'Create Note'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// Note: Add this import at the top if Tooltip is used
