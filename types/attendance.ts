// types/attendance.ts
export interface Day {
  date: string;
  status: "Present" | "Absent";
  checkIn?: string;
  checkOut?: string;
  workHours?: number;
  overtime?: number;
  notes?: string;
  lateReason?: string;
}

export interface EmergencyContact {
  name: string;
  phone: string;
  relation: string;
}

export interface BankDetails {
  accountNumber: string;
  bankName: string;
  ifscCode: string;
  accountHolder: string;
}

export interface Documents {
  aadhaar?: string;
  pan?: string;
  license?: string;
}

export interface Employee {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  role: string;
  department?: string;
  salary: number;
  salaryType: string;
  joiningDate: string;
  address?: string;
  emergencyContact?: EmergencyContact;
  bankDetails?: BankDetails;
  documents?: Documents;
  leaveBalance: number;
  isActive: boolean;
  days: Day[];
}