// components/googleadvance/field-service/QuickDispatch.tsx

'use client';

import React from 'react';
import {
  Card,
  CardContent,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from '@mui/material';
import { Assignment } from '@mui/icons-material';
import { Technician, FieldVisit } from '../types';
import { googleColors } from '../common/GoogleColors';

interface QuickDispatchProps {
  technicians: Technician[];
  jobs: FieldVisit[];
  currentColors: any;
  buttonColor: string;
  isMobile?: boolean;
  onDispatch: (technicianId: string, jobId: string) => void;
}

export const QuickDispatch: React.FC<QuickDispatchProps> = ({
  technicians,
  jobs,
  currentColors,
  buttonColor,
  isMobile = false,
  onDispatch,
}) => {
  const [technicianSelect, setTechnicianSelect] = React.useState('');
  const [jobSelect, setJobSelect] = React.useState('');

  const availableTechnicians = technicians.filter(t => t.status === 'available');
  const dispatchableJobs = jobs.filter(j => j.status === 'pending' || j.status === 'scheduled');

  const handleDispatch = () => {
    if (technicianSelect && jobSelect) {
      onDispatch(technicianSelect, jobSelect);
    }
  };

  return (
    <Card sx={{ background: currentColors.card }}>
      <CardContent>
        <Typography variant="h6" fontWeight="bold" mb={3}>
          Quick Dispatch
        </Typography>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <FormControl fullWidth size="small">
            <InputLabel>Select Technician</InputLabel>
            <Select
              label="Select Technician"
              value={technicianSelect}
              onChange={(e) => setTechnicianSelect(e.target.value)}
              disabled
              sx={{
                background: currentColors.chipBackground,
                color: currentColors.textPrimary,
              }}
            >
              <MenuItem value="" disabled>Select Technician</MenuItem>
              {availableTechnicians.map(tech => (
                <MenuItem key={tech._id} value={tech._id}>
                  {tech.name} (Available)
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <FormControl fullWidth size="small">
            <InputLabel>Select Job</InputLabel>
            <Select
              label="Select Job"
              value={jobSelect}
              onChange={(e) => setJobSelect(e.target.value)}
              disabled
              sx={{
                background: currentColors.chipBackground,
                color: currentColors.textPrimary,
              }}
            >
              <MenuItem value="" disabled>Select Job</MenuItem>
              {dispatchableJobs.map(job => (
                <MenuItem key={job._id} value={job._id}>
                  {job.title} ({job.priority})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <Button
            variant="contained"
            fullWidth
            startIcon={<Assignment />}
            disabled={true}
            onClick={handleDispatch}
            sx={{
              background: buttonColor,
              color: 'white',
              '&.Mui-disabled': {
                background: buttonColor,
                color: 'white',
                opacity: 0.5,
              }
            }}
          >
            Dispatch Now
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};