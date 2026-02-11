import React from 'react';
import {
  Card,
  CardContent,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from '@mui/material';

interface TopUser {
  name: string;
  email: string;
  plan: string;
  status?: string;
  joined: string;
  revenue: number;
  paymentCount?: number;
  lastPayment?: string;
}

interface TopUsersTableProps {
  users: TopUser[];
  darkMode?: boolean;
}

export const TopUsersTable: React.FC<TopUsersTableProps> = ({ users, darkMode = false }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    if (!dateString || dateString === '-') return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getPlanColor = (plan: string) => {
    const planLower = plan?.toLowerCase();
    if (planLower.includes('yearly') || planLower.includes('annual')) {
      return { bg: darkMode ? 'rgba(26, 115, 232, 0.1)' : 'rgba(26, 115, 232, 0.1)', text: darkMode ? '#8ab4f8' : '#1a73e8' };
    } else if (planLower.includes('quarterly')) {
      return { bg: darkMode ? 'rgba(52, 168, 83, 0.1)' : 'rgba(52, 168, 83, 0.1)', text: darkMode ? '#81c995' : '#34a853' };
    } else if (planLower.includes('monthly')) {
      return { bg: darkMode ? 'rgba(251, 188, 4, 0.1)' : 'rgba(251, 188, 4, 0.1)', text: darkMode ? '#fdd663' : '#fbbc04' };
    } else {
      return { bg: darkMode ? 'rgba(95, 99, 104, 0.1)' : 'rgba(95, 99, 104, 0.1)', text: darkMode ? '#9aa0a6' : '#5f6368' };
    }
  };

  return (
    <Card sx={{ 
      borderRadius: '16px',
      backgroundColor: darkMode ? '#303134' : '#ffffff',
      border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
      boxShadow: '0 4px 24px rgba(0, 0, 0, 0.05)',
    }}>
      <CardContent>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 3,
          pb: 2,
          borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
        }}>
          <Typography variant="h6" fontWeight="bold" color={darkMode ? '#e8eaed' : '#202124'}>
            Top Customers by Revenue
          </Typography>
          <Typography variant="body2" color={darkMode ? '#9aa0a6' : '#5f6368'}>
            Based on total payments
          </Typography>
        </Box>
        
        <TableContainer sx={{ 
          borderRadius: '12px',
          border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
          backgroundColor: darkMode ? '#202124' : '#f8f9fa',
        }}>
          <Table>
            <TableHead>
              <TableRow sx={{ 
                backgroundColor: darkMode ? '#202124' : '#f8f9fa',
                borderBottom: `2px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
              }}>
                <TableCell sx={{ 
                  color: darkMode ? '#9aa0a6' : '#5f6368',
                  fontWeight: 500,
                  borderBottom: 'none',
                }}>
                  Name
                </TableCell>
                <TableCell sx={{ 
                  color: darkMode ? '#9aa0a6' : '#5f6368',
                  fontWeight: 500,
                  borderBottom: 'none',
                }}>
                  Email
                </TableCell>
                <TableCell sx={{ 
                  color: darkMode ? '#9aa0a6' : '#5f6368',
                  fontWeight: 500,
                  borderBottom: 'none',
                }}>
                  Plan
                </TableCell>
                <TableCell sx={{ 
                  color: darkMode ? '#9aa0a6' : '#5f6368',
                  fontWeight: 500,
                  borderBottom: 'none',
                }}>
                  Joined
                </TableCell>
                <TableCell align="right" sx={{ 
                  color: darkMode ? '#9aa0a6' : '#5f6368',
                  fontWeight: 500,
                  borderBottom: 'none',
                }}>
                  Total Revenue
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.length > 0 ? (
                users.map((user, index) => {
                  const planColors = getPlanColor(user.plan);
                  
                  return (
                    <TableRow 
                      key={index} 
                      hover
                      sx={{ 
                        backgroundColor: darkMode ? '#303134' : '#ffffff',
                        borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                        '&:hover': {
                          backgroundColor: darkMode ? '#2d2f31' : '#f1f3f4',
                        }
                      }}
                    >
                      <TableCell sx={{ borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}` }}>
                        <Typography fontWeight="medium" color={darkMode ? '#e8eaed' : '#202124'}>
                          {user.name}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}` }}>
                        <Typography color={darkMode ? '#e8eaed' : '#202124'}>
                          {user.email}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}` }}>
                        <Chip
                          label={user.plan || 'No Plan'}
                          size="small"
                          sx={{
                            backgroundColor: planColors.bg,
                            color: planColors.text,
                            fontWeight: 500,
                            border: 'none',
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}` }}>
                        <Typography color={darkMode ? '#e8eaed' : '#202124'}>
                          {formatDate(user.joined)}
                        </Typography>
                      </TableCell>
                      <TableCell align="right" sx={{ borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}` }}>
                        <Typography fontWeight="bold" color={darkMode ? '#34a853' : '#34a853'}>
                          {formatCurrency(user.revenue)}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography color={darkMode ? '#9aa0a6' : '#5f6368'} gutterBottom>
                        No customer data available
                      </Typography>
                      <Typography variant="caption" color={darkMode ? '#9aa0a6' : '#5f6368'}>
                        Add some users to see analytics here
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        
        {/* Data Last Updated */}
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="caption" color={darkMode ? '#9aa0a6' : '#5f6368'}>
            Data last updated: {new Date().toLocaleString()}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};