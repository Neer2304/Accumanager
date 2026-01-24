import React from 'react';
import {
  Box,
  Typography,
  CardContent,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Badge,
  useTheme,
  alpha,
  useMediaQuery,
} from '@mui/material';
import {
  CalendarToday as CalendarIcon,
  AccessTime as TimeIcon,
} from '@mui/icons-material';

interface Day {
  date: string;
  status: "Present" | "Absent";
  checkIn?: string;
  checkOut?: string;
  workHours?: number;
  overtime?: number;
  notes?: string;
}

interface AttendanceTableProps {
  days: Day[];
  presentCount: number;
  absentCount: number;
  currentMonth: string;
  isMobile: boolean;
}

export const AttendanceTable: React.FC<AttendanceTableProps> = ({
  days,
  presentCount,
  absentCount,
  currentMonth,
  isMobile,
}) => {
  const theme = useTheme();

  if (days.length === 0) {
    return (
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
    );
  }

  return (
    <>
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
            Total: {days.length} days
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
            {days.map((day) => {
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
    </>
  );
};