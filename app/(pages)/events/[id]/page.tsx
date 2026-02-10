"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Box,
  Typography,
  Container,
  useTheme,
  useMediaQuery,
  alpha,
  CircularProgress,
  Breadcrumbs,
  Link as MuiLink,
} from "@mui/material";
import {
  ArrowBack,
  Home as HomeIcon,
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
import Link from "next/link";

// Import Google-themed components
import { Alert } from '@/components/ui/Alert';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Tabs } from '@/components/ui/Tabs3';
import { Chip } from '@/components/ui/Chip';

export default function EventDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const darkMode = theme.palette.mode === 'dark';

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
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '60vh',
          backgroundColor: darkMode ? '#202124' : '#ffffff',
        }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" sx={{ color: darkMode ? '#e8eaed' : '#202124', mb: 2 }}>
              Loading event details...
            </Typography>
            <CircularProgress sx={{ color: '#4285f4' }} />
          </Box>
        </Box>
      </MainLayout>
    );
  }

  if (!event) {
    return (
      <MainLayout title="Event Not Found">
        <Box sx={{ 
          p: 3, 
          textAlign: "center",
          backgroundColor: darkMode ? '#202124' : '#ffffff',
          minHeight: '100vh',
        }}>
          <Alert 
            severity="error"
            title="Event Not Found"
            message="The event you're looking for doesn't exist or you don't have permission to view it."
            dismissible={false}
            sx={{ mb: 3, maxWidth: 500, mx: 'auto' }}
          />
          <Button
            variant="contained"
            onClick={() => router.push("/events")}
            iconLeft={<ArrowBack />}
            size="medium"
            sx={{ 
              backgroundColor: '#4285f4',
              '&:hover': { backgroundColor: '#3367d6' }
            }}
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
        backgroundColor: darkMode ? '#202124' : '#ffffff',
        color: darkMode ? '#e8eaed' : '#202124',
        minHeight: '100vh',
      }}>
        {/* Header */}
        <Box sx={{ 
          p: { xs: 1, sm: 2, md: 3 },
          borderBottom: darkMode ? '1px solid #3c4043' : '1px solid #dadce0',
          background: darkMode 
            ? 'linear-gradient(135deg, #0d3064 0%, #202124 100%)'
            : 'linear-gradient(135deg, #e3f2fd 0%, #ffffff 100%)',
        }}>
          <Breadcrumbs sx={{ 
            mb: { xs: 1, sm: 2 }, 
            fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.85rem' } 
          }}>
            <MuiLink 
              component={Link} 
              href="/dashboard" 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                textDecoration: 'none', 
                color: darkMode ? '#9aa0a6' : '#5f6368', 
                fontWeight: 300, 
                "&:hover": { color: darkMode ? '#8ab4f8' : '#1a73e8' } 
              }}
            >
              <HomeIcon sx={{ mr: 0.5, fontSize: { xs: '14px', sm: '16px', md: '18px' } }} />
              Dashboard
            </MuiLink>
            <MuiLink 
              component={Link} 
              href="/events" 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                textDecoration: 'none', 
                color: darkMode ? '#9aa0a6' : '#5f6368', 
                fontWeight: 300, 
                "&:hover": { color: darkMode ? '#8ab4f8' : '#1a73e8' } 
              }}
            >
              Events
            </MuiLink>
            <Typography color={darkMode ? '#e8eaed' : '#202124'} fontWeight={400}>
              {event.name}
            </Typography>
          </Breadcrumbs>
        </Box>

        {/* Main Content */}
        <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 3, md: 4 } }}>
          {/* Alerts */}
          <Box sx={{ mb: { xs: 2, sm: 3, md: 4 } }}>
            {error && (
              <Alert 
                severity="error"
                title="Error"
                message={error}
                dismissible
                onDismiss={() => setError("")}
              />
            )}
            {success && (
              <Alert 
                severity="success"
                title="Success"
                message={success}
                dismissible
                onDismiss={() => setSuccess("")}
              />
            )}
          </Box>

          {/* Mobile Menu */}
          <MobileMenu 
            open={showMobileMenu}
            onClose={() => setShowMobileMenu(false)}
            event={event}
            onAddSubEvent={() => { setAddSubEventDialog(true); setShowMobileMenu(false); }}
            onAddExpense={() => { setAddExpenseDialog(true); setShowMobileMenu(false); }}
          />

          {/* Event Header Card */}
          <EventHeader
            event={event}
            isMobile={isMobile}
            onAddSubEvent={() => setAddSubEventDialog(true)}
            onAddExpense={() => setAddExpenseDialog(true)}
            darkMode={darkMode}
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
                onClick={() => setAddSubEventDialog(true)}
                size="medium"
                sx={{ 
                  borderColor: darkMode ? '#3c4043' : '#dadce0',
                  color: darkMode ? '#e8eaed' : '#202124',
                  '&:hover': {
                    borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                    backgroundColor: darkMode ? 'rgba(138, 180, 248, 0.08)' : 'rgba(26, 115, 232, 0.04)',
                  }
                }}
              >
                <FolderIcon style={{ marginRight: 8, fontSize: 18 }} />
                Sub-Event
              </Button>
              <Button
                variant="contained"
                onClick={() => setAddExpenseDialog(true)}
                size="medium"
                sx={{ 
                  backgroundColor: '#34a853',
                  '&:hover': { backgroundColor: '#2d9248' }
                }}
              >
                Add Expense
              </Button>
            </Box>
          )}

          {/* Tabs Card */}
          <Card 
            hover
            sx={{ 
              mb: 3,
              backgroundColor: darkMode ? '#303134' : '#ffffff',
              border: darkMode ? '1px solid #3c4043' : '1px solid #dadce0',
            }}
          >
            <Tabs
              tabs={[
                { 
                  label: `Expenses`, 
                  icon: <ReceiptIcon size={16} />, 
                  count: event.expenses.length,
                  badgeColor: 'primary' as const 
                },
                { 
                  label: `Sub-Events`, 
                  icon: <FolderIcon size={16} />, 
                  count: event.subEvents.length,
                  badgeColor: 'secondary' as const 
                },
                { 
                  label: `Summary`, 
                  icon: <PieChartIcon size={16} />,
                  badgeColor: 'info' as const 
                },
              ]}
              value={activeTab}
              onChange={(e: any, newValue: number) => setActiveTab(newValue)}
              variant={isMobile ? "scrollable" : "standard"}
            />
          </Card>

          {/* Content based on active tab */}
          {activeTab === 0 && (
            <Card 
              hover
              sx={{ 
                backgroundColor: darkMode ? '#303134' : '#ffffff',
                border: darkMode ? '1px solid #3c4043' : '1px solid #dadce0',
                overflow: 'hidden',
              }}
            >
              <ExpenseTable
                expenses={event.expenses}
                subEvents={event.subEvents}
                filter={expenseFilter}
                isMobile={isMobile}
                onDeleteExpense={handleDeleteExpense}
                onAddExpense={() => setAddExpenseDialog(true)}
                darkMode={darkMode}
              />
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
                darkMode={darkMode}
              />
            </Box>
          )}

          {activeTab === 2 && (
            <EventSummary 
              event={event} 
              darkMode={darkMode}
            />
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
            darkMode={darkMode}
          />

          <AddSubEventDialog
            open={addSubEventDialog}
            isMobile={isMobile}
            formData={subEventForm}
            onClose={() => setAddSubEventDialog(false)}
            onSubmit={handleAddSubEvent}
            onChange={(field, value) => setSubEventForm(prev => ({ ...prev, [field]: value }))}
            darkMode={darkMode}
          />
        </Container>
      </Box>
    </MainLayout>
  );
}