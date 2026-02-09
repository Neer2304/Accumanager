import { useState } from 'react'
import { Box, Typography } from '@mui/material'
import { Facebook, Twitter, Instagram, LinkedIn, YouTube, GitHub } from '@mui/icons-material'
import AdminButton from '@/components/ui/admin/AdminButton'
import AdminTextField from '@/components/ui/admin/AdminTextField'

interface SocialTabProps {
  data: any
  onSave: (data: any) => Promise<boolean>
  saving: boolean
}

export default function SocialTab({ data, onSave, saving }: SocialTabProps) {
  const [formData, setFormData] = useState({
    facebook: data.facebook || '',
    twitter: data.twitter || '',
    instagram: data.instagram || '',
    linkedin: data.linkedin || '',
    youtube: data.youtube || '',
    github: data.github || ''
  })

  const handleSave = async () => {
    await onSave(formData)
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const socialIcons = {
    facebook: <Facebook sx={{ color: '#1877F2' }} />,
    twitter: <Twitter sx={{ color: '#1DA1F2' }} />,
    instagram: <Instagram sx={{ color: '#E4405F' }} />,
    linkedin: <LinkedIn sx={{ color: '#0A66C2' }} />,
    youtube: <YouTube sx={{ color: '#FF0000' }} />,
    github: <GitHub sx={{ color: '#181717' }} />
  }

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>Social Media Links</Typography>
        <Typography variant="body2" color="text.secondary">
          Add links to your social media profiles
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {Object.entries(formData).map(([key, value]) => (
          <AdminTextField
            key={key}
            label={key.charAt(0).toUpperCase() + key.slice(1)}
            value={value as string}
            onChange={(e) => handleChange(key, e.target.value)}
            fullWidth
            InputProps={{
              startAdornment: <Box sx={{ mr: 1 }}>{socialIcons[key as keyof typeof socialIcons]}</Box>,
            }}
            placeholder={`https://${key}.com/yourusername`}
          />
        ))}
      </Box>
      
      <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
        <AdminButton onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : 'Save Social Links'}
        </AdminButton>
      </Box>
    </Box>
  )
}