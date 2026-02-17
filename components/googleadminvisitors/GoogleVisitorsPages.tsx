// components/googleadminvisitors/GoogleVisitorsPages.tsx
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
  Chip,
  alpha,
} from '@mui/material'
import { PagesTabProps } from './types'

export default function GoogleVisitorsPages({ stats, darkMode }: PagesTabProps) {
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
        Top Pages
      </Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', fontWeight: 500 }}>Page URL</TableCell>
              <TableCell align="right" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', fontWeight: 500 }}>Visits</TableCell>
              <TableCell align="right" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', fontWeight: 500 }}>Unique Visitors</TableCell>
              <TableCell align="right" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', fontWeight: 500 }}>Bounce Rate</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {stats.topPages.map((page, i) => (
              <TableRow key={i} hover>
                <TableCell sx={{ borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}` }}>
                  <Typography variant="body2" sx={{ fontFamily: 'monospace', color: darkMode ? '#e8eaed' : '#202124' }}>
                    {page.url}
                  </Typography>
                </TableCell>
                <TableCell align="right" sx={{ borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}` }}>
                  <Typography sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>{page.visits}</Typography>
                </TableCell>
                <TableCell align="right" sx={{ borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}` }}>
                  <Typography sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                    {Math.round(page.visits * 0.7)}
                  </Typography>
                </TableCell>
                <TableCell align="right" sx={{ borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}` }}>
                  <Chip
                    size="small"
                    label={`${Math.round(Math.random() * 40 + 30)}%`}
                    sx={{ bgcolor: alpha('#FBBC05', 0.1), color: '#FBBC05' }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  )
}