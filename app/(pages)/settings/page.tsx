// app/settings/page.tsx - FIXED VERSION
'use client'

import React, { useState, useEffect } from 'react'
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Switch,
  FormControlLabel,
  TextField,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Paper,
  Alert,
  Tab,
  Tabs,
  useTheme,
  useMediaQuery,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  ListItemIcon,
  LinearProgress,
  Avatar,
  Badge,
  Tooltip,
  IconButton,
  Menu,
  MenuItem,
  FormGroup,
  InputAdornment,
  Slider,
  RadioGroup,
  Radio,
} from '@mui/material'
import {
  Save as SaveIcon,
  Notifications as NotificationsIcon,
  Security as SecurityIcon,
  Business as BusinessIcon,
  Palette as AppearanceIcon,
  Backup as BackupIcon,
  Delete as DeleteIcon,
  Payment as PaymentIcon,
  Upgrade as UpgradeIcon,
  CheckCircle,
  Lock,
  Refresh,
  CloudUpload,
  Download,
  FileCopy,
  QrCode,
  Shield,
  VpnKey,
  AccountCircle,
  Email,
  Phone,
  LocationOn,
  Language,
  AccessTime,
  CreditCard,
  Storage,
  People,
  Inventory,
  Settings as SettingsIcon,
  KeyboardArrowDown,
  MoreVert,
  WhatsApp,
  Telegram,
} from '@mui/icons-material'
import { MainLayout } from '@/components/Layout/MainLayout'

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  )
}

interface SettingsData {
  business: {
    name: string
    taxRate: number
    invoicePrefix: string
    gstNumber: string
    businessAddress: string
    phone: string
    email: string
    website: string
    logoUrl: string
  }
  notifications: {
    email: boolean
    push: boolean
    salesAlerts: boolean
    lowStockAlerts: boolean
    newCustomerAlerts: boolean
    billingReminders: boolean
    monthlyReports: boolean
  }
  security: {
    twoFactorAuth: boolean
    sessionTimeout: number
    passwordChangeRequired: boolean
    loginAlerts: boolean
    ipWhitelist: string[]
  }
  appearance: {
    language: string
    dateFormat: string
    compactMode: boolean
    dashboardLayout: string
    primaryColor: string
  }
}

interface SubscriptionStatus {
  isActive: boolean
  plan: 'trial' | 'monthly' | 'quarterly' | 'yearly'
  status: string
  features: any
  limits: {
    products: number
    customers: number
    employees: number
    storageMB: number
  }
  usage: {
    products: number
    customers: number
    employees: number
    storageMB: number
  }
  currentPeriodEnd: string
  daysRemaining: number
  nextBillingAmount: number
}

