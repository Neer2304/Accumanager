// components/googlecompaniescreate/components/FormActions.tsx
import React from 'react';
import {
  Box,
  CircularProgress,
  useTheme
} from '@mui/material';
import {
  Save as SaveIcon
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { GOOGLE_COLORS } from '../constants';

interface FormActionsProps {
  loading: boolean;
  onCancel: () => void;
  darkMode: boolean;
}

export const FormActions: React.FC<FormActionsProps> = ({
  loading,
  onCancel,
  darkMode
}) => {
  return (
    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
      <Box
        component="button"
        type="button"
        onClick={onCancel}
        sx={{
          px: 4,
          py: 1.5,
          border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
          borderRadius: '24px',
          backgroundColor: 'transparent',
          color: darkMode ? '#e8eaed' : '#202124',
          fontSize: '0.875rem',
          fontWeight: 500,
          cursor: 'pointer',
          transition: 'all 0.2s',
          '&:hover': {
            backgroundColor: darkMode ? '#303134' : '#f1f3f4',
          },
        }}
      >
        Cancel
      </Box>
      <Box
        component="button"
        type="submit"
        disabled={loading}
        sx={{
          px: 4,
          py: 1.5,
          border: 'none',
          borderRadius: '24px',
          backgroundColor: GOOGLE_COLORS.blue,
          color: '#ffffff',
          fontSize: '0.875rem',
          fontWeight: 500,
          cursor: loading ? 'not-allowed' : 'pointer',
          transition: 'all 0.2s',
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          opacity: loading ? 0.7 : 1,
          '&:hover': {
            backgroundColor: loading ? GOOGLE_COLORS.blue : '#1a5cb0',
          },
        }}
      >
        {loading ? (
          <>
            <CircularProgress size={16} sx={{ color: '#ffffff' }} />
            Creating...
          </>
        ) : (
          <>
            <SaveIcon sx={{ fontSize: 18 }} />
            Create Company
          </>
        )}
      </Box>
    </Box>
  );
};