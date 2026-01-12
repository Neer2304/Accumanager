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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
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
import { useRouter } from "next/navigation";

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
  const theme = useTheme();
  
  return (
    <FormControl fullWidth error={!!error} required={required}>
      <InputLabel>{label}</InputLabel>
      <Select
        value={value}
        onChange={onChange}
        label={label}
        MenuProps={{
          PaperProps: {
            sx: {
              borderRadius: 2,
              mt: 1,
              boxShadow: theme.shadows[3],
            }
          }
        }}
      >
        <MenuItem value=""><em>Select {label}</em></MenuItem>
        {options.map((option: any) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
      {helperText && (
        <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
          {helperText}
        </Typography>
      )}
    </FormControl>
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
        '&:hover': {
          bgcolor: alpha(color.bg, 0.25),
        }
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

  const getDayTooltip = () => {
    const formattedDate = date.toLocaleDateString('en-US', { 
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
    
    let tooltip = `${formattedDate} - ${day.status}`;
    if (isToday) tooltip += ' (Today)';
    if (isWeekend) tooltip += ' (Weekend)';
    if (day.checkIn && day.checkOut) {
      tooltip += `\n${day.checkIn} - ${day.checkOut}`;
    }
    if (day.workHours) {
      tooltip += `\n${day.workHours.toFixed(1)} hours`;
      if (day.overtime) {
        tooltip += ` (${day.overtime.toFixed(1)} overtime)`;
      }
    }
    return tooltip;
  };

  return (
    <Tooltip title={getDayTooltip()} arrow>
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
        {day.workHours && day.workHours > 8 && (
          <Box
            sx={{
              position: 'absolute',
              bottom: -4,
              right: -4,
              width: 12,
              height: 12,
              borderRadius: '50%',
              backgroundColor: theme.palette.warning.main,
              border: `1px solid ${theme.palette.background.paper}`,
            }}
          />
        )}
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
  const router = useRouter();
  
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

  const getTotalWorkHours = () => {
    return employee.days
      .filter(day => day.status === "Present")
      .reduce((total, day) => total + (day.workHours || 0), 0)
      .toFixed(1);
  };

  const getTotalOvertime = () => {
    return employee.days
      .filter(day => day.status === "Present")
      .reduce((total, day) => total + (day.overtime || 0), 0)
      .toFixed(1);
  };

  const handleViewDetails = () => {
    router.push(`/attendance/${employee._id}`);
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
          borderColor: alpha(theme.palette.primary.main, 0.3),
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
                    width: 14,
                    height: 14,
                    borderRadius: '50%',
                    bgcolor: employee.isActive ? theme.palette.success.main : theme.palette.error.main,
                    border: `2px solid ${theme.palette.background.paper}`,
                    boxShadow: theme.shadows[1],
                  }}
                />
              }
            >
              <Avatar
                sx={{
                  width: 64,
                  height: 64,
                  bgcolor: theme.palette.primary.main,
                  color: theme.palette.primary.contrastText,
                  fontSize: 26,
                  fontWeight: 'bold',
                  boxShadow: theme.shadows[2],
                  '&:hover': {
                    transform: 'scale(1.05)',
                    transition: 'transform 0.3s',
                  }
                }}
              >
                {employee.name.split(' ').map(n => n[0]).join('').toUpperCase()}
              </Avatar>
            </Badge>
            
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ wordBreak: 'break-word' }}>
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
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                  }}
                />
                {employee.department && (
                  <DepartmentChip department={employee.department} />
                )}
              </Box>
            </Box>
          </Box>

          <IconButton
            onClick={handleViewDetails}
            size="small"
            sx={{
              color: theme.palette.primary.main,
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              '&:hover': {
                bgcolor: alpha(theme.palette.primary.main, 0.2),
                transform: 'rotate(15deg)',
              },
              transition: 'all 0.3s',
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
              <Typography variant="body2" color="text.secondary" sx={{ wordBreak: 'break-all' }}>
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

        {/* Detailed Stats */}
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
          <Typography variant="subtitle2" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TrendingUpIcon fontSize="small" />
            Performance Metrics
          </Typography>
          
          <Grid container spacing={1.5}>
            <Grid item xs={6}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" fontWeight="bold" color="primary">
                  {getAttendancePercentage()}%
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Attendance
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" fontWeight="bold" color="success.main">
                  {getTotalWorkHours()}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Work Hours
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" fontWeight="bold" color="warning.main">
                  {getTotalOvertime()}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Overtime
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" fontWeight="bold" color="info.main">
                  {employee.leaveBalance}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Leave Days
                </Typography>
              </Box>
            </Grid>
          </Grid>
          
          <LinearProgress
            variant="determinate"
            value={getAttendancePercentage()}
            sx={{
              mt: 2,
              height: 8,
              borderRadius: 3,
              bgcolor: alpha(theme.palette.grey[500], 0.1),
              '& .MuiLinearProgress-bar': {
                bgcolor: getAttendancePercentage() > 80 ? theme.palette.success.main : 
                         getAttendancePercentage() > 60 ? theme.palette.warning.main : 
                         theme.palette.error.main,
                borderRadius: 3,
              },
            }}
          />
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
            <Typography variant="caption" color="text.secondary">
              {getPresentCount()} Present
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {getAbsentCount()} Absent
            </Typography>
          </Box>
        </Paper>

        {/* Monthly Attendance Grid */}
        <Box>
          <Typography variant="subtitle2" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TodayIcon fontSize="small" />
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
            minHeight: 120,
            justifyContent: employee.days.length === 0 ? 'center' : 'flex-start',
            alignItems: employee.days.length === 0 ? 'center' : 'flex-start',
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
          
          {employee.days.length > 0 && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2, flexWrap: 'wrap' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: theme.palette.success.main }} />
                <Typography variant="caption" color="text.secondary">Present</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: theme.palette.error.main }} />
                <Typography variant="caption" color="text.secondary">Absent</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: theme.palette.warning.main, border: `1px solid ${theme.palette.divider}` }} />
                <Typography variant="caption" color="text.secondary">Overtime</Typography>
              </Box>
            </Box>
          )}
        </Box>
      </CardContent>
      
      <CardActions sx={{ 
        p: 2, 
        pt: 0,
        borderTop: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
      }}>
        <Button
          fullWidth
          onClick={handleViewDetails}
          variant="outlined"
          size="small"
          startIcon={<VisibilityIcon />}
          sx={{
            borderRadius: 2,
            fontWeight: 600,
            '&:hover': {
              transform: 'translateY(-1px)',
              boxShadow: theme.shadows[2],
            },
            transition: 'all 0.2s',
          }}
        >
          View Full Details
        </Button>
      </CardActions>
    </Card>
  );
}

