"use client";

import React, { useState } from 'react';
import {
  Box,
  Alert,
  Paper,
  Tabs,
  Tab,
  useTheme,
  useMediaQuery,
  alpha,
  CircularProgress,
  Chip,
  Typography,
  Button,
} from '@mui/material';
import { Assignment } from '@mui/icons-material';
import { MainLayout } from '@/components/Layout/MainLayout';
import {
  TaskHeader,
  TaskGrid,
  TaskStats,
  TaskFilters,
  UpdateTaskDialog,
  MobileFilters,
  useEmployeeTasks,
} from '@/components/tasks/employee';
import { calculateTaskStats } from '@/components/tasks/shared/utils';

export default function EmployeeTasksPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  const [selectedTab, setSelectedTab] = useState(0);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [updateForm, setUpdateForm] = useState({
    progress: 0,
    hoursWorked: 0,
    description: '',
  });
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [sortBy, setSortBy] = useState('dueDate');
  const [filterPriority, setFilterPriority] = useState('all');

  const {
    tasks,
    loading,
    error,
    refetch,
    updateTask,
    setError,
  } = useEmployeeTasks();

  const stats = calculateTaskStats(tasks);

  const filteredTasks = tasks
    .filter((task) => {
      if (selectedTab === 0) return true; // All
      if (selectedTab === 1) return task.status === 'assigned';
      if (selectedTab === 2) return task.status === 'in_progress';
      if (selectedTab === 3) return task.status === 'completed';
      return true;
    })
    .filter((task) => {
      if (filterPriority === 'all') return true;
      return task.priority === filterPriority;
    })
    .sort((a, b) => {
      if (sortBy === 'dueDate') return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      if (sortBy === 'priority') {
        const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      return 0;
    });

  const handleUpdateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTask) return;

    const success = await updateTask(selectedTask._id, updateForm);
    if (success) {
      setUpdateDialogOpen(false);
      setSelectedTask(null);
      setUpdateForm({ progress: 0, hoursWorked: 0, description: '' });
      refetch();
    }
  };

  const handleUpdateClick = (task: any) => {
    setSelectedTask(task);
    setUpdateForm({
      progress: task.progress,
      hoursWorked: 0,
      description: '',
    });
    setUpdateDialogOpen(true);
  };

  if (loading) {
    return (
      <MainLayout title="My Tasks">
        <Box
          sx={{
            p: 3,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '60vh',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          <CircularProgress size={isMobile ? 40 : 60} />
          <Typography variant="h6" color="text.secondary">
            Loading your tasks...
          </Typography>
        </Box>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="My Tasks">
      <Box
        sx={{
          p: { xs: 1.5, sm: 2, md: 3 },
          minHeight: '100vh',
        }}
      >
        {/* Mobile Filters Drawer */}
        <MobileFilters
          open={showMobileFilters}
          onClose={() => setShowMobileFilters(false)}
          sortBy={sortBy}
          filterPriority={filterPriority}
          onSortChange={setSortBy}
          onFilterChange={setFilterPriority}
          stats={stats}
        />

        {/* Header */}
        <Paper
          sx={{
            p: { xs: 2, sm: 3 },
            mb: 3,
            borderRadius: 2,
            background: isMobile
              ? 'transparent'
              : `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(
                  theme.palette.primary.main,
                  0.05
                )} 100%)`,
            boxShadow: isMobile ? 'none' : theme.shadows[1],
            border: isMobile ? `1px solid ${theme.palette.divider}` : 'none',
          }}
        >
          <TaskHeader
            stats={stats}
            isMobile={isMobile}
            onRefresh={refetch}
            onOpenFilters={() => setShowMobileFilters(true)}
          />
        </Paper>

        {/* Error Alert */}
        {error && (
          <Alert
            severity="error"
            sx={{ mb: 3, borderRadius: 2 }}
            onClose={() => setError(null)}
            action={
              <Button color="inherit" size="small" onClick={refetch}>
                Retry
              </Button>
            }
          >
            {error}
          </Alert>
        )}

        {/* Desktop Stats */}
        {!isMobile && <TaskStats stats={stats} isMobile={isMobile} />}

        {/* Tabs and Filters */}
        <Box sx={{ mb: 3 }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: { xs: 'flex-start', sm: 'center' },
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 2,
              mb: 2,
            }}
          >
            <Box sx={{ width: '100%', overflow: 'auto' }}>
              <Tabs
                value={selectedTab}
                onChange={(e, v) => setSelectedTab(v)}
                variant={isMobile ? 'scrollable' : 'standard'}
                scrollButtons={isMobile ? 'auto' : false}
                sx={{
                  minHeight: 48,
                  '& .MuiTab-root': {
                    fontSize: isMobile ? '0.8rem' : '0.875rem',
                    minHeight: 48,
                    minWidth: { xs: 100, sm: 'auto' },
                  },
                }}
              >
                <Tab
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      All
                      <Chip
                        label={stats.total}
                        size="small"
                        sx={{ height: 20, fontSize: '0.7rem' }}
                      />
                    </Box>
                  }
                />
                <Tab
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      Assigned
                      <Chip
                        label={stats.assigned}
                        size="small"
                        color="warning"
                        sx={{ height: 20, fontSize: '0.7rem' }}
                      />
                    </Box>
                  }
                />
                <Tab
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      In Progress
                      <Chip
                        label={stats.inProgress}
                        size="small"
                        color="info"
                        sx={{ height: 20, fontSize: '0.7rem' }}
                      />
                    </Box>
                  }
                />
                <Tab
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      Completed
                      <Chip
                        label={stats.completed}
                        size="small"
                        color="success"
                        sx={{ height: 20, fontSize: '0.7rem' }}
                      />
                    </Box>
                  }
                />
              </Tabs>
            </Box>

            {/* Desktop Filters */}
            {!isMobile && (
              <TaskFilters
                sortBy={sortBy}
                filterPriority={filterPriority}
                onSortChange={setSortBy}
                onFilterChange={setFilterPriority}
              />
            )}
          </Box>
        </Box>

        {/* Tasks Grid */}
        <TaskGrid
          tasks={filteredTasks}
          isMobile={isMobile}
          onUpdateClick={handleUpdateClick}
          onRefresh={refetch}
          selectedTab={selectedTab}
        />

        {/* Update Task Dialog */}
        <UpdateTaskDialog
          open={updateDialogOpen}
          isMobile={isMobile}
          selectedTask={selectedTask}
          updateForm={updateForm}
          onClose={() => setUpdateDialogOpen(false)}
          onSubmit={handleUpdateTask}
          onChange={(field, value) => setUpdateForm((prev) => ({ ...prev, [field]: value }))}
        />
      </Box>
    </MainLayout>
  );
}