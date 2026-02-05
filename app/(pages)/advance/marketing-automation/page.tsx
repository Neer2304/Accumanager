'use client'

import { useState, useEffect } from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Switch,
  TextField,
  Select,
  MenuItem,
  Tabs,
  Tab,
  Paper,
  IconButton,
  LinearProgress,
  Divider,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Snackbar,
} from '@mui/material'
import {
  Email,
  Schedule,
  Analytics,
  Add,
  PlayArrow,
  Pause,
  Edit,
  Delete,
  TrendingUp,
  People,
  FilterList,
  MoreVert,
  CheckCircle,
  Error,
  ContentCopy,
  OpenInNew,
  Timer,
  Send,
  Campaign,
  BarChart,
  Refresh,
  Visibility,
  PersonAdd,
  ShoppingCart,
} from '@mui/icons-material'
import { useAdvanceThemeContext } from '@/contexts/AdvanceThemeContexts'

// Types based on your actual database models
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
  const { currentScheme } = useAdvanceThemeContext()
  const [tabValue, setTabValue] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [campaigns, setCampaigns] = useState<MarketingCampaign[]>([])
  const [segments, setSegments] = useState<CustomerSegment[]>([])
  const [analytics, setAnalytics] = useState<CampaignAnalytics | null>(null)
  const [newCampaignDialog, setNewCampaignDialog] = useState(false)
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' })
  const [autoOptimize, setAutoOptimize] = useState(true)
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    fetchMarketingData()
  }, [refreshKey])

  const fetchMarketingData = async () => {
    setLoading(true)
    setError(null)
    try {
      // Fetch all marketing data from your API
      const [campaignsRes, segmentsRes, analyticsRes] = await Promise.all([
        fetch('/api/advance/marketing/campaigns', {
          credentials: 'include',
        }),
        fetch('/api/advance/marketing/segments', {
          credentials: 'include',
        }),
        fetch('/api/advance/marketing/analytics', {
          credentials: 'include',
        })
      ])

      // Handle campaigns response
      if (!campaignsRes.ok) {
        if (campaignsRes.status === 401) {
          throw new Error('Please log in to access marketing automation')
        }
        throw new Error('Failed to fetch campaigns')
      }
      const campaignsData = await campaignsRes.json()
      
      // Handle segments response
      if (!segmentsRes.ok) {
        throw new Error('Failed to fetch segments')
      }
      const segmentsData = await segmentsRes.json()
      
      // Handle analytics response
      if (!analyticsRes.ok) {
        throw new Error('Failed to fetch analytics')
      }
      const analyticsData = await analyticsRes.json()

      if (campaignsData.success) {
        setCampaigns(campaignsData.data || [])
      }
      
      if (segmentsData.success) {
        setSegments(segmentsData.data || [])
      }
      
      if (analyticsData.success) {
        setAnalytics(analyticsData.data)
      }

    } catch (error: any) {
      console.error('Error fetching marketing data:', error)
      setError(error.message || 'Failed to load marketing data')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateCampaign = async (campaignData: CreateCampaignData) => {
    try {
      const response = await fetch('/api/advance/marketing/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(campaignData),
      })

      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          setCampaigns(prev => [result.data, ...prev])
          setNewCampaignDialog(false)
          setSnackbar({ open: true, message: 'Campaign created successfully!', severity: 'success' })
          setRefreshKey(prev => prev + 1) // Trigger data refresh
        } else {
          setSnackbar({ open: true, message: result.message || 'Failed to create campaign', severity: 'error' })
        }
      } else {
        const errorData = await response.json()
        setSnackbar({ open: true, message: errorData.message || 'Failed to create campaign', severity: 'error' })
      }
    } catch (error: any) {
      console.error('Error creating campaign:', error)
      setSnackbar({ open: true, message: error.message || 'Failed to create campaign', severity: 'error' })
    }
  }

  const handleToggleCampaignStatus = async (campaignId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'active' ? 'paused' : 'active'
      const response = await fetch(`/api/advance/marketing/campaigns/${campaignId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          setCampaigns(prev => prev.map(campaign => 
            campaign._id === campaignId ? { ...campaign, status: newStatus } : campaign
          ))
          setSnackbar({ open: true, message: `Campaign ${newStatus === 'active' ? 'activated' : 'paused'}!`, severity: 'success' })
          setRefreshKey(prev => prev + 1) // Trigger analytics refresh
        } else {
          setSnackbar({ open: true, message: result.message || 'Failed to update campaign', severity: 'error' })
        }
      }
    } catch (error: any) {
      console.error('Error updating campaign status:', error)
      setSnackbar({ open: true, message: 'Failed to update campaign status', severity: 'error' })
    }
  }

  const handleDeleteCampaign = async (campaignId: string) => {
    if (!confirm('Are you sure you want to delete this campaign?')) return
    
    try {
      const response = await fetch(`/api/advance/marketing/campaigns/${campaignId}`, {
        method: 'DELETE',
        credentials: 'include',
      })

      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          setCampaigns(prev => prev.filter(campaign => campaign._id !== campaignId))
          setSnackbar({ open: true, message: 'Campaign deleted successfully!', severity: 'success' })
          setRefreshKey(prev => prev + 1)
        }
      }
    } catch (error) {
      console.error('Error deleting campaign:', error)
      setSnackbar({ open: true, message: 'Failed to delete campaign', severity: 'error' })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return currentScheme.colors.buttons.success
      case 'paused':
        return currentScheme.colors.buttons.warning
      case 'draft':
        return currentScheme.colors.text.secondary
      case 'completed':
        return currentScheme.colors.buttons.info
      case 'cancelled':
        return currentScheme.colors.buttons.error
      default:
        return currentScheme.colors.buttons.text
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'email':
        return <Email fontSize="small" />
      case 'sms':
        return <Send fontSize="small" />
      case 'push':
        return <Campaign fontSize="small" />
      default:
        return <Email fontSize="small" />
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not scheduled'
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading && !campaigns.length) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    )
  }

  if (error && !campaigns.length) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Button 
          variant="contained" 
          onClick={fetchMarketingData}
          startIcon={<Refresh />}
        >
          Retry
        </Button>
      </Box>
    )
  }

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: { xs: 'flex-start', md: 'center' }, justifyContent: 'space-between', gap: 2, mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              sx={{
                width: 60,
                height: 60,
                borderRadius: 3,
                background: `linear-gradient(135deg, ${currentScheme.colors.primary} 0%, ${currentScheme.colors.secondary} 100%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Email sx={{ fontSize: 32, color: 'white' }} />
            </Box>
            <Box>
              <Typography variant="h4" fontWeight="bold">
                📧 Marketing Automation
              </Typography>
              <Typography variant="body1" color={currentScheme.colors.text.secondary}>
                Build, schedule, and analyze multi-channel campaigns
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={fetchMarketingData}
              disabled={loading}
              sx={{
                borderColor: currentScheme.colors.components.border,
                color: currentScheme.colors.text.primary,
              }}
            >
              Refresh
            </Button>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setNewCampaignDialog(true)}
              sx={{
                background: `linear-gradient(135deg, ${currentScheme.colors.primary} 0%, ${currentScheme.colors.secondary} 100%)`,
              }}
            >
              New Campaign
            </Button>
          </Box>
        </Box>

        {/* Stats */}
        {analytics && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
            <Card
              sx={{
                flex: '1 1 200px',
                minWidth: '200px',
                background: currentScheme.colors.components.card,
                border: `1px solid ${currentScheme.colors.components.border}`,
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" fontWeight="bold">
                      {analytics.totalCampaigns}
                    </Typography>
                    <Typography variant="body2" color={currentScheme.colors.text.secondary}>
                      Total Campaigns
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: 2,
                      background: `${currentScheme.colors.primary}20`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: currentScheme.colors.primary,
                    }}
                  >
                    <Campaign />
                  </Box>
                </Box>
                <Typography variant="caption" sx={{ color: currentScheme.colors.buttons.success, mt: 1, display: 'block' }}>
                  {analytics.activeCampaigns} active • {analytics.draftCampaigns} draft
                </Typography>
              </CardContent>
            </Card>
            
            <Card
              sx={{
                flex: '1 1 200px',
                minWidth: '200px',
                background: currentScheme.colors.components.card,
                border: `1px solid ${currentScheme.colors.components.border}`,
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" fontWeight="bold">
                      {analytics.averageOpenRate.toFixed(1)}%
                    </Typography>
                    <Typography variant="body2" color={currentScheme.colors.text.secondary}>
                      Avg Open Rate
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: 2,
                      background: `${currentScheme.colors.secondary}20`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: currentScheme.colors.secondary,
                    }}
                  >
                    <Visibility />
                  </Box>
                </Box>
                <Typography variant="caption" sx={{ color: currentScheme.colors.buttons.success, mt: 1, display: 'block' }}>
                  {analytics.totalOpened.toLocaleString()} opened
                </Typography>
              </CardContent>
            </Card>
            
            <Card
              sx={{
                flex: '1 1 200px',
                minWidth: '200px',
                background: currentScheme.colors.components.card,
                border: `1px solid ${currentScheme.colors.components.border}`,
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" fontWeight="bold">
                      {analytics.averageConversionRate.toFixed(1)}%
                    </Typography>
                    <Typography variant="body2" color={currentScheme.colors.text.secondary}>
                      Avg Conversion
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: 2,
                      background: `${currentScheme.colors.buttons.success}20`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: currentScheme.colors.buttons.success,
                    }}
                  >
                    <TrendingUp />
                  </Box>
                </Box>
                <Typography variant="caption" sx={{ color: currentScheme.colors.buttons.success, mt: 1, display: 'block' }}>
                  {analytics.totalConverted.toLocaleString()} converted
                </Typography>
              </CardContent>
            </Card>
            
            <Card
              sx={{
                flex: '1 1 200px',
                minWidth: '200px',
                background: currentScheme.colors.components.card,
                border: `1px solid ${currentScheme.colors.components.border}`,
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" fontWeight="bold">
                      {formatCurrency(analytics.totalRevenue)}
                    </Typography>
                    <Typography variant="body2" color={currentScheme.colors.text.secondary}>
                      Total Revenue
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: 2,
                      background: `${currentScheme.colors.buttons.warning}20`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: currentScheme.colors.buttons.warning,
                    }}
                  >
                    <ShoppingCart />
                  </Box>
                </Box>
                <Typography variant="caption" sx={{ color: currentScheme.colors.buttons.success, mt: 1, display: 'block' }}>
                  From {analytics.totalRecipients.toLocaleString()} recipients
                </Typography>
              </CardContent>
            </Card>
          </Box>
        )}
      </Box>

      {/* Tabs */}
      <Card sx={{ mb: 3, background: currentScheme.colors.components.card, border: `1px solid ${currentScheme.colors.components.border}` }}>
        <Tabs
          value={tabValue}
          onChange={(_, newValue) => setTabValue(newValue)}
          sx={{
            borderBottom: `1px solid ${currentScheme.colors.components.border}`,
            '& .MuiTab-root': {
              color: currentScheme.colors.text.secondary,
              '&.Mui-selected': {
                color: currentScheme.colors.primary,
              },
            },
          }}
        >
          <Tab icon={<Email />} iconPosition="start" label="Campaigns" />
          <Tab icon={<Analytics />} iconPosition="start" label="Analytics" />
          <Tab icon={<People />} iconPosition="start" label="Audiences" />
        </Tabs>
      </Card>

      {/* Main Content */}
      {tabValue === 0 && (
        <CampaignsTab
          campaigns={campaigns}
          segments={segments}
          onToggleStatus={handleToggleCampaignStatus}
          onDeleteCampaign={handleDeleteCampaign}
          currentScheme={currentScheme}
          getStatusColor={getStatusColor}
          getTypeIcon={getTypeIcon}
          formatCurrency={formatCurrency}
          formatDate={formatDate}
        />
      )}
      
      {tabValue === 1 && (
        <AnalyticsTab
          analytics={analytics}
          campaigns={campaigns}
          currentScheme={currentScheme}
          formatCurrency={formatCurrency}
        />
      )}
      
      {tabValue === 2 && (
        <AudiencesTab
          segments={segments}
          currentScheme={currentScheme}
        />
      )}

      {/* New Campaign Dialog */}
      <NewCampaignDialog
        open={newCampaignDialog}
        onClose={() => setNewCampaignDialog(false)}
        segments={segments}
        onSubmit={handleCreateCampaign}
        currentScheme={currentScheme}
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
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}

