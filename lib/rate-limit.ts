// lib/rate-limit.ts
import { LRUCache } from 'lru-cache';

interface RateLimitOptions {
  interval: number; // Time window in milliseconds
  uniqueTokenPerInterval?: number; // Max unique tokens per interval
}

interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: Date;
}

export function rateLimit(options: RateLimitOptions) {
  const tokenCache = new LRUCache<string, number[]>({
    max: options.uniqueTokenPerInterval || 500,
    ttl: options.interval,
  });

  return {
    check: (token: string, limit: number): Promise<boolean> => {
      return new Promise((resolve) => {
      // return new Promise<boolean>((resolve) => { // Fixed Promise type
        const now = Date.now();
        const tokenCount = tokenCache.get(token) || [0];
        
        if (tokenCount[0] === 0) {
          tokenCache.set(token, [1]);
        }
        
        const currentUsage = tokenCount[0];
        
        if (currentUsage >= limit) {
          resolve(true); // Rate limited
        } else {
          tokenCount[0] = currentUsage + 1;
          tokenCache.set(token, tokenCount);
          resolve(false); // Not rate limited
        }
      });
    },
    
    getRemaining: (token: string, limit: number): RateLimitResult => {
      const tokenCount = tokenCache.get(token) || [0];
      const currentUsage = tokenCount[0];
      const remaining = Math.max(0, limit - currentUsage);
      const reset = new Date(Date.now() + options.interval);
      
      return {
        success: remaining > 0,
        limit,
        remaining,
        reset,
      };
    },
    
    reset: (token: string): void => {
      tokenCache.delete(token);
    },
    
    // Utility methods for headers
    getHeaders: (token: string, limit: number): Record<string, string> => {
      const result = this.getRemaining(token, limit); // Fixed "this" usage
      return {
        'X-RateLimit-Limit': limit.toString(),
        'X-RateLimit-Remaining': result.remaining.toString(),
        'X-RateLimit-Reset': result.reset.toISOString(),
        'X-RateLimit-Reset-Timestamp': result.reset.getTime().toString(),
      };
    },
    
    // Cleanup expired entries (optional, LRU handles it automatically)
    cleanup: (): void => {
      tokenCache.purgeStale();
    },
  };
}

// Alternative: Redis-based rate limiting for distributed systems
export class RedisRateLimiter {
  constructor(private redis: any) {} // Redis client instance

  async check(
    key: string,
    limit: number,
    window: number
  ): Promise<RateLimitResult> {
    const now = Date.now();
    const windowStart = now - window;
    
    // Remove old entries
    await this.redis.zremrangebyscore(key, 0, windowStart);
    
    // Get current count
    const currentCount = await this.redis.zcard(key);
    
    if (currentCount >= limit) {
      return {
        success: false,
        limit,
        remaining: 0,
        reset: new Date(now + window),
      };
    }
    
    // Add new entry
    await this.redis.zadd(key, now, `${now}-${Math.random()}`);
    await this.redis.expire(key, Math.ceil(window / 1000));
    
    return {
      success: true,
      limit,
      remaining: limit - currentCount - 1,
      reset: new Date(now + window),
    };
  }
}

// Alternative: Token Bucket algorithm
export class TokenBucket {
  private tokens: Map<string, { tokens: number; lastRefill: number }> = new Map();
  
  constructor(
    private capacity: number,
    private refillRate: number, // tokens per second
    private refillInterval: number = 1000 // ms
  ) {}

  async check(key: string, cost: number = 1): Promise<boolean> {
    const now = Date.now();
    let bucket = this.tokens.get(key);
    
    if (!bucket) {
      bucket = { tokens: this.capacity, lastRefill: now };
      this.tokens.set(key, bucket);
    }
    
    // Refill tokens
    const timePassed = now - bucket.lastRefill;
    const tokensToAdd = Math.floor((timePassed * this.refillRate) / 1000);
    
    if (tokensToAdd > 0) {
      bucket.tokens = Math.min(this.capacity, bucket.tokens + tokensToAdd);
      bucket.lastRefill = now;
    }
    
    // Check if enough tokens
    if (bucket.tokens >= cost) {
      bucket.tokens -= cost;
      return false; // Not rate limited
    }
    
    return true; // Rate limited
  }

  getRemaining(key: string): number {
    const bucket = this.tokens.get(key);
    return bucket ? bucket.tokens : this.capacity;
  }
}

// Middleware for Next.js API routes
export function createRateLimitMiddleware(options: {
  limit: number;
  window: number;
  message?: string;
  skipFailedRequests?: boolean;
}) {
  const limiter = rateLimit({
    interval: options.window,
  });

  return async function rateLimitMiddleware(
    req: any,
    res: any,
    next: () => void
  ) {
    const identifier = req.ip || req.socket.remoteAddress || 'unknown';
    
    try {
      const isRateLimited = await limiter.check(identifier, options.limit);
      
      if (isRateLimited) {
        const headers = limiter.getHeaders(identifier, options.limit);
        
        res.setHeader('X-RateLimit-Limit', headers['X-RateLimit-Limit']);
        res.setHeader('X-RateLimit-Remaining', headers['X-RateLimit-Remaining']);
        res.setHeader('X-RateLimit-Reset', headers['X-RateLimit-Reset']);
        
        return res.status(429).json({
          success: false,
          message: options.message || 'Too many requests, please try again later.',
          retryAfter: Math.ceil(options.window / 1000),
        });
      }
      
      // Add rate limit headers to successful requests
      const headers = limiter.getHeaders(identifier, options.limit);
      res.setHeader('X-RateLimit-Limit', headers['X-RateLimit-Limit']);
      res.setHeader('X-RateLimit-Remaining', headers['X-RateLimit-Remaining']);
      res.setHeader('X-RateLimit-Reset', headers['X-RateLimit-Reset']);
      
      next();
    } catch (error) {
      console.error('Rate limit error:', error);
      
      if (options.skipFailedRequests) {
        next(); // Skip rate limiting on error
      } else {
        return res.status(500).json({
          success: false,
          message: 'Internal server error',
        });
      }
    }
  };
}

