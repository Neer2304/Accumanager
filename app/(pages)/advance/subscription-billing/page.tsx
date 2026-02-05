// app/(pages)/advance/subscription-billing/page.tsx
'use client'

import { useState } from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Switch,
  Select,
  MenuItem,
  Paper,
  IconButton,
  LinearProgress,
  Avatar,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material'
import {
  CreditCard,
  Receipt,
  People,
  TrendingUp,
  Add,
  MoreVert,
  Download,
  Refresh,
  FilterList,
  CheckCircle,
  Error,
  Warning,
  CalendarToday,
  Payment,
  AccountCircle,
  Edit,
  Delete,
  Visibility,
} from '@mui/icons-material'
import { useAdvanceThemeContext } from '@/contexts/AdvanceThemeContexts'

const mockSubscriptions = [
  { id: 1, customer: 'Acme Corp', plan: 'Enterprise', amount: '$499/mo', status: 'active', nextBilling: '2024-01-15' },
  { id: 2, customer: 'Tech Startup', plan: 'Pro', amount: '$199/mo', status: 'active', nextBilling: '2024-01-10' },
  { id: 3, customer: 'Small Business', plan: 'Basic', amount: '$99/mo', status: 'past-due', nextBilling: '2024-01-05' },
  { id: 4, customer: 'Freelancer', plan: 'Starter', amount: '$49/mo', status: 'canceled', nextBilling: '-' },
]

const mockInvoices = [
  { id: 'INV-001', date: '2024-01-01', customer: 'Acme Corp', amount: '$499', status: 'paid' },
  { id: 'INV-002', date: '2024-01-01', customer: 'Tech Startup', amount: '$199', status: 'paid' },
  { id: 'INV-003', date: '2024-01-01', customer: 'Small Business', amount: '$99', status: 'overdue' },
  { id: 'INV-004', date: '2023-12-15', customer: 'Previous Client', amount: '$199', status: 'paid' },
]

