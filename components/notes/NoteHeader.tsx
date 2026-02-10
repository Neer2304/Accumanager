import { Box, Typography, Stack, alpha, useTheme } from '@mui/material';
import { ArrowBack, Save, Cancel, Edit, Delete, Archive, Unarchive } from '@mui/icons-material';
import { useRouter } from 'next/navigation';

// Import Google-themed components
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

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
  darkMode?: boolean;
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
  noteStatus,
  darkMode = false,
}: NoteHeaderProps) {
  const router = useRouter();
  const theme = useTheme();

  const getBackPath = () => {
    if (noteId && mode === 'edit') return `/note/${noteId}`;
    return '/notes';
  };

  return (
    <Card
      hover
      sx={{
        p: 3,
        mb: 3,
        borderRadius: '16px',
        background: darkMode
          ? `linear-gradient(135deg, ${alpha('#4285f4', 0.1)} 0%, ${alpha('#4285f4', 0.05)} 100%)`
          : `linear-gradient(135deg, ${alpha('#4285f4', 0.08)} 0%, ${alpha('#4285f4', 0.03)} 100%)`,
        border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
        backgroundColor: darkMode ? '#303134' : '#ffffff',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box>
          <Button
            onClick={() => router.push(getBackPath())}
            iconLeft={<ArrowBack />}
            variant="text"
            size="small"
            sx={{
              mb: 1,
              color: darkMode ? '#9aa0a6' : '#5f6368',
              '&:hover': {
                backgroundColor: darkMode ? '#3c4043' : '#f1f3f4',
              },
            }}
          >
            {mode === 'edit' ? 'Back to Note' : 'Back to Notes'}
          </Button>
          <Typography 
            variant="h4" 
            fontWeight="500" 
            sx={{ 
              color: darkMode ? '#e8eaed' : '#202124',
              fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
            }}
          >
            {title}
          </Typography>
          {subTitle && (
            <Typography variant="body2" sx={{ 
              color: darkMode ? '#9aa0a6' : '#5f6368',
              fontSize: '0.875rem',
              mt: 0.5,
            }}>
              {subTitle}
            </Typography>
          )}
        </Box>

        <Stack direction="row" spacing={1}>
          {mode === 'view' && noteId && (
            <>
              <Button
                onClick={onEdit}
                iconLeft={<Edit />}
                variant="outlined"
                size="medium"
                sx={{
                  borderColor: darkMode ? '#3c4043' : '#dadce0',
                  color: darkMode ? '#e8eaed' : '#202124',
                  '&:hover': {
                    borderColor: darkMode ? '#5f6368' : '#5f6368',
                    backgroundColor: darkMode ? '#3c4043' : '#f1f3f4',
                  },
                }}
              >
                Edit
              </Button>
              {onArchive && (
                <Button
                  onClick={onArchive}
                  iconLeft={noteStatus === 'archived' ? <Unarchive /> : <Archive />}
                  variant="outlined"
                  size="medium"
                  sx={{
                    borderColor: darkMode ? '#3c4043' : '#dadce0',
                    color: darkMode ? '#e8eaed' : '#202124',
                    '&:hover': {
                      borderColor: darkMode ? '#5f6368' : '#5f6368',
                      backgroundColor: darkMode ? '#3c4043' : '#f1f3f4',
                    },
                  }}
                >
                  {noteStatus === 'archived' ? 'Restore' : 'Archive'}
                </Button>
              )}
              <Button
                onClick={onDelete}
                iconLeft={<Delete />}
                variant="outlined"
                size="medium"
                sx={{
                  borderColor: darkMode ? '#3c4043' : '#dadce0',
                  color: '#ea4335',
                  '&:hover': {
                    borderColor: '#ea4335',
                    backgroundColor: alpha('#ea4335', 0.1),
                  },
                }}
              >
                Delete
              </Button>
            </>
          )}

          {mode === 'edit' && (
            <>
              <Button
                onClick={() => router.push(`/note/${noteId}`)}
                iconLeft={<Cancel />}
                variant="outlined"
                size="medium"
                sx={{
                  borderColor: darkMode ? '#3c4043' : '#dadce0',
                  color: darkMode ? '#e8eaed' : '#202124',
                  '&:hover': {
                    borderColor: darkMode ? '#5f6368' : '#5f6368',
                    backgroundColor: darkMode ? '#3c4043' : '#f1f3f4',
                  },
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={onSave}
                iconLeft={<Save />}
                variant="contained"
                size="medium"
                disabled={loading}
                sx={{
                  backgroundColor: '#34a853',
                  '&:hover': { backgroundColor: '#2d9248' },
                  '&.Mui-disabled': {
                    backgroundColor: darkMode ? '#3c4043' : '#dadce0',
                    color: darkMode ? '#9aa0a6' : '#5f6368',
                  },
                }}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            </>
          )}

          {mode === 'create' && (
            <>
              <Button
                onClick={() => router.push('/notes')}
                iconLeft={<Cancel />}
                variant="outlined"
                size="medium"
                sx={{
                  borderColor: darkMode ? '#3c4043' : '#dadce0',
                  color: darkMode ? '#e8eaed' : '#202124',
                  '&:hover': {
                    borderColor: darkMode ? '#5f6368' : '#5f6368',
                    backgroundColor: darkMode ? '#3c4043' : '#f1f3f4',
                  },
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={onSave}
                iconLeft={<Save />}
                variant="contained"
                size="medium"
                disabled={loading}
                sx={{
                  backgroundColor: '#34a853',
                  '&:hover': { backgroundColor: '#2d9248' },
                  '&.Mui-disabled': {
                    backgroundColor: darkMode ? '#3c4043' : '#dadce0',
                    color: darkMode ? '#9aa0a6' : '#5f6368',
                  },
                }}
              >
                {loading ? 'Creating...' : 'Create Note'}
              </Button>
            </>
          )}
        </Stack>
      </Box>
    </Card>
  );
}