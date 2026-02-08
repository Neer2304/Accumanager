// components/advance/sub-bill/UpgradePlanDialog.tsx
import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Paper,
  Box,
  Divider,
  Chip,
} from '@mui/material';
import {
  CheckCircle,
} from '@mui/icons-material';
import { alpha } from '@mui/material/styles';

interface UpgradePlanDialogProps {
  open: boolean;
  onClose: () => void;
  currentColors: any;
  primaryColor: string;
}

const UpgradePlanDialog: React.FC<UpgradePlanDialogProps> = ({
  open,
  onClose,
  currentColors,
  primaryColor,
}) => {
  const [selectedPlan, setSelectedPlan] = useState('pro');

  const plans = [
    {
      id: 'starter',
      name: 'Starter',
      price: 49,
      features: ['Basic Analytics', 'Up to 100 products', 'Email Support', '1 User'],
      description: 'Perfect for small businesses'
    },
    {
      id: 'basic',
      name: 'Basic',
      price: 99,
      features: ['Advanced Analytics', 'Unlimited products', 'Priority Support', '3 Users'],
      description: 'For growing businesses',
      isPopular: true
    },
    {
      id: 'pro',
      name: 'Professional',
      price: 199,
      features: ['All Basic features', 'Custom Reports', 'Phone Support', '10 Users', 'API Access'],
      description: 'For established businesses'
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 499,
      features: ['All Pro features', 'Dedicated Account Manager', '24/7 Support', 'Unlimited Users', 'White Label'],
      description: 'For large organizations'
    }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Typography variant="h6" fontWeight="bold">
          Upgrade Your Subscription
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {plans.map((plan) => (
              <Paper 
                key={plan.id}
                sx={{ 
                  p: 3,
                  border: `2px solid ${selectedPlan === plan.id ? primaryColor : currentColors.border}`,
                  borderRadius: '12px',
                  background: selectedPlan === plan.id ? alpha(primaryColor, 0.05) : currentColors.surface,
                  cursor: 'pointer',
                  position: 'relative',
                  '&:hover': {
                    borderColor: primaryColor,
                  }
                }}
                onClick={() => setSelectedPlan(plan.id)}
              >
                {plan.isPopular && (
                  <Chip
                    label="MOST POPULAR"
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: -10,
                      right: 20,
                      background: '#34A853',
                      color: 'white',
                      fontWeight: 'bold'
                    }}
                  />
                )}
                
                <Typography variant="h5" fontWeight="bold" color={currentColors.textPrimary} gutterBottom>
                  {plan.name}
                </Typography>
                
                <Typography variant="h3" fontWeight="bold" color={primaryColor} gutterBottom>
                  {formatCurrency(plan.price)}
                  <Typography component="span" variant="body1" color={currentColors.textSecondary}>
                    /month
                  </Typography>
                </Typography>
                
                <Typography variant="body2" color={currentColors.textSecondary} paragraph>
                  {plan.description}
                </Typography>
                
                <Divider sx={{ my: 2 }} />
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {plan.features.map((feature, index) => (
                    <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CheckCircle sx={{ fontSize: 16, color: '#34A853' }} />
                      <Typography variant="body2" color={currentColors.textPrimary}>
                        {feature}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Paper>
            ))}
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={() => {
            onClose();
            // Handle upgrade logic here
          }}
          sx={{
            background: primaryColor,
            color: 'white',
            '&:hover': {
              background: '#3367D6',
            }
          }}
        >
          Upgrade to {plans.find(p => p.id === selectedPlan)?.name} Plan
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpgradePlanDialog;