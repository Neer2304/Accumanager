// components/googleadmindashboard/components/DashboardCard.tsx
import React from 'react';
import {
  Card,
  CardContent,
  Box,
  Typography,
  Chip,
  alpha,
  useTheme
} from '@mui/material';
import {
  ChevronRight as ChevronRightIcon
} from '@mui/icons-material';
import { AdminCardItem } from './types';

interface DashboardCardProps extends AdminCardItem {
  onClick: (path: string) => void;
}

export const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  description,
  icon,
  path,
  color,
  stats,
  onClick
}) => {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';

  return (
    <Card
      onClick={() => onClick(path)}
      sx={{
        cursor: 'pointer',
        borderRadius: '16px',
        backgroundColor: darkMode ? '#303134' : '#ffffff',
        border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
        transition: 'all 0.2s ease',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: `0 8px 24px ${alpha(color, 0.15)}`,
          borderColor: color,
        }
      }}
    >
      <CardContent sx={{ p: 3, flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{
            width: 48,
            height: 48,
            borderRadius: '12px',
            backgroundColor: alpha(color, 0.1),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: color,
          }}>
            {icon}
          </Box>
          <ChevronRightIcon sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }} />
        </Box>

        <Typography variant="h6" fontWeight={600} sx={{ color: darkMode ? '#e8eaed' : '#202124', mb: 1 }}>
          {title}
        </Typography>

        <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', mb: 2, flex: 1 }}>
          {description}
        </Typography>

        {stats && (
          <Box sx={{ mt: 'auto' }}>
            <Chip
              label={stats}
              size="small"
              sx={{
                backgroundColor: alpha(color, 0.1),
                color: color,
                border: 'none',
                fontWeight: 500,
              }}
            />
          </Box>
        )}
      </CardContent>
    </Card>
  );
};