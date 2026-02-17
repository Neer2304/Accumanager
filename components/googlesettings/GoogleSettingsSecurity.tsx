// components/googlesettings/GoogleSettingsSecurity.tsx
'use client'

import React, { useState } from 'react'
import {
  Box,
  Typography,
  Paper,
  Stack,
  Switch,
  FormControlLabel,
  TextField,
  Button,
  Chip,
  alpha,
  InputAdornment,
  Alert,
  Divider,
} from '@mui/material'
import {
  Security,
  Lock,
  AccessTime,
  Password,
  Notifications,
  Public,
  Add,
  Delete,
  VerifiedUser,
} from '@mui/icons-material'
import { SettingsSectionProps } from './types'

export default function GoogleSettingsSecurity({ 
  settings, 
  onSettingChange,
  darkMode,
}: SettingsSectionProps) {
  
  const [newIp, setNewIp] = useState('')
  const [showPasswordAlert, setShowPasswordAlert] = useState(false)

  const handleAddIp = () => {
    if (newIp && !settings.ipWhitelist.includes(newIp)) {
      const updatedList = [...settings.ipWhitelist, newIp]
      onSettingChange('ipWhitelist', updatedList)
      setNewIp('')
    }
  }

  const handleRemoveIp = (ipToRemove: string) => {
    const updatedList = settings.ipWhitelist.filter((ip: string) => ip !== ipToRemove)
    onSettingChange('ipWhitelist', updatedList)
  }

  const handlePasswordChangeRequired = (checked: boolean) => {
    onSettingChange('passwordChangeRequired', checked)
    if (checked) {
      setShowPasswordAlert(true)
      setTimeout(() => setShowPasswordAlert(false), 5000)
    }
  }

  return (
    <Box>
      {/* Password Change Alert */}
      {showPasswordAlert && (
        <Alert
          severity="warning"
          sx={{
            mb: 3,
            borderRadius: '12px',
            backgroundColor: darkMode ? alpha('#fbbc04', 0.1) : alpha('#fbbc04', 0.05),
            border: `1px solid ${darkMode ? alpha('#fbbc04', 0.2) : alpha('#fbbc04', 0.1)}`,
          }}
        >
          Users will be required to change their password on next login
        </Alert>
      )}

      {/* Two Factor Authentication */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, sm: 3 },
          mb: 3,
          borderRadius: '16px',
          border: darkMode ? '1px solid #3c4043' : '1px solid #dadce0',
          backgroundColor: darkMode ? '#202124' : '#ffffff',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <VerifiedUser sx={{ color: darkMode ? '#8ab4f8' : '#1a73e8' }} />
          <Typography variant="subtitle1" fontWeight={500}>
            Two-Factor Authentication
          </Typography>
        </Box>

        <FormControlLabel
          control={
            <Switch
              checked={settings.twoFactorAuth || false}
              onChange={(e) => onSettingChange('twoFactorAuth', e.target.checked)}
              sx={{
                '& .MuiSwitch-switchBase.Mui-checked': {
                  color: darkMode ? '#8ab4f8' : '#1a73e8',
                },
                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                  backgroundColor: darkMode ? '#8ab4f8' : '#1a73e8',
                },
              }}
            />
          }
          label={
            <Box sx={{ ml: 1 }}>
              <Typography variant="body2" color={darkMode ? '#e8eaed' : '#202124'}>
                Enable Two-Factor Authentication
              </Typography>
              <Typography variant="caption" color={darkMode ? '#9aa0a6' : '#5f6368'}>
                Add an extra layer of security to your account
              </Typography>
            </Box>
          }
          sx={{ width: '100%', mx: 0 }}
        />
      </Paper>

      {/* Session Settings */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, sm: 3 },
          mb: 3,
          borderRadius: '16px',
          border: darkMode ? '1px solid #3c4043' : '1px solid #dadce0',
          backgroundColor: darkMode ? '#202124' : '#ffffff',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <AccessTime sx={{ color: darkMode ? '#8ab4f8' : '#1a73e8' }} />
          <Typography variant="subtitle1" fontWeight={500}>
            Session Settings
          </Typography>
        </Box>

        <Stack spacing={3}>
          <TextField
            fullWidth
            label="Session Timeout (minutes)"
            type="number"
            value={settings.sessionTimeout || 30}
            onChange={(e) => onSettingChange('sessionTimeout', Number(e.target.value))}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AccessTime sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
                backgroundColor: darkMode ? '#202124' : '#ffffff',
              },
            }}
          />

          <FormControlLabel
            control={
              <Switch
                checked={settings.passwordChangeRequired || false}
                onChange={(e) => handlePasswordChangeRequired(e.target.checked)}
                sx={{
                  '& .MuiSwitch-switchBase.Mui-checked': {
                    color: darkMode ? '#8ab4f8' : '#1a73e8',
                  },
                }}
              />
            }
            label={
              <Box sx={{ ml: 1 }}>
                <Typography variant="body2" color={darkMode ? '#e8eaed' : '#202124'}>
                  Force Password Change
                </Typography>
                <Typography variant="caption" color={darkMode ? '#9aa0a6' : '#5f6368'}>
                  Require users to change password on next login
                </Typography>
              </Box>
            }
            sx={{ width: '100%', mx: 0 }}
          />

          <FormControlLabel
            control={
              <Switch
                checked={settings.loginAlerts || false}
                onChange={(e) => onSettingChange('loginAlerts', e.target.checked)}
                sx={{
                  '& .MuiSwitch-switchBase.Mui-checked': {
                    color: darkMode ? '#8ab4f8' : '#1a73e8',
                  },
                }}
              />
            }
            label={
              <Box sx={{ ml: 1 }}>
                <Typography variant="body2" color={darkMode ? '#e8eaed' : '#202124'}>
                  Login Alerts
                </Typography>
                <Typography variant="caption" color={darkMode ? '#9aa0a6' : '#5f6368'}>
                  Get notified of new login attempts
                </Typography>
              </Box>
            }
            sx={{ width: '100%', mx: 0 }}
          />
        </Stack>
      </Paper>

      {/* IP Whitelist */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, sm: 3 },
          borderRadius: '16px',
          border: darkMode ? '1px solid #3c4043' : '1px solid #dadce0',
          backgroundColor: darkMode ? '#202124' : '#ffffff',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <Public sx={{ color: darkMode ? '#8ab4f8' : '#1a73e8' }} />
          <Typography variant="subtitle1" fontWeight={500}>
            IP Whitelist
          </Typography>
        </Box>

        <Typography variant="caption" color={darkMode ? '#9aa0a6' : '#5f6368'} sx={{ display: 'block', mb: 2 }}>
          Only these IP addresses will be allowed to access the admin panel
        </Typography>

        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Enter IP address (e.g., 192.168.1.1)"
            value={newIp}
            onChange={(e) => setNewIp(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
                backgroundColor: darkMode ? '#202124' : '#ffffff',
              },
            }}
          />
          <Button
            variant="contained"
            onClick={handleAddIp}
            disabled={!newIp}
            sx={{
              borderRadius: '12px',
              backgroundColor: darkMode ? '#8ab4f8' : '#1a73e8',
              '&:hover': {
                backgroundColor: darkMode ? '#aecbfa' : '#1669c1',
              },
            }}
          >
            <Add />
          </Button>
        </Box>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {settings.ipWhitelist?.map((ip: string) => (
            <Chip
              key={ip}
              label={ip}
              onDelete={() => handleRemoveIp(ip)}
              deleteIcon={<Delete />}
              sx={{
                backgroundColor: darkMode ? '#303134' : '#f1f3f4',
                color: darkMode ? '#e8eaed' : '#202124',
                border: darkMode ? '1px solid #3c4043' : '1px solid #dadce0',
                '& .MuiChip-deleteIcon': {
                  color: darkMode ? '#9aa0a6' : '#5f6368',
                  '&:hover': {
                    color: '#ea4335',
                  },
                },
              }}
            />
          ))}
          {(!settings.ipWhitelist || settings.ipWhitelist.length === 0) && (
            <Typography variant="body2" color={darkMode ? '#9aa0a6' : '#5f6368'} sx={{ py: 1 }}>
              No IP addresses whitelisted
            </Typography>
          )}
        </Box>
      </Paper>
    </Box>
  )
}