// components/admin-side/analysis/OverviewCards.tsx - UPDATED SUPER RESPONSIVE
import { Box } from '@mui/material'
import { 
  People, 
  Person, 
  Notes, 
  Inventory, 
  AttachMoney, 
  Equalizer,
  CheckCircle,
  Warning
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
      {/* Main Stats Cards - Responsive Flex Layout */}
      <Box 
        sx={{ 
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: { xs: 1.5, sm: 2, md: 3 },
          mb: { xs: 3, sm: 4 },
          justifyContent: 'center'
        }}
      >
        {cards.map((card, index) => (
          <Box 
            key={index}
            sx={{ 
              flex: {
                xs: '1 1 calc(50% - 12px)',  // 2 per row on mobile
                sm: '1 1 calc(33.333% - 16px)', // 3 per row on tablet
                md: '1 1 calc(25% - 18px)', // 4 per row on medium
                lg: '1 1 calc(16.666% - 20px)' // 6 per row on large
              },
              minWidth: {
                xs: 'calc(50% - 12px)',
                sm: 'calc(33.333% - 16px)',
                md: 'calc(25% - 18px)',
                lg: 'calc(16.666% - 20px)'
              },
              maxWidth: {
                xs: 'calc(50% - 12px)',
                sm: 'calc(33.333% - 16px)',
                md: 'calc(25% - 18px)',
                lg: 'calc(16.666% - 20px)'
              }
            }}
          >
            <StatsCard
              title={card.title}
              value={card.value}
              subValue={card.subValue}
              icon={card.icon}
              color={card.color}
              trend={card.trend}
              showTrend={card.showTrend}
              showProgress={card.showProgress}
            />
          </Box>
        ))}
      </Box>

      {/* Stock Status Cards - Only show if materials data exists */}
      {materialsData && (
        <Box 
          sx={{ 
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: { xs: 1.5, sm: 2, md: 3 },
            mb: { xs: 3, sm: 4 },
            justifyContent: 'center'
          }}
        >
          {stockStatusCards.map((card, index) => (
            <Box 
              key={index}
              sx={{ 
                flex: {
                  xs: '1 1 calc(50% - 12px)',  // 2 per row on mobile
                  sm: '1 1 calc(50% - 16px)',   // 2 per row on tablet
                  md: '1 1 calc(25% - 18px)'    // 4 per row on desktop
                },
                minWidth: {
                  xs: 'calc(50% - 12px)',
                  sm: 'calc(50% - 16px)',
                  md: 'calc(25% - 18px)'
                },
                maxWidth: {
                  xs: 'calc(50% - 12px)',
                  sm: 'calc(50% - 16px)',
                  md: 'calc(25% - 18px)'
                }
              }}
            >
              <StatsCard
                title={card.title}
                value={card.value}
                icon={card.icon}
                color={card.color}
                compact
              />
            </Box>
          ))}
        </Box>
      )}
    </>
  )
}