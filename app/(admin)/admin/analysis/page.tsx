// app/admin/analysis/page.tsx - UPDATED VERSION
'use client'

import React, { useState, useEffect } from 'react'
import { Box, Container } from '@mui/material'
import { useTheme } from '@mui/material/styles'

// Components
import { AnalysisHeader } from '@/components/admin-side/analysis/AnalysisHeader'
import { OverviewCards } from '@/components/admin-side/analysis/OverviewCards'
import { AnalysisTabs } from '@/components/admin-side/analysis/AnalysisTabs'
import { UserAnalysis } from '@/components/admin-side/analysis/UserAnalysis'
import { NotesAnalysis } from '@/components/admin-side/analysis/NotesAnalysis'
import { MaterialsAnalysis } from '@/components/admin-side/analysis/MaterialsAnalysis'
import { EngagementAnalysis } from '@/components/admin-side/analysis/EngagementAnalysis'
import { LoadingState } from '@/components/admin-side/common/LoadingState'
import { ErrorAlert } from '@/components/admin-side/common/ErrorAlert'

// Types
import { AnalysisData, MaterialsAnalysisData } from '@/components/admin-side/types'

export default function AdminAnalysisPage() {
  const theme = useTheme()
  
  const [timeframe, setTimeframe] = useState('30')
  const [loading, setLoading] = useState(true)
  const [materialsLoading, setMaterialsLoading] = useState(false)
  const [error, setError] = useState('')
  const [data, setData] = useState<AnalysisData | null>(null)
  const [materialsData, setMaterialsData] = useState<MaterialsAnalysisData | null>(null)
  const [activeTab, setActiveTab] = useState(0)

  // Main data fetching function
  const fetchAnalysisData = async () => {
    try {
      setLoading(true)
      setError('')
      
      console.log(`🔄 Fetching analysis data for ${timeframe} days`)
      
      // Fetch main analysis data
      const response = await fetch(`/api/admin/analysis?timeframe=${timeframe}`, {
        credentials: 'include',
        headers: {
          'Cache-Control': 'no-cache'
        }
      })
      
      console.log('Response status:', response.status)
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error('API Error:', errorText)
        throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`)
      }
      
      const result = await response.json()
      console.log('API Response:', result)
      
      if (!result.success) {
        throw new Error(result.message || 'Failed to load analysis data')
      }
      
      console.log('✅ Analysis data loaded successfully')
      console.log('📊 User stats:', {
        totalUsers: result.data?.systemOverview?.databaseStats?.totalUsers,
        activeUsers: result.data?.systemOverview?.databaseStats?.activeUsers,
        recentUsers: result.data?.systemOverview?.databaseStats?.recentUsers,
        growthRate: result.data?.summary?.growthRate
      })
      
      setData(result.data)
      
    } catch (err: any) {
      console.error('❌ Fetch error:', err)
      setError(err.message || 'Failed to load analysis data')
    } finally {
      setLoading(false)
    }
  }

  // Materials data fetching
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
      // Don't show error for materials - it's optional
    } finally {
      setMaterialsLoading(false)
    }
  }

  // Fetch all data
  useEffect(() => {
    const fetchAllData = async () => {
      await fetchAnalysisData()
      await fetchMaterialsAnalysis()
    }
    
    fetchAllData()
  }, [timeframe])

  const handleRefresh = () => {
    setData(null)
    setMaterialsData(null)
    fetchAnalysisData()
    fetchMaterialsAnalysis()
  }

  const handleTabChange = (newValue: number) => {
    setActiveTab(newValue)
  }

  if (loading && !data) {
    return <LoadingState />
  }

  const renderActiveTabContent = () => {
    switch (activeTab) {
      case 0:
        return <UserAnalysis data={data} />
      case 1:
        return <NotesAnalysis data={data} />
      case 2:
        return <MaterialsAnalysis 
          data={materialsData} 
          loading={materialsLoading}
          totalUsers={data?.systemOverview?.databaseStats?.totalUsers || 0}
        />
      case 3:
        return <EngagementAnalysis data={data} />
      default:
        return null
    }
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${theme.palette.background.paper} 100%)`,
        py: { xs: 2, md: 4 },
        px: { xs: 1, sm: 2 }
      }}
    >
      <Container maxWidth="xl" sx={{ px: { xs: 1, sm: 2 } }}>
        {/* Header */}
        <AnalysisHeader
          timeframe={timeframe}
          onTimeframeChange={setTimeframe}
          onRefresh={handleRefresh}
          loading={loading || materialsLoading}
          error={error}
          onErrorClose={() => setError('')}
        />

        {/* Error Alert */}
        {error && (
          <Box sx={{ mb: 3 }}>
            <ErrorAlert 
              message={error}
              onClose={() => setError('')}
            />
          </Box>
        )}

        {/* Overview Cards - Show only when we have data */}
        {data && (
          <OverviewCards 
            data={data}
            materialsData={materialsData}
          />
        )}

        {/* Tabs Content - Show only when we have data */}
        {data && (
          <AnalysisTabs
            activeTab={activeTab}
            onTabChange={handleTabChange}
          >
            {renderActiveTabContent()}
          </AnalysisTabs>
        )}

        {/* Debug Info - Remove in production */}
        {process.env.NODE_ENV === 'development' && data && (
          <Box sx={{ mt: 4, p: 2, bgcolor: 'grey.100', borderRadius: 2 }}>
            <details>
              <summary>Debug Data</summary>
              <pre style={{ fontSize: '12px', overflow: 'auto', maxHeight: '200px' }}>
                {JSON.stringify(data.systemOverview?.databaseStats, null, 2)}
              </pre>
            </details>
          </Box>
        )}
      </Container>
    </Box>
  )
}