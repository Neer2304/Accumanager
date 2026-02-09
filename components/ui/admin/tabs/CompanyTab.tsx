import { useState } from 'react'
import { Box, Typography } from '@mui/material'
import AdminButton from '@/components/ui/admin/AdminButton'
import AdminTextField from '@/components/ui/admin/AdminTextField'

interface CompanyTabProps {
  data: any
  onSave: (data: any) => Promise<boolean>
  saving: boolean
}

export default function CompanyTab({ data, onSave, saving }: CompanyTabProps) {
  const [formData, setFormData] = useState({
    companyName: data.companyName || '',
    companySlogan: data.companySlogan || '',
    companyDescription: data.companyDescription || '',
    companyLogo: data.companyLogo || '',
    companyFavicon: data.companyFavicon || '',
    foundedYear: data.foundedYear || new Date().getFullYear()
  })

  const handleSave = async () => {
    await onSave(formData)
  }

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>Company Information</Typography>
        <Typography variant="body2" color="text.secondary">
          Update your company details that appear throughout the application
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <AdminTextField
          label="Company Name"
          value={formData.companyName}
          onChange={(e) => handleChange('companyName', e.target.value)}
          fullWidth
        />

        <AdminTextField
          label="Company Slogan"
          value={formData.companySlogan}
          onChange={(e) => handleChange('companySlogan', e.target.value)}
          fullWidth
        />

        <AdminTextField
          label="Company Description"
          value={formData.companyDescription}
          onChange={(e) => handleChange('companyDescription', e.target.value)}
          multiline
          rows={4}
          fullWidth
        />

        <Box sx={{ display: 'flex', gap: 2, width: '100%' }}>
          <AdminTextField
            label="Logo URL"
            value={formData.companyLogo}
            onChange={(e) => handleChange('companyLogo', e.target.value)}
            sx={{ flex: 1 }}
          />

          <AdminTextField
            label="Favicon URL"
            value={formData.companyFavicon}
            onChange={(e) => handleChange('companyFavicon', e.target.value)}
            sx={{ flex: 1 }}
          />
        </Box>

        <AdminTextField
          label="Founded Year"
          type="number"
          value={formData.foundedYear}
          onChange={(e) => handleChange('foundedYear', parseInt(e.target.value) || new Date().getFullYear())}
          fullWidth
        />
      </Box>
      
      <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
        <AdminButton onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : 'Save Company Info'}
        </AdminButton>
      </Box>
    </Box>
  )
}