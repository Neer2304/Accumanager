// components/advance/sub-bill/UsageAnalyticsCard.tsx
import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
} from '@mui/material';
import {
  AttachMoney,
  AccessTime,
  Repeat,
  TrendingUp,
  Timeline,
} from '@mui/icons-material';
import { alpha } from '@mui/material/styles';

interface UsageAnalyticsCardProps {
  currentColors: any;
  primaryColor: string;
  isMobile: boolean;
}

const UsageAnalyticsCard: React.FC<UsageAnalyticsCardProps> = ({
  currentColors,
  primaryColor,
  isMobile,
}) => {
  const stats = [
    { title: 'Total Value', value: '₹1,388', description: 'Lifetime subscription value', icon: <AttachMoney />, color: '#34A853' },
    { title: 'Average Duration', value: '4 months', description: 'Per subscription cycle', icon: <AccessTime />, color: '#4285F4' },
    { title: 'Renewal Rate', value: '75%', description: 'Auto-renewal success rate', icon: <Repeat />, color: '#FBBC04' },
    { title: 'Cost/Month', value: '₹347', description: 'Average monthly cost', icon: <TrendingUp />, color: '#34A853' },
  ];

  return (
    <Box>
      <Typography variant="h6" fontWeight="bold" mb={3} color={currentColors.textPrimary}>
        Subscription Usage Analytics
      </Typography>
      
      <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', flexWrap: 'wrap', gap: 3 }}>
        {stats.map((stat, index) => (
          <Card 
            key={index}
            sx={{ 
              flex: isMobile ? '1 1 100%' : '1 1 calc(50% - 24px)',
              minWidth: isMobile ? '100%' : '300px',
              background: currentColors.card,
              border: `1px solid ${currentColors.border}`,
              borderRadius: '12px',
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Avatar sx={{ 
                  background: alpha(stat.color, 0.1), 
                  color: stat.color,
                  width: 48,
                  height: 48
                }}>
                  {stat.icon}
                </Avatar>
                <Box>
                  <Typography variant="h4" fontWeight="bold" color={currentColors.textPrimary}>
                    {stat.value}
                  </Typography>
                  <Typography variant="body2" color={currentColors.textSecondary}>
                    {stat.title}
                  </Typography>
                </Box>
              </Box>
              <Typography variant="caption" color={currentColors.textSecondary}>
                {stat.description}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
      
      <Card sx={{ 
        mt: 3,
        background: currentColors.card,
        border: `1px solid ${currentColors.border}`,
        borderRadius: '12px'
      }}>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" mb={3} color={currentColors.textPrimary}>
            Subscription Value Over Time
          </Typography>
          
          <Box sx={{ 
            height: 200, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            background: currentColors.surface,
            borderRadius: 2
          }}>
            <Box sx={{ textAlign: 'center' }}>
              <Timeline sx={{ fontSize: 48, color: primaryColor, mb: 2 }} />
              <Typography variant="body1" color={currentColors.textSecondary}>
                Subscription value analytics visualization
              </Typography>
              <Typography variant="caption" color={currentColors.textSecondary}>
                Total lifetime value: ₹1,388
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default UsageAnalyticsCard;