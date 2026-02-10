import { 
  Dialog, DialogTitle, DialogContent, DialogActions, Button, 
  Stack, Box, IconButton, Typography 
} from "@mui/material";
import { ArrowBack as ArrowBackIcon } from "@mui/icons-material";

// Import Google-themed components
import { Input } from '@/components/ui/Input';

interface AddSubEventDialogProps {
  open: boolean;
  isMobile: boolean;
  formData: {
    name: string;
    description: string;
    budget: number;
  };
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onChange: (field: string, value: any) => void;
  loading?: boolean;
  darkMode?: boolean;
}

export const AddSubEventDialog: React.FC<AddSubEventDialogProps> = ({
  open,
  isMobile,
  formData,
  onClose,
  onSubmit,
  onChange,
  loading = false,
  darkMode = false,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      fullScreen={isMobile}
      PaperProps={{
        sx: {
          backgroundColor: darkMode ? '#303134' : '#ffffff',
          borderRadius: isMobile ? 0 : '16px',
          border: darkMode ? '1px solid #3c4043' : '1px solid #dadce0',
        }
      }}
    >
      <DialogTitle sx={{ 
        p: { xs: 2, sm: 3 },
        borderBottom: darkMode ? '1px solid #3c4043' : '1px solid #dadce0'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography 
            variant={isMobile ? "h6" : "h5"} 
            fontWeight="bold"
            sx={{ color: darkMode ? '#e8eaed' : '#202124' }}
          >
            Add New Sub-Event
          </Typography>
          {isMobile && (
            <IconButton 
              onClick={onClose} 
              size="small"
              sx={{ color: darkMode ? '#e8eaed' : '#202124' }}
            >
              <ArrowBackIcon />
            </IconButton>
          )}
        </Box>
      </DialogTitle>
      
      <form onSubmit={onSubmit}>
        <DialogContent sx={{ p: { xs: 2, sm: 3 } }}>
          <Stack spacing={3}>
            <Input
              label="Sub-Event Name *"
              value={formData.name}
              onChange={(e) => onChange("name", e.target.value)}
              required
              fullWidth
              size="small"
              disabled={loading}
              placeholder="e.g., Wedding Reception, Venue Booking"
              sx={{ 
                '& .MuiOutlinedInput-root': {
                  backgroundColor: darkMode ? '#202124' : '#ffffff',
                  borderColor: darkMode ? '#3c4043' : '#dadce0',
                },
                '& .MuiInputLabel-root': {
                  color: darkMode ? '#9aa0a6' : '#5f6368',
                }
              }}
            />

            <Input
              label="Description"
              value={formData.description}
              onChange={(e) => onChange("description", e.target.value)}
              multiline
              rows={2}
              fullWidth
              size="small"
              disabled={loading}
              placeholder="Description of the sub-event"
              sx={{ 
                '& .MuiOutlinedInput-root': {
                  backgroundColor: darkMode ? '#202124' : '#ffffff',
                  borderColor: darkMode ? '#3c4043' : '#dadce0',
                },
                '& .MuiInputLabel-root': {
                  color: darkMode ? '#9aa0a6' : '#5f6368',
                }
              }}
            />

            <Input
              label="Budget (₹)"
              type="number"
              value={formData.budget}
              onChange={(e) => onChange("budget", parseFloat(e.target.value) || 0)}
              fullWidth
              size="small"
              disabled={loading}
              sx={{ 
                '& .MuiOutlinedInput-root': {
                  backgroundColor: darkMode ? '#202124' : '#ffffff',
                  borderColor: darkMode ? '#3c4043' : '#dadce0',
                },
                '& .MuiInputLabel-root': {
                  color: darkMode ? '#9aa0a6' : '#5f6368',
                }
              }}
            />
          </Stack>
        </DialogContent>
        
        <DialogActions sx={{ 
          p: { xs: 2, sm: 3 },
          borderTop: darkMode ? '1px solid #3c4043' : '1px solid #dadce0'
        }}>
          {!isMobile && (
            <Button 
              onClick={onClose} 
              disabled={loading}
              sx={{ 
                color: darkMode ? '#e8eaed' : '#202124',
                borderColor: darkMode ? '#3c4043' : '#dadce0',
                '&:hover': {
                  borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                  backgroundColor: darkMode ? 'rgba(138, 180, 248, 0.08)' : 'rgba(26, 115, 232, 0.04)',
                }
              }}
            >
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            variant="contained"
            fullWidth={isMobile}
            size={isMobile ? "large" : "medium"}
            disabled={loading || !formData.name}
            sx={{ 
              backgroundColor: '#4285f4',
              '&:hover': { backgroundColor: '#3367d6' },
              '&.Mui-disabled': {
                backgroundColor: darkMode ? '#3c4043' : '#f0f0f0',
                color: darkMode ? '#9aa0a6' : '#a0a0a0',
              }
            }}
          >
            {loading ? "Adding..." : "Add Sub-Event"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};