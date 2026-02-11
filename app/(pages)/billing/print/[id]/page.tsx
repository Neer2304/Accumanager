'use client'

import React, { useState, useEffect, useCallback } from 'react'
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Divider,
  Alert,
  CircularProgress,
  Stack,
  Container,
  Chip,
  IconButton,
  Tooltip,
  Card,
  CardContent,
  Avatar,
  Breadcrumbs,
  Link as MuiLink,
  useTheme,
  useMediaQuery,
  alpha,
} from '@mui/material'
import {
  Print as PrintIcon,
  ArrowBack as ArrowBackIcon,
  Download as DownloadIcon,
  Store as StoreIcon,
  Person as PersonIcon,
  Receipt as ReceiptIcon,
  Payment as PaymentIcon,
  Refresh as RefreshIcon,
  ErrorOutline as ErrorIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  Home as HomeIcon,
} from '@mui/icons-material'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { MainLayout } from '@/components/Layout/MainLayout'

interface OrderItem {
  name: string
  variationName?: string
  hsnCode: string
  price: number
  quantity: number
  discount: number
  taxableAmount: number
  cgstRate: number
  sgstRate: number
  igstRate: number
  cgstAmount: number
  sgstAmount: number
  igstAmount: number
  total: number
}

interface Customer {
  name: string
  phone: string
  email?: string
  address?: string
  gstin?: string
  state: string
  isInterState: boolean
  company?: string
  city?: string
  pincode?: string
}

interface Order {
  _id: string
  invoiceNumber: string
  invoiceDate: string
  customer: Customer
  items: OrderItem[]
  subtotal: number
  totalDiscount: number
  totalTaxableAmount: number
  totalCgst: number
  totalSgst: number
  totalIgst: number
  grandTotal: number
  paymentMethod: string
  paymentStatus: string
  status: string
  notes: string
  createdAt: string
  updatedAt: string
}

interface Business {
  businessName: string
  address: string
  city: string
  state: string
  pincode: string
  gstNumber: string
  phone: string
  email: string
  logo?: string
}

