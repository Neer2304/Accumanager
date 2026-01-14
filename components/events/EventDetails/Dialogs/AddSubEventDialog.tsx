import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  TextField, 
  Stack, 
  Box, 
  IconButton,
  Typography,
} from "@mui/material";
import { ArrowBack as ArrowBackIcon } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";

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
}

export const AddSubEventDialog: React.FC<AddSubEventDialogProps> = ({
  open,
  isMobile,
  formData,
  onClose,
  onSubmit,
  onChange,
  loading = false,
}) => {
  const theme = useTheme();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      fullScreen={isMobile}
    >
      <DialogTitle sx={{ 
        p: { xs: 2, sm: 3 },
        borderBottom: `1px solid ${theme.palette.divider}`
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant={isMobile ? "h6" : "h5"} fontWeight="bold">
            Add New Sub-Event
          </Typography>
          {isMobile && (
            <IconButton onClick={onClose} size="small">
              <ArrowBackIcon />
            </IconButton>
          )}
        </Box>
      </DialogTitle>
      
      <form onSubmit={onSubmit}>
        <DialogContent sx={{ p: { xs: 2, sm: 3 } }}>
          <Stack spacing={3}>
            <TextField
              label="Sub-Event Name *"
              value={formData.name}
              onChange={(e) => onChange("name", e.target.value)}
              required
              fullWidth
              size={isMobile ? "small" : "medium"}
              disabled={loading}
              placeholder="e.g., Wedding Reception, Venue Booking"
            />

            <TextField
              label="Description"
              value={formData.description}
              onChange={(e) => onChange("description", e.target.value)}
              multiline
              rows={2}
              fullWidth
              size={isMobile ? "small" : "medium"}
              disabled={loading}
              placeholder="Description of the sub-event"
            />

            <TextField
              label="Budget (₹)"
              type="number"
              value={formData.budget}
              onChange={(e) => onChange("budget", parseFloat(e.target.value) || 0)}
              fullWidth
              size={isMobile ? "small" : "medium"}
              disabled={loading}
              InputProps={{
                startAdornment: <Typography sx={{ mr: 1, color: 'text.secondary' }}>₹</Typography>,
              }}
            />
          </Stack>
        </DialogContent>
        
        <DialogActions sx={{ 
          p: { xs: 2, sm: 3 },
          borderTop: `1px solid ${theme.palette.divider}`
        }}>
          {!isMobile && (
            <Button onClick={onClose} disabled={loading}>
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            variant="contained"
            fullWidth={isMobile}
            size={isMobile ? "large" : "medium"}
            disabled={loading || !formData.name}
          >
            {loading ? "Adding..." : "Add Sub-Event"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};