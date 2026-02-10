// components/dashboard/RecentBillsTable.tsx
'use client'

import React from 'react'
import {
  Card,
  CardContent,
  Typography,
  Box,
  useTheme,
  useMediaQuery,
  alpha,
  Button,
  Chip,
  Avatar,
} from '@mui/material'
import { Receipt as BillIcon, TrendingUp, Download } from '@mui/icons-material'

const RecentBillsTable: React.FC = () => {
  const theme = useTheme()
  const darkMode = theme.palette.mode === 'dark'
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'))

  // Dummy data for bills
  const dummyBills = [
    {
      id: '1',
      billNumber: 'INV-001',
      customerName: 'Raj Sharma',
      createdAt: '2024-01-15',
      totalAmount: 12500,
      paymentMethod: 'cash',
      status: 'paid'
    },
    {
      id: '2', 
      billNumber: 'INV-002',
      customerName: 'Priya Patel',
      createdAt: '2024-01-14',
      totalAmount: 8300,
      paymentMethod: 'upi',
      status: 'pending'
    },
    {
      id: '3',
      billNumber: 'INV-003',
      customerName: 'Amit Kumar',
      createdAt: '2024-01-13',
      totalAmount: 25000,
      paymentMethod: 'card',
      status: 'paid'
    },
    {
      id: '4',
      billNumber: 'INV-004',
      customerName: 'Sneha Verma',
      createdAt: '2024-01-12',
      totalAmount: 15800,
      paymentMethod: 'bank_transfer',
      status: 'paid'
    },
    {
      id: '5',
      billNumber: 'INV-005',
      customerName: 'Vikram Singh',
      createdAt: '2024-01-11',
      totalAmount: 9200,
      paymentMethod: 'upi',
      status: 'pending'
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return '#34a853'
      case 'pending': return '#fbbc04'
      case 'cancelled': return '#ea4335'
      default: return '#5f6368'
    }
  }

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'cash': return '💵'
      case 'upi': return '📱'
      case 'card': return '💳'
      case 'bank_transfer': return '🏦'
      default: return '💰'
    }
  }

  const totalRevenue = dummyBills.reduce((sum, bill) => sum + bill.totalAmount, 0)

  return (
    <Card 
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 3,
        backgroundColor: darkMode ? '#303134' : '#ffffff',
        border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: darkMode 
            ? `0 8px 24px ${alpha('#4285f4', 0.3)}`
            : `0 8px 24px ${alpha('#4285f4', 0.2)}`,
          borderColor: '#4285f4'
        }
      }}
    >
      <CardContent sx={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        p: { xs: 1.5, sm: 2 } 
      }}>
        {/* Header */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          mb: 3 
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Avatar
              sx={{
                width: { xs: 36, sm: 44 },
                height: { xs: 36, sm: 44 },
                backgroundColor: darkMode ? alpha('#4285f4', 0.2) : alpha('#4285f4', 0.1),
                color: '#4285f4'
              }}
            >
              <BillIcon fontSize={isMobile ? "small" : "medium"} />
            </Avatar>
            <Box>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 600,
                  fontSize: { xs: '1.1rem', sm: '1.25rem' },
                  color: darkMode ? '#e8eaed' : '#202124'
                }}
              >
                Recent Bills
              </Typography>
              <Typography 
                variant="caption" 
                sx={{ 
                  fontSize: { xs: '0.7rem', sm: '0.75rem' },
                  color: darkMode ? '#9aa0a6' : '#5f6368'
                }}
              >
                Latest invoices and payments
              </Typography>
            </Box>
          </Box>
          
          <Button
            size="small"
            variant="outlined"
            startIcon={<Download fontSize="small" />}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontSize: { xs: '0.7rem', sm: '0.75rem' },
              borderColor: darkMode ? '#3c4043' : '#dadce0',
              color: darkMode ? '#9aa0a6' : '#5f6368',
              '&:hover': {
                borderColor: darkMode ? '#4285f4' : '#4285f4',
                backgroundColor: darkMode ? alpha('#4285f4', 0.1) : alpha('#4285f4', 0.05),
              }
            }}
          >
            Export
          </Button>
        </Box>

        {/* Bills List */}
        <Box sx={{ 
          flex: 1, 
          minHeight: 200,
          overflow: 'auto',
          '&::-webkit-scrollbar': {
            width: '4px',
          },
          '&::-webkit-scrollbar-track': {
            background: darkMode ? '#202124' : '#f8f9fa',
            borderRadius: '10px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: darkMode ? '#5f6368' : '#dadce0',
            borderRadius: '10px',
          }
        }}>
          {dummyBills.map((bill, index) => (
            <Box
              key={bill.id}
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                py: 1.5,
                px: 1,
                borderRadius: 2,
                backgroundColor: index % 2 === 0 
                  ? (darkMode ? alpha('#ffffff', 0.02) : alpha('#000000', 0.02))
                  : 'transparent',
                transition: 'all 0.2s ease',
                '&:hover': {
                  backgroundColor: darkMode ? alpha('#4285f4', 0.1) : alpha('#4285f4', 0.05),
                  transform: 'translateX(4px)',
                },
                mb: index < dummyBills.length - 1 ? 1 : 0
              }}
            >
              <Box sx={{ flex: 1, minWidth: 0, mr: 2 }}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: 1,
                  mb: 0.5
                }}>
                  <Typography 
                    variant="subtitle2" 
                    fontWeight={600}
                    noWrap
                    sx={{ 
                      fontSize: { xs: '0.875rem', sm: '0.9rem' },
                      color: darkMode ? '#e8eaed' : '#202124'
                    }}
                  >
                    {bill.billNumber}
                  </Typography>
                  
                  <Chip
                    label={bill.paymentMethod.replace('_', ' ').toUpperCase()}
                    size="small"
                    sx={{
                      backgroundColor: darkMode ? alpha('#4285f4', 0.2) : alpha('#4285f4', 0.1),
                      color: darkMode ? '#8ab4f8' : '#4285f4',
                      fontWeight: 500,
                      fontSize: '0.65rem',
                      height: 20
                    }}
                  />
                </Box>

                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontSize: { xs: '0.8rem', sm: '0.875rem' },
                    color: darkMode ? '#9aa0a6' : '#5f6368',
                    mb: 0.5
                  }}
                >
                  {bill.customerName}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
                  <Typography 
                    variant="body2" 
                    fontWeight={700}
                    sx={{
                      fontSize: { xs: '0.85rem', sm: '0.9rem' },
                      color: '#34a853',
                      backgroundColor: darkMode ? alpha('#34a853', 0.2) : alpha('#34a853', 0.1),
                      px: 1,
                      py: 0.25,
                      borderRadius: 1
                    }}
                  >
                    ₹{bill.totalAmount.toLocaleString()}
                  </Typography>
                  
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      fontSize: { xs: '0.7rem', sm: '0.75rem' },
                      color: darkMode ? '#9aa0a6' : '#5f6368'
                    }}
                  >
                    {new Date(bill.createdAt).toLocaleDateString('en-IN', { 
                      day: 'numeric', 
                      month: 'short',
                      year: 'numeric'
                    })}
                  </Typography>
                </Box>
              </Box>
              
              <Box 
                sx={{ 
                  backgroundColor: darkMode 
                    ? alpha(getStatusColor(bill.status), 0.2) 
                    : alpha(getStatusColor(bill.status), 0.1),
                  color: getStatusColor(bill.status),
                  px: 1.5,
                  py: 0.5,
                  borderRadius: 2,
                  fontSize: { xs: '0.7rem', sm: '0.75rem' },
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  minWidth: 70,
                  textAlign: 'center'
                }}
              >
                {bill.status}
              </Box>
            </Box>
          ))}
        </Box>

        {/* Footer Summary */}
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            mt: 3,
            pt: 2,
            borderTop: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
            flexWrap: 'wrap',
            gap: 1
          }}
        >
          <Box>
            <Typography 
              variant="caption" 
              sx={{ 
                fontSize: { xs: '0.7rem', sm: '0.75rem' },
                color: darkMode ? '#9aa0a6' : '#5f6368'
              }}
            >
              {dummyBills.length} bills
            </Typography>
            <Typography 
              variant="caption" 
              sx={{ 
                fontSize: { xs: '0.7rem', sm: '0.75rem' },
                color: darkMode ? '#9aa0a6' : '#5f6368',
                display: 'block',
                mt: 0.5
              }}
            >
              {dummyBills.filter(b => b.status === 'paid').length} paid • {dummyBills.filter(b => b.status === 'pending').length} pending
            </Typography>
          </Box>
          
          <Box sx={{ textAlign: 'right' }}>
            <Typography 
              variant="body2" 
              fontWeight={600}
              sx={{
                fontSize: { xs: '0.9rem', sm: '1rem' },
                color: '#34a853',
                display: 'flex',
                alignItems: 'center',
                gap: 0.5
              }}
            >
              <TrendingUp fontSize="small" />
              ₹{totalRevenue.toLocaleString()}
            </Typography>
            <Typography 
              variant="caption" 
              sx={{ 
                fontSize: { xs: '0.7rem', sm: '0.75rem' },
                color: darkMode ? '#9aa0a6' : '#5f6368'
              }}
            >
              Total Revenue
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}

export default RecentBillsTable