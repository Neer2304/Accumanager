import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogProps,
  Typography,
  IconButton,
} from '@mui/material'
import { Close } from '@mui/icons-material'

interface AdminDialogProps extends DialogProps {
  title: string
  actions?: React.ReactNode
  children: React.ReactNode
  onClose: () => void
}

export default function AdminDialog({ 
  title, 
  actions, 
  children, 
  onClose, 
  ...props 
}: AdminDialogProps) {
  return (
    <Dialog
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: 3,
          minWidth: 500,
        }
      }}
      {...props}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        borderBottom: '1px solid',
        borderColor: 'divider',
        pb: 2,
      }}>
        <Typography variant="h6" fontWeight={600}>
          {title}
        </Typography>
        <IconButton onClick={onClose} size="small">
          <Close />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ p: 3 }}>
        {children}
      </DialogContent>
      
      {actions && (
        <DialogActions sx={{ 
          borderTop: '1px solid',
          borderColor: 'divider',
          p: 2,
        }}>
          {actions}
        </DialogActions>
      )}
    </Dialog>
  )
}