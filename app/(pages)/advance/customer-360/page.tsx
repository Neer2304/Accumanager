// app/(pages)/advance/customer-360/page.tsx
'use client'

import { useState } from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Tabs,
  Tab,
  Avatar,
  Chip,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  IconButton,
  Paper,
  Stack,
} from '@mui/material'
import {
  Person,
  Email,
  Phone,
  LocationOn,
  CalendarToday,
  ShoppingCart,
  SupportAgent,
  Chat,
  Timeline,
  Star,
  Edit,
  MoreVert,
} from '@mui/icons-material'
import { useAdvanceThemeContext } from '@/contexts/AdvanceThemeContexts'

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  )
}

const mockCustomers = [
  {
    id: 1,
    name: 'John Smith',
    email: 'john@example.com',
    phone: '+1 (555) 123-4567',
    status: 'active',
    lifetimeValue: '$12,450',
    lastPurchase: '2 days ago',
    totalOrders: 24,
    satisfaction: 4.8,
    tags: ['VIP', 'Early Adopter', 'Business'],
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    email: 'sarah@company.com',
    phone: '+1 (555) 987-6543',
    status: 'active',
    lifetimeValue: '$8,230',
    lastPurchase: '1 week ago',
    totalOrders: 18,
    satisfaction: 4.5,
    tags: ['Frequent Buyer', 'Subscriber'],
  },
  {
    id: 3,
    name: 'Mike Wilson',
    email: 'mike@enterprise.com',
    phone: '+1 (555) 456-7890',
    status: 'inactive',
    lifetimeValue: '$45,670',
    lastPurchase: '3 months ago',
    totalOrders: 56,
    satisfaction: 4.9,
    tags: ['Enterprise', 'VIP'],
  },
]

const mockInteractions = [
  { type: 'purchase', title: 'Purchased Premium Plan', date: '2 days ago', details: '$499.00' },
  { type: 'support', title: 'Submitted support ticket', date: '1 week ago', details: 'Resolved' },
  { type: 'email', title: 'Received newsletter', date: '2 weeks ago', details: 'Opened' },
  { type: 'call', title: 'Sales follow-up call', date: '3 weeks ago', details: '15 min' },
]

