// components/admin/dashboard/StatsOverview.tsx
import React from 'react';
import { Box } from '@mui/material';
import {
  People,
  AccountBalance,
  AccessTime,
  TrendingUp,
} from '@mui/icons-material';
import { StatsCard } from '@/components/admin/common/StatsCard';

interface StatsOverviewProps {
  totalUsers: number;
  activeUsers: number;
  trialUsers: number;
  revenue: number;
  totalUsageHours: number;
  avgDailyUsage: number;
  peakConcurrentUsers: number;
  userGrowth?: number;
  revenueGrowth?: number;
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({
  totalUsers,
  activeUsers,
  trialUsers,
  revenue,
  totalUsageHours,
  avgDailyUsage,
  peakConcurrentUsers,
  userGrowth,
  revenueGrowth,
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-IN').format(num);
  };

  const formatTime = (hours: number) => {
    if (!hours || hours === 0) return '0h';
    if (hours < 1) return `${Math.round(hours * 60)}m`;
    if (hours < 24) return `${Math.round(hours)}h`;
    const days = Math.floor(hours / 24);
    const remainingHours = Math.round(hours % 24);
    return `${days}d ${remainingHours}h`;
  };

  return (
    <Box sx={{ 
      display: 'grid', 
      gridTemplateColumns: { 
        xs: '1fr', 
        sm: 'repeat(2, 1fr)', 
        lg: 'repeat(4, 1fr)' 
      }, 
      gap: 3 
    }}>
      <Box>
        <StatsCard
          title="Total Users"
          value={formatNumber(totalUsers)}
          subtitle={`${activeUsers} active`}
          icon={<People fontSize="large" />}
          color="#1a73e8"
          trend={userGrowth}
          trendLabel="vs last period"
        />
      </Box>
      
      <Box>
        <StatsCard
          title="Total Revenue"
          value={formatCurrency(revenue)}
          icon={<AccountBalance fontSize="large" />}
          color="#34a853"
          trend={revenueGrowth}
          trendLabel="growth"
        />
      </Box>
      
      <Box>
        <StatsCard
          title="Total Usage"
          value={formatTime(totalUsageHours)}
          subtitle={`${formatTime(avgDailyUsage)}/day avg`}
          icon={<AccessTime fontSize="large" />}
          color="#fbbc04"
          trendLabel={`Peak: ${peakConcurrentUsers} users`}
        />
      </Box>
      
      <Box>
        <StatsCard
          title="Trial Users"
          value={trialUsers}
          subtitle={`${totalUsers > 0 ? ((trialUsers / totalUsers) * 100).toFixed(1) : 0}% of total`}
          icon={<TrendingUp fontSize="large" />}
          color="#8b5cf6"
          trendLabel="Conversion tracking"
        />
      </Box>
    </Box>
  );
};