export default function PrintBillPage() {
  const params = useParams()
  const router = useRouter()
  const theme = useTheme()
  const darkMode = theme.palette.mode === 'dark'
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const [order, setOrder] = useState<Order | null>(null)
  const [business, setBusiness] = useState<Business | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isRetrying, setIsRetrying] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [invoiceId, setInvoiceId] = useState<string>('')

  // Extract invoice ID from params
  useEffect(() => {
    if (params?.id) {
      const id = Array.isArray(params.id) ? params.id[0] : params.id
      setInvoiceId(id)
      console.log('📄 Invoice ID:', id)
    }
  }, [params])

  const fetchBusinessData = useCallback(async () => {
    try {
      console.log('🔄 Fetching business data...')
      const response = await fetch('/api/business', {
        credentials: 'include',
        headers: { 
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        },
      })

      if (response.ok) {
        const data = await response.json()
        console.log('✅ Business data received:', data)
        if (data.success && data.business) {
          setBusiness(data.business)
          return true
        } else if (data.business) {
          setBusiness(data.business)
          return true
        }
      } else {
        console.warn('⚠️ Business API response not OK:', response.status)
      }
      return false
    } catch (error) {
      console.error('❌ Error fetching business data:', error)
      return false
    }
  }, [])

  const fetchOrderData = useCallback(async (id: string) => {
    setIsLoading(true)
    setError(null)

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 15000)

    try {
      console.log(`🔄 Fetching order ${id}...`)
      
      const response = await fetch(`/api/billing/${id}`, {
        credentials: 'include',
        headers: { 
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        },
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }))
        
        switch (response.status) {
          case 401:
            throw new Error('Your session has expired. Please login again.')
          case 403:
            throw new Error('You do not have permission to view this invoice.')
          case 404:
            throw new Error('Invoice not found. It may have been deleted or archived.')
          case 400:
            throw new Error(errorData.message || 'Invalid invoice format.')
          default:
            throw new Error(errorData.message || `Failed to load invoice (${response.status})`)
        }
      }

      const orderData: Order = await response.json()
      console.log('✅ Order loaded:', orderData.invoiceNumber)
      setOrder(orderData)
      
      // Fetch business data
      await fetchBusinessData()
      
      return true
    } catch (error: any) {
      console.error('❌ Error fetching order:', error)
      
      if (error.name === 'AbortError') {
        setError('Request timeout. The server is taking too long to respond.')
      } else {
        setError(error.message || 'Failed to load invoice data. Please try again.')
      }
      
      // Still try to fetch business data even if order fails
      await fetchBusinessData()
      return false
    } finally {
      setIsLoading(false)
      setIsRetrying(false)
    }
  }, [fetchBusinessData])

  // Fetch data when invoiceId changes
  useEffect(() => {
    if (invoiceId) {
      fetchOrderData(invoiceId)
    }
  }, [invoiceId, fetchOrderData])

  const handleRetry = () => {
    if (invoiceId) {
      setIsRetrying(true)
      fetchOrderData(invoiceId)
    }
  }

  const handlePrint = () => {
    window.print()
  }

  const handleDownloadPDF = () => {
    if (!order) return
    
    // Create PDF content
    const content = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Invoice ${order.invoiceNumber}</title>
        <style>
          @page { margin: 15mm; size: A4 portrait; }
          body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            margin: 0; 
            padding: 20px; 
            background: #ffffff;
            color: #333;
          }
          .invoice-container { 
            max-width: 800px; 
            margin: 0 auto; 
            border: 2px solid #2c3e50;
            border-radius: 8px;
            overflow: hidden;
          }
          .header { 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 25px;
            text-align: center;
          }
          .business-info, .customer-info {
            padding: 20px;
            border-bottom: 1px solid #e0e0e0;
          }
          .section-title {
            color: #2c3e50;
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 15px;
            display: flex;
            align-items: center;
            gap: 8px;
          }
          .info-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            margin-top: 10px;
          }
          .info-card {
            background: #f5f7fa;
            padding: 15px;
            border-radius: 6px;
            border-left: 4px solid #667eea;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
            font-size: 14px;
          }
          th {
            background: #2c3e50;
            color: white;
            padding: 12px;
            text-align: left;
            font-weight: 600;
          }
          td {
            padding: 10px 12px;
            border-bottom: 1px solid #e0e0e0;
          }
          tr:nth-child(even) {
            background: #f5f7fa;
          }
          .totals {
            margin-top: 30px;
            text-align: right;
          }
          .total-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px dashed #ddd;
          }
          .grand-total {
            font-size: 20px;
            font-weight: 700;
            color: #2c3e50;
            margin-top: 15px;
            padding-top: 15px;
            border-top: 2px solid #2c3e50;
          }
          .footer {
            margin-top: 40px;
            padding: 20px;
            background: #f5f7fa;
            border-top: 1px solid #e0e0e0;
            text-align: center;
            font-size: 12px;
            color: #666;
          }
          .status-chip {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            margin-left: 10px;
          }
          .paid { background: #d4edda; color: #155724; }
          .pending { background: #fff3cd; color: #856404; }
          .draft { background: #e2e3e5; color: #383d41; }
        </style>
      </head>
      <body>
        <div class="invoice-container">
          <div class="header">
            <h1 style="margin: 0; font-size: 32px; font-weight: 800;">TAX INVOICE</h1>
            <h2 style="margin: 5px 0 0 0; font-size: 24px; font-weight: 600;">${order.invoiceNumber}</h2>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Date: ${new Date(order.invoiceDate).toLocaleDateString('en-IN')}</p>
          </div>
          
          <div class="business-info">
            <div class="section-title">Seller Details</div>
            ${business ? `
              <div class="info-card">
                <h3 style="margin: 0 0 10px 0; color: #2c3e50;">${business.businessName}</h3>
                <p style="margin: 5px 0; color: #555;">
                  <strong>Address:</strong> ${business.address}, ${business.city}, ${business.state} - ${business.pincode}
                </p>
                <p style="margin: 5px 0; color: #555;">
                  <strong>GSTIN:</strong> ${business.gstNumber}
                </p>
                <p style="margin: 5px 0; color: #555;">
                  <strong>Phone:</strong> ${business.phone}
                </p>
                <p style="margin: 5px 0; color: #555;">
                  <strong>Email:</strong> ${business.email}
                </p>
              </div>
            ` : ''}
          </div>
          
          <div class="customer-info">
            <div class="section-title">Bill To</div>
            <div class="info-card">
              <h3 style="margin: 0 0 10px 0; color: #2c3e50;">${order.customer.name}</h3>
              <p style="margin: 5px 0; color: #555;">
                <strong>Phone:</strong> ${order.customer.phone}
              </p>
              ${order.customer.email ? `<p style="margin: 5px 0; color: #555;"><strong>Email:</strong> ${order.customer.email}</p>` : ''}
              ${order.customer.address ? `<p style="margin: 5px 0; color: #555;"><strong>Address:</strong> ${order.customer.address}</p>` : ''}
              ${order.customer.gstin ? `<p style="margin: 5px 0; color: #555;"><strong>GSTIN:</strong> ${order.customer.gstin}</p>` : ''}
              <p style="margin: 5px 0; color: #555;">
                <strong>Transaction Type:</strong> 
                <span style="background: ${order.customer.isInterState ? '#fef3c7' : '#d1fae5'}; 
                      color: ${order.customer.isInterState ? '#92400e' : '#065f46'}; 
                      padding: 2px 8px; 
                      border-radius: 12px; 
                      font-size: 12px; 
                      margin-left: 8px;">
                  ${order.customer.isInterState ? 'INTER-STATE (IGST)' : 'INTRA-STATE (CGST+SGST)'}
                </span>
              </p>
            </div>
          </div>
          
          <div style="padding: 0 20px;">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Description</th>
                  <th>HSN</th>
                  <th>Qty</th>
                  <th>Rate</th>
                  <th>Disc%</th>
                  <th>Taxable Amt</th>
                  <th>Tax Amt</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                ${order.items.map((item, index) => `
                  <tr>
                    <td>${index + 1}</td>
                    <td>
                      <div style="font-weight: 600;">${item.name}</div>
                      ${item.variationName ? `<div style="font-size: 12px; color: #666;">${item.variationName}</div>` : ''}
                    </td>
                    <td>${item.hsnCode}</td>
                    <td>${item.quantity}</td>
                    <td>₹${item.price.toLocaleString('en-IN')}</td>
                    <td>${item.discount > 0 ? `<span style="color: #dc2626; font-weight: 600;">${item.discount}%</span>` : '0%'}</td>
                    <td>₹${item.taxableAmount.toLocaleString('en-IN')}</td>
                    <td>₹${(item.cgstAmount + item.sgstAmount + item.igstAmount).toLocaleString('en-IN')}</td>
                    <td style="font-weight: 700; color: #2c3e50;">₹${item.total.toLocaleString('en-IN')}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
          
          <div style="padding: 20px;">
            <div class="totals">
              <div class="total-row">
                <span>Subtotal:</span>
                <span>₹${order.subtotal.toLocaleString('en-IN')}</span>
              </div>
              ${order.totalDiscount > 0 ? `
                <div class="total-row">
                  <span>Discount:</span>
                  <span style="color: #dc2626;">-₹${order.totalDiscount.toLocaleString('en-IN')}</span>
                </div>
              ` : ''}
              <div class="total-row">
                <span>Taxable Amount:</span>
                <span>₹${order.totalTaxableAmount.toLocaleString('en-IN')}</span>
              </div>
              ${order.totalCgst > 0 ? `
                <div class="total-row">
                  <span>CGST:</span>
                  <span>₹${order.totalCgst.toLocaleString('en-IN')}</span>
                </div>
                <div class="total-row">
                  <span>SGST:</span>
                  <span>₹${order.totalSgst.toLocaleString('en-IN')}</span>
                </div>
              ` : ''}
              ${order.totalIgst > 0 ? `
                <div class="total-row">
                  <span>IGST:</span>
                  <span>₹${order.totalIgst.toLocaleString('en-IN')}</span>
                </div>
              ` : ''}
              <div class="total-row grand-total">
                <span>GRAND TOTAL:</span>
                <span>₹${order.grandTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>
            
            <div style="margin-top: 30px; display: flex; justify-content: space-between; align-items: center;">
              <div>
                <strong>Payment Method:</strong>
                <span style="margin-left: 10px; padding: 4px 12px; background: #e0f2fe; border-radius: 15px; font-size: 14px;">
                  ${order.paymentMethod.toUpperCase()}
                </span>
              </div>
              <div>
                <strong>Status:</strong>
                <span class="status-chip ${order.status}">${order.status.toUpperCase()}</span>
              </div>
            </div>
            
            ${order.notes ? `
              <div style="margin-top: 20px; padding: 15px; background: #f5f7fa; border-radius: 6px;">
                <strong>Notes:</strong>
                <p style="margin: 5px 0 0 0; color: #555;">${order.notes}</p>
              </div>
            ` : ''}
          </div>
          
          <div class="footer">
            <p style="margin: 0;">Thank you for your business! We appreciate your trust in us.</p>
            <p style="margin: 5px 0 0 0; font-size: 11px;">
              This is a computer generated invoice. No signature required. • Invoice ID: ${order._id}
            </p>
            <p style="margin: 10px 0 0 0; font-size: 10px; color: #999;">
              Generated on ${new Date().toLocaleString('en-IN')}
            </p>
          </div>
        </div>
      </body>
      </html>
    `
    
    // Open print dialog
    const printWindow = window.open('', '_blank')
    if (!printWindow) {
      alert('Please allow popups to download PDF')
      return
    }
    
    printWindow.document.write(content)
    printWindow.document.close()
    
    setTimeout(() => {
      printWindow.print()
      printWindow.close()
    }, 250)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'paid': return 'success'
      case 'pending': return 'warning'
      case 'draft': return 'default'
      case 'cancelled': return 'error'
      default: return 'default'
    }
  }

  const getPaymentMethodIcon = (method: string) => {
    switch (method?.toLowerCase()) {
      case 'cash': return '💰'
      case 'card': return '💳'
      case 'upi': return '📱'
      case 'bank': return '🏦'
      default: return '💵'
    }
  }

  // Loading State - Google Material Design Style
  if (isLoading && !isRetrying) {
    return (
      <MainLayout title="Print Invoice">
        <Container maxWidth="xl" sx={{ py: { xs: 2, sm: 3, md: 4 }, px: { xs: 1.5, sm: 2, md: 3 } }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column',
              gap: 3,
              minHeight: '80vh',
            }}
          >
            <CircularProgress
              size={64}
              thickness={4}
              sx={{
                color: darkMode ? '#8ab4f8' : '#1a73e8',
                '& .MuiCircularProgress-circle': {
                  strokeLinecap: 'round',
                },
              }}
            />
            <Typography
              variant="h5"
              fontWeight={500}
              sx={{ color: darkMode ? '#e8eaed' : '#202124' }}
            >
              Loading Invoice
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}
            >
              Fetching invoice details...
            </Typography>
            {invoiceId && (
              <Chip
                label={`ID: ${invoiceId.substring(0, 12)}...`}
                size="small"
                sx={{
                  backgroundColor: darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.1)',
                  color: darkMode ? '#8ab4f8' : '#1a73e8',
                  border: 'none',
                  fontFamily: 'monospace',
                  mt: 2,
                }}
              />
            )}
          </Box>
        </Container>
      </MainLayout>
    )
  }

  // Error State - Google Material Design Style
  if (error) {
    return (
      <MainLayout title="Error - Print Invoice">
        <Container maxWidth="xl" sx={{ py: { xs: 2, sm: 3, md: 4 }, px: { xs: 1.5, sm: 2, md: 3 } }}>
          <Paper
            sx={{
              p: 4,
              borderRadius: '16px',
              backgroundColor: darkMode ? '#303134' : '#ffffff',
              border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
              boxShadow: 'none',
              maxWidth: 600,
              margin: '0 auto',
            }}
          >
            <Stack spacing={3} alignItems="center" textAlign="center">
              <Avatar
                sx={{
                  width: 64,
                  height: 64,
                  backgroundColor: darkMode ? 'rgba(234, 67, 53, 0.1)' : 'rgba(234, 67, 53, 0.1)',
                  color: darkMode ? '#f28b82' : '#ea4335',
                }}
              >
                <ErrorIcon sx={{ fontSize: 32 }} />
              </Avatar>

              <Box>
                <Typography
                  variant="h5"
                  fontWeight={500}
                  gutterBottom
                  sx={{ color: darkMode ? '#e8eaed' : '#202124' }}
                >
                  Unable to Load Invoice
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', mb: 1 }}
                >
                  {error}
                </Typography>
                {invoiceId && (
                  <Typography
                    variant="caption"
                    sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', fontFamily: 'monospace' }}
                  >
                    Invoice ID: {invoiceId}
                  </Typography>
                )}
              </Box>

              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={2}
                sx={{ width: '100%', justifyContent: 'center', mt: 1 }}
              >
                <Button
                  startIcon={<ArrowBackIcon />}
                  onClick={() => router.push('/billing')}
                  variant="contained"
                  sx={{
                    borderRadius: '28px',
                    px: 3,
                    py: 1,
                    backgroundColor: darkMode ? '#8ab4f8' : '#1a73e8',
                    color: darkMode ? '#202124' : '#ffffff',
                    textTransform: 'none',
                    fontWeight: 500,
                    boxShadow: 'none',
                    '&:hover': {
                      backgroundColor: darkMode ? '#aecbfa' : '#1669c1',
                      boxShadow: darkMode
                        ? '0 4px 12px rgba(138, 180, 248, 0.3)'
                        : '0 4px 12px rgba(26, 115, 232, 0.3)',
                    },
                  }}
                >
                  Back to Billing
                </Button>

                <Button
                  startIcon={<RefreshIcon />}
                  onClick={handleRetry}
                  variant="outlined"
                  disabled={isRetrying}
                  sx={{
                    borderRadius: '28px',
                    px: 3,
                    py: 1,
                    borderColor: darkMode ? '#3c4043' : '#dadce0',
                    color: darkMode ? '#e8eaed' : '#202124',
                    textTransform: 'none',
                    fontWeight: 500,
                    '&:hover': {
                      borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                      backgroundColor: darkMode ? 'rgba(138, 180, 248, 0.05)' : 'rgba(26, 115, 232, 0.05)',
                      color: darkMode ? '#8ab4f8' : '#1a73e8',
                    },
                  }}
                >
                  {isRetrying ? 'Retrying...' : 'Try Again'}
                </Button>
              </Stack>
            </Stack>
          </Paper>
        </Container>
      </MainLayout>
    )
  }

  // Main Invoice Content - Google Material Design Style
  return (
    <MainLayout title={`Invoice ${order?.invoiceNumber || ''}`}>
      <Box sx={{
        minHeight: '100vh',
        backgroundColor: darkMode ? '#202124' : '#f8f9fa',
        position: 'relative',
      }}>
        {/* Header with Breadcrumbs - Google Material Design Style */}
        <Container maxWidth="xl" sx={{ py: { xs: 2, sm: 3, md: 4 }, px: { xs: 1.5, sm: 2, md: 3 } }}>
          <Stack spacing={3} sx={{ mb: 4 }}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Tooltip title="Back to Billing">
                <IconButton
                  onClick={() => router.push('/billing')}
                  sx={{
                    backgroundColor: darkMode ? '#303134' : '#ffffff',
                    border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                    borderRadius: '12px',
                    width: 40,
                    height: 40,
                    '&:hover': {
                      backgroundColor: darkMode ? '#3c4043' : '#f1f3f4',
                    },
                  }}
                >
                  <ArrowBackIcon sx={{ color: darkMode ? '#e8eaed' : '#202124', fontSize: 20 }} />
                </IconButton>
              </Tooltip>

              <Breadcrumbs>
                <MuiLink
                  component={Link}
                  href="/dashboard"
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    textDecoration: 'none',
                    color: darkMode ? '#9aa0a6' : '#5f6368',
                    '&:hover': {
                      color: darkMode ? '#8ab4f8' : '#1a73e8',
                    },
                    fontSize: { xs: '0.875rem', sm: '1rem' },
                  }}
                >
                  <HomeIcon sx={{ mr: 0.5, fontSize: { xs: 16, sm: 18 } }} />
                  <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
                    Dashboard
                  </Box>
                </MuiLink>
                <MuiLink
                  component={Link}
                  href="/billing"
                  sx={{
                    textDecoration: 'none',
                    color: darkMode ? '#9aa0a6' : '#5f6368',
                    '&:hover': {
                      color: darkMode ? '#8ab4f8' : '#1a73e8',
                    },
                    fontSize: { xs: '0.875rem', sm: '1rem' },
                  }}
                >
                  Billing
                </MuiLink>
                <Typography
                  color={darkMode ? '#e8eaed' : '#202124'}
                  fontSize={{ xs: '0.875rem', sm: '1rem' }}
                >
                  Invoice {order?.invoiceNumber}
                </Typography>
              </Breadcrumbs>
            </Stack>
          </Stack>
        </Container>

        {/* Floating Action Buttons - Google Material Design Style */}
        <Box sx={{
          position: 'fixed',
          top: 100,
          right: 30,
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          gap: 1.5,
          '@media print': { display: 'none' },
        }}>
          <Tooltip title="Back to Billing" arrow placement="left">
            <IconButton
              onClick={() => router.push('/billing')}
              sx={{
                backgroundColor: darkMode ? '#303134' : '#ffffff',
                border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                borderRadius: '12px',
                width: 44,
                height: 44,
                boxShadow: darkMode
                  ? '0 4px 12px rgba(0, 0, 0, 0.3)'
                  : '0 4px 12px rgba(0, 0, 0, 0.08)',
                '&:hover': {
                  backgroundColor: darkMode ? '#3c4043' : '#f1f3f4',
                  color: darkMode ? '#8ab4f8' : '#1a73e8',
                },
              }}
            >
              <ArrowBackIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Print Invoice" arrow placement="left">
            <IconButton
              onClick={handlePrint}
              sx={{
                backgroundColor: darkMode ? '#8ab4f8' : '#1a73e8',
                color: darkMode ? '#202124' : '#ffffff',
                borderRadius: '12px',
                width: 44,
                height: 44,
                boxShadow: darkMode
                  ? '0 4px 12px rgba(138, 180, 248, 0.3)'
                  : '0 4px 12px rgba(26, 115, 232, 0.3)',
                '&:hover': {
                  backgroundColor: darkMode ? '#aecbfa' : '#1669c1',
                },
              }}
            >
              <PrintIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Download PDF" arrow placement="left">
            <IconButton
              onClick={handleDownloadPDF}
              sx={{
                backgroundColor: darkMode ? '#34a853' : '#34a853',
                color: '#ffffff',
                borderRadius: '12px',
                width: 44,
                height: 44,
                boxShadow: darkMode
                  ? '0 4px 12px rgba(52, 168, 83, 0.3)'
                  : '0 4px 12px rgba(52, 168, 83, 0.3)',
                '&:hover': {
                  backgroundColor: darkMode ? '#2e8b47' : '#2e8b47',
                },
              }}
            >
              <DownloadIcon />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Invoice Container - Google Material Design Style */}
        <Container maxWidth="lg" sx={{ py: 2, px: { xs: 1.5, sm: 2, md: 3 } }}>
          <Paper
            id="invoice-content"
            sx={{
              borderRadius: '24px',
              backgroundColor: darkMode ? '#303134' : '#ffffff',
              border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
              boxShadow: darkMode
                ? '0 8px 32px rgba(0, 0, 0, 0.4)'
                : '0 8px 32px rgba(0, 0, 0, 0.08)',
              overflow: 'hidden',
              position: 'relative',
              '@media print': {
                border: 'none',
                borderRadius: 0,
                backgroundColor: '#ffffff',
                boxShadow: 'none',
              },
            }}
          >
            {/* Watermark */}
            {order?.status === 'draft' && (
              <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%) rotate(-45deg)',
                opacity: 0.05,
                zIndex: 0,
                pointerEvents: 'none',
              }}>
                <Typography
                  variant="h1"
                  fontWeight={900}
                  sx={{ color: darkMode ? '#e8eaed' : '#202124', fontSize: { xs: '3rem', sm: '5rem' } }}
                >
                  DRAFT
                </Typography>
              </Box>
            )}

            {/* Header - Google Material Design Style Gradient */}
            <Box sx={{
              p: { xs: 3, sm: 4 },
              background: darkMode
                ? 'linear-gradient(135deg, #0d3064 0%, #202124 100%)'
                : 'linear-gradient(135deg, #e3f2fd 0%, #ffffff 100%)',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: 'linear-gradient(90deg, #1a73e8, #8ab4f8, #fbbc04)',
                zIndex: 1,
              },
            }}>
              {/* Decorative elements */}
              <Box sx={{
                position: 'absolute',
                top: -50,
                right: -50,
                width: 200,
                height: 200,
                borderRadius: '50%',
                bgcolor: darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.05)',
              }} />
              <Box sx={{
                position: 'absolute',
                bottom: -80,
                left: -80,
                width: 300,
                height: 300,
                borderRadius: '50%',
                bgcolor: darkMode ? 'rgba(251, 188, 4, 0.05)' : 'rgba(251, 188, 4, 0.03)',
              }} />

              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                justifyContent="space-between"
                alignItems={{ xs: 'flex-start', sm: 'center' }}
                spacing={2}
                sx={{ position: 'relative', zIndex: 1 }}
              >
                <Box>
                  <Typography
                    variant={isMobile ? "h4" : "h3"}
                    fontWeight={700}
                    gutterBottom
                    sx={{
                      color: darkMode ? '#e8eaed' : '#202124',
                      letterSpacing: '-0.5px',
                    }}
                  >
                    TAX INVOICE
                  </Typography>
                  <Typography
                    variant="h6"
                    fontWeight={500}
                    sx={{
                      color: darkMode ? '#9aa0a6' : '#5f6368',
                      opacity: 0.9,
                    }}
                  >
                    {business?.businessName || 'My Business'}
                  </Typography>
                </Box>

                <Box sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
                  <Typography
                    variant={isMobile ? "h5" : "h4"}
                    fontWeight={700}
                    sx={{
                      color: darkMode ? '#8ab4f8' : '#1a73e8',
                      mb: 0.5,
                    }}
                  >
                    {order?.invoiceNumber}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: darkMode ? '#9aa0a6' : '#5f6368',
                    }}
                  >
                    {order && formatDate(order.invoiceDate)}
                  </Typography>
                </Box>
              </Stack>
            </Box>

            {/* Business & Customer Info - Google Material Design Style */}
            <Box sx={{ p: { xs: 3, sm: 4 } }}>
              <Stack
                direction={{ xs: 'column', md: 'row' }}
                spacing={3}
                sx={{ mb: 4 }}
              >
                {/* Seller Details Card */}
                <Box sx={{ flex: 1 }}>
                  <Card
                    sx={{
                      borderRadius: '16px',
                      backgroundColor: darkMode ? '#202124' : '#f8f9fa',
                      border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                      boxShadow: 'none',
                      height: '100%',
                    }}
                  >
                    <CardContent sx={{ p: { xs: 2, sm: 2.5 } }}>
                      <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2 }}>
                        <Avatar
                          sx={{
                            width: 32,
                            height: 32,
                            backgroundColor: darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.1)',
                            color: darkMode ? '#8ab4f8' : '#1a73e8',
                          }}
                        >
                          <StoreIcon sx={{ fontSize: 18 }} />
                        </Avatar>
                        <Typography variant="h6" fontWeight={500} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                          Seller Details
                        </Typography>
                      </Stack>

                      {business ? (
                        <Stack spacing={2}>
                          <Box>
                            <Typography variant="subtitle1" fontWeight={600} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                              {business.businessName}
                            </Typography>
                            <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mt: 1 }}>
                              <LocationIcon sx={{ fontSize: 16, color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                              <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                                {business.address}, {business.city}, {business.state} - {business.pincode}
                              </Typography>
                            </Stack>
                          </Box>

                          <Divider sx={{ borderColor: darkMode ? '#3c4043' : '#dadce0' }} />

                          <Stack spacing={1.5}>
                            <Stack direction="row" alignItems="center" spacing={1}>
                              <ReceiptIcon sx={{ fontSize: 16, color: darkMode ? '#8ab4f8' : '#1a73e8' }} />
                              <Typography variant="body2" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                                <strong>GSTIN:</strong>{' '}
                                <span style={{ fontFamily: 'monospace', color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                                  {business.gstNumber}
                                </span>
                              </Typography>
                            </Stack>

                            <Stack direction="row" alignItems="center" spacing={1}>
                              <PhoneIcon sx={{ fontSize: 16, color: darkMode ? '#8ab4f8' : '#1a73e8' }} />
                              <Typography variant="body2" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                                <strong>Phone:</strong>{' '}
                                <span style={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>{business.phone}</span>
                              </Typography>
                            </Stack>

                            <Stack direction="row" alignItems="center" spacing={1}>
                              <EmailIcon sx={{ fontSize: 16, color: darkMode ? '#8ab4f8' : '#1a73e8' }} />
                              <Typography variant="body2" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                                <strong>Email:</strong>{' '}
                                <span style={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>{business.email}</span>
                              </Typography>
                            </Stack>
                          </Stack>
                        </Stack>
                      ) : (
                        <Alert
                          severity="info"
                          sx={{
                            borderRadius: '12px',
                            backgroundColor: darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.05)',
                            border: `1px solid ${darkMode ? 'rgba(138, 180, 248, 0.2)' : 'rgba(26, 115, 232, 0.1)'}`,
                            color: darkMode ? '#8ab4f8' : '#1a73e8',
                            '& .MuiAlert-icon': {
                              color: darkMode ? '#8ab4f8' : '#1a73e8',
                            },
                          }}
                        >
                          <Typography variant="body2">
                            Business information not available. Please update your business profile.
                          </Typography>
                        </Alert>
                      )}
                    </CardContent>
                  </Card>
                </Box>

                {/* Customer Details Card */}
                <Box sx={{ flex: 1 }}>
                  <Card
                    sx={{
                      borderRadius: '16px',
                      backgroundColor: darkMode ? '#202124' : '#f8f9fa',
                      border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                      boxShadow: 'none',
                      height: '100%',
                    }}
                  >
                    <CardContent sx={{ p: { xs: 2, sm: 2.5 } }}>
                      <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2 }}>
                        <Avatar
                          sx={{
                            width: 32,
                            height: 32,
                            backgroundColor: darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.1)',
                            color: darkMode ? '#8ab4f8' : '#1a73e8',
                          }}
                        >
                          <PersonIcon sx={{ fontSize: 18 }} />
                        </Avatar>
                        <Typography variant="h6" fontWeight={500} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                          Bill To
                        </Typography>
                      </Stack>

                      {order && (
                        <Stack spacing={2}>
                          <Box>
                            <Typography variant="subtitle1" fontWeight={600} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                              {order.customer.name}
                            </Typography>

                            <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mt: 1 }}>
                              <PhoneIcon sx={{ fontSize: 16, color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                              <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                                {order.customer.phone}
                              </Typography>
                            </Stack>

                            {order.customer.email && (
                              <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mt: 0.5 }}>
                                <EmailIcon sx={{ fontSize: 16, color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                                <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                                  {order.customer.email}
                                </Typography>
                              </Stack>
                            )}

                            {order.customer.address && (
                              <Stack direction="row" alignItems="flex-start" spacing={0.5} sx={{ mt: 0.5 }}>
                                <LocationIcon sx={{ fontSize: 16, color: darkMode ? '#9aa0a6' : '#5f6368', mt: 0.2 }} />
                                <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                                  {order.customer.address}
                                  {order.customer.city && `, ${order.customer.city}`}
                                  {order.customer.pincode && ` - ${order.customer.pincode}`}
                                </Typography>
                              </Stack>
                            )}
                          </Box>

                          <Divider sx={{ borderColor: darkMode ? '#3c4043' : '#dadce0' }} />

                          <Stack spacing={1.5}>
                            {order.customer.gstin && order.customer.gstin !== 'NA' && (
                              <Stack direction="row" alignItems="center" spacing={1}>
                                <ReceiptIcon sx={{ fontSize: 16, color: darkMode ? '#8ab4f8' : '#1a73e8' }} />
                                <Typography variant="body2" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                                  <strong>GSTIN:</strong>{' '}
                                  <span style={{ fontFamily: 'monospace', color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                                    {order.customer.gstin}
                                  </span>
                                </Typography>
                              </Stack>
                            )}

                            <Stack direction="row" alignItems="center" spacing={1} sx={{ flexWrap: 'wrap', gap: 0.5 }}>
                              <Chip
                                label={order.customer.isInterState ? 'Inter-State' : 'Intra-State'}
                                size="small"
                                sx={{
                                  backgroundColor: order.customer.isInterState
                                    ? darkMode ? 'rgba(251, 188, 4, 0.1)' : 'rgba(251, 188, 4, 0.1)'
                                    : darkMode ? 'rgba(52, 168, 83, 0.1)' : 'rgba(52, 168, 83, 0.1)',
                                  color: order.customer.isInterState
                                    ? darkMode ? '#fdd663' : '#fbbc04'
                                    : darkMode ? '#81c995' : '#34a853',
                                  border: 'none',
                                }}
                              />
                              <Chip
                                label={`State: ${order.customer.state}`}
                                size="small"
                                sx={{
                                  backgroundColor: darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.1)',
                                  color: darkMode ? '#8ab4f8' : '#1a73e8',
                                  border: 'none',
                                }}
                              />
                            </Stack>
                          </Stack>
                        </Stack>
                      )}
                    </CardContent>
                  </Card>
                </Box>
              </Stack>

              {/* Items Table - Google Material Design Style */}
              <Paper
                sx={{
                  borderRadius: '16px',
                  backgroundColor: darkMode ? '#202124' : '#f8f9fa',
                  border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                  boxShadow: 'none',
                  overflow: 'hidden',
                  mb: 4,
                }}
              >
                <TableContainer sx={{ overflowX: 'auto' }}>
                  <Table sx={{ minWidth: 800 }}>
                    <TableHead>
                      <TableRow sx={{ backgroundColor: darkMode ? '#202124' : '#f8f9fa' }}>
                        {['#', 'Description', 'HSN', 'Qty', 'Rate', 'Disc%', 'Taxable Amt', 'Tax Amt', 'Total'].map((header, index) => (
                          <TableCell
                            key={header}
                            sx={{
                              fontWeight: 600,
                              py: 2,
                              color: darkMode ? '#9aa0a6' : '#5f6368',
                              borderBottom: `2px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                              whiteSpace: 'nowrap',
                              ...(index >= 3 && { textAlign: 'right' }),
                            }}
                          >
                            {header}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {order?.items.map((item, index) => (
                        <TableRow
                          key={index}
                          hover
                          sx={{
                            '&:hover': {
                              backgroundColor: darkMode ? alpha('#8ab4f8', 0.08) : alpha('#1a73e8', 0.04),
                            },
                            '& td': {
                              borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                              py: 2,
                            },
                          }}
                        >
                          <TableCell sx={{ color: darkMode ? '#e8eaed' : '#202124', fontWeight: 500, whiteSpace: 'nowrap' }}>
                            {index + 1}
                          </TableCell>

                          <TableCell sx={{ minWidth: 180 }}>
                            <Typography variant="body2" fontWeight={600} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                              {item.name}
                            </Typography>
                            {item.variationName && (
                              <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                                {item.variationName}
                              </Typography>
                            )}
                          </TableCell>

                          <TableCell sx={{ whiteSpace: 'nowrap' }}>
                            <Chip
                              label={item.hsnCode}
                              size="small"
                              sx={{
                                backgroundColor: darkMode ? 'rgba(154, 160, 166, 0.1)' : 'rgba(154, 160, 166, 0.1)',
                                color: darkMode ? '#9aa0a6' : '#5f6368',
                                border: 'none',
                                fontFamily: 'monospace',
                              }}
                            />
                          </TableCell>

                          <TableCell align="right" sx={{ color: darkMode ? '#e8eaed' : '#202124', fontWeight: 600, whiteSpace: 'nowrap' }}>
                            {item.quantity}
                          </TableCell>

                          <TableCell align="right" sx={{ color: darkMode ? '#e8eaed' : '#202124', whiteSpace: 'nowrap' }}>
                            {formatCurrency(item.price)}
                          </TableCell>

                          <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
                            {item.discount > 0 ? (
                              <Chip
                                label={`${item.discount}%`}
                                size="small"
                                sx={{
                                  backgroundColor: darkMode ? 'rgba(234, 67, 53, 0.1)' : 'rgba(234, 67, 53, 0.1)',
                                  color: darkMode ? '#f28b82' : '#ea4335',
                                  border: 'none',
                                }}
                              />
                            ) : (
                              <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                                0%
                              </Typography>
                            )}
                          </TableCell>

                          <TableCell align="right" sx={{ color: darkMode ? '#e8eaed' : '#202124', fontWeight: 500, whiteSpace: 'nowrap' }}>
                            {formatCurrency(item.taxableAmount)}
                          </TableCell>

                          <TableCell align="right" sx={{ color: darkMode ? '#e8eaed' : '#202124', whiteSpace: 'nowrap' }}>
                            {formatCurrency(item.cgstAmount + item.sgstAmount + item.igstAmount)}
                          </TableCell>

                          <TableCell
                            align="right"
                            sx={{
                              fontWeight: 700,
                              color: darkMode ? '#8ab4f8' : '#1a73e8',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {formatCurrency(item.total)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>

              {/* Totals Section - Google Material Design Style */}
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 4 }}>
                <Box sx={{ width: '100%', maxWidth: 400 }}>
                  <Paper
                    sx={{
                      p: { xs: 2.5, sm: 3 },
                      borderRadius: '16px',
                      backgroundColor: darkMode ? '#202124' : '#f8f9fa',
                      border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                      boxShadow: 'none',
                    }}
                  >
                    <Stack spacing={2}>
                      {/* Subtotal & Discount */}
                      <Stack direction="row" justifyContent="space-between">
                        <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                          Subtotal:
                        </Typography>
                        <Typography variant="body2" fontWeight={600} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                          {order && formatCurrency(order.subtotal)}
                        </Typography>
                      </Stack>

                      {order && order.totalDiscount > 0 && (
                        <Stack direction="row" justifyContent="space-between">
                          <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                            Discount:
                          </Typography>
                          <Typography variant="body2" fontWeight={600} sx={{ color: darkMode ? '#f28b82' : '#ea4335' }}>
                            -{order && formatCurrency(order.totalDiscount)}
                          </Typography>
                        </Stack>
                      )}

                      {/* Taxable Amount */}
                      <Stack direction="row" justifyContent="space-between">
                        <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                          Taxable Amount:
                        </Typography>
                        <Typography variant="body2" fontWeight={600} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                          {order && formatCurrency(order.totalTaxableAmount)}
                        </Typography>
                      </Stack>

                      {/* Taxes */}
                      {order && order.totalCgst > 0 && (
                        <>
                          <Stack direction="row" justifyContent="space-between">
                            <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                              CGST:
                            </Typography>
                            <Typography variant="body2" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                              {order && formatCurrency(order.totalCgst)}
                            </Typography>
                          </Stack>
                          <Stack direction="row" justifyContent="space-between">
                            <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                              SGST:
                            </Typography>
                            <Typography variant="body2" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                              {order && formatCurrency(order.totalSgst)}
                            </Typography>
                          </Stack>
                        </>
                      )}

                      {order && order.totalIgst > 0 && (
                        <Stack direction="row" justifyContent="space-between">
                          <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                            IGST:
                          </Typography>
                          <Typography variant="body2" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                            {order && formatCurrency(order.totalIgst)}
                          </Typography>
                        </Stack>
                      )}

                      <Divider sx={{ borderColor: darkMode ? '#3c4043' : '#dadce0' }} />

                      {/* Grand Total */}
                      <Paper
                        sx={{
                          p: 2,
                          borderRadius: '12px',
                          backgroundColor: darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.05)',
                          border: `1px solid ${darkMode ? 'rgba(138, 180, 248, 0.2)' : 'rgba(26, 115, 232, 0.1)'}`,
                        }}
                      >
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                          <Typography variant="h6" fontWeight={600} sx={{ color: darkMode ? '#8ab4f8' : '#1a73e8' }}>
                            GRAND TOTAL:
                          </Typography>
                          <Typography variant="h5" fontWeight={700} sx={{ color: darkMode ? '#8ab4f8' : '#1a73e8' }}>
                            {order && formatCurrency(order.grandTotal)}
                          </Typography>
                        </Stack>
                      </Paper>
                    </Stack>
                  </Paper>
                </Box>
              </Box>

              {/* Footer - Google Material Design Style */}
              <Box sx={{ pt: 2 }}>
                <Stack spacing={3}>
                  {/* Payment & Status Info */}
                  <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    justifyContent="space-between"
                    alignItems={{ xs: 'flex-start', sm: 'center' }}
                    spacing={2}
                  >
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <PaymentIcon sx={{ fontSize: 20, color: darkMode ? '#8ab4f8' : '#1a73e8' }} />
                        <Typography variant="body2" fontWeight={600} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                          Payment:
                        </Typography>
                      </Stack>
                      <Chip
                        icon={<span style={{ fontSize: '1rem' }}>{getPaymentMethodIcon(order?.paymentMethod || '')}</span>}
                        label={order?.paymentMethod?.toUpperCase() || 'CASH'}
                        size="small"
                        sx={{
                          backgroundColor: darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.1)',
                          color: darkMode ? '#8ab4f8' : '#1a73e8',
                          border: 'none',
                        }}
                      />
                    </Stack>

                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Typography variant="body2" fontWeight={600} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                        Status:
                      </Typography>
                      <Chip
                        label={order?.status?.toUpperCase() || 'PENDING'}
                        size="small"
                        sx={{
                          backgroundColor: order?.status?.toLowerCase() === 'paid'
                            ? darkMode ? 'rgba(52, 168, 83, 0.1)' : 'rgba(52, 168, 83, 0.1)'
                            : order?.status?.toLowerCase() === 'pending'
                            ? darkMode ? 'rgba(251, 188, 4, 0.1)' : 'rgba(251, 188, 4, 0.1)'
                            : darkMode ? 'rgba(154, 160, 166, 0.1)' : 'rgba(154, 160, 166, 0.1)',
                          color: order?.status?.toLowerCase() === 'paid'
                            ? darkMode ? '#81c995' : '#34a853'
                            : order?.status?.toLowerCase() === 'pending'
                            ? darkMode ? '#fdd663' : '#fbbc04'
                            : darkMode ? '#9aa0a6' : '#5f6368',
                          border: 'none',
                        }}
                      />
                    </Stack>
                  </Stack>

                  {/* Notes */}
                  {order?.notes && (
                    <Box>
                      <Typography
                        variant="body2"
                        fontWeight={600}
                        gutterBottom
                        sx={{ color: darkMode ? '#e8eaed' : '#202124' }}
                      >
                        Notes:
                      </Typography>
                      <Paper
                        sx={{
                          p: 2,
                          borderRadius: '12px',
                          backgroundColor: darkMode ? '#202124' : '#f8f9fa',
                          border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                        }}
                      >
                        <Typography variant="body2" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                          {order.notes}
                        </Typography>
                      </Paper>
                    </Box>
                  )}

                  {/* Footer Text */}
                  <Box sx={{ textAlign: 'center', pt: 2 }}>
                    <Typography
                      variant="body2"
                      sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', mb: 1 }}
                    >
                      Thank you for your business! We appreciate your trust in us.
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}
                    >
                      This is a computer generated invoice. No signature required. • Invoice ID: {order?._id}
                    </Typography>
                  </Box>
                </Stack>
              </Box>
            </Box>
          </Paper>
        </Container>

        {/* Print Styles - Keep as is */}
        <style jsx global>{`
          @media print {
            body {
              margin: 0 !important;
              padding: 0 !important;
              background: white !important;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            
            @page {
              margin: 15mm;
              size: A4 portrait;
            }
            
            /* Hide all UI elements */
            body > *:not(#invoice-content) {
              display: none !important;
            }
            
            /* Invoice styling for print */
            #invoice-content {
              width: 100% !important;
              max-width: 100% !important;
              margin: 0 !important;
              padding: 0 !important;
              border: none !important;
              box-shadow: none !important;
              border-radius: 0 !important;
              page-break-inside: avoid;
              page-break-after: avoid;
              background: white !important;
            }
            
            /* Force background colors to print */
            * {
              -webkit-print-color-adjust: exact !important;
              color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            
            /* Hide decorative elements for print */
            .MuiIconButton-root,
            .MuiTooltip-popper {
              display: none !important;
            }
            
            /* Ensure table fits */
            table {
              font-size: 12px !important;
            }
            
            /* Optimize spacing for print */
            .MuiPaper-root {
              padding: 10px !important;
              margin: 5px 0 !important;
              box-shadow: none !important;
            }
            
            /* Header print styling */
            .MuiBox-root {
              break-inside: avoid;
            }
            
            /* Table print styling */
            .MuiTableCell-root {
              padding: 6px 8px !important;
            }
          }
        `}</style>
      </Box>
    </MainLayout>
  )
}