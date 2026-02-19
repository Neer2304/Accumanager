// components/googlecommunity/components/BookmarksStats.tsx
import React from 'react';
import {
  Paper,
  Typography,
  Box,
  alpha,
  useTheme
} from '@mui/material';

interface BookmarksStatsProps {
  stats: {
    total: number;
    solved: number;
    totalLikes: number;
    totalComments: number;
  };
  darkMode: boolean;
}

export const BookmarksStats: React.FC<BookmarksStatsProps> = ({ stats, darkMode }) => {
  const statItems = [
    { label: 'Total Bookmarks', value: stats.total, color: '#4285f4' },
    { label: 'Solved Posts', value: stats.solved, color: '#9c27b0' },
    { label: 'Total Likes', value: stats.totalLikes, color: '#34a853' },
    { label: 'Total Comments', value: stats.totalComments, color: '#00bcd4' }
  ];

  return (
    <Paper sx={{ 
      p: 3, 
      mb: 3,
      borderRadius: 3,
      bgcolor: darkMode ? '#303134' : '#f8f9fa',
      border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
    }}>
      <Box sx={{ 
        display: 'flex', 
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: 2,
      }}>
        {statItems.map((item, index) => (
          <Box key={index} sx={{ 
            flex: '1 1 120px', 
            minWidth: 120,
            textAlign: 'center',
            p: 1
          }}>
            <Typography variant="h4" fontWeight={500} color={item.color}>
              {item.value}
            </Typography>
            <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
              {item.label}
            </Typography>
          </Box>
        ))}
      </Box>
    </Paper>
  );
};