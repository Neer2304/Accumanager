// types/analysis.ts
export interface SystemOverview {
  databaseStats: {
    totalUsers: number;
    totalNotes: number;
    activeUsers: number;
    recentNotes: number;
    recentUsers: number;
    userGrowthRate: number;
  };
}

export interface UserAnalysis {
  usersByRole: Array<{ _id: string; count: number }>;
  newUsersByDay: Array<{ _id: string; count: number }>;
  usersByStatus: Array<{ _id: string; count: number }>;
  topActiveUsers: Array<{
    _id: string;
    name: string;
    email: string;
    role: string;
    lastLogin: string;
    createdAt: string;
    noteCount: number;
  }>;
}

export interface NotesAnalysis {
  totalNotes: Array<{ count: number }>;
  recentNotes: Array<{ count: number }>;
  notesByCategory: Array<{ _id: string; count: number }>;
  notesByDay: Array<{ _id: string; count: number }>;
  topUsersByNotes: Array<{
    userId: string;
    noteCount: number;
    lastCreated: string;
    name: string;
    email: string;
    role: string;
  }>;
}

export interface EngagementAnalysis {
  usersWithNoNotes: Array<{ count: number }>;
  usersWithManyNotes: Array<{ count: number }>;
}

export interface AnalysisSummary {
  activeUserPercentage: number;
  notesPerActiveUser: number;
  growthRate: number;
  engagementScore: number;
}

export interface AnalysisData {
  systemOverview: SystemOverview;
  userAnalysis: UserAnalysis;
  notesAnalysis: NotesAnalysis;
  engagementAnalysis: EngagementAnalysis;
  summary: AnalysisSummary;
}

// Materials Analysis Types
export interface StockStatistics {
  totalStockValue: number;
  avgCurrentStock: number;
  totalLowStockItems: number;
  totalOutOfStockItems: number;
  avgReorderPoint: number;
}

export interface CategoryValue {
  _id: string;
  itemCount: number;
  totalValue: number;
  avgStock: number;
}

export interface PriceDistribution {
  _id: string;
  count: number;
  totalValue: number;
}

export interface TopUserMaterial {
  userId: string;
  materialCount: number;
  totalInventoryValue: number;
  avgUnitCost: number;
  lastCreated: string;
  name: string;
  email: string;
  company: string;
}

export interface MaterialAnalysis {
  totalMaterials: Array<{ count: number }>;
  recentMaterials: Array<{ count: number }>;
  materialsByCategory: Array<{ _id: string; count: number }>;
  materialsByStatus: Array<{ _id: string; count: number }>;
  materialsByDay: Array<{ _id: string; count: number; totalValue: number }>;
  topUsersByMaterials: TopUserMaterial[];
  stockStatistics: StockStatistics[];
  categoryValue: CategoryValue[];
  priceDistribution: PriceDistribution[];
}

export interface MaterialUserEngagement {
  usersWithNoMaterials: Array<{ count: number }>;
  usersWithFewMaterials: Array<{ count: number }>;
  usersWithModerateMaterials: Array<{ count: number }>;
  usersWithManyMaterials: Array<{ count: number }>;
  materialsPerUser: Array<{
    avgMaterialsPerUser: number;
    maxMaterialsPerUser: number;
    minMaterialsPerUser: number;
    avgInventoryValue: number;
    totalAnalyzedUsers: number;
  }>;
}

export interface MaterialsAnalysisSummary {
  totalMaterials: number;
  recentMaterials: number;
  totalStockValue: number;
  lowStockItems: number;
  outOfStockItems: number;
  avgMaterialsPerUser: number;
  materialGrowthRate: number;
  activeMaterialUsers: number;
}

export interface MaterialsAnalysisData {
  materialAnalysis: MaterialAnalysis;
  userEngagement: MaterialUserEngagement;
  summary: MaterialsAnalysisSummary;
}

export interface TimeRangeOption {
  value: number;
  label: string;
  days: number;
}

export const TIME_RANGE_OPTIONS: TimeRangeOption[] = [
  { value: 7, label: 'Last 7 Days', days: 7 },
  { value: 30, label: 'Last 30 Days', days: 30 },
  { value: 90, label: 'Last 90 Days', days: 90 },
  { value: 365, label: 'Last Year', days: 365 },
];