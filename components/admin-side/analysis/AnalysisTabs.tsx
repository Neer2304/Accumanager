// components/admin-side/analysis/AnalysisTabs.tsx
import { Paper, Box, Tabs, Tab } from '@mui/material'
import { People, Notes, Inventory, Timeline } from '@mui/icons-material'

interface AnalysisTabsProps {
  activeTab: number
  onTabChange: (value: number) => void
  children: React.ReactNode
}

export const AnalysisTabs = ({ activeTab, onTabChange, children }: AnalysisTabsProps) => {
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    onTabChange(newValue)
  }

  return (
    <Paper 
      elevation={2} 
      sx={{ 
        borderRadius: 3,
        overflow: 'hidden',
        mb: 4
      }}
    >
      <Tabs 
        value={activeTab} 
        onChange={handleChange}
        variant="scrollable"
        scrollButtons="auto"
        sx={{
          borderBottom: 1,
          borderColor: 'divider',
          '& .MuiTab-root': {
            minHeight: 60,
            fontSize: '0.95rem',
            fontWeight: 500,
            textTransform: 'none'
          }
        }}
      >
        <Tab 
          icon={<People />} 
          iconPosition="start" 
          label="User Analysis" 
        />
        <Tab 
          icon={<Notes />} 
          iconPosition="start" 
          label="Notes Analysis" 
        />
        <Tab 
          icon={<Inventory />} 
          iconPosition="start" 
          label="Materials Analysis" 
        />
        <Tab 
          icon={<Timeline />} 
          iconPosition="start" 
          label="Engagement" 
        />
      </Tabs>
      
      <Box sx={{ 
        p: { xs: 2, sm: 3 },
        minHeight: 400
      }}>
        {children}
      </Box>
    </Paper>
  )
}