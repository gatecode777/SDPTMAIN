import { updateTag } from "next/cache";

let redis: any = null;

if (process.env.REDIS_URL) {
  try {
    const Redis = require("ioredis");
    redis = new Redis(process.env.REDIS_URL);
    console.log("Redis cache client successfully initialized");
  } catch (e) {
    console.warn("Failed to initialize Redis client, falling back to memory cache:", e);
  }
}

// Global in-memory cache map to prevent Next.js 2MB unstable_cache limits and unhandled rejections
const memoryCache = new Map<string, { data: any; expiry: number; tags: string[] }>();

export async function customCache<T>(
  fetchFn: () => Promise<T>,
  key: string,
  tags: string[],
  revalidateSeconds: number = 3600
): Promise<T> {
  if (redis) {
    try {
      const cached = await redis.get(key);
      if (cached) {
        return JSON.parse(cached) as T;
      }
      const data = await fetchFn();
      await redis.set(key, JSON.stringify(data), "EX", revalidateSeconds);
      return data;
    } catch (e) {
      console.warn("Redis read/write error, falling back to local memory cache:", e);
    }
  }

  // Check In-Memory Cache
  const now = Date.now();
  const cachedItem = memoryCache.get(key);
  if (cachedItem && cachedItem.expiry > now) {
    return cachedItem.data as T;
  }

  // Fetch fresh data
  const data = await fetchFn();

  // Store in memory cache with expiration time
  memoryCache.set(key, {
    data,
    expiry: now + revalidateSeconds * 1000,
    tags
  });

  return data;
}

export async function invalidateCacheTag(tag: string) {
  if (redis) {
    try {
      const keys = await redis.keys(`*${tag}*`);
      if (keys.length > 0) {
        await redis.del(...keys);
      }
      console.log(`Redis keys deleted for tag: ${tag}`);
    } catch (e) {
      console.warn("Redis delete error:", e);
    }
  }
  
  // Invalidate matching tags in the in-memory cache
  for (const [key, item] of memoryCache.entries()) {
    if (item.tags.includes(tag)) {
      memoryCache.delete(key);
    }
  }

  try {
    updateTag(tag);
  } catch (e) {
    // Suppress warning if updateTag is called outside of request context
  }
}
