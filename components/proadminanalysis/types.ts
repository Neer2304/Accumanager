// components/proadminanalysis/types.ts
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

export const proColors = {
  primary: '#1a73e8',
  primaryLight: '#8ab4f8',
  secondary: '#34a853',
  warning: '#fbbc04',
  error: '#ea4335',
  grey50: '#f8f9fa',
  grey100: '#f1f3f4',
  grey200: '#e8eaed',
  grey300: '#dadce0',
  grey400: '#bdc1c6',
  grey500: '#9aa0a6',
  grey600: '#80868b',
  grey700: '#5f6368',
  grey800: '#3c4043',
  grey900: '#202124',
  surface: '#ffffff',
  surfaceDark: '#303134',
  bg: '#f8f9fa',
  bgDark: '#202124',
};