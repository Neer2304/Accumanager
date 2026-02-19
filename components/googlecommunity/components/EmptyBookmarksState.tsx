// components/googlecommunity/components/EmptyBookmarksState.tsx
import React from 'react';
import {
  Paper,
  Typography,
  Button,
  Box,
  useTheme
} from '@mui/material';
import {
  BookmarkBorder as BookmarkBorderIcon
} from '@mui/icons-material';
import Link from 'next/link';

interface EmptyBookmarksStateProps {
  darkMode: boolean;
}

export const EmptyBookmarksState: React.FC<EmptyBookmarksStateProps> = ({ darkMode }) => {
  return (
    <Paper sx={{ 
      p: 8, 
      textAlign: 'center', 
      borderRadius: 3,
      bgcolor: darkMode ? '#303134' : '#f8f9fa',
      border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
    }}>
      <BookmarkBorderIcon sx={{ 
        fontSize: 80, 
        color: darkMode ? '#5f6368' : '#9aa0a6', 
        mb: 2, 
        opacity: 0.5 
      }} />
      <Typography variant="h5" fontWeight={500} gutterBottom sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
        No bookmarks yet
      </Typography>
      <Typography sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }} paragraph>
        When you find posts you want to save for later, click the bookmark icon to add them here.
      </Typography>
      <Button
        variant="contained"
        component={Link}
        href="/community"
        sx={{ 
          borderRadius: 2, 
          px: 4, 
          py: 1.5,
          backgroundColor: '#4285f4',
          '&:hover': {
            backgroundColor: '#3367d6',
          },
        }}
      >
        Explore Community
      </Button>
    </Paper>
  );
};