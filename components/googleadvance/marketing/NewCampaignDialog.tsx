// components/googleadvance/marketing/NewCampaignDialog.tsx

'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Switch,
  FormControlLabel,
  CircularProgress,
  alpha,
  Stepper,
  Step,
  StepLabel,
  Chip,
} from '@mui/material';
import { CreateCampaignData, CustomerSegment } from '../types';
import { googleColors } from '../common/GoogleColors';

interface NewCampaignDialogProps {
  open: boolean;
  onClose: () => void;
  segments: CustomerSegment[];
  onSubmit: (data: CreateCampaignData) => void;
  currentColors: any;
  primaryColor: string;
  autoOptimize: boolean;
  onAutoOptimizeChange: (checked: boolean) => void;
}

export const NewCampaignDialog: React.FC<NewCampaignDialogProps> = ({
  open,
  onClose,
  segments,
  onSubmit,
  currentColors,
  primaryColor,
  autoOptimize,
  onAutoOptimizeChange,
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CreateCampaignData>({
    name: '',
    type: 'email',
    segment: '',
    scheduleType: 'immediate',
  });

  const steps = ['Campaign Details', 'Audience', 'Schedule', 'Review'];

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      handleSubmit();
    } else {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    await onSubmit(formData);
    setLoading(false);
    onClose();
  };

  const isStepValid = () => {
    switch (activeStep) {
      case 0:
        return formData.name.trim() !== '' && formData.type !== '';
      case 1:
        return formData.segment !== '';
      case 2:
        return true;
      case 3:
        return true;
      default:
        return false;
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: {
          background: currentColors.card,
          border: `1px solid ${currentColors.border}`,
          borderRadius: '12px',
        }
      }}
    >
      <DialogTitle sx={{ 
        borderBottom: `1px solid ${currentColors.border}`,
        color: currentColors.textPrimary,
        fontWeight: 600,
      }}>
        Create New Campaign
      </DialogTitle>

      <DialogContent sx={{ mt: 2 }}>
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {/* Step 1: Campaign Details */}
        {activeStep === 0 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              fullWidth
              label="Campaign Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              disabled
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: currentColors.textPrimary,
                  '& fieldset': {
                    borderColor: currentColors.border,
                  },
                },
              }}
            />
            
            <FormControl fullWidth>
              <InputLabel>Campaign Type</InputLabel>
              <Select
                value={formData.type}
                label="Campaign Type"
                onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                disabled
                sx={{
                  color: currentColors.textPrimary,
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: currentColors.border,
                  },
                }}
              >
                <MenuItem value="email">Email Campaign</MenuItem>
                <MenuItem value="sms">SMS Campaign</MenuItem>
                <MenuItem value="push">Push Notification</MenuItem>
              </Select>
            </FormControl>

            <FormControlLabel
              control={
                <Switch
                  checked={autoOptimize}
                  onChange={(e) => onAutoOptimizeChange(e.target.checked)}
                  disabled
                  sx={{
                    color: primaryColor,
                    '&.Mui-checked': {
                      color: primaryColor,
                    }
                  }}
                />
              }
              label="Auto-optimize campaign timing"
              sx={{ color: currentColors.textPrimary }}
            />
          </Box>
        )}

        {/* Step 2: Audience */}
        {activeStep === 1 && (
          <Box>
            <FormControl fullWidth>
              <InputLabel>Select Audience Segment</InputLabel>
              <Select
                value={formData.segment}
                label="Select Audience Segment"
                onChange={(e) => setFormData({ ...formData, segment: e.target.value })}
                disabled
                sx={{
                  color: currentColors.textPrimary,
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: currentColors.border,
                  },
                }}
              >
                <MenuItem value="" disabled>Select a segment</MenuItem>
                {segments.map((segment) => (
                  <MenuItem key={segment._id} value={segment._id}>
                    <Box>
                      <Typography variant="body2">{segment.name}</Typography>
                      <Typography variant="caption" color={currentColors.textSecondary}>
                        {segment.customerCount} customers • {segment.type}
                      </Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle2" gutterBottom>
                Segment Preview
              </Typography>
              <Box sx={{ 
                p: 2, 
                background: currentColors.surface,
                border: `1px solid ${currentColors.border}`,
                borderRadius: 2,
              }}>
                <Typography variant="body2" color={currentColors.textSecondary}>
                  Select a segment to see details
                </Typography>
              </Box>
            </Box>
          </Box>
        )}

        {/* Step 3: Schedule */}
        {activeStep === 2 && (
          <Box>
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Schedule Type</InputLabel>
              <Select
                value={formData.scheduleType}
                label="Schedule Type"
                onChange={(e) => setFormData({ ...formData, scheduleType: e.target.value as any })}
                disabled
                sx={{
                  color: currentColors.textPrimary,
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: currentColors.border,
                  },
                }}
              >
                <MenuItem value="immediate">Send Immediately</MenuItem>
                <MenuItem value="scheduled">Schedule for Later</MenuItem>
              </Select>
            </FormControl>

            {formData.scheduleType === 'scheduled' && (
              <TextField
                fullWidth
                type="datetime-local"
                label="Schedule Date"
                value={formData.scheduledDate || ''}
                onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                disabled
                InputLabelProps={{ shrink: true }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: currentColors.textPrimary,
                    '& fieldset': {
                      borderColor: currentColors.border,
                    },
                  },
                }}
              />
            )}

            <Box sx={{ mt: 3 }}>
              <Typography variant="caption" color={currentColors.textSecondary}>
                Best time to send: Tuesday 10:00 AM (based on past campaigns)
              </Typography>
            </Box>
          </Box>
        )}

        {/* Step 4: Review */}
        {activeStep === 3 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Review Campaign Details
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color={currentColors.textSecondary}>
                  Campaign Name:
                </Typography>
                <Typography variant="body2" fontWeight="bold">
                  {formData.name}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color={currentColors.textSecondary}>
                  Type:
                </Typography>
                <Chip 
                  label={formData.type} 
                  size="small"
                  sx={{
                    backgroundColor: alpha(primaryColor, 0.1),
                    color: primaryColor,
                  }}
                />
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color={currentColors.textSecondary}>
                  Audience:
                </Typography>
                <Typography variant="body2">
                  {segments.find(s => s._id === formData.segment)?.name || 'Not selected'}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color={currentColors.textSecondary}>
                  Schedule:
                </Typography>
                <Typography variant="body2">
                  {formData.scheduleType === 'immediate' ? 'Immediate' : new Date(formData.scheduledDate || '').toLocaleString()}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color={currentColors.textSecondary}>
                  Auto-optimize:
                </Typography>
                <Typography variant="body2">
                  {autoOptimize ? 'Enabled' : 'Disabled'}
                </Typography>
              </Box>
            </Box>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ borderTop: `1px solid ${currentColors.border}`, p: 2 }}>
        <Button 
          onClick={onClose}
          disabled={loading}
          sx={{ color: currentColors.textSecondary }}
        >
          Cancel
        </Button>
        {activeStep > 0 && (
          <Button 
            onClick={handleBack}
            disabled={loading}
            sx={{ color: currentColors.textPrimary }}
          >
            Back
          </Button>
        )}
        <Button
          variant="contained"
          onClick={handleNext}
          disabled={!isStepValid() || loading}
          sx={{
            background: primaryColor,
            color: 'white',
            '&:hover': {
              background: '#3367D6',
            },
            '&.Mui-disabled': {
              background: primaryColor,
              opacity: 0.5,
            }
          }}
        >
          {loading ? <CircularProgress size={24} /> : activeStep === steps.length - 1 ? 'Create Campaign' : 'Next'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};