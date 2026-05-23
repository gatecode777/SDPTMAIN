import { unstable_cache, updateTag } from "next/cache";

let redis: any = null;

if (process.env.REDIS_URL) {
  try {
    const Redis = require("ioredis");
    redis = new Redis(process.env.REDIS_URL);
    console.log("Redis cache client successfully initialized");
  } catch (e) {
    console.warn("Failed to initialize Redis client, falling back to Next.js memory cache:", e);
  }
}

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
      console.warn("Redis read/write error, falling back to local Next.js cache:", e);
    }
  }

  // Fallback to Next.js native unstable_cache
  const cachedFn = unstable_cache(
    async () => fetchFn(),
    [key],
    { tags, revalidate: revalidateSeconds }
  );
  return cachedFn();
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
  
  try {
    updateTag(tag);
  } catch (e) {
    console.warn("Error running Next.js updateTag:", e);
  }
}
