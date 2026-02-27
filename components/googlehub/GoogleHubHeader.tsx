// components/googlehub/GoogleHubHeader.tsx
'use client'

import React from 'react'
import {
  Box,
  Typography,
  Breadcrumbs,
  Chip,
  IconButton,
  Tooltip,
  useTheme,
  alpha,
} from '@mui/material'
import { Home as HomeIcon, Refresh } from '@mui/icons-material'
import Link from 'next/link'
import { googleColors } from './types'

interface GoogleHubHeaderProps {
  title: string
  subtitle?: string
  icon?: React.ReactNode
  breadcrumbs?: Array<{
    label: string
    href?: string
    icon?: React.ReactNode
  }>
  actions?: React.ReactNode
  stats?: Array<{
    label: string
    value: string | number
    color?: string
    icon?: React.ReactNode
  }>
  onRefresh?: () => void
  refreshing?: boolean
}

export default function GoogleHubHeader({
  title,
  subtitle,
  icon,
  breadcrumbs = [],
  actions,
  stats = [],
  onRefresh,
  refreshing = false,
}: GoogleHubHeaderProps) {
  const theme = useTheme()
  const darkMode = theme.palette.mode === 'dark'

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 3 },
        borderBottom: `1px solid ${darkMode ? googleColors.greyDark : googleColors.greyBorder}`,
        background: darkMode
          ? 'linear-gradient(135deg, #0d3064 0%, #202124 100%)'
          : 'linear-gradient(135deg, #e8f0fe 0%, #ffffff 100%)',
        mb: 3,
      }}
    >
      {/* Breadcrumbs */}
      {breadcrumbs.length > 0 && (
        <Breadcrumbs sx={{ mb: 2, fontSize: { xs: '0.7rem', sm: '0.8rem' } }}>
          <Link
            href="/dashboard"
            style={{
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
              color: darkMode ? '#9aa0a6' : googleColors.grey,
            }}
          >
            <HomeIcon sx={{ mr: 0.5, fontSize: 18 }} />
            Dashboard
          </Link>
          {breadcrumbs.map((item, index) => {
            if (item.href) {
              return (
                <Link
                  key={index}
                  href={item.href}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    textDecoration: 'none',
                    color: darkMode ? '#9aa0a6' : googleColors.grey,
                  }}
                >
                  {item.icon && <Box sx={{ mr: 0.5, display: 'flex' }}>{item.icon}</Box>}
                  {item.label}
                </Link>
              )
            }
            return (
              <Typography
                key={index}
                color={darkMode ? '#e8eaed' : googleColors.black}
                sx={{ display: 'flex', alignItems: 'center' }}
              >
                {item.icon && <Box sx={{ mr: 0.5, display: 'flex' }}>{item.icon}</Box>}
                {item.label}
              </Typography>
            )
          })}
        </Breadcrumbs>
      )}

      {/* Title Section */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {icon && (
            <Box sx={{ color: googleColors.blue, display: 'flex' }}>
              {icon}
            </Box>
          )}
          <Box>
            <Typography
              variant="h3"
              fontWeight={700}
              sx={{
                fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.5rem' },
                background: `linear-gradient(135deg, ${googleColors.blue}, ${googleColors.purple})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 0.5,
              }}
            >
              {title}
            </Typography>
            {subtitle && (
              <Typography variant="body1" sx={{ color: darkMode ? '#9aa0a6' : googleColors.grey }}>
                {subtitle}
              </Typography>
            )}
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 2 }}>
          {actions}
          {onRefresh && (
            <Tooltip title="Refresh">
              <IconButton
                onClick={onRefresh}
                disabled={refreshing}
                sx={{
                  color: darkMode ? '#e8eaed' : googleColors.black,
                  animation: refreshing ? 'spin 1s linear infinite' : 'none',
                  '@keyframes spin': {
                    '0%': { transform: 'rotate(0deg)' },
                    '100%': { transform: 'rotate(360deg)' },
                  },
                }}
              >
                <Refresh />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </Box>

      {/* Stats Chips */}
      {stats.length > 0 && (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 3 }}>
          {stats.map((stat, index) => (
            <Chip
              key={index}
            //   icon={stat.icon}
              label={`${stat.label}: ${stat.value}`}
              sx={{
                backgroundColor: alpha(stat.color || googleColors.blue, 0.1),
                color: stat.color || googleColors.blue,
                fontWeight: 500,
                '& .MuiChip-icon': { color: stat.color || googleColors.blue },
              }}
            />
          ))}
        </Box>
      )}
    </Box>
  )
}