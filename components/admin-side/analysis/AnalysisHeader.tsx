// components/admin-side/analysis/AnalysisHeader.tsx
import { Box, Typography, Button, FormControl, InputLabel, Select, MenuItem, alpha } from '@mui/material'
import { Analytics, Refresh } from '@mui/icons-material'
import { useTheme } from '@mui/material/styles'

interface AnalysisHeaderProps {
  timeframe: string
  onTimeframeChange: (value: string) => void
  onRefresh: () => void
  loading: boolean
  error?: string
  onErrorClose?: () => void
}

export const AnalysisHeader = ({
  timeframe,
  onTimeframeChange,
  onRefresh,
  loading,
  error
}: AnalysisHeaderProps) => {
  const theme = useTheme()

  return (
    <Box sx={{ mb: { xs: 3, md: 4 } }}>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' }, 
        justifyContent: 'space-between', 
        alignItems: { xs: 'flex-start', sm: 'center' }, 
        gap: 2, 
        mb: 3 
      }}>
        <Box>
          <Typography 
            variant="h4" 
            fontWeight="bold" 
            gutterBottom 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 2,
              fontSize: { xs: '1.75rem', md: '2.125rem' }
            }}
          >
            <Box sx={{
              width: { xs: 44, md: 56 },
              height: { xs: 44, md: 56 },
              borderRadius: 3,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
              color: 'white'
            }}>
              <Analytics sx={{ fontSize: { xs: 24, md: 30 } }} />
            </Box>
            Admin Analytics Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Monitor user engagement and platform usage
          </Typography>
        </Box>
        
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' }, 
          alignItems: { xs: 'stretch', sm: 'center' }, 
          gap: 2,
          width: { xs: '100%', sm: 'auto' }
        }}>
          <FormControl size="small" sx={{ minWidth: { xs: '100%', sm: 150 } }}>
            <InputLabel>Timeframe</InputLabel>
            <Select
              value={timeframe}
              label="Timeframe"
              onChange={(e) => onTimeframeChange(e.target.value)}
            >
              <MenuItem value="7">Last 7 days</MenuItem>
              <MenuItem value="30">Last 30 days</MenuItem>
              <MenuItem value="90">Last 90 days</MenuItem>
              <MenuItem value="180">Last 6 months</MenuItem>
              <MenuItem value="365">Last year</MenuItem>
            </Select>
          </FormControl>
          
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={onRefresh}
            disabled={loading}
            fullWidth={window.innerWidth < 600}
            sx={{
              borderRadius: 2,
              borderWidth: 2,
              '&:hover': {
                borderWidth: 2
              }
            }}
          >
            Refresh Data
          </Button>
        </Box>
      </Box>
    </Box>
  )
}