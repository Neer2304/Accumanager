'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { companyService } from '@/services/companyService';

interface Company {
  _id: string;
  name: string;
  email: string;
  logo?: string;
  userRole: string;
  memberCount: number;
  maxMembers: number;
  plan: string;
}

interface CompanyContextType {
  // State
  companies: Company[];
  currentCompany: Company | null;
  loading: boolean;
  
  // Actions
  setCurrentCompany: (company: Company) => void;
  refreshCompanies: () => Promise<void>;
  
  // Limits
  canCreateMore: boolean;
  limits: {
    current: number;
    max: number;
    remaining: number;
  };
  
  // Helpers
  isAdmin: boolean;
  isManager: boolean;
  canManageMembers: boolean;
}

const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

export function CompanyProvider({ children }: { children: React.ReactNode }) {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [currentCompany, setCurrentCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [limits, setLimits] = useState({
    current: 0,
    max: 2,
    remaining: 2
  });

  // Refresh companies list
  const refreshCompanies = async () => {
    try {
      setLoading(true);
      
      // Fetch companies
      const res = await companyService.getCompanies();
      if (res.success) {
        const companyList = res.companies || [];
        setCompanies(companyList);
        
        // Set current company from localStorage or first company
        const savedCompanyId = localStorage.getItem('activeCompanyId');
        const savedCompany = companyList.find((c: Company) => c._id === savedCompanyId);
        
        if (savedCompany) {
          setCurrentCompany(savedCompany);
        } else if (companyList.length > 0) {
          setCurrentCompany(companyList[0]);
          localStorage.setItem('activeCompanyId', companyList[0]._id);
        }
      }

      // Fetch limits
      const limitRes = await companyService.checkLimits();
      if (limitRes.success) {
        setLimits(limitRes.limits);
      }
    } catch (error) {
      console.error('Failed to fetch companies:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle company switch
  const handleSetCurrentCompany = (company: Company) => {
    setCurrentCompany(company);
    localStorage.setItem('activeCompanyId', company._id);
  };

  // Load initial data
  useEffect(() => {
    refreshCompanies();
  }, []);

  // Compute permissions
  const isAdmin = currentCompany?.userRole === 'admin';
  const isManager = currentCompany?.userRole === 'manager' || isAdmin;
  const canManageMembers = isAdmin; // Only admins can manage members

  return (
    <CompanyContext.Provider value={{
      companies,
      currentCompany,
      loading,
      setCurrentCompany: handleSetCurrentCompany,
      refreshCompanies,
      canCreateMore: limits.remaining > 0,
      limits,
      isAdmin,
      isManager,
      canManageMembers
    }}>
      {children}
    </CompanyContext.Provider>
  );
}

export function useCompany() {
  const context = useContext(CompanyContext);
  if (!context) {
    throw new Error('useCompany must be used within CompanyProvider');
  }
  return context;
}