import { Box, Typography, Button, Breadcrumbs } from '@mui/material'
import { Person, PersonAdd, Home, Refresh, Add } from '@mui/icons-material'
import Link from 'next/link'

interface Customer360HeaderProps {
  currentColors: any
  isMobile: boolean
  googleColors: any
  mode: string
  onRefresh: () => void
  loading: boolean
  onInitialize: () => void
  initializing: boolean
  customersCount: number
}

export default function Customer360Header({
  currentColors,
  isMobile,
  googleColors,
  mode,
  onRefresh,
  loading,
  onInitialize,
  initializing,
  customersCount
}: Customer360HeaderProps) {
  const primaryColor = googleColors.blue
  const accentColor = googleColors.yellow // Yellow for add button

  return (
    <Box sx={{ mb: isMobile ? 2 : 3 }}>
      <Breadcrumbs sx={{ 
        mb: 1, 
        color: currentColors.textSecondary,
        fontSize: isMobile ? '0.75rem' : '0.875rem'
      }}>
        <Box
          component={Link}
          href="/dashboard"
          sx={{
            display: "flex",
            alignItems: "center",
            textDecoration: "none",
            color: currentColors.textSecondary,
            fontSize: isMobile ? '0.75rem' : '0.875rem',
            "&:hover": { color: primaryColor },
          }}
        >
          <Home sx={{ mr: 0.5, fontSize: isMobile ? 16 : 20 }} />
          Dashboard
        </Box>
        <Typography color={currentColors.textPrimary} fontSize={isMobile ? '0.75rem' : '0.875rem'}>
          Customer 360°
        </Typography>
      </Breadcrumbs>

      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        mb={2}
        flexDirection={isMobile ? "column" : "row"}
        gap={isMobile ? 2 : 0}
      >
        <Box display="flex" alignItems="center" gap={isMobile ? 1 : 2}>
          <Box
            sx={{
              width: isMobile ? 48 : 60,
              height: isMobile ? 48 : 60,
              borderRadius: isMobile ? 2 : 3,
              background: accentColor,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: mode === 'dark' 
                ? `0 2px 8px ${accentColor}80` 
                : `0 2px 8px ${accentColor}40`,
            }}
          >
            <Person sx={{ 
              fontSize: isMobile ? 24 : 32, 
              color: "white" 
            }} />
          </Box>
          <Box>
            <Typography 
              variant={isMobile ? "h5" : "h4"} 
              fontWeight="bold"
              fontSize={isMobile ? '1.25rem' : '1.5rem'}
            >
              👥 Customer 360°
            </Typography>
            <Typography
              variant="body2"
              color={currentColors.textSecondary}
              fontSize={isMobile ? '0.75rem' : '0.875rem'}
            >
              Complete customer profiles
            </Typography>
          </Box>
        </Box>

        <Box sx={{ 
          display: "flex", 
          gap: 1, 
          flexWrap: 'wrap',
          justifyContent: isMobile ? 'center' : 'flex-end'
        }}>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={onRefresh}
            disabled={loading}
            sx={{
              border: `1px solid ${currentColors.border}`,
              color: currentColors.textPrimary,
              borderRadius: '6px',
              textTransform: 'none',
              fontWeight: 500,
              fontSize: isMobile ? '0.75rem' : '0.875rem',
              px: isMobile ? 1 : 2,
              minWidth: 'auto',
              '&:hover': {
                borderColor: primaryColor,
                backgroundColor: currentColors.hover,
              }
            }}
          >
            {isMobile ? '' : 'Refresh'}
          </Button>

          {customersCount === 0 && (
            <Button
              variant="contained"
              startIcon={<PersonAdd />}
              onClick={onInitialize}
              disabled={initializing}
              sx={{
                background: primaryColor,
                color: 'white',
                borderRadius: '6px',
                textTransform: 'none',
                fontWeight: 500,
                fontSize: isMobile ? '0.75rem' : '0.875rem',
                px: isMobile ? 1 : 2,
                minWidth: 'auto',
                boxShadow: mode === 'dark' 
                  ? `0 2px 4px ${primaryColor}80` 
                  : `0 1px 2px 0 rgba(60,64,67,0.3), 0 1px 3px 1px rgba(60,64,67,0.15)`,
                '&:hover': {
                  background: '#3367D6',
                  boxShadow: `0 2px 4px ${primaryColor}80`,
                },
              }}
            >
              {initializing ? (isMobile ? '...' : 'Initializing...') : (isMobile ? 'Init' : 'Initialize')}
            </Button>
          )}

          <Button
            variant="contained"
            startIcon={<Add sx={{fontWeight:900}}/>}
            sx={{
              background: accentColor,
              color: currentColors.textPrimary,
              borderRadius: '6px',
              textTransform: 'none',
              fontWeight: 700,
              fontSize: isMobile ? '0.75rem' : '0.875rem',
              px: isMobile ? 1 : 2,
              minWidth: 'auto',
              boxShadow: mode === 'dark' 
                ? `0 2px 4px ${accentColor}80` 
                : `0 1px 2px 0 rgba(60,64,67,0.3), 0 1px 3px 1px rgba(60,64,67,0.15)`,
              '&:hover': {
                background: '#E6AC00',
                boxShadow: `0 2px 4px ${accentColor}80`,
              },
            }}
          >
            {isMobile ? 'Add' : 'Add Customer'}
          </Button>
        </Box>
      </Box>
    </Box>
  )
}