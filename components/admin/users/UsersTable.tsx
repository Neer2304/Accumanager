import React, { memo } from 'react';
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
  IconButton,
  Tooltip,
  Pagination,
  CircularProgress,
} from '@mui/material';
import { Edit, Block, CheckCircle } from '@mui/icons-material';

interface User {
  _id: string;
  name?: string;
  email?: string;
  role?: string;
  shopName?: string;
  isActive: boolean;
  subscription?: {
    plan?: string;
    status?: string;
    currentPeriodEnd?: string;
  };
  usage?: {
    products?: number;
    customers?: number;
    invoices?: number;
    storageMB?: number;
  };
  createdAt?: string;
}

interface UsersTableProps {
  users: User[];
  loading: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onEditUser: (user: User) => void;
  onToggleStatus: (userId: string, currentStatus: boolean) => void;
}

export const UsersTable = memo(function UsersTable({
  users,
  loading,
  currentPage,
  totalPages,
  onPageChange,
  onEditUser,
  onToggleStatus,
}: UsersTableProps) {
  
  const calculateDaysRemaining = (endDate?: string) => {
    if (!endDate) return 0;
    try {
      const end = new Date(endDate);
      const now = new Date();
      const diffTime = end.getTime() - now.getTime();
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    } catch {
      return 0;
    }
  };

  return (
    <Card>
      <CardContent sx={{ p: 0 }}>
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" fontWeight="bold">
            Users ({users.length})
          </Typography>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>User</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Role</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Plan</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Days Left</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Usage</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Created</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">No users found</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => {
                  const subscription = user.subscription || {};
                  const daysRemaining = calculateDaysRemaining(subscription.currentPeriodEnd);
                  const plan = subscription.plan || 'No Plan';
                  const status = subscription.status || 'inactive';
                  
                  return (
                    <TableRow key={user._id} hover sx={{ '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' } }}>
                      <TableCell>
                        <Typography variant="subtitle2" fontWeight="bold">
                          {user.name || 'Unknown User'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {user.email || 'No email'}
                        </Typography>
                        {user.shopName && (
                          <Typography variant="caption" color="text.secondary">
                            {user.shopName}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={user.role || 'user'} 
                          size="small"
                          sx={{
                            backgroundColor: user.role === 'admin' ? '#9c27b0' : '#1976d2',
                            color: '#ffffff',
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={plan} 
                          size="small" 
                          sx={{
                            borderColor: '#1976d2',
                            color: '#1976d2',
                          }}
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={status}
                          size="small"
                          sx={{
                            backgroundColor: 
                              status === 'active' ? '#2e7d32' :
                              status === 'trial' ? '#0288d1' :
                              status === 'expired' ? '#d32f2f' : 
                              status === 'cancelled' ? '#ed6c02' : '#757575',
                            color: '#ffffff',
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        {daysRemaining > 0 ? (
                          <Chip
                            label={`${daysRemaining}d`}
                            size="small"
                            sx={{
                              borderColor: daysRemaining < 7 ? '#d32f2f' : daysRemaining < 30 ? '#ed6c02' : '#2e7d32',
                              color: daysRemaining < 7 ? '#d32f2f' : daysRemaining < 30 ? '#ed6c02' : '#2e7d32',
                            }}
                            variant="outlined"
                          />
                        ) : daysRemaining < 0 ? (
                          <Chip 
                            label="Expired" 
                            size="small"
                            sx={{ backgroundColor: '#d32f2f', color: '#ffffff' }}
                          />
                        ) : (
                          <Chip 
                            label="No Date" 
                            size="small"
                            sx={{ backgroundColor: '#757575', color: '#ffffff' }}
                          />
                        )}
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body2" fontSize="12px">
                            📦 {user.usage?.products || 0} • 👥 {user.usage?.customers || 0}
                          </Typography>
                          <Typography variant="body2" fontSize="12px">
                            📄 {user.usage?.invoices || 0} • 💾 {user.usage?.storageMB || 0}MB
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title="Edit User">
                          <IconButton size="small" onClick={() => onEditUser(user)} sx={{ color: '#1976d2' }}>
                            <Edit />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={user.isActive ? "Deactivate" : "Activate"}>
                          <IconButton 
                            size="small" 
                            onClick={() => onToggleStatus(user._id, user.isActive)}
                            sx={{ color: user.isActive ? '#d32f2f' : '#2e7d32' }}
                          >
                            {user.isActive ? <Block /> : <CheckCircle />}
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        {totalPages > 1 && (
          <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={(event, value) => onPageChange(value)}
              color="primary"
              disabled={loading}
            />
          </Box>
        )}
      </CardContent>
    </Card>
  );
});