// components/googlecommunity/components/BookmarksList.tsx
import React from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  useTheme,
  alpha
} from '@mui/material';
import {
  Bookmark as BookmarkIcon
} from '@mui/icons-material';
import Link from 'next/link';
import { PostType } from '@/types/community';
import { BookmarkCard } from './BookmarkCard';
import { ClearAllButton } from './ClearAllButton';

interface BookmarksListProps {
  bookmarkedPosts: PostType[];
  onRemoveBookmark: (postId: string) => void;
  onClearAll: () => void;
  onRefresh: () => void;
  loading: boolean;
  darkMode: boolean;
}

export const BookmarksList: React.FC<BookmarksListProps> = ({
  bookmarkedPosts,
  onRemoveBookmark,
  onClearAll,
  onRefresh,
  loading,
  darkMode
}) => {
  if (bookmarkedPosts.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <BookmarkIcon sx={{ fontSize: 64, color: darkMode ? '#5f6368' : '#9aa0a6', mb: 2, opacity: 0.5 }} />
        <Typography variant="h6" sx={{ color: darkMode ? '#e8eaed' : '#202124' }} gutterBottom>
          All bookmarks cleared
        </Typography>
        <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', mb: 3 }}>
          Your bookmarks list is now empty
        </Typography>
        <Button
          variant="outlined"
          component={Link}
          href="/community"
          sx={{
            borderColor: darkMode ? '#3c4043' : '#dadce0',
            color: darkMode ? '#e8eaed' : '#202124',
            '&:hover': {
              borderColor: '#4285f4',
              backgroundColor: alpha('#4285f4', darkMode ? 0.1 : 0.05),
            },
          }}
        >
          Browse Community
        </Button>
      </Box>
    );
  }

  return (
    <>
      {/* Results Header */}
      <Paper sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 3,
        p: 2,
        borderRadius: 2,
        bgcolor: darkMode ? '#303134' : '#f8f9fa',
        border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
      }}>
        <Typography variant="body1" fontWeight={600} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
          <span style={{ color: '#4285f4' }}>{bookmarkedPosts.length}</span> bookmarked posts
        </Typography>
        <ClearAllButton
          onClick={onClearAll}
          disabled={loading}
          count={bookmarkedPosts.length}
        />
      </Paper>

      {/* Posts List */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {bookmarkedPosts.map((post) => (
          <BookmarkCard
            key={post._id}
            post={post}
            onRemove={onRemoveBookmark}
            darkMode={darkMode}
          />
        ))}
      </Box>

      {/* Refresh Button */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Button
          variant="outlined"
          onClick={onRefresh}
          disabled={loading}
          sx={{ 
            borderRadius: 2, 
            px: 4,
            borderColor: darkMode ? '#3c4043' : '#dadce0',
            color: darkMode ? '#e8eaed' : '#202124',
            '&:hover': {
              borderColor: '#4285f4',
              backgroundColor: alpha('#4285f4', darkMode ? 0.1 : 0.05),
            },
          }}
        >
          {loading ? 'Loading...' : 'Refresh Bookmarks'}
        </Button>
      </Box>
    </>
  );
};