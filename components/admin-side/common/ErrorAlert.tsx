// components/admin-side/common/ErrorAlert.tsx
import { Alert, AlertTitle, IconButton } from '@mui/material'
import { Close } from '@mui/icons-material'

interface ErrorAlertProps {
  message: string
  onClose: () => void
}

export const ErrorAlert = ({ message, onClose }: ErrorAlertProps) => {
  return (
    <Alert 
      severity="error" 
      onClose={onClose}
      action={
        <IconButton
          aria-label="close"
          color="inherit"
          size="small"
          onClick={onClose}
        >
          <Close fontSize="inherit" />
        </IconButton>
      }
    >
      <AlertTitle>Error</AlertTitle>
      {message}
    </Alert>
  )
}