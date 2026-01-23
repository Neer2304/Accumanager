// components/live-projects/StatsOverview.tsx
import { Box, Card, CardContent, Typography, Tooltip } from '@mui/material';
import { Analytics, CheckCircle, Warning, Speed } from '@mui/icons-material';
import { LiveProject } from './types';

interface StatsOverviewProps {
  projects: LiveProject[];
}

export const StatsOverview = ({ projects }: StatsOverviewProps) => {
  const stats = {
    totalProjects: projects.length,
    completedTasks: projects.reduce((acc, proj) => acc + (proj.tasks?.completed || 0), 0),
    delayedProjects: projects.filter(p => p.status === 'delayed').length,
    averageProgress: projects.length > 0 
      ? Math.round(projects.reduce((acc, proj) => acc + proj.progress, 0) / projects.length) 
      : 0
  };

  const statItems = [
    {
      value: stats.totalProjects,
      label: 'Total Projects',
      color: 'primary.main',
      icon: <Analytics fontSize="small" />,
      tooltip: 'Active projects in your workspace'
    },
    {
      value: stats.completedTasks,
      label: 'Tasks Completed',
      color: 'success.main',
      icon: <CheckCircle fontSize="small" />,
      tooltip: 'Total tasks marked as completed'
    },
    {
      value: stats.delayedProjects,
      label: 'Delayed Projects',
      color: 'warning.main',
      icon: <Warning fontSize="small" />,
      tooltip: 'Projects behind schedule'
    },
    {
      value: `${stats.averageProgress}%`,
      label: 'Avg Progress',
      color: 'info.main',
      icon: <Speed fontSize="small" />,
      tooltip: 'Average completion percentage'
    }
  ];

  return (
    <Box sx={{ 
      display: 'grid',
      gridTemplateColumns: {
        xs: 'repeat(2, 1fr)',
        sm: 'repeat(2, 1fr)',
        md: 'repeat(4, 1fr)'
      },
      gap: 3,
      mb: 4
    }}>
      {statItems.map((stat, index) => (
        <Tooltip key={index} title={stat.tooltip}>
          <Card sx={{ 
            borderRadius: 2,
            transition: 'transform 0.2s, box-shadow 0.2s',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: 4
            }
          }}>
            <CardContent sx={{ 
              textAlign: 'center', 
              py: 3,
              position: 'relative'
            }}>
              <Box sx={{
                position: 'absolute',
                top: 12,
                left: 12,
                opacity: 0.1,
                color: stat.color
              }}>
                {stat.icon}
              </Box>
              <Typography variant="h4" fontWeight="bold" sx={{ color: stat.color, mb: 1 }}>
                {stat.value}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {stat.label}
              </Typography>
            </CardContent>
          </Card>
        </Tooltip>
      ))}
    </Box>
  );
};