// Rate limiting by endpoint and user
export function createAdvancedRateLimiter(options: {
  windowMs: number;
  maxRequestsPerWindow: number;
  keyGenerator?: (req: any) => string;
  skip?: (req: any) => boolean;
}) {
  const limiter = rateLimit({
    interval: options.windowMs,
  });

  const defaultKeyGenerator = (req: any) => {
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const path = req.url || req.originalUrl || req.path;
    return `${ip}:${path}`;
  };

  const keyGenerator = options.keyGenerator || defaultKeyGenerator;

  return {
    middleware: async (req: any, res: any, next: () => void) => {
      // Skip rate limiting if skip function returns true
      if (options.skip && options.skip(req)) {
        return next();
      }

      const key = keyGenerator(req);
      const isRateLimited = await limiter.check(key, options.maxRequestsPerWindow);

      if (isRateLimited) {
        const headers = limiter.getHeaders(key, options.maxRequestsPerWindow);
        
        res.setHeader('Retry-After', Math.ceil(options.windowMs / 1000));
        res.setHeader('X-RateLimit-Limit', headers['X-RateLimit-Limit']);
        res.setHeader('X-RateLimit-Remaining', headers['X-RateLimit-Remaining']);
        res.setHeader('X-RateLimit-Reset', headers['X-RateLimit-Reset']);
        
        return res.status(429).json({
          success: false,
          error: 'RateLimitExceeded',
          message: `Too many requests. Please try again in ${Math.ceil(options.windowMs / 1000)} seconds.`,
          retryAfter: Math.ceil(options.windowMs / 1000),
          documentation: 'https://accumanage.com/docs/rate-limiting',
        });
      }

      // Add headers to response
      const headers = limiter.getHeaders(key, options.maxRequestsPerWindow);
      res.setHeader('X-RateLimit-Limit', headers['X-RateLimit-Limit']);
      res.setHeader('X-RateLimit-Remaining', headers['X-RateLimit-Remaining']);
      res.setHeader('X-RateLimit-Reset', headers['X-RateLimit-Reset']);
      
      next();
    },

    // Utility methods
    checkLimit: async (key: string) => {
      return limiter.check(key, options.maxRequestsPerWindow);
    },
    
    getRemaining: (key: string) => {
      return limiter.getRemaining(key, options.maxRequestsPerWindow);
    },
    
    reset: (key: string) => {
      limiter.reset(key);
    },
  };
}

// Example usage in API routes:
/*
// app/api/contact/route.ts
import { createAdvancedRateLimiter } from '@/lib/rate-limit';

const limiter = createAdvancedRateLimiter({
  windowMs: 60 * 1000, // 1 minute
  maxRequestsPerWindow: 10, // 10 requests per minute
  keyGenerator: (req) => {
    const ip = req.ip || 'unknown';
    const userId = req.user?.id || 'anonymous';
    return `${ip}:${userId}:contact`;
  },
  skip: (req) => {
    // Skip rate limiting for authenticated admin users
    return req.user?.role === 'admin';
  },
});

export async function POST(req: Request) {
  // Apply rate limiting
  await new Promise((resolve, reject) => {
    limiter.middleware(req as any, {} as any, resolve);
  });
  
  // Your API logic here
}
*/

// Rate limiting configuration for different endpoints
export const rateLimitConfig = {
  // Public endpoints
  public: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 60, // 60 requests per minute
  },
  
  // Authentication endpoints
  auth: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5, // 5 requests per 15 minutes
  },
  
  // Contact form
  contact: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 10, // 10 requests per minute
  },
  
  // API endpoints
  api: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 100, // 100 requests per minute
  },
  
  // File uploads
  upload: {
    windowMs: 5 * 60 * 1000, // 5 minutes
    maxRequests: 20, // 20 requests per 5 minutes
  },
};

// Helper to get appropriate rate limit config
export function getRateLimitConfig(endpoint: string) {
  const config = rateLimitConfig[endpoint as keyof typeof rateLimitConfig] || rateLimitConfig.public;
  return createAdvancedRateLimiter({
    windowMs: config.windowMs,
    maxRequestsPerWindow: config.maxRequests,
  });
}

// Rate limiting for specific user tiers
export class TieredRateLimiter {
  private limiters = new Map<string, ReturnType<typeof createAdvancedRateLimiter>>();
  
  constructor(private defaultTier = 'free') {
    // Define limits for different user tiers
    const tiers = {
      free: { windowMs: 60 * 1000, maxRequests: 60 },
      basic: { windowMs: 60 * 1000, maxRequests: 200 },
      pro: { windowMs: 60 * 1000, maxRequests: 500 },
      enterprise: { windowMs: 60 * 1000, maxRequests: 1000 },
    };
    
    // Create limiters for each tier
    Object.entries(tiers).forEach(([tier, config]) => {
      this.limiters.set(tier, createAdvancedRateLimiter({
        windowMs: config.windowMs,
        maxRequestsPerWindow: config.maxRequests,
      }));
    });
  }
  
  async check(userTier: string, key: string) {
    const tier = this.limiters.get(userTier) || this.limiters.get(this.defaultTier)!;
    return tier.checkLimit(key);
  }
  
  getLimiter(userTier: string) {
    return this.limiters.get(userTier) || this.limiters.get(this.defaultTier)!;
  }
}