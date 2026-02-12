// types/company-context.ts
import { IUser } from '../models/User';
import { ICompany } from '../models/Company';
import { IUserCompany } from '../models/UserCompany';

export interface CompanyContext {
  user: IUser;
  company: ICompany;
  userCompany: IUserCompany;
}

export interface SecureQuery {
  companyId: string;
  userId?: string;
  assignedTo?: string;
  'sharedWith.userId'?: string;
}

export type UserRole = 'admin' | 'manager' | 'member' | 'viewer';

export type EntityType = 
  | 'Lead' 
  | 'Contact' 
  | 'Account' 
  | 'Deal' 
  | 'Project' 
  | 'Task' 
  | 'Activity' 
  | 'Note' 
  | 'Order';