export default function SettingsPage() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [activeTab, setActiveTab] = useState(0)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle')
  const [settings, setSettings] = useState<SettingsData | null>(null)
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [upgradeDialogOpen, setUpgradeDialogOpen] = useState(false)
  const [logoPreview, setLogoPreview] = useState<string>('')
  const [backupMenuAnchor, setBackupMenuAnchor] = useState<null | HTMLElement>(null)

  // Default settings to show immediately
  const defaultSettings: SettingsData = {
    business: {
      name: 'My Business',
      taxRate: 18,
      invoicePrefix: 'INV',
      gstNumber: '',
      businessAddress: '',
      phone: '',
      email: '',
      website: '',
      logoUrl: ''
    },
    notifications: {
      email: true,
      push: true,
      salesAlerts: true,
      lowStockAlerts: true,
      newCustomerAlerts: true,
      billingReminders: true,
      monthlyReports: true
    },
    security: {
      twoFactorAuth: false,
      sessionTimeout: 30,
      passwordChangeRequired: false,
      loginAlerts: true,
      ipWhitelist: []
    },
    appearance: {
      language: 'en',
      dateFormat: 'dd/MM/yyyy',
      compactMode: false,
      dashboardLayout: 'standard',
      primaryColor: '#667eea'
    }
  }

  // Load all data from APIs
  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      
      // First try to load settings from API
      await loadSettings()
      
      // Skip subscription for now to avoid errors
      // await loadSubscriptionStatus()
      // await loadPricingPlans()
      
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadSettings = async () => {
    try {
      const response = await fetch('/api/settings', {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      console.log('Settings API response status:', response.status)
      
      if (response.status === 401) {
        console.log('User not authenticated, using default settings')
        // User not logged in, use default settings
        setSettings(defaultSettings)
        return
      }
      
      const data = await response.json()
      console.log('Settings API response data:', data)
      
      if (data.success && data.settings) {
        console.log('Settings loaded successfully:', data.settings)
        setSettings(data.settings)
      } else {
        console.error('API returned success: false', data.message)
        // Use default settings if API fails
        setSettings(defaultSettings)
      }
    } catch (error) {
      console.error('Error loading settings:', error)
      // Use default settings on error
      setSettings(defaultSettings)
    }
  }

  const loadSubscriptionStatus = async () => {
    try {
      const response = await fetch('/api/subscription/status')
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setSubscriptionStatus(data.data)
        }
      }
    } catch (error) {
      console.error('Error loading subscription:', error)
    }
  }

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue)
  }

  const handleSettingChange = (section: keyof SettingsData, key: string, value: any) => {
    if (!settings) return
    
    setSettings(prev => ({
      ...prev!,
      [section]: {
        ...prev![section],
        [key]: value
      }
    }))
  }

  const handleSaveSettings = async () => {
    if (!settings) return
    
    setSaveStatus('saving')
    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(settings)
      })

      const data = await response.json()
      
      if (response.ok && data.success) {
        setSaveStatus('success')
        setTimeout(() => setSaveStatus('idle'), 3000)
        console.log('Settings saved successfully')
      } else {
        throw new Error(data.message || 'Failed to save settings')
      }
    } catch (error: any) {
      console.error('Error saving settings:', error)
      setSaveStatus('error')
    }
  }

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setLogoPreview(result)
        handleSettingChange('business', 'logoUrl', result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleBackupMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setBackupMenuAnchor(event.currentTarget)
  }

  const handleBackupMenuClose = () => {
    setBackupMenuAnchor(null)
  }

  const handleBackup = async (type: string) => {
    try {
      const response = await fetch(`/api/settings/backup?type=${type}`, {
        credentials: 'include'
      })
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `backup-${type}-${new Date().toISOString().split('T')[0]}.${type === 'csv' ? 'csv' : 'json'}`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
    } catch (error) {
      console.error('Error creating backup:', error)
    }
    handleBackupMenuClose()
  }

  const handleUpgradePlan = async (plan: string) => {
    try {
      const response = await fetch('/api/payments/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ plan }),
      })

      if (response.ok) {
        const result = await response.json()
        const paymentData = result.data
        
        // Open UPI payment URL
        window.open(paymentData.upiUrl, '_blank')
        setUpgradeDialogOpen(false)
      } else {
        const error = await response.json()
        throw new Error(error.message || 'Failed to create payment')
      }
    } catch (error) {
      console.error('Error creating payment:', error)
    }
  }

  const getUsagePercentage = (resource: string) => {
    if (!subscriptionStatus?.usage || !subscriptionStatus?.limits) return 0
    const usage = subscriptionStatus.usage[resource as keyof typeof subscriptionStatus.usage] || 0
    const limit = subscriptionStatus.limits[resource as keyof typeof subscriptionStatus.limits] || 1
    return Math.min((usage / limit) * 100, 100)
  }

  const tabs = [
    { label: 'Business', icon: <BusinessIcon /> },
    { label: 'Notifications', icon: <NotificationsIcon /> },
    { label: 'Security', icon: <SecurityIcon /> },
    { label: 'Appearance', icon: <AppearanceIcon /> },
    { label: 'Subscription', icon: <PaymentIcon /> },
    { label: 'Backup', icon: <BackupIcon /> }
  ]

  if (loading) {
    return (
      <MainLayout title="Settings">
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 400 }}>
            <SettingsIcon sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              Loading Settings...
            </Typography>
          </Box>
        </Container>
      </MainLayout>
    )
  }

  // Use settings if available, otherwise use defaults
  const displaySettings = settings || defaultSettings

  return (
    <MainLayout title="Settings">
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2, mb: 3 }}>
            <Box>
              <Typography variant="h3" gutterBottom fontWeight="bold">
                <SettingsIcon sx={{ mr: 2, verticalAlign: 'middle' }} />
                Settings
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Configure your application preferences and manage business settings
              </Typography>
            </Box>
            
            {subscriptionStatus && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Chip 
                  label={subscriptionStatus.plan.toUpperCase()} 
                  color={subscriptionStatus.isActive ? "success" : "default"}
                  variant="outlined"
                  sx={{ fontWeight: 'bold' }}
                />
                <Button
                  variant="contained"
                  startIcon={<UpgradeIcon />}
                  onClick={() => setUpgradeDialogOpen(true)}
                  sx={{ borderRadius: '20px' }}
                >
                  Upgrade
                </Button>
              </Box>
            )}
          </Box>
        </Box>

        {/* Save Status Alert */}
        {saveStatus === 'success' && (
          <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }} icon={<CheckCircle />}>
            Settings saved successfully!
          </Alert>
        )}
        {saveStatus === 'error' && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }} action={<Button onClick={handleSaveSettings}>Retry</Button>}>
            Failed to save settings. Please try again.
          </Alert>
        )}

        {/* Main Content */}
        <Card sx={{ borderRadius: 3, overflow: 'hidden', boxShadow: 3 }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', backgroundColor: 'background.paper' }}>
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              variant={isMobile ? "scrollable" : "fullWidth"}
              scrollButtons="auto"
              sx={{
                '& .MuiTab-root': { 
                  fontWeight: 600, 
                  textTransform: 'none',
                  minHeight: 64,
                  fontSize: isMobile ? '0.875rem' : '1rem'
                },
              }}
            >
              {tabs.map((tab, index) => (
                <Tab
                  key={index}
                  label={tab.label}
                  icon={isMobile ? undefined : tab.icon}
                  iconPosition="start"
                />
              ))}
            </Tabs>
          </Box>

          <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
            {/* Business Tab */}
            <TabPanel value={activeTab} index={0}>
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
                {/* Logo Section */}
                <Box sx={{ flex: '0 0 auto' }}>
                  <Typography variant="h6" gutterBottom fontWeight="bold">
                    Business Logo
                  </Typography>
                  <Box sx={{ textAlign: 'center', mb: 3 }}>
                    <Avatar
                      src={logoPreview}
                      sx={{ 
                        width: 120, 
                        height: 120, 
                        mb: 2,
                        border: '3px solid',
                        borderColor: 'primary.main',
                        backgroundColor: logoPreview ? 'transparent' : 'primary.light'
                      }}
                    >
                      <BusinessIcon sx={{ fontSize: 48 }} />
                    </Avatar>
                    <Button
                      component="label"
                      variant="outlined"
                      startIcon={<CloudUpload />}
                      sx={{ mb: 1 }}
                    >
                      Upload Logo
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={handleLogoUpload}
                      />
                    </Button>
                    <Typography variant="caption" color="text.secondary" display="block">
                      Recommended: 500x500px PNG or JPG
                    </Typography>
                  </Box>
                </Box>

                {/* Business Info */}
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" gutterBottom fontWeight="bold">
                    Business Information
                  </Typography>
                  
                  <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, mb: 2 }}>
                    <TextField
                      fullWidth
                      label="Business Name"
                      value={displaySettings.business.name}
                      onChange={(e) => handleSettingChange('business', 'name', e.target.value)}
                      InputProps={{
                        startAdornment: <BusinessIcon sx={{ mr: 1, color: 'action.active' }} />,
                      }}
                    />
                    <TextField
                      fullWidth
                      label="GST Number"
                      value={displaySettings.business.gstNumber}
                      onChange={(e) => handleSettingChange('business', 'gstNumber', e.target.value)}
                      InputProps={{
                        startAdornment: <Shield sx={{ mr: 1, color: 'action.active' }} />,
                      }}
                    />
                  </Box>

                  <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, mb: 2 }}>
                    <TextField
                      fullWidth
                      label="Email"
                      type="email"
                      value={displaySettings.business.email}
                      onChange={(e) => handleSettingChange('business', 'email', e.target.value)}
                      InputProps={{
                        startAdornment: <Email sx={{ mr: 1, color: 'action.active' }} />,
                      }}
                    />
                    <TextField
                      fullWidth
                      label="Phone"
                      value={displaySettings.business.phone}
                      onChange={(e) => handleSettingChange('business', 'phone', e.target.value)}
                      InputProps={{
                        startAdornment: <Phone sx={{ mr: 1, color: 'action.active' }} />,
                      }}
                    />
                  </Box>

                  <TextField
                    fullWidth
                    label="Business Address"
                    multiline
                    rows={2}
                    value={displaySettings.business.businessAddress}
                    onChange={(e) => handleSettingChange('business', 'businessAddress', e.target.value)}
                    sx={{ mb: 2 }}
                    InputProps={{
                      startAdornment: <LocationOn sx={{ mr: 1, color: 'action.active' }} />,
                    }}
                  />

                  <Divider sx={{ my: 3 }} />

                  <Typography variant="h6" gutterBottom fontWeight="bold">
                    Regional Settings
                  </Typography>
                  
                  <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
                    <TextField
                      fullWidth
                      label="Invoice Prefix"
                      value={displaySettings.business.invoicePrefix}
                      onChange={(e) => handleSettingChange('business', 'invoicePrefix', e.target.value)}
                      sx={{ flex: 1 }}
                    />
                    
                    <TextField
                      fullWidth
                      type="number"
                      label="Tax Rate (%)"
                      value={displaySettings.business.taxRate}
                      onChange={(e) => handleSettingChange('business', 'taxRate', parseFloat(e.target.value) || 0)}
                      sx={{ flex: 1 }}
                      InputProps={{
                        endAdornment: <InputAdornment position="end">%</InputAdornment>,
                      }}
                    />
                  </Box>
                </Box>
              </Box>
            </TabPanel>

            {/* Notifications Tab */}
            <TabPanel value={activeTab} index={1}>
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
                {/* Notification Types */}
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" gutterBottom fontWeight="bold">
                    Notification Preferences
                  </Typography>
                  <Paper sx={{ p: 2, borderRadius: 2, mb: 3 }}>
                    <FormGroup>
                      {Object.entries(displaySettings.notifications).map(([key, value]) => (
                        <ListItem key={key} sx={{ px: 0 }}>
                          <ListItemText
                            primary={key.split(/(?=[A-Z])/).join(' ').replace(/^\w/, c => c.toUpperCase())}
                            secondary={`Receive notifications for ${key.toLowerCase()}`}
                          />
                          <ListItemSecondaryAction>
                            <Switch
                              checked={value as boolean}
                              onChange={() => handleSettingChange('notifications', key, !value)}
                              color="primary"
                            />
                          </ListItemSecondaryAction>
                        </ListItem>
                      ))}
                    </FormGroup>
                  </Paper>
                </Box>

                {/* Notification Channels */}
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" gutterBottom fontWeight="bold">
                    Notification Channels
                  </Typography>
                  <Paper sx={{ p: 3, borderRadius: 2 }}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Configure how you receive notifications
                    </Typography>
                    
                    <List dense>
                      <ListItem sx={{ px: 0 }}>
                        <ListItemIcon>
                          <Email />
                        </ListItemIcon>
                        <ListItemText primary="Email Notifications" />
                        <Chip 
                          label={displaySettings.notifications.email ? "Active" : "Inactive"} 
                          color={displaySettings.notifications.email ? "success" : "default"} 
                          size="small" 
                        />
                      </ListItem>
                      
                      <ListItem sx={{ px: 0 }}>
                        <ListItemIcon>
                          <WhatsApp />
                        </ListItemIcon>
                        <ListItemText primary="WhatsApp Notifications" />
                        <Button size="small" variant="outlined">Connect</Button>
                      </ListItem>
                      
                      <ListItem sx={{ px: 0 }}>
                        <ListItemIcon>
                          <Telegram />
                        </ListItemIcon>
                        <ListItemText primary="Telegram Notifications" />
                        <Button size="small" variant="outlined">Connect</Button>
                      </ListItem>
                    </List>
                  </Paper>
                </Box>
              </Box>
            </TabPanel>

            {/* Security Tab */}
            <TabPanel value={activeTab} index={2}>
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
                {/* Security Features */}
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" gutterBottom fontWeight="bold">
                    Security Features
                  </Typography>
                  <Paper sx={{ p: 3, borderRadius: 2, mb: 3 }}>
                    <List>
                      {Object.entries(displaySettings.security).map(([key, value]) => (
                        key !== 'sessionTimeout' && key !== 'ipWhitelist' && (
                          <div key={key}>
                            <ListItem sx={{ px: 0 }}>
                              <ListItemIcon>
                                <VpnKey />
                              </ListItemIcon>
                              <ListItemText
                                primary={key.split(/(?=[A-Z])/).join(' ').replace(/^\w/, c => c.toUpperCase())}
                                secondary={`Enable ${key.toLowerCase()} for enhanced security`}
                              />
                              <ListItemSecondaryAction>
                                <Switch
                                  checked={value as boolean}
                                  onChange={() => handleSettingChange('security', key, !value)}
                                  color="primary"
                                />
                              </ListItemSecondaryAction>
                            </ListItem>
                            <Divider />
                          </div>
                        )
                      ))}
                    </List>
                  </Paper>
                </Box>

                {/* Session Settings */}
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" gutterBottom fontWeight="bold">
                    Session Settings
                  </Typography>
                  
                  <Paper sx={{ p: 3, borderRadius: 2, mb: 3 }}>
                    <Typography gutterBottom>Session Timeout</Typography>
                    <Box sx={{ px: 2 }}>
                      <Slider
                        value={displaySettings.security.sessionTimeout}
                        onChange={(_, value) => handleSettingChange('security', 'sessionTimeout', value as number)}
                        step={15}
                        marks
                        min={15}
                        max={120}
                        valueLabelDisplay="auto"
                        valueLabelFormat={(value) => `${value} min`}
                      />
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      Automatically log out after {displaySettings.security.sessionTimeout} minutes of inactivity
                    </Typography>
                  </Paper>

                  {/* Security Score */}
                  <Paper sx={{ p: 3, borderRadius: 2, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
                    <Typography variant="h6" gutterBottom fontWeight="bold">
                      Security Score
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Typography variant="h2">92</Typography>
                      <Typography variant="caption">/ 100</Typography>
                    </Box>
                    <LinearProgress variant="determinate" value={92} sx={{ height: 8, borderRadius: 4, mb: 1 }} />
                    <Typography variant="caption">
                      Excellent! Your security settings are well configured.
                    </Typography>
                  </Paper>
                </Box>
              </Box>
            </TabPanel>

            {/* Appearance Tab */}
            <TabPanel value={activeTab} index={3}>
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
                {/* Language & Region */}
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" gutterBottom fontWeight="bold">
                    Language & Region
                  </Typography>
                  
                  <Paper sx={{ p: 3, borderRadius: 2, mb: 3 }}>
                    <TextField
                      fullWidth
                      select
                      label="Language"
                      value={displaySettings.appearance.language}
                      onChange={(e) => handleSettingChange('appearance', 'language', e.target.value)}
                      sx={{ mb: 2 }}
                      SelectProps={{ native: true }}
                      InputProps={{
                        startAdornment: <Language sx={{ mr: 1, color: 'action.active' }} />,
                      }}
                    >
                      <option value="en">English</option>
                      <option value="hi">Hindi</option>
                      <option value="ta">Tamil</option>
                      <option value="te">Telugu</option>
                      <option value="kn">Kannada</option>
                      <option value="ml">Malayalam</option>
                      <option value="mr">Marathi</option>
                      <option value="gu">Gujarati</option>
                      <option value="bn">Bengali</option>
                      <option value="pa">Punjabi</option>
                    </TextField>
                    
                    <TextField
                      fullWidth
                      select
                      label="Date Format"
                      value={displaySettings.appearance.dateFormat}
                      onChange={(e) => handleSettingChange('appearance', 'dateFormat', e.target.value)}
                      sx={{ mb: 2 }}
                      SelectProps={{ native: true }}
                      InputProps={{
                        startAdornment: <AccessTime sx={{ mr: 1, color: 'action.active' }} />,
                      }}
                    >
                      <option value="dd/MM/yyyy">DD/MM/YYYY</option>
                      <option value="MM/dd/yyyy">MM/DD/YYYY</option>
                      <option value="yyyy-MM-dd">YYYY-MM-DD</option>
                      <option value="dd MMM yyyy">DD MMM YYYY</option>
                    </TextField>

                    <FormControlLabel
                      control={
                        <Switch
                          checked={displaySettings.appearance.compactMode}
                          onChange={() => handleSettingChange('appearance', 'compactMode', !displaySettings.appearance.compactMode)}
                          color="primary"
                        />
                      }
                      label="Compact Layout"
                      sx={{ mb: 2 }}
                    />
                  </Paper>
                </Box>

                {/* Color Picker */}
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" gutterBottom fontWeight="bold">
                    Color & Layout
                  </Typography>
                  
                  <Paper sx={{ p: 3, borderRadius: 2, mb: 3 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Primary Color
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
                      {['#667eea', '#764ba2', '#f56565', '#48bb78', '#ed8936'].map((color) => (
                        <Box
                          key={color}
                          sx={{
                            width: 40,
                            height: 40,
                            borderRadius: '50%',
                            backgroundColor: color,
                            cursor: 'pointer',
                            border: displaySettings.appearance.primaryColor === color ? '3px solid' : '2px solid',
                            borderColor: displaySettings.appearance.primaryColor === color ? 'primary.main' : 'divider',
                            '&:hover': {
                              transform: 'scale(1.1)',
                            }
                          }}
                          onClick={() => handleSettingChange('appearance', 'primaryColor', color)}
                        />
                      ))}
                    </Box>

                    <Typography variant="subtitle1" gutterBottom>
                      Dashboard Layout
                    </Typography>
                    <RadioGroup
                      value={displaySettings.appearance.dashboardLayout}
                      onChange={(e) => handleSettingChange('appearance', 'dashboardLayout', e.target.value)}
                      sx={{ mb: 2 }}
                    >
                      <FormControlLabel value="standard" control={<Radio />} label="Standard" />
                      <FormControlLabel value="compact" control={<Radio />} label="Compact" />
                      <FormControlLabel value="detailed" control={<Radio />} label="Detailed" />
                    </RadioGroup>

                    <Typography variant="caption" color="text.secondary">
                      Note: Light/Dark mode can be toggled from the header
                    </Typography>
                  </Paper>
                </Box>
              </Box>
            </TabPanel>

            {/* Subscription Tab */}
            <TabPanel value={activeTab} index={4}>
              {subscriptionStatus ? (
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
                  {/* Current Plan */}
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" gutterBottom fontWeight="bold">
                      Current Plan
                    </Typography>
                    
                    <Paper sx={{ p: 3, borderRadius: 2, mb: 3, border: 2, borderColor: 'primary.main' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Box>
                          <Typography variant="h5" color="primary.main" fontWeight="bold">
                            {subscriptionStatus.plan.charAt(0).toUpperCase() + subscriptionStatus.plan.slice(1)} Plan
                          </Typography>
                          <Chip 
                            label={subscriptionStatus.isActive ? 'Active' : 'Inactive'} 
                            color={subscriptionStatus.isActive ? "success" : "error"}
                            sx={{ mt: 1 }}
                          />
                        </Box>
                        <Box sx={{ textAlign: 'right' }}>
                          <Typography variant="h4" color="primary.main">
                            {subscriptionStatus.plan === 'trial' ? 'FREE' : `₹${subscriptionStatus.nextBillingAmount}`}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {subscriptionStatus.plan === 'trial' ? 'Trial Period' : 
                             subscriptionStatus.plan === 'monthly' ? 'per month' :
                             subscriptionStatus.plan === 'quarterly' ? 'per quarter' : 'per year'}
                          </Typography>
                        </Box>
                      </Box>
                    </Paper>
                  </Box>
                </Box>
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <PaymentIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary">
                    No active subscription
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<UpgradeIcon />}
                    onClick={() => setUpgradeDialogOpen(true)}
                    sx={{ mt: 2 }}
                  >
                    View Plans
                  </Button>
                </Box>
              )}
            </TabPanel>

            {/* Backup Tab */}
            <TabPanel value={activeTab} index={5}>
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
                {/* Backup Options */}
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" gutterBottom fontWeight="bold">
                    Data Backup
                  </Typography>
                  
                  <Paper sx={{ p: 3, borderRadius: 2, mb: 3 }}>
                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, mb: 3 }}>
                      <Button
                        variant="contained"
                        startIcon={<BackupIcon />}
                        onClick={() => handleBackup('json')}
                        sx={{ flex: 1 }}
                      >
                        Backup Now (JSON)
                      </Button>
                      
                      <Button
                        variant="outlined"
                        startIcon={<Download />}
                        onClick={() => handleBackup('csv')}
                        sx={{ flex: 1 }}
                      >
                        Export CSV
                      </Button>
                    </Box>

                    <Button
                      variant="outlined"
                      color="secondary"
                      startIcon={<FileCopy />}
                      onClick={handleBackupMenuOpen}
                      sx={{ mb: 2 }}
                    >
                      More Backup Options
                      <KeyboardArrowDown sx={{ ml: 1 }} />
                    </Button>
                  </Paper>
                </Box>

                {/* Backup History */}
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" gutterBottom fontWeight="bold">
                    Backup History
                  </Typography>
                  
                  <Paper sx={{ p: 3, borderRadius: 2 }}>
                    <List>
                      <ListItem sx={{ px: 0 }}>
                        <ListItemIcon>
                          <BackupIcon />
                        </ListItemIcon>
                        <ListItemText 
                          primary="Full Backup" 
                          secondary="Never backed up" 
                        />
                        <Chip label="Not Started" size="small" variant="outlined" />
                      </ListItem>
                      
                      <Divider />
                      
                      <ListItem sx={{ px: 0 }}>
                        <ListItemIcon>
                          <FileCopy />
                        </ListItemIcon>
                        <ListItemText 
                          primary="Database Backup" 
                          secondary="Last backup: Not available" 
                        />
                        <Chip label="Pending" size="small" color="warning" />
                      </ListItem>
                    </List>
                  </Paper>
                </Box>
              </Box>
            </TabPanel>
          </CardContent>
        </Card>

        {/* Save Button */}
        <Box sx={{ 
          position: 'sticky', 
          bottom: 20, 
          mt: 4, 
          display: 'flex', 
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <Button
            variant="contained"
            startIcon={saveStatus === 'saving' ? <Refresh sx={{ animation: 'spin 1s linear infinite' }} /> : <SaveIcon />}
            onClick={handleSaveSettings}
            disabled={saveStatus === 'saving'}
            size="large"
            sx={{
              minWidth: 200,
              borderRadius: '20px',
              boxShadow: 4,
              position: 'relative',
              overflow: 'hidden',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: 6,
              },
              transition: 'all 0.3s ease',
            }}
          >
            {saveStatus === 'saving' ? 'Saving...' : 'Save All Settings'}
          </Button>
        </Box>

        {/* Upgrade Dialog */}
        <UpgradeDialog 
          open={upgradeDialogOpen} 
          onClose={() => setUpgradeDialogOpen(false)}
          onUpgrade={handleUpgradePlan}
        />

        {/* Backup Menu */}
        <Menu
          anchorEl={backupMenuAnchor}
          open={Boolean(backupMenuAnchor)}
          onClose={handleBackupMenuClose}
        >
          <MenuItem onClick={() => handleBackup('json')}>
            <ListItemIcon>
              <BackupIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Backup All Data (JSON)</ListItemText>
          </MenuItem>
          <MenuItem onClick={() => handleBackup('csv')}>
            <ListItemIcon>
              <FileCopy fontSize="small" />
            </ListItemIcon>
            <ListItemText>Export to CSV</ListItemText>
          </MenuItem>
          <Divider />
          <MenuItem onClick={() => window.open('/api/settings/qr-code', '_blank')}>
            <ListItemIcon>
              <QrCode fontSize="small" />
            </ListItemIcon>
            <ListItemText>Generate QR Code</ListItemText>
          </MenuItem>
        </Menu>
      </Container>

      <style jsx global>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </MainLayout>
  )
}

// Upgrade Dialog Component
const UpgradeDialog = ({ open, onClose, onUpgrade }: any) => {
  const [selectedPlan, setSelectedPlan] = useState('monthly')

  const plans = [
    {
      id: 'monthly',
      name: 'Monthly',
      price: 499,
      features: [
        'Up to 100 Products',
        'Up to 500 Customers',
        'Basic Analytics',
        'Email Support',
        '1GB Storage',
        'Basic Reports'
      ],
      color: '#667eea'
    },
    {
      id: 'quarterly',
      name: 'Quarterly',
      price: 1299,
      features: [
        'Up to 500 Products',
        'Up to 2000 Customers',
        'Advanced Analytics',
        'Priority Support',
        '5GB Storage',
        'Advanced Reports',
        'Custom Branding'
      ],
      color: '#764ba2',
      popular: true
    },
    {
      id: 'yearly',
      name: 'Yearly',
      price: 3999,
      features: [
        'Unlimited Products',
        'Unlimited Customers',
        'Full Analytics Suite',
        '24/7 Priority Support',
        '20GB Storage',
        'Custom Reports',
        'API Access',
        'White Label',
        'Dedicated Account Manager'
      ],
      color: '#48bb78'
    }
  ]

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Typography variant="h4" component="div" fontWeight="bold" gutterBottom>
          Upgrade Your Plan
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Choose the perfect plan for your business growth
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, mt: 2 }}>
          {plans.map((plan) => (
            <Card
              key={plan.id}
              sx={{
                flex: 1,
                border: 2,
                borderColor: selectedPlan === plan.id ? plan.color : 'divider',
                borderRadius: 3,
                position: 'relative',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 6,
                },
                ...(plan.popular && {
                  borderColor: plan.color,
                  boxShadow: `0 0 20px ${plan.color}40`,
                })
              }}
            >
              {plan.popular && (
                <Chip
                  label="Most Popular"
                  color="primary"
                  sx={{
                    position: 'absolute',
                    top: -12,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    fontWeight: 'bold',
                  }}
                />
              )}

              <CardContent sx={{ p: 3, pt: plan.popular ? 5 : 3 }}>
                <Box sx={{ textAlign: 'center', mb: 3 }}>
                  <Typography variant="h5" fontWeight="bold" gutterBottom>
                    {plan.name}
                  </Typography>
                  <Typography variant="h3" color={plan.color} fontWeight="bold" gutterBottom>
                    ₹{plan.price}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {plan.id === 'monthly' && 'per month'}
                    {plan.id === 'quarterly' && 'per quarter (save 15%)'}
                    {plan.id === 'yearly' && 'per year (save 33%)'}
                  </Typography>
                </Box>

                <Divider sx={{ my: 2 }} />

                <List dense>
                  {plan.features.map((feature, index) => (
                    <ListItem key={index} sx={{ px: 0, py: 0.5 }}>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <CheckCircle sx={{ color: plan.color }} fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary={feature} />
                    </ListItem>
                  ))}
                </List>

                <Button
                  variant={selectedPlan === plan.id ? "contained" : "outlined"}
                  fullWidth
                  size="large"
                  onClick={() => {
                    setSelectedPlan(plan.id)
                    onUpgrade(plan.id)
                  }}
                  sx={{
                    mt: 3,
                    borderRadius: '12px',
                    backgroundColor: selectedPlan === plan.id ? plan.color : 'transparent',
                    borderColor: plan.color,
                    color: selectedPlan === plan.id ? 'white' : plan.color,
                    '&:hover': {
                      backgroundColor: plan.color,
                      color: 'white',
                    }
                  }}
                >
                  {selectedPlan === plan.id ? 'Selected' : `Choose ${plan.name}`}
                </Button>
              </CardContent>
            </Card>
          ))}
        </Box>

        <Paper sx={{ p: 3, mt: 3, borderRadius: 2, backgroundColor: 'background.default' }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            💳 Payment Methods
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Chip label="UPI" icon={<QrCode />} variant="outlined" />
            <Chip label="Credit/Debit Card" icon={<CreditCard />} variant="outlined" />
            <Chip label="Net Banking" icon={<PaymentIcon />} variant="outlined" />
          </Box>
        </Paper>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  )
}