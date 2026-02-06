// @/components/global/AIConsentDialog.tsx
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
  Paper,
} from '@mui/material'
import {
  Warning,
  CheckCircle,
  Close,
  Info,
  Psychology,
  AutoAwesome,
  Shield,
  Cookie,
} from '@mui/icons-material'
import { useAdvanceThemeContext } from '@/contexts/AdvanceThemeContexts'

const AIConsentDialog = () => {
  const { currentScheme } = useAdvanceThemeContext()
  const [open, setOpen] = useState(false)
  const [countdown, setCountdown] = useState(5)
  const [isCountdownActive, setIsCountdownActive] = useState(true)

  useEffect(() => {
    // Check localStorage on client side only
    if (typeof window === 'undefined') return
    
    const hasGivenConsent = localStorage.getItem('aiConsentGiven')
    
    if (!hasGivenConsent) {
      // Show after 1 second to ensure page loads
      const timer = setTimeout(() => {
        setOpen(true)
      }, 1000)
      
      return () => clearTimeout(timer)
    }
  }, [])

  // Countdown timer
  useEffect(() => {
    let interval: NodeJS.Timeout
    
    if (open && isCountdownActive && countdown > 0) {
      interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            setIsCountdownActive(false) // Stop countdown, show buttons
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [open, isCountdownActive, countdown])

  const handleAccept = () => {
    localStorage.setItem('aiConsentGiven', 'true')
    localStorage.setItem('aiPredictionsEnabled', 'true')
    localStorage.setItem('aiAnalyticsEnabled', 'true')
    setOpen(false)
  }

  const handleDecline = () => {
    localStorage.setItem('aiConsentGiven', 'true')
    localStorage.setItem('aiPredictionsEnabled', 'false')
    localStorage.setItem('aiAnalyticsEnabled', 'false')
    setOpen(false)
  }

  const handleClose = () => {
    // If user tries to close before countdown, treat as decline
    if (isCountdownActive) {
      handleDecline()
    } else {
      // If after countdown, user must choose
      return
    }
  }

  if (!open) return null

  return (
    <Dialog
      open={open}
      onClose={isCountdownActive ? handleClose : undefined}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          overflow: 'hidden',
          position: 'relative',
          background: currentScheme.colors.components.card,
          border: `2px solid ${currentScheme.colors.primary}40`,
          boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
        }
      }}
    >
      {/* Cookie Icon */}
      <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
        <Cookie sx={{ color: currentScheme.colors.primary, fontSize: 24 }} />
      </Box>

      {/* Countdown Bar */}
      {isCountdownActive && (
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
      )}

      {/* Header */}
      <DialogTitle sx={{ 
        p: 3, 
        pb: 2,
        background: `linear-gradient(135deg, ${currentScheme.colors.primary}10 0%, ${currentScheme.colors.secondary}10 100%)`,
        borderBottom: `1px solid ${currentScheme.colors.components.border}`,
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
              AI Analytics Consent
            </Typography>
            <Typography variant="body2" color={currentScheme.colors.text.secondary}>
              We use AI to enhance your experience
            </Typography>
          </Box>
        </Box>
      </DialogTitle>

      {/* Content */}
      <DialogContent sx={{ p: 3 }}>
        <Alert 
          severity="info" 
          icon={<Info />}
          sx={{ mb: 3, borderRadius: 2 }}
        >
          <Typography variant="body2" fontWeight="medium">
            This dialog appears only once. Please review and choose your preferences.
          </Typography>
        </Alert>

        {/* Countdown Message */}
        {isCountdownActive ? (
          <Paper 
            elevation={0}
            sx={{ 
              p: 3, 
              mb: 3, 
              textAlign: 'center',
              background: `${currentScheme.colors.primary}10`,
              border: `1px solid ${currentScheme.colors.primary}20`,
              borderRadius: 2,
            }}
          >
            <Typography variant="h6" gutterBottom>
              ⏳ Please wait {countdown} second{countdown !== 1 ? 's' : ''}...
            </Typography>
            <Typography variant="body2" color={currentScheme.colors.text.secondary}>
              Reading important information before you can proceed
            </Typography>
            <Chip
              label={`${countdown}s remaining`}
              color="primary"
              sx={{ mt: 2 }}
            />
          </Paper>
        ) : (
          <Paper 
            elevation={0}
            sx={{ 
              p: 3, 
              mb: 3,
              background: `${currentScheme.colors.buttons.success}10`,
              border: `1px solid ${currentScheme.colors.buttons.success}20`,
              borderRadius: 2,
            }}
          >
            <Typography variant="h6" gutterBottom display="flex" alignItems="center" gap={1}>
              ✅ Ready to proceed
            </Typography>
            <Typography variant="body2">
              Please choose your AI analytics preferences below
            </Typography>
          </Paper>
        )}

        {/* Features List */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" fontWeight="medium" gutterBottom display="flex" alignItems="center" gap={1}>
            <AutoAwesome /> What AI Can Do:
          </Typography>
          <Box component="ul" sx={{ pl: 2, m: 0 }}>
            {[
              "Analyze your business data for insights",
              "Predict customer behavior and trends",
              "Generate automated reports",
              "Provide personalized recommendations",
              "Detect anomalies and risks"
            ].map((item, index) => (
              <Box component="li" key={index} sx={{ typography: 'body2', mb: 1, pl: 1 }}>
                {item}
              </Box>
            ))}
          </Box>
        </Box>

        {/* Warning */}
        <Alert 
          severity="warning" 
          icon={<Warning />}
          sx={{ mb: 3, borderRadius: 2 }}
        >
          <Typography variant="body2">
            <strong>Important:</strong> AI predictions are based on your data patterns. 
            For optimal results, ensure your data is accurate and up-to-date.
          </Typography>
        </Alert>

        {/* Privacy Info */}
        <Paper 
          elevation={0}
          sx={{ 
            p: 2, 
            borderRadius: 2, 
            background: `${currentScheme.colors.primary}05`,
            border: `1px solid ${currentScheme.colors.components.border}`,
          }}
        >
          <Typography variant="body2" color={currentScheme.colors.text.secondary} display="flex" alignItems="flex-start" gap={1}>
            <Shield sx={{ fontSize: 16, mt: 0.2 }} />
            <span>
              <strong>Your data is secure:</strong> We use encryption and never share 
              your business data with third parties. You can change these settings anytime.
            </span>
          </Typography>
        </Paper>
      </DialogContent>

      {/* Actions - Show different states */}
      <DialogActions sx={{ 
        p: 3, 
        pt: 0,
        borderTop: `1px solid ${currentScheme.colors.components.border}`,
        justifyContent: isCountdownActive ? 'center' : 'space-between'
      }}>
        {isCountdownActive ? (
          <Box textAlign="center">
            <Typography variant="body2" color={currentScheme.colors.text.secondary}>
              ⏳ Please wait to make your choice...
            </Typography>
            <Typography variant="caption" color={currentScheme.colors.text.secondary}>
              This ensures you read the important information
            </Typography>
          </Box>
        ) : (
          <>
            <Button
              onClick={handleDecline}
              variant="outlined"
              color="error"
              startIcon={<Close />}
              sx={{ minWidth: 120 }}
            >
              Decline
            </Button>
            <Button
              onClick={handleAccept}
              variant="contained"
              color="primary"
              startIcon={<CheckCircle />}
              sx={{
                background: `linear-gradient(135deg, ${currentScheme.colors.primary} 0%, ${currentScheme.colors.secondary} 100%)`,
                minWidth: 120,
              }}
            >
              Accept & Continue
            </Button>
          </>
        )}
      </DialogActions>

      {/* Footer */}
      <Box sx={{ 
        p: 2, 
        textAlign: 'center',
        borderTop: `1px solid ${currentScheme.colors.components.border}`,
        background: currentScheme.colors.background
      }}>
        <Typography variant="caption" color={currentScheme.colors.text.secondary}>
          Required for AI Analytics features • You can change preferences in Settings
        </Typography>
      </Box>
    </Dialog>
  )
}

export default AIConsentDialog