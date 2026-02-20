// components/googleapidocs/components/ApiUsageNotes.tsx
import React from 'react';
import {
  Box,
  Typography,
  useTheme
} from '@mui/material';
import { Card } from '@/components/ui/Card';

interface ApiUsageNotesProps {
  darkMode: boolean;
}

export const ApiUsageNotes: React.FC<ApiUsageNotesProps> = ({ darkMode }) => {
  return (
    <Card
      title="📋 API Usage Notes"
      subtitle="Important information for API consumers"
      hover
      sx={{
        mt: 4,
        backgroundColor: darkMode ? '#202124' : '#ffffff',
        border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
      }}
    >
      <Box sx={{ 
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        gap: 3,
        mt: 2,
      }}>
        <Box sx={{ flex: 1 }}>
          <Typography variant="subtitle2" gutterBottom sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
            🔑 Authentication
          </Typography>
          <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
            Include API key in header: <code>Authorization: Bearer YOUR_API_KEY</code>
          </Typography>
        </Box>
        
        <Box sx={{ flex: 1 }}>
          <Typography variant="subtitle2" gutterBottom sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
            ⚡ Rate Limiting
          </Typography>
          <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
            100 requests per minute per API key
          </Typography>
        </Box>
        
        <Box sx={{ flex: 1 }}>
          <Typography variant="subtitle2" gutterBottom sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
            🛡️ Error Handling
          </Typography>
          <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
            Returns JSON with status code and error message
          </Typography>
        </Box>
      </Box>
    </Card>
  );
};