// Campaigns Tab Component
function CampaignsTab({ campaigns, segments, onToggleStatus, onDeleteCampaign, currentScheme, getStatusColor, getTypeIcon, formatCurrency, formatDate }: any) {
  const [selectedSegment, setSelectedSegment] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')

  const filteredCampaigns = campaigns.filter((campaign: MarketingCampaign) => {
    if (selectedSegment !== 'all' && campaign.segment !== selectedSegment) return false
    if (selectedStatus !== 'all' && campaign.status !== selectedStatus) return false
    return true
  })

  const calculateMetrics = (campaign: MarketingCampaign) => {
    const openRate = campaign.sent > 0 ? (campaign.opened / campaign.sent * 100) : 0
    const clickRate = campaign.sent > 0 ? (campaign.clicked / campaign.sent * 100) : 0
    const conversionRate = campaign.sent > 0 ? (campaign.converted / campaign.sent * 100) : 0
    return { openRate, clickRate, conversionRate }
  }

  return (
    <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
      {/* Left Column */}
      <Box sx={{ flex: 2, minWidth: '300px' }}>
        {/* Campaigns List */}
        <Card
          sx={{
            background: currentScheme.colors.components.card,
            border: `1px solid ${currentScheme.colors.components.border}`,
            mb: 3,
          }}
        >
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h6" fontWeight="bold">
                Campaigns ({campaigns.length})
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Select
                  value={selectedSegment}
                  onChange={(e) => setSelectedSegment(e.target.value)}
                  size="small"
                  sx={{
                    background: currentScheme.colors.components.input,
                    borderColor: currentScheme.colors.components.border,
                    color: currentScheme.colors.text.primary,
                    minWidth: 120,
                  }}
                >
                  <MenuItem value="all">All Segments</MenuItem>
                  {segments.map((segment: CustomerSegment) => (
                    <MenuItem key={segment._id} value={segment._id}>
                      {segment.name}
                    </MenuItem>
                  ))}
                </Select>
                <Select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  size="small"
                  sx={{
                    background: currentScheme.colors.components.input,
                    borderColor: currentScheme.colors.components.border,
                    color: currentScheme.colors.text.primary,
                    minWidth: 120,
                  }}
                >
                  <MenuItem value="all">All Status</MenuItem>
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="draft">Draft</MenuItem>
                  <MenuItem value="paused">Paused</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                  <MenuItem value="cancelled">Cancelled</MenuItem>
                </Select>
              </Box>
            </Box>

            {/* Campaigns Table */}
            {filteredCampaigns.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="body1" color={currentScheme.colors.text.secondary}>
                  No campaigns found
                </Typography>
                {selectedSegment !== 'all' || selectedStatus !== 'all' ? (
                  <Button
                    variant="text"
                    size="small"
                    onClick={() => {
                      setSelectedSegment('all')
                      setSelectedStatus('all')
                    }}
                    sx={{ mt: 1 }}
                  >
                    Clear filters
                  </Button>
                ) : null}
              </Box>
            ) : (
              <TableContainer component={Paper} sx={{ background: currentScheme.colors.components.input }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ color: currentScheme.colors.text.secondary }}>Campaign</TableCell>
                      <TableCell sx={{ color: currentScheme.colors.text.secondary }}>Status</TableCell>
                      <TableCell sx={{ color: currentScheme.colors.text.secondary }}>Type</TableCell>
                      <TableCell sx={{ color: currentScheme.colors.text.secondary }}>Sent/Delivered</TableCell>
                      <TableCell sx={{ color: currentScheme.colors.text.secondary }}>Metrics</TableCell>
                      <TableCell sx={{ color: currentScheme.colors.text.secondary }}>Revenue</TableCell>
                      <TableCell sx={{ color: currentScheme.colors.text.secondary }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredCampaigns.map((campaign: MarketingCampaign) => {
                      const metrics = calculateMetrics(campaign)
                      return (
                        <TableRow key={campaign._id}>
                          <TableCell>
                            <Typography variant="body2" fontWeight="medium">
                              {campaign.name}
                            </Typography>
                            <Typography variant="caption" color={currentScheme.colors.text.secondary}>
                              {campaign.recipients.toLocaleString()} recipients
                            </Typography>
                            {campaign.scheduledFor && (
                              <Typography variant="caption" color={currentScheme.colors.text.secondary} display="block">
                                Scheduled: {formatDate(campaign.scheduledFor)}
                              </Typography>
                            )}
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={campaign.status}
                              size="small"
                              sx={{
                                background: `${getStatusColor(campaign.status)}20`,
                                color: getStatusColor(campaign.status),
                                textTransform: 'capitalize',
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              {getTypeIcon(campaign.type)}
                              <Typography variant="caption" sx={{ textTransform: 'capitalize' }}>
                                {campaign.type}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {campaign.sent.toLocaleString()}
                            </Typography>
                            <Typography variant="caption" color={currentScheme.colors.text.secondary}>
                              of {campaign.delivered.toLocaleString()} delivered
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography variant="caption" color={currentScheme.colors.text.secondary}>
                                  Open:
                                </Typography>
                                <Typography variant="caption" fontWeight="bold">
                                  {metrics.openRate.toFixed(1)}%
                                </Typography>
                              </Box>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography variant="caption" color={currentScheme.colors.text.secondary}>
                                  Click:
                                </Typography>
                                <Typography variant="caption" fontWeight="bold">
                                  {metrics.clickRate.toFixed(1)}%
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" fontWeight="bold">
                              {formatCurrency(campaign.revenue)}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', gap: 0.5 }}>
                              {campaign.status === 'active' || campaign.status === 'paused' ? (
                                <Tooltip title={campaign.status === 'active' ? 'Pause' : 'Activate'}>
                                  <IconButton 
                                    size="small"
                                    onClick={() => onToggleStatus(campaign._id, campaign.status)}
                                  >
                                    {campaign.status === 'active' ? <Pause /> : <PlayArrow />}
                                  </IconButton>
                                </Tooltip>
                              ) : null}
                              {campaign.status === 'draft' && (
                                <Tooltip title="Edit">
                                  <IconButton size="small">
                                    <Edit />
                                  </IconButton>
                                </Tooltip>
                              )}
                              <Tooltip title="Delete">
                                <IconButton 
                                  size="small"
                                  onClick={() => onDeleteCampaign(campaign._id)}
                                >
                                  <Delete />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </CardContent>
        </Card>
      </Box>

      {/* Right Column - Campaign Performance */}
      <Box sx={{ flex: 1, minWidth: '300px' }}>
        {/* Quick Stats */}
        <Card sx={{ 
          background: currentScheme.colors.components.card,
          border: `1px solid ${currentScheme.colors.components.border}`,
          mb: 3,
        }}>
          <CardContent>
            <Typography variant="h6" fontWeight="bold" mb={3}>
              Campaign Performance
            </Typography>
            
            {campaigns.slice(0, 3).map((campaign: MarketingCampaign) => {
              const metrics = calculateMetrics(campaign)
              
              return (
                <Box key={campaign._id} sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" fontWeight="medium" sx={{ 
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      maxWidth: '70%'
                    }}>
                      {campaign.name}
                    </Typography>
                    <Chip
                      label={campaign.status}
                      size="small"
                      sx={{
                        background: `${getStatusColor(campaign.status)}20`,
                        color: getStatusColor(campaign.status),
                        fontSize: '0.65rem',
                        height: 20,
                      }}
                    />
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                    <Typography variant="caption" color={currentScheme.colors.text.secondary}>
                      Open Rate
                    </Typography>
                    <Typography variant="caption" fontWeight="bold">
                      {metrics.openRate.toFixed(1)}%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={Math.min(metrics.openRate, 100)}
                    sx={{
                      height: 4,
                      borderRadius: 2,
                      backgroundColor: `${currentScheme.colors.components.border}40`,
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: metrics.openRate > 50 
                          ? currentScheme.colors.primary 
                          : metrics.openRate > 25 
                          ? currentScheme.colors.secondary 
                          : currentScheme.colors.buttons.warning,
                      },
                      mb: 1.5,
                    }}
                  />
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                    <Typography variant="caption" color={currentScheme.colors.text.secondary}>
                      Click Rate
                    </Typography>
                    <Typography variant="caption" fontWeight="bold">
                      {metrics.clickRate.toFixed(1)}%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={Math.min(metrics.clickRate, 100)}
                    sx={{
                      height: 4,
                      borderRadius: 2,
                      backgroundColor: `${currentScheme.colors.components.border}40`,
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: metrics.clickRate > 10 
                          ? currentScheme.colors.secondary 
                          : currentScheme.colors.buttons.warning,
                      },
                    }}
                  />
                </Box>
              )
            })}
          </CardContent>
        </Card>
      </Box>
    </Box>
  )
}

// Analytics Tab Component
function AnalyticsTab({ analytics, campaigns, currentScheme, formatCurrency }: any) {
  if (!analytics) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="body1" color={currentScheme.colors.text.secondary}>
          No analytics data available
        </Typography>
      </Box>
    )
  }

  // Calculate campaign performance distribution
  const performanceDistribution = {
    high: campaigns.filter((c: MarketingCampaign) => {
      const openRate = c.sent > 0 ? (c.opened / c.sent * 100) : 0
      return openRate >= 50
    }).length,
    medium: campaigns.filter((c: MarketingCampaign) => {
      const openRate = c.sent > 0 ? (c.opened / c.sent * 100) : 0
      return openRate >= 20 && openRate < 50
    }).length,
    low: campaigns.filter((c: MarketingCampaign) => {
      const openRate = c.sent > 0 ? (c.opened / c.sent * 100) : 0
      return openRate < 20
    }).length,
  }

  return (
    <Box>
      <Typography variant="h6" fontWeight="bold" mb={3}>
        Campaign Analytics
      </Typography>
      
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
        {[
          { label: 'Total Campaigns', value: analytics.totalCampaigns, color: currentScheme.colors.primary, icon: <Campaign /> },
          { label: 'Active Campaigns', value: analytics.activeCampaigns, color: currentScheme.colors.buttons.success, icon: <PlayArrow /> },
          { label: 'Total Recipients', value: analytics.totalRecipients.toLocaleString(), color: currentScheme.colors.secondary, icon: <People /> },
          { label: 'Total Sent', value: analytics.totalSent.toLocaleString(), color: currentScheme.colors.buttons.info, icon: <Send /> },
          { label: 'Total Opened', value: analytics.totalOpened.toLocaleString(), color: currentScheme.colors.buttons.warning, icon: <Visibility /> },
          { label: 'Total Revenue', value: formatCurrency(analytics.totalRevenue), color: currentScheme.colors.buttons.success, icon: <ShoppingCart /> },
        ].map((stat, index) => (
          <Card
            key={index}
            sx={{
              flex: '1 1 200px',
              minWidth: '200px',
              background: currentScheme.colors.components.card,
              border: `1px solid ${currentScheme.colors.components.border}`,
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h5" fontWeight="bold" sx={{ color: stat.color }}>
                    {stat.value}
                  </Typography>
                  <Typography variant="body2" color={currentScheme.colors.text.secondary}>
                    {stat.label}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 2,
                    background: `${stat.color}20`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: stat.color,
                  }}
                >
                  {stat.icon}
                </Box>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
      
      {/* Performance Metrics */}
      <Card sx={{ 
        background: currentScheme.colors.components.card,
        border: `1px solid ${currentScheme.colors.components.border}`,
        mb: 3,
      }}>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" mb={3}>
            Performance Metrics
          </Typography>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {[
              { label: 'Average Open Rate', value: analytics.averageOpenRate, target: 25, color: currentScheme.colors.primary },
              { label: 'Average Click Rate', value: analytics.averageClickRate, target: 10, color: currentScheme.colors.secondary },
              { label: 'Average Conversion Rate', value: analytics.averageConversionRate, target: 5, color: currentScheme.colors.buttons.success },
            ].map((metric, index) => (
              <Box key={index}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="body1" sx={{ color: currentScheme.colors.text.primary }}>
                    {metric.label}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="h6" fontWeight="bold" sx={{ color: metric.color }}>
                      {metric.value.toFixed(1)}%
                    </Typography>
                    <Typography variant="caption" color={metric.value >= metric.target ? currentScheme.colors.buttons.success : currentScheme.colors.buttons.error}>
                      {metric.value >= metric.target ? '✓' : '✗'} Target: {metric.target}%
                    </Typography>
                  </Box>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={Math.min(metric.value, 100)}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: `${currentScheme.colors.components.border}40`,
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: metric.color,
                      borderRadius: 4,
                    },
                  }}
                />
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>
      
      {/* Top Performing Campaigns */}
      {analytics.topPerforming && analytics.topPerforming.length > 0 && (
        <Card sx={{ 
          background: currentScheme.colors.components.card,
          border: `1px solid ${currentScheme.colors.components.border}`,
        }}>
          <CardContent>
            <Typography variant="h6" fontWeight="bold" mb={3}>
              Top Performing Campaigns
            </Typography>
            
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ color: currentScheme.colors.text.secondary }}>Campaign</TableCell>
                    <TableCell sx={{ color: currentScheme.colors.text.secondary }} align="right">Open Rate</TableCell>
                    <TableCell sx={{ color: currentScheme.colors.text.secondary }} align="right">Click Rate</TableCell>
                    <TableCell sx={{ color: currentScheme.colors.text.secondary }} align="right">Conversion</TableCell>
                    <TableCell sx={{ color: currentScheme.colors.text.secondary }} align="right">Revenue</TableCell>
                    <TableCell sx={{ color: currentScheme.colors.text.secondary }} align="right">ROI</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {analytics.topPerforming.map((campaign: MarketingCampaign) => {
                    const openRate = campaign.sent > 0 ? (campaign.opened / campaign.sent * 100) : 0
                    const clickRate = campaign.sent > 0 ? (campaign.clicked / campaign.sent * 100) : 0
                    const conversionRate = campaign.sent > 0 ? (campaign.converted / campaign.sent * 100) : 0
                    const roi = campaign.revenue > 0 ? ((campaign.revenue - (campaign.sent * 0.5)) / (campaign.sent * 0.5) * 100) : 0 // Simple ROI calculation
                    
                    return (
                      <TableRow key={campaign._id}>
                        <TableCell>
                          <Typography variant="body2" fontWeight="medium">
                            {campaign.name}
                          </Typography>
                          <Typography variant="caption" color={currentScheme.colors.text.secondary}>
                            {campaign.type} • {campaign.status}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Chip
                            label={`${openRate.toFixed(1)}%`}
                            size="small"
                            sx={{
                              background: openRate >= 50 
                                ? `${currentScheme.colors.buttons.success}20`
                                : openRate >= 25 
                                ? `${currentScheme.colors.buttons.warning}20`
                                : `${currentScheme.colors.buttons.error}20`,
                              color: openRate >= 50 
                                ? currentScheme.colors.buttons.success
                                : openRate >= 25 
                                ? currentScheme.colors.buttons.warning
                                : currentScheme.colors.buttons.error,
                            }}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" fontWeight="bold">
                            {clickRate.toFixed(1)}%
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" fontWeight="bold">
                            {conversionRate.toFixed(1)}%
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" fontWeight="bold">
                            {formatCurrency(campaign.revenue)}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Chip
                            label={`${roi.toFixed(0)}%`}
                            size="small"
                            sx={{
                              background: roi > 100 
                                ? `${currentScheme.colors.buttons.success}20`
                                : roi > 0 
                                ? `${currentScheme.colors.buttons.warning}20`
                                : `${currentScheme.colors.buttons.error}20`,
                              color: roi > 100 
                                ? currentScheme.colors.buttons.success
                                : roi > 0 
                                ? currentScheme.colors.buttons.warning
                                : currentScheme.colors.buttons.error,
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}
    </Box>
  )
}

// Audiences Tab Component
function AudiencesTab({ segments, currentScheme }: any) {
  if (!segments || segments.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="body1" color={currentScheme.colors.text.secondary}>
          No audience segments created yet
        </Typography>
      </Box>
    )
  }

  return (
    <Box>
      <Typography variant="h6" fontWeight="bold" mb={3}>
        Customer Segments ({segments.length})
      </Typography>
      
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        {segments.map((segment: CustomerSegment) => (
          <Card
            key={segment._id}
            sx={{
              flex: '1 1 300px',
              minWidth: '300px',
              background: currentScheme.colors.components.card,
              border: `1px solid ${currentScheme.colors.components.border}`,
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6" fontWeight="medium">
                  {segment.name}
                </Typography>
                <Chip
                  label={segment.type}
                  size="small"
                  sx={{
                    background: segment.type === 'dynamic' 
                      ? `${currentScheme.colors.primary}20`
                      : `${currentScheme.colors.secondary}20`,
                    color: segment.type === 'dynamic' 
                      ? currentScheme.colors.primary
                      : currentScheme.colors.secondary,
                    textTransform: 'capitalize',
                  }}
                />
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    background: `${currentScheme.colors.primary}20`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: currentScheme.colors.primary,
                  }}
                >
                  <Typography variant="h6" fontWeight="bold">
                    {segment.customerCount}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color={currentScheme.colors.text.secondary}>
                    Customers
                  </Typography>
                  <Typography variant="caption" color={currentScheme.colors.text.secondary}>
                    Updated: {new Date(segment.lastUpdated).toLocaleDateString()}
                  </Typography>
                </Box>
              </Box>
              
              {segment.criteria && segment.criteria.length > 0 && (
                <>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="subtitle2" fontWeight="medium" gutterBottom>
                    Segment Criteria
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {segment.criteria.slice(0, 3).map((criterion: any, index: number) => (
                      <Typography key={index} variant="caption" color={currentScheme.colors.text.secondary}>
                        • {criterion.field} {criterion.operator} {criterion.value}
                      </Typography>
                    ))}
                    {segment.criteria.length > 3 && (
                      <Typography variant="caption" color={currentScheme.colors.text.secondary}>
                        + {segment.criteria.length - 3} more conditions
                      </Typography>
                    )}
                  </Box>
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  )
}

// New Campaign Dialog Component
function NewCampaignDialog({ open, onClose, segments, onSubmit, currentScheme, autoOptimize, onAutoOptimizeChange }: any) {
  const [formData, setFormData] = useState<CreateCampaignData>({
    name: '',
    type: 'email',
    segment: segments[0]?._id || '',
    scheduleType: 'immediate',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'Campaign name is required'
    }
    
    if (!formData.segment) {
      newErrors.segment = 'Please select a segment'
    }
    
    if (formData.scheduleType === 'scheduled' && !formData.scheduledDate) {
      newErrors.scheduledDate = 'Please select a date and time'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(formData)
      // Reset form
      setFormData({
        name: '',
        type: 'email',
        segment: segments[0]?._id || '',
        scheduleType: 'immediate',
      })
      setErrors({})
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ color: currentScheme.colors.text.primary }}>
        Create New Campaign
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
          <TextField
            label="Campaign Name *"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            fullWidth
            size="small"
            placeholder="e.g., Welcome Series, Summer Sale"
            error={!!errors.name}
            helperText={errors.name}
          />
          
          <Select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value as 'email' | 'sms' | 'push' })}
            fullWidth
            size="small"
          >
            <MenuItem value="email">Email Campaign</MenuItem>
            <MenuItem value="sms">SMS Campaign</MenuItem>
            <MenuItem value="push">Push Notification</MenuItem>
          </Select>
          
          <Select
            value={formData.segment}
            onChange={(e) => setFormData({ ...formData, segment: e.target.value })}
            fullWidth
            size="small"
            error={!!errors.segment}
          >
            {segments.map((segment: CustomerSegment) => (
              <MenuItem key={segment._id} value={segment._id}>
                {segment.name} ({segment.customerCount} customers)
              </MenuItem>
            ))}
          </Select>
          {errors.segment && (
            <Typography variant="caption" color="error">
              {errors.segment}
            </Typography>
          )}
          
          <Select
            value={formData.scheduleType}
            onChange={(e) => setFormData({ ...formData, scheduleType: e.target.value as 'immediate' | 'scheduled' })}
            fullWidth
            size="small"
          >
            <MenuItem value="immediate">Send Immediately</MenuItem>
            <MenuItem value="scheduled">Schedule for Later</MenuItem>
          </Select>
          
          {formData.scheduleType === 'scheduled' && (
            <TextField
              type="datetime-local"
              value={formData.scheduledDate}
              onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
              fullWidth
              size="small"
              error={!!errors.scheduledDate}
              helperText={errors.scheduledDate}
            />
          )}
          
          {formData.type === 'email' && (
            <TextField
              label="Email Subject"
              value={formData.subject || ''}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              fullWidth
              size="small"
              placeholder="Enter email subject"
            />
          )}
          
          {(formData.type === 'email' || formData.type === 'sms') && (
            <TextField
              label="Content"
              value={formData.content || ''}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              fullWidth
              size="small"
              multiline
              rows={3}
              placeholder={`Enter your ${formData.type} content here...`}
            />
          )}
          
          <FormControlLabel
            control={
              <Switch
                checked={autoOptimize}
                onChange={(e) => onAutoOptimizeChange(e.target.checked)}
                color="primary"
              />
            }
            label="AI Auto-optimize send times"
          />
          
          {autoOptimize && (
            <Alert severity="info" sx={{ fontSize: '0.875rem' }}>
              Campaign will be sent at optimal times based on recipient behavior patterns
            </Alert>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          sx={{
            background: `linear-gradient(135deg, ${currentScheme.colors.primary} 0%, ${currentScheme.colors.secondary} 100%)`,
          }}
        >
          Create Campaign
        </Button>
      </DialogActions>
    </Dialog>
  )
}