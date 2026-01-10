// utils/offlineStorage.ts - COMPLETE SOLUTION
const localForage = require('localforage');

// Configure localForage
(localForage as any).config({
  name: 'accumanage-business',
  version: 1.0,
  storeName: 'business_data',
  description: 'Offline storage for AccumaManage'
});

interface StorageResult<T = any> {
  success: boolean;
  data?: T;
  error?: unknown;
}

interface BaseItem {
  id: string;
  isLocal: boolean;
  isSynced: boolean;
  createdAt: Date;
  updatedAt: Date;
  syncAttempts: number;
  lastSyncAttempt?: Date;
}

interface SyncQueueItem {
  id: string;
  action: 'create' | 'update' | 'delete';
  collection: string;
  itemId: string;
  data?: any;
  timestamp: Date;
  attempts: number;
}

export const offlineStorage = {
  // Basic storage operations
  async setItem(key: string, value: any): Promise<StorageResult> {
    try {
      await (localForage as any).setItem(key, value);
      return { success: true };
    } catch (error) {
      console.error('Error saving to offline storage:', error);
      return { success: false, error };
    }
  },

  async getItem<T = any>(key: string): Promise<T | null> {
    try {
      return await (localForage as any).getItem(key);
    } catch (error) {
      console.error('Error reading from offline storage:', error);
      return null;
    }
  },

  async removeItem(key: string): Promise<StorageResult> {
    try {
      await (localForage as any).removeItem(key);
      return { success: true };
    } catch (error) {
      console.error('Error removing from offline storage:', error);
      return { success: false, error };
    }
  },

  async clear(): Promise<StorageResult> {
    try {
      await (localForage as any).clear();
      return { success: true };
    } catch (error) {
      console.error('Error clearing offline storage:', error);
      return { success: false, error };
    }
  },

  // Business data operations
  async addItem<T extends { id?: string; createdAt?: Date }>(
    key: string, 
    item: Omit<T, keyof BaseItem>,
    options: { syncImmediately?: boolean } = {}
  ): Promise<StorageResult<T & BaseItem>> {
    try {
      const existing = (await offlineStorage.getItem<(T & BaseItem)[]>(key)) || [];
      
      const newItem: T & BaseItem = {
        ...item,
        id: (item as any).id || `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        isLocal: !(item as any).id,
        isSynced: options.syncImmediately ? false : !!(item as any).id,
        createdAt: (item as any).createdAt || new Date(),
        updatedAt: new Date(),
        syncAttempts: 0
      } as T & BaseItem;
      
      existing.push(newItem);
      await offlineStorage.setItem(key, existing);
      
      // Add to sync queue if it's a new local item
      if (newItem.isLocal && !newItem.isSynced) {
        await this.addToSyncQueue('create', key, newItem.id, newItem);
      }
      
      return { success: true, data: newItem };
    } catch (error) {
      console.error('Error adding item to offline storage:', error);
      return { success: false, error };
    }
  },

  async updateItem<T extends BaseItem>(
    key: string, 
    updatedItem: Partial<T> & { id: string }
  ): Promise<StorageResult<T>> {
    try {
      const existing = (await offlineStorage.getItem<T[]>(key)) || [];
      const index = existing.findIndex((item: T) => item.id === updatedItem.id);
      
      if (index !== -1) {
        const updated = {
          ...existing[index],
          ...updatedItem,
          updatedAt: new Date(),
          isSynced: existing[index].isSynced ? false : existing[index].isSynced,
          syncAttempts: (existing[index].syncAttempts || 0) + 1
        } as T;
        
        existing[index] = updated;
        await offlineStorage.setItem(key, existing);
        
        // Add to sync queue if it was previously synced
        if (existing[index].isSynced) {
          await this.addToSyncQueue('update', key, updatedItem.id, updated);
        }
        
        return { success: true, data: updated };
      }
      return { success: false, error: 'Item not found' };
    } catch (error) {
      console.error('Error updating item in offline storage:', error);
      return { success: false, error };
    }
  },

  async deleteItem(key: string, itemId: string): Promise<StorageResult> {
    try {
      const existing = (await offlineStorage.getItem<any[]>(key)) || [];
      const itemToDelete = existing.find((item: any) => item.id === itemId);
      const filtered = existing.filter((item: any) => item.id !== itemId);
      await offlineStorage.setItem(key, filtered);
      
      // Add to sync queue if it was synced before
      if (itemToDelete?.isSynced) {
        await this.addToSyncQueue('delete', key, itemId);
      }
      
      return { success: true };
    } catch (error) {
      console.error('Error deleting item from offline storage:', error);
      return { success: false, error };
    }
  },

  // Sync Queue Management
  async addToSyncQueue(action: 'create' | 'update' | 'delete', collection: string, itemId: string, data?: any) {
    try {
      const syncQueue = await this.getItem<SyncQueueItem[]>('sync_queue') || [];
      
      const queueItem: SyncQueueItem = {
        id: `sync_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        action,
        collection,
        itemId,
        data,
        timestamp: new Date(),
        attempts: 0
      };
      
      syncQueue.push(queueItem);
      await this.setItem('sync_queue', syncQueue);
      
      // Try to sync immediately if online
      if (navigator.onLine) {
        this.processSyncQueue();
      }
      
      return { success: true, data: queueItem };
    } catch (error) {
      console.error('Error adding to sync queue:', error);
      return { success: false, error };
    }
  },

  async processSyncQueue() {
    if (!navigator.onLine) {
      console.log('Offline - cannot process sync queue');
      return;
    }

    try {
      const syncQueue = await this.getItem<SyncQueueItem[]>('sync_queue') || [];
      if (syncQueue.length === 0) return;

      console.log(`Processing ${syncQueue.length} items in sync queue...`);

      const successfulSyncs: string[] = [];
      const failedSyncs: SyncQueueItem[] = [];

      for (const queueItem of syncQueue) {
        try {
          const success = await this.syncQueueItem(queueItem);
          if (success) {
            successfulSyncs.push(queueItem.id);
          } else {
            failedSyncs.push(queueItem);
          }
        } catch (error) {
          console.error(`Error syncing item ${queueItem.id}:`, error);
          failedSyncs.push(queueItem);
        }
      }

      // Remove successful syncs from queue
      const updatedQueue = syncQueue.filter(item => 
        !successfulSyncs.includes(item.id)
      );

      // Update failed syncs with attempt count
      for (const failedItem of failedSyncs) {
        failedItem.attempts += 1;
        failedItem.timestamp = new Date();
      }

      await this.setItem('sync_queue', updatedQueue);

      console.log(`Sync completed: ${successfulSyncs.length} successful, ${failedSyncs.length} failed`);

    } catch (error) {
      console.error('Error processing sync queue:', error);
    }
  },

  async syncQueueItem(queueItem: SyncQueueItem): Promise<boolean> {
    try {
      const API_ENDPOINTS: Record<string, string> = {
        'tasks': '/api/tasks',
        'projects': '/api/projects',
        'notes': '/api/notes',
        'meetings': '/api/meetings',
        'pending_products': '/api/products',
        'pending_bills': '/api/bills',
        'pending_attendance': '/api/attendance',
        'expenses': '/api/expenses'
      };

      const endpoint = API_ENDPOINTS[queueItem.collection];
      if (!endpoint) {
        // console.error(`No endpoint found for collection: ${queueItem.collection}`);
        return false;
      }

      let response: Response;

      switch (queueItem.action) {
        case 'create':
          response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(queueItem.data),
            credentials: 'include'
          });
          break;

        case 'update':
          // For tasks, we use PUT to /api/tasks with taskId in body
          if (queueItem.collection === 'tasks') {
            response = await fetch(endpoint, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                taskId: queueItem.itemId,
                ...queueItem.data
              }),
              credentials: 'include'
            });
          } else {
            response = await fetch(`${endpoint}/${queueItem.itemId}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(queueItem.data),
              credentials: 'include'
            });
          }
          break;

        case 'delete':
          // For tasks, we use query parameter
          if (queueItem.collection === 'tasks') {
            response = await fetch(`${endpoint}?id=${queueItem.itemId}`, {
              method: 'DELETE',
              credentials: 'include'
            });
          } else {
            response = await fetch(`${endpoint}/${queueItem.itemId}`, {
              method: 'DELETE',
              credentials: 'include'
            });
          }
          break;

        default:
          return false;
      }

      if (response.ok) {
        // Mark the original item as synced
        if (queueItem.action !== 'delete') {
          const existingItems = await this.getItem<any[]>(queueItem.collection) || [];
          const itemIndex = existingItems.findIndex((item: any) => item.id === queueItem.itemId);
          if (itemIndex !== -1) {
            existingItems[itemIndex].isSynced = true;
            existingItems[itemIndex].syncAttempts = 0;
            await this.setItem(queueItem.collection, existingItems);
          }
        }
        return true;
      } else {
        // console.error(`Sync failed for ${queueItem.collection}/${queueItem.itemId}:`, response.status, response.statusText);
        return false;
      }
    } catch (error) {
      console.error(`Error syncing queue item:`, error);
      return false;
    }
  },

  // Business specific methods
  async getPendingSyncItems() {
    const pendingTasks = await this.getItem<any[]>('tasks') || [];
    const pendingProjects = await this.getItem<any[]>('projects') || [];
    const pendingProducts = await this.getItem<any[]>('pending_products') || [];
    const pendingBills = await this.getItem<any[]>('pending_bills') || [];
    const pendingAttendance = await this.getItem<any[]>('pending_attendance') || [];
    const pendingNotes = await this.getItem<any[]>('notes') || [];
    const pendingMeetings = await this.getItem<any[]>('meetings') || [];
    const pendingExpenses = await this.getItem<any[]>('expenses') || [];
    
    const pendingSync = [
      ...pendingTasks.filter((item: any) => !item.isSynced),
      ...pendingProjects.filter((item: any) => !item.isSynced),
      ...pendingProducts.filter((item: any) => !item.isSynced),
      ...pendingBills.filter((item: any) => !item.isSynced),
      ...pendingAttendance.filter((item: any) => !item.isSynced),
      ...pendingNotes.filter((item: any) => !item.isSynced),
      ...pendingMeetings.filter((item: any) => !item.isSynced),
      ...pendingExpenses.filter((item: any) => !item.isSynced)
    ];
    
    return {
      pendingTasks: pendingTasks.filter((item: any) => !item.isSynced),
      pendingProjects: pendingProjects.filter((item: any) => !item.isSynced),
      pendingProducts: pendingProducts.filter((item: any) => !item.isSynced),
      pendingBills: pendingBills.filter((item: any) => !item.isSynced),
      pendingAttendance: pendingAttendance.filter((item: any) => !item.isSynced),
      pendingNotes: pendingNotes.filter((item: any) => !item.isSynced),
      pendingMeetings: pendingMeetings.filter((item: any) => !item.isSynced),
      pendingExpenses: pendingExpenses.filter((item: any) => !item.isSynced),
      totalPending: pendingSync.length
    };
  },

  async markItemAsSynced(collection: string, itemId: string): Promise<StorageResult> {
    try {
      const existing = (await this.getItem<any[]>(collection)) || [];
      const updated = existing.map((item: any) => 
        item.id === itemId ? { ...item, isSynced: true, syncAttempts: 0 } : item
      );
      await this.setItem(collection, updated);
      return { success: true };
    } catch (error) {
      console.error('Error marking item as synced:', error);
      return { success: false, error };
    }
  },

  // Network status monitoring
  async initializeSync() {
    // Listen for online/offline events
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => {
        console.log('Online - starting sync process');
        this.processSyncQueue();
      });

      window.addEventListener('offline', () => {
        console.log('Offline - queuing operations for later sync');
      });

      // Initial sync check
      if (navigator.onLine) {
        setTimeout(() => this.processSyncQueue(), 2000);
      }
    }
  },

  // Get sync status
  async getSyncStatus() {
    const pendingItems = await this.getPendingSyncItems();
    const syncQueue = await this.getItem<SyncQueueItem[]>('sync_queue') || [];
    
    return {
      isOnline: navigator.onLine,
      pendingSyncCount: pendingItems.totalPending,
      queueLength: syncQueue.length,
      lastSync: new Date().toISOString(),
      storageUsage: await this.getStorageUsage()
    };
  },

  async getStorageUsage() {
    try {
      let totalSize = 0;
      const keys = await (localForage as any).keys();
      
      for (const key of keys) {
        const item = await this.getItem(key);
        if (item) {
          totalSize += new Blob([JSON.stringify(item)]).size;
        }
      }
      
      return {
        totalBytes: totalSize,
        totalMB: Math.round((totalSize / 1024 / 1024) * 100) / 100,
        itemCount: keys.length
      };
    } catch (error) {
      return { totalBytes: 0, totalMB: 0, itemCount: 0 };
    }
  }
};

// utils/offlineStorage.ts
const PREFIX = 'business_manager_';

export const offlineStorages = {
  // Set item
  setItem: async <T>(key: string, value: T): Promise<void> => {
    try {
      const serializedValue = JSON.stringify(value);
      localStorage.setItem(`${PREFIX}${key}`, serializedValue);
    } catch (error) {
      console.error(`Error saving to localStorage: ${error}`);
    }
  },

  // Get item
  getItem: async <T>(key: string): Promise<T | null> => {
    try {
      const item = localStorage.getItem(`${PREFIX}${key}`);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Error reading from localStorage: ${error}`);
      return null;
    }
  },

  // Remove item
  removeItem: async (key: string): Promise<void> => {
    try {
      localStorage.removeItem(`${PREFIX}${key}`);
    } catch (error) {
      console.error(`Error removing from localStorage: ${error}`);
    }
  },

  // Clear all app storage
  clear: async (): Promise<void> => {
    try {
      Object.keys(localStorage)
        .filter(key => key.startsWith(PREFIX))
        .forEach(key => localStorage.removeItem(key));
    } catch (error) {
      console.error(`Error clearing localStorage: ${error}`);
    }
  },

  // Get all items
  getAllItems: async (): Promise<Record<string, any>> => {
    try {
      const items: Record<string, any> = {};
      Object.keys(localStorage)
        .filter(key => key.startsWith(PREFIX))
        .forEach(key => {
          try {
            items[key.replace(PREFIX, '')] = JSON.parse(localStorage.getItem(key) || 'null');
          } catch (e) {
            console.error(`Error parsing item ${key}: ${e}`);
          }
        });
      return items;
    } catch (error) {
      console.error(`Error getting all items: ${error}`);
      return {};
    }
  },
};

// Initialize sync when module loads
if (typeof window !== 'undefined') {
  offlineStorage.initializeSync();
}

