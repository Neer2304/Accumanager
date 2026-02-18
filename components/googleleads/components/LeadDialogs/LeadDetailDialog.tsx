import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Button,
  IconButton,
  Avatar,
  Chip as MuiChip,
  Paper,
  Divider,
  useTheme,
  alpha
} from '@mui/material';
import {
  Close as CloseIcon,
  Business as BusinessIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Person as PersonIcon,
  AttachMoney as AttachMoneyIcon,
  Star as StarIcon,
  Flag as FlagIcon,
  Schedule as ScheduleIcon,
  Delete as DeleteIcon,
  TrendingUp as TrendingUpIcon
} from '@mui/icons-material';
import { Lead } from '../../types';
import { LEAD_STATUS, LEAD_SOURCES, INTEREST_LEVELS, GOOGLE_COLORS } from '../../constants';
import {
  getStatusColor,
  getStatusEmoji,
  getSourceEmoji,
  getInterestColor,
  getInterestEmoji,
  formatCurrency,
  formatDateTime
} from '../../utils/helpers';

interface LeadDetailDialogProps {
  open: boolean;
  onClose: () => void;
  lead: Lead | null;
  onDelete: (leadId: string) => void;
  onConvert: (leadId: string) => void;
  submitting: boolean;
  darkMode: boolean;
  getCompanyName: (companyId: string) => string;
}

