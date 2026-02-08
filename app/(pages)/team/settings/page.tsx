"use client";

import { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Switch,
  FormControlLabel,
  TextField,
  Divider,
  Alert,
  useTheme,
  useMediaQuery,
  Paper,
  Stack,
  CircularProgress,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import {
  Save,
  Security,
  Notifications,
  People,
  Language,
  Cloud,
  DataObject,
  Backup,
  Api,
  Lock,
} from "@mui/icons-material";
import { MainLayout } from "@/components/Layout/MainLayout";

export default function TeamSettingsPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const darkMode = theme.palette.mode === 'dark';

  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    teamName: "",
    teamDescription: "",
    timezone: "UTC",
    language: "en",
    twoFactorAuth: false,
    sessionTimeout: 30,
    ipWhitelist: false,
    emailNotifications: true,
    pushNotifications: true,
    dailyDigest: true,
    mentionNotifications: true,
    apiAccess: false,
    webhooksEnabled: false,
    dataExport: true,
  });

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const saveSettings = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      console.log("Settings saved:", settings);
    }, 1000);
  };

  const resetToDefaults = () => {
    setSettings({
      teamName: "",
      teamDescription: "",
      timezone: "UTC",
      language: "en",
      twoFactorAuth: false,
      sessionTimeout: 30,
      ipWhitelist: false,
      emailNotifications: true,
      pushNotifications: true,
      dailyDigest: true,
      mentionNotifications: true,
      apiAccess: false,
      webhooksEnabled: false,
      dataExport: true,
    });
  };

  return (
    <MainLayout title="Team Settings">
      <Container maxWidth="xl" sx={{ py: 3, px: { xs: 1, sm: 2 } }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: { xs: 'flex-start', sm: 'center' },
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
            mb: 3
          }}>
            <Box>
              <Typography variant="h4" fontWeight={700} gutterBottom>
                Team Settings
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Configure team preferences, security, and integrations
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                onClick={resetToDefaults}
                disabled={loading}
              >
                Reset Defaults
              </Button>
              <Button
                variant="contained"
                startIcon={loading ? <CircularProgress size={20} /> : <Save />}
                onClick={saveSettings}
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            </Box>
          </Box>
        </Box>

        {/* Settings Alert */}
        <Alert severity="info" sx={{ mb: 3 }}>
          Settings are managed through API integration. Connect to your backend to enable configuration.
        </Alert>

        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
          {/* Left Column */}
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* General Settings */}
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <People />
                  General Settings
                </Typography>

                <Stack spacing={3}>
                  <TextField
                    fullWidth
                    label="Team Name"
                    value={settings.teamName}
                    onChange={(e) => handleSettingChange('teamName', e.target.value)}
                    placeholder="Enter team name"
                  />

                  <TextField
                    fullWidth
                    label="Team Description"
                    value={settings.teamDescription}
                    onChange={(e) => handleSettingChange('teamDescription', e.target.value)}
                    placeholder="Describe your team"
                    multiline
                    rows={3}
                  />

                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: { xs: 'column', sm: 'row' },
                    gap: 2 
                  }}>
                    <Box sx={{ flex: 1 }}>
                      <FormControl fullWidth>
                        <InputLabel>Timezone</InputLabel>
                        <Select
                          value={settings.timezone}
                          label="Timezone"
                          onChange={(e) => handleSettingChange('timezone', e.target.value)}
                        >
                          <MenuItem value="UTC">UTC</MenuItem>
                          <MenuItem value="EST">EST</MenuItem>
                          <MenuItem value="PST">PST</MenuItem>
                          <MenuItem value="CET">CET</MenuItem>
                          <MenuItem value="IST">IST</MenuItem>
                        </Select>
                      </FormControl>
                    </Box>

                    <Box sx={{ flex: 1 }}>
                      <FormControl fullWidth>
                        <InputLabel>Language</InputLabel>
                        <Select
                          value={settings.language}
                          label="Language"
                          onChange={(e) => handleSettingChange('language', e.target.value)}
                        >
                          <MenuItem value="en">English</MenuItem>
                          <MenuItem value="es">Spanish</MenuItem>
                          <MenuItem value="fr">French</MenuItem>
                          <MenuItem value="de">German</MenuItem>
                          <MenuItem value="zh">Chinese</MenuItem>
                        </Select>
                      </FormControl>
                    </Box>
                  </Box>
                </Stack>
              </CardContent>
            </Card>

            {/* Security Settings */}
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Security />
                  Security Settings
                </Typography>

                <Stack spacing={2}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.twoFactorAuth}
                        onChange={(e) => handleSettingChange('twoFactorAuth', e.target.checked)}
                      />
                    }
                    label="Two-Factor Authentication"
                  />

                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.ipWhitelist}
                        onChange={(e) => handleSettingChange('ipWhitelist', e.target.checked)}
                      />
                    }
                    label="IP Address Whitelist"
                  />

                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Session Timeout (minutes)
                    </Typography>
                    <TextField
                      type="number"
                      value={settings.sessionTimeout}
                      onChange={(e) => handleSettingChange('sessionTimeout', parseInt(e.target.value))}
                      InputProps={{ inputProps: { min: 5, max: 1440 } }}
                      sx={{ width: 120 }}
                    />
                  </Box>

                  <Button
                    variant="outlined"
                    startIcon={<Lock />}
                  >
                    Advanced Security Settings
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Box>

          {/* Right Column */}
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Notification Settings */}
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Notifications />
                  Notification Settings
                </Typography>

                <Stack spacing={2}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.emailNotifications}
                        onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
                      />
                    }
                    label="Email Notifications"
                  />

                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.pushNotifications}
                        onChange={(e) => handleSettingChange('pushNotifications', e.target.checked)}
                      />
                    }
                    label="Push Notifications"
                  />

                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.dailyDigest}
                        onChange={(e) => handleSettingChange('dailyDigest', e.target.checked)}
                      />
                    }
                    label="Daily Digest Email"
                  />

                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.mentionNotifications}
                        onChange={(e) => handleSettingChange('mentionNotifications', e.target.checked)}
                      />
                    }
                    label="@Mention Notifications"
                  />
                </Stack>
              </CardContent>
            </Card>

            {/* Integration Settings */}
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Api />
                  Integration Settings
                </Typography>

                <Stack spacing={2}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.apiAccess}
                        onChange={(e) => handleSettingChange('apiAccess', e.target.checked)}
                      />
                    }
                    label="API Access"
                  />

                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.webhooksEnabled}
                        onChange={(e) => handleSettingChange('webhooksEnabled', e.target.checked)}
                      />
                    }
                    label="Webhooks Enabled"
                  />

                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.dataExport}
                        onChange={(e) => handleSettingChange('dataExport', e.target.checked)}
                      />
                    }
                    label="Allow Data Export"
                  />

                  <Button
                    variant="outlined"
                    startIcon={<DataObject />}
                  >
                    API Configuration
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Box>
        </Box>

        {/* Data Management */}
        <Card sx={{ mt: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Cloud />
              Data Management
            </Typography>

            <Box sx={{ 
              display: 'flex',
              flexWrap: 'wrap',
              gap: 2
            }}>
              <Box sx={{ 
                flex: '1 1 250px',
                minWidth: { xs: '100%', sm: '250px' }
              }}>
                <Paper sx={{ p: 2, textAlign: 'center', height: '100%' }}>
                  <Backup sx={{ fontSize: 40, color: '#4285f4', mb: 1 }} />
                  <Typography variant="subtitle1" fontWeight={600}>
                    Backup Data
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Create team data backup
                  </Typography>
                  <Button
                    variant="outlined"
                    size="small"
                  >
                    Configure
                  </Button>
                </Paper>
              </Box>

              <Box sx={{ 
                flex: '1 1 250px',
                minWidth: { xs: '100%', sm: '250px' }
              }}>
                <Paper sx={{ p: 2, textAlign: 'center', height: '100%' }}>
                  <Cloud sx={{ fontSize: 40, color: '#34a853', mb: 1 }} />
                  <Typography variant="subtitle1" fontWeight={600}>
                    Storage
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Manage team storage
                  </Typography>
                  <Button
                    variant="outlined"
                    size="small"
                  >
                    Configure
                  </Button>
                </Paper>
              </Box>

              <Box sx={{ 
                flex: '1 1 250px',
                minWidth: { xs: '100%', sm: '250px' }
              }}>
                <Paper sx={{ p: 2, textAlign: 'center', height: '100%' }}>
                  <DataObject sx={{ fontSize: 40, color: '#fbbc05', mb: 1 }} />
                  <Typography variant="subtitle1" fontWeight={600}>
                    Export Data
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Export team data
                  </Typography>
                  <Button
                    variant="outlined"
                    size="small"
                  >
                    Configure
                  </Button>
                </Paper>
              </Box>

              <Box sx={{ 
                flex: '1 1 250px',
                minWidth: { xs: '100%', sm: '250px' }
              }}>
                <Paper sx={{ p: 2, textAlign: 'center', height: '100%' }}>
                  <Language sx={{ fontSize: 40, color: '#ea4335', mb: 1 }} />
                  <Typography variant="subtitle1" fontWeight={600}>
                    Region
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Set data region
                  </Typography>
                  <Button
                    variant="outlined"
                    size="small"
                  >
                    Configure
                  </Button>
                </Paper>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </MainLayout>
  );
}