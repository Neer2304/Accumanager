// components/googleadsmanager/hooks/useAdsManager.ts
import { useState, useCallback, useMemo } from 'react';
import { Campaign, CampaignStats, AdFormData, AdsSettings } from '../components/types';

export const useAdsManager = () => {
  const [adsEnabled, setAdsEnabled] = useState(true);
  const [adDensity, setAdDensity] = useState(50);
  const [adCategory, setAdCategory] = useState('all');
  const [openAdDialog, setOpenAdDialog] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Mock ad campaigns
  const [campaigns, setCampaigns] = useState<Campaign[]>([
    {
      id: 1,
      name: 'Tech Tools Banner',
      status: 'active',
      impressions: 12500,
      clicks: 320,
      ctr: 2.56,
      revenue: 450.00,
      placement: 'header',
    },
    {
      id: 2,
      name: 'SaaS Sidebar',
      status: 'active',
      impressions: 8900,
      clicks: 210,
      ctr: 2.36,
      revenue: 315.00,
      placement: 'sidebar',
    },
    {
      id: 3,
      name: 'Business Inline',
      status: 'paused',
      impressions: 5600,
      clicks: 95,
      ctr: 1.70,
      revenue: 142.50,
      placement: 'content',
    },
  ]);

  const stats = useMemo<CampaignStats>(() => {
    const totalRevenue = campaigns.reduce((sum, c) => sum + c.revenue, 0);
    const totalImpressions = campaigns.reduce((sum, c) => sum + c.impressions, 0);
    const averageCTR = campaigns.reduce((sum, c) => sum + c.ctr, 0) / campaigns.length;
    const activeCount = campaigns.filter(c => c.status === 'active').length;

    return {
      totalRevenue,
      totalImpressions,
      averageCTR,
      activeCount,
    };
  }, [campaigns]);

  const handleToggleAdStatus = useCallback((campaignId: number) => {
    setCampaigns(prev => prev.map(campaign => 
      campaign.id === campaignId 
        ? { ...campaign, status: campaign.status === 'active' ? 'paused' : 'active' }
        : campaign
    ));
    setSuccess('Campaign status updated successfully');
  }, []);

  const handleDeleteCampaign = useCallback((campaignId: number) => {
    if (window.confirm('Are you sure you want to delete this campaign?')) {
      setCampaigns(prev => prev.filter(c => c.id !== campaignId));
      setSuccess('Campaign deleted successfully');
    }
  }, []);

  const handleCreateCampaign = useCallback((formData: AdFormData) => {
    // In a real app, this would be an API call
    const newCampaign: Campaign = {
      id: campaigns.length + 1,
      name: formData.title,
      status: 'active',
      impressions: 0,
      clicks: 0,
      ctr: 0,
      revenue: 0,
      placement: formData.placement,
    };
    
    setCampaigns(prev => [...prev, newCampaign]);
    setSuccess('Campaign created successfully');
    setOpenAdDialog(false);
  }, [campaigns.length]);

  const handleEditCampaign = useCallback((campaignId: number, updates: Partial<Campaign>) => {
    setCampaigns(prev => prev.map(campaign =>
      campaign.id === campaignId ? { ...campaign, ...updates } : campaign
    ));
    setSuccess('Campaign updated successfully');
  }, []);

  const settings: AdsSettings = {
    enabled: adsEnabled,
    density: adDensity,
    category: adCategory,
  };

  const updateSettings = useCallback((newSettings: Partial<AdsSettings>) => {
    if (newSettings.enabled !== undefined) setAdsEnabled(newSettings.enabled);
    if (newSettings.density !== undefined) setAdDensity(newSettings.density);
    if (newSettings.category !== undefined) setAdCategory(newSettings.category);
    setSuccess('Settings updated successfully');
  }, []);

  return {
    campaigns,
    stats,
    settings,
    openAdDialog,
    success,
    error,
    setOpenAdDialog,
    setSuccess,
    setError,
    handleToggleAdStatus,
    handleDeleteCampaign,
    handleCreateCampaign,
    handleEditCampaign,
    updateSettings,
  };
};