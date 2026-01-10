/**
 * Core interfaces for the BusinessHub Hybrid App.
 * All models include fields for sync/offline management.
 */

// --- Base Sync Model ---
export interface SyncableBase {
  // Primary key used by local IndexedDB (Dexie)
  id?: number; 
  // Document ID used by remote Firestore
  remoteId: string | null; 
  // User ID associated with the data
  userId: string;
  // True if the record matches the remote database
  isSynced: boolean; 
  // True if the record is locally marked for deletion on remote
  isDeleted: boolean; 
  createdAt: string; // ISO Date string (local or server)
  updatedAt: string; // ISO Date string (local or server)
}

// --- 1. Product Model ---
export interface Product extends SyncableBase {
  name: string;
  sku: string;
  // Base price before GST
  basePrice: number; 
  // GST percentage (e.g., 18 for 18%)
  gstPercent: number; 
  stock: number;
  // Placeholder for image storage (will store a URL/path)
  imageUrl?: string; 
}

// --- 2. Customer Model ---
export interface Customer extends SyncableBase {
  name: string;
  phone: string;
  email: string;
  address: string;
  // Optional GSTIN for B2B billing
  gstin?: string; 
}

// --- 3. Attendance Model ---
export interface AttendanceRecord extends SyncableBase {
  employeeName: string;
  // ISO Date string for the day
  date: string; 
  // ISO Date string for check-in time
  checkInTime: string; 
  // ISO Date string for check-out time
  checkOutTime: string | null;
  status: 'present' | 'absent' | 'late';
}

// --- 4. Bill/Invoice Model ---
export interface BillItem {
  productId: string; // remoteId of the product
  name: string;
  quantity: number;
  basePrice: number;
  gstPercent: number;
  total: number; // Quantity * (Base Price * (1 + GST Percent))
}

export interface Bill extends SyncableBase {
  // remoteId of the customer
  customerId: string | null; 
  customerName: string;
  // Array of products sold
  items: BillItem[]; 
  subtotal: number; // Sum of base prices of all items
  totalGST: number; // Sum of GST amount
  totalAmount: number; // Final amount (Subtotal + Total GST)
  billDate: string; // Date of the transaction
}

