import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  Checkbox,
  FormGroup,
  TextField,
  MenuItem,
  useTheme,
  alpha,
  CircularProgress,
  Alert,
  IconButton,
} from '@mui/material';
import {
  Close,
  Download,
  PictureAsPdf,
  Description,
  TextFields,
  FileCopy,
  CloudDownload,
} from '@mui/icons-material';

interface NoteExportDialogProps {
  open: boolean;
  noteIds: string[];
  onClose: () => void;
  onExport: (options: ExportOptions) => Promise<void>;
}

interface ExportOptions {
  format: 'pdf' | 'md' | 'txt' | 'html' | 'json';
  includeAttachments: boolean;
  includeMetadata: boolean;
  includeVersions: boolean;
  compression: 'none' | 'zip';
  password?: string;
}

export const NoteExportDialog: React.FC<NoteExportDialogProps> = ({
  open,
  noteIds,
  onClose,
  onExport,
}) => {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [options, setOptions] = useState<ExportOptions>({
    format: 'pdf',
    includeAttachments: false,
    includeMetadata: true,
    includeVersions: false,
    compression: 'zip',
  });

  const formats = [
    { value: 'pdf', label: 'PDF Document', icon: <PictureAsPdf /> },
    { value: 'md', label: 'Markdown', icon: <Description /> },
    { value: 'txt', label: 'Plain Text', icon: <TextFields /> },
    { value: 'html', label: 'HTML', icon: <FileCopy /> },
    { value: 'json', label: 'JSON', icon: <CloudDownload /> },
  ];

  const handleExport = async () => {
    if (noteIds.length === 0) {
      setError('No notes selected for export');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await onExport(options);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to export notes');
    } finally {
      setLoading(false);
    }
  };

  const handleFormatChange = (format: ExportOptions['format']) => {
    setOptions(prev => ({ ...prev, format }));
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
            Export Notes
          </Typography>
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Export {noteIds.length} note{noteIds.length !== 1 ? 's' : ''}
        </Typography>
      </DialogContent>

      <DialogContent sx={{ p: 3 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        {/* Export Format */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
            Export Format
          </Typography>
          <RadioGroup
            value={options.format}
            onChange={(e) => handleFormatChange(e.target.value as any)}
            sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: 2 }}
          >
            {formats.map((format) => (
              <Box
                key={format.value}
                sx={{
                  flex: 1,
                  minWidth: 100,
                  p: 2,
                  borderRadius: 2,
                  border: `2px solid ${
                    options.format === format.value
                      ? theme.palette.primary.main
                      : theme.palette.divider
                  }`,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  '&:hover': {
                    borderColor: theme.palette.primary.main,
                    bgcolor: alpha(theme.palette.primary.main, 0.05),
                  },
                }}
                onClick={() => handleFormatChange(format.value as any)}
              >
                <FormControlLabel
                  value={format.value}
                  control={
                    <Radio
                      checked={options.format === format.value}
                      sx={{ display: 'none' }}
                    />
                  }
                  label={
                    <Box sx={{ textAlign: 'center' }}>
                      <Box sx={{ color: theme.palette.primary.main, mb: 1 }}>
                        {format.icon}
                      </Box>
                      <Typography variant="body2" fontWeight="medium">
                        {format.label}
                      </Typography>
                    </Box>
                  }
                  sx={{ m: 0, width: '100%' }}
                />
              </Box>
            ))}
          </RadioGroup>
        </Box>

        {/* Export Options */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
            Options
          </Typography>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={options.includeMetadata}
                  onChange={(e) => setOptions(prev => ({
                    ...prev,
                    includeMetadata: e.target.checked,
                  }))}
                />
              }
              label="Include metadata (tags, category, etc.)"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={options.includeAttachments}
                  onChange={(e) => setOptions(prev => ({
                    ...prev,
                    includeAttachments: e.target.checked,
                  }))}
                />
              }
              label="Include attachments"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={options.includeVersions}
                  onChange={(e) => setOptions(prev => ({
                    ...prev,
                    includeVersions: e.target.checked,
                  }))}
                />
              }
              label="Include version history"
            />
          </FormGroup>
        </Box>

        {/* Compression */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
            Compression
          </Typography>
          <TextField
            select
            fullWidth
            size="small"
            value={options.compression}
            onChange={(e) => setOptions(prev => ({
              ...prev,
              compression: e.target.value as 'none' | 'zip',
            }))}
          >
            <MenuItem value="none">No compression (single file)</MenuItem>
            <MenuItem value="zip">ZIP archive (multiple files)</MenuItem>
          </TextField>
        </Box>

        {/* Password Protection */}
        <Box>
          <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
            Password Protection (Optional)
          </Typography>
          <TextField
            fullWidth
            type="password"
            placeholder="Enter password to protect export"
            size="small"
            value={options.password || ''}
            onChange={(e) => setOptions(prev => ({
              ...prev,
              password: e.target.value || undefined,
            }))}
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handleExport}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : <Download />}
        >
          {loading ? 'Exporting...' : 'Export Notes'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};