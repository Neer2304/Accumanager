// components/googleapidocs/components/ApiStats.tsx
import React from 'react';
import {
  Box,
  Typography,
  alpha,
  useTheme
} from '@mui/material';
import { Card } from '@/components/ui/Card';
import { ApiStats as ApiStatsType } from './types';

interface ApiStatsProps {
  stats: ApiStatsType;
  darkMode: boolean;
}

export const ApiStats: React.FC<ApiStatsProps> = ({ stats, darkMode }) => {
  const statItems = [
    { 
      title: 'Total Endpoints', 
      value: stats.totalEndpoints, 
      icon: '🔌', 
      color: '#4285f4',
      description: 'Available API endpoints' 
    },
    { 
      title: 'Requires Auth', 
      value: stats.authRequired, 
      icon: '🔐', 
      color: '#34a853',
      description: 'Authentication needed' 
    },
    { 
      title: 'Categories', 
      value: stats.categories, 
      icon: '📂', 
      color: '#ea4335',
      description: 'API categories' 
    },
    { 
      title: 'Methods', 
      value: stats.methods, 
      icon: '🔄', 
      color: '#fbbc04',
      description: 'HTTP methods' 
    },
  ];

  return (
    <Box sx={{ 
      display: 'flex',
      flexWrap: 'wrap',
      gap: { xs: 1.5, sm: 2, md: 3 },
      mb: { xs: 2, sm: 3, md: 4 },
    }}>
      {statItems.map((stat, index) => (
        <Card 
          key={`stat-${index}`}
          hover
          sx={{ 
            flex: '1 1 calc(25% - 12px)', 
            minWidth: { xs: 'calc(50% - 12px)', sm: 'calc(25% - 12px)' },
            p: { xs: 1.5, sm: 2, md: 3 }, 
            borderRadius: '16px', 
            backgroundColor: darkMode ? '#303134' : '#ffffff',
            border: `1px solid ${alpha(stat.color, 0.2)}`,
            background: darkMode 
              ? `linear-gradient(135deg, ${alpha(stat.color, 0.1)} 0%, ${alpha(stat.color, 0.05)} 100%)`
              : `linear-gradient(135deg, ${alpha(stat.color, 0.08)} 0%, ${alpha(stat.color, 0.03)} 100%)`,
            transition: 'all 0.3s ease',
            '&:hover': { 
              transform: 'translateY(-2px)', 
              boxShadow: `0 8px 24px ${alpha(stat.color, 0.15)}`,
            },
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: darkMode ? '#9aa0a6' : '#5f6368', 
                    fontWeight: 400,
                    fontSize: { xs: '0.65rem', sm: '0.7rem', md: '0.75rem' },
                    display: 'block',
                  }}
                >
                  {stat.title}
                </Typography>
                <Typography 
                  variant="h4"
                  sx={{ 
                    color: stat.color, 
                    fontWeight: 600,
                    fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.5rem' },
                  }}
                >
                  {stat.value}
                </Typography>
              </Box>
              <Box sx={{ 
                p: { xs: 0.75, sm: 1 }, 
                borderRadius: '10px', 
                backgroundColor: alpha(stat.color, 0.1),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
              }}>
                {stat.icon}
              </Box>
            </Box>
            
            <Typography 
              variant="caption" 
              sx={{ 
                color: darkMode ? '#9aa0a6' : '#5f6368',
                fontSize: { xs: '0.6rem', sm: '0.65rem', md: '0.7rem' },
                display: 'block',
              }}
            >
              {stat.description}
            </Typography>
          </Box>
        </Card>
      ))}
    </Box>
  );
};