// components/googleadvance/index.ts

// Types
export * from './types';

// Common Components
export { googleColors, getCurrentColors, getButtonColor, getStatusColor, getImpactColor, getPriorityColor } from './common/GoogleColors';
export { PageHeader } from './common/PageHeader';
export { UnderDevelopmentBanner } from './common/UnderDevelopmentBanner';
export { StatsCard } from './common/StatsCard';
export { MetricCard } from './common/MetricCard';
export { TabPanel } from './common/TabPanel';
export { BreadcrumbNav } from './common/BreadcrumbNav';

// AI Analytics Components
export { PredictionCard } from './ai-analytics/PredictionCard';
export { InsightCard } from './ai-analytics/InsightCard';
export { AIQuerySection } from './ai-analytics/AIQuerySection';
export { ConfidenceSlider } from './ai-analytics/ConfidenceSlider';

// Marketing Components
export { MarketingStatsCards } from './marketing/StatsCards';
export { CampaignCard } from './marketing/CampaignCard';
export { CampaignMetrics } from './marketing/CampaignMetrics';
export { NewCampaignDialog } from './marketing/NewCampaignDialog';
export { CampaignsTab } from './marketing/CampaignsTab';
export { AnalyticsTab } from './marketing/AnalyticsTab';
export { AudiencesTab } from './marketing/AudiencesTab';

// Field Service Components
export { TechnicianCard } from './field-service/TechnicianCard';
export { JobCard } from './field-service/JobCard';
export { QuickDispatch } from './field-service/QuickDispatch';
export { PerformanceAnalytics } from './field-service/PerformanceAnalytics';

// Subscription Analytics Components
export { SubscriptionStatus } from './subscription-analytics/SubscriptionStatus';
export { RevenueTrend } from './subscription-analytics/RevenueTrend';
export { HealthAnalysis } from './subscription-analytics/HealthAnalysis';
export { PaymentMethodTable } from './subscription-analytics/PaymentMethodTable';
export { RevenueForecast } from './subscription-analytics/RevenueForecast';
export { CustomerSegments } from './subscription-analytics/CustomerSegments';
export { RetentionMetrics } from './subscription-analytics/RetentionMetrics';
export { CustomerAcquisition } from './subscription-analytics/CustomerAcquisition';
export { SubscriptionMetrics } from './subscription-analytics/SubscriptionMetrics';
export { RevenueMetrics } from './subscription-analytics/RevenueMetrics';
export { AnalyticsSummary } from './subscription-analytics/AnalyticsSummary';

// Subscription Billing Components
export { CurrentSubscriptionCard } from './subscription-billing/CurrentSubscriptionCard';
export { SubscriptionHistoryTable } from './subscription-billing/SubscriptionHistoryTable';
export { PaymentHistoryTable } from './subscription-billing/PaymentHistoryTable';
export { BillingCyclesCard } from './subscription-billing/BillingCyclesCard';
export { UsageAnalyticsCard } from './subscription-billing/UsageAnalyticsCard';
export { UpgradePlanDialog } from './subscription-billing/UpgradePlanDialog';
export { BillingStatsCards } from './subscription-billing/StatsCards';