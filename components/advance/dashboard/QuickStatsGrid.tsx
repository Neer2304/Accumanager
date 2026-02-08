import { Box } from '@mui/material'
import MetricCard from './components/MetricCard'

interface QuickStatsGridProps {
  stats: any[]
  currentColors: any
  googleColors: any
}

export default function QuickStatsGrid({
  stats,
  currentColors,
  googleColors
}: QuickStatsGridProps) {
  return (
    <Box sx={{ 
      display: 'flex', 
      flexWrap: 'wrap', 
      gap: 3, 
      mb: 4 
    }}>
      {stats.map((stat: any, index: number) => (
        <Box
          key={index}
          sx={{
            flex: '1 1 calc(25% - 36px)',
            minWidth: '220px',
          }}
        >
          <MetricCard
            title={stat.title}
            value={stat.value}
            change={stat.change}
            icon={stat.icon}
            color={getCardColor(index, googleColors)}
            currentColors={currentColors}
          />
        </Box>
      ))}
    </Box>
  )
}

function getCardColor(index: number, googleColors: any) {
  const colors = [
    googleColors.blue,
    googleColors.green,
    googleColors.yellow,
    googleColors.red
  ]
  return colors[index % colors.length]
}