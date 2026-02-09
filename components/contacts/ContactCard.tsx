"use client";

import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  useTheme,
  alpha,
} from '@mui/material';
import { SxProps } from '@mui/system';
import {
  Phone,
  Email,
  WhatsApp,
  Message,
} from '@mui/icons-material';

interface ContactCardProps {
  icon: string;
  title: string;
  details: string;
  description: string;
  action: string;
  actionIcon: string;
  link: string;
  sx?: SxProps;
}

const iconMap: { [key: string]: React.ReactElement } = {
  Phone: <Phone />,
  Email: <Email />,
  WhatsApp: <WhatsApp />,
  Message: <Message />,
};

export const ContactCard: React.FC<ContactCardProps> = ({
  icon,
  title,
  details,
  description,
  action,
  actionIcon,
  link,
  sx,
}) => {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';
  
  return (
    <Card
      sx={{
        borderRadius: 3,
        backgroundColor: darkMode ? '#303134' : '#ffffff',
        border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        height: '100%',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: darkMode 
            ? '0 8px 24px rgba(0,0,0,0.3)'
            : '0 8px 24px rgba(0,0,0,0.1)',
          borderColor: darkMode ? '#4285f4' : '#4285f4',
        },
        ...sx,
      }}
    >
      <CardContent sx={{ p: 2.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2.5 }}>
          <Box
            sx={{
              p: 1.5,
              borderRadius: 2,
              backgroundColor: darkMode ? alpha('#4285f4', 0.2) : alpha('#4285f4', 0.1),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {React.cloneElement(iconMap[icon], {
              // sx: { fontSize: 20, color: '#4285f4' },
            })}
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
              {title}
            </Typography>
            <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
              {description}
            </Typography>
          </Box>
        </Box>
        <Typography
          variant="h6"
          fontWeight={600}
          gutterBottom
          sx={{
            color: darkMode ? '#e8eaed' : '#202124',
            fontSize: '1.25rem',
          }}
        >
          {details}
        </Typography>
        <Button
          component="a"
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          size="medium"
          variant="outlined"
          startIcon={iconMap[actionIcon]}
          sx={{
            mt: 1,
            borderRadius: 2,
            borderWidth: '1.5px',
            fontWeight: 600,
            borderColor: darkMode ? '#3c4043' : '#dadce0',
            color: darkMode ? '#e8eaed' : '#202124',
            '&:hover': {
              borderWidth: '1.5px',
              borderColor: '#4285f4',
              backgroundColor: darkMode ? alpha('#4285f4', 0.1) : alpha('#4285f4', 0.05),
            },
          }}
        >
          {action}
        </Button>
      </CardContent>
    </Card>
  );
};