import { useState } from 'react'
import { Box, Typography } from '@mui/material'
import { Mail, Phone, LocationOn, AccessTime } from '@mui/icons-material'
import AdminButton from '@/components/ui/admin/AdminButton'
import AdminTextField from '@/components/ui/admin/AdminTextField'

interface ContactTabProps {
  data: any
  onSave: (data: any) => Promise<boolean>
  saving: boolean
}

export default function ContactTab({ data, onSave, saving }: ContactTabProps) {
  const [formData, setFormData] = useState({
    email: data.email || '',
    phone: data.phone || '',
    address: data.address || '',
    workingHours: data.workingHours || 'Mon-Fri, 9AM-6PM',
    supportHours: data.supportHours || '24/7'
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
        <Typography variant="h6" gutterBottom>Contact Information</Typography>
        <Typography variant="body2" color="text.secondary">
          Update contact details that users can use to reach you
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, width: '100%' }}>
          <AdminTextField
            label="Email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            sx={{ flex: 1 }}
            InputProps={{
              startAdornment: <Mail sx={{ mr: 1, color: 'action.active' }} />,
            }}
          />

          <AdminTextField
            label="Phone"
            value={formData.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            sx={{ flex: 1 }}
            InputProps={{
              startAdornment: <Phone sx={{ mr: 1, color: 'action.active' }} />,
            }}
          />
        </Box>

        <AdminTextField
          label="Address"
          value={formData.address}
          onChange={(e) => handleChange('address', e.target.value)}
          multiline
          rows={3}
          fullWidth
          InputProps={{
            startAdornment: <LocationOn sx={{ mr: 1, color: 'action.active', alignSelf: 'flex-start', mt: 1 }} />,
          }}
        />

        <Box sx={{ display: 'flex', gap: 2, width: '100%' }}>
          <AdminTextField
            label="Working Hours"
            value={formData.workingHours}
            onChange={(e) => handleChange('workingHours', e.target.value)}
            sx={{ flex: 1 }}
            InputProps={{
              startAdornment: <AccessTime sx={{ mr: 1, color: 'action.active' }} />,
            }}
          />

          <AdminTextField
            label="Support Hours"
            value={formData.supportHours}
            onChange={(e) => handleChange('supportHours', e.target.value)}
            sx={{ flex: 1 }}
            InputProps={{
              startAdornment: <AccessTime sx={{ mr: 1, color: 'action.active' }} />,
            }}
          />
        </Box>
      </Box>
      
      <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
        <AdminButton onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : 'Save Contact Info'}
        </AdminButton>
      </Box>
    </Box>
  )
}