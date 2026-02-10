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
import { Note, ShareRole } from '@/components/note/types';

// Import Google-themed components
import { Card } from '@/components/ui/Card';

interface NoteShareDialogProps {
  open: boolean;
  note: Note;
  onClose: () => void;
  onShare: (userIds: string[], role: ShareRole) => Promise<void>;
  darkMode?: boolean;
}

export const NoteShareDialog: React.FC<NoteShareDialogProps> = ({
  open,
  note,
  onClose,
  onShare,
  darkMode = false,
}) => {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [role, setRole] = useState<ShareRole>('viewer');
  const [isPublic, setIsPublic] = useState(note.isPublic || false);
  const [linkCopied, setLinkCopied] = useState(false);

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
        sx: { 
          borderRadius: '16px',
          backgroundColor: darkMode ? '#303134' : '#ffffff',
          border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
        },
      }}
    >
      <DialogTitle sx={{ 
        p: 3, 
        pb: 2,
        backgroundColor: darkMode ? '#303134' : '#ffffff',
        borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography 
            variant="h5" 
            fontWeight="bold"
            sx={{ color: darkMode ? '#e8eaed' : '#202124' }}
          >
            Share Note
          </Typography>
          <IconButton 
            onClick={onClose} 
            size="small"
            sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}
          >
            <Close />
          </IconButton>
        </Box>
        <Typography 
          variant="body2" 
          sx={{ 
            mt: 1,
            color: darkMode ? '#9aa0a6' : '#5f6368',
          }}
        >
          {note.title}
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ 
        p: 3,
        backgroundColor: darkMode ? '#303134' : '#ffffff',
      }}>
        <Box sx={{ mb: 3 }}>
          <Typography 
            variant="subtitle1" 
            fontWeight="medium" 
            gutterBottom
            sx={{ color: darkMode ? '#e8eaed' : '#202124' }}
          >
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
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: darkMode ? '#202124' : '#ffffff',
                    borderColor: darkMode ? '#3c4043' : '#dadce0',
                    '&:hover': {
                      borderColor: darkMode ? '#5f6368' : '#5f6368',
                    },
                  },
                }}
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <>
                      <PersonAdd sx={{ 
                        mr: 1, 
                        color: darkMode ? '#9aa0a6' : '#5f6368' 
                      }} />
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
                  sx={{ 
                    mr: 0.5,
                    backgroundColor: darkMode ? '#3c4043' : '#f1f3f4',
                    color: darkMode ? '#e8eaed' : '#202124',
                  }}
                />
              ))
            }
          />
        </Box>

        <Box sx={{ mb: 3 }}>
          <FormControl fullWidth size="small">
            <InputLabel
              sx={{
                color: darkMode ? '#9aa0a6' : '#5f6368',
              }}
            >
              Permission Level
            </InputLabel>
            <Select
              value={role}
              label="Permission Level"
              onChange={(e) => setRole(e.target.value as ShareRole)}
              sx={{
                backgroundColor: darkMode ? '#202124' : '#ffffff',
                borderColor: darkMode ? '#3c4043' : '#dadce0',
                color: darkMode ? '#e8eaed' : '#202124',
                '& .MuiSelect-icon': {
                  color: darkMode ? '#9aa0a6' : '#5f6368',
                },
              }}
            >
              <MenuItem value="viewer">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Lock fontSize="small" />
                  <Box>
                    <Typography 
                      variant="body2"
                      sx={{ color: darkMode ? '#e8eaed' : '#202124' }}
                    >
                      Viewer
                    </Typography>
                    <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                      Can view only
                    </Typography>
                  </Box>
                </Box>
              </MenuItem>
              <MenuItem value="commenter">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Share fontSize="small" />
                  <Box>
                    <Typography 
                      variant="body2"
                      sx={{ color: darkMode ? '#e8eaed' : '#202124' }}
                    >
                      Commenter
                    </Typography>
                    <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                      Can view and comment
                    </Typography>
                  </Box>
                </Box>
              </MenuItem>
              <MenuItem value="editor">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PersonAdd fontSize="small" />
                  <Box>
                    <Typography 
                      variant="body2"
                      sx={{ color: darkMode ? '#e8eaed' : '#202124' }}
                    >
                      Editor
                    </Typography>
                    <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                      Can view, edit, and comment
                    </Typography>
                  </Box>
                </Box>
              </MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Card
          hover
          sx={{ 
            p: 2,
            borderRadius: '12px',
            backgroundColor: darkMode ? '#202124' : '#f8f9fa',
            border: `1px solid ${alpha(darkMode ? '#4285f4' : '#4285f4', 0.2)}`,
            mb: 3,
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Public sx={{ color: '#4285f4' }} />
              <Box>
                <Typography 
                  variant="subtitle1" 
                  fontWeight="medium"
                  sx={{ color: darkMode ? '#e8eaed' : '#202124' }}
                >
                  Public Access
                </Typography>
                <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
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
                  sx: {
                    backgroundColor: darkMode ? '#303134' : '#ffffff',
                    color: darkMode ? '#e8eaed' : '#202124',
                  },
                  startAdornment: <Link fontSize="small" sx={{ 
                    mr: 1, 
                    color: darkMode ? '#9aa0a6' : '#5f6368' 
                  }} />,
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderColor: darkMode ? '#3c4043' : '#dadce0',
                  },
                }}
              />
              <Tooltip title={linkCopied ? 'Copied!' : 'Copy link'}>
                <Button
                  variant="outlined"
                  onClick={copyPublicLink}
                  startIcon={linkCopied ? <Check /> : <CopyAll />}
                  sx={{
                    borderColor: darkMode ? '#3c4043' : '#dadce0',
                    color: darkMode ? '#e8eaed' : '#202124',
                    '&:hover': {
                      borderColor: darkMode ? '#5f6368' : '#5f6368',
                      backgroundColor: darkMode ? '#3c4043' : '#f1f3f4',
                    },
                  }}
                >
                  {linkCopied ? 'Copied' : 'Copy'}
                </Button>
              </Tooltip>
            </Box>
          )}
        </Card>

        {note.sharedWith && note.sharedWith.length > 0 && (
          <Box sx={{ mt: 3 }}>
            <Typography 
              variant="subtitle2" 
              gutterBottom
              sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}
            >
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
                  sx={{
                    backgroundColor: darkMode ? '#3c4043' : '#f1f3f4',
                    color: darkMode ? '#e8eaed' : '#202124',
                    borderColor: darkMode ? '#5f6368' : '#dadce0',
                  }}
                />
              ))}
            </Box>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ 
        p: 3, 
        pt: 0,
        backgroundColor: darkMode ? '#303134' : '#ffffff',
        borderTop: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
      }}>
        <Button 
          onClick={onClose}
          sx={{
            color: darkMode ? '#e8eaed' : '#202124',
            '&:hover': {
              backgroundColor: darkMode ? '#3c4043' : '#f1f3f4',
            },
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleShare}
          disabled={loading || (selectedUsers.length === 0 && !isPublic)}
          startIcon={<Share />}
          sx={{
            backgroundColor: '#34a853',
            '&:hover': { backgroundColor: '#2d9248' },
            '&.Mui-disabled': {
              backgroundColor: darkMode ? '#3c4043' : '#dadce0',
              color: darkMode ? '#9aa0a6' : '#5f6368',
            },
          }}
        >
          {loading ? 'Sharing...' : 'Share Note'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};