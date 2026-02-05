'use client'

import { useState } from 'react'
import {
  Box,
  Container,
  Typography,
  Paper,
  Tabs,
  Tab,
  Card,
  CardContent,
  Switch,
  FormControlLabel,
  TextField,
  Select,
  MenuItem,
  Button,
  Alert,
  CircularProgress,
  Divider,
  Chip,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Slider,
  RadioGroup,
  Radio,
  FormControl,
  InputLabel,
  useTheme,
  Tooltip,
  Collapse,
  Stack,
  Breadcrumbs,
  Link as MuiLink,
} from '@mui/material'
import {
  Settings as SettingsIcon,
  Save as SaveIcon,
  Refresh as RefreshIcon,
  Delete as DeleteIcon,
  Notifications as NotificationsIcon,
  Security as SecurityIcon,
  Palette as PaletteIcon,
  Analytics as AnalyticsIcon,
  IntegrationInstructions as IntegrationsIcon,
  Receipt as BillingIcon,
  Tune as PreferencesIcon,
  ArrowBack as BackIcon,
  Home as HomeIcon,
  Email as EmailIcon,
  Language as LanguageIcon,
  AccessTime as TimeIcon,
  AttachMoney as CurrencyIcon,
  ColorLens as ColorIcon,
  ViewQuilt as LayoutIcon,
  Speed as SpeedIcon,
  SaveAlt as ExportIcon,
  Backup as BackupIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from '@mui/icons-material'
import { useAdvanceThemeContext } from '@/contexts/AdvanceThemeContexts'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

// Define types
interface AdvanceSettings {
  preferences: any;
  notifications: any;
  integrations: any;
  billing: any;
  security: any;
  appearance: any;
  analytics: any;
  customization: any;
  lastUpdated: string;
  version: string;
}

// Custom hook (placeholder - replace with your actual hook)
const useAdvanceSettings = () => {
  const [settings, setSettings] = useState<AdvanceSettings | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateSettings = async (section: string, data: any): Promise<boolean> => {
    console.log(`Updating ${section}:`, data);
    // Simulate API call
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setLoading(false);
    return true;
  };

  const resetSettings = async (): Promise<boolean> => {
    console.log('Resetting settings');
    // Simulate API call
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setLoading(false);
    return true;
  };

  return {
    settings,
    loading,
    error,
    updateSettings,
    resetSettings,
  };
};

export default function AdvanceSettingsPage() {
  const { currentScheme } = useAdvanceThemeContext();
  const { settings, loading, error, updateSettings, resetSettings } = useAdvanceSettings();
  const [activeTab, setActiveTab] = useState(0);
  const [saveMessage, setSaveMessage] = useState('');
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const router = useRouter();
  const theme = useTheme();

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleSave = async (section: string, data: any) => {
    const success = await updateSettings(section, data);
    if (success) {
      setSaveMessage('Settings saved successfully!');
      setShowSnackbar(true);
    }
  };

  const handleReset = async () => {
    const success = await resetSettings();
    if (success) {
      setSaveMessage('Settings reset to defaults!');
      setShowSnackbar(true);
      setShowResetDialog(false);
    }
  };

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev =>
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const handleBack = () => {
    router.back();
  };

  if (loading && !settings) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error && !settings) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Button 
          variant="contained" 
          onClick={() => window.location.reload()}
          startIcon={<RefreshIcon />}
        >
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'flex-start', justifyContent: 'space-between', gap: 2 }}>
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
              <SettingsIcon sx={{ fontSize: 32, color: 'white' }} />
            </Box>
            <Box>
              <Typography variant="h4" fontWeight="bold">
                ⚙️ Advance Settings
              </Typography>
              <Typography variant="body1" color={currentScheme.colors.text.secondary}>
                Configure your advance features and preferences
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={() => window.location.reload()}
              sx={{
                borderColor: currentScheme.colors.components.border,
                color: currentScheme.colors.text.primary,
              }}
            >
              Refresh
            </Button>
            <Button
              variant="outlined"
              color="warning"
              startIcon={<DeleteIcon />}
              onClick={() => setShowResetDialog(true)}
              sx={{
                borderColor: currentScheme.colors.buttons.warning,
                color: currentScheme.colors.buttons.warning,
              }}
            >
              Reset All
            </Button>
          </Box>
        </Box>

        {/* Last updated info */}
        <Box sx={{ mt: 2 }}>
          <Typography variant="caption" color={currentScheme.colors.text.secondary}>
            Last updated: {settings?.lastUpdated ? new Date(settings.lastUpdated).toLocaleString() : 'Never'} • Version: {settings?.version || '1.0.0'}
          </Typography>
        </Box>
      </Box>

      {/* Main Content */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, gap: 3 }}>
        {/* Left Side - Tabs Navigation */}
        <Card sx={{ 
          flex: { xs: 'auto', lg: '0 0 250px' },
          background: currentScheme.colors.components.card,
          border: `1px solid ${currentScheme.colors.components.border}`,
          height: 'fit-content',
        }}>
          <CardContent sx={{ p: 2 }}>
            <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 2, color: currentScheme.colors.text.primary }}>
              Settings Categories
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              {[
                { icon: <PreferencesIcon />, label: 'Preferences', value: 0 },
                { icon: <NotificationsIcon />, label: 'Notifications', value: 1 },
                { icon: <IntegrationsIcon />, label: 'Integrations', value: 2 },
                { icon: <BillingIcon />, label: 'Billing', value: 3 },
                { icon: <SecurityIcon />, label: 'Security', value: 4 },
                { icon: <PaletteIcon />, label: 'Appearance', value: 5 },
                { icon: <AnalyticsIcon />, label: 'Analytics', value: 6 },
              ].map((item) => (
                <Button
                  key={item.value}
                  startIcon={item.icon}
                  onClick={() => setActiveTab(item.value)}
                  sx={{
                    justifyContent: 'flex-start',
                    textTransform: 'none',
                    color: activeTab === item.value ? currentScheme.colors.primary : currentScheme.colors.text.secondary,
                    background: activeTab === item.value ? `${currentScheme.colors.primary}15` : 'transparent',
                    borderLeft: activeTab === item.value ? `3px solid ${currentScheme.colors.primary}` : '3px solid transparent',
                    '&:hover': {
                      background: `${currentScheme.colors.components.hover}20`,
                    },
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Box>
          </CardContent>
        </Card>

        {/* Right Side - Content */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Card sx={{ 
            background: currentScheme.colors.components.card,
            border: `1px solid ${currentScheme.colors.components.border}`,
          }}>
            <CardContent>
              {/* Preferences Tab */}
              {activeTab === 0 && (
                <PreferencesTab 
                  settings={settings?.preferences} 
                  onSave={(data:any) => handleSave('preferences', data)}
                  currentScheme={currentScheme}
                />
              )}
              
              {/* Notifications Tab */}
              {activeTab === 1 && (
                <NotificationsTab 
                  settings={settings?.notifications} 
                  onSave={(data:any) => handleSave('notifications', data)}
                  currentScheme={currentScheme}
                />
              )}
              
              {/* Integrations Tab */}
              {activeTab === 2 && (
                <IntegrationsTab 
                  settings={settings?.integrations} 
                  onSave={(data) => handleSave('integrations', data)}
                  currentScheme={currentScheme}
                />
              )}
              
              {/* Billing Tab */}
              {activeTab === 3 && (
                <BillingTab 
                  settings={settings?.billing} 
                  onSave={(data) => handleSave('billing', data)}
                  currentScheme={currentScheme}
                />
              )}
              
              {/* Security Tab */}
              {activeTab === 4 && (
                <SecurityTab 
                  settings={settings?.security} 
                  onSave={(data) => handleSave('security', data)}
                  currentScheme={currentScheme}
                />
              )}
              
              {/* Appearance Tab */}
              {activeTab === 5 && (
                <AppearanceTab 
                  settings={settings?.appearance} 
                  onSave={(data) => handleSave('appearance', data)}
                  currentScheme={currentScheme}
                />
              )}
              
              {/* Analytics Tab */}
              {activeTab === 6 && (
                <AnalyticsTab 
                  settings={settings?.analytics} 
                  onSave={(data) => handleSave('analytics', data)}
                  currentScheme={currentScheme}
                />
              )}
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Reset Confirmation Dialog */}
      <Dialog open={showResetDialog} onClose={() => setShowResetDialog(false)}>
        <DialogTitle>Reset All Settings to Defaults?</DialogTitle>
        <DialogContent>
          <Typography>
            This will reset all your advance settings to their default values. This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowResetDialog(false)}>Cancel</Button>
          <Button onClick={handleReset} color="warning" variant="contained">
            Reset All
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success Snackbar */}
      <Snackbar
        open={showSnackbar}
        autoHideDuration={3000}
        onClose={() => setShowSnackbar(false)}
        message={saveMessage}
      />
    </Box>
  );
}

// Tab Components
function PreferencesTab({ settings, onSave, currentScheme }: any) {
  const [formData, setFormData] = useState(settings || {
    language: 'en',
    timezone: 'Asia/Kolkata',
    currency: 'INR',
    dateFormat: 'dd/MM/yyyy',
    timeFormat: '12h',
    autoSave: true,
    autoSaveInterval: 60,
  });

  const handleChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = () => {
    onSave(formData);
  };

  return (
    <Box>
      <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ color: currentScheme.colors.text.primary }}>
        <PreferencesIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
        Preferences Settings
      </Typography>
      <Typography variant="body2" color={currentScheme.colors.text.secondary} paragraph>
        Configure your language, regional, and general preferences
      </Typography>

      <Divider sx={{ borderColor: currentScheme.colors.components.border, my: 3 }} />

      {/* Language & Region */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="subtitle1" fontWeight="medium" gutterBottom sx={{ color: currentScheme.colors.text.primary }}>
          Language & Region
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
          <Box sx={{ flex: '1 1 200px' }}>
            <Typography variant="caption" color={currentScheme.colors.text.secondary} display="block" gutterBottom>
              Language
            </Typography>
            <Select
              value={formData.language}
              onChange={(e) => handleChange('language', e.target.value)}
              size="small"
              fullWidth
              sx={{
                background: currentScheme.colors.components.input,
                borderColor: currentScheme.colors.components.border,
              }}
            >
              <MenuItem value="en">English</MenuItem>
              <MenuItem value="hi">Hindi</MenuItem>
              <MenuItem value="ta">Tamil</MenuItem>
              <MenuItem value="te">Telugu</MenuItem>
              <MenuItem value="kn">Kannada</MenuItem>
            </Select>
          </Box>
          
          <Box sx={{ flex: '1 1 200px' }}>
            <Typography variant="caption" color={currentScheme.colors.text.secondary} display="block" gutterBottom>
              Timezone
            </Typography>
            <Select
              value={formData.timezone}
              onChange={(e) => handleChange('timezone', e.target.value)}
              size="small"
              fullWidth
              sx={{
                background: currentScheme.colors.components.input,
                borderColor: currentScheme.colors.components.border,
              }}
            >
              <MenuItem value="Asia/Kolkata">India (IST)</MenuItem>
              <MenuItem value="UTC">UTC</MenuItem>
              <MenuItem value="America/New_York">New York (EST)</MenuItem>
              <MenuItem value="Europe/London">London (GMT)</MenuItem>
            </Select>
          </Box>
          
          <Box sx={{ flex: '1 1 200px' }}>
            <Typography variant="caption" color={currentScheme.colors.text.secondary} display="block" gutterBottom>
              Currency
            </Typography>
            <Select
              value={formData.currency}
              onChange={(e) => handleChange('currency', e.target.value)}
              size="small"
              fullWidth
              sx={{
                background: currentScheme.colors.components.input,
                borderColor: currentScheme.colors.components.border,
              }}
            >
              <MenuItem value="INR">Indian Rupee (₹)</MenuItem>
              <MenuItem value="USD">US Dollar ($)</MenuItem>
              <MenuItem value="EUR">Euro (€)</MenuItem>
              <MenuItem value="GBP">British Pound (£)</MenuItem>
            </Select>
          </Box>
        </Box>
      </Box>

      {/* Date & Time Format */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="subtitle1" fontWeight="medium" gutterBottom sx={{ color: currentScheme.colors.text.primary }}>
          Date & Time Format
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
          <Box sx={{ flex: '1 1 200px' }}>
            <Typography variant="caption" color={currentScheme.colors.text.secondary} display="block" gutterBottom>
              Date Format
            </Typography>
            <Select
              value={formData.dateFormat}
              onChange={(e) => handleChange('dateFormat', e.target.value)}
              size="small"
              fullWidth
              sx={{
                background: currentScheme.colors.components.input,
                borderColor: currentScheme.colors.components.border,
              }}
            >
              <MenuItem value="dd/MM/yyyy">DD/MM/YYYY</MenuItem>
              <MenuItem value="MM/dd/yyyy">MM/DD/YYYY</MenuItem>
              <MenuItem value="yyyy-MM-dd">YYYY-MM-DD</MenuItem>
              <MenuItem value="dd MMM yyyy">DD Mon YYYY</MenuItem>
            </Select>
          </Box>
          
          <Box sx={{ flex: '1 1 200px' }}>
            <Typography variant="caption" color={currentScheme.colors.text.secondary} display="block" gutterBottom>
              Time Format
            </Typography>
            <Select
              value={formData.timeFormat}
              onChange={(e) => handleChange('timeFormat', e.target.value)}
              size="small"
              fullWidth
              sx={{
                background: currentScheme.colors.components.input,
                borderColor: currentScheme.colors.components.border,
              }}
            >
              <MenuItem value="12h">12-hour (AM/PM)</MenuItem>
              <MenuItem value="24h">24-hour</MenuItem>
            </Select>
          </Box>
        </Box>
      </Box>

      {/* Auto-save Settings */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="subtitle1" fontWeight="medium" gutterBottom sx={{ color: currentScheme.colors.text.primary }}>
          Auto-save Settings
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <FormControlLabel
            control={
              <Switch
                checked={formData.autoSave}
                onChange={(e) => handleChange('autoSave', e.target.checked)}
                size="small"
              />
            }
            label="Enable auto-save"
            sx={{ color: currentScheme.colors.text.primary }}
          />
        </Box>
        
        {formData.autoSave && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2" color={currentScheme.colors.text.secondary}>
              Auto-save interval:
            </Typography>
            <Slider
              value={formData.autoSaveInterval}
              onChange={(e, value) => handleChange('autoSaveInterval', value)}
              min={5}
              max={300}
              step={5}
              sx={{ width: 200 }}
            />
            <Typography variant="body2" color={currentScheme.colors.text.secondary}>
              {formData.autoSaveInterval} seconds
            </Typography>
          </Box>
        )}
      </Box>

      {/* Save Button */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          onClick={handleSubmit}
          sx={{
            background: `linear-gradient(135deg, ${currentScheme.colors.primary} 0%, ${currentScheme.colors.secondary} 100%)`,
          }}
        >
          Save Preferences
        </Button>
      </Box>
    </Box>
  );
}

function NotificationsTab({ settings, onSave, currentScheme }: any) {
  const [formData, setFormData] = useState(settings || {
    email: { enabled: true, frequency: 'instant' },
    push: { enabled: true },
    inApp: { enabled: true, sound: true },
  });

  const handleChange = (path: string, value: any) => {
    const keys = path.split('.');
    setFormData(prev => {
      const newData = { ...prev };
      let current: any = newData;
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {};
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      return newData;
    });
  };

  const handleSubmit = () => {
    onSave(formData);
  };

  return (
    <Box>
      <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ color: currentScheme.colors.text.primary }}>
        <NotificationsIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
        Notification Settings
      </Typography>
      <Typography variant="body2" color={currentScheme.colors.text.secondary} paragraph>
        Configure how and when you receive notifications
      </Typography>

      <Divider sx={{ borderColor: currentScheme.colors.components.border, my: 3 }} />

      {/* Email Notifications */}
      <Paper sx={{ p: 2, mb: 3, background: currentScheme.colors.components.input }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <EmailIcon />
            <Typography variant="subtitle1" fontWeight="medium" sx={{ color: currentScheme.colors.text.primary }}>
              Email Notifications
            </Typography>
          </Box>
          <Switch
            checked={formData.email.enabled}
            onChange={(e) => handleChange('email.enabled', e.target.checked)}
          />
        </Box>
        
        {formData.email.enabled && (
          <Box sx={{ pl: 3 }}>
            <Typography variant="body2" color={currentScheme.colors.text.secondary} gutterBottom>
              Frequency
            </Typography>
            <Select
              value={formData.email.frequency}
              onChange={(e) => handleChange('email.frequency', e.target.value)}
              size="small"
              fullWidth
              sx={{ mb: 2 }}
            >
              <MenuItem value="instant">Instant</MenuItem>
              <MenuItem value="daily">Daily Digest</MenuItem>
              <MenuItem value="weekly">Weekly Digest</MenuItem>
            </Select>
          </Box>
        )}
      </Paper>

      {/* Push Notifications */}
      <Paper sx={{ p: 2, mb: 3, background: currentScheme.colors.components.input }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="subtitle1" fontWeight="medium" sx={{ color: currentScheme.colors.text.primary }}>
            Push Notifications
          </Typography>
          <Switch
            checked={formData.push.enabled}
            onChange={(e) => handleChange('push.enabled', e.target.checked)}
          />
        </Box>
      </Paper>

      {/* In-App Notifications */}
      <Paper sx={{ p: 2, mb: 3, background: currentScheme.colors.components.input }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="subtitle1" fontWeight="medium" sx={{ color: currentScheme.colors.text.primary }}>
            In-App Notifications
          </Typography>
          <Switch
            checked={formData.inApp.enabled}
            onChange={(e) => handleChange('inApp.enabled', e.target.checked)}
          />
        </Box>
        
        {formData.inApp.enabled && (
          <Box sx={{ pl: 3 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.inApp.sound}
                  onChange={(e) => handleChange('inApp.sound', e.target.checked)}
                  size="small"
                />
              }
              label="Play sound for notifications"
              sx={{ color: currentScheme.colors.text.secondary }}
            />
          </Box>
        )}
      </Paper>

      {/* Save Button */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          onClick={handleSubmit}
          sx={{
            background: `linear-gradient(135deg, ${currentScheme.colors.primary} 0%, ${currentScheme.colors.secondary} 100%)`,
          }}
        >
          Save Notification Settings
        </Button>
      </Box>
    </Box>
  );
}

function IntegrationsTab({ settings, onSave, currentScheme }: any) {
  const [formData, setFormData] = useState(settings || {
    paymentGateways: { razorpay: { enabled: false } },
    accounting: { tally: { enabled: false } },
  });

  const handleToggle = (integration: string, enabled: boolean) => {
    const newData = { ...formData };
    const path = integration.split('.');
    let current: any = newData;
    for (let i = 0; i < path.length; i++) {
      if (i === path.length - 1) {
        current[path[i]] = { ...current[path[i]], enabled };
      } else {
        current = current[path[i]];
      }
    }
    setFormData(newData);
  };

  const handleSubmit = () => {
    onSave(formData);
  };

  return (
    <Box>
      <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ color: currentScheme.colors.text.primary }}>
        <IntegrationsIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
        Integration Settings
      </Typography>
      <Typography variant="body2" color={currentScheme.colors.text.secondary} paragraph>
        Connect and configure third-party services
      </Typography>

      <Divider sx={{ borderColor: currentScheme.colors.components.border, my: 3 }} />

      {/* Payment Gateways */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="subtitle1" fontWeight="medium" gutterBottom sx={{ color: currentScheme.colors.text.primary, mb: 2 }}>
          Payment Gateways
        </Typography>
        
        <Paper sx={{ p: 2, mb: 2, background: currentScheme.colors.components.input }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="body1" fontWeight="medium" sx={{ color: currentScheme.colors.text.primary }}>
                Razorpay
              </Typography>
              <Typography variant="caption" color={currentScheme.colors.text.secondary}>
                Accept online payments via Razorpay
              </Typography>
            </Box>
            <Switch
              checked={formData.paymentGateways?.razorpay?.enabled || false}
              onChange={(e) => handleToggle('paymentGateways.razorpay', e.target.checked)}
            />
          </Box>
          
          {formData.paymentGateways?.razorpay?.enabled && (
            <Box sx={{ mt: 2, pl: 2 }}>
              <TextField
                label="API Key"
                size="small"
                fullWidth
                sx={{ mb: 1 }}
              />
              <TextField
                label="Secret Key"
                type="password"
                size="small"
                fullWidth
              />
            </Box>
          )}
        </Paper>

        <Paper sx={{ p: 2, background: currentScheme.colors.components.input }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="body1" fontWeight="medium" sx={{ color: currentScheme.colors.text.primary }}>
                Stripe
              </Typography>
              <Typography variant="caption" color={currentScheme.colors.text.secondary}>
                Accept international payments
              </Typography>
            </Box>
            <Switch disabled />
          </Box>
        </Paper>
      </Box>

      {/* Accounting Software */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="subtitle1" fontWeight="medium" gutterBottom sx={{ color: currentScheme.colors.text.primary, mb: 2 }}>
          Accounting Software
        </Typography>
        
        <Paper sx={{ p: 2, background: currentScheme.colors.components.input }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="body1" fontWeight="medium" sx={{ color: currentScheme.colors.text.primary }}>
                Tally Integration
              </Typography>
              <Typography variant="caption" color={currentScheme.colors.text.secondary}>
                Sync data with Tally accounting software
              </Typography>
            </Box>
            <Switch
              checked={formData.accounting?.tally?.enabled || false}
              onChange={(e) => handleToggle('accounting.tally', e.target.checked)}
            />
          </Box>
        </Paper>
      </Box>

      {/* Save Button */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          onClick={handleSubmit}
          sx={{
            background: `linear-gradient(135deg, ${currentScheme.colors.primary} 0%, ${currentScheme.colors.secondary} 100%)`,
          }}
        >
          Save Integration Settings
        </Button>
      </Box>
    </Box>
  );
}

function BillingTab({ settings, onSave, currentScheme }: any) {
  const [formData, setFormData] = useState(settings || {
    invoice: { autoGenerate: true, dueDays: 7, lateFee: 2 },
    tax: { gst: { enabled: true, rate: 18 } },
  });

  const handleChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = () => {
    onSave(formData);
  };

  return (
    <Box>
      <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ color: currentScheme.colors.text.primary }}>
        <BillingIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
        Billing & Invoicing Settings
      </Typography>
      <Typography variant="body2" color={currentScheme.colors.text.secondary} paragraph>
        Configure your billing, invoicing, and tax settings
      </Typography>

      <Divider sx={{ borderColor: currentScheme.colors.components.border, my: 3 }} />

      {/* Invoice Settings */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="subtitle1" fontWeight="medium" gutterBottom sx={{ color: currentScheme.colors.text.primary }}>
          Invoice Settings
        </Typography>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
          <FormControlLabel
            control={
              <Switch
                checked={formData.invoice?.autoGenerate || false}
                onChange={(e) => handleChange('invoice', { ...formData.invoice, autoGenerate: e.target.checked })}
              />
            }
            label="Auto-generate invoices"
            sx={{ color: currentScheme.colors.text.primary }}
          />
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2" color={currentScheme.colors.text.secondary}>
              Payment due days:
            </Typography>
            <Slider
              value={formData.invoice?.dueDays || 7}
              onChange={(e, value) => handleChange('invoice', { ...formData.invoice, dueDays: value })}
              min={1}
              max={30}
              step={1}
              sx={{ width: 200 }}
            />
            <Typography variant="body2" color={currentScheme.colors.text.secondary}>
              {formData.invoice?.dueDays || 7} days
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2" color={currentScheme.colors.text.secondary}>
              Late fee percentage:
            </Typography>
            <Slider
              value={formData.invoice?.lateFee || 2}
              onChange={(e, value) => handleChange('invoice', { ...formData.invoice, lateFee: value })}
              min={0}
              max={10}
              step={0.5}
              sx={{ width: 200 }}
            />
            <Typography variant="body2" color={currentScheme.colors.text.secondary}>
              {formData.invoice?.lateFee || 2}%
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Tax Settings */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="subtitle1" fontWeight="medium" gutterBottom sx={{ color: currentScheme.colors.text.primary }}>
          Tax Settings
        </Typography>
        
        <Paper sx={{ p: 2, background: currentScheme.colors.components.input }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box>
              <Typography variant="body1" fontWeight="medium" sx={{ color: currentScheme.colors.text.primary }}>
                GST (Goods and Services Tax)
              </Typography>
              <Typography variant="caption" color={currentScheme.colors.text.secondary}>
                Apply GST to invoices
              </Typography>
            </Box>
            <Switch
              checked={formData.tax?.gst?.enabled || false}
              onChange={(e) => handleChange('tax', { 
                ...formData.tax, 
                gst: { ...formData.tax?.gst, enabled: e.target.checked }
              })}
            />
          </Box>
          
          {formData.tax?.gst?.enabled && (
            <Box sx={{ pl: 2 }}>
              <TextField
                label="GST Number"
                size="small"
                fullWidth
                sx={{ mb: 2 }}
              />
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography variant="body2" color={currentScheme.colors.text.secondary}>
                  GST Rate:
                </Typography>
                <Slider
                  value={formData.tax?.gst?.rate || 18}
                  onChange={(e, value) => handleChange('tax', { 
                    ...formData.tax, 
                    gst: { ...formData.tax?.gst, rate: value }
                  })}
                  min={0}
                  max={28}
                  step={0.5}
                  sx={{ width: 200 }}
                />
                <Typography variant="body2" color={currentScheme.colors.text.secondary}>
                  {formData.tax?.gst?.rate || 18}%
                </Typography>
              </Box>
            </Box>
          )}
        </Paper>
      </Box>

      {/* Save Button */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          onClick={handleSubmit}
          sx={{
            background: `linear-gradient(135deg, ${currentScheme.colors.primary} 0%, ${currentScheme.colors.secondary} 100%)`,
          }}
        >
          Save Billing Settings
        </Button>
      </Box>
    </Box>
  );
}

function SecurityTab({ settings, onSave, currentScheme }: any) {
  const [formData, setFormData] = useState(settings || {
    authentication: { twoFactor: { enabled: false } },
    sessionTimeout: 60,
  });

  const handleChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = () => {
    onSave(formData);
  };

  return (
    <Box>
      <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ color: currentScheme.colors.text.primary }}>
        <SecurityIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
        Security Settings
      </Typography>
      <Typography variant="body2" color={currentScheme.colors.text.secondary} paragraph>
        Configure security and authentication settings
      </Typography>

      <Divider sx={{ borderColor: currentScheme.colors.components.border, my: 3 }} />

      {/* Two-Factor Authentication */}
      <Paper sx={{ p: 2, mb: 3, background: currentScheme.colors.components.input }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box>
            <Typography variant="body1" fontWeight="medium" sx={{ color: currentScheme.colors.text.primary }}>
              Two-Factor Authentication (2FA)
            </Typography>
            <Typography variant="caption" color={currentScheme.colors.text.secondary}>
              Add an extra layer of security to your account
            </Typography>
          </Box>
          <Switch
            checked={formData.authentication?.twoFactor?.enabled || false}
            onChange={(e) => handleChange('authentication', { 
              ...formData.authentication, 
              twoFactor: { ...formData.authentication?.twoFactor, enabled: e.target.checked }
            })}
          />
        </Box>
      </Paper>

      {/* Session Settings */}
      <Paper sx={{ p: 2, mb: 3, background: currentScheme.colors.components.input }}>
        <Typography variant="body1" fontWeight="medium" sx={{ color: currentScheme.colors.text.primary, mb: 2 }}>
          Session Settings
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="body2" color={currentScheme.colors.text.secondary}>
            Session timeout:
          </Typography>
          <Slider
            value={formData.sessionTimeout || 60}
            onChange={(e, value) => handleChange('sessionTimeout', value)}
            min={5}
            max={240}
            step={5}
            sx={{ width: 200 }}
          />
          <Typography variant="body2" color={currentScheme.colors.text.secondary}>
            {formData.sessionTimeout || 60} minutes
          </Typography>
        </Box>
      </Paper>

      {/* Save Button */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          onClick={handleSubmit}
          sx={{
            background: `linear-gradient(135deg, ${currentScheme.colors.primary} 0%, ${currentScheme.colors.secondary} 100%)`,
          }}
        >
          Save Security Settings
        </Button>
      </Box>
    </Box>
  );
}

function AppearanceTab({ settings, onSave, currentScheme }: any) {
  const [formData, setFormData] = useState(settings || {
    theme: { mode: 'light', density: 'comfortable' },
    dashboard: { layout: 'grid' },
  });

  const { mode, toggleTheme } = useAdvanceThemeContext();

  const handleChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = () => {
    onSave(formData);
  };

  return (
    <Box>
      <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ color: currentScheme.colors.text.primary }}>
        <PaletteIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
        Appearance Settings
      </Typography>
      <Typography variant="body2" color={currentScheme.colors.text.secondary} paragraph>
        Customize the look and feel of your interface
      </Typography>

      <Divider sx={{ borderColor: currentScheme.colors.components.border, my: 3 }} />

      {/* Theme Mode */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="subtitle1" fontWeight="medium" gutterBottom sx={{ color: currentScheme.colors.text.primary, mb: 2 }}>
          Theme Mode
        </Typography>
        
        <Paper sx={{ p: 2, background: currentScheme.colors.components.input }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box>
              <Typography variant="body1" sx={{ color: currentScheme.colors.text.primary }}>
                Dark Mode
              </Typography>
              <Typography variant="caption" color={currentScheme.colors.text.secondary}>
                Switch between light and dark themes
              </Typography>
            </Box>
            <Button
              variant="contained"
              onClick={toggleTheme}
              sx={{
                background: `linear-gradient(135deg, ${currentScheme.colors.primary} 0%, ${currentScheme.colors.secondary} 100%)`,
              }}
            >
              Switch to {mode === 'dark' ? 'Light' : 'Dark'} Mode
            </Button>
          </Box>
        </Paper>
      </Box>

      {/* Layout Density */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="subtitle1" fontWeight="medium" gutterBottom sx={{ color: currentScheme.colors.text.primary, mb: 2 }}>
          Layout Density
        </Typography>
        
        <Paper sx={{ p: 2, background: currentScheme.colors.components.input }}>
          <Typography variant="body2" color={currentScheme.colors.text.secondary} gutterBottom>
            Choose how compact you want the interface to be
          </Typography>
          
          <RadioGroup
            value={formData.theme?.density || 'comfortable'}
            onChange={(e) => handleChange('theme', { ...formData.theme, density: e.target.value })}
            sx={{ mt: 1 }}
          >
            <FormControlLabel
              value="compact"
              control={<Radio />}
              label={
                <Box>
                  <Typography variant="body2" sx={{ color: currentScheme.colors.text.primary }}>
                    Compact
                  </Typography>
                  <Typography variant="caption" color={currentScheme.colors.text.secondary}>
                    More content, smaller spacing
                  </Typography>
                </Box>
              }
            />
            <FormControlLabel
              value="comfortable"
              control={<Radio />}
              label={
                <Box>
                  <Typography variant="body2" sx={{ color: currentScheme.colors.text.primary }}>
                    Comfortable (Recommended)
                  </Typography>
                  <Typography variant="caption" color={currentScheme.colors.text.secondary}>
                    Balanced spacing for better readability
                  </Typography>
                </Box>
              }
            />
            <FormControlLabel
              value="spacious"
              control={<Radio />}
              label={
                <Box>
                  <Typography variant="body2" sx={{ color: currentScheme.colors.text.primary }}>
                    Spacious
                  </Typography>
                  <Typography variant="caption" color={currentScheme.colors.text.secondary}>
                    More whitespace, less content per view
                  </Typography>
                </Box>
              }
            />
          </RadioGroup>
        </Paper>
      </Box>

      {/* Dashboard Layout */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="subtitle1" fontWeight="medium" gutterBottom sx={{ color: currentScheme.colors.text.primary, mb: 2 }}>
          Dashboard Layout
        </Typography>
        
        <Paper sx={{ p: 2, background: currentScheme.colors.components.input }}>
          <Typography variant="body2" color={currentScheme.colors.text.secondary} gutterBottom>
            Choose how your dashboard widgets are arranged
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
            <Button
              variant={formData.dashboard?.layout === 'grid' ? 'contained' : 'outlined'}
              onClick={() => handleChange('dashboard', { ...formData.dashboard, layout: 'grid' })}
              sx={{
                flex: 1,
                borderColor: currentScheme.colors.components.border,
              }}
            >
              Grid View
            </Button>
            <Button
              variant={formData.dashboard?.layout === 'list' ? 'contained' : 'outlined'}
              onClick={() => handleChange('dashboard', { ...formData.dashboard, layout: 'list' })}
              sx={{
                flex: 1,
                borderColor: currentScheme.colors.components.border,
              }}
            >
              List View
            </Button>
          </Box>
        </Paper>
      </Box>

      {/* Save Button */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          onClick={handleSubmit}
          sx={{
            background: `linear-gradient(135deg, ${currentScheme.colors.primary} 0%, ${currentScheme.colors.secondary} 100%)`,
          }}
        >
          Save Appearance Settings
        </Button>
      </Box>
    </Box>
  );
}

function AnalyticsTab({ settings, onSave, currentScheme }: any) {
  const [formData, setFormData] = useState(settings || {
    tracking: { enabled: true, anonymize: true },
    dashboards: { autoRefresh: true, refreshInterval: 300 },
  });

  const handleChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = () => {
    onSave(formData);
  };

  return (
    <Box>
      <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ color: currentScheme.colors.text.primary }}>
        <AnalyticsIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
        Analytics Settings
      </Typography>
      <Typography variant="body2" color={currentScheme.colors.text.secondary} paragraph>
        Configure analytics and data collection preferences
      </Typography>

      <Divider sx={{ borderColor: currentScheme.colors.components.border, my: 3 }} />

      {/* Data Tracking */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="subtitle1" fontWeight="medium" gutterBottom sx={{ color: currentScheme.colors.text.primary, mb: 2 }}>
          Data Tracking
        </Typography>
        
        <Paper sx={{ p: 2, background: currentScheme.colors.components.input }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box>
              <Typography variant="body1" fontWeight="medium" sx={{ color: currentScheme.colors.text.primary }}>
                Enable Analytics Tracking
              </Typography>
              <Typography variant="caption" color={currentScheme.colors.text.secondary}>
                Collect usage data to improve your experience
              </Typography>
            </Box>
            <Switch
              checked={formData.tracking?.enabled || false}
              onChange={(e) => handleChange('tracking', { ...formData.tracking, enabled: e.target.checked })}
            />
          </Box>
          
          {formData.tracking?.enabled && (
            <Box sx={{ pl: 2 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.tracking?.anonymize || false}
                    onChange={(e) => handleChange('tracking', { ...formData.tracking, anonymize: e.target.checked })}
                    size="small"
                  />
                }
                label="Anonymize data"
                sx={{ color: currentScheme.colors.text.secondary }}
              />
            </Box>
          )}
        </Paper>
      </Box>

      {/* Dashboard Settings */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="subtitle1" fontWeight="medium" gutterBottom sx={{ color: currentScheme.colors.text.primary, mb: 2 }}>
          Dashboard Settings
        </Typography>
        
        <Paper sx={{ p: 2, background: currentScheme.colors.components.input }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box>
              <Typography variant="body1" fontWeight="medium" sx={{ color: currentScheme.colors.text.primary }}>
                Auto-refresh Dashboards
              </Typography>
              <Typography variant="caption" color={currentScheme.colors.text.secondary}>
                Automatically refresh dashboard data
              </Typography>
            </Box>
            <Switch
              checked={formData.dashboards?.autoRefresh || false}
              onChange={(e) => handleChange('dashboards', { ...formData.dashboards, autoRefresh: e.target.checked })}
            />
          </Box>
          
          {formData.dashboards?.autoRefresh && (
            <Box sx={{ pl: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography variant="body2" color={currentScheme.colors.text.secondary}>
                  Refresh interval:
                </Typography>
                <Slider
                  value={formData.dashboards?.refreshInterval || 300}
                  onChange={(e, value) => handleChange('dashboards', { ...formData.dashboards, refreshInterval: value })}
                  min={60}
                  max={1800}
                  step={60}
                  sx={{ width: 200 }}
                />
                <Typography variant="body2" color={currentScheme.colors.text.secondary}>
                  {formData.dashboards?.refreshInterval / 60} minutes
                </Typography>
              </Box>
            </Box>
          )}
        </Paper>
      </Box>

      {/* Save Button */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          onClick={handleSubmit}
          sx={{
            background: `linear-gradient(135deg, ${currentScheme.colors.primary} 0%, ${currentScheme.colors.secondary} 100%)`,
          }}
        >
          Save Analytics Settings
        </Button>
      </Box>
    </Box>
  );
}