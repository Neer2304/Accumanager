// components/googlepipelinestages/components/StagesDialogs/StageDetailDialog.tsx
import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  IconButton,
  Button,
  Divider,
  Chip as MuiChip,
  Avatar,
  useTheme,
  alpha
} from '@mui/material';
import {
  Close as CloseIcon,
  Business as BusinessIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  CalendarToday as CalendarIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Percent as PercentIcon,
  Assignment as AssignmentIcon,
  AttachMoney as AttachMoneyIcon,
  Notifications as NotificationsIcon,
  AutoAwesome as AutoAwesomeIcon,
  ColorLens as ColorLensIcon
} from '@mui/icons-material';
import { STAGE_CATEGORIES, GOOGLE_COLORS } from '../../constants';

interface StageDetailDialogProps {
  open: boolean;
  onClose: () => void;
  stage: any;
  members: any[];
  darkMode: boolean;
}

export const StageDetailDialog: React.FC<StageDetailDialogProps> = ({
  open,
  onClose,
  stage,
  members,
  darkMode
}) => {
  if (!stage) return null;

  const categoryInfo = STAGE_CATEGORIES.find(c => c.value === stage.category);
  const CategoryIcon = categoryInfo?.icon || AssignmentIcon;

  const getMemberName = (userId: string) => {
    const member = members.find(m => m.userId === userId);
    return member?.user?.name || userId;
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '24px',
          bgcolor: darkMode ? '#2d2e30' : '#fff',
          border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
        }
      }}
    >
      <DialogTitle sx={{
        borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
        bgcolor: darkMode ? '#303134' : '#f8f9fa',
        px: 4,
        py: 2.5,
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ 
              bgcolor: stage.color,
              width: 48,
              height: 48,
              borderRadius: '12px'
            }}>
              <BusinessIcon />
            </Avatar>
            <Box>
              <Typography variant="h6" fontWeight={500} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                {stage.name}
              </Typography>
              <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                Pipeline Stage Details
              </Typography>
            </Box>
          </Box>
          <IconButton
            onClick={onClose}
            size="small"
            sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Status & Category */}
          <Box>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <MuiChip
                icon={<CategoryIcon />}
                label={categoryInfo?.label}
                sx={{
                  bgcolor: alpha(categoryInfo?.color || GOOGLE_COLORS.grey, 0.1),
                  color: categoryInfo?.color,
                  fontWeight: 500,
                  px: 1
                }}
              />
              <MuiChip
                icon={stage.isActive ? <CheckCircleIcon /> : <CancelIcon />}
                label={stage.isActive ? 'Active' : 'Inactive'}
                sx={{
                  bgcolor: stage.isActive 
                    ? alpha(GOOGLE_COLORS.green, 0.1)
                    : alpha(GOOGLE_COLORS.grey, 0.1),
                  color: stage.isActive ? GOOGLE_COLORS.green : (darkMode ? '#9aa0a6' : '#5f6368'),
                  fontWeight: 500,
                  px: 1
                }}
              />
              {stage.isDefault && (
                <MuiChip
                  label="Default Stage"
                  sx={{
                    bgcolor: alpha(GOOGLE_COLORS.blue, 0.1),
                    color: GOOGLE_COLORS.blue,
                    fontWeight: 500,
                    px: 1
                  }}
                />
              )}
            </Box>
          </Box>

          {/* Two column layout for Basic Info and Auto Advance */}
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' },
            gap: 3
          }}>
            {/* Basic Info */}
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle2" fontWeight={500} sx={{ color: darkMode ? '#e8eaed' : '#202124', mb: 2 }}>
                Basic Information
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <ColorLensIcon sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', fontSize: 20 }} />
                  <Typography variant="body2" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                    Color: <Box component="span" sx={{ 
                      display: 'inline-block',
                      width: 16,
                      height: 16,
                      borderRadius: '4px',
                      bgcolor: stage.color,
                      ml: 1,
                      verticalAlign: 'middle'
                    }} />
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <PercentIcon sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', fontSize: 20 }} />
                  <Typography variant="body2" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                    Probability: {stage.probability}%
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <AssignmentIcon sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', fontSize: 20 }} />
                  <Typography variant="body2" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                    Deals: {stage.dealCount || 0}
                  </Typography>
                </Box>
                {stage.totalValue ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <AttachMoneyIcon sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', fontSize: 20 }} />
                    <Typography variant="body2" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                      Total Value: ${stage.totalValue.toLocaleString()}
                    </Typography>
                  </Box>
                ) : null}
              </Box>
            </Box>

            {/* Auto Advance */}
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle2" fontWeight={500} sx={{ color: darkMode ? '#e8eaed' : '#202124', mb: 2 }}>
                Auto Advance Settings
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <AutoAwesomeIcon sx={{ color: stage.autoAdvance ? GOOGLE_COLORS.purple : (darkMode ? '#9aa0a6' : '#5f6368'), fontSize: 20 }} />
                  <Typography variant="body2" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                    {stage.autoAdvance 
                      ? `Auto-advances after ${stage.autoAdvanceDays} days`
                      : 'No auto-advance'
                    }
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>

          <Divider sx={{ borderColor: darkMode ? '#3c4043' : '#dadce0' }} />

          {/* Two column layout for Notifications and Notify Users */}
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' },
            gap: 3
          }}>
            {/* Notifications */}
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle2" fontWeight={500} sx={{ color: darkMode ? '#e8eaed' : '#202124', mb: 2 }}>
                Notification Settings
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <NotificationsIcon sx={{ color: stage.notifyOnEnter ? GOOGLE_COLORS.blue : (darkMode ? '#9aa0a6' : '#5f6368'), fontSize: 20 }} />
                  <Typography variant="body2" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                    {stage.notifyOnEnter ? 'Notify on enter' : 'No notification on enter'}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <NotificationsIcon sx={{ color: stage.notifyOnExit ? GOOGLE_COLORS.blue : (darkMode ? '#9aa0a6' : '#5f6368'), fontSize: 20 }} />
                  <Typography variant="body2" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                    {stage.notifyOnExit ? 'Notify on exit' : 'No notification on exit'}
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Notify Users */}
            {(stage.notifyOnEnter || stage.notifyOnExit) && stage.notifyUsers?.length > 0 && (
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2" fontWeight={500} sx={{ color: darkMode ? '#e8eaed' : '#202124', mb: 2 }}>
                  Users to Notify
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {stage.notifyUsers.map((userId: string) => (
                    <MuiChip
                      key={userId}
                      label={getMemberName(userId)}
                      size="small"
                      avatar={<Avatar>{getMemberName(userId).charAt(0)}</Avatar>}
                      sx={{
                        bgcolor: darkMode ? '#303134' : '#f1f3f4',
                        color: darkMode ? '#e8eaed' : '#202124',
                      }}
                    />
                  ))}
                </Box>
              </Box>
            )}
          </Box>

          <Divider sx={{ borderColor: darkMode ? '#3c4043' : '#dadce0' }} />

          {/* Two column layout for Required Fields and Allowed Next Stages */}
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' },
            gap: 3
          }}>
            {/* Required Fields */}
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle2" fontWeight={500} sx={{ color: darkMode ? '#e8eaed' : '#202124', mb: 2 }}>
                Required Fields
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {stage.requiredFields?.length > 0 ? (
                  stage.requiredFields.map((field: string) => (
                    <MuiChip
                      key={field}
                      label={field}
                      size="small"
                      sx={{
                        bgcolor: alpha(GOOGLE_COLORS.blue, 0.1),
                        color: GOOGLE_COLORS.blue,
                      }}
                    />
                  ))
                ) : (
                  <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                    No required fields
                  </Typography>
                )}
              </Box>
            </Box>

            {/* Allowed Next Stages */}
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle2" fontWeight={500} sx={{ color: darkMode ? '#e8eaed' : '#202124', mb: 2 }}>
                Allowed Next Stages
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {stage.allowedStages?.length > 0 ? (
                  stage.allowedStages.map((stageName: string) => (
                    <MuiChip
                      key={stageName}
                      label={stageName}
                      size="small"
                      sx={{
                        bgcolor: alpha(GOOGLE_COLORS.green, 0.1),
                        color: GOOGLE_COLORS.green,
                      }}
                    />
                  ))
                ) : (
                  <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                    All stages allowed
                  </Typography>
                )}
              </Box>
            </Box>
          </Box>

          <Divider sx={{ borderColor: darkMode ? '#3c4043' : '#dadce0' }} />

          {/* Metadata */}
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
              <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                Created by {stage.createdByName} on {new Date(stage.createdAt).toLocaleDateString()}
              </Typography>
              {stage.updatedAt && (
                <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                  Last updated on {new Date(stage.updatedAt).toLocaleDateString()}
                </Typography>
              )}
            </Box>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{
        p: 3,
        borderTop: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
        bgcolor: darkMode ? '#303134' : '#f8f9fa',
      }}>
        <Button
          onClick={onClose}
          sx={{
            borderRadius: '24px',
            color: darkMode ? '#9aa0a6' : '#5f6368',
            px: 4
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};