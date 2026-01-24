import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  LinearProgress,
  useTheme,
  alpha,
} from '@mui/material';

interface AttendanceProgressProps {
  presentCount: number;
  totalDays: number;
  attendancePercentage: number;
  currentMonth: string;
}

export const AttendanceProgress: React.FC<AttendanceProgressProps> = ({
  presentCount,
  totalDays,
  attendancePercentage,
  currentMonth,
}) => {
  const theme = useTheme();

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" fontWeight="bold">
            Attendance Progress - {currentMonth}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {presentCount}/{totalDays} days
          </Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={attendancePercentage}
          sx={{
            height: 10,
            borderRadius: 5,
            backgroundColor: alpha(theme.palette.primary.main, 0.1),
            "& .MuiLinearProgress-bar": {
              backgroundColor:
                attendancePercentage >= 90
                  ? theme.palette.success.main
                  : attendancePercentage >= 75
                  ? theme.palette.warning.main
                  : theme.palette.error.main,
              borderRadius: 5,
            },
          }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
          <Typography variant="caption" color="text.secondary">
            Goal: 90%
          </Typography>
          <Typography 
            variant="caption" 
            fontWeight="bold"
            color={
              attendancePercentage >= 90
                ? theme.palette.success.main
                : attendancePercentage >= 75
                ? theme.palette.warning.main
                : theme.palette.error.main
            }
          >
            {attendancePercentage}%
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};