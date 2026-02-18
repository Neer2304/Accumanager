// components/googleleads/hooks/useLeads.ts
import { useState, useCallback } from 'react';
import { Lead } from '../types';
import { useRouter } from 'next/navigation';

interface UseLeadsProps {
  companyId: string;
  statusFilter?: string;
  sourceFilter?: string;
  searchQuery?: string;
}

export function useLeads({ companyId, statusFilter, sourceFilter, searchQuery }: UseLeadsProps) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<any[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 100,
    total: 0,
    pages: 0
  });

  const router = useRouter();

  const fetchLeads = useCallback(async () => {
    if (!companyId) return;

    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams();
      params.append('companyId', companyId);
      if (statusFilter && statusFilter !== 'all') params.append('status', statusFilter);
      if (sourceFilter && sourceFilter !== 'all') params.append('source', sourceFilter);
      if (searchQuery) params.append('search', searchQuery);
      params.append('limit', '100');
      params.append('page', '1');
      
      const response = await fetch(`/api/leads?${params.toString()}`, {
        method: "GET",
        credentials: 'include',
        headers: { "Content-Type": "application/json" }
      });

      if (response.status === 401) {
        router.push("/auth/login");
        return;
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to fetch leads");
      }

      const data = await response.json();
      console.log('API Response:', data);
      
      setLeads(data.leads || []);
      setStats(data.stats || []);
      setPagination(data.pagination || {
        page: 1,
        limit: 100,
        total: data.leads?.length || 0,
        pages: 1
      });
      
    } catch (err: any) {
      console.error('Error fetching leads:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [companyId, statusFilter, sourceFilter, searchQuery, router]);

  // Helper function to get count by status
  const getStatusCount = (status: string): number => {
    const stat = stats.find(s => s.status === status);
    return stat?.count || 0;
  };

  // Calculate conversion rate
  const getConversionRate = (): number => {
    if (leads.length === 0) return 0;
    const converted = getStatusCount('converted');
    return Math.round((converted / leads.length) * 100);
  };

  return {
    leads,
    setLeads,
    loading,
    error,
    stats,
    pagination,
    setPagination,
    fetchLeads,
    setError,
    getStatusCount,
    getConversionRate
  };
}