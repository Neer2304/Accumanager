// components/googleanalytics/components/AnalyticsErrorState.tsx
import React from 'react';
import {
  Container,
  Box,
  useTheme
} from '@mui/material';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { AnalyticsSkeleton } from '@/components/analytics/AnalyticsSkeleton';

interface AnalyticsErrorStateProps {
  error: string;
  onRetry: () => void;
  darkMode: boolean;
}

export const AnalyticsErrorState: React.FC<AnalyticsErrorStateProps> = ({ 
  error, 
  onRetry, 
  darkMode 
}) => {
  return (
    <Container maxWidth="xl">
      <Alert
        severity="error"
        title="Error Loading Analytics"
        message={error}
        action={
          <Button
            variant="outlined"
            onClick={onRetry}
            sx={{
              borderColor: darkMode ? '#3c4043' : '#dadce0',
              color: darkMode ? '#e8eaed' : '#202124',
            }}
          >
            Retry
          </Button>
        }
        sx={{ mb: 3 }}
      />
      <AnalyticsSkeleton darkMode={darkMode} />
    </Container>
  );
};