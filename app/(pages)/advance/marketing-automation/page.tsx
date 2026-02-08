// app/(pages)/advance/marketing-automation/page.tsx
'use client'

import { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Button,
  Select,
  MenuItem,
  Breadcrumbs,
  alpha,
  useMediaQuery,
  Tabs,
  Tab,
  Card,
  Snackbar,
  Alert,
  CircularProgress,
} from '@mui/material'
import {
  Email,
  Home,
  Add,
  Refresh,
} from '@mui/icons-material'
import { useAdvanceThemeContext } from '@/contexts/AdvanceThemeContexts'
import Link from 'next/link'

// Import components
import StatsCards from '@/components/advance/marketing/StatsCards'
import CampaignsTab from '@/components/advance/marketing/CampaignsTab'
import AnalyticsTab from '@/components/advance/marketing/AnalyticsTab'
import AudiencesTab from '@/components/advance/marketing/AudiencesTab'
import NewCampaignDialog from '@/components/advance/marketing/NewCampaignDialog'
import CampaignMetrics from '@/components/advance/marketing/CampaignMetrics'

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

interface MarketingCampaign {
  _id: string;
  name: string;
  type: 'email' | 'sms' | 'push';
  status: 'draft' | 'active' | 'paused' | 'completed' | 'cancelled';
  segment: string;
  recipients: number;
  sent: number;
  delivered: number;
  opened: number;
  clicked: number;
  converted: number;
  revenue: number;
  createdAt: string;
  scheduledFor?: string;
  sentAt?: string;
  completedAt?: string;
  metadata?: any;
}

interface CampaignAnalytics {
  totalCampaigns: number;
  activeCampaigns: number;
  draftCampaigns: number;
  completedCampaigns: number;
  averageOpenRate: number;
  averageClickRate: number;
  averageConversionRate: number;
  totalRevenue: number;
  totalRecipients: number;
  totalSent: number;
  totalOpened: number;
  totalClicked: number;
  totalConverted: number;
  topPerforming: MarketingCampaign[];
  recentCampaigns: MarketingCampaign[];
}

interface CustomerSegment {
  _id: string;
  name: string;
  type: 'static' | 'dynamic';
  customerCount: number;
  criteria: any[];
  lastUpdated: string;
}

interface CreateCampaignData {
  name: string;
  type: 'email' | 'sms' | 'push';
  segment: string;
  template?: string;
  scheduleType: 'immediate' | 'scheduled';
  scheduledDate?: string;
  content?: string;
  subject?: string;
}

