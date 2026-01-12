import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { Security } from '@mui/icons-material';
import { Icons } from '@/components/common/icons';

const LoginTrustIndicators: React.FC = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 2,
        alignItems: 'center',
        justifyContent: { xs: 'center', md: 'flex-start' },
      }}
    >
      <Paper
        elevation={0}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          px: 2,
          py: 1,
          borderRadius: 20,
          bgcolor: 'success.lighter',
          border: '1px solid',
          borderColor: 'success.light',
        }}
      >
        <Security sx={{ fontSize: 16, color: 'success.main' }} />
        <Typography variant="caption" fontWeight="500">
          Enterprise Security
        </Typography>
      </Paper>
      
      <Paper
        elevation={0}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          px: 2,
          py: 1,
          borderRadius: 20,
          bgcolor: 'info.lighter',
          border: '1px solid',
          borderColor: 'info.light',
        }}
      >
        <Icons.Success />
        <Typography variant="caption" fontWeight="500">
          99.9% Uptime
        </Typography>
      </Paper>
    </Box>
  );
};

export default LoginTrustIndicators;