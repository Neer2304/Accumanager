// components/google/Pagination.tsx
"use client";

import React from 'react';
import {
  Box,
  Button,
  Typography,
  useTheme,
  SxProps,
  Theme,
} from '@mui/material';

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
  showFirstLast?: boolean;
  sx?: SxProps<Theme>;
}

export function Pagination({
  page,
  totalPages,
  onPageChange,
  siblingCount = 1,
  showFirstLast = false,
  sx,
}: PaginationProps) {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';

  if (totalPages <= 1) return null;

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        mt: 4,
        pt: 3,
        borderTop: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
        ...sx,
      }}
    >
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
        {showFirstLast && (
          <Button
            variant="outlined"
            onClick={() => onPageChange(0)}
            disabled={page === 0}
            size="small"
            sx={{
              borderRadius: '20px',
              px: 2.5,
              py: 0.75,
              borderColor: darkMode ? '#3c4043' : '#dadce0',
              color: darkMode ? '#e8eaed' : '#202124',
              textTransform: 'none',
              fontWeight: 500,
              '&:hover': {
                borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                backgroundColor: darkMode ? 'rgba(138, 180, 248, 0.05)' : 'rgba(26, 115, 232, 0.05)',
                color: darkMode ? '#8ab4f8' : '#1a73e8',
              },
            }}
          >
            First
          </Button>
        )}

        <Button
          variant="outlined"
          onClick={() => onPageChange(page - 1)}
          disabled={page === 0}
          size="small"
          sx={{
            borderRadius: '20px',
            px: 2.5,
            py: 0.75,
            borderColor: darkMode ? '#3c4043' : '#dadce0',
            color: darkMode ? '#e8eaed' : '#202124',
            textTransform: 'none',
            fontWeight: 500,
            '&:hover': {
              borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
              backgroundColor: darkMode ? 'rgba(138, 180, 248, 0.05)' : 'rgba(26, 115, 232, 0.05)',
              color: darkMode ? '#8ab4f8' : '#1a73e8',
            },
          }}
        >
          Previous
        </Button>

        <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', px: 2 }}>
          Page {page + 1} of {totalPages}
        </Typography>

        <Button
          variant="outlined"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages - 1}
          size="small"
          sx={{
            borderRadius: '20px',
            px: 2.5,
            py: 0.75,
            borderColor: darkMode ? '#3c4043' : '#dadce0',
            color: darkMode ? '#e8eaed' : '#202124',
            textTransform: 'none',
            fontWeight: 500,
            '&:hover': {
              borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
              backgroundColor: darkMode ? 'rgba(138, 180, 248, 0.05)' : 'rgba(26, 115, 232, 0.05)',
              color: darkMode ? '#8ab4f8' : '#1a73e8',
            },
          }}
        >
          Next
        </Button>

        {showFirstLast && (
          <Button
            variant="outlined"
            onClick={() => onPageChange(totalPages - 1)}
            disabled={page >= totalPages - 1}
            size="small"
            sx={{
              borderRadius: '20px',
              px: 2.5,
              py: 0.75,
              borderColor: darkMode ? '#3c4043' : '#dadce0',
              color: darkMode ? '#e8eaed' : '#202124',
              textTransform: 'none',
              fontWeight: 500,
              '&:hover': {
                borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                backgroundColor: darkMode ? 'rgba(138, 180, 248, 0.05)' : 'rgba(26, 115, 232, 0.05)',
                color: darkMode ? '#8ab4f8' : '#1a73e8',
              },
            }}
          >
            Last
          </Button>
        )}
      </Box>
    </Box>
  );
}