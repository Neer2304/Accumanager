import { 
  Dialog, DialogTitle, DialogContent, DialogActions, Button, 
  Stack, Box, IconButton, Typography 
} from "@mui/material";
import { SubEvent } from "../../types";
import { expenseCategories } from "../../types";
import { ArrowBack } from "@mui/icons-material";

// Import Google-themed components
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';

interface AddExpenseDialogProps {
  open: boolean;
  isMobile: boolean;
  subEvents: SubEvent[];
  formData: {
    description: string;
    amount: number;
    category: string;
    date: string;
    subEventId?: string;
    notes: string;
  };
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onChange: (field: string, value: any) => void;
  darkMode?: boolean;
}

export const AddExpenseDialog: React.FC<AddExpenseDialogProps> = ({
  open,
  isMobile,
  subEvents,
  formData,
  onClose,
  onSubmit,
  onChange,
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
            Add New Expense
          </Typography>
          {isMobile && (
            <IconButton 
              onClick={onClose} 
              size="small"
              sx={{ color: darkMode ? '#e8eaed' : '#202124' }}
            >
              <ArrowBack />
            </IconButton>
          )}
        </Box>
      </DialogTitle>
      <form onSubmit={onSubmit}>
        <DialogContent sx={{ p: { xs: 2, sm: 3 } }}>
          <Stack spacing={3}>
            <Input
              label="Description *"
              value={formData.description}
              onChange={(e) => onChange("description", e.target.value)}
              required
              fullWidth
              size="small"
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
              label="Amount (₹) *"
              type="number"
              value={formData.amount}
              onChange={(e) => onChange("amount", parseFloat(e.target.value) || 0)}
              required
              fullWidth
              size="small"
              // startAdornment={<Typography sx={{ mr: 1, color: darkMode ? '#9aa0a6' : '#5f6368' }}>₹</Typography>}
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

            <Select
              label="Category *"
              value={formData.category}
              onChange={(e: any) => onChange("category", e.target.value)}
              required
              fullWidth
              size="small"
              options={expenseCategories.map(category => ({
                value: category,
                label: category
              }))}
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

            <Select
              label="Sub-Event (Optional)"
              value={formData.subEventId || ""}
              onChange={(e: any) => onChange("subEventId", e.target.value || undefined)}
              fullWidth
              size="small"
              options={[
                { value: "", label: "None" },
                ...subEvents.map(subEvent => ({
                  value: subEvent._id,
                  label: subEvent.name
                }))
              ]}
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
              label="Date"
              type="date"
              value={formData.date}
              onChange={(e) => onChange("date", e.target.value)}
              fullWidth
              size="small"
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
              label="Notes (Optional)"
              value={formData.notes}
              onChange={(e) => onChange("notes", e.target.value)}
              multiline
              rows={2}
              fullWidth
              size="small"
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
            disabled={
              !formData.description ||
              !formData.amount ||
              !formData.category
            }
            sx={{ 
              backgroundColor: '#34a853',
              '&:hover': { backgroundColor: '#2d9248' },
              '&.Mui-disabled': {
                backgroundColor: darkMode ? '#3c4043' : '#f0f0f0',
                color: darkMode ? '#9aa0a6' : '#a0a0a0',
              }
            }}
          >
            Add Expense
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};