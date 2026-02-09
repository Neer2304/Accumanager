'use client'

import { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Alert,
  CircularProgress,
  Button,
  Snackbar,
} from '@mui/material'
import {
  Save,
  Refresh,
  Business,
  Contacts,
  Share,
  TextFields,
  Search,
  Palette,
  Settings
} from '@mui/icons-material'

import AdminButton from '@/components/ui/admin/AdminButton'
import AdminCard from '@/components/ui/admin/AdminCard'
import CompanyTab from '@/components/ui/admin/tabs/CompanyTab'
import ContactTab from '@/components/ui/admin/tabs/ContactTab'
import SocialTab from '@/components/ui/admin/tabs/SocialTab'
import LabelsTab from '@/components/ui/admin/tabs/LabelsTab'
import SeoTab from '@/components/ui/admin/tabs/SeoTab'
import ThemeTab from '@/components/ui/admin/tabs/ThemeTab'
import SystemTab from '@/components/ui/admin/tabs/SystemTab'


export default function AdminAboutPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState(0)
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' })
  const [aboutData, setAboutData] = useState<any>(null)

  const tabs = [
    { label: 'Company', icon: <Business />, key: 'company' },
    { label: 'Contact', icon: <Contacts />, key: 'contact' },
    { label: 'Social', icon: <Share />, key: 'social' },
    { label: 'Labels', icon: <TextFields />, key: 'labels' },
    { label: 'SEO', icon: <Search />, key: 'seo' },
    { label: 'Theme', icon: <Palette />, key: 'theme' },
    { label: 'System', icon: <Settings />, key: 'system' }
  ]

  const fetchAboutData = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/about')
      const result = await response.json()
      
      if (result.success) {
        setAboutData(result.data)
        showSnackbar('Data loaded successfully', 'success')
      } else {
        showSnackbar(result.message || 'Failed to load data', 'error')
      }
    } catch (error: any) {
      console.error('Error:', error)
      showSnackbar(error.message || 'Network error', 'error')
    } finally {
      setLoading(false)
    }
  }

  const saveData = async (section: string, data: any) => {
    try {
      setSaving(true)
      const response = await fetch('/api/admin/about', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section, updates: data })
      })
      
      const result = await response.json()
      
      if (result.success) {
        setAboutData((prev: any) => ({
          ...prev,
          [section]: data
        }))
        showSnackbar(`${section} saved successfully!`, 'success')
        return true
      } else {
        showSnackbar(result.message || 'Failed to save', 'error')
        return false
      }
    } catch (error: any) {
      console.error('Error:', error)
      showSnackbar(error.message || 'Network error', 'error')
      return false
    } finally {
      setSaving(false)
    }
  }

  const saveAllData = async () => {
    if (!aboutData) return
    
    try {
      setSaving(true)
      const response = await fetch('/api/admin/about', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(aboutData)
      })
      
      const result = await response.json()
      
      if (result.success) {
        showSnackbar('All data saved successfully!', 'success')
      } else {
        showSnackbar(result.message || 'Failed to save', 'error')
      }
    } catch (error: any) {
      console.error('Error:', error)
      showSnackbar(error.message || 'Network error', 'error')
    } finally {
      setSaving(false)
    }
  }

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity })
  }

  useEffect(() => {
    fetchAboutData()
  }, [])

  if (loading && !aboutData) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    )
  }

  const renderTabContent = () => {
    if (!aboutData) return null
    
    const currentTab = tabs[activeTab].key
    
    switch (currentTab) {
      case 'company':
        return (
          <CompanyTab
            data={aboutData}
            onSave={(data) => saveData('company', data)}
            saving={saving}
          />
        )
      case 'contact':
        return (
          <ContactTab
            data={aboutData.contact || {}}
            onSave={(data) => saveData('contact', data)}
            saving={saving}
          />
        )
      case 'social':
        return (
          <SocialTab
            data={aboutData.socialMedia || {}}
            onSave={(data) => saveData('socialMedia', data)}
            saving={saving}
          />
        )
      case 'labels':
        return (
          <LabelsTab
            data={aboutData.labels || {}}
            onSave={(data) => saveData('labels', data)}
            saving={saving}
          />
        )
      case 'seo':
        return (
          <SeoTab
            data={aboutData.seo || {}}
            onSave={(data) => saveData('seo', data)}
            saving={saving}
          />
        )
      case 'theme':
        return (
          <ThemeTab
            data={aboutData.theme || {}}
            onSave={(data) => saveData('theme', data)}
            saving={saving}
          />
        )
      case 'system':
        return (
          <SystemTab
            data={aboutData.system || {}}
            onSave={(data) => saveData('system', data)}
            saving={saving}
          />
        )
      default:
        return null
    }
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            ⚙️ About & Settings
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage company information and labels
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={fetchAboutData}
            disabled={saving || loading}
          >
            Refresh
          </Button>
          <AdminButton
            startIcon={<Save />}
            onClick={saveAllData}
            disabled={saving || loading || !aboutData}
          >
            {saving ? 'Saving...' : 'Save All'}
          </AdminButton>
        </Box>
      </Box>

      <AdminCard>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs 
            value={activeTab} 
            onChange={(_, newValue) => setActiveTab(newValue)}
            variant="scrollable"
            scrollButtons="auto"
          >
            {tabs.map((tab, index) => (
              <Tab 
                key={index} 
                label={tab.label}
                icon={tab.icon}
                iconPosition="start"
              />
            ))}
          </Tabs>
        </Box>

        <Box sx={{ mt: 3 }}>
          {renderTabContent()}
        </Box>
      </AdminCard>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
      />
    </Box>
  )
}