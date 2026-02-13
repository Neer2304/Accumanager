import Company from '@/models/Company';
import CompanyMember from '@/models/CompanyMember';
import { connectToDatabase } from '@/lib/mongodb';

export const COMPANY_LIMITS = {
  MAX_COMPANIES_PER_USER: 2,
  FREE_PLAN_MAX_MEMBERS: 10,
  PRO_PLAN_MAX_MEMBERS: 50,
  ENTERPRISE_PLAN_MAX_MEMBERS: 999
};

export class CompanyLimitService {
  
  // ✅ Get count of companies owned by user
  static async getUserCompanyCount(userId: string): Promise<number> {
    try {
      await connectToDatabase();
      const count = await Company.countDocuments({
        createdBy: userId,
        isActive: true,
        deletedAt: null
      });
      return count;
    } catch (error) {
      console.error('Error counting companies:', error);
      return 0;
    }
  }
  
  // ✅ Check if user can create more companies
  static async canCreateCompany(userId: string): Promise<{
    canCreate: boolean;
    current: number;
    max: number;
    remaining: number;
  }> {
    const current = await this.getUserCompanyCount(userId);
    const max = COMPANY_LIMITS.MAX_COMPANIES_PER_USER;
    
    return {
      canCreate: current < max,
      current,
      max,
      remaining: max - current
    };
  }
  
  // ✅ Get all companies user has access to
  static async getUserAccessibleCompanies(userId: string) {
    await connectToDatabase();
    
    // Companies user owns
    const ownedCompanies = await Company.find({
      createdBy: userId,
      isActive: true,
      deletedAt: null
    }).sort({ createdAt: -1 }).lean();
    
    // Companies user is member of
    const memberships = await CompanyMember.find({
      memberId: userId,
      status: 'active'
    }).select('companyId').lean();
    
    const memberCompanyIds = memberships.map(m => m.companyId);
    
    const memberCompanies = await Company.find({
      _id: { $in: memberCompanyIds },
      isActive: true,
      deletedAt: null
    }).sort({ createdAt: -1 }).lean();
    
    // Combine and deduplicate
    const allCompanies = [...ownedCompanies, ...memberCompanies];
    const uniqueMap = new Map();
    allCompanies.forEach(company => {
      uniqueMap.set(company._id.toString(), company);
    });
    
    return Array.from(uniqueMap.values());
  }
  
  // ✅ Get user's role in a specific company
  static async getUserRoleInCompany(userId: string, companyId: string): Promise<string | null> {
    await connectToDatabase();
    
    // Check if user is owner/admin
    const isOwner = await Company.exists({
      _id: companyId,
      createdBy: userId,
      isActive: true,
      deletedAt: null
    });
    
    if (isOwner) return 'admin';
    
    // Check if user is member
    const membership = await CompanyMember.findOne({
      companyId,
      memberId: userId,
      status: 'active'
    }).lean();
    
    return membership?.role || null;
  }
  
  // ✅ Check if user can manage members in a company
  static async canManageMembers(userId: string, companyId: string): Promise<boolean> {
    await connectToDatabase();
    
    // Owner can always manage
    const isOwner = await Company.exists({
      _id: companyId,
      createdBy: userId
    });
    
    if (isOwner) return true;
    
    // Check member permissions
    const membership = await CompanyMember.findOne({
      companyId,
      memberId: userId,
      status: 'active'
    }).lean();
    
    return membership?.permissions?.canManageMembers || false;
  }
  
  // ✅ Check company member limit
  static async checkMemberLimit(companyId: string): Promise<{
    canAdd: boolean;
    current: number;
    max: number;
    remaining: number;
  }> {
    await connectToDatabase();
    
    const company = await Company.findById(companyId).lean();
    if (!company) {
      return { canAdd: false, current: 0, max: 0, remaining: 0 };
    }
    
    const currentMembers = await CompanyMember.countDocuments({
      companyId,
      status: 'active'
    });
    
    const max = company.maxMembers || COMPANY_LIMITS.FREE_PLAN_MAX_MEMBERS;
    
    return {
      canAdd: currentMembers < max,
      current: currentMembers,
      max,
      remaining: max - currentMembers
    };
  }
}

// ✅ Helper function to get default permissions by role
export function getDefaultPermissions(role: string) {
  switch(role) {
    case 'admin':
      return {
        canManageProjects: true,
        canManageTasks: true,
        canManageMembers: true,
        canDeleteCompany: true
      };
    case 'manager':
      return {
        canManageProjects: true,
        canManageTasks: true,
        canManageMembers: false,
        canDeleteCompany: false
      };
    case 'member':
      return {
        canManageProjects: false,
        canManageTasks: true,
        canManageMembers: false,
        canDeleteCompany: false
      };
    case 'viewer':
      return {
        canManageProjects: false,
        canManageTasks: false,
        canManageMembers: false,
        canDeleteCompany: false
      };
    default:
      return {
        canManageProjects: false,
        canManageTasks: true,
        canManageMembers: false,
        canDeleteCompany: false
      };
  }
}