// components/contacts/SocialLinks.tsx
"use client";

import React from 'react';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  useTheme,
  alpha,
} from '@mui/material';
import {
  LinkedIn,
  Twitter,
  Facebook,
  Instagram,
} from '@mui/icons-material';

const socialLinks = [
  { 
    icon: <Twitter />, 
    label: 'Twitter', 
    link: 'https://twitter.com/accumanage',
    color: '#1DA1F2',
  },
  { 
    icon: <LinkedIn />, 
    label: 'LinkedIn', 
    link: 'https://linkedin.com/company/accumanage',
    color: '#0077B5',
  },
  { 
    icon: <Facebook />, 
    label: 'Facebook', 
    link: 'https://facebook.com/accumanage',
    color: '#4267B2',
  },
  { 
    icon: <Instagram />, 
    label: 'Instagram', 
    link: 'https://instagram.com/accumanage',
    color: '#E4405F',
  },
];

export const SocialLinks: React.FC = () => {
  const theme = useTheme();
  
  return (
    <Paper
      sx={{
        p: 3,
        borderRadius: 3,
        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
      }}
    >
      <Typography variant="h6" fontWeight={700} gutterBottom>
        Connect With Us
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Follow us for updates, tips, and community discussions
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        {socialLinks.map((social, index) => (
          <IconButton
            key={index}
            component="a"
            href={social.link}
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              width: 56,
              height: 56,
              borderRadius: 2,
              border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
              transition: 'all 0.3s',
              color: social.color,
              bgcolor: alpha(social.color, 0.08),
              '&:hover': {
                bgcolor: alpha(social.color, 0.15),
                transform: 'translateY(-4px)',
                borderColor: alpha(social.color, 0.3),
              },
            }}
            aria-label={social.label}
          >
            {social.icon}
          </IconButton>
        ))}
      </Box>
    </Paper>
  );
};