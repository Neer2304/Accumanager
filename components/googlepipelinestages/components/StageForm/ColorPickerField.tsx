// components/googlepipelinestages/components/StageForm/ColorPickerField.tsx
import React from 'react';
import {
  Box,
  Button,
  useTheme,
  alpha
} from '@mui/material';
import { ColorLens as ColorLensIcon } from '@mui/icons-material';
import { ChromePicker } from 'react-color';

interface ColorPickerFieldProps {
  color: string;
  open: boolean;
  onToggle: () => void;
  onChange: (color: any) => void;
  onClose: () => void;
}

export const ColorPickerField: React.FC<ColorPickerFieldProps> = ({
  color,
  open,
  onToggle,
  onChange,
  onClose
}) => {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';

  return (
    <Box sx={{ position: 'relative' }}>
      <Button
        variant="outlined"
        startIcon={<ColorLensIcon />}
        onClick={onToggle}
        sx={{
          height: 40,
          borderRadius: '12px',
          borderColor: darkMode ? '#3c4043' : '#dadce0',
          color: color,
          bgcolor: alpha(color, 0.1),
          '&:hover': {
            bgcolor: alpha(color, 0.2),
          }
        }}
      >
        Color
      </Button>
      {open && (
        <Box sx={{ position: 'absolute', top: 50, right: 0, zIndex: 10 }}>
          <Box
            sx={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 9
            }}
            onClick={onClose}
          />
          <ChromePicker
            color={color}
            onChange={onChange}
          />
        </Box>
      )}
    </Box>
  );
};