import { iBankAccount, iBankAccountResponse, iCreateTransactionParams, iCreateTransactionResponse } from "../types";
export interface iUseLiskBank {
    bankAccount: iBankAccount | undefined;
    bankLoading: boolean;
    bankError: string | undefined;
    bankMessage: string | undefined;
    upsertBankAccount: (data: {
        userId: string;
        accountHolder: string;
        accountNumber: string;
        branchCode: string;
        bankName: string;
    }) => Promise<iBankAccountResponse | undefined>;
    getBankAccount: (userId: string) => Promise<iBankAccount | undefined>;
    deleteBankAccount: (userId: string) => Promise<{
        message: string;
    } | undefined>;
    createTransaction: (data: iCreateTransactionParams) => Promise<iCreateTransactionResponse | undefined>;
    withdraw: (amount: string) => Promise<iCreateTransactionResponse | void>;
    withdrawLoading: boolean;
    withdrawError: string | null;
    withdrawMessage: string | null;
    depositLoading: boolean;
    depositError: string | null;
    depositMessage: string | null;
    deposit: (amount: string) => Promise<iCreateTransactionResponse | void>;
}
export declare function useLiskBank({ apiKey, user }: {
    apiKey?: string;
    user: any;
}): iUseLiskBank;
