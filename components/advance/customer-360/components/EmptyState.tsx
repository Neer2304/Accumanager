import { Box, Typography, Button, CircularProgress } from '@mui/material'
import { Person, PersonAdd } from '@mui/icons-material'

interface EmptyStateProps {
  loading: boolean
  search: string
  onInitialize: () => void
  initializing: boolean
  currentColors: any
  isMobile: boolean
}

export default function EmptyState({
  loading,
  search,
  onInitialize,
  initializing,
  currentColors,
  isMobile
}: EmptyStateProps) {
  return (
    <Box sx={{ textAlign: "center" }}>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Person
            sx={{
              fontSize: isMobile ? 32 : 48,
              color: currentColors.textSecondary,
              mb: 1,
              opacity: 0.5,
            }}
          />
          <Typography
            variant={isMobile ? "body1" : "h6"}
            color={currentColors.textSecondary}
            gutterBottom
          >
            {search ? "No matching customers found" : "No customers found"}
          </Typography>
          <Typography
            variant="body2"
            color={currentColors.textSecondary}
            sx={{ mb: 2 }}
          >
            {search
              ? "Try a different search term"
              : "Get started by initializing customer profiles"}
          </Typography>
          {!search && (
            <Button
              variant="contained"
              startIcon={<PersonAdd />}
              onClick={onInitialize}
              disabled={initializing}
              size={isMobile ? "small" : "medium"}
              sx={{
                background: '#4285F4',
                color: 'white',
                borderRadius: '6px',
                textTransform: 'none',
                fontWeight: 500,
                fontSize: isMobile ? '0.75rem' : '0.875rem',
              }}
            >
              {initializing
                ? "Initializing..."
                : "Initialize Profiles"}
            </Button>
          )}
        </>
      )}
    </Box>
  )
}