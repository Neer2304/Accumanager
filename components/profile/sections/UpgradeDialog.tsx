import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { ProfileIcon } from '../ProfileIcons';
import { PROFILE_CONTENT } from '../ProfileContent';

interface UpgradeDialogProps {
  open: boolean;
  currentPlan: string;
  onClose: () => void;
  onUpgrade: (plan: string) => void;
}

export const UpgradeDialog = ({
  open,
  currentPlan,
  onClose,
  onUpgrade,
}: UpgradeDialogProps) => {
  const { upgradeDialog, pricingPlans } = PROFILE_CONTENT;

  const getDurationText = (planKey: string) => {
    switch (planKey) {
      case 'monthly': return upgradeDialog.perMonth;
      case 'quarterly': return upgradeDialog.perQuarter;
      case 'yearly': return upgradeDialog.perYear;
      default: return '';
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="lg"
      fullWidth
    >
      <DialogTitle>
        <Typography variant="h5" component="div" fontWeight="bold">
          {upgradeDialog.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {upgradeDialog.subtitle}
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={3} sx={{ mt: 1 }}>
          {Object.entries(pricingPlans).map(([planKey, plan]) => {
            if (planKey === 'trial') return null;
            
            const isCurrentPlan = currentPlan === planKey;
            const isRecommended = planKey === 'quarterly';
            
            return (
              <Grid item xs={12} md={6} lg={3} key={planKey}>
                <Card 
                  sx={{ 
                    height: '100%',
                    border: isCurrentPlan ? 2 : 1,
                    borderColor: isCurrentPlan ? 'primary.main' : 'divider',
                    position: 'relative',
                    ...(isRecommended && {
                      border: 2,
                      borderColor: 'secondary.main',
                    })
                  }}
                >
                  {isRecommended && (
                    <Chip
                      label={upgradeDialog.mostPopular}
                      color="secondary"
                      size="small"
                      sx={{ position: 'absolute', top: 16, right: 16 }}
                    />
                  )}
                  <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="h6" gutterBottom fontWeight="bold">
                      {plan.name}
                    </Typography>
                    <Typography variant="h4" gutterBottom color="primary.main">
                      ₹{plan.price}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {getDurationText(planKey)}
                    </Typography>
                    
                    <Divider sx={{ my: 2 }} />
                    
                    <List dense sx={{ flex: 1 }}>
                      {plan.features.map((feature: string, index: number) => (
                        <ListItem key={index} sx={{ px: 0, py: 0.5 }}>
                          <ListItemIcon sx={{ minWidth: 32 }}>
                            <ProfileIcon name="Check" size="small" color="success" />
                          </ListItemIcon>
                          <ListItemText 
                            primary={feature} 
                            primaryTypographyProps={{ variant: 'body2' }}
                          />
                        </ListItem>
                      ))}
                    </List>
                    
                    <Button
                      variant={isCurrentPlan ? "outlined" : "contained"}
                      fullWidth
                      disabled={isCurrentPlan}
                      onClick={() => onUpgrade(planKey)}
                      sx={{ mt: 2 }}
                    >
                      {isCurrentPlan 
                        ? upgradeDialog.currentPlan 
                        : `${upgradeDialog.upgradeTo} ${plan.name}`
                      }
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{upgradeDialog.cancel}</Button>
      </DialogActions>
    </Dialog>
  );
};