import { Box, Typography, Button, Tabs, Tab } from '@mui/material'
import { Refresh, Download, Settings } from '@mui/icons-material'

interface DashboardHeaderProps {
  title: string
  subtitle: string
  currentColors: any
  googleColors: any
  mode: string
  onRefresh: () => void
  timeRange: string
  setTimeRange: (value: string) => void
}

export default function DashboardHeader({
  title,
  subtitle,
  currentColors,
  googleColors,
  mode,
  onRefresh,
  timeRange,
  setTimeRange
}: DashboardHeaderProps) {
  return (
    <Box sx={{ mb: 4 }}>
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        flexWrap: 'wrap', 
        gap: 2,
        mb: 3 
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box
            sx={{
              width: 60,
              height: 60,
              borderRadius: 3,
              background: googleColors.red,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: mode === 'dark' 
                ? `0 2px 8px ${googleColors.red}80` 
                : `0 2px 8px ${googleColors.red}40`,
            }}
          >
            <Box sx={{ fontSize: 32, color: 'white', fontWeight: 'bold' }}>
              ⚡
            </Box>
          </Box>
          <Box>
            <Typography variant="h4" fontWeight="bold" color={currentColors.textPrimary}>
              {title}
            </Typography>
            <Typography variant="body1" color={currentColors.textSecondary}>
              {subtitle}
            </Typography>
          </Box>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={onRefresh}
            sx={{
              border: `1px solid ${currentColors.border}`,
              color: currentColors.textPrimary,
              borderRadius: '8px',
              textTransform: 'none',
              fontWeight: 500,
              '&:hover': {
                borderColor: googleColors.blue,
                backgroundColor: currentColors.hover,
              }
            }}
          >
            Refresh
          </Button>
          <Button
            variant="outlined"
            startIcon={<Download />}
            sx={{
              border: `1px solid ${currentColors.border}`,
              color: currentColors.textPrimary,
              borderRadius: '8px',
              textTransform: 'none',
              fontWeight: 500,
              '&:hover': {
                borderColor: googleColors.green,
                backgroundColor: currentColors.hover,
              }
            }}
          >
            Export
          </Button>
          <Button
            variant="contained"
            startIcon={<Settings />}
            sx={{
              background: googleColors.red,
              color: 'white',
              borderRadius: '8px',
              textTransform: 'none',
              fontWeight: 500,
              boxShadow: mode === 'dark' 
                ? `0 2px 4px ${googleColors.red}80` 
                : `0 1px 2px 0 rgba(60,64,67,0.3), 0 1px 3px 1px rgba(60,64,67,0.15)`,
              '&:hover': {
                background: '#D32F2F',
                boxShadow: `0 4px 12px ${googleColors.red}40`,
              },
            }}
          >
            Settings
          </Button>
        </Box>
      </Box>

      {/* Time Range Selector */}
      <Box sx={{ mt: 3 }}>
        <Tabs 
          value={timeRange} 
          onChange={(_, newValue) => setTimeRange(newValue)}
          sx={{
            borderBottom: `1px solid ${currentColors.border}`,
            '& .MuiTab-root': {
              color: currentColors.textSecondary,
              minHeight: 36,
              textTransform: 'none',
              fontSize: '0.875rem',
              fontWeight: 500,
            },
            '& .Mui-selected': {
              color: googleColors.red,
              fontWeight: 600,
            },
            '& .MuiTabs-indicator': {
              backgroundColor: googleColors.red,
              height: 3,
              borderRadius: '3px 3px 0 0',
            },
          }}
        >
          <Tab label="Today" value="today" />
          <Tab label="Weekly" value="weekly" />
          <Tab label="Monthly" value="monthly" />
          <Tab label="Quarterly" value="quarterly" />
          <Tab label="Yearly" value="yearly" />
        </Tabs>
      </Box>
    </Box>
  )
}