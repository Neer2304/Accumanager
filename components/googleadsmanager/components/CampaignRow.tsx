// components/googleadsmanager/components/CampaignRow.tsx
import React from 'react';
import {
  TableRow,
  TableCell,
  Typography,
  Box,
  Button,
  useTheme
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { Campaign } from './types';
import { StatusChip } from './StatusChip';

interface CampaignRowProps {
  campaign: Campaign;
  onToggleStatus: (id: number) => void;
  onDelete: (id: number) => void;
  onEdit: (id: number) => void;
  darkMode: boolean;
}

export const CampaignRow: React.FC<CampaignRowProps> = ({
  campaign,
  onToggleStatus,
  onDelete,
  onEdit,
  darkMode
}) => {
  return (
    <TableRow
      hover
      sx={{
        backgroundColor: darkMode ? '#303134' : '#ffffff',
        '&:hover': { backgroundColor: darkMode ? '#2d2f31' : '#f1f3f4' },
        borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
        cursor: 'pointer',
      }}
      onClick={() => onToggleStatus(campaign.id)}
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
        <StatusChip status={campaign.status} />
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
        <Box display="flex" gap={1} onClick={(e) => e.stopPropagation()}>
          <Button 
            size="small" 
            startIcon={<EditIcon />}
            onClick={() => onEdit(campaign.id)}
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
            onClick={() => onDelete(campaign.id)}
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
  );
};