// components/advance/sub-bill/BillingCyclesCard.tsx
import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Paper,
  Alert,
  Stack,
} from '@mui/material';
import { alpha } from '@mui/material/styles';

interface BillingCyclesCardProps {
  currentColors: any;
  primaryColor: string;
  isMobile: boolean;
}

const BillingCyclesCard: React.FC<BillingCyclesCardProps> = ({
  currentColors,
  primaryColor,
  isMobile,
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Box>
      <Typography variant="h6" fontWeight="bold" mb={3} color={currentColors.textPrimary}>
        Billing Cycles & Renewals
      </Typography>
      
      <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 3 }}>
        {/* Upcoming Billing */}
        <Card sx={{ 
          flex: 1,
          background: currentColors.card,
          border: `1px solid ${currentColors.border}`,
          borderRadius: '12px'
        }}>
          <CardContent>
            <Typography variant="h6" fontWeight="bold" mb={3} color={currentColors.textPrimary}>
              Upcoming Billing Cycles
            </Typography>
            
            <Paper sx={{ 
              p: 3, 
              background: currentColors.surface,
              border: `1px solid ${alpha(primaryColor, 0.2)}`,
              borderRadius: '8px',
              mb: 2
            }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold" color={currentColors.textPrimary}>
                    Next Renewal
                  </Typography>
                  <Typography variant="body2" color={currentColors.textSecondary}>
                    May 1, 2024
                  </Typography>
                </Box>
                <Box
                  sx={{
                    px: 1.5,
                    py: 0.5,
                    background: alpha('#34A853', 0.1),
                    color: '#34A853',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    fontWeight: 'bold'
                  }}
                >
                  AUTO RENEW
                </Box>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="body2" color={currentColors.textSecondary}>
                  Amount
                </Typography>
                <Typography variant="h5" fontWeight="bold" color={currentColors.textPrimary}>
                  {formatCurrency(199)}
                </Typography>
              </Box>
            </Paper>
            
            <Alert severity="info" sx={{ 
              background: alpha(primaryColor, 0.1),
              border: `1px solid ${alpha(primaryColor, 0.2)}`,
              color: currentColors.textPrimary
            }}>
              Your subscription will automatically renew on May 1, 2024. 
              You can cancel anytime before the renewal date.
            </Alert>
          </CardContent>
        </Card>

        {/* Billing History */}
        <Card sx={{ 
          flex: 1,
          background: currentColors.card,
          border: `1px solid ${currentColors.border}`,
          borderRadius: '12px'
        }}>
          <CardContent>
            <Typography variant="h6" fontWeight="bold" mb={3} color={currentColors.textPrimary}>
              Billing History
            </Typography>
            
            <Stack spacing={2}>
              {[
                { planName: 'Professional Plan', amount: 796, period: 'Jan 1, 2024 - Apr 30, 2024' },
                { planName: 'Basic Plan', amount: 396, period: 'Sep 1, 2023 - Dec 31, 2023' },
                { planName: 'Starter Plan', amount: 196, period: 'May 1, 2023 - Aug 31, 2023' },
              ].map((subscription, index) => (
                <Paper key={index} sx={{ 
                  p: 2, 
                  background: currentColors.surface,
                  border: `1px solid ${currentColors.border}`,
                  borderRadius: '8px'
                }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body1" fontWeight="medium" color={currentColors.textPrimary}>
                      {subscription.planName}
                    </Typography>
                    <Typography variant="body1" fontWeight="bold" color={currentColors.textPrimary}>
                      {formatCurrency(subscription.amount)}
                    </Typography>
                  </Box>
                  <Typography variant="caption" color={currentColors.textSecondary}>
                    {subscription.period}
                  </Typography>
                </Paper>
              ))}
            </Stack>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default BillingCyclesCard;