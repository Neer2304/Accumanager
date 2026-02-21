// components/googleadminproductid/components/ProductActionButtons.tsx
import React from 'react';
import {
  Stack,
  Button,
  useTheme
} from '@mui/material';
import {
  Print,
  Download,
  Share
} from '@mui/icons-material';

interface ProductActionButtonsProps {
  onPrint?: () => void;
  onExport?: () => void;
  onShare?: () => void;
}

export const ProductActionButtons: React.FC<ProductActionButtonsProps> = ({
  onPrint,
  onExport,
  onShare
}) => {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';

  return (
    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="flex-end" sx={{ mt: 4 }}>
      {onPrint && (
        <Button
          variant="outlined"
          startIcon={<Print />}
          onClick={onPrint}
          sx={{
            borderColor: darkMode ? '#3c4043' : '#dadce0',
            color: darkMode ? '#e8eaed' : '#202124',
            borderRadius: '24px',
            px: 3,
            '&:hover': {
              borderColor: darkMode ? '#5f6368' : '#bdc1c6',
              backgroundColor: darkMode ? '#2d2f31' : '#f1f3f4',
            }
          }}
        >
          Print
        </Button>
      )}
      
      {onExport && (
        <Button
          variant="outlined"
          startIcon={<Download />}
          onClick={onExport}
          sx={{
            borderColor: darkMode ? '#3c4043' : '#dadce0',
            color: darkMode ? '#e8eaed' : '#202124',
            borderRadius: '24px',
            px: 3,
            '&:hover': {
              borderColor: darkMode ? '#5f6368' : '#bdc1c6',
              backgroundColor: darkMode ? '#2d2f31' : '#f1f3f4',
            }
          }}
        >
          Export
        </Button>
      )}
      
      {onShare && (
        <Button
          variant="contained"
          startIcon={<Share />}
          onClick={onShare}
          sx={{
            backgroundColor: darkMode ? '#34a853' : '#34a853',
            color: '#ffffff',
            borderRadius: '24px',
            px: 3,
            '&:hover': {
              backgroundColor: darkMode ? '#2e8b47' : '#2e8b47',
            }
          }}
        >
          Share
        </Button>
      )}
    </Stack>
  );
};