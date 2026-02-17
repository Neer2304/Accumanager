// components/googleadminterms/GoogleTermsDialog.tsx
'use client'

import React, { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  TextField,
  Button,
  alpha,
} from '@mui/material'
import { TermsDialogProps, TermsFormData } from './types'

export default function GoogleTermsDialog({
  open,
  onClose,
  onSubmit,
  darkMode,
}: TermsDialogProps) {
  const [formData, setFormData] = useState<TermsFormData>({
    version: '',
    title: '',
    description: '',
    effectiveDate: new Date().toISOString().split('T')[0],
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
    setFormData({
      version: '',
      title: '',
      description: '',
      effectiveDate: new Date().toISOString().split('T')[0],
    })
  }

  const handleChange = (field: keyof TermsFormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [field]: e.target.value })
  }

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
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
        px: { xs: 2, sm: 3 },
      }}>
        Create New Terms & Conditions
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ pt: 3, px: { xs: 2, sm: 3 } }}>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' }, 
            gap: 2,
            mb: 2,
          }}>
            <Box sx={{ flex: 1 }}>
              <TextField
                fullWidth
                label="Version"
                value={formData.version}
                onChange={handleChange('version')}
                placeholder="e.g., 1.1.0"
                required
                variant="outlined"
                size="small"
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
            </Box>
            <Box sx={{ flex: 1 }}>
              <TextField
                fullWidth
                label="Effective Date"
                type="date"
                value={formData.effectiveDate}
                onChange={handleChange('effectiveDate')}
                InputLabelProps={{ shrink: true }}
                required
                variant="outlined"
                size="small"
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
            </Box>
          </Box>
          
          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth
              label="Title"
              value={formData.title}
              onChange={handleChange('title')}
              placeholder="e.g., Terms & Conditions 2024"
              required
              variant="outlined"
              size="small"
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
          </Box>
          
          <Box>
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={4}
              value={formData.description}
              onChange={handleChange('description')}
              placeholder="Brief description of what changed in this version..."
              variant="outlined"
              size="small"
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
          </Box>
        </DialogContent>
        <DialogActions sx={{ 
          px: { xs: 2, sm: 3 }, 
          pb: 3,
          borderTop: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
          pt: 2,
        }}>
          <Button 
            onClick={onClose}
            sx={{
              color: darkMode ? '#9aa0a6' : '#5f6368',
              '&:hover': {
                backgroundColor: darkMode ? alpha('#ffffff', 0.05) : alpha('#000000', 0.05),
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
                transform: 'translateY(-1px)',
                boxShadow: '0 4px 12px rgba(26, 115, 232, 0.2)',
              },
              borderRadius: '8px',
              px: 3,
              py: 1,
              fontWeight: 500,
              textTransform: 'none',
            }}
          >
            Create New Terms
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}