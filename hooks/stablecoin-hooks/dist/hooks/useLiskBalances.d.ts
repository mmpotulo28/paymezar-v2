import { iUserTokenBalance } from "../types";
export interface iUseLiskBalances {
    balances: iUserTokenBalance[];
    balancesLoading: boolean;
    balancesError: string | undefined;
    fetchBalances: (userId: string) => Promise<iUserTokenBalance[]>;
}
export declare function useLiskBalances({ apiKey }: {
    apiKey?: string;
}): iUseLiskBalances;
