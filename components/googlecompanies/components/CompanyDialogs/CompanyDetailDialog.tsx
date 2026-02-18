// components/googlecompanies/components/CompanyDialogs/CompanyDetailDialog.tsx
import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Avatar,
  IconButton,
  Chip as MuiChip,
  Paper,
  alpha,
  Button
} from '@mui/material';
import {
  Close as CloseIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Language as LanguageIcon,
  LocationOn as LocationIcon,
  Group as GroupIcon,
  AccountBalance as AccountBalanceIcon,
  People as PeopleIcon
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';

const GOOGLE_COLORS = {
  blue: '#1a73e8',
  green: '#1e8e3e',
  purple: '#7c4dff',
  grey: '#5f6368'
};

interface Company {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  industry?: string;
  size: string;
  logo?: string;
  userRole: string;
  memberCount: number;
  maxMembers: number;
  plan: string;
  createdAt: string;
  website?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    zipCode?: string;
  };
}

interface CompanyDetailDialogProps {
  open: boolean;
  onClose: () => void;
  company: Company | null;
  darkMode: boolean;
}

export const CompanyDetailDialog: React.FC<CompanyDetailDialogProps> = ({
  open,
  onClose,
  company,
  darkMode
}) => {
  const router = useRouter();

  if (!company) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{ 
        sx: { 
          borderRadius: '24px',
          maxHeight: '85vh',
          backgroundColor: darkMode ? '#202124' : '#ffffff',
          border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
          boxShadow: darkMode ? '0 16px 32px rgba(0,0,0,0.4)' : '0 16px 32px rgba(0,0,0,0.1)',
        }
      }}
    >
      <DialogTitle sx={{ 
        borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
        backgroundColor: darkMode ? '#303134' : '#f8f9fa',
        px: 4,
        py: 3,
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar 
            sx={{ 
              bgcolor: alpha(GOOGLE_COLORS.blue, 0.1),
              color: GOOGLE_COLORS.blue,
              width: 64,
              height: 64,
              borderRadius: '16px',
              fontSize: '28px',
              fontWeight: 600,
            }}
          >
            {company.name.charAt(0).toUpperCase()}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h5" fontWeight={600} sx={{ color: darkMode ? '#e8eaed' : '#202124', mb: 0.5 }}>
              {company.name}
            </Typography>
            <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
              {company.industry || 'General Business'} • {company.size} employees
            </Typography>
          </Box>
          <IconButton 
            onClick={onClose} 
            sx={{ 
              color: darkMode ? '#9aa0a6' : '#5f6368',
              '&:hover': { backgroundColor: darkMode ? '#3c4043' : '#f1f3f4' }
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Status Chips */}
          <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
            <MuiChip
              label={company.userRole}
              size="medium"
              sx={{
                px: 1,
                fontWeight: 600,
                backgroundColor: company.userRole === 'admin' 
                  ? alpha('#7c4dff', 0.1)
                  : alpha(GOOGLE_COLORS.grey, 0.1),
                color: company.userRole === 'admin' 
                  ? '#7c4dff'
                  : darkMode ? '#e8eaed' : '#202124',
                border: 'none'
              }}
            />
            <MuiChip
              label={company.plan?.toUpperCase() || 'FREE'}
              size="medium"
              sx={{
                px: 1,
                fontWeight: 600,
                backgroundColor: alpha(GOOGLE_COLORS.green, 0.1),
                color: GOOGLE_COLORS.green,
                border: 'none'
              }}
            />
            <MuiChip
              label={company.size}
              size="medium"
              sx={{
                px: 1,
                fontWeight: 600,
                backgroundColor: darkMode ? '#3c4043' : '#f1f3f4',
                color: darkMode ? '#e8eaed' : '#202124',
                border: 'none'
              }}
            />
          </Box>

          {/* Company Information */}
          <Paper 
            elevation={0}
            sx={{ 
              p: 3, 
              backgroundColor: darkMode ? '#303134' : '#f8f9fa',
              border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
              borderRadius: '16px',
            }}
          >
            <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2.5, color: darkMode ? '#e8eaed' : '#202124' }}>
              Company Information
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <EmailIcon sx={{ fontSize: 20, color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                <Typography variant="body1" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                  {company.email}
                </Typography>
              </Box>
              
              {company.phone && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <PhoneIcon sx={{ fontSize: 20, color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                  <Typography variant="body1" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                    {company.phone}
                  </Typography>
                </Box>
              )}
              
              {company.website && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <LanguageIcon sx={{ fontSize: 20, color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                  <Typography 
                    variant="body1" 
                    component="a" 
                    href={company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ 
                      color: GOOGLE_COLORS.blue,
                      textDecoration: 'none',
                      '&:hover': { textDecoration: 'underline' }
                    }}
                  >
                    {company.website}
                  </Typography>
                </Box>
              )}
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <LocationIcon sx={{ fontSize: 20, color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                <Typography variant="body1" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                  {company.address?.street ? `${company.address.street}, ` : ''}
                  {company.address?.city || 'No city'}
                  {company.address?.state ? `, ${company.address.state}` : ''}
                  {company.address?.country ? `, ${company.address.country}` : ''}
                  {company.address?.zipCode ? ` - ${company.address.zipCode}` : ''}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <GroupIcon sx={{ fontSize: 20, color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                <Typography variant="body1" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                  {company.memberCount || 1} / {company.maxMembers || 10} team members
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <AccountBalanceIcon sx={{ fontSize: 20, color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                <Typography variant="body1" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                  Created on {new Date(company.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Box>
      </DialogContent>

      <DialogActions sx={{ 
        p: 3, 
        gap: 2,
        borderTop: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
        backgroundColor: darkMode ? '#303134' : '#f8f9fa',
      }}>
        <Button
          variant="outlined"
          startIcon={<PeopleIcon />}
          onClick={() => {
            onClose();
            router.push(`/companies/${company._id}/members`);
          }}
          sx={{ 
            borderRadius: '24px',
            borderColor: darkMode ? '#3c4043' : '#dadce0',
            color: darkMode ? '#e8eaed' : '#202124',
            px: 3,
            '&:hover': {
              borderColor: GOOGLE_COLORS.blue,
              backgroundColor: alpha(GOOGLE_COLORS.blue, 0.05),
            }
          }}
        >
          Manage Team
        </Button>
        <Button
          variant="contained"
          onClick={onClose}
          sx={{ 
            borderRadius: '24px',
            backgroundColor: GOOGLE_COLORS.blue,
            '&:hover': { backgroundColor: '#1a5cb0' },
            px: 4,
            boxShadow: 'none'
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};