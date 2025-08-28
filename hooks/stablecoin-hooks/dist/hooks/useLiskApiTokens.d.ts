import { iApiToken, iApiTokenCreateResponse } from "../types";
export interface iUseLiskApiTokens {
    tokens: iApiToken[];
    apiTokenLoading: boolean;
    apiTokenError: string | undefined;
    fetchTokens: () => Promise<void>;
    createToken: (description: string) => Promise<void>;
    createTokenLoading: boolean;
    createTokenError: string | undefined;
    createdToken: iApiTokenCreateResponse | undefined;
    updateToken: (id: string, description: string) => Promise<void>;
    updateTokenLoading: boolean;
    updateTokenError: string | undefined;
    revokeToken: (id: string) => Promise<void>;
    revokeTokenLoading: boolean;
    revokeTokenError: string | undefined;
    revokeTokenSuccess: string | undefined;
}
export declare function useLiskApiTokens({ apiKey }: {
    apiKey?: string;
}): iUseLiskApiTokens;
