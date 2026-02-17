// app/(pages)/advance/subscription-billing/page.tsx
'use client'

import { useState } from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Select,
  MenuItem,
  Breadcrumbs,
  alpha,
  useMediaQuery,
  Tabs,
  Tab,
} from '@mui/material'
import {
  CreditCard,
  Home,
  Download,
  Add,
  Construction,
} from '@mui/icons-material'
import { useAdvanceThemeContext } from '@/contexts/AdvanceThemeContexts'
import Link from 'next/link'

// Import components
import CurrentSubscriptionCard from '@/components/advance/sub-bill/CurrentSubscriptionCard'
import SubscriptionHistoryTable from '@/components/advance/sub-bill/SubscriptionHistoryTable'
import PaymentHistoryTable from '@/components/advance/sub-bill/PaymentHistoryTable'
import BillingCyclesCard from '@/components/advance/sub-bill/BillingCyclesCard'
import UsageAnalyticsCard from '@/components/advance/sub-bill/UsageAnalyticsCard'
import UpgradePlanDialog from '@/components/advance/sub-bill/UpgradePlanDialog'
import StatsCards from '@/components/advance/sub-bill/StatsCards'

// Google colors
const googleColors = {
  blue: '#4285F4',
  green: '#34A853',
  yellow: '#FBBC04',
  red: '#EA4335',
  
  light: {
    background: '#FFFFFF',
    surface: '#F8F9FA',
    textPrimary: '#202124',
    textSecondary: '#5F6368',
    border: '#DADCE0',
    card: '#FFFFFF',
    chipBackground: '#F1F3F4',
    header: '#FFFFFF',
    sidebar: '#FFFFFF',
    hover: '#F8F9FA',
    active: '#E8F0FE',
  },
  
  dark: {
    background: '#202124',
    surface: '#303134',
    textPrimary: '#E8EAED',
    textSecondary: '#9AA0A6',
    border: '#3C4043',
    card: '#303134',
    chipBackground: '#3C4043',
    header: '#303134',
    sidebar: '#202124',
    hover: '#3C4043',
    active: '#5F6368',
  }
};