export default function MarketingAutomationPage() {
  const { currentScheme } = useAdvanceThemeContext();
  const { mode } = useAdvanceThemeContext();
  const isMobile = useMediaQuery("(max-width: 600px)");
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [campaigns, setCampaigns] = useState<MarketingCampaign[]>([]);
  const [segments, setSegments] = useState<CustomerSegment[]>([]);
  const [analytics, setAnalytics] = useState<CampaignAnalytics | null>(null);
  const [newCampaignDialog, setNewCampaignDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ 
    open: false, 
    message: '', 
    severity: 'success' as 'success' | 'error' 
  });
  const [autoOptimize, setAutoOptimize] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  const currentColors = mode === 'dark' ? googleColors.dark : googleColors.light;
  const primaryColor = googleColors.blue;

  useEffect(() => {
    fetchMarketingData();
  }, [refreshKey]);

  const fetchMarketingData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Mock data for demonstration
      setCampaigns([
        {
          _id: '1',
          name: 'Welcome Email Series',
          type: 'email',
          status: 'active',
          segment: 'segment-1',
          recipients: 1000,
          sent: 850,
          delivered: 820,
          opened: 450,
          clicked: 120,
          converted: 45,
          revenue: 22500,
          createdAt: '2024-01-01',
          scheduledFor: '2024-01-01'
        },
        {
          _id: '2',
          name: 'Summer Sale Campaign',
          type: 'email',
          status: 'completed',
          segment: 'segment-2',
          recipients: 2500,
          sent: 2400,
          delivered: 2350,
          opened: 1500,
          clicked: 450,
          converted: 180,
          revenue: 90000,
          createdAt: '2023-12-15',
          sentAt: '2023-12-15',
          completedAt: '2023-12-20'
        },
        {
          _id: '3',
          name: 'SMS Promo',
          type: 'sms',
          status: 'draft',
          segment: 'segment-3',
          recipients: 500,
          sent: 0,
          delivered: 0,
          opened: 0,
          clicked: 0,
          converted: 0,
          revenue: 0,
          createdAt: '2024-01-15'
        },
        {
          _id: '4',
          name: 'Push Notification',
          type: 'push',
          status: 'paused',
          segment: 'segment-4',
          recipients: 800,
          sent: 400,
          delivered: 380,
          opened: 280,
          clicked: 90,
          converted: 25,
          revenue: 12500,
          createdAt: '2024-01-10'
        }
      ]);

      setSegments([
        {
          _id: 'segment-1',
          name: 'New Customers',
          type: 'dynamic',
          customerCount: 1000,
          criteria: [{ field: 'createdAt', operator: '>', value: '2024-01-01' }],
          lastUpdated: '2024-01-15'
        },
        {
          _id: 'segment-2',
          name: 'Premium Subscribers',
          type: 'static',
          customerCount: 500,
          criteria: [{ field: 'plan', operator: '=', value: 'premium' }],
          lastUpdated: '2024-01-10'
        },
        {
          _id: 'segment-3',
          name: 'Inactive Users',
          type: 'dynamic',
          customerCount: 300,
          criteria: [{ field: 'lastLogin', operator: '<', value: '2023-12-01' }],
          lastUpdated: '2024-01-05'
        }
      ]);

      setAnalytics({
        totalCampaigns: 4,
        activeCampaigns: 1,
        draftCampaigns: 1,
        completedCampaigns: 1,
        averageOpenRate: 52.5,
        averageClickRate: 18.5,
        averageConversionRate: 9.8,
        totalRevenue: 125000,
        totalRecipients: 4800,
        totalSent: 3650,
        totalOpened: 2230,
        totalClicked: 660,
        totalConverted: 250,
        topPerforming: [
          {
            _id: '2',
            name: 'Summer Sale Campaign',
            type: 'email',
            status: 'completed',
            segment: 'segment-2',
            recipients: 2500,
            sent: 2400,
            delivered: 2350,
            opened: 1500,
            clicked: 450,
            converted: 180,
            revenue: 90000,
            createdAt: '2023-12-15'
          }
        ],
        recentCampaigns: []
      });

    } catch (error: any) {
      console.error('Error fetching marketing data:', error);
      setError(error.message || 'Failed to load marketing data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCampaign = async (campaignData: CreateCampaignData) => {
    try {
      // Mock successful campaign creation
      const newCampaign: MarketingCampaign = {
        _id: Date.now().toString(),
        name: campaignData.name,
        type: campaignData.type,
        status: 'draft',
        segment: campaignData.segment,
        recipients: 0,
        sent: 0,
        delivered: 0,
        opened: 0,
        clicked: 0,
        converted: 0,
        revenue: 0,
        createdAt: new Date().toISOString(),
        scheduledFor: campaignData.scheduleType === 'scheduled' ? campaignData.scheduledDate : undefined
      };
      
      setCampaigns(prev => [newCampaign, ...prev]);
      setNewCampaignDialog(false);
      setSnackbar({ open: true, message: 'Campaign created successfully!', severity: 'success' });
      setRefreshKey(prev => prev + 1);
    } catch (error: any) {
      console.error('Error creating campaign:', error);
      setSnackbar({ open: true, message: error.message || 'Failed to create campaign', severity: 'error' });
    }
  };

  const handleToggleCampaignStatus = async (campaignId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'active' ? 'paused' : 'active';
      setCampaigns(prev => prev.map(campaign => 
        campaign._id === campaignId ? { ...campaign, status: newStatus } : campaign
      ));
      setSnackbar({ open: true, message: `Campaign ${newStatus === 'active' ? 'activated' : 'paused'}!`, severity: 'success' });
      setRefreshKey(prev => prev + 1);
    } catch (error: any) {
      console.error('Error updating campaign status:', error);
      setSnackbar({ open: true, message: 'Failed to update campaign status', severity: 'error' });
    }
  };

  const handleDeleteCampaign = async (campaignId: string) => {
    if (!confirm('Are you sure you want to delete this campaign?')) return;
    
    try {
      setCampaigns(prev => prev.filter(campaign => campaign._id !== campaignId));
      setSnackbar({ open: true, message: 'Campaign deleted successfully!', severity: 'success' });
      setRefreshKey(prev => prev + 1);
    } catch (error) {
      console.error('Error deleting campaign:', error);
      setSnackbar({ open: true, message: 'Failed to delete campaign', severity: 'error' });
    }
  };

  if (loading && !campaigns.length) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '80vh',
        backgroundColor: currentColors.background,
      }}>
        <CircularProgress sx={{ color: primaryColor }} />
      </Box>
    );
  }

  if (error && !campaigns.length) {
    return (
      <Box sx={{ 
        p: 3,
        backgroundColor: currentColors.background,
        minHeight: '100vh',
      }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Button 
          variant="contained" 
          onClick={fetchMarketingData}
          startIcon={<Refresh />}
          sx={{
            background: primaryColor,
            color: 'white',
            '&:hover': {
              background: '#3367D6',
            }
          }}
        >
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      backgroundColor: currentColors.background,
      minHeight: '100vh',
      color: currentColors.textPrimary,
      transition: 'background-color 0.3s ease',
      p: isMobile ? 1 : 2,
    }}>
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
            Marketing Automation
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
              <Email sx={{ 
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
                📧 Marketing Automation
              </Typography>
              <Typography
                variant="body1"
                color={currentColors.textSecondary}
                fontSize={isMobile ? '0.875rem' : '1rem'}
              >
                Build, schedule, and analyze multi-channel campaigns
              </Typography>
            </Box>
          </Box>

          <Box sx={{ 
            display: "flex", 
            gap: 1, 
            flexWrap: 'wrap',
            justifyContent: isMobile ? 'center' : 'flex-end'
          }}>
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={fetchMarketingData}
              disabled={loading}
              sx={{
                border: `1px solid ${currentColors.border}`,
                color: currentColors.textPrimary,
                borderRadius: '8px',
                textTransform: 'none',
                fontWeight: 500,
                fontSize: isMobile ? '0.875rem' : '1rem',
                minWidth: 'auto',
                '&:hover': {
                  borderColor: primaryColor,
                  backgroundColor: alpha(primaryColor, 0.04),
                }
              }}
            >
              {isMobile ? '' : 'Refresh'}
            </Button>
            
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setNewCampaignDialog(true)}
              sx={{
                background: primaryColor,
                color: 'white',
                borderRadius: '8px',
                textTransform: 'none',
                fontWeight: 500,
                fontSize: isMobile ? '0.875rem' : '1rem',
                minWidth: 'auto',
                '&:hover': {
                  background: '#3367D6',
                }
              }}
            >
              {isMobile ? 'New' : 'New Campaign'}
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Stats Cards */}
      {analytics && (
        <StatsCards 
          analytics={analytics}
          currentColors={currentColors}
          primaryColor={primaryColor}
          isMobile={isMobile}
        />
      )}

      {/* Campaign Performance Metrics */}
      {analytics && campaigns.length > 0 && (
        <CampaignMetrics 
          campaigns={campaigns}
          analytics={analytics}
          currentColors={currentColors}
          primaryColor={primaryColor}
          isMobile={isMobile}
        />
      )}

      {/* Tabs */}
      <Card sx={{ 
        mb: 3, 
        background: currentColors.card,
        border: `1px solid ${currentColors.border}`,
        borderRadius: '12px',
      }}>
        <Tabs 
          value={tabValue} 
          onChange={(_, newValue) => setTabValue(newValue)} 
          sx={{ 
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
          <Tab label="Campaigns" />
          <Tab label="Analytics" />
          <Tab label="Audiences" />
        </Tabs>
      </Card>

      {/* Tab Content */}
      {tabValue === 0 && (
        <CampaignsTab 
          campaigns={campaigns}
          segments={segments}
          onToggleStatus={handleToggleCampaignStatus}
          onDeleteCampaign={handleDeleteCampaign}
          currentColors={currentColors}
          primaryColor={primaryColor}
          isMobile={isMobile}
        />
      )}

      {tabValue === 1 && (
        <AnalyticsTab 
          analytics={analytics}
          campaigns={campaigns}
          currentColors={currentColors}
          primaryColor={primaryColor}
          isMobile={isMobile}
        />
      )}

      {tabValue === 2 && (
        <AudiencesTab 
          segments={segments}
          currentColors={currentColors}
          primaryColor={primaryColor}
          isMobile={isMobile}
        />
      )}

      {/* New Campaign Dialog */}
      <NewCampaignDialog 
        open={newCampaignDialog}
        onClose={() => setNewCampaignDialog(false)}
        segments={segments}
        onSubmit={handleCreateCampaign}
        currentColors={currentColors}
        primaryColor={primaryColor}
        autoOptimize={autoOptimize}
        onAutoOptimizeChange={setAutoOptimize}
      />

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ 
            width: '100%',
            backgroundColor: snackbar.severity === 'success' ? googleColors.green : googleColors.red,
            color: 'white'
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}