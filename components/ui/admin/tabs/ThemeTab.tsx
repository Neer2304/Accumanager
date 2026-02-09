import { useState } from 'react'
import { Box, Typography } from '@mui/material'
import { ColorLens } from '@mui/icons-material'
import AdminButton from '@/components/ui/admin/AdminButton'
import AdminTextField from '@/components/ui/admin/AdminTextField'

interface ThemeTabProps {
  data: any
  onSave: (data: any) => Promise<boolean>
  saving: boolean
}

export default function ThemeTab({ data, onSave, saving }: ThemeTabProps) {
  const [formData, setFormData] = useState({
    primaryColor: data.primaryColor || '#4285f4',
    secondaryColor: data.secondaryColor || '#34a853',
    accentColor: data.accentColor || '#ea4335',
    backgroundColor: data.backgroundColor || '#ffffff',
    textColor: data.textColor || '#333333',
    fontFamily: data.fontFamily || 'Inter, sans-serif',
    borderRadius: data.borderRadius || '8px'
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
        <Typography variant="h6" gutterBottom>Theme Settings</Typography>
        <Typography variant="body2" color="text.secondary">
          Customize the look and feel of your application
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <AdminTextField
            label="Primary Color"
            value={formData.primaryColor}
            onChange={(e) => handleChange('primaryColor', e.target.value)}
            sx={{ flex: 1 }}
            type="color"
          />
          <Box sx={{ width: 40, height: 40, bgcolor: formData.primaryColor, borderRadius: 1, border: '1px solid #ddd' }} />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <AdminTextField
            label="Secondary Color"
            value={formData.secondaryColor}
            onChange={(e) => handleChange('secondaryColor', e.target.value)}
            sx={{ flex: 1 }}
            type="color"
          />
          <Box sx={{ width: 40, height: 40, bgcolor: formData.secondaryColor, borderRadius: 1, border: '1px solid #ddd' }} />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <AdminTextField
            label="Accent Color"
            value={formData.accentColor}
            onChange={(e) => handleChange('accentColor', e.target.value)}
            sx={{ flex: 1 }}
            type="color"
          />
          <Box sx={{ width: 40, height: 40, bgcolor: formData.accentColor, borderRadius: 1, border: '1px solid #ddd' }} />
        </Box>

        <AdminTextField
          label="Font Family"
          value={formData.fontFamily}
          onChange={(e) => handleChange('fontFamily', e.target.value)}
          fullWidth
          helperText="e.g., 'Inter, sans-serif', 'Roboto, sans-serif'"
        />

        <AdminTextField
          label="Border Radius"
          value={formData.borderRadius}
          onChange={(e) => handleChange('borderRadius', e.target.value)}
          fullWidth
          helperText="e.g., 8px, 0.5rem, 4px"
        />
      </Box>

      <Box sx={{ mt: 4, p: 3, borderRadius: formData.borderRadius, bgcolor: formData.backgroundColor, color: formData.textColor, border: '1px solid #e0e0e0' }}>
        <Typography variant="subtitle1" fontWeight="bold" sx={{ color: formData.primaryColor, mb: 1 }}>
          Theme Preview
        </Typography>
        <Typography variant="body2" sx={{ mb: 2, color: formData.textColor }}>
          This is how your theme will look with the selected colors.
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Box sx={{ px: 2, py: 1, bgcolor: formData.primaryColor, color: 'white', borderRadius: formData.borderRadius, fontSize: '14px' }}>
            Primary Button
          </Box>
          <Box sx={{ px: 2, py: 1, bgcolor: formData.secondaryColor, color: 'white', borderRadius: formData.borderRadius, fontSize: '14px' }}>
            Secondary Button
          </Box>
          <Box sx={{ px: 2, py: 1, bgcolor: formData.accentColor, color: 'white', borderRadius: formData.borderRadius, fontSize: '14px' }}>
            Accent Button
          </Box>
        </Box>
      </Box>
      
      <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
        <AdminButton onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : 'Save Theme Settings'}
        </AdminButton>
      </Box>
    </Box>
  )
}