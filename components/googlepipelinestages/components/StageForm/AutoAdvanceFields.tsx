// components/googlepipelinestages/components/StageForm/AutoAdvanceFields.tsx
import React from 'react';
import {
  Box,
  Typography,
  FormControlLabel,
  Switch,
  TextField,
  useTheme
} from '@mui/material';
import { AutoAwesome as AutoAwesomeIcon } from '@mui/icons-material';

interface AutoAdvanceFieldsProps {
  autoAdvance: boolean;
  autoAdvanceDays: string;
  validationErrors: Record<string, string>;
  onSwitchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  darkMode: boolean;
}

export const AutoAdvanceFields: React.FC<AutoAdvanceFieldsProps> = ({
  autoAdvance,
  autoAdvanceDays,
  validationErrors,
  onSwitchChange,
  onInputChange,
  darkMode
}) => {
  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="subtitle2" fontWeight={500} sx={{ color: darkMode ? '#e8eaed' : '#202124', mb: 2 }}>
        <AutoAwesomeIcon sx={{ fontSize: 18, mr: 1, verticalAlign: 'middle', color: '#7c4dff' }} />
        Auto-Advance Settings
      </Typography>
      
      <FormControlLabel
        control={
          <Switch
            name="autoAdvance"
            checked={autoAdvance}
            onChange={onSwitchChange}
          />
        }
        label="Automatically advance deals after X days"
        sx={{ mb: 2 }}
      />

      {autoAdvance && (
        <TextField
          fullWidth
          label="Days to auto-advance *"
          name="autoAdvanceDays"
          type="number"
          value={autoAdvanceDays}
          onChange={onInputChange}
          error={!!validationErrors.autoAdvanceDays}
          helperText={validationErrors.autoAdvanceDays}
          size="small"
          InputProps={{
            inputProps: { min: 1 }
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '12px',
              bgcolor: darkMode ? '#303134' : '#fff',
            },
          }}
        />
      )}
    </Box>
  );
};