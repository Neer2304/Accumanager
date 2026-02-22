// services/systemHealthService.ts
export interface SystemService {
  id: string;
  name: string;
  type: 'database' | 'api' | 'authentication' | 'storage';
  status: 'healthy' | 'degraded' | 'down';
  responseTime: number;
  uptime: number;
  lastChecked: string;
  resources: {
    cpu: number;
    memory: number;
    disk: number;
  };
  details?: Record<string, any>;
}

export interface SystemAlert {
  id: string;
  serviceId: string;
  serviceName: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  timestamp: string;
  resolved: boolean;
  userId?: string;
}

export interface UserStats {
  totalDocuments: number;
  storageUsage: number;
  collectionsUsed: number;
  recentErrors: number;
}

export interface SystemHealthData {
  services: SystemService[];
  alerts: SystemAlert[];
  lastUpdated: string;
  userStats: UserStats;
}

export interface DatabaseStats {
  user: {
    id: string;
    totalDocuments: number;
    storageUsage: number;
    collectionsUsed: number;
  };
  database: {
    name: string;
    collections: number;
    totalDocuments: number;
    dataSize: number;
    storageSize: number;
    indexSize: number;
    connectionState: string;
  };
  collections: Array<{
    name: string;
    totalCount: number;
    userCount: number;
    size?: number;
    storageSize?: number;
    avgObjSize?: number;
    indexes?: number;
    error?: string;
  }>;
  connection: {
    host: string;
    port: number;
    name: string;
    readyState: number;
  };
}

class SystemHealthServiceClass {
  private baseUrl = '/api/system-health';
  private refreshInterval: NodeJS.Timeout | null = null;
  private listeners: ((data: SystemHealthData) => void)[] = [];

  /**
   * Get complete system health data
   */
  async getSystemHealth(): Promise<SystemHealthData> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch system health');
      }

      return data;
    } catch (error) {
      console.error('System health fetch error:', error);
      throw error;
    }
  }

  /**
   * Get detailed database stats
   */
  async getDatabaseStats(): Promise<DatabaseStats> {
    try {
      const response = await fetch(`${this.baseUrl}/stats`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch database stats');
      }

      return data;
    } catch (error) {
      console.error('Database stats fetch error:', error);
      throw error;
    }
  }

  /**
   * Get active alerts
   */
  async getAlerts(): Promise<SystemAlert[]> {
    try {
      const response = await fetch(`${this.baseUrl}/alerts`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch alerts');
      }

      return data.alerts || [];
    } catch (error) {
      console.error('Alerts fetch error:', error);
      throw error;
    }
  }

  /**
   * Resolve an alert
   */
  async resolveAlert(alertId: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/alerts/${alertId}/resolve`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to resolve alert');
      }

      return data;
    } catch (error) {
      console.error('Alert resolution error:', error);
      throw error;
    }
  }

  /**
   * Get health status summary
   */
  async getHealthSummary(): Promise<{
    overall: 'healthy' | 'degraded' | 'down';
    services: {
      healthy: number;
      degraded: number;
      down: number;
    };
    criticalAlerts: number;
  }> {
    try {
      const health = await this.getSystemHealth();
      
      const services = health.services.reduce(
        (acc, service) => {
          if (service.status === 'healthy') acc.healthy++;
          else if (service.status === 'degraded') acc.degraded++;
          else if (service.status === 'down') acc.down++;
          return acc;
        },
        { healthy: 0, degraded: 0, down: 0 }
      );

      const criticalAlerts = health.alerts.filter(
        alert => !alert.resolved && (alert.severity === 'high' || alert.severity === 'critical')
      ).length;

      let overall: 'healthy' | 'degraded' | 'down' = 'healthy';
      if (services.down > 0) {
        overall = 'down';
      } else if (services.degraded > 0 || criticalAlerts > 0) {
        overall = 'degraded';
      }

      return {
        overall,
        services,
        criticalAlerts,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Start real-time monitoring with callbacks
   */
  startMonitoring(callback: (data: SystemHealthData) => void, intervalMs: number = 30000): () => void {
    this.listeners.push(callback);
    
    if (!this.refreshInterval) {
      this.refreshInterval = setInterval(async () => {
        try {
          const data = await this.getSystemHealth();
          this.listeners.forEach(listener => listener(data));
        } catch (error) {
          console.error('Auto-refresh error:', error);
        }
      }, intervalMs);
    }

    // Return cleanup function
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
      if (this.listeners.length === 0 && this.refreshInterval) {
        clearInterval(this.refreshInterval);
        this.refreshInterval = null;
      }
    };
  }

  /**
   * Stop monitoring
   */
  stopMonitoring(): void {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
      this.refreshInterval = null;
    }
    this.listeners = [];
  }

  /**
   * Check if a service is healthy
   */
  isServiceHealthy(service: SystemService): boolean {
    return service.status === 'healthy' && service.resources.memory < 80 && service.resources.disk < 90;
  }

  /**
   * Get service health color
   */
  getServiceColor(status: SystemService['status']): string {
    switch (status) {
      case 'healthy': return '#34a853'; // Green
      case 'degraded': return '#fbbc04'; // Yellow
      case 'down': return '#ea4335'; // Red
      default: return '#5f6368'; // Grey
    }
  }

  /**
   * Get alert severity color
   */
  getAlertColor(severity: SystemAlert['severity']): string {
    switch (severity) {
      case 'low': return '#8ab4f8'; // Light Blue
      case 'medium': return '#fbbc04'; // Yellow
      case 'high': return '#f57c00'; // Orange
      case 'critical': return '#ea4335'; // Red
      default: return '#5f6368'; // Grey
    }
  }

  /**
   * Format bytes to human readable
   */
  formatBytes(bytes: number, decimals: number = 2): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }
}

export const SystemHealthService = new SystemHealthServiceClass();