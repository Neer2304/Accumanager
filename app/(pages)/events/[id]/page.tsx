"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Box,
  Typography,
  Alert,
  Card,
  CardContent,
  Tabs,
  Tab,
  useTheme,
  useMediaQuery,
  alpha,
  CircularProgress,
  Button,
  Chip,
} from "@mui/material";
import {
  ArrowBack,
} from "@mui/icons-material";
import { MainLayout } from "@/components/Layout/MainLayout";
import {
  EventHeader,
  ExpenseTable,
  SubEventGrid,
  MobileMenu,
  AddExpenseDialog,
  AddSubEventDialog,
  useEventDetails,
  EventSummary,
} from "@/components/events";
import { FolderIcon, PieChartIcon, ReceiptIcon } from "lucide-react";
import { AddIcon } from "@/assets/icons/InventoryIcons";

export default function EventDetailsPage() {
  const params = useParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  const [activeTab, setActiveTab] = useState(0);
  const [addExpenseDialog, setAddExpenseDialog] = useState(false);
  const [addSubEventDialog, setAddSubEventDialog] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [expenseFilter, setExpenseFilter] = useState('all');

  const [expenseForm, setExpenseForm] = useState({
    description: "",
    amount: 0,
    category: "",
    date: new Date().toISOString().split("T")[0],
    subEventId: undefined as string | undefined,
    notes: "",
  });

  const [subEventForm, setSubEventForm] = useState({
    name: "",
    description: "",
    budget: 0,
  });

  const {
    event,
    loading,
    error,
    success,
    setError,
    setSuccess,
    refetch,
    addExpense,
    addSubEvent,
    deleteExpense,
  } = useEventDetails(params.id);

  const router = useRouter();

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await addExpense(expenseForm);
    if (success) {
      setExpenseForm({
        description: "",
        amount: 0,
        category: "",
        date: new Date().toISOString().split("T")[0],
        subEventId: undefined,
        notes: "",
      });
      setAddExpenseDialog(false);
      refetch();
    }
  };

  const handleAddSubEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await addSubEvent(subEventForm);
    if (success) {
      setSubEventForm({
        name: "",
        description: "",
        budget: 0,
      });
      setAddSubEventDialog(false);
      refetch();
    }
  };

  const handleDeleteExpense = async (expenseId: string) => {
    const success = await deleteExpense(expenseId);
    if (success) {
      refetch();
    }
  };

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
            startIcon={<ArrowBack />}
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

  return (
    <MainLayout title={event.name}>
      <Box sx={{ 
        p: { xs: 1.5, sm: 2, md: 3 },
        minHeight: '100vh',
      }}>
        {/* Mobile Menu */}
        <MobileMenu 
          open={showMobileMenu}
          onClose={() => setShowMobileMenu(false)}
          event={event}
          onAddSubEvent={() => { setAddSubEventDialog(true); setShowMobileMenu(false); }}
          onAddExpense={() => { setAddExpenseDialog(true); setShowMobileMenu(false); }}
        />

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

        {/* Event Header */}
        <EventHeader
          event={event}
          isMobile={isMobile}
          onAddSubEvent={() => setAddSubEventDialog(true)}
          onAddExpense={() => setAddExpenseDialog(true)}
        />

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

        {/* Content based on active tab */}
        {activeTab === 0 && (
          <Card sx={{ borderRadius: 2, overflow: 'hidden' }}>
            <CardContent sx={{ p: 0 }}>
              <ExpenseTable
                expenses={event.expenses}
                subEvents={event.subEvents}
                filter={expenseFilter}
                isMobile={isMobile}
                onDeleteExpense={handleDeleteExpense}
                onAddExpense={() => setAddExpenseDialog(true)}
              />
            </CardContent>
          </Card>
        )}

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
            <SubEventGrid
              subEvents={event.subEvents}
              isMobile={isMobile}
              onAddSubEvent={() => setAddSubEventDialog(true)}
            />
          </Box>
        )}

        {activeTab === 2 && (
          <EventSummary event={event} />
        )}

        {/* Dialogs */}
        <AddExpenseDialog
          open={addExpenseDialog}
          isMobile={isMobile}
          subEvents={event.subEvents}
          formData={expenseForm}
          onClose={() => setAddExpenseDialog(false)}
          onSubmit={handleAddExpense}
          onChange={(field, value) => setExpenseForm(prev => ({ ...prev, [field]: value }))}
        />

        <AddSubEventDialog
          open={addSubEventDialog}
          isMobile={isMobile}
          formData={subEventForm}
          onClose={() => setAddSubEventDialog(false)}
          onSubmit={handleAddSubEvent}
          onChange={(field, value) => setSubEventForm(prev => ({ ...prev, [field]: value }))}
        />
      </Box>
    </MainLayout>
  );
}