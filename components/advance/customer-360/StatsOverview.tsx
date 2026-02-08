import { Box } from '@mui/material'
import StatCard from './components/StatCard'
import { Person, Star, AttachMoney, WorkspacePremium } from '@mui/icons-material'

interface StatsOverviewProps {
  customers: any[]
  currentColors: any
  isMobile: boolean
  primaryColor: string
  alpha: any
}

export default function StatsOverview({
  customers,
  currentColors,
  isMobile,
  primaryColor,
  alpha
}: StatsOverviewProps) {
  const stats = [
    {
      title: "Total Customers",
      value: customers.length.toString(),
      icon: <Person />,
      color: primaryColor,
    },
    {
      title: "Loyal Customers",
      value: customers.filter(
        (c) =>
          c.loyaltyLevel === "gold" ||
          c.loyaltyLevel === "platinum" ||
          c.loyaltyLevel === "diamond",
      ).length.toString(),
      icon: <Star />,
      color: primaryColor,
    },
    {
      title: "Total Revenue",
      value: `₹${customers
        .reduce((sum, c) => sum + (c.totalSpent || 0), 0)
        .toLocaleString("en-IN", {
          maximumFractionDigits: 0,
          notation: 'compact'
        })}`,
      icon: <AttachMoney />,
      color: primaryColor,
    },
    {
      title: "VIP Customers",
      value: customers.filter((c) => c.lifecycleStage === "vip").length.toString(),
      icon: <WorkspacePremium />,
      color: primaryColor,
    },
  ]

  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 2,
        mb: 3,
      }}
    >
      {stats.map((stat, index) => (
        <StatCard
          key={index}
          title={stat.title}
          value={stat.value}
          icon={stat.icon}
          color={stat.color}
          currentColors={currentColors}
          isMobile={isMobile}
          alpha={alpha}
        />
      ))}
    </Box>
  )
}