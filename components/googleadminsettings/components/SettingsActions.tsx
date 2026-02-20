// components/googleadminsettings/components/SettingsActions.tsx
import React from 'react';
import {
  Paper,
  Box,
  Button,
  CircularProgress,
  useTheme
} from '@mui/material';
import {
  Save as SaveIcon,
  Restore as RestoreIcon
} from '@mui/icons-material';

interface SettingsActionsProps {
  onSave: () => void;
  onReset?: () => void;
  saving?: boolean;
  saveLabel?: string;
  resetLabel?: string;
}

export const SettingsActions: React.FC<SettingsActionsProps> = ({
  onSave,
  onReset,
  saving = false,
  saveLabel = 'Save Settings',
  resetLabel = 'Reset to Defaults',
}) => {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';

  return (
    <Paper 
      elevation={0}
      sx={{ 
        p: { xs: 2, sm: 3 },
        mt: 3,
        borderRadius: '16px',
        backgroundColor: darkMode ? '#303134' : '#ffffff',
        border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
      }}
    >
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'flex-end', 
        gap: 2,
        flexDirection: { xs: 'column', sm: 'row' }
      }}>
        {onReset && (
          <Button
            variant="outlined"
            startIcon={<RestoreIcon />}
            onClick={onReset}
            disabled={saving}
            sx={{
              borderRadius: '8px',
              borderColor: darkMode ? '#3c4043' : '#dadce0',
              color: darkMode ? '#e8eaed' : '#202124',
              '&:hover': {
                borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                backgroundColor: darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.1)',
              },
            }}
          >
            {resetLabel}
          </Button>
        )}
        <Button
          variant="contained"
          startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
          onClick={onSave}
          disabled={saving}
          size="large"
          sx={{
            backgroundColor: '#1a73e8',
            '&:hover': { backgroundColor: '#1669c1' },
            borderRadius: '8px',
            px: 4,
          }}
        >
          {saving ? 'Saving...' : saveLabel}
        </Button>
      </Box>
    </Paper>
  );
};