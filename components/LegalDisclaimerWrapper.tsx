// components/LegalDisclaimerWrapper.tsx
'use client'

import React from 'react';
import { useLegalDisclaimer } from '@/hooks/useLegalDisclaimer';
import LegalDisclaimerModal from '@/components/LegalDisclaimerModal';
import { Box, CircularProgress, Typography } from '@mui/material';

interface LegalDisclaimerWrapperProps {
  children: React.ReactNode;
}

const LegalDisclaimerWrapper: React.FC<LegalDisclaimerWrapperProps> = ({ children }) => {
  const { showDisclaimer, handleAcceptDisclaimer } = useLegalDisclaimer();
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    // Small delay to ensure the check is complete
    const timer = setTimeout(() => {
      setLoading(false);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <CircularProgress />
        <Typography variant="body2" color="text.secondary">
          Loading application...
        </Typography>
      </Box>
    );
  }

  return (
    <>
      {showDisclaimer ? (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: 'background.default',
            zIndex: 9999,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {/* <LegalDisclaimerModal
            open={showDisclaimer}
            onAccept={handleAcceptDisclaimer}
          /> */}
        </Box>
      ) : (
        children
      )}
    </>
  );
};

export default LegalDisclaimerWrapper;