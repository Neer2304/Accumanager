// components/googleleads/components/LeadDialogs/AddLeadDialog.tsx
import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
  MenuItem,
  InputAdornment,
  Divider,
  Avatar,
  alpha,
  CircularProgress,
  useTheme,
  Chip
} from '@mui/material';
import {
  Close as CloseIcon,
  Business as BusinessIcon,
  Person as PersonIcon,
  AttachMoney as AttachMoneyIcon,
  Email as EmailIcon,
  Badge as BadgeIcon
} from '@mui/icons-material';
import { Company, Member, LeadFormData } from '../../types';
import { LEAD_SOURCES, LEAD_STATUS, INTEREST_LEVELS, GOOGLE_COLORS } from '../../constants';

interface AddLeadDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  formData: LeadFormData;
  onFormChange: (field: keyof LeadFormData, value: any) => void;
  companies: Company[];
  members: Member[];
  validationErrors: Record<string, string>;
  submitting: boolean;
  darkMode: boolean;
}

export function AddLeadDialog({
  open,
  onClose,
  onSubmit,
  formData,
  onFormChange,
  companies,
  members,
  validationErrors,
  submitting,
  darkMode
}: AddLeadDialogProps) {
  const handleCompanyChange = (event: SelectChangeEvent) => {
    const companyId = event.target.value;
    const selectedCompany = companies.find(c => c._id === companyId);
    onFormChange('companyId', companyId);
    onFormChange('companyName', selectedCompany?.name || '');
    onFormChange('assignedTo', ''); // Reset assignment when company changes
    onFormChange('assignedToName', '');
  };

  const handleAssignedToChange = (event: SelectChangeEvent) => {
    const userId = event.target.value;
    const selectedMember = members.find(m => m.userId === userId);
    onFormChange('assignedTo', userId);
    onFormChange('assignedToName', selectedMember?.user?.name || '');
  };

  // Get role badge color
  const getRoleColor = (role: string) => {
    switch(role) {
      case 'admin': return GOOGLE_COLORS.red;
      case 'manager': return GOOGLE_COLORS.blue;
      case 'member': return GOOGLE_COLORS.green;
      default: return GOOGLE_COLORS.grey;
    }
  };

  return (
    <Dialog
      open={open}
      onClose={() => !submitting && onClose()}
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
          <Box>
            <Typography variant="h6" fontWeight={500} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
              Add New Lead
            </Typography>
            <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
              Fill in the lead information below
            </Typography>
          </Box>
          <IconButton
            onClick={onClose}
            disabled={submitting}
            size="small"
            sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Company Selection */}
          <Box>
            <Typography variant="subtitle2" fontWeight={500} sx={{ color: darkMode ? '#e8eaed' : '#202124', mb: 1 }}>
              Company <span style={{ color: GOOGLE_COLORS.red }}>*</span>
            </Typography>
            <FormControl
              fullWidth
              size="small"
              error={!!validationErrors.companyId}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  bgcolor: darkMode ? '#303134' : '#fff',
                },
              }}
            >
              <InputLabel>Select Company *</InputLabel>
              <Select
                value={formData.companyId || ''}
                label="Select Company *"
                onChange={handleCompanyChange}
              >
                {companies.map(company => (
                  <MenuItem key={company._id} value={company._id}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Avatar
                        sx={{
                          width: 32,
                          height: 32,
                          bgcolor: alpha(GOOGLE_COLORS.blue, 0.1),
                          color: GOOGLE_COLORS.blue
                        }}
                      >
                        <BusinessIcon sx={{ fontSize: 16 }} />
                      </Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight={500}>
                          {company.name}
                        </Typography>
                        <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                          {company.industry || 'No industry'} • {company.userRole}
                        </Typography>
                      </Box>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
              {validationErrors.companyId && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                  {validationErrors.companyId}
                </Typography>
              )}
            </FormControl>
          </Box>

          {/* Assignment - Show members of selected company */}
          {formData.companyId && members.length > 0 && (
            <Box>
              <Typography variant="subtitle2" fontWeight={500} sx={{ color: darkMode ? '#e8eaed' : '#202124', mb: 1 }}>
                Assign To
              </Typography>
              <FormControl
                fullWidth
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    bgcolor: darkMode ? '#303134' : '#fff',
                  },
                }}
              >
                <InputLabel>Assign to team member</InputLabel>
                <Select
                  value={formData.assignedTo || ''}
                  label="Assign to team member"
                  onChange={handleAssignedToChange}
                  renderValue={(selected) => {
                    if (!selected) return 'Unassigned';
                    const member = members.find(m => m.userId === selected);
                    return member?.user?.name || 'Unassigned';
                  }}
                >
                  <MenuItem value="">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Avatar
                        sx={{
                          width: 32,
                          height: 32,
                          bgcolor: alpha(GOOGLE_COLORS.grey, 0.1),
                          color: GOOGLE_COLORS.grey
                        }}
                      >
                        <PersonIcon sx={{ fontSize: 16 }} />
                      </Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight={500}>
                          Unassigned
                        </Typography>
                        <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                          Lead will be unassigned
                        </Typography>
                      </Box>
                    </Box>
                  </MenuItem>
                  {members.map(member => (
                    <MenuItem key={member.userId} value={member.userId}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, width: '100%' }}>
                        <Avatar
                          sx={{
                            width: 32,
                            height: 32,
                            bgcolor: alpha(getRoleColor(member.role), 0.1),
                            color: getRoleColor(member.role)
                          }}
                        >
                          {member.user?.name?.charAt(0).toUpperCase()}
                        </Avatar>
                        <Box sx={{ flex: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                            <Typography variant="body2" fontWeight={500}>
                              {member.user?.name}
                            </Typography>
                            <Chip
                              label={member.role}
                              size="small"
                              sx={{
                                height: 20,
                                fontSize: '0.625rem',
                                bgcolor: alpha(getRoleColor(member.role), 0.1),
                                color: getRoleColor(member.role),
                                fontWeight: 500,
                                textTransform: 'capitalize'
                              }}
                            />
                          </Box>
                          <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                            <EmailIcon sx={{ fontSize: 12 }} />
                            {member.user?.email}
                          </Typography>
                        </Box>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          )}

          {/* Show message if no members */}
          {formData.companyId && members.length === 0 && (
            <Box sx={{
              p: 2,
              bgcolor: darkMode ? alpha(GOOGLE_COLORS.grey, 0.1) : '#f8f9fa',
              borderRadius: '12px',
              border: `1px dashed ${darkMode ? '#3c4043' : '#dadce0'}`,
              textAlign: 'center'
            }}>
              <PersonIcon sx={{ fontSize: 32, color: darkMode ? '#9aa0a6' : '#5f6368', mb: 1, opacity: 0.5 }} />
              <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                No team members found in this company.
              </Typography>
              <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                You can still add leads without assigning them.
              </Typography>
            </Box>
          )}

          <Divider sx={{ borderColor: darkMode ? '#3c4043' : '#dadce0' }} />
          
          <Typography variant="subtitle2" fontWeight={500} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
            Personal Information
          </Typography>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              fullWidth
              label="First Name *"
              value={formData.firstName || ''}
              onChange={(e) => onFormChange('firstName', e.target.value)}
              error={!!validationErrors.firstName}
              helperText={validationErrors.firstName}
              size="small"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  bgcolor: darkMode ? '#303134' : '#fff',
                },
              }}
            />
            <TextField
              fullWidth
              label="Last Name *"
              value={formData.lastName || ''}
              onChange={(e) => onFormChange('lastName', e.target.value)}
              error={!!validationErrors.lastName}
              helperText={validationErrors.lastName}
              size="small"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  bgcolor: darkMode ? '#303134' : '#fff',
                },
              }}
            />
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={formData.email || ''}
              onChange={(e) => onFormChange('email', e.target.value)}
              error={!!validationErrors.email}
              helperText={validationErrors.email}
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon sx={{ fontSize: 18, color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  bgcolor: darkMode ? '#303134' : '#fff',
                },
              }}
            />
            <TextField
              fullWidth
              label="Phone"
              value={formData.phone || ''}
              onChange={(e) => onFormChange('phone', e.target.value)}
              error={!!validationErrors.phone}
              helperText={validationErrors.phone}
              size="small"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  bgcolor: darkMode ? '#303134' : '#fff',
                },
              }}
            />
          </Box>

          <TextField
            fullWidth
            label="Position / Title"
            value={formData.position || ''}
            onChange={(e) => onFormChange('position', e.target.value)}
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <BadgeIcon sx={{ fontSize: 18, color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
                bgcolor: darkMode ? '#303134' : '#fff',
              },
            }}
          />

          <Divider sx={{ borderColor: darkMode ? '#3c4043' : '#dadce0' }} />

          <Typography variant="subtitle2" fontWeight={500} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
            Lead Details
          </Typography>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <FormControl
              fullWidth
              size="small"
              error={!!validationErrors.source}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  bgcolor: darkMode ? '#303134' : '#fff',
                },
              }}
            >
              <InputLabel>Source *</InputLabel>
              <Select
                value={formData.source || 'website'}
                label="Source *"
                onChange={(e) => onFormChange('source', e.target.value)}
              >
                {LEAD_SOURCES.map(source => (
                  <MenuItem key={source.value} value={source.value}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <span style={{ fontSize: '1.2rem' }}>{source.emoji}</span>
                      {source.label}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl
              fullWidth
              size="small"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  bgcolor: darkMode ? '#303134' : '#fff',
                },
              }}
            >
              <InputLabel>Status</InputLabel>
              <Select
                value={formData.status || 'new'}
                label="Status"
                onChange={(e) => onFormChange('status', e.target.value)}
              >
                {LEAD_STATUS.map(status => (
                  <MenuItem key={status.value} value={status.value}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <span style={{ fontSize: '1.2rem' }}>{status.emoji}</span>
                      {status.label}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              fullWidth
              label="Budget"
              type="number"
              value={formData.budget || ''}
              onChange={(e) => onFormChange('budget', e.target.value)}
              error={!!validationErrors.budget}
              helperText={validationErrors.budget}
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AttachMoneyIcon sx={{ fontSize: 18, color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  bgcolor: darkMode ? '#303134' : '#fff',
                },
              }}
            />

            <FormControl
              fullWidth
              size="small"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  bgcolor: darkMode ? '#303134' : '#fff',
                },
              }}
            >
              <InputLabel>Currency</InputLabel>
              <Select
                value={formData.currency || 'USD'}
                label="Currency"
                onChange={(e) => onFormChange('currency', e.target.value)}
              >
                <MenuItem value="USD">🇺🇸 USD ($)</MenuItem>
                <MenuItem value="EUR">🇪🇺 EUR (€)</MenuItem>
                <MenuItem value="GBP">🇬🇧 GBP (£)</MenuItem>
                <MenuItem value="INR">🇮🇳 INR (₹)</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <FormControl
            fullWidth
            size="small"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
                bgcolor: darkMode ? '#303134' : '#fff',
              },
            }}
          >
            <InputLabel>Interest Level</InputLabel>
            <Select
              value={formData.interestLevel || 'medium'}
              label="Interest Level"
              onChange={(e) => onFormChange('interestLevel', e.target.value)}
            >
              {INTEREST_LEVELS.map(level => (
                <MenuItem key={level.value} value={level.value}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <span style={{ fontSize: '1.2rem' }}>{level.emoji}</span>
                    {level.label}
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Divider sx={{ borderColor: darkMode ? '#3c4043' : '#dadce0' }} />

          <Typography variant="subtitle2" fontWeight={500} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
            Additional Information
          </Typography>

          <TextField
            fullWidth
            label="Notes"
            multiline
            rows={3}
            value={formData.notes || ''}
            onChange={(e) => onFormChange('notes', e.target.value)}
            size="small"
            placeholder="Add any additional notes about this lead..."
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
                bgcolor: darkMode ? '#303134' : '#fff',
              },
            }}
          />

          <TextField
            fullWidth
            label="Tags"
            placeholder="hot, follow-up, vip (comma separated)"
            value={formData.tags || ''}
            onChange={(e) => onFormChange('tags', e.target.value)}
            size="small"
            helperText="Enter tags separated by commas"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
                bgcolor: darkMode ? '#303134' : '#fff',
              },
            }}
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{
        p: 3,
        gap: 2,
        borderTop: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
        bgcolor: darkMode ? '#303134' : '#f8f9fa',
      }}>
        <Button
          onClick={onClose}
          disabled={submitting}
          sx={{
            borderRadius: '24px',
            color: darkMode ? '#e8eaed' : '#202124',
            borderColor: darkMode ? '#3c4043' : '#dadce0',
            px: 4
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={onSubmit}
          disabled={submitting}
          variant="contained"
          sx={{
            borderRadius: '24px',
            bgcolor: GOOGLE_COLORS.green,
            '&:hover': { bgcolor: '#2d9248' },
            px: 4,
            minWidth: 120
          }}
        >
          {submitting ? <CircularProgress size={24} /> : "Add Lead"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}