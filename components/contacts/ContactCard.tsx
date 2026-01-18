// components/contacts/ContactCard.tsx
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

interface ContactCardProps {
  icon: React.ReactNode;
  title: string;
  details: string;
  description: string;
  action: string;
  actionIcon: React.ReactNode;
  link: string;
  sx?: SxProps;
}

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
  
  return (
    <Card
      sx={{
        borderRadius: 3,
        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        height: '100%',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: `0 20px 40px ${alpha(theme.palette.primary.main, 0.15)}`,
          borderColor: alpha(theme.palette.primary.main, 0.3),
        },
        ...sx,
      }}
    >
      <CardContent sx={{ p: 3, height: '100%' }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2.5, mb: 3 }}>
          <Box
            sx={{
              p: 1.5,
              borderRadius: 2,
              bgcolor: alpha(theme.palette.primary.main, 0.08),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {React.cloneElement(icon as React.ReactElement, {
            //   sx: { fontSize: 28, color: theme.palette.primary.main },
            })}
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" fontWeight={700} gutterBottom>
              {title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {description}
            </Typography>
          </Box>
        </Box>
        <Typography
          variant="body1"
          fontWeight={600}
          gutterBottom
          sx={{
            color: theme.palette.text.primary,
            fontSize: '1.125rem',
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
          startIcon={actionIcon}
          sx={{
            mt: 1,
            borderRadius: 2,
            borderWidth: '1.5px',
            fontWeight: 600,
            '&:hover': {
              borderWidth: '1.5px',
            },
          }}
        >
          {action}
        </Button>
      </CardContent>
    </Card>
  );
};