import { useState, useEffect } from 'react';

export interface TermsSection {
  _id?: string;
  title: string;
  content: string;
  order: number;
  icon: string;
}

export interface ImportantPoint {
  _id?: string;
  text: string;
  order: number;
}

export interface TermsData {
  _id?: string;
  version: string;
  title: string;
  description: string;
  sections: TermsSection[];
  importantPoints: ImportantPoint[];
  effectiveDate: string;
  lastUpdated: string;
  isActive: boolean;
}

export interface UseTermsDataReturn {
  terms: TermsData | null;
  loading: boolean;
  error: string | null;
  fetchTerms: () => Promise<void>;
}

export const useTermsData = (): UseTermsDataReturn => {
  const [terms, setTerms] = useState<TermsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTerms = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/terms');
      
      if (!response.ok) {
        throw new Error('Failed to fetch terms and conditions');
      }
      
      const termsData = await response.json();
      setTerms(termsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching terms:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTerms();
  }, []);

  return {
    terms,
    loading,
    error,
    fetchTerms
  };
};