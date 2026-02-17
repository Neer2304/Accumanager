// components/googleadminads/GoogleAdminAdsDialog.tsx
'use client'

import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
//   Select,
  MenuItem,
  Stack,
  Button,
  alpha,
} from '@mui/material'
import { CreateAdFormData } from './types'
import { Select } from '@headlessui/react'

interface GoogleAdminAdsDialogProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: CreateAdFormData) => void
  darkMode?: boolean
  editingCampaign?: any
}

export default function GoogleAdminAdsDialog({ 
  open, 
  onClose, 
  onSubmit,
  darkMode,
  editingCampaign 
}: GoogleAdminAdsDialogProps) {
  const [formData, setFormData] = useState<CreateAdFormData>({
    title: '',
    description: '',
    url: '',
    placement: 'banner',
    budget: '',
  })

  useEffect(() => {
    if (editingCampaign) {
      setFormData({
        title: editingCampaign.name,
        description: '',
        url: '',
        placement: editingCampaign.placement,
        budget: editingCampaign.revenue.toString(),
      })
    } else {
      setFormData({
        title: '',
        description: '',
        url: '',
        placement: 'banner',
        budget: '',
      })
    }
  }, [editingCampaign])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
    setFormData({
      title: '',
      description: '',
      url: '',
      placement: 'banner',
      budget: '',
    })
  }

  const handleChange = (field: keyof CreateAdFormData) => (
    e: React.ChangeEvent<HTMLInputElement | { value: unknown }>
  ) => {
    setFormData({ ...formData, [field]: e.target.value })
  }

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '24px',
          backgroundColor: darkMode ? '#303134' : '#ffffff',
          border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
          boxShadow: darkMode 
            ? '0 8px 32px rgba(0, 0, 0, 0.4)'
            : '0 8px 32px rgba(0, 0, 0, 0.1)',
        }
      }}
    >
      <DialogTitle sx={{ 
        borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
        color: darkMode ? '#e8eaed' : '#202124',
        fontWeight: 500,
        pb: 2,
        fontSize: { xs: '1.1rem', sm: '1.25rem' },
      }}>
        {editingCampaign ? 'Edit Advertisement' : 'Create New Advertisement'}
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ pt: 3 }}>
          <Stack spacing={2.5}>
            <TextField
              fullWidth
              label="Ad Title"
              value={formData.title}
              onChange={handleChange('title')}
              required
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  backgroundColor: darkMode ? '#202124' : '#f8f9fa',
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: darkMode ? '#5f6368' : '#bdc1c6',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#1a73e8',
                    borderWidth: 2,
                  },
                },
                '& .MuiInputLabel-root': {
                  color: darkMode ? '#9aa0a6' : '#5f6368',
                  '&.Mui-focused': {
                    color: '#1a73e8',
                  },
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
              onChange={handleChange('description')}
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  backgroundColor: darkMode ? '#202124' : '#f8f9fa',
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: darkMode ? '#5f6368' : '#bdc1c6',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#1a73e8',
                    borderWidth: 2,
                  },
                },
                '& .MuiInputLabel-root': {
                  color: darkMode ? '#9aa0a6' : '#5f6368',
                  '&.Mui-focused': {
                    color: '#1a73e8',
                  },
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
              onChange={handleChange('url')}
              required
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  backgroundColor: darkMode ? '#202124' : '#f8f9fa',
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: darkMode ? '#5f6368' : '#bdc1c6',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#1a73e8',
                    borderWidth: 2,
                  },
                },
                '& .MuiInputLabel-root': {
                  color: darkMode ? '#9aa0a6' : '#5f6368',
                  '&.Mui-focused': {
                    color: '#1a73e8',
                  },
                },
                '& .MuiInputBase-input': {
                  color: darkMode ? '#e8eaed' : '#202124',
                },
              }}
            />
            
            <Select
            //   fullWidth
              value={formData.placement}
              onChange={handleChange('placement')}
              required
            //   sx={{
            //     borderRadius: '12px',
            //     '& .MuiOutlinedInput-notchedOutline': {
            //       borderColor: darkMode ? '#3c4043' : '#dadce0',
            //     },
            //     '&:hover .MuiOutlinedInput-notchedOutline': {
            //       borderColor: darkMode ? '#5f6368' : '#bdc1c6',
            //     },
            //     '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            //       borderColor: '#1a73e8',
            //       borderWidth: 2,
            //     },
            //     '& .MuiSelect-select': {
            //       color: darkMode ? '#e8eaed' : '#202124',
            //     },
            //   }}
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
              onChange={handleChange('budget')}
              required
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  backgroundColor: darkMode ? '#202124' : '#f8f9fa',
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: darkMode ? '#5f6368' : '#bdc1c6',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#1a73e8',
                    borderWidth: 2,
                  },
                },
                '& .MuiInputLabel-root': {
                  color: darkMode ? '#9aa0a6' : '#5f6368',
                  '&.Mui-focused': {
                    color: '#1a73e8',
                  },
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
              py: 1,
              textTransform: 'none',
              fontWeight: 500,
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
              py: 1,
              fontWeight: 500,
              textTransform: 'none',
            }}
          >
            {editingCampaign ? 'Save Changes' : 'Create Campaign'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}