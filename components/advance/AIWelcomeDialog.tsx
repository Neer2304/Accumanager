// @/components/advance/AIWelcomeDialog.tsx
'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton,
  Paper,
  LinearProgress,
  Chip,
  Alert,
} from '@mui/material'
import {
  Warning,
  CheckCircle,
  Close,
  Info,
  RocketLaunch,
  Psychology,
  AutoAwesome,
  Shield,
} from '@mui/icons-material'
import { useAdvanceThemeContext } from '@/contexts/AdvanceThemeContexts'
import { motion } from 'framer-motion'

const AIWelcomeDialog = () => {
  const { currentScheme } = useAdvanceThemeContext()
  const [open, setOpen] = useState(false)
  const [countdown, setCountdown] = useState(5)
  const [isClosing, setIsClosing] = useState(false)

  useEffect(() => {
    // Check if this is the first visit
    const hasSeenDialog = localStorage.getItem('hasSeenAIWelcome')
    
    if (!hasSeenDialog) {
      const timer = setTimeout(() => {
        setOpen(true)
        localStorage.setItem('hasSeenAIWelcome', 'true')
      }, 1000) // Show after 1 second delay
      
      return () => clearTimeout(timer)
    }
  }, [])

  // Countdown timer
  useEffect(() => {
    let interval: NodeJS.Timeout
    
    if (open && !isClosing) {
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
  }, [open, isClosing])

  const handleClose = () => {
    setIsClosing(true)
    setOpen(false)
  }

  const handleAcceptAll = () => {
    setIsClosing(true)
    // Accept all features
    localStorage.setItem('aiAnalyticsEnabled', 'true')
    localStorage.setItem('predictionsEnabled', 'true')
    localStorage.setItem('autoRefreshEnabled', 'true')
    setOpen(false)
  }

  const handleCustomize = () => {
    setIsClosing(true)
    // Navigate to settings or show customization
    setOpen(false)
  }

  if (!open) return null

  return (
    <Dialog
      open={open}
      onClose={() => {}}
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
        <motion.div
          initial={{ width: '100%' }}
          animate={{ width: `${(countdown / 5) * 100}%` }}
          transition={{ duration: 0.5 }}
        >
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
        </motion.div>
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
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Box sx={{
              width: 50,
              height: 50,
              borderRadius: 3,
              background: `linear-gradient(135deg, ${currentScheme.colors.primary} 0%, ${currentScheme.colors.secondary} 100%)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 0 20px ${currentScheme.colors.primary}40`
            }}>
              <Psychology sx={{ fontSize: 28, color: 'white' }} />
            </Box>
          </motion.div>
          <Box>
            <Typography variant="h5" fontWeight="bold">
              🚀 Welcome to Quantum AI Analytics
            </Typography>
            <Typography variant="body2" color={currentScheme.colors.text.secondary}>
              Powered by advanced machine learning
            </Typography>
          </Box>
        </Box>
        <Chip
          label={`Auto-closes in ${countdown}s`}
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
          sx={{ mb: 3, background: `${currentScheme.colors.primary}10` }}
        >
          This is a one-time welcome message. You won't see this again.
        </Alert>

        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom fontWeight="medium" display="flex" alignItems="center" gap={1}>
            <AutoAwesome /> What You Can Do:
          </Typography>
          <Box component="ul" sx={{ pl: 2, m: 0 }}>
            {[
              "🤖 Ask AI questions about your data",
              "📊 Get real-time predictions and forecasts",
              "🚨 Receive automated anomaly alerts",
              "💡 Get AI-powered business insights",
              "🎯 Run what-if scenario simulations",
              "📈 Create interactive visualizations"
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
          <Typography variant="subtitle2" gutterBottom>
            ⚠️ Important Information
          </Typography>
          <Typography variant="body2">
            • AI predictions are based on available data and may have confidence intervals
            <br />
            • Ensure your data is up-to-date for accurate forecasts
            <br />
            • Review insights before implementing major business decisions
            <br />
            • Contact support if you notice unusual patterns
          </Typography>
        </Alert>

        <Box sx={{ 
          p: 2, 
          borderRadius: 2, 
          background: `${currentScheme.colors.buttons.success}10`,
          border: `1px solid ${currentScheme.colors.buttons.success}30`
        }}>
          <Typography variant="subtitle2" gutterBottom display="flex" alignItems="center" gap={1}>
            <Shield /> Your Data is Secure
          </Typography>
          <Typography variant="body2" color={currentScheme.colors.text.secondary}>
            All data processing happens on secure servers. We use industry-standard encryption
            and never share your data with third parties.
          </Typography>
        </Box>
      </DialogContent>

      {/* Actions */}
      <DialogActions sx={{ p: 3, pt: 0, justifyContent: 'space-between' }}>
        <Button
          onClick={handleClose}
          variant="outlined"
          startIcon={<Close />}
        >
          Close Now
        </Button>
        <Box display="flex" gap={1}>
          <Button
            onClick={handleCustomize}
            variant="outlined"
            sx={{ minWidth: 120 }}
          >
            Customize
          </Button>
          <Button
            onClick={handleAcceptAll}
            variant="contained"
            startIcon={<CheckCircle />}
            sx={{
              background: `linear-gradient(135deg, ${currentScheme.colors.primary} 0%, ${currentScheme.colors.secondary} 100%)`,
              minWidth: 140,
            }}
          >
            Get Started
          </Button>
        </Box>
      </DialogActions>

      {/* Footer Note */}
      <Box sx={{ 
        p: 2, 
        textAlign: 'center',
        borderTop: `1px solid ${currentScheme.colors.components.border}`,
        background: currentScheme.colors.background
      }}>
        <Typography variant="caption" color={currentScheme.colors.text.secondary}>
          Powered by Quantum AI Engine v2.4 • For assistance, visit our help center
        </Typography>
      </Box>
    </Dialog>
  )
}

export default AIWelcomeDialog