import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
} from '@mui/material';
import {
  Phone as PhoneIcon,
  Email as EmailIcon,
  Work as WorkIcon,
  DateRange as DateRangeIcon,
  LocationOn as LocationIcon,
} from '@mui/icons-material';

interface BasicInfoCardProps {
  employee: {
    phone: string;
    email?: string;
    salary: number;
    salaryType: string;
    joiningDate: string;
    address?: string;
  };
}

export const BasicInfoCard: React.FC<BasicInfoCardProps> = ({ employee }) => {
  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          Basic Information
        </Typography>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PhoneIcon color="action" fontSize="small" sx={{ flexShrink: 0 }} />
            <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
              {employee.phone}
            </Typography>
          </Box>
          
          {employee.email && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <EmailIcon color="action" fontSize="small" sx={{ flexShrink: 0 }} />
              <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
                {employee.email}
              </Typography>
            </Box>
          )}
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <WorkIcon color="action" fontSize="small" sx={{ flexShrink: 0 }} />
            <Typography variant="body2">
              ₹{employee.salary.toLocaleString()} {employee.salaryType}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <DateRangeIcon color="action" fontSize="small" sx={{ flexShrink: 0 }} />
            <Typography variant="body2">
              Joined: {new Date(employee.joiningDate).toLocaleDateString('en-IN')}
            </Typography>
          </Box>
          
          {employee.address && (
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
              <LocationIcon color="action" fontSize="small" sx={{ flexShrink: 0, mt: 0.5 }} />
              <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
                {employee.address}
              </Typography>
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};