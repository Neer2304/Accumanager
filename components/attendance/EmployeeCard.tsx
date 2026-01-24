// components/attendance/EmployeeCard.tsx - FIXED VERSION
import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Avatar,
  Badge,
  Chip,
  Button,
  LinearProgress,
  IconButton,
  useTheme,
  alpha,
  Paper
} from '@mui/material';
import {
  Work as WorkIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Money as MoneyIcon,
  CalendarToday as CalendarIcon,
  TrendingUp as TrendingUpIcon,
  Today as TodayIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { DepartmentChip } from './DepartmentChip';
import { AttendanceDay } from './AttendanceDay';

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
  leaveBalance: number;
  days: Day[];
  isActive: boolean;
}

interface EmployeeCardProps {
  employee: Employee;
  toggleStatus: (employeeId: string, date: string, status: string) => void;
  submitting: boolean;
}

export const EmployeeCard: React.FC<EmployeeCardProps> = ({
  employee,
  toggleStatus,
  submitting
}) => {
  const theme = useTheme();
  const router = useRouter();
  
  // Get current month days for display - FIXED VERSION
  const getCurrentMonthDays = () => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    // Get days in current month
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const days: Day[] = [];
    
    // Group existing days by date to avoid duplicates
    const existingDaysByDate = new Map<string, Day>();
    
    // Filter and group existing days for current month
    employee.days.forEach(day => {
      try {
        const date = new Date(day.date);
        if (date.getMonth() === currentMonth && date.getFullYear() === currentYear) {
          const dateStr = date.toISOString().split('T')[0];
          
          // If we already have this date, keep only one (prefer "Present")
          if (existingDaysByDate.has(dateStr)) {
            const existingDay = existingDaysByDate.get(dateStr)!;
            if (day.status === "Present" && existingDay.status === "Absent") {
              existingDaysByDate.set(dateStr, day);
            }
          } else {
            existingDaysByDate.set(dateStr, day);
          }
        }
      } catch (err) {
        console.error(`Error processing date ${day.date}:`, err);
      }
    });
    
    // Create array for current month (1-31) with unique dates
    const dateSet = new Set<string>();
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day);
      const dateString = date.toISOString().split('T')[0];
      
      // Ensure no duplicates
      if (!dateSet.has(dateString)) {
        dateSet.add(dateString);
        
        if (existingDaysByDate.has(dateString)) {
          days.push(existingDaysByDate.get(dateString)!);
        } else {
          // Create default day
          days.push({
            date: dateString,
            status: date > today ? "Absent" : "Absent",
          });
        }
      }
    }
    
    // Log if duplicates were found (for debugging)
    const uniqueDays = new Set(days.map(d => d.date));
    if (uniqueDays.size !== days.length) {
      console.warn(`Found duplicate dates for ${employee.name}:`, 
        days.filter((day, index) => days.findIndex(d => d.date === day.date) !== index));
    }
    
    return days;
  };
  
  const currentMonthDays = getCurrentMonthDays();
  
  const getPresentCount = () => {
    return currentMonthDays.filter((day) => {
      const dayDate = new Date(day.date);
      return dayDate <= new Date() && day.status === "Present";
    }).length;
  };

  const getAbsentCount = () => {
    return currentMonthDays.filter((day) => {
      const dayDate = new Date(day.date);
      return dayDate <= new Date() && day.status === "Absent";
    }).length;
  };

  const getAttendancePercentage = () => {
    const totalDays = currentMonthDays.filter(day => {
      const dayDate = new Date(day.date);
      return dayDate <= new Date();
    }).length;
    
    if (totalDays === 0) return 0;
    const presentDays = getPresentCount();
    
    return Math.round((presentDays / totalDays) * 100);
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

  const handleDayClick = (date: string, currentStatus: string) => {
    const dayDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Only allow clicking on today or past dates
    if (dayDate <= today) {
      toggleStatus(employee._id, date, currentStatus);
    }
  };

  // Get month name for display
  const getCurrentMonthName = () => {
    return new Date().toLocaleString('default', { month: 'long', year: 'numeric' });
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
              },
            }}
          >
            <VisibilityIcon fontSize="small" />
          </IconButton>
        </Box>

        {/* Contact & Salary Info */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          gap: 1.5, 
          mb: 3 
        }}>
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
        </Box>

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
          
          {/* Stats Grid */}
          <Box sx={{ 
            display: 'flex', 
            flexWrap: 'wrap',
            gap: 2,
            mb: 2 
          }}>
            <Box sx={{ flex: '1 1 calc(50% - 8px)', textAlign: 'center' }}>
              <Typography variant="h4" fontWeight="bold" color="primary">
                {getAttendancePercentage()}%
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Attendance
              </Typography>
            </Box>
            <Box sx={{ flex: '1 1 calc(50% - 8px)', textAlign: 'center' }}>
              <Typography variant="h4" fontWeight="bold" color="success.main">
                {getTotalWorkHours()}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Work Hours
              </Typography>
            </Box>
            <Box sx={{ flex: '1 1 calc(50% - 8px)', textAlign: 'center' }}>
              <Typography variant="h4" fontWeight="bold" color="warning.main">
                {getTotalOvertime()}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Overtime
              </Typography>
            </Box>
            <Box sx={{ flex: '1 1 calc(50% - 8px)', textAlign: 'center' }}>
              <Typography variant="h4" fontWeight="bold" color="info.main">
                {employee.leaveBalance}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Leave Days
              </Typography>
            </Box>
          </Box>
          
          <LinearProgress
            variant="determinate"
            value={getAttendancePercentage()}
            sx={{
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
            {getCurrentMonthName()}
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
            justifyContent: currentMonthDays.length === 0 ? 'center' : 'flex-start',
            alignItems: currentMonthDays.length === 0 ? 'center' : 'flex-start',
          }}>
            {currentMonthDays.length === 0 ? (
              <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center', width: '100%' }}>
                No attendance records yet
              </Typography>
            ) : (
              currentMonthDays.map((day, index) => {
                const dayDate = new Date(day.date);
                const isToday = dayDate.toDateString() === new Date().toDateString();
                const isFuture = dayDate > new Date();
                const isSelectable = !isFuture;
                
                // Create a unique key that includes employee ID and date
                const uniqueKey = `${employee._id}-${day.date}-${index}`;
                
                return (
                  <AttendanceDay
                    key={uniqueKey}
                    date={dayDate}
                    status={day.status}
                    workHours={day.workHours}
                    overtime={day.overtime}
                    checkIn={day.checkIn}
                    checkOut={day.checkOut}
                    notes={day.notes}
                    isSelectable={isSelectable}
                    isToday={isToday}
                    onClick={() => handleDayClick(day.date, day.status)}
                    submitting={submitting}
                  />
                );
              })
            )}
          </Box>
          
          {currentMonthDays.length > 0 && (
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
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: theme.palette.secondary.main }} />
                <Typography variant="caption" color="text.secondary">Weekend</Typography>
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
};