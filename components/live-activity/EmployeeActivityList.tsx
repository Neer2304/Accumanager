// components/live-activity/EmployeeActivityList.tsx
import {
  Card,
  CardContent,
  Typography,
  Box,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Chip,
  IconButton,
  Tooltip,
  LinearProgress,
  Switch,
  Button
} from '@mui/material';
import {
  Person,
  Wifi,
  Videocam,
  Coffee,
  TrendingUp,
  Computer,
  Phone,
  MeetingRoom,
  LocationOn,
  AccessTime
} from '@mui/icons-material';
import { LiveEmployee, ActivityStats } from './types';

interface EmployeeActivityListProps {
  employees: LiveEmployee[];
  autoRefresh: boolean;
  onAutoRefreshChange: (value: boolean) => void;
  stats: ActivityStats;
}

export const EmployeeActivityList = ({
  employees,
  autoRefresh,
  onAutoRefreshChange,
  stats
}: EmployeeActivityListProps) => {
  const getStatusColor = (status: LiveEmployee['status']) => {
    switch (status) {
      case 'online': return 'success';
      case 'offline': return 'default';
      case 'meeting': return 'primary';
      case 'break': return 'warning';
      case 'focus': return 'info';
      case 'away': return 'secondary';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: LiveEmployee['status']) => {
    switch (status) {
      case 'online': return <Wifi color="success" />;
      case 'meeting': return <Videocam color="primary" />;
      case 'break': return <Coffee color="warning" />;
      case 'focus': return <TrendingUp color="info" />;
      case 'away': return <Person color="secondary" />;
      default: return <Person color="disabled" />;
    }
  };

  const getDeviceIcon = (device: LiveEmployee['device']) => {
    switch (device) {
      case 'desktop': return <Computer />;
      case 'mobile': return <Phone />;
      case 'tablet': return <MeetingRoom />;
      default: return <Computer />;
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString();
  };

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Person />
            Team Activity ({stats.totalEmployees} employees)
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2">Auto Refresh</Typography>
            <Switch
              checked={autoRefresh}
              onChange={(e) => onAutoRefreshChange(e.target.checked)}
              size="small"
            />
          </Box>
        </Box>
        
        {employees.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              No employee activity data available
            </Typography>
            <Typography variant="caption" color="text.secondary">
              This feature requires active employee tracking devices or software
            </Typography>
          </Box>
        ) : (
          <List>
            {employees.map((employee) => (
              <ListItem key={employee._id} divider>
                <ListItemAvatar>
                  <Avatar src={employee.avatar} sx={{ bgcolor: 'primary.main' }}>
                    {employee.employeeName?.charAt(0)}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {employee.employeeName}
                      </Typography>
                      <Chip
                        icon={getStatusIcon(employee.status)}
                        label={employee.status}
                        size="small"
                        color={getStatusColor(employee.status) as any}
                        variant="outlined"
                      />
                      <Tooltip title={employee.device}>
                        <IconButton size="small">
                          {getDeviceIcon(employee.device)}
                        </IconButton>
                      </Tooltip>
                      <Chip
                        icon={<LocationOn />}
                        label={employee.location}
                        size="small"
                        variant="outlined"
                      />
                    </Box>
                  }
                  secondary={
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        {employee.currentActivity}
                      </Typography>
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="caption" color="text.secondary">
                          Productivity: {employee.productivity}%
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={employee.productivity}
                          color={
                            employee.productivity > 80 ? "success" :
                            employee.productivity > 60 ? "warning" : "error"
                          }
                          sx={{ mt: 0.5, height: 6 }}
                        />
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                        <AccessTime fontSize="small" sx={{ opacity: 0.6 }} />
                        <Typography variant="caption" color="text.secondary">
                          Last active: {formatTime(employee.lastActive)}
                        </Typography>
                      </Box>
                    </Box>
                  }
                />
              </ListItem>
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  );
};