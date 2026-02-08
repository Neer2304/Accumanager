import { Box, Card, CardContent, Typography, Chip, Paper, Alert, Button } from '@mui/material';
import { Warning as WarningIcon } from '@mui/icons-material';

interface SubscriptionStatusProps {
  currentSubscription: any;
  subscriptionMetrics: any;
  currentColors: any;
  isMobile: boolean;
  googleColors: any;
  alpha: any;
}

export default function SubscriptionStatus({
  currentSubscription,
  subscriptionMetrics,
  currentColors,
  isMobile,
  googleColors,
  alpha
}: SubscriptionStatusProps) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return googleColors.green;
      case 'trial':
        return googleColors.yellow;
      case 'expired':
        return googleColors.red;
      case 'cancelled':
        return currentColors.textSecondary;
      default:
        return currentColors.textSecondary;
    }
  };

  return (
    <Card sx={{ 
      mb: 3, 
      background: currentColors.card,
      border: `1px solid ${currentColors.border}`,
      borderRadius: '12px',
      transition: 'all 0.3s ease',
      boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
    }}>
      <CardContent>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          mb: 3,
          flexDirection: isMobile ? 'column' : 'row',
          gap: isMobile ? 2 : 0,
        }}>
          <Typography 
            variant="h6" 
            fontWeight="bold" 
            color={currentColors.textPrimary}
            fontSize={isMobile ? '1rem' : '1.125rem'}
          >
            Current Subscription Status
          </Typography>
          <Chip
            label={currentSubscription.status.toUpperCase()}
            sx={{
              background: alpha(getStatusColor(currentSubscription.status), 0.1),
              color: getStatusColor(currentSubscription.status),
              fontWeight: 'bold',
              border: `1px solid ${alpha(getStatusColor(currentSubscription.status), 0.3)}`,
              fontSize: isMobile ? '0.75rem' : '0.875rem',
            }}
          />
        </Box>
        
        <Box sx={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: 2 
        }}>
          <Box sx={{ 
            flex: isMobile ? '1 1 100%' : '1 1 calc(25% - 16px)',
            minWidth: isMobile ? '100%' : '150px'
          }}>
            <Paper sx={{ 
              p: 2, 
              textAlign: 'center', 
              background: currentColors.surface, 
              border: `1px solid ${currentColors.border}`,
              borderRadius: '8px',
            }}>
              <Typography 
                variant="caption" 
                color={currentColors.textSecondary}
                fontSize={isMobile ? '0.75rem' : '0.875rem'}
              >
                Current Plan
              </Typography>
              <Typography 
                variant={isMobile ? "body1" : "h5"} 
                fontWeight="bold" 
                sx={{ 
                  mt: 1, 
                  color: currentColors.textPrimary 
                }}
              >
                {currentSubscription.plan.charAt(0).toUpperCase() + currentSubscription.plan.slice(1)}
              </Typography>
            </Paper>
          </Box>
          
          <Box sx={{ 
            flex: isMobile ? '1 1 100%' : '1 1 calc(25% - 16px)',
            minWidth: isMobile ? '100%' : '150px'
          }}>
            <Paper sx={{ 
              p: 2, 
              textAlign: 'center', 
              background: currentColors.surface, 
              border: `1px solid ${currentColors.border}`,
              borderRadius: '8px',
            }}>
              <Typography 
                variant="caption" 
                color={currentColors.textSecondary}
                fontSize={isMobile ? '0.75rem' : '0.875rem'}
              >
                Next Billing
              </Typography>
              <Typography 
                variant={isMobile ? "body1" : "h5"} 
                fontWeight="bold" 
                sx={{ 
                  mt: 1, 
                  color: currentColors.textPrimary 
                }}
              >
                {new Date(currentSubscription.currentPeriodEnd).toLocaleDateString()}
              </Typography>
            </Paper>
          </Box>
          
          <Box sx={{ 
            flex: isMobile ? '1 1 100%' : '1 1 calc(25% - 16px)',
            minWidth: isMobile ? '100%' : '150px'
          }}>
            <Paper sx={{ 
              p: 2, 
              textAlign: 'center', 
              background: currentColors.surface, 
              border: `1px solid ${currentColors.border}`,
              borderRadius: '8px',
            }}>
              <Typography 
                variant="caption" 
                color={currentColors.textSecondary}
                fontSize={isMobile ? '0.75rem' : '0.875rem'}
              >
                Days Remaining
              </Typography>
              <Typography 
                variant={isMobile ? "body1" : "h5"} 
                fontWeight="bold" 
                sx={{ 
                  mt: 1, 
                  color: currentColors.textPrimary 
                }}
              >
                {subscriptionMetrics.daysRemaining}
              </Typography>
            </Paper>
          </Box>
          
          <Box sx={{ 
            flex: isMobile ? '1 1 100%' : '1 1 calc(25% - 16px)',
            minWidth: isMobile ? '100%' : '150px'
          }}>
            <Paper sx={{ 
              p: 2, 
              textAlign: 'center', 
              background: currentColors.surface, 
              border: `1px solid ${currentColors.border}`,
              borderRadius: '8px',
            }}>
              <Typography 
                variant="caption" 
                color={currentColors.textSecondary}
                fontSize={isMobile ? '0.75rem' : '0.875rem'}
              >
                Auto Renew
              </Typography>
              <Typography 
                variant={isMobile ? "body1" : "h5"} 
                fontWeight="bold" 
                sx={{ 
                  mt: 1, 
                  color: currentColors.textPrimary 
                }}
              >
                {currentSubscription.autoRenew ? 'Enabled' : 'Disabled'}
              </Typography>
            </Paper>
          </Box>
        </Box>
        
        {/* Trial Status Alert */}
        {currentSubscription.status === 'trial' && subscriptionMetrics.trialDaysRemaining > 0 && (
          <Alert 
            severity="warning" 
            sx={{ 
              mt: 3,
              p: 2,
              background: alpha(googleColors.yellow, 0.1),
              border: `1px solid ${alpha(googleColors.yellow, 0.3)}`,
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: { xs: 2, sm: 0 },
              '& .MuiAlert-message': {
                flex: 1,
                width: '100%',
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: { xs: 'flex-start', sm: 'center' },
                justifyContent: 'space-between',
                gap: { xs: 2, sm: 0 },
              }
            }}
            iconMapping={{
              warning: <WarningIcon sx={{ 
                color: googleColors.yellow,
                fontSize: isMobile ? 20 : 24 
              }} />
            }}
          >
            <Box sx={{ 
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              flex: 1
            }}>
              <Box>
                <Typography 
                  fontWeight="bold" 
                  color={currentColors.textPrimary}
                  fontSize={isMobile ? '0.875rem' : '1rem'}
                  lineHeight={1.2}
                >
                  Trial Period Active
                </Typography>
                <Typography 
                  variant="body2" 
                  color={currentColors.textSecondary}
                  fontSize={isMobile ? '0.75rem' : '0.875rem'}
                  sx={{ mt: 0.5 }}
                >
                  {subscriptionMetrics.trialDaysRemaining} days remaining in your trial
                </Typography>
              </Box>
            </Box>
            
            <Box sx={{ 
              display: 'flex', 
              justifyContent: { xs: 'flex-start', sm: 'flex-end' },
              width: { xs: '100%', sm: 'auto' }
            }}>
              <Button 
                variant="contained" 
                size={isMobile ? "small" : "medium"}
                sx={{ 
                  background: googleColors.yellow,
                  color: currentColors.textPrimary,
                  borderRadius: '6px',
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: isMobile ? '0.75rem' : '0.875rem',
                  px: isMobile ? 2 : 3,
                  whiteSpace: 'nowrap',
                  minWidth: 'fit-content',
                  '&:hover': {
                    background: '#E6AC00',
                  }
                }}
              >
                {isMobile ? 'Upgrade Now' : 'Upgrade to Pro Plan'}
              </Button>
            </Box>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}