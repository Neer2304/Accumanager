// components/googleadsmanager/components/types.ts
export interface Campaign {
  id: number;
  name: string;
  status: 'active' | 'paused' | 'completed';
  impressions: number;
  clicks: number;
  ctr: number;
  revenue: number;
  placement: 'header' | 'sidebar' | 'content' | 'banner' | 'popup';
}

export interface CampaignStats {
  totalRevenue: number;
  totalImpressions: number;
  averageCTR: number;
  activeCount: number;
}

export interface AdFormData {
  title: string;
  description: string;
  url: string;
  placement: 'banner' | 'sidebar' | 'content' | 'popup';
  budget: string;
}

export interface AdsSettings {
  enabled: boolean;
  density: number;
  category: string;
}