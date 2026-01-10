// app/events/[id]/page.tsx - SUPER RESPONSIVE
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Stack,
  Chip,
  TextField,
  MenuItem,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
  Tabs,
  Tab,
  useTheme,
  useMediaQuery,
  alpha,
  Avatar,
  Divider,
  Badge,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  LinearProgress,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ArrowBack as ArrowBackIcon,
  CalendarMonth as CalendarIcon,
  AccountBalanceWallet as WalletIcon,
  Receipt as ReceiptIcon,
  Folder as FolderIcon,
  TrendingUp as TrendingUpIcon,
  MoreVert as MoreVertIcon,
  FilterList as FilterIcon,
  Menu as MenuIcon,
  Close as CloseIcon,
  Download as DownloadIcon,
  Share as ShareIcon,
  PieChart as PieChartIcon,
  Timeline as TimelineIcon,
  AttachMoney as MoneyIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  Cancel as CancelIcon,
} from "@mui/icons-material";
import { MainLayout } from "@/components/Layout/MainLayout";

interface SubEvent {
  _id: string;
  name: string;
  description: string;
  budget: number;
  spentAmount: number;
  status: string;
}

interface Expense {
  _id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
  subEventId?: string;
  receipt: string;
  notes: string;
  createdAt: string;
}

interface Event {
  _id: string;
  name: string;
  description: string;
  type: string;
  startDate: string;
  endDate: string;
  totalBudget: number;
  totalSpent: number;
  status: string;
  subEvents: SubEvent[];
  expenses: Expense[];
}

const expenseCategories = [
  "Food & Catering",
  "Venue & Decorations",
  "Clothing & Jewelry",
  "Photography & Videography",
  "Transportation",
  "Accommodation",
  "Entertainment",
  "Gifts & Favors",
  "Miscellaneous",
];

