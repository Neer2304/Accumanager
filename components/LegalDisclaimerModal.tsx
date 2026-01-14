// components/LegalDisclaimerModal.tsx
'use client'

import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Checkbox,
  FormControlLabel,
  Alert,
  Divider,
  Paper,
} from '@mui/material';
import {
  Warning,
  CheckCircle,
  Security,
  Gavel,
  ArrowForward,
  ArrowBack,
} from '@mui/icons-material';

interface LegalDisclaimerModalProps {
  open: boolean;
  userData: {
    name: string;
    email: string;
  };
  onAccept: () => void;
  onReject: () => void;
}

const LegalDisclaimerModal: React.FC<LegalDisclaimerModalProps> = ({
  open,
  userData,
  onAccept,
  onReject,
}) => {
  const [checked, setChecked] = useState(false);
  const [scrolledToBottom, setScrolledToBottom] = useState(false);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const bottom = target.scrollHeight - target.scrollTop === target.clientHeight;
    setScrolledToBottom(bottom);
  };

  return (
    <Dialog
      open={open}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          maxHeight: '80vh',
        },
      }}
    >
      <DialogTitle sx={{ bgcolor: 'warning.light', py: 2 }}>
        <Box display="flex" alignItems="center" gap={2}>
          <Warning sx={{ fontSize: 32 }} color="warning" />
          <Box>
            <Typography variant="h5" fontWeight="bold">
              ⚠️ IMPORTANT: DEVELOPMENT PREVIEW
            </Typography>
            <Typography variant="body2">
              Welcome, {userData.name}! Please read this carefully.
            </Typography>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          <Typography variant="subtitle1" fontWeight="bold">
            🚨 THIS IS NOT A PRODUCTION SYSTEM
          </Typography>
          <Typography variant="body2">
            This application is under active development. DO NOT use real data.
          </Typography>
        </Alert>

        <Paper variant="outlined" sx={{ p: 2, mb: 3, bgcolor: 'grey.50' }}>
          <Typography variant="h6" gutterBottom color="error.main">
            🔴 CRITICAL WARNINGS:
          </Typography>
          <ul style={{ paddingLeft: 20, marginBottom: 0 }}>
            <li>
              <Typography variant="body2">
                <strong>DO NOT USE REAL DATA:</strong> Any information entered may be wiped during development updates.
              </Typography>
            </li>
            <li>
              <Typography variant="body2">
                <strong>NOT FOR BUSINESS USE:</strong> This is a demo system only. Do not rely on it for actual business operations.
              </Typography>
            </li>
            <li>
              <Typography variant="body2">
                <strong>NO GUARANTEES:</strong> Features may be incomplete, buggy, or removed without notice.
              </Typography>
            </li>
          </ul>
        </Paper>

        <Typography variant="body1" paragraph>
          By proceeding, you acknowledge that this is a <strong>development preview</strong> of AccuManage and should only be used for testing/demonstration purposes.
        </Typography>

        <Typography variant="body2" color="text.secondary" paragraph fontStyle="italic">
          The developers assume no liability for any issues arising from the use of this application during its development phase.
        </Typography>
      </DialogContent>

      <Box onScroll={handleScroll} sx={{ maxHeight: 200, overflow: 'auto', p: 3 }}>
        <Typography variant="caption" color="text.secondary">
          <strong>FINAL ACKNOWLEDGMENT:</strong> I understand that this is not a production-ready system. 
          I will not enter real customer data, financial information, or sensitive business data. 
          I accept that features may be unstable and data may be lost during development updates.
        </Typography>
      </Box>

      <Divider />

      <DialogActions sx={{ p: 3, flexDirection: 'column', gap: 2 }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={checked}
              onChange={(e) => setChecked(e.target.checked)}
              disabled={!scrolledToBottom}
              color="primary"
            />
          }
          label={
            <Typography variant="body2">
              I have read and understood all warnings above
              {!scrolledToBottom && (
                <Typography variant="caption" color="error" display="block" sx={{ mt: 0.5 }}>
                  (Please scroll to the bottom to enable)
                </Typography>
              )}
            </Typography>
          }
          sx={{ width: '100%', mb: 1 }}
        />

        <Box sx={{ display: 'flex', gap: 2, width: '100%' }}>
          <Button
            variant="outlined"
            color="error"
            onClick={onReject}
            startIcon={<ArrowBack />}
            sx={{ flex: 1 }}
          >
            I DO NOT ACCEPT
          </Button>
          
          <Button
            variant="contained"
            color="primary"
            onClick={onAccept}
            disabled={!checked}
            endIcon={<ArrowForward />}
            sx={{ flex: 1 }}
          >
            I ACCEPT & PROCEED
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default LegalDisclaimerModal;