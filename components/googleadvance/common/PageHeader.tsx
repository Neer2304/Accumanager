// components/googleadvance/common/PageHeader.tsx

'use client';

import React from 'react';
import {
  Box,
  Typography,
  Breadcrumbs,
  useMediaQuery,
  Link as MuiLink,
} from '@mui/material';
import { Home } from '@mui/icons-material';
import Link from 'next/link';
import { PageHeaderProps } from '../types';
import { googleColors } from './GoogleColors';
import { alpha } from '@mui/material';

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  icon,
  actions,
  breadcrumbs,
  currentColors,
  isMobile = false,
}) => {
  const primaryColor = googleColors.blue;

  return (
    <Box sx={{ mb: isMobile ? 2 : 4 }}>
      {/* Breadcrumbs */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <Breadcrumbs sx={{ 
          mb: 1, 
          color: currentColors.textSecondary,
          fontSize: isMobile ? '0.75rem' : '0.875rem'
        }}>
          <Box
            component={Link}
            href="/dashboard"
            sx={{
              display: "flex",
              alignItems: "center",
              textDecoration: "none",
              color: currentColors.textSecondary,
              fontSize: isMobile ? '0.75rem' : '0.875rem',
              "&:hover": { color: primaryColor },
            }}
          >
            <Home sx={{ mr: 0.5, fontSize: isMobile ? 16 : 20 }} />
            Dashboard
          </Box>
          {breadcrumbs.map((item, index) => (
            item.href ? (
              <Box
                key={index}
                component={Link}
                href={item.href}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  textDecoration: "none",
                  color: currentColors.textSecondary,
                  fontSize: isMobile ? '0.75rem' : '0.875rem',
                  "&:hover": { color: primaryColor },
                }}
              >
                {item.label}
              </Box>
            ) : (
              <Typography 
                key={index} 
                color={currentColors.textPrimary} 
                fontSize={isMobile ? '0.75rem' : '0.875rem'}
              >
                {item.label}
              </Typography>
            )
          ))}
        </Breadcrumbs>
      )}

      {/* Header Content */}
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        mb={2}
        flexDirection={isMobile ? "column" : "row"}
        gap={isMobile ? 2 : 0}
      >
        <Box display="flex" alignItems="center" gap={isMobile ? 1 : 2}>
          <Box
            sx={{
              width: isMobile ? 48 : 60,
              height: isMobile ? 48 : 60,
              borderRadius: isMobile ? 2 : 3,
              background: primaryColor,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: '0 2px 8px rgba(66,133,244,0.4)',
            }}
          >
            {React.cloneElement(icon as React.ReactElement, { 
            //   sx: { 
            //     fontSize: isMobile ? 24 : 32, 
            //     color: 'white' 
            //   } 
            })}
          </Box>
          <Box>
            <Typography 
              variant={isMobile ? "h5" : "h4"} 
              fontWeight="bold"
              fontSize={isMobile ? '1.25rem' : '1.5rem'}
            >
              {title}
            </Typography>
            {subtitle && (
              <Typography
                variant="body1"
                color={currentColors.textSecondary}
                fontSize={isMobile ? '0.875rem' : '1rem'}
              >
                {subtitle}
              </Typography>
            )}
          </Box>
        </Box>

        {actions && (
          <Box sx={{ 
            display: "flex", 
            gap: 1, 
            flexWrap: 'wrap',
            justifyContent: isMobile ? 'center' : 'flex-end'
          }}>
            {actions}
          </Box>
        )}
      </Box>
    </Box>
  );
};