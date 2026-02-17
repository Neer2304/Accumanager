import { useState } from 'react'
import { Box, Typography } from '@mui/material'
import AdminButton from '@/components/ui/admin/AdminButton'
import AdminTextField from '@/components/ui/admin/AdminTextField'

interface LabelsTabProps {
  data: any
  onSave: (data: any) => Promise<boolean>
  saving: boolean
}

export default function LabelsTab({ data, onSave, saving }: LabelsTabProps) {
  const [formData, setFormData] = useState({
    // General Labels
    appName: data.appName || '',
    dashboard: data.dashboard || '',
    profile: data.profile || '',
    settings: data.settings || '',
    logout: data.logout || '',
    login: data.login || '',
    register: data.register || '',
    save: data.save || '',
    cancel: data.cancel || '',
    delete: data.delete || '',
    edit: data.edit || '',
    view: data.view || '',
    
    // Dashboard Labels
    welcomeMessage: data.welcomeMessage || '',
    totalUsers: data.totalUsers || '',
    totalRevenue: data.totalRevenue || '',
    activeSubscriptions: data.activeSubscriptions || '',
    recentActivities: data.recentActivities || '',
    
    // Button Labels
    createNew: data.createNew || '',
    viewDetails: data.viewDetails || '',
    downloadReport: data.downloadReport || '',
    exportData: data.exportData || '',
    importData: data.importData || '',
    
    // Form Labels
    name: data.name || '',
    email: data.email || '',
    password: data.password || '',
    confirmPassword: data.confirmPassword || '',
    phone: data.phone || '',
    address: data.address || '',
    
    // Status Labels
    active: data.active || '',
    inactive: data.inactive || '',
    pending: data.pending || '',
    completed: data.completed || '',
    draft: data.draft || ''
  })

  const handleSave = async () => {
    await onSave(formData)
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>Application Labels</Typography>
        <Typography variant="body2" color="text.secondary">
          Customize all text labels used throughout the application
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>General Labels</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <AdminTextField
                label="App Name"
                value={formData.appName}
                onChange={(e) => handleChange('appName', e.target.value)}
                sx={{ flex: 1 }}
              />
              <AdminTextField
                label="Dashboard"
                value={formData.dashboard}
                onChange={(e) => handleChange('dashboard', e.target.value)}
                sx={{ flex: 1 }}
              />
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <AdminTextField
                label="Save Button"
                value={formData.save}
                onChange={(e) => handleChange('save', e.target.value)}
                sx={{ flex: 1 }}
              />
              <AdminTextField
                label="Cancel Button"
                value={formData.cancel}
                onChange={(e) => handleChange('cancel', e.target.value)}
                sx={{ flex: 1 }}
              />
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <AdminTextField
                label="Edit"
                value={formData.edit}
                onChange={(e) => handleChange('edit', e.target.value)}
                sx={{ flex: 1 }}
              />
              <AdminTextField
                label="Delete"
                value={formData.delete}
                onChange={(e) => handleChange('delete', e.target.value)}
                sx={{ flex: 1 }}
              />
            </Box>
          </Box>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>Dashboard Labels</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <AdminTextField
              label="Welcome Message"
              value={formData.welcomeMessage}
              onChange={(e) => handleChange('welcomeMessage', e.target.value)}
              fullWidth
            />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <AdminTextField
                label="Total Users"
                value={formData.totalUsers}
                onChange={(e) => handleChange('totalUsers', e.target.value)}
                sx={{ flex: 1 }}
              />
              <AdminTextField
                label="Total Revenue"
                value={formData.totalRevenue}
                onChange={(e) => handleChange('totalRevenue', e.target.value)}
                sx={{ flex: 1 }}
              />
            </Box>
          </Box>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>Form Labels</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <AdminTextField
                label="Name Field"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                sx={{ flex: 1 }}
              />
              <AdminTextField
                label="Email Field"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                sx={{ flex: 1 }}
              />
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <AdminTextField
                label="Phone Field"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                sx={{ flex: 1 }}
              />
              <AdminTextField
                label="Address Field"
                value={formData.address}
                onChange={(e) => handleChange('address', e.target.value)}
                sx={{ flex: 1 }}
              />
            </Box>
          </Box>
        </Box>
      </Box>
      
      <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
        <AdminButton onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : 'Save Labels'}
        </AdminButton>
      </Box>
    </Box>
  )
}