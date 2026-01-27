export interface Employee {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  role: string;
  department: string;
  salary: number;
  salaryType: 'monthly' | 'daily' | 'hourly';
  joiningDate: string;
  address?: string;
  emergencyContact?: string;
  bankDetails?: {
    accountNumber?: string;
    bankName?: string;
    ifscCode?: string;
    upiId?: string;
  };
  documents?: Array<{
    name: string;
    url: string;
    type: string;
  }>;
  leaveBalance: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export interface AttendanceRecord {
  _id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  checkIn?: string;
  checkOut?: string;
  status: 'present' | 'absent' | 'half-day' | 'leave';
  workHours: number;
  overtime: number;
  notes?: string;
  lateReason?: string;
}

export interface EmployeeFilters {
  search: string;
  department: string;
  role: string;
  isActive: boolean | string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  page: number;
  limit: number;
}

export const defaultEmployeeFilters: EmployeeFilters = {
  search: '',
  department: '',
  role: '',
  isActive: 'all',
  sortBy: 'name',
  sortOrder: 'asc',
  page: 1,
  limit: 20,
};

export interface CreateEmployeeRequest {
  name: string;
  phone: string;
  email?: string;
  role: string;
  department: string;
  salary: number;
  salaryType: 'monthly' | 'daily' | 'hourly';
  joiningDate: string;
  address?: string;
  emergencyContact?: string;
  bankDetails?: {
    accountNumber?: string;
    bankName?: string;
    ifscCode?: string;
    upiId?: string;
  };
  documents?: Array<{
    name: string;
    url: string;
    type: string;
  }>;
}

export interface UpdateEmployeeRequest extends Partial<CreateEmployeeRequest> {
  isActive?: boolean;
}

export interface AttendanceRequest {
  employeeId: string;
  date: string;
  status: 'present' | 'absent' | 'half-day' | 'leave';
  checkIn?: string;
  checkOut?: string;
  notes?: string;
  lateReason?: string;
}