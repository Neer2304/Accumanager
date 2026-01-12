import React from 'react';
import {
  ListItem,
  ListItemText,
  IconButton,
  Typography,
  Box,
  alpha,
} from '@mui/material';
import { CheckCircle, Warning, Error, Info } from '@mui/icons-material';

export type AlertSeverity = 'low' | 'medium' | 'high' | 'critical';

interface AlertItemProps {
  id: string;
  serviceName: string;
  message: string;
  severity: AlertSeverity;
  timestamp: string;
  resolved?: boolean;
  onResolve?: (id: string) => void;
}

export const AlertItem: React.FC<AlertItemProps> = ({
  id,
  serviceName,
  message,
  severity,
  timestamp,
  resolved = false,
  onResolve,
}) => {
  const getSeverityConfig = (severity: AlertSeverity) => {
    switch (severity) {
      case 'low':
        return { icon: <Info />, color: '#0ea5e9', bgColor: alpha('#0ea5e9', 0.05) };
      case 'medium':
        return { icon: <Warning />, color: '#f97316', bgColor: alpha('#f97316', 0.05) };
      case 'high':
        return { icon: <Error />, color: '#f43f5e', bgColor: alpha('#f43f5e', 0.05) };
      case 'critical':
        return { icon: <Error />, color: '#dc2626', bgColor: alpha('#dc2626', 0.05) };
      default:
        return { icon: <Warning />, color: '#64748b', bgColor: alpha('#64748b', 0.05) };
    }
  };

  const config = getSeverityConfig(severity);
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString();
  };

  if (resolved) return null;

  return (
    <ListItem
      sx={{
        borderLeft: 4,
        borderColor: config.color,
        mb: 1,
        borderRadius: 1,
        backgroundColor: config.bgColor,
        '&:hover': {
          backgroundColor: alpha(config.color, 0.08),
        },
      }}
    >
      <ListItemText
        primary={
          <Typography variant="body2" fontWeight="medium" color="text.primary">
            {message}
          </Typography>
        }
        secondary={
          <Box sx={{ mt: 0.5 }}>
            <Typography variant="caption" display="block" color="text.secondary">
              {serviceName}
            </Typography>
            <Typography variant="caption" color="text.disabled">
              {formatDate(timestamp)}
            </Typography>
          </Box>
        }
      />
      {onResolve && (
        <IconButton
          size="small"
          onClick={() => onResolve(id)}
          title="Mark as resolved"
          sx={{
            color: '#10b981',
            '&:hover': {
              bgcolor: alpha('#10b981', 0.1),
            },
          }}
        >
          <CheckCircle fontSize="small" />
        </IconButton>
      )}
    </ListItem>
  );
};