// components/googlecommunity/BookmarksPage.tsx
'use client';

import React from 'react';
import {
  Container,
  Box,
  Alert,
  useTheme
} from '@mui/material';
import { MainLayout } from '@/components/Layout/MainLayout';
import { useBookmarks } from './hooks/useBookmarks';
import { BookmarksHeader } from './components/BookmarksHeader';
import { BookmarksStats } from './components/BookmarksStats';
import { BookmarksList } from './components/BookmarksList';
import { BookmarksTips } from './components/BookmarksTips';
import { LoadingState } from './components/LoadingState';
import { EmptyBookmarksState } from './components/EmptyBookmarksState';

function BookmarksContent() {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';
  
  const {
    bookmarkedPosts,
    loading,
    error,
    stats,
    handleRemoveBookmark,
    handleClearAll,
    loadBookmarks,
    setError
  } = useBookmarks();

  return (
    <Box sx={{ 
      backgroundColor: darkMode ? '#202124' : '#ffffff', 
      minHeight: '100vh',
      py: { xs: 2, md: 4 },
    }}>
      <Container maxWidth="lg">
        <BookmarksHeader darkMode={darkMode} />

        {/* Stats */}
        {!loading && bookmarkedPosts.length > 0 && (
          <BookmarksStats stats={stats} darkMode={darkMode} />
        )}

        {/* Loading State */}
        {loading && <LoadingState />}

        {/* Error State */}
        {error && !loading && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 3, 
              borderRadius: 2,
              bgcolor: darkMode ? '#3c1e1e' : '#fdecea',
            }}
            onClose={() => setError(null)}
          >
            {error}
          </Alert>
        )}

        {/* No Bookmarks State */}
        {!loading && bookmarkedPosts.length === 0 && !error && (
          <EmptyBookmarksState darkMode={darkMode} />
        )}

        {/* Bookmarks List */}
        {!loading && bookmarkedPosts.length > 0 && !error && (
          <>
            <BookmarksList
              bookmarkedPosts={bookmarkedPosts}
              onRemoveBookmark={handleRemoveBookmark}
              onClearAll={handleClearAll}
              onRefresh={loadBookmarks}
              loading={loading}
              darkMode={darkMode}
            />
            
            {/* Tips Section */}
            <BookmarksTips darkMode={darkMode} />
          </>
        )}
      </Container>
    </Box>
  );
}

// Main exported component with layout wrapper
export default function BookmarksPage() {
  return (
    <MainLayout title="My Bookmarks">
      <BookmarksContent />
    </MainLayout>
  );
}