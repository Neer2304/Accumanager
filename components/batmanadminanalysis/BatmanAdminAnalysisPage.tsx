// components/batmanadminanalysis/BatmanAdminAnalysisPage.tsx
'use client'

import React, { useState, useEffect } from 'react'
import { Box, Container, useTheme, useMediaQuery, Card, CardContent, Typography, Alert, AlertTitle } from '@mui/material'
import {
  BatmanAnalysisSkeleton,
  BatmanAnalysisHeader,
  BatmanAnalysisStats,
  BatmanAnalysisTabs,
  BatmanAnalysisUser,
  BatmanAnalysisNotes,
  BatmanAnalysisMaterials,
  BatmanAnalysisEngagement,
  BatmanAnalysisDebug,
  AnalysisData,
  MaterialsAnalysisData,
  batmanColors,
} from './index'

export default function BatmanAdminAnalysisPage() {
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

  if (loading && !data) return <BatmanAnalysisSkeleton />

  const renderActiveTabContent = () => {
    switch (activeTab) {
      case 0: return <BatmanAnalysisUser data={data} darkMode={darkMode} />
      case 1: return <BatmanAnalysisNotes data={data} darkMode={darkMode} />
      case 2: return <BatmanAnalysisMaterials data={materialsData} loading={materialsLoading} totalUsers={data?.systemOverview?.databaseStats?.totalUsers || 0} darkMode={darkMode} />
      case 3: return <BatmanAnalysisEngagement data={data} darkMode={darkMode} />
      default: return null
    }
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: batmanColors.bg, py: { xs: 2, sm: 3, md: 4 } }}>
      <Container maxWidth="xl">
        <BatmanAnalysisHeader timeframe={timeframe} onTimeframeChange={setTimeframe} onRefresh={handleRefresh} loading={loading || materialsLoading || refreshing} compact={isMobile} darkMode={darkMode} isMobile={isMobile} isTablet={isTablet} />

        {error && (
          <Alert severity="error" onClose={() => setError('')} sx={{ borderRadius: '12px', mb: 3, backgroundColor: batmanColors.surface, border: `2px solid ${batmanColors.error}`, color: batmanColors.ink, '& .MuiAlert-icon': { color: batmanColors.error } }}>
            <AlertTitle sx={{ color: batmanColors.error }}>Error</AlertTitle>{error}
          </Alert>
        )}

        <BatmanAnalysisStats data={data} materialsData={materialsData} summary={data?.summary} darkMode={darkMode} />

        <Card sx={{ borderRadius: '20px', backgroundColor: batmanColors.surface, border: `2px solid ${batmanColors.gold}`, boxShadow: `0 4px 24px ${batmanColors.goldGlow}`, overflow: 'hidden' }}>
          <BatmanAnalysisTabs activeTab={activeTab} onTabChange={handleTabChange} darkMode={darkMode} />
          <Box sx={{ p: { xs: 2, sm: 3 }, minHeight: { xs: '350px', sm: '450px', md: '500px' } }}>
            {data && renderActiveTabContent()}
          </Box>
        </Card>

        <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center', gap: 1, pt: 2, borderTop: `2px solid ${batmanColors.gold}` }}>
          <Typography variant="caption" sx={{ color: batmanColors.inkSub, fontSize: { xs: '0.65rem', sm: '0.75rem' }, letterSpacing: '0.05em' }}>Last updated: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Typography>
          <Typography variant="caption" sx={{ color: batmanColors.inkSub, fontSize: { xs: '0.65rem', sm: '0.75rem' }, letterSpacing: '0.05em' }}>{data?.summary?.lastUpdated && `Data as of ${new Date(data.summary.lastUpdated).toLocaleDateString()}`}</Typography>
        </Box>

        <BatmanAnalysisDebug data={data} darkMode={darkMode} isMobile={isMobile} />
      </Container>
    </Box>
  )
}