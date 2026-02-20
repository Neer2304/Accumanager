// components/googleadsmanager/components/CampaignsTable.tsx
import React from 'react';
import {
  Card,
  CardContent,
  Box,
  Typography,
  Badge,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Stack,
  useTheme
} from '@mui/material';
import {
  Campaign
} from '@mui/icons-material';
import { Campaign as CampaignType } from './types';
import { CampaignRow } from './CampaignRow';

interface CampaignsTableProps {
  campaigns: CampaignType[];
  onToggleStatus: (id: number) => void;
  onDelete: (id: number) => void;
  onEdit: (id: number) => void;
}

export const CampaignsTable: React.FC<CampaignsTableProps> = ({
  campaigns,
  onToggleStatus,
  onDelete,
  onEdit
}) => {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';
  const activeCount = campaigns.filter(c => c.status === 'active').length;

  return (
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
              badgeContent={activeCount} 
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
                <CampaignRow
                  key={campaign.id}
                  campaign={campaign}
                  onToggleStatus={onToggleStatus}
                  onDelete={onDelete}
                  onEdit={onEdit}
                  darkMode={darkMode}
                />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
};