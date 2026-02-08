import { Box, Typography, Button, alpha } from '@mui/material'

interface QuickActionButtonProps {
  icon: React.ReactNode
  label: string
  color: string
  currentColors: any
}

export default function QuickActionButton({
  icon,
  label,
  color,
  currentColors
}: QuickActionButtonProps) {
  return (
    <Button
      fullWidth
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 2,
        background: currentColors.surface,
        border: `1px solid ${currentColors.border}`,
        borderRadius: '12px',
        color: currentColors.textPrimary,
        textTransform: 'none',
        '&:hover': {
          background: currentColors.hover,
          borderColor: color,
          transform: 'translateY(-2px)',
          boxShadow: `0 4px 12px ${alpha(color, 0.2)}`,
        },
        transition: 'all 0.2s ease',
      }}
    >
      <Box
        sx={{
          width: 40,
          height: 40,
          borderRadius: '50%',
          background: alpha(color, 0.1),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 1,
          border: `1px solid ${alpha(color, 0.2)}`,
        }}
      >
        <Box sx={{ color: color, fontSize: 20 }}>
          {icon}
        </Box>
      </Box>
      <Typography variant="caption" fontWeight="medium" align="center">
        {label}
      </Typography>
    </Button>
  )
}