import { iTransaction } from "../types";
export interface iUseLiskTransactions {
    transactions: iTransaction[];
    transactionsLoading: boolean;
    transactionsError: string | undefined;
    fetchTransactions: (userId: string) => Promise<iTransaction[]>;
    transaction: iTransaction | undefined;
    transactionLoading: boolean;
    transactionError: string | undefined;
    fetchSingleTransaction: (userId: string, transactionId: string) => Promise<iTransaction | undefined>;
}
export declare function useLiskTransactions({ apiKey }: {
    apiKey?: string;
}): iUseLiskTransactions;
