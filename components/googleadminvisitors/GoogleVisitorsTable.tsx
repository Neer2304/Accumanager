// components/googleadminvisitors/GoogleVisitorsTable.tsx
'use client'

import React from 'react'
import {
  Paper,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Checkbox,
  Avatar,
  Tooltip,
  IconButton,
  Chip,
  alpha,
} from '@mui/material'
import {
  MoreVert,
  PhoneAndroid,
  Tablet,
  DesktopWindows,
  Router,
  Person,
} from '@mui/icons-material'
import { TableProps } from './types'

export default function GoogleVisitorsTable({
  visitors,
  selectedVisitors,
  onSelectAll,
  onSelectVisitor,
  onMenuOpen,
  pagination,
  onPageChange,
  onRowsPerPageChange,
  darkMode,
  formatDistance,
}: TableProps) {
  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: '16px',
        border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
        overflow: 'hidden'
      }}
    >
      <Box sx={{ p: 3, borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}` }}>
        <Typography variant="h6" fontWeight="500" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
          Recent Visitors
        </Typography>
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: darkMode ? '#202124' : '#f8f9fa' }}>
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={selectedVisitors.length > 0 && selectedVisitors.length < visitors.length}
                  checked={selectedVisitors.length === visitors.length && visitors.length > 0}
                  onChange={(e) => onSelectAll(e.target.checked)}
                  sx={{
                    color: darkMode ? '#9aa0a6' : '#5f6368',
                    '&.Mui-checked': {
                      color: darkMode ? '#8ab4f8' : '#1a73e8',
                    },
                  }}
                />
              </TableCell>
              <TableCell sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', fontWeight: 500 }}>Visitor</TableCell>
              <TableCell sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', fontWeight: 500 }}>Location</TableCell>
              <TableCell sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', fontWeight: 500 }}>Device</TableCell>
              <TableCell sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', fontWeight: 500 }}>Page</TableCell>
              <TableCell align="center" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', fontWeight: 500 }}>Visits</TableCell>
              <TableCell sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', fontWeight: 500 }}>Last Seen</TableCell>
              <TableCell align="right" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', fontWeight: 500 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {visitors.map((visitor) => (
              <TableRow key={visitor._id} hover sx={{ '&:hover': { backgroundColor: darkMode ? alpha('#ffffff', 0.05) : alpha('#000000', 0.02) } }}>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedVisitors.includes(visitor._id)}
                    onChange={(e) => onSelectVisitor(visitor._id, e.target.checked)}
                    sx={{
                      color: darkMode ? '#9aa0a6' : '#5f6368',
                      '&.Mui-checked': {
                        color: darkMode ? '#8ab4f8' : '#1a73e8',
                      },
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar
                      sx={{
                        width: 32,
                        height: 32,
                        bgcolor: visitor.device.isBot
                          ? alpha('#EA4335', 0.1)
                          : alpha('#4285F4', 0.1),
                        color: visitor.device.isBot ? '#EA4335' : '#4285F4'
                      }}
                    >
                      {visitor.device.isBot ? <Router /> : <Person />}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                        {visitor.ipAddress}
                      </Typography>
                      <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                        {visitor.userId ? 'Registered' : 'Guest'}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  {visitor.location ? (
                    <>
                      <Typography variant="body2" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                        {visitor.location.city}, {visitor.location.country}
                      </Typography>
                      <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                        {visitor.location.isp}
                      </Typography>
                    </>
                  ) : (
                    <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                      Unknown
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {visitor.device.isMobile ? (
                      <PhoneAndroid sx={{ fontSize: 16, color: '#34A853' }} />
                    ) : visitor.device.isTablet ? (
                      <Tablet sx={{ fontSize: 16, color: '#FBBC05' }} />
                    ) : (
                      <DesktopWindows sx={{ fontSize: 16, color: '#4285F4' }} />
                    )}
                    <Box>
                      <Typography variant="body2" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                        {visitor.device.browser}
                      </Typography>
                      <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                        {visitor.device.os}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Tooltip title={visitor.pageUrl}>
                    <Typography
                      variant="body2"
                      sx={{
                        maxWidth: 150,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        color: darkMode ? '#e8eaed' : '#202124',
                      }}
                    >
                      {visitor.pageUrl}
                    </Typography>
                  </Tooltip>
                </TableCell>
                <TableCell align="center">
                  <Chip
                    label={visitor.visitCount}
                    size="small"
                    sx={{ bgcolor: alpha('#4285F4', 0.1), color: '#4285F4' }}
                  />
                </TableCell>
                <TableCell>
                  <Tooltip title={new Date(visitor.lastVisit).toLocaleString()}>
                    <Typography variant="body2" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                      {formatDistance(new Date(visitor.lastVisit), new Date(), { addSuffix: true })}
                    </Typography>
                  </Tooltip>
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    size="small"
                    onClick={(e) => onMenuOpen(e, visitor)}
                    sx={{
                      color: darkMode ? '#9aa0a6' : '#5f6368',
                      '&:hover': {
                        backgroundColor: darkMode ? alpha('#ffffff', 0.1) : alpha('#000000', 0.05),
                      },
                    }}
                  >
                    <MoreVert />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={pagination.total}
        page={pagination.page - 1}
        rowsPerPage={pagination.limit}
        onPageChange={(_, page) => onPageChange(page + 1)}
        onRowsPerPageChange={(e) => onRowsPerPageChange(parseInt(e.target.value, 10))}
        rowsPerPageOptions={[10, 25, 50, 100]}
        sx={{
          borderTop: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
          color: darkMode ? '#e8eaed' : '#202124',
          '& .MuiTablePagination-select': {
            color: darkMode ? '#e8eaed' : '#202124',
          },
          '& .MuiTablePagination-selectIcon': {
            color: darkMode ? '#9aa0a6' : '#5f6368',
          },
          '& .MuiTablePagination-displayedRows': {
            color: darkMode ? '#e8eaed' : '#202124',
          },
          '& .MuiTablePagination-actions button': {
            color: darkMode ? '#e8eaed' : '#202124',
            '&.Mui-disabled': {
              color: darkMode ? '#5f6368' : '#9aa0a6',
            },
          },
        }}
      />
    </Paper>
  )
}