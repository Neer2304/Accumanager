// components/googleadvance/marketing/CampaignsTab.tsx

'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Tooltip,
  LinearProgress,
  alpha,
} from '@mui/material';
import {
  Edit,
  Delete,
  PlayArrow,
  Pause,
  Visibility,
} from '@mui/icons-material';
import { MarketingCampaign, CustomerSegment } from '../types';
import { googleColors } from '../common/GoogleColors';

interface CampaignsTabProps {
  campaigns: MarketingCampaign[];
  segments: CustomerSegment[];
  onToggleStatus: (id: string, status: string) => void;
  onDeleteCampaign: (id: string) => void;
  currentColors: any;
  primaryColor: string;
  isMobile?: boolean;
}

export const CampaignsTab: React.FC<CampaignsTabProps> = ({
  campaigns,
  segments,
  onToggleStatus,
  onDeleteCampaign,
  currentColors,
  primaryColor,
  isMobile = false,
}) => {
  const [selectedCampaign, setSelectedCampaign] = useState<string | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return googleColors.green;
      case 'paused': return googleColors.yellow;
      case 'draft': return googleColors.blue;
      case 'completed': return googleColors.green;
      case 'cancelled': return googleColors.red;
      default: return currentColors.textSecondary;
    }
  };

  const getSegmentName = (segmentId: string) => {
    return segments.find(s => s._id === segmentId)?.name || 'Unknown Segment';
  };

  if (isMobile) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {campaigns.map((campaign) => (
          <Card key={campaign._id} sx={{ background: currentColors.card }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography variant="subtitle1" fontWeight="bold">
                  {campaign.name}
                </Typography>
                <Chip
                  label={campaign.status}
                  size="small"
                  sx={{
                    backgroundColor: alpha(getStatusColor(campaign.status), 0.1),
                    color: getStatusColor(campaign.status),
                  }}
                />
              </Box>
              
              <Typography variant="caption" color={currentColors.textSecondary} display="block">
                Type: {campaign.type} • Segment: {getSegmentName(campaign.segment)}
              </Typography>
              
              <Box sx={{ mt: 2 }}>
                <Box display="flex" justifyContent="space-between" mb={0.5}>
                  <Typography variant="caption">Progress</Typography>
                  <Typography variant="caption">
                    {campaign.sent}/{campaign.recipients}
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={(campaign.sent / campaign.recipients) * 100}
                  sx={{
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: currentColors.chipBackground,
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: primaryColor,
                    },
                  }}
                />
              </Box>
              
              <Box display="flex" justifyContent="flex-end" gap={1} mt={2}>
                <IconButton size="small" disabled>
                  <Visibility fontSize="small" />
                </IconButton>
                <IconButton size="small" disabled>
                  <Edit fontSize="small" />
                </IconButton>
                <IconButton 
                  size="small" 
                  onClick={() => onToggleStatus(campaign._id, campaign.status)}
                  disabled
                  sx={{ color: campaign.status === 'active' ? googleColors.yellow : googleColors.green }}
                >
                  {campaign.status === 'active' ? <Pause /> : <PlayArrow />}
                </IconButton>
                <IconButton 
                  size="small" 
                  onClick={() => onDeleteCampaign(campaign._id)}
                  disabled
                  sx={{ color: googleColors.red }}
                >
                  <Delete />
                </IconButton>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    );
  }

  return (
    <Card sx={{ background: currentColors.card }}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: currentColors.surface }}>
              <TableCell sx={{ fontWeight: 600, color: currentColors.textPrimary }}>Campaign</TableCell>
              <TableCell sx={{ fontWeight: 600, color: currentColors.textPrimary }}>Type</TableCell>
              <TableCell sx={{ fontWeight: 600, color: currentColors.textPrimary }}>Segment</TableCell>
              <TableCell sx={{ fontWeight: 600, color: currentColors.textPrimary }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 600, color: currentColors.textPrimary }}>Progress</TableCell>
              <TableCell sx={{ fontWeight: 600, color: currentColors.textPrimary }}>Performance</TableCell>
              <TableCell align="right" sx={{ fontWeight: 600, color: currentColors.textPrimary }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {campaigns.map((campaign) => (
              <TableRow key={campaign._id} hover>
                <TableCell>
                  <Typography variant="body2" fontWeight="bold">
                    {campaign.name}
                  </Typography>
                  <Typography variant="caption" color={currentColors.textSecondary}>
                    Created: {new Date(campaign.createdAt).toLocaleDateString()}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={campaign.type}
                    size="small"
                    sx={{
                      backgroundColor: alpha(primaryColor, 0.1),
                      color: primaryColor,
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {getSegmentName(campaign.segment)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={campaign.status}
                    size="small"
                    sx={{
                      backgroundColor: alpha(getStatusColor(campaign.status), 0.1),
                      color: getStatusColor(campaign.status),
                    }}
                  />
                </TableCell>
                <TableCell sx={{ minWidth: 150 }}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Box sx={{ flex: 1 }}>
                      <LinearProgress
                        variant="determinate"
                        value={(campaign.sent / campaign.recipients) * 100}
                        sx={{
                          height: 6,
                          borderRadius: 3,
                          backgroundColor: currentColors.chipBackground,
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: primaryColor,
                          },
                        }}
                      />
                    </Box>
                    <Typography variant="caption">
                      {Math.round((campaign.sent / campaign.recipients) * 100)}%
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="caption" display="block">
                    Open: {campaign.opened} ({Math.round((campaign.opened / campaign.sent) * 100)}%)
                  </Typography>
                  <Typography variant="caption" display="block">
                    Click: {campaign.clicked} ({Math.round((campaign.clicked / campaign.sent) * 100)}%)
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Tooltip title="View">
                    <IconButton size="small" disabled>
                      <Visibility fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Edit">
                    <IconButton size="small" disabled>
                      <Edit fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title={campaign.status === 'active' ? 'Pause' : 'Start'}>
                    <IconButton 
                      size="small" 
                      onClick={() => onToggleStatus(campaign._id, campaign.status)}
                      disabled
                      sx={{ color: campaign.status === 'active' ? googleColors.yellow : googleColors.green }}
                    >
                      {campaign.status === 'active' ? <Pause /> : <PlayArrow />}
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton 
                      size="small" 
                      onClick={() => onDeleteCampaign(campaign._id)}
                      disabled
                      sx={{ color: googleColors.red }}
                    >
                      <Delete />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
};