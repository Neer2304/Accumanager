// components/googleadminanalysis/GoogleAnalysisHeader.tsx
'use client'

import React from 'react'
import {
  Box,
  Container,
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  alpha,
} from '@mui/material'
import Link from 'next/link'
import {
  ArrowBack,
  Analytics,
  Refresh,
} from '@mui/icons-material'
import { AnalysisHeaderProps } from './types'

export default function GoogleAnalysisHeader({
  timeframe,
  onTimeframeChange,
  onRefresh,
  loading,
  compact,
  darkMode,
  isMobile,
  isTablet,
}: AnalysisHeaderProps) {
  return (
    <Box sx={{ mb: { xs: 3, sm: 4, md: 5 } }}>
      <Button
        component={Link}
        href="/admin/dashboard"
        startIcon={<ArrowBack />}
        sx={{ 
          mb: 2,
          color: darkMode ? '#8ab4f8' : '#1a73e8',
          '&:hover': {
            backgroundColor: darkMode ? 'rgba(138, 180, 248, 0.08)' : 'rgba(26, 115, 232, 0.08)',
          },
          borderRadius: '8px',
          textTransform: 'none',
          fontWeight: 500,
        }}
      >
        Back to Dashboard
      </Button>

      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: { xs: 'flex-start', sm: 'center' },
        flexDirection: { xs: 'column', sm: 'row' },
        gap: 2,
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{
            width: { xs: 48, sm: 56 },
            height: { xs: 48, sm: 56 },
            borderRadius: '16px',
            backgroundColor: darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: darkMode ? '#8ab4f8' : '#1a73e8',
          }}>
            <Analytics sx={{ fontSize: { xs: 24, sm: 28 } }} />
          </Box>
          <Box>
            <Typography 
              variant={isMobile ? "h5" : isTablet ? "h4" : "h3"}
              sx={{ 
                fontWeight: 500,
                color: darkMode ? '#e8eaed' : '#202124',
                lineHeight: 1.2,
                letterSpacing: '-0.02em',
              }}
            >
              Analytics Dashboard
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                color: darkMode ? '#9aa0a6' : '#5f6368',
                mt: 0.5,
              }}
            >
              Real-time insights and performance metrics
            </Typography>
          </Box>
        </Box>
        
        {compact ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <FormControl size="small" sx={{ minWidth: 100 }}>
              <Select
                value={timeframe}
                onChange={(e) => onTimeframeChange(e.target.value)}
                displayEmpty
                size="small"
                sx={{ 
                  '& .MuiSelect-select': { py: 0.75 },
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  backgroundColor: darkMode ? '#202124' : '#f8f9fa',
                  borderColor: darkMode ? '#3c4043' : '#dadce0',
                  color: darkMode ? '#e8eaed' : '#202124',
                }}
              >
                <MenuItem value="7">7 days</MenuItem>
                <MenuItem value="30">30 days</MenuItem>
                <MenuItem value="90">90 days</MenuItem>
                <MenuItem value="365">1 year</MenuItem>
              </Select>
            </FormControl>
            
            <IconButton
              onClick={onRefresh}
              disabled={loading}
              size="small"
              sx={{
                border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                borderRadius: '8px',
                p: 0.75,
                color: darkMode ? '#e8eaed' : '#202124',
                backgroundColor: darkMode ? '#202124' : '#f8f9fa',
                '&:hover': {
                  backgroundColor: darkMode ? '#2d2f31' : '#f1f3f4',
                }
              }}
            >
              <Refresh fontSize="small" />
            </IconButton>
          </Box>
        ) : (
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' }, 
            alignItems: { xs: 'stretch', sm: 'center' }, 
            gap: 2,
          }}>
            <FormControl size="small" sx={{ minWidth: { xs: '100%', sm: 140 } }}>
              <InputLabel sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>Timeframe</InputLabel>
              <Select
                value={timeframe}
                label="Timeframe"
                onChange={(e) => onTimeframeChange(e.target.value)}
                size="small"
                sx={{
                  backgroundColor: darkMode ? '#202124' : '#f8f9fa',
                  borderColor: darkMode ? '#3c4043' : '#dadce0',
                  color: darkMode ? '#e8eaed' : '#202124',
                  borderRadius: '8px',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: darkMode ? '#3c4043' : '#dadce0',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: darkMode ? '#5f6368' : '#bdc1c6',
                  }
                }}
              >
                <MenuItem value="7">Last 7 days</MenuItem>
                <MenuItem value="30">Last 30 days</MenuItem>
                <MenuItem value="90">Last 90 days</MenuItem>
                <MenuItem value="365">Last year</MenuItem>
              </Select>
            </FormControl>
            
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={onRefresh}
              disabled={loading}
              size="small"
              sx={{
                borderRadius: '8px',
                borderWidth: 2,
                borderColor: darkMode ? '#5f6368' : '#dadce0',
                color: darkMode ? '#e8eaed' : '#202124',
                '&:hover': { 
                  borderWidth: 2,
                  borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                  backgroundColor: darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.1)',
                },
                minHeight: { xs: 40, sm: 36 }
              }}
            >
              Refresh
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  )
}