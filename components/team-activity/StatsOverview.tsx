// components/team-activity/StatsOverview.tsx
import React from 'react';
import {
  Box,
  Typography,
  Grid,
} from '@mui/material';
import {
  TrendingUp,
  Task,
  Computer,
  Person,
} from '@mui/icons-material';
import { Card } from '@/components/ui/Card';
import { TeamStats } from './types';

interface StatsOverviewProps {
  stats: TeamStats;
  darkMode: boolean;
}

const StatsOverview: React.FC<StatsOverviewProps> = ({ stats, darkMode }) => {
  const statItems = [
    {
      title: 'Team Performance',
      value: `${stats.avgPerformance}%`,
      icon: <TrendingUp />,
      color: '#4285f4',
      description: 'Average performance score',
    },
    {
      title: 'Tasks Completed',
      value: stats.totalTasks,
      icon: <Task />,
      color: '#34a853',
      description: 'Total tasks completed',
    },
    {
      title: 'Active Projects',
      value: stats.totalProjects,
      icon: <Computer />,
      color: '#8ab4f8',
      description: 'Current projects',
    },
    {
      title: 'Active Members',
      value: `${stats.activeMembers}/${stats.totalTeamMembers}`,
      icon: <Person />,
      color: '#fbbc04',
      description: 'Online team members',
    },
  ];

  return (
    <Grid container spacing={2}>
      {statItems.map((stat, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <Card
            hover
            sx={{
              height: '100%',
              p: 2,
              backgroundColor: darkMode ? '#202124' : '#ffffff',
              border: `1px solid ${stat.color}20`,
              background: darkMode 
                ? `linear-gradient(135deg, ${stat.color}10 0%, ${stat.color}05 100%)`
                : `linear-gradient(135deg, ${stat.color}08 0%, ${stat.color}03 100%)`,
              transition: 'all 0.3s ease',
              '&:hover': { 
                transform: 'translateY(-2px)', 
                boxShadow: `0 8px 24px ${stat.color}20`,
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
                      fontSize: '0.75rem',
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
                      fontSize: '1.5rem',
                    }}
                  >
                    {stat.value}
                  </Typography>
                </Box>
                <Box sx={{ 
                  p: 1, 
                  borderRadius: '10px', 
                  backgroundColor: `${stat.color}20`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  {React.cloneElement(stat.icon, { 
                    sx: { 
                      fontSize: 24, 
                      color: stat.color,
                    } 
                  })}
                </Box>
              </Box>
              
              <Typography 
                variant="caption" 
                sx={{ 
                  color: darkMode ? '#9aa0a6' : '#5f6368',
                  fontSize: '0.7rem',
                  display: 'block',
                }}
              >
                {stat.description}
              </Typography>
            </Box>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default StatsOverview;