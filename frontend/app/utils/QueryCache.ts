// QueryCache.ts: LRU cache utility for query results

export interface CacheEntry<V> {
  value: V;
  timestamp: number;
}

export class LRUCache<K, V> {
  private maxSize: number;
  private map: Map<K, CacheEntry<V>>;

  constructor(maxSize: number) {
    this.maxSize = maxSize;
    this.map = new Map();
  }

  get(key: K): CacheEntry<V> | undefined {
    const entry = this.map.get(key);
    if (!entry) return undefined;
    // Move to end to mark as recently used
    this.map.delete(key);
    this.map.set(key, entry);
    return entry;
  }

  set(key: K, value: V, timestamp: number) {
    if (this.map.has(key)) {
      this.map.delete(key);
    } else if (this.map.size >= this.maxSize) {
      // Remove least recently used
      const lruKey = this.map.keys().next().value;
      if (lruKey !== undefined) {
        this.map.delete(lruKey);
      }
    }
    this.map.set(key, { value, timestamp });
  }

  cleanup(ttl: number) {
    const now = Date.now();
    for (const [key, entry] of this.map.entries()) {
      if (now - entry.timestamp > ttl) {
        this.map.delete(key);
      }
    }
  }
}

// Default query cache instance for SQL results
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
const CACHE_MAX_SIZE = 100;

export const queryCache = new LRUCache<string, unknown>(CACHE_MAX_SIZE);

// Periodic cleanup of expired entries
if (typeof window !== 'undefined') {
  setInterval(() => {
    queryCache.cleanup(CACHE_TTL);
  }, CACHE_TTL);
} 