import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';

export interface SettingsData {
  business: {
    name: string;
    email: string;
    phone: string;
    businessAddress: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
    gstNumber: string;
    panNumber: string;
    website: string;
    logoUrl: string;
    businessType: string;
    industry: string;
    taxRate: number;
    invoicePrefix: string;
  };
  notifications: {
    email: boolean;
    push: boolean;
    salesAlerts: boolean;
    lowStockAlerts: boolean;
    newCustomerAlerts: boolean;
    billingReminders: boolean;
    monthlyReports: boolean;
  };
  security: {
    twoFactorAuth: boolean;
    sessionTimeout: number;
    passwordChangeRequired: boolean;
    loginAlerts: boolean;
    ipWhitelist: string[];
  };
  appearance: {
    themeMode: 'light' | 'dark' | 'auto';
    language: string;
    dateFormat: string;
    timeFormat: string;
    compactMode: boolean;
    dashboardLayout: string;
    sidebarWidth: number;
    fontSize: string;
  };
  backup: {
    autoBackup: boolean;
    backupFrequency: string;
    backupTime: string;
    retainBackupDays: number;
  };
  compliance: {
    enableGstInvoices: boolean;
    includeHsnCode: boolean;
    includeSacCode: boolean;
    tdsApplicable: boolean;
    tdsRate: number;
    tcsApplicable: boolean;
    tcsRate: number;
  };
  integrations: {
    razorpay: {
      enabled: boolean;
      keyId: string;
      keySecret: string;
    };
    cashfree: {
      enabled: boolean;
      appId: string;
      secretKey: string;
    };
  };
}

interface UseSettingsReturn {
  settings: SettingsData | null;
  loading: boolean;
  error: string | null;
  saveSettings: (newSettings: Partial<SettingsData>) => Promise<boolean>;
  refreshSettings: () => Promise<void>;
  updateSetting: <T extends keyof SettingsData>(
    section: T,
    key: keyof SettingsData[T],
    value: any
  ) => void;
}

export function useSettings(): UseSettingsReturn {
  const { isAuthenticated, user } = useAuth();
  const [settings, setSettings] = useState<SettingsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch settings from API
  const fetchSettings = useCallback(async () => {
    if (!isAuthenticated) {
      setSettings(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/settings', {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch settings: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.success && data.settings) {
        setSettings(data.settings);
      } else {
        throw new Error(data.message || 'Invalid response from server');
      }
    } catch (err: any) {
      console.error('Error fetching settings:', err);
      setError(err.message || 'Failed to load settings');
      setSettings(null);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Save settings to API
  const saveSettings = useCallback(async (newSettings: Partial<SettingsData>): Promise<boolean> => {
    if (!isAuthenticated) {
      setError('You must be logged in to save settings');
      return false;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/settings', {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSettings),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to save settings');
      }

      if (data.success && data.settings) {
        setSettings(data.settings);
        return true;
      } else {
        throw new Error(data.message || 'Invalid response from server');
      }
    } catch (err: any) {
      console.error('Error saving settings:', err);
      setError(err.message || 'Failed to save settings');
      return false;
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Update a specific setting locally
  const updateSetting = useCallback(<T extends keyof SettingsData>(
    section: T,
    key: keyof SettingsData[T],
    value: any
  ) => {
    setSettings(prev => {
      if (!prev) return prev;
      
      return {
        ...prev,
        [section]: {
          ...prev[section],
          [key]: value
        }
      };
    });
  }, []);

  // Refresh settings
  const refreshSettings = useCallback(async () => {
    await fetchSettings();
  }, [fetchSettings]);

  // Load settings on mount and when auth changes
  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  return {
    settings,
    loading,
    error,
    saveSettings,
    refreshSettings,
    updateSetting
  };
}

// Simplified hook for specific settings sections
export function useBusinessSettings() {
  const { settings, updateSetting, saveSettings, loading, error } = useSettings();
  
  const updateBusinessSetting = useCallback((key: keyof SettingsData['business'], value: any) => {
    updateSetting('business', key, value);
  }, [updateSetting]);

  const saveBusinessSettings = useCallback(async () => {
    if (!settings) return false;
    return saveSettings({ business: settings.business });
  }, [settings, saveSettings]);

  return {
    business: settings?.business || null,
    loading,
    error,
    updateBusinessSetting,
    saveBusinessSettings
  };
}

export function useAppearanceSettings() {
  const { settings, updateSetting, saveSettings, loading, error } = useSettings();
  
  const updateAppearanceSetting = useCallback((key: keyof SettingsData['appearance'], value: any) => {
    updateSetting('appearance', key, value);
  }, [updateSetting]);

  const saveAppearanceSettings = useCallback(async () => {
    if (!settings) return false;
    return saveSettings({ appearance: settings.appearance });
  }, [settings, saveSettings]);

  return {
    appearance: settings?.appearance || null,
    loading,
    error,
    updateAppearanceSetting,
    saveAppearanceSettings
  };
}

export function useNotificationSettings() {
  const { settings, updateSetting, saveSettings, loading, error } = useSettings();
  
  const updateNotificationSetting = useCallback((key: keyof SettingsData['notifications'], value: any) => {
    updateSetting('notifications', key, value);
  }, [updateSetting]);

  const saveNotificationSettings = useCallback(async () => {
    if (!settings) return false;
    return saveSettings({ notifications: settings.notifications });
  }, [settings, saveSettings]);

  return {
    notifications: settings?.notifications || null,
    loading,
    error,
    updateNotificationSetting,
    saveNotificationSettings
  };
}