// components/attendance/AttendanceDay.tsx
import React from 'react';
import { Box, Tooltip, useTheme, alpha } from '@mui/material';

interface AttendanceDayProps {
  date: Date;
  status: "Present" | "Absent";
  workHours?: number;
  overtime?: number;
  checkIn?: string;
  checkOut?: string;
  notes?: string;
  isSelectable: boolean;
  isToday: boolean;
  onClick: () => void;
  submitting: boolean;
}

export const AttendanceDay: React.FC<AttendanceDayProps> = ({
  date,
  status,
  workHours,
  overtime,
  checkIn,
  checkOut,
  notes,
  isSelectable,
  isToday,
  onClick,
  submitting
}) => {
  const theme = useTheme();
  const dayNumber = date.getDate();
  const isWeekend = date.getDay() === 0 || date.getDay() === 6;
  const isPresent = status === "Present";
  const isFuture = date > new Date();

  const getDayTooltip = () => {
    const formattedDate = date.toLocaleDateString('en-US', { 
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
    
    let tooltip = `${formattedDate}`;
    
    if (isToday) tooltip += ' (Today)';
    if (isWeekend) tooltip += ' (Weekend)';
    if (isFuture) tooltip += ' (Future)';
    if (status) tooltip += `\nStatus: ${status}`;
    
    if (checkIn && checkOut) {
      tooltip += `\n${checkIn} - ${checkOut}`;
    }
    if (workHours) {
      tooltip += `\n${workHours.toFixed(1)} hours`;
      if (overtime) {
        tooltip += ` (${overtime.toFixed(1)} overtime)`;
      }
    }
    if (notes) {
      tooltip += `\nNotes: ${notes}`;
    }
    return tooltip;
  };

  const getDayColor = () => {
    if (isFuture) {
      return theme.palette.grey[400];
    }
    if (status === "Present") {
      return theme.palette.success.main;
    }
    if (status === "Absent") {
      return theme.palette.error.main;
    }
    return theme.palette.grey[500];
  };

  const getDayBackgroundColor = () => {
    if (isFuture) {
      return alpha(theme.palette.grey[400], 0.2);
    }
    if (status === "Present") {
      return alpha(theme.palette.success.main, 0.9);
    }
    if (status === "Absent") {
      return alpha(theme.palette.error.main, 0.9);
    }
    return alpha(theme.palette.grey[500], 0.2);
  };

  return (
    <Tooltip title={getDayTooltip()} arrow placement="top">
      <Box
        sx={{
          width: { xs: 36, sm: 40, md: 44 },
          height: { xs: 36, sm: 40, md: 44 },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 2,
          cursor: isSelectable && !submitting && !isFuture ? 'pointer' : 'default',
          backgroundColor: getDayBackgroundColor(),
          color: isFuture || status ? theme.palette.common.white : theme.palette.text.primary,
          fontSize: { xs: '0.875rem', sm: '1rem' },
          fontWeight: 'bold',
          opacity: submitting ? 0.6 : 1,
          transition: 'all 0.2s ease',
          border: isToday ? `2px solid ${theme.palette.warning.main}` : 
                 isWeekend ? `1px solid ${alpha(theme.palette.secondary.main, 0.5)}` : 'none',
          boxShadow: theme.shadows[1],
          position: 'relative',
          "&:hover": {
            opacity: isSelectable && !submitting && !isFuture ? 0.9 : 1,
            transform: isSelectable && !submitting && !isFuture ? 'scale(1.05)' : 'none',
            boxShadow: isSelectable && !submitting && !isFuture ? theme.shadows[2] : theme.shadows[1],
          },
          "&::after": isWeekend ? {
            content: '""',
            position: 'absolute',
            top: -3,
            right: -3,
            width: 8,
            height: 8,
            borderRadius: '50%',
            backgroundColor: theme.palette.secondary.main,
            border: `1px solid ${theme.palette.background.paper}`,
          } : {}
        }}
        onClick={() => {
          if (isSelectable && !submitting && !isFuture) {
            onClick();
          }
        }}
      >
        {dayNumber}
        {overtime && overtime > 0 && (
          <Box
            sx={{
              position: 'absolute',
              bottom: -3,
              right: -3,
              width: 10,
              height: 10,
              borderRadius: '50%',
              backgroundColor: theme.palette.warning.main,
              border: `1px solid ${theme.palette.background.paper}`,
            }}
          />
        )}
        {isWeekend && (
          <Box
            sx={{
              position: 'absolute',
              bottom: -3,
              left: -3,
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: theme.palette.secondary.main,
              border: `1px solid ${theme.palette.background.paper}`,
            }}
          />
        )}
      </Box>
    </Tooltip>
  );
};