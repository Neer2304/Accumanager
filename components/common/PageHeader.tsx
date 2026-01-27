import React from 'react';
import {
  Box,
  Typography,
  Button,
  Chip,
  Stack,
  Breadcrumbs,
  Link as MuiLink,
} from '@mui/material';
import {
  Home as HomeIcon,
  ArrowBack as BackIcon,
} from '@mui/icons-material';
import Link from 'next/link';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: Array<{ label: string; href?: string }>;
  actionButton?: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
    variant?: 'contained' | 'outlined' | 'text';
    gradient?: boolean;
  };
  chips?: Array<{
    label: string;
    color?: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
    variant?: 'filled' | 'outlined';
    icon?: React.ReactNode;
  }>;
  showBackButton?: boolean;
  onBack?: () => void;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  breadcrumbs = [],
  actionButton,
  chips = [],
  showBackButton = true,
  onBack,
}) => {
  const defaultBreadcrumbs = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: title, href: undefined },
  ];

  const displayBreadcrumbs = breadcrumbs.length > 0 ? breadcrumbs : defaultBreadcrumbs;

  return (
    <Box sx={{ mb: 4 }}>
      {/* Back Button */}
      {showBackButton && (
        <Button
          startIcon={<BackIcon />}
          onClick={onBack || (() => window.history.back())}
          sx={{ mb: 2 }}
          size="small"
        >
          Back to Dashboard
        </Button>
      )}

      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 2 }}>
        {displayBreadcrumbs.map((item, index) =>
          item.href ? (
            <MuiLink
              key={index}
              component={Link}
              href={item.href}
              sx={{
                display: 'flex',
                alignItems: 'center',
                textDecoration: 'none',
                color: 'text.secondary',
                '&:hover': { color: 'primary.main' },
              }}
            >
              {index === 0 && <HomeIcon sx={{ mr: 0.5, fontSize: 20 }} />}
              {item.label}
            </MuiLink>
          ) : (
            <Typography key={index} color="text.primary">
              {item.label}
            </Typography>
          )
        )}
      </Breadcrumbs>

      {/* Title and Actions */}
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: { xs: 'flex-start', sm: 'center' },
        flexDirection: { xs: 'column', sm: 'row' },
        gap: 2,
        mb: 3,
      }}>
        <Box>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body1" color="text.secondary">
              {subtitle}
            </Typography>
          )}
        </Box>

        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={1}
          alignItems={{ xs: 'stretch', sm: 'center' }}
          sx={{ width: { xs: '100%', sm: 'auto' } }}
        >
          {/* Chips */}
          {chips.map((chip, index) => (
            <Chip
              key={index}
              label={chip.label}
            //   icon={chip.icon}
              color={chip.color}
              variant={chip.variant}
              size="small"
              sx={{ alignSelf: { xs: 'flex-start', sm: 'center' } }}
            />
          ))}

          {/* Action Button */}
          {actionButton && (
            <Button
              variant={actionButton.variant || 'contained'}
              startIcon={actionButton.icon}
              onClick={actionButton.onClick}
              sx={{
                borderRadius: '8px',
                ...(actionButton.gradient && {
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                }),
              }}
              size="small"
            >
              {actionButton.label}
            </Button>
          )}
        </Stack>
      </Box>
    </Box>
  );
};