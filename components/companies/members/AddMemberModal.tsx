'use client';

import { useState } from 'react';
import {
  Box,
  Typography,
  useTheme,
  alpha,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Button,
  LinearProgress,
  Alert,
  Avatar,
  Divider
} from "@mui/material";
import {
  X,
  Mail,
  User as UserIcon,
  Shield,
  Users
} from 'lucide-react';

const GOOGLE_COLORS = {
  blue: '#1a73e8',
  red: '#d93025',
  green: '#1e8e3e',
  yellow: '#f9ab00',
  grey: '#5f6368',
  darkGrey: '#3c4043',
  lightGrey: '#f1f3f4'
};

interface AddMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: { email: string; name: string; role: string }) => Promise<void>;
  loading?: boolean;
  memberLimit: {
    current: number;
    max: number;
    remaining: number;
  };
  darkMode?: boolean;
}

export default function AddMemberModal({ 
  isOpen, 
  onClose, 
  onAdd, 
  loading = false,
  memberLimit,
  darkMode = false
}: AddMemberModalProps) {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    role: 'member'
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email) {
      setError('Email is required');
      return;
    }

    if (!formData.email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    if (memberLimit.remaining <= 0) {
      setError(`Member limit reached (${memberLimit.current}/${memberLimit.max})`);
      return;
    }

    try {
      setError('');
      await onAdd(formData);
      setFormData({ email: '', name: '', role: 'member' });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to add member');
    }
  };

  const handleRoleChange = (event: SelectChangeEvent) => {
    setFormData({ ...formData, role: event.target.value });
  };

  const handleClose = () => {
    if (!loading) {
      setFormData({ email: '', name: '', role: 'member' });
      setError('');
      onClose();
    }
  };

  const usagePercentage = (memberLimit.current / memberLimit.max) * 100;

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: darkMode ? '#2d2e30' : '#fff',
          border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
          borderRadius: '16px',
          boxShadow: darkMode 
            ? '0 8px 32px rgba(0,0,0,0.4)'
            : '0 8px 32px rgba(0,0,0,0.1)'
        }
      }}
    >
      {/* Header */}
      <DialogTitle sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        px: 3,
        py: 2.5,
        borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Avatar sx={{
            width: 40,
            height: 40,
            bgcolor: alpha(GOOGLE_COLORS.blue, 0.1),
            color: GOOGLE_COLORS.blue,
            borderRadius: '10px'
          }}>
            <Users size={20} />
          </Avatar>
          <Box>
            <Typography sx={{
              fontSize: '1.125rem',
              fontWeight: 500,
              color: darkMode ? '#e8eaed' : '#202124',
              lineHeight: 1.2
            }}>
              Add Team Member
            </Typography>
            <Typography sx={{
              fontSize: '0.75rem',
              color: darkMode ? '#9aa0a6' : '#5f6368',
              mt: 0.25
            }}>
              Invite someone to collaborate
            </Typography>
          </Box>
        </Box>
        <Button
          onClick={handleClose}
          disabled={loading}
          sx={{
            minWidth: 'auto',
            p: 1,
            color: darkMode ? '#9aa0a6' : '#5f6368',
            '&:hover': {
              bgcolor: darkMode ? alpha('#fff', 0.1) : alpha('#000', 0.05)
            },
            '&.Mui-disabled': {
              color: darkMode ? '#3c4043' : '#dadce0'
            }
          }}
        >
          <X size={20} />
        </Button>
      </DialogTitle>

      {/* Member Limit Info */}
      <Box sx={{ px: 3, pt: 2.5 }}>
        <Box sx={{
          p: 2,
          bgcolor: darkMode ? alpha(GOOGLE_COLORS.blue, 0.1) : alpha(GOOGLE_COLORS.blue, 0.05),
          borderRadius: '12px',
          border: `1px solid ${darkMode ? alpha(GOOGLE_COLORS.blue, 0.2) : alpha(GOOGLE_COLORS.blue, 0.1)}`
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
            <Typography sx={{
              fontSize: '0.8125rem',
              fontWeight: 500,
              color: GOOGLE_COLORS.blue
            }}>
              Team Members
            </Typography>
            <Typography sx={{
              fontSize: '0.8125rem',
              fontWeight: 500,
              color: GOOGLE_COLORS.blue
            }}>
              {memberLimit.current}/{memberLimit.max}
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={usagePercentage}
            sx={{
              height: 6,
              borderRadius: 3,
              bgcolor: darkMode ? alpha(GOOGLE_COLORS.blue, 0.2) : alpha(GOOGLE_COLORS.blue, 0.1),
              '& .MuiLinearProgress-bar': {
                bgcolor: GOOGLE_COLORS.blue,
                borderRadius: 3
              }
            }}
          />
          <Typography sx={{
            fontSize: '0.75rem',
            color: GOOGLE_COLORS.blue,
            mt: 1,
            opacity: 0.9
          }}>
            {memberLimit.remaining} slots remaining on Free plan
          </Typography>
        </Box>
      </Box>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ px: 3, py: 2.5 }}>
          {error && (
            <Alert
              severity="error"
              sx={{
                mb: 2.5,
                borderRadius: '8px',
                bgcolor: darkMode ? alpha(GOOGLE_COLORS.red, 0.1) : alpha(GOOGLE_COLORS.red, 0.05),
                color: darkMode ? '#f28b82' : GOOGLE_COLORS.red,
                border: `1px solid ${darkMode ? alpha(GOOGLE_COLORS.red, 0.2) : alpha(GOOGLE_COLORS.red, 0.1)}`,
                '& .MuiAlert-icon': { color: GOOGLE_COLORS.red }
              }}
            >
              {error}
            </Alert>
          )}

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            {/* Email Field */}
            <TextField
              fullWidth
              type="email"
              label="Email Address"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              disabled={loading || memberLimit.remaining <= 0}
              placeholder="colleague@company.com"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Mail size={18} color={darkMode ? '#9aa0a6' : '#5f6368'} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '10px',
                  bgcolor: darkMode ? '#303134' : '#fff',
                  '&:hover': {
                    bgcolor: darkMode ? '#3c4043' : '#f8f9fa',
                  },
                  '& fieldset': {
                    borderColor: darkMode ? '#3c4043' : '#dadce0'
                  },
                  '&:hover fieldset': {
                    borderColor: darkMode ? '#9aa0a6' : '#202124'
                  }
                },
                '& .MuiInputLabel-root': {
                  color: darkMode ? '#9aa0a6' : '#5f6368',
                  '&.Mui-focused': {
                    color: GOOGLE_COLORS.blue
                  }
                }
              }}
            />

            {/* Name Field */}
            <TextField
              fullWidth
              type="text"
              label="Full Name (Optional)"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              disabled={loading || memberLimit.remaining <= 0}
              placeholder="John Doe"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <UserIcon size={18} color={darkMode ? '#9aa0a6' : '#5f6368'} />
                  </InputAdornment>
                ),
              }}
              helperText="Will use email name if not provided"
              FormHelperTextProps={{
                sx: {
                  fontSize: '0.75rem',
                  color: darkMode ? '#9aa0a6' : '#5f6368',
                  mt: 0.5,
                  mx: 0
                }
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '10px',
                  bgcolor: darkMode ? '#303134' : '#fff',
                  '&:hover': {
                    bgcolor: darkMode ? '#3c4043' : '#f8f9fa',
                  },
                  '& fieldset': {
                    borderColor: darkMode ? '#3c4043' : '#dadce0'
                  },
                  '&:hover fieldset': {
                    borderColor: darkMode ? '#9aa0a6' : '#202124'
                  }
                },
                '& .MuiInputLabel-root': {
                  color: darkMode ? '#9aa0a6' : '#5f6368',
                  '&.Mui-focused': {
                    color: GOOGLE_COLORS.blue
                  }
                }
              }}
            />

            {/* Role Select */}
            <FormControl fullWidth>
              <InputLabel sx={{
                color: darkMode ? '#9aa0a6' : '#5f6368',
                '&.Mui-focused': { color: GOOGLE_COLORS.blue }
              }}>
                Role
              </InputLabel>
              <Select
                value={formData.role}
                label="Role"
                onChange={handleRoleChange}
                disabled={loading || memberLimit.remaining <= 0}
                startAdornment={
                  <InputAdornment position="start" sx={{ ml: 1 }}>
                    <Shield size={18} color={darkMode ? '#9aa0a6' : '#5f6368'} />
                  </InputAdornment>
                }
                sx={{
                  borderRadius: '10px',
                  bgcolor: darkMode ? '#303134' : '#fff',
                  color: darkMode ? '#e8eaed' : '#202124',
                  '&:hover': {
                    bgcolor: darkMode ? '#3c4043' : '#f8f9fa',
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: darkMode ? '#3c4043' : '#dadce0'
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: darkMode ? '#9aa0a6' : '#202124'
                  },
                  '& .MuiSvgIcon-root': {
                    color: darkMode ? '#9aa0a6' : '#5f6368'
                  },
                  '& .MuiInputAdornment-root': {
                    mr: 0.5
                  }
                }}
              >
                <MenuItem value="member">Member - Can view and edit tasks</MenuItem>
                <MenuItem value="manager">Manager - Can manage projects</MenuItem>
                <MenuItem value="viewer">Viewer - Read only access</MenuItem>
              </Select>
            </FormControl>

            {/* Limit Reached Warning */}
            {memberLimit.remaining <= 0 && (
              <Alert
                severity="warning"
                sx={{
                  borderRadius: '8px',
                  bgcolor: darkMode ? alpha(GOOGLE_COLORS.yellow, 0.1) : alpha(GOOGLE_COLORS.yellow, 0.05),
                  color: darkMode ? '#fdd663' : '#5f3b00',
                  border: `1px solid ${darkMode ? alpha(GOOGLE_COLORS.yellow, 0.2) : alpha(GOOGLE_COLORS.yellow, 0.1)}`,
                  '& .MuiAlert-icon': { color: GOOGLE_COLORS.yellow }
                }}
              >
                <Typography variant="body2">
                  Member limit reached. Remove existing members or upgrade your plan.
                </Typography>
              </Alert>
            )}
          </Box>
        </DialogContent>

        <Divider sx={{ borderColor: darkMode ? '#3c4043' : '#dadce0' }} />

        {/* Actions */}
        <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
          <Button
            type="button"
            onClick={handleClose}
            disabled={loading}
            sx={{
              px: 3,
              py: 1,
              borderRadius: '24px',
              color: darkMode ? '#e8eaed' : '#5f6368',
              border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
              textTransform: 'none',
              fontSize: '0.875rem',
              fontWeight: 500,
              '&:hover': {
                bgcolor: darkMode ? alpha('#fff', 0.05) : alpha('#000', 0.05),
                borderColor: darkMode ? '#9aa0a6' : '#202124',
              },
              '&.Mui-disabled': {
                borderColor: darkMode ? '#3c4043' : '#dadce0',
                color: darkMode ? '#5f6368' : '#9aa0a6'
              }
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={loading || memberLimit.remaining <= 0 || !formData.email}
            sx={{
              px: 3,
              py: 1,
              borderRadius: '24px',
              bgcolor: GOOGLE_COLORS.blue,
              color: '#fff',
              textTransform: 'none',
              fontSize: '0.875rem',
              fontWeight: 500,
              '&:hover': {
                bgcolor: '#1557b0',
              },
              '&.Mui-disabled': {
                bgcolor: darkMode ? '#3c4043' : '#dadce0',
                color: darkMode ? '#9aa0a6' : '#5f6368'
              }
            }}
          >
            {loading ? 'Adding...' : 'Add Member'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}