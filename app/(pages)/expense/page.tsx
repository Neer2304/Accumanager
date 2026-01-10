"use client";

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Stack,
  Paper,
  IconButton,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Alert,
  CircularProgress,
  Tooltip,
  Fab,
  Badge,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  FormControlLabel,
  Switch,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Add as AddIcon,
  Receipt as ReceiptIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Business as BusinessIcon,
  Person as PersonIcon,
  TrendingUp as TrendingUpIcon,
  Category as CategoryIcon,
  CalendarToday as CalendarIcon,
  AttachMoney as MoneyIcon,
  CreditCard as CreditCardIcon,
  AccountBalanceWallet as WalletIcon,
  Savings as SavingsIcon,
  LocalAtm as CashIcon,
  PhoneAndroid as UpiIcon,
  Analytics as AnalyticsIcon,
  CloudOff as CloudOffIcon,
  CloudQueue as CloudQueueIcon,
  Sync as SyncIcon,
  FilterList as FilterIcon,
  Download as DownloadIcon,
  Wifi as WifiIcon,
  WifiOff as WifiOffIcon,
} from '@mui/icons-material';
import { MainLayout } from '@/components/Layout/MainLayout';
import { offlineStorage } from '@/utils/offlineStorage';

// Types
interface Expense {
  _id?: string;
  id?: string;
  title: string;
  amount: number;
  currency: string;
  category: string;
  paymentMethod: string;
  date: string;
  description: string;
  isBusinessExpense: boolean;
  gstAmount: number;
  vendor?: {
    name: string;
    gstin: string;
    contact: string;
  };
  receipt?: string;
  tags: string[];
  isRecurring: boolean;
  recurrence?: string | null;
  status: string;
  isLocal?: boolean;
  isSynced?: boolean;
  syncAttempts?: number;
  createdAt?: string;
  updatedAt?: string;
}

interface ExpenseStats {
  categoryStats: Array<{
    _id: string;
    totalAmount: number;
    count: number;
    averageAmount: number;
  }>;
  monthlyTrend: Array<{
    _id: { year: number; month: number };
    totalAmount: number;
    businessExpenses: number;
    personalExpenses: number;
    count: number;
  }>;
  paymentStats: Array<{
    _id: string;
    totalAmount: number;
    count: number;
  }>;
  period: { year: number; month: number };
}

// Category configuration
const expenseCategories = [
  { value: 'food', label: 'Food & Dining', icon: '🍕', color: '#ff6b6b' },
  { value: 'transport', label: 'Transport', icon: '🚗', color: '#4ecdc4' },
  { value: 'entertainment', label: 'Entertainment', icon: '🎬', color: '#45b7d1' },
  { value: 'shopping', label: 'Shopping', icon: '🛍️', color: '#96ceb4' },
  { value: 'bills', label: 'Bills & Utilities', icon: '📄', color: '#feca57' },
  { value: 'healthcare', label: 'Healthcare', icon: '🏥', color: '#ff9ff3' },
  { value: 'education', label: 'Education', icon: '📚', color: '#54a0ff' },
  { value: 'travel', label: 'Travel', icon: '✈️', color: '#5f27cd' },
  { value: 'business', label: 'Business', icon: '💼', color: '#00d2d3' },
  { value: 'personal', label: 'Personal', icon: '👤', color: '#ff9f43' },
  { value: 'other', label: 'Other', icon: '📦', color: '#8395a7' },
];

const paymentMethods = [
  { value: 'cash', label: 'Cash', icon: <CashIcon /> },
  { value: 'card', label: 'Credit/Debit Card', icon: <CreditCardIcon /> },
  { value: 'upi', label: 'UPI', icon: <UpiIcon /> },
  { value: 'bank-transfer', label: 'Bank Transfer', icon: <WalletIcon /> },
  { value: 'digital-wallet', label: 'Digital Wallet', icon: <SavingsIcon /> },
];

