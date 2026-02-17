// app/(pages)/advance/ads-manager/page.tsx
'use client'

import { useState } from 'react'
import {
  Box,
  Container,
  useTheme,
  useMediaQuery,
} from '@mui/material'
import {
  GoogleAdminAdsHeader,
  GoogleAdminAdsStats,
  GoogleAdminAdsSettings,
  GoogleAdminAdsTable,
  GoogleAdminAdsDialog,
  GoogleAdminAdsAlerts,
  Campaign,
  CampaignStats,
  AdSettings,
  CreateAdFormData,
} from '@/components/googleadminads'

export default function AdsManagerPage() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'))
  const darkMode = theme.palette.mode === 'dark'
  
  const [adsEnabled, setAdsEnabled] = useState(true)
  const [adDensity, setAdDensity] = useState(50)
  const [adCategory, setAdCategory] = useState('all')
  const [openAdDialog, setOpenAdDialog] = useState(false)
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  
  // Mock ad campaigns
  const [campaigns, setCampaigns] = useState<Campaign[]>([
    {
      id: 1,
      name: 'Tech Tools Banner',
      status: 'active',
      impressions: 12500,
      clicks: 320,
      ctr: 2.56,
      revenue: 450.00,
      placement: 'header',
    },
    {
      id: 2,
      name: 'SaaS Sidebar',
      status: 'active',
      impressions: 8900,
      clicks: 210,
      ctr: 2.36,
      revenue: 315.00,
      placement: 'sidebar',
    },
    {
      id: 3,
      name: 'Business Inline',
      status: 'paused',
      impressions: 5600,
      clicks: 95,
      ctr: 1.70,
      revenue: 142.50,
      placement: 'content',
    },
  ])

  const stats: CampaignStats = {
    totalRevenue: campaigns.reduce((sum, c) => sum + c.revenue, 0),
    totalImpressions: campaigns.reduce((sum, c) => sum + c.impressions, 0),
    averageCTR: campaigns.reduce((sum, c) => sum + c.ctr, 0) / campaigns.length,
    activeCampaigns: campaigns.filter(c => c.status === 'active').length,
  }

  const adSettings: AdSettings = {
    enabled: adsEnabled,
    density: adDensity,
    category: adCategory,
  }

  const handleSettingsChange = (key: keyof AdSettings, value: any) => {
    switch (key) {
      case 'enabled':
        setAdsEnabled(value)
        setSuccess('Ad settings updated successfully')
        setTimeout(() => setSuccess(null), 3000)
        break
      case 'density':
        setAdDensity(value)
        setSuccess('Ad density updated successfully')
        setTimeout(() => setSuccess(null), 3000)
        break
      case 'category':
        setAdCategory(value)
        setSuccess('Ad category updated successfully')
        setTimeout(() => setSuccess(null), 3000)
        break
    }
  }

  const handleCreateAd = (data: CreateAdFormData) => {
    const newCampaign: Campaign = {
      id: campaigns.length + 1,
      name: data.title,
      status: 'active',
      impressions: 0,
      clicks: 0,
      ctr: 0,
      revenue: parseFloat(data.budget) || 0,
      placement: data.placement,
    }
    
    setCampaigns([...campaigns, newCampaign])
    setOpenAdDialog(false)
    setSuccess('Campaign created successfully!')
    setTimeout(() => setSuccess(null), 3000)
  }

  const handleEditCampaign = (campaign: Campaign) => {
    setEditingCampaign(campaign)
    setOpenAdDialog(true)
  }

  const handleUpdateCampaign = (data: CreateAdFormData) => {
    if (editingCampaign) {
      const updatedCampaigns = campaigns.map(c => 
        c.id === editingCampaign.id 
          ? { 
              ...c, 
              name: data.title, 
              placement: data.placement,
              revenue: parseFloat(data.budget) || c.revenue,
            }
          : c
      )
      setCampaigns(updatedCampaigns)
      setEditingCampaign(null)
      setOpenAdDialog(false)
      setSuccess('Campaign updated successfully!')
      setTimeout(() => setSuccess(null), 3000)
    }
  }

  const handleDeleteCampaign = (id: number) => {
    if (confirm('Are you sure you want to delete this campaign?')) {
      setCampaigns(campaigns.filter(c => c.id !== id))
      setSuccess('Campaign deleted successfully!')
      setTimeout(() => setSuccess(null), 3000)
    }
  }

  const handleDialogSubmit = (data: CreateAdFormData) => {
    if (editingCampaign) {
      handleUpdateCampaign(data)
    } else {
      handleCreateAd(data)
    }
  }

  const handleDialogClose = () => {
    setOpenAdDialog(false)
    setEditingCampaign(null)
  }

  return (
    <Box sx={{ 
      minHeight: '100vh',
      backgroundColor: darkMode ? '#202124' : '#f8f9fa',
      py: { xs: 2, sm: 3, md: 4 },
    }}>
      <Container maxWidth="lg">
        <GoogleAdminAdsHeader 
          onAddClick={() => setOpenAdDialog(true)}
          darkMode={darkMode}
          isMobile={isMobile}
          isTablet={isTablet}
        />

        <GoogleAdminAdsAlerts 
          error={error}
          success={success}
          onErrorClose={() => setError(null)}
          onSuccessClose={() => setSuccess(null)}
          darkMode={darkMode}
        />

        <GoogleAdminAdsStats 
          stats={stats}
          darkMode={darkMode}
        />

        <GoogleAdminAdsSettings 
          settings={adSettings}
          onSettingsChange={handleSettingsChange}
          darkMode={darkMode}
        />

        <GoogleAdminAdsTable 
          campaigns={campaigns}
          onEdit={handleEditCampaign}
          onDelete={handleDeleteCampaign}
          darkMode={darkMode}
        />

        <GoogleAdminAdsDialog 
          open={openAdDialog}
          onClose={handleDialogClose}
          onSubmit={handleDialogSubmit}
          darkMode={darkMode}
          editingCampaign={editingCampaign}
        />
      </Container>
    </Box>
  )
}