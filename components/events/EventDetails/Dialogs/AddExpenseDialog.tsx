import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Stack, MenuItem, Box, IconButton, Typography } from "@mui/material";
// import { ArrowBackIcon } from "@mui/icons-material";
import { SubEvent } from "../../types";
import { expenseCategories } from "../../types";
import { ArrowBack } from "@mui/icons-material";
import { ThemeContext } from "@emotion/react";

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
}

export const AddExpenseDialog: React.FC<AddExpenseDialogProps> = ({
  open,
  isMobile,
  subEvents,
  formData,
  onClose,
  onSubmit,
  onChange,
}) => {
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
        borderBottom: `1px solid ${ThemeContext.Provider.arguments}`
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant={isMobile ? "h6" : "h5"} fontWeight="bold">
            Add New Expense
          </Typography>
          {isMobile && (
            <IconButton onClick={onClose} size="small">
              <ArrowBack />
            </IconButton>
          )}
        </Box>
      </DialogTitle>
      <form onSubmit={onSubmit}>
        <DialogContent sx={{ p: { xs: 2, sm: 3 } }}>
          <Stack spacing={3}>
            <TextField
              label="Description *"
              value={formData.description}
              onChange={(e) => onChange("description", e.target.value)}
              required
              fullWidth
              size={isMobile ? "small" : "medium"}
            />

            <TextField
              label="Amount (₹) *"
              type="number"
              value={formData.amount}
              onChange={(e) => onChange("amount", parseFloat(e.target.value) || 0)}
              required
              fullWidth
              size={isMobile ? "small" : "medium"}
              InputProps={{
                startAdornment: <Typography sx={{ mr: 1 }}>₹</Typography>,
              }}
            />

            <TextField
              select
              label="Category *"
              value={formData.category}
              onChange={(e) => onChange("category", e.target.value)}
              required
              fullWidth
              size={isMobile ? "small" : "medium"}
            >
              {expenseCategories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              label="Sub-Event (Optional)"
              value={formData.subEventId || ""}
              onChange={(e) => onChange("subEventId", e.target.value || undefined)}
              fullWidth
              size={isMobile ? "small" : "medium"}
            >
              <MenuItem value="">None</MenuItem>
              {subEvents.map((subEvent) => (
                <MenuItem key={subEvent._id} value={subEvent._id}>
                  {subEvent.name}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Date"
              type="date"
              value={formData.date}
              onChange={(e) => onChange("date", e.target.value)}
              fullWidth
              size={isMobile ? "small" : "medium"}
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              label="Notes (Optional)"
              value={formData.notes}
              onChange={(e) => onChange("notes", e.target.value)}
              multiline
              rows={2}
              fullWidth
              size={isMobile ? "small" : "medium"}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ 
          p: { xs: 2, sm: 3 },
          borderTop: `1px solid ${ThemeContext.Consumer.arguments}`
        }}>
          {!isMobile && (
            <Button onClick={onClose}>
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
          >
            Add Expense
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};