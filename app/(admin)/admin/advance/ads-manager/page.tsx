// app/(pages)/advance/ads-manager/page.tsx
'use client'

import { useState } from 'react'
import {
  Box,
  Container,
  Card,
  CardContent,
  Typography,
  Button,
  Switch,
  Slider,
  FormControlLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  TextField,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  useTheme,
  useMediaQuery,
  Avatar,
  IconButton,
  Badge,
  Stack,
} from '@mui/material'
import {
  TrendingUp,
  Visibility,
  MonetizationOn,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Campaign,
  Analytics,
  Settings,
  ArrowBack,
  Description,
  CheckCircle,
} from '@mui/icons-material'
import Link from 'next/link'

export default function AdsManagerPage() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'))
  const darkMode = theme.palette.mode === 'dark'
  
  const [adsEnabled, setAdsEnabled] = useState(true)
  const [adDensity, setAdDensity] = useState(50)
  const [openAdDialog, setOpenAdDialog] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  
  // Mock ad campaigns
  const campaigns = [
    {
      id: 1,
      name: 'Tech Tools Banner',
      status: 'active',
      impressions: 12500,
      clicks: 320,
      ctr: 2.56,
      revenue: 450.00,
      placement: 'header',
    },
    {
      id: 2,
      name: 'SaaS Sidebar',
      status: 'active',
      impressions: 8900,
      clicks: 210,
      ctr: 2.36,
      revenue: 315.00,
      placement: 'sidebar',
    },
    {
      id: 3,
      name: 'Business Inline',
      status: 'paused',
      impressions: 5600,
      clicks: 95,
      ctr: 1.70,
      revenue: 142.50,
      placement: 'content',
    },
  ]

  const totalRevenue = campaigns.reduce((sum, c) => sum + c.revenue, 0)
  const totalImpressions = campaigns.reduce((sum, c) => sum + c.impressions, 0)
  const averageCTR = campaigns.reduce((sum, c) => sum + c.ctr, 0) / campaigns.length

  return (
    <Box sx={{ 
      minHeight: '100vh',
      backgroundColor: darkMode ? '#202124' : '#f8f9fa',
      py: { xs: 2, sm: 3, md: 4 },
    }}>
      <Container maxWidth="lg">
        {/* Header Section */}
        <Box sx={{ mb: { xs: 3, sm: 4, md: 5 } }}>
          <Button
            component={Link}
            href="/admin/dashboard"
            startIcon={<ArrowBack />}
            sx={{ 
              mb: 2,
              color: darkMode ? '#8ab4f8' : '#1a73e8',
              '&:hover': {
                backgroundColor: darkMode ? 'rgba(138, 180, 248, 0.08)' : 'rgba(26, 115, 232, 0.08)',
              },
            }}
          >
            Back to Dashboard
          </Button>

          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: { xs: 'flex-start', sm: 'center' },
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{
                width: { xs: 48, sm: 56 },
                height: { xs: 48, sm: 56 },
                borderRadius: '16px',
                backgroundColor: darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: darkMode ? '#8ab4f8' : '#1a73e8',
              }}>
                <Campaign sx={{ fontSize: { xs: 24, sm: 28 } }} />
              </Box>
              <Box>
                <Typography 
                  variant={isMobile ? "h5" : isTablet ? "h4" : "h3"}
                  sx={{ 
                    fontWeight: 500,
                    color: darkMode ? '#e8eaed' : '#202124',
                    lineHeight: 1.2,
                  }}
                >
                  Ad Management
                </Typography>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: darkMode ? '#9aa0a6' : '#5f6368',
                    mt: 0.5,
                  }}
                >
                  Manage advertisements and monetization
                </Typography>
              </Box>
            </Box>
            
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setOpenAdDialog(true)}
              sx={{
                backgroundColor: '#1a73e8',
                '&:hover': {
                  backgroundColor: '#1669c1',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 4px 12px rgba(26, 115, 232, 0.2)',
                },
                borderRadius: '12px',
                px: 3,
                py: 1.25,
                fontWeight: 500,
              }}
            >
              Create New Ad
            </Button>
          </Box>
        </Box>

        {/* Alerts */}
        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 3,
              borderRadius: '12px',
              backgroundColor: darkMode ? '#303134' : '#ffffff',
              border: '1px solid #ea4335',
              color: darkMode ? '#e8eaed' : '#202124',
              '& .MuiAlert-icon': { color: '#ea4335' },
            }}
            onClose={() => setError(null)}
          >
            {error}
          </Alert>
        )}

        {success && (
          <Alert 
            severity="success" 
            sx={{ 
              mb: 3,
              borderRadius: '12px',
              backgroundColor: darkMode ? '#303134' : '#ffffff',
              border: '1px solid #34a853',
              color: darkMode ? '#e8eaed' : '#202124',
              '& .MuiAlert-icon': { color: '#34a853' },
            }}
            onClose={() => setSuccess(null)}
          >
            {success}
          </Alert>
        )}

        {/* Stats Overview */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          sx={{ mb: 4, flexWrap: "wrap" }}
        >
          <Card sx={{ 
            flex: 1, 
            minWidth: 200,
            borderRadius: '16px',
            backgroundColor: darkMode ? '#303134' : '#ffffff',
            border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
            boxShadow: darkMode 
              ? '0 2px 8px rgba(0, 0, 0, 0.15)'
              : '0 2px 8px rgba(0, 0, 0, 0.05)',
          }}>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar sx={{ 
                  bgcolor: darkMode ? 'rgba(52, 168, 83, 0.1)' : 'rgba(52, 168, 83, 0.1)',
                  color: darkMode ? '#34a853' : '#34a853',
                }}>
                  <MonetizationOn />
                </Avatar>
                <Box>
                  <Typography variant="h3" fontWeight="bold" color={darkMode ? '#34a853' : '#34a853'}>
                    ₹{totalRevenue.toFixed(2)}
                  </Typography>
                  <Typography variant="body2" color={darkMode ? '#9aa0a6' : '#5f6368'}>
                    Total Revenue
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
          
          <Card sx={{ 
            flex: 1, 
            minWidth: 200,
            borderRadius: '16px',
            backgroundColor: darkMode ? '#303134' : '#ffffff',
            border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
            boxShadow: darkMode 
              ? '0 2px 8px rgba(0, 0, 0, 0.15)'
              : '0 2px 8px rgba(0, 0, 0, 0.05)',
          }}>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar sx={{ 
                  bgcolor: darkMode ? 'rgba(26, 115, 232, 0.1)' : 'rgba(26, 115, 232, 0.1)',
                  color: darkMode ? '#8ab4f8' : '#1a73e8',
                }}>
                  <Visibility />
                </Avatar>
                <Box>
                  <Typography variant="h3" fontWeight="bold" color={darkMode ? '#e8eaed' : '#202124'}>
                    {totalImpressions.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color={darkMode ? '#9aa0a6' : '#5f6368'}>
                    Total Impressions
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
          
          <Card sx={{ 
            flex: 1, 
            minWidth: 200,
            borderRadius: '16px',
            backgroundColor: darkMode ? '#303134' : '#ffffff',
            border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
            boxShadow: darkMode 
              ? '0 2px 8px rgba(0, 0, 0, 0.15)'
              : '0 2px 8px rgba(0, 0, 0, 0.05)',
          }}>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar sx={{ 
                  bgcolor: darkMode ? 'rgba(251, 188, 4, 0.1)' : 'rgba(251, 188, 4, 0.1)',
                  color: darkMode ? '#fbbc04' : '#fbbc04',
                }}>
                  <TrendingUp />
                </Avatar>
                <Box>
                  <Typography variant="h3" fontWeight="bold" color={darkMode ? '#e8eaed' : '#202124'}>
                    {averageCTR.toFixed(2)}%
                  </Typography>
                  <Typography variant="body2" color={darkMode ? '#9aa0a6' : '#5f6368'}>
                    Average CTR
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Stack>

        {/* Ad Settings Card */}
        <Card sx={{ 
          mb: 4,
          borderRadius: '16px',
          backgroundColor: darkMode ? '#303134' : '#ffffff',
          border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
          boxShadow: darkMode 
            ? '0 4px 24px rgba(0, 0, 0, 0.2)'
            : '0 4px 24px rgba(0, 0, 0, 0.05)',
        }}>
          <CardContent>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 2, 
              mb: 3,
              pb: 2,
              borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
            }}>
              <Settings sx={{ 
                fontSize: 24,
                color: darkMode ? '#8ab4f8' : '#1a73e8',
              }} />
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 500,
                  color: darkMode ? '#e8eaed' : '#202124',
                }}
              >
                Ad Settings
              </Typography>
            </Box>
            
            <Box sx={{ px: { xs: 1, sm: 2 } }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={adsEnabled}
                    onChange={(e) => setAdsEnabled(e.target.checked)}
                    sx={{
                      color: '#1a73e8',
                      '&.Mui-checked': {
                        color: '#1a73e8',
                      },
                    }}
                  />
                }
                label={
                  <Typography color={darkMode ? '#e8eaed' : '#202124'}>
                    Enable advertisements
                  </Typography>
                }
                sx={{ mb: 3, display: 'block' }}
              />
              
              <Typography variant="body2" gutterBottom sx={{ mt: 2, color: darkMode ? '#e8eaed' : '#202124' }}>
                Ad Density: {adDensity}%
              </Typography>
              <Slider
                value={adDensity}
                onChange={(_, value) => setAdDensity(value as number)}
                min={10}
                max={100}
                sx={{
                  color: '#1a73e8',
                  '& .MuiSlider-mark': {
                    backgroundColor: darkMode ? '#9aa0a6' : '#5f6368',
                  },
                  '& .MuiSlider-markLabel': {
                    color: darkMode ? '#9aa0a6' : '#5f6368',
                  },
                }}
                marks={[
                  { value: 25, label: 'Low' },
                  { value: 50, label: 'Medium' },
                  { value: 75, label: 'High' },
                ]}
              />
              
              <Typography variant="body2" gutterBottom sx={{ mt: 3, color: darkMode ? '#e8eaed' : '#202124' }}>
                Ad Categories
              </Typography>
              <Select 
                fullWidth 
                size="small" 
                defaultValue="all" 
                sx={{ 
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: darkMode ? '#202124' : '#f8f9fa',
                    borderColor: darkMode ? '#3c4043' : '#dadce0',
                    '&:hover': {
                      borderColor: darkMode ? '#5f6368' : '#bdc1c6',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: darkMode ? '#9aa0a6' : '#5f6368',
                  },
                  '& .MuiSelect-select': {
                    color: darkMode ? '#e8eaed' : '#202124',
                  },
                }}
              >
                <MenuItem value="all">All Categories</MenuItem>
                <MenuItem value="tech">Technology</MenuItem>
                <MenuItem value="business">Business</MenuItem>
                <MenuItem value="saas">SaaS</MenuItem>
                <MenuItem value="marketing">Marketing</MenuItem>
              </Select>
            </Box>
          </CardContent>
        </Card>

        {/* Campaigns Table Card */}
        <Card sx={{ 
          borderRadius: '16px',
          backgroundColor: darkMode ? '#303134' : '#ffffff',
          border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
          boxShadow: darkMode 
            ? '0 4px 24px rgba(0, 0, 0, 0.2)'
            : '0 4px 24px rgba(0, 0, 0, 0.05)',
          overflow: 'hidden',
        }}>
          <CardContent sx={{ p: 0 }}>
            <Box sx={{ 
              p: 3, 
              pb: 2, 
              borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
              backgroundColor: darkMode ? '#202124' : '#f8f9fa',
            }}>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                justifyContent="space-between"
                alignItems={{ xs: "flex-start", sm: "center" }}
                spacing={2}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Campaign sx={{ 
                    color: darkMode ? '#8ab4f8' : '#1a73e8',
                  }} />
                  <Box>
                    <Typography variant="h6" fontWeight="bold" color={darkMode ? '#e8eaed' : '#202124'}>
                      Active Campaigns
                    </Typography>
                    <Typography
                      variant="body2"
                      color={darkMode ? '#9aa0a6' : '#5f6368'}
                      sx={{ mt: 0.5 }}
                    >
                      {campaigns.length} campaigns running
                    </Typography>
                  </Box>
                </Box>
                <Badge 
                  badgeContent={campaigns.filter(c => c.status === 'active').length} 
                  color="primary" 
                  showZero
                  sx={{
                    '& .MuiBadge-badge': {
                      backgroundColor: '#1a73e8',
                      color: '#ffffff',
                    }
                  }}
                >
                  <Typography variant="body2" color={darkMode ? '#9aa0a6' : '#5f6368'}>
                    Active Campaigns
                  </Typography>
                </Badge>
              </Stack>
            </Box>

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ 
                    backgroundColor: darkMode ? '#202124' : '#f8f9fa',
                    borderBottom: `2px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                  }}>
                    <TableCell sx={{ 
                      color: darkMode ? '#9aa0a6' : '#5f6368',
                      fontWeight: 500,
                      borderBottom: 'none',
                    }}>
                      Campaign Name
                    </TableCell>
                    <TableCell sx={{ 
                      color: darkMode ? '#9aa0a6' : '#5f6368',
                      fontWeight: 500,
                      borderBottom: 'none',
                    }}>
                      Status
                    </TableCell>
                    <TableCell sx={{ 
                      color: darkMode ? '#9aa0a6' : '#5f6368',
                      fontWeight: 500,
                      borderBottom: 'none',
                    }}>
                      Impressions
                    </TableCell>
                    <TableCell sx={{ 
                      color: darkMode ? '#9aa0a6' : '#5f6368',
                      fontWeight: 500,
                      borderBottom: 'none',
                    }}>
                      Clicks
                    </TableCell>
                    <TableCell sx={{ 
                      color: darkMode ? '#9aa0a6' : '#5f6368',
                      fontWeight: 500,
                      borderBottom: 'none',
                    }}>
                      CTR
                    </TableCell>
                    <TableCell sx={{ 
                      color: darkMode ? '#9aa0a6' : '#5f6368',
                      fontWeight: 500,
                      borderBottom: 'none',
                    }}>
                      Revenue
                    </TableCell>
                    <TableCell sx={{ 
                      color: darkMode ? '#9aa0a6' : '#5f6368',
                      fontWeight: 500,
                      borderBottom: 'none',
                    }}>
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {campaigns.map((campaign) => (
                    <TableRow
                      key={campaign.id}
                      hover
                      sx={{
                        backgroundColor: darkMode ? '#303134' : '#ffffff',
                        '&:hover': { backgroundColor: darkMode ? '#2d2f31' : '#f1f3f4' },
                        borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                      }}
                    >
                      <TableCell sx={{ borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}` }}>
                        <Box>
                          <Typography fontWeight="medium" color={darkMode ? '#e8eaed' : '#202124'}>
                            {campaign.name}
                          </Typography>
                          <Typography variant="caption" color={darkMode ? '#9aa0a6' : '#5f6368'}>
                            {campaign.placement}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}` }}>
                        <Chip
                          label={campaign.status}
                          size="small"
                          sx={{
                            bgcolor: campaign.status === 'active' 
                              ? (darkMode ? 'rgba(52, 168, 83, 0.1)' : 'rgba(52, 168, 83, 0.1)')
                              : (darkMode ? 'rgba(251, 188, 4, 0.1)' : 'rgba(251, 188, 4, 0.1)'),
                            color: campaign.status === 'active' 
                              ? (darkMode ? '#34a853' : '#34a853')
                              : (darkMode ? '#fbbc04' : '#f57c00'),
                            fontWeight: "medium",
                            border: 'none',
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}` }}>
                        <Typography color={darkMode ? '#e8eaed' : '#202124'}>
                          {campaign.impressions.toLocaleString()}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}` }}>
                        <Typography color={darkMode ? '#e8eaed' : '#202124'}>
                          {campaign.clicks}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}` }}>
                        <Typography color={darkMode ? '#e8eaed' : '#202124'}>
                          {campaign.ctr}%
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}` }}>
                        <Typography fontWeight="bold" color={darkMode ? '#34a853' : '#34a853'}>
                          ₹{campaign.revenue.toFixed(2)}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}` }}>
                        <Box display="flex" gap={1}>
                          <Button 
                            size="small" 
                            startIcon={<EditIcon />}
                            sx={{
                              color: darkMode ? '#fbbc04' : '#f57c00',
                              borderColor: darkMode ? '#3c4043' : '#dadce0',
                              borderRadius: '8px',
                              '&:hover': {
                                backgroundColor: darkMode ? 'rgba(251, 188, 4, 0.1)' : 'rgba(251, 188, 4, 0.1)',
                                borderColor: darkMode ? '#fbbc04' : '#f57c00',
                              },
                            }}
                          >
                            Edit
                          </Button>
                          <Button 
                            size="small" 
                            startIcon={<DeleteIcon />}
                            sx={{
                              color: darkMode ? '#ea4335' : '#d32f2f',
                              borderColor: darkMode ? '#3c4043' : '#dadce0',
                              borderRadius: '8px',
                              '&:hover': {
                                backgroundColor: darkMode ? 'rgba(234, 67, 53, 0.1)' : 'rgba(234, 67, 53, 0.1)',
                                borderColor: darkMode ? '#ea4335' : '#d32f2f',
                              },
                            }}
                          >
                            Delete
                          </Button>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>

        {/* Create Ad Dialog */}
        <CreateAdDialog
          open={openAdDialog}
          onClose={() => setOpenAdDialog(false)}
          darkMode={darkMode}
        />
      </Container>
    </Box>
  )
}

