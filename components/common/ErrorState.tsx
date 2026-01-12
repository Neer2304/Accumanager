import { Alert, Button, Box } from '@mui/material';

interface ErrorStateProps {
  error: string;
  onRetry?: () => void;
  retryText?: string;
}

export const ErrorState = ({ error, onRetry, retryText = "Retry" }: ErrorStateProps) => (
  <Box sx={{ p: 3 }}>
    <Alert severity="error" sx={{ mb: 2 }}>
      {error}
    </Alert>
    {onRetry && (
      <Button onClick={onRetry} variant="contained">
        {retryText}
      </Button>
    )}
  </Box>
);