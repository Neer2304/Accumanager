"use client";

import React from 'react';
import {
  Card,
  CardContent,
  Box,
  Typography,
  Avatar,
  Chip,
  Button,
  LinearProgress,
  useTheme,
  alpha,
  Badge,
  Tooltip,
} from '@mui/material';
import {
  Person,
  Work,
  Phone,
  Email,
  CalendarToday,
  TrendingUp,
  Visibility,
  CheckCircle,
  AccessTime,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';

interface EmployeeCardProps {
  employee: {
    _id: string;
    name: string;
    phone: string;
    email?: string;
    role: string;
    department?: string;
    salary?: number;
    salaryType?: string;
    joiningDate?: string;
    isActive?: boolean;
    leaveBalance?: number;
    stats?: {
      totalTasks: number;
      completedTasks: number;
      inProgressTasks: number;
      pendingTasks: number;
      overdueTasks: number;
    };
  };
  showTasks?: boolean;
  onClick?: () => void;
}

export const EmployeeCard: React.FC<EmployeeCardProps> = ({ 
  employee, 
  showTasks = false,
  onClick 
}) => {
  const theme = useTheme();
  const router = useRouter();

  const getAvatarColor = (name: string) => {
    const colors = [
      theme.palette.primary.main,
      theme.palette.secondary.main,
      '#3b82f6',
      '#8b5cf6',
      '#ec4899',
      '#10b981',
      '#f59e0b',
      '#ef4444',
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const handleViewDetails = () => {
    if (onClick) {
      onClick();
    } else {
      router.push(`/attendance/${employee._id}`);
    }
  };

  const calculatePerformance = () => {
    if (!employee.stats || employee.stats.totalTasks === 0) return 0;
    return Math.round((employee.stats.completedTasks / employee.stats.totalTasks) * 100);
  };

  const performance = calculatePerformance();

  return (
    <Card 
      sx={{
        height: '100%',
        borderRadius: 3,
        transition: 'all 0.3s',
        border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[4],
          borderColor: theme.palette.primary.main,
        },
      }}
    >
      <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Badge
              overlap="circular"
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              badgeContent={
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    bgcolor: employee.isActive ? theme.palette.success.main : theme.palette.error.main,
                    border: `2px solid ${theme.palette.background.paper}`,
                  }}
                />
              }
            >
              <Avatar
                sx={{
                  width: 56,
                  height: 56,
                  bgcolor: getAvatarColor(employee.name),
                  color: 'white',
                  fontSize: 20,
                  fontWeight: 'bold',
                }}
              >
                {employee.name.split(' ').map(n => n[0]).join('').toUpperCase()}
              </Avatar>
            </Badge>
            
            <Box>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                {employee.name}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip
                  label={employee.role}
                  size="small"
                  sx={{
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    color: theme.palette.primary.main,
                  }}
                />
                {employee.department && (
                  <Chip
                    label={employee.department}
                    size="small"
                    variant="outlined"
                  />
                )}
              </Box>
            </Box>
          </Box>
          
          {showTasks && employee.stats && (
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" fontWeight="bold" color="primary">
                {performance}%
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Performance
              </Typography>
            </Box>
          )}
        </Box>

        {/* Contact Info */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <Phone fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              {employee.phone}
            </Typography>
          </Box>
          
          {employee.email && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Email fontSize="small" color="action" />
              <Typography variant="body2" color="text.secondary">
                {employee.email}
              </Typography>
            </Box>
          )}
          
          {employee.joiningDate && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CalendarToday fontSize="small" color="action" />
              <Typography variant="body2" color="text.secondary">
                Joined: {new Date(employee.joiningDate).toLocaleDateString()}
              </Typography>
            </Box>
          )}
        </Box>

        {/* Tasks Stats (if showing) */}
        {showTasks && employee.stats && (
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Task Progress
              </Typography>
              <Typography variant="body2" fontWeight="bold">
                {employee.stats.completedTasks}/{employee.stats.totalTasks}
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={performance}
              sx={{ height: 8, borderRadius: 4 }}
            />
            
            <Box sx={{ display: 'flex', gap: 1, mt: 2, flexWrap: 'wrap' }}>
              <Chip
                label={`${employee.stats.completedTasks} Done`}
                size="small"
                color="success"
                variant="outlined"
              />
              <Chip
                label={`${employee.stats.inProgressTasks} In Progress`}
                size="small"
                color="info"
                variant="outlined"
              />
              {employee.stats.overdueTasks > 0 && (
                <Chip
                  label={`${employee.stats.overdueTasks} Overdue`}
                  size="small"
                  color="error"
                  variant="outlined"
                />
              )}
            </Box>
          </Box>
        )}

        {/* Footer */}
        <Box sx={{ mt: 'auto', pt: 2, borderTop: `1px solid ${alpha(theme.palette.divider, 0.3)}` }}>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<Visibility />}
            onClick={handleViewDetails}
            size="small"
          >
            View Details
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};