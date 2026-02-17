// components/googleadminanalysis/GoogleAnalysisStats.tsx
'use client'

import React from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  alpha,
  LinearProgress,
} from '@mui/material'
import {
  People,
  Person,
  Notes,
  Inventory,
  AttachMoney,
  Equalizer,
  TrendingUp,
  CheckCircle,
  Warning,
} from '@mui/icons-material'
import { StatsCardProps } from './types'

export const StatsCard = ({
  title,
  value,
  subValue,
  icon: Icon,
  color,
  trend = 0,
  showTrend = false,
  showProgress = false,
  compact = false,
  darkMode = false,
}: StatsCardProps) => {
  const colorMap = {
    primary: { main: '#1a73e8', light: '#8ab4f8' },
    secondary: { main: '#8ab4f8', light: '#aecbfa' },
    success: { main: '#34a853', light: '#81c995' },
    warning: { main: '#fbbc04', light: '#fdd663' },
    error: { main: '#ea4335', light: '#f28b82' },
    info: { main: '#5f6368', light: '#9aa0a6' },
  }

  const getColor = (colorType: typeof color) => {
    return darkMode ? colorMap[colorType].light : colorMap[colorType].main
  }

  const getTrendColor = (trendValue: number) => {
    return trendValue >= 0 ? '#34a853' : '#ea4335'
  }

  const getTrendIcon = (trendValue: number) => {
    return trendValue >= 0 ? <TrendingUp fontSize="small" /> : <TrendingUp fontSize="small" sx={{ transform: 'rotate(180deg)' }} />
  }

  return (
    <Card 
      elevation={0}
      sx={{ 
        borderRadius: '16px', 
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        position: 'relative',
        height: '100%',
        backgroundColor: darkMode ? '#303134' : '#ffffff',
        border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
        boxShadow: '0 4px 24px rgba(0, 0, 0, 0.05)',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: `0 12px 24px ${alpha(getColor(color), 0.1)}`
        }
      }}
    >
      <Box sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 4,
        background: `linear-gradient(90deg, ${getColor(color)} 0%, ${alpha(getColor(color), 0.7)} 100%)`
      }} />

      <CardContent sx={{ 
        p: compact ? 2 : { xs: 2, sm: 2.5 },
        '&:last-child': { pb: compact ? 2 : { xs: 2, sm: 2.5 } }
      }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'flex-start',
          mb: compact ? 1 : 1.5
        }}>
          <Box sx={{ flex: 1 }}>
            <Typography 
              variant="h3" 
              component="div"
              fontWeight="bold" 
              sx={{ 
                color: getColor(color),
                fontSize: compact ? '1.5rem' : { xs: '1.75rem', sm: '2rem' },
                lineHeight: 1
              }}
            >
              {value}
              {subValue && (
                <Typography 
                  component="span" 
                  variant="body1" 
                  color={darkMode ? '#9aa0a6' : '#5f6368'}
                  sx={{ ml: 0.5, fontSize: '0.875rem' }}
                >
                  {subValue}
                </Typography>
              )}
            </Typography>
            <Typography 
              variant="body2" 
              color={darkMode ? '#9aa0a6' : '#5f6368'}
              sx={{ 
                fontSize: compact ? '0.75rem' : { xs: '0.8rem', sm: '0.875rem' },
                mt: 0.5
              }}
            >
              {title}
            </Typography>
          </Box>

          <Box sx={{
            width: compact ? 36 : { xs: 40, sm: 44 },
            height: compact ? 36 : { xs: 40, sm: 44 },
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: alpha(getColor(color), 0.1),
            color: getColor(color),
            flexShrink: 0
          }}>
            <Icon sx={{ fontSize: compact ? 20 : { xs: 22, sm: 24 } }} />
          </Box>
        </Box>

        {showTrend && trend !== 0 && (
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 0.5,
            mt: 1,
            flexWrap: 'wrap'
          }}>
            {getTrendIcon(trend)}
            <Typography 
              variant="caption" 
              fontWeight="medium"
              sx={{ 
                color: getTrendColor(trend),
                fontSize: compact ? '0.7rem' : '0.75rem'
              }}
            >
              {Math.abs(trend)}%
            </Typography>
            {!compact && (
              <Typography variant="caption" color={darkMode ? '#9aa0a6' : '#5f6368'} sx={{ fontSize: '0.75rem' }}>
                from last period
              </Typography>
            )}
          </Box>
        )}

        {showProgress && typeof value === 'number' && (
          <Box sx={{ mt: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="caption" color={darkMode ? '#9aa0a6' : '#5f6368'}>
                Score
              </Typography>
              <Typography variant="caption" fontWeight="bold">
                {value}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={value}
              sx={{
                height: 6,
                borderRadius: 3,
                backgroundColor: alpha(getColor(color), 0.1),
                '& .MuiLinearProgress-bar': {
                  borderRadius: 3,
                  background: `linear-gradient(90deg, ${alpha(getColor(color), 0.3)} 0%, ${getColor(color)} 100%)`
                }
              }}
            />
          </Box>
        )}
      </CardContent>
    </Card>
  )
}

