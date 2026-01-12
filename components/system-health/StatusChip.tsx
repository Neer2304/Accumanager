import React from 'react';
import { alpha, Chip, SxProps, Theme, useTheme } from '@mui/material';
import {
  CheckCircle,
  Warning,
  Error,
  Speed,
} from '@mui/icons-material';

export type StatusType = 'healthy' | 'degraded' | 'down' | 'maintenance';

interface StatusChipProps {
  status: StatusType;
  size?: 'small' | 'medium';
  sx?: SxProps<Theme>;
}

export const StatusChip: React.FC<StatusChipProps> = ({
  status,
  size = 'medium',
  sx = {},
}) => {
  const theme = useTheme();

  const getStatusConfig = (status: StatusType) => {
    switch (status) {
      case 'healthy':
        return {
          icon: <CheckCircle />,
          label: 'HEALTHY',
          color: 'success' as const,
          bgColor: alpha(theme.palette.success.main, 0.1),
          textColor: theme.palette.success.main,
        };
      case 'degraded':
        return {
          icon: <Warning />,
          label: 'DEGRADED',
          color: 'warning' as const,
          bgColor: alpha(theme.palette.warning.main, 0.1),
          textColor: theme.palette.warning.main,
        };
      case 'down':
        return {
          icon: <Error />,
          label: 'DOWN',
          color: 'error' as const,
          bgColor: alpha(theme.palette.error.main, 0.1),
          textColor: theme.palette.error.main,
        };
      case 'maintenance':
        return {
          icon: <Speed />,
          label: 'MAINTENANCE',
          color: 'info' as const,
          bgColor: alpha(theme.palette.info.main, 0.1),
          textColor: theme.palette.info.main,
        };
      default:
        return {
          icon: <Warning />,
          label: 'UNKNOWN',
          color: 'default' as const,
          bgColor: alpha(theme.palette.text.secondary, 0.1),
          textColor: theme.palette.text.secondary,
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <Chip
      icon={config.icon}
      label={config.label}
      size={size}
      sx={{
        bgcolor: config.bgColor,
        color: config.textColor,
        fontWeight: 600,
        borderRadius: 1.5,
        border: `1px solid ${config.bgColor.replace('0.1', '0.2')}`,
        ...sx,
      }}
    />
  );
};