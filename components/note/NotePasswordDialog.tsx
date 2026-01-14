import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  TextField,
  Alert,
  IconButton,
  InputAdornment,
  FormControlLabel,
  Switch,
  useTheme,
  alpha,
  CircularProgress,
} from '@mui/material';
import {
  Close,
  Lock,
  Visibility,
  VisibilityOff,
  Check,
  Error,
  Security,
} from '@mui/icons-material';

interface NotePasswordDialogProps {
  open: boolean;
  noteTitle: string;
  isPasswordProtected: boolean;
  currentPassword?: string;
  onClose: () => void;
  onSubmit: (options: PasswordOptions) => Promise<void>;
  onRemovePassword?: () => Promise<void>;
}

interface PasswordOptions {
  password: string;
  confirmPassword: string;
  enableProtection: boolean;
  hint?: string;
}

export const NotePasswordDialog: React.FC<NotePasswordDialogProps> = ({
  open,
  noteTitle,
  isPasswordProtected,
  currentPassword,
  onClose,
  onSubmit,
  onRemovePassword,
}) => {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [options, setOptions] = useState<PasswordOptions>({
    password: '',
    confirmPassword: '',
    enableProtection: !isPasswordProtected,
    hint: '',
  });

  const handleSubmit = async () => {
    setError(null);

    // Validate
    if (options.enableProtection) {
      if (!options.password.trim()) {
        setError('Password is required');
        return;
      }
      if (options.password.length < 4) {
        setError('Password must be at least 4 characters');
        return;
      }
      if (options.password !== options.confirmPassword) {
        setError('Passwords do not match');
        return;
      }
    }

    setLoading(true);
    try {
      await onSubmit(options);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  const handleRemovePassword = async () => {
    if (!onRemovePassword) return;

    if (!window.confirm('Are you sure you want to remove password protection from this note?')) {
      return;
    }

    setLoading(true);
    try {
      await onRemovePassword();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove password');
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = (password: string) => {
    if (password.length === 0) return { score: 0, label: '', color: 'inherit' };
    
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    
    const strengths = [
      { label: 'Very Weak', color: theme.palette.error.main },
      { label: 'Weak', color: theme.palette.warning.main },
      { label: 'Fair', color: theme.palette.info.main },
      { label: 'Good', color: theme.palette.success.main },
      { label: 'Strong', color: theme.palette.success.dark },
    ];
    
    return strengths[score] || strengths[0];
  };

  const strength = passwordStrength(options.password);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 3 },
      }}
    >
      <DialogTitle sx={{ p: 3, pb: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5" fontWeight="bold">
            <Security sx={{ mr: 1, verticalAlign: 'middle' }} />
            {isPasswordProtected ? 'Update Password' : 'Password Protection'}
          </Typography>
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {noteTitle}
        </Typography>
      </DialogContent>

      <DialogContent sx={{ p: 3 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        {/* Enable/Disable Protection */}
        <Box sx={{ mb: 3 }}>
          <FormControlLabel
            control={
              <Switch
                checked={options.enableProtection}
                onChange={(e) => setOptions(prev => ({
                  ...prev,
                  enableProtection: e.target.checked,
                  password: '',
                  confirmPassword: '',
                }))}
                color="primary"
              />
            }
            label={
              <Box>
                <Typography variant="body1" fontWeight="medium">
                  {options.enableProtection ? 'Enable Password Protection' : 'Disable Password Protection'}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {options.enableProtection
                    ? 'Require password to view this note'
                    : 'Anyone with access can view this note'}
                </Typography>
              </Box>
            }
          />
        </Box>

        {options.enableProtection && (
          <>
            {/* Current Password (for update) */}
            {isPasswordProtected && currentPassword && (
              <TextField
                fullWidth
                type={showPassword ? 'text' : 'password'}
                label="Current Password"
                value={currentPassword}
                disabled
                size="small"
                sx={{ mb: 2 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock />
                    </InputAdornment>
                  ),
                }}
              />
            )}

            {/* New Password */}
            <TextField
              fullWidth
              type={showPassword ? 'text' : 'password'}
              label="New Password"
              value={options.password}
              onChange={(e) => setOptions(prev => ({ ...prev, password: e.target.value }))}
              size="small"
              sx={{ mb: 1 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {/* Password Strength */}
            {options.password && (
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="caption" color="text.secondary">
                    Password Strength
                  </Typography>
                  <Typography variant="caption" fontWeight="medium" color={strength.color}>
                    {strength.label}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    height: 4,
                    borderRadius: 2,
                    bgcolor: theme.palette.divider,
                    overflow: 'hidden',
                  }}
                >
                  <Box
                    sx={{
                      width: `${(strength.score / 4) * 100}%`,
                      height: '100%',
                      bgcolor: strength.color,
                      transition: 'width 0.3s',
                    }}
                  />
                </Box>
              </Box>
            )}

            {/* Confirm Password */}
            <TextField
              fullWidth
              type={showConfirmPassword ? 'text' : 'password'}
              label="Confirm Password"
              value={options.confirmPassword}
              onChange={(e) => setOptions(prev => ({ ...prev, confirmPassword: e.target.value }))}
              size="small"
              sx={{ mb: 2 }}
              error={options.confirmPassword !== '' && options.password !== options.confirmPassword}
              helperText={
                options.confirmPassword !== '' && options.password !== options.confirmPassword
                  ? 'Passwords do not match'
                  : ''
              }
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {/* Password Hint */}
            <TextField
              fullWidth
              label="Password Hint (Optional)"
              value={options.hint}
              onChange={(e) => setOptions(prev => ({ ...prev, hint: e.target.value }))}
              size="small"
              sx={{ mb: 2 }}
              placeholder="e.g., My pet's name"
              helperText="A hint to help remember the password"
            />

            {/* Password Requirements */}
            <Alert
              severity="info"
              sx={{
                borderRadius: 2,
                bgcolor: alpha(theme.palette.info.main, 0.05),
              }}
            >
              <Typography variant="subtitle2" gutterBottom>
                Password Requirements
              </Typography>
              <Box component="ul" sx={{ m: 0, pl: 2, '& li': { fontSize: '0.875rem' } }}>
                <li>At least 4 characters long</li>
                <li>Strong passwords include uppercase, numbers, and symbols</li>
                <li>Password cannot be changed once set without current password</li>
              </Box>
            </Alert>
          </>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 0 }}>
        {isPasswordProtected && onRemovePassword && (
          <Button
            color="error"
            onClick={handleRemovePassword}
            disabled={loading}
            startIcon={<Close />}
          >
            Remove Password
          </Button>
        )}
        <Box sx={{ flex: 1 }} />
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading || (options.enableProtection && options.password !== options.confirmPassword)}
          startIcon={loading ? <CircularProgress size={20} /> : <Check />}
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};