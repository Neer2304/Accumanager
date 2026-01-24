// app/(pages)/team-dashboard/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { Box, Alert, Button } from '@mui/material';
import { MainLayout } from '@/components/Layout/MainLayout';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Construction, Info } from '@mui/icons-material';
import { DevelopmentNotice } from '@/components/team-dashboards/DevelopmentNotice';
import { DemoModeIndicator } from '@/components/team-dashboards/DemoModeIndicator';
import { DashboardHeader } from '@/components/team-dashboards/DashboardHeader';
import { SummaryStats } from '@/components/team-dashboards/SummaryStats';
import { FeatureStatusBar } from '@/components/team-dashboards/FeatureStatusBar';
import { DashboardTabs } from '@/components/team-dashboards/DashboardTabs';
import { TeamOverviewTab } from '@/components/team-dashboards/tabs/TeamOverviewTab';
import { TaskManagementTab } from '@/components/team-dashboards/tabs/TaskManagementTab';
import { PerformanceTab } from '@/components/team-dashboards/tabs/PerformanceTab';
import { AssignTaskDialog } from '@/components/team-dashboards/dialogs/AssignTaskDialog';
import { ViewTasksDialog } from '@/components/team-dashboards/dialogs/ViewTasksDialog';

// Import types and hooks
import { EmployeeData, DashboardSummary } from '@/components/team-dashboards/types';
import { useDashboardData } from '@/components/team-dashboards/hooks/useDashboardData';

export default function TeamDashboardPage() {
  const {
    loading,
    error,
    summary,
    employees,
    selectedTab,
    assignDialogOpen,
    viewDialogOpen,
    selectedEmployee,
    selectedTask,
    assignForm,
    isDemoMode,
    showDemoAlert,
    availableEmployees,
    setSelectedTab,
    setAssignDialogOpen,
    setViewDialogOpen,
    setSelectedEmployee,
    setSelectedTask,
    setAssignForm,
    setIsDemoMode,
    setShowDemoAlert,
    setError,
    fetchDashboardData,
    fetchEmployeeData,
    loadDemoData,
    handleAssignTask,
    getEmployeeTasks
  } = useDashboardData();

  const [tabs] = useState([
    { label: 'Team Overview', icon: 'Person' },
    { label: 'Task Management', icon: 'AssignmentTurnedIn' },
    { label: 'Performance', icon: 'BarChart' }
  ]);

  if (loading) {
    return (
      <MainLayout title="Team Dashboard (Preview)">
        <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
          Loading...
        </Box>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Team Dashboard (Preview)">
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Box sx={{ p: 3, maxWidth: 1400, margin: '0 auto' }}>
          
          {/* Development Notice */}
          {showDemoAlert && (
            <DevelopmentNotice 
              onClose={() => setShowDemoAlert(false)}
              isDemoMode={isDemoMode}
            />
          )}

          {/* Demo Mode Indicator */}
          {isDemoMode && (
            <DemoModeIndicator 
              onExitDemo={() => setIsDemoMode(false)}
            />
          )}

          {/* Header */}
          <DashboardHeader 
            isDemoMode={isDemoMode}
            onAssignTask={() => setAssignDialogOpen(true)}
            onRefresh={fetchDashboardData}
            onLoadDemo={loadDemoData}
          />

          {/* Summary Stats */}
          <SummaryStats 
            summary={summary}
            employees={employees}
          />

          {/* Error Alert */}
          {error && (
            <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          {/* Feature Status Bar */}
          <FeatureStatusBar />

          {/* Tabs */}
          <DashboardTabs 
            tabs={tabs}
            selectedTab={selectedTab}
            onTabChange={setSelectedTab}
          />

          {/* Tab Content */}
          {selectedTab === 0 && (
            <TeamOverviewTab 
              employees={employees}
              isDemoMode={isDemoMode}
              onViewTasks={getEmployeeTasks}
            />
          )}

          {selectedTab === 1 && (
            <TaskManagementTab 
              employees={employees}
              isDemoMode={isDemoMode}
              onAssignTask={() => setAssignDialogOpen(true)}
            />
          )}

          {selectedTab === 2 && (
            <PerformanceTab 
              employees={employees}
              isDemoMode={isDemoMode}
              onLoadDemo={() => setIsDemoMode(true)}
            />
          )}
        </Box>

        {/* Dialogs */}
        <AssignTaskDialog 
          open={assignDialogOpen}
          onClose={() => setAssignDialogOpen(false)}
          assignForm={assignForm}
          onAssignFormChange={setAssignForm}
          availableEmployees={availableEmployees}
          isDemoMode={isDemoMode}
          onAssignTask={handleAssignTask}
        />

        <ViewTasksDialog 
          open={viewDialogOpen}
          onClose={() => setViewDialogOpen(false)}
          employee={selectedEmployee}
          isDemoMode={isDemoMode}
          onAssignTask={(employeeId) => {
            setAssignForm({ ...assignForm, assignedTo: employeeId });
            setViewDialogOpen(false);
            setAssignDialogOpen(true);
          }}
        />
      </LocalizationProvider>
    </MainLayout>
  );
}