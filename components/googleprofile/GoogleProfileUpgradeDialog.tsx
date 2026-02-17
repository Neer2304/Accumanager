// components/googleprofile/GoogleProfileUpgradeDialog.tsx
'use client'

import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Paper,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material'
import {
  Check as CheckIcon,
  Star as StarIcon,
} from '@mui/icons-material'
import { PRICING_PLANS, getPlanColor } from './utils'

interface GoogleProfileUpgradeDialogProps {
  open: boolean
  onClose: () => void
  currentPlan?: string
  onUpgrade: (plan: string) => void
  darkMode?: boolean
}

export default function GoogleProfileUpgradeDialog({
  open,
  onClose,
  currentPlan = 'trial',
  onUpgrade,
  darkMode,
}: GoogleProfileUpgradeDialogProps) {
  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '16px',
          backgroundColor: darkMode ? '#303134' : '#ffffff',
          border: darkMode ? '1px solid #3c4043' : '1px solid #dadce0',
          maxHeight: '90vh',
        }
      }}
    >
      <DialogTitle sx={{ 
        backgroundColor: darkMode ? '#202124' : '#f8f9fa',
        borderBottom: darkMode ? '1px solid #3c4043' : '1px solid #dadce0',
        py: 2,
        px: 3,
      }}>
        <Box>
          <Typography variant="h5" component="div" fontWeight={600} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
            Upgrade Your Plan
          </Typography>
          <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', mt: 0.5 }}>
            Choose the plan that best fits your business needs
          </Typography>
        </Box>
      </DialogTitle>
      
      <DialogContent sx={{ p: 3 }}>
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: 'repeat(3, 1fr)' }, 
          gap: 3,
          mt: 1,
        }}>
          {Object.entries(PRICING_PLANS).map(([planKey, plan]) => {
            if (planKey === 'trial') return null;
            
            const isCurrentPlan = currentPlan === planKey;
            
            return (
              <Paper 
                key={planKey}
                elevation={0}
                sx={{ 
                  height: '100%',
                  border: isCurrentPlan ? 2 : 1,
                  borderColor: isCurrentPlan 
                    ? '#4285f4' 
                    : (darkMode ? '#3c4043' : '#dadce0'),
                  borderRadius: '12px',
                  overflow: 'hidden',
                  position: 'relative',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: darkMode 
                      ? '0 8px 32px rgba(0, 0, 0, 0.3)'
                      : '0 8px 32px rgba(0, 0, 0, 0.1)',
                  },
                  ...(plan.popular && {
                    border: 2,
                    borderColor: '#34a853',
                  })
                }}
              >
                {plan.popular && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      backgroundColor: '#34a853',
                      color: 'white',
                      px: 2,
                      py: 0.5,
                      borderBottomLeftRadius: '8px',
                      fontSize: '0.75rem',
                      fontWeight: 500,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5,
                    }}
                  >
                    <StarIcon fontSize="inherit" />
                    Most Popular
                  </Box>
                )}
                
                <Box sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: darkMode ? '#e8eaed' : '#202124', mb: 1 }}>
                      {plan.name}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5 }}>
                      <Typography variant="h4" sx={{ fontWeight: 700, color: getPlanColor(planKey) }}>
                        ₹{plan.price}
                      </Typography>
                      <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                        {planKey === 'monthly' && '/month'}
                        {planKey === 'quarterly' && '/quarter'}
                        {planKey === 'yearly' && '/year'}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Divider sx={{ borderColor: darkMode ? '#3c4043' : '#dadce0', mb: 3 }} />
                  
                  <Box sx={{ flex: 1, mb: 3 }}>
                    <List dense disablePadding>
                      {plan.features.map((feature: string, index: number) => (
                        <ListItem key={index} disablePadding sx={{ mb: 1.5 }}>
                          <ListItemIcon sx={{ minWidth: 32 }}>
                            <CheckIcon fontSize="small" sx={{ color: '#34a853' }} />
                          </ListItemIcon>
                          <ListItemText 
                            primary={feature} 
                            primaryTypographyProps={{ 
                              variant: 'body2',
                              sx: { color: darkMode ? '#e8eaed' : '#202124' }
                            }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                  
                  <Button
                    variant={isCurrentPlan ? "outlined" : "contained"}
                    fullWidth
                    disabled={isCurrentPlan}
                    onClick={() => onUpgrade(planKey)}
                    sx={{ 
                      borderRadius: '12px',
                      backgroundColor: isCurrentPlan ? 'transparent' : '#4285f4',
                      color: isCurrentPlan 
                        ? (darkMode ? '#8ab4f8' : '#1a73e8')
                        : 'white',
                      borderColor: isCurrentPlan 
                        ? (darkMode ? '#8ab4f8' : '#1a73e8')
                        : 'transparent',
                      fontWeight: 500,
                      py: 1.5,
                      "&:hover": {
                        backgroundColor: isCurrentPlan 
                          ? (darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.1)')
                          : '#3367d6',
                        borderColor: isCurrentPlan 
                          ? (darkMode ? '#8ab4f8' : '#1a73e8')
                          : 'transparent',
                      },
                    }}
                  >
                    {isCurrentPlan ? 'Current Plan' : `Upgrade to ${plan.name}`}
                  </Button>
                </Box>
              </Paper>
            );
          })}
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ 
        px: 3,
        py: 2,
        borderTop: darkMode ? '1px solid #3c4043' : '1px solid #dadce0',
      }}>
        <Button 
          onClick={onClose}
          sx={{ 
            color: darkMode ? '#9aa0a6' : '#5f6368',
            fontWeight: 500,
            borderRadius: '12px',
            px: 3,
            py: 1,
          }}
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  )
}