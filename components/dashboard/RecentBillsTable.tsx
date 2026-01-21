// components/dashboard/RecentBillsTable.tsx
import React from 'react'
import {
  Card,
  CardContent,
  Typography,
  Box,
  useTheme,
  useMediaQuery
} from '@mui/material'
import { Receipt as BillIcon } from '@mui/icons-material'

const RecentBillsTable: React.FC = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

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
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'success'
      case 'pending': return 'warning'
      case 'cancelled': return 'error'
      default: return 'default'
    }
  }

  return (
    <Card 
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', p: isMobile ? 1.5 : 2 }}>
        <Box display="flex" alignItems="center" gap={1} mb={2}>
          <BillIcon color="primary" />
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 600,
              fontSize: isMobile ? '1.1rem' : '1.25rem'
            }}
          >
            Recent Bills
          </Typography>
        </Box>

        <Box sx={{ flex: 1, minHeight: 200 }}>
          {dummyBills.map((bill, index) => (
            <Box
              key={bill.id}
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                py: 1.5,
                px: 1,
                borderBottom: index < dummyBills.length - 1 ? `1px solid ${theme.palette.divider}` : 'none',
                '&:hover': {
                  backgroundColor: theme.palette.action.hover,
                  borderRadius: 1
                }
              }}
            >
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography 
                  variant="body2" 
                  fontWeight="medium"
                  noWrap
                  sx={{ fontSize: isMobile ? '0.875rem' : '0.9rem' }}
                >
                  {bill.billNumber}
                </Typography>
                <Typography 
                  variant="caption" 
                  color="text.secondary"
                  display="block"
                >
                  {bill.customerName}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, mt: 0.5, flexWrap: 'wrap' }}>
                  <Typography 
                    variant="caption" 
                    color="primary.main"
                    fontWeight="medium"
                  >
                    ₹{bill.totalAmount.toLocaleString()}
                  </Typography>
                  <Typography 
                    variant="caption" 
                    color="text.secondary"
                  >
                    {new Date(bill.createdAt).toLocaleDateString()}
                  </Typography>
                </Box>
              </Box>
              <Box 
                sx={{ 
                  // backgroundColor: theme.palette[getStatusColor(bill.status)].light,
                  // color: theme.palette[getStatusColor(bill.status)].dark,
                  px: 1,
                  py: 0.5,
                  borderRadius: 1,
                  fontSize: '0.7rem',
                  fontWeight: 'bold',
                  textTransform: 'uppercase'
                }}
              >
                {bill.status}
              </Box>
            </Box>
          ))}
        </Box>

        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            mt: 2,
            pt: 2,
            borderTop: `1px solid ${theme.palette.divider}`
          }}
        >
          <Typography variant="caption" color="text.secondary">
            {dummyBills.length} bills
          </Typography>
          <Typography variant="caption" color="primary.main" fontWeight="medium">
            Total: ₹{dummyBills.reduce((sum, bill) => sum + bill.totalAmount, 0).toLocaleString()}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  )
}

export default RecentBillsTable