export default function EventDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const theme = useTheme();
  
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [activeTab, setActiveTab] = useState(0);
  const [addExpenseDialog, setAddExpenseDialog] = useState(false);
  const [addSubEventDialog, setAddSubEventDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [expenseFilter, setExpenseFilter] = useState('all');

  // Expense form state
  const [expenseForm, setExpenseForm] = useState({
    description: "",
    amount: 0,
    category: "",
    date: new Date().toISOString().split("T")[0],
    subEventId: undefined as string | undefined,
    notes: "",
  });

  // Sub-event form state
  const [subEventForm, setSubEventForm] = useState({
    name: "",
    description: "",
    budget: 0,
  });

  useEffect(() => {
    if (params.id) {
      fetchEvent();
    }
  }, [params.id]);

  const fetchEvent = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/events/${params.id}`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        if (res.status === 404) {
          throw new Error("Event not found");
        } else if (res.status === 401) {
          throw new Error("Please login again");
        } else {
          throw new Error(`Failed to fetch event: ${res.status}`);
        }
      }

      const data = await res.json();
      setEvent(data);
    } catch (error: any) {
      console.error("Error fetching event:", error);
      setError(error.message || "Failed to load event details");
    } finally {
      setLoading(false);
    }
  };

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/events/${params.id}/expenses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(expenseForm),
      });

      if (response.ok) {
        setSuccess("Expense added successfully!");
        setExpenseForm({
          description: "",
          amount: 0,
          category: "",
          date: new Date().toISOString().split("T")[0],
          subEventId: "",
          notes: "",
        });
        setAddExpenseDialog(false);
        fetchEvent();
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Failed to add expense");
      }
    } catch (error) {
      console.error("Error adding expense:", error);
      setError("Failed to add expense");
    } finally {
      setLoading(false);
    }
  };

  const handleAddSubEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/events/${params.id}/sub-events`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(subEventForm),
      });

      if (response.ok) {
        setSuccess("Sub-event added successfully!");
        setSubEventForm({
          name: "",
          description: "",
          budget: 0,
        });
        setAddSubEventDialog(false);
        fetchEvent();
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Failed to add sub-event");
      }
    } catch (error) {
      console.error("Error adding sub-event:", error);
      setError("Failed to add sub-event");
    }
  };

  const handleDeleteExpense = async (expenseId: string) => {
    try {
      const response = await fetch(
        `/api/events/${params.id}/expenses/${expenseId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (response.ok) {
        setSuccess("Expense deleted successfully!");
        fetchEvent();
      } else {
        setError("Failed to delete expense");
      }
    } catch (error) {
      console.error("Error deleting expense:", error);
      setError("Failed to delete expense");
    }
  };

  const getEventTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      marriage: "#ff6b6b",
      business: "#4ecdc4",
      personal: "#45b7d1",
      travel: "#96ceb4",
      festival: "#feca57",
      other: "#778ca3",
    };
    return colors[type] || "#778ca3";
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircleIcon />;
      case 'active': return <PendingIcon />;
      case 'cancelled': return <CancelIcon />;
      default: return <PendingIcon />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN");
  };

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString()}`;
  };

  const getEventAvatar = (type: string) => {
    const avatars: { [key: string]: string } = {
      marriage: "👰",
      business: "💼",
      personal: "🎉",
      travel: "✈️",
      festival: "🎊",
      other: "📅",
    };
    return avatars[type] || "📅";
  };

  // Filter expenses
  const filteredExpenses = event?.expenses.filter(expense => {
    if (expenseFilter === 'all') return true;
    if (expenseFilter === 'noSubevent') return !expense.subEventId;
    return expense.subEventId === expenseFilter;
  }) || [];

  // Mobile Navigation Drawer
  const MobileMenu = () => (
    <Drawer
      anchor="right"
      open={showMobileMenu}
      onClose={() => setShowMobileMenu(false)}
      sx={{
        '& .MuiDrawer-paper': {
          width: '100%',
          maxWidth: 280,
          p: 2,
        }
      }}
    >
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" fontWeight="bold">
          Event Actions
        </Typography>
        <IconButton onClick={() => setShowMobileMenu(false)} size="small">
          <CloseIcon />
        </IconButton>
      </Box>
      <List>
        <ListItem 
          button 
          onClick={() => { setAddSubEventDialog(true); setShowMobileMenu(false); }}
          sx={{ borderRadius: 1, mb: 1 }}
        >
          <ListItemIcon>
            <FolderIcon />
          </ListItemIcon>
          <ListItemText primary="Add Sub-Event" />
        </ListItem>
        <ListItem 
          button 
          onClick={() => { setAddExpenseDialog(true); setShowMobileMenu(false); }}
          sx={{ borderRadius: 1, mb: 1 }}
        >
          <ListItemIcon>
            <ReceiptIcon />
          </ListItemIcon>
          <ListItemText primary="Add Expense" />
        </ListItem>
        <Divider sx={{ my: 1 }} />
        <ListItem>
          <ListItemText 
            primary="Quick Stats"
            secondary={
              event && (
                <Box sx={{ mt: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="caption">Budget</Typography>
                    <Typography variant="caption" fontWeight="bold">{formatCurrency(event.totalBudget)}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="caption">Spent</Typography>
                    <Typography variant="caption" fontWeight="bold" color="primary.main">{formatCurrency(event.totalSpent)}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="caption">Balance</Typography>
                    <Typography 
                      variant="caption" 
                      fontWeight="bold" 
                      color={event.totalBudget - event.totalSpent < 0 ? "error.main" : "success.main"}
                    >
                      {formatCurrency(event.totalBudget - event.totalSpent)}
                    </Typography>
                  </Box>
                </Box>
              )
            }
          />
        </ListItem>
      </List>
    </Drawer>
  );

  if (loading) {
    return (
      <MainLayout title="Loading...">
        <Box sx={{ 
          p: 3, 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '60vh',
          flexDirection: 'column',
          gap: 2
        }}>
          <CircularProgress size={isMobile ? 40 : 60} />
          <Typography variant="h6" color="text.secondary">
            Loading event details...
          </Typography>
        </Box>
      </MainLayout>
    );
  }

  if (!event) {
    return (
      <MainLayout title="Event Not Found">
        <Box sx={{ p: 3, textAlign: "center" }}>
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
            Event not found
          </Alert>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => router.push("/events")}
            variant="contained"
            fullWidth={isMobile}
          >
            Back to Events
          </Button>
        </Box>
      </MainLayout>
    );
  }

  // Calculate budget percentage
  const budgetPercentage = event.totalBudget > 0 
    ? Math.round((event.totalSpent / event.totalBudget) * 100) 
    : 0;

  return (
    <MainLayout title={event.name}>
      <Box sx={{ 
        p: { xs: 1.5, sm: 2, md: 3 },
        minHeight: '100vh',
      }}>
        {/* Mobile Menu Drawer */}
        <MobileMenu />

        {/* Header */}
        <Box sx={{ mb: { xs: 2, sm: 3, md: 4 } }}>
          {/* Mobile Back Button */}
          {isMobile && (
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => router.push("/events")}
              sx={{ mb: 2 }}
              size="small"
              fullWidth
            >
              Back to Events
            </Button>
          )}

          {/* Desktop Back Button */}
          {!isMobile && (
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => router.push("/events")}
              sx={{ mb: 2 }}
            >
              Back to Events
            </Button>
          )}

          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: { xs: 'flex-start', sm: 'center' },
            flexDirection: { xs: 'column', sm: 'row' },
            gap: { xs: 2, sm: 3 }
          }}>
            <Box sx={{ flex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                <Avatar
                  sx={{
                    bgcolor: getEventTypeColor(event.type),
                    width: { xs: 48, sm: 56, md: 64 },
                    height: { xs: 48, sm: 56, md: 64 },
                    fontSize: { xs: '1.5rem', sm: '2rem' },
                  }}
                >
                  {getEventAvatar(event.type)}
                </Avatar>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography 
                    variant={isMobile ? "h5" : "h4"} 
                    component="h1" 
                    fontWeight="bold" 
                    gutterBottom
                    sx={{ 
                      wordBreak: 'break-word',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {event.name}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    sx={{ 
                      mb: 2,
                      wordBreak: 'break-word',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {event.description}
                  </Typography>
                </Box>
              </Box>

              {/* Event Tags */}
              <Stack 
                direction="row" 
                spacing={1} 
                sx={{ 
                  mb: 2,
                  flexWrap: 'wrap',
                  gap: 1
                }}
              >
                <Chip
                  label={event.type}
                  sx={{
                    bgcolor: getEventTypeColor(event.type),
                    color: 'white',
                    textTransform: 'capitalize',
                    height: { xs: 24, sm: 32 },
                  }}
                />
                <Chip
                  label={event.status}
                  variant="outlined"
                  icon={getStatusIcon(event.status)}
                  color={
                    event.status === "completed"
                      ? "success"
                      : event.status === "active"
                      ? "primary"
                      : event.status === "cancelled"
                      ? "error"
                      : "default"
                  }
                  sx={{ height: { xs: 24, sm: 32 } }}
                />
              </Stack>

              {/* Event Info */}
              <Box sx={{ 
                display: 'flex', 
                flexDirection: { xs: 'column', sm: 'row' },
                gap: { xs: 1, sm: 3 },
                alignItems: { xs: 'flex-start', sm: 'center' }
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CalendarIcon sx={{ color: 'text.secondary', fontSize: { xs: 16, sm: 20 } }} />
                  <Typography variant={isMobile ? "body2" : "body1"}>
                    {formatDate(event.startDate)} - {formatDate(event.endDate)}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <WalletIcon sx={{ color: 'text.secondary', fontSize: { xs: 16, sm: 20 } }} />
                  <Typography variant={isMobile ? "body2" : "body1"}>
                    Spent: <strong>{formatCurrency(event.totalSpent)}</strong>
                    {event.totalBudget > 0 &&
                      ` / ${formatCurrency(event.totalBudget)}`}
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Action Buttons */}
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1,
              width: { xs: '100%', sm: 'auto' }
            }}>
              {isMobile && (
                <IconButton
                  onClick={() => setShowMobileMenu(true)}
                  size="small"
                  sx={{ 
                    border: 1,
                    borderColor: 'divider'
                  }}
                >
                  <MenuIcon />
                </IconButton>
              )}
              
              {!isMobile && (
                <>
                  <Button
                    variant="outlined"
                    startIcon={<FolderIcon />}
                    onClick={() => setAddSubEventDialog(true)}
                    size={isMobile ? "small" : "medium"}
                  >
                    Add Sub-Event
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setAddExpenseDialog(true)}
                    size={isMobile ? "small" : "medium"}
                  >
                    Add Expense
                  </Button>
                </>
              )}
            </Box>
          </Box>

          {/* Budget Progress Bar */}
          {event.totalBudget > 0 && (
            <Box sx={{ 
              mt: 3, 
              p: { xs: 2, sm: 3 }, 
              bgcolor: alpha(theme.palette.primary.main, 0.05),
              borderRadius: 2,
              border: `1px solid ${theme.palette.divider}`
            }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="subtitle1" fontWeight="medium">
                  Budget Progress
                </Typography>
                <Typography 
                  variant="h6" 
                  fontWeight="bold"
                  color={budgetPercentage > 100 ? "error.main" : "primary.main"}
                >
                  {budgetPercentage}%
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  {formatCurrency(event.totalSpent)} / {formatCurrency(event.totalBudget)}
                </Typography>
                <Typography 
                  variant="caption" 
                  fontWeight="bold"
                  color={event.totalBudget - event.totalSpent < 0 ? "error.main" : "success.main"}
                >
                  {formatCurrency(event.totalBudget - event.totalSpent)} remaining
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={Math.min(budgetPercentage, 100)}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: budgetPercentage > 100 ? theme.palette.error.main : theme.palette.primary.main,
                    borderRadius: 4,
                  }
                }}
              />
            </Box>
          )}
        </Box>

        {/* Alerts */}
        <Box sx={{ mb: 3 }}>
          {error && (
            <Alert 
              severity="error" 
              sx={{ mb: 2, borderRadius: 2 }}
              onClose={() => setError("")}
            >
              {error}
            </Alert>
          )}
          {success && (
            <Alert
              severity="success"
              sx={{ mb: 2, borderRadius: 2 }}
              onClose={() => setSuccess("")}
            >
              {success}
            </Alert>
          )}
        </Box>

        {/* Mobile Action Buttons */}
        {isMobile && (
          <Box sx={{ 
            display: 'flex', 
            gap: 1, 
            mb: 3,
            '& > *': { flex: 1 }
          }}>
            <Button
              variant="outlined"
              startIcon={<FolderIcon />}
              onClick={() => setAddSubEventDialog(true)}
              size="small"
            >
              Sub-Event
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setAddExpenseDialog(true)}
              size="small"
            >
              Expense
            </Button>
          </Box>
        )}

        {/* Tabs */}
        <Card sx={{ 
          mb: 3,
          borderRadius: 2,
          overflow: 'hidden',
          border: `1px solid ${theme.palette.divider}`
        }}>
          <Tabs
            value={activeTab}
            onChange={(e, newValue) => setActiveTab(newValue)}
            variant={isMobile ? "scrollable" : "standard"}
            scrollButtons={isMobile ? "auto" : false}
            sx={{ 
              minHeight: 48,
              borderBottom: `1px solid ${theme.palette.divider}`,
              '& .MuiTab-root': {
                fontSize: isMobile ? '0.8rem' : '0.875rem',
                minHeight: 48,
                minWidth: { xs: 100, sm: 'auto' }
              }
            }}
          >
            <Tab label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <ReceiptIcon fontSize="small" />
                <Typography component="span">
                  Expenses
                </Typography>
                {event.expenses.length > 0 && (
                  <Chip 
                    label={event.expenses.length} 
                    size="small" 
                    sx={{ height: 20, fontSize: '0.7rem' }}
                  />
                )}
              </Box>
            } />
            <Tab label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <FolderIcon fontSize="small" />
                <Typography component="span">
                  Sub-Events
                </Typography>
                {event.subEvents.length > 0 && (
                  <Chip 
                    label={event.subEvents.length} 
                    size="small" 
                    sx={{ height: 20, fontSize: '0.7rem' }}
                  />
                )}
              </Box>
            } />
            <Tab label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <PieChartIcon fontSize="small" />
                <Typography component="span">
                  Summary
                </Typography>
              </Box>
            } />
          </Tabs>
        </Card>

        {/* Expenses Tab */}
        {activeTab === 0 && (
          <Card sx={{ borderRadius: 2, overflow: 'hidden' }}>
            <CardContent sx={{ p: 0 }}>
              {/* Expenses Header */}
              <Box sx={{ 
                p: { xs: 1.5, sm: 2 },
                borderBottom: `1px solid ${theme.palette.divider}`,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <Typography variant="h6" fontWeight="bold">
                  Expenses ({event.expenses.length})
                </Typography>
                {event.expenses.length > 0 && (
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    {!isMobile && (
                      <TextField
                        select
                        size="small"
                        value={expenseFilter}
                        onChange={(e) => setExpenseFilter(e.target.value)}
                        sx={{ minWidth: 150 }}
                      >
                        <MenuItem value="all">All Expenses</MenuItem>
                        <MenuItem value="noSubevent">No Sub-Event</MenuItem>
                        {event.subEvents.map((subEvent) => (
                          <MenuItem key={subEvent._id} value={subEvent._id}>
                            {subEvent.name}
                          </MenuItem>
                        ))}
                      </TextField>
                    )}
                  </Box>
                )}
              </Box>

              {event.expenses.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 6, px: 2 }}>
                  <ReceiptIcon
                    sx={{
                      fontSize: { xs: 48, sm: 64 },
                      color: 'text.secondary',
                      mb: 2,
                      opacity: 0.5
                    }}
                  />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No expenses recorded yet
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Start tracking your event expenses
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setAddExpenseDialog(true)}
                    size={isMobile ? "medium" : "large"}
                  >
                    Add First Expense
                  </Button>
                </Box>
              ) : (
                <TableContainer sx={{ maxHeight: isMobile ? 400 : 500 }}>
                  <Table 
                    stickyHeader
                    sx={{ 
                      minWidth: isMobile ? 600 : 'auto',
                      '& .MuiTableCell-head': {
                        fontWeight: 'bold',
                        backgroundColor: theme.palette.background.paper,
                        borderBottom: `2px solid ${theme.palette.divider}`,
                        fontSize: isMobile ? '0.85rem' : '0.875rem',
                        py: isMobile ? 1 : 1.5,
                      },
                      '& .MuiTableCell-body': {
                        py: isMobile ? 1 : 1.5,
                        fontSize: isMobile ? '0.85rem' : '0.875rem',
                      }
                    }}
                  >
                    <TableHead>
                      <TableRow>
                        <TableCell>Date</TableCell>
                        <TableCell>Description</TableCell>
                        {!isMobile && <TableCell>Category</TableCell>}
                        <TableCell>Amount</TableCell>
                        <TableCell align="right">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredExpenses.map((expense) => (
                        <TableRow 
                          key={expense._id} 
                          hover
                          sx={{
                            '&:hover': {
                              backgroundColor: alpha(theme.palette.primary.main, 0.04),
                            }
                          }}
                        >
                          <TableCell>
                            <Typography variant="body2">
                              {formatDate(expense.date)}
                            </Typography>
                          </TableCell>
                          <TableCell sx={{ minWidth: 200 }}>
                            <Box>
                              <Typography variant="body2" fontWeight="500">
                                {expense.description}
                              </Typography>
                              {expense.subEventId && (
                                <Chip
                                  label={
                                    event.subEvents.find(se => se._id === expense.subEventId)?.name || 'Sub-Event'
                                  }
                                  size="small"
                                  sx={{ mt: 0.5, height: 20 }}
                                />
                              )}
                            </Box>
                          </TableCell>
                          {!isMobile && (
                            <TableCell>
                              <Chip
                                label={expense.category}
                                size="small"
                                variant="outlined"
                                sx={{ height: 24 }}
                              />
                            </TableCell>
                          )}
                          <TableCell>
                            <Typography 
                              variant="body2" 
                              fontWeight="600"
                              color="primary.main"
                            >
                              {formatCurrency(expense.amount)}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleDeleteExpense(expense._id)}
                              sx={{ 
                                border: `1px solid ${theme.palette.divider}`,
                                '&:hover': {
                                  backgroundColor: alpha(theme.palette.error.main, 0.1),
                                }
                              }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </Card>
        )}

        {/* Sub-Events Tab */}
        {activeTab === 1 && (
          <Box sx={{ 
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              lg: 'repeat(3, 1fr)',
            },
            gap: { xs: 2, sm: 3 },
          }}>
            {event.subEvents.map((subEvent) => {
              const subEventPercentage = subEvent.budget > 0 
                ? Math.round((subEvent.spentAmount / subEvent.budget) * 100) 
                : 0;

              return (
                <Card 
                  key={subEvent._id}
                  sx={{ 
                    height: '100%',
                    border: `1px solid ${theme.palette.divider}`,
                    '&:hover': {
                      boxShadow: theme.shadows[4],
                      transform: 'translateY(-2px)',
                      transition: 'all 0.3s ease',
                    }
                  }}
                >
                  <CardContent sx={{ p: { xs: 2, sm: 2.5 } }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <FolderIcon color="primary" />
                      <Typography variant="h6" fontWeight="bold" sx={{ flex: 1 }}>
                        {subEvent.name}
                      </Typography>
                    </Box>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ 
                        mb: 2,
                        wordBreak: 'break-word',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {subEvent.description}
                    </Typography>

                    {/* Budget Progress */}
                    {subEvent.budget > 0 && (
                      <Box sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                          <Typography variant="body2" fontWeight="medium">
                            Budget
                          </Typography>
                          <Typography 
                            variant="body2" 
                            fontWeight="bold"
                            color={subEventPercentage > 100 ? "error.main" : "primary.main"}
                          >
                            {subEventPercentage}%
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={Math.min(subEventPercentage, 100)}
                          sx={{
                            height: 6,
                            borderRadius: 3,
                            backgroundColor: alpha(theme.palette.primary.main, 0.1),
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: subEventPercentage > 100 ? theme.palette.error.main : theme.palette.primary.main,
                              borderRadius: 3,
                            }
                          }}
                        />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                          <Typography variant="caption" color="text.secondary">
                            {formatCurrency(subEvent.spentAmount)} / {formatCurrency(subEvent.budget)}
                          </Typography>
                        </Box>
                      </Box>
                    )}

                    {/* Status */}
                    <Chip
                      label={subEvent.status}
                      size="small"
                      color={
                        subEvent.status === "completed"
                          ? "success"
                          : subEvent.status === "in-progress"
                          ? "primary"
                          : "default"
                      }
                      sx={{ mt: 1 }}
                    />
                  </CardContent>
                </Card>
              );
            })}

            {event.subEvents.length === 0 && (
              <Card sx={{ 
                gridColumn: '1 / -1', 
                textAlign: 'center', 
                py: 6,
                px: 2 
              }}>
                <FolderIcon
                  sx={{
                    fontSize: { xs: 48, sm: 64 },
                    color: 'text.secondary',
                    mb: 2,
                    opacity: 0.5
                  }}
                />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No sub-events created yet
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Organize your event into smaller sub-events
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setAddSubEventDialog(true)}
                  size={isMobile ? "medium" : "large"}
                >
                  Create Sub-Event
                </Button>
              </Card>
            )}
          </Box>
        )}

        {/* Summary Tab */}
        {activeTab === 2 && (
          <Card sx={{ borderRadius: 2 }}>
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Event Summary
              </Typography>
              <Box sx={{ 
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: 'repeat(2, 1fr)',
                  md: 'repeat(3, 1fr)',
                },
                gap: 3,
                mt: 2
              }}>
                <Box sx={{ p: 2, bgcolor: alpha(theme.palette.primary.main, 0.05), borderRadius: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Total Budget
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {formatCurrency(event.totalBudget)}
                  </Typography>
                </Box>
                <Box sx={{ p: 2, bgcolor: alpha(theme.palette.info.main, 0.05), borderRadius: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Total Spent
                  </Typography>
                  <Typography variant="h4" fontWeight="bold" color="primary.main">
                    {formatCurrency(event.totalSpent)}
                  </Typography>
                </Box>
                <Box sx={{ p: 2, bgcolor: alpha(theme.palette.success.main, 0.05), borderRadius: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Remaining Budget
                  </Typography>
                  <Typography 
                    variant="h4" 
                    fontWeight="bold"
                    color={event.totalBudget - event.totalSpent < 0 ? "error.main" : "success.main"}
                  >
                    {formatCurrency(event.totalBudget - event.totalSpent)}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        )}
      </Box>

      {/* Add Expense Dialog */}
      <Dialog 
        open={addExpenseDialog} 
        onClose={() => setAddExpenseDialog(false)} 
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
              Add New Expense
            </Typography>
            {isMobile && (
              <IconButton onClick={() => setAddExpenseDialog(false)} size="small">
                <ArrowBackIcon />
              </IconButton>
            )}
          </Box>
        </DialogTitle>
        <form onSubmit={handleAddExpense}>
          <DialogContent sx={{ p: { xs: 2, sm: 3 } }}>
            <Stack spacing={3}>
              <TextField
                label="Description *"
                value={expenseForm.description}
                onChange={(e) =>
                  setExpenseForm((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                required
                fullWidth
                size={isMobile ? "small" : "medium"}
              />

              <TextField
                label="Amount (₹) *"
                type="number"
                value={expenseForm.amount}
                onChange={(e) =>
                  setExpenseForm((prev) => ({
                    ...prev,
                    amount: parseFloat(e.target.value) || 0,
                  }))
                }
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
                value={expenseForm.category}
                onChange={(e) =>
                  setExpenseForm((prev) => ({
                    ...prev,
                    category: e.target.value,
                  }))
                }
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
                value={expenseForm.subEventId || ""}
                onChange={(e) =>
                  setExpenseForm((prev) => ({
                    ...prev,
                    subEventId: e.target.value || undefined,
                  }))
                }
                fullWidth
                size={isMobile ? "small" : "medium"}
              >
                <MenuItem value="">None</MenuItem>
                {event.subEvents.map((subEvent) => (
                  <MenuItem key={subEvent._id} value={subEvent._id}>
                    {subEvent.name}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                label="Date"
                type="date"
                value={expenseForm.date}
                onChange={(e) =>
                  setExpenseForm((prev) => ({
                    ...prev,
                    date: e.target.value,
                  }))
                }
                fullWidth
                size={isMobile ? "small" : "medium"}
                InputLabelProps={{ shrink: true }}
              />

              <TextField
                label="Notes (Optional)"
                value={expenseForm.notes}
                onChange={(e) =>
                  setExpenseForm((prev) => ({
                    ...prev,
                    notes: e.target.value,
                  }))
                }
                multiline
                rows={2}
                fullWidth
                size={isMobile ? "small" : "medium"}
              />
            </Stack>
          </DialogContent>
          <DialogActions sx={{ 
            p: { xs: 2, sm: 3 },
            borderTop: `1px solid ${theme.palette.divider}`
          }}>
            {!isMobile && (
              <Button onClick={() => setAddExpenseDialog(false)}>
                Cancel
              </Button>
            )}
            <Button
              type="submit"
              variant="contained"
              fullWidth={isMobile}
              size={isMobile ? "large" : "medium"}
              disabled={
                !expenseForm.description ||
                !expenseForm.amount ||
                !expenseForm.category
              }
            >
              Add Expense
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Add Sub-Event Dialog */}
      <Dialog
        open={addSubEventDialog}
        onClose={() => setAddSubEventDialog(false)}
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
              <IconButton onClick={() => setAddSubEventDialog(false)} size="small">
                <ArrowBackIcon />
              </IconButton>
            )}
          </Box>
        </DialogTitle>
        <form onSubmit={handleAddSubEvent}>
          <DialogContent sx={{ p: { xs: 2, sm: 3 } }}>
            <Stack spacing={3}>
              <TextField
                label="Sub-Event Name *"
                value={subEventForm.name}
                onChange={(e) =>
                  setSubEventForm((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
                required
                fullWidth
                size={isMobile ? "small" : "medium"}
              />

              <TextField
                label="Description"
                value={subEventForm.description}
                onChange={(e) =>
                  setSubEventForm((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                multiline
                rows={2}
                fullWidth
                size={isMobile ? "small" : "medium"}
              />

              <TextField
                label="Budget (₹)"
                type="number"
                value={subEventForm.budget}
                onChange={(e) =>
                  setSubEventForm((prev) => ({
                    ...prev,
                    budget: parseFloat(e.target.value) || 0,
                  }))
                }
                fullWidth
                size={isMobile ? "small" : "medium"}
                InputProps={{
                  startAdornment: <Typography sx={{ mr: 1 }}>₹</Typography>,
                }}
              />
            </Stack>
          </DialogContent>
          <DialogActions sx={{ 
            p: { xs: 2, sm: 3 },
            borderTop: `1px solid ${theme.palette.divider}`
          }}>
            {!isMobile && (
              <Button onClick={() => setAddSubEventDialog(false)}>
                Cancel
              </Button>
            )}
            <Button
              type="submit"
              variant="contained"
              fullWidth={isMobile}
              size={isMobile ? "large" : "medium"}
              disabled={!subEventForm.name}
            >
              Add Sub-Event
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </MainLayout>
  );
}