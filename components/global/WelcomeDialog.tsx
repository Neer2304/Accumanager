// @/components/global/WelcomeDialog.tsx
'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  LinearProgress,
  Chip,
  Alert,
  IconButton,
} from '@mui/material'
import {
  Warning,
  CheckCircle,
  Close,
  Info,
  Psychology,
  AutoAwesome,
  Shield,
  FlashOn,
} from '@mui/icons-material'
import { useAdvanceThemeContext } from '@/contexts/AdvanceThemeContexts'

const WelcomeDialog = () => {
  const { currentScheme } = useAdvanceThemeContext()
  const [open, setOpen] = useState(false)
  const [countdown, setCountdown] = useState(5)

  useEffect(() => {
    // Check localStorage on client side only
    const hasSeenDialog = localStorage.getItem('aiWelcomeDialogSeen')
    
    if (!hasSeenDialog) {
      // Show after 2 seconds to ensure page loads
      const timer = setTimeout(() => {
        setOpen(true)
      }, 2000)
      
      return () => clearTimeout(timer)
    }
  }, [])

  // Countdown timer
  useEffect(() => {
    let interval: NodeJS.Timeout
    
    if (open) {
      interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            handleClose()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [open])

  const handleClose = () => {
    localStorage.setItem('aiWelcomeDialogSeen', 'true')
    setOpen(false)
  }

  const handleAcceptAll = () => {
    localStorage.setItem('aiWelcomeDialogSeen', 'true')
    setOpen(false)
  }

  if (!open) return null

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          overflow: 'hidden',
          position: 'relative',
          background: currentScheme.colors.components.card,
          border: `2px solid ${currentScheme.colors.primary}40`,
        }
      }}
    >
      {/* Countdown Bar */}
      <Box sx={{ position: 'relative', height: 4 }}>
        <LinearProgress
          variant="determinate"
          value={(countdown / 5) * 100}
          sx={{
            height: 4,
            '& .MuiLinearProgress-bar': {
              background: `linear-gradient(90deg, ${currentScheme.colors.primary} 0%, ${currentScheme.colors.secondary} 100%)`,
            },
          }}
        />
      </Box>

      {/* Header */}
      <DialogTitle sx={{ 
        p: 3, 
        pb: 2,
        background: `linear-gradient(135deg, ${currentScheme.colors.primary}10 0%, ${currentScheme.colors.secondary}10 100%)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <Box display="flex" alignItems="center" gap={2}>
          <Box sx={{
            width: 50,
            height: 50,
            borderRadius: 3,
            background: `linear-gradient(135deg, ${currentScheme.colors.primary} 0%, ${currentScheme.colors.secondary} 100%)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Psychology sx={{ fontSize: 28, color: 'white' }} />
          </Box>
          <Box>
            <Typography variant="h5" fontWeight="bold">
              🚀 Welcome to AI Analytics
            </Typography>
            <Typography variant="body2" color={currentScheme.colors.text.secondary}>
              One-time welcome message
            </Typography>
          </Box>
        </Box>
        <Chip
          label={`Closes in ${countdown}s`}
          size="small"
          color="primary"
          variant="outlined"
        />
      </DialogTitle>

      {/* Content */}
      <DialogContent sx={{ p: 3 }}>
        <Alert 
          severity="info" 
          icon={<Info />}
          sx={{ mb: 3 }}
        >
          This is a one-time welcome message. You won't see this again.
        </Alert>

        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom fontWeight="medium">
            <AutoAwesome /> AI Features Available:
          </Typography>
          <Box component="ul" sx={{ pl: 2, m: 0 }}>
            {[
              "Ask AI questions about your data",
              "Get real-time predictions",
              "Receive automated alerts",
              "Generate insights",
              "Create visualizations"
            ].map((item, index) => (
              <Box component="li" key={index} sx={{ typography: 'body2', mb: 1 }}>
                {item}
              </Box>
            ))}
          </Box>
        </Box>

        <Alert 
          severity="warning" 
          icon={<Warning />}
          sx={{ mb: 3 }}
        >
          <Typography variant="body2">
            • AI predictions are based on available data
            <br />
            • Ensure data is up-to-date for accurate forecasts
            <br />
            • Review insights before making decisions
          </Typography>
        </Alert>

        <Box sx={{ 
          p: 2, 
          borderRadius: 2, 
          background: `${currentScheme.colors.primary}10`,
          border: `1px solid ${currentScheme.colors.primary}30`
        }}>
          <Typography variant="body2" color={currentScheme.colors.text.secondary}>
            All data processing happens on secure servers with encryption.
          </Typography>
        </Box>
      </DialogContent>

      {/* Actions */}
      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button
          onClick={handleClose}
          variant="outlined"
          startIcon={<Close />}
        >
          Close
        </Button>
        <Button
          onClick={handleAcceptAll}
          variant="contained"
          startIcon={<CheckCircle />}
          sx={{
            background: `linear-gradient(135deg, ${currentScheme.colors.primary} 0%, ${currentScheme.colors.secondary} 100%)`,
          }}
        >
          Got it
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default WelcomeDialog