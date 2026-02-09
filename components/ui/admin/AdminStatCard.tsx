import { Card, CardContent, Typography, Box, SxProps } from '@mui/material'

interface AdminStatCardProps {
  title: string
  value: string | number
  icon?: React.ReactNode
  color?: string
  sx?: SxProps
}

export default function AdminStatCard({ title, value, icon, color, sx }: AdminStatCardProps) {
  return (
    <Card
      variant="outlined"
      sx={{
        borderRadius: 3,
        borderColor: 'divider',
        flex: 1,
        minWidth: 200,
        ...sx,
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Typography 
          color="text.secondary" 
          variant="body2" 
          fontWeight={500}
          gutterBottom
        >
          {title}
        </Typography>
        <Box display="flex" alignItems="center" gap={1}>
          {icon}
          <Typography 
            variant="h4" 
            fontWeight={600}
            color={color}
          >
            {value}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  )
}