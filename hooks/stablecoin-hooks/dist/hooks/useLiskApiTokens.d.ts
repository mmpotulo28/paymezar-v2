import { iApiToken, iApiTokenCreateResponse } from "../types";
export interface iUseLiskApiTokens {
    tokens: iApiToken[];
    apiTokenLoading: boolean;
    apiTokenError: string | undefined;
    apiTokenMessage: string | undefined;
    fetchTokens: () => Promise<void>;
    createToken: (description: string) => Promise<void>;
    createTokenLoading: boolean;
    createTokenError: string | undefined;
    createTokenMessage: string | undefined;
    createdToken: iApiTokenCreateResponse | undefined;
    updateToken: (id: string, description: string) => Promise<void>;
    updateTokenLoading: boolean;
    updateTokenError: string | undefined;
    updateTokenMessage: string | undefined;
    revokeToken: (id: string) => Promise<void>;
    revokeTokenLoading: boolean;
    revokeTokenError: string | undefined;
    revokeTokenMessage: string | undefined;
}
/**
 * Custom React hook for managing API tokens via the Lisk API.
 *
 * Provides functionality to fetch, create, update, and revoke API tokens,
 * with built-in caching and loading/error state management.
 *
 * @param apiKey - Optional API key used for authorization in requests.
 * @returns An object containing:
 * - `tokens`: Array of fetched API tokens.
 * - `apiTokenLoading`: Loading state for fetching tokens.
 * - `apiTokenError`: Error message for fetching tokens.
 * - `fetchTokens`: Function to fetch tokens from the API.
 * - `createToken`: Function to create a new API token.
 * - `createTokenLoading`: Loading state for creating a token.
 * - `createTokenError`: Error message for creating a token.
 * - `createdToken`: Response data for the created token.
 * - `updateToken`: Function to update an existing token's description.
 * - `updateTokenLoading`: Loading state for updating a token.
 * - `updateTokenError`: Error message for updating a token.
 * - `revokeToken`: Function to revoke an API token.
 * - `revokeTokenLoading`: Loading state for revoking a token.
 * - `revokeTokenError`: Error message for revoking a token.
 * - `revokeTokenSuccess`: Success message for revoking a token.
 */
export declare function useLiskApiTokens({ apiKey }: {
    apiKey?: string;
}): iUseLiskApiTokens;
