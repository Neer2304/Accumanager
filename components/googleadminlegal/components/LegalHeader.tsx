// components/googleadminlegal/components/LegalHeader.tsx (FIXED - Minimal margins)
import React from 'react';
import {
  Box,
  Typography,
  Button,
  useTheme
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  Gavel as GavelIcon
} from '@mui/icons-material';

interface LegalHeaderProps {
  title: string;
  onRefresh: () => void;
  loading: boolean;
}

export const LegalHeader: React.FC<LegalHeaderProps> = ({ title, onRefresh, loading }) => {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';

  return (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      // No margins at all
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box sx={{
          width: 48,
          height: 48,
          borderRadius: '12px',
          backgroundColor: darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: darkMode ? '#8ab4f8' : '#1a73e8',
        }}>
          <GavelIcon />
        </Box>
        <Box>
          <Typography variant="h5" fontWeight={500} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
            {title}
          </Typography>
          <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
            Manage legal documents and policies
          </Typography>
        </Box>
      </Box>
      
      <Button
        startIcon={<RefreshIcon />}
        onClick={onRefresh}
        disabled={loading}
        variant="outlined"
        sx={{
          borderRadius: '8px',
          borderColor: darkMode ? '#3c4043' : '#dadce0',
          color: darkMode ? '#e8eaed' : '#202124',
          '&:hover': {
            borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
            backgroundColor: darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.1)',
          },
        }}
      >
        Refresh
      </Button>
    </Box>
  );
};