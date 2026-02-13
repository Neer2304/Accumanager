'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  CircularProgress,
  useMediaQuery,
  useTheme,
  alpha,
  Breadcrumbs,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Chip as MuiChip,
  Paper,
  Divider,
  Tooltip,
  Menu,
  Alert,
  Button as MuiButton
} from "@mui/material";
import {
  Business as BusinessIcon,
  Add as AddIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  MoreVert as MoreIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  People as PeopleIcon,
  Edit as EditIcon,
  Home as HomeIcon,
  LocationOn as LocationIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Language as LanguageIcon,
  Group as GroupIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Close as CloseIcon,
  ArrowBack as ArrowBackIcon
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCompany } from '@/lib/companyContext';
import { companyService } from '@/services/companyService';

// Google Material Design 3 Colors
const GOOGLE_COLORS = {
  blue: '#1a73e8',
  red: '#d93025',
  green: '#1e8e3e',
  yellow: '#f9ab00',
  grey: '#5f6368',
  darkGrey: '#3c4043',
  lightGrey: '#f1f3f4'
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

export default function CompaniesPage() {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const router = useRouter();
  
  const { companies, loading, refreshCompanies, canCreateMore, limits } = useCompany();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [planFilter, setPlanFilter] = useState('all');
  const [error, setError] = useState<string | null>(null);

  // Filter companies based on search and plan
  useEffect(() => {
    let filtered = [...companies];
    
    if (searchQuery) {
      filtered = filtered.filter(company =>
        company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        company.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        company.industry?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (planFilter !== 'all') {
      filtered = filtered.filter(company => company.plan === planFilter);
    }
    
    setFilteredCompanies(filtered);
  }, [companies, searchQuery, planFilter]);

  const handleDelete = async (companyId: string) => {
    try {
      setDeleting(companyId);
      setError(null);
      const res = await companyService.deleteCompany(companyId);
      if (res.success) {
        await refreshCompanies();
        setDeleteDialogOpen(false);
        setSelectedCompany(null);
      }
    } catch (error: any) {
      console.error('Delete failed:', error);
      setError(error.message || 'Failed to delete company');
    } finally {
      setDeleting(null);
    }
  };

  const handlePlanFilterChange = (event: SelectChangeEvent) => {
    setPlanFilter(event.target.value);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, company: Company) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedCompany(company);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '60vh',
        gap: 3
      }}>
        <CircularProgress size={48} thickness={4} sx={{ color: GOOGLE_COLORS.blue }} />
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h6" fontWeight="500" gutterBottom sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
            Loading Companies
          </Typography>
          <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
            Please wait while we fetch your organizations...
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      backgroundColor: darkMode ? '#202124' : '#ffffff',
      color: darkMode ? '#e8eaed' : '#202124',
      minHeight: '100vh',
    }}>
      {/* Header with Breadcrumbs */}
      <Box sx={{ 
        p: { xs: 2, sm: 3 },
        borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
        background: darkMode 
          ? 'linear-gradient(135deg, #0d3064 0%, #202124 100%)'
          : 'linear-gradient(135deg, #e8f0fe 0%, #ffffff 100%)',
      }}>
        <Breadcrumbs sx={{ 
          mb: { xs: 1, sm: 2 }, 
          fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.85rem' },
          color: darkMode ? '#9aa0a6' : '#5f6368',
          '& a': { color: darkMode ? '#9aa0a6' : '#5f6368' }
        }}>
          <Link 
            href="/dashboard" 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              textDecoration: 'none', 
              color: 'inherit',
            }}
          >
            <HomeIcon sx={{ mr: 0.5, fontSize: { xs: '14px', sm: '16px', md: '18px' } }} />
            Dashboard
          </Link>
          <Typography color={darkMode ? '#e8eaed' : '#202124'} fontWeight={400}>
            Companies
          </Typography>
        </Breadcrumbs>

        <Box sx={{ 
          textAlign: 'center', 
          mb: { xs: 2, sm: 3, md: 4 },
          px: { xs: 1, sm: 2, md: 3 },
        }}>
          <Typography 
            variant="h4" 
            fontWeight={500} 
            gutterBottom
            sx={{ 
              fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
              letterSpacing: '-0.02em',
              lineHeight: 1.2,
              color: darkMode ? '#e8eaed' : '#202124',
            }}
          >
            Companies
          </Typography>
          
          <Typography 
            variant="body2" 
            sx={{ 
              color: darkMode ? '#9aa0a6' : '#5f6368', 
              fontWeight: 300,
              fontSize: { xs: '0.85rem', sm: '1rem', md: '1.125rem' },
              lineHeight: 1.5,
              maxWidth: 600,
              mx: 'auto',
            }}
          >
            Manage your organizations and team access
          </Typography>
        </Box>

        {/* Stats Cards - Google Material Design 3 - Using Box instead of Grid */}
        <Box sx={{ 
          display: 'flex',
          flexWrap: 'wrap',
          gap: { xs: 1.5, sm: 2, md: 3 },
          mt: 3,
        }}>
          {[
            { 
              label: 'Total Companies', 
              value: companies.length, 
              color: GOOGLE_COLORS.blue, 
              icon: <BusinessIcon sx={{ color: GOOGLE_COLORS.blue }} />,
              borderColor: alpha(GOOGLE_COLORS.blue, 0.2),
              bgColor: alpha(GOOGLE_COLORS.blue, 0.1)
            },
            { 
              label: 'Companies Used', 
              value: `${limits.current}/${limits.max}`, 
              color: GOOGLE_COLORS.green, 
              icon: <CheckCircleIcon sx={{ color: GOOGLE_COLORS.green }} />,
              borderColor: alpha(GOOGLE_COLORS.green, 0.2),
              bgColor: alpha(GOOGLE_COLORS.green, 0.1)
            },
            { 
              label: 'Available Slots', 
              value: limits.remaining, 
              color: GOOGLE_COLORS.yellow, 
              icon: <GroupIcon sx={{ color: GOOGLE_COLORS.yellow }} />,
              borderColor: alpha(GOOGLE_COLORS.yellow, 0.2),
              bgColor: alpha(GOOGLE_COLORS.yellow, 0.1)
            },
            { 
              label: 'Total Members', 
              value: companies.reduce((acc, c) => acc + (c.memberCount || 1), 0), 
              color: darkMode ? '#e8eaed' : '#202124', 
              icon: <PeopleIcon sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }} />,
              borderColor: alpha(GOOGLE_COLORS.grey, 0.2),
              bgColor: darkMode ? '#3c4043' : '#f1f3f4'
            }
          ].map((stat, index) => (
            <Paper 
              key={index}
              elevation={0}
              sx={{ 
                flex: '1 1 calc(25% - 18px)', 
                minWidth: { xs: 'calc(50% - 12px)', sm: 'calc(25% - 18px)' },
                p: { xs: 1.5, sm: 2 }, 
                borderRadius: '16px', 
                backgroundColor: darkMode ? '#303134' : '#ffffff',
                border: `1px solid ${stat.borderColor}`,
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                    {stat.label}
                  </Typography>
                  <Typography variant="h4" sx={{ color: stat.color, fontWeight: 600 }}>
                    {stat.value}
                  </Typography>
                </Box>
                <Box sx={{ p: 1, borderRadius: '10px', backgroundColor: stat.bgColor }}>
                  {stat.icon}
                </Box>
              </Box>
            </Paper>
          ))}
        </Box>
      </Box>

      {/* Main Content */}
      <Box sx={{ p: { xs: 2, sm: 3 } }}>
        {/* Error Alert */}
        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 3, 
              borderRadius: '8px',
              backgroundColor: darkMode ? alpha(GOOGLE_COLORS.red, 0.1) : alpha(GOOGLE_COLORS.red, 0.05),
              color: darkMode ? '#f28b82' : GOOGLE_COLORS.red,
              '& .MuiAlert-icon': { color: GOOGLE_COLORS.red }
            }}
            action={
              <IconButton size="small" onClick={() => setError(null)}>
                <CloseIcon fontSize="small" />
              </IconButton>
            }
          >
            {error}
          </Alert>
        )}

        {/* Limit Warning */}
        {!canCreateMore && (
          <Alert 
            severity="warning" 
            sx={{ 
              mb: 3, 
              borderRadius: '8px',
              backgroundColor: darkMode ? alpha(GOOGLE_COLORS.yellow, 0.1) : alpha(GOOGLE_COLORS.yellow, 0.05),
              color: darkMode ? '#fdd663' : GOOGLE_COLORS.yellow,
              '& .MuiAlert-icon': { color: GOOGLE_COLORS.yellow }
            }}
            icon={<WarningIcon />}
          >
            You've reached the maximum limit of {limits.max} companies. Delete an existing company to create a new one.
          </Alert>
        )}

        {/* Filters and Actions */}
        <Paper 
          elevation={0}
          sx={{ 
            mb: { xs: 2, sm: 3, md: 4 },
            p: 2,
            backgroundColor: darkMode ? '#202124' : '#ffffff',
            border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
            borderRadius: '16px',
          }}
        >
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'stretch', sm: 'center' },
            gap: 2
          }}>
            {/* Search */}
            <Box sx={{ flex: 1, display: 'flex', gap: 2, alignItems: 'center' }}>
              <TextField
                placeholder="Search companies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                size="small"
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                    </InputAdornment>
                  ),
                  endAdornment: searchQuery && (
                    <InputAdornment position="end">
                      <IconButton size="small" onClick={() => setSearchQuery("")}>
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                    backgroundColor: darkMode ? '#303134' : '#f8f9fa',
                    '&:hover': {
                      backgroundColor: darkMode ? '#3c4043' : '#f1f3f4',
                    },
                  },
                }}
              />
              <IconButton 
                onClick={refreshCompanies}
                sx={{ 
                  bgcolor: darkMode ? '#303134' : '#f8f9fa',
                  '&:hover': { bgcolor: darkMode ? '#3c4043' : '#f1f3f4' },
                  borderRadius: '8px',
                }}
              >
                <RefreshIcon />
              </IconButton>
            </Box>

            {/* Filters */}
            <Box sx={{ 
              display: 'flex', 
              gap: 1.5,
              flexWrap: 'wrap'
            }}>
              <FormControl 
                size="small" 
                sx={{ 
                  minWidth: 140,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                    backgroundColor: darkMode ? '#303134' : '#f8f9fa',
                  }
                }}
              >
                <InputLabel sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                  Plan
                </InputLabel>
                <Select
                  value={planFilter}
                  label="Plan"
                  onChange={handlePlanFilterChange}
                >
                  <MenuItem value="all">All Plans</MenuItem>
                  <MenuItem value="free">Free</MenuItem>
                  <MenuItem value="pro">Pro</MenuItem>
                  <MenuItem value="enterprise">Enterprise</MenuItem>
                </Select>
              </FormControl>

              {canCreateMore && (
                <MuiButton
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => router.push('/companies/create')}
                  sx={{ 
                    borderRadius: '24px',
                    backgroundColor: GOOGLE_COLORS.blue,
                    '&:hover': { backgroundColor: '#1a5cb0' },
                    whiteSpace: 'nowrap',
                    px: 3,
                  }}
                >
                  New Company
                </MuiButton>
              )}
            </Box>
          </Box>
        </Paper>

        {/* Companies Grid - Google Material Design 3 - Using Box instead of Grid */}
        {filteredCompanies.length === 0 ? (
          <Paper 
            elevation={0}
            sx={{ 
              textAlign: 'center', 
              py: 8,
              px: 3,
              backgroundColor: darkMode ? '#202124' : '#ffffff',
              border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
              borderRadius: '16px',
            }}
          >
            <BusinessIcon sx={{ fontSize: 60, color: darkMode ? '#9aa0a6' : '#5f6368', mb: 2 }} />
            <Typography variant="h6" gutterBottom sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
              No Companies Found
            </Typography>
            <Typography variant="body2" sx={{ mb: 3, color: darkMode ? '#9aa0a6' : '#5f6368' }}>
              {searchQuery || planFilter !== 'all'
                ? "No companies match your current filters."
                : "Create your first company to get started."}
            </Typography>
            {!searchQuery && planFilter === 'all' && canCreateMore && (
              <MuiButton
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => router.push('/companies/create')}
                sx={{ 
                  borderRadius: '24px',
                  backgroundColor: GOOGLE_COLORS.blue,
                  '&:hover': { backgroundColor: '#1a5cb0' },
                  px: 4,
                  py: 1.5,
                }}
              >
                Create Your First Company
              </MuiButton>
            )}
          </Paper>
        ) : (
          <Box sx={{ 
            display: 'flex',
            flexWrap: 'wrap',
            gap: 3,
          }}>
            {filteredCompanies.map((company) => (
              <Box 
                key={company._id}
                sx={{ 
                  width: {
                    xs: '100%',
                    sm: 'calc(50% - 12px)',
                    lg: 'calc(33.333% - 16px)'
                  }
                }}
              >
                <Paper 
                  elevation={0}
                  onClick={() => {
                    setSelectedCompany(company);
                    setDetailDialogOpen(true);
                  }}
                  sx={{ 
                    p: 3,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    backgroundColor: darkMode ? '#303134' : '#ffffff',
                    border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                    borderRadius: '16px',
                    transition: 'all 0.2s',
                    cursor: 'pointer',
                    '&:hover': {
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                      borderColor: GOOGLE_COLORS.blue,
                    },
                    position: 'relative'
                  }}
                >
                  {/* Actions Menu */}
                  {company.userRole === 'admin' && (
                    <IconButton
                      size="small"
                      onClick={(e) => handleMenuOpen(e, company)}
                      sx={{
                        position: 'absolute',
                        top: 12,
                        right: 12,
                        color: darkMode ? '#9aa0a6' : '#5f6368',
                      }}
                    >
                      <MoreIcon />
                    </IconButton>
                  )}

                  {/* Company Avatar */}
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar 
                      sx={{ 
                        width: 56, 
                        height: 56,
                        bgcolor: alpha(GOOGLE_COLORS.blue, 0.1),
                        color: GOOGLE_COLORS.blue,
                        borderRadius: '12px',
                        fontSize: '24px',
                        fontWeight: 500,
                      }}
                    >
                      {company.name.charAt(0).toUpperCase()}
                    </Avatar>
                    <Box sx={{ ml: 2, flex: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 500, color: darkMode ? '#e8eaed' : '#202124' }}>
                        {company.name}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5, flexWrap: 'wrap' }}>
                        <MuiChip
                          label={company.userRole}
                          size="small"
                          sx={{
                            height: 24,
                            fontSize: '0.75rem',
                            fontWeight: 500,
                            backgroundColor: company.userRole === 'admin' 
                              ? alpha('#7c4dff', 0.1)
                              : alpha(GOOGLE_COLORS.grey, 0.1),
                            color: company.userRole === 'admin' 
                              ? '#7c4dff'
                              : darkMode ? '#e8eaed' : '#202124',
                          }}
                        />
                        <MuiChip
                          label={company.plan?.toUpperCase() || 'FREE'}
                          size="small"
                          sx={{
                            height: 24,
                            fontSize: '0.75rem',
                            fontWeight: 500,
                            backgroundColor: alpha(GOOGLE_COLORS.green, 0.1),
                            color: GOOGLE_COLORS.green,
                          }}
                        />
                      </Box>
                    </Box>
                  </Box>

                  {/* Company Details */}
                  <Box sx={{ flex: 1, mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <EmailIcon sx={{ fontSize: 16, color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                      <Typography variant="body2" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
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
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <LocationIcon sx={{ fontSize: 16, color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                      <Typography variant="body2" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                        {company.address?.city || 'No city'} 
                        {company.address?.country && `, ${company.address.country}`}
                      </Typography>
                    </Box>
                  </Box>

                  <Divider sx={{ my: 2, borderColor: darkMode ? '#3c4043' : '#dadce0' }} />

                  {/* Member Progress */}
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                        Team Members
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500, color: darkMode ? '#e8eaed' : '#202124' }}>
                        {company.memberCount || 1}/{company.maxMembers || 10}
                      </Typography>
                    </Box>
                    <Box sx={{ 
                      width: '100%', 
                      height: 4, 
                      backgroundColor: darkMode ? '#3c4043' : '#dadce0',
                      borderRadius: 2,
                      overflow: 'hidden'
                    }}>
                      <Box sx={{ 
                        width: `${((company.memberCount || 1) / (company.maxMembers || 10)) * 100}%`,
                        height: '100%',
                        backgroundColor: (company.memberCount || 1) >= (company.maxMembers || 10) 
                          ? GOOGLE_COLORS.red 
                          : GOOGLE_COLORS.blue,
                        borderRadius: 2,
                        transition: 'width 0.3s'
                      }} />
                    </Box>
                  </Box>

                  {/* Quick Actions */}
                  <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                    <MuiButton
                      variant="outlined"
                      size="small"
                      fullWidth
                      startIcon={<PeopleIcon />}
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/companies/${company._id}/members`);
                      }}
                      sx={{ 
                        borderRadius: '20px',
                        borderColor: darkMode ? '#3c4043' : '#dadce0',
                        color: darkMode ? '#e8eaed' : '#202124',
                        '&:hover': {
                          borderColor: GOOGLE_COLORS.blue,
                          backgroundColor: alpha(GOOGLE_COLORS.blue, 0.05),
                        }
                      }}
                    >
                      Team
                    </MuiButton>
                    <MuiButton
                      variant="outlined"
                      size="small"
                      fullWidth
                      startIcon={<ViewIcon />}
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/companies/${company._id}`);
                      }}
                      sx={{ 
                        borderRadius: '20px',
                        borderColor: darkMode ? '#3c4043' : '#dadce0',
                        color: darkMode ? '#e8eaed' : '#202124',
                        '&:hover': {
                          borderColor: GOOGLE_COLORS.blue,
                          backgroundColor: alpha(GOOGLE_COLORS.blue, 0.05),
                        }
                      }}
                    >
                      View
                    </MuiButton>
                  </Box>
                </Paper>
              </Box>
            ))}
          </Box>
        )}
      </Box>

      {/* Company Detail Dialog */}
      <Dialog
        open={detailDialogOpen}
        onClose={() => setDetailDialogOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{ 
          sx: { 
            borderRadius: '16px',
            maxHeight: '90vh',
            backgroundColor: darkMode ? '#202124' : '#ffffff',
            border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
          }
        }}
      >
        {selectedCompany && (
          <>
            <DialogTitle sx={{ 
              borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
              backgroundColor: darkMode ? '#303134' : '#f8f9fa',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Avatar 
                  sx={{ 
                    bgcolor: alpha(GOOGLE_COLORS.blue, 0.1),
                    color: GOOGLE_COLORS.blue,
                    width: 48,
                    height: 48,
                    borderRadius: '12px',
                  }}
                >
                  {selectedCompany.name.charAt(0).toUpperCase()}
                </Avatar>
                <Box>
                  <Typography variant="h5" fontWeight={500} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                    {selectedCompany.name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                    {selectedCompany.industry || 'General Business'} • {selectedCompany.size} employees
                  </Typography>
                </Box>
              </Box>
              <IconButton onClick={() => setDetailDialogOpen(false)} size="small" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                <CloseIcon />
              </IconButton>
            </DialogTitle>

            <DialogContent sx={{ p: 3, overflowY: 'auto' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {/* Status Chips */}
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <MuiChip
                    label={selectedCompany.userRole}
                    size="small"
                    sx={{
                      backgroundColor: selectedCompany.userRole === 'admin' 
                        ? alpha('#7c4dff', 0.1)
                        : alpha(GOOGLE_COLORS.grey, 0.1),
                      color: selectedCompany.userRole === 'admin' 
                        ? '#7c4dff'
                        : darkMode ? '#e8eaed' : '#202124',
                    }}
                  />
                  <MuiChip
                    label={selectedCompany.plan?.toUpperCase() || 'FREE'}
                    size="small"
                    sx={{
                      backgroundColor: alpha(GOOGLE_COLORS.green, 0.1),
                      color: GOOGLE_COLORS.green,
                    }}
                  />
                  <MuiChip
                    label={selectedCompany.size}
                    size="small"
                    sx={{
                      backgroundColor: darkMode ? '#3c4043' : '#f1f3f4',
                      color: darkMode ? '#e8eaed' : '#202124',
                    }}
                  />
                </Box>

                {/* Company Details */}
                <Paper 
                  elevation={0}
                  sx={{ 
                    p: 2, 
                    backgroundColor: darkMode ? '#303134' : '#f8f9fa',
                    border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                    borderRadius: '12px',
                  }}
                >
                  <Typography variant="subtitle2" fontWeight={500} sx={{ mb: 2, color: darkMode ? '#e8eaed' : '#202124' }}>
                    Company Information
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <EmailIcon sx={{ fontSize: 18, color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                      <Typography variant="body2" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                        {selectedCompany.email}
                      </Typography>
                    </Box>
                    
                    {selectedCompany.phone && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PhoneIcon sx={{ fontSize: 18, color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                        <Typography variant="body2" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                          {selectedCompany.phone}
                        </Typography>
                      </Box>
                    )}
                    
                    {selectedCompany.website && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LanguageIcon sx={{ fontSize: 18, color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                        <Typography 
                          variant="body2" 
                          component="a" 
                          href={selectedCompany.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{ 
                            color: GOOGLE_COLORS.blue,
                            textDecoration: 'none',
                            '&:hover': { textDecoration: 'underline' }
                          }}
                        >
                          {selectedCompany.website}
                        </Typography>
                      </Box>
                    )}
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LocationIcon sx={{ fontSize: 18, color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                      <Typography variant="body2" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                        {selectedCompany.address?.street ? `${selectedCompany.address.street}, ` : ''}
                        {selectedCompany.address?.city || 'No city'}
                        {selectedCompany.address?.state ? `, ${selectedCompany.address.state}` : ''}
                        {selectedCompany.address?.country ? `, ${selectedCompany.address.country}` : ''}
                        {selectedCompany.address?.zipCode ? ` - ${selectedCompany.address.zipCode}` : ''}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <GroupIcon sx={{ fontSize: 18, color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                      <Typography variant="body2" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                        {selectedCompany.memberCount || 1} / {selectedCompany.maxMembers || 10} team members
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <BusinessIcon sx={{ fontSize: 18, color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                      <Typography variant="body2" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                        Created on {new Date(selectedCompany.createdAt).toLocaleDateString('en-US', {
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
            }}>
              <MuiButton
                variant="outlined"
                startIcon={<PeopleIcon />}
                onClick={() => {
                  setDetailDialogOpen(false);
                  router.push(`/companies/${selectedCompany._id}/members`);
                }}
                sx={{ 
                  borderRadius: '20px',
                  borderColor: darkMode ? '#3c4043' : '#dadce0',
                  color: darkMode ? '#e8eaed' : '#202124',
                }}
              >
                Manage Team
              </MuiButton>
              <MuiButton
                variant="contained"
                onClick={() => setDetailDialogOpen(false)}
                sx={{ 
                  borderRadius: '20px',
                  backgroundColor: GOOGLE_COLORS.blue,
                  '&:hover': { backgroundColor: '#1a5cb0' }
                }}
              >
                Close
              </MuiButton>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        PaperProps={{ 
          sx: { 
            borderRadius: '16px',
            maxWidth: 400,
            backgroundColor: darkMode ? '#202124' : '#ffffff',
            border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
          }
        }}
      >
        <DialogTitle sx={{ 
          borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
          backgroundColor: darkMode ? '#303134' : '#f8f9fa',
        }}>
          <Typography variant="h6" fontWeight={500} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
            Delete Company
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Typography sx={{ color: darkMode ? '#e8eaed' : '#202124', mb: 1 }}>
            Are you sure you want to delete <strong>{selectedCompany?.name}</strong>?
          </Typography>
          <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
            This action cannot be undone. All team members will be removed and you'll lose access to this company's data.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ 
          p: 3, 
          gap: 1,
          borderTop: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
        }}>
          <MuiButton
            onClick={() => setDeleteDialogOpen(false)}
            sx={{ 
              borderRadius: '20px',
              color: darkMode ? '#e8eaed' : '#202124',
            }}
          >
            Cancel
          </MuiButton>
          <MuiButton
            onClick={() => handleDelete(selectedCompany?._id || '')}
            disabled={deleting === selectedCompany?._id}
            variant="contained"
            sx={{ 
              borderRadius: '20px',
              backgroundColor: GOOGLE_COLORS.red,
              '&:hover': { backgroundColor: '#b3141c' }
            }}
          >
            {deleting === selectedCompany?._id ? 'Deleting...' : 'Delete'}
          </MuiButton>
        </DialogActions>
      </Dialog>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            borderRadius: '8px',
            backgroundColor: darkMode ? '#202124' : '#ffffff',
            border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            minWidth: 180,
          }
        }}
      >
        <MenuItem 
          onClick={() => {
            handleMenuClose();
            if (selectedCompany) {
              setDetailDialogOpen(true);
            }
          }}
          sx={{ gap: 1, py: 1.5, color: darkMode ? '#e8eaed' : '#202124' }}
        >
          <ViewIcon fontSize="small" />
          View Details
        </MenuItem>
        <MenuItem 
          onClick={() => {
            handleMenuClose();
            if (selectedCompany) {
              router.push(`/companies/${selectedCompany._id}/members`);
            }
          }}
          sx={{ gap: 1, py: 1.5, color: darkMode ? '#e8eaed' : '#202124' }}
        >
          <PeopleIcon fontSize="small" />
          Manage Team
        </MenuItem>
        <Divider sx={{ borderColor: darkMode ? '#3c4043' : '#dadce0' }} />
        <MenuItem 
          onClick={() => {
            handleMenuClose();
            setDeleteDialogOpen(true);
          }}
          sx={{ gap: 1, py: 1.5, color: GOOGLE_COLORS.red }}
        >
          <DeleteIcon fontSize="small" />
          Delete Company
        </MenuItem>
      </Menu>
    </Box>
  );
}