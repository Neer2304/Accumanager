// components/dpadminanalysis/DpAdminAnalysisPage.tsx
'use client'

import React, { useState, useEffect } from 'react'
import { Box, Container, useTheme, useMediaQuery, Card, CardContent, Typography, Alert, AlertTitle } from '@mui/material'
import {
  DpAnalysisSkeleton,
  DpAnalysisHeader,
  DpAnalysisStats,
  DpAnalysisTabs,
  DpAnalysisUser,
  DpAnalysisNotes,
  DpAnalysisMaterials,
  DpAnalysisEngagement,
  DpAnalysisDebug,
  AnalysisData,
  MaterialsAnalysisData,
  dpColors,
} from './index'

export default function DpAdminAnalysisPage() {
  const theme = useTheme()
  const darkMode = theme.palette.mode === 'dark'
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

  const fetchAnalysisData = async () => {
    try {
      setLoading(true)
      setError('')
      const response = await fetch(`/api/admin/analysis?timeframe=${timeframe}`, { credentials: 'include', headers: { 'Cache-Control': 'no-cache' } })
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
      const response = await fetch(`/api/admin/analysis/materials?timeframe=${timeframe}`, { credentials: 'include' })
      if (response.ok) {
        const result = await response.json()
        if (result.success) setMaterialsData(result.data)
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

  const handleTabChange = (newValue: number) => { setActiveTab(newValue) }

  if (loading && !data) return <DpAnalysisSkeleton />

  const renderActiveTabContent = () => {
    switch (activeTab) {
      case 0: return <DpAnalysisUser data={data} darkMode={darkMode} />
      case 1: return <DpAnalysisNotes data={data} darkMode={darkMode} />
      case 2: return <DpAnalysisMaterials data={materialsData} loading={materialsLoading} totalUsers={data?.systemOverview?.databaseStats?.totalUsers || 0} darkMode={darkMode} />
      case 3: return <DpAnalysisEngagement data={data} darkMode={darkMode} />
      default: return null
    }
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: dpColors.bg, py: { xs: 2, sm: 3, md: 4 } }}>
      <Container maxWidth="xl">
        <DpAnalysisHeader timeframe={timeframe} onTimeframeChange={setTimeframe} onRefresh={handleRefresh} loading={loading || materialsLoading || refreshing} compact={isMobile} darkMode={darkMode} isMobile={isMobile} isTablet={isTablet} />

        {error && (
          <Alert severity="error" onClose={() => setError('')} sx={{ borderRadius: '12px', mb: 3, backgroundColor: dpColors.surface, border: `2px solid ${dpColors.error}`, color: dpColors.ink, '& .MuiAlert-icon': { color: dpColors.error } }}>
            <AlertTitle sx={{ color: dpColors.error }}>Error</AlertTitle>{error}
          </Alert>
        )}

        <DpAnalysisStats data={data} materialsData={materialsData} summary={data?.summary} darkMode={darkMode} />

        <Card sx={{ borderRadius: '20px', backgroundColor: dpColors.surface, border: `2px solid ${dpColors.border}`, boxShadow: `0 4px 24px ${dpColors.redGlow}`, overflow: 'hidden' }}>
          <DpAnalysisTabs activeTab={activeTab} onTabChange={handleTabChange} darkMode={darkMode} />
          <Box sx={{ p: { xs: 2, sm: 3 }, minHeight: { xs: '350px', sm: '450px', md: '500px' } }}>
            {data && renderActiveTabContent()}
          </Box>
        </Card>

        <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center', gap: 1, pt: 2, borderTop: `2px solid ${dpColors.border}` }}>
          <Typography variant="caption" sx={{ color: dpColors.inkSub, fontSize: { xs: '0.65rem', sm: '0.75rem' } }}>Last updated: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Typography>
          <Typography variant="caption" sx={{ color: dpColors.inkSub, fontSize: { xs: '0.65rem', sm: '0.75rem' } }}>{data?.summary?.lastUpdated && `Data as of ${new Date(data.summary.lastUpdated).toLocaleDateString()}`}</Typography>
        </Box>

        <DpAnalysisDebug data={data} darkMode={darkMode} isMobile={isMobile} />
      </Container>
    </Box>
  )
}