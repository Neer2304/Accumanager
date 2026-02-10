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
  Alert,
  alpha,
  useTheme,
} from '@mui/material';
import { Add, Close, Lock } from '@mui/icons-material';
import { NoteFormData } from '@/components/note/types/note.types';
import { useThemeColors } from '@/hooks/useThemeColors';

// Import Google-themed components
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface NoteFormProps {
  formData: NoteFormData;
  onChange: (field: keyof NoteFormData, value: any) => void;
  error?: string;
  onErrorClose?: () => void;
  mode: 'create' | 'edit';
  onSubmit: () => void;
  loading: boolean;
  darkMode?: boolean;
}

export function NoteForm({
  formData,
  onChange,
  error,
  onErrorClose,
  mode,
  onSubmit,
  loading,
  darkMode = false,
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return '#dc2626';
      case 'high': return '#ea580c';
      case 'medium': return '#d97706';
      case 'low': return '#059669';
      default: return '#6b7280';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'work': return '#3b82f6';
      case 'personal': return '#8b5cf6';
      case 'ideas': return '#ec4899';
      case 'projects': return '#10b981';
      case 'learning': return '#f59e0b';
      case 'tasks': return '#ef4444';
      case 'meetings': return '#8b5cf6';
      default: return '#6b7280';
    }
  };

  return (
    <Stack spacing={3}>
      {/* Error Alert */}
      {error && (
        <Alert 
          severity="error" 
          sx={{ 
            borderRadius: '12px',
            backgroundColor: darkMode ? '#3c1f1f' : '#fdeded',
            border: darkMode ? '1px solid #5c2b2b' : '1px solid #ef9a9a',
          }}
          onClose={onErrorClose}
        >
          {error}
        </Alert>
      )}

      {/* Basic Information */}
      <Card
        hover
        sx={{ 
          p: 3, 
          borderRadius: '16px',
          border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
          backgroundColor: darkMode ? '#303134' : '#ffffff',
        }}
      >
        <Typography 
          variant="h6" 
          gutterBottom 
          sx={{ 
            color: darkMode ? '#e8eaed' : '#202124',
            fontWeight: 500,
            fontSize: '1.125rem',
            mb: 2,
          }}
        >
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
          InputProps={{
            sx: {
              backgroundColor: darkMode ? '#202124' : '#ffffff',
              color: darkMode ? '#e8eaed' : '#202124',
              borderColor: darkMode ? '#3c4043' : '#dadce0',
              '&:hover': {
                borderColor: darkMode ? '#5f6368' : '#5f6368',
              },
            },
          }}
          InputLabelProps={{
            sx: {
              color: darkMode ? '#9aa0a6' : '#5f6368',
            },
          }}
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
          InputProps={{
            sx: {
              backgroundColor: darkMode ? '#202124' : '#ffffff',
              color: darkMode ? '#e8eaed' : '#202124',
              borderColor: darkMode ? '#3c4043' : '#dadce0',
            },
          }}
          InputLabelProps={{
            sx: {
              color: darkMode ? '#9aa0a6' : '#5f6368',
            },
          }}
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
          InputProps={{
            sx: {
              backgroundColor: darkMode ? '#202124' : '#ffffff',
              color: darkMode ? '#e8eaed' : '#202124',
              borderColor: darkMode ? '#3c4043' : '#dadce0',
              fontFamily: "'Roboto', 'Noto Sans', sans-serif",
              fontSize: '0.875rem',
              lineHeight: 1.6,
            },
          }}
          InputLabelProps={{
            sx: {
              color: darkMode ? '#9aa0a6' : '#5f6368',
            },
          }}
        />
      </Card>

      {/* Categorization */}
      <Card
        hover
        sx={{ 
          p: 3, 
          borderRadius: '16px',
          border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
          backgroundColor: darkMode ? '#303134' : '#ffffff',
        }}
      >
        <Typography 
          variant="h6" 
          gutterBottom 
          sx={{ 
            color: darkMode ? '#e8eaed' : '#202124',
            fontWeight: 500,
            fontSize: '1.125rem',
            mb: 2,
          }}
        >
          Categorization
        </Typography>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
          <FormControl fullWidth size="small">
            <InputLabel sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>Category</InputLabel>
            <Select
              value={formData.category}
              label="Category"
              onChange={(e) => onChange('category', e.target.value)}
              sx={{
                backgroundColor: darkMode ? '#202124' : '#ffffff',
                color: darkMode ? '#e8eaed' : '#202124',
                borderColor: darkMode ? '#3c4043' : '#dadce0',
                '& .MuiSelect-icon': {
                  color: darkMode ? '#9aa0a6' : '#5f6368',
                },
              }}
            >
              {CATEGORIES.map(cat => (
                <MenuItem 
                  key={cat} 
                  value={cat}
                  sx={{ 
                    backgroundColor: darkMode ? '#303134' : '#ffffff',
                    color: darkMode ? '#e8eaed' : '#202124',
                    '&:hover': {
                      backgroundColor: darkMode ? '#3c4043' : '#f1f3f4',
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      backgroundColor: getCategoryColor(cat),
                    }} />
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth size="small">
            <InputLabel sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>Priority</InputLabel>
            <Select
              value={formData.priority}
              label="Priority"
              onChange={(e) => onChange('priority', e.target.value)}
              sx={{
                backgroundColor: darkMode ? '#202124' : '#ffffff',
                color: darkMode ? '#e8eaed' : '#202124',
                borderColor: darkMode ? '#3c4043' : '#dadce0',
                '& .MuiSelect-icon': {
                  color: darkMode ? '#9aa0a6' : '#5f6368',
                },
              }}
            >
              {PRIORITIES.map(pri => (
                <MenuItem 
                  key={pri} 
                  value={pri}
                  sx={{ 
                    backgroundColor: darkMode ? '#303134' : '#ffffff',
                    color: darkMode ? '#e8eaed' : '#202124',
                    '&:hover': {
                      backgroundColor: darkMode ? '#3c4043' : '#f1f3f4',
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      backgroundColor: getPriorityColor(pri),
                    }} />
                    {pri.charAt(0).toUpperCase() + pri.slice(1)}
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
      </Card>

      {/* Tags */}
      <Card
        hover
        sx={{ 
          p: 3, 
          borderRadius: '16px',
          border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
          backgroundColor: darkMode ? '#303134' : '#ffffff',
        }}
      >
        <Typography 
          variant="h6" 
          gutterBottom 
          sx={{ 
            color: darkMode ? '#e8eaed' : '#202124',
            fontWeight: 500,
            fontSize: '1.125rem',
            mb: 2,
          }}
        >
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
            InputProps={{
              sx: {
                backgroundColor: darkMode ? '#202124' : '#ffffff',
                color: darkMode ? '#e8eaed' : '#202124',
                borderColor: darkMode ? '#3c4043' : '#dadce0',
              },
            }}
            InputLabelProps={{
              sx: {
                color: darkMode ? '#9aa0a6' : '#5f6368',
              },
            }}
          />
          <Button 
            onClick={handleAddTag} 
            variant="outlined"
            sx={{ 
              minWidth: 'auto', 
              px: 2,
              borderColor: darkMode ? '#3c4043' : '#dadce0',
              color: darkMode ? '#9aa0a6' : '#5f6368',
              '&:hover': {
                borderColor: darkMode ? '#5f6368' : '#5f6368',
                backgroundColor: darkMode ? '#3c4043' : '#f1f3f4',
              },
            }}
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
                backgroundColor: darkMode ? alpha('#4285f4', 0.15) : alpha('#4285f4', 0.1),
                color: darkMode ? '#8ab4f8' : '#4285f4',
                border: `1px solid ${darkMode ? alpha('#4285f4', 0.3) : alpha('#4285f4', 0.2)}`,
                borderRadius: '6px',
                '& .MuiChip-deleteIcon': {
                  color: darkMode ? '#8ab4f8' : '#4285f4',
                  '&:hover': {
                    color: darkMode ? '#5e97f6' : '#3367d6',
                  }
                }
              }}
            />
          ))}
          {formData.tags.length === 0 && mode === 'create' && (
            <Typography variant="body2" sx={{ 
              color: darkMode ? '#9aa0a6' : '#5f6368', 
              fontStyle: 'italic',
              fontSize: '0.875rem',
            }}>
              No tags added yet. Tags help organize your notes.
            </Typography>
          )}
        </Box>
      </Card>

      {/* Appearance */}
      <Card
        hover
        sx={{ 
          p: 3, 
          borderRadius: '16px',
          border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
          backgroundColor: darkMode ? '#303134' : '#ffffff',
        }}
      >
        <Typography 
          variant="h6" 
          gutterBottom 
          sx={{ 
            color: darkMode ? '#e8eaed' : '#202124',
            fontWeight: 500,
            fontSize: '1.125rem',
            mb: 2,
          }}
        >
          Appearance
        </Typography>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
          <FormControl fullWidth size="small">
            <InputLabel sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>Icon</InputLabel>
            <Select
              value={formData.icon}
              label="Icon"
              onChange={(e) => onChange('icon', e.target.value)}
              sx={{
                backgroundColor: darkMode ? '#202124' : '#ffffff',
                color: darkMode ? '#e8eaed' : '#202124',
                borderColor: darkMode ? '#3c4043' : '#dadce0',
                '& .MuiSelect-icon': {
                  color: darkMode ? '#9aa0a6' : '#5f6368',
                },
              }}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography sx={{ fontSize: '1.2rem' }}>{selected}</Typography>
                </Box>
              )}
            >
              {ICONS.map(icon => (
                <MenuItem 
                  key={icon} 
                  value={icon}
                  sx={{ 
                    backgroundColor: darkMode ? '#303134' : '#ffffff',
                    color: darkMode ? '#e8eaed' : '#202124',
                    '&:hover': {
                      backgroundColor: darkMode ? '#3c4043' : '#f1f3f4',
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography sx={{ fontSize: '1.2rem' }}>{icon}</Typography>
                    <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                      {icon}
                    </Typography>
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth size="small">
            <InputLabel sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>Color</InputLabel>
            <Select
              value={formData.color}
              label="Color"
              onChange={(e) => onChange('color', e.target.value)}
              sx={{
                backgroundColor: darkMode ? '#202124' : '#ffffff',
                color: darkMode ? '#e8eaed' : '#202124',
                borderColor: darkMode ? '#3c4043' : '#dadce0',
                '& .MuiSelect-icon': {
                  color: darkMode ? '#9aa0a6' : '#5f6368',
                },
              }}
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
                    <Typography variant="body2" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                      {selected}
                    </Typography>
                  </Box>
                );
              }}
            >
              {noteColors.map((color, index) => {
                const { color: textColor } = getColorWithContrast(color);
                return (
                  <MenuItem 
                    key={index} 
                    value={color}
                    sx={{ 
                      backgroundColor: darkMode ? '#303134' : '#ffffff',
                      '&:hover': {
                        backgroundColor: darkMode ? '#3c4043' : '#f1f3f4',
                      },
                    }}
                  >
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
                      <Typography variant="body2" sx={{ 
                        flex: 1,
                        color: darkMode ? '#e8eaed' : '#202124',
                      }}>
                        {color}
                      </Typography>
                    </Box>
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </Stack>
      </Card>

      {/* Privacy & Security */}
      <Card
        hover
        sx={{ 
          p: 3, 
          borderRadius: '16px',
          border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
          backgroundColor: darkMode ? '#303134' : '#ffffff',
        }}
      >
        <Typography 
          variant="h6" 
          gutterBottom 
          sx={{ 
            color: darkMode ? '#e8eaed' : '#202124',
            fontWeight: 500,
            fontSize: '1.125rem',
            mb: 2,
          }}
        >
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
          sx={{ 
            mb: 2,
            '& .MuiTypography-root': {
              color: darkMode ? '#e8eaed' : '#202124',
            },
          }}
        />

        <Stack spacing={2}>
          <Typography variant="subtitle1" sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1,
            color: darkMode ? '#9aa0a6' : '#5f6368',
            fontSize: '0.875rem',
          }}>
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
            InputProps={{
              sx: {
                backgroundColor: darkMode ? '#202124' : '#ffffff',
                color: darkMode ? '#e8eaed' : '#202124',
                borderColor: darkMode ? '#3c4043' : '#dadce0',
              },
            }}
            InputLabelProps={{
              sx: {
                color: darkMode ? '#9aa0a6' : '#5f6368',
              },
            }}
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
              sx={{
                '& .MuiTypography-root': {
                  color: darkMode ? '#e8eaed' : '#202124',
                },
              }}
            />
          )}
        </Stack>
      </Card>

      {/* Submit Button at Bottom */}
      <Card
        hover
        sx={{ 
          p: 3, 
          borderRadius: '16px',
          border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
          backgroundColor: darkMode ? '#303134' : '#ffffff',
        }}
      >
        <Stack direction="row" justifyContent="flex-end" spacing={2}>
          <Button
            onClick={() => window.history.back()}
            variant="outlined"
            size="medium"
            sx={{
              borderColor: darkMode ? '#3c4043' : '#dadce0',
              color: darkMode ? '#e8eaed' : '#202124',
              '&:hover': {
                borderColor: darkMode ? '#5f6368' : '#5f6368',
                backgroundColor: darkMode ? '#3c4043' : '#f1f3f4',
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={onSubmit}
            variant="contained"
            size="medium"
            disabled={loading}
            sx={{
              backgroundColor: '#34a853',
              '&:hover': { backgroundColor: '#2d9248' },
              '&.Mui-disabled': {
                backgroundColor: darkMode ? '#3c4043' : '#dadce0',
                color: darkMode ? '#9aa0a6' : '#5f6368',
              },
            }}
          >
            {loading 
              ? (mode === 'create' ? 'Creating...' : 'Saving...')
              : (mode === 'create' ? 'Create Note' : 'Save Changes')}
          </Button>
        </Stack>
      </Card>
    </Stack>
  );
}