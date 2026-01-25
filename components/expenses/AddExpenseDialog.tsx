import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  TextField,
  Button,
  Chip,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  FormControlLabel,
  Switch,
  useTheme,
  useMediaQuery,
  CircularProgress,
} from '@mui/material';
import {
  Receipt as ReceiptIcon,
  CalendarToday as CalendarIcon,
  Business as BusinessIcon,
  AttachMoney as MoneyIcon,
} from '@mui/icons-material';
import { Expense } from '@/types/expense';
import { expenseCategories, paymentMethods } from '@/data/expenseData';
import { getCategoryIcon } from './icons/CategoryIcons';
import { getPaymentMethodIcon } from './icons/PaymentMethodIcons';

interface AddExpenseDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (expense: Expense) => Promise<void>;
  editingExpense?: Expense | null;
}

const AddExpenseDialog: React.FC<AddExpenseDialogProps> = ({
  open,
  onClose,
  onSave,
  editingExpense,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [formData, setFormData] = useState<Expense>({
    title: '',
    amount: 0,
    currency: 'INR',
    category: 'other',
    paymentMethod: 'cash',
    date: new Date().toISOString().split('T')[0],
    description: '',
    isBusinessExpense: false,
    gstAmount: 0,
    vendor: { name: '', gstin: '', contact: '' },
    tags: [],
    isRecurring: false,
    recurrence: 'monthly',
    status: 'pending',
  });

  const [tagInput, setTagInput] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editingExpense) {
      console.log('Editing expense:', editingExpense);
      setFormData({
        ...editingExpense,
        date: editingExpense.date
          ? editingExpense.date.split('T')[0]
          : new Date().toISOString().split('T')[0],
        recurrence:
          editingExpense.recurrence ||
          (editingExpense.isRecurring ? 'monthly' : 'monthly'),
        vendor: editingExpense.vendor || { name: '', gstin: '', contact: '' },
        tags: editingExpense.tags || [],
      });
    } else {
      setFormData({
        title: '',
        amount: 0,
        currency: 'INR',
        category: 'other',
        paymentMethod: 'cash',
        date: new Date().toISOString().split('T')[0],
        description: '',
        isBusinessExpense: false,
        gstAmount: 0,
        vendor: { name: '', gstin: '', contact: '' },
        tags: [],
        isRecurring: false,
        recurrence: 'monthly',
        status: 'pending',
      });
    }
  }, [editingExpense, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    console.log('Submitting form data:', formData);
    
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Error saving expense:', error);
      alert('Failed to save expense. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      fullScreen={isMobile}
      PaperProps={{
        sx: {
          borderRadius: isMobile ? 0 : 3,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        },
      }}
    >
      <DialogTitle sx={{ color: 'white' }}>
        <Box display="flex" alignItems="center" gap={1}>
          <ReceiptIcon />
          {editingExpense ? 'Edit Expense' : 'Add New Expense'}
        </Box>
      </DialogTitle>

      <DialogContent sx={{ bgcolor: 'background.paper', py: 3 }}>
        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Basic Information */}
            <TextField
              fullWidth
              label="Expense Title"
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              required
              placeholder="Lunch, Uber ride, Groceries..."
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  bgcolor: 'background.paper',
                },
              }}
            />

            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 2,
              }}
            >
              <TextField
                fullWidth
                label="Amount"
                type="number"
                value={formData.amount}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    amount: parseFloat(e.target.value) || 0,
                  }))
                }
                required
                InputProps={{
                  startAdornment: (
                    <MoneyIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  ),
                }}
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    bgcolor: 'background.paper',
                  },
                }}
              />

              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={formData.category}
                  label="Category"
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      category: e.target.value,
                    }))
                  }
                  sx={{
                    borderRadius: 2,
                    bgcolor: 'background.paper',
                  }}
                >
                  {expenseCategories.map((category) => (
                    <MenuItem key={category.value} value={category.value}>
                      <Box display="flex" alignItems="center" gap={1}>
                        <span>{getCategoryIcon(category.value)}</span>
                        {category.label}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 2,
              }}
            >
              <TextField
                fullWidth
                label="Date"
                type="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, date: e.target.value }))
                }
                InputLabelProps={{ shrink: true }}
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    bgcolor: 'background.paper',
                  },
                }}
              />

              <FormControl fullWidth>
                <InputLabel>Payment Method</InputLabel>
                <Select
                  value={formData.paymentMethod}
                  label="Payment Method"
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      paymentMethod: e.target.value,
                    }))
                  }
                  sx={{
                    borderRadius: 2,
                    bgcolor: 'background.paper',
                  }}
                >
                  {paymentMethods.map((method) => {
                    const PaymentIcon = getPaymentMethodIcon(method.value);
                    return (
                      <MenuItem key={method.value} value={method.value}>
                        <Box display="flex" alignItems="center" gap={1}>
                          <PaymentIcon />
                          {method.label}
                        </Box>
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </Box>

            {/* Recurring Expense Section */}
            <Card
              variant="outlined"
              sx={{
                borderRadius: 2,
                borderColor: formData.isRecurring ? 'primary.main' : 'divider',
                transition: 'all 0.3s',
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <CalendarIcon
                      color={formData.isRecurring ? 'primary' : 'action'}
                    />
                    <Typography variant="h6">Recurring Expense</Typography>
                  </Box>

                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.isRecurring}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            isRecurring: e.target.checked,
                            recurrence: e.target.checked
                              ? 'monthly'
                              : undefined,
                          }))
                        }
                        color="primary"
                      />
                    }
                    label="This is a recurring expense"
                  />

                  {formData.isRecurring && (
                    <FormControl fullWidth>
                      <InputLabel>Recurrence Pattern</InputLabel>
                      <Select
                        value={formData.recurrence || 'monthly'}
                        label="Recurrence Pattern"
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            recurrence: e.target.value,
                          }))
                        }
                        sx={{
                          borderRadius: 2,
                          bgcolor: 'background.paper',
                        }}
                      >
                        <MenuItem value="daily">Daily</MenuItem>
                        <MenuItem value="weekly">Weekly</MenuItem>
                        <MenuItem value="monthly">Monthly</MenuItem>
                        <MenuItem value="yearly">Yearly</MenuItem>
                      </Select>
                    </FormControl>
                  )}
                </Box>
              </CardContent>
            </Card>

            {/* Business Expense Section */}
            <Card
              variant="outlined"
              sx={{
                borderRadius: 2,
                borderColor: formData.isBusinessExpense
                  ? 'primary.main'
                  : 'divider',
                transition: 'all 0.3s',
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <BusinessIcon
                      color={formData.isBusinessExpense ? 'primary' : 'action'}
                    />
                    <Typography variant="h6">Business Expense Details</Typography>
                  </Box>

                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.isBusinessExpense}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            isBusinessExpense: e.target.checked,
                          }))
                        }
                        color="primary"
                      />
                    }
                    label="This is a business expense"
                  />

                  {formData.isBusinessExpense && (
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                        mt: 2,
                      }}
                    >
                      <TextField
                        fullWidth
                        label="GST Amount"
                        type="number"
                        value={formData.gstAmount}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            gstAmount: parseFloat(e.target.value) || 0,
                          }))
                        }
                        InputProps={{
                          startAdornment: (
                            <MoneyIcon
                              sx={{ mr: 1, color: 'text.secondary' }}
                            />
                          ),
                        }}
                        variant="outlined"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            bgcolor: 'background.paper',
                          },
                        }}
                      />

                      <Typography variant="subtitle2" gutterBottom>
                        Vendor Information
                      </Typography>

                      <TextField
                        fullWidth
                        label="Vendor Name"
                        value={formData.vendor?.name || ''}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            vendor: { ...prev.vendor!, name: e.target.value },
                          }))
                        }
                        variant="outlined"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            bgcolor: 'background.paper',
                          },
                        }}
                      />

                      <TextField
                        fullWidth
                        label="Vendor GSTIN"
                        value={formData.vendor?.gstin || ''}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            vendor: { ...prev.vendor!, gstin: e.target.value },
                          }))
                        }
                        placeholder="07AABCU9603R1ZM"
                        variant="outlined"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            bgcolor: 'background.paper',
                          },
                        }}
                      />
                    </Box>
                  )}
                </Box>
              </CardContent>
            </Card>

            {/* Additional Details */}
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={3}
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="Additional details about this expense..."
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  bgcolor: 'background.paper',
                },
              }}
            />

            {/* Tags */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography variant="subtitle2" gutterBottom>
                Tags
              </Typography>
              <Box
                sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 1 }}
              >
                <TextField
                  size="small"
                  placeholder="Add a tag..."
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  sx={{
                    flex: 1,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    },
                  }}
                />
                <Button
                  onClick={addTag}
                  variant="outlined"
                  size="small"
                  sx={{ borderRadius: 2 }}
                >
                  Add
                </Button>
              </Box>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {formData.tags.map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    size="small"
                    onDelete={() => removeTag(tag)}
                    sx={{ borderRadius: 1 }}
                  />
                ))}
              </Box>
            </Box>
          </Box>

          <DialogActions sx={{ mt: 3, px: 0 }}>
            <Button
              onClick={onClose}
              disabled={loading}
              sx={{ borderRadius: 2 }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={loading || !formData.title || !formData.amount}
              startIcon={
                loading ? <CircularProgress size={16} /> : <ReceiptIcon />
              }
              sx={{
                borderRadius: 2,
                px: 4,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                '&:hover': {
                  background:
                    'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                },
              }}
            >
              {loading
                ? 'Saving...'
                : editingExpense
                  ? 'Update Expense'
                  : 'Add Expense'}
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddExpenseDialog;