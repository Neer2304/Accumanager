import { ListItem, ListItemIcon, ListItemText } from '@mui/material'

interface StatusItemProps {
  icon: React.ReactNode
  title: string
  status: string
  statusColor: string
  currentColors: any
}

export default function StatusItem({
  icon,
  title,
  status,
  statusColor,
  currentColors
}: StatusItemProps) {
  return (
    <ListItem disablePadding sx={{ mb: 2 }}>
      <ListItemIcon sx={{ minWidth: 40 }}>
        {icon}
      </ListItemIcon>
      <ListItemText 
        primary={title} 
        secondary={status} 
        primaryTypographyProps={{ 
          fontSize: '0.9rem',
          color: currentColors.textPrimary
        }}
        secondaryTypographyProps={{ 
          fontSize: '0.8rem',
          color: statusColor,
          fontWeight: 500
        }}
      />
    </ListItem>
  )
}