export default function SubscriptionBillingPage() {
  const { currentScheme } = useAdvanceThemeContext()
  const [autoCharge, setAutoCharge] = useState(true)
  const [showInvoiceDialog, setShowInvoiceDialog] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState('all')

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Box display="flex" alignItems="center" gap={2}>
            <Box
              sx={{
                width: 60,
                height: 60,
                borderRadius: 3,
                background: `linear-gradient(135deg, ${currentScheme.colors.primary} 0%, ${currentScheme.colors.secondary} 100%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <CreditCard sx={{ fontSize: 32, color: 'white' }} />
            </Box>
            <Box>
              <Typography variant="h4" fontWeight="bold">
                💰 Subscription Billing
              </Typography>
              <Typography variant="body1" color={currentScheme.colors.text.secondary}>
                Recurring invoices, payment tracking & customer portal
              </Typography>
            </Box>
          </Box>
          
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setShowInvoiceDialog(true)}
            sx={{
              background: `linear-gradient(135deg, ${currentScheme.colors.primary} 0%, ${currentScheme.colors.secondary} 100%)`,
            }}
          >
            Create Invoice
          </Button>
        </Box>

        {/* Stats */}
        <Box display="flex" gap={2} flexWrap="wrap" mb={3}>
          {[
            { label: 'Monthly Recurring', value: '$24,850', icon: <TrendingUp />, change: '+12%' },
            { label: 'Active Subscriptions', value: '148', icon: <People />, change: '+8 this month' },
            { label: 'Collection Rate', value: '97.2%', icon: <CheckCircle />, change: '+1.4%' },
            { label: 'Avg. Revenue/User', value: '$168', icon: <CreditCard />, change: '+$24' },
          ].map((stat, index) => (
            <Card
              key={index}
              sx={{
                flex: 1,
                minWidth: '200px',
                background: currentScheme.colors.components.card,
                border: `1px solid ${currentScheme.colors.components.border}`,
              }}
            >
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography variant="h4" fontWeight="bold">
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" color={currentScheme.colors.text.secondary}>
                      {stat.label}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: 2,
                      background: `${currentScheme.colors.primary}20`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: currentScheme.colors.primary,
                    }}
                  >
                    {stat.icon}
                  </Box>
                </Box>
                <Typography variant="caption" sx={{ color: currentScheme.colors.buttons.success, mt: 1 }}>
                  {stat.change}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Box>

      {/* Controls */}
      <Card sx={{ mb: 3, background: currentScheme.colors.components.card }}>
        <CardContent>
          <Box display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={2}>
            <Box display="flex" alignItems="center" gap={3}>
              <Select
                value={selectedPlan}
                onChange={(e) => setSelectedPlan(e.target.value)}
                size="small"
                sx={{
                  background: currentScheme.colors.components.input,
                  borderColor: currentScheme.colors.components.border,
                  color: currentScheme.colors.text.primary,
                  minWidth: 120,
                }}
              >
                <MenuItem value="all">All Plans</MenuItem>
                <MenuItem value="starter">Starter</MenuItem>
                <MenuItem value="basic">Basic</MenuItem>
                <MenuItem value="pro">Pro</MenuItem>
                <MenuItem value="enterprise">Enterprise</MenuItem>
              </Select>
              
              <Box display="flex" alignItems="center" gap={1}>
                <Switch
                  checked={autoCharge}
                  onChange={(e) => setAutoCharge(e.target.checked)}
                  color="primary"
                />
                <Typography variant="body2">Auto-charge subscriptions</Typography>
              </Box>
            </Box>

            <Box display="flex" gap={1}>
              <Button
                variant="outlined"
                startIcon={<Download />}
                sx={{
                  borderColor: currentScheme.colors.components.border,
                  color: currentScheme.colors.text.primary,
                }}
              >
                Export
              </Button>
              <Button
                variant="outlined"
                startIcon={<Refresh />}
                sx={{
                  borderColor: currentScheme.colors.components.border,
                  color: currentScheme.colors.text.primary,
                }}
              >
                Sync Payments
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
        {/* Left Column - Subscriptions */}
        <Box sx={{ flex: 2, minWidth: '300px' }}>
          <Card
            sx={{
              background: currentScheme.colors.components.card,
              border: `1px solid ${currentScheme.colors.components.border}`,
              mb: 3,
            }}
          >
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
                <Typography variant="h6" fontWeight="bold">
                  Active Subscriptions
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<FilterList />}
                  size="small"
                  sx={{
                    borderColor: currentScheme.colors.components.border,
                    color: currentScheme.colors.text.primary,
                  }}
                >
                  Filter
                </Button>
              </Box>

              {/* Subscriptions Table */}
              <TableContainer component={Paper} sx={{ background: currentScheme.colors.background }}>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ background: currentScheme.colors.components.input }}>
                      <TableCell>Customer</TableCell>
                      <TableCell>Plan</TableCell>
                      <TableCell align="right">Amount</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Next Billing</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {mockSubscriptions.map((sub) => (
                      <TableRow
                        key={sub.id}
                        sx={{
                          '&:hover': {
                            background: `${currentScheme.colors.primary}08`,
                          },
                        }}
                      >
                        <TableCell>
                          <Box display="flex" alignItems="center" gap={1}>
                            <Avatar sx={{ width: 24, height: 24, fontSize: 12 }}>
                              {sub.customer.split(' ').map(n => n[0]).join('')}
                            </Avatar>
                            {sub.customer}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={sub.plan}
                            size="small"
                            sx={{
                              background: `${currentScheme.colors.primary}20`,
                              color: currentScheme.colors.primary,
                            }}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" fontWeight="medium">
                            {sub.amount}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={sub.status}
                            size="small"
                            sx={{
                              background: sub.status === 'active'
                                ? `${currentScheme.colors.buttons.success}20`
                                : sub.status === 'past-due'
                                ? `${currentScheme.colors.buttons.error}20`
                                : `${currentScheme.colors.text.secondary}20`,
                              color: sub.status === 'active'
                                ? currentScheme.colors.buttons.success
                                : sub.status === 'past-due'
                                ? currentScheme.colors.buttons.error
                                : currentScheme.colors.text.secondary,
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Box display="flex" alignItems="center" gap={0.5}>
                            <CalendarToday sx={{ fontSize: 14, color: currentScheme.colors.text.secondary }} />
                            <Typography variant="body2">
                              {sub.nextBilling}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="right">
                          <IconButton size="small">
                            <Visibility />
                          </IconButton>
                          <IconButton size="small">
                            <Edit />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>

          {/* Revenue Overview */}
          <Card sx={{ background: currentScheme.colors.components.card }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" mb={3}>
                Revenue Overview
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {[
                  { label: 'Starter Plan', value: 15, amount: '$735', color: currentScheme.colors.primary },
                  { label: 'Basic Plan', value: 45, amount: '$4,455', color: currentScheme.colors.secondary },
                  { label: 'Pro Plan', value: 68, amount: '$13,532', color: currentScheme.colors.buttons.warning },
                  { label: 'Enterprise', value: 20, amount: '$9,980', color: currentScheme.colors.buttons.success },
                ].map((plan, index) => (
                  <Box key={index}>
                    <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                      <Typography variant="body2">{plan.label}</Typography>
                      <Typography variant="body2" fontWeight="medium">{plan.amount}</Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={plan.value}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        background: currentScheme.colors.components.border,
                        '& .MuiLinearProgress-bar': {
                          background: plan.color,
                        },
                      }}
                    />
                  </Box>
                ))}
              </Box>
              
              <Divider sx={{ my: 3 }} />
              
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="body2" color={currentScheme.colors.text.secondary}>
                  Projected Monthly Revenue
                </Typography>
                <Typography variant="h5" fontWeight="bold">
                  $28,702
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Right Column - Invoices & Quick Actions */}
        <Box sx={{ flex: 1, minWidth: '300px' }}>
          {/* Recent Invoices */}
          <Card
            sx={{
              background: currentScheme.colors.components.card,
              border: `1px solid ${currentScheme.colors.components.border}`,
              mb: 3,
            }}
          >
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
                <Typography variant="h6" fontWeight="bold">
                  Recent Invoices
                </Typography>
                <Button
                  size="small"
                  sx={{ color: currentScheme.colors.primary }}
                >
                  View All
                </Button>
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {mockInvoices.map((invoice) => (
                  <Paper
                    key={invoice.id}
                    sx={{
                      p: 2,
                      background: currentScheme.colors.background,
                      border: `1px solid ${currentScheme.colors.components.border}`,
                      borderRadius: 2,
                    }}
                  >
                    <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                      <Typography variant="body1" fontWeight="medium">
                        {invoice.id}
                      </Typography>
                      <Chip
                        label={invoice.status}
                        size="small"
                        sx={{
                          background: invoice.status === 'paid'
                            ? `${currentScheme.colors.buttons.success}20`
                            : `${currentScheme.colors.buttons.error}20`,
                          color: invoice.status === 'paid'
                            ? currentScheme.colors.buttons.success
                            : currentScheme.colors.buttons.error,
                        }}
                      />
                    </Box>
                    
                    <Box display="flex" alignItems="center" justifyContent="space-between">
                      <Box>
                        <Typography variant="caption" color={currentScheme.colors.text.secondary}>
                          {invoice.customer}
                        </Typography>
                        <Typography variant="caption" display="block" color={currentScheme.colors.text.secondary}>
                          {invoice.date}
                        </Typography>
                      </Box>
                      
                      <Typography variant="body1" fontWeight="bold">
                        {invoice.amount}
                      </Typography>
                    </Box>
                  </Paper>
                ))}
              </Box>
            </CardContent>
          </Card>

          {/* Customer Portal Preview */}
          <Card sx={{ background: currentScheme.colors.components.card, mb: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" mb={2}>
                Customer Portal
              </Typography>
              
              <Paper
                sx={{
                  p: 3,
                  background: currentScheme.colors.background,
                  border: `1px solid ${currentScheme.colors.components.border}`,
                  borderRadius: 2,
                  mb: 2,
                }}
              >
                <Box display="flex" alignItems="center" gap={2} mb={2}>
                  <AccountCircle sx={{ fontSize: 40, color: currentScheme.colors.primary }} />
                  <Box>
                    <Typography variant="body1" fontWeight="medium">
                      John Smith
                    </Typography>
                    <Typography variant="caption" color={currentScheme.colors.text.secondary}>
                      Acme Corporation
                    </Typography>
                  </Box>
                </Box>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="caption" color={currentScheme.colors.text.secondary}>
                    Current Plan
                  </Typography>
                  <Typography variant="body1" fontWeight="bold">
                    Enterprise - $499/month
                  </Typography>
                </Box>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="caption" color={currentScheme.colors.text.secondary}>
                    Next Billing Date
                  </Typography>
                  <Typography variant="body1">
                    January 15, 2024
                  </Typography>
                </Box>
                
                <Button
                  variant="outlined"
                  fullWidth
                  sx={{
                    borderColor: currentScheme.colors.components.border,
                    color: currentScheme.colors.text.primary,
                  }}
                >
                  Manage Subscription
                </Button>
              </Paper>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card sx={{ background: currentScheme.colors.components.card }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" mb={3}>
                Quick Actions
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {[
                  { icon: <Add />, label: 'Create New Plan', color: currentScheme.colors.primary },
                  { icon: <Receipt />, label: 'Send Reminders', color: currentScheme.colors.secondary },
                  { icon: <People />, label: 'Bulk Update', color: currentScheme.colors.buttons.warning },
                  { icon: <Payment />, label: 'Process Payouts', color: currentScheme.colors.buttons.success },
                ].map((action, index) => (
                  <Button
                    key={index}
                    variant="outlined"
                    startIcon={action.icon}
                    fullWidth
                    sx={{
                      justifyContent: 'flex-start',
                      borderColor: currentScheme.colors.components.border,
                      color: currentScheme.colors.text.primary,
                      '&:hover': {
                        borderColor: action.color,
                        background: `${action.color}10`,
                      },
                    }}
                  >
                    {action.label}
                  </Button>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Create Invoice Dialog */}
      <Dialog open={showInvoiceDialog} onClose={() => setShowInvoiceDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Invoice</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            <TextField label="Customer Name" fullWidth size="small" />
            <TextField label="Email" fullWidth size="small" />
            <Select
              fullWidth
              size="small"
              defaultValue=""
              displayEmpty
            >
              <MenuItem value="" disabled>Select Plan</MenuItem>
              <MenuItem value="starter">Starter - $49/month</MenuItem>
              <MenuItem value="basic">Basic - $99/month</MenuItem>
              <MenuItem value="pro">Pro - $199/month</MenuItem>
              <MenuItem value="enterprise">Enterprise - $499/month</MenuItem>
            </Select>
            <TextField label="Amount" fullWidth size="small" type="number" />
            <TextField
              label="Due Date"
              type="date"
              fullWidth
              size="small"
              InputLabelProps={{ shrink: true }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowInvoiceDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={() => setShowInvoiceDialog(false)}
            sx={{
              background: `linear-gradient(135deg, ${currentScheme.colors.primary} 0%, ${currentScheme.colors.secondary} 100%)`,
            }}
          >
            Create Invoice
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}