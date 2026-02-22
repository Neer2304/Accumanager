// hooks/useAbout.ts/ main use this 
import { useState, useEffect, useCallback } from 'react';
import { AboutService, AboutData, AboutReview, AboutSummary } from '@/services/aboutService';

interface UseAboutReturn {
  // State
  reviews: AboutReview[];
  summary: AboutSummary | null;
  loading: boolean;
  error: string | null;
  
  // Actions
  loadAboutData: () => Promise<void>;
  refreshData: () => Promise<void>;
  
  // Helpers
  getRatingPercentage: (rating: number) => number;
  getStarArray: (rating: number) => ('full' | 'half' | 'empty')[];
  formatDate: (date: string) => string;
}

export const useAbout = (autoLoad: boolean = true): UseAboutReturn => {
  const [reviews, setReviews] = useState<AboutReview[]>([]);
  const [summary, setSummary] = useState<AboutSummary | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadAboutData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await AboutService.getAboutData();
      
      setReviews(data.reviews);
      setSummary(data.summary);
    } catch (err: any) {
      setError(err.message || 'Failed to load about data');
      console.error('About data error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshData = useCallback(async () => {
    await loadAboutData();
  }, [loadAboutData]);

  useEffect(() => {
    if (autoLoad) {
      loadAboutData();
    }
  }, [autoLoad, loadAboutData]);

  return {
    // State
    reviews,
    summary,
    loading,
    error,
    
    // Actions
    loadAboutData,
    refreshData,
    
    // Helpers
    getRatingPercentage: AboutService.getRatingPercentage,
    getStarArray: AboutService.getStarArray,
    formatDate: AboutService.formatDate,
  };
};