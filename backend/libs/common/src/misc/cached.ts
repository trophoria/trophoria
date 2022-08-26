import { Cache } from 'cache-manager';

/**
 * @param key       The key to associate the value in the cache.
 * @param ttl       The time to live of the cached value. If not provided, the cache manager defaults
 *                  are used.
 * @param onCache   This callback gets called if the cache was found. If not provided,
 *                  the found value gets automatically returned. This can be handy to manipulate
 *                  the cached value if needed.
 * @param onMissed  This callback gets called if no cache was found. In this case this method must return
 *                  the value which should get cached and returned by the function.
 */
interface ICachedOptions<V> {
  key: string;
  ttl?: number;
  onCache?: (value: V) => V;
  onMissed: () => Promise<V>;
}

/**
 * The cached utility function can be used to easily handle caching for a function.
 * Simply provide a cache manager, a key and a callback which returns the desired value,
 * to cache it automatically.
 *
 * @param cache   The cache manager to access the cache.
 * @param options The options containing key and callbacks. Look at the {@link ICachedOptions}
 *                for more detailed information.
 * @returns       The value returned from the `onMissed` callback or the cached value.
 */
export const cached = async <V>(
  cache: Cache,
  { onMissed, onCache, key, ttl }: ICachedOptions<V>,
): Promise<V> => {
  if (!onCache) {
    onCache = (value: V) => value;
  }

  const cachedValue = await cache.get<V>(key);
  if (cachedValue) {
    return onCache(cachedValue);
  }

  const toCache = await onMissed();
  return cache.set<V>(key, toCache, { ttl });
};
