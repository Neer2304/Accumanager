// services/contactService.ts
import axios from 'axios';
import { ContactFormData, ContactSubmissionResponse } from '@/store/slices/contactSlice';

class ContactService {
  private baseUrl = '/api/contact';
  
  /**
   * Submit contact form
   */
  async submitContactForm(formData: ContactFormData): Promise<ContactSubmissionResponse> {
    try {
      const response = await axios.post(this.baseUrl, formData);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 429) {
        throw new Error('Too many requests. Please wait a minute and try again.');
      }
      throw new Error(error.response?.data?.message || 'Failed to submit contact form');
    }
  }
  
  /**
   * Get contact stats (admin only)
   */
  async getContactStats() {
    try {
      const response = await axios.get(`${this.baseUrl}/stats`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch contact stats');
    }
  }
  
  /**
   * Get all submissions (admin only)
   */
  async getSubmissions(params: { page?: number; limit?: number; status?: string } = {}) {
    try {
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());
      if (params.status) queryParams.append('status', params.status);
      
      const response = await axios.get(`${this.baseUrl}/submissions?${queryParams.toString()}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch submissions');
    }
  }
  
  /**
   * Get single submission by ID (admin only)
   */
  async getSubmissionById(submissionId: string) {
    try {
      const response = await axios.get(`${this.baseUrl}/submissions/${submissionId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch submission');
    }
  }
  
  /**
   * Update submission status (admin only)
   */
  async updateSubmissionStatus(submissionId: string, status: string) {
    try {
      const response = await axios.patch(`${this.baseUrl}/submissions/${submissionId}`, { status });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update status');
    }
  }
  
  /**
   * Add note to submission (admin only)
   */
  async addSubmissionNote(submissionId: string, note: string) {
    try {
      const response = await axios.post(`${this.baseUrl}/submissions/${submissionId}/notes`, { note });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to add note');
    }
  }
  
  /**
   * Delete submission (admin only)
   */
  async deleteSubmission(submissionId: string) {
    try {
      const response = await axios.delete(`${this.baseUrl}/submissions/${submissionId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to delete submission');
    }
  }
  
  /**
   * Get rate limit status
   */
  async getRateLimitStatus() {
    try {
      const response = await axios.get(`${this.baseUrl}/rate-limit`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get rate limit');
    }
  }
  
  /**
   * Validate contact form data
   */
  validateForm(formData: ContactFormData): Record<string, string> {
    const errors: Record<string, string> = {};
    
    if (!formData.name?.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!formData.email?.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (!formData.message?.trim()) {
      errors.message = 'Message is required';
    }
    
    if (formData.phone && !/^[0-9+\-\s]{10,15}$/.test(formData.phone)) {
      errors.phone = 'Please enter a valid phone number';
    }
    
    return errors;
  }
}

export const contactService = new ContactService();