'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  CircularProgress,
  useTheme,
  alpha,
  Breadcrumbs,
  IconButton,
  Avatar,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Paper,
  Divider,
  Alert,
} from "@mui/material";
import {
  Business as BusinessIcon,
  ArrowBack as ArrowBackIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Language as LanguageIcon,
  Group as GroupIcon,
  LocationOn as LocationIcon,
  Home as HomeIcon,
  Save as SaveIcon,
  Close as CloseIcon
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCompany } from '@/lib/companyContext';
import { companyService } from '@/services/companyService';

const GOOGLE_COLORS = {
  blue: '#1a73e8',
  red: '#d93025',
  green: '#1e8e3e',
  yellow: '#f9ab00',
  grey: '#5f6368',
  darkGrey: '#3c4043',
  lightGrey: '#f1f3f4'
};

const industries = [
  'Technology',
  'Healthcare',
  'Finance',
  'Education',
  'Real Estate',
  'Retail',
  'Manufacturing',
  'Construction',
  'Transportation',
  'Hospitality',
  'Media',
  'Consulting',
  'Legal',
  'Marketing',
  'Other'
];

export default function CreateCompanyPage() {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';
  const router = useRouter();
  
  const { refreshCompanies, canCreateMore, limits } = useCompany();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    industry: '',
    size: '1-10',
    website: '',
    address: {
      street: '',
      city: '',
      state: '',
      country: 'India',
      zipCode: ''
    }
  });

  // Redirect if limit reached
  if (!canCreateMore) {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '60vh',
        gap: 3,
        px: 3
      }}>
        <Avatar sx={{ 
          width: 80, 
          height: 80, 
          bgcolor: alpha(GOOGLE_COLORS.yellow, 0.1),
          color: GOOGLE_COLORS.yellow
        }}>
          <BusinessIcon sx={{ fontSize: 40 }} />
        </Avatar>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h5" fontWeight={500} gutterBottom sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
            Company Limit Reached
          </Typography>
          <Typography variant="body1" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', maxWidth: 400, mb: 3 }}>
            You already have {limits.current} out of {limits.max} companies.
            Delete an existing company to create a new one.
          </Typography>
          <Box
            component="button"
            onClick={() => router.push('/companies')}
            sx={{
              px: 4,
              py: 1.5,
              border: 'none',
              borderRadius: '24px',
              backgroundColor: GOOGLE_COLORS.blue,
              color: '#ffffff',
              fontSize: '0.875rem',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.2s',
              '&:hover': {
                backgroundColor: '#1a5cb0',
              },
            }}
          >
            Back to Companies
          </Box>
        </Box>
      </Box>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      setError('Company name is required');
      return;
    }

    if (!formData.email.trim()) {
      setError('Company email is required');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const res = await companyService.createCompany(formData);
      
      if (!res.success) {
        setError(res.error || res.message || 'Failed to create company');
        return;
      }

      await refreshCompanies();
      router.push('/companies');
      
    } catch (err: any) {
      setError(err.message || 'Failed to create company');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setFormData({
        ...formData,
        address: { ...formData.address, [addressField]: value }
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSelectChange = (event: SelectChangeEvent) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <Box sx={{ 
      backgroundColor: darkMode ? '#202124' : '#ffffff',
      color: darkMode ? '#e8eaed' : '#202124',
      minHeight: '100vh',
    }}>
      {/* Header */}
      <Box sx={{ 
        p: { xs: 2, sm: 3 },
        borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
        background: darkMode 
          ? 'linear-gradient(135deg, #0d3064 0%, #202124 100%)'
          : 'linear-gradient(135deg, #e8f0fe 0%, #ffffff 100%)',
      }}>
        <Breadcrumbs sx={{ 
          mb: { xs: 1, sm: 2 }, 
          color: darkMode ? '#9aa0a6' : '#5f6368',
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
            <HomeIcon sx={{ mr: 0.5, fontSize: 16 }} />
            Dashboard
          </Link>
          <Link 
            href="/companies" 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              textDecoration: 'none', 
              color: 'inherit',
            }}
          >
            Companies
          </Link>
          <Typography color={darkMode ? '#e8eaed' : '#202124'} fontWeight={400}>
            Create New
          </Typography>
        </Breadcrumbs>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton 
            onClick={() => router.back()}
            sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Box>
            <Typography variant="h5" fontWeight={500} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
              Create New Company
            </Typography>
            <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', mt: 0.5 }}>
              Set up your company to start managing your business and team
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Form */}
      <Box sx={{ 
        maxWidth: 900, 
        mx: 'auto', 
        p: { xs: 2, sm: 3, md: 4 }
      }}>
        <Paper 
          elevation={0}
          sx={{ 
            p: { xs: 2, sm: 3, md: 4 },
            backgroundColor: darkMode ? '#202124' : '#ffffff',
            border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
            borderRadius: '24px',
          }}
        >
          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                mb: 4, 
                borderRadius: '8px',
                backgroundColor: darkMode ? alpha(GOOGLE_COLORS.red, 0.1) : alpha(GOOGLE_COLORS.red, 0.05),
                color: darkMode ? '#f28b82' : GOOGLE_COLORS.red,
                '& .MuiAlert-icon': { color: GOOGLE_COLORS.red }
              }}
              onClose={() => setError('')}
            >
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            {/* Basic Information */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" fontWeight={500} sx={{ mb: 3, color: darkMode ? '#e8eaed' : '#202124' }}>
                Basic Information
              </Typography>
              
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: 3 
              }}>
                <TextField
                  fullWidth
                  name="name"
                  label="Company Name *"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <BusinessIcon sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      backgroundColor: darkMode ? '#303134' : '#ffffff',
                      '&:hover': {
                        backgroundColor: darkMode ? '#3c4043' : '#f8f9fa',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: darkMode ? '#9aa0a6' : '#5f6368',
                    },
                  }}
                />

                <Box sx={{ 
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  gap: 3 
                }}>
                  <TextField
                    fullWidth
                    name="email"
                    label="Company Email *"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      flex: '1 1 calc(50% - 12px)',
                      minWidth: { xs: '100%', sm: 'calc(50% - 12px)' },
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        backgroundColor: darkMode ? '#303134' : '#ffffff',
                        '&:hover': {
                          backgroundColor: darkMode ? '#3c4043' : '#f8f9fa',
                        },
                      },
                    }}
                  />

                  <TextField
                    fullWidth
                    name="phone"
                    label="Phone Number"
                    value={formData.phone}
                    onChange={handleInputChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PhoneIcon sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      flex: '1 1 calc(50% - 12px)',
                      minWidth: { xs: '100%', sm: 'calc(50% - 12px)' },
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        backgroundColor: darkMode ? '#303134' : '#ffffff',
                        '&:hover': {
                          backgroundColor: darkMode ? '#3c4043' : '#f8f9fa',
                        },
                      },
                    }}
                  />
                </Box>

                <Box sx={{ 
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  gap: 3 
                }}>
                  <FormControl 
                    fullWidth
                    sx={{
                      flex: '1 1 calc(50% - 12px)',
                      minWidth: { xs: '100%', sm: 'calc(50% - 12px)' },
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        backgroundColor: darkMode ? '#303134' : '#ffffff',
                        '&:hover': {
                          backgroundColor: darkMode ? '#3c4043' : '#f8f9fa',
                        },
                      },
                      '& .MuiInputLabel-root': {
                        color: darkMode ? '#9aa0a6' : '#5f6368',
                      },
                    }}
                  >
                    <InputLabel>Industry</InputLabel>
                    <Select
                      name="industry"
                      value={formData.industry}
                      label="Industry"
                      onChange={handleSelectChange}
                    >
                      <MenuItem value="">Select Industry</MenuItem>
                      {industries.map(industry => (
                        <MenuItem key={industry} value={industry}>{industry}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl 
                    fullWidth
                    sx={{
                      flex: '1 1 calc(50% - 12px)',
                      minWidth: { xs: '100%', sm: 'calc(50% - 12px)' },
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        backgroundColor: darkMode ? '#303134' : '#ffffff',
                        '&:hover': {
                          backgroundColor: darkMode ? '#3c4043' : '#f8f9fa',
                        },
                      },
                    }}
                  >
                    <InputLabel>Company Size</InputLabel>
                    <Select
                      name="size"
                      value={formData.size}
                      label="Company Size"
                      onChange={handleSelectChange}
                      startAdornment={
                        <InputAdornment position="start">
                          <GroupIcon sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                        </InputAdornment>
                      }
                    >
                      <MenuItem value="1-10">1-10 employees</MenuItem>
                      <MenuItem value="11-50">11-50 employees</MenuItem>
                      <MenuItem value="51-200">51-200 employees</MenuItem>
                      <MenuItem value="201-500">201-500 employees</MenuItem>
                      <MenuItem value="500+">500+ employees</MenuItem>
                    </Select>
                  </FormControl>
                </Box>

                <TextField
                  fullWidth
                  name="website"
                  label="Website"
                  value={formData.website}
                  onChange={handleInputChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LanguageIcon sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      backgroundColor: darkMode ? '#303134' : '#ffffff',
                      '&:hover': {
                        backgroundColor: darkMode ? '#3c4043' : '#f8f9fa',
                      },
                    },
                  }}
                />
              </Box>
            </Box>

            <Divider sx={{ my: 4, borderColor: darkMode ? '#3c4043' : '#dadce0' }} />

            {/* Address Information */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" fontWeight={500} sx={{ mb: 3, color: darkMode ? '#e8eaed' : '#202124' }}>
                Address Information
              </Typography>
              
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: 3 
              }}>
                <TextField
                  fullWidth
                  name="address.street"
                  label="Street Address"
                  value={formData.address.street}
                  onChange={handleInputChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LocationIcon sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      backgroundColor: darkMode ? '#303134' : '#ffffff',
                      '&:hover': {
                        backgroundColor: darkMode ? '#3c4043' : '#f8f9fa',
                      },
                    },
                  }}
                />

                <Box sx={{ 
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  gap: 3 
                }}>
                  <TextField
                    fullWidth
                    name="address.city"
                    label="City"
                    value={formData.address.city}
                    onChange={handleInputChange}
                    sx={{
                      flex: '1 1 calc(50% - 12px)',
                      minWidth: { xs: '100%', sm: 'calc(50% - 12px)' },
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        backgroundColor: darkMode ? '#303134' : '#ffffff',
                        '&:hover': {
                          backgroundColor: darkMode ? '#3c4043' : '#f8f9fa',
                        },
                      },
                    }}
                  />

                  <TextField
                    fullWidth
                    name="address.state"
                    label="State"
                    value={formData.address.state}
                    onChange={handleInputChange}
                    sx={{
                      flex: '1 1 calc(50% - 12px)',
                      minWidth: { xs: '100%', sm: 'calc(50% - 12px)' },
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        backgroundColor: darkMode ? '#303134' : '#ffffff',
                        '&:hover': {
                          backgroundColor: darkMode ? '#3c4043' : '#f8f9fa',
                        },
                      },
                    }}
                  />
                </Box>

                <Box sx={{ 
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  gap: 3 
                }}>
                  <TextField
                    fullWidth
                    name="address.country"
                    label="Country"
                    value={formData.address.country}
                    onChange={handleInputChange}
                    sx={{
                      flex: '1 1 calc(50% - 12px)',
                      minWidth: { xs: '100%', sm: 'calc(50% - 12px)' },
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        backgroundColor: darkMode ? '#303134' : '#ffffff',
                        '&:hover': {
                          backgroundColor: darkMode ? '#3c4043' : '#f8f9fa',
                        },
                      },
                    }}
                  />

                  <TextField
                    fullWidth
                    name="address.zipCode"
                    label="ZIP / Postal Code"
                    value={formData.address.zipCode}
                    onChange={handleInputChange}
                    sx={{
                      flex: '1 1 calc(50% - 12px)',
                      minWidth: { xs: '100%', sm: 'calc(50% - 12px)' },
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        backgroundColor: darkMode ? '#303134' : '#ffffff',
                        '&:hover': {
                          backgroundColor: darkMode ? '#3c4043' : '#f8f9fa',
                        },
                      },
                    }}
                  />
                </Box>
              </Box>
            </Box>

            <Divider sx={{ my: 4, borderColor: darkMode ? '#3c4043' : '#dadce0' }} />

            {/* Plan Info */}
            <Box sx={{ 
              p: 3, 
              backgroundColor: darkMode ? '#303134' : '#f8f9fa',
              borderRadius: '16px',
              mb: 4
            }}>
              <Typography variant="subtitle1" fontWeight={500} sx={{ color: GOOGLE_COLORS.blue, mb: 2 }}>
                Free Plan Features
              </Typography>
              <Box sx={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: 2 
              }}>
                {[
                  'Up to 10 team members',
                  'Basic project management',
                  'Task tracking',
                  'Team collaboration'
                ].map((feature, index) => (
                  <Box 
                    key={index}
                    sx={{ 
                      flex: '1 1 calc(50% - 8px)',
                      minWidth: { xs: '100%', sm: 'calc(50% - 8px)' },
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 1 
                    }}
                  >
                    <Box sx={{ 
                      width: 6, 
                      height: 6, 
                      borderRadius: '50%', 
                      backgroundColor: GOOGLE_COLORS.blue 
                    }} />
                    <Typography variant="body2" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                      {feature}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>

            {/* Form Actions */}
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Box
                component="button"
                type="button"
                onClick={() => router.back()}
                sx={{
                  px: 4,
                  py: 1.5,
                  border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                  borderRadius: '24px',
                  backgroundColor: 'transparent',
                  color: darkMode ? '#e8eaed' : '#202124',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  '&:hover': {
                    backgroundColor: darkMode ? '#303134' : '#f1f3f4',
                  },
                }}
              >
                Cancel
              </Box>
              <Box
                component="button"
                type="submit"
                disabled={loading}
                sx={{
                  px: 4,
                  py: 1.5,
                  border: 'none',
                  borderRadius: '24px',
                  backgroundColor: GOOGLE_COLORS.blue,
                  color: '#ffffff',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  opacity: loading ? 0.7 : 1,
                  '&:hover': {
                    backgroundColor: loading ? GOOGLE_COLORS.blue : '#1a5cb0',
                  },
                }}
              >
                {loading ? (
                  <>
                    <CircularProgress size={16} sx={{ color: '#ffffff' }} />
                    Creating...
                  </>
                ) : (
                  <>
                    <SaveIcon sx={{ fontSize: 18 }} />
                    Create Company
                  </>
                )}
              </Box>
            </Box>
          </form>
        </Paper>

        <Typography 
          variant="caption" 
          sx={{ 
            display: 'block',
            textAlign: 'center',
            mt: 3,
            color: darkMode ? '#9aa0a6' : '#5f6368'
          }}
        >
          By creating a company, you agree to our Terms of Service and Privacy Policy.
          You can add team members after creating the company.
        </Typography>
      </Box>
    </Box>
  );
}