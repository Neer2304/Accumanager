// services/publicAboutService.ts
import { PublicAbout, AboutSection } from '@/types/about';

class PublicAboutServiceClass {
  private baseUrl = '/api/about';

  /**
   * Get public about data
   */
  async getAboutData(section?: AboutSection): Promise<PublicAbout | any> {
    try {
      const url = section 
        ? `${this.baseUrl}?section=${section}`
        : this.baseUrl;

      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
        },
        // Cache for 1 hour (Next.js 13+)
        next: { revalidate: 3600 }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch about data');
      }

      return data.data;
    } catch (error) {
      console.error('Public about fetch error:', error);
      throw error;
    }
  }

  /**
   * Get company info
   */
  async getCompanyInfo(): Promise<Partial<PublicAbout>> {
    const data = await this.getAboutData('company');
    return data;
  }

  /**
   * Get contact info
   */
  async getContactInfo(): Promise<PublicAbout['contact']> {
    const data = await this.getAboutData('contact');
    return data;
  }

  /**
   * Get social media links
   */
  async getSocialMedia(): Promise<PublicAbout['socialMedia']> {
    const data = await this.getAboutData('socialMedia');
    return data;
  }

  /**
   * Get labels (for i18n)
   */
  async getLabels(): Promise<PublicAbout['labels']> {
    const data = await this.getAboutData('labels');
    return data;
  }

  /**
   * Get SEO data
   */
  async getSEO(): Promise<PublicAbout['seo']> {
    const data = await this.getAboutData('seo');
    return data;
  }

  /**
   * Get theme settings
   */
  async getTheme(): Promise<PublicAbout['theme']> {
    const data = await this.getAboutData('theme');
    return data;
  }

  /**
   * Get system settings (public)
   */
  async getSystemSettings(): Promise<PublicAbout['system']> {
    const data = await this.getAboutData('system');
    return data;
  }

  /**
   * Get a specific label by key
   */
  async getLabel(key: string): Promise<string> {
    const labels = await this.getLabels();
    return labels[key] || key;
  }
}

export const PublicAboutService = new PublicAboutServiceClass();