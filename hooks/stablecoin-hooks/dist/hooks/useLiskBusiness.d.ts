import { iMintStableCoinsResponse, iPendingTx, iPendingTxResponse, iUserTokenBalance } from "../types";
export interface iUseBusiness {
    float: iUserTokenBalance[];
    loadingFloat: boolean;
    floatError: string | undefined;
    fetchFloat: () => Promise<iUserTokenBalance[]>;
    gasLoading: boolean;
    gasSuccess: string | undefined;
    gasError: string | undefined;
    enableBusinessGas: () => Promise<void>;
    enableUserGas: (userId: string) => Promise<void>;
    mintForm: {
        transactionAmount: string;
        transactionRecipient: string;
        transactionNotes: string;
    };
    mintLoading: boolean;
    mintSuccess: string | undefined;
    mintError: string | undefined;
    setMintForm: React.Dispatch<React.SetStateAction<{
        transactionAmount: string;
        transactionRecipient: string;
        transactionNotes: string;
    }>>;
    mintStableCoins: () => Promise<iMintStableCoinsResponse | undefined>;
    pendingTx: iPendingTx[];
    pendingLoading: boolean;
    pendingError: string | undefined;
    fetchPendingTx: () => Promise<iPendingTxResponse>;
    userGasLoading: boolean;
    userGasSuccess: string | undefined;
    userGasError: string | undefined;
}
/**
 * Custom React hook for managing Lisk business operations, including:
 * - Fetching float (token) balances
 * - Enabling gas for business and users
 * - Minting stablecoins
 * - Fetching pending transactions
 * - Managing loading, success, and error states for each operation
 * - Caching results to optimize API calls
 *
 * @param apiKey - Optional API key for authentication with backend services.
 * @returns An object containing state variables, loading/error indicators, and functions for:
 *   - float: Array of user token balances
 *   - loadingFloat: Loading state for float balances
 *   - floatError: Error message for float balance fetch
 *   - fetchFloat: Function to fetch float balances
 *   - gasLoading, gasSuccess, gasError: States for enabling business gas
 *   - enableBusinessGas: Function to enable business gas
 *   - userGasLoading, userGasSuccess, userGasError: States for enabling user gas
 *   - enableUserGas: Function to enable gas for a specific user
 *   - mintForm: Form state for minting stablecoins
 *   - setMintForm: Setter for mintForm
 *   - mintLoading, mintSuccess, mintError: States for minting stablecoins
 *   - mintStableCoins: Function to mint stablecoins
 *   - pendingTx: Array of pending transactions
 *   - pendingLoading, pendingError: States for fetching pending transactions
 *   - fetchPendingTx: Function to fetch paginated pending transactions
 *
 * @remarks
 * This hook is intended for use in business-related components that interact with the Lisk stablecoin backend.
 * It handles API communication, caching, and state management for common business operations.
 */
export declare function useLiskBusiness({ apiKey }: {
    apiKey?: string;
}): iUseBusiness;
