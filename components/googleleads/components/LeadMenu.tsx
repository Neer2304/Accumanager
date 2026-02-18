import React from 'react';
import {
  Menu,
  MenuItem,
  Divider,
  Box,
  useTheme
} from '@mui/material';
import {
  Visibility as ViewIcon,
  TrendingUp as TrendingUpIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { Lead } from '../types';
import { LEAD_STATUS, GOOGLE_COLORS } from '../constants';

interface LeadMenuProps {
  anchorEl: null | HTMLElement;
  onClose: () => void;
  selectedLead: Lead | null;
  onViewDetails: () => void;
  onConvert: (leadId: string) => void;
  onUpdateStatus: (leadId: string, status: string) => void;
  onDelete: (leadId: string) => void;
  darkMode: boolean;
}

export function LeadMenu({
  anchorEl,
  onClose,
  selectedLead,
  onViewDetails,
  onConvert,
  onUpdateStatus,
  onDelete,
  darkMode
}: LeadMenuProps) {
  if (!selectedLead) return null;

  return (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: '12px',
          bgcolor: darkMode ? '#2d2e30' : '#fff',
          border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
          minWidth: 200,
          boxShadow: darkMode ? '0 4px 12px rgba(0,0,0,0.3)' : '0 4px 12px rgba(0,0,0,0.1)',
        }
      }}
    >
      <MenuItem onClick={onViewDetails} sx={{ gap: 1.5, py: 1.5 }}>
        <ViewIcon fontSize="small" />
        View Details
      </MenuItem>
      
      {selectedLead.status !== 'converted' && selectedLead.status !== 'lost' && (
        <MenuItem
          onClick={() => {
            onConvert(selectedLead._id);
            onClose();
          }}
          sx={{ gap: 1.5, py: 1.5 }}
        >
          <TrendingUpIcon fontSize="small" />
          Convert to Customer
        </MenuItem>
      )}
      
      <Divider sx={{ borderColor: darkMode ? '#3c4043' : '#dadce0' }} />
      
      {LEAD_STATUS.map(status => (
        <MenuItem
          key={status.value}
          onClick={() => {
            onUpdateStatus(selectedLead._id, status.value);
            onClose();
          }}
          sx={{
            gap: 1.5,
            py: 1.5,
            color: status.color,
          }}
        >
          <Box component="span" sx={{ mr: 1 }}>{status.emoji}</Box>
          Mark as {status.label}
        </MenuItem>
      ))}
      
      <Divider sx={{ borderColor: darkMode ? '#3c4043' : '#dadce0' }} />
      
      <MenuItem
        onClick={() => {
          onDelete(selectedLead._id);
          onClose();
        }}
        sx={{ gap: 1.5, py: 1.5, color: GOOGLE_COLORS.red }}
      >
        <DeleteIcon fontSize="small" />
        Delete
      </MenuItem>
    </Menu>
  );
}