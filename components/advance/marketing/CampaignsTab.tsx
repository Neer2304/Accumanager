// components/advance/marketing/CampaignsTab.tsx
import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Select,
  MenuItem,
  Paper,
  Tooltip,
  Button,
} from '@mui/material';
import {
  Email,
  Send,
  Campaign,
  PlayArrow,
  Pause,
  Edit,
  Delete,
  Visibility,
  FilterList,
} from '@mui/icons-material';
import { alpha } from '@mui/material/styles';

interface CampaignsTabProps {
  campaigns: any[];
  segments: any[];
  onToggleStatus: (campaignId: string, currentStatus: string) => void;
  onDeleteCampaign: (campaignId: string) => void;
  currentColors: any;
  primaryColor: string;
  isMobile: boolean;
}

// Google colors
const googleColors = {
  blue: '#4285F4',
  green: '#34A853',
  yellow: '#FBBC04',
  red: '#EA4335',
  
  light: {
    background: '#FFFFFF',
    surface: '#F8F9FA',
    textPrimary: '#202124',
    textSecondary: '#5F6368',
    border: '#DADCE0',
    card: '#FFFFFF',
    chipBackground: '#F1F3F4',
    header: '#FFFFFF',
    sidebar: '#FFFFFF',
    hover: '#F8F9FA',
    active: '#E8F0FE',
  },
  
  dark: {
    background: '#202124',
    surface: '#303134',
    textPrimary: '#E8EAED',
    textSecondary: '#9AA0A6',
    border: '#3C4043',
    card: '#303134',
    chipBackground: '#3C4043',
    header: '#303134',
    sidebar: '#202124',
    hover: '#3C4043',
    active: '#5F6368',
  }
};

