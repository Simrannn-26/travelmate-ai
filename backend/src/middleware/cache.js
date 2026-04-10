// Redis-based response cache middleware
// Falls back gracefully if Redis is unavailable
import { createClient } from 'redis';
import { env } from '../config/env.js';

let redis = null;

if (env.REDIS_URL) {
  redis = createClient({ url: env.REDIS_URL });
  redis.connect().catch(err => {
    console.warn('Redis unavailable, caching disabled:', err.message);
    redis = null;
  });
}

export function cache(ttlSeconds = 3600) {
  return async (req, res, next) => {
    if (!redis) return next(); // Skip gracefully if no Redis

    const key = `tm:${req.originalUrl}`;

    try {
      const cached = await redis.get(key);
      if (cached) {
        res.setHeader('X-Cache', 'HIT');
        return res.json(JSON.parse(cached));
      }

      // Intercept res.json to cache the response
      const originalJson = res.json.bind(res);
      res.json = (body) => {
        redis.setEx(key, ttlSeconds, JSON.stringify(body)).catch(() => {});
        res.setHeader('X-Cache', 'MISS');
        return originalJson(body);
      };
      next();
    } catch {
      next(); // Never crash on cache failures
    }
  };
}