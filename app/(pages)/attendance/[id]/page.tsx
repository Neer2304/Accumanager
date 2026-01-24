// app/attendance/[id]/page.tsx - COMPLETE WORKING VERSION
"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Box,
  Alert,
  Button,
  CircularProgress,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
  Typography,
} from "@mui/material";
import { ArrowBack as ArrowBackIcon } from "@mui/icons-material";
import { MainLayout } from "@/components/Layout/MainLayout";
import {
  EmployeeHeader,
  MobileNav,
  SummaryCards,
  BasicInfoCard,
  AdditionalInfoCard,
  AttendanceProgress,
  AttendanceTable,
  MobileTabs,
} from "@/components/attendance/employee-details";
import { Employee, Day } from "@/types/attendance";

export default function EmployeeAttendanceDetails() {
  const params = useParams();
  const router = useRouter();
  const employeeId = params.id as string;
  const theme = useTheme();
  
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
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

  const sections = [
    { id: 'summary', label: 'Summary' },
    { id: 'details', label: 'Details' },
    { id: 'attendance', label: 'Attendance' },
  ];

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

  return (
    <MainLayout title={`${employee?.name || 'Employee'} - Attendance`}>
      <Box sx={{ 
        p: { xs: 1.5, sm: 2, md: 3 },
        maxWidth: 1400, 
        margin: "0 auto",
        minHeight: '100vh',
      }}>
        {/* Mobile Navigation */}
        <MobileNav
          open={showMobileMenu}
          onClose={() => setShowMobileMenu(false)}
          expandedSection={expandedSection}
          onSectionClick={toggleSection}
        />

        {/* Header */}
        <EmployeeHeader
          employee={{
            _id: employee._id,
            name: employee.name,
            role: employee.role,
            department: employee.department,
            isActive: employee.isActive
          }}
          refreshing={refreshing}
          onRefresh={refreshData}
          onMenuClick={() => setShowMobileMenu(true)}
          isMobile={isMobile}
        />

        {/* Mobile Navigation Tabs */}
        {isMobile && (
          <MobileTabs
            sections={sections}
            expandedSection={expandedSection}
            onSectionClick={toggleSection}
          />
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
            <BasicInfoCard employee={{
              phone: employee.phone,
              email: employee.email,
              salary: employee.salary,
              salaryType: employee.salaryType,
              joiningDate: employee.joiningDate,
              address: employee.address
            }} />
            <AdditionalInfoCard
              emergencyContact={employee.emergencyContact}
              bankDetails={employee.bankDetails}
            />
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
              <SummaryCards
                presentCount={presentCount}
                absentCount={absentCount}
                attendancePercentage={attendancePercentage}
                totalWorkHours={totalWorkHours}
                isMobile={isMobile}
              />
              
              <AttendanceProgress
                presentCount={presentCount}
                totalDays={employee.days.length}
                attendancePercentage={attendancePercentage}
                currentMonth={currentMonth}
              />
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
                  <AttendanceTable
                    days={employee.days}
                    presentCount={presentCount}
                    absentCount={absentCount}
                    currentMonth={currentMonth}
                    isMobile={isMobile}
                  />
                </CardContent>
              </Card>
            </Box>
          </Box>
        </Box>
      </Box>
    </MainLayout>
  );
}