"use client";

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
  darkMode?: boolean;
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
  submitting,
  darkMode = false
}) => {
  const theme = useTheme();
  const dayNumber = date.getDate();
  const isWeekend = date.getDay() === 0 || date.getDay() === 6;
  const isPresent = status === "Present";
  const isFuture = date > new Date();

  // Google Material Design colors for dark/light modes
  const colors = {
    present: darkMode ? '#81c995' : '#34a853', // Google green
    absent: darkMode ? '#f28b82' : '#ea4335', // Google red
    future: darkMode ? '#5f6368' : '#9aa0a6', // Google grey
    today: darkMode ? '#fdd663' : '#fbbc04', // Google yellow
    weekend: darkMode ? '#c58af9' : '#ab47bc', // Purple
    overtime: darkMode ? '#fdd663' : '#fbbc04', // Google yellow
    background: darkMode ? '#303134' : '#ffffff',
    border: darkMode ? '#3c4043' : '#dadce0',
    text: darkMode ? '#e8eaed' : '#202124',
    textSecondary: darkMode ? '#9aa0a6' : '#5f6368',
  };

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
      return colors.future;
    }
    if (status === "Present") {
      return colors.present;
    }
    if (status === "Absent") {
      return colors.absent;
    }
    return colors.textSecondary;
  };

  const getDayBackgroundColor = () => {
    if (isFuture) {
      return alpha(colors.future, 0.15);
    }
    if (status === "Present") {
      return alpha(colors.present, darkMode ? 0.3 : 0.2);
    }
    if (status === "Absent") {
      return alpha(colors.absent, darkMode ? 0.3 : 0.2);
    }
    return alpha(colors.textSecondary, 0.1);
  };

  const getTextColor = () => {
    if (isFuture) {
      return colors.future;
    }
    if (status === "Present") {
      return darkMode ? '#ffffff' : '#ffffff';
    }
    if (status === "Absent") {
      return darkMode ? '#ffffff' : '#ffffff';
    }
    return colors.text;
  };

  return (
    <Tooltip 
      title={getDayTooltip()} 
      arrow 
      placement="top"
      componentsProps={{
        tooltip: {
          sx: {
            backgroundColor: darkMode ? '#303134' : '#ffffff',
            color: darkMode ? '#e8eaed' : '#202124',
            border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
            borderRadius: '8px',
            fontSize: '0.875rem',
            boxShadow: darkMode 
              ? '0 4px 6px rgba(0, 0, 0, 0.3)' 
              : '0 4px 6px rgba(0, 0, 0, 0.1)',
          }
        },
        arrow: {
          sx: {
            color: darkMode ? '#303134' : '#ffffff',
          }
        }
      }}
    >
      <Box
        sx={{
          width: { xs: 36, sm: 40, md: 44 },
          height: { xs: 36, sm: 40, md: 44 },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '8px',
          cursor: isSelectable && !submitting && !isFuture ? 'pointer' : 'default',
          backgroundColor: getDayBackgroundColor(),
          color: getTextColor(),
          fontSize: { xs: '0.875rem', sm: '1rem' },
          fontWeight: 600,
          opacity: submitting ? 0.6 : 1,
          transition: 'all 0.2s ease',
          border: isToday 
            ? `2px solid ${colors.today}` 
            : isWeekend 
              ? `1px solid ${alpha(colors.weekend, 0.5)}` 
              : `1px solid ${alpha(colors.border, 0.5)}`,
          boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
          position: 'relative',
          "&:hover": {
            opacity: isSelectable && !submitting && !isFuture ? 0.9 : 1,
            transform: isSelectable && !submitting && !isFuture ? 'scale(1.05)' : 'none',
            boxShadow: isSelectable && !submitting && !isFuture 
              ? '0 4px 8px rgba(0,0,0,0.15)' 
              : '0 1px 2px rgba(0,0,0,0.1)',
          },
          "&::after": isWeekend ? {
            content: '""',
            position: 'absolute',
            top: -3,
            right: -3,
            width: 8,
            height: 8,
            borderRadius: '50%',
            backgroundColor: colors.weekend,
            border: `1px solid ${darkMode ? '#202124' : '#ffffff'}`,
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
              backgroundColor: colors.overtime,
              border: `1px solid ${darkMode ? '#202124' : '#ffffff'}`,
              boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
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
              backgroundColor: colors.weekend,
              border: `1px solid ${darkMode ? '#202124' : '#ffffff'}`,
              boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
            }}
          />
        )}
      </Box>
    </Tooltip>
  );
};