import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Avatar,
  Box,
  Paper,
  Stack,
  Chip,
  Button,
  CircularProgress,
} from '@mui/material';
import { Email, Phone, CalendarToday } from '@mui/icons-material';

interface UserDetailsDialogProps {
  open: boolean;
  user: {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    avatar?: string;
    subscription?: {
      plan: string;
      status: string;
      joinedDate: string;
    };
    stats?: {
      totalOrders?: number;
      totalSpent?: number;
    };
  } | null;
  onClose: () => void;
}

const UserDetailsDialog: React.FC<UserDetailsDialogProps> = ({
  open,
  user,
  onClose,
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar src={user?.avatar} sx={{ width: 40, height: 40 }}>
            {user?.name?.charAt(0).toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="h6">{user?.name}</Typography>
            <Typography variant="body2" color="text.secondary">
              User Details
            </Typography>
          </Box>
        </Box>
      </DialogTitle>
      <DialogContent>
        {user ? (
          <Box sx={{ mt: 1 }}>
            <Box sx={{ 
              display: 'flex', 
              flexWrap: 'wrap',
              gap: 3,
              mb: 3,
              '& > *': {
                flex: '1 1 calc(50% - 12px)',
                minWidth: 250
              }
            }}>
              {/* Contact Information */}
              <Paper sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom color="text.primary">
                  Contact Information
                </Typography>
                <Stack spacing={2}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Email sx={{ color: 'text.secondary' }} />
                    <Typography variant="body2">{user.email}</Typography>
                  </Box>
                  {user.phone && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Phone sx={{ color: 'text.secondary' }} />
                      <Typography variant="body2">{user.phone}</Typography>
                    </Box>
                  )}
                </Stack>
              </Paper>

              {/* Subscription */}
              <Paper sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom color="text.primary">
                  Subscription
                </Typography>
                {user.subscription ? (
                  <Stack spacing={1}>
                    <Chip 
                      label={user.subscription.plan.toUpperCase()} 
                      color="primary" 
                      size="small" 
                      variant="outlined"
                    />
                    <Chip 
                      label={user.subscription.status.toUpperCase()} 
                      color={
                        user.subscription.status === 'active' ? 'success' : 
                        user.subscription.status === 'trial' ? 'info' : 'default'
                      } 
                      size="small" 
                    />
                    <Typography variant="caption" color="text.secondary">
                      Joined: {formatDate(user.subscription.joinedDate)}
                    </Typography>
                  </Stack>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No subscription data
                  </Typography>
                )}
              </Paper>
            </Box>

            {/* User Statistics */}
            {user.stats && (
              <Paper sx={{ p: 3, borderRadius: 2, mb: 2 }}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom color="text.primary">
                  User Statistics
                </Typography>
                <Box sx={{ 
                  display: 'flex', 
                  flexWrap: 'wrap',
                  gap: 3,
                  '& > *': {
                    flex: '1 1 calc(50% - 12px)',
                    minWidth: 150
                  }
                }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h5" fontWeight="bold" color="primary">
                      {user.stats.totalOrders || 0}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Total Orders
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h5" fontWeight="bold" color="primary">
                      ₹{user.stats.totalSpent?.toLocaleString() || 0}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Total Spent
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            )}
          </Box>
        ) : (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        <Button 
          variant="contained" 
          onClick={() => window.open(`/admin/users/${user?._id}`, '_blank')}
        >
          View Full Profile
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserDetailsDialog;