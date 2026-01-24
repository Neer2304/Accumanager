import React from 'react';
import { Box, Typography, Card, useMediaQuery } from '@mui/material';

interface SummaryCardsProps {
  presentCount: number;
  absentCount: number;
  attendancePercentage: number;
  totalWorkHours: number;
  isMobile: boolean;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({
  presentCount,
  absentCount,
  attendancePercentage,
  totalWorkHours,
  isMobile,
}) => {
  return (
    <Box sx={{ 
      display: 'grid',
      gridTemplateColumns: {
        xs: '1fr',
        sm: 'repeat(2, 1fr)',
        md: 'repeat(4, 1fr)',
      },
      gap: 2,
      mb: 3,
    }}>
      <Card sx={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
        color: 'white',
        p: isMobile ? 2 : 3,
        minHeight: 120,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
      }}>
        <Typography variant={isMobile ? "h4" : "h3"} fontWeight="bold" gutterBottom={!isMobile}>
          {presentCount}
        </Typography>
        <Typography variant={isMobile ? "body2" : "body1"}>
          Present Days
        </Typography>
      </Card>
      
      <Card sx={{ 
        background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', 
        color: 'white',
        p: isMobile ? 2 : 3,
        minHeight: 120,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
      }}>
        <Typography variant={isMobile ? "h4" : "h3"} fontWeight="bold" gutterBottom={!isMobile}>
          {absentCount}
        </Typography>
        <Typography variant={isMobile ? "body2" : "body1"}>
          Absent Days
        </Typography>
      </Card>
      
      <Card sx={{ 
        background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', 
        color: 'white',
        p: isMobile ? 2 : 3,
        minHeight: 120,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
      }}>
        <Typography variant={isMobile ? "h4" : "h3"} fontWeight="bold" gutterBottom={!isMobile}>
          {attendancePercentage}%
        </Typography>
        <Typography variant={isMobile ? "body2" : "body1"}>
          Attendance Rate
        </Typography>
      </Card>
      
      <Card sx={{ 
        background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', 
        color: 'white',
        p: isMobile ? 2 : 3,
        minHeight: 120,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
      }}>
        <Typography variant={isMobile ? "h4" : "h3"} fontWeight="bold" gutterBottom={!isMobile}>
          {totalWorkHours.toFixed(1)}
        </Typography>
        <Typography variant={isMobile ? "body2" : "body1"}>
          Total Hours
        </Typography>
      </Card>
    </Box>
  );
};