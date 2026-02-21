// components/googleadmindashboard/components/DashboardHeader.tsx
import React from 'react';
import {
  Box,
  Typography,
  useTheme,
  alpha
} from '@mui/material';
import {
  AdminPanelSettings
} from '@mui/icons-material';

interface DashboardHeaderProps {
  userName?: string;
  darkMode: boolean;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  userName = 'Admin',
  darkMode
}) => {
  const currentHour = new Date().getHours();
  let greeting = 'Good ';
  
  if (currentHour < 12) greeting += 'Morning';
  else if (currentHour < 18) greeting += 'Afternoon';
  else greeting += 'Evening';

  return (
    <Box sx={{ mb: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
        <Box sx={{
          width: 48,
          height: 48,
          borderRadius: '16px',
          backgroundColor: darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: darkMode ? '#8ab4f8' : '#1a73e8',
        }}>
          <AdminPanelSettings />
        </Box>
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