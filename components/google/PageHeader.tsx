// components/google/PageHeader.tsx
"use client";

import React from 'react';
import {
  Box,
  Typography,
  Breadcrumbs,
  Chip,
  useTheme,
  alpha,
  SxProps,
  Theme,
} from '@mui/material';
import { Home as HomeIcon } from '@mui/icons-material';
import Link from 'next/link';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs: BreadcrumbItem[];
  action?: React.ReactNode;
  chips?: Array<{
    label: string;
    color?: string;
    icon?: React.ReactNode;
  }>;
  sx?: SxProps<Theme>;
}

export function PageHeader({
  title,
  subtitle,
  breadcrumbs,
  action,
  chips,
  sx,
}: PageHeaderProps) {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 3, md: 4 },
        borderBottom: darkMode ? '1px solid #3c4043' : '1px solid #dadce0',
        background: darkMode
          ? 'linear-gradient(135deg, #0d3064 0%, #202124 100%)'
          : 'linear-gradient(135deg, #e3f2fd 0%, #ffffff 100%)',
        ...sx,
      }}
    >
      {/* Breadcrumbs */}
      <Breadcrumbs
        sx={{
          mb: { xs: 2, sm: 3 },
          fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.85rem' },
        }}
      >
        {breadcrumbs.map((item, index) => {
          if (item.href) {
            return (
              <Link
                key={index}
                href={item.href}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  textDecoration: 'none',
                  color: darkMode ? '#9aa0a6' : '#5f6368',
                }}
              >
                {index === 0 && <HomeIcon sx={{ mr: 0.5, fontSize: { xs: 14, sm: 16, md: 18 } }} />}
                <Typography
                  component="span"
                  sx={{
                    fontSize: 'inherit',
                    '&:hover': {
                      color: darkMode ? '#8ab4f8' : '#1a73e8',
                    },
                  }}
                >
                  {item.label}
                </Typography>
              </Link>
            );
          }
          return (
            <Typography
              key={index}
              sx={{
                color: darkMode ? '#e8eaed' : '#202124',
                fontSize: 'inherit',
              }}
            >
              {item.label}
            </Typography>
          );
        })}
      </Breadcrumbs>

      {/* Title Section */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Box sx={{ flex: 1 }}>
          <Typography
            variant="h4"
            fontWeight={500}
            gutterBottom
            sx={{
              color: darkMode ? '#e8eaed' : '#202124',
              fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
              letterSpacing: '-0.02em',
              lineHeight: 1.2,
            }}
          >
            {title}
          </Typography>
          {subtitle && (
            <Typography
              variant="body1"
              sx={{
                color: darkMode ? '#9aa0a6' : '#5f6368',
                fontSize: { xs: '0.85rem', sm: '1rem', md: '1.125rem' },
                lineHeight: 1.5,
                maxWidth: 600,
              }}
            >
              {subtitle}
            </Typography>
          )}
        </Box>
        {action && <Box>{action}</Box>}
      </Box>

      {/* Chips */}
      {chips && chips.length > 0 && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            gap: 2,
            flexWrap: 'wrap',
            mt: 3,
          }}
        >
          {chips.map((chip, index) => (
            <Chip
              key={index}
              label={chip.label}
            //   icon={chip.icon}
              variant="outlined"
              sx={{
                backgroundColor: chip.color
                  ? alpha(chip.color, 0.1)
                  : darkMode
                  ? alpha('#4285f4', 0.1)
                  : alpha('#4285f4', 0.08),
                borderColor: chip.color ? alpha(chip.color, 0.3) : alpha('#4285f4', 0.3),
                color: chip.color || (darkMode ? '#8ab4f8' : '#4285f4'),
              }}
            />
          ))}
        </Box>
      )}
    </Box>
  );
}