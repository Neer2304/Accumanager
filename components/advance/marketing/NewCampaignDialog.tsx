// components/advance/marketing/NewCampaignDialog.tsx
import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Alert,
  Box,
  Typography,
  Divider,
  Chip,
} from '@mui/material';
import {
  Email,
  Send,
  Campaign,
  Schedule,
  Timer,
} from '@mui/icons-material';
import { alpha } from '@mui/material/styles';

const googleColors = {
  blue: '#4285F4',
  green: '#34A853',
  yellow: '#FBBC04',
  red: '#EA4335',
};

interface NewCampaignDialogProps {
  open: boolean;
  onClose: () => void;
  segments: any[];
  onSubmit: (data: any) => void;
  currentColors: any;
  primaryColor: string;
  autoOptimize: boolean;
  onAutoOptimizeChange: (value: boolean) => void;
}

const NewCampaignDialog: React.FC<NewCampaignDialogProps> = ({
  open,
  onClose,
  segments,
  onSubmit,
  currentColors,
  primaryColor,
  autoOptimize,
  onAutoOptimizeChange,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    type: 'email',
    segment: segments[0]?._id || '',
    scheduleType: 'immediate',
    scheduledDate: '',
    subject: '',
    content: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Campaign name is required';
    }
    
    if (!formData.segment) {
      newErrors.segment = 'Please select a segment';
    }
    
    if (formData.scheduleType === 'scheduled' && !formData.scheduledDate) {
      newErrors.scheduledDate = 'Please select a date and time';
    }
    
    if (formData.type === 'email' && !formData.subject.trim()) {
      newErrors.subject = 'Email subject is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(formData);
      // Reset form
      setFormData({
        name: '',
        type: 'email',
        segment: segments[0]?._id || '',
        scheduleType: 'immediate',
        scheduledDate: '',
        subject: '',
        content: '',
      });
      setErrors({});
    }
  };

  const campaignTypes = [
    { value: 'email', label: 'Email Campaign', icon: <Email />, color: googleColors.blue },
    { value: 'sms', label: 'SMS Campaign', icon: <Send />, color: googleColors.green },
    { value: 'push', label: 'Push Notification', icon: <Campaign />, color: googleColors.yellow },
  ];

  const scheduleOptions = [
    { value: 'immediate', label: 'Send Immediately', icon: <Timer /> },
    { value: 'scheduled', label: 'Schedule for Later', icon: <Schedule /> },
  ];

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: {
          background: currentColors.card,
          border: `1px solid ${currentColors.border}`,
        }
      }}
    >
      <DialogTitle>
        <Typography variant="h6" fontWeight="bold" color={currentColors.textPrimary}>
          Create New Campaign
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 2 }}>
          {/* Campaign Name */}
          <Box>
            <TextField
              label="Campaign Name"
              placeholder="e.g., Welcome Series, Summer Sale"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              fullWidth
              size="small"
              error={!!errors.name}
              helperText={errors.name}
              sx={{
                '& .MuiOutlinedInput-root': {
                  background: currentColors.surface,
                  color: currentColors.textPrimary,
                },
              }}
            />
          </Box>

          {/* Campaign Type */}
          <Box>
            <Typography variant="subtitle2" fontWeight="medium" color={currentColors.textPrimary} gutterBottom>
              Campaign Type
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {campaignTypes.map((type) => (
                <Chip
                  key={type.value}
                  icon={type.icon}
                  label={type.label}
                  clickable
                  onClick={() => setFormData({ ...formData, type: type.value })}
                  sx={{
                    flex: 1,
                    minWidth: '120px',
                    background: formData.type === type.value 
                      ? alpha(type.color, 0.1) 
                      : currentColors.surface,
                    color: formData.type === type.value 
                      ? type.color 
                      : currentColors.textPrimary,
                    border: `1px solid ${formData.type === type.value ? type.color : currentColors.border}`,
                    fontWeight: formData.type === type.value ? 'bold' : 'normal',
                    '&:hover': {
                      borderColor: type.color,
                      background: alpha(type.color, 0.05),
                    }
                  }}
                />
              ))}
            </Box>
          </Box>

          {/* Target Segment */}
          <Box>
            <Typography variant="subtitle2" fontWeight="medium" color={currentColors.textPrimary} gutterBottom>
              Target Segment
            </Typography>
            <Select
              value={formData.segment}
              onChange={(e) => setFormData({ ...formData, segment: e.target.value })}
              fullWidth
              size="small"
              error={!!errors.segment}
              sx={{
                background: currentColors.surface,
                color: currentColors.textPrimary,
              }}
            >
              {segments.map((segment) => (
                <MenuItem key={segment._id} value={segment._id}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                    <Typography variant="body2">{segment.name}</Typography>
                    <Typography variant="caption" color={currentColors.textSecondary}>
                      {segment.customerCount} customers
                    </Typography>
                  </Box>
                </MenuItem>
              ))}
            </Select>
            {errors.segment && (
              <Typography variant="caption" color={googleColors.red} sx={{ mt: 0.5, display: 'block' }}>
                {errors.segment}
              </Typography>
            )}
          </Box>

          {/* Schedule */}
          <Box>
            <Typography variant="subtitle2" fontWeight="medium" color={currentColors.textPrimary} gutterBottom>
              Schedule
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
              {scheduleOptions.map((option) => (
                <Chip
                  key={option.value}
                  icon={option.icon}
                  label={option.label}
                  clickable
                  onClick={() => setFormData({ ...formData, scheduleType: option.value })}
                  sx={{
                    flex: 1,
                    minWidth: '140px',
                    background: formData.scheduleType === option.value 
                      ? alpha(primaryColor, 0.1) 
                      : currentColors.surface,
                    color: formData.scheduleType === option.value 
                      ? primaryColor 
                      : currentColors.textPrimary,
                    border: `1px solid ${formData.scheduleType === option.value ? primaryColor : currentColors.border}`,
                    fontWeight: formData.scheduleType === option.value ? 'bold' : 'normal',
                    '&:hover': {
                      borderColor: primaryColor,
                      background: alpha(primaryColor, 0.05),
                    }
                  }}
                />
              ))}
            </Box>
            
            {formData.scheduleType === 'scheduled' && (
              <TextField
                type="datetime-local"
                value={formData.scheduledDate}
                onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                fullWidth
                size="small"
                error={!!errors.scheduledDate}
                helperText={errors.scheduledDate}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    background: currentColors.surface,
                    color: currentColors.textPrimary,
                  },
                }}
              />
            )}
          </Box>

          {/* Campaign Content */}
          {formData.type === 'email' && (
            <Box>
              <Divider sx={{ my: 1 }} />
              <Typography variant="subtitle2" fontWeight="medium" color={currentColors.textPrimary} gutterBottom>
                Email Content
              </Typography>
              
              <TextField
                label="Subject Line"
                placeholder="Enter email subject"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                fullWidth
                size="small"
                error={!!errors.subject}
                helperText={errors.subject}
                sx={{
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    background: currentColors.surface,
                    color: currentColors.textPrimary,
                  },
                }}
              />
              
              <TextField
                label="Email Content"
                placeholder="Write your email content here..."
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                fullWidth
                size="small"
                multiline
                rows={4}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    background: currentColors.surface,
                    color: currentColors.textPrimary,
                  },
                }}
              />
            </Box>
          )}

          {formData.type === 'sms' && (
            <Box>
              <Divider sx={{ my: 1 }} />
              <Typography variant="subtitle2" fontWeight="medium" color={currentColors.textPrimary} gutterBottom>
                SMS Content
              </Typography>
              
              <TextField
                label="SMS Message"
                placeholder="Enter SMS message (max 160 characters)"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                fullWidth
                size="small"
                multiline
                rows={3}
                helperText={`${formData.content.length}/160 characters`}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    background: currentColors.surface,
                    color: currentColors.textPrimary,
                  },
                }}
              />
            </Box>
          )}

          {/* Auto-Optimize */}
          <Box>
            <FormControlLabel
              control={
                <Switch
                  checked={autoOptimize}
                  onChange={(e) => onAutoOptimizeChange(e.target.checked)}
                  sx={{
                    color: primaryColor,
                    '&.Mui-checked': {
                      color: primaryColor,
                    }
                  }}
                />
              }
              label={
                <Box>
                  <Typography variant="body2" color={currentColors.textPrimary}>
                    AI Auto-optimize send times
                  </Typography>
                  <Typography variant="caption" color={currentColors.textSecondary}>
                    Send at optimal times based on recipient behavior
                  </Typography>
                </Box>
              }
            />
            
            {autoOptimize && (
              <Alert 
                severity="info" 
                sx={{ 
                  mt: 1,
                  background: alpha(googleColors.blue, 0.1),
                  color: currentColors.textPrimary,
                  '& .MuiAlert-icon': {
                    color: googleColors.blue,
                  }
                }}
              >
                Campaign will be sent at optimal times based on recipient behavior patterns and historical performance data.
              </Alert>
            )}
          </Box>

          {/* Campaign Preview */}
          <Box>
            <Divider sx={{ my: 1 }} />
            <Typography variant="subtitle2" fontWeight="medium" color={currentColors.textPrimary} gutterBottom>
              Campaign Summary
            </Typography>
            <Box sx={{ 
              p: 2, 
              background: currentColors.surface,
              border: `1px solid ${currentColors.border}`,
              borderRadius: '8px',
            }}>
              <Typography variant="body2" color={currentColors.textSecondary} gutterBottom>
                You're creating a <strong>{formData.type}</strong> campaign targeting{' '}
                <strong>{segments.find(s => s._id === formData.segment)?.name || 'selected segment'}</strong>
              </Typography>
              <Typography variant="caption" color={currentColors.textSecondary}>
                {formData.scheduleType === 'immediate' 
                  ? 'Will be sent immediately after creation' 
                  : `Scheduled for ${formData.scheduledDate ? new Date(formData.scheduledDate).toLocaleString() : 'selected date'}`}
              </Typography>
            </Box>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 3, borderTop: `1px solid ${currentColors.border}` }}>
        <Button 
          onClick={onClose}
          sx={{ color: currentColors.textSecondary }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          sx={{
            background: primaryColor,
            color: 'white',
            '&:hover': {
              background: '#3367D6',
            }
          }}
        >
          Create Campaign
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NewCampaignDialog;