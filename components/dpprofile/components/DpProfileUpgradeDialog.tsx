// components/dpprofile/components/DpProfileUpgradeDialog.tsx
'use client';

import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Typography, Button, Paper, Box, List, ListItem, ListItemIcon, ListItemText, Divider } from '@mui/material';
import { Check as CheckIcon, Star as StarIcon } from '@mui/icons-material';
import { PRICING_PLANS, dpColors } from '../types';

export const DpProfileUpgradeDialog: React.FC<DpProfileUpgradeDialogProps> = ({ open, onClose, currentPlan = 'trial', onUpgrade, darkMode }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth PaperProps={{ sx: { borderRadius: '24px', backgroundColor: dpColors.surface, border: `2px solid ${dpColors.border}` } }}>
      <DialogTitle sx={{ backgroundColor: dpColors.surface2, borderBottom: `2px solid ${dpColors.border}` }}>
        <Typography variant="h5" fontWeight={800} sx={{ color: dpColors.red, letterSpacing: '-0.02em' }}>Upgrade Your Plan! 🦸</Typography>
        <Typography variant="body2" sx={{ color: dpColors.inkSub }}>Choose the plan that best fits your maximum effort needs</Typography>
      </DialogTitle>
      <DialogContent sx={{ p: 3 }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: 'repeat(3, 1fr)' }, gap: 3 }}>
          {Object.entries(PRICING_PLANS).map(([planKey, plan]) => {
            if (planKey === 'trial') return null;
            const isCurrentPlan = currentPlan === planKey;
            return (
              <Paper key={planKey} elevation={0} sx={{ height: '100%', border: isCurrentPlan ? 2 : 1, borderColor: isCurrentPlan ? dpColors.red : dpColors.border, borderRadius: '16px', overflow: 'hidden', position: 'relative', transition: 'all 0.3s ease', '&:hover': { transform: 'translateY(-4px)', borderColor: dpColors.red }, ...(plan.popular && { border: 2, borderColor: dpColors.red }) }}>
                {plan.popular && (<Box sx={{ position: 'absolute', top: 0, right: 0, backgroundColor: dpColors.red, color: '#fff', px: 2, py: 0.5, borderBottomLeftRadius: '8px', fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 0.5 }}><StarIcon fontSize="inherit" /> Most Popular</Box>)}
                <Box sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ mb: 3 }}><Typography variant="h6" fontWeight={800} sx={{ color: dpColors.ink, mb: 1 }}>{plan.name}</Typography><Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5 }}><Typography variant="h4" fontWeight={800} sx={{ color: dpColors.red }}>₹{plan.price}</Typography><Typography variant="body2" sx={{ color: dpColors.inkSub }}>{planKey === 'monthly' ? '/month' : planKey === 'quarterly' ? '/quarter' : '/year'}</Typography></Box></Box>
                  <Divider sx={{ borderColor: dpColors.border, mb: 3 }} />
                  <Box sx={{ flex: 1, mb: 3 }}><List dense disablePadding>{plan.features.map((feature: string, idx: number) => (<ListItem key={idx} disablePadding sx={{ mb: 1.5 }}><ListItemIcon sx={{ minWidth: 32 }}><CheckIcon fontSize="small" sx={{ color: '#34a853' }} /></ListItemIcon><ListItemText primary={feature} primaryTypographyProps={{ variant: 'body2', sx: { color: dpColors.ink } }} /></ListItem>))}</List></Box>
                  <Button variant={isCurrentPlan ? "outlined" : "contained"} fullWidth disabled={isCurrentPlan} onClick={() => onUpgrade(planKey)} sx={{ borderRadius: '12px', backgroundColor: isCurrentPlan ? 'transparent' : dpColors.red, color: isCurrentPlan ? dpColors.red : '#fff', borderColor: isCurrentPlan ? dpColors.red : 'transparent', fontWeight: 700, py: 1.5, '&:hover': { backgroundColor: isCurrentPlan ? dpColors.redSoft : dpColors.redHov } }}>{isCurrentPlan ? 'Current Plan' : `Upgrade to ${plan.name}`}</Button>
                </Box>
              </Paper>
            );
          })}
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2, borderTop: `2px solid ${dpColors.border}` }}><Button onClick={onClose} sx={{ color: dpColors.inkSub }}>Cancel</Button></DialogActions>
    </Dialog>
  );
};