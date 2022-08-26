import { Cache } from 'cache-manager';

export function ToCache(key: string, options?: ICacheUtilsOptions) {
  return function (_: unknown, __: string, descriptor: PropertyDescriptor) {
    const { value } = descriptor;

    descriptor.value = async function (...args: unknown[]) {
      const returnValue = await value.apply(this, args);
      this.cache.set(
        `${key}${generateKeyConcat(options, args, returnValue)}`,
        returnValue,
      );

      return returnValue;
    };
  };
}

/**
 * Decorator that marks a function as cached. This means, that the returned value gets
 * cached with the provided key value.
 *
 * The options are useful to define an dynamic key. This is needed if the key should depend
 * on the function inputs. Look at the {@link ICacheUtilsOptions} interface for more
 * information.
 *
 * @param key       The base of the key to cache the value to
 * @param options   Options to add dynamically generate the key.
 */
export function Cached(key: string, options?: ICacheUtilsOptions) {
  return function (_: unknown, __: string, descriptor: PropertyDescriptor) {
    const { value } = descriptor;

    descriptor.value = async function (...args: unknown[]) {
      return withCache(this.cache, {
        key: `${key}${generateKeyConcat(options, args, null)}`,
        onMissed: () => value.apply(this, args),
      });
    };
  };
}

/**
 * Decorator that marks the function as invalidated. This means, that the returned value
 * gets deleted from cache with the provided key. This can be handy to invalidate the
 * cache if objects have changed (e.g. user was updated).
 *
 * The options are useful to define an dynamic key. This is needed if the key should depend
 * on the function inputs. Look at the {@link ICacheUtilsOptions} interface for more
 * information.
 *
 * @param key       The base of the key to cache the value to
 * @param options   Options to add dynamically generate the key.
 */
export const Invalidate = (key: string, options?: ICacheUtilsOptions) => {
  return function (_: unknown, __: unknown, descriptor: PropertyDescriptor) {
    const { value } = descriptor;

    descriptor.value = async function (...args: unknown[]) {
      const returnValue = await value.apply(this, args);
      this.cache.del(`${key}${generateKeyConcat(options, args, returnValue)}`);
      return returnValue;
    };
  };
};

/**
 * This object describes what gets concatenated to the base key. If no options
 * are provided, the base by its own is used.
 *
 * There are different combinations you can provide:
 * - `withReturnField`:     Adds the value of field of the returned object to the key. This
 *                          can be useful if the identifier only exists during the end of the
 *                          function, e.g. after the user got created to add the id to the key.
 * - `withAttribute`:       Adds the value of the attribute at the provided position (starting with 0)
 *                          to the key.
 * - `withAttributeField`:  Can only be used in combination with `withAttribute`. If this is provided,
 *                          instead of converting the attribute value to string, it looks at the field
 *                          with provided name and converts this to string.
 */
interface ICacheUtilsOptions {
  withAttribute?: number;
  withAttributeField?: string;
  withReturnField?: string;
}

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
 * The withCache utility function can be used to easily handle caching for a function.
 * Simply provide a cache manager, a key and a callback which returns the desired value,
 * to cache it automatically.
 *
 * @param cache   The cache manager to access the cache.
 * @param options The options containing key and callbacks. Look at the {@link ICachedOptions}
 *                for more detailed information.
 * @returns       The value returned from the `onMissed` callback or the cached value.
 */
const withCache = async <V>(
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

/**
 * Helper function to generate the concat for dynamic keys.
 *
 * @param options   The options to generate the key.
 * @param args      The original function argument values.
 * @param value     The return value of the original function.
 * @returns         The key concat if options is defined, empty string instead.
 */
const generateKeyConcat = (
  options: ICacheUtilsOptions | undefined,
  args: unknown[],
  value: object,
) => {
  if (!options) {
    return '';
  }

  const { withAttribute, withReturnField, withAttributeField } = options;

  if (withAttribute !== undefined) {
    if (withAttributeField !== undefined) {
      return '-' + args[withAttribute][withAttributeField].toString();
    }

    return '-' + args[withAttribute].toString();
  }

  return '-' + value[withReturnField];
};
