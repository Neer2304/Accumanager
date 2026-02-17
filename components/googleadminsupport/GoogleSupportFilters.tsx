// components/googleadminsupport/GoogleSupportFilters.tsx
'use client'

import React from 'react'
import {
  Card,
  CardContent,
  Stack,
  Box,
  TextField,
  InputAdornment,
  IconButton,
  Button,
  alpha,
} from '@mui/material'
import {
  Search as SearchIcon,
  Clear,
  FilterList,
} from '@mui/icons-material'
import { SupportFiltersProps } from './types'

export default function GoogleSupportFilters({
  filters,
  onFilterChange,
  onClearFilters,
  darkMode,
}: SupportFiltersProps) {
  return (
    <Card sx={{ 
      mb: 3, 
      borderRadius: '16px',
      backgroundColor: darkMode ? '#303134' : '#ffffff',
      border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
      boxShadow: darkMode 
        ? '0 4px 24px rgba(0, 0, 0, 0.2)'
        : '0 4px 24px rgba(0, 0, 0, 0.05)',
    }}>
      <CardContent>
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2}
          alignItems="center"
        >
          <Box sx={{ flex: 1, minWidth: 300 }}>
            <TextField
              fullWidth
              placeholder="Search tickets by user, subject, or email..."
              value={filters.search}
              onChange={(e) => onFilterChange('search', e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                  </InputAdornment>
                ),
                endAdornment: filters.search && (
                  <InputAdornment position="end">
                    <IconButton 
                      size="small" 
                      onClick={() => onFilterChange('search', '')}
                      sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}
                    >
                      <Clear fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              size="small"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  backgroundColor: darkMode ? '#202124' : '#f8f9fa',
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: darkMode ? '#5f6368' : '#bdc1c6',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#1a73e8',
                    borderWidth: 2,
                  },
                },
                '& .MuiInputBase-input': {
                  color: darkMode ? '#e8eaed' : '#202124',
                },
              }}
            />
          </Box>

          <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
            <Button
              variant={filters.status === "" ? "contained" : "outlined"}
              size="small"
              onClick={() => onFilterChange('status', "")}
              sx={{
                backgroundColor: filters.status === "" ? '#1a73e8' : 'transparent',
                color: filters.status === "" ? '#ffffff' : (darkMode ? '#e8eaed' : '#202124'),
                borderColor: darkMode ? '#5f6368' : '#dadce0',
                borderRadius: '8px',
                textTransform: 'none',
                fontWeight: 500,
                '&:hover': {
                  backgroundColor: filters.status === "" 
                    ? '#1669c1' 
                    : (darkMode ? alpha('#ffffff', 0.05) : alpha('#000000', 0.05)),
                },
              }}
            >
              All Status
            </Button>
            <Button
              variant={filters.status === "open" ? "contained" : "outlined"}
              size="small"
              onClick={() => onFilterChange('status', "open")}
              sx={{
                backgroundColor: filters.status === "open" ? '#1a73e8' : 'transparent',
                color: filters.status === "open" ? '#ffffff' : (darkMode ? '#e8eaed' : '#202124'),
                borderColor: darkMode ? '#5f6368' : '#dadce0',
                borderRadius: '8px',
                textTransform: 'none',
                fontWeight: 500,
                '&:hover': {
                  backgroundColor: filters.status === "open" 
                    ? '#1669c1' 
                    : (darkMode ? alpha('#ffffff', 0.05) : alpha('#000000', 0.05)),
                },
              }}
            >
              Open
            </Button>
            <Button
              variant={filters.status === "in-progress" ? "contained" : "outlined"}
              size="small"
              onClick={() => onFilterChange('status', "in-progress")}
              sx={{
                backgroundColor: filters.status === "in-progress" ? '#fbbc04' : 'transparent',
                color: filters.status === "in-progress" ? '#202124' : (darkMode ? '#e8eaed' : '#202124'),
                borderColor: darkMode ? '#5f6368' : '#dadce0',
                borderRadius: '8px',
                textTransform: 'none',
                fontWeight: 500,
                '&:hover': {
                  backgroundColor: filters.status === "in-progress" 
                    ? '#e6a800' 
                    : (darkMode ? alpha('#ffffff', 0.05) : alpha('#000000', 0.05)),
                },
              }}
            >
              In Progress
            </Button>
            <Button
              variant={filters.status === "resolved" ? "contained" : "outlined"}
              size="small"
              onClick={() => onFilterChange('status', "resolved")}
              sx={{
                backgroundColor: filters.status === "resolved" ? '#34a853' : 'transparent',
                color: filters.status === "resolved" ? '#ffffff' : (darkMode ? '#e8eaed' : '#202124'),
                borderColor: darkMode ? '#5f6368' : '#dadce0',
                borderRadius: '8px',
                textTransform: 'none',
                fontWeight: 500,
                '&:hover': {
                  backgroundColor: filters.status === "resolved" 
                    ? '#2d8e47' 
                    : (darkMode ? alpha('#ffffff', 0.05) : alpha('#000000', 0.05)),
                },
              }}
            >
              Resolved
            </Button>
          </Stack>

          <Button
            variant="outlined"
            startIcon={<FilterList />}
            onClick={onClearFilters}
            size="small"
            sx={{
              color: darkMode ? '#e8eaed' : '#202124',
              borderColor: darkMode ? '#5f6368' : '#dadce0',
              borderRadius: '8px',
              textTransform: 'none',
              fontWeight: 500,
              '&:hover': {
                backgroundColor: darkMode ? alpha('#ffffff', 0.05) : alpha('#000000', 0.05),
                borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
              },
            }}
          >
            Clear All
          </Button>
        </Stack>
      </CardContent>
    </Card>
  )
}