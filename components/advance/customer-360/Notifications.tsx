import { Snackbar, Alert } from '@mui/material'

interface NotificationsProps {
  error: string | null
  setError: (error: string | null) => void
  success: string | null
  setSuccess: (success: string | null) => void
  isMobile: boolean
}

export default function Notifications({
  error,
  setError,
  success,
  setSuccess,
  isMobile
}: NotificationsProps) {
  return (
    <>
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        anchorOrigin={{ 
          vertical: isMobile ? "top" : "bottom", 
          horizontal: "center" 
        }}
      >
        <Alert
          onClose={() => setError(null)}
          severity="error"
          sx={{ 
            width: '100%',
            fontSize: isMobile ? '0.875rem' : '1rem'
          }}
        >
          {error}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!success}
        autoHideDuration={3000}
        onClose={() => setSuccess(null)}
        anchorOrigin={{ 
          vertical: isMobile ? "top" : "bottom", 
          horizontal: "center" 
        }}
      >
        <Alert
          onClose={() => setSuccess(null)}
          severity="success"
          sx={{ 
            width: '100%',
            fontSize: isMobile ? '0.875rem' : '1rem'
          }}
        >
          {success}
        </Alert>
      </Snackbar>
    </>
  )
}