// components/googleadvance/marketing/AudiencesTab.tsx

'use client';

import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  LinearProgress,
  IconButton,
  Tooltip,
  Grid,
  alpha,
} from '@mui/material';
import {
  Edit,
  Delete,
  People,
  DynamicFeed,
  Visibility,
} from '@mui/icons-material';
import { CustomerSegment } from '../types';
import { googleColors } from '../common/GoogleColors';

interface AudiencesTabProps {
  segments: CustomerSegment[];
  currentColors: any;
  primaryColor: string;
  isMobile?: boolean;
}

export const AudiencesTab: React.FC<AudiencesTabProps> = ({
  segments,
  currentColors,
  primaryColor,
  isMobile = false,
}) => {
  return (
    <Grid container spacing={3}>
      {segments.map((segment) => (
        <Grid item xs={12} md={6} key={segment._id}>
          <Card sx={{ 
            background: currentColors.card,
            height: '100%',
            transition: 'all 0.2s ease',
            '&:hover': {
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            },
          }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                <Box display="flex" alignItems="center" gap={1}>
                  {segment.type === 'dynamic' ? (
                    <DynamicFeed sx={{ color: googleColors.blue }} />
                  ) : (
                    <People sx={{ color: googleColors.green }} />
                  )}
                  <Typography variant="h6" fontWeight="bold">
                    {segment.name}
                  </Typography>
                </Box>
                <Chip
                  label={segment.type}
                  size="small"
                  sx={{
                    backgroundColor: segment.type === 'dynamic' 
                      ? alpha(googleColors.blue, 0.1)
                      : alpha(googleColors.green, 0.1),
                    color: segment.type === 'dynamic' ? googleColors.blue : googleColors.green,
                  }}
                />
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="h3" fontWeight="bold" gutterBottom>
                  {segment.customerCount}
                </Typography>
                <Typography variant="body2" color={currentColors.textSecondary}>
                  Customers in segment
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color={currentColors.textSecondary} gutterBottom>
                  Criteria
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {segment.criteria.map((criterion, index) => (
                    <Chip
                      key={index}
                      label={`${criterion.field} ${criterion.operator} ${criterion.value}`}
                      size="small"
                      variant="outlined"
                      sx={{
                        borderColor: currentColors.border,
                        color: currentColors.textPrimary,
                      }}
                    />
                  ))}
                </Box>
              </Box>

              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="caption" color={currentColors.textSecondary}>
                  Last updated: {new Date(segment.lastUpdated).toLocaleDateString()}
                </Typography>
                <Box>
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
                  <Tooltip title="Delete">
                    <IconButton size="small" disabled sx={{ color: googleColors.red }}>
                      <Delete fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};