// app/(pages)/advance/marketing-automation/page.tsx
'use client'

import { useState } from 'react'
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
  Avatar,
  AvatarGroup,
  Divider,
  FormControlLabel,
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
  ContentCopy,
  TrendingUp,
  People,
  OpenInNew,
  FilterList,
  MoreVert,
  CheckCircle,
  Error,
} from '@mui/icons-material'
import { useAdvanceThemeContext } from '@/contexts/AdvanceThemeContexts'

const mockCampaigns = [
  { id: 1, name: 'Welcome Series', type: 'Email', status: 'active', recipients: 1250, openRate: 68, clickRate: 24 },
  { id: 2, name: 'Cart Abandonment', type: 'SMS', status: 'paused', recipients: 845, openRate: 72, clickRate: 32 },
  { id: 3, name: 'Product Launch', type: 'Email', status: 'draft', recipients: 0, openRate: 0, clickRate: 0 },
  { id: 4, name: 'Re-engagement', type: 'Push', status: 'active', recipients: 2300, openRate: 45, clickRate: 18 },
]

const mockSequences = [
  { step: 1, trigger: 'Sign Up', action: 'Send Welcome Email', delay: 'Immediate' },
  { step: 2, trigger: 'Day 3', action: 'Feature Tutorial', delay: '3 days' },
  { step: 3, trigger: 'Day 7', action: 'Special Offer', delay: '7 days' },
  { step: 4, trigger: 'Day 14', action: 'Feedback Request', delay: '14 days' },
]

