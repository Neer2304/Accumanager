// components/proadmindashboard/components/ProDashboardHeader.tsx
import React from 'react';
import { Box, Typography } from '@mui/material';
// import { AdminPanelSettings } from '@mui/icons-material';
import GoogleAMLogo from '@/components/GoogleAMLogo';

interface DashboardHeaderProps {
  userName?: string;
  darkMode: boolean;
}

export const ProDashboardHeader: React.FC<DashboardHeaderProps> = ({ userName = 'Admin', darkMode }) => {
  const currentHour = new Date().getHours();
  let greeting = 'Good ';
  if (currentHour < 12) greeting += 'Morning';
  else if (currentHour < 18) greeting += 'Afternoon';
  else greeting += 'Evening';

  return (
    <Box sx={{ mb: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
        <GoogleAMLogo size={48} darkMode={darkMode} />
        <Box>
          <Typography variant="h4" fontWeight={500} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
            {greeting}, {userName}!
          </Typography>
          <Typography variant="body1" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
            Welcome back to your admin dashboard
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};