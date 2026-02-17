// app/admin/analysis/page.tsx
'use client'

import React, { useState, useEffect } from 'react'
import { 
  Box, 
  Container, 
  useTheme,
  useMediaQuery,
  Card,
  CardContent,
  Typography,
  Alert,
  AlertTitle,
} from '@mui/material'
import { useTheme as useThemeContext } from '@/contexts/ThemeContext'

import {
  GoogleAnalysisSkeleton,
  GoogleAnalysisHeader,
  GoogleAnalysisStats,
  GoogleAnalysisTabs,
  GoogleAnalysisUser,
  GoogleAnalysisNotes,
  GoogleAnalysisMaterials,
  GoogleAnalysisEngagement,
  GoogleAnalysisDebug,
  AnalysisData,
  MaterialsAnalysisData,
} from '@/components/googleadminanalysis'

export default function AdminAnalysisPage() {
  const theme = useTheme()
  const { mode } = useThemeContext()
  const darkMode = mode === 'dark'
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'lg'))
  
  const [timeframe, setTimeframe] = useState('30')
  const [loading, setLoading] = useState(true)
  const [materialsLoading, setMaterialsLoading] = useState(false)
  const [error, setError] = useState('')
  const [data, setData] = useState<AnalysisData | null>(null)
  const [materialsData, setMaterialsData] = useState<MaterialsAnalysisData | null>(null)
  const [activeTab, setActiveTab] = useState(0)
  const [refreshing, setRefreshing] = useState(false)

  // Data fetching functions
  const fetchAnalysisData = async () => {
    try {
      setLoading(true)
      setError('')
      
      const response = await fetch(`/api/admin/analysis?timeframe=${timeframe}`, {
        credentials: 'include',
        headers: { 'Cache-Control': 'no-cache' }
      })
      
      if (!response.ok) throw new Error(`Failed to fetch data: ${response.status}`)
      
      const result = await response.json()
      if (!result.success) throw new Error(result.message || 'Failed to load data')
      
      setData(result.data)
      
    } catch (err: any) {
      console.error('Fetch error:', err)
      setError(err.message || 'Failed to load analysis data')
    } finally {
      setLoading(false)
    }
  }

  const fetchMaterialsAnalysis = async () => {
    try {
      setMaterialsLoading(true)
      
      const response = await fetch(`/api/admin/analysis/materials?timeframe=${timeframe}`, {
        credentials: 'include'
      })
      
      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          setMaterialsData(result.data)
        }
      }
    } catch (err: any) {
      console.error('Error fetching materials:', err)
    } finally {
      setMaterialsLoading(false)
    }
  }

  useEffect(() => {
    const fetchAllData = async () => {
      await fetchAnalysisData()
      await fetchMaterialsAnalysis()
    }
    
    fetchAllData()
  }, [timeframe])

  const handleRefresh = () => {
    setRefreshing(true)
    setData(null)
    setMaterialsData(null)
    fetchAnalysisData()
    fetchMaterialsAnalysis()
    setTimeout(() => setRefreshing(false), 1000)
  }

  const handleTabChange = (newValue: number) => {
    setActiveTab(newValue)
  }

  if (loading && !data) {
    return <GoogleAnalysisSkeleton />
  }

  const renderActiveTabContent = () => {
    switch (activeTab) {
      case 0:
        return <GoogleAnalysisUser data={data} darkMode={darkMode} />
      case 1:
        return <GoogleAnalysisNotes data={data} darkMode={darkMode} />
      case 2:
        return <GoogleAnalysisMaterials 
          data={materialsData} 
          loading={materialsLoading}
          totalUsers={data?.systemOverview?.databaseStats?.totalUsers || 0}
          darkMode={darkMode}
        />
      case 3:
        return <GoogleAnalysisEngagement data={data} darkMode={darkMode} />
      default:
        return null
    }
  }

  return (
    <Box sx={{ 
      minHeight: '100vh',
      backgroundColor: darkMode ? '#202124' : '#f8f9fa',
      py: { xs: 2, sm: 3, md: 4 },
    }}>
      <Container maxWidth="xl">
        <GoogleAnalysisHeader
          timeframe={timeframe}
          onTimeframeChange={setTimeframe}
          onRefresh={handleRefresh}
          loading={loading || materialsLoading || refreshing}
          compact={isMobile}
          darkMode={darkMode}
          isMobile={isMobile}
          isTablet={isTablet}
        />

        {/* Error Alert */}
        {error && (
          <Alert 
            severity="error" 
            onClose={() => setError('')}
            sx={{ 
              borderRadius: '12px',
              mb: 3,
              backgroundColor: darkMode ? '#303134' : '#ffffff',
              border: `1px solid #ea4335`,
              color: darkMode ? '#e8eaed' : '#202124',
              '& .MuiAlert-icon': { color: '#ea4335' },
            }}
          >
            <AlertTitle>Error</AlertTitle>
            {error}
          </Alert>
        )}

        <GoogleAnalysisStats
          data={data}
          materialsData={materialsData}
          summary={data?.summary}
          darkMode={darkMode}
        />

        <Card sx={{ 
          borderRadius: '16px',
          backgroundColor: darkMode ? '#303134' : '#ffffff',
          border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
          boxShadow: '0 4px 24px rgba(0, 0, 0, 0.05)',
          overflow: 'hidden',
        }}>
          <GoogleAnalysisTabs
            activeTab={activeTab}
            onTabChange={handleTabChange}
            darkMode={darkMode}
          />
          
          <Box sx={{ 
            p: { xs: 2, sm: 3 },
            minHeight: { xs: '350px', sm: '450px', md: '500px' }
          }}>
            {data && renderActiveTabContent()}
          </Box>
        </Card>

        {/* Footer */}
        <Box sx={{ 
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          justifyContent: 'space-between',
          alignItems: isMobile ? 'flex-start' : 'center',
          gap: 1,
          pt: 2,
          borderTop: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`
        }}>
          <Typography 
            variant="caption" 
            color={darkMode ? '#9aa0a6' : '#5f6368'} 
            sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' } }}
          >
            Last updated: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Typography>
          <Typography 
            variant="caption" 
            color={darkMode ? '#9aa0a6' : '#5f6368'} 
            sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' } }}
          >
            {data?.summary?.lastUpdated && `Data as of ${new Date(data.summary.lastUpdated).toLocaleDateString()}`}
          </Typography>
        </Box>

        <GoogleAnalysisDebug
          data={data}
          darkMode={darkMode}
          isMobile={isMobile}
        />
      </Container>
    </Box>
  )
}