"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  Chip,
  Button,
  IconButton,
  Skeleton,
  useTheme,
  alpha,
  TextField,
  InputAdornment,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  LinearProgress,
  Tooltip,
  Badge,
} from "@mui/material";
import {
  Business as BusinessIcon,
  Add as AddIcon,
  Search as SearchIcon,
  MoreVert as MoreVertIcon,
  People as PeopleIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  ArrowForward as ArrowForwardIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Dashboard as DashboardIcon,
  Settings as SettingsIcon,
} from "@mui/icons-material";
import Link from "next/link";
// Add missing imports
import Divider from '@mui/material/Divider';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { MainLayout } from "@/components/Layout/MainLayout";
import { Button as CustomButton } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';

const MAX_COMPANIES = 5;

interface Company {
  _id: string;
  name: string;
  legalName?: string;
  email: string;
  phone?: string;
  industry?: string;
  size?: string;
  address?: any;
  isActive: boolean;
  createdAt: string;
  subscription?: {
    plan: string;
    status: string;
    seats: number;
    usedSeats: number;
  };
}

export default function CompaniesPage() {
  const router = useRouter();
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';

  const [companies, setCompanies] = useState<Company[]>([]);
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  
  // Delete Dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  
  // Success Message
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchCompanies();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredCompanies(companies);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredCompanies(
        companies.filter(
          (company) =>
            company.name.toLowerCase().includes(query) ||
            company.email.toLowerCase().includes(query) ||
            company.industry?.toLowerCase().includes(query)
        )
      );
    }
  }, [searchQuery, companies]);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/companies', {
        credentials: 'include'
      });
      const data = await response.json();
      
      if (data.success) {
        setCompanies(data.companies || []);
        setFilteredCompanies(data.companies || []);
      }
    } catch (error) {
      console.error('Error fetching companies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, company: Company) => {
    setAnchorEl(event.currentTarget);
    setSelectedCompany(company);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedCompany(null);
  };

  const handleViewCompany = () => {
    if (selectedCompany) {
      router.push(`/company/${selectedCompany._id}`);
    }
    handleMenuClose();
  };

  const handleEditCompany = () => {
    if (selectedCompany) {
      router.push(`/company/${selectedCompany._id}/edit`);
    }
    handleMenuClose();
  };

  const handleManageMembers = () => {
    if (selectedCompany) {
      router.push(`/company/${selectedCompany._id}/members`);
    }
    handleMenuClose();
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  const handleDeleteCompany = async () => {
    if (!selectedCompany) return;

    try {
      setDeleteLoading(true);
      setDeleteError(null);

      const response = await fetch(`/api/companies?id=${selectedCompany._id}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete company');
      }

      setSuccessMessage(`Company "${selectedCompany.name}" deactivated successfully`);
      
      // Refresh companies list
      await fetchCompanies();
      
      setDeleteDialogOpen(false);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
      
    } catch (err: any) {
      setDeleteError(err.message);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleSetDefault = async () => {
    if (!selectedCompany) return;

    try {
      const response = await fetch('/api/user-companies', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ companyId: selectedCompany._id })
      });

      if (response.ok) {
        setSuccessMessage(`"${selectedCompany.name}" is now your default company`);
        fetchCompanies();
      }
    } catch (error) {
      console.error('Error setting default company:', error);
    }
    handleMenuClose();
  };

  const getPlanColor = (plan: string = 'trial') => {
    const colors = {
      trial: '#4285f4',
      basic: '#34a853',
      professional: '#fbbc04',
      enterprise: '#ea4335'
    };
    return colors[plan as keyof typeof colors] || '#4285f4';
  };

  const getStatusColor = (status: string = 'active') => {
    const colors = {
      active: '#34a853',
      trial: '#4285f4',
      pending: '#fbbc04',
      cancelled: '#ea4335',
      expired: '#ea4335'
    };
    return colors[status as keyof typeof colors] || '#9aa0a6';
  };

  const activeCompaniesCount = companies.filter(c => c.isActive).length;
  const remainingSlots = MAX_COMPANIES - activeCompaniesCount;

  if (loading) {
    return (
      <MainLayout title="Companies">
        <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
            <Skeleton variant="text" width={200} height={40} />
            <Skeleton variant="rectangular" width={150} height={40} sx={{ borderRadius: '8px' }} />
          </Box>
          <Box sx={{ 
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              md: 'repeat(2, 1fr)',
              lg: 'repeat(3, 1fr)'
            },
            gap: 3
          }}>
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} variant="rectangular" height={220} sx={{ borderRadius: '8px' }} />
            ))}
          </Box>
        </Box>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Companies">
      <Box sx={{ 
        backgroundColor: darkMode ? '#202124' : '#f8f9fa',
        minHeight: '100vh',
        py: 4
      }}>
        <Box sx={{ maxWidth: 1200, mx: 'auto', px: 3 }}>
          {/* Success Message */}
          {successMessage && (
            <Alert 
              severity="success" 
              message={successMessage}
              sx={{ mb: 3 }}
              onClose={() => setSuccessMessage(null)}
            />
          )}

          {/* Header */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            mb: 4,
            flexWrap: 'wrap',
            gap: 2
          }}>
            <Box>
              <Typography variant="h4" fontWeight={500} gutterBottom>
                Companies
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                <Typography variant="body1" color="text.secondary">
                  Manage your companies and workspaces
                </Typography>
                <Chip
                  icon={<BusinessIcon />}
                  label={`${activeCompaniesCount}/${MAX_COMPANIES} Active`}
                  color={remainingSlots > 0 ? 'default' : 'error'}
                  size="small"
                  sx={{
                    backgroundColor: remainingSlots > 0 
                      ? alpha('#4285f4', 0.1)
                      : alpha('#ea4335', 0.1),
                    color: remainingSlots > 0 ? '#4285f4' : '#ea4335',
                  }}
                />
              </Box>
            </Box>
            
            <Tooltip title={remainingSlots === 0 ? "Maximum companies limit reached" : "Create new company"}>
              <span>
                <CustomButton
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => router.push('/company/setup')}
                  disabled={remainingSlots === 0}
                  sx={{ borderRadius: '8px' }}
                >
                  New Company
                </CustomButton>
              </span>
            </Tooltip>
          </Box>

          {/* Company Limit Progress */}
          {activeCompaniesCount > 0 && (
            <Box sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Company Usage
                </Typography>
                <Typography variant="body2" fontWeight={600}>
                  {activeCompaniesCount} / {MAX_COMPANIES}
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={(activeCompaniesCount / MAX_COMPANIES) * 100}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: darkMode ? '#3c4043' : '#e8eaed',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: activeCompaniesCount === MAX_COMPANIES ? '#ea4335' : '#4285f4',
                    borderRadius: 4,
                  }
                }}
              />
              {remainingSlots === 0 && (
                <Alert
                  severity="warning"
                  message="You have reached the maximum limit of 5 active companies. Please delete or deactivate an existing company to create a new one."
                  sx={{ mt: 2 }}
                />
              )}
            </Box>
          )}

          {/* Search Bar */}
          <TextField
            fullWidth
            placeholder="Search companies by name, email, or industry..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ mb: 4 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                </InputAdornment>
              ),
              sx: {
                borderRadius: '8px',
                backgroundColor: darkMode ? '#303134' : '#ffffff',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: darkMode ? '#3c4043' : '#dadce0',
                }
              }
            }}
          />

          {/* Companies Grid */}
          {filteredCompanies.length === 0 ? (
            <Box sx={{ 
              textAlign: 'center', 
              py: 8,
              backgroundColor: darkMode ? '#303134' : '#ffffff',
              borderRadius: '8px',
              border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`
            }}>
              <BusinessIcon sx={{ fontSize: 64, color: '#9aa0a6', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                No companies found
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 3 }}>
                {searchQuery ? 'Try a different search term' : 'Create your first company to get started'}
              </Typography>
              {!searchQuery && remainingSlots > 0 && (
                <CustomButton
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => router.push('/company/setup')}
                >
                  Create Company
                </CustomButton>
              )}
            </Box>
          ) : (
            <Box sx={{ 
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                md: 'repeat(2, 1fr)',
                lg: 'repeat(3, 1fr)'
              },
              gap: 3
            }}>
              {filteredCompanies.map((company) => {
                const planColor = getPlanColor(company.subscription?.plan);
                const statusColor = getStatusColor(company.subscription?.status);
                const isDefault = localStorage.getItem('currentCompany')?.includes(company._id);
                
                return (
                  <Badge
                    key={company._id}
                    color="primary"
                    badgeContent="Default"
                    sx={{ width: '100%' }}
                    invisible={!isDefault}
                  >
                    <Card sx={{
                      width: '100%',
                      backgroundColor: darkMode ? '#303134' : '#ffffff',
                      border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                      borderRadius: '8px',
                      transition: 'all 0.2s',
                      position: 'relative',
                      '&:hover': {
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        borderColor: '#4285f4',
                      }
                    }}>
                      <CardContent>
                        {/* Status Indicator */}
                        <Box sx={{ 
                          position: 'absolute', 
                          top: 16, 
                          right: 16,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.5
                        }}>
                          <Box sx={{ 
                            width: 8, 
                            height: 8, 
                            borderRadius: '50%', 
                            bgcolor: statusColor 
                          }} />
                          <Typography variant="caption" color="text.secondary">
                            {company.subscription?.status || 'Active'}
                          </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                          <Avatar sx={{ 
                            bgcolor: alpha('#4285f4', 0.1),
                            color: '#4285f4',
                            width: 48,
                            height: 48
                          }}>
                            {company.name.charAt(0).toUpperCase()}
                          </Avatar>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="h6" fontWeight={600} noWrap>
                              {company.name}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5 }}>
                              <Chip 
                                label={company.industry || 'Not Specified'} 
                                size="small"
                                sx={{ 
                                  backgroundColor: alpha('#4285f4', 0.1),
                                  color: '#4285f4',
                                  fontSize: '0.7rem',
                                  height: 20
                                }}
                              />
                              <Chip 
                                label={company.size || 'N/A'} 
                                size="small"
                                variant="outlined"
                                sx={{ 
                                  fontSize: '0.7rem',
                                  height: 20
                                }}
                              />
                            </Box>
                          </Box>
                          <IconButton 
                            size="small"
                            onClick={(e) => handleMenuOpen(e, company)}
                            sx={{ color: darkMode ? '#e8eaed' : '#5f6368' }}
                          >
                            <MoreVertIcon />
                          </IconButton>
                        </Box>

                        <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <EmailIcon sx={{ fontSize: 16, color: '#9aa0a6' }} />
                            <Typography variant="body2" color="text.secondary" noWrap>
                              {company.email}
                            </Typography>
                          </Box>
                          {company.phone && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <PhoneIcon sx={{ fontSize: 16, color: '#9aa0a6' }} />
                              <Typography variant="body2" color="text.secondary">
                                {company.phone}
                              </Typography>
                            </Box>
                          )}
                          {company.address?.city && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <LocationIcon sx={{ fontSize: 16, color: '#9aa0a6' }} />
                              <Typography variant="body2" color="text.secondary" noWrap>
                                {company.address.city}, {company.address.state}
                              </Typography>
                            </Box>
                          )}
                        </Box>

                        <Box sx={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center',
                          mt: 2,
                          pt: 2,
                          borderTop: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`
                        }}>
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              Plan
                            </Typography>
                            <Chip
                              label={company.subscription?.plan || 'Trial'}
                              size="small"
                              sx={{
                                ml: 1,
                                backgroundColor: alpha(planColor, 0.1),
                                color: planColor,
                                height: 20,
                                fontSize: '0.7rem'
                              }}
                            />
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <PeopleIcon sx={{ fontSize: 16, color: '#9aa0a6' }} />
                            <Typography variant="caption">
                              {company.subscription?.usedSeats || 1}/{company.subscription?.seats || 5}
                            </Typography>
                          </Box>
                        </Box>

                        <Button
                          fullWidth
                          variant="outlined"
                          endIcon={<ArrowForwardIcon />}
                          onClick={() => router.push(`/company/${company._id}`)}
                          sx={{ 
                            mt: 2,
                            borderRadius: '8px',
                            color: '#4285f4',
                            borderColor: alpha('#4285f4', 0.5),
                            '&:hover': {
                              borderColor: '#4285f4',
                              backgroundColor: alpha('#4285f4', 0.05),
                            }
                          }}
                        >
                          View Details
                        </Button>
                      </CardContent>
                    </Card>
                  </Badge>
                );
              })}
            </Box>
          )}

          {/* Company Actions Menu */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleViewCompany}>
              <ListItemIcon>
                <DashboardIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>View Company</ListItemText>
            </MenuItem>
            <MenuItem onClick={handleEditCompany}>
              <ListItemIcon>
                <EditIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Edit Company</ListItemText>
            </MenuItem>
            <MenuItem onClick={handleManageMembers}>
              <ListItemIcon>
                <PeopleIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Manage Members</ListItemText>
            </MenuItem>
            <MenuItem onClick={handleSetDefault}>
              <ListItemIcon>
                <CheckCircleIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Set as Default</ListItemText>
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleDeleteClick} sx={{ color: '#ea4335' }}>
              <ListItemIcon>
                <DeleteIcon fontSize="small" sx={{ color: '#ea4335' }} />
              </ListItemIcon>
              <ListItemText>Delete Company</ListItemText>
            </MenuItem>
          </Menu>

          {/* Delete Confirmation Dialog */}
          <Dialog
            open={deleteDialogOpen}
            onClose={() => setDeleteDialogOpen(false)}
            maxWidth="sm"
            fullWidth
          >
            <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <WarningIcon sx={{ color: '#ea4335' }} />
              Delete Company
            </DialogTitle>
            <DialogContent>
              {deleteError && (
                <Alert severity="error" message={deleteError} sx={{ mb: 2 }} />
              )}
              <DialogContentText>
                Are you sure you want to delete <strong>{selectedCompany?.name}</strong>?
              </DialogContentText>
              <Box sx={{ mt: 2, p: 2, bgcolor: alpha('#ea4335', 0.05), borderRadius: 1 }}>
                <Typography variant="body2" color="error" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <WarningIcon fontSize="small" />
                  This action will:
                </Typography>
                <ul style={{ marginTop: 8, paddingLeft: 20 }}>
                  <li>
                    <Typography variant="body2" color="text.secondary">
                      Deactivate the company workspace
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body2" color="text.secondary">
                      Remove all team members' access
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body2" color="text.secondary">
                      Cancel the subscription
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body2" color="text.secondary">
                      Data can be restored within 30 days
                    </Typography>
                  </li>
                </ul>
              </Box>
            </DialogContent>
            <DialogActions sx={{ p: 3 }}>
              <Button onClick={() => setDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <CustomButton
                variant="contained"
                onClick={handleDeleteCompany}
                disabled={deleteLoading}
                sx={{
                  backgroundColor: '#ea4335',
                  '&:hover': {
                    backgroundColor: '#d93025',
                  }
                }}
              >
                {deleteLoading ? 'Deleting...' : 'Delete Company'}
              </CustomButton>
            </DialogActions>
          </Dialog>
        </Box>
      </Box>
    </MainLayout>
  );
}