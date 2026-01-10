// components/ThemeToggle.tsx
'use client'

import React from 'react'
import { IconButton, Tooltip } from '@mui/material'
import { Brightness4 as DarkIcon, Brightness7 as LightIcon } from '@mui/icons-material'
import { useTheme } from '@mui/material/styles'

export const ThemeToggle: React.FC = () => {
  const theme = useTheme()
  const [mode, setMode] = React.useState<'light' | 'dark'>('light')

  React.useEffect(() => {
    const savedMode = localStorage.getItem('theme-mode') as 'light' | 'dark'
    if (savedMode) {
      setMode(savedMode)
      document.documentElement.setAttribute('data-theme', savedMode)
    }
  }, [])

  const toggleTheme = () => {
    const newMode = mode === 'light' ? 'dark' : 'light'
    setMode(newMode)
    localStorage.setItem('theme-mode', newMode)
    document.documentElement.setAttribute('data-theme', newMode)
  }

  return (
    <Tooltip title={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`}>
      <IconButton onClick={toggleTheme} color="inherit">
        {mode === 'light' ? <DarkIcon /> : <LightIcon />}
      </IconButton>
    </Tooltip>
  )
}