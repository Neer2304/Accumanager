// app/attendance/[id]/page.tsx - FIXED RESPONSIVE VERSION
"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Box,
  CircularProgress,
  useTheme,
  useMediaQuery,
  Typography,
  alpha,
  Breadcrumbs,
  IconButton,
  Avatar,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Badge,
  Paper,
} from "@mui/material";
import {
  Home as HomeIcon,
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Refresh as RefreshIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Work as WorkIcon,
  DateRange as DateRangeIcon,
  LocationOn as LocationIcon,
  ContactEmergency as EmergencyIcon,
  AccountBalance as BankIcon,
  CalendarToday as CalendarIcon,
  AccessTime as TimeIcon,
} from "@mui/icons-material";
import Link from "next/link";
import { MainLayout } from "@/components/Layout/MainLayout";
import { Alert } from "@/components/ui/Alert";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { Employee, Day } from "@/types/attendance";

export default function EmployeeAttendanceDetails() {
  const params = useParams();
  const router = useRouter();
  const employeeId = params.id as string;
  const theme = useTheme();
  
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const darkMode = theme.palette.mode === 'dark';
  const [isMounted, setIsMounted] = useState(false);
  
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedSection, setExpandedSection] = useState<string | null>('summary');

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
    setIsMounted(true);
    if (employeeId) {
      fetchEmployeeDetails();
    } else {
      setError("No employee ID provided");
      setLoading(false);
    }
  }, [employeeId]);

  // Calculate statistics
  const presentCount = employee
    ? employee.days.filter((d: Day) => d.status === "Present").length
    : 0;
  const absentCount = employee ? employee.days.length - presentCount : 0;
  const attendancePercentage =
    employee && employee.days.length > 0
      ? Math.round((presentCount / employee.days.length) * 100)
      : 0;
  const totalWorkHours = employee ? employee.days.reduce((sum: number, day: Day) => sum + (day.workHours || 0), 0) : 0;
  const currentMonth = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const getAvatarColor = (name: string) => {
    const colors = [
      '#4285f4', '#34a853', '#ea4335', '#fbbc04', '#8ab4f8',
      '#81c995', '#f28b82', '#fdd663', '#5f6368', '#9aa0a6',
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  if (!isMounted || loading) {
    return (
      <MainLayout title="Loading...">
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '60vh',
          backgroundColor: darkMode ? '#202124' : '#ffffff',
        }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" sx={{ color: darkMode ? '#e8eaed' : '#202124', mb: 2 }}>
              Loading employee details...
            </Typography>
            <CircularProgress sx={{ color: '#4285f4' }} />
          </Box>
        </Box>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout title="Error">
        <Box sx={{ 
          backgroundColor: darkMode ? '#202124' : '#ffffff',
          color: darkMode ? '#e8eaed' : '#202124',
          minHeight: '100vh',
          p: { xs: 1, sm: 2, md: 3 },
        }}>
          <Alert
            severity="error"
            title="Error Loading Employee"
            message={error}
            dismissible
            onDismiss={() => setError(null)}
            sx={{ mb: 3 }}
          />
          <Button
            variant="contained"
            onClick={() => router.push("/attendance")}
            iconLeft={<ArrowBackIcon />}
            fullWidth={isMobile}
            sx={{ 
              backgroundColor: '#4285f4',
              '&:hover': { backgroundColor: '#3367d6' }
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
        <Box sx={{ 
          backgroundColor: darkMode ? '#202124' : '#ffffff',
          color: darkMode ? '#e8eaed' : '#202124',
          minHeight: '100vh',
          p: { xs: 1, sm: 2, md: 3 },
        }}>
          <Alert
            severity="warning"
            title="Employee Not Found"
            message={`No employee found with ID: ${employeeId}`}
            sx={{ mb: 3 }}
          />
          <Button
            variant="contained"
            onClick={() => router.push("/attendance")}
            iconLeft={<ArrowBackIcon />}
            fullWidth={isMobile}
            sx={{ 
              backgroundColor: '#4285f4',
              '&:hover': { backgroundColor: '#3367d6' }
            }}
          >
            Back to Attendance
          </Button>
        </Box>
      </MainLayout>
    );
  }

  return (
    <MainLayout title={`${employee?.name || 'Employee'} - Attendance`}>
      <Box sx={{ 
        backgroundColor: darkMode ? '#202124' : '#ffffff',
        color: darkMode ? '#e8eaed' : '#202124',
        minHeight: '100vh',
      }}>
        {/* Header */}
        <Box sx={{ 
          p: { xs: 1, sm: 2, md: 3 },
          borderBottom: darkMode ? '1px solid #3c4043' : '1px solid #dadce0',
          background: darkMode 
            ? 'linear-gradient(135deg, #0d3064 0%, #202124 100%)'
            : 'linear-gradient(135deg, #e3f2fd 0%, #ffffff 100%)',
        }}>
          <Breadcrumbs sx={{ 
            mb: { xs: 1, sm: 2 }, 
            fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.85rem' } 
          }}>
            <Link 
              href="/dashboard" 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                textDecoration: 'none', 
                color: darkMode ? '#9aa0a6' : '#5f6368', 
                fontWeight: 300,
              }}
            >
              <HomeIcon sx={{ mr: 0.5, fontSize: { xs: '14px', sm: '16px', md: '18px' } }} />
              Dashboard
            </Link>
            <Link 
              href="/attendance" 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                textDecoration: 'none', 
                color: darkMode ? '#9aa0a6' : '#5f6368', 
                fontWeight: 300,
              }}
            >
              Attendance
            </Link>
            <Typography color={darkMode ? '#e8eaed' : '#202124'} fontWeight={400}>
              {employee.name}
            </Typography>
          </Breadcrumbs>

          <Box sx={{ 
            textAlign: 'center', 
            mb: { xs: 2, sm: 3, md: 4 },
            px: { xs: 1, sm: 2, md: 3 },
          }}>
            <Typography 
              variant={isMobile ? "h5" : isTablet ? "h4" : "h3"} 
              fontWeight={500} 
              gutterBottom
              sx={{ 
                fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
                letterSpacing: '-0.02em',
                lineHeight: 1.2,
              }}
            >
              Attendance Details
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
              View attendance records for {employee.name}
            </Typography>
          </Box>

          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: 2,
            flexWrap: 'wrap',
            mt: 3,
          }}>
            <Chip
              label={`${presentCount} Present`}
              variant="outlined"
              sx={{
                backgroundColor: darkMode ? alpha('#34a853', 0.1) : alpha('#34a853', 0.08),
                borderColor: alpha('#34a853', 0.3),
                color: darkMode ? '#81c995' : '#34a853',
              }}
            />
            <Chip
              label={`${absentCount} Absent`}
              variant="outlined"
              sx={{
                backgroundColor: darkMode ? alpha('#ea4335', 0.1) : alpha('#ea4335', 0.08),
                borderColor: alpha('#ea4335', 0.3),
                color: darkMode ? '#f28b82' : '#ea4335',
              }}
            />
            <Chip
              label={`${attendancePercentage}% Attendance`}
              variant="outlined"
              sx={{
                backgroundColor: darkMode ? alpha('#4285f4', 0.1) : alpha('#4285f4', 0.08),
                borderColor: alpha('#4285f4', 0.3),
                color: darkMode ? '#8ab4f8' : '#4285f4',
              }}
            />
          </Box>
        </Box>

        {/* Main Content */}
        <Box sx={{ 
          p: { xs: 1, sm: 2, md: 3 },
          maxWidth: 1400, 
          margin: "0 auto",
          width: '100%',
          overflow: 'hidden', // Prevent horizontal overflow
        }}>
          {/* Header with Actions */}
          <Card
            title="Employee Details"
            subtitle={`${employee.name} • ${employee.role}`}
            action={
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                <IconButton
                  onClick={refreshData}
                  disabled={refreshing}
                  sx={{ 
                    color: darkMode ? '#e8eaed' : '#202124',
                    '&:hover': { backgroundColor: alpha('#4285f4', 0.1) }
                  }}
                >
                  <RefreshIcon />
                </IconButton>
                <Button
                  variant="outlined"
                  onClick={() => router.push(`/attendance/edit/${employee._id}`)}
                  iconLeft={<EditIcon />}
                  size="medium"
                  sx={{
                    borderColor: darkMode ? '#3c4043' : '#dadce0',
                    color: darkMode ? '#e8eaed' : '#202124',
                  }}
                >
                  Edit
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => router.push("/attendance")}
                  iconLeft={<ArrowBackIcon />}
                  size="medium"
                  sx={{
                    borderColor: darkMode ? '#3c4043' : '#dadce0',
                    color: darkMode ? '#e8eaed' : '#202124',
                  }}
                >
                  Back
                </Button>
              </Box>
            }
            hover
            sx={{ 
              mb: { xs: 2, sm: 3, md: 4 },
              backgroundColor: darkMode ? '#202124' : '#ffffff',
              border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
            }}
          >
            <Box sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: { xs: 'flex-start', sm: 'center' },
              gap: 3,
              mt: 2,
            }}>
              <Avatar
                sx={{
                  width: { xs: 80, sm: 100, md: 120 },
                  height: { xs: 80, sm: 100, md: 120 },
                  bgcolor: getAvatarColor(employee.name),
                  fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                  fontWeight: 'bold',
                  border: `3px solid ${alpha('#4285f4', 0.3)}`,
                }}
              >
                {employee.name.split(' ').map(n => n[0]).join('').toUpperCase()}
              </Avatar>
              
              <Box sx={{ flex: 1, minWidth: 0, width: '100%' }}>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                  <Chip
                    label={employee.role}
                    size="medium"
                    sx={{
                      backgroundColor: darkMode ? alpha('#4285f4', 0.1) : alpha('#4285f4', 0.08),
                      color: '#4285f4',
                      borderColor: alpha('#4285f4', 0.3),
                    }}
                  />
                  {employee.department && (
                    <Chip
                      label={employee.department}
                      size="medium"
                      sx={{
                        backgroundColor: darkMode ? alpha('#34a853', 0.1) : alpha('#34a853', 0.08),
                        color: '#34a853',
                        borderColor: alpha('#34a853', 0.3),
                      }}
                    />
                  )}
                  <Chip
                    label={employee.isActive ? "Active" : "Inactive"}
                    size="medium"
                    sx={{
                      backgroundColor: employee.isActive 
                        ? darkMode ? alpha('#34a853', 0.1) : alpha('#34a853', 0.08)
                        : darkMode ? alpha('#ea4335', 0.1) : alpha('#ea4335', 0.08),
                      color: employee.isActive ? '#34a853' : '#ea4335',
                      borderColor: alpha(employee.isActive ? '#34a853' : '#ea4335', 0.3),
                    }}
                  />
                </Box>
                
                <Box sx={{ 
                  display: 'grid', 
                  gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
                  gap: 2,
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PhoneIcon sx={{ 
                      color: darkMode ? '#9aa0a6' : '#5f6368',
                      fontSize: { xs: 18, sm: 20 },
                    }} />
                    <Typography variant="body2" sx={{ 
                      color: darkMode ? '#e8eaed' : '#202124',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}>
                      {employee.phone}
                    </Typography>
                  </Box>
                  {employee.email && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <EmailIcon sx={{ 
                        color: darkMode ? '#9aa0a6' : '#5f6368',
                        fontSize: { xs: 18, sm: 20 },
                      }} />
                      <Typography variant="body2" sx={{ 
                        color: darkMode ? '#e8eaed' : '#202124',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}>
                        {employee.email}
                      </Typography>
                    </Box>
                  )}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <WorkIcon sx={{ 
                      color: darkMode ? '#9aa0a6' : '#5f6368',
                      fontSize: { xs: 18, sm: 20 },
                    }} />
                    <Typography variant="body2" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                      ₹{employee.salary.toLocaleString()} {employee.salaryType}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Card>

          {/* Mobile Navigation Tabs */}
          {isMobile && (
            <Box sx={{ 
              display: 'flex', 
              mb: 3,
              borderBottom: 1,
              borderColor: darkMode ? '#3c4043' : '#dadce0',
              overflow: 'auto',
              '&::-webkit-scrollbar': { display: 'none' },
            }}>
              {['summary', 'details', 'attendance'].map((section) => (
                <Button
                  key={section}
                  onClick={() => toggleSection(section)}
                  variant="text"
                  sx={{
                    flex: 1,
                    minWidth: 'fit-content',
                    borderRadius: 0,
                    borderBottom: expandedSection === section ? 2 : 0,
                    borderColor: '#4285f4',
                    py: 1.5,
                    color: expandedSection === section ? '#4285f4' : (darkMode ? '#9aa0a6' : '#5f6368'),
                    fontWeight: expandedSection === section ? 600 : 400,
                    whiteSpace: 'nowrap',
                    px: 2,
                    textTransform: 'capitalize',
                  }}
                >
                  {section}
                </Button>
              ))}
            </Box>
          )}

          {/* Content Area */}
          <Box sx={{ 
            display: 'flex',
            flexDirection: { xs: 'column', lg: 'row' },
            gap: { xs: 2, sm: 3, md: 4 },
            width: '100%',
            overflow: 'hidden',
          }}>
            {/* Left Column - Employee Info */}
            <Box sx={{ 
              flex: { xs: '0 0 auto', lg: '0 0 320px' },
              width: { xs: '100%', lg: '320px' },
              minWidth: 0,
              display: {
                xs: expandedSection === 'details' || !expandedSection || !isMobile ? 'block' : 'none',
                lg: 'block'
              }
            }}>
              {/* Basic Information Card */}
              <Card
                title="Basic Information"
                hover
                sx={{ 
                  mb: 3,
                  backgroundColor: darkMode ? '#303134' : '#ffffff',
                  border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                }}
              >
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column',
                  gap: 2,
                  mt: 2,
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                    <WorkIcon sx={{ 
                      color: '#4285f4',
                      fontSize: 20,
                      mt: 0.25,
                      flexShrink: 0,
                    }} />
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', display: 'block' }}>
                        Salary
                      </Typography>
                      <Typography variant="body2" fontWeight={600} sx={{ 
                        color: darkMode ? '#e8eaed' : '#202124',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}>
                        ₹{employee.salary.toLocaleString()} {employee.salaryType}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                    <DateRangeIcon sx={{ 
                      color: '#34a853',
                      fontSize: 20,
                      mt: 0.25,
                      flexShrink: 0,
                    }} />
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', display: 'block' }}>
                        Joined Date
                      </Typography>
                      <Typography variant="body2" sx={{ 
                        color: darkMode ? '#e8eaed' : '#202124',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}>
                        {new Date(employee.joiningDate).toLocaleDateString('en-IN')}
                      </Typography>
                    </Box>
                  </Box>
                  
                  {employee.address && (
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                      <LocationIcon sx={{ 
                        color: '#fbbc04',
                        fontSize: 20,
                        mt: 0.25,
                        flexShrink: 0,
                      }} />
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', display: 'block' }}>
                          Address
                        </Typography>
                        <Typography variant="body2" sx={{ 
                          color: darkMode ? '#e8eaed' : '#202124',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                        }}>
                          {employee.address}
                        </Typography>
                      </Box>
                    </Box>
                  )}
                </Box>
              </Card>

              {/* Additional Information Card */}
              {(employee.emergencyContact || employee.bankDetails) && (
                <Card
                  title="Additional Information"
                  hover
                  sx={{ 
                    backgroundColor: darkMode ? '#303134' : '#ffffff',
                    border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                  }}
                >
                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column',
                    gap: 3,
                    mt: 2,
                  }}>
                    {employee.emergencyContact && (
                      <Box sx={{ minWidth: 0 }}>
                        <Typography variant="subtitle2" sx={{ 
                          color: darkMode ? '#9aa0a6' : '#5f6368',
                          mb: 1,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.5,
                        }}>
                          <EmergencyIcon fontSize="small" />
                          Emergency Contact
                        </Typography>
                        <Box sx={{ pl: 2 }}>
                          <Typography variant="body2" fontWeight={600} sx={{ 
                            color: darkMode ? '#e8eaed' : '#202124', 
                            mb: 0.5,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}>
                            {employee.emergencyContact.name}
                          </Typography>
                          <Typography variant="caption" sx={{ 
                            color: darkMode ? '#9aa0a6' : '#5f6368',
                            display: 'block',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}>
                            {employee.emergencyContact.phone} • {employee.emergencyContact.relation}
                          </Typography>
                        </Box>
                      </Box>
                    )}
                    
                    {employee.bankDetails && (
                      <Box sx={{ minWidth: 0 }}>
                        <Typography variant="subtitle2" sx={{ 
                          color: darkMode ? '#9aa0a6' : '#5f6368',
                          mb: 1,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.5,
                        }}>
                          <BankIcon fontSize="small" />
                          Bank Details
                        </Typography>
                        <Box sx={{ pl: 2 }}>
                          <Typography variant="body2" sx={{ 
                            color: darkMode ? '#e8eaed' : '#202124', 
                            mb: 0.5,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}>
                            {employee.bankDetails.bankName}
                          </Typography>
                          <Typography variant="caption" sx={{ 
                            color: darkMode ? '#9aa0a6' : '#5f6368',
                            display: 'block',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}>
                            A/C: {employee.bankDetails.accountNumber}
                          </Typography>
                          <Typography variant="caption" sx={{ 
                            color: darkMode ? '#9aa0a6' : '#5f6368',
                            display: 'block',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}>
                            IFSC: {employee.bankDetails.ifscCode}
                          </Typography>
                        </Box>
                      </Box>
                    )}
                  </Box>
                </Card>
              )}
            </Box>

            {/* Right Column - Main Content */}
            <Box sx={{ 
              flex: 1,
              minWidth: 0, // Important for preventing overflow
              width: '100%',
              overflow: 'hidden',
              display: {
                xs: expandedSection === 'summary' || expandedSection === 'attendance' || !expandedSection || !isMobile ? 'block' : 'none',
                lg: 'block'
              }
            }}>
              {/* Stats Cards - Always visible on desktop, conditional on mobile */}
              <Box sx={{ 
                mb: { xs: 3, md: 4 }
              }}>
                <Box sx={{ 
                  display: 'grid',
                  gridTemplateColumns: {
                    xs: 'repeat(2, 1fr)',
                    sm: 'repeat(2, 1fr)',
                    md: 'repeat(4, 1fr)',
                  },
                  gap: 2,
                  mb: 3,
                }}>
                  {[
                    { 
                      title: 'Present', 
                      value: presentCount, 
                      color: '#34a853',
                      description: 'Days worked' 
                    },
                    { 
                      title: 'Absent', 
                      value: absentCount, 
                      color: '#ea4335',
                      description: 'Days absent' 
                    },
                    { 
                      title: 'Rate', 
                      value: `${attendancePercentage}%`, 
                      color: '#4285f4',
                      description: 'Attendance %' 
                    },
                    { 
                      title: 'Hours', 
                      value: totalWorkHours.toFixed(1), 
                      color: '#fbbc04',
                      description: 'Total hours' 
                    },
                  ].map((stat, index) => (
                    <Card 
                      key={`stat-${index}`}
                      hover
                      sx={{ 
                        p: { xs: 1.5, sm: 2 }, 
                        borderRadius: '12px', 
                        backgroundColor: darkMode ? '#303134' : '#ffffff',
                        border: `1px solid ${alpha(stat.color, 0.2)}`,
                        background: darkMode 
                          ? `linear-gradient(135deg, ${alpha(stat.color, 0.1)} 0%, ${alpha(stat.color, 0.05)} 100%)`
                          : `linear-gradient(135deg, ${alpha(stat.color, 0.08)} 0%, ${alpha(stat.color, 0.03)} 100%)`,
                        transition: 'all 0.3s ease',
                        '&:hover': { 
                          transform: 'translateY(-2px)', 
                          boxShadow: `0 8px 24px ${alpha(stat.color, 0.15)}`,
                        },
                      }}
                    >
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            color: darkMode ? '#9aa0a6' : '#5f6368', 
                            fontWeight: 400,
                            fontSize: { xs: '0.65rem', sm: '0.75rem' },
                            display: 'block',
                          }}
                        >
                          {stat.title}
                        </Typography>
                        <Typography 
                          variant={isMobile ? "h5" : "h4"}
                          sx={{ 
                            color: stat.color, 
                            fontWeight: 600,
                            fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem' },
                          }}
                        >
                          {stat.value}
                        </Typography>
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            color: darkMode ? '#9aa0a6' : '#5f6368',
                            fontSize: { xs: '0.6rem', sm: '0.7rem' },
                            display: 'block',
                          }}
                        >
                          {stat.description}
                        </Typography>
                      </Box>
                    </Card>
                  ))}
                </Box>
                
                {/* Attendance Progress */}
                <Card
                  hover
                  sx={{ 
                    mb: 3,
                    backgroundColor: darkMode ? '#303134' : '#ffffff',
                    border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                  }}
                >
                  <Box sx={{ p: { xs: 2, sm: 3 } }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1 }}>
                      <Typography variant="h6" fontWeight={600} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                        Attendance Progress
                      </Typography>
                      <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                        {currentMonth} • {presentCount}/{employee.days.length} days
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={attendancePercentage}
                      sx={{
                        height: 10,
                        borderRadius: 5,
                        backgroundColor: darkMode ? alpha('#4285f4', 0.1) : alpha('#4285f4', 0.08),
                        "& .MuiLinearProgress-bar": {
                          backgroundColor:
                            attendancePercentage >= 90
                              ? '#34a853'
                              : attendancePercentage >= 75
                              ? '#fbbc04'
                              : '#ea4335',
                          borderRadius: 5,
                        },
                      }}
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                      <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                        Goal: 90%
                      </Typography>
                      <Typography 
                        variant="caption" 
                        fontWeight={600}
                        sx={{
                          color:
                            attendancePercentage >= 90
                              ? '#34a853'
                              : attendancePercentage >= 75
                              ? '#fbbc04'
                              : '#ea4335',
                        }}
                      >
                        {attendancePercentage}%
                      </Typography>
                    </Box>
                  </Box>
                </Card>
              </Box>

              {/* Attendance Records Table - FIXED WIDTH ISSUE */}
              <Card
                title="Daily Attendance"
                subtitle={`${currentMonth} • ${employee.days.length} records`}
                action={
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Chip
                      size="small"
                      label={`${presentCount} Present`}
                      sx={{
                        backgroundColor: darkMode ? alpha('#34a853', 0.1) : alpha('#34a853', 0.08),
                        color: '#34a853',
                        borderColor: alpha('#34a853', 0.3),
                      }}
                    />
                    <Chip
                      size="small"
                      label={`${absentCount} Absent`}
                      sx={{
                        backgroundColor: darkMode ? alpha('#ea4335', 0.1) : alpha('#ea4335', 0.08),
                        color: '#ea4335',
                        borderColor: alpha('#ea4335', 0.3),
                      }}
                    />
                  </Box>
                }
                hover
                sx={{ 
                  backgroundColor: darkMode ? '#202124' : '#ffffff',
                  border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                  width: '100%',
                  overflow: 'hidden',
                }}
              >
                {employee.days.length === 0 ? (
                  <Box sx={{ 
                    textAlign: 'center', 
                    py: 6,
                    px: 2 
                  }}>
                    <CalendarIcon
                      sx={{ 
                        fontSize: { xs: 48, sm: 64 }, 
                        mb: 2,
                        color: darkMode ? '#5f6368' : '#9aa0a6',
                        opacity: 0.5,
                      }}
                    />
                    <Typography variant={isMobile ? "h6" : "h5"} gutterBottom sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                      No Attendance Records
                    </Typography>
                    <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', mb: 3 }}>
                      No attendance has been recorded for {currentMonth} yet.
                    </Typography>
                    <Button
                      variant="outlined"
                      onClick={() => router.push(`/attendance/edit/${employee._id}`)}
                      size="medium"
                      sx={{
                        borderColor: darkMode ? '#3c4043' : '#dadce0',
                        color: darkMode ? '#e8eaed' : '#202124',
                      }}
                    >
                      Mark Attendance
                    </Button>
                  </Box>
                ) : (
                  <Box sx={{ 
                    width: '100%',
                    overflow: 'auto',
                    mt: 2,
                  }}>
                    <TableContainer 
                      component={Paper} 
                      elevation={0}
                      sx={{ 
                        borderRadius: '12px',
                        border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                        backgroundColor: darkMode ? '#202124' : '#ffffff',
                        maxHeight: { xs: 400, md: 500 },
                        minWidth: isMobile ? 800 : 'auto', // Set minimum width for horizontal scroll on mobile
                        width: '100%',
                      }}
                    >
                      <Table 
                        stickyHeader
                        size={isMobile ? "small" : "medium"}
                        sx={{ 
                          minWidth: isMobile ? 800 : 650,
                          '& .MuiTableCell-head': {
                            fontWeight: 'bold',
                            backgroundColor: darkMode ? '#303134' : '#f8f9fa',
                            color: darkMode ? '#e8eaed' : '#202124',
                            borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                            whiteSpace: 'nowrap',
                            px: { xs: 1, sm: 2 },
                            py: { xs: 1, sm: 1.5 },
                          },
                          '& .MuiTableCell-body': {
                            color: darkMode ? '#e8eaed' : '#202124',
                            borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                            px: { xs: 1, sm: 2 },
                            py: { xs: 1, sm: 1.5 },
                          },
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
                                  backgroundColor: isToday 
                                    ? darkMode ? alpha('#4285f4', 0.1) : alpha('#4285f4', 0.05)
                                    : 'transparent',
                                  '&:hover': {
                                    backgroundColor: darkMode ? alpha('#4285f4', 0.05) : alpha('#4285f4', 0.02),
                                  },
                                }}
                              >
                                <TableCell>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Typography variant="body2" fontWeight={isToday ? 'bold' : 'normal'}>
                                      {date.toLocaleDateString("en-IN")}
                                    </Typography>
                                    {isToday && (
                                      <Chip 
                                        label="Today" 
                                        size="small" 
                                        sx={{ 
                                          height: 20,
                                          fontSize: '0.65rem',
                                          backgroundColor: '#4285f4',
                                          color: '#ffffff',
                                        }} 
                                      />
                                    )}
                                  </Box>
                                  {isMobile && (
                                    <Typography variant="caption" color="text.secondary">
                                      {dayName}
                                    </Typography>
                                  )}
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
                                      sx={{ 
                                        color: day.status === "Present" ? '#34a853' : '#ea4335',
                                      }}
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
                                    <TimeIcon fontSize="small" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                                    <Typography variant="body2" fontWeight="bold">
                                      {day.workHours ? `${day.workHours.toFixed(1)}h` : '-'}
                                    </Typography>
                                  </Box>
                                </TableCell>
                                <TableCell align="center">
                                  <Typography 
                                    variant="body2" 
                                    fontWeight="bold"
                                    sx={{ 
                                      color: day.overtime ? '#fbbc04' : (darkMode ? '#9aa0a6' : '#5f6368'),
                                    }}
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
                  </Box>
                )}
              </Card>
            </Box>
          </Box>
        </Box>
      </Box>
    </MainLayout>
  );
}