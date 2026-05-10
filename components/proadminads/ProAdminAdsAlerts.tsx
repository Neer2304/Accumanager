// components/proadminads/ProAdminAdsAlerts.tsx
'use client'

import React from 'react'
import { Alert } from '@mui/material'

interface ProAdminAdsAlertsProps { error: string | null; success: string | null; onErrorClose: () => void; onSuccessClose: () => void; darkMode?: boolean; }

export default function ProAdminAdsAlerts({ error, success, onErrorClose, onSuccessClose, darkMode }: ProAdminAdsAlertsProps) {
  return (<>{error && <Alert severity="error" sx={{ mb: 3, borderRadius: '12px', backgroundColor: darkMode ? '#303134' : '#ffffff', border: '1px solid #ea4335', color: darkMode ? '#e8eaed' : '#202124', '& .MuiAlert-icon': { color: '#ea4335' } }} onClose={onErrorClose}>{error}</Alert>}
    {success && <Alert severity="success" sx={{ mb: 3, borderRadius: '12px', backgroundColor: darkMode ? '#303134' : '#ffffff', border: '1px solid #34a853', color: darkMode ? '#e8eaed' : '#202124', '& .MuiAlert-icon': { color: '#34a853' } }} onClose={onSuccessClose}>{success}</Alert>}</>)
}