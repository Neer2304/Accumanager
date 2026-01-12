"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Alert, CircularProgress } from '@mui/material';
import { People } from '@mui/icons-material';
import {
  UsersHeader,
  UsersFilters,
  UsersTable,
  EditUserDialog,
  UserStatsCards,
} from '@/components/admin/users';
import { useUsersData } from '@/hooks/useUsersData';

export default function AdminUsersPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [planFilter, setPlanFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [editForm, setEditForm] = useState({
    role: '',
    isActive: true,
    plan: '',
    status: '',
  });

  // Memoize filters to prevent unnecessary re-renders
  const filters = useMemo(() => ({
    role: roleFilter,
    plan: planFilter,
    status: statusFilter,
    search: search.trim(),
  }), [roleFilter, planFilter, statusFilter, search]);

  const {
    data: { users = [], stats = null, pagination = { total: 0, pages: 1, page: 1 } },
    loading,
    error,
    authError,
    refresh,
    updateUser,
    toggleUserStatus,
  } = useUsersData(page, filters);

  // Handle authentication errors
  useEffect(() => {
    if (authError) {
      router.push('/admin/login');
    }
  }, [authError, router]);

  const handleEditUser = useCallback((user: any) => {
    setSelectedUser(user);
    setEditForm({
      role: user.role || '',
      isActive: user.isActive,
      plan: user.subscription?.plan || '',
      status: user.subscription?.status || '',
    });
    setEditDialogOpen(true);
  }, []);

  const handleUpdateUser = useCallback(async () => {
    if (!selectedUser) return;
    
    const success = await updateUser(selectedUser._id, editForm);
    if (success) {
      setEditDialogOpen(false);
    }
  }, [selectedUser, editForm, updateUser]);

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    setPage(1); // Reset to first page when searching
  }, []);

  const handleFilterChange = useCallback((filterType: string, value: string) => {
    setPage(1); // Reset to page 1 when filters change
    switch (filterType) {
      case 'role':
        setRoleFilter(value);
        break;
      case 'plan':
        setPlanFilter(value);
        break;
      case 'status':
        setStatusFilter(value);
        break;
    }
  }, []);

  if (loading && users.length === 0) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '80vh',
        flexDirection: 'column',
        gap: 2 
      }}>
        <CircularProgress size={60} />
        <Box>Loading users...</Box>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <UsersHeader
        title="User Management"
        subtitle="Manage user accounts and subscriptions"
        onRefresh={refresh}
        loading={loading}
      />

      {error && (
        <Alert 
          severity="error" 
          sx={{ mb: 3 }} 
          onClose={() => {}}
        >
          {error}
        </Alert>
      )}

      {/* Stats Cards */}
      {stats && (
        <Box sx={{ mb: 3 }}>
          <UserStatsCards stats={stats} />
        </Box>
      )}

      {/* Filters */}
      <Box sx={{ mb: 3 }}>
        <UsersFilters
          search={search}
          onSearchChange={setSearch}
          roleFilter={roleFilter}
          planFilter={planFilter}
          statusFilter={statusFilter}
          onFilterChange={handleFilterChange}
          onSearchSubmit={handleSearch}
          loading={loading}
        />
      </Box>

      {/* Users Table */}
      <Box sx={{ mb: 3 }}>
        <UsersTable
          users={users}
          loading={loading}
          currentPage={page}
          totalPages={pagination.pages}
          onPageChange={setPage}
          onEditUser={handleEditUser}
          onToggleStatus={toggleUserStatus}
        />
      </Box>

      {/* Edit User Dialog */}
      {selectedUser && (
        <EditUserDialog
          open={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
          user={selectedUser}
          editForm={editForm}
          onEditFormChange={setEditForm}
          onUpdate={handleUpdateUser}
          loading={loading}
        />
      )}
    </Box>
  );
}