interface GoogleAnalysisStatsProps {
  data: any
  materialsData: any
  summary: any
  darkMode?: boolean
}

export default function GoogleAnalysisStats({ 
  data, 
  materialsData, 
  summary,
  darkMode 
}: GoogleAnalysisStatsProps) {
  const mainCards = [
    {
      title: 'Total Users',
      value: data?.systemOverview?.databaseStats?.totalUsers || 0,
      icon: People,
      color: 'primary' as const,
      trend: summary?.growthRate || 0,
      showTrend: true
    },
    {
      title: 'Active Users',
      value: data?.systemOverview?.databaseStats?.activeUsers || 0,
      subValue: `${summary?.activeUserPercentage || 0}%`,
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
      value: summary?.engagementScore || 0,
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
    <Card sx={{ 
      borderRadius: '16px',
      backgroundColor: darkMode ? '#303134' : '#ffffff',
      border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
      boxShadow: '0 4px 24px rgba(0, 0, 0, 0.05)',
      mb: 3,
    }}>
      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 1,
          mb: 3,
          pb: 2,
          borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
        }}>
          <Typography 
            variant="h6" 
            fontWeight={600} 
            sx={{ 
              fontSize: { xs: '0.95rem', sm: '1.1rem', md: '1.25rem' },
              color: darkMode ? '#e8eaed' : '#202124',
            }}
          >
            Performance Overview
          </Typography>
          {summary?.growthRate !== undefined && (
            <Chip
              icon={<TrendingUp sx={{ fontSize: { xs: '14px !important', sm: '16px !important' } }} />}
              label={`${Number(summary.growthRate) > 0 ? '+' : ''}${Number(summary.growthRate).toFixed(1)}%`}
              sx={{
                backgroundColor: Number(summary.growthRate) > 0 
                  ? (darkMode ? 'rgba(52, 168, 83, 0.1)' : 'rgba(52, 168, 83, 0.1)')
                  : (darkMode ? 'rgba(234, 67, 53, 0.1)' : 'rgba(234, 67, 53, 0.1)'),
                color: Number(summary.growthRate) > 0 
                  ? '#34a853'
                  : '#ea4335',
                border: 'none',
                fontWeight: 500,
              }}
              size="small"
            />
          )}
        </Box>
        
        {/* Main Cards */}
        <Box sx={{ 
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: { xs: 1.5, sm: 2, md: 3 },
          mb: { xs: 3, sm: 4 }
        }}>
          {mainCards.map((card, index) => (
            <Box 
              key={index}
              sx={{ 
                flex: {
                  xs: '1 1 calc(50% - 12px)',
                  sm: '1 1 calc(33.333% - 16px)',
                  md: '1 1 calc(25% - 18px)',
                  lg: '1 1 calc(16.666% - 20px)'
                },
                minWidth: {
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
                darkMode={darkMode}
              />
            </Box>
          ))}
        </Box>

        {/* Stock Status Cards */}
        {materialsData && (
          <Box sx={{ 
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: { xs: 1.5, sm: 2, md: 3 }
          }}>
            {stockStatusCards.map((card, index) => (
              <Box 
                key={index}
                sx={{ 
                  flex: {
                    xs: '1 1 calc(50% - 12px)',
                    sm: '1 1 calc(50% - 16px)',
                    md: '1 1 calc(25% - 18px)'
                  },
                  minWidth: {
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
                  darkMode={darkMode}
                />
              </Box>
            ))}
          </Box>
        )}
      </CardContent>
    </Card>
  )
}