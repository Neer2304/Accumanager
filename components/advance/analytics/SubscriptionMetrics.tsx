import {
  Card,
  CardContent,
  Typography,
  Stack,
  Box,
} from '@mui/material';

interface SubscriptionMetricsProps {
  subscriptionMetrics: any;
  currentColors: any;
}

export default function SubscriptionMetrics({
  subscriptionMetrics,
  currentColors
}: SubscriptionMetricsProps) {
  return (
    <Card sx={{ 
      background: currentColors.card, 
      border: `1px solid ${currentColors.border}`,
      borderRadius: '12px',
      height: '100%',
    }}>
      <CardContent>
        <Typography variant="h6" fontWeight="bold" mb={3} color={currentColors.textPrimary}>
          Subscription Metrics
        </Typography>
        <Stack spacing={2}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" color={currentColors.textSecondary}>
              Monthly Recurring Revenue (MRR)
            </Typography>
            <Typography variant="body1" fontWeight="bold" color={currentColors.textPrimary}>
              ₹{(subscriptionMetrics?.mrr || 25000).toLocaleString()}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" color={currentColors.textSecondary}>
              Annual Recurring Revenue (ARR)
            </Typography>
            <Typography variant="body1" fontWeight="bold" color={currentColors.textPrimary}>
              ₹{(subscriptionMetrics?.arr || 300000).toLocaleString()}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" color={currentColors.textSecondary}>
              Total Paid
            </Typography>
            <Typography variant="body1" fontWeight="bold" color={currentColors.textPrimary}>
              ₹{(subscriptionMetrics?.totalPaid || 150000).toLocaleString()}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" color={currentColors.textSecondary}>
              Monthly Amount
            </Typography>
            <Typography variant="body1" fontWeight="bold" color={currentColors.textPrimary}>
              ₹{(subscriptionMetrics?.monthlyAmount || 25000).toLocaleString()}
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}