import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  TextField,
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
  alpha,
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
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';

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
  const darkMode = theme.palette.mode === 'dark';
  
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
          backgroundColor: darkMode ? '#303134' : '#ffffff',
          border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
        }
      }}
    >
      <DialogTitle sx={{ 
        fontSize: isMobile ? '1.25rem' : '1.5rem',
        fontWeight: 600,
        color: darkMode ? '#e8eaed' : '#202124',
        backgroundColor: darkMode ? '#202124' : '#ffffff',
        borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
        px: { xs: 2, sm: 3 },
        py: { xs: 1.5, sm: 2 },
      }}>
        <Box display="flex" alignItems="center" gap={1}>
          <ReceiptIcon sx={{ color: '#4285f4' }} />
          {editingExpense ? 'Edit Expense' : 'Add New Expense'}
        </Box>
      </DialogTitle>

      <DialogContent sx={{ 
        bgcolor: darkMode ? '#303134' : '#ffffff', 
        py: 3,
        px: { xs: 2, sm: 3 },
      }}>
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
              size={isMobile ? "small" : "medium"}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  backgroundColor: darkMode ? '#202124' : '#ffffff',
                  borderColor: darkMode ? '#3c4043' : '#dadce0',
                  color: darkMode ? '#e8eaed' : '#202124',
                },
                '& .MuiInputLabel-root': {
                  color: darkMode ? '#9aa0a6' : '#5f6368',
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
                size={isMobile ? "small" : "medium"}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    backgroundColor: darkMode ? '#202124' : '#ffffff',
                    borderColor: darkMode ? '#3c4043' : '#dadce0',
                    color: darkMode ? '#e8eaed' : '#202124',
                  },
                  '& .MuiInputLabel-root': {
                    color: darkMode ? '#9aa0a6' : '#5f6368',
                  },
                }}
              />

              <FormControl fullWidth size={isMobile ? "small" : "medium"}>
                <InputLabel sx={{ 
                  color: darkMode ? '#9aa0a6' : '#5f6368',
                }}>
                  Category
                </InputLabel>
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
                    backgroundColor: darkMode ? '#202124' : '#ffffff',
                    borderColor: darkMode ? '#3c4043' : '#dadce0',
                    color: darkMode ? '#e8eaed' : '#202124',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: darkMode ? '#3c4043' : '#dadce0',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: darkMode ? '#5f6368' : '#bdc1c6',
                    },
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
                size={isMobile ? "small" : "medium"}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    backgroundColor: darkMode ? '#202124' : '#ffffff',
                    borderColor: darkMode ? '#3c4043' : '#dadce0',
                    color: darkMode ? '#e8eaed' : '#202124',
                  },
                  '& .MuiInputLabel-root': {
                    color: darkMode ? '#9aa0a6' : '#5f6368',
                  },
                }}
              />

              <FormControl fullWidth size={isMobile ? "small" : "medium"}>
                <InputLabel sx={{ 
                  color: darkMode ? '#9aa0a6' : '#5f6368',
                }}>
                  Payment Method
                </InputLabel>
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
                    backgroundColor: darkMode ? '#202124' : '#ffffff',
                    borderColor: darkMode ? '#3c4043' : '#dadce0',
                    color: darkMode ? '#e8eaed' : '#202124',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: darkMode ? '#3c4043' : '#dadce0',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: darkMode ? '#5f6368' : '#bdc1c6',
                    },
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
                borderColor: formData.isRecurring ? '#4285f4' : darkMode ? '#3c4043' : '#dadce0',
                transition: 'all 0.3s',
                backgroundColor: darkMode ? '#202124' : '#ffffff',
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <CalendarIcon
                      sx={{ color: formData.isRecurring ? '#4285f4' : darkMode ? '#9aa0a6' : '#5f6368' }}
                    />
                    <Typography variant="h6" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                      Recurring Expense
                    </Typography>
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
                        sx={{
                          color: '#4285f4',
                          '&.Mui-checked': {
                            color: '#4285f4',
                          },
                        }}
                      />
                    }
                    label={
                      <Typography sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                        This is a recurring expense
                      </Typography>
                    }
                  />

                  {formData.isRecurring && (
                    <FormControl fullWidth size={isMobile ? "small" : "medium"}>
                      <InputLabel sx={{ 
                        color: darkMode ? '#9aa0a6' : '#5f6368',
                      }}>
                        Recurrence Pattern
                      </InputLabel>
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
                          backgroundColor: darkMode ? '#202124' : '#ffffff',
                          borderColor: darkMode ? '#3c4043' : '#dadce0',
                          color: darkMode ? '#e8eaed' : '#202124',
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: darkMode ? '#3c4043' : '#dadce0',
                          },
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: darkMode ? '#5f6368' : '#bdc1c6',
                          },
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
                  ? '#4285f4'
                  : darkMode ? '#3c4043' : '#dadce0',
                transition: 'all 0.3s',
                backgroundColor: darkMode ? '#202124' : '#ffffff',
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <BusinessIcon
                      sx={{ color: formData.isBusinessExpense ? '#4285f4' : darkMode ? '#9aa0a6' : '#5f6368' }}
                    />
                    <Typography variant="h6" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                      Business Expense Details
                    </Typography>
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
                        sx={{
                          color: '#4285f4',
                          '&.Mui-checked': {
                            color: '#4285f4',
                          },
                        }}
                      />
                    }
                    label={
                      <Typography sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                        This is a business expense
                      </Typography>
                    }
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
                        size={isMobile ? "small" : "medium"}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            backgroundColor: darkMode ? '#202124' : '#ffffff',
                            borderColor: darkMode ? '#3c4043' : '#dadce0',
                            color: darkMode ? '#e8eaed' : '#202124',
                          },
                          '& .MuiInputLabel-root': {
                            color: darkMode ? '#9aa0a6' : '#5f6368',
                          },
                        }}
                      />

                      <Typography variant="subtitle2" gutterBottom sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
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
                        size={isMobile ? "small" : "medium"}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            backgroundColor: darkMode ? '#202124' : '#ffffff',
                            borderColor: darkMode ? '#3c4043' : '#dadce0',
                            color: darkMode ? '#e8eaed' : '#202124',
                          },
                          '& .MuiInputLabel-root': {
                            color: darkMode ? '#9aa0a6' : '#5f6368',
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
                        size={isMobile ? "small" : "medium"}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            backgroundColor: darkMode ? '#202124' : '#ffffff',
                            borderColor: darkMode ? '#3c4043' : '#dadce0',
                            color: darkMode ? '#e8eaed' : '#202124',
                          },
                          '& .MuiInputLabel-root': {
                            color: darkMode ? '#9aa0a6' : '#5f6368',
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
              size={isMobile ? "small" : "medium"}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  backgroundColor: darkMode ? '#202124' : '#ffffff',
                  borderColor: darkMode ? '#3c4043' : '#dadce0',
                  color: darkMode ? '#e8eaed' : '#202124',
                },
                '& .MuiInputLabel-root': {
                  color: darkMode ? '#9aa0a6' : '#5f6368',
                },
              }}
            />

            {/* Tags */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography variant="subtitle2" gutterBottom sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
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
                      backgroundColor: darkMode ? '#202124' : '#ffffff',
                      borderColor: darkMode ? '#3c4043' : '#dadce0',
                      color: darkMode ? '#e8eaed' : '#202124',
                    },
                    '& .MuiInputLabel-root': {
                      color: darkMode ? '#9aa0a6' : '#5f6368',
                    },
                  }}
                />
                <Button
                  onClick={addTag}
                  variant="outlined"
                  size="small"
                  sx={{ 
                    borderRadius: 2,
                    borderColor: darkMode ? '#3c4043' : '#dadce0',
                    color: darkMode ? '#e8eaed' : '#202124',
                    '&:hover': {
                      borderColor: darkMode ? '#5f6368' : '#bdc1c6',
                      backgroundColor: darkMode ? '#3c4043' : '#f8f9fa',
                    }
                  }}
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
                    sx={{ 
                      borderRadius: 1,
                      backgroundColor: darkMode ? '#3c4043' : '#f8f9fa',
                      borderColor: darkMode ? '#5f6368' : '#dadce0',
                      color: darkMode ? '#e8eaed' : '#202124',
                    }}
                  />
                ))}
              </Box>
            </Box>
          </Box>

          <DialogActions sx={{ mt: 3, px: 0 }}>
            <Button
              onClick={onClose}
              disabled={loading}
              variant="outlined"
              size={isMobile ? "small" : "medium"}
              sx={{
                borderColor: darkMode ? '#3c4043' : '#dadce0',
                color: darkMode ? '#e8eaed' : '#202124',
                '&:hover': {
                  borderColor: darkMode ? '#5f6368' : '#bdc1c6',
                  backgroundColor: darkMode ? '#3c4043' : '#f8f9fa',
                }
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={loading || !formData.title || !formData.amount}
              iconLeft={
                loading ? <CircularProgress size={16} /> : <ReceiptIcon />
              }
              size={isMobile ? "small" : "medium"}
              sx={{
                borderRadius: 2,
                px: 4,
                backgroundColor: '#4285f4',
                '&:hover': {
                  backgroundColor: '#3367d6',
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