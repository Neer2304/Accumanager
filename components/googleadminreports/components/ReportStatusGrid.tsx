// components/googlereports/components/ReportStatusGrid.tsx
import React from 'react';
import {
  Paper,
  Typography,
  Box,
  useTheme,
  alpha
} from '@mui/material';
import { StatusItem } from './types';

interface ReportStatusGridProps {
  title: string;
  items: StatusItem[];
  columns?: number;
}

export const ReportStatusGrid: React.FC<ReportStatusGridProps> = ({
  title,
  items,
  columns = 3,
}) => {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';

  return (
    <Box>
      <Typography 
        variant="subtitle1" 
        fontWeight={600} 
        gutterBottom
        sx={{ color: darkMode ? '#e8eaed' : '#202124' }}
      >
        {title}
      </Typography>
      <Box sx={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: 2 
      }}>
        {items.map((item, index) => (
          <Paper
            key={index}
            elevation={0}
            sx={{
              p: 2,
              borderRadius: '12px',
              background: `linear-gradient(135deg, ${alpha(item.color, 0.1)} 0%, ${alpha(item.color, 0.05)} 100%)`,
              border: `1px solid ${alpha(item.color, 0.2)}`,
              flex: `1 1 calc(${100 / columns}% - 16px)`,
              minWidth: '120px',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: `0 8px 16px ${alpha(item.color, 0.2)}`,
              },
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              {item.icon && (
                <Box sx={{ color: item.color, fontSize: 20 }}>
                  {item.icon}
                </Box>
              )}
              <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                {item.label}
              </Typography>
            </Box>
            <Typography 
              variant="h5" 
              fontWeight={600} 
              sx={{ color: item.color }}
            >
              {item.value.toLocaleString()}
            </Typography>
          </Paper>
        ))}
      </Box>
    </Box>
  );
};