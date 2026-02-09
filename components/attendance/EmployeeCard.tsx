"use client";

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Avatar,
  Badge,
  IconButton,
  LinearProgress,
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

// Import Google-themed components
import { Card } from '@/components/ui/Card';
import { Chip } from '@/components/ui/Chip';
import { Button } from '@/components/ui/Button';

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
  darkMode: boolean;
}

export const EmployeeCard: React.FC<EmployeeCardProps> = ({
  employee,
  toggleStatus,
  submitting,
  darkMode
}) => {
  const theme = useTheme();
  const router = useRouter();
  
  // Get current month days for display
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
      hover
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
        backgroundColor: darkMode ? '#202124' : '#ffffff',
        borderRadius: '16px',
        overflow: 'hidden',
      }}
    >
      {/* Header with Avatar and Actions */}
      <Box sx={{ 
        p: 3,
        borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
      }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          mb: 2,
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
                    bgcolor: employee.isActive ? '#34a853' : '#ea4335',
                    border: `2px solid ${darkMode ? '#202124' : '#ffffff'}`,
                    boxShadow: theme.shadows[1],
                  }}
                />
              }
            >
              <Avatar
                sx={{
                  width: 60,
                  height: 60,
                  bgcolor: '#4285f4',
                  color: '#ffffff',
                  fontSize: 24,
                  fontWeight: 'bold',
                }}
              >
                {employee.name.split(' ').map(n => n[0]).join('').toUpperCase()}
              </Avatar>
            </Badge>
            
            <Box sx={{ minWidth: 0 }}>
              <Typography 
                variant="h6" 
                fontWeight={500} 
                gutterBottom 
                sx={{ 
                  wordBreak: 'break-word',
                  color: darkMode ? '#e8eaed' : '#202124',
                }}
              >
                {employee.name}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip
                  icon={<WorkIcon />}
                  label={employee.role}
                  size="small"
                  sx={{
                    backgroundColor: darkMode ? alpha('#4285f4', 0.1) : alpha('#4285f4', 0.08),
                    borderColor: alpha('#4285f4', 0.3),
                    color: darkMode ? '#8ab4f8' : '#4285f4',
                  }}
                />
                {employee.department && (
                  <Chip
                    label={employee.department}
                    size="small"
                    sx={{
                      backgroundColor: darkMode ? alpha('#5f6368', 0.1) : alpha('#5f6368', 0.08),
                      borderColor: alpha('#5f6368', 0.3),
                      color: darkMode ? '#9aa0a6' : '#5f6368',
                    }}
                  />
                )}
              </Box>
            </Box>
          </Box>

          <IconButton
            onClick={handleViewDetails}
            size="small"
            sx={{
              color: darkMode ? '#8ab4f8' : '#4285f4',
              backgroundColor: darkMode ? alpha('#4285f4', 0.1) : alpha('#4285f4', 0.08),
              '&:hover': {
                backgroundColor: darkMode ? alpha('#4285f4', 0.2) : alpha('#4285f4', 0.16),
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
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PhoneIcon fontSize="small" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }} />
            <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
              {employee.phone}
            </Typography>
          </Box>
          
          {employee.email && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <EmailIcon fontSize="small" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }} />
              <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', wordBreak: 'break-all' }}>
                {employee.email}
              </Typography>
            </Box>
          )}
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <MoneyIcon fontSize="small" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }} />
            <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
              {getSalaryDisplay()}
            </Typography>
          </Box>
          
          {employee.joiningDate && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CalendarIcon fontSize="small" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }} />
              <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                Joined: {new Date(employee.joiningDate).toLocaleDateString()}
              </Typography>
            </Box>
          )}
        </Box>
      </Box>

      {/* Performance Metrics */}
      <Box sx={{ p: 3 }}>
        <Typography 
          variant="subtitle2" 
          fontWeight={500} 
          gutterBottom 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1,
            color: darkMode ? '#e8eaed' : '#202124',
          }}
        >
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
            <Typography variant="h4" fontWeight={600} color="#4285f4">
              {getAttendancePercentage()}%
            </Typography>
            <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
              Attendance
            </Typography>
          </Box>
          <Box sx={{ flex: '1 1 calc(50% - 8px)', textAlign: 'center' }}>
            <Typography variant="h4" fontWeight={600} color="#34a853">
              {getTotalWorkHours()}
            </Typography>
            <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
              Work Hours
            </Typography>
          </Box>
          <Box sx={{ flex: '1 1 calc(50% - 8px)', textAlign: 'center' }}>
            <Typography variant="h4" fontWeight={600} color="#fbbc04">
              {getTotalOvertime()}
            </Typography>
            <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
              Overtime
            </Typography>
          </Box>
          <Box sx={{ flex: '1 1 calc(50% - 8px)', textAlign: 'center' }}>
            <Typography variant="h4" fontWeight={600} color="#8ab4f8">
              {employee.leaveBalance}
            </Typography>
            <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
              Leave Days
            </Typography>
          </Box>
        </Box>
        
        <LinearProgress
          variant="determinate"
          value={getAttendancePercentage()}
          sx={{
            height: 6,
            borderRadius: 3,
            backgroundColor: darkMode ? '#3c4043' : alpha('#5f6368', 0.1),
            '& .MuiLinearProgress-bar': {
              backgroundColor: getAttendancePercentage() > 80 ? '#34a853' : 
                              getAttendancePercentage() > 60 ? '#fbbc04' : 
                              '#ea4335',
              borderRadius: 3,
            },
          }}
        />
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
          <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
            {getPresentCount()} Present
          </Typography>
          <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
            {getAbsentCount()} Absent
          </Typography>
        </Box>
      </Box>

      {/* Monthly Attendance Grid */}
      <Box sx={{ p: 3, pt: 0 }}>
        <Typography 
          variant="subtitle2" 
          fontWeight={500} 
          gutterBottom 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1,
            color: darkMode ? '#e8eaed' : '#202124',
          }}
        >
          <TodayIcon fontSize="small" />
          {getCurrentMonthName()}
        </Typography>
        <Paper
          elevation={0}
          sx={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: 1,
            p: 2,
            backgroundColor: darkMode ? '#303134' : '#f8f9fa',
            borderRadius: '12px',
            border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
            minHeight: 120,
            justifyContent: currentMonthDays.length === 0 ? 'center' : 'flex-start',
            alignItems: currentMonthDays.length === 0 ? 'center' : 'flex-start',
          }}
        >
          {currentMonthDays.length === 0 ? (
            <Typography 
              variant="body2" 
              sx={{ 
                py: 2, 
                textAlign: 'center', 
                width: '100%',
                color: darkMode ? '#9aa0a6' : '#5f6368',
              }}
            >
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
                  darkMode={darkMode}
                />
              );
            })
          )}
        </Paper>
      </Box>

      {/* View Details Button */}
      <Box sx={{ 
        p: 2, 
        borderTop: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
      }}>
        <Button
          fullWidth
          onClick={handleViewDetails}
          variant="outlined"
          size="small"
          startIcon={<VisibilityIcon />}
          sx={{
            borderRadius: '8px',
            borderColor: darkMode ? '#3c4043' : '#dadce0',
            color: darkMode ? '#e8eaed' : '#202124',
            '&:hover': {
              borderColor: darkMode ? '#5f6368' : '#bdc1c6',
              backgroundColor: darkMode ? '#303134' : '#f8f9fa',
            },
          }}
        >
          View Full Details
        </Button>
      </Box>
    </Card>
  );
};