// Grid component for layout
const Grid = ({ children, container, item, spacing, xs, sm, md, lg, sx }: any) => {
  if (container) {
    return (
      <Box sx={{ 
        display: 'grid', 
        gap: spacing || 2,
        ...(sx || {})
      }}>
        {children}
      </Box>
    );
  }
  
  if (item) {
    return (
      <Box sx={{ 
        gridColumn: getGridColumn({ xs, sm, md, lg }),
        ...(sx || {})
      }}>
        {children}
      </Box>
    );
  }
  
  return <Box sx={sx}>{children}</Box>;
};

const getGridColumn = ({ xs, sm, md, lg }: any) => {
  const columns = { xs: 12, sm: 12, md: 12, lg: 12 };
  if (xs) columns.xs = xs;
  if (sm) columns.sm = sm;
  if (md) columns.md = md;
  if (lg) columns.lg = lg;
  
  return {
    xs: `span ${columns.xs}`,
    sm: `span ${columns.sm}`,
    md: `span ${columns.md}`,
    lg: `span ${columns.lg}`,
  };
};

// Main Attendance Page Component
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
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
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
              </Grid>
              <Grid item xs={12} sm={6}>
                <CustomSelect
                  label="Salary Type"
                  value={basicInfo.salaryType}
                  onChange={(e: any) =>
                    setBasicInfo((prev) => ({ ...prev, salaryType: e.target.value }))
                  }
                  options={salaryTypes}
                />
              </Grid>
            </Grid>
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
                <Stack spacing={2}>
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
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Contact Phone"
                        value={advancedInfo.emergencyContactPhone}
                        onChange={(e) => setAdvancedInfo(prev => ({ ...prev, emergencyContactPhone: e.target.value }))}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Relation"
                        value={advancedInfo.emergencyContactRelation}
                        onChange={(e) => setAdvancedInfo(prev => ({ ...prev, emergencyContactRelation: e.target.value }))}
                      />
                    </Grid>
                  </Grid>
                  
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
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Bank Name"
                        value={advancedInfo.bankName}
                        onChange={(e) => setAdvancedInfo(prev => ({ ...prev, bankName: e.target.value }))}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="IFSC Code"
                        value={advancedInfo.ifscCode}
                        onChange={(e) => setAdvancedInfo(prev => ({ ...prev, ifscCode: e.target.value.toUpperCase() }))}
                      />
                    </Grid>
                  </Grid>
                  
                  <TextField
                    fullWidth
                    label="Account Holder Name"
                    value={advancedInfo.accountHolder}
                    onChange={(e) => setAdvancedInfo(prev => ({ ...prev, accountHolder: e.target.value }))}
                  />
                  
                  <Divider>Documents</Divider>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Aadhaar Number"
                        value={advancedInfo.aadhaar}
                        onChange={(e) => setAdvancedInfo(prev => ({ ...prev, aadhaar: e.target.value.replace(/\D/g, '').slice(0, 12) }))}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="PAN Number"
                        value={advancedInfo.pan}
                        onChange={(e) => setAdvancedInfo(prev => ({ ...prev, pan: e.target.value.toUpperCase() }))}
                      />
                    </Grid>
                  </Grid>
                  
                  <TextField
                    fullWidth
                    label="License Number"
                    value={advancedInfo.license}
                    onChange={(e) => setAdvancedInfo(prev => ({ ...prev, license: e.target.value }))}
                  />
                </Stack>
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
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'url(/pattern.svg)',
              opacity: 0.1,
            }
          }}
        >
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 3,
            position: 'relative',
            zIndex: 1,
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
                  textShadow: '0 2px 4px rgba(0,0,0,0.2)',
                }}
              >
                Employee Management
              </Typography>
              <Typography variant="h5" sx={{ opacity: 0.9, color: theme.palette.common.white, mb: 1 }}>
                {new Date().toLocaleString("default", { month: "long", year: "numeric" })} • 
                {employees.length} Employee{employees.length !== 1 ? 's' : ''}
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: { xs: 'center', sm: 'flex-start' } }}>
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
              boxShadow: theme.shadows[1],
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
                  transition: 'all 0.3s',
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
                position: 'relative',
                overflow: 'hidden',
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
                  transition: 'all 0.3s',
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
        }}>
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