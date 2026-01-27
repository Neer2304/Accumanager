import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  IconButton,
  Button,
  Skeleton,
  Paper,
  useTheme,
  alpha,
  Checkbox,
} from '@mui/material';
import {
  Edit,
  Delete,
  Visibility,
  Person,
  Phone,
  Email,
  Work,
  CalendarToday,
} from '@mui/icons-material';
import { Employee } from '@/types/employee.types';

interface EmployeeGridProps {
  employees: Employee[];
  loading: boolean;
  selectedEmployees: string[];
  onEmployeeSelect?: (employee: Employee) => void;
  onEmployeeEdit?: (employee: Employee) => void;
  onEmployeeDelete?: (employee: Employee) => void;
  onMarkAttendance?: (employee: Employee) => void;
  onViewDetails?: (employee: Employee) => void;
  onCreateEmployee?: () => void;
  emptyMessage: string;
}

export const EmployeeGrid: React.FC<EmployeeGridProps> = ({
  employees,
  loading,
  selectedEmployees,
  onEmployeeSelect,
  onEmployeeEdit,
  onEmployeeDelete,
  onMarkAttendance,
  onViewDetails,
  onCreateEmployee,
  emptyMessage,
}) => {
  const theme = useTheme();

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  if (loading && (!Array.isArray(employees) || employees.length === 0)) {
    return (
      <Box sx={{ 
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)',
          lg: 'repeat(4, 1fr)',
        },
        gap: 3,
      }}>
        {[...Array(6)].map((_, index) => (
          <Card key={index}>
            <CardContent>
              <Skeleton variant="text" width="60%" />
              <Skeleton variant="text" width="40%" />
              <Skeleton variant="rectangular" height={100} sx={{ mt: 2 }} />
            </CardContent>
          </Card>
        ))}
      </Box>
    );
  }

  if (!Array.isArray(employees) || employees.length === 0) {
    return (
      <Paper
        sx={{
          p: 6,
          textAlign: 'center',
          borderRadius: 2,
          backgroundColor: alpha(theme.palette.background.paper, 0.5),
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        }}
      >
        <Person
          sx={{
            fontSize: 64,
            color: theme.palette.text.secondary,
            mb: 2,
            opacity: 0.5,
          }}
        />
        <Typography variant="h6" color="text.secondary" gutterBottom>
          {emptyMessage}
        </Typography>
        {onCreateEmployee && (
          <Button
            variant="contained"
            startIcon={<Person />}
            onClick={onCreateEmployee}
            sx={{ mt: 2 }}
          >
            Add First Employee
          </Button>
        )}
      </Paper>
    );
  }

  return (
    <Box sx={{ 
      display: 'grid',
      gridTemplateColumns: {
        xs: '1fr',
        sm: 'repeat(2, 1fr)',
        md: 'repeat(3, 1fr)',
        lg: 'repeat(4, 1fr)',
      },
      gap: 3,
    }}>
      {employees.map((employee) => (
        <Card
          key={employee._id}
          sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            transition: 'transform 0.2s, box-shadow 0.2s',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: theme.shadows[8],
            },
            border: selectedEmployees.includes(employee._id)
              ? `2px solid ${theme.palette.primary.main}`
              : `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          }}
        >
          <CardContent sx={{ flexGrow: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
              <Box>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  {employee.name || 'Unnamed Employee'}
                </Typography>
                <Chip
                  label={employee.role || 'Employee'}
                  size="small"
                  variant="outlined"
                  sx={{ mb: 1 }}
                />
              </Box>
              <Checkbox
                checked={selectedEmployees.includes(employee._id)}
                onChange={() => onEmployeeSelect?.(employee)}
                size="small"
              />
            </Box>

            {/* Employee Details */}
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Phone fontSize="small" color="action" />
                <Typography variant="body2" color="text.secondary">
                  {employee.phone || 'No phone'}
                </Typography>
              </Box>
              {employee.email && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Email fontSize="small" color="action" />
                  <Typography variant="body2" color="text.secondary">
                    {employee.email}
                  </Typography>
                </Box>
              )}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Work fontSize="small" color="action" />
                <Typography variant="body2" color="text.secondary">
                  {employee.department || 'No department'}
                </Typography>
              </Box>
            </Box>

            {/* Stats Box */}
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(2, 1fr)', 
              gap: 1,
              mb: 2,
              p: 1.5,
              borderRadius: 1,
              backgroundColor: alpha(theme.palette.primary.main, 0.05),
            }}>
              <Box>
                <Typography variant="caption" color="text.secondary" display="block">
                  Salary
                </Typography>
                <Typography variant="body1" fontWeight={600} color="primary">
                  {formatCurrency(employee.salary)}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary" display="block">
                  Type
                </Typography>
                <Typography variant="body2" fontWeight={600}>
                  {employee.salaryType || 'monthly'}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary" display="block">
                  Joined
                </Typography>
                <Typography variant="body2">
                  {formatDate(employee.joiningDate)}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary" display="block">
                  Status
                </Typography>
                <Chip
                  label={employee.isActive ? 'Active' : 'Inactive'}
                  size="small"
                  color={employee.isActive ? 'success' : 'default'}
                />
              </Box>
            </Box>

            {/* Actions */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Button
                size="small"
                onClick={() => onViewDetails?.(employee)}
                startIcon={<Visibility fontSize="small" />}
              >
                Details
              </Button>
              <Box sx={{ display: 'flex', gap: 0.5 }}>
                <IconButton
                  size="small"
                  onClick={() => onMarkAttendance?.(employee)}
                  title="Mark Attendance"
                  color="primary"
                >
                  <CalendarToday fontSize="small" />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => onEmployeeEdit?.(employee)}
                  title="Edit"
                >
                  <Edit fontSize="small" />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => onEmployeeDelete?.(employee)}
                  title="Delete"
                  color="error"
                >
                  <Delete fontSize="small" />
                </IconButton>
              </Box>
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};