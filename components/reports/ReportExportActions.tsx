import React from 'react';
import { Button, Box, Typography } from '@mui/material';
import { Download, People, Payment, Inventory, Assessment } from '@mui/icons-material';

interface ReportExportActionsProps {
  onExport: (type: string) => void;
  showLabels?: boolean;
  fullWidth?: boolean;
}

const ReportExportActions: React.FC<ReportExportActionsProps> = ({
  onExport,
  showLabels = true,
  fullWidth = false,
}) => {
  const exportTypes = [
    {
      type: 'users',
      label: 'Export Users',
      icon: <People />,
      variant: 'outlined' as const,
    },
    {
      type: 'payments',
      label: 'Export Payments',
      icon: <Payment />,
      variant: 'outlined' as const,
    },
    {
      type: 'orders',
      label: 'Export Orders',
      icon: <Inventory />,
      variant: 'outlined' as const,
    },
    {
      type: 'full',
      label: 'Full Export',
      icon: <Assessment />,
      variant: 'contained' as const,
    },
  ];

  if (fullWidth) {
    return (
      <Box>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Quick Export
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          {exportTypes.map((item) => (
            <Button
              key={item.type}
              variant={item.variant}
              startIcon={item.icon}
              onClick={() => onExport(item.type)}
              sx={{ flex: '1 1 calc(25% - 16px)', minWidth: '200px' }}
            >
              {item.label}
            </Button>
          ))}
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', gap: 1 }}>
      {exportTypes.map((item) => (
        <Button
          key={item.type}
          variant={item.variant}
          startIcon={item.icon}
          onClick={() => onExport(item.type)}
          size="small"
        >
          {showLabels && item.label}
        </Button>
      ))}
    </Box>
  );
};

export default ReportExportActions;