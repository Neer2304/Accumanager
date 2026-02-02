// hooks/useTeamPerformance.ts
import { useState, useCallback, useEffect } from 'react';

interface TeamMemberPerformance {
  id: string;
  name: string;
  role: string;
  department: string;
  avatar?: string;
  performance: number;
  tasksCompleted: number;
  projectsInvolved: number;
  efficiency: number;
  lastActive: string;
  workload: number;
  trends: {
    daily: Array<{ date: string; score: number }>;
    weekly: Array<{ week: string; tasks: number }>;
  };
  strengths: string[];
  areasForImprovement: string[];
}

export function useTeamPerformance() {
  const [performance, setPerformance] = useState<TeamMemberPerformance[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [range, setRange] = useState<'week' | 'month' | 'quarter'>('week');
  const [stats, setStats] = useState<any>(null);

  // Fetch team performance
  const fetchTeamPerformance = useCallback(async (timeRange: 'week' | 'month' | 'quarter' = range) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/team/performance?range=${timeRange}`, {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch team performance: ${response.status}`);
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch team performance');
      }

      setPerformance(result.data || []);
      setStats(result.statistics || null);
      setRange(timeRange);
      setLoading(false);

    } catch (err: any) {
      console.error('Fetch team performance error:', err);
      setError(err.message || 'Failed to load team performance');
      setLoading(false);
    }
  }, [range]);

  // Fetch individual team member performance
  const fetchMemberPerformance = useCallback(async (memberId: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/team/members/${memberId}/performance`, {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch member performance: ${response.status}`);
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch member performance');
      }

      setLoading(false);
      return result.data || null;

    } catch (err: any) {
      console.error('Fetch member performance error:', err);
      setError(err.message || 'Failed to load member performance');
      setLoading(false);
      return null;
    }
  }, []);

  // Update performance range
  const updateRange = useCallback((newRange: 'week' | 'month' | 'quarter') => {
    setRange(newRange);
    fetchTeamPerformance(newRange);
  }, [fetchTeamPerformance]);

  // Auto-fetch on mount
  useEffect(() => {
    fetchTeamPerformance();
  }, [fetchTeamPerformance]);

  return {
    performance,
    stats,
    loading,
    error,
    range,
    fetchTeamPerformance,
    fetchMemberPerformance,
    updateRange,
  };
}