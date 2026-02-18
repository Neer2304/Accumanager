// components/googlecompanydashboard/hooks/useCompanyDashboard.ts
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useCompany } from '@/lib/companyContext';
import { companyService } from '@/services/companyService';

interface Company {
  _id: string;
  name: string;
  email: string;
  industry?: string;
  size: string;
  userRole: string;
  memberCount: number;
  maxMembers: number;
  plan?: string;
}

interface Stats {
  projects: number;
  tasks: number;
  members: number;
}

export function useCompanyDashboard() {
  const params = useParams();
  const router = useRouter();
  const companyId = params.id as string;
  
  const { companies, setCurrentCompany } = useCompany();
  const company = companies.find((c: any) => c._id === companyId) as Company | undefined;
  
  const [stats, setStats] = useState<Stats>({
    projects: 0,
    tasks: 0,
    members: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (company) {
      setCurrentCompany(company);
      fetchStats();
    } else {
      setLoading(false);
    }
  }, [company]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await companyService.getCompanyStats(companyId);
      if (res.success) {
        setStats(res.stats);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
      setError('Failed to load company statistics');
    } finally {
      setLoading(false);
    }
  };

  const navigateTo = (path: string) => {
    router.push(path);
  };

  const isAdmin = company?.userRole === 'admin';

  return {
    company,
    companyId,
    stats,
    loading,
    error,
    isAdmin,
    navigateTo,
    router
  };
}