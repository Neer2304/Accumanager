// components/DevelopmentModeBanner.tsx
'use client'

import React, { useState, useEffect } from 'react';
import {
  Alert,
  AlertTitle,
  Box,
  Typography,
  Button,
  Chip,
  Collapse,
  IconButton,
} from '@mui/material';
import {
  Construction,
  Warning,
  BugReport,
  Code,
  Close,
  Notifications,
  Info,
} from '@mui/icons-material';
import { useAuth } from '@/hooks/useAuth';

interface DevelopmentModeBannerProps {
  showAlways?: boolean;
}

const DevelopmentModeBanner: React.FC<DevelopmentModeBannerProps> = ({
  showAlways = true,
}) => {
  const [visible, setVisible] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const { user } = useAuth();

  // Check if we're in development mode
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  // Don't show if not in dev mode and not forced to show
  if (!isDevelopment && !showAlways) {
    return null;
  }

  if (!visible) {
    return null;
  }

  return (
    <Box sx={{ position: 'sticky', top: 0, zIndex: 1000, mb: 2 }}>
      <Alert
        severity="warning"
        icon={<Construction />}
        sx={{
          borderRadius: 1,
          border: '2px solid',
          borderColor: 'warning.main',
          bgcolor: 'warning.light',
          '& .MuiAlert-message': { width: '100%' },
        }}
        action={
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => setExpanded(!expanded)}
            >
              <Info />
            </IconButton>
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => setVisible(false)}
            >
              <Close />
            </IconButton>
          </Box>
        }
      >
        <AlertTitle>
          <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
            🚧 DEVELOPMENT PREVIEW - NOT FOR PRODUCTION USE
            <Chip
              label="ALPHA"
              size="small"
              color="warning"
              variant="outlined"
              sx={{ ml: 1 }}
            />
            <Chip
              label="TEST DATA ONLY"
              size="small"
              color="error"
              variant="outlined"
            />
          </Box>
        </AlertTitle>
        
        <Typography variant="body2" sx={{ mb: 1 }}>
          This application is under active development. <strong>DO NOT USE REAL DATA.</strong>
        </Typography>
        
        <Box display="flex" gap={1} flexWrap="wrap" mt={1}>
          <Chip
            icon={<Warning />}
            label="Use test data only"
            size="small"
            variant="outlined"
            color="error"
          />
          <Chip
            icon={<BugReport />}
            label="Expect bugs & instability"
            size="small"
            variant="outlined"
            color="default"
          />
          <Chip
            icon={<Code />}
            label="Development build"
            size="small"
            variant="outlined"
            color="info"
          />
        </Box>

        <Collapse in={expanded}>
          <Box sx={{ mt: 2, p: 2, bgcolor: 'warning.50', borderRadius: 1 }}>
            <Typography variant="caption" display="block" gutterBottom>
              <strong>User:</strong> {user?.name} ({user?.email})
            </Typography>
            <Typography variant="caption" display="block" gutterBottom>
              <strong>Disclaimer Accepted:</strong> Yes
            </Typography>
            <Typography variant="caption" display="block">
              <strong>Remember:</strong> This is a demo system. Data may be reset. Features may change.
              Never enter real customer or financial information.
            </Typography>
          </Box>
        </Collapse>
      </Alert>
    </Box>
  );
};

export default DevelopmentModeBanner;