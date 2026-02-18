// components/googleadvance/marketing/CampaignCard.tsx

'use client';

import React from 'react';
import {
  Card,
  CardContent,
  Box,
  Typography,
  Chip,
  LinearProgress,
  IconButton,
  alpha,
} from '@mui/material';
import {
  Email,
  Sms,
  Notifications,
  MoreVert,
  PlayArrow,
  Pause,
  Delete,
} from '@mui/icons-material';
import { MarketingCampaign } from '../types';
import { googleColors, getStatusColor } from '../common/GoogleColors';

interface CampaignCardProps {
  campaign: MarketingCampaign;
  currentColors: any;
  isMobile?: boolean;
  onToggleStatus?: (id: string, status: string) => void;
  onDelete?: (id: string) => void;
}

export const CampaignCard: React.FC<CampaignCardProps> = ({
  campaign,
  currentColors,
  isMobile = false,
  onToggleStatus,
  onDelete,
}) => {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'email': return <Email fontSize="small" />;
      case 'sms': return <Sms fontSize="small" />;
      case 'push': return <Notifications fontSize="small" />;
      default: return <Email fontSize="small" />;
    }
  };

  const getStatusChipColor = (status: string) => {
    const baseColor = getStatusColor(status);
    return {
      background: alpha(baseColor, 0.1),
      color: baseColor,
      border: `1px solid ${alpha(baseColor, 0.3)}`,
    };
  };

  const progress = campaign.sent > 0 
    ? (campaign.sent / campaign.recipients) * 100 
    : 0;

  return (
    <Card
      sx={{
        background: currentColors.card,
        border: `1px solid ${currentColors.border}`,
        borderRadius: '12px',
        transition: 'all 0.2s ease',
        '&:hover': {
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        },
      }}
    >
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Box display="flex" alignItems="center" gap={1}>
            <Box sx={{ 
              p: 0.5, 
              borderRadius: 2,
              background: alpha(googleColors.blue, 0.1),
              color: googleColors.blue,
            }}>
              {getTypeIcon(campaign.type)}
            </Box>
            <Typography variant="subtitle1" fontWeight="bold">
              {campaign.name}
            </Typography>
          </Box>
          <Box>
            <IconButton size="small" disabled>
              <MoreVert fontSize="small" />
            </IconButton>
          </Box>
        </Box>

        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Chip
            label={campaign.status}
            size="small"
            sx={getStatusChipColor(campaign.status)}
          />
          <Typography variant="caption" color={currentColors.textSecondary}>
            {campaign.recipients.toLocaleString()} recipients
          </Typography>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Box display="flex" justifyContent="space-between" mb={0.5}>
            <Typography variant="caption" color={currentColors.textSecondary}>
              Progress
            </Typography>
            <Typography variant="caption" fontWeight="bold">
              {campaign.sent.toLocaleString()}/{campaign.recipients.toLocaleString()}
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 6,
              borderRadius: 3,
              backgroundColor: currentColors.chipBackground,
              '& .MuiLinearProgress-bar': {
                backgroundColor: googleColors.blue,
                borderRadius: 3,
              },
            }}
          />
        </Box>

        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="caption" color={currentColors.textSecondary} display="block">
              Opened: {campaign.opened.toLocaleString()}
            </Typography>
            <Typography variant="caption" color={currentColors.textSecondary} display="block">
              Clicked: {campaign.clicked.toLocaleString()}
            </Typography>
          </Box>
          <Box>
            {campaign.status !== 'completed' && campaign.status !== 'cancelled' && (
              <>
                <IconButton 
                  size="small" 
                  onClick={() => onToggleStatus?.(campaign._id, campaign.status)}
                  disabled
                  sx={{ color: googleColors.blue }}
                >
                  {campaign.status === 'active' ? <Pause /> : <PlayArrow />}
                </IconButton>
                <IconButton 
                  size="small" 
                  onClick={() => onDelete?.(campaign._id)}
                  disabled
                  sx={{ color: googleColors.red }}
                >
                  <Delete />
                </IconButton>
              </>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};