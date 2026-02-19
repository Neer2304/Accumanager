// components/googlecommunity/components/BookmarksTips.tsx
import React from 'react';
import {
  Paper,
  Typography,
  Box,
  Divider,
  useTheme
} from '@mui/material';
import {
  Bookmark as BookmarkIcon
} from '@mui/icons-material';

interface BookmarksTipsProps {
  darkMode: boolean;
}

export const BookmarksTips: React.FC<BookmarksTipsProps> = ({ darkMode }) => {
  const tips = [
    {
      icon: '📌',
      title: 'Organize by Category',
      description: 'Bookmark posts by categories like "Tutorials", "Questions", or "Inspiration" for easy reference.'
    },
    {
      icon: '🔄',
      title: 'Review Regularly',
      description: 'Periodically review your bookmarks and remove posts you no longer need to keep your list relevant.'
    },
    {
      icon: '💬',
      title: 'Engage with Bookmarks',
      description: 'Revisit bookmarked posts to add comments, ask follow-up questions, or share with others.'
    }
  ];

  return (
    <Paper sx={{ 
      p: 3, 
      mt: 4, 
      borderRadius: 3,
      bgcolor: darkMode ? '#303134' : '#f8f9fa',
      border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
        <BookmarkIcon sx={{ color: '#4285f4' }} />
        <Typography variant="h6" fontWeight={600} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
          Tips for Managing Bookmarks
        </Typography>
      </Box>
      <Divider sx={{ my: 2, borderColor: darkMode ? '#3c4043' : '#dadce0' }} />
      <Box sx={{ 
        display: 'flex', 
        flexWrap: 'wrap',
        gap: 3,
        justifyContent: 'space-between'
      }}>
        {tips.map((tip, index) => (
          <Box key={index} sx={{ flex: '1 1 250px', minWidth: 250 }}>
            <Typography variant="subtitle2" fontWeight={600} gutterBottom sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
              {tip.icon} {tip.title}
            </Typography>
            <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
              {tip.description}
            </Typography>
          </Box>
        ))}
      </Box>
    </Paper>
  );
};