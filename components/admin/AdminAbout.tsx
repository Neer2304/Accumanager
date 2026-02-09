'use client'

import { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Paper,
  Tabs,
  Tab,
  Grid,
  Card,
  CardContent,
  Alert,
  CircularProgress,
  IconButton,
  Snackbar,
  Divider,
  InputAdornment
} from '@mui/material'
import {
  Save,
  Refresh,
  Add,
  Delete,
  ColorLens,
  Language,
  Security,
  Mail,
  Phone,
  LocationOn,
  Facebook,
  Twitter,
  Instagram,
  LinkedIn,
  YouTube,
  GitHub
} from '@mui/icons-material'

// Import Admin Components
import AdminButton from '@/components/ui/admin/AdminButton'
import AdminCard from '@/components/ui/admin/AdminCard'
import AdminTextField from '@/components/ui/admin/AdminTextField'
import AdminSelect from '@/components/ui/admin/AdminSelect'

export default function AdminAboutPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState(0)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  
  // Form Data States
  const [companyData, setCompanyData] = useState({
    companyName: '',
    companySlogan: '',
    companyDescription: '',
    companyLogo: '',
    companyFavicon: '',
    foundedYear: new Date().getFullYear()
  })
  
  const [contactData, setContactData] = useState({
    email: '',
    phone: '',
    address: '',
    workingHours: 'Mon-Fri, 9AM-6PM',
    supportHours: '24/7'
  })
  
  const [socialData, setSocialData] = useState({
    facebook: '',
    twitter: '',
    instagram: '',
    linkedin: '',
    youtube: '',
    github: ''
  })
  
  const [labelsData, setLabelsData] = useState({
    // General Labels
    appName: '',
    dashboard: '',
    profile: '',
    settings: '',
    logout: '',
    login: '',
    register: '',
    save: '',
    cancel: '',
    delete: '',
    edit: '',
    view: '',
    
    // Dashboard Labels
    welcomeMessage: '',
    totalUsers: '',
    totalRevenue: '',
    activeSubscriptions: '',
    recentActivities: '',
    
    // Button Labels
    createNew: '',
    viewDetails: '',
    downloadReport: '',
    exportData: '',
    importData: '',
    
    // Form Labels
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
    
    // Status Labels
    active: '',
    inactive: '',
    pending: '',
    completed: '',
    draft: ''
  })
  
  const [seoData, setSeoData] = useState({
    metaTitle: '',
    metaDescription: '',
    metaKeywords: '',
    ogTitle: '',
    ogDescription: '',
    ogImage: ''
  })
  
  const [themeData, setThemeData] = useState({
    primaryColor: '#4285f4',
    secondaryColor: '#34a853',
    accentColor: '#ea4335',
    backgroundColor: '#ffffff',
    textColor: '#333333',
    fontFamily: 'Inter, sans-serif',
    borderRadius: '8px'
  })
  
  const [systemData, setSystemData] = useState({
    timezone: 'UTC',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: 'hh:mm A',
    currency: 'INR',
    currencySymbol: '₹',
    language: 'en',
    itemsPerPage: 10,
    enableRegistration: true,
    enableEmailVerification: false,
    maintenanceMode: false
  })

  // Fetch existing data
  const fetchAboutData = async () => {
    try {
      setLoading(true)
      setErrorMessage('')
      
      const response = await fetch('/api/admin/about')
      const result = await response.json()
      
      if (result.success && result.data) {
        const data = result.data
        
        // Populate form states with existing data
        if (data.companyName) setCompanyData({
          companyName: data.companyName || '',
          companySlogan: data.companySlogan || '',
          companyDescription: data.companyDescription || '',
          companyLogo: data.companyLogo || '',
          companyFavicon: data.companyFavicon || '',
          foundedYear: data.foundedYear || new Date().getFullYear()
        })
        
        if (data.contact) setContactData({
          email: data.contact?.email || '',
          phone: data.contact?.phone || '',
          address: data.contact?.address || '',
          workingHours: data.contact?.workingHours || 'Mon-Fri, 9AM-6PM',
          supportHours: data.contact?.supportHours || '24/7'
        })
        
        if (data.socialMedia) setSocialData({
          facebook: data.socialMedia?.facebook || '',
          twitter: data.socialMedia?.twitter || '',
          instagram: data.socialMedia?.instagram || '',
          linkedin: data.socialMedia?.linkedin || '',
          youtube: data.socialMedia?.youtube || '',
          github: data.socialMedia?.github || ''
        })
        
        if (data.labels) {
          setLabelsData({
            appName: data.labels?.appName || '',
            dashboard: data.labels?.dashboard || '',
            profile: data.labels?.profile || '',
            settings: data.labels?.settings || '',
            logout: data.labels?.logout || '',
            login: data.labels?.login || '',
            register: data.labels?.register || '',
            save: data.labels?.save || '',
            cancel: data.labels?.cancel || '',
            delete: data.labels?.delete || '',
            edit: data.labels?.edit || '',
            view: data.labels?.view || '',
            welcomeMessage: data.labels?.welcomeMessage || '',
            totalUsers: data.labels?.totalUsers || '',
            totalRevenue: data.labels?.totalRevenue || '',
            activeSubscriptions: data.labels?.activeSubscriptions || '',
            recentActivities: data.labels?.recentActivities || '',
            createNew: data.labels?.createNew || '',
            viewDetails: data.labels?.viewDetails || '',
            downloadReport: data.labels?.downloadReport || '',
            exportData: data.labels?.exportData || '',
            importData: data.labels?.importData || '',
            name: data.labels?.name || '',
            email: data.labels?.email || '',
            password: data.labels?.password || '',
            confirmPassword: data.labels?.confirmPassword || '',
            phone: data.labels?.phone || '',
            address: data.labels?.address || '',
            active: data.labels?.active || '',
            inactive: data.labels?.inactive || '',
            pending: data.labels?.pending || '',
            completed: data.labels?.completed || '',
            draft: data.labels?.draft || ''
          })
        }
        
        if (data.seo) setSeoData({
          metaTitle: data.seo?.metaTitle || '',
          metaDescription: data.seo?.metaDescription || '',
          metaKeywords: data.seo?.metaKeywords?.join(', ') || '',
          ogTitle: data.seo?.ogTitle || '',
          ogDescription: data.seo?.ogDescription || '',
          ogImage: data.seo?.ogImage || ''
        })
        
        if (data.theme) setThemeData({
          primaryColor: data.theme?.primaryColor || '#4285f4',
          secondaryColor: data.theme?.secondaryColor || '#34a853',
          accentColor: data.theme?.accentColor || '#ea4335',
          backgroundColor: data.theme?.backgroundColor || '#ffffff',
          textColor: data.theme?.textColor || '#333333',
          fontFamily: data.theme?.fontFamily || 'Inter, sans-serif',
          borderRadius: data.theme?.borderRadius || '8px'
        })
        
        if (data.system) setSystemData({
          timezone: data.system?.timezone || 'UTC',
          dateFormat: data.system?.dateFormat || 'MM/DD/YYYY',
          timeFormat: data.system?.timeFormat || 'hh:mm A',
          currency: data.system?.currency || 'INR',
          currencySymbol: data.system?.currencySymbol || '₹',
          language: data.system?.language || 'en',
          itemsPerPage: data.system?.itemsPerPage || 10,
          enableRegistration: data.system?.enableRegistration !== false,
          enableEmailVerification: data.system?.enableEmailVerification || false,
          maintenanceMode: data.system?.maintenanceMode || false
        })
        
        setSuccessMessage('Data loaded successfully')
      } else {
        setErrorMessage(result.message || 'Failed to load data')
      }
    } catch (error: any) {
      console.error('Error fetching about data:', error)
      setErrorMessage(error.message || 'Network error')
    } finally {
      setLoading(false)
    }
  }

  // Save data
  const saveData = async (section: string, data: any) => {
    try {
      setSaving(true)
      setErrorMessage('')
      
      const response = await fetch('/api/admin/about', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          section,
          updates: data
        })
      })
      
      const result = await response.json()
      
      if (result.success) {
        setSuccessMessage(`${section} saved successfully!`)
        return true
      } else {
        setErrorMessage(result.message || `Failed to save ${section}`)
        return false
      }
    } catch (error: any) {
      console.error(`Error saving ${section}:`, error)
      setErrorMessage(error.message || 'Network error')
      return false
    } finally {
      setSaving(false)
    }
  }

  // Save all data at once
  const saveAllData = async () => {
    try {
      setSaving(true)
      setErrorMessage('')
      
      const allData = {
        companyName: companyData.companyName,
        companySlogan: companyData.companySlogan,
        companyDescription: companyData.companyDescription,
        companyLogo: companyData.companyLogo,
        companyFavicon: companyData.companyFavicon,
        foundedYear: companyData.foundedYear,
        contact: contactData,
        socialMedia: socialData,
        labels: labelsData,
        seo: {
          ...seoData,
          metaKeywords: seoData.metaKeywords.split(',').map(k => k.trim()).filter(k => k)
        },
        theme: themeData,
        system: systemData
      }
      
      const response = await fetch('/api/admin/about', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(allData)
      })
      
      const result = await response.json()
      
      if (result.success) {
        setSuccessMessage('All data saved successfully!')
      } else {
        setErrorMessage(result.message || 'Failed to save data')
      }
    } catch (error: any) {
      console.error('Error saving all data:', error)
      setErrorMessage(error.message || 'Network error')
    } finally {
      setSaving(false)
    }
  }

  // Reset to defaults
  const resetData = async () => {
    if (!confirm('Are you sure you want to reset all data to defaults?')) return
    
    try {
      setLoading(true)
      setErrorMessage('')
      
      const response = await fetch('/api/admin/about', {
        method: 'DELETE'
      })
      
      const result = await response.json()
      
      if (result.success) {
        setSuccessMessage('Data reset to defaults successfully')
        fetchAboutData() // Reload default data
      } else {
        setErrorMessage(result.message || 'Failed to reset data')
      }
    } catch (error: any) {
      console.error('Error resetting data:', error)
      setErrorMessage(error.message || 'Network error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAboutData()
  }, [])

  // Tab panels
  const tabs = [
    { label: 'Company', key: 'company' },
    { label: 'Contact', key: 'contact' },
    { label: 'Social Media', key: 'social' },
    { label: 'Labels', key: 'labels' },
    { label: 'SEO', key: 'seo' },
    { label: 'Theme', key: 'theme' },
    { label: 'System', key: 'system' }
  ]

  // Render current tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 0: // Company
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <AdminTextField
                label="Company Name"
                value={companyData.companyName}
                onChange={(e) => setCompanyData({...companyData, companyName: e.target.value})}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <AdminTextField
                label="Company Slogan"
                value={companyData.companySlogan}
                onChange={(e) => setCompanyData({...companyData, companySlogan: e.target.value})}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <AdminTextField
                label="Company Description"
                value={companyData.companyDescription}
                onChange={(e) => setCompanyData({...companyData, companyDescription: e.target.value})}
                multiline
                rows={4}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <AdminTextField
                label="Logo URL"
                value={companyData.companyLogo}
                onChange={(e) => setCompanyData({...companyData, companyLogo: e.target.value})}
                fullWidth
                placeholder="/logo.png"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <AdminTextField
                label="Favicon URL"
                value={companyData.companyFavicon}
                onChange={(e) => setCompanyData({...companyData, companyFavicon: e.target.value})}
                fullWidth
                placeholder="/favicon.ico"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <AdminTextField
                label="Founded Year"
                type="number"
                value={companyData.foundedYear}
                onChange={(e) => setCompanyData({...companyData, foundedYear: parseInt(e.target.value) || 2024})}
                fullWidth
              />
            </Grid>
          </Grid>
        )
      
      case 1: // Contact
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <AdminTextField
                label="Email"
                value={contactData.email}
                onChange={(e) => setContactData({...contactData, email: e.target.value})}
                fullWidth
                InputProps={{
                  startAdornment: <InputAdornment position="start"><Mail /></InputAdornment>,
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <AdminTextField
                label="Phone"
                value={contactData.phone}
                onChange={(e) => setContactData({...contactData, phone: e.target.value})}
                fullWidth
                InputProps={{
                  startAdornment: <InputAdornment position="start"><Phone /></InputAdornment>,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <AdminTextField
                label="Address"
                value={contactData.address}
                onChange={(e) => setContactData({...contactData, address: e.target.value})}
                fullWidth
                multiline
                rows={2}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><LocationOn /></InputAdornment>,
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <AdminTextField
                label="Working Hours"
                value={contactData.workingHours}
                onChange={(e) => setContactData({...contactData, workingHours: e.target.value})}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <AdminTextField
                label="Support Hours"
                value={contactData.supportHours}
                onChange={(e) => setContactData({...contactData, supportHours: e.target.value})}
                fullWidth
              />
            </Grid>
          </Grid>
        )
      
      case 2: // Social Media
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <AdminTextField
                label="Facebook URL"
                value={socialData.facebook}
                onChange={(e) => setSocialData({...socialData, facebook: e.target.value})}
                fullWidth
                InputProps={{
                  startAdornment: <InputAdornment position="start"><Facebook /></InputAdornment>,
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <AdminTextField
                label="Twitter/X URL"
                value={socialData.twitter}
                onChange={(e) => setSocialData({...socialData, twitter: e.target.value})}
                fullWidth
                InputProps={{
                  startAdornment: <InputAdornment position="start"><Twitter /></InputAdornment>,
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <AdminTextField
                label="Instagram URL"
                value={socialData.instagram}
                onChange={(e) => setSocialData({...socialData, instagram: e.target.value})}
                fullWidth
                InputProps={{
                  startAdornment: <InputAdornment position="start"><Instagram /></InputAdornment>,
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <AdminTextField
                label="LinkedIn URL"
                value={socialData.linkedin}
                onChange={(e) => setSocialData({...socialData, linkedin: e.target.value})}
                fullWidth
                InputProps={{
                  startAdornment: <InputAdornment position="start"><LinkedIn /></InputAdornment>,
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <AdminTextField
                label="YouTube URL"
                value={socialData.youtube}
                onChange={(e) => setSocialData({...socialData, youtube: e.target.value})}
                fullWidth
                InputProps={{
                  startAdornment: <InputAdornment position="start"><YouTube /></InputAdornment>,
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <AdminTextField
                label="GitHub URL"
                value={socialData.github}
                onChange={(e) => setSocialData({...socialData, github: e.target.value})}
                fullWidth
                InputProps={{
                  startAdornment: <InputAdornment position="start"><GitHub /></InputAdornment>,
                }}
              />
            </Grid>
          </Grid>
        )
      
      case 3: // Labels
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>General Labels</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <AdminTextField
                label="App Name"
                value={labelsData.appName}
                onChange={(e) => setLabelsData({...labelsData, appName: e.target.value})}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <AdminTextField
                label="Dashboard"
                value={labelsData.dashboard}
                onChange={(e) => setLabelsData({...labelsData, dashboard: e.target.value})}
                fullWidth
              />
            </Grid>
            
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>Button Labels</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <AdminTextField
                label="Save"
                value={labelsData.save}
                onChange={(e) => setLabelsData({...labelsData, save: e.target.value})}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <AdminTextField
                label="Cancel"
                value={labelsData.cancel}
                onChange={(e) => setLabelsData({...labelsData, cancel: e.target.value})}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <AdminTextField
                label="Delete"
                value={labelsData.delete}
                onChange={(e) => setLabelsData({...labelsData, delete: e.target.value})}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <AdminTextField
                label="Edit"
                value={labelsData.edit}
                onChange={(e) => setLabelsData({...labelsData, edit: e.target.value})}
                fullWidth
              />
            </Grid>
            
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>Form Labels</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <AdminTextField
                label="Name"
                value={labelsData.name}
                onChange={(e) => setLabelsData({...labelsData, name: e.target.value})}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <AdminTextField
                label="Email"
                value={labelsData.email}
                onChange={(e) => setLabelsData({...labelsData, email: e.target.value})}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <AdminTextField
                label="Phone"
                value={labelsData.phone}
                onChange={(e) => setLabelsData({...labelsData, phone: e.target.value})}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <AdminTextField
                label="Address"
                value={labelsData.address}
                onChange={(e) => setLabelsData({...labelsData, address: e.target.value})}
                fullWidth
              />
            </Grid>
          </Grid>
        )
      
      case 4: // SEO
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <AdminTextField
                label="Meta Title"
                value={seoData.metaTitle}
                onChange={(e) => setSeoData({...seoData, metaTitle: e.target.value})}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <AdminTextField
                label="Meta Description"
                value={seoData.metaDescription}
                onChange={(e) => setSeoData({...seoData, metaDescription: e.target.value})}
                multiline
                rows={3}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <AdminTextField
                label="Meta Keywords (comma separated)"
                value={seoData.metaKeywords}
                onChange={(e) => setSeoData({...seoData, metaKeywords: e.target.value})}
                fullWidth
                helperText="e.g., admin, dashboard, management"
              />
            </Grid>
            <Grid item xs={12}>
              <AdminTextField
                label="OG Image URL"
                value={seoData.ogImage}
                onChange={(e) => setSeoData({...seoData, ogImage: e.target.value})}
                fullWidth
              />
            </Grid>
          </Grid>
        )
      
      case 5: // Theme
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <AdminTextField
                  label="Primary Color"
                  value={themeData.primaryColor}
                  onChange={(e) => setThemeData({...themeData, primaryColor: e.target.value})}
                  fullWidth
                  type="color"
                />
                <Box sx={{ width: 40, height: 40, bgcolor: themeData.primaryColor, borderRadius: 1 }} />
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <AdminTextField
                  label="Secondary Color"
                  value={themeData.secondaryColor}
                  onChange={(e) => setThemeData({...themeData, secondaryColor: e.target.value})}
                  fullWidth
                  type="color"
                />
                <Box sx={{ width: 40, height: 40, bgcolor: themeData.secondaryColor, borderRadius: 1 }} />
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <AdminTextField
                label="Font Family"
                value={themeData.fontFamily}
                onChange={(e) => setThemeData({...themeData, fontFamily: e.target.value})}
                fullWidth
                helperText="e.g., Inter, sans-serif"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <AdminTextField
                label="Border Radius"
                value={themeData.borderRadius}
                onChange={(e) => setThemeData({...themeData, borderRadius: e.target.value})}
                fullWidth
                helperText="e.g., 8px, 0.5rem"
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2" color="text.secondary">
                Preview:
              </Typography>
              <Box sx={{ 
                p: 3, 
                mt: 2, 
                borderRadius: themeData.borderRadius,
                bgcolor: themeData.backgroundColor,
                color: themeData.textColor,
                border: '1px solid',
                borderColor: 'divider'
              }}>
                <Typography variant="h6" color={themeData.primaryColor}>
                  Primary Color Preview
                </Typography>
                <Typography variant="body1" mt={1}>
                  This is how your theme will look with the selected colors.
                </Typography>
                <AdminButton sx={{ mt: 2 }}>
                  Example Button
                </AdminButton>
              </Box>
            </Grid>
          </Grid>
        )
      
      case 6: // System
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <AdminSelect
                label="Timezone"
                options={[
                  { value: 'UTC', label: 'UTC' },
                  { value: 'Asia/Kolkata', label: 'IST (India)' },
                  { value: 'America/New_York', label: 'EST (New York)' },
                  { value: 'Europe/London', label: 'GMT (London)' }
                ]}
                value={systemData.timezone}
                onChange={(e) => setSystemData({...systemData, timezone: e.target.value})}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <AdminSelect
                label="Currency"
                options={[
                  { value: 'INR', label: 'Indian Rupee (₹)' },
                  { value: 'USD', label: 'US Dollar ($)' },
                  { value: 'EUR', label: 'Euro (€)' },
                  { value: 'GBP', label: 'British Pound (£)' }
                ]}
                value={systemData.currency}
                onChange={(e) => setSystemData({...systemData, currency: e.target.value})}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <AdminSelect
                label="Date Format"
                options={[
                  { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
                  { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
                  { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' }
                ]}
                value={systemData.dateFormat}
                onChange={(e) => setSystemData({...systemData, dateFormat: e.target.value})}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <AdminTextField
                label="Items Per Page"
                type="number"
                value={systemData.itemsPerPage}
                onChange={(e) => setSystemData({...systemData, itemsPerPage: parseInt(e.target.value) || 10})}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={systemData.enableRegistration}
                    onChange={(e) => setSystemData({...systemData, enableRegistration: e.target.checked})}
                    color="primary"
                  />
                }
                label="Enable User Registration"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={systemData.maintenanceMode}
                    onChange={(e) => setSystemData({...systemData, maintenanceMode: e.target.checked})}
                    color="warning"
                  />
                }
                label="Maintenance Mode"
              />
            </Grid>
          </Grid>
        )
      
      default:
        return null
    }
  }

  // Save current tab
  const saveCurrentTab = async () => {
    let section = tabs[activeTab].key
    let data: any
    
    switch (activeTab) {
      case 0: data = companyData; break
      case 1: data = contactData; break
      case 2: data = socialData; break
      case 3: data = labelsData; break
      case 4: data = {
        ...seoData,
        metaKeywords: seoData.metaKeywords.split(',').map(k => k.trim()).filter(k => k)
      }; break
      case 5: data = themeData; break
      case 6: data = systemData; break
      default: data = {}
    }
    
    if (section === 'company') {
      // For company, we need to map to root fields
      const updates: any = {}
      Object.keys(data).forEach(key => {
        updates[key] = data[key]
      })
      await saveData('', updates)
    } else if (section === 'labels') {
      // Save labels specifically
      await saveData('labels', data)
    } else {
      await saveData(section, data)
    }
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={4}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            ⚙️ About & Settings
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage company information, labels, and system settings
          </Typography>
        </Box>
        <Box display="flex" gap={2}>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={fetchAboutData}
            disabled={saving}
          >
            Refresh
          </Button>
          <AdminButton
            startIcon={<Save />}
            onClick={saveAllData}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save All'}
          </AdminButton>
        </Box>
      </Box>

      {errorMessage && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setErrorMessage('')}>
          {errorMessage}
        </Alert>
      )}

      {successMessage && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccessMessage('')}>
          {successMessage}
        </Alert>
      )}

      <AdminCard>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs 
            value={activeTab} 
            onChange={(_, newValue) => setActiveTab(newValue)}
            variant="scrollable"
            scrollButtons="auto"
          >
            {tabs.map((tab, index) => (
              <Tab key={index} label={tab.label} />
            ))}
          </Tabs>
        </Box>

        <Box sx={{ mt: 3 }}>
          {renderTabContent()}
        </Box>

        <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'space-between' }}>
          <Box display="flex" gap={2}>
            <AdminButton
              startIcon={<Save />}
              onClick={saveCurrentTab}
              disabled={saving}
            >
              {saving ? 'Saving...' : `Save ${tabs[activeTab].label}`}
            </AdminButton>
            <Button
              variant="outlined"
              onClick={() => fetchAboutData()}
              disabled={saving}
            >
              Reset Changes
            </Button>
          </Box>
          
          <Button
            color="error"
            variant="outlined"
            onClick={resetData}
            disabled={saving || loading}
          >
            Reset All to Defaults
          </Button>
        </Box>
      </AdminCard>
    </Box>
  )
}