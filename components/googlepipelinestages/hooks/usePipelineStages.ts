// components/googlepipelinestages/hooks/usePipelineStages.ts
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { PipelineStage, PipelineStats, Member } from '../types';
import { companyService } from '@/services/companyService';

export function usePipelineStages(selectedCompanyId: string) {
  const [stages, setStages] = useState<PipelineStage[]>([]);
  const [filteredStages, setFilteredStages] = useState<PipelineStage[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedStage, setSelectedStage] = useState<PipelineStage | null>(null);
  const [pipelineStats, setPipelineStats] = useState<PipelineStats>({
    totalStages: 0,
    activeStages: 0,
    totalDeals: 0,
    totalValue: 0,
    avgProbability: 0
  });

  const router = useRouter();

  // Fetch members
  const fetchMembers = useCallback(async (companyId: string) => {
    try {
      const res = await companyService.getMembers(companyId);
      if (res.success) {
        setMembers(res.members || []);
      }
    } catch (error) {
      console.error('Error fetching members:', error);
    }
  }, []);

  // Fetch stages
  const fetchStages = useCallback(async () => {
    if (!selectedCompanyId) return;

    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams();
      params.append('companyId', selectedCompanyId);
      if (categoryFilter !== 'all') params.append('category', categoryFilter);
      if (statusFilter !== 'all') params.append('isActive', statusFilter === 'active' ? 'true' : 'false');
      
      const response = await fetch(`/api/pipeline-stages?${params.toString()}`, {
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
        throw new Error(errorData.error || "Failed to fetch pipeline stages");
      }

      const data = await response.json();
      setStages(data.stages || []);
      
      // Calculate stats
      if (data.stages) {
        const activeStages = data.stages.filter((s: PipelineStage) => s.isActive);
        const totalDeals = data.stages.reduce((sum: number, s: PipelineStage) => sum + (s.dealCount || 0), 0);
        const totalValue = data.stages.reduce((sum: number, s: PipelineStage) => sum + (s.totalValue || 0), 0);
        const avgProbability = data.stages.length > 0 
          ? data.stages.reduce((sum: number, s: PipelineStage) => sum + s.probability, 0) / data.stages.length 
          : 0;

        setPipelineStats({
          totalStages: data.stages.length,
          activeStages: activeStages.length,
          totalDeals,
          totalValue,
          avgProbability
        });
      }
      
    } catch (err: any) {
      console.error('Error fetching stages:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [selectedCompanyId, categoryFilter, statusFilter, router]);

  // Filter stages
  useEffect(() => {
    let filtered = [...stages];

    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(stage => 
        stage.name.toLowerCase().includes(query) ||
        stage.category.toLowerCase().includes(query)
      );
    }

    // Apply category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(stage => stage.category === categoryFilter);
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      const isActive = statusFilter === 'active';
      filtered = filtered.filter(stage => stage.isActive === isActive);
    }

    // Sort by order
    filtered.sort((a, b) => a.order - b.order);

    setFilteredStages(filtered);
  }, [stages, searchQuery, categoryFilter, statusFilter]);

  // Reorder stages
  const reorderStages = async (reorderedStages: { id: string; order: number }[]) => {
    try {
      const response = await fetch(`/api/pipeline-stages/reorder?companyId=${selectedCompanyId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
        body: JSON.stringify({ stages: reorderedStages })
      });

      if (!response.ok) {
        throw new Error("Failed to reorder stages");
      }

      setSuccess("Stages reordered successfully");
      fetchStages(); // Refresh to ensure consistency
      return true;
    } catch (err: any) {
      console.error('Error reordering stages:', err);
      setError(err.message);
      return false;
    }
  };

  // Toggle stage status
  const toggleStageStatus = async (stage: PipelineStage) => {
    try {
      const response = await fetch(`/api/pipeline-stages/${stage._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
        body: JSON.stringify({ isActive: !stage.isActive })
      });

      if (!response.ok) {
        throw new Error("Failed to update stage status");
      }

      const updatedStage = await response.json();
      setStages(prev => prev.map(s => 
        s._id === stage._id ? updatedStage.stage : s
      ));
      
      setSuccess(`Stage ${updatedStage.stage.isActive ? 'activated' : 'deactivated'} successfully`);
      return true;
    } catch (err: any) {
      console.error('Error toggling stage status:', err);
      setError(err.message);
      return false;
    }
  };

  // Delete stage
const deleteStage = async (stageId: string) => {
  try {
    setSubmitting(true);
    
    const response = await fetch(`/api/pipeline-stages/${stageId}`, {
      method: "DELETE",
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || "Failed to delete stage");
    }

    setSuccess("Pipeline stage deleted successfully");
    return true;
  } catch (err: any) {
    console.error('Error deleting stage:', err);
    setError(err.message);
    return false;
  } finally {
    setSubmitting(false);
  }
};

  return {
    stages,
    filteredStages,
    members,
    loading,
    submitting,
    error,
    success,
    setError,
    setSuccess,
    searchQuery,
    setSearchQuery,
    categoryFilter,
    setCategoryFilter,
    statusFilter,
    setStatusFilter,
    selectedStage,
    setSelectedStage,
    pipelineStats,
    fetchStages,
    fetchMembers,
    reorderStages,
    toggleStageStatus,
    deleteStage
  };
}