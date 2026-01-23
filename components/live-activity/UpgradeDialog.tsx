// components/live-activity/UpgradeDialog.tsx
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  alpha,
  useTheme
} from '@mui/material';
import {
  CheckCircle,
  Stars,
  Bolt,
  Shield,
  SupportAgent,
  TrendingUp,
  Cancel
} from '@mui/icons-material';
import { PRICING_PLANS } from './types';

interface UpgradeDialogProps {
  open: boolean;
  onClose: () => void;
  onUpgrade: (plan: string) => void;
}

export const UpgradeDialog = ({ open, onClose, onUpgrade }: UpgradeDialogProps) => {
  const theme = useTheme();

  const plans = Object.entries(PRICING_PLANS).map(([planKey, plan]) => ({
    ...plan,
    key: planKey,
    popular: planKey === 'monthly',
    highlight: planKey === 'yearly'
  }));

  const features = [
    'Real-time employee tracking',
    'Productivity analytics dashboard',
    'Team distribution insights',
    'Activity timeline & event logging',
    'Auto-refresh & live updates',
    'Advanced reporting & exports',
    'Priority customer support',
    'Custom integration options'
  ];

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)'
        }
      }}
    >
      <DialogTitle sx={{ p: 0 }}>
        <Box sx={{ 
          p: 4, 
          textAlign: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          borderRadius: '12px 12px 0 0'
        }}>
          <Stars sx={{ fontSize: 48, mb: 2, filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }} />
          <Typography variant="h3" component="div" fontWeight="bold" gutterBottom>
            ⚡ Unlock Live Activity
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9 }}>
            Advanced monitoring for your growing team
          </Typography>
        </Box>
      </DialogTitle>
      
      <DialogContent sx={{ p: 4 }}>
        {/* Features Overview */}
        <Box sx={{ 
          mb: 4, 
          p: 3, 
          borderRadius: 3,
          background: alpha(theme.palette.primary.main, 0.05),
          border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
        }}>
          <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Bolt color="primary" /> What you'll get:
          </Typography>
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
            gap: 2,
            mt: 2
          }}>
            {features.map((feature, index) => (
              <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CheckCircle color="success" fontSize="small" />
                <Typography variant="body2">{feature}</Typography>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Pricing Cards */}
        <Box sx={{ 
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(3, 1fr)'
          },
          gap: 3
        }}>
          {plans.map((plan) => (
            <Card
              key={plan.key}
              sx={{
                height: '100%',
                position: 'relative',
                overflow: 'hidden',
                border: plan.highlight ? `2px solid ${theme.palette.warning.main}` : `1px solid ${theme.palette.divider}`,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: `0 20px 40px ${alpha(theme.palette.primary.main, 0.15)}`
                }
              }}
            >
              {plan.popular && (
                <Chip
                  label="MOST POPULAR"
                  color="primary"
                  size="small"
                  sx={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    fontWeight: 'bold',
                    boxShadow: 1
                  }}
                />
              )}
              
              {plan.highlight && (
                <Chip
                  label="BEST VALUE"
                  color="warning"
                  size="small"
                  sx={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    fontWeight: 'bold',
                    boxShadow: 1
                  }}
                />
              )}

              <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                {/* Plan Header */}
                <Box sx={{ textAlign: 'center', mb: 3 }}>
                  <Typography variant="h5" fontWeight="bold" color="primary" gutterBottom>
                    {plan.name}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', mb: 1 }}>
                    <Typography variant="h2" fontWeight="bold" color="primary">
                      ₹{plan.price}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ ml: 1 }}>
                      {plan.key === 'monthly' && '/month'}
                      {plan.key === 'quarterly' && '/quarter'}
                      {plan.key === 'yearly' && '/year'}
                    </Typography>
                  </Box>
                  {plan.key === 'yearly' && (
                    <Chip
                      label="Save 25%"
                      color="success"
                      size="small"
                      variant="outlined"
                      sx={{ mb: 1 }}
                    />
                  )}
                </Box>

                {/* Features List */}
                <List dense sx={{ flex: 1, mb: 3 }}>
                  {plan.features.map((feature: string, index: number) => (
                    <ListItem key={index} sx={{ px: 0, py: 0.5 }}>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <CheckCircle color="success" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText 
                        primary={feature} 
                        primaryTypographyProps={{ variant: 'body2' }}
                      />
                    </ListItem>
                  ))}
                </List>

                {/* Benefits Badges */}
                <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap' }}>
                  {plan.key === 'yearly' && (
                    <Chip
                      icon={<Shield fontSize="small" />}
                      label="Priority Support"
                      size="small"
                      variant="outlined"
                    />
                  )}
                  <Chip
                    icon={<TrendingUp fontSize="small" />}
                    label="Advanced Analytics"
                    size="small"
                    variant="outlined"
                  />
                  {plan.key !== 'monthly' && (
                    <Chip
                      icon={<SupportAgent fontSize="small" />}
                      label="Dedicated Help"
                      size="small"
                      variant="outlined"
                    />
                  )}
                </Box>

                {/* Upgrade Button */}
                <Button
                  variant={plan.popular ? "contained" : "outlined"}
                  fullWidth
                  size="large"
                  onClick={() => onUpgrade(plan.key)}
                  sx={{
                    borderRadius: 2,
                    py: 1.5,
                    fontWeight: 'bold',
                    fontSize: '1rem',
                    background: plan.highlight 
                      ? 'linear-gradient(135deg, #FF9800 0%, #F57C00 100%)'
                      : plan.popular
                      ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                      : 'inherit',
                    color: plan.popular || plan.highlight ? 'white' : 'inherit',
                    '&:hover': {
                      transform: 'scale(1.02)',
                      transition: 'transform 0.2s ease'
                    }
                  }}
                >
                  {plan.highlight ? 'Get Best Value' : 'Get Started'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </Box>

        {/* Security & Guarantee */}
        <Box sx={{ 
          mt: 4, 
          p: 3, 
          borderRadius: 3,
          background: alpha(theme.palette.success.main, 0.05),
          border: `1px solid ${alpha(theme.palette.success.main, 0.1)}`
        }}>
          <Box sx={{ 
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(4, 1fr)'
            },
            gap: 2,
            textAlign: 'center'
          }}>
            <Box>
              <Shield color="success" sx={{ fontSize: 32, mb: 1 }} />
              <Typography variant="body2" fontWeight="bold">Bank-level Security</Typography>
              <Typography variant="caption" color="text.secondary">256-bit encryption</Typography>
            </Box>
            <Box>
              <CheckCircle color="success" sx={{ fontSize: 32, mb: 1 }} />
              <Typography variant="body2" fontWeight="bold">14-Day Guarantee</Typography>
              <Typography variant="caption" color="text.secondary">Full refund if unsatisfied</Typography>
            </Box>
            <Box>
              <SupportAgent color="success" sx={{ fontSize: 32, mb: 1 }} />
              <Typography variant="body2" fontWeight="bold">24/7 Support</Typography>
              <Typography variant="caption" color="text.secondary">Email, chat & phone</Typography>
            </Box>
            <Box>
              <Cancel color="success" sx={{ fontSize: 32, mb: 1 }} />
              <Typography variant="body2" fontWeight="bold">No Lock-in</Typography>
              <Typography variant="caption" color="text.secondary">Cancel anytime</Typography>
            </Box>
          </Box>
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ p: 3, borderTop: `1px solid ${theme.palette.divider}` }}>
        <Button 
          onClick={onClose}
          variant="outlined"
          startIcon={<Cancel />}
        >
          Not Now
        </Button>
        <Typography variant="body2" color="text.secondary" sx={{ flex: 1, textAlign: 'center' }}>
          Upgrade now to unlock real-time insights
        </Typography>
      </DialogActions>
    </Dialog>
  );
};