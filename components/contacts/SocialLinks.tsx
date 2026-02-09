"use client";

import React from 'react';
import {
  Box,
  Card,
  CardContent,
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
    link: 'https://twitter.com/',
    color: '#1DA1F2',
  },
  { 
    icon: <LinkedIn />, 
    label: 'LinkedIn', 
    link: 'https://linkedin.com/',
    color: '#0077B5',
  },
  { 
    icon: <Facebook />, 
    label: 'Facebook', 
    link: 'https://facebook.com/',
    color: '#4267B2',
  },
  { 
    icon: <Instagram />, 
    label: 'Instagram', 
    link: 'https://instagram.com/',
    color: '#E4405F',
  },
];

export const SocialLinks: React.FC = () => {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';
  
  return (
    <Card
      sx={{
        borderRadius: 3,
        backgroundColor: darkMode ? '#303134' : '#ffffff',
        border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
      }}
    >
      <CardContent sx={{ p: 2.5 }}>
        <Typography variant="subtitle1" fontWeight={600} gutterBottom sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
          Connect With Us
        </Typography>
        <Typography variant="body2" sx={{ mb: 3, color: darkMode ? '#9aa0a6' : '#5f6368' }}>
          Follow us for updates, tips, and community discussions
        </Typography>
        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
          {socialLinks.map((social, index) => (
            <IconButton
              key={index}
              component="a"
              href={social.link}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                width: 48,
                height: 48,
                borderRadius: 2,
                border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                transition: 'all 0.3s',
                color: social.color,
                backgroundColor: darkMode ? alpha(social.color, 0.1) : alpha(social.color, 0.08),
                '&:hover': {
                  backgroundColor: darkMode ? alpha(social.color, 0.2) : alpha(social.color, 0.15),
                  transform: 'translateY(-2px)',
                  borderColor: alpha(social.color, 0.5),
                },
              }}
              aria-label={social.label}
            >
              {social.icon}
            </IconButton>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};