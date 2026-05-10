// services/adminAboutService.ts
import { About, AboutSection, Labels } from '@/types/about'

class AdminAboutServiceClass {
  private baseUrl = '/api/admin/about';
  private labelUrl = '/api/admin/about/label';

  async getAboutData(section?: AboutSection): Promise<About> {
    try {
      const url = section ? `${this.baseUrl}?section=${section}` : this.baseUrl;
      const response = await fetch(url, {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to fetch');
      return data.data as About;
    } catch (error) {
      console.error('Fetch error:', error);
      throw error;
    }
  }

  async updateSection(section: AboutSection, updates: Record<string, unknown>): Promise<About> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section, updates }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to update');
      return data.data;
    } catch (error) {
      console.error('Update error:', error);
      throw error;
    }
  }

  async bulkUpdate(data: Partial<About>): Promise<About> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Failed to update');
      return result.data;
    } catch (error) {
      console.error('Bulk update error:', error);
      throw error;
    }
  }

  async resetToDefaults(): Promise<About> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'DELETE',
        credentials: 'include',
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to reset');
      return data.data;
    } catch (error) {
      console.error('Reset error:', error);
      throw error;
    }
  }

  async getLabels(): Promise<Labels> {
    try {
      const response = await fetch(this.labelUrl, { credentials: 'include' });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to fetch labels');
      return data.data;
    } catch (error) {
      console.error('Get labels error:', error);
      throw error;
    }
  }

  async updateLabels(labels: Partial<Labels>): Promise<Labels> {
    try {
      const response = await fetch(this.labelUrl, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(labels),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to update labels');
      return data.data;
    } catch (error) {
      console.error('Update labels error:', error);
      throw error;
    }
  }
}

export const AdminAboutService = new AdminAboutServiceClass();