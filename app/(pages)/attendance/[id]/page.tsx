// app/attendance/[id]/page.tsx - SUPER RESPONSIVE VERSION
"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Paper,
  Chip,
  LinearProgress,
  CircularProgress,
  Button,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Divider,
  IconButton,
  Tooltip,
  useTheme,
  useMediaQuery,
  alpha,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Badge,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  CalendarToday as CalendarIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Work as WorkIcon,
  AccountBalance as BankIcon,
  ContactEmergency as EmergencyIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  Edit as EditIcon,
  Refresh as RefreshIcon,
  AccessTime as TimeIcon,
  Today as TodayIcon,
  EventNote as EventNoteIcon,
  LocationOn as LocationIcon,
  AttachMoney as MoneyIcon,
  DateRange as DateRangeIcon,
  Menu as MenuIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from "@mui/icons-material";
import { MainLayout } from "@/components/Layout/MainLayout";

interface Day {
  date: string;
  status: "Present" | "Absent";
  checkIn?: string;
  checkOut?: string;
  workHours?: number;
  overtime?: number;
  notes?: string;
  lateReason?: string;
}

interface Employee {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  role: string;
  department?: string;
  salary: number;
  salaryType: string;
  joiningDate: string;
  address?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relation: string;
  };
  bankDetails?: {
    accountNumber: string;
    bankName: string;
    ifscCode: string;
    accountHolder: string;
  };
  documents?: {
    aadhaar?: string;
    pan?: string;
    license?: string;
  };
  leaveBalance: number;
  isActive: boolean;
  days: Day[];
}

