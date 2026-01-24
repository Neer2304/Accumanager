// components/admin-side/types.ts
export interface DatabaseStats {
  totalUsers: number
  totalNotes: number
  activeUsers: number
  recentNotes: number
  sharedNotes: number
}

export interface SystemOverview {
  databaseStats: DatabaseStats
}

export interface AnalysisData {
  systemOverview: SystemOverview
  userAnalysis: {
    usersByRole: Array<{ _id: string; count: number }>
    usersByStatus: Array<{ _id: boolean; count: number }>
    newUsersByDay: Array<{ _id: string; count: number }>
  }
  notesAnalysis: {
    notesByCategory: Array<{ _id: string; count: number }>
    topUsersByNotes: Array<{
      name: string
      email: string
      noteCount: number
      lastCreated: string
    }>
  }
  engagementAnalysis: {
    usersWithNoNotes: Array<{ count: number }>
    usersWithManyNotes: Array<{ count: number }>
  }
  summary: {
    activeUserPercentage: number
    notesPerActiveUser: number
    growthRate: number
    engagementScore: number
  }
}

export interface MaterialsAnalysisData {
  materialAnalysis: {
    materialsByCategory: Array<{ _id: string; count: number }>
    topUsersByMaterials: Array<{
      name: string
      email: string
      company: string
      materialCount: number
      totalInventoryValue: number
      avgUnitCost: number
    }>
  }
  userEngagement: {
    usersWithNoMaterials: Array<{ count: number }>
    usersWithManyMaterials: Array<{ count: number }>
  }
  summary: {
    totalMaterials: number
    recentMaterials: number
    totalStockValue: number
    lowStockItems: number
    outOfStockItems: number
    avgMaterialsPerUser: number
    materialGrowthRate: number
    activeMaterialUsers: number
  }
}