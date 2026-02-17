// components/googleadminvisitors/GoogleVisitorsFilters.tsx
'use client'

import React from 'react'
import {
  Paper,
  Box,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  alpha,
} from '@mui/material'
import { Search } from '@mui/icons-material'
import { FiltersProps } from './types'

export default function GoogleVisitorsFilters({ filters, onFilterChange, darkMode }: FiltersProps) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        mb: 3,
        borderRadius: '16px',
        bgcolor: darkMode ? '#303134' : '#ffffff',
        border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
      }}
    >
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <TextField
          size="small"
          placeholder="Search by IP, location, or page..."
          value={filters.search}
          onChange={(e) => onFilterChange('search', e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={{ fontSize: 20, color: darkMode ? '#9aa0a6' : '#5f6368' }} />
              </InputAdornment>
            ),
          }}
          sx={{ 
            flex: 1, 
            minWidth: 200,
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px',
              backgroundColor: darkMode ? '#202124' : '#f8f9fa',
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: darkMode ? '#5f6368' : '#bdc1c6',
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                borderWidth: 2,
              },
            },
            '& .MuiInputBase-input': {
              color: darkMode ? '#e8eaed' : '#202124',
            },
          }}
        />

        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>Time Range</InputLabel>
          <Select
            value={filters.range}
            label="Time Range"
            onChange={(e) => onFilterChange('range', e.target.value)}
            sx={{
              borderRadius: '8px',
              backgroundColor: darkMode ? '#202124' : '#f8f9fa',
              color: darkMode ? '#e8eaed' : '#202124',
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: darkMode ? '#3c4043' : '#dadce0',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: darkMode ? '#5f6368' : '#bdc1c6',
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                borderWidth: 2,
              },
            }}
          >
            <MenuItem value="today">Today</MenuItem>
            <MenuItem value="week">Last 7 Days</MenuItem>
            <MenuItem value="month">Last 30 Days</MenuItem>
            <MenuItem value="quarter">Last 90 Days</MenuItem>
            <MenuItem value="year">Last Year</MenuItem>
            <MenuItem value="all">All Time</MenuItem>
          </Select>
        </FormControl>
      </Box>
    </Paper>
  )
}