// components/googleadvance/subscription-billing/UpgradePlanDialog.tsx

'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Card,
  CardContent,
  Radio,
  RadioGroup,
  FormControlLabel,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  alpha,
  Stepper,
  Step,
  StepLabel,
  CircularProgress,
} from '@mui/material';
import {
  CheckCircle,
  Star,
  Whatshot,
} from '@mui/icons-material';
import { googleColors } from '../common/GoogleColors';

interface UpgradePlanDialogProps {
  open: boolean;
  onClose: () => void;
  currentColors: any;
  primaryColor: string;
}

export const UpgradePlanDialog: React.FC<UpgradePlanDialogProps> = ({
  open,
  onClose,
  currentColors,
  primaryColor,
}) => {
  const [selectedPlan, setSelectedPlan] = useState('premium');
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [loading, setLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  const plans = [
    {
      id: 'basic',
      name: 'Basic',
      price: 15000,
      features: ['Basic Analytics', 'Email Support', '5 Team Members', '10GB Storage'],
      popular: false,
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 25000,
      features: ['Advanced Analytics', 'Priority Support', '10 Team Members', '50GB Storage', 'API Access'],
      popular: true,
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 50000,
      features: ['Custom Analytics', 'Dedicated Support', 'Unlimited Members', '500GB Storage', 'API Access', 'White Labeling'],
      popular: false,
    },
  ];

  const steps = ['Select Plan', 'Confirm Upgrade', 'Payment'];

  const handleUpgrade = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onClose();
    }, 2000);
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: {
          background: currentColors.card,
          border: `1px solid ${currentColors.border}`,
          borderRadius: '12px',
        }
      }}
    >
      <DialogTitle sx={{ 
        borderBottom: `1px solid ${currentColors.border}`,
        color: currentColors.textPrimary,
        fontWeight: 600,
      }}>
        Upgrade Your Plan
      </DialogTitle>

      <DialogContent sx={{ mt: 2 }}>
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {/* Step 1: Select Plan */}
        {activeStep === 0 && (
          <Box>
            <Box sx={{ display: 'flex', gap: 2, mb: 3, justifyContent: 'center' }}>
              <Chip
                label="Monthly"
                onClick={() => setBillingCycle('monthly')}
                color={billingCycle === 'monthly' ? 'primary' : 'default'}
                sx={{
                  backgroundColor: billingCycle === 'monthly' 
                    ? primaryColor 
                    : currentColors.chipBackground,
                  color: billingCycle === 'monthly' ? 'white' : currentColors.textPrimary,
                }}
              />
              <Chip
                label="Yearly (Save 20%)"
                onClick={() => setBillingCycle('yearly')}
                color={billingCycle === 'yearly' ? 'primary' : 'default'}
                sx={{
                  backgroundColor: billingCycle === 'yearly' 
                    ? primaryColor 
                    : currentColors.chipBackground,
                  color: billingCycle === 'yearly' ? 'white' : currentColors.textPrimary,
                }}
              />
            </Box>

            <RadioGroup value={selectedPlan} onChange={(e) => setSelectedPlan(e.target.value)}>
              <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                {plans.map((plan) => (
                  <Box key={plan.id} sx={{ flex: '1 1 calc(33.333% - 16px)', minWidth: '250px' }}>
                    <Card
                      sx={{
                        position: 'relative',
                        border: selectedPlan === plan.id 
                          ? `2px solid ${primaryColor}`
                          : `1px solid ${currentColors.border}`,
                        borderRadius: '12px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        },
                      }}
                      onClick={() => setSelectedPlan(plan.id)}
                    >
                      {plan.popular && (
                        <Chip
                          icon={<Whatshot />}
                          label="Most Popular"
                          size="small"
                          sx={{
                            position: 'absolute',
                            top: -10,
                            right: 10,
                            backgroundColor: googleColors.yellow,
                            color: 'white',
                            fontWeight: 600,
                          }}
                        />
                      )}
                      <CardContent>
                        <Box textAlign="center" mb={2}>
                          <Typography variant="h6" fontWeight="bold">
                            {plan.name}
                          </Typography>
                          <Typography variant="h4" fontWeight="bold" sx={{ my: 1 }}>
                            ₹{billingCycle === 'yearly' ? plan.price * 12 * 0.8 : plan.price}
                            <Typography component="span" variant="caption" color={currentColors.textSecondary}>
                              /{billingCycle === 'yearly' ? 'year' : 'mo'}
                            </Typography>
                          </Typography>
                          {billingCycle === 'yearly' && (
                            <Typography variant="caption" sx={{ color: googleColors.green }}>
                              Save ₹{(plan.price * 12 * 0.2).toLocaleString()}/year
                            </Typography>
                          )}
                        </Box>

                        <Radio
                          value={plan.id}
                          checked={selectedPlan === plan.id}
                          sx={{ 
                            position: 'absolute',
                            bottom: 8,
                            right: 8,
                            color: primaryColor,
                          }}
                        />

                        <List dense>
                          {plan.features.map((feature, idx) => (
                            <ListItem key={idx} sx={{ px: 0 }}>
                              <ListItemIcon sx={{ minWidth: 32 }}>
                                <CheckCircle sx={{ color: googleColors.green, fontSize: 16 }} />
                              </ListItemIcon>
                              <ListItemText primary={feature} />
                            </ListItem>
                          ))}
                        </List>
                      </CardContent>
                    </Card>
                  </Box>
                ))}
              </Box>
            </RadioGroup>
          </Box>
        )}

        {/* Step 2: Confirm Upgrade */}
        {activeStep === 1 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Confirm Upgrade Details
            </Typography>
            <Card sx={{ background: currentColors.surface, mb: 3 }}>
              <CardContent>
                <Box display="flex" justifyContent="space-between" mb={2}>
                  <Typography color={currentColors.textSecondary}>Selected Plan:</Typography>
                  <Typography fontWeight="bold">
                    {plans.find(p => p.id === selectedPlan)?.name}
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" mb={2}>
                  <Typography color={currentColors.textSecondary}>Billing Cycle:</Typography>
                  <Typography fontWeight="bold">
                    {billingCycle === 'yearly' ? 'Yearly' : 'Monthly'}
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" mb={2}>
                  <Typography color={currentColors.textSecondary}>Amount:</Typography>
                  <Typography fontWeight="bold" color={primaryColor}>
                    ₹{billingCycle === 'yearly' 
                      ? (plans.find(p => p.id === selectedPlan)?.price || 0) * 12 * 0.8 
                      : plans.find(p => p.id === selectedPlan)?.price}
                    /{billingCycle === 'yearly' ? 'year' : 'month'}
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography color={currentColors.textSecondary}>Next Billing Date:</Typography>
                  <Typography fontWeight="bold">
                    {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                  </Typography>
                </Box>
              </CardContent>
            </Card>

            <Typography variant="body2" color={currentColors.textSecondary}>
              By confirming, you agree to our terms of service and authorize us to charge your payment method.
            </Typography>
          </Box>
        )}

        {/* Step 3: Payment */}
        {activeStep === 2 && (
          <Box textAlign="center" py={3}>
            <Typography variant="h6" gutterBottom>
              Processing Upgrade
            </Typography>
            {loading ? (
              <CircularProgress sx={{ color: primaryColor, my: 3 }} />
            ) : (
              <>
                <CheckCircle sx={{ fontSize: 60, color: googleColors.green, my: 2 }} />
                <Typography variant="body1" gutterBottom>
                  Upgrade Successful!
                </Typography>
                <Typography variant="body2" color={currentColors.textSecondary}>
                  Your plan has been upgraded. You can now access premium features.
                </Typography>
              </>
            )}
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ borderTop: `1px solid ${currentColors.border}`, p: 2 }}>
        <Button 
          onClick={onClose}
          disabled={loading}
          sx={{ color: currentColors.textSecondary }}
        >
          Cancel
        </Button>
        {activeStep > 0 && activeStep < 2 && (
          <Button 
            onClick={() => setActiveStep(prev => prev - 1)}
            disabled={loading}
            sx={{ color: currentColors.textPrimary }}
          >
            Back
          </Button>
        )}
        {activeStep < 2 ? (
          <Button
            variant="contained"
            onClick={() => setActiveStep(prev => prev + 1)}
            sx={{
              background: primaryColor,
              color: 'white',
              '&:hover': {
                background: '#3367D6',
              },
            }}
          >
            Continue
          </Button>
        ) : (
          <Button
            variant="contained"
            onClick={handleUpgrade}
            disabled={loading}
            sx={{
              background: primaryColor,
              color: 'white',
              '&:hover': {
                background: '#3367D6',
              },
            }}
          >
            {loading ? <CircularProgress size={24} /> : 'Complete Upgrade'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};