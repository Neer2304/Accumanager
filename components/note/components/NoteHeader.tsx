import { Box, Typography, Button, Stack, Paper, alpha, useTheme } from '@mui/material';
import { ArrowBack, Save, Cancel, Edit, Delete, Archive, Unarchive } from '@mui/icons-material';
import { useRouter } from 'next/navigation';

interface NoteHeaderProps {
  title: string;
  subTitle?: string;
  noteId?: string;
  mode: 'view' | 'edit' | 'create';
  loading?: boolean;
  onSave?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onArchive?: () => void;
  noteStatus?: string;
}

export function NoteHeader({
  title,
  subTitle,
  noteId,
  mode,
  loading,
  onSave,
  onEdit,
  onDelete,
  onArchive,
  noteStatus
}: NoteHeaderProps) {
  const router = useRouter();
  const theme = useTheme();

  const getBackPath = () => {
    if (noteId && mode === 'edit') return `/note/${noteId}`;
    return '/notes';
  };

  return (
    <Paper
      sx={{
        p: 3,
        mb: 3,
        borderRadius: 2,
        background: `linear-gradient(135deg, ${alpha(
          theme.palette.primary.main,
          0.1
        )} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`,
        border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => router.push(getBackPath())}
            sx={{ mb: 1 }}
          >
            {mode === 'edit' ? 'Back to Note' : 'Back to Notes'}
          </Button>
          <Typography variant="h4" fontWeight="bold" color="primary">
            {title}
          </Typography>
          {subTitle && (
            <Typography variant="body2" color="text.secondary">
              {subTitle}
            </Typography>
          )}
        </Box>

        <Stack direction="row" spacing={1}>
          {mode === 'view' && noteId && (
            <>
              <Button
                startIcon={<Edit />}
                onClick={onEdit}
                variant="outlined"
                sx={{ borderRadius: 2 }}
              >
                Edit
              </Button>
              {onArchive && (
                <Button
                  startIcon={noteStatus === 'archived' ? <Unarchive /> : <Archive />}
                  onClick={onArchive}
                  variant="outlined"
                  sx={{ borderRadius: 2 }}
                >
                  {noteStatus === 'archived' ? 'Restore' : 'Archive'}
                </Button>
              )}
              <Button
                startIcon={<Delete />}
                onClick={onDelete}
                variant="outlined"
                color="error"
                sx={{ borderRadius: 2 }}
              >
                Delete
              </Button>
            </>
          )}

          {mode === 'edit' && (
            <>
              <Button
                startIcon={<Cancel />}
                onClick={() => router.push(`/note/${noteId}`)}
                variant="outlined"
                sx={{ borderRadius: 2 }}
              >
                Cancel
              </Button>
              <Button
                startIcon={<Save />}
                onClick={onSave}
                variant="contained"
                disabled={loading}
                sx={{ borderRadius: 2 }}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            </>
          )}

          {mode === 'create' && (
            <>
              <Button
                startIcon={<Cancel />}
                onClick={() => router.push('/notes')}
                variant="outlined"
                sx={{ borderRadius: 2 }}
              >
                Cancel
              </Button>
              <Button
                startIcon={<Save />}
                onClick={onSave}
                variant="contained"
                disabled={loading}
                sx={{ borderRadius: 2 }}
              >
                {loading ? 'Creating...' : 'Create Note'}
              </Button>
            </>
          )}
        </Stack>
      </Box>
    </Paper>
  );
}