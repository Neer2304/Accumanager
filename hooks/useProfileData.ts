import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  role: string;
  businessName: string;
  gstNumber?: string;
  businessAddress?: string;
  createdAt: string;
  isActive: boolean;
  preferences: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    lowStockAlerts: boolean;
    monthlyReports: boolean;
  };
  subscription?: {
    plan: 'trial' | 'monthly' | 'quarterly' | 'yearly';
    status: 'trial' | 'active' | 'expired' | 'cancelled';
    trialEndsAt?: string;
    currentPeriodStart: string;
    currentPeriodEnd: string;
    autoRenew: boolean;
    features: any;
  };
  usage?: {
    products: number;
    customers: number;
    invoices: number;
    storageMB: number;
  };
}

export interface SubscriptionStatus {
  plan: string;
  isActive: boolean;
  currentPeriodEnd?: string;
  daysRemaining?: number;
  limits: {
    products: number;
    customers: number;
    invoices: number;
    storageMB: number;
  };
}

export interface UseProfileDataReturn {
  profile: UserProfile | null;
  subscriptionStatus: SubscriptionStatus | null;
  loading: boolean;
  saving: boolean;
  error: string;
  success: string;
  formData: {
    name: string;
    email: string;
    phone: string;
    businessName: string;
    gstNumber: string;
    businessAddress: string;
  };
  setFormData: React.Dispatch<React.SetStateAction<{
    name: string;
    email: string;
    phone: string;
    businessName: string;
    gstNumber: string;
    businessAddress: string;
  }>>;
  fetchProfile: () => Promise<void>;
  updateProfile: (data: any) => Promise<boolean>;
  updatePreference: (preference: string, value: boolean) => Promise<boolean>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
  upgradePlan: (plan: string) => Promise<{ paymentId: string; upiUrl: string } | null>;
  checkPaymentStatus: (paymentId: string) => Promise<void>;
  getUsagePercentage: (resource: keyof SubscriptionStatus['limits']) => number;
  getPlanColor: (plan: string) => string;
}

export const useProfileData = (): UseProfileDataReturn => {
  const { user, isAuthenticated, logout } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    businessName: '',
    gstNumber: '',
    businessAddress: '',
  });

  const fetchProfile = async () => {
    try {
      setLoading(true);
      
      const profileResponse = await fetch('/api/profile', {
        credentials: 'include',
      });
      
      if (profileResponse.ok) {
        const profileData = await profileResponse.json();
        setProfile(profileData);
        
        setFormData({
          name: profileData.name || '',
          email: profileData.email || '',
          phone: profileData.phone || '',
          businessName: profileData.businessName || '',
          gstNumber: profileData.gstNumber || '',
          businessAddress: profileData.businessAddress || '',
        });
        
        const subscriptionResponse = await fetch('/api/subscription/status', {
          credentials: 'include',
        });
        
        if (subscriptionResponse.ok) {
          const subscriptionData = await subscriptionResponse.json();
          setSubscriptionStatus(subscriptionData.data);
        }
      } else {
        throw new Error('Failed to fetch profile');
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (data: any) => {
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const updatedProfile = await response.json();
        setProfile(updatedProfile);
        setSuccess('Profile updated successfully');
        return true;
      } else if (response.status === 401) {
        logout();
        return false;
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile');
      return false;
    } finally {
      setSaving(false);
    }
  };

  const updatePreference = async (preference: string, value: boolean) => {
    try {
      const response = await fetch('/api/profile/preferences', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ [preference]: value }),
      });

      if (response.ok) {
        const updatedProfile = await response.json();
        setProfile(updatedProfile);
        setSuccess('Preferences updated successfully');
        return true;
      } else if (response.status === 401) {
        logout();
        return false;
      } else {
        throw new Error('Failed to update preferences');
      }
    } catch (err) {
      console.error('Error updating preferences:', err);
      setError('Failed to update preferences');
      return false;
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    try {
      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      if (response.ok) {
        setSuccess('Password changed successfully');
        return true;
      } else if (response.status === 401) {
        logout();
        return false;
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to change password');
      }
    } catch (err) {
      console.error('Error changing password:', err);
      setError(err instanceof Error ? err.message : 'Failed to change password');
      return false;
    }
  };

  const upgradePlan = async (plan: string) => {
    try {
      const response = await fetch('/api/payments/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ plan }),
      });

      if (response.ok) {
        const result = await response.json();
        const paymentData = result.data;
        
        setSuccess('Payment initiated. Please complete the payment in your UPI app.');
        return paymentData;
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create payment');
      }
    } catch (err) {
      console.error('Error creating payment:', err);
      setError(err instanceof Error ? err.message : 'Failed to initiate payment');
      return null;
    }
  };

  const checkPaymentStatus = async (paymentId: string) => {
    const maxAttempts = 30;
    let attempts = 0;
    
    const poll = setInterval(async () => {
      attempts++;
      
      try {
        const response = await fetch(`/api/payments/status?paymentId=${paymentId}`, {
          credentials: 'include',
        });
        
        if (response.ok) {
          const result = await response.json();
          const status = result.status;
          
          if (status === 'completed') {
            clearInterval(poll);
            
            await fetch('/api/payments/verify', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              credentials: 'include',
              body: JSON.stringify({
                paymentId,
                upiTransactionId: result.upiTransactionId
              }),
            });
            
            setSuccess('Payment completed successfully! Your subscription has been activated.');
            
            const subscriptionResponse = await fetch('/api/subscription/status', {
              credentials: 'include',
            });
            
            if (subscriptionResponse.ok) {
              const subscriptionData = await subscriptionResponse.json();
              setSubscriptionStatus(subscriptionData.data);
            }
          } else if (status === 'failed') {
            clearInterval(poll);
            setError('Payment failed. Please try again.');
          }
        }
        
        if (attempts >= maxAttempts) {
          clearInterval(poll);
          setError('Payment verification timeout. Please check your payment status manually.');
        }
      } catch (err) {
        console.error('Error checking payment status:', err);
      }
    }, 10000);
  };

  const getUsagePercentage = (resource: keyof SubscriptionStatus['limits']) => {
    if (!profile?.usage || !subscriptionStatus?.limits) return 0;
    const limit = subscriptionStatus.limits[resource];
    const usage = profile.usage[resource] || 0;
    return limit > 0 ? Math.min((usage / limit) * 100, 100) : 0;
  };

  const getPlanColor = (plan: string) => {
    const colors: Record<string, string> = {
      'trial': 'default',
      'monthly': 'primary',
      'quarterly': 'secondary',
      'yearly': 'success',
    };
    return colors[plan] || 'default';
  };

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchProfile();
    } else if (!isAuthenticated) {
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  return {
    profile,
    subscriptionStatus,
    loading,
    saving,
    error,
    success,
    formData,
    setFormData,
    fetchProfile,
    updateProfile,
    updatePreference,
    changePassword,
    upgradePlan,
    checkPaymentStatus,
    getUsagePercentage,
    getPlanColor,
  };
};