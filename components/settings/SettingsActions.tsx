import React from 'react';
import {
  Paper,
  Box,
  Button,
  CircularProgress,
} from '@mui/material';
import { Save, Restore } from '@mui/icons-material';

interface SettingsActionsProps {
  onSave: () => void;
  onReset?: () => void;
  saving?: boolean;
  saveLabel?: string;
  resetLabel?: string;
}

const SettingsActions: React.FC<SettingsActionsProps> = ({
  onSave,
  onReset,
  saving = false,
  saveLabel = 'Save Settings',
  resetLabel = 'Reset to Defaults',
}) => {
  return (
    <Paper sx={{ p: 3, mt: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        {onReset && (
          <Button
            variant="outlined"
            startIcon={<Restore />}
            onClick={onReset}
            disabled={saving}
          >
            {resetLabel}
          </Button>
        )}
        <Button
          variant="contained"
          startIcon={saving ? <CircularProgress size={20} /> : <Save />}
          onClick={onSave}
          disabled={saving}
          size="large"
        >
          {saving ? 'Saving...' : saveLabel}
        </Button>
      </Box>
    </Paper>
  );
};

export default SettingsActions;