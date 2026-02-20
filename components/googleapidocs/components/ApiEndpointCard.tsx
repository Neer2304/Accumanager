// components/googleapidocs/components/ApiEndpointCard.tsx
import React from 'react';
import {
  Box,
  Typography,
  Divider,
  Collapse,
  IconButton,
  Tooltip,
  Fade,
  useTheme,
  alpha
} from '@mui/material';
import {
    ContentCopy,
  ExpandMore,
  Lock
} from '@mui/icons-material';
import { Card } from '@/components/ui/Card';
import { Chip } from '@/components/ui/Chip';
import { Endpoint } from './types';
import { ApiParameters } from './ApiParameters';
import { ApiExamples } from './ApiExamples';

interface ApiEndpointCardProps {
  endpoint: Endpoint;
  isExpanded: boolean;
  onToggle: () => void;
  onCopy: (text: string) => void;
  getMethodColor: (method: string) => string;
  darkMode: boolean;
}

export const ApiEndpointCard: React.FC<ApiEndpointCardProps> = ({
  endpoint,
  isExpanded,
  onToggle,
  onCopy,
  getMethodColor,
  darkMode
}) => {
  return (
    <Fade in>
      <Card
        hover
        sx={{
          backgroundColor: darkMode ? '#303134' : '#ffffff',
          border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
          borderRadius: '16px',
          overflow: 'hidden',
        }}
      >
        <Box sx={{ p: { xs: 2, sm: 3 } }}>
          {/* Endpoint Header */}
          <Box
            sx={{
              cursor: 'pointer',
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: { xs: 'flex-start', sm: 'center' },
              justifyContent: 'space-between',
              gap: { xs: 1, sm: 0 },
              mb: isExpanded ? 2 : 0,
            }}
            onClick={onToggle}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1, width: '100%' }}>
              <Chip
                label={endpoint.method}
                size="small"
                sx={{
                  backgroundColor: getMethodColor(endpoint.method),
                  color: 'white',
                  fontWeight: 600,
                  minWidth: 70,
                }}
              />
              
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography 
                  variant="h6" 
                  fontWeight={600}
                  sx={{ 
                    mb: 0.5,
                    wordBreak: 'break-word'
                  }}
                >
                  {endpoint.title}
                </Typography>
                
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                  sx={{ 
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}
                >
                  {endpoint.description}
                </Typography>
              </Box>
            </Box>
            
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1,
              mt: { xs: 1, sm: 0 },
              width: { xs: '100%', sm: 'auto' }
            }}>
              <Chip
                label={endpoint.category}
                size="small"
                variant="outlined"
              />
              
              {endpoint.requiresAuth && (
                <Tooltip title="Requires authentication">
                  <Lock sx={{ color: '#fbbc04' }} />
                </Tooltip>
              )}
              
              <ExpandMore
                sx={{
                  transform: isExpanded ? 'rotate(180deg)' : 'none',
                  transition: 'transform 0.3s ease',
                }}
              />
            </Box>
          </Box>

          {/* Expanded Content */}
          <Collapse in={isExpanded}>
            <Divider sx={{ my: 2 }} />

            {/* Path */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                Endpoint
              </Typography>
              
              <Card
                hover
                sx={{
                  p: 2,
                  backgroundColor: darkMode ? '#1e293b' : '#f8fafc',
                  fontFamily: 'monospace',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  overflow: 'auto',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
                  <span style={{ 
                    color: getMethodColor(endpoint.method), 
                    fontWeight: 600,
                    minWidth: 50
                  }}>
                    {endpoint.method}
                  </span>
                  
                  <span style={{ 
                    marginLeft: 8,
                    flex: 1,
                    wordBreak: 'break-all'
                  }}>
                    https://api.accumamanage.com{endpoint.path}
                  </span>
                </Box>
                
                <Tooltip title="Copy endpoint">
                  <IconButton 
                    size="small" 
                    onClick={() => onCopy(`https://api.accumamanage.com${endpoint.path}`)}
                  >
                    <ContentCopy />
                  </IconButton>
                </Tooltip>
              </Card>
            </Box>

            {/* Parameters */}
            {endpoint.parameters && endpoint.parameters.length > 0 && (
              <ApiParameters parameters={endpoint.parameters} darkMode={darkMode} />
            )}

            {/* Examples */}
            <ApiExamples
              request={endpoint.exampleRequest}
              response={endpoint.exampleResponse}
              onCopy={onCopy}
              darkMode={darkMode}
            />
          </Collapse>
        </Box>
      </Card>
    </Fade>
  );
};