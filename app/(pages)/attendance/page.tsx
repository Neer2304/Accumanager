// app/attendance/page.tsx - UPDATED MAIN PAGE
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
  Chip
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
} from "@mui/icons-material";
import { MainLayout } from "@/components/Layout/MainLayout";
import { useRouter } from "next/navigation";
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
              InputProps={{
                startAdornment: <PersonIcon sx={{ mr: 1, color: 'action.active' }} />,
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
              InputProps={{
                startAdornment: <PhoneIcon sx={{ mr: 1, color: 'action.active' }} />,
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
              InputProps={{
                startAdornment: <EmailIcon sx={{ mr: 1, color: 'action.active' }} />,
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
              InputProps={{
                startAdornment: <WorkIcon sx={{ mr: 1, color: 'action.active' }} />,
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
                  InputProps={{
                    startAdornment: <MoneyIcon sx={{ mr: 1, color: 'action.active' }} />,
                    endAdornment: (
                      <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
                        INR
                      </Typography>
                    ),
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
              InputProps={{
                startAdornment: <CalendarIcon sx={{ mr: 1, color: 'action.active' }} />,
              }}
            />
            
            <Accordion
              expanded={showAdvanced}
              onChange={() => setShowAdvanced(!showAdvanced)}
              sx={{
                mt: 2,
                borderRadius: 2,
                boxShadow: 'none',
                border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
                '&:before': { display: 'none' },
              }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
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
                    InputProps={{
                      startAdornment: <LocationIcon sx={{ mr: 1, color: 'action.active', alignSelf: 'flex-start', mt: 1.5 }} />,
                    }}
                  />
                  
                  <Divider>Emergency Contact</Divider>
                  
                  <TextField
                    fullWidth
                    label="Contact Name"
                    value={advancedInfo.emergencyContactName}
                    onChange={(e) => setAdvancedInfo(prev => ({ ...prev, emergencyContactName: e.target.value }))}
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
                      />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <TextField
                        fullWidth
                        label="Relation"
                        value={advancedInfo.emergencyContactRelation}
                        onChange={(e) => setAdvancedInfo(prev => ({ ...prev, emergencyContactRelation: e.target.value }))}
                      />
                    </Box>
                  </Box>
                  
                  <Divider>Bank Details</Divider>
                  
                  <TextField
                    fullWidth
                    label="Account Number"
                    value={advancedInfo.bankAccountNumber}
                    onChange={(e) => setAdvancedInfo(prev => ({ ...prev, bankAccountNumber: e.target.value }))}
                    InputProps={{
                      startAdornment: <BankIcon sx={{ mr: 1, color: 'action.active' }} />,
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
                      />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <TextField
                        fullWidth
                        label="IFSC Code"
                        value={advancedInfo.ifscCode}
                        onChange={(e) => setAdvancedInfo(prev => ({ ...prev, ifscCode: e.target.value.toUpperCase() }))}
                      />
                    </Box>
                  </Box>
                  
                  <TextField
                    fullWidth
                    label="Account Holder Name"
                    value={advancedInfo.accountHolder}
                    onChange={(e) => setAdvancedInfo(prev => ({ ...prev, accountHolder: e.target.value }))}
                  />
                  
                  <Divider>Documents</Divider>
                  
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
                      />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <TextField
                        fullWidth
                        label="PAN Number"
                        value={advancedInfo.pan}
                        onChange={(e) => setAdvancedInfo(prev => ({ ...prev, pan: e.target.value.toUpperCase() }))}
                      />
                    </Box>
                  </Box>
                  
                  <TextField
                    fullWidth
                    label="License Number"
                    value={advancedInfo.license}
                    onChange={(e) => setAdvancedInfo(prev => ({ ...prev, license: e.target.value }))}
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
            <Typography variant="h5" fontWeight="bold" gutterBottom>
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
      <Box sx={{ p: { xs: 2, sm: 3 }, maxWidth: 1400, margin: "0 auto" }}>
        {/* Header */}
        <Paper
          sx={{
            p: { xs: 3, sm: 4 },
            mb: 4,
            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.9)} 0%, ${alpha(theme.palette.primary.dark, 0.9)} 100%)`,
            color: theme.palette.primary.contrastText,
            borderRadius: 3,
            boxShadow: theme.shadows[4],
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 3,
            flexDirection: { xs: 'column', sm: 'row' },
            textAlign: { xs: 'center', sm: 'left' }
          }}>
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: { xs: 70, sm: 80 },
              height: { xs: 70, sm: 80 },
              borderRadius: '50%',
              bgcolor: alpha(theme.palette.common.white, 0.2),
              backdropFilter: 'blur(10px)',
              border: `2px solid ${alpha(theme.palette.common.white, 0.3)}`,
              flexShrink: 0,
            }}>
              <GroupsIcon sx={{ fontSize: { xs: 36, sm: 40 }, color: theme.palette.common.white }} />
            </Box>
            
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="h2"
                component="h1"
                fontWeight="bold"
                gutterBottom
                sx={{ 
                  fontSize: { xs: '1.75rem', sm: '2.5rem', md: '3rem' },
                  color: theme.palette.common.white,
                }}
              >
                Employee Management
              </Typography>
              <Typography variant="h5" sx={{ opacity: 0.9, color: theme.palette.common.white, mb: 1 }}>
                {new Date().toLocaleString("default", { month: "long", year: "numeric" })} • 
                {employees.length} Employee{employees.length !== 1 ? 's' : ''}
              </Typography>
              
              <Box sx={{ 
                display: 'flex', 
                gap: 2, 
                flexWrap: 'wrap', 
                justifyContent: { xs: 'center', sm: 'flex-start' } 
              }}>
                <Chip
                  icon={<CheckCircleIcon />}
                  label={`${employees.reduce((sum, emp) => sum + emp.days.filter(d => d.status === 'Present').length, 0)} Present Today`}
                  sx={{ 
                    bgcolor: alpha(theme.palette.common.white, 0.2), 
                    color: theme.palette.common.white,
                    border: `1px solid ${alpha(theme.palette.common.white, 0.3)}`,
                  }}
                />
                <Chip
                  icon={<AccessTimeIcon />}
                  label={`${employees.reduce((sum, emp) => sum + (emp.days.reduce((hrs, day) => hrs + (day.workHours || 0), 0)), 0).toFixed(1)} Total Hours`}
                  sx={{ 
                    bgcolor: alpha(theme.palette.common.white, 0.2), 
                    color: theme.palette.common.white,
                    border: `1px solid ${alpha(theme.palette.common.white, 0.3)}`,
                  }}
                />
              </Box>
            </Box>
          </Box>
        </Paper>

        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 3, 
              borderRadius: 2,
            }} 
            onClose={() => setError(null)}
            action={
              error.includes('upgrade') && (
                <Button 
                  color="inherit" 
                  size="small"
                  onClick={() => router.push('/pricing')}
                >
                  Upgrade Now
                </Button>
              )
            }
          >
            {error}
          </Alert>
        )}

        {/* Header Controls */}
        <Paper
          sx={{
            p: 3,
            mb: 4,
            borderRadius: 3,
            bgcolor: 'background.paper',
            boxShadow: theme.shadows[2],
            border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
          }}
        >
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', sm: 'center' },
            gap: 2,
            flexDirection: { xs: 'column', sm: 'row' }
          }}>
            <Box>
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                Employee Directory
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Manage your team's attendance, payroll, and performance
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="contained"
                startIcon={<PersonAddIcon />}
                onClick={() => setAddDialogOpen(true)}
                size={isMobile ? "medium" : "large"}
                sx={{
                  borderRadius: 2,
                  fontWeight: 'bold',
                  boxShadow: theme.shadows[2],
                  '&:hover': {
                    boxShadow: theme.shadows[4],
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                Add Employee
              </Button>
              
              <Button
                variant="outlined"
                onClick={() => router.push('/attendance/reports')}
                size={isMobile ? "medium" : "large"}
                sx={{
                  borderRadius: 2,
                  fontWeight: 'bold',
                }}
              >
                View Reports
              </Button>
            </Box>
          </Box>
        </Paper>

        {/* Employees Grid - Using responsive flexbox layout */}
        {employees.length > 0 ? (
          <Box sx={{ 
            display: 'grid',
            gridTemplateColumns: { 
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              lg: 'repeat(3, 1fr)',
              xl: 'repeat(4, 1fr)'
            },
            gap: 3
          }}>
            {employees.map((employee) => (
              <EmployeeCard
                key={employee._id}
                employee={employee}
                toggleStatus={toggleStatus}
                submitting={submitting}
              />
            ))}
          </Box>
        ) : (
          !loading && (
            <Paper
              elevation={0}
              sx={{
                borderRadius: 3,
                textAlign: 'center',
                p: 6,
                bgcolor: alpha(theme.palette.action.hover, 0.3),
                border: `2px dashed ${alpha(theme.palette.divider, 0.5)}`,
              }}
            >
              <Box sx={{ 
                width: 120, 
                height: 120, 
                borderRadius: '50%',
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: theme.palette.primary.main,
                fontSize: 48,
                mb: 3,
                mx: 'auto',
                border: `2px solid ${alpha(theme.palette.primary.main, 0.2)}`,
              }}>
                <GroupsIcon fontSize="inherit" />
              </Box>
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                No employees yet
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 500, mx: 'auto' }}>
                Start building your team by adding employees to track attendance, manage payroll, and monitor performance metrics.
              </Typography>
              <Button
                variant="contained"
                startIcon={<PersonAddIcon />}
                onClick={() => setAddDialogOpen(true)}
                size="large"
                sx={{
                  borderRadius: 2,
                  px: 4,
                  py: 1.5,
                  fontWeight: 'bold',
                  fontSize: '1.1rem',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: theme.shadows[4],
                  },
                }}
              >
                Add Your First Employee
              </Button>
            </Paper>
          )
        )}
      </Box>

      {/* Add Employee Dialog */}
      <Dialog
        open={addDialogOpen}
        onClose={() => !submitting && setAddDialogOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{ 
          sx: { 
            borderRadius: 3,
            maxHeight: '90vh',
          }
        }}
      >
        <DialogTitle sx={{ 
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
          bgcolor: alpha(theme.palette.primary.main, 0.05),
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <Box>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Add New Employee
            </Typography>
            <Stepper 
              activeStep={activeStep} 
              sx={{ mt: 2 }}
            >
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>
          <IconButton
            onClick={() => !submitting && setAddDialogOpen(false)}
            disabled={submitting}
            size="small"
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
          borderTop: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
        }}>
          <Button
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
            sx={{ borderRadius: 2 }}
          >
            Cancel
          </Button>
          <Button
            onClick={addEmployee}
            disabled={submitting}
            variant="contained"
            sx={{ 
              borderRadius: 2,
              minWidth: 120,
            }}
          >
            {submitting ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Add Employee"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </MainLayout>
  );
}