"use client";

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemIcon,
  Divider,
  RadioGroup,
  FormControlLabel,
  Radio,
  ListItemText,
} from '@mui/material';
import { Button2 } from '../ui/button2';
import { CombinedIcon } from '../ui/icons2';
import { Card2 } from '../ui/card2';
import { PricingPlan } from '@/types/settings';

interface UpgradeDialogProps {
  open: boolean;
  onClose: () => void;
  onUpgrade: (planId: string) => void;
}

export const UpgradeDialog: React.FC<UpgradeDialogProps> = ({
  open,
  onClose,
  onUpgrade,
}) => {
  const [selectedPlan, setSelectedPlan] = useState('monthly');

  const plans: PricingPlan[] = [
    {
      id: 'monthly',
      name: 'Monthly',
      price: 499,
      features: [
        'Up to 100 Products',
        'Up to 500 Customers',
        'Basic Analytics',
        'Email Support',
        '1GB Storage',
        'Basic Reports'
      ],
      color: '#667eea'
    },
    {
      id: 'quarterly',
      name: 'Quarterly',
      price: 1299,
      features: [
        'Up to 500 Products',
        'Up to 2000 Customers',
        'Advanced Analytics',
        'Priority Support',
        '5GB Storage',
        'Advanced Reports',
        'Custom Branding'
      ],
      color: '#764ba2',
      popular: true
    },
    {
      id: 'yearly',
      name: 'Yearly',
      price: 3999,
      features: [
        'Unlimited Products',
        'Unlimited Customers',
        'Full Analytics Suite',
        '24/7 Priority Support',
        '20GB Storage',
        'Custom Reports',
        'API Access',
        'White Label',
        'Dedicated Account Manager'
      ],
      color: '#48bb78'
    }
  ];

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: { borderRadius: 3, overflow: 'hidden' }
      }}
    >
      <DialogTitle sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="h4" component="div" fontWeight="bold" gutterBottom>
          Upgrade Your Plan
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Choose the perfect plan for your business growth
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ py: 3 }}>
        <RadioGroup
          value={selectedPlan}
          onChange={(e) => setSelectedPlan(e.target.value)}
          sx={{ mb: 3 }}
        >
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
            {plans.map((plan) => (
              <Box key={plan.id} sx={{ flex: 1, position: 'relative' }}>
                {plan.popular && (
                  <Chip
                    label="Most Popular"
                    color="primary"
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: -12,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      fontWeight: 'bold',
                      zIndex: 1,
                    }}
                  />
                )}
                <FormControlLabel
                  value={plan.id}
                  control={<Radio sx={{ display: 'none' }} />}
                  label={
                    <Card2
                      sx={{
                        p: 3,
                        border: 2,
                        borderColor: selectedPlan === plan.id ? plan.color : 'divider',
                        backgroundColor: selectedPlan === plan.id ? `${plan.color}10` : 'transparent',
                        cursor: 'pointer',
                        transition: 'all 0.3s',
                        '&:hover': {
                          borderColor: plan.color,
                          transform: 'translateY(-2px)',
                        },
                        ...(plan.popular && {
                          borderColor: plan.color,
                          boxShadow: `0 0 20px ${plan.color}20`,
                        })
                      }}
                    >
                      <Box sx={{ textAlign: 'center', mb: 2 }}>
                        <Typography variant="h5" fontWeight="bold" gutterBottom>
                          {plan.name}
                        </Typography>
                        <Typography variant="h3" color={plan.color} fontWeight="bold" gutterBottom>
                          ₹{plan.price}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {plan.id === 'monthly' && 'per month'}
                          {plan.id === 'quarterly' && 'per quarter'}
                          {plan.id === 'yearly' && 'per year'}
                        </Typography>
                      </Box>

                      <Divider sx={{ my: 2 }} />

                      <List dense>
                        {plan.features.map((feature, index) => (
                          <ListItem key={index} sx={{ px: 0, py: 0.5 }}>
                            <ListItemIcon sx={{ minWidth: 32 }}>
                              <CombinedIcon name="CheckCircle" size={16} sx={{ color: plan.color }} />
                            </ListItemIcon>
                            <ListItemText
                              primary={feature} 
                              primaryTypographyProps={{ variant: 'body2' }}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </Card2>
                  }
                  sx={{ m: 0, width: '100%' }}
                />
              </Box>
            ))}
          </Box>
        </RadioGroup>

        <Card2 sx={{ p: 3, borderRadius: 2, backgroundColor: 'background.default' }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Payment Methods
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Chip 
              label="UPI" 
              icon={<CombinedIcon name="QrCode" size={16} />} 
              variant="outlined" 
              size="small" 
            />
            <Chip 
              label="Credit/Debit Card" 
              icon={<CombinedIcon name="CreditCard" size={16} />} 
              variant="outlined" 
              size="small" 
            />
            <Chip 
              label="Net Banking" 
              icon={<CombinedIcon name="Payment" size={16} />} 
              variant="outlined" 
              size="small" 
            />
          </Box>
        </Card2>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2, borderTop: 1, borderColor: 'divider' }}>
        <Button2 onClick={onClose} variant="outlined">
          Cancel
        </Button2>
        <Button2
          variant="contained"
          onClick={() => onUpgrade(selectedPlan)}
          sx={{ ml: 1 }}
        >
          Upgrade Now
        </Button2>
      </DialogActions>
    </Dialog>
  );
};