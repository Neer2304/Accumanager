// components/live-activity/StatsOverview.tsx
import { Box, Card, CardContent, Typography, Tooltip, useTheme, alpha } from '@mui/material';
import { Person, Videocam, Coffee, TrendingUp, Wifi, Speed, Groups, Timer } from '@mui/icons-material';
import { ActivityStats } from './types';

interface StatsOverviewProps {
  stats: ActivityStats;
}

export const StatsOverview = ({ stats }: StatsOverviewProps) => {
  const theme = useTheme();

  const statItems = [
    {
      value: stats.onlineCount,
      label: 'Active Now',
      color: theme.palette.success.main,
      icon: <Wifi />,
      subtext: `${Math.round((stats.onlineCount / stats.totalEmployees) * 100) || 0}% of team`,
      gradient: 'linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)',
      description: 'Employees currently active and working'
    },
    {
      value: stats.inMeetingCount,
      label: 'In Meetings',
      color: theme.palette.primary.main,
      icon: <Videocam />,
      subtext: `${stats.inMeetingCount > 0 ? 'Active meetings' : 'No meetings'}`,
      gradient: 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)',
      description: 'Employees currently in meetings or calls'
    },
    {
      value: stats.onBreakCount,
      label: 'On Break',
      color: theme.palette.warning.main,
      icon: <Coffee />,
      subtext: `${stats.onBreakCount > 0 ? 'Taking breaks' : 'All working'}`,
      gradient: 'linear-gradient(135deg, #FF9800 0%, #F57C00 100%)',
      description: 'Employees currently on break'
    },
    {
      value: `${stats.avgProductivity}%`,
      label: 'Avg Productivity',
      color: theme.palette.info.main,
      icon: <TrendingUp />,
      subtext: stats.avgProductivity > 80 ? 'Excellent' : stats.avgProductivity > 60 ? 'Good' : 'Needs attention',
      gradient: 'linear-gradient(135deg, #00BCD4 0%, #0097A7 100%)',
      description: 'Average team productivity score'
    }
  ];

  return (
    <Box sx={{ 
      display: 'grid',
      gridTemplateColumns: {
        xs: 'repeat(2, 1fr)',
        md: 'repeat(4, 1fr)'
      },
      gap: 3,
      mb: 4
    }}>
      {statItems.map((item, index) => (
        <Tooltip key={index} title={item.description} arrow>
          <Card sx={{ 
            borderRadius: 3,
            overflow: 'hidden',
            position: 'relative',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: `0 12px 24px ${alpha(item.color, 0.2)}`
            }
          }}>
            {/* Background gradient */}
            <Box sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '100%',
              opacity: 0.08,
              background: item.gradient
            }} />
            
            {/* Top accent bar */}
            <Box sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 4,
              background: item.gradient
            }} />
            
            <CardContent sx={{ 
              position: 'relative',
              p: 3,
              '&:last-child': { pb: 3 }
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: item.gradient,
                  color: 'white',
                  mr: 2,
                  boxShadow: `0 4px 12px ${alpha(item.color, 0.3)}`
                }}>
                  {item.icon}
                </Box>
                <Box>
                  <Typography variant="h3" fontWeight="bold" sx={{ color: item.color }}>
                    {item.value}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.label}
                  </Typography>
                </Box>
              </Box>
              
              {/* Progress bar for productivity */}
              {item.label === 'Avg Productivity' && (
                <Box sx={{ mt: 2 }}>
                  <Box sx={{ 
                    position: 'relative', 
                    height: 6, 
                    borderRadius: 3,
                    bgcolor: alpha(item.color, 0.1),
                    overflow: 'hidden'
                  }}>
                    <Box sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      height: '100%',
                      width: `${stats.avgProductivity}%`,
                      background: item.gradient,
                      borderRadius: 3,
                      transition: 'width 0.8s ease'
                    }} />
                  </Box>
                </Box>
              )}
              
              <Typography variant="caption" sx={{ 
                mt: 1.5, 
                display: 'block',
                color: alpha(theme.palette.text.secondary, 0.8)
              }}>
                {item.subtext}
              </Typography>
            </CardContent>
          </Card>
        </Tooltip>
      ))}
      
      {/* Team Total Card (Extra) */}
      <Card sx={{ 
        borderRadius: 3,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        gridColumn: { xs: 'span 2', md: 'span 1' }
      }}>
        <CardContent sx={{ p: 3, textAlign: 'center' }}>
          <Box sx={{ 
            width: 56, 
            height: 56, 
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: alpha('#fff', 0.2),
            margin: '0 auto 16px'
          }}>
            <Groups sx={{ fontSize: 28 }} />
          </Box>
          <Typography variant="h3" fontWeight="bold" sx={{ mb: 0.5 }}>
            {stats.totalEmployees}
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            Total Team Size
          </Typography>
          <Typography variant="caption" sx={{ opacity: 0.7, display: 'block', mt: 1 }}>
            <Timer sx={{ fontSize: 12, verticalAlign: 'middle', mr: 0.5 }} />
            Real-time monitoring
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};