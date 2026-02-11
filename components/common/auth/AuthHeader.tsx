'use client';

import React, { ReactNode } from 'react';
import { Box, Typography, Avatar, IconButton, Tooltip, useTheme, Stack } from '@mui/material';
import { ArrowBack, AdminPanelSettings } from '@mui/icons-material';
import Link from 'next/link';

interface AuthHeaderProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  showBackButton?: boolean;
  backHref?: string;
  onBackClick?: () => void;
}

const AuthHeader: React.FC<AuthHeaderProps> = ({
  title,
  subtitle,
  icon,
  showBackButton = false,
  backHref = '/',
  onBackClick,
}) => {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';

  return (
    <Box sx={{ position: 'relative', mb: 4 }}>
      {/* Back Button */}
      {showBackButton && (
        <Tooltip title="Go Back">
          <IconButton
            component={onBackClick ? 'button' : Link}
            href={!onBackClick ? backHref : undefined}
            onClick={onBackClick}
            sx={{
              position: 'absolute',
              left: 0,
              top: 0,
              color: darkMode ? '#9aa0a6' : '#5f6368',
              backgroundColor: darkMode ? 'rgba(60, 64, 67, 0.5)' : 'rgba(218, 220, 224, 0.5)',
              backdropFilter: 'blur(4px)',
              '&:hover': {
                backgroundColor: darkMode ? '#3c4043' : '#e8eaed',
                color: darkMode ? '#8ab4f8' : '#1a73e8',
              },
            }}
          >
            <ArrowBack />
          </IconButton>
        </Tooltip>
      )}

      <Stack direction="column" alignItems="center" spacing={2}>
        {/* Icon */}
        <Avatar
          sx={{
            width: 80,
            height: 80,
            backgroundColor: darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.1)',
            color: darkMode ? '#8ab4f8' : '#1a73e8',
            border: `2px solid ${darkMode ? '#8ab4f8' : '#1a73e8'}`,
            boxShadow: darkMode
              ? '0 0 0 4px rgba(138, 180, 248, 0.1)'
              : '0 0 0 4px rgba(26, 115, 232, 0.1)',
            transition: 'transform 0.3s ease',
            '&:hover': {
              transform: 'scale(1.05)',
            },
          }}
        >
          {icon || <AdminPanelSettings sx={{ fontSize: 44 }} />}
        </Avatar>

        {/* Title */}
        <Typography
          variant="h4"
          component="h1"
          fontWeight="bold"
          sx={{
            color: darkMode ? '#e8eaed' : '#202124',
            letterSpacing: '-0.5px',
            textAlign: 'center',
          }}
        >
          {title}
        </Typography>

        {/* Subtitle */}
        {subtitle && (
          <Typography
            variant="body1"
            sx={{
              color: darkMode ? '#9aa0a6' : '#5f6368',
              textAlign: 'center',
              maxWidth: '80%',
            }}
          >
            {subtitle}
          </Typography>
        )}
      </Stack>
    </Box>
  );
};

export default AuthHeader;