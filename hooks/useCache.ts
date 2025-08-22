import Cookies from "js-cookie";
import { useCallback } from "react";

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
 */
const useCache = (maxAge: number = 60000) => {
	const setCache = useCallback(
		(key: string, value: any) => {
			Cookies.set(key, JSON.stringify({ value, ts: Date.now() }), { expires: maxAge / 1000 }); // valid for max age
		},
		[maxAge],
	);

	const getCache = useCallback(
		<T = any>(key: string): T | undefined => {
			const raw = Cookies.get(key);
			if (!raw) return undefined;
			try {
				const { value, ts } = JSON.parse(raw);
				if (Date.now() - ts < maxAge) return value as T; // valid for maxAge
			} catch {
				return undefined;
			}
			return undefined;
		},
		[maxAge],
	);

	return { setCache, getCache };
};

export default useCache;
