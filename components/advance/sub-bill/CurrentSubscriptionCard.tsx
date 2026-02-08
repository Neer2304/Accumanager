// components/advance/sub-bill/CurrentSubscriptionCard.tsx
import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Switch,
  FormControlLabel,
  Paper,
  Avatar,
  Button,
} from '@mui/material';
import {
  CheckCircle,
  Cancel,
} from '@mui/icons-material';
import { alpha } from '@mui/material/styles';

interface CurrentSubscriptionCardProps {
  currentColors: any;
  primaryColor: string;
  isMobile: boolean;
}

const CurrentSubscriptionCard: React.FC<CurrentSubscriptionCardProps> = ({
  currentColors,
  primaryColor,
  isMobile,
}) => {
  const [autoRenew, setAutoRenew] = useState(true);

  const mockCurrentSubscription = {
    plan: {
      name: 'Professional',
      price: 199,
      currency: 'INR',
      interval: 'monthly',
      features: [
        'All Basic features',
        'Custom Reports',
        'Phone Support',
        '10 Users',
        'API Access'
      ]
    },
    status: 'active',
    totalPaid: 796,
    remainingDays: 45,
    nextBillingDate: '2024-05-01',
    upcomingPayment: {
      amount: 199,
      date: '2024-05-01'
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return '#34A853';
      default:
        return currentColors.textSecondary;
    }
  };

  return (
    <Card sx={{ 
      mb: 3, 
      background: currentColors.card,
      border: `1px solid ${currentColors.border}`,
      borderRadius: '12px',
      transition: 'all 0.3s ease',
      boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
    }}>
      <CardContent>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          mb: 3,
          flexDirection: isMobile ? 'column' : 'row',
          gap: isMobile ? 2 : 0
        }}>
          <Typography 
            variant="h6" 
            fontWeight="bold" 
            color={currentColors.textPrimary}
            fontSize={isMobile ? '1rem' : '1.125rem'}
          >
            Current Subscription
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Chip
              label={mockCurrentSubscription.status.toUpperCase()}
              icon={<CheckCircle fontSize="small" />}
              sx={{
                background: alpha(getStatusColor(mockCurrentSubscription.status), 0.1),
                color: getStatusColor(mockCurrentSubscription.status),
                fontWeight: 'bold',
                border: `1px solid ${alpha(getStatusColor(mockCurrentSubscription.status), 0.3)}`,
                fontSize: isMobile ? '0.75rem' : '0.875rem',
              }}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={autoRenew}
                  onChange={(e) => setAutoRenew(e.target.checked)}
                  size="small"
                  sx={{
                    color: primaryColor,
                    '&.Mui-checked': {
                      color: primaryColor,
                    }
                  }}
                />
              }
              label="Auto Renew"
              sx={{ color: currentColors.textSecondary }}
            />
          </Box>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 3 }}>
          {/* Plan Details */}
          <Paper sx={{ 
            flex: 1,
            p: 3, 
            background: currentColors.surface,
            border: `1px solid ${currentColors.border}`,
            borderRadius: '8px',
            minWidth: isMobile ? '100%' : '300px'
          }}>
            <Typography variant="subtitle1" fontWeight="bold" color={currentColors.textPrimary} gutterBottom>
              Plan Details
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Avatar
                sx={{
                  width: 60,
                  height: 60,
                  background: alpha(primaryColor, 0.1),
                  color: primaryColor,
                  fontSize: 24,
                  fontWeight: 'bold'
                }}
              >
                P
              </Avatar>
              <Box>
                <Typography variant="h5" fontWeight="bold" color={currentColors.textPrimary}>
                  {mockCurrentSubscription.plan.name}
                </Typography>
                <Typography variant="body2" color={currentColors.textSecondary}>
                  {formatCurrency(mockCurrentSubscription.plan.price)}/{mockCurrentSubscription.plan.interval}
                </Typography>
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {mockCurrentSubscription.plan.features.map((feature, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckCircle sx={{ fontSize: 16, color: '#34A853' }} />
                  <Typography variant="body2" color={currentColors.textPrimary}>
                    {feature}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Paper>

          {/* Stats Grid */}
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2, minWidth: isMobile ? '100%' : '300px' }}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Paper sx={{ 
                flex: 1,
                p: 2, 
                textAlign: 'center', 
                background: currentColors.surface, 
                border: `1px solid ${currentColors.border}`,
                borderRadius: '8px',
              }}>
                <Typography variant="caption" color={currentColors.textSecondary}>
                  Total Paid
                </Typography>
                <Typography variant="h5" fontWeight="bold" sx={{ mt: 1, color: currentColors.textPrimary }}>
                  {formatCurrency(mockCurrentSubscription.totalPaid)}
                </Typography>
              </Paper>
              
              <Paper sx={{ 
                flex: 1,
                p: 2, 
                textAlign: 'center', 
                background: currentColors.surface, 
                border: `1px solid ${currentColors.border}`,
                borderRadius: '8px',
              }}>
                <Typography variant="caption" color={currentColors.textSecondary}>
                  Days Remaining
                </Typography>
                <Typography variant="h5" fontWeight="bold" sx={{ mt: 1, color: currentColors.textPrimary }}>
                  {mockCurrentSubscription.remainingDays}
                </Typography>
              </Paper>
            </Box>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <Paper sx={{ 
                flex: 1,
                p: 2, 
                textAlign: 'center', 
                background: currentColors.surface, 
                border: `1px solid ${currentColors.border}`,
                borderRadius: '8px',
              }}>
                <Typography variant="caption" color={currentColors.textSecondary}>
                  Next Billing
                </Typography>
                <Typography variant="h6" fontWeight="bold" sx={{ mt: 1, color: currentColors.textPrimary }}>
                  {new Date(mockCurrentSubscription.nextBillingDate).toLocaleDateString()}
                </Typography>
              </Paper>
              
              <Paper sx={{ 
                flex: 1,
                p: 2, 
                textAlign: 'center', 
                background: currentColors.surface, 
                border: `1px solid ${currentColors.border}`,
                borderRadius: '8px',
              }}>
                <Typography variant="caption" color={currentColors.textSecondary}>
                  Upcoming Payment
                </Typography>
                <Typography variant="h6" fontWeight="bold" sx={{ mt: 1, color: currentColors.textPrimary }}>
                  {formatCurrency(mockCurrentSubscription.upcomingPayment.amount)}
                </Typography>
              </Paper>
            </Box>

            <Button
              variant="outlined"
              fullWidth
              startIcon={<Cancel />}
              sx={{
                mt: 1,
                borderColor: '#EA4335',
                color: '#EA4335',
                '&:hover': {
                  borderColor: '#EA4335',
                  background: alpha('#EA4335', 0.04),
                }
              }}
            >
              Cancel Subscription
            </Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default CurrentSubscriptionCard;