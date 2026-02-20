// components/googlereports/components/ReportExportActions.tsx
import React from 'react';
import {
  Button,
  Box,
  Typography,
  useTheme,
  alpha
} from '@mui/material';
import {
  Download,
  People,
  Payment,
  Assessment
} from '@mui/icons-material';

interface ReportExportActionsProps {
  onExport: (type: string) => void;
  disabled?: boolean;
}

export const ReportExportActions: React.FC<ReportExportActionsProps> = ({
  onExport,
  disabled = false
}) => {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';

  const exportTypes = [
    {
      type: 'users',
      label: 'Export Users',
      icon: <People />,
      color: darkMode ? '#8ab4f8' : '#1a73e8',
    },
    {
      type: 'payments',
      label: 'Export Payments',
      icon: <Payment />,
      color: '#34a853',
    },
    {
      type: 'full',
      label: 'Full Export',
      icon: <Assessment />,
      color: '#fbbc04',
      variant: 'contained' as const,
    },
  ];

  return (
    <Box>
      <Typography 
        variant="subtitle1" 
        fontWeight={600} 
        gutterBottom
        sx={{ color: darkMode ? '#e8eaed' : '#202124' }}
      >
        Quick Export
      </Typography>
      <Box sx={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: 2 
      }}>
        {exportTypes.map((item) => (
          <Button
            key={item.type}
            variant={item.variant || 'outlined'}
            startIcon={item.icon}
            onClick={() => onExport(item.type)}
            disabled={disabled}
            sx={{
              flex: '1 1 200px',
              borderRadius: '8px',
              backgroundColor: item.variant === 'contained' ? item.color : 'transparent',
              borderColor: alpha(item.color, 0.5),
              color: item.variant === 'contained' ? '#ffffff' : item.color,
              '&:hover': {
                backgroundColor: item.variant === 'contained' 
                  ? item.color 
                  : alpha(item.color, 0.1),
                borderColor: item.color,
              },
            }}
          >
            {item.label}
          </Button>
        ))}
      </Box>
    </Box>
  );
};