// components/google/StatsCard.tsx
"use client";

import React from 'react';
import {
  Box,
  Typography,
  useTheme,
  alpha,
  SxProps,
  Theme,
} from '@mui/material';
import { Card } from '@/components/ui/Card';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color?: string;
  description?: string;
  progress?: {
    value: number;
    total: number;
    percentage: number;
  };
  onClick?: () => void;
  sx?: SxProps<Theme>;
}

export function StatsCard({
  title,
  value,
  icon,
  color = '#4285f4',
  description,
  progress,
  onClick,
  sx,
}: StatsCardProps) {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';
  const isMobile = theme.breakpoints.down('sm');

  return (
    <Card
      hover
      onClick={onClick}
      sx={{
        flex: '1 1 calc(33.333% - 16px)',
        minWidth: { xs: 'calc(50% - 12px)', sm: 'calc(33.333% - 16px)' },
        p: { xs: 1.5, sm: 2, md: 3 },
        borderRadius: '16px',
        backgroundColor: darkMode ? '#303134' : '#ffffff',
        border: `1px solid ${alpha(color, 0.2)}`,
        background: darkMode
          ? `linear-gradient(135deg, ${alpha(color, 0.1)} 0%, ${alpha(color, 0.05)} 100%)`
          : `linear-gradient(135deg, ${alpha(color, 0.08)} 0%, ${alpha(color, 0.03)} 100%)`,
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: `0 8px 24px ${alpha(color, 0.15)}`,
          cursor: onClick ? 'pointer' : 'default',
        },
        ...sx,
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography
              variant="caption"
              sx={{
                color: darkMode ? '#9aa0a6' : '#5f6368',
                fontWeight: 400,
                fontSize: { xs: '0.65rem', sm: '0.7rem', md: '0.75rem' },
                display: 'block',
              }}
            >
              {title}
            </Typography>
            <Typography
              variant={isMobile ? "h5" : "h4"}
              sx={{
                color: color,
                fontWeight: 600,
                fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.5rem' },
              }}
            >
              {value}
            </Typography>
          </Box>
          <Box
            sx={{
              p: { xs: 0.75, sm: 1 },
              borderRadius: '10px',
              backgroundColor: alpha(color, 0.1),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {React.cloneElement(icon as React.ReactElement, {
              sx: {
                fontSize: { xs: 20, sm: 24, md: 28 },
                color: color,
              },
            })}
          </Box>
        </Box>

        {description && (
          <Typography
            variant="caption"
            sx={{
              color: darkMode ? '#9aa0a6' : '#5f6368',
              fontSize: { xs: '0.6rem', sm: '0.65rem', md: '0.7rem' },
              display: 'block',
            }}
          >
            {description}
          </Typography>
        )}

        {progress && (
          <Box sx={{ mt: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography
                variant="caption"
                sx={{
                  color: darkMode ? '#9aa0a6' : '#5f6368',
                  fontSize: { xs: '0.6rem', sm: '0.65rem', md: '0.7rem' },
                }}
              >
                Usage Progress
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: color,
                  fontWeight: 500,
                  fontSize: { xs: '0.6rem', sm: '0.65rem', md: '0.7rem' },
                }}
              >
                {progress.value}/{progress.total}
              </Typography>
            </Box>
            <Box
              sx={{
                position: 'relative',
                height: 6,
                backgroundColor: darkMode ? '#3c4043' : '#e0e0e0',
                borderRadius: 3,
                overflow: 'hidden',
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  height: '100%',
                  width: `${progress.percentage}%`,
                  backgroundColor: color,
                  borderRadius: 3,
                }}
              />
            </Box>
          </Box>
        )}
      </Box>
    </Card>
  );
}