export default function MarketingAutomationPage() {
  const { currentScheme } = useAdvanceThemeContext()
  const [tabValue, setTabValue] = useState(0)
  const [autoOptimize, setAutoOptimize] = useState(true)
  const [campaignType, setCampaignType] = useState('email')

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Box display="flex" alignItems="center" gap={2}>
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
          
          <Button
            variant="contained"
            startIcon={<Add />}
            sx={{
              background: `linear-gradient(135deg, ${currentScheme.colors.primary} 0%, ${currentScheme.colors.secondary} 100%)`,
            }}
          >
            New Campaign
          </Button>
        </Box>

        {/* Stats */}
        <Box display="flex" gap={2} flexWrap="wrap" mb={3}>
          {[
            { label: 'Active Campaigns', value: '12', icon: <Email />, change: '+2' },
            { label: 'Avg Open Rate', value: '64%', icon: <Analytics />, change: '+5.2%' },
            { label: 'Total Recipients', value: '45.2K', icon: <People />, change: '+12%' },
            { label: 'Conversion Rate', value: '18%', icon: <TrendingUp />, change: '+3.1%' },
          ].map((stat, index) => (
            <Card
              key={index}
              sx={{
                flex: 1,
                minWidth: '200px',
                background: currentScheme.colors.components.card,
                border: `1px solid ${currentScheme.colors.components.border}`,
              }}
            >
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography variant="h4" fontWeight="bold">
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
                      background: `${currentScheme.colors.primary}20`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: currentScheme.colors.primary,
                    }}
                  >
                    {stat.icon}
                  </Box>
                </Box>
                <Typography variant="caption" sx={{ color: currentScheme.colors.buttons.success, mt: 1 }}>
                  {stat.change} this month
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Box>

      {/* Tabs */}
      <Card sx={{ mb: 3, background: currentScheme.colors.components.card }}>
        <Tabs
          value={tabValue}
          onChange={(_, newValue) => setTabValue(newValue)}
          sx={{
            borderBottom: `1px solid ${currentScheme.colors.components.border}`,
            '& .MuiTab-root': {
              color: currentScheme.colors.text.secondary,
            },
            '& .Mui-selected': {
              color: currentScheme.colors.primary,
            },
          }}
        >
          <Tab icon={<Email />} iconPosition="start" label="Campaigns" />
          <Tab icon={<Schedule />} iconPosition="start" label="Sequences" />
          <Tab icon={<Analytics />} iconPosition="start" label="Analytics" />
          <Tab icon={<People />} iconPosition="start" label="Audiences" />
        </Tabs>
      </Card>

      {/* Main Content */}
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
              <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
                <Typography variant="h6" fontWeight="bold">
                  Campaigns
                </Typography>
                <Box display="flex" gap={1}>
                  <Select
                    value={campaignType}
                    onChange={(e) => setCampaignType(e.target.value)}
                    size="small"
                    sx={{
                      background: currentScheme.colors.components.input,
                      borderColor: currentScheme.colors.components.border,
                      color: currentScheme.colors.text.primary,
                      minWidth: 120,
                    }}
                  >
                    <MenuItem value="all">All Types</MenuItem>
                    <MenuItem value="email">Email</MenuItem>
                    <MenuItem value="sms">SMS</MenuItem>
                    <MenuItem value="push">Push</MenuItem>
                  </Select>
                  <Button
                    variant="outlined"
                    startIcon={<FilterList />}
                    sx={{
                      borderColor: currentScheme.colors.components.border,
                      color: currentScheme.colors.text.primary,
                    }}
                  >
                    Filter
                  </Button>
                </Box>
              </Box>

              {/* Campaign Cards */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {mockCampaigns.map((campaign) => (
                  <Paper
                    key={campaign.id}
                    sx={{
                      p: 2,
                      background: currentScheme.colors.background,
                      border: `1px solid ${currentScheme.colors.components.border}`,
                      borderRadius: 2,
                    }}
                  >
                    <Box display="flex" alignItems="center" justifyContent="space-between">
                      <Box>
                        <Box display="flex" alignItems="center" gap={1} mb={1}>
                          <Chip
                            label={campaign.status}
                            size="small"
                            sx={{
                              background: campaign.status === 'active' 
                                ? `${currentScheme.colors.buttons.success}20`
                                : campaign.status === 'paused'
                                ? `${currentScheme.colors.buttons.warning}20`
                                : `${currentScheme.colors.text.secondary}20`,
                              color: campaign.status === 'active'
                                ? currentScheme.colors.buttons.success
                                : campaign.status === 'paused'
                                ? currentScheme.colors.buttons.warning
                                : currentScheme.colors.text.secondary,
                            }}
                          />
                          <Typography variant="body2" color={currentScheme.colors.text.secondary}>
                            {campaign.type}
                          </Typography>
                        </Box>
                        <Typography variant="h6" fontWeight="medium">
                          {campaign.name}
                        </Typography>
                        <Typography variant="body2" color={currentScheme.colors.text.secondary}>
                          {campaign.recipients.toLocaleString()} recipients
                        </Typography>
                      </Box>

                      <Box display="flex" alignItems="center" gap={1}>
                        <Box sx={{ textAlign: 'center', mr: 2 }}>
                          <Typography variant="h6" fontWeight="bold">
                            {campaign.openRate}%
                          </Typography>
                          <Typography variant="caption" color={currentScheme.colors.text.secondary}>
                            Open Rate
                          </Typography>
                        </Box>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="h6" fontWeight="bold">
                            {campaign.clickRate}%
                          </Typography>
                          <Typography variant="caption" color={currentScheme.colors.text.secondary}>
                            Click Rate
                          </Typography>
                        </Box>
                      </Box>

                      <Box display="flex" gap={1}>
                        <IconButton size="small">
                          {campaign.status === 'active' ? <Pause /> : <PlayArrow />}
                        </IconButton>
                        <IconButton size="small">
                          <Edit />
                        </IconButton>
                        <IconButton size="small">
                          <Delete />
                        </IconButton>
                      </Box>
                    </Box>
                  </Paper>
                ))}
              </Box>
            </CardContent>
          </Card>

          {/* Quick Campaign Builder */}
          <Card sx={{ background: currentScheme.colors.components.card }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" mb={3}>
                Quick Campaign Builder
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  label="Campaign Name"
                  placeholder="e.g., Summer Sale Promotion"
                  fullWidth
                  size="small"
                />
                
                <Box display="flex" gap={2}>
                  <Select
                    fullWidth
                    size="small"
                    defaultValue="email"
                    sx={{
                      background: currentScheme.colors.components.input,
                      color: currentScheme.colors.text.primary,
                    }}
                  >
                    <MenuItem value="email">Email Campaign</MenuItem>
                    <MenuItem value="sms">SMS Campaign</MenuItem>
                    <MenuItem value="push">Push Notification</MenuItem>
                  </Select>
                  
                  <Select
                    fullWidth
                    size="small"
                    defaultValue="immediate"
                    sx={{
                      background: currentScheme.colors.components.input,
                      color: currentScheme.colors.text.primary,
                    }}
                  >
                    <MenuItem value="immediate">Send Immediately</MenuItem>
                    <MenuItem value="scheduled">Schedule</MenuItem>
                    <MenuItem value="triggered">Trigger-based</MenuItem>
                  </Select>
                </Box>
                
                <FormControlLabel
                  control={
                    <Switch
                      checked={autoOptimize}
                      onChange={(e) => setAutoOptimize(e.target.checked)}
                      color="primary"
                    />
                  }
                  label="AI Auto-optimize send times"
                />
                
                <Button
                  variant="contained"
                  fullWidth
                  startIcon={<Add />}
                  sx={{
                    background: `linear-gradient(135deg, ${currentScheme.colors.primary} 0%, ${currentScheme.colors.secondary} 100%)`,
                  }}
                >
                  Create Campaign
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Right Column */}
        <Box sx={{ flex: 1, minWidth: '300px' }}>
          {/* Email Sequence */}
          <Card
            sx={{
              background: currentScheme.colors.components.card,
              border: `1px solid ${currentScheme.colors.components.border}`,
              mb: 3,
            }}
          >
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
                <Typography variant="h6" fontWeight="bold">
                  Email Sequence
                </Typography>
                <Chip
                  icon={<Schedule />}
                  label="5-Step Sequence"
                  size="small"
                  sx={{
                    background: `${currentScheme.colors.primary}20`,
                    color: currentScheme.colors.primary,
                  }}
                />
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {mockSequences.map((step, index) => (
                  <Paper
                    key={index}
                    sx={{
                      p: 2,
                      background: currentScheme.colors.background,
                      border: `1px solid ${currentScheme.colors.components.border}`,
                      borderRadius: 2,
                      position: 'relative',
                      '&:before': {
                        content: '""',
                        position: 'absolute',
                        left: 24,
                        top: step.step === 1 ? '50%' : 0,
                        bottom: step.step === 4 ? '50%' : 0,
                        width: '2px',
                        background: currentScheme.colors.components.border,
                        zIndex: 0,
                      },
                    }}
                  >
                    <Box display="flex" gap={2}>
                      <Box
                        sx={{
                          width: 32,
                          height: 32,
                          borderRadius: '50%',
                          background: currentScheme.colors.primary,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontWeight: 'bold',
                          position: 'relative',
                          zIndex: 1,
                        }}
                      >
                        {step.step}
                      </Box>
                      <Box flex={1}>
                        <Typography variant="body1" fontWeight="medium">
                          {step.action}
                        </Typography>
                        <Typography variant="caption" color={currentScheme.colors.text.secondary}>
                          Trigger: {step.trigger} • Delay: {step.delay}
                        </Typography>
                      </Box>
                      <IconButton size="small">
                        <MoreVert />
                      </IconButton>
                    </Box>
                  </Paper>
                ))}
              </Box>
            </CardContent>
          </Card>

          {/* Performance Analytics */}
          <Card sx={{ background: currentScheme.colors.components.card }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" mb={3}>
                Campaign Performance
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                  <Typography variant="body2">Open Rate</Typography>
                  <Typography variant="body2" fontWeight="bold">64.2%</Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={64}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    background: currentScheme.colors.components.border,
                    '& .MuiLinearProgress-bar': {
                      background: currentScheme.colors.primary,
                    },
                  }}
                />
              </Box>
              
              <Box sx={{ mb: 3 }}>
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                  <Typography variant="body2">Click Rate</Typography>
                  <Typography variant="body2" fontWeight="bold">28.7%</Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={28}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    background: currentScheme.colors.components.border,
                    '& .MuiLinearProgress-bar': {
                      background: currentScheme.colors.secondary,
                    },
                  }}
                />
              </Box>
              
              <Box sx={{ mb: 3 }}>
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                  <Typography variant="body2">Conversion Rate</Typography>
                  <Typography variant="body2" fontWeight="bold">18.3%</Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={18}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    background: currentScheme.colors.components.border,
                    '& .MuiLinearProgress-bar': {
                      background: currentScheme.colors.buttons.success,
                    },
                  }}
                />
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="body2" color={currentScheme.colors.text.secondary}>
                  Total Revenue Generated
                </Typography>
                <Typography variant="h6" fontWeight="bold">
                  $42,850
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  )
}