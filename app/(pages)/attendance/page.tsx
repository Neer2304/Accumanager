"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  useMediaQuery,
  useTheme,
  alpha,
  Divider,
  LinearProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Chip,
  Breadcrumbs
} from "@mui/material";
import {
  PersonAdd as PersonAddIcon,
  ExpandMore as ExpandMoreIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Work as WorkIcon,
  AttachMoney as MoneyIcon,
  AccountBalance as BankIcon,
  CalendarToday as CalendarIcon,
  Groups as GroupsIcon,
  Security as SecurityIcon,
  Person as PersonIcon,
  TrendingUp as TrendingUpIcon,
  AccessTime as AccessTimeIcon,
  Close as CloseIcon,
  Home as HomeIcon,
  ArrowBack as BackIcon,
  Download as DownloadIcon,
  Analytics as AnalyticsIcon
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { MainLayout } from "@/components/Layout/MainLayout";
import Link from "next/link";

// Import Google-themed components from your analytics page
import { Card } from '@/components/ui/Card';
import { Button as GoogleButton } from '@/components/ui/Button';
import { Chip as GoogleChip } from '@/components/ui/Chip';
import { Alert as GoogleAlert } from '@/components/ui/Alert';

// Import attendance components
import { EmployeeCard } from "@/components/attendance/EmployeeCard";
import { CustomSelect } from "@/components/attendance/CustomSelect";

interface Day {
  date: string;
  status: "Present" | "Absent";
  checkIn?: string;
  checkOut?: string;
  workHours?: number;
  overtime?: number;
  notes?: string;
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
  days: Day[];
  isActive: boolean;
}

const salaryTypes = [
  { value: "monthly", label: "Monthly" },
  { value: "hourly", label: "Hourly" },
  { value: "daily", label: "Daily" },
];

const departments = [
  "Sales", "Marketing", "Development", "Design", "HR", 
  "Finance", "Operations", "Support", "Management", "Other"
];

export default function AttendancePage() {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const router = useRouter();
  
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Form states
  const [basicInfo, setBasicInfo] = useState({
    name: "",
    phone: "",
    email: "",
    role: "",
    department: "",
    salary: "",
    salaryType: "monthly",
    joiningDate: new Date().toISOString().split("T")[0],
  });

  const [advancedInfo, setAdvancedInfo] = useState({
    address: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    emergencyContactRelation: "",
    bankAccountNumber: "",
    bankName: "",
    ifscCode: "",
    accountHolder: "",
    aadhaar: "",
    pan: "",
    license: "",
  });

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Fetch employees
  const fetchEmployees = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log("📡 Fetching employees...");
      
      const response = await fetch("/api/attendance", {
        method: "GET",
        credentials: 'include',
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("📊 Response status:", response.status);
      
      if (response.status === 401) {
        setError("Session expired. Please login again.");
        router.push("/auth/login");
        return;
      }

      if (response.status === 402) {
        const errorData = await response.json();
        setError(errorData.error);
        return;
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Response error:", errorText);
        throw new Error("Failed to fetch attendance data");
      }

      const data = await response.json();
      console.log("✅ Employees fetched:", data?.length || 0);
      setEmployees(data || []);
    } catch (err: any) {
      console.error('❌ Error fetching employees:', err);
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // Toggle attendance status
  const toggleStatus = async (
    employeeId: string,
    date: string,
    currentStatus: string
  ) => {
    try {
      setSubmitting(true);
      setError(null);

      const newStatus = currentStatus === "Present" ? "Absent" : "Present";

      console.log("📝 Updating attendance:", { employeeId, date, newStatus });

      const response = await fetch("/api/attendance", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
        body: JSON.stringify({
          employeeId,
          date,
          status: newStatus,
        }),
      });

      console.log("📊 Update response status:", response.status);
      
      if (response.status === 402) {
        const errorData = await response.json();
        throw new Error(errorData.error);
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to update attendance: ${response.status}`);
      }

      // Update local state
      setEmployees((prev) =>
        prev.map((emp) => {
          if (emp._id === employeeId) {
            const updatedDays = emp.days.map((day) =>
              day.date === date ? { ...day, status: newStatus } : day
            );
            return { ...emp, days: updatedDays };
          }
          return emp;
        })
      );
      
      console.log("✅ Attendance updated successfully");
    } catch (err: any) {
      console.error('❌ Error updating attendance:', err);
      setError(err instanceof Error ? err.message : "Failed to update attendance");
      await fetchEmployees();
    } finally {
      setSubmitting(false);
    }
  };

  // Validate form
  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!basicInfo.name.trim()) {
      errors.name = "Name is required";
    }
    
    if (!basicInfo.phone.trim()) {
      errors.phone = "Phone number is required";
    } else if (!/^[6-9]\d{9}$/.test(basicInfo.phone.replace(/\D/g, ''))) {
      errors.phone = "Enter a valid 10-digit Indian phone number";
    }
    
    if (basicInfo.email && !/\S+@\S+\.\S+/.test(basicInfo.email)) {
      errors.email = "Enter a valid email address";
    }
    
    if (!basicInfo.role.trim()) {
      errors.role = "Role is required";
    }
    
    if (basicInfo.salary && parseFloat(basicInfo.salary) < 0) {
      errors.salary = "Salary cannot be negative";
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Add new employee
  const addEmployee = async () => {
    if (!validateForm()) {
      setError("Please fix the errors in the form");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const employeeData = {
        ...basicInfo,
        ...(showAdvanced && {
          address: advancedInfo.address,
          emergencyContact: advancedInfo.emergencyContactName ? {
            name: advancedInfo.emergencyContactName,
            phone: advancedInfo.emergencyContactPhone,
            relation: advancedInfo.emergencyContactRelation,
          } : undefined,
          bankDetails: advancedInfo.bankAccountNumber ? {
            accountNumber: advancedInfo.bankAccountNumber,
            bankName: advancedInfo.bankName,
            ifscCode: advancedInfo.ifscCode,
            accountHolder: advancedInfo.accountHolder,
          } : undefined,
          documents: {
            aadhaar: advancedInfo.aadhaar,
            pan: advancedInfo.pan,
            license: advancedInfo.license,
          }
        })
      };

      console.log("➕ Adding employee:", employeeData);

      const response = await fetch("/api/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
        body: JSON.stringify(employeeData),
      });

      if (response.status === 402) {
        const errorData = await response.json();
        throw new Error(errorData.error);
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to add employee: ${response.status}`);
      }

      const newEmployee = await response.json();
      
      // Add to local state
      setEmployees(prev => [...prev, newEmployee]);
      
      // Reset form
      setAddDialogOpen(false);
      setBasicInfo({
        name: "",
        phone: "",
        email: "",
        role: "",
        department: "",
        salary: "",
        salaryType: "monthly",
        joiningDate: new Date().toISOString().split("T")[0],
      });
      setAdvancedInfo({
        address: "",
        emergencyContactName: "",
        emergencyContactPhone: "",
        emergencyContactRelation: "",
        bankAccountNumber: "",
        bankName: "",
        ifscCode: "",
        accountHolder: "",
        aadhaar: "",
        pan: "",
        license: "",
      });
      setValidationErrors({});
      
      console.log("✅ Employee added successfully");
    } catch (err: any) {
      console.error('❌ Error adding employee:', err);
      setError(err instanceof Error ? err.message : "Failed to add employee");
    } finally {
      setSubmitting(false);
    }
  };

  // Render step content
  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              label="Full Name *"
              value={basicInfo.name}
              onChange={(e) =>
                setBasicInfo((prev) => ({ ...prev, name: e.target.value }))
              }
              error={!!validationErrors.name}
              helperText={validationErrors.name}
              required
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  '&:hover fieldset': {
                    borderColor: darkMode ? '#5f6368' : '#dadce0',
                  },
                },
              }}
            />
            <TextField
              fullWidth
              label="Phone Number *"
              value={basicInfo.phone}
              onChange={(e) =>
                setBasicInfo((prev) => ({ ...prev, phone: e.target.value }))
              }
              error={!!validationErrors.phone}
              helperText={validationErrors.phone}
              required
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                },
              }}
            />
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={basicInfo.email}
              onChange={(e) =>
                setBasicInfo((prev) => ({ ...prev, email: e.target.value }))
              }
              error={!!validationErrors.email}
              helperText={validationErrors.email}
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                },
              }}
            />
            <TextField
              fullWidth
              label="Role/Position *"
              value={basicInfo.role}
              onChange={(e) =>
                setBasicInfo((prev) => ({ ...prev, role: e.target.value }))
              }
              error={!!validationErrors.role}
              helperText={validationErrors.role}
              required
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                },
              }}
            />
            <CustomSelect
              label="Department"
              value={basicInfo.department}
              onChange={(e: any) =>
                setBasicInfo((prev) => ({ ...prev, department: e.target.value }))
              }
              options={departments.map(dept => ({ value: dept, label: dept }))}
            />
            
            <Box sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 2 
            }}>
              <Box sx={{ flex: 1 }}>
                <TextField
                  fullWidth
                  label="Salary"
                  type="number"
                  value={basicInfo.salary}
                  onChange={(e) =>
                    setBasicInfo((prev) => ({ ...prev, salary: e.target.value }))
                  }
                  error={!!validationErrors.salary}
                  helperText={validationErrors.salary}
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px',
                    },
                  }}
                />
              </Box>
              <Box sx={{ flex: 1 }}>
                <CustomSelect
                  label="Salary Type"
                  value={basicInfo.salaryType}
                  onChange={(e: any) =>
                    setBasicInfo((prev) => ({ ...prev, salaryType: e.target.value }))
                  }
                  options={salaryTypes}
                />
              </Box>
            </Box>
            
            <TextField
              fullWidth
              label="Joining Date"
              type="date"
              value={basicInfo.joiningDate}
              onChange={(e) =>
                setBasicInfo((prev) => ({ ...prev, joiningDate: e.target.value }))
              }
              InputLabelProps={{ shrink: true }}
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                },
              }}
            />
            
            <Accordion
              expanded={showAdvanced}
              onChange={() => setShowAdvanced(!showAdvanced)}
              sx={{
                mt: 2,
                borderRadius: '12px',
                boxShadow: 'none',
                border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                '&:before': { display: 'none' },
                backgroundColor: darkMode ? '#202124' : '#ffffff',
              }}
            >
              <AccordionSummary 
                expandIcon={<ExpandMoreIcon />}
                sx={{
                  borderRadius: '12px',
                  '&:hover': {
                    backgroundColor: darkMode ? '#303134' : '#f8f9fa',
                  },
                }}
              >
                <Typography fontWeight="500" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <SecurityIcon color="action" />
                  Advanced Details (Optional)
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ pt: 2 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <TextField
                    fullWidth
                    label="Address"
                    multiline
                    rows={2}
                    value={advancedInfo.address}
                    onChange={(e) => setAdvancedInfo(prev => ({ ...prev, address: e.target.value }))}
                    variant="outlined"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '8px',
                      },
                    }}
                  />
                  
                  <Divider sx={{ borderColor: darkMode ? '#3c4043' : '#dadce0' }}>
                    <Typography variant="caption" color="text.secondary">
                      Emergency Contact
                    </Typography>
                  </Divider>
                  
                  <TextField
                    fullWidth
                    label="Contact Name"
                    value={advancedInfo.emergencyContactName}
                    onChange={(e) => setAdvancedInfo(prev => ({ ...prev, emergencyContactName: e.target.value }))}
                    variant="outlined"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '8px',
                      },
                    }}
                  />
                  
                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: { xs: 'column', sm: 'row' },
                    gap: 2 
                  }}>
                    <Box sx={{ flex: 1 }}>
                      <TextField
                        fullWidth
                        label="Contact Phone"
                        value={advancedInfo.emergencyContactPhone}
                        onChange={(e) => setAdvancedInfo(prev => ({ ...prev, emergencyContactPhone: e.target.value }))}
                        variant="outlined"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '8px',
                          },
                        }}
                      />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <TextField
                        fullWidth
                        label="Relation"
                        value={advancedInfo.emergencyContactRelation}
                        onChange={(e) => setAdvancedInfo(prev => ({ ...prev, emergencyContactRelation: e.target.value }))}
                        variant="outlined"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '8px',
                          },
                        }}
                      />
                    </Box>
                  </Box>
                  
                  <Divider sx={{ borderColor: darkMode ? '#3c4043' : '#dadce0' }}>
                    <Typography variant="caption" color="text.secondary">
                      Bank Details
                    </Typography>
                  </Divider>
                  
                  <TextField
                    fullWidth
                    label="Account Number"
                    value={advancedInfo.bankAccountNumber}
                    onChange={(e) => setAdvancedInfo(prev => ({ ...prev, bankAccountNumber: e.target.value }))}
                    variant="outlined"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '8px',
                      },
                    }}
                  />
                  
                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: { xs: 'column', sm: 'row' },
                    gap: 2 
                  }}>
                    <Box sx={{ flex: 1 }}>
                      <TextField
                        fullWidth
                        label="Bank Name"
                        value={advancedInfo.bankName}
                        onChange={(e) => setAdvancedInfo(prev => ({ ...prev, bankName: e.target.value }))}
                        variant="outlined"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '8px',
                          },
                        }}
                      />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <TextField
                        fullWidth
                        label="IFSC Code"
                        value={advancedInfo.ifscCode}
                        onChange={(e) => setAdvancedInfo(prev => ({ ...prev, ifscCode: e.target.value.toUpperCase() }))}
                        variant="outlined"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '8px',
                          },
                        }}
                      />
                    </Box>
                  </Box>
                  
                  <TextField
                    fullWidth
                    label="Account Holder Name"
                    value={advancedInfo.accountHolder}
                    onChange={(e) => setAdvancedInfo(prev => ({ ...prev, accountHolder: e.target.value }))}
                    variant="outlined"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '8px',
                      },
                    }}
                  />
                  
                  <Divider sx={{ borderColor: darkMode ? '#3c4043' : '#dadce0' }}>
                    <Typography variant="caption" color="text.secondary">
                      Documents
                    </Typography>
                  </Divider>
                  
                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: { xs: 'column', sm: 'row' },
                    gap: 2 
                  }}>
                    <Box sx={{ flex: 1 }}>
                      <TextField
                        fullWidth
                        label="Aadhaar Number"
                        value={advancedInfo.aadhaar}
                        onChange={(e) => setAdvancedInfo(prev => ({ ...prev, aadhaar: e.target.value.replace(/\D/g, '').slice(0, 12) }))}
                        variant="outlined"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '8px',
                          },
                        }}
                      />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <TextField
                        fullWidth
                        label="PAN Number"
                        value={advancedInfo.pan}
                        onChange={(e) => setAdvancedInfo(prev => ({ ...prev, pan: e.target.value.toUpperCase() }))}
                        variant="outlined"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '8px',
                          },
                        }}
                      />
                    </Box>
                  </Box>
                  
                  <TextField
                    fullWidth
                    label="License Number"
                    value={advancedInfo.license}
                    onChange={(e) => setAdvancedInfo(prev => ({ ...prev, license: e.target.value }))}
                    variant="outlined"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '8px',
                      },
                    }}
                  />
                </Box>
              </AccordionDetails>
            </Accordion>
          </Box>
        );
      default:
        return null;
    }
  };

  const steps = ["Basic Information"];

  if (loading && employees.length === 0) {
    return (
      <MainLayout title="Employee Attendance">
        <Box sx={{ 
          p: 3, 
          display: "flex", 
          flexDirection: "column",
          justifyContent: "center", 
          alignItems: "center", 
          minHeight: 400,
          gap: 3 
        }}>
          <CircularProgress size={60} thickness={4} />
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h5" fontWeight="500" gutterBottom>
              Loading Employee Database
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Fetching your team's attendance data...
            </Typography>
          </Box>
        </Box>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Employee Attendance">
      <Box sx={{ 
        backgroundColor: darkMode ? '#202124' : '#ffffff',
        color: darkMode ? '#e8eaed' : '#202124',
        minHeight: '100vh',
      }}>
        {/* Header */}
        <Box sx={{ 
          p: { xs: 2, sm: 3 },
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
            <Typography color={darkMode ? '#e8eaed' : '#202124'} fontWeight={400}>
              Attendance
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
              Employee Attendance
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
              Manage your team's attendance, payroll, and performance metrics
            </Typography>
          </Box>

          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: 2,
            flexWrap: 'wrap',
            mt: 3,
          }}>
            <GoogleChip
              label="Team Management"
              variant="outlined"
              sx={{
                backgroundColor: darkMode ? alpha('#4285f4', 0.1) : alpha('#4285f4', 0.08),
                borderColor: alpha('#4285f4', 0.3),
                color: darkMode ? '#8ab4f8' : '#4285f4',
              }}
            />
            <GoogleChip
              label={`${employees.length} Employees`}
              variant="outlined"
              sx={{
                backgroundColor: darkMode ? alpha('#34a853', 0.1) : alpha('#34a853', 0.08),
                borderColor: alpha('#34a853', 0.3),
                color: darkMode ? '#81c995' : '#34a853',
              }}
            />
          </Box>
        </Box>

        {/* Main Content */}
        <Box sx={{ p: { xs: 2, sm: 3 } }}>
          {error && (
            <GoogleAlert
              severity="error"
              title="Error"
              message={error}
              action={
                error.includes('upgrade') && (
                  <GoogleButton 
                    color="inherit" 
                    size="small"
                    onClick={() => router.push('/pricing')}
                  >
                    Upgrade Now
                  </GoogleButton>
                )
              }
              sx={{ mb: 3 }}
            />
          )}

          {/* Stats Cards */}
          <Box sx={{ 
            display: 'flex',
            flexWrap: 'wrap',
            gap: { xs: 1.5, sm: 2, md: 3 },
            mb: { xs: 2, sm: 3, md: 4 },
          }}>
            {[
              { 
                title: 'Total Employees', 
                value: employees.length, 
                icon: '👥', 
                color: '#4285f4',
                description: 'Active team members' 
              },
              { 
                title: 'Present Today', 
                value: employees.reduce((sum, emp) => sum + emp.days.filter(d => d.status === 'Present').length, 0), 
                icon: '✅', 
                color: '#34a853',
                description: 'Marked present today' 
              },
              { 
                title: 'Total Work Hours', 
                value: employees.reduce((sum, emp) => sum + (emp.days.reduce((hrs, day) => hrs + (day.workHours || 0), 0)), 0).toFixed(1), 
                icon: '⏰', 
                color: '#fbbc04',
                description: 'This month' 
              },
              { 
                title: 'Average Attendance', 
                value: employees.length > 0 ? Math.round(employees.reduce((sum, emp) => {
                  const presentDays = emp.days.filter(d => d.status === 'Present').length;
                  const totalDays = emp.days.length || 1;
                  return sum + (presentDays / totalDays * 100);
                }, 0) / employees.length) : 0, 
                icon: '📊', 
                color: '#ea4335',
                description: 'Team average' 
              },
            ].map((stat, index) => (
              <Card 
                key={`stat-${index}`}
                hover
                sx={{ 
                  flex: '1 1 calc(25% - 18px)', 
                  minWidth: { xs: 'calc(50% - 12px)', sm: 'calc(25% - 18px)' },
                  p: { xs: 1.5, sm: 2, md: 3 }, 
                  borderRadius: '16px', 
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
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box>
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          color: darkMode ? '#9aa0a6' : '#5f6368', 
                          fontWeight: 400,
                          fontSize: { xs: '0.65rem', sm: '0.7rem', md: '0.75rem' },
                          display: 'block',
                        }}
                      >
                        {stat.title}
                      </Typography>
                      <Typography 
                        variant="h4"
                        sx={{ 
                          color: stat.color, 
                          fontWeight: 600,
                          fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.5rem' },
                        }}
                      >
                        {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
                        {stat.title === 'Average Attendance' && '%'}
                        {stat.title === 'Total Work Hours' && 'h'}
                      </Typography>
                    </Box>
                    <Box sx={{ 
                      p: { xs: 0.75, sm: 1 }, 
                      borderRadius: '10px', 
                      backgroundColor: alpha(stat.color, 0.1),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
                    }}>
                      {stat.icon}
                    </Box>
                  </Box>
                  
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      color: darkMode ? '#9aa0a6' : '#5f6368',
                      fontSize: { xs: '0.6rem', sm: '0.65rem', md: '0.7rem' },
                      display: 'block',
                    }}
                  >
                    {stat.description}
                  </Typography>
                </Box>
              </Card>
            ))}
          </Box>

          {/* Header Controls */}
          <Card
            title="Employee Directory"
            subtitle="Manage your team's attendance, payroll, and performance"
            action={
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <GoogleButton
                  variant="outlined"
                  onClick={() => router.push('/attendance/reports')}
                  startIcon={<AnalyticsIcon />}
                  sx={{
                    borderColor: darkMode ? '#3c4043' : '#dadce0',
                    color: darkMode ? '#e8eaed' : '#202124',
                  }}
                >
                  View Reports
                </GoogleButton>
                <GoogleButton
                  variant="contained"
                  onClick={() => setAddDialogOpen(true)}
                  startIcon={<PersonAddIcon />}
                  sx={{ 
                    backgroundColor: '#34a853',
                    '&:hover': { backgroundColor: '#2d9248' }
                  }}
                >
                  Add Employee
                </GoogleButton>
              </Box>
            }
            hover
            sx={{ 
              mb: { xs: 2, sm: 3, md: 4 },
              backgroundColor: darkMode ? '#202124' : '#ffffff',
              border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
            }}
          />

          {/* Employees Grid */}
          {employees.length > 0 ? (
            <Box sx={{ 
              display: 'flex',
              flexWrap: 'wrap',
              gap: 3
            }}>
              {employees.map((employee) => (
                <Box key={employee._id} sx={{ 
                  flex: '1 1 calc(25% - 18px)',
                  minWidth: { xs: '100%', sm: 'calc(50% - 12px)', lg: 'calc(33.333% - 16px)', xl: 'calc(25% - 18px)' }
                }}>
                  <EmployeeCard
                    employee={employee}
                    toggleStatus={toggleStatus}
                    submitting={submitting}
                    darkMode={darkMode}
                  />
                </Box>
              ))}
            </Box>
          ) : (
            !loading && (
              <Card sx={{ 
                textAlign: 'center', 
                py: 8,
                px: 3,
                backgroundColor: darkMode ? '#303134' : '#ffffff',
                border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
              }}>
                <GroupsIcon sx={{ fontSize: 60, color: darkMode ? '#9aa0a6' : '#5f6368', mb: 2 }} />
                <Typography 
                  variant="h6" 
                  gutterBottom
                  sx={{ color: darkMode ? '#e8eaed' : '#202124' }}
                >
                  No Employees Yet
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    mb: 3,
                    maxWidth: 500,
                    mx: 'auto',
                    color: darkMode ? '#9aa0a6' : '#5f6368',
                  }}
                >
                  Start building your team by adding employees to track attendance, manage payroll, and monitor performance metrics.
                </Typography>
                <GoogleButton
                  variant="contained"
                  startIcon={<PersonAddIcon />}
                  onClick={() => setAddDialogOpen(true)}
                  sx={{ 
                    backgroundColor: '#34a853',
                    '&:hover': { backgroundColor: '#2d9248' }
                  }}
                >
                  Add Your First Employee
                </GoogleButton>
              </Card>
            )
          )}
        </Box>
      </Box>

      {/* Add Employee Dialog */}
      <Dialog
        open={addDialogOpen}
        onClose={() => !submitting && setAddDialogOpen(false)}
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
        <DialogTitle sx={{ 
          borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
          backgroundColor: darkMode ? '#303134' : '#f8f9fa',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <Box>
            <Typography variant="h4" fontWeight={500} gutterBottom sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
              Add New Employee
            </Typography>
            <Stepper 
              activeStep={activeStep} 
              sx={{ mt: 2 }}
            >
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>
          <IconButton
            onClick={() => !submitting && setAddDialogOpen(false)}
            disabled={submitting}
            size="small"
            sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 3, overflowY: 'auto' }}>
          {renderStepContent(activeStep)}
        </DialogContent>

        <DialogActions sx={{ 
          p: 3, 
          gap: 2,
          borderTop: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
        }}>
          <GoogleButton
            onClick={() => {
              setAddDialogOpen(false);
              setBasicInfo({
                name: "",
                phone: "",
                email: "",
                role: "",
                department: "",
                salary: "",
                salaryType: "monthly",
                joiningDate: new Date().toISOString().split("T")[0],
              });
              setAdvancedInfo({
                address: "",
                emergencyContactName: "",
                emergencyContactPhone: "",
                emergencyContactRelation: "",
                bankAccountNumber: "",
                bankName: "",
                ifscCode: "",
                accountHolder: "",
                aadhaar: "",
                pan: "",
                license: "",
              });
              setValidationErrors({});
              setShowAdvanced(false);
            }}
            disabled={submitting}
            variant="outlined"
            sx={{ borderRadius: '8px' }}
          >
            Cancel
          </GoogleButton>
          <GoogleButton
            onClick={addEmployee}
            disabled={submitting}
            variant="contained"
            sx={{ 
              borderRadius: '8px',
              minWidth: 120,
              backgroundColor: '#34a853',
              '&:hover': { backgroundColor: '#2d9248' }
            }}
          >
            {submitting ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Add Employee"
            )}
          </GoogleButton>
        </DialogActions>
      </Dialog>
    </MainLayout>
  );
}