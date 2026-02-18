// components/googlecompanies/components/CompanyCard.tsx
import React from 'react';
import {
  Paper,
  Box,
  Typography,
  Avatar,
  Chip as MuiChip,
  Divider,
  Button,
  IconButton,
  alpha,
  useTheme
} from '@mui/material';
import {
  MoreVert as MoreIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Business as BusinessIcon,
  LocationOn as LocationIcon,
  People as PeopleIcon,
  Visibility as ViewIcon
} from '@mui/icons-material';

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
  address?: {
    city?: string;
    country?: string;
  };
}

interface CompanyCardProps {
  company: Company;
  darkMode: boolean;
  onMenuOpen: (event: React.MouseEvent<HTMLElement>, company: Company) => void;
  onCardClick: (company: Company) => void;
  onTeamClick: (companyId: string, e: React.MouseEvent) => void;
  onViewClick: (companyId: string, e: React.MouseEvent) => void;
}

const GOOGLE_COLORS = {
  blue: '#1a73e8',
  red: '#d93025',
  green: '#1e8e3e',
  purple: '#7c4dff',
  grey: '#5f6368'
};

export const CompanyCard: React.FC<CompanyCardProps> = ({
  company,
  darkMode,
  onMenuOpen,
  onCardClick,
  onTeamClick,
  onViewClick
}) => {
  return (
    <Paper 
      elevation={0}
      onClick={() => onCardClick(company)}
      sx={{ 
        p: 3,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: darkMode ? '#303134' : '#ffffff',
        border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
        borderRadius: '20px',
        transition: 'all 0.2s',
        cursor: 'pointer',
        position: 'relative',
        height: '100%',
        '&:hover': {
          boxShadow: darkMode 
            ? '0 8px 16px rgba(0,0,0,0.3)' 
            : '0 8px 20px rgba(0,0,0,0.08)',
          borderColor: GOOGLE_COLORS.blue,
          transform: 'translateY(-2px)'
        },
      }}
    >
      {/* Actions Menu */}
      {company.userRole === 'admin' && (
        <IconButton
          size="small"
          onClick={(e) => onMenuOpen(e, company)}
          sx={{
            position: 'absolute',
            top: 12,
            right: 12,
            color: darkMode ? '#9aa0a6' : '#5f6368',
            '&:hover': {
              backgroundColor: darkMode ? '#3c4043' : '#f1f3f4'
            }
          }}
        >
          <MoreIcon />
        </IconButton>
      )}

      {/* Company Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2.5 }}>
        <Avatar 
          sx={{ 
            width: 56, 
            height: 56,
            bgcolor: alpha(GOOGLE_COLORS.blue, 0.1),
            color: GOOGLE_COLORS.blue,
            borderRadius: '14px',
            fontSize: '24px',
            fontWeight: 600,
          }}
        >
          {company.name.charAt(0).toUpperCase()}
        </Avatar>
        <Box sx={{ ml: 2, flex: 1, minWidth: 0 }}>
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 600, 
              color: darkMode ? '#e8eaed' : '#202124',
              mb: 0.5,
              fontSize: '1.1rem',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          >
            {company.name}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
            <MuiChip
              label={company.userRole}
              size="small"
              sx={{
                height: 22,
                fontSize: '0.7rem',
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
              size="small"
              sx={{
                height: 22,
                fontSize: '0.7rem',
                fontWeight: 600,
                backgroundColor: alpha(GOOGLE_COLORS.green, 0.1),
                color: GOOGLE_COLORS.green,
                border: 'none'
              }}
            />
          </Box>
        </Box>
      </Box>

      {/* Company Details */}
      <Box sx={{ flex: 1, mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <EmailIcon sx={{ fontSize: 16, color: darkMode ? '#9aa0a6' : '#5f6368' }} />
          <Typography variant="body2" sx={{ 
            color: darkMode ? '#e8eaed' : '#202124',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>
            {company.email}
          </Typography>
        </Box>
        
        {company.phone && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <PhoneIcon sx={{ fontSize: 16, color: darkMode ? '#9aa0a6' : '#5f6368' }} />
            <Typography variant="body2" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
              {company.phone}
            </Typography>
          </Box>
        )}
        
        {company.industry && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <BusinessIcon sx={{ fontSize: 16, color: darkMode ? '#9aa0a6' : '#5f6368' }} />
            <Typography variant="body2" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
              {company.industry}
            </Typography>
          </Box>
        )}
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <LocationIcon sx={{ fontSize: 16, color: darkMode ? '#9aa0a6' : '#5f6368' }} />
          <Typography variant="body2" sx={{ 
            color: darkMode ? '#e8eaed' : '#202124',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>
            {company.address?.city || 'No city'} 
            {company.address?.country && `, ${company.address.country}`}
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ my: 2, borderColor: darkMode ? '#3c4043' : '#dadce0' }} />

      {/* Member Progress */}
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', fontWeight: 500 }}>
            Team Members
          </Typography>
          <Typography variant="caption" sx={{ fontWeight: 600, color: darkMode ? '#e8eaed' : '#202124' }}>
            {company.memberCount || 1}/{company.maxMembers || 10}
          </Typography>
        </Box>
        <Box sx={{ 
          width: '100%', 
          height: 6, 
          backgroundColor: darkMode ? '#3c4043' : '#dadce0',
          borderRadius: 3,
          overflow: 'hidden'
        }}>
          <Box sx={{ 
            width: `${((company.memberCount || 1) / (company.maxMembers || 10)) * 100}%`,
            height: '100%',
            backgroundColor: (company.memberCount || 1) >= (company.maxMembers || 10) 
              ? GOOGLE_COLORS.red 
              : GOOGLE_COLORS.blue,
            borderRadius: 3,
            transition: 'width 0.3s ease'
          }} />
        </Box>
      </Box>

      {/* Quick Actions */}
      <Box sx={{ display: 'flex', gap: 1, mt: 2.5 }}>
        <Button
          variant="outlined"
          size="small"
          fullWidth
          startIcon={<PeopleIcon />}
          onClick={(e) => onTeamClick(company._id, e)}
          sx={{ 
            borderRadius: '20px',
            borderColor: darkMode ? '#3c4043' : '#dadce0',
            color: darkMode ? '#e8eaed' : '#202124',
            fontSize: '0.75rem',
            py: 0.75,
            '&:hover': {
              borderColor: GOOGLE_COLORS.blue,
              backgroundColor: alpha(GOOGLE_COLORS.blue, 0.05),
            }
          }}
        >
          Team
        </Button>
        <Button
          variant="outlined"
          size="small"
          fullWidth
          startIcon={<ViewIcon />}
          onClick={(e) => onViewClick(company._id, e)}
          sx={{ 
            borderRadius: '20px',
            borderColor: darkMode ? '#3c4043' : '#dadce0',
            color: darkMode ? '#e8eaed' : '#202124',
            fontSize: '0.75rem',
            py: 0.75,
            '&:hover': {
              borderColor: GOOGLE_COLORS.blue,
              backgroundColor: alpha(GOOGLE_COLORS.blue, 0.05),
            }
          }}
        >
          View
        </Button>
      </Box>
    </Paper>
  );
};