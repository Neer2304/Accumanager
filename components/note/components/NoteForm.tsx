import { useState } from 'react';
import {
  Box,
  TextField,
  Chip,
  Stack,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Switch,
  FormControlLabel,
  Typography,
  Paper,
  Button,
  Alert,
  alpha,
  useTheme,
} from '@mui/material';
import { Add, Close, Lock } from '@mui/icons-material';
import { NoteFormData } from '../types/note.types';
import { useThemeColors } from '@/hooks/useThemeColors';

interface NoteFormProps {
  formData: NoteFormData;
  onChange: (field: keyof NoteFormData, value: any) => void;
  error?: string;
  onErrorClose?: () => void;
  mode: 'create' | 'edit';
  onSubmit: () => void;
  loading: boolean;
}

export function NoteForm({
  formData,
  onChange,
  error,
  onErrorClose,
  mode,
  onSubmit,
  loading
}: NoteFormProps) {
  const theme = useTheme();
  const { noteColors, getColorWithContrast } = useThemeColors();
  const [tagInput, setTagInput] = useState('');

  const CATEGORIES = ['general', 'work', 'personal', 'ideas', 'projects', 'learning', 'tasks', 'meetings'];
  const PRIORITIES = ['low', 'medium', 'high', 'critical'];
  const ICONS = ['📝', '📋', '📚', '💡', '🎯', '📅', '👥', '💰', '🔒', '🌟', '📌', '🎨', '📊', '🔔', '💭', '✏️', '📖', '🎉', '🚀', '⭐'];

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      onChange('tags', [...formData.tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    onChange('tags', formData.tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <Stack spacing={3}>
      {/* Error Alert */}
      {error && (
        <Alert 
          severity="error" 
          sx={{ borderRadius: 2 }}
          onClose={onErrorClose}
        >
          {error}
        </Alert>
      )}

      {/* Basic Information */}
      <Paper sx={{ p: 3, borderRadius: 2, border: `1px solid ${theme.palette.divider}` }}>
        <Typography variant="h6" gutterBottom color="primary" fontWeight="bold">
          Basic Information
        </Typography>
        <TextField
          fullWidth
          label="Title *"
          value={formData.title}
          onChange={(e) => onChange('title', e.target.value)}
          sx={{ mb: 2 }}
          required
          size="small"
          helperText={mode === 'create' ? 'Give your note a descriptive title' : ''}
        />
        <TextField
          fullWidth
          label="Summary"
          value={formData.summary}
          onChange={(e) => onChange('summary', e.target.value)}
          multiline
          rows={2}
          sx={{ mb: 2 }}
          size="small"
          helperText="Optional brief description"
        />
        <TextField
          fullWidth
          label="Content *"
          value={formData.content}
          onChange={(e) => onChange('content', e.target.value)}
          multiline
          rows={10}
          required
          size="small"
          helperText={mode === 'create' ? 'Main content of your note' : ''}
        />
      </Paper>

      {/* Categorization */}
      <Paper sx={{ p: 3, borderRadius: 2, border: `1px solid ${theme.palette.divider}` }}>
        <Typography variant="h6" gutterBottom color="primary" fontWeight="bold">
          Categorization
        </Typography>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
          <FormControl fullWidth size="small">
            <InputLabel>Category</InputLabel>
            <Select
              value={formData.category}
              label="Category"
              onChange={(e) => onChange('category', e.target.value)}
            >
              {CATEGORIES.map(cat => (
                <MenuItem key={cat} value={cat}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      backgroundColor: 
                        cat === 'work' ? '#3b82f6' :
                        cat === 'personal' ? '#8b5cf6' :
                        cat === 'ideas' ? '#ec4899' :
                        cat === 'projects' ? '#10b981' :
                        cat === 'learning' ? '#f59e0b' :
                        cat === 'tasks' ? '#ef4444' :
                        cat === 'meetings' ? '#8b5cf6' :
                        '#6b7280',
                    }} />
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth size="small">
            <InputLabel>Priority</InputLabel>
            <Select
              value={formData.priority}
              label="Priority"
              onChange={(e) => onChange('priority', e.target.value)}
            >
              {PRIORITIES.map(pri => (
                <MenuItem key={pri} value={pri}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      backgroundColor: 
                        pri === 'critical' ? '#dc2626' :
                        pri === 'high' ? '#ea580c' :
                        pri === 'medium' ? '#d97706' :
                        '#059669',
                    }} />
                    {pri.charAt(0).toUpperCase() + pri.slice(1)}
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
      </Paper>

      {/* Tags */}
      <Paper sx={{ p: 3, borderRadius: 2, border: `1px solid ${theme.palette.divider}` }}>
        <Typography variant="h6" gutterBottom color="primary" fontWeight="bold">
          Tags
        </Typography>
        <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
          <TextField
            fullWidth
            label="Add Tag"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
            size="small"
            helperText="Press Enter or click + to add tag"
          />
          <Button 
            onClick={handleAddTag} 
            variant="outlined" 
            sx={{ minWidth: 'auto', px: 2 }}
          >
            <Add />
          </Button>
        </Stack>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {formData.tags.map(tag => (
            <Chip
              key={tag}
              label={tag}
              onDelete={() => handleRemoveTag(tag)}
              deleteIcon={<Close />}
              size="small"
              sx={{ 
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                color: theme.palette.primary.main,
                '& .MuiChip-deleteIcon': {
                  color: theme.palette.primary.main,
                }
              }}
            />
          ))}
          {formData.tags.length === 0 && mode === 'create' && (
            <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
              No tags added yet. Tags help organize your notes.
            </Typography>
          )}
        </Box>
      </Paper>

      {/* Appearance */}
      <Paper sx={{ p: 3, borderRadius: 2, border: `1px solid ${theme.palette.divider}` }}>
        <Typography variant="h6" gutterBottom color="primary" fontWeight="bold">
          Appearance
        </Typography>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
          <FormControl fullWidth size="small">
            <InputLabel>Icon</InputLabel>
            <Select
              value={formData.icon}
              label="Icon"
              onChange={(e) => onChange('icon', e.target.value)}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography sx={{ fontSize: '1.2rem' }}>{selected}</Typography>
                </Box>
              )}
            >
              {ICONS.map(icon => (
                <MenuItem key={icon} value={icon}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography sx={{ fontSize: '1.2rem' }}>{icon}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {icon}
                    </Typography>
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth size="small">
            <InputLabel>Color</InputLabel>
            <Select
              value={formData.color}
              label="Color"
              onChange={(e) => onChange('color', e.target.value)}
              renderValue={(selected) => {
                const { color: textColor } = getColorWithContrast(selected);
                return (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box
                      sx={{
                        width: 20,
                        height: 20,
                        borderRadius: '50%',
                        backgroundColor: selected,
                        border: `2px solid ${alpha(textColor, 0.3)}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.6rem',
                        fontWeight: 'bold',
                        color: textColor,
                      }}
                    >
                      Aa
                    </Box>
                    <Typography variant="body2">{selected}</Typography>
                  </Box>
                );
              }}
            >
              {noteColors.map((color, index) => {
                const { color: textColor } = getColorWithContrast(color);
                return (
                  <MenuItem key={index} value={color}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                      <Box
                        sx={{
                          width: 20,
                          height: 20,
                          borderRadius: '50%',
                          backgroundColor: color,
                          border: `2px solid ${alpha(textColor, 0.3)}`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.6rem',
                          fontWeight: 'bold',
                          color: textColor,
                        }}
                      >
                        Aa
                      </Box>
                      <Typography variant="body2" sx={{ flex: 1 }}>{color}</Typography>
                    </Box>
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </Stack>
      </Paper>

      {/* Privacy & Security */}
      <Paper sx={{ p: 3, borderRadius: 2, border: `1px solid ${theme.palette.divider}` }}>
        <Typography variant="h6" gutterBottom color="primary" fontWeight="bold">
          Privacy & Security
        </Typography>
        
        <FormControlLabel
          control={
            <Switch
              checked={formData.isPublic}
              onChange={(e) => onChange('isPublic', e.target.checked)}
              color="primary"
            />
          }
          label="Make this note public"
          sx={{ mb: 2 }}
        />

        <Stack spacing={2}>
          <Typography variant="subtitle1" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Lock fontSize="small" />
            Password Protection
          </Typography>
          
          <TextField
            fullWidth
            type="password"
            label={mode === 'edit' ? 'New Password' : 'Password (optional)'}
            value={formData.password}
            onChange={(e) => onChange('password', e.target.value)}
            placeholder={mode === 'edit' ? 'Leave empty to keep current password' : ''}
            size="small"
            helperText={mode === 'edit' 
              ? 'Set a new password to protect this note' 
              : 'Add a password to protect this note'}
          />
          
          {mode === 'edit' && (
            <FormControlLabel
              control={
                <Switch
                  checked={formData.removePassword}
                  onChange={(e) => onChange('removePassword', e.target.checked)}
                  color="primary"
                />
              }
              label="Remove password protection"
            />
          )}
        </Stack>
      </Paper>

      {/* Submit Button at Bottom */}
      <Paper sx={{ p: 2, borderRadius: 2, border: `1px solid ${theme.palette.divider}` }}>
        <Stack direction="row" justifyContent="flex-end" spacing={2}>
          <Button
            onClick={() => window.history.back()}
            variant="outlined"
            sx={{ borderRadius: 2 }}
          >
            Cancel
          </Button>
          <Button
            onClick={onSubmit}
            variant="contained"
            disabled={loading}
            sx={{ borderRadius: 2 }}
          >
            {loading 
              ? (mode === 'create' ? 'Creating...' : 'Saving...')
              : (mode === 'create' ? 'Create Note' : 'Save Changes')}
          </Button>
        </Stack>
      </Paper>
    </Stack>
  );
}