export function LeadDetailDialog({
  open,
  onClose,
  lead,
  onDelete,
  onConvert,
  submitting,
  darkMode,
  getCompanyName
}: LeadDetailDialogProps) {
  if (!lead) return null;

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
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar
              sx={{
                bgcolor: alpha(getStatusColor(lead.status), 0.1),
                color: getStatusColor(lead.status),
                width: 48,
                height: 48
              }}
            >
              {getStatusEmoji(lead.status)}
            </Avatar>
            <Box>
              <Typography variant="h6" fontWeight={500} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                {lead.fullName}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                <MuiChip
                  label={lead.companyName || getCompanyName(lead.companyId)}
                  size="small"
                  icon={<BusinessIcon sx={{ fontSize: 14 }} />}
                  sx={{
                    bgcolor: alpha(GOOGLE_COLORS.blue, 0.1),
                    color: GOOGLE_COLORS.blue,
                    height: 24
                  }}
                />
                {lead.position && (
                  <MuiChip
                    label={lead.position}
                    size="small"
                    sx={{
                      bgcolor: darkMode ? '#3c4043' : '#f1f3f4',
                      color: darkMode ? '#e8eaed' : '#202124',
                      height: 24
                    }}
                  />
                )}
              </Box>
            </Box>
          </Box>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Status Badges */}
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <MuiChip
              label={LEAD_STATUS.find(s => s.value === lead.status)?.label || lead.status}
              sx={{
                bgcolor: alpha(getStatusColor(lead.status), 0.1),
                color: getStatusColor(lead.status),
                border: `1px solid ${alpha(getStatusColor(lead.status), 0.2)}`,
                fontWeight: 500,
              }}
            />
            <MuiChip
              label={`${getSourceEmoji(lead.source)} ${lead.source.replace('_', ' ')}`}
              variant="outlined"
              sx={{
                borderColor: darkMode ? '#3c4043' : '#dadce0',
                color: darkMode ? '#e8eaed' : '#202124',
              }}
            />
            <MuiChip
              label={`${getInterestEmoji(lead.interestLevel)} ${lead.interestLevel}`}
              sx={{
                bgcolor: alpha(getInterestColor(lead.interestLevel), 0.1),
                color: getInterestColor(lead.interestLevel),
              }}
            />
            {lead.score > 0 && (
              <MuiChip
                label={`Score: ${lead.score}`}
                icon={<StarIcon sx={{ fontSize: 14, color: '#fbbc04' }} />}
                sx={{
                  bgcolor: alpha('#fbbc04', 0.1),
                  color: '#fbbc04',
                }}
              />
            )}
          </Box>

          {/* Contact Information */}
          <Paper sx={{
            p: 3,
            bgcolor: darkMode ? '#303134' : '#f8f9fa',
            border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
            borderRadius: '16px',
          }}>
            <Typography variant="subtitle2" fontWeight={500} sx={{ mb: 2, color: darkMode ? '#e8eaed' : '#202124' }}>
              Contact Information
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {lead.email && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <EmailIcon sx={{ fontSize: 20, color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                  <Typography variant="body2" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                    {lead.email}
                  </Typography>
                </Box>
              )}
              {lead.phone && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <PhoneIcon sx={{ fontSize: 20, color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                  <Typography variant="body2" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                    {lead.phone}
                  </Typography>
                </Box>
              )}
            </Box>
          </Paper>

          {/* Assignment */}
          {lead.assignedToName && (
            <Paper sx={{
              p: 3,
              bgcolor: darkMode ? '#303134' : '#f8f9fa',
              border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
              borderRadius: '16px',
            }}>
              <Typography variant="subtitle2" fontWeight={500} sx={{ mb: 2, color: darkMode ? '#e8eaed' : '#202124' }}>
                Assigned To
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Avatar sx={{ width: 40, height: 40, bgcolor: alpha(GOOGLE_COLORS.blue, 0.1) }}>
                  <PersonIcon sx={{ color: GOOGLE_COLORS.blue }} />
                </Avatar>
                <Box>
                  <Typography variant="body1" fontWeight={500} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                    {lead.assignedToName}
                  </Typography>
                  <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                    Lead Owner
                  </Typography>
                </Box>
              </Box>
            </Paper>
          )}

          {/* Deal Information */}
          {lead.budget && (
            <Paper sx={{
              p: 3,
              bgcolor: darkMode ? '#303134' : '#f8f9fa',
              border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
              borderRadius: '16px',
            }}>
              <Typography variant="subtitle2" fontWeight={500} sx={{ mb: 2, color: darkMode ? '#e8eaed' : '#202124' }}>
                Deal Information
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{
                  p: 1.5,
                  borderRadius: '12px',
                  bgcolor: alpha(GOOGLE_COLORS.green, 0.1),
                  color: GOOGLE_COLORS.green
                }}>
                  <AttachMoneyIcon />
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                    Budget
                  </Typography>
                  <Typography variant="h6" fontWeight={600} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                    {formatCurrency(lead.budget, lead.currency)}
                  </Typography>
                </Box>
              </Box>
            </Paper>
          )}

          {/* Timeline */}
          <Paper sx={{
            p: 3,
            bgcolor: darkMode ? '#303134' : '#f8f9fa',
            border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
            borderRadius: '16px',
          }}>
            <Typography variant="subtitle2" fontWeight={500} sx={{ mb: 2, color: darkMode ? '#e8eaed' : '#202124' }}>
              Timeline
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <ScheduleIcon sx={{ fontSize: 20, color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                <Typography variant="body2" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                  Created: {formatDateTime(lead.createdAt)}
                </Typography>
              </Box>
              {lead.lastContactedAt && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <ScheduleIcon sx={{ fontSize: 20, color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                  <Typography variant="body2" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                    Last Contacted: {formatDateTime(lead.lastContactedAt)}
                  </Typography>
                </Box>
              )}
              {lead.nextFollowUp && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <FlagIcon sx={{ fontSize: 20, color: '#fbbc04' }} />
                  <Typography variant="body2" sx={{ color: '#fbbc04', fontWeight: 500 }}>
                    Follow-up: {formatDateTime(lead.nextFollowUp)}
                  </Typography>
                </Box>
              )}
            </Box>
          </Paper>

          {/* Tags */}
          {lead.tags && lead.tags.length > 0 && (
            <Paper sx={{
              p: 3,
              bgcolor: darkMode ? '#303134' : '#f8f9fa',
              border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
              borderRadius: '16px',
            }}>
              <Typography variant="subtitle2" fontWeight={500} sx={{ mb: 2, color: darkMode ? '#e8eaed' : '#202124' }}>
                Tags
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {lead.tags.map((tag, index) => (
                  <MuiChip
                    key={index}
                    label={tag}
                    size="small"
                    sx={{
                      bgcolor: darkMode ? '#3c4043' : '#f1f3f4',
                      color: darkMode ? '#e8eaed' : '#202124',
                    }}
                  />
                ))}
              </Box>
            </Paper>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{
        p: 3,
        gap: 2,
        borderTop: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
        bgcolor: darkMode ? '#303134' : '#f8f9fa',
      }}>
        <Button
          variant="outlined"
          color="error"
          startIcon={<DeleteIcon />}
          onClick={() => onDelete(lead._id)}
          disabled={submitting}
          sx={{
            borderRadius: '24px',
            borderColor: GOOGLE_COLORS.red,
            color: GOOGLE_COLORS.red,
            px: 3,
            '&:hover': {
              borderColor: '#d93025',
              bgcolor: alpha(GOOGLE_COLORS.red, 0.1),
            }
          }}
        >
          Delete
        </Button>
        <Box sx={{ flex: 1 }} />
        {lead.status !== 'converted' && lead.status !== 'lost' && (
          <Button
            variant="contained"
            startIcon={<TrendingUpIcon />}
            onClick={() => onConvert(lead._id)}
            disabled={submitting}
            sx={{
              borderRadius: '24px',
              bgcolor: GOOGLE_COLORS.purple,
              '&:hover': { bgcolor: '#6b3fcc' },
              px: 3
            }}
          >
            Convert
          </Button>
        )}
        <Button
          variant="contained"
          onClick={onClose}
          sx={{
            borderRadius: '24px',
            bgcolor: GOOGLE_COLORS.blue,
            '&:hover': { bgcolor: '#1557b0' },
            px: 3
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}