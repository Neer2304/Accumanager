// services/adminMaterialsAnalysisService.ts
import { MaterialsAnalysisData, TimeRangeOption } from '@/types/analysis';

class AdminMaterialsAnalysisServiceClass {
  private baseUrl = '/api/admin/analysis/materials';

  /**
   * Get materials analysis data
   */
  async getMaterialsAnalysis(timeframe: number = 30): Promise<MaterialsAnalysisData> {
    try {
      const response = await fetch(`${this.baseUrl}?timeframe=${timeframe}`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
        },
        next: { revalidate: 300 } // Cache for 5 minutes
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch materials analysis');
      }

      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch materials analysis');
      }

      return data.data;
    } catch (error) {
      console.error('Materials analysis fetch error:', error);
      throw error;
    }
  }

  /**
   * Get material summary only
   */
  async getMaterialSummary(timeframe: number = 30): Promise<MaterialsAnalysisData['summary']> {
    const data = await this.getMaterialsAnalysis(timeframe);
    return data.summary;
  }

  /**
   * Get materials by category
   */
  async getMaterialsByCategory(timeframe: number = 30): Promise<Array<{ category: string; count: number }>> {
    const data = await this.getMaterialsAnalysis(timeframe);
    return data.materialAnalysis.materialsByCategory.map(item => ({
      category: item._id || 'Uncategorized',
      count: item.count
    }));
  }

  /**
   * Get materials by status
   */
  async getMaterialsByStatus(timeframe: number = 30): Promise<Array<{ status: string; count: number }>> {
    const data = await this.getMaterialsAnalysis(timeframe);
    return data.materialAnalysis.materialsByStatus.map(item => ({
      status: item._id,
      count: item.count
    }));
  }

  /**
   * Get materials per day for charts
   */
  async getMaterialsByDay(timeframe: number = 30): Promise<Array<{ date: string; count: number; value: number }>> {
    const data = await this.getMaterialsAnalysis(timeframe);
    return data.materialAnalysis.materialsByDay.map(item => ({
      date: item._id,
      count: item.count,
      value: item.totalValue
    }));
  }

  /**
   * Get top users by materials
   */
  async getTopUsersByMaterials(limit: number = 5): Promise<MaterialsAnalysisData['materialAnalysis']['topUsersByMaterials']> {
    const data = await this.getMaterialsAnalysis(30);
    return data.materialAnalysis.topUsersByMaterials.slice(0, limit);
  }

  /**
   * Get category value breakdown
   */
  async getCategoryValue(timeframe: number = 30): Promise<Array<{ category: string; count: number; value: number }>> {
    const data = await this.getMaterialsAnalysis(timeframe);
    return data.materialAnalysis.categoryValue.map(item => ({
      category: item._id,
      count: item.itemCount,
      value: item.totalValue
    }));
  }

  /**
   * Get low stock count
   */
  async getLowStockCount(): Promise<number> {
    const summary = await this.getMaterialSummary(30);
    return summary.lowStockItems;
  }

  /**
   * Get out of stock count
   */
  async getOutOfStockCount(): Promise<number> {
    const summary = await this.getMaterialSummary(30);
    return summary.outOfStockItems;
  }

  /**
   * Get total stock value
   */
  async getTotalStockValue(): Promise<number> {
    const summary = await this.getMaterialSummary(30);
    return summary.totalStockValue;
  }
}

export const AdminMaterialsAnalysisService = new AdminMaterialsAnalysisServiceClass();