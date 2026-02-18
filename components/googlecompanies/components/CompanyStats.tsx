// components/googlecompanies/components/CompanyStats.tsx
import React from 'react';
import { Box, Paper, Typography, alpha, useTheme } from '@mui/material';
import {
  Business as BusinessIcon,
  Storage as StorageIcon,
  People as PeopleIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';

const GOOGLE_COLORS = {
  blue: '#1a73e8',
  green: '#1e8e3e',
  yellow: '#f9ab00'
};

interface StatItem {
  label: string;
  value: string | number;
  icon: string;
}

interface CompanyStatsProps {
  stats: StatItem[];
  darkMode: boolean;
}

const getIcon = (iconName: string, color: string, darkMode: boolean) => {
  const icons: Record<string, React.ReactNode> = {
    business: <BusinessIcon sx={{ fontSize: 28 }} />,
    storage: <StorageIcon sx={{ fontSize: 28 }} />,
    people: <PeopleIcon sx={{ fontSize: 28 }} />,
    check: <CheckCircleIcon sx={{ fontSize: 28 }} />
  };
  
  return icons[iconName] || <BusinessIcon sx={{ fontSize: 28 }} />;
};

const getStatColor = (index: number): string => {
  const colors = [GOOGLE_COLORS.blue, GOOGLE_COLORS.green, GOOGLE_COLORS.yellow];
  return colors[index % colors.length];
};

export const CompanyStats: React.FC<CompanyStatsProps> = ({ stats, darkMode }) => {
  return (
    <Box sx={{ 
      display: 'flex',
      flexWrap: 'wrap',
      gap: 3,
      mb: 4
    }}>
      {stats.map((stat, index) => {
        const color = getStatColor(index);
        return (
          <Paper
            key={index}
            elevation={0}
            sx={{ 
              flex: '1 1 calc(33.333% - 24px)', 
              minWidth: { xs: '100%', sm: 'calc(50% - 18px)', md: 'calc(33.333% - 24px)' },
              p: 2.5, 
              borderRadius: '20px', 
              backgroundColor: darkMode ? '#303134' : '#ffffff',
              border: `1px solid ${alpha(color, 0.2)}`,
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: darkMode 
                  ? '0 8px 16px rgba(0,0,0,0.3)' 
                  : '0 8px 16px rgba(0,0,0,0.08)',
                borderColor: color
              }
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', fontWeight: 500, mb: 0.5 }}>
                  {stat.label}
                </Typography>
                <Typography variant="h4" sx={{ color: color, fontWeight: 600, lineHeight: 1.2 }}>
                  {stat.value}
                </Typography>
              </Box>
              <Box sx={{ 
                p: 1.5, 
                borderRadius: '14px', 
                backgroundColor: alpha(color, 0.1),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: color
              }}>
                {getIcon(stat.icon, color, darkMode)}
              </Box>
            </Box>
          </Paper>
        );
      })}
    </Box>
  );
};