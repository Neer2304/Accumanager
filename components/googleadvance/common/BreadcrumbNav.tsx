// components/googleadvance/common/BreadcrumbNav.tsx

'use client';

import React from 'react';
import {
  Breadcrumbs,
  Box,
  Typography,
  Link as MuiLink,
} from '@mui/material';
import { Home } from '@mui/icons-material';
import Link from 'next/link';
import { BaseComponentProps } from '../types';
import { googleColors } from './GoogleColors';

interface BreadcrumbNavProps extends BaseComponentProps {
  items: Array<{ label: string; href?: string }>;
  showHome?: boolean;
}

export const BreadcrumbNav: React.FC<BreadcrumbNavProps> = ({
  items,
  showHome = true,
  currentColors,
  isMobile = false,
}) => {
  const primaryColor = googleColors.blue;

  return (
    <Breadcrumbs sx={{ 
      mb: 1, 
      color: currentColors.textSecondary,
      fontSize: isMobile ? '0.75rem' : '0.875rem'
    }}>
      {showHome && (
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
      )}
      
      {items.map((item, index) => (
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
  );
};