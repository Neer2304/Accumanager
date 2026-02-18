// components/googlecompanies/hooks/useCompanies.ts
import { useState, useEffect, useCallback } from 'react';
import { useCompany } from '@/lib/companyContext';
import { companyService } from '@/services/companyService';

interface Company {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  industry?: string;
  size: string;
  logo?: string;
  userRole: string;
  memberCount: number;
  maxMembers: number;
  plan: string;
  createdAt: string;
  website?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    zipCode?: string;
  };
}

export function useCompanies() {
  const { companies, loading, refreshCompanies, canCreateMore, limits } = useCompany();
  const [searchQuery, setSearchQuery] = useState('');
  const [planFilter, setPlanFilter] = useState('all');
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Filter companies
  useEffect(() => {
    let filtered = [...companies];
    
    if (searchQuery) {
      filtered = filtered.filter(company =>
        company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        company.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        company.industry?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (planFilter !== 'all') {
      filtered = filtered.filter(company => company.plan === planFilter);
    }
    
    setFilteredCompanies(filtered);
  }, [companies, searchQuery, planFilter]);

  const handleDelete = useCallback(async (companyId: string) => {
    try {
      setDeleting(companyId);
      setError(null);
      const res = await companyService.deleteCompany(companyId);
      if (res.success) {
        await refreshCompanies();
        return true;
      }
      return false;
    } catch (error: any) {
      setError(error.message || 'Failed to delete company');
      return false;
    } finally {
      setDeleting(null);
    }
  }, [refreshCompanies]);

  const stats = [
    { 
      label: 'Total Companies', 
      value: companies.length, 
      icon: 'business'
    },
    { 
      label: 'Available Slots', 
      value: limits.remaining, 
      icon: 'storage'
    },
    { 
      label: 'Total Members', 
      value: companies.reduce((acc, c) => acc + (c.memberCount || 1), 0), 
      icon: 'people'
    }
  ];

  return {
    companies,
    filteredCompanies,
    loading,
    error,
    setError,
    deleting,
    selectedCompany,
    setSelectedCompany,
    searchQuery,
    setSearchQuery,
    planFilter,
    setPlanFilter,
    canCreateMore,
    limits,
    stats,
    handleDelete,
    refreshCompanies
  };
}