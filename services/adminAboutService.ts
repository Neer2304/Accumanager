// services/adminAboutService.ts
import { About, AboutSection, UpdateSectionPayload } from '@/types/about';

class AdminAboutServiceClass {
  private baseUrl = '/api/admin/about';

  /**
   * Get all about data (admin access)
   */
  async getAboutData(section?: AboutSection): Promise<About | any> {
    try {
      const url = section 
        ? `${this.baseUrl}?section=${section}`
        : this.baseUrl;

      const response = await fetch(url, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch about data');
      }

      return data.data;
    } catch (error) {
      console.error('Admin about fetch error:', error);
      throw error;
    }
  }

  /**
   * Update specific section
   */
  async updateSection(section: AboutSection, updates: Record<string, any>): Promise<any> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ section, updates }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update section');
      }

      return data.data;
    } catch (error) {
      console.error('Section update error:', error);
      throw error;
    }
  }

  /**
   * Update specific label
   */
  async updateLabel(key: string, value: string): Promise<Labels> {
    const response = await fetch('/api/admin/about/label', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ [key]: value }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to update label');
    }

    return data.data;
  }

  /**
   * Bulk update multiple labels
   */
  async updateLabels(labels: Partial<Labels>): Promise<Labels> {
    const response = await fetch('/api/admin/about/label', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(labels),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to update labels');
    }

    return data.data;
  }

  /**
   * Bulk update all about data
   */
  async bulkUpdate(data: Partial<About>): Promise<About> {
    const response = await fetch(this.baseUrl, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message || 'Failed to bulk update');
    }

    return responseData.data;
  }

  /**
   * Reset to defaults
   */
  async resetToDefaults(): Promise<About> {
    const response = await fetch(this.baseUrl, {
      method: 'DELETE',
      credentials: 'include',
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to reset data');
    }

    return data.data;
  }

  /**
   * Get all labels
   */
  async getLabels(): Promise<Labels> {
    const response = await fetch('/api/admin/about/label', {
      credentials: 'include',
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch labels');
    }

    return data.data;
  }
}

export const AdminAboutService = new AdminAboutServiceClass();