// components/googleapidocs/components/ApiAuthAlert.tsx
import React from 'react';
import {
  useTheme
} from '@mui/material';
import Link from 'next/link';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';

interface ApiAuthAlertProps {
  darkMode: boolean;
}

export const ApiAuthAlert: React.FC<ApiAuthAlertProps> = ({ darkMode }) => {
  return (
    <Alert
      severity="info"
      title="🔑 Authentication Required"
      message="All API requests require authentication. Get your API key from Settings."
      action={
        <Button
          variant="outlined"
          component={Link} 
          href="/dashboard/settings/api"
          sx={{
            borderColor: darkMode ? '#3c4043' : '#dadce0',
            color: darkMode ? '#e8eaed' : '#202124',
          }}
          size="small"
        >
          Get API Key
        </Button>
      }
      sx={{ mb: 3 }}
    />
  );
};