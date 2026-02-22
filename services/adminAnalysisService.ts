// services/adminAnalysisService.ts
import { AnalysisData, TimeRangeOption } from '@/types/analysis';

class AdminAnalysisServiceClass {
  private baseUrl = '/api/admin/analysis';

  /**
   * Get analysis data for specified timeframe
   */
  async getAnalysis(timeframe: number = 30): Promise<AnalysisData> {
    try {
      const response = await fetch(`${this.baseUrl}?timeframe=${timeframe}`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
        },
        // Cache for 5 minutes (300 seconds) - analysis data doesn't change every second
        next: { revalidate: 300 }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch analysis data');
      }

      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch analysis data');
      }

      return data.data;
    } catch (error) {
      console.error('Analysis fetch error:', error);
      throw error;
    }
  }

  /**
   * Get system overview only
   */
  async getSystemOverview(timeframe: number = 30): Promise<AnalysisData['systemOverview']> {
    const data = await this.getAnalysis(timeframe);
    return data.systemOverview;
  }

  /**
   * Get user analysis only
   */
  async getUserAnalysis(timeframe: number = 30): Promise<AnalysisData['userAnalysis']> {
    const data = await this.getAnalysis(timeframe);
    return data.userAnalysis;
  }

  /**
   * Get notes analysis only
   */
  async getNotesAnalysis(timeframe: number = 30): Promise<AnalysisData['notesAnalysis']> {
    const data = await this.getAnalysis(timeframe);
    return data.notesAnalysis;
  }

  /**
   * Get engagement analysis only
   */
  async getEngagementAnalysis(timeframe: number = 30): Promise<AnalysisData['engagementAnalysis']> {
    const data = await this.getAnalysis(timeframe);
    return data.engagementAnalysis;
  }

  /**
   * Get summary metrics only
   */
  async getSummary(timeframe: number = 30): Promise<AnalysisData['summary']> {
    const data = await this.getAnalysis(timeframe);
    return data.summary;
  }

  /**
   * Get active user percentage
   */
  async getActiveUserPercentage(timeframe: number = 30): Promise<number> {
    const summary = await this.getSummary(timeframe);
    return summary.activeUserPercentage;
  }

  /**
   * Get engagement score
   */
  async getEngagementScore(timeframe: number = 30): Promise<number> {
    const summary = await this.getSummary(timeframe);
    return summary.engagementScore;
  }

  /**
   * Get new users per day for charts
   */
  async getNewUsersByDay(timeframe: number = 30): Promise<Array<{ date: string; count: number }>> {
    const data = await this.getUserAnalysis(timeframe);
    return data.newUsersByDay.map(item => ({
      date: item._id,
      count: item.count
    }));
  }

  /**
   * Get notes per day for charts
   */
  async getNotesByDay(timeframe: number = 30): Promise<Array<{ date: string; count: number }>> {
    const data = await this.getNotesAnalysis(timeframe);
    return data.notesByDay.map(item => ({
      date: item._id,
      count: item.count
    }));
  }

  /**
   * Get top users by activity
   */
  async getTopActiveUsers(limit: number = 5): Promise<AnalysisData['userAnalysis']['topActiveUsers']> {
    const data = await this.getUserAnalysis(30);
    return data.topActiveUsers.slice(0, limit);
  }

  /**
   * Get top users by notes
   */
  async getTopUsersByNotes(limit: number = 5): Promise<AnalysisData['notesAnalysis']['topUsersByNotes']> {
    const data = await this.getNotesAnalysis(30);
    return data.topUsersByNotes.slice(0, limit);
  }
}

export const AdminAnalysisService = new AdminAnalysisServiceClass();