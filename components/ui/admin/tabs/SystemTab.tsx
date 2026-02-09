import { useState } from 'react'
import { Box, Typography, Switch, FormControlLabel } from '@mui/material'
import { Language, CurrencyExchange, CalendarToday, Security } from '@mui/icons-material'
import AdminButton from '@/components/ui/admin/AdminButton'
import AdminTextField from '@/components/ui/admin/AdminTextField'
import AdminSelect from '@/components/ui/admin/AdminSelect'

interface SystemTabProps {
  data: any
  onSave: (data: any) => Promise<boolean>
  saving: boolean
}

export default function SystemTab({ data, onSave, saving }: SystemTabProps) {
  const [formData, setFormData] = useState({
    timezone: data.timezone || 'UTC',
    dateFormat: data.dateFormat || 'MM/DD/YYYY',
    timeFormat: data.timeFormat || 'hh:mm A',
    currency: data.currency || 'USD',
    currencySymbol: data.currencySymbol || '$',
    language: data.language || 'en',
    itemsPerPage: data.itemsPerPage || 10,
    enableRegistration: data.enableRegistration !== false,
    maintenanceMode: data.maintenanceMode || false
  })

  const handleSave = async () => {
    await onSave(formData)
  }

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>System Settings</Typography>
        <Typography variant="body2" color="text.secondary">
          Configure system-wide settings and preferences
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <AdminSelect
            label="Timezone"
            options={[
              { value: 'UTC', label: 'UTC' },
              { value: 'Asia/Kolkata', label: 'IST (India)' },
              { value: 'America/New_York', label: 'EST (New York)' },
              { value: 'Europe/London', label: 'GMT (London)' },
              { value: 'Asia/Tokyo', label: 'JST (Tokyo)' }
            ]}
            value={formData.timezone}
            onChange={(e) => handleChange('timezone', e.target.value)}
            // sx={{ flex: 1 }}
          />

          <AdminSelect
            label="Language"
            options={[
              { value: 'en', label: 'English' },
              { value: 'hi', label: 'Hindi' },
              { value: 'es', label: 'Spanish' },
              { value: 'fr', label: 'French' },
              { value: 'de', label: 'German' }
            ]}
            value={formData.language}
            onChange={(e) => handleChange('language', e.target.value)}
            // sx={{ flex: 1 }}
          />
        </Box>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <AdminSelect
            label="Date Format"
            options={[
              { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
              { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
              { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' }
            ]}
            value={formData.dateFormat}
            onChange={(e) => handleChange('dateFormat', e.target.value)}
            // sx={{ flex: 1 }}
          />

          <AdminSelect
            label="Time Format"
            options={[
              { value: 'hh:mm A', label: '12-hour (hh:mm AM/PM)' },
              { value: 'HH:mm', label: '24-hour (HH:mm)' }
            ]}
            value={formData.timeFormat}
            onChange={(e) => handleChange('timeFormat', e.target.value)}
            // sx={{ flex: 1 }}
          />
        </Box>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <AdminSelect
            label="Currency"
            options={[
              { value: 'INR', label: 'Indian Rupee (₹)' },
              { value: 'USD', label: 'US Dollar ($)' },
              { value: 'EUR', label: 'Euro (€)' },
              { value: 'GBP', label: 'British Pound (£)' },
              { value: 'JPY', label: 'Japanese Yen (¥)' }
            ]}
            value={formData.currency}
            onChange={(e) => handleChange('currency', e.target.value)}
            // sx={{ flex: 1 }}
          />

          <AdminTextField
            label="Currency Symbol"
            value={formData.currencySymbol}
            onChange={(e) => handleChange('currencySymbol', e.target.value)}
            sx={{ flex: 1 }}
          />
        </Box>

        <AdminTextField
          label="Items Per Page"
          type="number"
          value={formData.itemsPerPage}
          onChange={(e) => handleChange('itemsPerPage', parseInt(e.target.value) || 10)}
          fullWidth
          helperText="Number of items to show in tables and lists"
        />

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <FormControlLabel
            control={
              <Switch
                checked={formData.enableRegistration}
                onChange={(e) => handleChange('enableRegistration', e.target.checked)}
                color="primary"
              />
            }
            label="Enable User Registration"
            sx={{ m: 0 }}
          />

          <FormControlLabel
            control={
              <Switch
                checked={formData.maintenanceMode}
                onChange={(e) => handleChange('maintenanceMode', e.target.checked)}
                color="warning"
              />
            }
            label="Maintenance Mode"
            sx={{ m: 0 }}
          />
        </Box>
      </Box>
      
      <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
        <AdminButton onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : 'Save System Settings'}
        </AdminButton>
      </Box>
    </Box>
  )
}