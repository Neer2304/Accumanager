// components/dpadmindashboard/components/DpDashboardCard.tsx
import React from 'react';
import { Card, CardContent, Box, Typography, Chip, alpha } from '@mui/material';
import { ChevronRight as ChevronRightIcon } from '@mui/icons-material';
import { AdminCardItem, dpColors } from './types';

interface DashboardCardProps extends AdminCardItem {
  onClick: (path: string) => void;
}

export const DpDashboardCard: React.FC<DashboardCardProps> = ({ title, description, icon, path, stats, onClick }) => {
  return (
    <Card onClick={() => onClick(path)} sx={{
      cursor: 'pointer', borderRadius: '20px', backgroundColor: dpColors.surface, border: `2px solid ${dpColors.border}`,
      transition: 'all 0.2s ease', height: '100%', display: 'flex', flexDirection: 'column',
      '&:hover': { transform: 'translateY(-4px)', boxShadow: `0 8px 24px ${alpha(dpColors.red, 0.3)}`, borderColor: dpColors.red }
    }}>
      <CardContent sx={{ p: 3, flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ width: 48, height: 48, borderRadius: '12px', backgroundColor: alpha(dpColors.red, 0.15), display: 'flex', alignItems: 'center', justifyContent: 'center', color: dpColors.red }}>{icon}</Box>
          <ChevronRightIcon sx={{ color: dpColors.inkMuted }} />
        </Box>
        <Typography variant="h6" fontWeight={800} sx={{ color: dpColors.ink, mb: 1 }}>{title}</Typography>
        <Typography variant="body2" sx={{ color: dpColors.inkSub, mb: 2, flex: 1 }}>{description}</Typography>
        {stats && (<Box sx={{ mt: 'auto' }}><Chip label={stats} size="small" sx={{ backgroundColor: alpha(dpColors.red, 0.15), color: dpColors.red, border: 'none', fontWeight: 700 }} /></Box>)}
      </CardContent>
    </Card>
  );
};