import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Chip,
  Autocomplete,
  IconButton,
  Tooltip,
  useTheme,
  alpha,
  Switch,
  FormControlLabel,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  Close,
  Share,
  PersonAdd,
  Link,
  CopyAll,
  Check,
  Public,
  Lock,
} from '@mui/icons-material';
import { Note } from './types';

interface NoteShareDialogProps {
  open: boolean;
  note: Note;
  onClose: () => void;
  onShare: (userIds: string[], role: string) => Promise<void>;
}

export const NoteShareDialog: React.FC<NoteShareDialogProps> = ({
  open,
  note,
  onClose,
  onShare,
}) => {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [role, setRole] = useState<'viewer' | 'editor' | 'commenter'>('viewer');
  const [isPublic, setIsPublic] = useState(note.isPublic);
  const [linkCopied, setLinkCopied] = useState(false);

  // Mock users - in real app, fetch from API
  const mockUsers = [
    { id: '1', name: 'John Doe', email: 'john@example.com' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com' },
    { id: '3', name: 'Bob Johnson', email: 'bob@example.com' },
    { id: '4', name: 'Alice Brown', email: 'alice@example.com' },
  ];

  const handleShare = async () => {
    if (selectedUsers.length === 0 && !isPublic) return;

    setLoading(true);
    try {
      await onShare(selectedUsers, role);
      onClose();
    } catch (error) {
      console.error('Failed to share:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyPublicLink = () => {
    if (note.publicSlug) {
      const link = `${window.location.origin}/note/public/${note.publicSlug}`;
      navigator.clipboard.writeText(link);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    }
  };

  const getPublicLink = () => {
    if (note.publicSlug) {
      return `${window.location.origin}/note/public/${note.publicSlug}`;
    }
    return 'Enable public access to generate link';
  };

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
            Share Note
          </Typography>
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {note.title}
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        {/* Share with Users */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
            Share with people
          </Typography>
          <Autocomplete
            multiple
            options={mockUsers}
            getOptionLabel={(option) => `${option.name} (${option.email})`}
            value={mockUsers.filter(user => selectedUsers.includes(user.id))}
            onChange={(_, newValue) => {
              setSelectedUsers(newValue.map(user => user.id));
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Search users..."
                size="small"
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <>
                      <PersonAdd sx={{ mr: 1, color: 'text.secondary' }} />
                      {params.InputProps.startAdornment}
                    </>
                  ),
                }}
              />
            )}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  label={option.name}
                  size="small"
                  {...getTagProps({ index })}
                  sx={{ mr: 0.5 }}
                />
              ))
            }
          />
        </Box>

        {/* Role Selection */}
        <Box sx={{ mb: 3 }}>
          <FormControl fullWidth size="small">
            <InputLabel>Permission Level</InputLabel>
            <Select
              value={role}
              label="Permission Level"
              onChange={(e) => setRole(e.target.value as any)}
            >
              <MenuItem value="viewer">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Lock fontSize="small" />
                  <Box>
                    <Typography variant="body2">Viewer</Typography>
                    <Typography variant="caption" color="text.secondary">
                      Can view only
                    </Typography>
                  </Box>
                </Box>
              </MenuItem>
              <MenuItem value="commenter">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Share fontSize="small" />
                  <Box>
                    <Typography variant="body2">Commenter</Typography>
                    <Typography variant="caption" color="text.secondary">
                      Can view and comment
                    </Typography>
                  </Box>
                </Box>
              </MenuItem>
              <MenuItem value="editor">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PersonAdd fontSize="small" />
                  <Box>
                    <Typography variant="body2">Editor</Typography>
                    <Typography variant="caption" color="text.secondary">
                      Can view, edit, and comment
                    </Typography>
                  </Box>
                </Box>
              </MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Public Access */}
        <Box
          sx={{
            p: 2,
            borderRadius: 2,
            bgcolor: alpha(theme.palette.primary.main, 0.05),
            border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Public color="primary" />
              <Box>
                <Typography variant="subtitle1" fontWeight="medium">
                  Public Access
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Anyone with the link can view
                </Typography>
              </Box>
            </Box>
            <FormControlLabel
              control={
                <Switch
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                  color="primary"
                />
              }
              label=""
            />
          </Box>

          {isPublic && (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                fullWidth
                value={getPublicLink()}
                size="small"
                InputProps={{
                  readOnly: true,
                  startAdornment: <Link fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
              />
              <Tooltip title={linkCopied ? 'Copied!' : 'Copy link'}>
                <Button
                  variant="outlined"
                  onClick={copyPublicLink}
                  startIcon={linkCopied ? <Check /> : <CopyAll />}
                >
                  {linkCopied ? 'Copied' : 'Copy'}
                </Button>
              </Tooltip>
            </Box>
          )}
        </Box>

        {/* Already Shared Users */}
        {note.sharedWith && note.sharedWith.length > 0 && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Already shared with
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {note.sharedWith.map((share, index) => (
                <Chip
                  key={index}
                  label={`User ${share.userId}`}
                  size="small"
                  variant="outlined"
                  onDelete={() => {
                    // Handle remove shared user
                  }}
                />
              ))}
            </Box>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handleShare}
          disabled={loading || (selectedUsers.length === 0 && !isPublic)}
          startIcon={<Share />}
        >
          {loading ? 'Sharing...' : 'Share Note'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};