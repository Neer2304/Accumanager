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
  Paper,
} from '@mui/material';

interface TopUser {
  name: string;
  email: string;
  plan: string;
  joined: string;
  revenue: number;
}

interface TopUsersTableProps {
  users: TopUser[];
}

export const TopUsersTable: React.FC<TopUsersTableProps> = ({ users }) => {
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
    switch (plan?.toLowerCase()) {
      case 'yearly':
        return { bg: '#e3f2fd', text: '#1976d2' };
      case 'quarterly':
        return { bg: '#e8f5e9', text: '#2e7d32' };
      case 'monthly':
        return { bg: '#fff3e0', text: '#ed6c02' };
      default:
        return { bg: '#f5f5f5', text: '#757575' };
    }
  };

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" fontWeight="bold">
            Top Customers by Revenue
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Based on total payments
          </Typography>
        </Box>
        
        <TableContainer component={Paper} elevation={0} variant="outlined">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Plan</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Joined</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold' }}>Total Revenue</TableCell>
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
                        '&:last-child td, &:last-child th': { border: 0 },
                        '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' }
                      }}
                    >
                      <TableCell>
                        <Typography fontWeight="medium">
                          {user.name}
                        </Typography>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Box
                          sx={{
                            px: 1.5,
                            py: 0.5,
                            borderRadius: 1,
                            display: 'inline-block',
                            backgroundColor: planColors.bg,
                            color: planColors.text,
                            fontWeight: 'medium',
                            fontSize: '0.875rem',
                          }}
                        >
                          {user.plan || 'No Plan'}
                        </Box>
                      </TableCell>
                      <TableCell>{formatDate(user.joined)}</TableCell>
                      <TableCell align="right">
                        <Typography fontWeight="bold" color="#1976d2">
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
                      <Typography color="text.secondary" gutterBottom>
                        No customer data available
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
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
          <Typography variant="caption" color="text.secondary">
            Data last updated: {new Date().toLocaleString()}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};