// components/attendance/DepartmentChip.tsx
import React from 'react';
import { Chip, alpha, useTheme } from '@mui/material';

interface DepartmentChipProps {
  department: string;
}

export const DepartmentChip: React.FC<DepartmentChipProps> = ({ department }) => {
  const theme = useTheme();
  
  const getDepartmentColor = (dept: string) => {
    const colors: Record<string, { bg: string, text: string }> = {
      Sales: { bg: theme.palette.info.main, text: theme.palette.info.contrastText },
      Marketing: { bg: theme.palette.secondary.main, text: theme.palette.secondary.contrastText },
      Development: { bg: '#3b82f6', text: '#ffffff' },
      Design: { bg: '#8b5cf6', text: '#ffffff' },
      HR: { bg: '#ec4899', text: '#ffffff' },
      Finance: { bg: theme.palette.success.main, text: theme.palette.success.contrastText },
      Operations: { bg: '#f97316', text: '#ffffff' },
      Support: { bg: '#0ea5e9', text: '#ffffff' },
      Management: { bg: '#1e293b', text: '#ffffff' },
      Other: { bg: theme.palette.grey[600], text: theme.palette.grey[100] },
    };
    
    return colors[dept] || { bg: theme.palette.grey[500], text: theme.palette.grey[100] };
  };

  const color = getDepartmentColor(department);

  return (
    <Chip
      label={department}
      size="small"
      sx={{
        bgcolor: alpha(color.bg, 0.15),
        color: color.bg,
        fontWeight: 600,
        borderRadius: 1.5,
        border: `1px solid ${alpha(color.bg, 0.3)}`,
        '&:hover': {
          bgcolor: alpha(color.bg, 0.25),
        }
      }}
    />
  );
};