export default function EmployeeAttendanceDetails() {
  const params = useParams();
  const router = useRouter();
  const employeeId = params.id as string;
  const theme = useTheme();
  
  // Media queries for responsive design
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(isMobile ? null : 'summary');

  const fetchEmployeeDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/attendance/${employeeId}`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 401) {
        setError("Session expired. Please login again.");
        return;
      }

      if (response.status === 402) {
        const errorData = await response.json();
        setError(errorData.error || "Subscription required");
        return;
      }

      if (response.status === 404) {
        const errorData = await response.json();
        setError(errorData.error || "Employee not found");
        setEmployee(null);
        return;
      }

      if (!response.ok) {
        throw new Error(`Failed to fetch employee details: ${response.status}`);
      }

      const data = await response.json();
      setEmployee(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setEmployee(null);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const refreshData = () => {
    setRefreshing(true);
    fetchEmployeeDetails();
  };

  useEffect(() => {
    if (employeeId) {
      fetchEmployeeDetails();
    } else {
      setError("No employee ID provided");
      setLoading(false);
    }
  }, [employeeId]);

  // Calculate statistics
  const presentCount = employee
    ? employee.days.filter((d) => d.status === "Present").length
    : 0;
  const absentCount = employee ? employee.days.length - presentCount : 0;
  const attendancePercentage =
    employee && employee.days.length > 0
      ? Math.round((presentCount / employee.days.length) * 100)
      : 0;

  // Calculate total work hours and overtime
  const totalWorkHours = employee ? employee.days.reduce((sum, day) => sum + (day.workHours || 0), 0) : 0;
  const totalOvertime = employee ? employee.days.reduce((sum, day) => sum + (day.overtime || 0), 0) : 0;

  // Get current month and year for display
  const currentMonth = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });

  // Generate avatar color based on employee name
  const getAvatarColor = (name: string) => {
    const colors = [
      '#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5',
      '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4caf50',
      '#8bc34a', '#cddc39', '#ffeb3b', '#ffc107', '#ff9800',
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  if (loading) {
    return (
      <MainLayout title="Loading...">
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "70vh",
            flexDirection: "column",
            gap: 3,
            p: 3,
          }}
        >
          <CircularProgress size={isMobile ? 40 : 60} />
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant={isMobile ? "h6" : "h5"} color="text.secondary" gutterBottom>
              Loading employee details...
            </Typography>
            <Typography variant="body2" color="text.secondary">
              ID: {employeeId}
            </Typography>
          </Box>
        </Box>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout title="Error">
        <Box sx={{ p: 3, maxWidth: 800, margin: '0 auto' }}>
          <Alert 
            severity="error" 
            sx={{ 
              mb: 3,
              borderRadius: 2,
              '& .MuiAlert-message': {
                width: '100%'
              }
            }}
            action={
              isMobile ? null : (
                <Button color="inherit" size="small" onClick={refreshData}>
                  Retry
                </Button>
              )
            }
          >
            <Typography variant={isMobile ? "body1" : "h6"} fontWeight="bold" gutterBottom>
              {error}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 1, alignItems: isMobile ? 'flex-start' : 'center' }}>
              <Typography variant="body2">
                Employee ID: {employeeId}
              </Typography>
              {isMobile && (
                <Button color="inherit" size="small" onClick={refreshData} sx={{ mt: 1 }}>
                  Retry
                </Button>
              )}
            </Box>
          </Alert>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => router.push("/attendance")}
            variant="contained"
            fullWidth={isMobile}
            sx={{ 
              minHeight: isMobile ? 48 : 40,
              fontSize: isMobile ? '1rem' : '0.875rem'
            }}
          >
            Back to Attendance
          </Button>
        </Box>
      </MainLayout>
    );
  }

  if (!employee) {
    return (
      <MainLayout title="Not Found">
        <Box sx={{ p: 3, maxWidth: 800, margin: '0 auto' }}>
          <Alert 
            severity="warning" 
            sx={{ 
              mb: 3,
              borderRadius: 2,
            }}
          >
            <Typography variant="h6" gutterBottom>
              Employee not found
            </Typography>
            <Typography variant="body2">
              No employee found with ID: {employeeId}
            </Typography>
          </Alert>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => router.push("/attendance")}
            variant="contained"
            fullWidth={isMobile}
            sx={{ 
              minHeight: isMobile ? 48 : 40,
              fontSize: isMobile ? '1rem' : '0.875rem'
            }}
          >
            Back to Attendance
          </Button>
        </Box>
      </MainLayout>
    );
  }

  // Mobile Navigation Drawer
  const MobileNav = () => (
    <Drawer
      anchor="left"
      open={showMobileMenu}
      onClose={() => setShowMobileMenu(false)}
      sx={{
        '& .MuiDrawer-paper': {
          width: '100%',
          maxWidth: 280,
          p: 2,
        }
      }}
    >
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="h6" fontWeight="bold">
          Quick Navigation
        </Typography>
      </Box>
      <List>
        {['summary', 'details', 'attendance'].map((section) => (
          <ListItem
            key={section}
            button
            onClick={() => {
              setExpandedSection(section);
              setShowMobileMenu(false);
            }}
            sx={{
              borderRadius: 1,
              mb: 1,
              bgcolor: expandedSection === section ? 'action.selected' : 'transparent',
            }}
          >
            <ListItemText
              primary={
                <Typography fontWeight={expandedSection === section ? 'bold' : 'normal'}>
                  {section === 'summary' && 'Summary'}
                  {section === 'details' && 'Employee Details'}
                  {section === 'attendance' && 'Attendance Records'}
                </Typography>
              }
            />
            {expandedSection === section ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </ListItem>
        ))}
      </List>
    </Drawer>
  );

  // Summary Cards Component - Responsive
  const SummaryCards = () => (
    <Box sx={{ 
      display: 'grid',
      gridTemplateColumns: {
        xs: '1fr',
        sm: 'repeat(2, 1fr)',
        md: 'repeat(4, 1fr)',
      },
      gap: 2,
      mb: 3,
    }}>
      <Card sx={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
        color: 'white',
        p: isMobile ? 2 : 3,
        minHeight: 120,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
      }}>
        <Typography variant={isMobile ? "h4" : "h3"} fontWeight="bold" gutterBottom={!isMobile}>
          {presentCount}
        </Typography>
        <Typography variant={isMobile ? "body2" : "body1"}>
          Present Days
        </Typography>
      </Card>
      
      <Card sx={{ 
        background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', 
        color: 'white',
        p: isMobile ? 2 : 3,
        minHeight: 120,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
      }}>
        <Typography variant={isMobile ? "h4" : "h3"} fontWeight="bold" gutterBottom={!isMobile}>
          {absentCount}
        </Typography>
        <Typography variant={isMobile ? "body2" : "body1"}>
          Absent Days
        </Typography>
      </Card>
      
      <Card sx={{ 
        background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', 
        color: 'white',
        p: isMobile ? 2 : 3,
        minHeight: 120,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
      }}>
        <Typography variant={isMobile ? "h4" : "h3"} fontWeight="bold" gutterBottom={!isMobile}>
          {attendancePercentage}%
        </Typography>
        <Typography variant={isMobile ? "body2" : "body1"}>
          Attendance Rate
        </Typography>
      </Card>
      
      <Card sx={{ 
        background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', 
        color: 'white',
        p: isMobile ? 2 : 3,
        minHeight: 120,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
      }}>
        <Typography variant={isMobile ? "h4" : "h3"} fontWeight="bold" gutterBottom={!isMobile}>
          {totalWorkHours.toFixed(1)}
        </Typography>
        <Typography variant={isMobile ? "body2" : "body1"}>
          Total Hours
        </Typography>
      </Card>
    </Box>
  );

  return (
    <MainLayout title={`${employee.name} - Attendance`}>
      <Box sx={{ 
        p: { xs: 1.5, sm: 2, md: 3 },
        maxWidth: 1400, 
        margin: "0 auto",
        minHeight: '100vh',
      }}>
        {/* Mobile Navigation */}
        <MobileNav />

        {/* Header */}
        <Box sx={{ mb: { xs: 2, sm: 3, md: 4 } }}>
          {/* Mobile Header */}
          {isMobile && (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Button
                startIcon={<ArrowBackIcon />}
                onClick={() => router.push("/attendance")}
                size="small"
                sx={{ minWidth: 'auto' }}
              >
                Back
              </Button>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <IconButton size="small" onClick={() => setShowMobileMenu(true)}>
                  <MenuIcon />
                </IconButton>
                <IconButton size="small" onClick={refreshData} disabled={refreshing}>
                  <RefreshIcon />
                </IconButton>
              </Box>
            </Box>
          )}

          {/* Main Header */}
          <Box sx={{ 
            display: "flex", 
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between", 
            alignItems: { xs: "flex-start", sm: "center" },
            gap: { xs: 2, sm: 3 },
            mb: 3,
          }}>
            <Box sx={{ 
              display: "flex", 
              alignItems: "center", 
              gap: 2,
              width: { xs: '100%', sm: 'auto' }
            }}>
              {!isMobile && (
                <Button
                  startIcon={<ArrowBackIcon />}
                  onClick={() => router.push("/attendance")}
                  variant="outlined"
                  size={isMobile ? "small" : "medium"}
                  sx={{ flexShrink: 0 }}
                >
                  Back
                </Button>
              )}
              
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 2,
                flex: 1,
              }}>
                <Avatar
                  sx={{
                    width: { xs: 60, sm: 70, md: 80 },
                    height: { xs: 60, sm: 70, md: 80 },
                    bgcolor: getAvatarColor(employee.name),
                    fontSize: { xs: '1.5rem', sm: '2rem' },
                    fontWeight: 'bold',
                    border: `3px solid ${theme.palette.background.paper}`,
                    boxShadow: 2,
                  }}
                >
                  {employee.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </Avatar>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography 
                    variant={isMobile ? "h5" : "h4"} 
                    component="h1" 
                    fontWeight="bold" 
                    gutterBottom
                    sx={{ 
                      wordBreak: 'break-word',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                    }}
                  >
                    {employee.name}
                  </Typography>
                  <Box sx={{ 
                    display: "flex", 
                    gap: 1, 
                    flexWrap: "wrap",
                    alignItems: 'center',
                  }}>
                    <Chip
                      label={employee.role}
                      color="primary"
                      size="small"
                      sx={{ height: 24 }}
                    />
                    {employee.department && (
                      <Chip
                        label={employee.department}
                        color="secondary"
                        variant="outlined"
                        size="small"
                        sx={{ height: 24 }}
                      />
                    )}
                    <Chip
                      label={employee.isActive ? "Active" : "Inactive"}
                      color={employee.isActive ? "success" : "default"}
                      variant="outlined"
                      size="small"
                      sx={{ height: 24 }}
                    />
                  </Box>
                </Box>
              </Box>
            </Box>
            
            {!isMobile && (
              <Box sx={{ display: 'flex', gap: 1, flexShrink: 0 }}>
                <Tooltip title="Refresh Data">
                  <IconButton 
                    onClick={refreshData} 
                    disabled={refreshing}
                    size={isMobile ? "small" : "medium"}
                  >
                    <RefreshIcon />
                  </IconButton>
                </Tooltip>
                <Button
                  startIcon={<EditIcon />}
                  variant="outlined"
                  onClick={() => router.push(`/attendance/edit/${employeeId}`)}
                  size={isMobile ? "small" : "medium"}
                >
                  Edit
                </Button>
              </Box>
            )}
          </Box>

          {/* Mobile Action Buttons */}
          {isMobile && (
            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', mb: 2 }}>
              <Button
                startIcon={<EditIcon />}
                variant="outlined"
                onClick={() => router.push(`/attendance/edit/${employeeId}`)}
                size="small"
                fullWidth
              >
                Edit Profile
              </Button>
            </Box>
          )}
        </Box>

        {/* Mobile Navigation Tabs */}
        {isMobile && (
          <Box sx={{ 
            display: 'flex', 
            mb: 2,
            borderBottom: 1,
            borderColor: 'divider',
            overflow: 'auto',
            '&::-webkit-scrollbar': { display: 'none' },
            msOverflowStyle: 'none',
            scrollbarWidth: 'none',
          }}>
            {['summary', 'details', 'attendance'].map((section) => (
              <Button
                key={section}
                onClick={() => toggleSection(section)}
                sx={{
                  flex: 1,
                  minWidth: 'fit-content',
                  borderRadius: 0,
                  borderBottom: expandedSection === section ? 2 : 0,
                  borderColor: 'primary.main',
                  py: 1.5,
                  color: expandedSection === section ? 'primary.main' : 'text.secondary',
                  fontWeight: expandedSection === section ? 'bold' : 'normal',
                  whiteSpace: 'nowrap',
                  px: 2,
                }}
              >
                {section === 'summary' && 'Summary'}
                {section === 'details' && 'Details'}
                {section === 'attendance' && 'Attendance'}
              </Button>
            ))}
          </Box>
        )}

        {/* Content Area */}
        <Box sx={{ 
          display: 'flex',
          flexDirection: { xs: 'column', lg: 'row' },
          gap: { xs: 2, sm: 3, md: 4 },
        }}>
          {/* Left Column - Employee Info */}
          <Box sx={{ 
            flex: { xs: '0 0 auto', lg: '0 0 300px' },
            width: { xs: '100%', lg: '300px' },
            display: {
              xs: expandedSection === 'details' || !expandedSection ? 'block' : 'none',
              lg: 'block'
            }
          }}>
            <Card sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PersonIcon fontSize="small" /> Basic Information
                </Typography>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PhoneIcon color="action" fontSize="small" sx={{ flexShrink: 0 }} />
                    <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
                      {employee.phone}
                    </Typography>
                  </Box>
                  
                  {employee.email && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <EmailIcon color="action" fontSize="small" sx={{ flexShrink: 0 }} />
                      <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
                        {employee.email}
                      </Typography>
                    </Box>
                  )}
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <WorkIcon color="action" fontSize="small" sx={{ flexShrink: 0 }} />
                    <Typography variant="body2">
                      ₹{employee.salary.toLocaleString()} {employee.salaryType}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <DateRangeIcon color="action" fontSize="small" sx={{ flexShrink: 0 }} />
                    <Typography variant="body2">
                      Joined: {new Date(employee.joiningDate).toLocaleDateString('en-IN')}
                    </Typography>
                  </Box>
                  
                  {employee.address && (
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                      <LocationIcon color="action" fontSize="small" sx={{ flexShrink: 0, mt: 0.5 }} />
                      <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
                        {employee.address}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </CardContent>
            </Card>

            {/* Additional Information */}
            {(employee.emergencyContact || employee.bankDetails) && (
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Additional Info
                  </Typography>
                  
                  {employee.emergencyContact && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <EmergencyIcon fontSize="small" /> Emergency Contact
                      </Typography>
                      <Box sx={{ pl: 1.5 }}>
                        <Typography variant="body2">
                          {employee.emergencyContact.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {employee.emergencyContact.phone} • {employee.emergencyContact.relation}
                        </Typography>
                      </Box>
                    </Box>
                  )}
                  
                  {employee.bankDetails && (
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <BankIcon fontSize="small" /> Bank Details
                      </Typography>
                      <Box sx={{ pl: 1.5 }}>
                        <Typography variant="body2">
                          {employee.bankDetails.bankName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          A/C: {employee.bankDetails.accountNumber}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          IFSC: {employee.bankDetails.ifscCode}
                        </Typography>
                      </Box>
                    </Box>
                  )}
                </CardContent>
              </Card>
            )}
          </Box>

          {/* Right Column - Main Content */}
          <Box sx={{ 
            flex: 1,
            display: {
              xs: expandedSection === 'summary' || expandedSection === 'attendance' || !expandedSection ? 'block' : 'none',
              lg: 'block'
            }
          }}>
            {/* Summary Section */}
            <Box sx={{ 
              display: {
                xs: expandedSection === 'summary' || !expandedSection ? 'block' : 'none',
                lg: 'block'
              },
              mb: { xs: 3, md: 4 }
            }}>
              <SummaryCards />
              
              {/* Attendance Progress */}
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" fontWeight="bold">
                      Attendance Progress - {currentMonth}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {presentCount}/{employee.days.length} days
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={attendancePercentage}
                    sx={{
                      height: 10,
                      borderRadius: 5,
                      backgroundColor: alpha(theme.palette.primary.main, 0.1),
                      "& .MuiLinearProgress-bar": {
                        backgroundColor:
                          attendancePercentage >= 90
                            ? theme.palette.success.main
                            : attendancePercentage >= 75
                            ? theme.palette.warning.main
                            : theme.palette.error.main,
                        borderRadius: 5,
                      },
                    }}
                  />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                    <Typography variant="caption" color="text.secondary">
                      Goal: 90%
                    </Typography>
                    <Typography 
                      variant="caption" 
                      fontWeight="bold"
                      color={
                        attendancePercentage >= 90
                          ? theme.palette.success.main
                          : attendancePercentage >= 75
                          ? theme.palette.warning.main
                          : theme.palette.error.main
                      }
                    >
                      {attendancePercentage}%
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Box>

            {/* Attendance Records */}
            <Box sx={{ 
              display: {
                xs: expandedSection === 'attendance' || !expandedSection ? 'block' : 'none',
                lg: 'block'
              }
            }}>
              <Card>
                <CardContent sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: { xs: 'column', sm: 'row' },
                    justifyContent: 'space-between', 
                    alignItems: { xs: 'flex-start', sm: 'center' },
                    mb: 3,
                    gap: 1
                  }}>
                    <Typography variant="h6" fontWeight="bold">
                      Daily Attendance - {currentMonth}
                    </Typography>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      gap: 1 
                    }}>
                      <Typography variant="body2" color="text.secondary">
                        Total: {employee.days.length} days
                      </Typography>
                      <Chip
                        size="small"
                        label={`${presentCount} Present`}
                        color="success"
                        variant="outlined"
                      />
                      <Chip
                        size="small"
                        label={`${absentCount} Absent`}
                        color="error"
                        variant="outlined"
                      />
                    </Box>
                  </Box>

                  {employee.days.length === 0 ? (
                    <Box sx={{ 
                      textAlign: 'center', 
                      py: 6,
                      px: 2 
                    }}>
                      <CalendarIcon
                        sx={{ 
                          fontSize: { xs: 48, sm: 64 }, 
                          color: 'text.secondary', 
                          mb: 2, 
                          opacity: 0.5 
                        }}
                      />
                      <Typography variant={isMobile ? "h6" : "h5"} gutterBottom color="text.secondary">
                        No Attendance Records
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        No attendance has been recorded for {currentMonth} yet.
                      </Typography>
                    </Box>
                  ) : (
                    <TableContainer 
                      component={Paper} 
                      elevation={0}
                      sx={{ 
                        borderRadius: 2,
                        border: `1px solid ${theme.palette.divider}`,
                        maxHeight: { xs: 400, md: 500 },
                        overflow: 'auto',
                        '&::-webkit-scrollbar': {
                          width: '8px',
                          height: '8px',
                        },
                        '&::-webkit-scrollbar-track': {
                          background: theme.palette.grey[100],
                          borderRadius: '4px',
                        },
                        '&::-webkit-scrollbar-thumb': {
                          background: theme.palette.grey[400],
                          borderRadius: '4px',
                          '&:hover': {
                            background: theme.palette.grey[500],
                          },
                        },
                      }}
                    >
                      <Table 
                        stickyHeader
                        sx={{ 
                          minWidth: isMobile ? 600 : 'auto',
                          '& .MuiTableCell-head': {
                            fontWeight: 'bold',
                            backgroundColor: theme.palette.grey[50],
                            whiteSpace: 'nowrap',
                          },
                          '& .MuiTableCell-body': {
                            py: { xs: 1, sm: 1.5 },
                          }
                        }}
                      >
                        <TableHead>
                          <TableRow>
                            <TableCell>Date</TableCell>
                            {!isMobile && <TableCell>Day</TableCell>}
                            <TableCell align="center">Status</TableCell>
                            <TableCell align="center">Check In</TableCell>
                            <TableCell align="center">Check Out</TableCell>
                            <TableCell align="center">Hours</TableCell>
                            <TableCell align="center">Overtime</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {employee.days.map((day) => {
                            const date = new Date(day.date);
                            const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
                            const isToday = date.toDateString() === new Date().toDateString();

                            return (
                              <TableRow
                                key={day.date}
                                hover
                                sx={{
                                  '&:last-child td': { border: 0 },
                                  backgroundColor: isToday ? alpha(theme.palette.primary.main, 0.04) : 'inherit',
                                  '&:hover': {
                                    backgroundColor: alpha(theme.palette.primary.main, 0.08),
                                  },
                                }}
                              >
                                <TableCell>
                                  <Box>
                                    <Typography variant="body2" fontWeight={isToday ? 'bold' : 'normal'}>
                                      {date.toLocaleDateString("en-IN")}
                                    </Typography>
                                    {isMobile && (
                                      <Typography variant="caption" color="text.secondary">
                                        {dayName}
                                      </Typography>
                                    )}
                                    {isToday && (
                                      <Chip 
                                        label="Today" 
                                        size="small" 
                                        sx={{ 
                                          height: 20,
                                          fontSize: '0.65rem',
                                          ml: 1,
                                          mt: 0.5
                                        }} 
                                      />
                                    )}
                                  </Box>
                                </TableCell>
                                {!isMobile && (
                                  <TableCell>
                                    <Typography variant="body2" color="text.secondary">
                                      {dayName}
                                    </Typography>
                                  </TableCell>
                                )}
                                <TableCell align="center">
                                  <Badge
                                    color={day.status === "Present" ? "success" : "error"}
                                    variant="dot"
                                    sx={{ mr: 1 }}
                                  >
                                    <Typography 
                                      variant="caption" 
                                      fontWeight="bold"
                                      color={day.status === "Present" ? "success.main" : "error.main"}
                                    >
                                      {day.status}
                                    </Typography>
                                  </Badge>
                                </TableCell>
                                <TableCell align="center">
                                  <Typography variant="body2" fontWeight="medium">
                                    {day.checkIn || '-'}
                                  </Typography>
                                </TableCell>
                                <TableCell align="center">
                                  <Typography variant="body2" fontWeight="medium">
                                    {day.checkOut || '-'}
                                  </Typography>
                                </TableCell>
                                <TableCell align="center">
                                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                                    <TimeIcon fontSize="small" color="action" />
                                    <Typography variant="body2" fontWeight="bold">
                                      {day.workHours ? `${day.workHours.toFixed(1)}h` : '-'}
                                    </Typography>
                                  </Box>
                                </TableCell>
                                <TableCell align="center">
                                  <Typography 
                                    variant="body2" 
                                    fontWeight="bold"
                                    color={day.overtime ? "warning.main" : "text.secondary"}
                                  >
                                    {day.overtime ? `${day.overtime.toFixed(1)}h` : '-'}
                                  </Typography>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}
                </CardContent>
              </Card>
            </Box>
          </Box>
        </Box>
      </Box>
    </MainLayout>
  );
}