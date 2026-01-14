// components/DevelopmentBanner.tsx
'use client'

import React from 'react';
import {
  Alert,
  AlertTitle,
  Box,
  Typography,
  Button,
  Chip,
} from '@mui/material';
import { Construction, Warning, BugReport, Code } from '@mui/icons-material';

interface DevelopmentBannerProps {
  showInProduction?: boolean;
}

const DevelopmentBanner: React.FC<DevelopmentBannerProps> = ({
  showInProduction = false,
}) => {
  const [visible, setVisible] = React.useState(true);

  // In production, you might want to hide this banner
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  if (!isDevelopment && !showInProduction) {
    return null;
  }

  if (!visible) {
    return null;
  }

  return (
    <Box sx={{ position: 'relative', mb: 2 }}>
      <Alert
        severity="warning"
        icon={<Construction />}
        sx={{
          borderRadius: 1,
          border: '2px solid',
          borderColor: 'warning.main',
          bgcolor: 'warning.light',
        }}
        action={
          <Button
            color="inherit"
            size="small"
            onClick={() => setVisible(false)}
          >
            Dismiss
          </Button>
        }
      >
        <AlertTitle>
          <Box display="flex" alignItems="center" gap={1}>
            🚧 DEVELOPMENT PREVIEW
            <Chip
              label="ALPHA"
              size="small"
              color="warning"
              variant="outlined"
              sx={{ ml: 1 }}
            />
          </Box>
        </AlertTitle>
        
        <Typography variant="body2" sx={{ mb: 1 }}>
          This application is under active development. Features may be incomplete or unstable.
        </Typography>
        
        <Box display="flex" gap={1} flexWrap="wrap" mt={1}>
          <Chip
            icon={<Warning />}
            label="Do not use real data"
            size="small"
            variant="outlined"
            color="error"
          />
          <Chip
            icon={<BugReport />}
            label="Expect bugs"
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
      </Alert>
    </Box>
  );
};

export default DevelopmentBanner;