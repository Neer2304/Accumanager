import { Box, CircularProgress } from '@mui/material';

interface LoadingStateProps {
  height?: number | string;
  size?: number;
}

export const LoadingState = ({ height = 400, size = 40 }: LoadingStateProps) => (
  <Box sx={{ 
    p: 3, 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    minHeight: height 
  }}>
    <CircularProgress size={size} />
  </Box>
);