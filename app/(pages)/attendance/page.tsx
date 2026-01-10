// app/attendance/page.tsx - THEME AGNOSTIC VERSION
"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Card,
  CardContent,
  Chip,
  Alert,
  CircularProgress,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stepper,
  Step,
  StepLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  useMediaQuery,
  useTheme,
  alpha,
  Avatar,
  Badge,
  CardActions,
  Stack,
  Divider,
  LinearProgress,
} from "@mui/material";
import {
  PersonAdd as PersonAddIcon,
  Visibility as VisibilityIcon,
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
  Edit as EditIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  AccessTime as AccessTimeIcon,
  Today as TodayIcon,
} from "@mui/icons-material";
import { MainLayout } from "@/components/Layout/MainLayout";
import Link from "next/link";

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

// Custom Select Component
function CustomSelect({ label, value, onChange, options, error, helperText, required }: any) {
  return (
    <TextField
      fullWidth
      select
      label={label}
      value={value}
      onChange={onChange}
      error={!!error}
      helperText={helperText}
      required={required}
      SelectProps={{
        native: true,
        MenuProps: {
          PaperProps: {
            sx: {
              borderRadius: 2,
              mt: 1,
            }
          }
        }
      }}
    >
      <option value=""></option>
      {options.map((option: any) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </TextField>
  );
}

// Department Chip Component
function DepartmentChip({ department }: { department: string }) {
  const theme = useTheme();
  
  // Color mapping based on department
  const getDepartmentColor = (dept: string) => {
    const colors: Record<string, { bg: string, text: string }> = {
      Sales: { bg: theme.palette.info.main, text: theme.palette.info.contrastText },
      Marketing: { bg: theme.palette.secondary.main, text: theme.palette.secondary.contrastText },
      Development: { bg: '#3b82f6', text: '#ffffff' },
      Design: { bg: '#8b5cf6', text: '#ffffff' },
      HR: { bg: '#ec4899', text: '#ffffff' },
      Finance: { bg: theme.palette.success.main, text: theme.palette.success.contrastText },
      Operations: { bg: '#f97316', text: '#ffffff' },
      Support: { bg: '#0ea5e9', text: '#ffffff' },
      Management: { bg: '#1e293b', text: '#ffffff' },
      Other: { bg: theme.palette.grey[600], text: theme.palette.grey[100] },
    };
    
    return colors[dept] || { bg: theme.palette.grey[500], text: theme.palette.grey[100] };
  };

  const color = getDepartmentColor(department);

  return (
    <Chip
      label={department}
      size="small"
      sx={{
        bgcolor: alpha(color.bg, 0.15),
        color: color.bg,
        fontWeight: 600,
        borderRadius: 1.5,
        border: `1px solid ${alpha(color.bg, 0.3)}`,
      }}
    />
  );
}

// Attendance Day Component
function AttendanceDay({ 
  day, 
  employeeId, 
  toggleStatus, 
  submitting 
}: { 
  day: Day; 
  employeeId: string; 
  toggleStatus: Function; 
  submitting: boolean;
}) {
  const theme = useTheme();
  const date = new Date(day.date);
  const dayNumber = date.getDate();
  const isToday = date.toDateString() === new Date().toDateString();
  const isWeekend = date.getDay() === 0 || date.getDay() === 6;
  const isPresent = day.status === "Present";

  return (
    <Tooltip
      title={`${date.toLocaleDateString('en-US', { 
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      })} - ${day.status}${isToday ? ' (Today)' : ''}`}
      arrow
    >
      <Box
        sx={{
          width: 40,
          height: 40,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 2,
          cursor: submitting ? "not-allowed" : "pointer",
          backgroundColor: isPresent
            ? theme.palette.success.main
            : theme.palette.error.main,
          color: theme.palette.common.white,
          fontSize: "0.875rem",
          fontWeight: "bold",
          opacity: submitting ? 0.6 : 1,
          transition: "all 0.2s ease",
          border: isToday ? `2px solid ${theme.palette.warning.main}` : 'none',
          boxShadow: theme.shadows[1],
          position: 'relative',
          "&:hover": {
            opacity: submitting ? 0.6 : 0.9,
            transform: submitting ? "none" : "scale(1.05)",
            boxShadow: theme.shadows[2],
          },
          "&::after": isWeekend ? {
            content: '""',
            position: 'absolute',
            top: -2,
            right: -2,
            width: 8,
            height: 8,
            borderRadius: '50%',
            backgroundColor: theme.palette.secondary.main,
            border: `1px solid ${theme.palette.background.paper}`,
          } : {}
        }}
        onClick={() => !submitting && toggleStatus(employeeId, day.date, day.status)}
      >
        {dayNumber}
      </Box>
    </Tooltip>
  );
}

// Employee Card Component
function EmployeeCard({ 
  employee, 
  toggleStatus, 
  submitting 
}: { 
  employee: Employee; 
  toggleStatus: Function; 
  submitting: boolean;
}) {
  const theme = useTheme();
  
  const getPresentCount = () => {
    return employee.days.filter((day) => day.status === "Present").length;
  };

  const getAbsentCount = () => {
    return employee.days.filter((day) => day.status === "Absent").length;
  };

  const getAttendancePercentage = () => {
    if (employee.days.length === 0) return 0;
    return Math.round((getPresentCount() / employee.days.length) * 100);
  };

  const getSalaryDisplay = () => {
    if (!employee.salary) return "Not specified";
    return `₹${employee.salary.toLocaleString()}/${employee.salaryType}`;
  };

  return (
    <Card 
      sx={{
        borderRadius: 3,
        boxShadow: theme.shadows[3],
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
        '&:hover': {
          boxShadow: theme.shadows[6],
          transform: 'translateY(-4px)',
        },
      }}
    >
      <CardContent sx={{ p: 3, flex: 1 }}>
        {/* Header with Avatar and Actions */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          mb: 3,
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Badge
              overlap="circular"
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              badgeContent={
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    bgcolor: employee.isActive ? theme.palette.success.main : theme.palette.error.main,
                    border: `2px solid ${theme.palette.background.paper}`,
                  }}
                />
              }
            >
              <Avatar
                sx={{
                  width: 60,
                  height: 60,
                  bgcolor: theme.palette.primary.main,
                  color: theme.palette.primary.contrastText,
                  fontSize: 24,
                  fontWeight: 'bold',
                  boxShadow: theme.shadows[2],
                }}
              >
                {employee.name.charAt(0).toUpperCase()}
              </Avatar>
            </Badge>
            
            <Box>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                {employee.name}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip
                  icon={<WorkIcon />}
                  label={employee.role}
                  size="small"
                  sx={{
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    color: theme.palette.primary.main,
                    fontWeight: 600,
                  }}
                />
                {employee.department && (
                  <DepartmentChip department={employee.department} />
                )}
              </Box>
            </Box>
          </Box>

          <IconButton
            component={Link}
            href={`/attendance/${employee._id}`}
            size="small"
            sx={{
              color: theme.palette.primary.main,
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              '&:hover': {
                bgcolor: alpha(theme.palette.primary.main, 0.2),
              },
            }}
          >
            <VisibilityIcon fontSize="small" />
          </IconButton>
        </Box>

        {/* Contact & Salary Info */}
        <Stack spacing={1.5} mb={3}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PhoneIcon fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              {employee.phone}
            </Typography>
          </Box>
          
          {employee.email && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <EmailIcon fontSize="small" color="action" />
              <Typography variant="body2" color="text.secondary">
                {employee.email}
              </Typography>
            </Box>
          )}
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <MoneyIcon fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              {getSalaryDisplay()}
            </Typography>
          </Box>
          
          {employee.joiningDate && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CalendarIcon fontSize="small" color="action" />
              <Typography variant="body2" color="text.secondary">
                Joined: {new Date(employee.joiningDate).toLocaleDateString()}
              </Typography>
            </Box>
          )}
        </Stack>

        {/* Attendance Summary */}
        <Paper
          elevation={0}
          sx={{
            p: 2,
            mb: 3,
            bgcolor: alpha(theme.palette.primary.main, 0.03),
            borderRadius: 2,
            border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
          }}
        >
          <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
            Attendance Summary
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
            <Chip
              icon={<CheckCircleIcon />}
              label={`${getPresentCount()} Present`}
              size="small"
              sx={{
                bgcolor: alpha(theme.palette.success.main, 0.1),
                color: theme.palette.success.main,
                border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
              }}
            />
            <Chip
              icon={<CancelIcon />}
              label={`${getAbsentCount()} Absent`}
              size="small"
              sx={{
                bgcolor: alpha(theme.palette.error.main, 0.1),
                color: theme.palette.error.main,
                border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`,
              }}
            />
            <Chip
              icon={<TrendingUpIcon />}
              label={`${getAttendancePercentage()}% Rate`}
              size="small"
              sx={{
                bgcolor: alpha(theme.palette.info.main, 0.1),
                color: theme.palette.info.main,
                border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
              }}
            />
          </Box>
          
          <LinearProgress
            variant="determinate"
            value={getAttendancePercentage()}
            sx={{
              mt: 2,
              height: 6,
              borderRadius: 3,
              bgcolor: alpha(theme.palette.grey[500], 0.1),
              '& .MuiLinearProgress-bar': {
                bgcolor: theme.palette.info.main,
                borderRadius: 3,
              },
            }}
          />
        </Paper>

        {/* Monthly Attendance Grid */}
        <Box>
          <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
            This Month's Attendance
          </Typography>
          <Box sx={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: 1,
            p: 2,
            bgcolor: alpha(theme.palette.action.hover, 0.3),
            borderRadius: 2,
            border: `1px solid ${alpha(theme.palette.divider, 0.3)}`,
          }}>
            {employee.days.length === 0 ? (
              <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center', width: '100%' }}>
                No attendance records yet
              </Typography>
            ) : (
              employee.days.map((day) => (
                <AttendanceDay
                  key={day.date}
                  day={day}
                  employeeId={employee._id}
                  toggleStatus={toggleStatus}
                  submitting={submitting}
                />
              ))
            )}
          </Box>
        </Box>
      </CardContent>
      
      <CardActions sx={{ 
        p: 2, 
        pt: 0,
        borderTop: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
      }}>
        <Button
          fullWidth
          component={Link}
          href={`/attendance/${employee._id}`}
          variant="outlined"
          size="small"
          startIcon={<VisibilityIcon />}
        >
          View Details
        </Button>
      </CardActions>
    </Card>
  );
}

// Main Attendance Page Component
export default function AttendancePage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

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

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const today = new Date();
  const daysInMonth = new Date(
    today.getFullYear(),
    today.getMonth() + 1,
    0
  ).getDate();

  // Fetch employees
  const fetchEmployees = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/api/attendance", {
        credentials: 'include'
      });

      if (response.status === 401) {
        setError("Session expired. Please login again.");
        return;
      }

      if (response.status === 402) {
        const errorData = await response.json();
        setError(errorData.error);
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to fetch attendance data");
      }

      const data = await response.json();
      setEmployees(data || []);
    } catch (err: any) {
      console.error('Error fetching employees:', err);
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

      const response = await fetch("/api/attendance", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employeeId,
          date,
          status: newStatus,
        }),
      });

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
    } catch (err: any) {
      setError(err instanceof Error ? err.message : "Failed to update attendance");
      await fetchEmployees();
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
            />
            <CustomSelect
              label="Department"
              value={basicInfo.department}
              onChange={(e: any) =>
                setBasicInfo((prev) => ({ ...prev, department: e.target.value }))
              }
              options={departments.map(dept => ({ value: dept, label: dept }))}
            />
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              <TextField
                fullWidth
                label="Salary"
                type="number"
                value={basicInfo.salary}
                onChange={(e) =>
                  setBasicInfo((prev) => ({ ...prev, salary: e.target.value }))
                }
              />
              <CustomSelect
                label="Salary Type"
                value={basicInfo.salaryType}
                onChange={(e: any) =>
                  setBasicInfo((prev) => ({ ...prev, salaryType: e.target.value }))
                }
                options={salaryTypes}
              />
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
            />
          </Box>
        );
      default:
        return null;
    }
  };

  const steps = ["Basic Information"];

  return (
    <MainLayout title="Employee Attendance">
      <Box sx={{ p: { xs: 2, sm: 3 }, maxWidth: 1400, margin: "0 auto" }}>
        {/* Header */}
        <Paper
          sx={{
            p: { xs: 3, sm: 4 },
            mb: 4,
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
            color: theme.palette.primary.contrastText,
            borderRadius: 3,
            boxShadow: theme.shadows[4],
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 3,
            position: 'relative',
            zIndex: 1,
          }}>
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 80,
              height: 80,
              borderRadius: '50%',
              bgcolor: alpha(theme.palette.common.white, 0.2),
              backdropFilter: 'blur(10px)',
              border: `1px solid ${alpha(theme.palette.common.white, 0.3)}`,
            }}>
              <GroupsIcon sx={{ fontSize: 40, color: theme.palette.common.white }} />
            </Box>
            
            <Box>
              <Typography
                variant="h3"
                component="h1"
                fontWeight="bold"
                gutterBottom
                sx={{ 
                  fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.75rem' },
                  color: theme.palette.common.white,
                }}
              >
                Employee Management
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9, color: theme.palette.common.white }}>
                {today.toLocaleString("default", { month: "long", year: "numeric" })} • 
                {employees.length} Employee{employees.length !== 1 ? 's' : ''}
              </Typography>
            </Box>
          </Box>
        </Paper>

        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 3, 
              borderRadius: 2,
              boxShadow: theme.shadows[1],
            }} 
            onClose={() => setError(null)}
            action={
              <Button 
                color="inherit" 
                size="small"
                onClick={() => window.location.href = '/pricing'}
              >
                Upgrade
              </Button>
            }
          >
            {error}
          </Alert>
        )}

        {/* Loading State */}
        {loading && employees.length === 0 && (
          <Box sx={{ 
            display: "flex", 
            flexDirection: "column",
            justifyContent: "center", 
            alignItems: "center",
            minHeight: 400,
            gap: 2,
            mb: 4 
          }}>
            <CircularProgress size={60} />
            <Typography variant="h6" color="text.secondary">
              Loading employees...
            </Typography>
          </Box>
        )}

        {/* Header Controls */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 4,
          gap: 2,
          flexWrap: 'wrap'
        }}>
          <Box>
            <Typography variant="h5" fontWeight="bold">
              Employee Directory
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Manage your team's attendance and details
            </Typography>
          </Box>
          
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
              transition: 'all 0.3s',
            }}
          >
            Add Employee
          </Button>
        </Box>

        {/* Employees Grid */}
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
                width: 80, 
                height: 80, 
                borderRadius: '50%',
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: theme.palette.primary.main,
                fontSize: 32,
                mb: 3,
                mx: 'auto',
              }}>
                <GroupsIcon fontSize="inherit" />
              </Box>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                No employees yet
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Start by adding your first team member to track attendance
              </Typography>
              <Button
                variant="contained"
                startIcon={<PersonAddIcon />}
                onClick={() => setAddDialogOpen(true)}
                size="large"
                sx={{
                  borderRadius: 2,
                  px: 4,
                  fontWeight: 'bold',
                }}
              >
                Add First Employee
              </Button>
            </Paper>
          )
        )}
      </Box>

      {/* Add Employee Dialog */}
      <Dialog
        open={addDialogOpen}
        onClose={() => !submitting && setAddDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ 
          sx: { 
            borderRadius: 3,
          }
        }}
      >
        <DialogTitle>
          <Typography variant="h5" fontWeight="bold">
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
        </DialogTitle>

        <DialogContent sx={{ p: 3 }}>
          {renderStepContent(activeStep)}
        </DialogContent>

        <DialogActions sx={{ p: 3, gap: 2 }}>
          <Button
            onClick={() => setAddDialogOpen(false)}
            disabled={submitting}
            variant="outlined"
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              // Handle form submission
              setAddDialogOpen(false);
            }}
            disabled={submitting}
            variant="contained"
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