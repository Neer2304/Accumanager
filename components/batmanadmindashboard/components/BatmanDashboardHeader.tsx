// components/batmanadmindashboard/components/BatmanDashboardHeader.tsx
import React from 'react';
import { Box, Typography } from '@mui/material';
import { batmanColors } from './types';
import GoogleAMLogo from '@/components/GoogleAMLogo';

export const BatmanDashboardHeader: React.FC = () => {
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
          <Typography 
            variant="h4" 
            fontWeight={800} 
            sx={{ 
              color: batmanColors.ink, 
              letterSpacing: '0.05em',
              textTransform: 'uppercase'
            }}
          >
            {greeting}, Dark Knight! 🦇
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ color: batmanColors.inkSub, letterSpacing: '0.03em' }}
          >
            Welcome back to the Batcomputer - Gotham&apos;s central command
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};