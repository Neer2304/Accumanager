import { useState } from 'react'
import { Box, Typography } from '@mui/material'
import AdminButton from '@/components/ui/admin/AdminButton'
import AdminTextField from '@/components/ui/admin/AdminTextField'

interface SeoTabProps {
  data: any
  onSave: (data: any) => Promise<boolean>
  saving: boolean
}

export default function SeoTab({ data, onSave, saving }: SeoTabProps) {
  const [formData, setFormData] = useState({
    metaTitle: data.metaTitle || '',
    metaDescription: data.metaDescription || '',
    metaKeywords: Array.isArray(data.metaKeywords) ? data.metaKeywords.join(', ') : data.metaKeywords || '',
    ogTitle: data.ogTitle || '',
    ogDescription: data.ogDescription || '',
    ogImage: data.ogImage || ''
  })

  const handleSave = async () => {
    const dataToSave = {
      ...formData,
      metaKeywords: formData.metaKeywords.split(',').map((k: string) => k.trim()).filter((k: string) => k)
    }
    await onSave(dataToSave)
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>SEO Settings</Typography>
        <Typography variant="body2" color="text.secondary">
          Configure search engine optimization settings
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <AdminTextField
          label="Meta Title"
          value={formData.metaTitle}
          onChange={(e) => handleChange('metaTitle', e.target.value)}
          fullWidth
          helperText="Title tag shown in search results (50-60 characters recommended)"
        />

        <AdminTextField
          label="Meta Description"
          value={formData.metaDescription}
          onChange={(e) => handleChange('metaDescription', e.target.value)}
          multiline
          rows={3}
          fullWidth
          helperText="Description shown in search results (150-160 characters recommended)"
        />

        <AdminTextField
          label="Meta Keywords"
          value={formData.metaKeywords}
          onChange={(e) => handleChange('metaKeywords', e.target.value)}
          fullWidth
          helperText="Comma separated keywords (e.g., admin, dashboard, management)"
        />

        <Box sx={{ display: 'flex', gap: 2, width: '100%' }}>
          <AdminTextField
            label="OG Title"
            value={formData.ogTitle}
            onChange={(e) => handleChange('ogTitle', e.target.value)}
            sx={{ flex: 1 }}
            helperText="Open Graph title for social media"
          />

          <AdminTextField
            label="OG Image URL"
            value={formData.ogImage}
            onChange={(e) => handleChange('ogImage', e.target.value)}
            sx={{ flex: 1 }}
            helperText="Image shown when shared on social media"
          />
        </Box>

        <AdminTextField
          label="OG Description"
          value={formData.ogDescription}
          onChange={(e) => handleChange('ogDescription', e.target.value)}
          multiline
          rows={2}
          fullWidth
          helperText="Open Graph description for social media"
        />
      </Box>
      
      <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
        <AdminButton onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : 'Save SEO Settings'}
        </AdminButton>
      </Box>
    </Box>
  )
}