function CreateAdDialog({ open, onClose, darkMode }: any) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    url: '',
    placement: 'banner',
    budget: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    onClose()
  }

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '16px',
          backgroundColor: darkMode ? '#303134' : '#ffffff',
          border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
        }
      }}
    >
      <DialogTitle sx={{ 
        borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
        color: darkMode ? '#e8eaed' : '#202124',
        fontWeight: 500,
        pb: 2,
      }}>
        Create New Advertisement
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ pt: 3 }}>
          <Stack spacing={2}>
            <TextField
              fullWidth
              label="Ad Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: darkMode ? '#202124' : '#f8f9fa',
                  borderColor: darkMode ? '#3c4043' : '#dadce0',
                  '&:hover': {
                    borderColor: darkMode ? '#5f6368' : '#bdc1c6',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: darkMode ? '#9aa0a6' : '#5f6368',
                },
                '& .MuiInputBase-input': {
                  color: darkMode ? '#e8eaed' : '#202124',
                },
              }}
            />
            
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: darkMode ? '#202124' : '#f8f9fa',
                  borderColor: darkMode ? '#3c4043' : '#dadce0',
                  '&:hover': {
                    borderColor: darkMode ? '#5f6368' : '#bdc1c6',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: darkMode ? '#9aa0a6' : '#5f6368',
                },
                '& .MuiInputBase-input': {
                  color: darkMode ? '#e8eaed' : '#202124',
                },
              }}
            />
            
            <TextField
              fullWidth
              label="Target URL"
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              required
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: darkMode ? '#202124' : '#f8f9fa',
                  borderColor: darkMode ? '#3c4043' : '#dadce0',
                  '&:hover': {
                    borderColor: darkMode ? '#5f6368' : '#bdc1c6',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: darkMode ? '#9aa0a6' : '#5f6368',
                },
                '& .MuiInputBase-input': {
                  color: darkMode ? '#e8eaed' : '#202124',
                },
              }}
            />
            
            <Select
              fullWidth
              label="Placement"
              value={formData.placement}
              onChange={(e) => setFormData({ ...formData, placement: e.target.value })}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: darkMode ? '#202124' : '#f8f9fa',
                  borderColor: darkMode ? '#3c4043' : '#dadce0',
                  '&:hover': {
                    borderColor: darkMode ? '#5f6368' : '#bdc1c6',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: darkMode ? '#9aa0a6' : '#5f6368',
                },
                '& .MuiSelect-select': {
                  color: darkMode ? '#e8eaed' : '#202124',
                },
              }}
            >
              <MenuItem value="banner">Top Banner</MenuItem>
              <MenuItem value="sidebar">Sidebar</MenuItem>
              <MenuItem value="content">Inline Content</MenuItem>
              <MenuItem value="popup">Popup</MenuItem>
            </Select>
            
            <TextField
              fullWidth
              label="Budget (₹)"
              type="number"
              value={formData.budget}
              onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
              required
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: darkMode ? '#202124' : '#f8f9fa',
                  borderColor: darkMode ? '#3c4043' : '#dadce0',
                  '&:hover': {
                    borderColor: darkMode ? '#5f6368' : '#bdc1c6',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: darkMode ? '#9aa0a6' : '#5f6368',
                },
                '& .MuiInputBase-input': {
                  color: darkMode ? '#e8eaed' : '#202124',
                },
              }}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ 
          px: 3, 
          pb: 3,
          borderTop: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
          pt: 2,
        }}>
          <Button 
            onClick={onClose}
            sx={{
              color: darkMode ? '#9aa0a6' : '#5f6368',
              '&:hover': {
                backgroundColor: darkMode ? 'rgba(154, 160, 166, 0.1)' : 'rgba(95, 99, 104, 0.1)',
              },
              borderRadius: '8px',
              px: 3,
            }}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="contained"
            sx={{
              backgroundColor: '#1a73e8',
              '&:hover': {
                backgroundColor: '#1669c1',
              },
              borderRadius: '8px',
              px: 3,
              fontWeight: 500,
            }}
          >
            Create Campaign
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}