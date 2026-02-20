// components/googleadminanalytics/components/AdminTopUsersTable.tsx
import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Avatar,
  Box,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Person,
  Email
} from '@mui/icons-material';
import { TopUser } from './types';

interface AdminTopUsersTableProps {
  users: TopUser[];
  darkMode: boolean;
}

export const AdminTopUsersTable: React.FC<AdminTopUsersTableProps> = ({ users, darkMode }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return darkMode ? '#34a853' : '#34a853';
      case 'inactive':
        return darkMode ? '#9aa0a6' : '#5f6368';
      case 'trial':
        return darkMode ? '#fbbc04' : '#f57c00';
      default:
        return darkMode ? '#9aa0a6' : '#5f6368';
    }
  };

  const getPlanColor = (plan: string) => {
    switch (plan.toLowerCase()) {
      case 'pro':
        return '#1a73e8';
      case 'premium':
        return '#8ab4f8';
      case 'enterprise':
        return '#34a853';
      default:
        return '#5f6368';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (isMobile) {
    return (
      <Card elevation={0} sx={{
        borderRadius: '16px',
        backgroundColor: darkMode ? '#303134' : '#ffffff',
        border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
      }}>
        <CardContent>
          <Typography variant="h6" fontWeight={600} gutterBottom sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
            Top Users
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            {users.map((user, index) => (
              <Box
                key={index}
                sx={{
                  p: 2,
                  borderRadius: '12px',
                  backgroundColor: darkMode ? '#202124' : '#f8f9fa',
                  border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                  <Avatar sx={{ bgcolor: '#1a73e8', width: 32, height: 32 }}>
                    {user.name.charAt(0)}
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" fontWeight="bold" color={darkMode ? '#e8eaed' : '#202124'}>
                      {user.name}
                    </Typography>
                    <Typography variant="caption" color={darkMode ? '#9aa0a6' : '#5f6368'}>
                      {user.email}
                    </Typography>
                  </Box>
                </Box>
                
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
                  <Chip
                    label={user.plan}
                    size="small"
                    sx={{
                      backgroundColor: `${getPlanColor(user.plan)}20`,
                      color: getPlanColor(user.plan),
                      border: 'none',
                    }}
                  />
                  <Chip
                    label={user.status}
                    size="small"
                    sx={{
                      backgroundColor: `${getStatusColor(user.status)}20`,
                      color: getStatusColor(user.status),
                      border: 'none',
                    }}
                  />
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                  <Box>
                    <Typography variant="caption" color={darkMode ? '#9aa0a6' : '#5f6368'}>
                      Revenue
                    </Typography>
                    <Typography variant="body2" fontWeight="bold" color={darkMode ? '#e8eaed' : '#202124'}>
                      ₹{user.revenue.toLocaleString()}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color={darkMode ? '#9aa0a6' : '#5f6368'}>
                      Payments
                    </Typography>
                    <Typography variant="body2" fontWeight="bold" color={darkMode ? '#e8eaed' : '#202124'}>
                      {user.paymentCount}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card elevation={0} sx={{
      borderRadius: '16px',
      backgroundColor: darkMode ? '#303134' : '#ffffff',
      border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
    }}>
      <CardContent>
        <Typography variant="h6" fontWeight={600} gutterBottom sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
          Top Users by Revenue
        </Typography>
        <TableContainer sx={{ maxHeight: 400 }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ 
                  backgroundColor: darkMode ? '#202124' : '#f8f9fa',
                  color: darkMode ? '#9aa0a6' : '#5f6368',
                  fontWeight: 500,
                  borderBottom: `2px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                }}>
                  User
                </TableCell>
                <TableCell sx={{ 
                  backgroundColor: darkMode ? '#202124' : '#f8f9fa',
                  color: darkMode ? '#9aa0a6' : '#5f6368',
                  fontWeight: 500,
                  borderBottom: `2px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                }}>
                  Plan
                </TableCell>
                <TableCell sx={{ 
                  backgroundColor: darkMode ? '#202124' : '#f8f9fa',
                  color: darkMode ? '#9aa0a6' : '#5f6368',
                  fontWeight: 500,
                  borderBottom: `2px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                }}>
                  Status
                </TableCell>
                <TableCell sx={{ 
                  backgroundColor: darkMode ? '#202124' : '#f8f9fa',
                  color: darkMode ? '#9aa0a6' : '#5f6368',
                  fontWeight: 500,
                  borderBottom: `2px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                }}>
                  Joined
                </TableCell>
                <TableCell align="right" sx={{ 
                  backgroundColor: darkMode ? '#202124' : '#f8f9fa',
                  color: darkMode ? '#9aa0a6' : '#5f6368',
                  fontWeight: 500,
                  borderBottom: `2px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                }}>
                  Revenue
                </TableCell>
                <TableCell align="right" sx={{ 
                  backgroundColor: darkMode ? '#202124' : '#f8f9fa',
                  color: darkMode ? '#9aa0a6' : '#5f6368',
                  fontWeight: 500,
                  borderBottom: `2px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                }}>
                  Payments
                </TableCell>
                <TableCell sx={{ 
                  backgroundColor: darkMode ? '#202124' : '#f8f9fa',
                  color: darkMode ? '#9aa0a6' : '#5f6368',
                  fontWeight: 500,
                  borderBottom: `2px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                }}>
                  Last Payment
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user, index) => (
                <TableRow
                  key={index}
                  hover
                  sx={{
                    '&:hover': { backgroundColor: darkMode ? '#2d2f31' : '#f1f3f4' },
                  }}
                >
                  <TableCell sx={{ borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}` }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Avatar sx={{ width: 32, height: 32, bgcolor: '#1a73e8' }}>
                        {user.name.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight="bold" color={darkMode ? '#e8eaed' : '#202124'}>
                          {user.name}
                        </Typography>
                        <Typography variant="caption" color={darkMode ? '#9aa0a6' : '#5f6368'}>
                          {user.email}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}` }}>
                    <Chip
                      label={user.plan}
                      size="small"
                      sx={{
                        backgroundColor: `${getPlanColor(user.plan)}20`,
                        color: getPlanColor(user.plan),
                        border: 'none',
                        fontWeight: 500,
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}` }}>
                    <Chip
                      label={user.status}
                      size="small"
                      sx={{
                        backgroundColor: `${getStatusColor(user.status)}20`,
                        color: getStatusColor(user.status),
                        border: 'none',
                        fontWeight: 500,
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}` }}>
                    <Typography variant="body2" color={darkMode ? '#e8eaed' : '#202124'}>
                      {formatDate(user.joined)}
                    </Typography>
                  </TableCell>
                  <TableCell align="right" sx={{ borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}` }}>
                    <Typography variant="body2" fontWeight="bold" color="#34a853">
                      ₹{user.revenue.toLocaleString()}
                    </Typography>
                  </TableCell>
                  <TableCell align="right" sx={{ borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}` }}>
                    <Typography variant="body2" color={darkMode ? '#e8eaed' : '#202124'}>
                      {user.paymentCount}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}` }}>
                    <Typography variant="body2" color={darkMode ? '#e8eaed' : '#202124'}>
                      {formatDate(user.lastPayment)}
                    </Typography>
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