// Add Expense Dialog Component
function AddExpenseDialog({ open, onClose, onSave, editingExpense }: {
  open: boolean;
  onClose: () => void;
  onSave: (expense: Expense) => Promise<void>;
  editingExpense?: Expense | null;
}) {
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
    status: 'pending'
  });

  const [tagInput, setTagInput] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editingExpense) {
      console.log('Editing expense:', editingExpense);
      setFormData({
        ...editingExpense,
        date: editingExpense.date ? editingExpense.date.split('T')[0] : new Date().toISOString().split('T')[0],
        recurrence: editingExpense.recurrence || (editingExpense.isRecurring ? 'monthly' : 'monthly'),
        vendor: editingExpense.vendor || { name: '', gstin: '', contact: '' },
        tags: editingExpense.tags || []
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
        status: 'pending'
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
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
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
        }
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
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              required
              placeholder="Lunch, Uber ride, Groceries..."
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  bgcolor: 'background.paper'
                }
              }}
            />

            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
              <TextField
                fullWidth
                label="Amount"
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData(prev => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))}
                required
                InputProps={{
                  startAdornment: <MoneyIcon sx={{ mr: 1, color: 'text.secondary' }} />
                }}
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    bgcolor: 'background.paper'
                  }
                }}
              />

              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={formData.category}
                  label="Category"
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  sx={{
                    borderRadius: 2,
                    bgcolor: 'background.paper'
                  }}
                >
                  {expenseCategories.map(category => (
                    <MenuItem key={category.value} value={category.value}>
                      <Box display="flex" alignItems="center" gap={1}>
                        <span>{category.icon}</span>
                        {category.label}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
              <TextField
                fullWidth
                label="Date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                InputLabelProps={{ shrink: true }}
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    bgcolor: 'background.paper'
                  }
                }}
              />

              <FormControl fullWidth>
                <InputLabel>Payment Method</InputLabel>
                <Select
                  value={formData.paymentMethod}
                  label="Payment Method"
                  onChange={(e) => setFormData(prev => ({ ...prev, paymentMethod: e.target.value }))}
                  sx={{
                    borderRadius: 2,
                    bgcolor: 'background.paper'
                  }}
                >
                  {paymentMethods.map(method => (
                    <MenuItem key={method.value} value={method.value}>
                      <Box display="flex" alignItems="center" gap={1}>
                        {method.icon}
                        {method.label}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            {/* Recurring Expense Section */}
            <Card 
              variant="outlined" 
              sx={{ 
                borderRadius: 2,
                borderColor: formData.isRecurring ? 'primary.main' : 'divider',
                transition: 'all 0.3s'
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <CalendarIcon color={formData.isRecurring ? "primary" : "action"} />
                    <Typography variant="h6">Recurring Expense</Typography>
                  </Box>
                  
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.isRecurring}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          isRecurring: e.target.checked,
                          recurrence: e.target.checked ? 'monthly' : undefined
                        }))}
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
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          recurrence: e.target.value 
                        }))}
                        sx={{
                          borderRadius: 2,
                          bgcolor: 'background.paper'
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
                borderColor: formData.isBusinessExpense ? 'primary.main' : 'divider',
                transition: 'all 0.3s'
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <BusinessIcon color={formData.isBusinessExpense ? "primary" : "action"} />
                    <Typography variant="h6">Business Expense Details</Typography>
                  </Box>
                  
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.isBusinessExpense}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          isBusinessExpense: e.target.checked 
                        }))}
                        color="primary"
                      />
                    }
                    label="This is a business expense"
                  />

                  {formData.isBusinessExpense && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                      <TextField
                        fullWidth
                        label="GST Amount"
                        type="number"
                        value={formData.gstAmount}
                        onChange={(e) => setFormData(prev => ({ ...prev, gstAmount: parseFloat(e.target.value) || 0 }))}
                        InputProps={{
                          startAdornment: <MoneyIcon sx={{ mr: 1, color: 'text.secondary' }} />
                        }}
                        variant="outlined"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            bgcolor: 'background.paper'
                          }
                        }}
                      />

                      <Typography variant="subtitle2" gutterBottom>
                        Vendor Information
                      </Typography>

                      <TextField
                        fullWidth
                        label="Vendor Name"
                        value={formData.vendor?.name || ''}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          vendor: { ...prev.vendor!, name: e.target.value }
                        }))}
                        variant="outlined"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            bgcolor: 'background.paper'
                          }
                        }}
                      />

                      <TextField
                        fullWidth
                        label="Vendor GSTIN"
                        value={formData.vendor?.gstin || ''}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          vendor: { ...prev.vendor!, gstin: e.target.value }
                        }))}
                        placeholder="07AABCU9603R1ZM"
                        variant="outlined"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            bgcolor: 'background.paper'
                          }
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
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Additional details about this expense..."
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  bgcolor: 'background.paper'
                }
              }}
            />

            {/* Tags */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography variant="subtitle2" gutterBottom>
                Tags
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 1 }}>
                <TextField
                  size="small"
                  placeholder="Add a tag..."
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  sx={{
                    flex: 1,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    }
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
                {formData.tags.map(tag => (
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
              startIcon={loading ? <CircularProgress size={16} /> : <ReceiptIcon />}
              sx={{ 
                borderRadius: 2,
                px: 4,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                }
              }}
            >
              {loading ? 'Saving...' : editingExpense ? 'Update Expense' : 'Add Expense'}
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// Network Status Indicator Component
function NetworkStatusIndicator() {
  const [isOnline, setIsOnline] = useState(true);
  const [syncStatus, setSyncStatus] = useState<any>(null);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const checkSyncStatus = async () => {
      const status = await offlineStorage.getSyncStatus();
      setSyncStatus(status);
    };

    checkSyncStatus();
    const interval = setInterval(checkSyncStatus, 10000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, []);

  const handleManualSync = async () => {
    setSyncing(true);
    try {
      await offlineStorage.processSyncQueue();
      const status = await offlineStorage.getSyncStatus();
      setSyncStatus(status);
    } finally {
      setSyncing(false);
    }
  };

  const pendingCount = syncStatus?.pendingSyncCount || 0;
  const isSyncing = syncing || (syncStatus?.isSyncing === true);

  return (
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: 2,
      p: 2,
      borderRadius: 2,
      bgcolor: isOnline ? 'success.50' : 'warning.50',
      border: `1px solid ${isOnline ? 'success.200' : 'warning.200'}`,
      mb: 3
    }}>
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 1,
        flex: 1
      }}>
        {isOnline ? (
          <WifiIcon sx={{ color: 'success.main' }} />
        ) : (
          <WifiOffIcon sx={{ color: 'warning.main' }} />
        )}
        <Typography variant="body2" fontWeight="medium">
          {isOnline ? 'You are online' : 'You are offline'}
        </Typography>
        
        {pendingCount > 0 && (
          <Chip
            label={`${pendingCount} pending`}
            size="small"
            color="warning"
            variant="outlined"
            sx={{ ml: 1 }}
          />
        )}
        
        {syncStatus?.queueLength > 0 && (
          <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
            Queue: {syncStatus.queueLength}
          </Typography>
        )}
      </Box>

      {pendingCount > 0 && (
        <Tooltip title="Sync pending changes">
          <Button
            variant="outlined"
            size="small"
            startIcon={isSyncing ? <CircularProgress size={16} /> : <SyncIcon />}
            onClick={handleManualSync}
            disabled={isSyncing || !isOnline}
            sx={{ 
              borderRadius: 2,
              borderColor: isOnline ? 'primary.main' : 'text.disabled'
            }}
          >
            {isSyncing ? 'Syncing...' : 'Sync Now'}
          </Button>
        </Tooltip>
      )}
    </Box>
  );
}

