// components/googleapidocs/components/EmptyApiState.tsx
import React from 'react';
import {
  Box,
  Typography,
  useTheme
} from '@mui/material';
import {
  Code as CodeIcon
} from '@mui/icons-material';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface EmptyApiStateProps {
  onClearFilters: () => void;
  darkMode: boolean;
}

export const EmptyApiState: React.FC<EmptyApiStateProps> = ({ onClearFilters, darkMode }) => {
  return (
    <Card sx={{ 
      textAlign: 'center', 
      py: 6,
      px: 3,
      mt: 4,
      backgroundColor: darkMode ? '#303134' : '#ffffff',
      border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
    }}>
      <CodeIcon sx={{ fontSize: 60, color: darkMode ? '#9aa0a6' : '#5f6368', mb: 2 }} />
      
      <Typography variant="h6" gutterBottom sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
        No APIs Found
      </Typography>
      
      <Typography variant="body2" sx={{ 
        mb: 3,
        maxWidth: 500,
        mx: 'auto',
        color: darkMode ? '#9aa0a6' : '#5f6368',
      }}>
        Try adjusting your search or filter criteria
      </Typography>
      
      <Button 
        onClick={onClearFilters}
        variant="outlined"
        sx={{
          borderColor: darkMode ? '#3c4043' : '#dadce0',
          color: darkMode ? '#e8eaed' : '#202124',
        }}
      >
        Clear Filters
      </Button>
    </Card>
  );
};