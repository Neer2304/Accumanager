import React from 'react';
import {
  Box,
  Typography,
  Button,
} from '@mui/material';
import {
  People,
  Refresh,
} from '@mui/icons-material';

interface UsersHeaderProps {
  title: string;
  subtitle?: string;
  onRefresh: () => void;
  loading?: boolean;
}

export const UsersHeader: React.FC<UsersHeaderProps> = ({
  title,
  subtitle,
  onRefresh,
  loading = false,
}) => {
  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: { xs: 'column', sm: 'row' }, 
      justifyContent: 'space-between', 
      alignItems: { xs: 'flex-start', sm: 'center' }, 
      mb: 4,
      gap: 2,
    }}>
      <Box>
        <Typography 
          variant="h4" 
          component="h1" 
          fontWeight="bold" 
          gutterBottom
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <People />
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="body1" color="text.secondary">
            {subtitle}
          </Typography>
        )}
      </Box>
      
      <Button 
        variant="outlined" 
        startIcon={<Refresh />}
        onClick={onRefresh}
        disabled={loading}
        size="small"
      >
        Refresh
      </Button>
    </Box>
  );
};