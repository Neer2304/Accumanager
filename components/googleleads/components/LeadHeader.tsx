import React from 'react';
import {
  Box,
  Typography,
  Breadcrumbs,
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
  MenuItem,
  InputAdornment,
  useTheme,
  alpha
} from '@mui/material';
import { Home as HomeIcon, Business as BusinessIcon } from '@mui/icons-material';
import Link from 'next/link';
import { Company } from '../types';
import { GOOGLE_COLORS } from '../constants';

interface LeadHeaderProps {
  companies: Company[];
  selectedCompanyId: string;
  onCompanyChange: (event: SelectChangeEvent) => void;
  darkMode: boolean;
}

export function LeadHeader({ companies, selectedCompanyId, onCompanyChange, darkMode }: LeadHeaderProps) {
  return (
    <Box sx={{
      px: { xs: 2, sm: 3, md: 4 },
      py: 3,
      borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
      background: darkMode
        ? 'linear-gradient(135deg, #0d3064 0%, #202124 100%)'
        : 'linear-gradient(135deg, #e8f0fe 0%, #ffffff 100%)',
    }}>
      <Breadcrumbs sx={{
        mb: 2,
        color: darkMode ? '#9aa0a6' : '#5f6368',
        '& a': {
          color: 'inherit',
          textDecoration: 'none',
          display: 'flex',
          alignItems: 'center',
          '&:hover': { textDecoration: 'underline' }
        }
      }}>
        <Link href="/dashboard">
          <HomeIcon sx={{ mr: 0.5, fontSize: 18 }} />
          Dashboard
        </Link>
        <Typography color={darkMode ? '#e8eaed' : '#202124'}>
          Leads
        </Typography>
      </Breadcrumbs>

      <Box sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: { sm: 'center' },
        justifyContent: 'space-between',
        gap: 2
      }}>
        <Box>
          <Typography variant="h4" sx={{
            fontWeight: 400,
            fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
            color: darkMode ? '#e8eaed' : '#202124',
            letterSpacing: '-0.5px',
            mb: 1
          }}>
            Lead Management
          </Typography>
          <Typography sx={{
            color: darkMode ? '#9aa0a6' : '#5f6368',
            fontSize: '0.875rem'
          }}>
            Track, qualify, and convert your sales leads into customers
          </Typography>
        </Box>

        <FormControl 
          size="small" 
          sx={{ 
            minWidth: 250,
            '& .MuiOutlinedInput-root': {
              borderRadius: '24px',
              bgcolor: darkMode ? '#303134' : '#fff',
            }
          }}
        >
          <InputLabel sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
            Select Company
          </InputLabel>
          <Select
            value={selectedCompanyId}
            label="Select Company"
            onChange={onCompanyChange}
            startAdornment={
              <InputAdornment position="start">
                <BusinessIcon sx={{ fontSize: 18, color: darkMode ? '#9aa0a6' : '#5f6368' }} />
              </InputAdornment>
            }
          >
            {companies.map(company => (
              <MenuItem key={company._id} value={company._id}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <BusinessIcon sx={{ fontSize: 18 }} />
                  <Box>
                    <Typography variant="body2">{company.name}</Typography>
                    <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                      {company.industry || 'No industry'} • {company.userRole}
                    </Typography>
                  </Box>
                </Box>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    </Box>
  );
}