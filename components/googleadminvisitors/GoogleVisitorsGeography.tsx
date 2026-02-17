// components/googleadminvisitors/GoogleVisitorsGeography.tsx
'use client'

import React from 'react'
import {
  Paper,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Box,
  alpha,
} from '@mui/material'
import {
  Public,
  ArrowUpward,
  ArrowDownward,
} from '@mui/icons-material'
import { GeographyTabProps } from './types'

export default function GoogleVisitorsGeography({ stats, darkMode }: GeographyTabProps) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: '16px',
        border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
        backgroundColor: darkMode ? '#303134' : '#ffffff',
      }}
    >
      <Typography variant="h6" fontWeight="500" gutterBottom sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
        Visitors by Country
      </Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', fontWeight: 500 }}>Country</TableCell>
              <TableCell align="right" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', fontWeight: 500 }}>Visitors</TableCell>
              <TableCell align="right" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', fontWeight: 500 }}>Percentage</TableCell>
              <TableCell align="right" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', fontWeight: 500 }}>Trend</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {stats.byCountry.map((country, i) => (
              <TableRow key={i} hover>
                <TableCell sx={{ borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}` }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Public sx={{ fontSize: 20, color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                    <Typography sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>{country.country}</Typography>
                  </Box>
                </TableCell>
                <TableCell align="right" sx={{ borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}` }}>
                  <Typography sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>{country.visitors}</Typography>
                </TableCell>
                <TableCell align="right" sx={{ borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}` }}>
                  <Typography sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                    {((country.visitors / stats.totalVisitors) * 100).toFixed(1)}%
                  </Typography>
                </TableCell>
                <TableCell align="right" sx={{ borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}` }}>
                  {i % 2 === 0 ? (
                    <ArrowUpward sx={{ color: '#34A853', fontSize: 20 }} />
                  ) : (
                    <ArrowDownward sx={{ color: '#EA4335', fontSize: 20 }} />
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  )
}