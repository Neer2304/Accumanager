// components/googlecompanies/components/CompanyMenu.tsx
import React from 'react';
import { Menu, MenuItem, Divider } from '@mui/material';
import {
  Visibility as ViewIcon,
  People as PeopleIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';

const GOOGLE_COLORS = {
  red: '#d93025'
};

interface Company {
  _id: string;
}

interface CompanyMenuProps {
  anchorEl: HTMLElement | null;
  onClose: () => void;
  selectedCompany: Company | null;
  onViewDetails: () => void;
  onManageTeam: () => void;
  onDelete: () => void;
  darkMode: boolean;
}

export const CompanyMenu: React.FC<CompanyMenuProps> = ({
  anchorEl,
  onClose,
  selectedCompany,
  onViewDetails,
  onManageTeam,
  onDelete,
  darkMode
}) => {
  return (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: '12px',
          backgroundColor: darkMode ? '#202124' : '#ffffff',
          border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
          boxShadow: darkMode ? '0 8px 16px rgba(0,0,0,0.3)' : '0 8px 16px rgba(0,0,0,0.1)',
          minWidth: 200,
          mt: 1
        }
      }}
    >
      <MenuItem 
        onClick={onViewDetails}
        sx={{ 
          gap: 1.5, 
          py: 1.5, 
          px: 2,
          color: darkMode ? '#e8eaed' : '#202124',
          '&:hover': { backgroundColor: darkMode ? '#3c4043' : '#f1f3f4' }
        }}
      >
        <ViewIcon fontSize="small" />
        View Details
      </MenuItem>
      <MenuItem 
        onClick={onManageTeam}
        sx={{ 
          gap: 1.5, 
          py: 1.5, 
          px: 2,
          color: darkMode ? '#e8eaed' : '#202124',
          '&:hover': { backgroundColor: darkMode ? '#3c4043' : '#f1f3f4' }
        }}
      >
        <PeopleIcon fontSize="small" />
        Manage Team
      </MenuItem>
      <Divider sx={{ borderColor: darkMode ? '#3c4043' : '#dadce0' }} />
      <MenuItem 
        onClick={onDelete}
        sx={{ 
          gap: 1.5, 
          py: 1.5, 
          px: 2,
          color: GOOGLE_COLORS.red,
          '&:hover': { backgroundColor: darkMode ? '#3c4043' : '#f1f3f4' }
        }}
      >
        <DeleteIcon fontSize="small" />
        Delete Company
      </MenuItem>
    </Menu>
  );
};