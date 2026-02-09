import { Card, CardContent, CardProps } from '@mui/material'

interface AdminCardProps extends CardProps {
  children: React.ReactNode
}

export default function AdminCard({ children, ...props }: AdminCardProps) {
  return (
    <Card 
      variant="outlined"
      sx={{ 
        borderRadius: 2,
        borderColor: 'divider',
        ...props.sx 
      }}
      {...props}
    >
      <CardContent sx={{ p: 3 }}>
        {children}
      </CardContent>
    </Card>
  )
}