export default function Customer360Page() {
  const { currentScheme } = useAdvanceThemeContext()
  const [tabValue, setTabValue] = useState(0)

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          👥 Customer 360° View
        </Typography>
        <Typography variant="body1" color={currentScheme.colors.text.secondary}>
          Complete customer profiles with all interactions, purchases, and communications
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', gap: 3 }}>
        {/* Left Column - Customer List */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Card
            sx={{
              background: currentScheme.colors.components.card,
              border: `1px solid ${currentScheme.colors.components.border}`,
            }}
          >
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Customer Directory
              </Typography>
              
              <List>
                {mockCustomers.map((customer) => (
                  <Paper
                    key={customer.id}
                    sx={{
                      mb: 2,
                      background: currentScheme.colors.components.card,
                      border: `1px solid ${currentScheme.colors.components.border}`,
                      borderRadius: 2,
                      overflow: 'hidden',
                    }}
                  >
                    <ListItem
                      secondaryAction={
                        <IconButton edge="end">
                          <MoreVert />
                        </IconButton>
                      }
                    >
                      <ListItemAvatar>
                        <Avatar
                          sx={{
                            bgcolor: currentScheme.colors.primary,
                          }}
                        >
                          {customer.name.charAt(0)}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box display="flex" alignItems="center" gap={1}>
                            <Typography fontWeight="medium">
                              {customer.name}
                            </Typography>
                            <Chip
                              label={customer.status}
                              size="small"
                              sx={{
                                background: customer.status === 'active' 
                                  ? `${currentScheme.colors.buttons.success}20`
                                  : `${currentScheme.colors.buttons.error}20`,
                                color: customer.status === 'active'
                                  ? currentScheme.colors.buttons.success
                                  : currentScheme.colors.buttons.error,
                              }}
                            />
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2" color={currentScheme.colors.text.secondary}>
                              {customer.email}
                            </Typography>
                            <Box display="flex" gap={1} mt={1}>
                              {customer.tags.map((tag) => (
                                <Chip
                                  key={tag}
                                  label={tag}
                                  size="small"
                                  variant="outlined"
                                  sx={{
                                    borderColor: currentScheme.colors.components.border,
                                    color: currentScheme.colors.text.secondary,
                                  }}
                                />
                              ))}
                            </Box>
                          </Box>
                        }
                      />
                    </ListItem>
                  </Paper>
                ))}
              </List>
            </CardContent>
          </Card>
        </Box>

        {/* Right Column - Customer Details */}
        <Box sx={{ flex: 2, minWidth: 0 }}>
          <Card
            sx={{
              background: currentScheme.colors.components.card,
              border: `1px solid ${currentScheme.colors.components.border}`,
              mb: 3,
            }}
          >
            <CardContent>
              {/* Customer Profile Header */}
              <Box display="flex" alignItems="center" gap={3} mb={3}>
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    bgcolor: currentScheme.colors.primary,
                    fontSize: 32,
                  }}
                >
                  J
                </Avatar>
                <Box flex={1}>
                  <Box display="flex" alignItems="center" gap={2} mb={1}>
                    <Typography variant="h5" fontWeight="bold">
                      John Smith
                    </Typography>
                    <Chip
                      label="VIP Customer"
                      sx={{
                        background: `${currentScheme.colors.buttons.success}20`,
                        color: currentScheme.colors.buttons.success,
                      }}
                    />
                  </Box>
                  <Typography variant="body2" color={currentScheme.colors.text.secondary}>
                    Senior Manager at TechCorp • Customer since 2022
                  </Typography>
                </Box>
                <Button
                  variant="outlined"
                  startIcon={<Edit />}
                  sx={{
                    borderColor: currentScheme.colors.components.border,
                    color: currentScheme.colors.text.primary,
                  }}
                >
                  Edit Profile
                </Button>
              </Box>

              {/* Stats */}
              <Box display="flex" gap={3} mb={3}>
                <Box textAlign="center">
                  <Typography variant="h4" fontWeight="bold" color={currentScheme.colors.primary}>
                    $12,450
                  </Typography>
                  <Typography variant="caption" color={currentScheme.colors.text.secondary}>
                    Lifetime Value
                  </Typography>
                </Box>
                <Box textAlign="center">
                  <Typography variant="h4" fontWeight="bold" color={currentScheme.colors.buttons.success}>
                    24
                  </Typography>
                  <Typography variant="caption" color={currentScheme.colors.text.secondary}>
                    Total Orders
                  </Typography>
                </Box>
                <Box textAlign="center">
                  <Box display="flex" alignItems="center" gap={0.5}>
                    <Typography variant="h4" fontWeight="bold" color={currentScheme.colors.buttons.warning}>
                      4.8
                    </Typography>
                    <Star sx={{ color: currentScheme.colors.buttons.warning, fontSize: 20 }} />
                  </Box>
                  <Typography variant="caption" color={currentScheme.colors.text.secondary}>
                    Satisfaction
                  </Typography>
                </Box>
              </Box>

              {/* Contact Info */}
              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  background: currentScheme.colors.background,
                  border: `1px solid ${currentScheme.colors.components.border}`,
                  mb: 3,
                }}
              >
                <Typography variant="subtitle2" fontWeight="medium" gutterBottom>
                  Contact Information
                </Typography>
                <Stack direction="row" spacing={3}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Email sx={{ color: currentScheme.colors.text.secondary, fontSize: 20 }} />
                    <Typography variant="body2">john@example.com</Typography>
                  </Box>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Phone sx={{ color: currentScheme.colors.text.secondary, fontSize: 20 }} />
                    <Typography variant="body2">+1 (555) 123-4567</Typography>
                  </Box>
                  <Box display="flex" alignItems="center" gap={1}>
                    <LocationOn sx={{ color: currentScheme.colors.text.secondary, fontSize: 20 }} />
                    <Typography variant="body2">New York, NY</Typography>
                  </Box>
                </Stack>
              </Box>

              {/* Tabs */}
              <Box sx={{ borderBottom: 1, borderColor: currentScheme.colors.components.border }}>
                <Tabs value={tabValue} onChange={handleTabChange}>
                  <Tab label="Interactions" />
                  <Tab label="Purchase History" />
                  <Tab label="Support Tickets" />
                  <Tab label="Notes" />
                </Tabs>
              </Box>

              <TabPanel value={tabValue} index={0}>
                <List>
                  {mockInteractions.map((interaction, index) => (
                    <Box key={index}>
                      <ListItem>
                        <ListItemAvatar>
                          <Avatar
                            sx={{
                              bgcolor:
                                interaction.type === 'purchase' ? `${currentScheme.colors.buttons.success}20` :
                                interaction.type === 'support' ? `${currentScheme.colors.buttons.error}20` :
                                interaction.type === 'email' ? `${currentScheme.colors.primary}20` :
                                `${currentScheme.colors.buttons.warning}20`,
                              color:
                                interaction.type === 'purchase' ? currentScheme.colors.buttons.success :
                                interaction.type === 'support' ? currentScheme.colors.buttons.error :
                                interaction.type === 'email' ? currentScheme.colors.primary :
                                currentScheme.colors.buttons.warning,
                            }}
                          >
                            {interaction.type === 'purchase' ? <ShoppingCart /> :
                             interaction.type === 'support' ? <SupportAgent /> :
                             interaction.type === 'email' ? <Email /> : <Phone />}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={interaction.title}
                          secondary={
                            <Box display="flex" justifyContent="space-between">
                              <Typography variant="body2" color={currentScheme.colors.text.secondary}>
                                {interaction.date}
                              </Typography>
                              <Typography variant="body2" color={currentScheme.colors.text.secondary}>
                                {interaction.details}
                              </Typography>
                            </Box>
                          }
                        />
                      </ListItem>
                      {index < mockInteractions.length - 1 && <Divider variant="inset" component="li" />}
                    </Box>
                  ))}
                </List>
              </TabPanel>

              <TabPanel value={tabValue} index={1}>
                <Box textAlign="center" py={4}>
                  <ShoppingCart sx={{ fontSize: 48, color: currentScheme.colors.text.secondary, mb: 2 }} />
                  <Typography color={currentScheme.colors.text.secondary}>
                    Purchase history will appear here
                  </Typography>
                </Box>
              </TabPanel>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  )
}