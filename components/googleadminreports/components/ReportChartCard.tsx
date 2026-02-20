// components/googlereports/components/ReportChartCard.tsx
import React, { ReactNode } from 'react';
import {
  Card,
  CardContent,
  Box,
  Typography,
  CircularProgress,
  useTheme,
  alpha
} from '@mui/material';
import { ResponsiveContainer } from 'recharts';

interface ReportChartCardProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  chart: ReactNode;
  chartHeight?: number;
  loading?: boolean;
}

export const ReportChartCard: React.FC<ReportChartCardProps> = ({
  title,
  subtitle,
  icon,
  chart,
  chartHeight = 300,
  loading = false,
}) => {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';

  return (
    <Card 
      elevation={0}
      sx={{ 
        height: '100%',
        borderRadius: '16px',
        backgroundColor: darkMode ? '#303134' : '#ffffff',
        border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
        overflow: 'hidden'
      }}
    >
      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1.5, 
          mb: 3,
          pb: 1,
          borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
        }}>
          {icon && (
            <Box sx={{ 
              color: darkMode ? '#8ab4f8' : '#1a73e8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              {icon}
            </Box>
          )}
          <Box>
            <Typography 
              variant="subtitle1" 
              fontWeight={600} 
              sx={{ color: darkMode ? '#e8eaed' : '#202124' }}
            >
              {title}
            </Typography>
            {subtitle && (
              <Typography 
                variant="caption" 
                sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}
              >
                {subtitle}
              </Typography>
            )}
          </Box>
        </Box>
        
        {loading ? (
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: chartHeight 
          }}>
            <CircularProgress size={40} sx={{ color: darkMode ? '#8ab4f8' : '#1a73e8' }} />
          </Box>
        ) : (
          <Box sx={{ height: chartHeight }}>
            <ResponsiveContainer width="100%" height="100%">
              {chart}
            </ResponsiveContainer>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};