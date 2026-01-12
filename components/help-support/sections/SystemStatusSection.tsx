import React from 'react';
import { Alert, Typography } from '@mui/material';
import { HELP_SUPPORT_CONTENT } from '../HelpSupportContent';

export const SystemStatusSection = () => {
  const { systemStatus } = HELP_SUPPORT_CONTENT;

  return (
    <Alert severity="success" sx={{ mt: 4, mb: 2 }}>
      <Typography variant="body1" fontWeight="600">
        {systemStatus.title}
      </Typography>
      <Typography variant="body2">
        {systemStatus.description}
      </Typography>
    </Alert>
  );
};