// app/billing/print/[id]/page.tsx
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
  CardContent
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
  LocationOn as LocationIcon
} from '@mui/icons-material'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

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

  // Loading State
  if (isLoading && !isRetrying) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Container maxWidth="lg" sx={{ 
          py: 8, 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center', 
          minHeight: '80vh',
          bgcolor: 'background.default'
        }}>
          <CircularProgress 
            size={80} 
            thickness={4}
            sx={{ 
              mb: 4, 
              color: 'primary.main',
              '& .MuiCircularProgress-circle': {
                strokeLinecap: 'round'
              }
            }} 
          />
          <Typography variant="h5" fontWeight="700" gutterBottom color="primary">
            Loading Invoice
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            Fetching invoice details...
          </Typography>
          {invoiceId && (
            <Chip
              label={`ID: ${invoiceId.substring(0, 12)}...`}
              size="small"
              variant="outlined"
              sx={{ mt: 1 }}
            />
          )}
        </Container>
      </motion.div>
    )
  }

  // Error State
  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Container maxWidth="md" sx={{ py: 8, bgcolor: 'background.default' }}>
          <Paper 
            elevation={0}
            sx={{ 
              p: 4, 
              borderRadius: 3, 
              border: '1px solid',
              borderColor: 'error.light',
              bgcolor: 'error.50'
            }}
          >
            <Stack spacing={3} alignItems="center" textAlign="center">
              <ErrorIcon sx={{ fontSize: 60, color: 'error.main' }} />
              
              <Box>
                <Typography variant="h5" fontWeight="700" gutterBottom color="error.dark">
                  Unable to Load Invoice
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                  {error}
                </Typography>
                {invoiceId && (
                  <Typography variant="caption" color="text.secondary">
                    Invoice ID: {invoiceId}
                  </Typography>
                )}
              </Box>

              <Stack direction="row" spacing={2} sx={{ mt: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
                <Button
                  startIcon={<ArrowBackIcon />}
                  onClick={() => router.push('/billing')}
                  variant="contained"
                  size="large"
                  sx={{ 
                    px: 4,
                    borderRadius: '10px',
                    bgcolor: 'primary.main',
                    '&:hover': { bgcolor: 'primary.dark' },
                    mb: { xs: 1, sm: 0 }
                  }}
                >
                  Back to Billing
                </Button>
                
                <Button
                  startIcon={<RefreshIcon />}
                  onClick={handleRetry}
                  variant="outlined"
                  size="large"
                  disabled={isRetrying}
                  sx={{ 
                    px: 4,
                    borderRadius: '10px',
                    borderColor: 'primary.main',
                    color: 'primary.main',
                    mb: { xs: 1, sm: 0 }
                  }}
                >
                  {isRetrying ? 'Retrying...' : 'Try Again'}
                </Button>
              </Stack>
            </Stack>
          </Paper>
        </Container>
      </motion.div>
    )
  }

  // Main Invoice Content
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Box sx={{ 
        minHeight: '100vh', 
        bgcolor: 'background.default',
        position: 'relative'
      }}>
        {/* Floating Action Buttons */}
        <Box sx={{
          position: 'fixed',
          top: 100,
          right: 30,
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          '@media print': { display: 'none' }
        }}>
          <Tooltip title="Back to Billing" arrow>
            <IconButton
              onClick={() => router.push('/billing')}
              sx={{
                bgcolor: 'background.paper',
                boxShadow: 3,
                '&:hover': { 
                  bgcolor: 'primary.main',
                  color: 'white'
                }
              }}
            >
              <ArrowBackIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Print Invoice" arrow>
            <IconButton
              onClick={handlePrint}
              sx={{
                bgcolor: 'primary.main',
                color: 'white',
                boxShadow: 3,
                '&:hover': { bgcolor: 'primary.dark' }
              }}
            >
              <PrintIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Download PDF" arrow>
            <IconButton
              onClick={handleDownloadPDF}
              sx={{
                bgcolor: 'background.paper',
                boxShadow: 3,
                '&:hover': { 
                  bgcolor: 'success.main',
                  color: 'white'
                }
              }}
            >
              <DownloadIcon />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Invoice Container */}
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Paper 
            id="invoice-content"
            elevation={0}
            sx={{ 
              borderRadius: 4,
              overflow: 'hidden',
              border: '1px solid',
              borderColor: 'divider',
              bgcolor: 'background.paper',
              position: 'relative',
              '@media print': { 
                border: 'none',
                borderRadius: 0,
                bgcolor: 'white',
                boxShadow: 'none'
              }
            }}
          >
            {/* Watermark */}
            {order?.status === 'draft' && (
              <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%) rotate(-45deg)',
                opacity: 0.1,
                zIndex: 0,
                pointerEvents: 'none'
              }}>
                <Typography variant="h1" fontWeight="900" color="text.secondary">
                  DRAFT
                </Typography>
              </Box>
            )}

            {/* Header */}
            <Box sx={{ 
              p: 4, 
              bgcolor: 'primary.main',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* Decorative elements */}
              <Box sx={{
                position: 'absolute',
                top: -50,
                right: -50,
                width: 200,
                height: 200,
                borderRadius: '50%',
                bgcolor: 'rgba(255,255,255,0.1)'
              }} />
              
              <Box sx={{
                position: 'absolute',
                bottom: -80,
                left: -80,
                width: 300,
                height: 300,
                borderRadius: '50%',
                bgcolor: 'rgba(255,255,255,0.05)'
              }} />

              <Box sx={{ 
                display: 'flex', 
                flexDirection: { xs: 'column', sm: 'row' },
                justifyContent: 'space-between', 
                alignItems: { xs: 'flex-start', sm: 'center' },
                gap: 2,
                position: 'relative', 
                zIndex: 1 
              }}>
                <Box>
                  <Typography variant="h3" fontWeight="900" gutterBottom>
                    TAX INVOICE
                  </Typography>
                  <Typography variant="h6" fontWeight="500" sx={{ opacity: 0.9 }}>
                    {business?.businessName || 'My Business'}
                  </Typography>
                </Box>

                <Box sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
                  <Typography variant="h4" fontWeight="800">
                    {order?.invoiceNumber}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
                    {order && formatDate(order.invoiceDate)}
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Business & Customer Info */}
            <Box sx={{ p: 4 }}>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: { xs: 'column', md: 'row' },
                gap: 3,
                mb: 3
              }}>
                {/* Seller Details Card */}
                <Box sx={{ flex: 1 }}>
                  <Card sx={{ 
                    borderRadius: 3,
                    border: '1px solid',
                    borderColor: 'primary.light',
                    height: '100%'
                  }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                        <StoreIcon sx={{ 
                          color: 'primary.main', 
                          fontSize: 28,
                          p: 1,
                          borderRadius: '50%'
                        }} />
                        <Typography variant="h6" fontWeight="700" color="primary">
                          Seller Details
                        </Typography>
                      </Box>

                      {business ? (
                        <Stack spacing={2}>
                          <Box>
                            <Typography variant="subtitle1" fontWeight="600" gutterBottom color="text.primary">
                              {business.businessName}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                              <LocationIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                              <Typography variant="body2" color="text.secondary">
                                {business.address}, {business.city}
                              </Typography>
                            </Box>
                            <Typography variant="body2" color="text.secondary">
                              {business.state} - {business.pincode}
                            </Typography>
                          </Box>

                          <Divider />

                          <Stack spacing={1.5}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <ReceiptIcon sx={{ fontSize: 16, color: 'primary.main' }} />
                              <Typography variant="body2">
                                <strong style={{ color: '#2c3e50' }}>GSTIN:</strong>{' '}
                                <span style={{ color: '#4b5563', fontFamily: 'monospace' }}>
                                  {business.gstNumber}
                                </span>
                              </Typography>
                            </Box>
                            
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <PhoneIcon sx={{ fontSize: 16, color: 'primary.main' }} />
                              <Typography variant="body2">
                                <strong style={{ color: '#2c3e50' }}>Phone:</strong>{' '}
                                <span style={{ color: '#4b5563' }}>{business.phone}</span>
                              </Typography>
                            </Box>
                            
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <EmailIcon sx={{ fontSize: 16, color: 'primary.main' }} />
                              <Typography variant="body2">
                                <strong style={{ color: '#2c3e50' }}>Email:</strong>{' '}
                                <span style={{ color: '#4b5563' }}>{business.email}</span>
                              </Typography>
                            </Box>
                          </Stack>
                        </Stack>
                      ) : (
                        <Alert severity="info" sx={{ mt: 2 }}>
                          Business information not available. Please update your business profile.
                        </Alert>
                      )}
                    </CardContent>
                  </Card>
                </Box>

                {/* Customer Details Card */}
                <Box sx={{ flex: 1 }}>
                  <Card sx={{ 
                    borderRadius: 3,
                    border: '1px solid',
                    borderColor: 'secondary.light',
                    height: '100%'
                  }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                        <PersonIcon sx={{ 
                          color: 'secondary.main', 
                          fontSize: 28,
                          p: 1,
                          borderRadius: '50%'
                        }} />
                        <Typography variant="h6" fontWeight="700" color="secondary">
                          Bill To
                        </Typography>
                      </Box>

                      {order && (
                        <Stack spacing={2}>
                          <Box>
                            <Typography variant="subtitle1" fontWeight="600" gutterBottom color="text.primary">
                              {order.customer.name}
                            </Typography>
                            
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                              <PhoneIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                              <Typography variant="body2" color="text.secondary">
                                {order.customer.phone}
                              </Typography>
                            </Box>
                            
                            {order.customer.email && (
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                <EmailIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                                <Typography variant="body2" color="text.secondary">
                                  {order.customer.email}
                                </Typography>
                              </Box>
                            )}
                            
                            {order.customer.address && (
                              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                                <LocationIcon sx={{ fontSize: 16, color: 'text.secondary', mt: 0.5 }} />
                                <Typography variant="body2" color="text.secondary">
                                  {order.customer.address}
                                  {order.customer.city && `, ${order.customer.city}`}
                                  {order.customer.pincode && ` - ${order.customer.pincode}`}
                                </Typography>
                              </Box>
                            )}
                          </Box>

                          <Divider />

                          <Stack spacing={1.5}>
                            {order.customer.gstin && order.customer.gstin !== 'NA' && (
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <ReceiptIcon sx={{ fontSize: 16, color: 'secondary.main' }} />
                                <Typography variant="body2">
                                  <strong style={{ color: '#2c3e50' }}>GSTIN:</strong>{' '}
                                  <span style={{ color: '#4b5563', fontFamily: 'monospace' }}>
                                    {order.customer.gstin}
                                  </span>
                                </Typography>
                              </Box>
                            )}
                            
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                              <Chip
                                label={order.customer.isInterState ? 'Inter-State' : 'Intra-State'}
                                size="small"
                                color={order.customer.isInterState ? 'warning' : 'success'}
                                variant="outlined"
                              />
                              <Chip
                                label={`State: ${order.customer.state}`}
                                size="small"
                                variant="outlined"
                              />
                            </Box>
                          </Stack>
                        </Stack>
                      )}
                    </CardContent>
                  </Card>
                </Box>
              </Box>
            </Box>

            {/* Items Table */}
            <Box sx={{ px: { xs: 2, md: 4 }, overflowX: 'auto' }}>
              <Paper sx={{ 
                borderRadius: 3, 
                overflow: 'hidden', 
                border: '1px solid', 
                borderColor: 'divider',
                minWidth: 800
              }}>
                <TableContainer>
                  <Table sx={{ minWidth: 800 }}>
                    <TableHead>
                      <TableRow>
                        {['#', 'Description', 'HSN', 'Qty', 'Rate', 'Disc%', 'Taxable Amt', 'Tax Amt', 'Total'].map((header, index) => (
                          <TableCell 
                            key={header}
                            sx={{ 
                              fontWeight: '800', 
                              py: 2.5,
                              color: 'primary.main',
                              borderBottom: '2px solid',
                              borderColor: 'primary.main',
                              whiteSpace: 'nowrap'
                            }}
                            align={index >= 3 ? 'right' : 'left'}
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
                            '&:last-child td': { borderBottom: 0 },
                            '&:hover': { bgcolor: 'action.hover' }
                          }}
                        >
                          <TableCell sx={{ py: 2.5, fontWeight: '500', whiteSpace: 'nowrap' }}>
                            {index + 1}
                          </TableCell>
                          
                          <TableCell sx={{ py: 2.5, minWidth: 180 }}>
                            <Typography variant="body2" fontWeight="600" color="text.primary">
                              {item.name}
                            </Typography>
                            {item.variationName && (
                              <Typography variant="caption" color="text.secondary">
                                {item.variationName}
                              </Typography>
                            )}
                          </TableCell>
                          
                          <TableCell sx={{ py: 2.5, whiteSpace: 'nowrap' }}>
                            <Chip 
                              label={item.hsnCode} 
                              size="small" 
                              variant="outlined"
                              sx={{ borderColor: 'primary.light' }}
                            />
                          </TableCell>
                          
                          <TableCell align="right" sx={{ py: 2.5, fontWeight: '600', whiteSpace: 'nowrap' }}>
                            {item.quantity}
                          </TableCell>
                          
                          <TableCell align="right" sx={{ py: 2.5, whiteSpace: 'nowrap' }}>
                            {formatCurrency(item.price)}
                          </TableCell>
                          
                          <TableCell align="right" sx={{ py: 2.5, whiteSpace: 'nowrap' }}>
                            {item.discount > 0 ? (
                              <Chip 
                                label={`${item.discount}%`} 
                                size="small" 
                                color="error"
                                variant="outlined"
                              />
                            ) : (
                              <Typography variant="body2" color="text.secondary">
                                0%
                              </Typography>
                            )}
                          </TableCell>
                          
                          <TableCell align="right" sx={{ py: 2.5, fontWeight: '500', whiteSpace: 'nowrap', color: 'text.primary' }}>
                            {formatCurrency(item.taxableAmount)}
                          </TableCell>
                          
                          <TableCell align="right" sx={{ py: 2.5, whiteSpace: 'nowrap', color: 'text.primary' }}>
                            {formatCurrency(item.cgstAmount + item.sgstAmount + item.igstAmount)}
                          </TableCell>
                          
                          <TableCell align="right" sx={{ 
                            py: 2.5, 
                            fontWeight: '700', 
                            color: 'primary.main', 
                            whiteSpace: 'nowrap'
                          }}>
                            {formatCurrency(item.total)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Box>

            {/* Totals Section */}
            <Box sx={{ p: 4, mt: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Box sx={{ width: '100%', maxWidth: 400 }}>
                  <Paper sx={{ 
                    p: 4, 
                    borderRadius: 3,
                    border: '1px solid',
                    borderColor: 'divider'
                  }}>
                    <Stack spacing={2}>
                      {/* Subtotal & Discount */}
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body1" color="text.secondary">
                          Subtotal:
                        </Typography>
                        <Typography variant="body1" fontWeight="600" color="text.primary">
                          {order && formatCurrency(order.subtotal)}
                        </Typography>
                      </Box>
                      
                      {order && order.totalDiscount > 0 && (
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body1" color="text.secondary">
                            Discount:
                          </Typography>
                          <Typography variant="body1" fontWeight="600" color="error.main">
                            -{order && formatCurrency(order.totalDiscount)}
                          </Typography>
                        </Box>
                      )}
                      
                      {/* Taxable Amount */}
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body1" color="text.secondary">
                          Taxable Amount:
                        </Typography>
                        <Typography variant="body1" fontWeight="600" color="text.primary">
                          {order && formatCurrency(order.totalTaxableAmount)}
                        </Typography>
                      </Box>
                      
                      {/* Taxes */}
                      {order && order.totalCgst > 0 && (
                        <>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="body1" color="text.secondary">
                              CGST:
                            </Typography>
                            <Typography variant="body1" color="text.primary">
                              {order && formatCurrency(order.totalCgst)}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="body1" color="text.secondary">
                              SGST:
                            </Typography>
                            <Typography variant="body1" color="text.primary">
                              {order && formatCurrency(order.totalSgst)}
                            </Typography>
                          </Box>
                        </>
                      )}
                      
                      {order && order.totalIgst > 0 && (
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body1" color="text.secondary">
                            IGST:
                          </Typography>
                          <Typography variant="body1" color="text.primary">
                            {order && formatCurrency(order.totalIgst)}
                          </Typography>
                        </Box>
                      )}
                      
                      <Divider sx={{ my: 1, borderColor: 'divider' }} />
                      
                      {/* Grand Total */}
                      <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        py: 2,
                        px: 3,
                        borderRadius: 2,
                        border: '2px solid',
                        borderColor: 'primary.main'
                      }}>
                        <Typography variant="h5" fontWeight="800" color="primary.dark">
                          GRAND TOTAL:
                        </Typography>
                        <Typography variant="h4" fontWeight="900" color="primary.main">
                          {order && formatCurrency(order.grandTotal)}
                        </Typography>
                      </Box>
                    </Stack>
                  </Paper>
                </Box>
              </Box>
            </Box>

            {/* Footer */}
            <Box sx={{ 
              p: 4, 
              borderTop: '1px solid',
              borderColor: 'divider'
            }}>
              <Stack spacing={3}>
                {/* Payment & Status Info */}
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: { xs: 'column', sm: 'row' },
                  justifyContent: 'space-between', 
                  alignItems: { xs: 'flex-start', sm: 'center' },
                  gap: 2
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <PaymentIcon sx={{ color: 'primary.main', fontSize: 20 }} />
                      <Typography variant="body2" fontWeight="600" color="text.primary">
                        Payment:
                      </Typography>
                    </Box>
                    <Chip
                      icon={<span>{getPaymentMethodIcon(order?.paymentMethod || '')}</span>}
                      label={order?.paymentMethod?.toUpperCase() || 'CASH'}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography variant="body2" fontWeight="600" color="text.primary">
                      Status:
                    </Typography>
                    <Chip
                      label={order?.status?.toUpperCase() || 'PENDING'}
                      color={getStatusColor(order?.status || '') as any}
                      size="small"
                    />
                  </Box>
                </Box>

                {/* Notes */}
                {order?.notes && (
                  <Box>
                    <Typography variant="body2" fontWeight="600" gutterBottom color="text.primary">
                      Notes:
                    </Typography>
                    <Paper sx={{ 
                      p: 2, 
                      bgcolor: 'background.paper', 
                      borderRadius: 2,
                      border: '1px solid',
                      borderColor: 'divider'
                    }}>
                      <Typography variant="body2" color="text.primary">
                        {order.notes}
                      </Typography>
                    </Paper>
                  </Box>
                )}

                {/* Footer Text */}
                <Box sx={{ textAlign: 'center', pt: 2 }}>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Thank you for your business! We appreciate your trust in us.
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    This is a computer generated invoice. No signature required. • Invoice ID: {order?._id}
                  </Typography>
                </Box>
              </Stack>
            </Box>
          </Paper>
        </Container>

        {/* Print Styles */}
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
    </motion.div>
  )
}