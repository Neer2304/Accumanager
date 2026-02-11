// components/admin/dashboard/UserManagement.tsx
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
  const darkMode = theme.palette.mode === 'dark';

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
        return '#34a853';
      case 'trial':
        return '#1a73e8';
      case 'inactive':
        return '#ea4335';
      case 'pending':
        return '#fbbc04';
      default:
        return '#9aa0a6';
    }
  };

  const getPlanColor = (plan: string) => {
    switch (plan?.toLowerCase()) {
      case 'yearly':
        return '#34a853';
      case 'quarterly':
        return '#1a73e8';
      case 'monthly':
        return '#fbbc04';
      case 'trial':
        return '#1a73e8';
      default:
        return '#9aa0a6';
    }
  };

  const getUserAvatarColor = (userId: string, usageHours: number = 0) => {
    if (usageHours > 100) return '#34a853';
    if (usageHours > 10) return '#1a73e8';
    if (usageHours > 1) return '#fbbc04';
    return darkMode ? '#5f6368' : '#9aa0a6';
  };

  return (
    <Card sx={{
      borderRadius: '16px',
      backgroundColor: darkMode ? '#303134' : '#ffffff',
      border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
      boxShadow: 'none',
    }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography variant="h6" sx={{ 
              fontWeight: 500,
              color: darkMode ? '#e8eaed' : '#202124',
              mb: 0.5,
            }}>
              Recent Users
            </Typography>
            <Typography variant="body2" sx={{ 
              color: darkMode ? '#9aa0a6' : '#5f6368',
            }}>
              Latest registered users with usage analytics
            </Typography>
          </Box>
          <Button
            variant="outlined"
            endIcon={<ArrowForward />}
            onClick={onViewAll}
            size="small"
            sx={{
              borderColor: darkMode ? '#3c4043' : '#dadce0',
              color: darkMode ? '#e8eaed' : '#202124',
              '&:hover': {
                borderColor: darkMode ? '#5f6368' : '#5f6368',
                backgroundColor: darkMode ? alpha('#ffffff', 0.05) : alpha('#000000', 0.02),
              },
            }}
          >
            View All Users
          </Button>
        </Box>

        <TableContainer 
          component={Paper} 
          variant="outlined"
          sx={{
            borderRadius: '12px',
            backgroundColor: darkMode ? '#202124' : '#ffffff',
            borderColor: darkMode ? '#3c4043' : '#dadce0',
          }}
        >
          <Table>
            <TableHead>
              <TableRow sx={{ 
                backgroundColor: darkMode ? '#303134' : '#f8f9fa',
              }}>
                <TableCell sx={{ 
                  color: darkMode ? '#9aa0a6' : '#5f6368',
                  fontWeight: 500,
                  borderColor: darkMode ? '#3c4043' : '#dadce0',
                }}>
                  User Profile
                </TableCell>
                <TableCell sx={{ 
                  color: darkMode ? '#9aa0a6' : '#5f6368',
                  fontWeight: 500,
                  borderColor: darkMode ? '#3c4043' : '#dadce0',
                }}>
                  Plan & Status
                </TableCell>
                <TableCell sx={{ 
                  color: darkMode ? '#9aa0a6' : '#5f6368',
                  fontWeight: 500,
                  borderColor: darkMode ? '#3c4043' : '#dadce0',
                }}>
                  Usage Analytics
                </TableCell>
                <TableCell sx={{ 
                  color: darkMode ? '#9aa0a6' : '#5f6368',
                  fontWeight: 500,
                  borderColor: darkMode ? '#3c4043' : '#dadce0',
                }}>
                  Activity Timeline
                </TableCell>
                <TableCell align="right" sx={{ 
                  color: darkMode ? '#9aa0a6' : '#5f6368',
                  fontWeight: 500,
                  borderColor: darkMode ? '#3c4043' : '#dadce0',
                }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow
                  key={user._id}
                  hover
                  sx={{
                    '&:hover': {
                      backgroundColor: darkMode ? alpha('#ffffff', 0.03) : alpha('#000000', 0.02),
                    },
                    borderColor: darkMode ? '#3c4043' : '#dadce0',
                  }}
                >
                  <TableCell sx={{ borderColor: darkMode ? '#3c4043' : '#dadce0' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar
                        sx={{
                          bgcolor: getUserAvatarColor(user._id, user.totalUsageHours),
                          width: 40,
                          height: 40,
                          fontSize: 14,
                          fontWeight: 500,
                        }}
                      >
                        {user.name?.charAt(0).toUpperCase() || 'U'}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2" sx={{ 
                          fontWeight: 500,
                          color: darkMode ? '#e8eaed' : '#202124',
                        }}>
                          {user.name || 'Unknown User'}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                          <Email sx={{ fontSize: 12, color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                          <Typography variant="caption" sx={{ 
                            color: darkMode ? '#9aa0a6' : '#5f6368',
                          }}>
                            {user.email || 'No email'}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </TableCell>
                  
                  <TableCell sx={{ borderColor: darkMode ? '#3c4043' : '#dadce0' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Chip
                        label={user.subscription?.plan?.toUpperCase() || 'NO PLAN'}
                        size="small"
                        sx={{
                          width: 'fit-content',
                          backgroundColor: alpha(getPlanColor(user.subscription?.plan || 'none'), 0.1),
                          color: getPlanColor(user.subscription?.plan || 'none'),
                          border: 'none',
                          fontWeight: 500,
                        }}
                      />
                      <Chip
                        label={user.subscription?.status?.toUpperCase() || 'INACTIVE'}
                        size="small"
                        sx={{
                          width: 'fit-content',
                          backgroundColor: alpha(getStatusColor(user.subscription?.status || 'inactive'), 0.1),
                          color: getStatusColor(user.subscription?.status || 'inactive'),
                          border: 'none',
                          fontWeight: 500,
                        }}
                      />
                    </Box>
                  </TableCell>
                  
                  <TableCell sx={{ borderColor: darkMode ? '#3c4043' : '#dadce0' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <AccessTime sx={{ fontSize: 16, color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                        <Box>
                          <Typography variant="body2" sx={{ 
                            fontWeight: 500,
                            color: darkMode ? '#e8eaed' : '#202124',
                          }}>
                            {formatTime(user.totalUsageHours)}
                          </Typography>
                          <Typography variant="caption" sx={{ 
                            color: darkMode ? '#9aa0a6' : '#5f6368',
                          }}>
                            Total Usage
                          </Typography>
                        </Box>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Person sx={{ fontSize: 16, color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                        <Box>
                          <Typography variant="body2" sx={{ 
                            fontWeight: 500,
                            color: darkMode ? '#e8eaed' : '#202124',
                          }}>
                            {user.isActive ? 'Active' : 'Inactive'}
                          </Typography>
                          <Typography variant="caption" sx={{ 
                            color: darkMode ? '#9aa0a6' : '#5f6368',
                          }}>
                            Status
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </TableCell>
                  
                  <TableCell sx={{ borderColor: darkMode ? '#3c4043' : '#dadce0' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CalendarToday sx={{ fontSize: 12, color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                        <Typography variant="caption" sx={{ 
                          color: darkMode ? '#e8eaed' : '#202124',
                        }}>
                          Joined: {formatDate(user.createdAt)}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <AccessTime sx={{ fontSize: 12, color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                        <Typography variant="caption" sx={{ 
                          color: darkMode ? '#e8eaed' : '#202124',
                        }}>
                          Last active: {formatDate(user.lastActive || user.lastLogin)}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  
                  <TableCell align="right" sx={{ borderColor: darkMode ? '#3c4043' : '#dadce0' }}>
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                      <Tooltip title="View Details">
                        <IconButton
                          size="small"
                          sx={{
                            bgcolor: alpha('#1a73e8', 0.1),
                            color: '#1a73e8',
                            '&:hover': {
                              bgcolor: alpha('#1a73e8', 0.2),
                            },
                          }}
                          onClick={() => router.push(`/admin/users/${user._id}`)}
                        >
                          <Visibility fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit User">
                        <IconButton
                          size="small"
                          sx={{
                            bgcolor: alpha('#fbbc04', 0.1),
                            color: '#fbbc04',
                            '&:hover': {
                              bgcolor: alpha('#fbbc04', 0.2),
                            },
                          }}
                          onClick={() => router.push(`/admin/users/${user._id}/edit`)}
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