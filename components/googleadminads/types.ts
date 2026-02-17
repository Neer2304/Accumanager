// components/googleadminads/types.ts
export interface Campaign {
  id: number;
  name: string;
  status: 'active' | 'paused' | 'completed';
  impressions: number;
  clicks: number;
  ctr: number;
  revenue: number;
  placement: string;
}

export interface CampaignStats {
  totalRevenue: number;
  totalImpressions: number;
  averageCTR: number;
  activeCampaigns: number;
}

export interface AdSettings {
  enabled: boolean;
  density: number;
  category: string;
}

export interface CreateAdFormData {
  title: string;
  description: string;
  url: string;
  placement: string;
  budget: string;
}

export interface GoogleAdminAdsProps {
  darkMode?: boolean;
  isMobile?: boolean;
  isTablet?: boolean;
}