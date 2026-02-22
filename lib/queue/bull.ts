// lib/queue/bull.ts
import Queue from 'bull';
import { redisCache } from '@/lib/cache/redis';

class JobQueue {
  private materialQueue: Queue.Queue;

  constructor() {
    this.materialQueue = new Queue('material-processing', {
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
      },
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 1000,
        },
        removeOnComplete: true,
        removeOnFail: false,
      },
    });

    this.setupProcessors();
  }

  private setupProcessors() {
    // Process material updates
    this.materialQueue.process('update-material', async (job) => {
      const { materialId, userId, updateData } = job.data;
      
      // Perform the update
      // This runs in background
      
      // Invalidate cache
      await redisCache.flushUserCache(userId);
      
      return { success: true, materialId };
    });

    // Process usage history
    this.materialQueue.process('record-usage', async (job) => {
      const { materialId, userId, usageData } = job.data;
      
      // Record usage in background
      
      return { success: true };
    });

    // Process stats calculation
    this.materialQueue.process('calculate-stats', async (job) => {
      const { userId } = job.data;
      
      // Calculate stats in background
      // Update cache
      
      return { success: true };
    });
  }

  async addMaterialJob(type: string, data: any): Promise<Queue.Job> {
    return this.materialQueue.add(type, data, {
      priority: type === 'update-material' ? 1 : 2,
    });
  }

  async addBulkJobs(jobs: Array<{ type: string; data: any }>): Promise<void> {
    const bullJobs = jobs.map(job => ({
      name: job.type,
      data: job.data,
    }));
    await this.materialQueue.addBulk(bullJobs);
  }

  getQueue(): Queue.Queue {
    return this.materialQueue;
  }
}

export const jobQueue = new JobQueue();