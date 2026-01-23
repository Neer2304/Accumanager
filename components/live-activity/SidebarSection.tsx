// components/live-activity/SidebarSection.tsx
import { Card, CardContent, Typography, Box, List, ListItem, ListItemIcon, ListItemText, LinearProgress } from '@mui/material';
import { AccessTime, Videocam, Coffee, TrendingUp, Person, LocationOn } from '@mui/icons-material';
import { RealTimeEvent, LiveEmployee } from './types';

interface SidebarSectionProps {
  recentEvents: RealTimeEvent[];
  employees: LiveEmployee[];
}

export const SidebarSection = ({ recentEvents, employees }: SidebarSectionProps) => {
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString();
  };

  const getEventIcon = (type: string) => {
    if (type.includes('meeting')) return <Videocam color="primary" />;
    if (type.includes('break')) return <Coffee color="warning" />;
    if (type.includes('login')) return <TrendingUp color="success" />;
    if (type.includes('logout')) return <Person color="disabled" />;
    if (type.includes('task')) return <TrendingUp color="info" />;
    return <AccessTime />;
  };

  return (
    <>
      {/* Recent Events */}
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AccessTime />
            Recent Events
          </Typography>
          <List sx={{ maxHeight: 400, overflow: 'auto' }}>
            {recentEvents.length === 0 ? (
              <ListItem>
                <ListItemText
                  primary="No recent events"
                  secondary="Activity events will appear here"
                />
              </ListItem>
            ) : (
              recentEvents.map((event) => (
                <ListItem key={event._id} divider>
                  <ListItemIcon>
                    {getEventIcon(event.type)}
                  </ListItemIcon>
                  <ListItemText
                    primary={event.description}
                    secondary={formatTime(event.createdAt)}
                  />
                </ListItem>
              ))
            )}
          </List>
        </CardContent>
      </Card>

      {/* Location Distribution */}
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LocationOn />
            Team Distribution
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {['office', 'remote', 'hybrid'].map((location) => {
              const count = employees.filter(emp => emp.location === location).length;
              const percentage = employees.length > 0 ? (count / employees.length) * 100 : 0;
              return (
                <Box key={location}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="body2" textTransform="capitalize">
                      {location}
                    </Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {count} ({percentage.toFixed(0)}%)
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={percentage}
                    color="primary"
                    sx={{ height: 6 }}
                  />
                </Box>
              );
            })}
          </Box>
        </CardContent>
      </Card>
    </>
  );
};