"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  Box,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Breadcrumbs,
  IconButton,
  Divider,
  useTheme,
  alpha,
  InputAdornment,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Business as BusinessIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Language as WebsiteIcon,
  LocationOn as LocationIcon,
  Save as SaveIcon,
  Home as HomeIcon,
} from "@mui/icons-material";
import Link from "next/link";

import { MainLayout } from "@/components/Layout/MainLayout";
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';

const INDUSTRIES = [
  "Technology", "Healthcare", "Finance", "Education", "Real Estate",
  "Retail", "Manufacturing", "Consulting", "Marketing", "Legal",
  "Construction", "Transportation", "Hospitality", "Media", "Energy",
  "Agriculture", "Other"
];

const COMPANY_SIZES = [
  { value: "1-10", label: "1-10 employees" },
  { value: "11-50", label: "11-50 employees" },
  { value: "51-200", label: "51-200 employees" },
  { value: "201-500", label: "201-500 employees" },
  { value: "501-1000", label: "501-1000 employees" },
  { value: "1000+", label: "1000+ employees" }
];

const COUNTRIES = [
  "USA", "Canada", "UK", "Australia", "India", "Singapore", "Germany", "France"
];

export default function EditCompanyPage() {
  const router = useRouter();
  const params = useParams();
  const companyId = params.id as string;
  
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [company, setCompany] = useState<any>(null);

  const [formData, setFormData] = useState({
    name: "",
    legalName: "",
    email: "",
    phone: "",
    website: "",
    taxId: "",
    industry: "",
    size: "",
    address: {
      street: "",
      city: "",
      state: "",
      country: "USA",
      zipCode: ""
    }
  });

  useEffect(() => {
    fetchCompany();
  }, [companyId]);

  const fetchCompany = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/companies', {
        credentials: 'include'
      });
      const data = await response.json();
      
      if (data.success) {
        const foundCompany = data.companies.find((c: any) => c._id === companyId);
        if (foundCompany) {
          setCompany(foundCompany);
          setFormData({
            name: foundCompany.name || "",
            legalName: foundCompany.legalName || "",
            email: foundCompany.email || "",
            phone: foundCompany.phone || "",
            website: foundCompany.website || "",
            taxId: foundCompany.taxId || "",
            industry: foundCompany.industry || "",
            size: foundCompany.size || "",
            address: {
              street: foundCompany.address?.street || "",
              city: foundCompany.address?.city || "",
              state: foundCompany.address?.state || "",
              country: foundCompany.address?.country || "USA",
              zipCode: foundCompany.address?.zipCode || ""
            }
          });
        }
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to load company');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddressChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      address: {
        ...prev.address,
        [field]: value
      }
    }));
  };

  const handleSubmit = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(false);

      const response = await fetch('/api/companies', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          companyId,
          ...formData
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update company');
      }

      setSuccess(true);
      
      setTimeout(() => {
        router.push(`/company/${companyId}`);
      }, 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <MainLayout title="Loading...">
        <Box sx={{ p: 3 }}>Loading...</Box>
      </MainLayout>
    );
  }

  return (
    <MainLayout title={company ? `Edit ${company.name}` : 'Edit Company'}>
      <Box sx={{ 
        backgroundColor: darkMode ? '#202124' : '#f8f9fa',
        minHeight: '100vh',
        py: 4
      }}>
        <Box sx={{ maxWidth: 900, mx: 'auto', px: 3 }}>
          {/* Header */}
          <Box sx={{ mb: 3 }}>
            <Breadcrumbs sx={{ mb: 2 }}>
              <Link href="/dashboard" style={{ textDecoration: 'none', color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                <HomeIcon sx={{ mr: 0.5, fontSize: 18 }} />
                Dashboard
              </Link>
              <Link href="/companies" style={{ textDecoration: 'none', color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                Companies
              </Link>
              <Link href={`/company/${companyId}`} style={{ textDecoration: 'none', color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                {company?.name}
              </Link>
              <Typography color={darkMode ? '#e8eaed' : '#202124'}>
                Edit
              </Typography>
            </Breadcrumbs>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <IconButton onClick={() => router.back()} sx={{ color: darkMode ? '#e8eaed' : '#5f6368' }}>
                <ArrowBackIcon />
              </IconButton>
              <Typography variant="h5" fontWeight={500}>
                Edit Company Information
              </Typography>
            </Box>
          </Box>

          {/* Form */}
          <Card sx={{
            p: 4,
            backgroundColor: darkMode ? '#202124' : '#ffffff',
            border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
          }}>
            {error && (
              <Alert severity="error" message={error} sx={{ mb: 3 }} />
            )}
            
            {success && (
              <Alert 
                severity="success" 
                title="Company Updated!" 
                message="Redirecting to company page..."
                sx={{ mb: 3 }}
              />
            )}

            <Box sx={{ 
              display: 'grid',
              gap: 3
            }}>
              {/* Basic Information Title */}
              <Box>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                  Basic Information
                </Typography>
              </Box>

              {/* First Row - Company Name and Legal Name */}
              <Box sx={{ 
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  md: '1fr 1fr'
                },
                gap: 3
              }}>
                <TextField
                  fullWidth
                  label="Company Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <BusinessIcon sx={{ fontSize: 18, color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px',
                      backgroundColor: darkMode ? '#303134' : '#f8f9fa',
                    }
                  }}
                />

                <TextField
                  fullWidth
                  label="Legal Name"
                  name="legalName"
                  value={formData.legalName}
                  onChange={handleChange}
                  helperText="If different from company name"
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <BusinessIcon sx={{ fontSize: 18, color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px',
                      backgroundColor: darkMode ? '#303134' : '#f8f9fa',
                    }
                  }}
                />
              </Box>

              {/* Second Row - Email and Phone */}
              <Box sx={{ 
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  md: '1fr 1fr'
                },
                gap: 3
              }}>
                <TextField
                  fullWidth
                  label="Company Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon sx={{ fontSize: 18, color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px',
                      backgroundColor: darkMode ? '#303134' : '#f8f9fa',
                    }
                  }}
                />

                <TextField
                  fullWidth
                  label="Phone Number"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PhoneIcon sx={{ fontSize: 18, color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px',
                      backgroundColor: darkMode ? '#303134' : '#f8f9fa',
                    }
                  }}
                />
              </Box>

              {/* Third Row - Website and Tax ID */}
              <Box sx={{ 
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  md: '1fr 1fr'
                },
                gap: 3
              }}>
                <TextField
                  fullWidth
                  label="Website"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="https://www.example.com"
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <WebsiteIcon sx={{ fontSize: 18, color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px',
                      backgroundColor: darkMode ? '#303134' : '#f8f9fa',
                    }
                  }}
                />

                <TextField
                  fullWidth
                  label="Tax ID / VAT"
                  name="taxId"
                  value={formData.taxId}
                  onChange={handleChange}
                  placeholder="Optional"
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px',
                      backgroundColor: darkMode ? '#303134' : '#f8f9fa',
                    }
                  }}
                />
              </Box>

              {/* Fourth Row - Industry and Company Size */}
              <Box sx={{ 
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  md: '1fr 1fr'
                },
                gap: 3
              }}>
                <FormControl 
                  fullWidth 
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px',
                      backgroundColor: darkMode ? '#303134' : '#f8f9fa',
                    }
                  }}
                >
                  <InputLabel>Industry</InputLabel>
                  <Select
                    name="industry"
                    value={formData.industry}
                    label="Industry"
                    onChange={handleSelectChange}
                  >
                    {INDUSTRIES.map(industry => (
                      <MenuItem key={industry} value={industry}>{industry}</MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl 
                  fullWidth 
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px',
                      backgroundColor: darkMode ? '#303134' : '#f8f9fa',
                    }
                  }}
                >
                  <InputLabel>Company Size</InputLabel>
                  <Select
                    name="size"
                    value={formData.size}
                    label="Company Size"
                    onChange={handleSelectChange}
                  >
                    {COMPANY_SIZES.map(size => (
                      <MenuItem key={size.value} value={size.value}>{size.label}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              {/* Address Section */}
              <Box>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                  Address Information
                </Typography>
              </Box>

              {/* Street Address - Full Width */}
              <Box>
                <TextField
                  fullWidth
                  label="Street Address"
                  value={formData.address.street}
                  onChange={(e) => handleAddressChange('street', e.target.value)}
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LocationIcon sx={{ fontSize: 18, color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px',
                      backgroundColor: darkMode ? '#303134' : '#f8f9fa',
                    }
                  }}
                />
              </Box>

              {/* City, State, ZIP Row */}
              <Box sx={{ 
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  md: 'repeat(3, 1fr)'
                },
                gap: 3
              }}>
                <TextField
                  fullWidth
                  label="City"
                  value={formData.address.city}
                  onChange={(e) => handleAddressChange('city', e.target.value)}
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px',
                      backgroundColor: darkMode ? '#303134' : '#f8f9fa',
                    }
                  }}
                />

                <TextField
                  fullWidth
                  label="State / Province"
                  value={formData.address.state}
                  onChange={(e) => handleAddressChange('state', e.target.value)}
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px',
                      backgroundColor: darkMode ? '#303134' : '#f8f9fa',
                    }
                  }}
                />

                <TextField
                  fullWidth
                  label="ZIP / Postal Code"
                  value={formData.address.zipCode}
                  onChange={(e) => handleAddressChange('zipCode', e.target.value)}
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px',
                      backgroundColor: darkMode ? '#303134' : '#f8f9fa',
                    }
                  }}
                />
              </Box>

              {/* Country - Half Width */}
              <Box sx={{ 
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  md: '1fr 1fr'
                }
              }}>
                <FormControl 
                  fullWidth 
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px',
                      backgroundColor: darkMode ? '#303134' : '#f8f9fa',
                    }
                  }}
                >
                  <InputLabel>Country</InputLabel>
                  <Select
                    value={formData.address.country}
                    label="Country"
                    onChange={(e) => handleAddressChange('country', e.target.value)}
                  >
                    {COUNTRIES.map(country => (
                      <MenuItem key={country} value={country}>{country}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Box>

            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'flex-end', 
              gap: 2, 
              mt: 4 
            }}>
              <Button
                variant="outlined"
                onClick={() => router.back()}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={saving || success}
                startIcon={<SaveIcon />}
                sx={{
                  backgroundColor: '#4285f4',
                  '&:hover': {
                    backgroundColor: '#3367d6',
                  }
                }}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </Box>
          </Card>
        </Box>
      </Box>
    </MainLayout>
  );
}