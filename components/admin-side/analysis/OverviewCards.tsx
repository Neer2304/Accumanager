// components/admin-side/analysis/OverviewCards.tsx
import { Box } from '@mui/material'
import { 
  People, 
  Person, 
  Notes, 
  Inventory, 
  AttachMoney, 
  Equalizer,
  TrendingUp,
  Warning,
  CheckCircle
} from '@mui/icons-material'
import { StatsCard } from './StatsCard'
import { AnalysisData, MaterialsAnalysisData } from '../types'

interface OverviewCardsProps {
  data: AnalysisData | null
  materialsData: MaterialsAnalysisData | null
}

export const OverviewCards = ({ data, materialsData }: OverviewCardsProps) => {
  const cards = [
    {
      title: 'Total Users',
      value: data?.systemOverview?.databaseStats?.totalUsers || 0,
      icon: People,
      color: 'primary' as const,
      trend: data?.summary?.growthRate || 0,
      showTrend: true
    },
    {
      title: 'Active Users',
      value: data?.systemOverview?.databaseStats?.activeUsers || 0,
      subValue: `${data?.summary?.activeUserPercentage || 0}%`,
      icon: Person,
      color: 'secondary' as const
    },
    {
      title: 'Total Notes',
      value: data?.systemOverview?.databaseStats?.totalNotes || 0,
      icon: Notes,
      color: 'success' as const,
      showTrend: true
    },
    {
      title: 'Total Materials',
      value: materialsData?.summary?.totalMaterials || 0,
      subValue: `${materialsData?.summary?.recentMaterials || 0} recent`,
      icon: Inventory,
      color: 'warning' as const,
      trend: materialsData?.summary?.materialGrowthRate || 0,
      showTrend: true
    },
    {
      title: 'Stock Value',
      value: `₹${(materialsData?.summary?.totalStockValue || 0).toLocaleString()}`,
      icon: AttachMoney,
      color: 'info' as const
    },
    {
      title: 'Engagement Score',
      value: data?.summary?.engagementScore || 0,
      subValue: '/100',
      icon: Equalizer,
      color: 'error' as const,
      showProgress: true
    }
  ]

  const stockStatusCards = [
    {
      title: 'In Stock Items',
      value: materialsData?.summary ? 
        materialsData.summary.totalMaterials - materialsData.summary.lowStockItems - materialsData.summary.outOfStockItems 
        : 0,
      icon: CheckCircle,
      color: 'success' as const
    },
    {
      title: 'Low Stock',
      value: materialsData?.summary?.lowStockItems || 0,
      icon: Warning,
      color: 'warning' as const
    },
    {
      title: 'Out of Stock',
      value: materialsData?.summary?.outOfStockItems || 0,
      icon: Warning,
      color: 'error' as const
    },
    {
      title: 'Stock Value',
      value: `₹${(materialsData?.summary?.totalStockValue || 0).toLocaleString()}`,
      icon: AttachMoney,
      color: 'info' as const
    }
  ]

  return (
    <>
      {/* Main Stats Cards */}
      <Box 
        sx={{ 
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
            lg: 'repeat(6, 1fr)'
          },
          gap: { xs: 2, md: 3 },
          mb: 4
        }}
      >
        {cards.map((card, index) => (
          <StatsCard
            key={index}
            title={card.title}
            value={card.value}
            subValue={card.subValue}
            icon={card.icon}
            color={card.color}
            trend={card.trend}
            showTrend={card.showTrend}
            showProgress={card.showProgress}
          />
        ))}
      </Box>

      {/* Stock Status Cards - Only show if materials data exists */}
      {materialsData && (
        <Box 
          sx={{ 
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(4, 1fr)'
            },
            gap: { xs: 2, md: 3 },
            mb: 4
          }}
        >
          {stockStatusCards.map((card, index) => (
            <StatsCard
              key={index}
              title={card.title}
              value={card.value}
              icon={card.icon}
              color={card.color}
              compact
            />
          ))}
        </Box>
      )}
    </>
  )
}