"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  Box,
  Typography,
  Paper,
  Divider,
  Chip,
  Avatar,
  IconButton,
  Button,
  Skeleton,
  useTheme,
  alpha,
  Card,
  CardContent,
  Tab,
  Tabs,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Badge,
  Tooltip,
  Breadcrumbs,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import {
  Business as BusinessIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Language as WebsiteIcon,
  LocationOn as LocationIcon,
  Group as GroupIcon,
  Security as SecurityIcon,
  Edit as EditIcon,
  Settings as SettingsIcon,
  People as PeopleIcon,
  AttachMoney as MoneyIcon,
  CalendarToday as CalendarIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Home as HomeIcon,
  ArrowBack as ArrowBackIcon,
  Person as PersonIcon,
  AdminPanelSettings as AdminIcon,
  CreditCard as CreditCardIcon,
  Event as EventIcon,
  Timeline as TimelineIcon,
  Receipt as ReceiptIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import Link from "next/link";

import { MainLayout } from "@/components/Layout/MainLayout";
import { Card as CustomCard } from '@/components/ui/Card';
import { Button as CustomButton } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';

// Tab Panel Component
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`company-tabpanel-${index}`}
      aria-labelledby={`company-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

// Company Info Card Component
function InfoCard({ title, children, icon, color = "#4285f4" }: any) {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';

  return (
    <CustomCard sx={{ 
      height: '100%',
      backgroundColor: darkMode ? '#202124' : '#ffffff',
      border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
    }}>
      <Box sx={{ p: 2.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <Avatar sx={{ bgcolor: alpha(color, 0.1), width: 32, height: 32 }}>
            {React.cloneElement(icon, { sx: { fontSize: 18, color } })}
          </Avatar>
          <Typography variant="subtitle1" fontWeight={600}>
            {title}
          </Typography>
        </Box>
        <Divider sx={{ mb: 2 }} />
        {children}
      </Box>
    </CustomCard>
  );
}

// Stat Card Component
function StatCard({ title, value, icon, color, trend }: any) {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';

  return (
    <CustomCard sx={{
      p: 2,
      backgroundColor: darkMode ? '#202124' : '#ffffff',
      border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
      width: '100%',
    }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography variant="caption" color="text.secondary">
            {title}
          </Typography>
          <Typography variant="h6" fontWeight={600} sx={{ mt: 0.5 }}>
            {value}
          </Typography>
          {trend && (
            <Typography variant="caption" sx={{ color: trend > 0 ? '#34a853' : '#ea4335' }}>
              {trend > 0 ? '+' : ''}{trend}% from last month
            </Typography>
          )}
        </Box>
        <Avatar sx={{ bgcolor: alpha(color, 0.1), width: 40, height: 40 }}>
          {React.cloneElement(icon, { sx: { fontSize: 22, color } })}
        </Avatar>
      </Box>
    </CustomCard>
  );
}

export default function CompanyDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const companyId = params.id as string;
  
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';

  // State
  const [company, setCompany] = useState<any>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const [userRole, setUserRole] = useState<string>('member');
  
  // Delete Dialog State
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Handle tab change
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Fetch company details
  useEffect(() => {
    const fetchCompanyDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log(`🔍 Fetching company details for ID: ${companyId}`);

        // First, get all companies to find this one
        const companiesRes = await fetch('/api/companies', {
          credentials: 'include'
        });

        if (!companiesRes.ok) {
          throw new Error('Failed to fetch companies');
        }

        const companiesData = await companiesRes.json();
        const foundCompany = companiesData.companies?.find((c: any) => c._id === companyId);

        if (!foundCompany) {
          throw new Error('Company not found or you do not have access');
        }

        setCompany(foundCompany);

        // Fetch company members
        const membersRes = await fetch(`/api/companies/${companyId}/members`, {
          credentials: 'include'
        });

        if (membersRes.ok) {
          const membersData = await membersRes.json();
          setMembers(membersData.members || []);
          
          // Find current user's role
          const currentUser = membersData.members?.find((m: any) => m.isCurrentUser);
          if (currentUser) {
            setUserRole(currentUser.role);
          }
        }

        console.log('✅ Company loaded:', foundCompany.name);
      } catch (err: any) {
        console.error('❌ Error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (companyId) {
      fetchCompanyDetails();
    }
  }, [companyId]);

  // Handle edit
  const handleEdit = () => {
    router.push(`/company/${companyId}/edit`);
  };

  // Handle settings
  const handleSettings = () => {
    router.push(`/company/${companyId}/settings`);
  };

  // Handle manage members
  const handleManageMembers = () => {
    router.push(`/company/${companyId}/members`);
  };

  // Handle delete company
  const handleDeleteCompany = async () => {
    try {
      setDeleteLoading(true);
      setDeleteError(null);

      const response = await fetch(`/api/companies?id=${companyId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete company');
      }

      // Redirect to companies list
      router.push('/companies');
      
    } catch (err: any) {
      setDeleteError(err.message);
    } finally {
      setDeleteLoading(false);
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Get plan color
  const getPlanColor = (plan: string) => {
    const colors: Record<string, string> = {
      trial: '#4285f4',
      basic: '#34a853',
      professional: '#fbbc04',
      enterprise: '#ea4335'
    };
    return colors[plan] || '#4285f4';
  };

  // Get status color
  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      active: '#34a853',
      trial: '#4285f4',
      pending: '#fbbc04',
      cancelled: '#ea4335',
      expired: '#ea4335'
    };
    return colors[status] || '#9aa0a6';
  };

  if (loading) {
    return (
      <MainLayout title="Company Details">
        <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
          <Breadcrumbs sx={{ mb: 3 }}>
            <Link href="/dashboard" style={{ textDecoration: 'none', color: darkMode ? '#9aa0a6' : '#5f6368' }}>
              <HomeIcon sx={{ mr: 0.5, fontSize: 18 }} />
              Dashboard
            </Link>
            <Typography color={darkMode ? '#e8eaed' : '#202124'}>
              Company
            </Typography>
          </Breadcrumbs>

          <Skeleton variant="text" height={50} width={300} />
          <Skeleton variant="rectangular" height={200} sx={{ my: 2, borderRadius: '8px' }} />
          <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
            <Skeleton variant="rectangular" height={150} sx={{ flex: 1, borderRadius: '8px' }} />
            <Skeleton variant="rectangular" height={150} sx={{ flex: 1, borderRadius: '8px' }} />
            <Skeleton variant="rectangular" height={150} sx={{ flex: 1, borderRadius: '8px' }} />
          </Stack>
        </Box>
      </MainLayout>
    );
  }

  if (error || !company) {
    return (
      <MainLayout title="Company Not Found">
        <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3, textAlign: 'center', py: 8 }}>
          <BusinessIcon sx={{ fontSize: 64, color: '#9aa0a6', mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            Company Not Found
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            {error || 'The company you are looking for does not exist or you do not have access.'}
          </Typography>
          <CustomButton
            variant="contained"
            onClick={() => router.push('/dashboard')}
          >
            Go to Dashboard
          </CustomButton>
        </Box>
      </MainLayout>
    );
  }

  const isAdmin = userRole === 'admin' || userRole === 'manager';
  const planColor = getPlanColor(company.subscription?.plan || 'trial');
  const statusColor = getStatusColor(company.subscription?.status || 'active');

  return (
    <MainLayout title={company.name}>
      <Box sx={{ 
        backgroundColor: darkMode ? '#202124' : '#f8f9fa',
        minHeight: '100vh',
        py: 4
      }}>
        <Box sx={{ maxWidth: 1200, mx: 'auto', px: 3 }}>
          {/* Header */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Breadcrumbs>
              <Link href="/dashboard" style={{ textDecoration: 'none', color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                <HomeIcon sx={{ mr: 0.5, fontSize: 18 }} />
                Dashboard
              </Link>
              <Link href="/companies" style={{ textDecoration: 'none', color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                Companies
              </Link>
              <Typography color={darkMode ? '#e8eaed' : '#202124'}>
                {company.name}
              </Typography>
            </Breadcrumbs>

            <Box sx={{ display: 'flex', gap: 1 }}>
              {isAdmin && (
                <>
                  <Tooltip title="Edit Company">
                    <IconButton onClick={handleEdit} sx={{ color: darkMode ? '#e8eaed' : '#5f6368' }}>
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Company Settings">
                    <IconButton onClick={handleSettings} sx={{ color: darkMode ? '#e8eaed' : '#5f6368' }}>
                      <SettingsIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete Company">
                    <IconButton 
                      onClick={() => setDeleteDialogOpen(true)} 
                      sx={{ color: '#ea4335' }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </>
              )}
            </Box>
          </Box>

          {/* Company Header Card */}
          <CustomCard sx={{
            p: 3,
            mb: 3,
            backgroundColor: darkMode ? '#202124' : '#ffffff',
            border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
            display: 'flex',
            alignItems: 'center',
            gap: 3,
            flexWrap: 'wrap'
          }}>
            <Avatar
              sx={{
                width: 80,
                height: 80,
                bgcolor: alpha('#4285f4', 0.1),
                color: '#4285f4',
                fontSize: 32
              }}
            >
              {company.name?.charAt(0).toUpperCase()}
            </Avatar>

            <Box sx={{ flex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap', mb: 1 }}>
                <Typography variant="h4" fontWeight={500}>
                  {company.name}
                </Typography>
                <Chip
                  label={company.industry || 'Not Specified'}
                  size="small"
                  sx={{ 
                    backgroundColor: alpha('#4285f4', 0.1),
                    color: '#4285f4',
                    fontWeight: 500
                  }}
                />
                <Chip
                  label={company.size || 'N/A'}
                  size="small"
                  variant="outlined"
                />
              </Box>

              <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                {company.email && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <EmailIcon sx={{ fontSize: 16, color: '#9aa0a6' }} />
                    <Typography variant="body2">{company.email}</Typography>
                  </Box>
                )}
                {company.phone && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <PhoneIcon sx={{ fontSize: 16, color: '#9aa0a6' }} />
                    <Typography variant="body2">{company.phone}</Typography>
                  </Box>
                )}
                {company.website && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <WebsiteIcon sx={{ fontSize: 16, color: '#9aa0a6' }} />
                    <Typography 
                      variant="body2" 
                      component="a" 
                      href={company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{ 
                        color: '#4285f4',
                        textDecoration: 'none',
                        '&:hover': { textDecoration: 'underline' }
                      }}
                    >
                      {company.website.replace(/^https?:\/\//, '')}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>

            <Box sx={{ textAlign: 'right' }}>
              <Chip
                label={company.subscription?.plan || 'Trial'}
                sx={{
                  backgroundColor: alpha(planColor, 0.1),
                  color: planColor,
                  fontWeight: 600,
                  mb: 1
                }}
              />
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, justifyContent: 'flex-end' }}>
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
            </Box>
          </CustomCard>

          {/* Stats Cards - Using Stack instead of Grid */}
          <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            spacing={3} 
            sx={{ mb: 3, width: '100%' }}
          >
            <Box sx={{ flex: 1 }}>
              <StatCard
                title="Team Members"
                value={members.length || 1}
                icon={<PeopleIcon />}
                color="#4285f4"
                trend={0}
              />
            </Box>
            <Box sx={{ flex: 1 }}>
              <StatCard
                title="Available Seats"
                value={`${(company.subscription?.seats || 5) - (company.subscription?.usedSeats || 1)}/${company.subscription?.seats || 5}`}
                icon={<GroupIcon />}
                color="#34a853"
              />
            </Box>
            <Box sx={{ flex: 1 }}>
              <StatCard
                title="Subscription"
                value={company.subscription?.plan || 'Trial'}
                icon={<CreditCardIcon />}
                color="#fbbc04"
              />
            </Box>
            <Box sx={{ flex: 1 }}>
              <StatCard
                title="Created"
                value={formatDate(company.createdAt)}
                icon={<CalendarIcon />}
                color="#ea4335"
              />
            </Box>
          </Stack>

          {/* Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tabValue} onChange={handleTabChange}>
              <Tab label="Overview" />
              <Tab label="Members" />
              <Tab label="Subscription" />
              <Tab label="Settings" />
            </Tabs>
          </Box>

          {/* Overview Tab - Using Stack instead of Grid */}
          <TabPanel value={tabValue} index={0}>
            <Stack spacing={3}>
              <Stack 
                direction={{ xs: 'column', md: 'row' }} 
                spacing={3}
              >
                <Box sx={{ flex: 1 }}>
                  <InfoCard title="Company Information" icon={<BusinessIcon />} color="#4285f4">
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Legal Name
                        </Typography>
                        <Typography variant="body2">
                          {company.legalName || company.name}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Tax ID / VAT
                        </Typography>
                        <Typography variant="body2">
                          {company.taxId || 'Not provided'}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Industry
                        </Typography>
                        <Typography variant="body2">
                          {company.industry || 'Not specified'}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Company Size
                        </Typography>
                        <Typography variant="body2">
                          {company.size || 'Not specified'} employees
                        </Typography>
                      </Box>
                    </Box>
                  </InfoCard>
                </Box>

                <Box sx={{ flex: 1 }}>
                  <InfoCard title="Address" icon={<LocationIcon />} color="#34a853">
                    {company.address ? (
                      <Box>
                        <Typography variant="body2">
                          {company.address.street}
                        </Typography>
                        <Typography variant="body2">
                          {company.address.city}, {company.address.state} {company.address.zipCode}
                        </Typography>
                        <Typography variant="body2">
                          {company.address.country || 'USA'}
                        </Typography>
                      </Box>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        No address provided
                      </Typography>
                    )}
                  </InfoCard>
                </Box>
              </Stack>

              <Stack 
                direction={{ xs: 'column', md: 'row' }} 
                spacing={3}
              >
                <Box sx={{ flex: 1 }}>
                  <InfoCard title="Workspace Settings" icon={<SettingsIcon />} color="#fbbc04">
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Timezone
                        </Typography>
                        <Typography variant="body2">
                          {company.settings?.timezone || 'America/New_York'}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Currency
                        </Typography>
                        <Typography variant="body2">
                          {company.settings?.currency || 'USD'}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Date Format
                        </Typography>
                        <Typography variant="body2">
                          {company.settings?.dateFormat || 'MM/DD/YYYY'}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Language
                        </Typography>
                        <Typography variant="body2">
                          {company.settings?.language === 'en' ? 'English' : company.settings?.language || 'English'}
                        </Typography>
                      </Box>
                    </Box>
                  </InfoCard>
                </Box>

                <Box sx={{ flex: 1 }}>
                  <InfoCard title="Quick Actions" icon={<TimelineIcon />} color="#ea4335">
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                      <CustomButton
                        fullWidth
                        variant="outlined"
                        startIcon={<PeopleIcon />}
                        onClick={handleManageMembers}
                        sx={{ justifyContent: 'flex-start' }}
                      >
                        Manage Team Members
                      </CustomButton>
                      <CustomButton
                        fullWidth
                        variant="outlined"
                        startIcon={<ReceiptIcon />}
                        onClick={() => router.push(`/company/${companyId}/billing`)}
                        sx={{ justifyContent: 'flex-start' }}
                      >
                        View Billing & Invoices
                      </CustomButton>
                      <CustomButton
                        fullWidth
                        variant="outlined"
                        startIcon={<SecurityIcon />}
                        onClick={() => router.push(`/company/${companyId}/security`)}
                        sx={{ justifyContent: 'flex-start' }}
                      >
                        Security Settings
                      </CustomButton>
                    </Box>
                  </InfoCard>
                </Box>
              </Stack>
            </Stack>
          </TabPanel>

          {/* Members Tab */}
          <TabPanel value={tabValue} index={1}>
            <CustomCard sx={{
              p: 3,
              backgroundColor: darkMode ? '#202124' : '#ffffff',
              border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
            }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" fontWeight={600}>
                  Team Members ({members.length || 1})
                </Typography>
                {isAdmin && (
                  <CustomButton
                    variant="contained"
                    startIcon={<PeopleIcon />}
                    onClick={handleManageMembers}
                  >
                    Invite Member
                  </CustomButton>
                )}
              </Box>

              <List>
                {members.length > 0 ? (
                  members.map((member) => (
                    <React.Fragment key={member.userId}>
                      <ListItem sx={{ px: 0 }}>
                        <ListItemIcon>
                          <Avatar sx={{ bgcolor: alpha('#4285f4', 0.1), color: '#4285f4' }}>
                            {member.user?.name?.charAt(0).toUpperCase() || 'U'}
                          </Avatar>
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography variant="body1" fontWeight={500}>
                                {member.user?.name || 'Unknown User'}
                              </Typography>
                              {member.role === 'admin' && (
                                <AdminIcon sx={{ fontSize: 16, color: '#fbbc04' }} />
                              )}
                              {member.isCurrentUser && (
                                <Chip label="You" size="small" sx={{ height: 20 }} />
                              )}
                            </Box>
                          }
                          secondary={member.user?.email || 'No email'}
                        />
                        <Chip
                          label={member.role}
                          size="small"
                          sx={{
                            backgroundColor: alpha(
                              member.role === 'admin' ? '#fbbc04' : 
                              member.role === 'manager' ? '#34a853' : '#4285f4',
                              0.1
                            ),
                            color: member.role === 'admin' ? '#fbbc04' : 
                                   member.role === 'manager' ? '#34a853' : '#4285f4',
                            textTransform: 'capitalize'
                          }}
                        />
                      </ListItem>
                      <Divider component="li" />
                    </React.Fragment>
                  ))
                ) : (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <PeopleIcon sx={{ fontSize: 48, color: '#9aa0a6', mb: 2 }} />
                    <Typography color="text.secondary">
                      No members found
                    </Typography>
                  </Box>
                )}
              </List>
            </CustomCard>
          </TabPanel>

          {/* Subscription Tab - Using Stack instead of Grid */}
          <TabPanel value={tabValue} index={2}>
            <Stack 
              direction={{ xs: 'column', md: 'row' }} 
              spacing={3}
            >
              <Box sx={{ flex: 1 }}>
                <InfoCard title="Current Plan" icon={<CreditCardIcon />} color={planColor}>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h5" fontWeight={700} sx={{ color: planColor, mb: 1 }}>
                      {company.subscription?.plan === 'trial' ? 'Free Trial' : 
                       company.subscription?.plan === 'basic' ? 'Basic Plan' :
                       company.subscription?.plan === 'professional' ? 'Professional Plan' : 
                       company.subscription?.plan === 'enterprise' ? 'Enterprise Plan' : 'Trial'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {company.subscription?.plan === 'trial' ? '14-day free trial' :
                       company.subscription?.plan === 'basic' ? '$29/month per seat' :
                       company.subscription?.plan === 'professional' ? '$79/month per seat' :
                       'Custom pricing'}
                    </Typography>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Status
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: statusColor }} />
                        <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                          {company.subscription?.status || 'Active'}
                        </Typography>
                      </Box>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Start Date
                      </Typography>
                      <Typography variant="body2">
                        {formatDate(company.subscription?.startDate) || formatDate(company.createdAt)}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        End Date
                      </Typography>
                      <Typography variant="body2">
                        {company.subscription?.endDate ? formatDate(company.subscription.endDate) : 'N/A'}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Auto Renew
                      </Typography>
                      <Typography variant="body2">
                        {company.subscription?.autoRenew ? 'Enabled' : 'Disabled'}
                      </Typography>
                    </Box>
                  </Box>
                </InfoCard>
              </Box>

              <Box sx={{ flex: 1 }}>
                <InfoCard title="Plan Features" icon={<CheckCircleIcon />} color="#34a853">
                  <List dense>
                    {(company.subscription?.features || [
                      'Lead management',
                      'Contact management',
                      'Deal tracking',
                      'Basic reporting',
                      'Email support'
                    ]).map((feature: string, index: number) => (
                      <ListItem key={index} sx={{ px: 0 }}>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <CheckCircleIcon sx={{ fontSize: 18, color: '#34a853' }} />
                        </ListItemIcon>
                        <ListItemText primary={feature} />
                      </ListItem>
                    ))}
                  </List>

                  {isAdmin && (
                    <Box sx={{ mt: 3 }}>
                      <CustomButton
                        fullWidth
                        variant="outlined"
                        onClick={() => router.push(`/company/${companyId}/billing/plans`)}
                      >
                        Change Plan
                      </CustomButton>
                    </Box>
                  )}
                </InfoCard>
              </Box>
            </Stack>
          </TabPanel>

          {/* Settings Tab */}
          <TabPanel value={tabValue} index={3}>
            <CustomCard sx={{
              p: 3,
              backgroundColor: darkMode ? '#202124' : '#ffffff',
              border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
            }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Company Settings
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Manage your company settings and preferences
              </Typography>

              <Stack spacing={2}>
                <Stack 
                  direction={{ xs: 'column', md: 'row' }} 
                  spacing={2}
                >
                  <Box sx={{ flex: 1 }}>
                    <CustomButton
                      fullWidth
                      variant="outlined"
                      startIcon={<EditIcon />}
                      onClick={handleEdit}
                      sx={{ justifyContent: 'flex-start' }}
                    >
                      Edit Company Information
                    </CustomButton>
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <CustomButton
                      fullWidth
                      variant="outlined"
                      startIcon={<PeopleIcon />}
                      onClick={handleManageMembers}
                      sx={{ justifyContent: 'flex-start' }}
                    >
                      Manage Members
                    </CustomButton>
                  </Box>
                </Stack>
                <Stack 
                  direction={{ xs: 'column', md: 'row' }} 
                  spacing={2}
                >
                  <Box sx={{ flex: 1 }}>
                    <CustomButton
                      fullWidth
                      variant="outlined"
                      startIcon={<SecurityIcon />}
                      onClick={() => router.push(`/company/${companyId}/security`)}
                      sx={{ justifyContent: 'flex-start' }}
                    >
                      Security & Access
                    </CustomButton>
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <CustomButton
                      fullWidth
                      variant="outlined"
                      startIcon={<ReceiptIcon />}
                      onClick={() => router.push(`/company/${companyId}/billing`)}
                      sx={{ justifyContent: 'flex-start' }}
                    >
                      Billing & Subscription
                    </CustomButton>
                  </Box>
                </Stack>
                <Stack 
                  direction={{ xs: 'column', md: 'row' }} 
                  spacing={2}
                >
                  <Box sx={{ flex: 1 }}>
                    <CustomButton
                      fullWidth
                      variant="outlined"
                      startIcon={<BusinessIcon />}
                      onClick={() => router.push(`/company/${companyId}/branding`)}
                      sx={{ justifyContent: 'flex-start' }}
                    >
                      Branding & Customization
                    </CustomButton>
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <CustomButton
                      fullWidth
                      variant="outlined"
                      startIcon={<EventIcon />}
                      onClick={() => router.push(`/company/${companyId}/audit-logs`)}
                      sx={{ justifyContent: 'flex-start' }}
                    >
                      Audit Logs
                    </CustomButton>
                  </Box>
                </Stack>
              </Stack>
            </CustomCard>
          </TabPanel>
        </Box>
      </Box>

      {/* Delete Company Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: darkMode ? '#202124' : '#ffffff',
            borderRadius: '12px',
          }
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1,
          borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
          pb: 2
        }}>
          <WarningIcon sx={{ color: '#ea4335' }} />
          <Typography variant="h6" component="span">
            Delete Company
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          {deleteError && (
            <Alert 
              severity="error" 
              message={deleteError} 
              sx={{ mb: 2 }} 
              onClose={() => setDeleteError(null)}
            />
          )}
          <DialogContentText sx={{ mb: 2 }}>
            Are you sure you want to delete <strong>{company?.name}</strong>?
          </DialogContentText>
          <Box sx={{ 
            mt: 2, 
            p: 2, 
            bgcolor: alpha('#ea4335', 0.05), 
            borderRadius: 1,
            border: `1px solid ${alpha('#ea4335', 0.2)}`
          }}>
            <Typography variant="body2" sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1,
              color: '#ea4335',
              fontWeight: 600,
              mb: 1
            }}>
              <WarningIcon fontSize="small" />
              This action will:
            </Typography>
            <Stack spacing={0.5} sx={{ pl: 3 }}>
              <Typography variant="body2" color="text.secondary" sx={{ display: 'list-item' }}>
                Deactivate the company workspace
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ display: 'list-item' }}>
                Remove all team members' access
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ display: 'list-item' }}>
                Cancel the subscription
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ display: 'list-item' }}>
                Data can be restored within 30 days
              </Typography>
            </Stack>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 2, borderTop: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}` }}>
          <Button 
            onClick={() => setDeleteDialogOpen(false)}
            sx={{ 
              color: darkMode ? '#e8eaed' : '#5f6368',
              '&:hover': {
                backgroundColor: alpha(darkMode ? '#e8eaed' : '#5f6368', 0.05),
              }
            }}
          >
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
              },
              '&.Mui-disabled': {
                backgroundColor: alpha('#ea4335', 0.5),
              }
            }}
          >
            {deleteLoading ? 'Deleting...' : 'Delete Company'}
          </CustomButton>
        </DialogActions>
      </Dialog>
    </MainLayout>
  );
}