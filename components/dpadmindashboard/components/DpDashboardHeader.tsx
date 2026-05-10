
// components/dpadmindashboard/components/DpDashboardHeader.tsx
import React from 'react';
import { Box, Typography } from '@mui/material';
import { dpColors } from './types';
import GoogleAMLogo from '@/components/GoogleAMLogo';

export const DpDashboardHeader: React.FC = () => {
  const currentHour = new Date().getHours();
  let greeting = 'Good ';
  if (currentHour < 12) greeting += 'Morning';
  else if (currentHour < 18) greeting += 'Afternoon';
  else greeting += 'Evening';

  return (
    <Box sx={{ mb: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
        <GoogleAMLogo size={48} darkMode={true} />
        <Box>
          <Typography variant="h4" fontWeight={800} sx={{ color: dpColors.ink, letterSpacing: '-0.02em' }}>
            {greeting}, Merc with a Mouth! 🦸
          </Typography>
          <Typography variant="body1" sx={{ color: dpColors.inkSub }}>
            Welcome back to your Maximum Effort Admin Dashboard
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};