// Stats Card Component
function StatsCard({ icon, title, value, color }: { 
  icon: React.ReactNode; 
  title: string; 
  value: string; 
  color: string; 
}) {
  return (
    <Card 
      sx={{ 
        borderRadius: 3,
        height: '100%',
        transition: 'all 0.3s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 8,
        }
      }}
    >
      <CardContent sx={{ textAlign: 'center', p: 3 }}>
        <Box sx={{ 
          display: 'inline-flex',
          p: 2,
          borderRadius: 3,
          bgcolor: `${color}15`,
          mb: 2
        }}>
          {React.cloneElement(icon as React.ReactElement, { 
            // sx: { fontSize: 40, color: color } 
          })}
        </Box>
        <Typography variant="h4" fontWeight="bold" color={color} gutterBottom>
          {value}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {title}
        </Typography>
      </CardContent>
    </Card>
  );
}

// Category Card Component
function CategoryCard({ category, expenses, totalAmount }: { 
  category: typeof expenseCategories[0];
  expenses: Expense[];
  totalAmount: number;
}) {
  const categoryExpenses = expenses.filter(e => e.category === category.value);
  const total = categoryExpenses.reduce((sum, e) => sum + e.amount, 0);
  const percentage = totalAmount > 0 ? (total / totalAmount) * 100 : 0;

  return (
    <Card sx={{ borderRadius: 3, height: '100%', overflow: 'hidden' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Avatar sx={{ 
            bgcolor: category.color, 
            width: 48, 
            height: 48,
            fontSize: 24
          }}>
            {category.icon}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" fontWeight="bold">
              {category.label}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {categoryExpenses.length} {categoryExpenses.length === 1 ? 'expense' : 'expenses'}
            </Typography>
          </Box>
        </Box>
        <Typography variant="h5" fontWeight="bold" color="primary">
          ₹{total.toLocaleString()}
        </Typography>
        {expenses.length > 0 && (
          <Box sx={{ mt: 1 }}>
            <Typography variant="body2" color="text.secondary">
              {percentage.toFixed(1)}% of total
            </Typography>
            <Box sx={{ 
              width: '100%', 
              height: 4, 
              bgcolor: 'grey.200', 
              borderRadius: 2, 
              mt: 0.5,
              overflow: 'hidden'
            }}>
              <Box 
                sx={{ 
                  width: `${percentage}%`, 
                  height: '100%', 
                  bgcolor: category.color,
                  transition: 'width 0.3s'
                }}
              />
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}

// Main Expenses Page Component
export default function ExpensesPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<ExpenseStats | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterPayment, setFilterPayment] = useState('all');
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });

  // Fetch expenses
  const fetchExpenses = async () => {
    try {
      setLoading(true);
      console.log('Fetching expenses...');
      console.log('Network status:', navigator.onLine ? 'Online' : 'Offline');

      // Always try to get from offline storage first for immediate display
      const offlineExpenses = await offlineStorage.getItem<Expense[]>('expenses') || [];
      console.log('Loaded from offline storage:', offlineExpenses.length, 'expenses');
      
      // If offline, just show offline data
      if (!navigator.onLine) {
        console.log('Offline mode: Showing only offline expenses');
        setExpenses(offlineExpenses);
        setLoading(false);
        return;
      }

      // If online, try to fetch from server
      const queryParams = new URLSearchParams({
        page: (page + 1).toString(),
        limit: rowsPerPage.toString(),
        ...(filterCategory !== 'all' && { category: filterCategory }),
        ...(filterPayment !== 'all' && { paymentMethod: filterPayment }),
        ...(dateRange.start && { startDate: dateRange.start }),
        ...(dateRange.end && { endDate: dateRange.end })
      });

      console.log('Fetching from server with params:', queryParams.toString());

      const response = await fetch(`/api/expenses?${queryParams}`, {
        credentials: 'include',
        cache: 'no-cache'
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Server response:', data.expenses?.length || 0, 'expenses');
        
        // Merge offline and online expenses
        const serverExpenses = data.expenses?.map((expense: Expense) => ({
          ...expense,
          isSynced: true,
          isLocal: false
        })) || [];
        
        // Combine and remove duplicates (prefer server data)
        const expenseMap = new Map();
        
        // Add offline expenses first
        offlineExpenses.forEach(expense => {
          const key = expense._id || expense.id;
          if (key) expenseMap.set(key, expense);
        });
        
        // Add/overwrite with server expenses
        serverExpenses.forEach((expense: Expense) => {
          const key = expense._id || expense.id;
          if (key) expenseMap.set(key, expense);
        });
        
        const mergedExpenses = Array.from(expenseMap.values());
        console.log('Merged expenses:', mergedExpenses.length);
        
        setExpenses(mergedExpenses);
        
        // Update offline storage with merged data
        await offlineStorage.setItem('expenses', mergedExpenses);
      } else {
        console.error('Server fetch failed:', response.status);
        // Fall back to offline data
        setExpenses(offlineExpenses);
      }
    } catch (error) {
      console.error('Error fetching expenses:', error);
      // Fall back to offline data
      const offlineExpenses = await offlineStorage.getItem<Expense[]>('expenses') || [];
      setExpenses(offlineExpenses);
    } finally {
      setLoading(false);
    }
  };

  // Fetch statistics
  const fetchStats = async () => {
    try {
      console.log('Fetching stats...');
      const response = await fetch('/api/expenses/stats', {
        credentials: 'include',
        cache: 'no-cache'
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('Stats loaded:', data);
        setStats(data);
      } else {
        console.error('Failed to fetch stats:', response.status);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  useEffect(() => {
    const handleOnline = async () => {
      console.log('Network came online, syncing...');
      try {
        // Process any pending syncs
        const syncResult = await offlineStorage.processSyncQueue();
        if (syncResult.processed > 0) {
          console.log(`Synced ${syncResult.processed} items`);
          // Refresh data after sync
          await fetchExpenses();
          await fetchStats();
        }
      } catch (syncError) {
        console.error('Sync failed:', syncError);
      }
    };
    
    const handleOffline = () => {
      console.log('Network went offline');
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Initial fetch
    fetchExpenses();
    fetchStats();
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [page, rowsPerPage, filterCategory, filterPayment, dateRange]);

  // Save expense
  const handleSaveExpense = async (expenseData: Expense) => {
    console.log('Saving expense data:', expenseData);
    
    // Prepare the expense object
    const expenseToSave: any = {
      title: expenseData.title.trim(),
      amount: parseFloat(expenseData.amount.toString()),
      currency: expenseData.currency || 'INR',
      category: expenseData.category,
      paymentMethod: expenseData.paymentMethod || 'cash',
      date: new Date(expenseData.date).toISOString(),
      description: expenseData.description?.trim() || '',
      isBusinessExpense: Boolean(expenseData.isBusinessExpense),
      gstAmount: parseFloat(expenseData.gstAmount?.toString() || '0'),
      tags: Array.isArray(expenseData.tags) ? expenseData.tags : [],
      isRecurring: Boolean(expenseData.isRecurring),
      recurrence: expenseData.isRecurring ? (expenseData.recurrence || 'monthly') : null,
      status: expenseData.status || 'pending'
    };

    // Add vendor data if it's a business expense
    if (expenseToSave.isBusinessExpense && expenseData.vendor) {
      expenseToSave.vendor = {
        name: expenseData.vendor.name?.trim() || '',
        gstin: expenseData.vendor.gstin?.trim() || '',
        contact: expenseData.vendor.contact?.trim() || ''
      };
    }

    console.log('Prepared expense to save:', expenseToSave);

    // Check if we're online
    const isOnline = navigator.onLine;
    console.log('Network status:', isOnline ? 'Online' : 'Offline');

    // Try online save first if we're online
    if (isOnline) {
      try {
        const url = editingExpense && editingExpense._id 
          ? `/api/expenses/${editingExpense._id}`
          : '/api/expenses';
        
        const method = editingExpense && editingExpense._id ? 'PUT' : 'POST';

        console.log(`Making ${method} request to:`, url);

        const response = await fetch(url, {
          method,
          credentials: 'include',
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(expenseToSave),
        });

        const responseData = await response.json();
        console.log('Server response:', responseData);

        if (response.ok) {
          console.log('Expense saved successfully online');
          await fetchExpenses();
          await fetchStats();
          alert(editingExpense ? 'Expense updated successfully!' : 'Expense added successfully!');
          return;
        } else {
          console.error('Server returned error:', responseData);
          throw new Error(responseData.error || 'Failed to save expense');
        }
      } catch (error: any) {
        console.error('Online save failed, trying offline:', error.message);
        // Fall through to offline save
      }
    }

    // If offline or online save failed, save offline
    console.log('Saving expense offline');
    
    // Add offline metadata
    const expenseWithMetadata = {
      ...expenseToSave,
      isLocal: true,
      isSynced: false,
      syncAttempts: 0,
      _id: editingExpense?._id || `local_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    try {
      const result = await offlineStorage.addItem('expenses', expenseWithMetadata, { 
        syncImmediately: false 
      });
      
      if (result.success) {
        console.log('Expense saved offline successfully');
        await fetchExpenses();
        
        if (isOnline) {
          alert('Expense saved offline due to server error. It will sync automatically when possible.');
        } else {
          alert('Expense saved offline. It will sync when you are back online.');
        }
      } else {
        console.error('Failed to save offline:', result.error);
        alert('Failed to save expense. Please try again.');
      }
    } catch (offlineError) {
      console.error('Offline save also failed:', offlineError);
      alert('Failed to save expense. Please check your connection and try again.');
    }
  };

  // Delete expense
  const handleDeleteExpense = async (expenseId: string) => {
    if (!confirm('Are you sure you want to delete this expense?')) return;

    console.log('Deleting expense:', expenseId);

    // Check if it's a local expense
    const expenseToDelete = expenses.find(e => e._id === expenseId || e.id === expenseId);
    const isLocalExpense = expenseToDelete?.isLocal === true;

    if (!navigator.onLine || isLocalExpense) {
      console.log('Deleting expense offline');
      await offlineStorage.deleteItem('expenses', expenseId);
      await fetchExpenses();
      alert(isLocalExpense ? 'Local expense deleted' : 'Expense deleted offline. Sync will happen when online.');
      return;
    }

    try {
      console.log('Deleting expense from server');
      const response = await fetch(`/api/expenses/${expenseId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        console.log('Expense deleted from server');
        await fetchExpenses();
        await fetchStats();
        alert('Expense deleted successfully!');
      } else {
        const errorData = await response.json();
        console.error('Server deletion failed:', errorData);
        // Fall back to offline deletion
        await offlineStorage.deleteItem('expenses', expenseId);
        await fetchExpenses();
        alert('Server error. Expense deleted locally and will sync later.');
      }
    } catch (error) {
      console.error('Error deleting expense:', error);
      await offlineStorage.deleteItem('expenses', expenseId);
      await fetchExpenses();
      alert('Network error. Expense deleted locally and will sync later.');
    }
  };

  // Edit expense
  const handleEditExpense = (expense: Expense) => {
    console.log('Editing expense:', expense);
    setEditingExpense(expense);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingExpense(null);
  };

  const getCategoryInfo = (category: string) => {
    return expenseCategories.find(cat => cat.value === category) || expenseCategories[expenseCategories.length - 1];
  };

  const getPaymentMethodInfo = (method: string) => {
    return paymentMethods.find(pm => pm.value === method) || paymentMethods[0];
  };

  // Calculate totals
  const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const businessTotal = expenses.filter(e => e.isBusinessExpense).reduce((sum, e) => sum + e.amount, 0);
  const personalTotal = expenses.filter(e => !e.isBusinessExpense).reduce((sum, e) => sum + e.amount, 0);

  return (
    <MainLayout title="Expense Tracker">
      <Box sx={{ p: { xs: 2, sm: 3 }, maxWidth: 1400, margin: '0 auto' }}>
        {/* Header with Modern Design */}
        <Paper
          sx={{
            p: { xs: 3, sm: 4 },
            mb: 3,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            borderRadius: 3,
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 10px 40px rgba(102, 126, 234, 0.3)'
          }}
        >
          {/* Background decorative elements */}
          <Box sx={{ 
            position: 'absolute', 
            top: -100, 
            right: -100, 
            width: 300, 
            height: 300,
            bgcolor: 'rgba(255,255,255,0.1)',
            borderRadius: '50%',
            filter: 'blur(40px)'
          }} />
          <Box sx={{ 
            position: 'absolute', 
            bottom: -80, 
            left: -80, 
            width: 250, 
            height: 250,
            bgcolor: 'rgba(255,255,255,0.1)',
            borderRadius: '50%',
            filter: 'blur(40px)'
          }} />
          
          {/* Header Content */}
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between', 
            alignItems: { xs: 'flex-start', sm: 'center' },
            gap: 3,
            position: 'relative',
            zIndex: 1
          }}>
            <Box sx={{ flex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Avatar sx={{ 
                  bgcolor: 'white', 
                  color: '#667eea',
                  width: 56, 
                  height: 56 
                }}>
                  <ReceiptIcon fontSize="large" />
                </Avatar>
                <Box>
                  <Typography 
                    variant="h3" 
                    component="h1" 
                    fontWeight="bold" 
                    gutterBottom 
                    sx={{ 
                      fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                      background: 'linear-gradient(to right, #ffffff, #e0e7ff)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent'
                    }}
                  >
                    Expense Tracker
                  </Typography>
                  <Typography variant="h6" sx={{ opacity: 0.9 }}>
                    Track your personal and business expenses
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setDialogOpen(true)}
              sx={{
                backgroundColor: 'white',
                color: '#667eea',
                px: 4,
                py: 1.5,
                borderRadius: 3,
                fontWeight: 'bold',
                fontSize: '1rem',
                boxShadow: '0 4px 20px rgba(255, 255, 255, 0.3)',
                '&:hover': {
                  backgroundColor: 'grey.100',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 25px rgba(255, 255, 255, 0.4)',
                },
                transition: 'all 0.3s',
                minWidth: { xs: '100%', sm: 'auto' }
              }}
            >
              Add Expense
            </Button>
          </Box>
        </Paper>

        {/* Network Status Indicator */}
        <NetworkStatusIndicator />

        {/* Quick Stats */}
        <Box sx={{ 
          display: 'grid',
          gridTemplateColumns: { 
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(4, 1fr)'
          },
          gap: 3,
          mb: 4
        }}>
          <StatsCard
            icon={<MoneyIcon />}
            title="Total Expenses"
            value={`₹${totalAmount.toLocaleString()}`}
            color="#667eea"
          />
          <StatsCard
            icon={<BusinessIcon />}
            title="Business"
            value={`₹${businessTotal.toLocaleString()}`}
            color="#00d2d3"
          />
          <StatsCard
            icon={<PersonIcon />}
            title="Personal"
            value={`₹${personalTotal.toLocaleString()}`}
            color="#ff9f43"
          />
          <StatsCard
            icon={<ReceiptIcon />}
            title="Total Records"
            value={expenses.length.toString()}
            color="#764ba2"
          />
        </Box>

        {/* Main Content Container */}
        <Paper sx={{ 
          width: '100%', 
          borderRadius: 3, 
          overflow: 'hidden',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
          border: '1px solid rgba(0, 0, 0, 0.08)'
        }}>
          {/* Tabs with Modern Design */}
          <Box sx={{ 
            bgcolor: 'background.paper',
            borderBottom: 1, 
            borderColor: 'divider',
            px: 3
          }}>
            <Tabs
              value={activeTab}
              onChange={(_, newValue) => setActiveTab(newValue)}
              variant={isMobile ? "fullWidth" : "standard"}
              sx={{
                '& .MuiTab-root': {
                  fontSize: '1rem',
                  fontWeight: 600,
                  py: 2,
                  minHeight: 64,
                  color: 'text.secondary',
                  '&.Mui-selected': {
                    color: '#667eea',
                  },
                },
                '& .MuiTabs-indicator': {
                  backgroundColor: '#667eea',
                  height: 3,
                  borderRadius: '3px 3px 0 0'
                }
              }}
            >
              <Tab 
                label={isMobile ? "Expenses" : "All Expenses"} 
                icon={isMobile ? <ReceiptIcon /> : undefined}
                iconPosition="start"
              />
              <Tab 
                label="Statistics" 
                icon={isMobile ? <AnalyticsIcon /> : undefined}
                iconPosition="start"
              />
              <Tab 
                label="Categories" 
                icon={isMobile ? <CategoryIcon /> : undefined}
                iconPosition="start"
              />
            </Tabs>
          </Box>

          {/* All Expenses Tab */}
          {activeTab === 0 && (
            <Box sx={{ p: 3 }}>
              {/* Filter Section */}
              <Box sx={{ 
                display: 'flex', 
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 2, 
                mb: 4,
                flexWrap: 'wrap',
                alignItems: 'flex-end'
              }}>
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: { xs: 'column', sm: 'row' },
                  gap: 2,
                  flex: 1,
                  flexWrap: 'wrap'
                }}>
                  <FormControl size="small" sx={{ minWidth: 180, flex: 1 }}>
                    <InputLabel>Filter by Category</InputLabel>
                    <Select
                      value={filterCategory}
                      label="Filter by Category"
                      onChange={(e) => setFilterCategory(e.target.value)}
                      sx={{ borderRadius: 2 }}
                    >
                      <MenuItem value="all">All Categories</MenuItem>
                      {expenseCategories.map(cat => (
                        <MenuItem key={cat.value} value={cat.value}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <span>{cat.icon}</span>
                            {cat.label}
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl size="small" sx={{ minWidth: 180, flex: 1 }}>
                    <InputLabel>Payment Method</InputLabel>
                    <Select
                      value={filterPayment}
                      label="Payment Method"
                      onChange={(e) => setFilterPayment(e.target.value)}
                      sx={{ borderRadius: 2 }}
                    >
                      <MenuItem value="all">All Methods</MenuItem>
                      {paymentMethods.map(method => (
                        <MenuItem key={method.value} value={method.value}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {method.icon}
                            {method.label}
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <Box sx={{ 
                    display: 'flex', 
                    gap: 2, 
                    flex: { xs: '1 1 100%', sm: '1' },
                    minWidth: { xs: '100%', sm: 'auto' }
                  }}>
                    <TextField
                      size="small"
                      label="From Date"
                      type="date"
                      value={dateRange.start}
                      onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                      InputLabelProps={{ shrink: true }}
                      sx={{ flex: 1, minWidth: 150 }}
                    />
                    <TextField
                      size="small"
                      label="To Date"
                      type="date"
                      value={dateRange.end}
                      onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                      InputLabelProps={{ shrink: true }}
                      sx={{ flex: 1, minWidth: 150 }}
                    />
                  </Box>
                </Box>

                <Button
                  variant="outlined"
                  startIcon={<FilterIcon />}
                  onClick={() => {
                    setFilterCategory('all');
                    setFilterPayment('all');
                    setDateRange({
                      start: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
                      end: new Date().toISOString().split('T')[0]
                    });
                  }}
                  sx={{ 
                    borderRadius: 2,
                    height: 40
                  }}
                >
                  Clear Filters
                </Button>
              </Box>

              {/* Expenses Table */}
              <TableContainer sx={{ 
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
                overflow: 'hidden'
              }}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ 
                      bgcolor: 'grey.50',
                      '& th': { 
                        fontWeight: 600, 
                        color: 'text.primary',
                        borderBottomColor: 'divider'
                      }
                    }}>
                      <TableCell>Title</TableCell>
                      <TableCell>Category</TableCell>
                      <TableCell align="right">Amount</TableCell>
                      {!isMobile && <TableCell>Payment</TableCell>}
                      {!isMobile && <TableCell>Date</TableCell>}
                      <TableCell>Type</TableCell>
                      <TableCell align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                            <CircularProgress />
                            <Typography variant="body2" color="text.secondary">
                              Loading expenses...
                            </Typography>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ) : expenses.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                          <Box sx={{ textAlign: 'center', py: 2 }}>
                            <ReceiptIcon sx={{ fontSize: 60, color: 'grey.300', mb: 2 }} />
                            <Typography variant="h6" color="text.secondary" gutterBottom>
                              No expenses found
                            </Typography>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                              {filterCategory !== 'all' || filterPayment !== 'all' || 
                               dateRange.start !== new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0] ? 
                               'Try adjusting your filters' : 
                               'Add your first expense to get started'}
                            </Typography>
                            <Button
                              variant="contained"
                              startIcon={<AddIcon />}
                              onClick={() => setDialogOpen(true)}
                              sx={{ mt: 2 }}
                            >
                              Add Expense
                            </Button>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ) : (
                      expenses.map((expense) => (
                        <TableRow 
                          key={expense._id || expense.id} 
                          hover
                          sx={{ 
                            '&:last-child td, &:last-child th': { border: 0 },
                            transition: 'background-color 0.2s',
                            '&:hover': { bgcolor: 'action.hover' }
                          }}
                        >
                          <TableCell>
                            <Box>
                              <Typography variant="body2" fontWeight="bold">
                                {expense.title}
                                {expense.isLocal && (
                                  <Chip
                                    label="Offline"
                                    size="small"
                                    color="warning"
                                    variant="outlined"
                                    sx={{ ml: 1, height: 18, fontSize: '0.65rem' }}
                                  />
                                )}
                              </Typography>
                              {expense.description && (
                                <Typography variant="caption" color="text.secondary" noWrap sx={{ maxWidth: 200, display: 'block' }}>
                                  {expense.description}
                                </Typography>
                              )}
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip
                              icon={<span>{getCategoryInfo(expense.category).icon}</span>}
                              label={isMobile ? '' : getCategoryInfo(expense.category).label}
                              size="small"
                              variant="outlined"
                              sx={{ 
                                borderRadius: 1,
                                borderColor: getCategoryInfo(expense.category).color,
                                color: getCategoryInfo(expense.category).color
                              }}
                            />
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body2" fontWeight="bold" sx={{ color: 'error.main' }}>
                              -₹{expense.amount.toLocaleString()}
                            </Typography>
                            {expense.isBusinessExpense && expense.gstAmount > 0 && (
                              <Typography variant="caption" color="text.secondary">
                                +₹{expense.gstAmount} GST
                              </Typography>
                            )}
                          </TableCell>
                          {!isMobile && (
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Box sx={{ color: 'primary.main' }}>
                                  {getPaymentMethodInfo(expense.paymentMethod).icon}
                                </Box>
                                <Typography variant="body2">
                                  {getPaymentMethodInfo(expense.paymentMethod).label}
                                </Typography>
                              </Box>
                            </TableCell>
                          )}
                          {!isMobile && (
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <CalendarIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                                <Typography variant="body2">
                                  {new Date(expense.date).toLocaleDateString('en-US', {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric'
                                  })}
                                </Typography>
                              </Box>
                            </TableCell>
                          )}
                          <TableCell>
                            <Chip
                              label={expense.isBusinessExpense ? 'Business' : 'Personal'}
                              color={expense.isBusinessExpense ? 'primary' : 'default'}
                              size="small"
                              sx={{ 
                                borderRadius: 1,
                                fontWeight: 500
                              }}
                            />
                          </TableCell>
                          <TableCell align="center">
                            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                              <Tooltip title="Edit">
                                <IconButton
                                  size="small"
                                  onClick={() => handleEditExpense(expense)}
                                  sx={{ 
                                    borderRadius: 1,
                                    bgcolor: 'primary.50',
                                    color: 'primary.main',
                                    '&:hover': { bgcolor: 'primary.100' }
                                  }}
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Delete">
                                <IconButton
                                  size="small"
                                  onClick={() => handleDeleteExpense(expense._id || expense.id!)}
                                  sx={{ 
                                    borderRadius: 1,
                                    bgcolor: 'error.50',
                                    color: 'error.main',
                                    '&:hover': { bgcolor: 'error.100' }
                                  }}
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              <TablePagination
                rowsPerPageOptions={[5, 10, 25, 50]}
                component="div"
                count={expenses.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={(_, newPage) => setPage(newPage)}
                onRowsPerPageChange={(e) => {
                  setRowsPerPage(parseInt(e.target.value, 10));
                  setPage(0);
                }}
                sx={{ 
                  borderTop: 1, 
                  borderColor: 'divider',
                  mt: 2
                }}
              />
            </Box>
          )}

          {/* Statistics Tab */}
          {activeTab === 1 && (
            <Box sx={{ p: 3 }}>
              {stats ? (
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: { xs: 'column', md: 'row' },
                  gap: 3 
                }}>
                  {/* Category Breakdown */}
                  <Card sx={{ flex: 1, borderRadius: 3 }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 1, 
                        mb: 3,
                        color: 'text.primary'
                      }}>
                        <CategoryIcon color="primary" />
                        Spending by Category
                      </Typography>
                      <List sx={{ p: 0 }}>
                        {stats.categoryStats.map((category) => (
                          <ListItem 
                            key={category._id} 
                            sx={{ 
                              py: 2,
                              borderRadius: 2,
                              mb: 1,
                              '&:hover': { bgcolor: 'action.hover' }
                            }}
                          >
                            <ListItemIcon>
                              <Avatar sx={{ 
                                bgcolor: getCategoryInfo(category._id).color, 
                                width: 40, 
                                height: 40 
                              }}>
                                {getCategoryInfo(category._id).icon}
                              </Avatar>
                            </ListItemIcon>
                            <ListItemText
                              primary={
                                <Typography variant="body1" fontWeight="medium">
                                  {getCategoryInfo(category._id).label}
                                </Typography>
                              }
                              secondary={`₹${category.totalAmount.toLocaleString()} • ${category.count} expenses`}
                            />
                            <Typography variant="body2" fontWeight="bold" color="primary.main">
                              {((category.totalAmount / stats.categoryStats.reduce((sum, cat) => sum + cat.totalAmount, 0)) * 100).toFixed(1)}%
                            </Typography>
                          </ListItem>
                        ))}
                      </List>
                    </CardContent>
                  </Card>

                  {/* Payment Method Distribution */}
                  <Card sx={{ flex: 1, borderRadius: 3 }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 1, 
                        mb: 3,
                        color: 'text.primary'
                      }}>
                        <CreditCardIcon color="primary" />
                        Payment Methods
                      </Typography>
                      <List sx={{ p: 0 }}>
                        {stats.paymentStats.map((method) => (
                          <ListItem 
                            key={method._id} 
                            sx={{ 
                              py: 2,
                              borderRadius: 2,
                              mb: 1,
                              '&:hover': { bgcolor: 'action.hover' }
                            }}
                          >
                            <ListItemIcon>
                              <Avatar sx={{ 
                                bgcolor: 'primary.50', 
                                color: 'primary.main',
                                width: 40, 
                                height: 40 
                              }}>
                                {getPaymentMethodInfo(method._id).icon}
                              </Avatar>
                            </ListItemIcon>
                            <ListItemText
                              primary={
                                <Typography variant="body1" fontWeight="medium">
                                  {getPaymentMethodInfo(method._id).label}
                                </Typography>
                              }
                              secondary={`₹${method.totalAmount.toLocaleString()} • ${method.count} transactions`}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </CardContent>
                  </Card>
                </Box>
              ) : (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                  <CircularProgress />
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                    Loading statistics...
                  </Typography>
                </Box>
              )}
            </Box>
          )}

          {/* Categories Tab */}
          {activeTab === 2 && (
            <Box sx={{ p: 3 }}>
              <Box sx={{ 
                display: 'grid',
                gridTemplateColumns: { 
                  xs: '1fr',
                  sm: 'repeat(2, 1fr)',
                  md: 'repeat(3, 1fr)',
                  lg: 'repeat(4, 1fr)'
                },
                gap: 3
              }}>
                {expenseCategories.map((category) => (
                  <CategoryCard
                    key={category.value}
                    category={category}
                    expenses={expenses}
                    totalAmount={totalAmount}
                  />
                ))}
              </Box>
            </Box>
          )}
        </Paper>

        {/* Add Expense Dialog */}
        <AddExpenseDialog
          open={dialogOpen}
          onClose={handleCloseDialog}
          onSave={handleSaveExpense}
          editingExpense={editingExpense}
        />

        {/* Floating Action Button */}
        <Fab
          color="primary"
          aria-label="add expense"
          sx={{
            position: 'fixed',
            bottom: 32,
            right: 32,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
              transform: 'scale(1.1)',
            },
            transition: 'all 0.3s',
            boxShadow: '0 4px 20px rgba(102, 126, 234, 0.4)'
          }}
          onClick={() => setDialogOpen(true)}
        >
          <AddIcon />
        </Fab>
      </Box>
    </MainLayout>
  );
}