const CampaignsTab: React.FC<CampaignsTabProps> = ({
  campaigns,
  segments,
  onToggleStatus,
  onDeleteCampaign,
  currentColors,
  primaryColor,
  isMobile,
}) => {
  const [selectedSegment, setSelectedSegment] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const filteredCampaigns = campaigns.filter((campaign) => {
    if (selectedSegment !== 'all' && campaign.segment !== selectedSegment) return false;
    if (selectedStatus !== 'all' && campaign.status !== selectedStatus) return false;
    return true;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not scheduled';
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return googleColors.green;
      case 'paused':
        return googleColors.yellow;
      case 'draft':
        return currentColors.textSecondary;
      case 'completed':
        return googleColors.blue;
      case 'cancelled':
        return googleColors.red;
      default:
        return currentColors.textSecondary;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'email':
        return <Email fontSize="small" />;
      case 'sms':
        return <Send fontSize="small" />;
      case 'push':
        return <Campaign fontSize="small" />;
      default:
        return <Email fontSize="small" />;
    }
  };

  const calculateMetrics = (campaign: any) => {
    const openRate = campaign.sent > 0 ? (campaign.opened / campaign.sent * 100) : 0;
    const clickRate = campaign.sent > 0 ? (campaign.clicked / campaign.sent * 100) : 0;
    const conversionRate = campaign.sent > 0 ? (campaign.converted / campaign.sent * 100) : 0;
    return { openRate, clickRate, conversionRate };
  };

  return (
    <Box>
      {/* Filters */}
      <Card sx={{ 
        mb: 3, 
        background: currentColors.card,
        border: `1px solid ${currentColors.border}`,
        borderRadius: '12px',
      }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <FilterList sx={{ color: currentColors.textSecondary }} />
              <Typography variant="body2" color={currentColors.textSecondary}>
                Filter Campaigns
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Select
                value={selectedSegment}
                onChange={(e) => setSelectedSegment(e.target.value)}
                size="small"
                sx={{
                  background: currentColors.surface,
                  color: currentColors.textPrimary,
                  minWidth: 150,
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: currentColors.border,
                  },
                }}
              >
                <MenuItem value="all">All Segments</MenuItem>
                {segments.map((segment: any) => (
                  <MenuItem key={segment._id} value={segment._id}>
                    {segment.name}
                  </MenuItem>
                ))}
              </Select>
              
              <Select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                size="small"
                sx={{
                  background: currentColors.surface,
                  color: currentColors.textPrimary,
                  minWidth: 150,
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: currentColors.border,
                  },
                }}
              >
                <MenuItem value="all">All Status</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="draft">Draft</MenuItem>
                <MenuItem value="paused">Paused</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="cancelled">Cancelled</MenuItem>
              </Select>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Campaigns Table */}
      <Card sx={{ 
        background: currentColors.card,
        border: `1px solid ${currentColors.border}`,
        borderRadius: '12px',
      }}>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" mb={3} color={currentColors.textPrimary}>
            Campaigns ({filteredCampaigns.length})
          </Typography>

          {filteredCampaigns.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="body1" color={currentColors.textSecondary}>
                No campaigns found
              </Typography>
              {selectedSegment !== 'all' || selectedStatus !== 'all' ? (
                <Button
                  variant="text"
                  size="small"
                  onClick={() => {
                    setSelectedSegment('all');
                    setSelectedStatus('all');
                  }}
                  sx={{ mt: 1, color: primaryColor }}
                >
                  Clear filters
                </Button>
              ) : null}
            </Box>
          ) : (
            <TableContainer>
              <Table size={isMobile ? "small" : "medium"}>
                <TableHead>
                  <TableRow sx={{ background: currentColors.surface }}>
                    <TableCell sx={{ fontWeight: 'bold', color: currentColors.textPrimary }}>Campaign</TableCell>
                    {!isMobile && <TableCell sx={{ fontWeight: 'bold', color: currentColors.textPrimary }}>Status</TableCell>}
                    {!isMobile && <TableCell sx={{ fontWeight: 'bold', color: currentColors.textPrimary }}>Type</TableCell>}
                    <TableCell sx={{ fontWeight: 'bold', color: currentColors.textPrimary }}>Metrics</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: currentColors.textPrimary }}>Revenue</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: currentColors.textPrimary }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredCampaigns.map((campaign) => {
                    const metrics = calculateMetrics(campaign);
                    return (
                      <TableRow 
                        key={campaign._id}
                        sx={{
                          '&:hover': {
                            background: alpha(primaryColor, 0.02),
                          }
                        }}
                      >
                        <TableCell sx={{ color: currentColors.textPrimary }}>
                          <Typography variant="body2" fontWeight="medium">
                            {campaign.name}
                          </Typography>
                          <Typography variant="caption" color={currentColors.textSecondary}>
                            {campaign.recipients.toLocaleString()} recipients
                          </Typography>
                          {isMobile && (
                            <>
                              <Chip
                                label={campaign.status}
                                size="small"
                                sx={{
                                  background: alpha(getStatusColor(campaign.status), 0.1),
                                  color: getStatusColor(campaign.status),
                                  fontSize: '0.7rem',
                                  height: 20,
                                  mt: 0.5,
                                }}
                              />
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                                {getTypeIcon(campaign.type)}
                                <Typography variant="caption" sx={{ textTransform: 'capitalize' }}>
                                  {campaign.type}
                                </Typography>
                              </Box>
                            </>
                          )}
                        </TableCell>
                        
                        {!isMobile && (
                          <TableCell>
                            <Chip
                              label={campaign.status}
                              size="small"
                              sx={{
                                background: alpha(getStatusColor(campaign.status), 0.1),
                                color: getStatusColor(campaign.status),
                                fontWeight: 'medium'
                              }}
                            />
                          </TableCell>
                        )}
                        
                        {!isMobile && (
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              {getTypeIcon(campaign.type)}
                              <Typography variant="caption" sx={{ textTransform: 'capitalize' }}>
                                {campaign.type}
                              </Typography>
                            </Box>
                          </TableCell>
                        )}
                        
                        <TableCell sx={{ color: currentColors.textPrimary }}>
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography variant="caption" color={currentColors.textSecondary}>
                                Open:
                              </Typography>
                              <Typography variant="caption" fontWeight="bold">
                                {metrics.openRate.toFixed(1)}%
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography variant="caption" color={currentColors.textSecondary}>
                                Click:
                              </Typography>
                              <Typography variant="caption" fontWeight="bold">
                                {metrics.clickRate.toFixed(1)}%
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        
                        <TableCell sx={{ color: currentColors.textPrimary, fontWeight: 'bold' }}>
                          {formatCurrency(campaign.revenue)}
                        </TableCell>
                        
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 0.5 }}>
                            {campaign.status === 'active' || campaign.status === 'paused' ? (
                              <Tooltip title={campaign.status === 'active' ? 'Pause' : 'Activate'}>
                                <IconButton 
                                  size="small"
                                  onClick={() => onToggleStatus(campaign._id, campaign.status)}
                                  sx={{ color: currentColors.textSecondary }}
                                >
                                  {campaign.status === 'active' ? <Pause /> : <PlayArrow />}
                                </IconButton>
                              </Tooltip>
                            ) : null}
                            {campaign.status === 'draft' && (
                              <Tooltip title="Edit">
                                <IconButton size="small" sx={{ color: currentColors.textSecondary }}>
                                  <Edit />
                                </IconButton>
                              </Tooltip>
                            )}
                            <Tooltip title="Delete">
                              <IconButton 
                                size="small"
                                onClick={() => onDeleteCampaign(campaign._id)}
                                sx={{ color: googleColors.red }}
                              >
                                <Delete />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default CampaignsTab;