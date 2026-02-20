// components/googleadsmanager/components/CreateAdDialog.tsx
import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  TextField,
  Select,
  MenuItem,
  Button,
  useTheme
} from '@mui/material';
import { AdFormData } from './types';

interface CreateAdDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (formData: AdFormData) => void;
}

export const CreateAdDialog: React.FC<CreateAdDialogProps> = ({ open, onClose, onSubmit }) => {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';
  
  const [formData, setFormData] = useState<AdFormData>({
    title: '',
    description: '',
    url: '',
    placement: 'banner',
    budget: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      title: '',
      description: '',
      url: '',
      placement: 'banner',
      budget: '',
    });
  };

  const handleChange = (field: keyof AdFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '16px',
          backgroundColor: darkMode ? '#303134' : '#ffffff',
          border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
        }
      }}
    >
      <DialogTitle sx={{ 
        borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
        color: darkMode ? '#e8eaed' : '#202124',
        fontWeight: 500,
        pb: 2,
      }}>
        Create New Advertisement
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ pt: 3 }}>
          <Stack spacing={2}>
            <TextField
              fullWidth
              label="Ad Title"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              required
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: darkMode ? '#202124' : '#f8f9fa',
                  borderColor: darkMode ? '#3c4043' : '#dadce0',
                  '&:hover': {
                    borderColor: darkMode ? '#5f6368' : '#bdc1c6',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: darkMode ? '#9aa0a6' : '#5f6368',
                },
                '& .MuiInputBase-input': {
                  color: darkMode ? '#e8eaed' : '#202124',
                },
              }}
            />
            
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={3}
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: darkMode ? '#202124' : '#f8f9fa',
                  borderColor: darkMode ? '#3c4043' : '#dadce0',
                  '&:hover': {
                    borderColor: darkMode ? '#5f6368' : '#bdc1c6',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: darkMode ? '#9aa0a6' : '#5f6368',
                },
                '& .MuiInputBase-input': {
                  color: darkMode ? '#e8eaed' : '#202124',
                },
              }}
            />
            
            <TextField
              fullWidth
              label="Target URL"
              value={formData.url}
              onChange={(e) => handleChange('url', e.target.value)}
              required
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: darkMode ? '#202124' : '#f8f9fa',
                  borderColor: darkMode ? '#3c4043' : '#dadce0',
                  '&:hover': {
                    borderColor: darkMode ? '#5f6368' : '#bdc1c6',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: darkMode ? '#9aa0a6' : '#5f6368',
                },
                '& .MuiInputBase-input': {
                  color: darkMode ? '#e8eaed' : '#202124',
                },
              }}
            />
            
            <Select
              fullWidth
              value={formData.placement}
              onChange={(e) => handleChange('placement', e.target.value as any)}
              displayEmpty
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: darkMode ? '#202124' : '#f8f9fa',
                  borderColor: darkMode ? '#3c4043' : '#dadce0',
                  '&:hover': {
                    borderColor: darkMode ? '#5f6368' : '#bdc1c6',
                  },
                },
                '& .MuiSelect-select': {
                  color: darkMode ? '#e8eaed' : '#202124',
                },
              }}
            >
              <MenuItem value="banner">Top Banner</MenuItem>
              <MenuItem value="sidebar">Sidebar</MenuItem>
              <MenuItem value="content">Inline Content</MenuItem>
              <MenuItem value="popup">Popup</MenuItem>
            </Select>
            
            <TextField
              fullWidth
              label="Budget (₹)"
              type="number"
              value={formData.budget}
              onChange={(e) => handleChange('budget', e.target.value)}
              required
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: darkMode ? '#202124' : '#f8f9fa',
                  borderColor: darkMode ? '#3c4043' : '#dadce0',
                  '&:hover': {
                    borderColor: darkMode ? '#5f6368' : '#bdc1c6',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: darkMode ? '#9aa0a6' : '#5f6368',
                },
                '& .MuiInputBase-input': {
                  color: darkMode ? '#e8eaed' : '#202124',
                },
              }}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ 
          px: 3, 
          pb: 3,
          borderTop: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
          pt: 2,
        }}>
          <Button 
            onClick={onClose}
            sx={{
              color: darkMode ? '#9aa0a6' : '#5f6368',
              '&:hover': {
                backgroundColor: darkMode ? 'rgba(154, 160, 166, 0.1)' : 'rgba(95, 99, 104, 0.1)',
              },
              borderRadius: '8px',
              px: 3,
            }}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="contained"
            sx={{
              backgroundColor: '#1a73e8',
              '&:hover': {
                backgroundColor: '#1669c1',
              },
              borderRadius: '8px',
              px: 3,
              fontWeight: 500,
            }}
          >
            Create Campaign
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};