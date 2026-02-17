// components/googleadminanalysis/GoogleAnalysisEngagement.tsx
'use client'

import React from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  alpha,
} from '@mui/material'
import {
  TrendingUp,
  AccessTime,
  People,
  NoteAdd,
  ArrowUpward,
  ArrowDownward,
} from '@mui/icons-material'
import { AnalysisData } from './types'

interface GoogleAnalysisEngagementProps {
  data: AnalysisData | null
  darkMode?: boolean
}

export default function GoogleAnalysisEngagement({ data, darkMode }: GoogleAnalysisEngagementProps) {
  if (!data?.engagementAnalysis) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography color={darkMode ? '#9aa0a6' : '#5f6368'}>
          No engagement data available
        </Typography>
      </Box>
    )
  }

  const engagement = data.engagementAnalysis
  const activeUsers = data.systemOverview?.databaseStats?.activeUsers || 0
  const totalNotes = data.systemOverview?.databaseStats?.totalNotes || 0
  const notesPerActiveUser = activeUsers > 0 ? totalNotes / activeUsers : 0

  const formatNumber = (value: any, decimals: number = 1): string => {
    const num = Number(value)
    return isNaN(num) ? '0.0' : num.toFixed(decimals)
  }

  const metrics = [
    {
      label: 'Avg. Engagement Rate',
      value: `${formatNumber(engagement.averageEngagementRate)}%`,
      icon: TrendingUp,
      color: darkMode ? '#8ab4f8' : '#1a73e8',
      progress: Number(engagement.averageEngagementRate) || 0
    },
    {
      label: 'Avg. Session Duration',
      value: `${formatNumber(engagement.averageSessionDuration)}m`,
      icon: AccessTime,
      color: '#34a853',
      progress: Math.min((Number(engagement.averageSessionDuration) || 0) / 10 * 100, 100)
    },
    {
      label: 'Daily Active Users',
      value: engagement.dailyActiveUsers?.toLocaleString() || '0',
      icon: People,
      color: '#5f6368',
      progress: Math.min((engagement.dailyActiveUsers || 0) / 1000 * 100, 100)
    },
    {
      label: 'Notes per Active User',
      value: formatNumber(notesPerActiveUser),
      icon: NoteAdd,
      color: '#fbbc04',
      progress: Math.min(notesPerActiveUser / 5 * 100, 100)
    }
  ]

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" fontWeight={600} gutterBottom color={darkMode ? '#e8eaed' : '#202124'}>
          Engagement Metrics
        </Typography>
        <Typography variant="body2" color={darkMode ? '#9aa0a6' : '#5f6368'}>
          User interaction and activity patterns
        </Typography>
      </Box>

      {/* Metrics */}
      <Box sx={{ 
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 2,
        mb: 4
      }}>
        {metrics.map((metric, index) => (
          <Box 
            key={index}
            sx={{ 
              flex: {
                xs: '1 1 calc(50% - 8px)',
                sm: '1 1 calc(50% - 8px)',
                md: '1 1 calc(25% - 12px)'
              },
              minWidth: {
                xs: 'calc(50% - 8px)',
                sm: 'calc(50% - 8px)',
                md: 'calc(25% - 12px)'
              }
            }}
          >
            <Card elevation={0} sx={{ 
              p: 2.5,
              borderRadius: '16px',
              backgroundColor: darkMode ? '#303134' : '#ffffff',
              border: `1px solid ${alpha(metric.color, 0.1)}`,
              height: '100%'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1 }}>
                <Box>
                  <Typography variant="body2" color={darkMode ? '#9aa0a6' : '#5f6368'}>
                    {metric.label}
                  </Typography>
                  <Typography variant="h4" fontWeight={700} sx={{ color: metric.color }}>
                    {metric.value}
                  </Typography>
                </Box>
                <Box sx={{ 
                  p: 1, 
                  borderRadius: '12px', 
                  background: alpha(metric.color, 0.1), 
                  color: metric.color 
                }}>
                  <metric.icon />
                </Box>
              </Box>
              
              <LinearProgress
                variant="determinate"
                value={metric.progress}
                sx={{
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: alpha(metric.color, 0.1),
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: metric.color,
                    borderRadius: 3
                  }
                }}
              />
            </Card>
          </Box>
        ))}
      </Box>

      {/* Detailed Stats */}
      <Card elevation={0} sx={{ 
        p: 3, 
        borderRadius: '16px',
        backgroundColor: darkMode ? '#303134' : '#ffffff',
        border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
      }}>
        <Typography variant="subtitle1" fontWeight={600} gutterBottom color={darkMode ? '#e8eaed' : '#202124'}>
          Performance Indicators
        </Typography>
        
        <Box sx={{ 
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: 2
        }}>
          {/* Retention Rate */}
          <Box sx={{ 
            flex: {
              xs: '1 1 calc(50% - 8px)',
              sm: '1 1 calc(50% - 8px)'
            },
            minWidth: {
              xs: 'calc(50% - 8px)',
              sm: 'calc(50% - 8px)'
            }
          }}>
            <Box sx={{ 
              p: 2,
              borderRadius: '12px',
              background: alpha('#34a853', darkMode ? 0.1 : 0.05),
              border: `1px solid ${alpha('#34a853', darkMode ? 0.2 : 0.1)}`
            }}>
              <Typography variant="body2" color={darkMode ? '#9aa0a6' : '#5f6368'} gutterBottom>
                30-day Retention Rate
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="h5" fontWeight={700} color="#34a853">
                  {formatNumber(engagement.retentionRate)}%
                </Typography>
                {Number(engagement.retentionRate) > 50 ? (
                  <ArrowUpward sx={{ color: '#34a853' }} />
                ) : (
                  <ArrowDownward sx={{ color: '#ea4335' }} />
                )}
              </Box>
            </Box>
          </Box>

          {/* Bounce Rate */}
          <Box sx={{ 
            flex: {
              xs: '1 1 calc(50% - 8px)',
              sm: '1 1 calc(50% - 8px)'
            },
            minWidth: {
              xs: 'calc(50% - 8px)',
              sm: 'calc(50% - 8px)'
            }
          }}>
            <Box sx={{ 
              p: 2,
              borderRadius: '12px',
              background: alpha('#ea4335', darkMode ? 0.1 : 0.05),
              border: `1px solid ${alpha('#ea4335', darkMode ? 0.2 : 0.1)}`
            }}>
              <Typography variant="body2" color={darkMode ? '#9aa0a6' : '#5f6368'} gutterBottom>
                Bounce Rate
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="h5" fontWeight={700} color="#ea4335">
                  {formatNumber(engagement.bounceRate)}%
                </Typography>
                {Number(engagement.bounceRate) < 30 ? (
                  <ArrowDownward sx={{ color: '#34a853' }} />
                ) : (
                  <ArrowUpward sx={{ color: '#ea4335' }} />
                )}
              </Box>
            </Box>
          </Box>
        </Box>

        {engagement.summary && (
          <Box sx={{ 
            mt: 3, 
            p: 2,
            borderRadius: '12px',
            background: alpha(darkMode ? '#8ab4f8' : '#1a73e8', darkMode ? 0.1 : 0.05),
            border: `1px solid ${alpha(darkMode ? '#8ab4f8' : '#1a73e8', darkMode ? 0.2 : 0.1)}`
          }}>
            <Typography variant="body2" sx={{ 
              color: darkMode ? '#8ab4f8' : '#1a73e8', 
              fontStyle: 'italic' 
            }}>
              {engagement.summary}
            </Typography>
          </Box>
        )}
      </Card>
    </Box>
  )
}