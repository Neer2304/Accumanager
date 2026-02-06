// app/(pages)/advance/ads-manager/page.tsx
'use client'

import { useState } from 'react'
import {
  Box,
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
  Paper,
  Chip,
  TextField,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material'
import {
  TrendingUp,
  Visibility,
  MonetizationOn,
  Add,
  Edit,
  Delete,
  Campaign,
  Analytics,
  Settings,
} from '@mui/icons-material'

export default function AdsManagerPage() {
  const [adsEnabled, setAdsEnabled] = useState(true)
  const [adDensity, setAdDensity] = useState(50)
  const [openAdDialog, setOpenAdDialog] = useState(false)
  
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

  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={4}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            📢 Ad Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage advertisements and monetization
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setOpenAdDialog(true)}
        >
          Create New Ad
        </Button>
      </Box>

      {/* Stats Overview */}
      <Box sx={{ display: 'flex', gap: 3, mb: 4, flexWrap: 'wrap' }}>
        <Card sx={{ flex: 1, minWidth: 200 }}>
          <CardContent>
            <Typography color="text.secondary" variant="body2">
              Total Revenue
            </Typography>
            <Typography variant="h4" fontWeight="bold" color="success.main">
              ₹{campaigns.reduce((sum, c) => sum + c.revenue, 0).toFixed(2)}
            </Typography>
          </CardContent>
        </Card>
        
        <Card sx={{ flex: 1, minWidth: 200 }}>
          <CardContent>
            <Typography color="text.secondary" variant="body2">
              Total Impressions
            </Typography>
            <Typography variant="h4" fontWeight="bold">
              {campaigns.reduce((sum, c) => sum + c.impressions, 0).toLocaleString()}
            </Typography>
          </CardContent>
        </Card>
        
        <Card sx={{ flex: 1, minWidth: 200 }}>
          <CardContent>
            <Typography color="text.secondary" variant="body2">
              Average CTR
            </Typography>
            <Typography variant="h4" fontWeight="bold">
              {(
                campaigns.reduce((sum, c) => sum + c.ctr, 0) / campaigns.length
              ).toFixed(2)}%
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Ad Settings */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom display="flex" alignItems="center" gap={1}>
            <Settings /> Ad Settings
          </Typography>
          
          <Box sx={{ p: 2 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={adsEnabled}
                  onChange={(e) => setAdsEnabled(e.target.checked)}
                  color="primary"
                />
              }
              label="Enable advertisements"
              sx={{ mb: 3, display: 'block' }}
            />
            
            <Typography variant="body2" gutterBottom sx={{ mt: 2 }}>
              Ad Density: {adDensity}%
            </Typography>
            <Slider
              value={adDensity}
              onChange={(_, value) => setAdDensity(value as number)}
              min={10}
              max={100}
              marks={[
                { value: 25, label: 'Low' },
                { value: 50, label: 'Medium' },
                { value: 75, label: 'High' },
              ]}
            />
            
            <Typography variant="body2" gutterBottom sx={{ mt: 3 }}>
              Ad Categories
            </Typography>
            <Select fullWidth size="small" defaultValue="all" sx={{ mb: 2 }}>
              <MenuItem value="all">All Categories</MenuItem>
              <MenuItem value="tech">Technology</MenuItem>
              <MenuItem value="business">Business</MenuItem>
              <MenuItem value="saas">SaaS</MenuItem>
              <MenuItem value="marketing">Marketing</MenuItem>
            </Select>
          </Box>
        </CardContent>
      </Card>

      {/* Campaigns Table */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom display="flex" alignItems="center" gap={1}>
            <Campaign /> Active Campaigns
          </Typography>
          
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Campaign Name</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Impressions</TableCell>
                  <TableCell>Clicks</TableCell>
                  <TableCell>CTR</TableCell>
                  <TableCell>Revenue</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {campaigns.map((campaign) => (
                  <TableRow key={campaign.id}>
                    <TableCell>
                      <Typography fontWeight="medium">{campaign.name}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {campaign.placement}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={campaign.status}
                        color={campaign.status === 'active' ? 'success' : 'warning'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{campaign.impressions.toLocaleString()}</TableCell>
                    <TableCell>{campaign.clicks}</TableCell>
                    <TableCell>{campaign.ctr}%</TableCell>
                    <TableCell>₹{campaign.revenue.toFixed(2)}</TableCell>
                    <TableCell>
                      <Box display="flex" gap={1}>
                        <Button size="small" startIcon={<Edit />}>Edit</Button>
                        <Button size="small" color="error" startIcon={<Delete />}>Delete</Button>
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
      <Dialog open={openAdDialog} onClose={() => setOpenAdDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Create New Advertisement</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField fullWidth label="Ad Title" sx={{ mb: 2 }} />
            <TextField fullWidth label="Description" multiline rows={3} sx={{ mb: 2 }} />
            <TextField fullWidth label="Target URL" sx={{ mb: 2 }} />
            <Select fullWidth label="Placement" defaultValue="banner" sx={{ mb: 2 }}>
              <MenuItem value="banner">Top Banner</MenuItem>
              <MenuItem value="sidebar">Sidebar</MenuItem>
              <MenuItem value="inline">Inline Content</MenuItem>
              <MenuItem value="popup">Popup</MenuItem>
            </Select>
            <TextField fullWidth label="Budget (₹)" type="number" sx={{ mb: 2 }} />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAdDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => setOpenAdDialog(false)}>
            Create Campaign
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}