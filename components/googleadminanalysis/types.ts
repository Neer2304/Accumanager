// components/googleadminanalysis/types.ts
export interface DatabaseStats {
  totalUsers: number;
  totalNotes: number;
  activeUsers: number;
  recentNotes: number;
  sharedNotes: number;
  recentUsers?: number;
}

export interface SystemOverview {
  databaseStats: DatabaseStats;
}

export interface UserAnalysis {
  usersByRole: Array<{ _id: string; count: number }>;
  usersByStatus: Array<{ _id: boolean; count: number }>;
  newUsersByDay: Array<{ _id: string; count: number }>;
}

export interface NotesAnalysis {
  notesByCategory: Array<{ _id: string; count: number }>;
  topUsersByNotes: Array<{
    name: string;
    email: string;
    noteCount: number;
    lastCreated: string;
  }>;
}

export interface EngagementAnalysis {
  averageEngagementRate?: number;
  averageSessionDuration?: number;
  dailyActiveUsers?: number;
  retentionRate?: number;
  bounceRate?: number;
  summary?: string;
}

export interface Summary {
  activeUserPercentage: number;
  notesPerActiveUser: number;
  growthRate: number;
  engagementScore: number;
  lastUpdated?: string;
}

export interface AnalysisData {
  systemOverview: SystemOverview;
  userAnalysis: UserAnalysis;
  notesAnalysis: NotesAnalysis;
  engagementAnalysis: EngagementAnalysis;
  summary: Summary;
}

export interface MaterialsSummary {
  totalMaterials: number;
  recentMaterials: number;
  totalStockValue: number;
  lowStockItems: number;
  outOfStockItems: number;
  avgMaterialsPerUser: number;
  materialGrowthRate: number;
  activeMaterialUsers: number;
  lastUpdated?: string;
}

export interface MaterialsAnalysis {
  materialsByCategory: Array<{ _id: string; count: number }>;
  topUsersByMaterials: Array<{
    name: string;
    email: string;
    company: string;
    materialCount: number;
    totalInventoryValue: number;
    avgUnitCost: number;
  }>;
}

export interface MaterialsAnalysisData {
  materialAnalysis: MaterialsAnalysis;
  userEngagement: {
    usersWithNoMaterials: Array<{ count: number }>;
    usersWithManyMaterials: Array<{ count: number }>;
  };
  summary: MaterialsSummary;
}

export interface StatsCardProps {
  title: string;
  value: string | number;
  subValue?: string;
  icon: React.ElementType;
  color: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  trend?: number;
  showTrend?: boolean;
  showProgress?: boolean;
  compact?: boolean;
  darkMode?: boolean;
}

export interface AnalysisHeaderProps {
  timeframe: string;
  onTimeframeChange: (value: string) => void;
  onRefresh: () => void;
  loading: boolean;
  compact?: boolean;
  darkMode?: boolean;
  isMobile?: boolean;
  isTablet?: boolean;
}