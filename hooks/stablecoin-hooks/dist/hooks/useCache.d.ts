/**
 * A custom hook for caching values in cookies with a specified maximum age.
 *
 * @param maxAge - The maximum age (in milliseconds) for which the cached value is considered valid. Defaults to 60000 ms (1 minute).
 * @returns An object containing:
 * - `setCache(key: string, value: any)`: Stores a value in a cookie under the given key, along with a timestamp.
 * - `getCache(key: string)`: Retrieves the cached value for the given key if it is still valid; otherwise, returns `undefined`.
 *
 * @example
 * const { setCache, getCache } = useCache(120000);
 * setCache('user', { name: 'Alice' });
 * const user = getCache('user'); // Returns cached value if not expired
 *
 */
interface iUseCache {
    setCache: (key: string, value: any) => void;
    getCache: <T = any>(key: string) => T | undefined;
    clearCache: () => void;
    cacheCleared: boolean;
    cacheError: string | null;
    cacheMessage: string | null;
}
declare const useCache: (maxAge?: number) => {
    setCache: (key: string, value: any) => void;
    getCache: <T = any>(key: string) => T | undefined;
    clearCache: () => void;
    cacheCleared: boolean;
    cacheError: string | null;
    cacheMessage: string | null;
};
export { useCache };
export type { iUseCache };
