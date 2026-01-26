"use client";

import React, { useEffect, useState } from 'react'
import {
  Card,
  CardContent,
  Typography,
  Box,
  useTheme,
  useMediaQuery,
  CircularProgress,
  Avatar,
  Chip,
  Alert,
  Button
} from '@mui/material'
import { 
  LocalActivityOutlined as ActivityIcon,
  ShoppingCart,
  PersonAdd,
  Warning,
  Inventory2,
  Upgrade,
  ErrorOutline
} from '@mui/icons-material'

interface Activity {
  id: string
  type: 'sale' | 'customer' | 'stock' | 'payment' | 'billing' | 'low_stock'
  message: string
  details: string
  amount?: number
  customerName?: string
  productName?: string
  time: string
  color: 'success' | 'primary' | 'warning' | 'info' | 'error' | 'secondary'
  createdAt: string
  icon: React.ReactNode
}

const RecentActivity: React.FC = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [subscriptionExpired, setSubscriptionExpired] = useState(false)

  useEffect(() => {
    fetchRecentActivity()
  }, [])

  const fetchRecentActivity = async () => {
    try {
      setLoading(true)
      setError(null)
      setSubscriptionExpired(false)
      
      // Fetch recent orders/billing data
      const billingRes = await fetch('/api/billing/recent?limit=10', { 
        credentials: 'include' 
      })

      // Check for subscription expiration (402 status)
      if (billingRes.status === 402) {
        const data = await billingRes.json()
        setError(data.error || 'Subscription required to view recent activity')
        setSubscriptionExpired(true)
        setActivities([])
        setLoading(false)
        return
      }
      
      if (!billingRes.ok) {
        throw new Error('Failed to fetch billing data')
      }
      
      // Fetch recent customers (only if billing was successful)
      const customersRes = await fetch('/api/customers?limit=5&sort=-createdAt', { 
        credentials: 'include' 
      })
      
      // Fetch low stock products (only if previous calls were successful)
      const productsRes = await fetch('/api/products?limit=20', { 
        credentials: 'include' 
      })

      const activitiesData: Activity[] = []

      // Process billing data (orders)
      if (billingRes.ok) {
        const billingData = await billingRes.json()
        
        // Handle both array response or object with orders property
        const orders = billingData.orders || billingData.data || billingData
        
        if (Array.isArray(orders)) {
          orders.slice(0, 5).forEach((order: any) => {
            activitiesData.push({
              id: order._id || order.id,
              type: 'billing',
              message: 'New invoice created',
              details: `Invoice ${order.invoiceNumber || 'N/A'} created`,
              amount: order.grandTotal || 0,
              customerName: order.customer?.name || 'Customer',
              time: formatTimeAgo(order.createdAt || order.invoiceDate),
              color: 'success',
              createdAt: order.createdAt || new Date().toISOString(),
              icon: <ShoppingCart fontSize="small" />
            })
          })
        }
      }

      // Process new customers
      if (customersRes.ok) {
        const customersData = await customersRes.json()
        
        // Handle both array response or object with customers property
        const customers = customersData.customers || customersData.data || customersData
        
        if (Array.isArray(customers)) {
          customers.slice(0, 3).forEach((customer: any) => {
            activitiesData.push({
              id: customer._id || customer.id,
              type: 'customer',
              message: 'New customer added',
              details: `${customer.name || 'Customer'} registered`,
              customerName: customer.name,
              time: formatTimeAgo(customer.createdAt),
              color: 'primary',
              createdAt: customer.createdAt,
              icon: <PersonAdd fontSize="small" />
            })
          })
        }
      }

      // Process low stock products
      if (productsRes.ok) {
        const productsData = await productsRes.json()
        
        // Handle both array response or object with products property
        const products = productsData.products || productsData.data || productsData
        
        if (Array.isArray(products)) {
          const lowStockProducts = products.filter((product: any) => {
            // Calculate total stock from variations and batches
            const variationsStock = product.variations?.reduce(
              (sum: number, v: any) => sum + (v.stock || 0), 
              0
            ) || 0
            
            const batchesStock = product.batches?.reduce(
              (sum: number, b: any) => sum + (b.quantity || 0), 
              0
            ) || 0
            
            return (variationsStock + batchesStock) < 10
          }).slice(0, 2)

          lowStockProducts.forEach((product: any) => {
            activitiesData.push({
              id: product._id || product.id,
              type: 'low_stock',
              message: 'Low stock alert',
              details: `${product.name || 'Product'} is running low`,
              productName: product.name,
              time: formatTimeAgo(product.updatedAt || product.createdAt),
              color: 'warning',
              createdAt: product.updatedAt || product.createdAt,
              icon: <Warning fontSize="small" />
            })
          })
        }
      }

      // Sort by creation date and take latest 8
      const sortedActivities = activitiesData
        .filter(activity => activity.createdAt)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 8)

      setActivities(sortedActivities)

    } catch (error: any) {
      console.error('Error fetching recent activity:', error)
      setError(error.message || 'Failed to load recent activity')
      // Fallback to sample data from actual structure
      setActivities(getSampleActivities())
    } finally {
      setLoading(false)
    }
  }

  const formatTimeAgo = (dateString: string | Date): string => {
    if (!dateString) return 'Recently'
    
    try {
      const date = new Date(dateString)
      const now = new Date()
      const diffMs = now.getTime() - date.getTime()
      const diffMins = Math.floor(diffMs / 60000)
      const diffHours = Math.floor(diffMs / 3600000)
      const diffDays = Math.floor(diffMs / 86400000)

      if (diffMins < 1) return 'Just now'
      if (diffMins < 60) {
        return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`
      } else if (diffHours < 24) {
        return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`
      } else if (diffDays < 7) {
        return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`
      } else {
        return date.toLocaleDateString('en-IN', { 
          day: 'numeric', 
          month: 'short' 
        })
      }
    } catch {
      return 'Recently'
    }
  }

  const getSampleActivities = (): Activity[] => {
    const now = new Date()
    const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000)
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000)
    
    return [
      {
        id: '1',
        type: 'billing',
        message: 'New invoice created',
        details: 'Invoice INV-877482 created',
        amount: 1100,
        customerName: 'Neer Mehta',
        time: formatTimeAgo(twoHoursAgo),
        color: 'success',
        createdAt: twoHoursAgo.toISOString(),
        icon: <ShoppingCart fontSize="small" />
      },
      {
        id: '2',
        type: 'customer',
        message: 'New customer added',
        details: 'Raj Sharma registered',
        customerName: 'Raj Sharma',
        time: formatTimeAgo(yesterday),
        color: 'primary',
        createdAt: yesterday.toISOString(),
        icon: <PersonAdd fontSize="small" />
      },
      {
        id: '3',
        type: 'low_stock',
        message: 'Low stock alert',
        details: 'Product XYZ is running low',
        productName: 'Product XYZ',
        time: formatTimeAgo(yesterday),
        color: 'warning',
        createdAt: yesterday.toISOString(),
        icon: <Warning fontSize="small" />
      }
    ]
  }

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'billing': return theme.palette.success.main
      case 'customer': return theme.palette.primary.main
      case 'low_stock': return theme.palette.warning.main
      case 'payment': return theme.palette.info.main
      default: return theme.palette.grey[600]
    }
  }

  const getAmountColor = (type: string) => {
    return type === 'billing' ? theme.palette.success.main : theme.palette.text.primary
  }

  if (loading) {
    return (
      <Card sx={{ height: '100%' }}>
        <CardContent sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          minHeight: 200 
        }}>
          <CircularProgress size={24} />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      borderRadius: 2,
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    }}>
      <CardContent sx={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        p: isMobile ? 1.5 : 2.5 
      }}>
        {/* Header */}
        <Box display="flex" alignItems="center" gap={1.5} mb={2.5}>
          <ActivityIcon color="primary" sx={{ fontSize: 24 }} />
          <Typography variant="h6" sx={{ 
            fontWeight: 700, 
            fontSize: isMobile ? '1.1rem' : '1.25rem',
            color: theme.palette.text.primary
          }}>
            Recent Activity
          </Typography>
          {!subscriptionExpired && activities.length > 0 && (
            <Chip 
              label={`${activities.length} new`}
              size="small"
              color="primary"
              variant="outlined"
              sx={{ ml: 'auto' }}
            />
          )}
        </Box>

        {/* Subscription Expired Message */}
        {subscriptionExpired && (
          <Alert 
            severity="warning" 
            sx={{ mb: 3 }}
            icon={<ErrorOutline />}
            action={
              <Button 
                color="inherit" 
                size="small"
                startIcon={<Upgrade />}
                onClick={() => window.location.href = '/pricing'}
                sx={{ fontWeight: 600 }}
              >
                Upgrade
              </Button>
            }
          >
            <Typography variant="body2" fontWeight={600}>
              {error || 'Your subscription has expired'}
            </Typography>
            <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
              Renew your subscription to view recent activity
            </Typography>
          </Alert>
        )}

        {/* Activities List */}
        {!subscriptionExpired ? (
          <Box sx={{ 
            flex: 1, 
            overflow: 'auto',
            maxHeight: 350,
            '&::-webkit-scrollbar': {
              width: '6px',
            },
            '&::-webkit-scrollbar-track': {
              background: theme.palette.grey[100],
              borderRadius: '10px',
            },
            '&::-webkit-scrollbar-thumb': {
              background: theme.palette.grey[400],
              borderRadius: '10px',
            }
          }}>
            {activities.length > 0 ? (
              activities.map((activity, index) => (
                <Box
                  key={activity.id}
                  sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 2,
                    py: 2,
                    px: 1,
                    borderBottom: index < activities.length - 1 
                      ? `1px solid ${theme.palette.divider}` 
                      : 'none',
                    transition: 'all 0.2s',
                    '&:hover': {
                      backgroundColor: theme.palette.action.hover,
                      borderRadius: 1,
                      transform: 'translateX(2px)'
                    }
                  }}
                >
                  {/* Icon */}
                  <Avatar
                    sx={{
                      width: 36,
                      height: 36,
                      bgcolor: getActivityColor(activity.type) + '20',
                      color: getActivityColor(activity.type),
                      fontSize: '1rem'
                    }}
                  >
                    {activity.icon}
                  </Avatar>

                  {/* Content */}
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: 1
                    }}>
                      <Typography variant="subtitle2" fontWeight={600} sx={{ 
                        fontSize: isMobile ? '0.85rem' : '0.95rem',
                        lineHeight: 1.3 
                      }}>
                        {activity.message}
                      </Typography>
                      
                      {activity.amount && (
                        <Typography variant="caption" fontWeight={700} sx={{
                          color: getAmountColor(activity.type),
                          fontSize: '0.8rem',
                          backgroundColor: activity.type === 'billing' 
                            ? theme.palette.success.light + '40' 
                            : 'transparent',
                          px: 1,
                          py: 0.5,
                          borderRadius: 1
                        }}>
                          ₹{activity.amount.toLocaleString('en-IN')}
                        </Typography>
                      )}
                    </Box>

                    <Typography variant="body2" color="text.secondary" sx={{ 
                      mt: 0.5,
                      fontSize: isMobile ? '0.8rem' : '0.875rem',
                      lineHeight: 1.4 
                    }}>
                      {activity.details}
                    </Typography>

                    {activity.customerName && (
                      <Typography variant="caption" sx={{
                        display: 'inline-block',
                        mt: 0.5,
                        color: theme.palette.primary.main,
                        backgroundColor: theme.palette.primary.light + '20',
                        px: 1,
                        py: 0.25,
                        borderRadius: 0.5,
                        fontWeight: 500
                      }}>
                        {activity.customerName}
                      </Typography>
                    )}

                    {activity.productName && (
                      <Typography variant="caption" sx={{
                        display: 'inline-block',
                        mt: 0.5,
                        ml: activity.customerName ? 0.5 : 0,
                        color: theme.palette.warning.main,
                        backgroundColor: theme.palette.warning.light + '20',
                        px: 1,
                        py: 0.25,
                        borderRadius: 0.5,
                        fontWeight: 500
                      }}>
                        {activity.productName}
                      </Typography>
                    )}

                    <Typography variant="caption" display="block" sx={{ 
                      mt: 1,
                      color: theme.palette.grey[600],
                      fontWeight: 500,
                      fontSize: '0.75rem'
                    }}>
                      {activity.time}
                    </Typography>
                  </Box>
                </Box>
              ))
            ) : (
              <Box sx={{ 
                textAlign: 'center', 
                py: 4,
                px: 2 
              }}>
                <Inventory2 sx={{ 
                  fontSize: 48, 
                  color: theme.palette.grey[400],
                  mb: 2 
                }} />
                <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                  No recent activity
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Recent billing, customers, and stock updates will appear here
                </Typography>
              </Box>
            )}
          </Box>
        ) : (
          // Show upgrade prompt when subscription expired
          <Box sx={{ 
            flex: 1, 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center', 
            justifyContent: 'center',
            textAlign: 'center',
            py: 4,
            px: 2 
          }}>
            <Upgrade sx={{ 
              fontSize: 48, 
              color: theme.palette.warning.main,
              mb: 2 
            }} />
            <Typography variant="body1" fontWeight={600} sx={{ mb: 1 }}>
              Subscription Required
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 300 }}>
              Upgrade your plan to view recent activity and access all features
            </Typography>
            <Button 
              variant="contained" 
              color="primary"
              startIcon={<Upgrade />}
              onClick={() => window.location.href = '/pricing'}
              sx={{ borderRadius: 2 }}
            >
              Upgrade Now
            </Button>
          </Box>
        )}

        {/* Footer - Only show if not expired */}
        {!subscriptionExpired && activities.length > 0 && (
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            mt: 2.5, 
            pt: 2, 
            borderTop: `1px solid ${theme.palette.divider}`,
            alignItems: 'center'
          }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
              Showing {Math.min(activities.length, 8)} activities
            </Typography>
            
            <Typography 
              variant="caption" 
              color="primary.main" 
              fontWeight={600}
              sx={{ 
                cursor: 'pointer',
                '&:hover': { textDecoration: 'underline' }
              }}
              onClick={fetchRecentActivity}
            >
              Refresh
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  )
}

export default RecentActivity