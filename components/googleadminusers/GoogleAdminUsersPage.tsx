// app/admin/users/page.tsx

'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Alert } from '@mui/material';
import {
  GoogleUsersHeader,
  GoogleUsersStats,
  GoogleUsersFilters,
  GoogleUsersTable,
  EditUserDialog,
  GoogleUsersSkeleton,
  User,
  UsersStats,
} from '@/components/googleadminusers';
import { useUsersData } from '@/hooks/useUsersData';

export default function AdminUsersPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [planFilter, setPlanFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editForm, setEditForm] = useState({
    role: '',
    isActive: true,
    plan: '',
    status: '',
  });

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

  useEffect(() => {
    if (authError) {
      router.push('/admin/login');
    }
  }, [authError, router]);

  const handleEditUser = useCallback((user: User) => {
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
    setPage(1);
  }, []);

  const handleFilterChange = useCallback((filterType: string, value: string) => {
    setPage(1);
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
    return <GoogleUsersSkeleton />;
  }

  return (
    <Box sx={{ p: 3 }}>
      <GoogleUsersHeader
        title="User Management"
        subtitle="Manage user accounts and subscriptions"
        onRefresh={refresh}
        loading={loading}
      />

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => {}}>
          {error}
        </Alert>
      )}

      {stats && (
        <Box sx={{ mb: 3 }}>
          <GoogleUsersStats stats={stats} />
        </Box>
      )}

      <Box sx={{ mb: 3 }}>
        <GoogleUsersFilters
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

      <Box sx={{ mb: 3 }}>
        <GoogleUsersTable
          users={users}
          loading={loading}
          currentPage={page}
          totalPages={pagination.pages}
          onPageChange={setPage}
          onEditUser={handleEditUser}
          onToggleStatus={toggleUserStatus}
        />
      </Box>

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