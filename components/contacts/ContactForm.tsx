// components/contacts/ContactForm.tsx
"use client";

import React from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Alert,
  CircularProgress,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Send,
  Person,
  Email,
  Phone,
  Business,
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
  
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    onChange(e.target.name, e.target.value);
  };

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 4,
        overflow: 'hidden',
        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.08)',
      }}
    >
      <Box
        sx={{
          p: { xs: 3, md: 4 },
          background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
          color: 'white',
        }}
      >
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Send us a Message
        </Typography>
        <Typography variant="body1" sx={{ opacity: 0.9 }}>
          Fill out the form below and we&apos;ll get back to you within 24 hours.
        </Typography>
      </Box>
      
      <Box sx={{ p: { xs: 3, md: 4 } }}>
        {error && (
          <Alert
            severity="error"
            sx={{
              mb: 3,
              borderRadius: 2,
              border: `1px solid ${theme.palette.error.light}`,
            }}
          >
            {error}
          </Alert>
        )}
        
        <form onSubmit={onSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
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
                    '&:hover fieldset': {
                      borderColor: theme.palette.primary.main,
                    },
                  },
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
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
                    <Email sx={{ mr: 1, color: 'action.active', opacity: 0.7 }} />
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone Number"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <Phone sx={{ mr: 1, color: 'action.active', opacity: 0.7 }} />
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
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
                  },
                }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Subject"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                variant="outlined"
                placeholder="What's this regarding?"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                }}
              />
            </Grid>
            
            <Grid item xs={12}>
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
                  },
                  '& .MuiInputBase-multiline': {
                    padding: '16.5px 14px',
                  },
                }}
              />
            </Grid>
            
            <Grid item xs={12}>
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
                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: `0 8px 25px ${alpha(theme.palette.primary.main, 0.3)}`,
                  },
                  '&:disabled': {
                    background: theme.palette.action.disabled,
                  },
                }}
              >
                {loading ? 'Sending...' : 'Send Message'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Paper>
  );
};