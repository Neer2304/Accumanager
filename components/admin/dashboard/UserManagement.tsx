import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Avatar,
  IconButton,
  Tooltip,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Visibility,
  Edit,
  ArrowForward,
  Person,
  Email,
  CalendarToday,
  AccessTime,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  subscription: {
    plan: string;
    status: string;
    currentPeriodEnd?: string;
    features?: string[];
  };
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
  totalUsageHours?: number;
  lastActive?: string;
}

interface UserManagementProps {
  users: User[];
  onViewAll: () => void;
}

export const UserManagement: React.FC<UserManagementProps> = ({
  users,
  onViewAll,
}) => {
  const router = useRouter();
  const theme = useTheme();

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (hours?: number) => {
    if (!hours || hours === 0) return '0h';
    if (hours < 1) {
      const minutes = Math.round(hours * 60);
      return `${minutes}m`;
    }
    if (hours < 24) {
      return `${Math.round(hours * 10) / 10}h`;
    }
    const days = Math.floor(hours / 24);
    const remainingHours = Math.round(hours % 24);
    return `${days}d ${remainingHours}h`;
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'success';
      case 'trial':
        return 'info';
      case 'inactive':
        return 'error';
      case 'pending':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getPlanColor = (plan: string) => {
    switch (plan?.toLowerCase()) {
      case 'yearly':
        return 'secondary';
      case 'quarterly':
        return 'primary';
      case 'monthly':
        return 'warning';
      case 'trial':
        return 'info';
      default:
        return 'default';
    }
  };

  const getUserAvatarColor = (userId: string, usageHours: number = 0) => {
    if (usageHours > 100) return theme.palette.success.main;
    if (usageHours > 10) return theme.palette.primary.main;
    if (usageHours > 1) return theme.palette.warning.main;
    return theme.palette.grey[500];
  };

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography variant="h6" fontWeight="bold">
              Recent Users
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Latest registered users with usage analytics
            </Typography>
          </Box>
          <Button
            variant="outlined"
            endIcon={<ArrowForward />}
            onClick={onViewAll}
            size="small"
          >
            View All Users
          </Button>
        </Box>

        <TableContainer component={Paper} variant="outlined">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>User Profile</TableCell>
                <TableCell>Plan & Status</TableCell>
                <TableCell>Usage Analytics</TableCell>
                <TableCell>Activity Timeline</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow
                  key={user._id}
                  hover
                  sx={{
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.action.hover, 0.05),
                    },
                  }}
                >
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar
                        sx={{
                          bgcolor: getUserAvatarColor(user._id, user.totalUsageHours),
                          width: 42,
                          height: 42,
                        }}
                      >
                        {user.name?.charAt(0).toUpperCase() || 'U'}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2" fontWeight="bold">
                          {user.name || 'Unknown User'}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                          <Email sx={{ fontSize: 12, color: 'text.secondary' }} />
                          <Typography variant="caption" color="text.secondary">
                            {user.email || 'No email'}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </TableCell>
                  
                  <TableCell>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Chip
                        label={user.subscription?.plan?.toUpperCase() || 'NO PLAN'}
                        size="small"
                        color={getPlanColor(user.subscription?.plan || 'none') as any}
                        variant="outlined"
                        sx={{ width: 'fit-content' }}
                      />
                      <Chip
                        label={user.subscription?.status?.toUpperCase() || 'INACTIVE'}
                        size="small"
                        color={getStatusColor(user.subscription?.status || 'inactive') as any}
                        sx={{ width: 'fit-content' }}
                      />
                    </Box>
                  </TableCell>
                  
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <AccessTime sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <Box>
                          <Typography variant="body2" fontWeight="500">
                            {formatTime(user.totalUsageHours)}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Total Usage
                          </Typography>
                        </Box>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Person sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <Box>
                          <Typography variant="body2" fontWeight="500">
                            {user.isActive ? 'Active' : 'Inactive'}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Status
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </TableCell>
                  
                  <TableCell>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CalendarToday sx={{ fontSize: 12, color: 'text.secondary' }} />
                        <Typography variant="caption">
                          Joined: {formatDate(user.createdAt)}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <AccessTime sx={{ fontSize: 12, color: 'text.secondary' }} />
                        <Typography variant="caption">
                          Last active: {formatDate(user.lastActive || user.lastLogin)}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  
                  <TableCell align="right">
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                      <Tooltip title="View Details">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => router.push(`/admin/users/${user._id}`)}
                          sx={{
                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                            '&:hover': {
                              bgcolor: alpha(theme.palette.primary.main, 0.2),
                            },
                          }}
                        >
                          <Visibility fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit User">
                        <IconButton
                          size="small"
                          color="info"
                          onClick={() => router.push(`/admin/users/${user._id}/edit`)}
                          sx={{
                            bgcolor: alpha(theme.palette.info.main, 0.1),
                            '&:hover': {
                              bgcolor: alpha(theme.palette.info.main, 0.2),
                            },
                          }}
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
};