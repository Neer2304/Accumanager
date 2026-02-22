// services/pipelineStageService.ts
import { 
  PipelineStage, 
  PipelineStageFormData, 
  StageReorderItem,
  ApiResponse,
  PipelineStageFilters 
} from '@/types/pipeline';

class PipelineStageServiceClass {
  private baseUrl = '/api/pipeline-stages';

  /**
   * Get all pipeline stages for a company
   */
  async getStages(
    companyId: string, 
    filters?: PipelineStageFilters
  ): Promise<{ stages: PipelineStage[]; total: number }> {
    try {
      const params = new URLSearchParams();
      params.append('companyId', companyId);
      
      if (filters?.category && filters.category !== 'all') {
        params.append('category', filters.category);
      }
      if (filters?.isActive !== undefined) {
        params.append('isActive', filters.isActive.toString());
      }

      const response = await fetch(`${this.baseUrl}?${params.toString()}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data: ApiResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch stages');
      }

      return {
        stages: data.stages || [],
        total: data.total || 0,
      };
    } catch (error) {
      console.error('Get stages error:', error);
      throw error;
    }
  }

  /**
   * Get a single pipeline stage by ID
   */
  async getStageById(stageId: string): Promise<PipelineStage> {
    try {
      const response = await fetch(`${this.baseUrl}/${stageId}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data: ApiResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch stage');
      }

      if (!data.stage) {
        throw new Error('Stage not found');
      }

      return data.stage;
    } catch (error) {
      console.error('Get stage by ID error:', error);
      throw error;
    }
  }

  /**
   * Create a new pipeline stage
   */
  async createStage(
    companyId: string, 
    formData: PipelineStageFormData
  ): Promise<PipelineStage> {
    try {
      // Convert form data to API format
      const stageData = {
        ...formData,
        probability: parseInt(formData.probability),
        autoAdvanceDays: formData.autoAdvance ? parseInt(formData.autoAdvanceDays) : undefined,
      };

      const response = await fetch(`${this.baseUrl}?companyId=${companyId}`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(stageData),
      });

      const data: ApiResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create stage');
      }

      if (!data.stage) {
        throw new Error('No stage data returned');
      }

      return data.stage;
    } catch (error) {
      console.error('Create stage error:', error);
      throw error;
    }
  }

  /**
   * Update an existing pipeline stage
   */
  async updateStage(
    stageId: string, 
    formData: PipelineStageFormData
  ): Promise<PipelineStage> {
    try {
      // Convert form data to API format
      const stageData = {
        ...formData,
        probability: parseInt(formData.probability),
        autoAdvanceDays: formData.autoAdvance ? parseInt(formData.autoAdvanceDays) : undefined,
      };

      const response = await fetch(`${this.baseUrl}/${stageId}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(stageData),
      });

      const data: ApiResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update stage');
      }

      if (!data.stage) {
        throw new Error('No stage data returned');
      }

      return data.stage;
    } catch (error) {
      console.error('Update stage error:', error);
      throw error;
    }
  }

  /**
   * Toggle stage active status
   */
  async toggleStageStatus(stageId: string, isActive: boolean): Promise<PipelineStage> {
    try {
      const response = await fetch(`${this.baseUrl}/${stageId}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive: !isActive }),
      });

      const data: ApiResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to toggle stage status');
      }

      if (!data.stage) {
        throw new Error('No stage data returned');
      }

      return data.stage;
    } catch (error) {
      console.error('Toggle stage status error:', error);
      throw error;
    }
  }

  /**
   * Delete a pipeline stage (soft delete)
   */
  async deleteStage(stageId: string): Promise<{ message: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/${stageId}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data: ApiResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete stage');
      }

      return { message: data.message || 'Stage deleted successfully' };
    } catch (error) {
      console.error('Delete stage error:', error);
      throw error;
    }
  }

  /**
   * Reorder stages
   */
  async reorderStages(companyId: string, stages: StageReorderItem[]): Promise<{ message: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/reorder?companyId=${companyId}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ stages }),
      });

      const data: ApiResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to reorder stages');
      }

      return { message: data.message || 'Stages reordered successfully' };
    } catch (error) {
      console.error('Reorder stages error:', error);
      throw error;
    }
  }

  /**
   * Calculate stage statistics
   */
  calculateStats(stages: PipelineStage[]): PipelineStageStats {
    const activeStages = stages.filter(s => s.isActive);
    const totalDeals = stages.reduce((sum, s) => sum + (s.dealCount || 0), 0);
    const totalValue = stages.reduce((sum, s) => sum + (s.totalValue || 0), 0);
    const avgProbability = stages.length > 0 
      ? stages.reduce((sum, s) => sum + s.probability, 0) / stages.length 
      : 0;

    return {
      totalStages: stages.length,
      activeStages: activeStages.length,
      totalDeals,
      totalValue,
      avgProbability,
    };
  }

  /**
   * Get category color
   */
  getCategoryColor(category: string): string {
    switch (category) {
      case 'open': return '#4285f4';
      case 'won': return '#34a853';
      case 'lost': return '#ea4335';
      default: return '#5f6368';
    }
  }

  /**
   * Get category label
   */
  getCategoryLabel(category: string): string {
    switch (category) {
      case 'open': return 'Open';
      case 'won': return 'Closed Won';
      case 'lost': return 'Closed Lost';
      default: return category;
    }
  }

  /**
   * Format probability for display
   */
  formatProbability(probability: number): string {
    return `${probability}%`;
  }

  /**
   * Format currency for display
   */
  formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  }
}

export const PipelineStageService = new PipelineStageServiceClass();