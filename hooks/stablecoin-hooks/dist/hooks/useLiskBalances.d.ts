import { iUserTokenBalance } from "../types";
export interface iUseLiskBalances {
    balances: iUserTokenBalance[];
    balancesLoading: boolean;
    balancesError: string | undefined;
    fetchBalances: (userId: string) => Promise<iUserTokenBalance[]>;
    balancesMessage: string | undefined;
}
/**
 * Custom React hook to fetch and manage Lisk user token balances.
 *
 * This hook provides state and logic for retrieving a user's token balances from a remote API,
 * with caching support to optimize repeated requests. It exposes the balances, loading state,
 * error state, and a function to fetch balances for a given user ID.
 *
 * @param {Object} params - Hook parameters.
 * @param {string} [params.apiKey] - Optional API key for authorization in requests.
 * @returns {iUseLiskBalances} An object containing:
 *   - balances: Array of user token balances.
 *   - balancesLoading: Boolean indicating if balances are being loaded.
 *   - balancesError: Error message if fetching fails.
 *   - fetchBalances: Function to fetch balances for a given user ID.
 */
export declare function useLiskBalances({ apiKey }: {
    apiKey?: string;
}): iUseLiskBalances;