export default function SubscriptionBillingPage() {
  const { currentScheme } = useAdvanceThemeContext();
  const isMobile = useMediaQuery("(max-width: 600px)");
  const [activeTab, setActiveTab] = useState(0);
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
  const [timeRange, setTimeRange] = useState('all');
  const { mode } = useAdvanceThemeContext();

  const currentColors = mode === 'dark' ? googleColors.dark : googleColors.light;
  const primaryColor = googleColors.blue;
  const buttonColor = mode === 'dark' ? googleColors.red : googleColors.blue;

  return (
    <Box sx={{ 
      backgroundColor: currentColors.background,
      minHeight: '100vh',
      color: currentColors.textPrimary,
      transition: 'background-color 0.3s ease',
      p: isMobile ? 1 : 2,
    }}>
      {/* Under Development Banner */}
      <Card
        sx={{
          mb: 4,
          background: `linear-gradient(135deg, ${alpha(googleColors.yellow, 0.15)} 0%, ${alpha(googleColors.yellow, 0.05)} 100%)`,
          border: `1px solid ${alpha(googleColors.yellow, 0.3)}`,
          borderRadius: '16px',
          backgroundColor: currentColors.card,
          transition: 'all 0.3s ease',
          boxShadow: mode === 'dark' 
            ? '0 2px 4px rgba(0,0,0,0.4)' 
            : '0 1px 2px 0 rgba(60,64,67,0.3), 0 1px 3px 1px rgba(60,64,67,0.15)',
        }}
      >
        <CardContent>
          <Box display="flex" alignItems="center" gap={2}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${alpha(googleColors.yellow, 0.2)} 0%, ${alpha(googleColors.yellow, 0.1)} 100%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: `1px solid ${alpha(googleColors.yellow, 0.3)}`,
              }}
            >
              <Construction sx={{ fontSize: 28, color: googleColors.yellow }} />
            </Box>
            <Box>
              <Typography variant="h5" fontWeight={600} color={googleColors.yellow} gutterBottom>
                🚧 Under Development
              </Typography>
              <Typography variant="body1" color={currentColors.textSecondary}>
                This page and all its features are currently under development. 
                Some features may not be available yet. We're working hard to bring you an amazing experience!
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Header */}
      <Box sx={{ mb: isMobile ? 2 : 4 }}>
        <Breadcrumbs sx={{ 
          mb: 1, 
          color: currentColors.textSecondary,
          fontSize: isMobile ? '0.75rem' : '0.875rem'
        }}>
          <Box
            component={Link}
            href="/dashboard"
            sx={{
              display: "flex",
              alignItems: "center",
              textDecoration: "none",
              color: currentColors.textSecondary,
              fontSize: isMobile ? '0.75rem' : '0.875rem',
              "&:hover": { color: primaryColor },
            }}
          >
            <Home sx={{ mr: 0.5, fontSize: isMobile ? 16 : 20 }} />
            Dashboard
          </Box>
          <Typography color={currentColors.textPrimary} fontSize={isMobile ? '0.75rem' : '0.875rem'}>
            Subscription Billing
          </Typography>
        </Breadcrumbs>

        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          mb={2}
          flexDirection={isMobile ? "column" : "row"}
          gap={isMobile ? 2 : 0}
        >
          <Box display="flex" alignItems="center" gap={isMobile ? 1 : 2}>
            <Box
              sx={{
                width: isMobile ? 48 : 60,
                height: isMobile ? 48 : 60,
                borderRadius: isMobile ? 2 : 3,
                background: primaryColor,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: '0 2px 8px rgba(66,133,244,0.4)',
              }}
            >
              <CreditCard sx={{ 
                fontSize: isMobile ? 24 : 32, 
                color: 'white' 
              }} />
            </Box>
            <Box>
              <Typography 
                variant={isMobile ? "h5" : "h4"} 
                fontWeight="bold"
                fontSize={isMobile ? '1.25rem' : '1.5rem'}
              >
                💰 Subscription Billing & History
              </Typography>
              <Typography
                variant="body1"
                color={currentColors.textSecondary}
                fontSize={isMobile ? '0.875rem' : '1rem'}
              >
                Manage subscriptions, view history, and track payments
              </Typography>
            </Box>
          </Box>

          <Box sx={{ 
            display: "flex", 
            gap: 1, 
            flexWrap: 'wrap',
            justifyContent: isMobile ? 'center' : 'flex-end'
          }}>
            <Select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              size={isMobile ? "small" : "medium"}
              disabled
              sx={{
                background: currentColors.chipBackground,
                color: currentColors.textPrimary,
                borderRadius: '8px',
                minWidth: isMobile ? 100 : 120,
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: currentColors.border,
                },
                opacity: 0.7,
              }}
            >
              <MenuItem value="all">All Time</MenuItem>
              <MenuItem value="year">This Year</MenuItem>
              <MenuItem value="month">This Month</MenuItem>
              <MenuItem value="quarter">Last Quarter</MenuItem>
            </Select>
            
            <Button
              variant="outlined"
              startIcon={<Download />}
              disabled
              sx={{
                border: `1px solid ${currentColors.border}`,
                color: buttonColor,
                borderRadius: '8px',
                textTransform: 'none',
                fontWeight: 500,
                fontSize: isMobile ? '0.875rem' : '1rem',
                minWidth: 'auto',
                '&:hover': {
                  borderColor: buttonColor,
                  backgroundColor: alpha(buttonColor, 0.04),
                }
              }}
            >
              {isMobile ? '' : 'Export'}
            </Button>
            
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setShowUpgradeDialog(true)}
              disabled
              sx={{
                background: buttonColor,
                color: 'white',
                borderRadius: '8px',
                textTransform: 'none',
                fontWeight: 500,
                fontSize: isMobile ? '0.875rem' : '1rem',
                minWidth: 'auto',
                '&:hover': {
                  background: buttonColor,
                  opacity: 0.8,
                },
                '&.Mui-disabled': {
                  background: buttonColor,
                  color: 'white',
                  opacity: 0.5,
                }
              }}
            >
              {isMobile ? 'Upgrade' : 'Upgrade Plan'}
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Stats Cards */}
      <StatsCards 
        currentColors={currentColors}
        primaryColor={primaryColor}
        isMobile={isMobile}
      />

      {/* Current Subscription Card */}
      <CurrentSubscriptionCard 
        currentColors={currentColors}
        primaryColor={primaryColor}
        isMobile={isMobile}
      />

      {/* Tabs */}
      <Tabs 
        value={activeTab} 
        onChange={(_, newValue) => setActiveTab(newValue)} 
        sx={{ 
          mb: 3, 
          borderBottom: `1px solid ${currentColors.border}`,
          '& .MuiTab-root': {
            color: currentColors.textSecondary,
            textTransform: 'none',
            fontSize: isMobile ? '0.875rem' : '1rem',
            minHeight: isMobile ? 48 : 56,
            '&.Mui-selected': {
              color: primaryColor,
            }
          }
        }}
      >
        <Tab label="Subscription History" />
        <Tab label="Payment History" />
        <Tab label="Billing Cycles" />
        <Tab label="Usage Analytics" />
      </Tabs>

      {/* Tab Content */}
      {activeTab === 0 && (
        <SubscriptionHistoryTable 
          currentColors={currentColors}
          primaryColor={primaryColor}
          isMobile={isMobile}
        />
      )}

      {activeTab === 1 && (
        <PaymentHistoryTable 
          currentColors={currentColors}
          primaryColor={primaryColor}
          isMobile={isMobile}
        />
      )}

      {activeTab === 2 && (
        <BillingCyclesCard 
          currentColors={currentColors}
          primaryColor={primaryColor}
          isMobile={isMobile}
        />
      )}

      {activeTab === 3 && (
        <UsageAnalyticsCard 
          currentColors={currentColors}
          primaryColor={primaryColor}
          isMobile={isMobile}
        />
      )}

      {/* Upgrade Plan Dialog */}
      <UpgradePlanDialog 
        open={showUpgradeDialog}
        onClose={() => setShowUpgradeDialog(false)}
        currentColors={currentColors}
        primaryColor={primaryColor}
      />
    </Box>
  );
}