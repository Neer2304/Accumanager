// components/googleapidocs/components/ApiExamples.tsx
import React from 'react';
import {
  Box,
  Typography,
  IconButton,
  Tooltip,
  useTheme
} from '@mui/material';
import {
  ContentCopy as ContentCopyIcon
} from '@mui/icons-material';
import { Card } from '@/components/ui/Card';

interface ApiExamplesProps {
  request?: string;
  response?: string;
  onCopy: (text: string) => void;
  darkMode: boolean;
}

export const ApiExamples: React.FC<ApiExamplesProps> = ({
  request,
  response,
  onCopy,
  darkMode
}) => {
  return (
    <Box sx={{ 
      display: 'flex',
      flexDirection: { xs: 'column', md: 'row' },
      gap: 3 
    }}>
      {request && (
        <Box sx={{ flex: 1 }}>
          <Typography variant="subtitle2" fontWeight={600} gutterBottom>
            Example Request
          </Typography>
          
          <Card
            hover
            sx={{
              p: 2,
              backgroundColor: darkMode ? '#1e293b' : '#f8fafc',
              fontFamily: 'monospace',
              whiteSpace: 'pre-wrap',
              position: 'relative',
              maxHeight: 200,
              overflow: 'auto',
            }}
          >
            {request}
            
            <Tooltip title="Copy example">
              <IconButton 
                size="small" 
                sx={{ 
                  position: 'absolute', 
                  top: 8, 
                  right: 8 
                }}
                onClick={() => onCopy(request)}
              >
                <ContentCopyIcon />
              </IconButton>
            </Tooltip>
          </Card>
        </Box>
      )}

      {response && (
        <Box sx={{ flex: 1 }}>
          <Typography variant="subtitle2" fontWeight={600} gutterBottom>
            Example Response
          </Typography>
          
          <Card
            hover
            sx={{
              p: 2,
              backgroundColor: darkMode ? '#1e293b' : '#f8fafc',
              fontFamily: 'monospace',
              whiteSpace: 'pre-wrap',
              position: 'relative',
              maxHeight: 200,
              overflow: 'auto',
            }}
          >
            {response}
            
            <Tooltip title="Copy example">
              <IconButton 
                size="small" 
                sx={{ 
                  position: 'absolute', 
                  top: 8, 
                  right: 8 
                }}
                onClick={() => onCopy(response)}
              >
                <ContentCopyIcon />
              </IconButton>
            </Tooltip>
          </Card>
        </Box>
      )}
    </Box>
  );
};