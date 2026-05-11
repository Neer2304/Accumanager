// components/proprofile/components/ProProfileUpgradeDialog.tsx
'use client';

import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Typography, Button, Paper, Box, List, ListItem, ListItemIcon, ListItemText, Divider } from '@mui/material';
import { Check as CheckIcon, Star as StarIcon } from '@mui/icons-material';
import { PRICING_PLANS, getPlanColor } from '../utils';

interface ProProfileUpgradeDialogProps {
  open: boolean;
  onClose: () => void;
  currentPlan?: string;
  onUpgrade: (plan: string) => void;
  darkMode?: boolean;
}

export const ProProfileUpgradeDialog: React.FC<ProProfileUpgradeDialogProps> = ({ open, onClose, currentPlan = 'trial', onUpgrade, darkMode }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth PaperProps={{ sx: { borderRadius: '16px', backgroundColor: darkMode ? '#303134' : '#ffffff', border: darkMode ? '1px solid #3c4043' : '1px solid #dadce0' } }}>
      <DialogTitle sx={{ backgroundColor: darkMode ? '#202124' : '#f8f9fa', borderBottom: darkMode ? '1px solid #3c4043' : '1px solid #dadce0' }}><Typography variant="h5" fontWeight={600} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>Upgrade Your Plan</Typography><Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>Choose the plan that best fits your business needs</Typography></DialogTitle>
      <DialogContent sx={{ p: 3 }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: 'repeat(3, 1fr)' }, gap: 3 }}>
          {Object.entries(PRICING_PLANS).map(([planKey, plan]) => {
            if (planKey === 'trial') return null;
            const isCurrentPlan = currentPlan === planKey;
            return (
              <Paper key={planKey} elevation={0} sx={{ height: '100%', border: isCurrentPlan ? 2 : 1, borderColor: isCurrentPlan ? '#1a73e8' : (darkMode ? '#3c4043' : '#dadce0'), borderRadius: '12px', overflow: 'hidden', position: 'relative', transition: 'all 0.3s ease', '&:hover': { transform: 'translateY(-4px)' }, ...(plan.popular && { border: 2, borderColor: '#34a853' }) }}>
                {plan.popular && (<Box sx={{ position: 'absolute', top: 0, right: 0, backgroundColor: '#34a853', color: 'white', px: 2, py: 0.5, borderBottomLeftRadius: '8px', fontSize: '0.75rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 0.5 }}><StarIcon fontSize="inherit" /> Most Popular</Box>)}
                <Box sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ mb: 3 }}><Typography variant="h6" fontWeight={600} sx={{ color: darkMode ? '#e8eaed' : '#202124', mb: 1 }}>{plan.name}</Typography><Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5 }}><Typography variant="h4" fontWeight={700} sx={{ color: getPlanColor(planKey) }}>₹{plan.price}</Typography><Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>{planKey === 'monthly' ? '/month' : planKey === 'quarterly' ? '/quarter' : '/year'}</Typography></Box></Box>
                  <Divider sx={{ borderColor: darkMode ? '#3c4043' : '#dadce0', mb: 3 }} />
                  <Box sx={{ flex: 1, mb: 3 }}><List dense disablePadding>{plan.features.map((feature: string, idx: number) => (<ListItem key={idx} disablePadding sx={{ mb: 1.5 }}><ListItemIcon sx={{ minWidth: 32 }}><CheckIcon fontSize="small" sx={{ color: '#34a853' }} /></ListItemIcon><ListItemText primary={feature} primaryTypographyProps={{ variant: 'body2', sx: { color: darkMode ? '#e8eaed' : '#202124' } }} /></ListItem>))}</List></Box>
                  <Button variant={isCurrentPlan ? "outlined" : "contained"} fullWidth disabled={isCurrentPlan} onClick={() => onUpgrade(planKey)} sx={{ borderRadius: '12px', backgroundColor: isCurrentPlan ? 'transparent' : '#1a73e8', color: isCurrentPlan ? (darkMode ? '#8ab4f8' : '#1a73e8') : 'white', borderColor: isCurrentPlan ? (darkMode ? '#8ab4f8' : '#1a73e8') : 'transparent', fontWeight: 500, py: 1.5, '&:hover': { backgroundColor: isCurrentPlan ? (darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.1)') : '#1557b0' } }}>{isCurrentPlan ? 'Current Plan' : `Upgrade to ${plan.name}`}</Button>
                </Box>
              </Paper>
            );
          })}
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2, borderTop: darkMode ? '1px solid #3c4043' : '1px solid #dadce0' }}><Button onClick={onClose} sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', borderRadius: '12px', px: 3 }}>Cancel</Button></DialogActions>
    </Dialog>
  );
};