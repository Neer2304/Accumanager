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
  Button as MuiButton,
  Container
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
  ArrowBack as ArrowBackIcon,
  Storage as StorageIcon,
  AccountBalance as AccountBalanceIcon
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCompany } from '@/lib/companyContext';
import { companyService } from '@/services/companyService';
import { MainLayout } from '@/components/Layout/MainLayout';

// Google Material Design 3 Colors
const GOOGLE_COLORS = {
  blue: '#1a73e8',
  red: '#d93025',
  green: '#1e8e3e',
  yellow: '#f9ab00',
  grey: '#5f6368',
  darkGrey: '#3c4043',
  lightGrey: '#f1f3f4',
  purple: '#7c4dff',
  teal: '#24c1e0',
  orange: '#fa903e'
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

function CompaniesPageContent() {
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
        <CircularProgress size={56} thickness={4} sx={{ color: GOOGLE_COLORS.blue }} />
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h5" fontWeight="500" gutterBottom sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
            Loading Companies
          </Typography>
          <Typography variant="body1" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
            Please wait while we fetch your organizations...
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      backgroundColor: darkMode ? '#202124' : '#f8f9fa',
      color: darkMode ? '#e8eaed' : '#202124',
      minHeight: '100vh',
      py: { xs: 2, sm: 3, md: 4 }
    }}>
      <Container maxWidth="xl">
        {/* Breadcrumbs */}
        <Breadcrumbs sx={{ 
          mb: 3, 
          color: darkMode ? '#9aa0a6' : '#5f6368',
          '& a': { 
            color: darkMode ? '#9aa0a6' : '#5f6368',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            '&:hover': {
              color: darkMode ? '#e8eaed' : '#202124',
              textDecoration: 'underline'
            }
          }
        }}>
          <Link href="/dashboard">
            <HomeIcon sx={{ mr: 0.5, fontSize: 18 }} />
            Dashboard
          </Link>
          <Typography color={darkMode ? '#e8eaed' : '#202124'} fontWeight={500}>
            Companies
          </Typography>
        </Breadcrumbs>

        {/* Header Section */}
        <Paper 
          elevation={0}
          sx={{ 
            p: { xs: 3, sm: 4 },
            mb: 4,
            borderRadius: '24px',
            backgroundColor: darkMode ? '#303134' : '#ffffff',
            border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <Box sx={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '300px',
            height: '100%',
            background: darkMode
              ? `linear-gradient(90deg, transparent, ${alpha(GOOGLE_COLORS.blue, 0.02)} 50%, ${alpha(GOOGLE_COLORS.blue, 0.04)})`
              : `linear-gradient(90deg, transparent, ${alpha(GOOGLE_COLORS.blue, 0.02)} 50%, ${alpha(GOOGLE_COLORS.blue, 0.04)})`,
            pointerEvents: 'none'
          }} />
          
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
            <Box>
              <Typography 
                variant="h4" 
                component="h1"
                fontWeight={500} 
                sx={{ 
                  fontSize: { xs: '1.75rem', sm: '2rem', md: '2.25rem' },
                  letterSpacing: '-0.01em',
                  color: darkMode ? '#e8eaed' : '#202124',
                  mb: 1
                }}
              >
                Companies
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  color: darkMode ? '#9aa0a6' : '#5f6368',
                  maxWidth: 600
                }}
              >
                Manage your organizations, team access, and company settings from one place
              </Typography>
            </Box>
            
            {canCreateMore && (
              <MuiButton
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => router.push('/companies/create')}
                sx={{ 
                  borderRadius: '28px',
                  backgroundColor: GOOGLE_COLORS.blue,
                  '&:hover': { backgroundColor: '#1a5cb0' },
                  px: 4,
                  py: 1.5,
                  fontSize: '0.9375rem',
                  fontWeight: 500,
                  boxShadow: 'none',
                  '&:hover': {
                    backgroundColor: '#1a5cb0',
                    boxShadow: '0 2px 6px rgba(26,115,232,0.3)'
                  }
                }}
              >
                New Company
              </MuiButton>
            )}
          </Box>
        </Paper>

        {/* Stats Cards */}
        <Box sx={{ 
          display: 'flex',
          flexWrap: 'wrap',
          gap: 3,
          mb: 4
        }}>
          {[
            { 
              label: 'Total Companies', 
              value: companies.length, 
              color: GOOGLE_COLORS.blue, 
              icon: <BusinessIcon sx={{ fontSize: 28 }} />,
              borderColor: alpha(GOOGLE_COLORS.blue, 0.2),
              bgColor: alpha(GOOGLE_COLORS.blue, 0.1)
            },
            { 
              label: 'Companies Used', 
              // value: `${limits.current}/${limits.max}`, 
              color: GOOGLE_COLORS.green, 
              icon: <CheckCircleIcon sx={{ fontSize: 28 }} />,
              borderColor: alpha(GOOGLE_COLORS.green, 0.2),
              bgColor: alpha(GOOGLE_COLORS.green, 0.1)
            },
            { 
              label: 'Available Slots', 
              value: limits.remaining, 
              color: GOOGLE_COLORS.yellow, 
              icon: <StorageIcon sx={{ fontSize: 28 }} />,
              borderColor: alpha(GOOGLE_COLORS.yellow, 0.2),
              bgColor: alpha(GOOGLE_COLORS.yellow, 0.1)
            },
            { 
              label: 'Total Members', 
              value: companies.reduce((acc, c) => acc + (c.memberCount || 1), 0), 
              color: darkMode ? '#e8eaed' : '#202124', 
              icon: <PeopleIcon sx={{ fontSize: 28 }} />,
              borderColor: alpha(GOOGLE_COLORS.grey, 0.2),
              bgColor: darkMode ? '#3c4043' : '#f1f3f4'
            }
          ].map((stat, index) => (
            <Paper 
              key={index}
              elevation={0}
              sx={{ 
                flex: '1 1 calc(25% - 27px)', 
                minWidth: { xs: '100%', sm: 'calc(50% - 18px)', md: 'calc(25% - 27px)' },
                p: 2.5, 
                borderRadius: '20px', 
                backgroundColor: darkMode ? '#303134' : '#ffffff',
                border: `1px solid ${stat.borderColor}`,
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: darkMode 
                    ? '0 8px 16px rgba(0,0,0,0.3)' 
                    : '0 8px 16px rgba(0,0,0,0.08)',
                  borderColor: stat.color
                }
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', fontWeight: 500, mb: 0.5 }}>
                    {stat.label}
                  </Typography>
                  <Typography variant="h4" sx={{ color: stat.color, fontWeight: 600, lineHeight: 1.2 }}>
                    {stat.value}
                  </Typography>
                </Box>
                <Box sx={{ 
                  p: 1.5, 
                  borderRadius: '14px', 
                  backgroundColor: stat.bgColor,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {stat.icon}
                </Box>
              </Box>
            </Paper>
          ))}
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 4, 
              borderRadius: '12px',
              backgroundColor: darkMode ? alpha(GOOGLE_COLORS.red, 0.1) : alpha(GOOGLE_COLORS.red, 0.05),
              color: darkMode ? '#f28b82' : GOOGLE_COLORS.red,
              '& .MuiAlert-icon': { color: GOOGLE_COLORS.red },
              border: `1px solid ${alpha(GOOGLE_COLORS.red, 0.2)}`
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
              mb: 4, 
              borderRadius: '12px',
              backgroundColor: darkMode ? alpha(GOOGLE_COLORS.yellow, 0.1) : alpha(GOOGLE_COLORS.yellow, 0.05),
              color: darkMode ? '#fdd663' : GOOGLE_COLORS.yellow,
              '& .MuiAlert-icon': { color: GOOGLE_COLORS.yellow },
              border: `1px solid ${alpha(GOOGLE_COLORS.yellow, 0.2)}`
            }}
            icon={<WarningIcon />}
          >
            <Typography variant="body2" fontWeight={500}>
              You've reached the maximum limit of {limits.max} companies.
            </Typography>
            <Typography variant="caption">
              Delete an existing company to create a new one, or upgrade your plan.
            </Typography>
          </Alert>
        )}

        {/* Filters and Actions */}
        <Paper 
          elevation={0}
          sx={{ 
            mb: 4,
            p: 2.5,
            backgroundColor: darkMode ? '#303134' : '#ffffff',
            border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
            borderRadius: '20px',
          }}
        >
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'stretch', md: 'center' },
            gap: 2
          }}>
            {/* Search */}
            <Box sx={{ flex: 1, display: 'flex', gap: 2, alignItems: 'center' }}>
              <TextField
                placeholder="Search companies by name, email or industry..."
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
                    borderRadius: '12px',
                    backgroundColor: darkMode ? '#202124' : '#f8f9fa',
                    '&:hover': {
                      backgroundColor: darkMode ? '#3c4043' : '#f1f3f4',
                    },
                  },
                }}
              />
              <Tooltip title="Refresh companies">
                <IconButton 
                  onClick={refreshCompanies}
                  sx={{ 
                    bgcolor: darkMode ? '#202124' : '#f8f9fa',
                    '&:hover': { bgcolor: darkMode ? '#3c4043' : '#f1f3f4' },
                    borderRadius: '12px',
                    width: 40,
                    height: 40
                  }}
                >
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
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
                  minWidth: 160,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    backgroundColor: darkMode ? '#202124' : '#f8f9fa',
                  }
                }}
              >
                <InputLabel sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                  Filter by Plan
                </InputLabel>
                <Select
                  value={planFilter}
                  label="Filter by Plan"
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
                    borderRadius: '28px',
                    backgroundColor: GOOGLE_COLORS.blue,
                    '&:hover': { backgroundColor: '#1a5cb0' },
                    whiteSpace: 'nowrap',
                    px: 3,
                    boxShadow: 'none'
                  }}
                >
                  New Company
                </MuiButton>
              )}
            </Box>
          </Box>
        </Paper>

        {/* Companies Grid */}
        {filteredCompanies.length === 0 ? (
          <Paper 
            elevation={0}
            sx={{ 
              textAlign: 'center', 
              py: 8,
              px: 3,
              backgroundColor: darkMode ? '#303134' : '#ffffff',
              border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
              borderRadius: '24px',
            }}
          >
            <Box sx={{ mb: 3 }}>
              <Avatar sx={{ 
                width: 80, 
                height: 80, 
                bgcolor: darkMode ? '#3c4043' : '#f1f3f4',
                color: darkMode ? '#9aa0a6' : '#5f6368',
                margin: '0 auto',
                mb: 2
              }}>
                <BusinessIcon sx={{ fontSize: 40 }} />
              </Avatar>
              <Typography variant="h5" fontWeight={500} gutterBottom sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                No Companies Found
              </Typography>
              <Typography variant="body1" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', mb: 3 }}>
                {searchQuery || planFilter !== 'all'
                  ? "No companies match your current filters. Try adjusting your search criteria."
                  : "Get started by creating your first company."}
              </Typography>
            </Box>
            {!searchQuery && planFilter === 'all' && canCreateMore && (
              <MuiButton
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => router.push('/companies/create')}
                sx={{ 
                  borderRadius: '28px',
                  backgroundColor: GOOGLE_COLORS.blue,
                  '&:hover': { backgroundColor: '#1a5cb0' },
                  px: 5,
                  py: 1.5,
                  fontSize: '1rem'
                }}
              >
                Create Your First Company
              </MuiButton>
            )}
          </Paper>
        ) : (
          <Box sx={{ 
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              lg: 'repeat(3, 1fr)',
              xl: 'repeat(4, 1fr)'
            },
            gap: 3,
          }}>
            {filteredCompanies.map((company) => (
              <Paper 
                key={company._id}
                elevation={0}
                onClick={() => {
                  setSelectedCompany(company);
                  setDetailDialogOpen(true);
                }}
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
                    onClick={(e) => handleMenuOpen(e, company)}
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
                      fontSize: '0.75rem',
                      py: 0.75,
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
                      fontSize: '0.75rem',
                      py: 0.75,
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
            ))}
          </Box>
        )}
      </Container>

      {/* Company Detail Dialog */}
      <Dialog
        open={detailDialogOpen}
        onClose={() => setDetailDialogOpen(false)}
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
        {selectedCompany && (
          <>
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
                  {selectedCompany.name.charAt(0).toUpperCase()}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h5" fontWeight={600} sx={{ color: darkMode ? '#e8eaed' : '#202124', mb: 0.5 }}>
                    {selectedCompany.name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                    {selectedCompany.industry || 'General Business'} • {selectedCompany.size} employees
                  </Typography>
                </Box>
                <IconButton 
                  onClick={() => setDetailDialogOpen(false)} 
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
                    label={selectedCompany.userRole}
                    size="medium"
                    sx={{
                      px: 1,
                      fontWeight: 600,
                      backgroundColor: selectedCompany.userRole === 'admin' 
                        ? alpha('#7c4dff', 0.1)
                        : alpha(GOOGLE_COLORS.grey, 0.1),
                      color: selectedCompany.userRole === 'admin' 
                        ? '#7c4dff'
                        : darkMode ? '#e8eaed' : '#202124',
                      border: 'none'
                    }}
                  />
                  <MuiChip
                    label={selectedCompany.plan?.toUpperCase() || 'FREE'}
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
                    label={selectedCompany.size}
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
                        {selectedCompany.email}
                      </Typography>
                    </Box>
                    
                    {selectedCompany.phone && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <PhoneIcon sx={{ fontSize: 20, color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                        <Typography variant="body1" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                          {selectedCompany.phone}
                        </Typography>
                      </Box>
                    )}
                    
                    {selectedCompany.website && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <LanguageIcon sx={{ fontSize: 20, color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                        <Typography 
                          variant="body1" 
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
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <LocationIcon sx={{ fontSize: 20, color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                      <Typography variant="body1" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                        {selectedCompany.address?.street ? `${selectedCompany.address.street}, ` : ''}
                        {selectedCompany.address?.city || 'No city'}
                        {selectedCompany.address?.state ? `, ${selectedCompany.address.state}` : ''}
                        {selectedCompany.address?.country ? `, ${selectedCompany.address.country}` : ''}
                        {selectedCompany.address?.zipCode ? ` - ${selectedCompany.address.zipCode}` : ''}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <GroupIcon sx={{ fontSize: 20, color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                      <Typography variant="body1" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                        {selectedCompany.memberCount || 1} / {selectedCompany.maxMembers || 10} team members
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <AccountBalanceIcon sx={{ fontSize: 20, color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                      <Typography variant="body1" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
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
              backgroundColor: darkMode ? '#303134' : '#f8f9fa',
            }}>
              <MuiButton
                variant="outlined"
                startIcon={<PeopleIcon />}
                onClick={() => {
                  setDetailDialogOpen(false);
                  router.push(`/companies/${selectedCompany._id}/members`);
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
              </MuiButton>
              <MuiButton
                variant="contained"
                onClick={() => setDetailDialogOpen(false)}
                sx={{ 
                  borderRadius: '24px',
                  backgroundColor: GOOGLE_COLORS.blue,
                  '&:hover': { backgroundColor: '#1a5cb0' },
                  px: 4,
                  boxShadow: 'none'
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
            borderRadius: '24px',
            maxWidth: 450,
            backgroundColor: darkMode ? '#202124' : '#ffffff',
            border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
          }
        }}
      >
        <DialogTitle sx={{ 
          borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
          backgroundColor: darkMode ? '#303134' : '#f8f9fa',
          px: 4,
          py: 2.5,
        }}>
          <Typography variant="h6" fontWeight={600} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
            Delete Company
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 2 }}>
            <Avatar sx={{ 
              width: 64, 
              height: 64, 
              bgcolor: alpha(GOOGLE_COLORS.red, 0.1),
              color: GOOGLE_COLORS.red
            }}>
              <DeleteIcon sx={{ fontSize: 32 }} />
            </Avatar>
            <Box>
              <Typography variant="body1" sx={{ color: darkMode ? '#e8eaed' : '#202124', mb: 1, fontWeight: 500 }}>
                Are you sure you want to delete <strong>{selectedCompany?.name}</strong>?
              </Typography>
              <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                This action cannot be undone. All team members will be removed and you'll lose access to this company's data.
              </Typography>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ 
          p: 3, 
          gap: 1.5,
          borderTop: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
          backgroundColor: darkMode ? '#303134' : '#f8f9fa',
        }}>
          <MuiButton
            onClick={() => setDeleteDialogOpen(false)}
            sx={{ 
              borderRadius: '24px',
              color: darkMode ? '#e8eaed' : '#202124',
              px: 3
            }}
          >
            Cancel
          </MuiButton>
          <MuiButton
            onClick={() => handleDelete(selectedCompany?._id || '')}
            disabled={deleting === selectedCompany?._id}
            variant="contained"
            sx={{ 
              borderRadius: '24px',
              backgroundColor: GOOGLE_COLORS.red,
              '&:hover': { backgroundColor: '#b3141c' },
              px: 4,
              boxShadow: 'none'
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
          onClick={() => {
            handleMenuClose();
            if (selectedCompany) {
              setDetailDialogOpen(true);
            }
          }}
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
          onClick={() => {
            handleMenuClose();
            if (selectedCompany) {
              router.push(`/companies/${selectedCompany._id}/members`);
            }
          }}
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
          onClick={() => {
            handleMenuClose();
            setDeleteDialogOpen(true);
          }}
          sx={{ 
            gap: 1.5, 
            py: 1.5, 
            px: 2,
            color: GOOGLE_COLORS.red,
            '&:hover': { backgroundColor: alpha(GOOGLE_COLORS.red, 0.1) }
          }}
        >
          <DeleteIcon fontSize="small" />
          Delete Company
        </MenuItem>
      </Menu>
    </Box>
  );
}

// Main exported component with layout wrapper
export default function CompaniesPage() {
  return (
    <MainLayout title="Companies">
      <CompaniesPageContent />
    </MainLayout>
  );
}