"use client";

import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  CircularProgress,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Send,
  Person,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Business,
  Subject as SubjectIcon,
} from '@mui/icons-material';

interface ContactFormProps {
  formData: {
    name: string;
    email: string;
    phone: string;
    company: string;
    subject: string;
    message: string;
  };
  onChange: (field: string, value: string) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  loading: boolean;
  error: string;
}

export const ContactForm: React.FC<ContactFormProps> = ({
  formData,
  onChange,
  onSubmit,
  loading,
  error,
}) => {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';
  
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    onChange(e.target.name, e.target.value);
  };

  return (
    <Card
      sx={{
        borderRadius: 3,
        backgroundColor: darkMode ? '#303134' : '#ffffff',
        border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          p: { xs: 2, sm: 3 },
          background: darkMode 
            ? `linear-gradient(135deg, ${alpha('#4285f4', 0.8)} 0%, ${alpha('#0d3064', 0.9)} 100%)`
            : `linear-gradient(135deg, ${alpha('#4285f4', 0.9)} 0%, ${alpha('#0d3064', 0.9)} 100%)`,
          color: '#ffffff',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Box sx={{
            width: 48,
            height: 48,
            borderRadius: 2,
            backgroundColor: alpha('#ffffff', 0.2),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(10px)',
          }}>
            <Send sx={{ fontSize: 24, color: '#ffffff' }} />
          </Box>
          <Box>
            <Typography variant="h5" fontWeight={600} gutterBottom>
              Send us a Message
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Fill out the form below and we&apos;ll get back to you within 24 hours.
            </Typography>
          </Box>
        </Box>
      </Box>
      
      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
        <form onSubmit={onSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
              <TextField
                fullWidth
                label="Your Name *"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <Person sx={{ mr: 1, color: 'action.active', opacity: 0.7 }} />
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    backgroundColor: darkMode ? '#202124' : '#ffffff',
                    '&:hover fieldset': {
                      borderColor: '#4285f4',
                    },
                  },
                }}
              />
              
              <TextField
                fullWidth
                label="Your Email *"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <EmailIcon sx={{ mr: 1, color: 'action.active', opacity: 0.7 }} />
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    backgroundColor: darkMode ? '#202124' : '#ffffff',
                  },
                }}
              />
            </Box>
            
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
              <TextField
                fullWidth
                label="Phone Number"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <PhoneIcon sx={{ mr: 1, color: 'action.active', opacity: 0.7 }} />
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    backgroundColor: darkMode ? '#202124' : '#ffffff',
                  },
                }}
              />
              
              <TextField
                fullWidth
                label="Company"
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <Business sx={{ mr: 1, color: 'action.active', opacity: 0.7 }} />
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    backgroundColor: darkMode ? '#202124' : '#ffffff',
                  },
                }}
              />
            </Box>
            
            <TextField
              fullWidth
              label="Subject"
              name="subject"
              value={formData.subject}
              onChange={handleInputChange}
              variant="outlined"
              placeholder="What's this regarding?"
              InputProps={{
                startAdornment: (
                  <SubjectIcon sx={{ mr: 1, color: 'action.active', opacity: 0.7 }} />
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  backgroundColor: darkMode ? '#202124' : '#ffffff',
                },
              }}
            />
            
            <TextField
              fullWidth
              label="Your Message *"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              required
              multiline
              rows={5}
              variant="outlined"
              placeholder="Tell us how we can help..."
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  backgroundColor: darkMode ? '#202124' : '#ffffff',
                },
                '& .MuiInputBase-multiline': {
                  padding: '16.5px 14px',
                },
              }}
            />
            
            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : <Send />}
              sx={{
                py: 1.75,
                borderRadius: 2,
                fontSize: '1rem',
                fontWeight: 600,
                textTransform: 'none',
                backgroundColor: '#4285f4',
                '&:hover': {
                  backgroundColor: '#3367d6',
                  transform: 'translateY(-1px)',
                  boxShadow: `0 4px 12px ${alpha('#4285f4', 0.3)}`,
                },
                '&:disabled': {
                  backgroundColor: darkMode ? '#5f6368' : '#dadce0',
                },
              }}
            >
              {loading ? 'Sending...' : 'Send Message'}
            </Button>
          </Box>
        </form>
      </CardContent>
    </Card>
  );
};