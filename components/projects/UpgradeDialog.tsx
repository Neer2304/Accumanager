import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  Box,
} from '@mui/material';
import { CheckCircle } from '@mui/icons-material';

const PRICING_PLANS = {
  monthly: { name: 'Monthly Pro', price: 999, period: 'per month' },
  quarterly: { name: 'Quarterly Business', price: 2599, period: 'per quarter' },
  yearly: { name: 'Yearly Enterprise', price: 8999, period: 'per year' },
};

const PLAN_FEATURES = {
  monthly: ['Up to 50 projects', 'Unlimited team members', 'Advanced analytics', 'Gantt charts', 'Priority support'],
  quarterly: ['Up to 200 projects', 'Custom templates', 'Time tracking', 'Advanced reporting', 'Custom workflows'],
  yearly: ['Unlimited projects', 'AI insights', 'Custom integrations', 'Dedicated manager', 'White-label'],
};

interface UpgradeDialogProps {
  open: boolean;
  onClose: () => void;
  onUpgrade: (plan: string) => void;
}

export const UpgradeDialog: React.FC<UpgradeDialogProps> = ({ open, onClose, onUpgrade }) => (
  <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
    <DialogTitle textAlign="center">
      <Typography variant="h4" fontWeight="bold">Upgrade Your Plan</Typography>
      <Typography color="text.secondary" sx={{ mt: 1 }}>Choose the perfect plan for your team</Typography>
    </DialogTitle>
    <DialogContent>
      <Box sx={{ display: 'grid', gap: 4, gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, my: 4 }}>
        {Object.entries(PRICING_PLANS).map(([key, plan]) => (
          <Card key={key} sx={{ p: 4, borderRadius: 4, boxShadow: 6, textAlign: 'center', '&:hover': { transform: 'translateY(-8px)', transition: '0.3s' } }}>
            <Typography variant="h5" fontWeight="bold">{plan.name}</Typography>
            <Typography variant="h3" color="primary.main" sx={{ my: 2 }}>₹{plan.price}</Typography>
            <Typography color="text.secondary" gutterBottom>{plan.period}</Typography>
            <List sx={{ mb: 4 }}>
              {PLAN_FEATURES[key as keyof typeof PLAN_FEATURES].map((f) => (
                <ListItem key={f} sx={{ py: 0.5 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}><CheckCircle color="success" /></ListItemIcon>
                  <ListItemText primary={f} />
                </ListItem>
              ))}
            </List>
            <Button variant="contained" size="large" fullWidth onClick={() => onUpgrade(key)}>
              Choose {plan.name}
            </Button>
          </Card>
        ))}
      </Box>
    </DialogContent>
    <DialogActions sx={{ justifyContent: 'center', pb: 4 }}>
      <Button onClick={onClose}>Cancel</Button>
    </DialogActions>
  </Dialog>
);