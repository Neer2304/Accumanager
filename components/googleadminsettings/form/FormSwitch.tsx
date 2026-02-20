// components/googleadminsettings/form/FormSwitch.tsx
import React from 'react';
import {
  FormControlLabel,
  Switch,
  Box,
  Typography,
  useTheme,
  alpha
} from '@mui/material';

interface FormSwitchProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  helper?: string;
  disabled?: boolean;
}

export const FormSwitch: React.FC<FormSwitchProps> = ({
  label,
  checked,
  onChange,
  helper,
  disabled = false,
}) => {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';

  return (
    <Box>
      <FormControlLabel
        control={
          <Switch
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
            disabled={disabled}
            sx={{
              '& .MuiSwitch-switchBase.Mui-checked': {
                color: '#1a73e8',
              },
              '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                backgroundColor: '#1a73e8',
              },
            }}
          />
        }
        label={
          <Typography sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
            {label}
          </Typography>
        }
      />
      {helper && (
        <Typography 
          variant="caption" 
          sx={{ 
            ml: 7, 
            display: 'block',
            color: darkMode ? '#9aa0a6' : '#5f6368'
          }}
        >
          {helper}
        </Typography>
      )}
    </Box>
  );
};