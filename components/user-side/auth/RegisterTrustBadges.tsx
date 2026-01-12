import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

interface RegisterTrustBadgesProps {
  badges?: string[];
}

const RegisterTrustBadges: React.FC<RegisterTrustBadgesProps> = ({
  badges = ['SSL Secure', 'GDPR Compliant', '99.9% Uptime'],
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 2,
        alignItems: 'center',
        justifyContent: { xs: 'center', md: 'flex-start' },
        mt: 'auto',
      }}
    >
      {badges.map((badge) => (
        <Paper
          key={badge}
          elevation={0}
          sx={{
            px: 2,
            py: 1,
            borderRadius: 20,
            bgcolor: 'primary.lighter',
            border: '1px solid',
            borderColor: 'primary.light',
          }}
        >
          <Typography variant="caption" fontWeight="500">
            {badge}
          </Typography>
        </Paper>
      ))}
    </Box>
  );
};

export default RegisterTrustBadges;