// app/(pages)/advance/settings/page.tsx
'use client'

import { useState } from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Switch,
  TextField,
  Select,
  MenuItem,
  Paper,
  IconButton,
  Divider,
  Tabs,
  Tab,
  FormControlLabel,
  Chip,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
} from '@mui/material'
import {
  Settings as SettingsIcon,
  Security,
  Api,
  Link,
  Code,
  Notifications,
  Language,
  Backup,
  People,
  VpnKey,
  Delete,
  Edit,
  ContentCopy,
  Add,
  Warning,
  CheckCircle,
  Error,
} from '@mui/icons-material'
import { useAdvanceThemeContext } from '@/contexts/AdvanceThemeContexts'

export default function SettingsPage() {
  const { currentScheme } = useAdvanceThemeContext()
  const [tabValue, setTabValue] = useState(0)
  const [twoFactor, setTwoFactor] = useState(true)
  const [autoBackup, setAutoBackup] = useState(true)
  const [apiKey, setApiKey] = useState('sk_live_51Hx...yR8F')

  const mockIntegrations = [
    { id: 1, name: 'Stripe', status: 'connected', icon: '💳' },
    { id: 2, name: 'Slack', status: 'connected', icon: '💬' },
    { id: 3, name: 'Google Analytics', status: 'disconnected', icon: '📊' },
    { id: 4, name: 'Zapier', status: 'connected', icon: '⚡' },
  ]

  const mockWebhooks = [
    { id: 1, name: 'Payment Success', url: 'https://api.example.com/webhook/payment', status: 'active' },
    { id: 2, name: 'New User', url: 'https://api.example.com/webhook/user', status: 'inactive' },
    { id: 3, name: 'Subscription Update', url: 'https://api.example.com/webhook/sub', status: 'active' },
  ]

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box display="flex" alignItems="center" gap={2} mb={2}>
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
            <SettingsIcon sx={{ fontSize: 32, color: 'white' }} />
          </Box>
          <Box>
            <Typography variant="h4" fontWeight="bold">
              ⚙️ Settings
            </Typography>
            <Typography variant="body1" color={currentScheme.colors.text.secondary}>
              Advanced configuration, API keys & integrations
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Main Content */}
      <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
        {/* Left Column - Settings */}
        <Box sx={{ flex: 2, minWidth: '300px' }}>
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
              <Tab icon={<SettingsIcon />} iconPosition="start" label="General" />
              <Tab icon={<Security />} iconPosition="start" label="Security" />
              <Tab icon={<Api />} iconPosition="start" label="API" />
              <Tab icon={<Link />} iconPosition="start" label="Integrations" />
            </Tabs>

            {/* Tab Content */}
            <CardContent>
              {tabValue === 0 && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <Typography variant="h6" fontWeight="bold" mb={2}>
                    General Settings
                  </Typography>
                  
                  <TextField
                    label="Company Name"
                    defaultValue="Advance Inc."
                    fullWidth
                    size="small"
                  />
                  
                  <TextField
                    label="Default Timezone"
                    select
                    defaultValue="est"
                    fullWidth
                    size="small"
                  >
                    <MenuItem value="est">Eastern Time (ET)</MenuItem>
                    <MenuItem value="pst">Pacific Time (PT)</MenuItem>
                    <MenuItem value="utc">UTC</MenuItem>
                  </TextField>
                  
                  <TextField
                    label="Default Currency"
                    select
                    defaultValue="usd"
                    fullWidth
                    size="small"
                  >
                    <MenuItem value="usd">USD - US Dollar</MenuItem>
                    <MenuItem value="eur">EUR - Euro</MenuItem>
                    <MenuItem value="gbp">GBP - British Pound</MenuItem>
                  </TextField>
                  
                  <FormControlLabel
                    control={
                      <Switch
                        checked={autoBackup}
                        onChange={(e) => setAutoBackup(e.target.checked)}
                        color="primary"
                      />
                    }
                    label="Enable Automatic Backups"
                  />
                  
                  <Divider />
                  
                  <Typography variant="subtitle2" fontWeight="medium" gutterBottom>
                    Data Management
                  </Typography>
                  
                  <Button
                    variant="outlined"
                    startIcon={<Backup />}
                    sx={{
                      borderColor: currentScheme.colors.components.border,
                      color: currentScheme.colors.text.primary,
                    }}
                  >
                    Export All Data
                  </Button>
                </Box>
              )}

              {tabValue === 1 && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <Typography variant="h6" fontWeight="bold" mb={2}>
                    Security Settings
                  </Typography>
                  
                  <FormControlLabel
                    control={
                      <Switch
                        checked={twoFactor}
                        onChange={(e) => setTwoFactor(e.target.checked)}
                        color="primary"
                      />
                    }
                    label="Two-Factor Authentication"
                  />
                  
                  <Alert severity="info" sx={{ background: `${currentScheme.colors.primary}10` }}>
                    Two-factor authentication is enabled for all users. They'll need to verify login attempts with their mobile device.
                  </Alert>
                  
                  <Divider />
                  
                  <Typography variant="subtitle2" fontWeight="medium" gutterBottom>
                    Session Management
                  </Typography>
                  
                  <TextField
                    label="Session Timeout"
                    select
                    defaultValue="8"
                    fullWidth
                    size="small"
                  >
                    <MenuItem value="1">1 hour</MenuItem>
                    <MenuItem value="4">4 hours</MenuItem>
                    <MenuItem value="8">8 hours</MenuItem>
                    <MenuItem value="24">24 hours</MenuItem>
                  </TextField>
                  
                  <Button
                    variant="outlined"
                    startIcon={<People />}
                    sx={{
                      borderColor: currentScheme.colors.components.border,
                      color: currentScheme.colors.text.primary,
                    }}
                  >
                    Manage User Permissions
                  </Button>
                </Box>
              )}

              {tabValue === 2 && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <Typography variant="h6" fontWeight="bold" mb={2}>
                    API Configuration
                  </Typography>
                  
                  <Box>
                    <Typography variant="subtitle2" gutterBottom>
                      API Key
                    </Typography>
                    <Paper
                      sx={{
                        p: 2,
                        background: currentScheme.colors.background,
                        border: `1px solid ${currentScheme.colors.components.border}`,
                        borderRadius: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          fontFamily: 'monospace',
                          color: currentScheme.colors.text.secondary,
                        }}
                      >
                        {apiKey}
                      </Typography>
                      <Box>
                        <IconButton size="small" onClick={() => navigator.clipboard.writeText(apiKey)}>
                          <ContentCopy />
                        </IconButton>
                        <IconButton size="small">
                          <VpnKey />
                        </IconButton>
                      </Box>
                    </Paper>
                  </Box>
                  
                  <Alert severity="warning">
                    Keep your API keys secure. Do not share them in client-side code or public repositories.
                  </Alert>
                  
                  <Divider />
                  
                  <Typography variant="subtitle2" fontWeight="medium" gutterBottom>
                    Webhooks
                  </Typography>
                  
                  <List>
                    {mockWebhooks.map((webhook) => (
                      <ListItem
                        key={webhook.id}
                        sx={{
                          background: currentScheme.colors.background,
                          mb: 1,
                          borderRadius: 1,
                        }}
                      >
                        <ListItemIcon>
                          <Link />
                        </ListItemIcon>
                        <ListItemText
                          primary={webhook.name}
                          secondary={webhook.url}
                        />
                        <ListItemSecondaryAction>
                          <Chip
                            label={webhook.status}
                            size="small"
                            sx={{
                              background: webhook.status === 'active'
                                ? `${currentScheme.colors.buttons.success}20`
                                : `${currentScheme.colors.text.secondary}20`,
                              color: webhook.status === 'active'
                                ? currentScheme.colors.buttons.success
                                : currentScheme.colors.text.secondary,
                              mr: 1,
                            }}
                          />
                          <IconButton size="small">
                            <Edit />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
                  </List>
                  
                  <Button
                    variant="outlined"
                    startIcon={<Add />}
                    sx={{
                      borderColor: currentScheme.colors.components.border,
                      color: currentScheme.colors.text.primary,
                    }}
                  >
                    Add Webhook
                  </Button>
                </Box>
              )}

              {tabValue === 3 && (
                <Box sx={{ display: '-flex', flexDirection: 'column', gap: 3 }}>
                  <Typography variant="h6" fontWeight="bold" mb={2}>
                    Integrations
                  </Typography>
                  
                  <List>
                    {mockIntegrations.map((integration) => (
                      <ListItem
                        key={integration.id}
                        sx={{
                          background: currentScheme.colors.background,
                          mb: 1,
                          borderRadius: 1,
                        }}
                      >
                        <ListItemIcon>
                          <Typography variant="h5">{integration.icon}</Typography>
                        </ListItemIcon>
                        <ListItemText
                          primary={integration.name}
                          secondary={`Status: ${integration.status}`}
                        />
                        <ListItemSecondaryAction>
                          <Chip
                            label={integration.status}
                            size="small"
                            sx={{
                              background: integration.status === 'connected'
                                ? `${currentScheme.colors.buttons.success}20`
                                : `${currentScheme.colors.text.secondary}20`,
                              color: integration.status === 'connected'
                                ? currentScheme.colors.buttons.success
                                : currentScheme.colors.text.secondary,
                              mr: 1,
                            }}
                          />
                          <IconButton size="small">
                            <SettingsIcon />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
                  </List>
                  
                  <Button
                    variant="contained"
                    startIcon={<Add />}
                    sx={{
                      background: `linear-gradient(135deg, ${currentScheme.colors.primary} 0%, ${currentScheme.colors.secondary} 100%)`,
                    }}
                  >
                    Add Integration
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        </Box>

        {/* Right Column - Quick Settings & Info */}
        <Box sx={{ flex: 1, minWidth: '300px' }}>
          {/* System Status */}
          <Card
            sx={{
              background: currentScheme.colors.components.card,
              border: `1px solid ${currentScheme.colors.components.border}`,
              mb: 3,
            }}
          >
            <CardContent>
              <Typography variant="h6" fontWeight="bold" mb={3}>
                System Status
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {[
                  { label: 'API Server', status: 'operational', icon: <CheckCircle /> },
                  { label: 'Database', status: 'operational', icon: <CheckCircle /> },
                  { label: 'Email Service', status: 'degraded', icon: <Warning /> },
                  { label: 'Payment Gateway', status: 'operational', icon: <CheckCircle /> },
                ].map((item, index) => (
                  <Paper
                    key={index}
                    sx={{
                      p: 2,
                      background: currentScheme.colors.background,
                      border: `1px solid ${currentScheme.colors.components.border}`,
                      borderRadius: 1,
                    }}
                  >
                    <Box display="flex" alignItems="center" justifyContent="space-between">
                      <Typography variant="body2">{item.label}</Typography>
                      <Box display="flex" alignItems="center" gap={0.5}>
                        {item.icon}
                        <Typography
                          variant="caption"
                          sx={{
                            color: item.status === 'operational'
                              ? currentScheme.colors.buttons.success
                              : currentScheme.colors.buttons.warning,
                          }}
                        >
                          {item.status}
                        </Typography>
                      </Box>
                    </Box>
                  </Paper>
                ))}
              </Box>
            </CardContent>
          </Card>

          {/* API Documentation */}
          <Card sx={{ background: currentScheme.colors.components.card, mb: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" mb={2}>
                API Documentation
              </Typography>
              
              <Paper
                sx={{
                  p: 3,
                  background: currentScheme.colors.background,
                  border: `1px solid ${currentScheme.colors.components.border}`,
                  borderRadius: 2,
                  mb: 2,
                }}
              >
                <Code sx={{ fontSize: 40, color: currentScheme.colors.primary, mb: 2 }} />
                <Typography variant="body2" paragraph>
                  Access our comprehensive API documentation with examples for all endpoints.
                </Typography>
                
                <Button
                  variant="outlined"
                  fullWidth
                  sx={{
                    borderColor: currentScheme.colors.components.border,
                    color: currentScheme.colors.text.primary,
                  }}
                >
                  View Documentation
                </Button>
              </Paper>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card sx={{ background: currentScheme.colors.components.card }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" mb={2} color={currentScheme.colors.buttons.error}>
                Danger Zone
              </Typography>
              
              <Alert severity="error" sx={{ mb: 2 }}>
                These actions are irreversible. Please proceed with caution.
              </Alert>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button
                  variant="outlined"
                  startIcon={<Delete />}
                  sx={{
                    borderColor: currentScheme.colors.buttons.error,
                    color: currentScheme.colors.buttons.error,
                    '&:hover': {
                      borderColor: currentScheme.colors.buttons.error,
                      background: `${currentScheme.colors.buttons.error}10`,
                    },
                  }}
                >
                  Delete All Test Data
                </Button>
                
                <Button
                  variant="contained"
                  startIcon={<Delete />}
                  sx={{
                    background: currentScheme.colors.buttons.error,
                    '&:hover': {
                      background: `${currentScheme.colors.buttons.error}90`,
                    },
                  }}
                >
                  Delete Account
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  )
}