// components/googlecommunity/components/BookmarksHeader.tsx
import React from 'react';
import {
  Box,
  Typography,
  Button,
  alpha,
  useTheme
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Bookmark as BookmarkIcon
} from '@mui/icons-material';
import Link from 'next/link';

interface BookmarksHeaderProps {
  darkMode: boolean;
}

export const BookmarksHeader: React.FC<BookmarksHeaderProps> = ({ darkMode }) => {
  return (
    <>
      <Button
        component={Link}
        href="/community"
        startIcon={<ArrowBackIcon />}
        sx={{ 
          mb: 3,
          color: darkMode ? '#e8eaed' : '#202124',
          '&:hover': {
            backgroundColor: alpha('#4285f4', darkMode ? 0.1 : 0.05),
          },
        }}
      >
        Back to Community
      </Button>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 64,
          height: 64,
          borderRadius: '50%',
          bgcolor: alpha('#4285f4', darkMode ? 0.2 : 0.1),
        }}>
          <BookmarkIcon sx={{ 
            fontSize: { xs: 32, md: 40 }, 
            color: '#4285f4',
          }} />
        </Box>
        <Box>
          <Typography variant="h4" fontWeight={500} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
            My Bookmarks
          </Typography>
          <Typography sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }} variant="body1">
            Posts you've saved for later
          </Typography>
        </Box>
      </Box>
    </>
  );
};