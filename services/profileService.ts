// services/profileService.ts
export interface UserPreferences {
  emailNotifications: boolean;
  smsNotifications: boolean;
  lowStockAlerts: boolean;
  monthlyReports: boolean;
}

export interface UserUsage {
  storageUsed?: number;
  apiCalls?: number;
  lastActive?: string;
}

export interface UserSubscription {
  plan: string;
  status: string;
  expiresAt?: string;
  features?: string[];
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  businessName?: string;
  gstNumber?: string;
  businessAddress?: string;
  createdAt?: string;
  isActive?: boolean;
  preferences?: UserPreferences;
  subscription?: UserSubscription;
  usage?: UserUsage;
  avatar?: string;
}

export interface ProfileUpdateData {
  name?: string;
  email?: string;
  phone?: string;
  businessName?: string;
  gstNumber?: string;
  businessAddress?: string;
}

export interface PreferencesData {
  emailNotifications?: boolean;
  smsNotifications?: boolean;
  lowStockAlerts?: boolean;
  monthlyReports?: boolean;
}

class ProfileServiceClass {
  private baseUrl = '/api/profile';

  /**
   * Get user profile
   */
  async getProfile(): Promise<UserProfile> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch profile');
      }

      return data;
    } catch (error) {
      console.error('Profile fetch error:', error);
      throw error;
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(data: ProfileUpdateData): Promise<UserProfile> {
    try {
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
        throw new Error(responseData.error || 'Failed to update profile');
      }

      return responseData;
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    }
  }

  /**
   * Update user preferences
   */
  async updatePreferences(data: PreferencesData): Promise<UserProfile> {
    try {
      const response = await fetch(`${this.baseUrl}/preferences`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || 'Failed to update preferences');
      }

      return responseData;
    } catch (error) {
      console.error('Preferences update error:', error);
      throw error;
    }
  }

  /**
   * Change password
   */
  async changePassword(currentPassword: string, newPassword: string): Promise<{ message: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/password`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to change password');
      }

      return data;
    } catch (error) {
      console.error('Password change error:', error);
      throw error;
    }
  }

  /**
   * Upload avatar
   */
  async uploadAvatar(file: File): Promise<{ avatarUrl: string }> {
    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await fetch(`${this.baseUrl}/avatar`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to upload avatar');
      }

      return data;
    } catch (error) {
      console.error('Avatar upload error:', error);
      throw error;
    }
  }

  /**
   * Delete account
   */
  async deleteAccount(password: string): Promise<{ message: string }> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete account');
      }

      return data;
    } catch (error) {
      console.error('Account deletion error:', error);
      throw error;
    }
  }
}

export const ProfileService = new ProfileServiceClass();