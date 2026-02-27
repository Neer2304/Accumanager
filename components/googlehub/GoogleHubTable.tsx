// components/googlehub/GoogleHubTable.tsx
'use client'

import React from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Typography,
  Skeleton,
  useTheme,
  alpha,
} from '@mui/material'
import { TableColumn, googleColors } from './types'

interface GoogleHubTableProps<T = any> {
  columns: TableColumn<T>[]
  data: T[]
  loading?: boolean
  emptyMessage?: string
  onRowClick?: (item: T) => void
  maxHeight?: number | string
}

export default function GoogleHubTable<T extends Record<string, any>>({
  columns,
  data,
  loading = false,
  emptyMessage = 'No data available',
  onRowClick,
  maxHeight = 400,
}: GoogleHubTableProps<T>) {
  const theme = useTheme()
  const darkMode = theme.palette.mode === 'dark'

  if (loading) {
    return (
      <TableContainer component={Paper} elevation={0} sx={{ maxHeight, overflow: 'auto' }}>
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              {columns.map(col => (
                <TableCell key={col.id} align={col.align || 'left'} style={{ width: col.width }}>
                  {col.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {[1, 2, 3, 4, 5].map(i => (
              <TableRow key={i}>
                {columns.map(col => (
                  <TableCell key={col.id} align={col.align || 'left'}>
                    <Skeleton animation="wave" height={20} />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    )
  }

  if (data.length === 0) {
    return (
      <TableContainer component={Paper} elevation={0} sx={{ maxHeight, overflow: 'auto' }}>
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              {columns.map(col => (
                <TableCell key={col.id} align={col.align || 'left'} style={{ width: col.width }}>
                  {col.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell colSpan={columns.length} align="center" sx={{ py: 4 }}>
                <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : googleColors.grey }}>
                  {emptyMessage}
                </Typography>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    )
  }

  return (
    <TableContainer component={Paper} elevation={0} sx={{ maxHeight, overflow: 'auto' }}>
      <Table size="small" stickyHeader>
        <TableHead>
          <TableRow>
            {columns.map(col => (
              <TableCell 
                key={col.id} 
                align={col.align || 'left'} 
                style={{ width: col.width }}
                sx={{ 
                  bgcolor: darkMode ? googleColors.greyDark : googleColors.white,
                  color: darkMode ? '#e8eaed' : googleColors.black,
                  fontWeight: 600,
                }}
              >
                {col.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((item, index) => (
            <TableRow
              key={item._id || index}
              hover
              onClick={() => onRowClick?.(item)}
              sx={{ cursor: onRowClick ? 'pointer' : 'default' }}
            >
              {columns.map(col => (
                <TableCell key={col.id} align={col.align || 'left'}>
                  {col.render ? col.render(item) : item[col.id]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}