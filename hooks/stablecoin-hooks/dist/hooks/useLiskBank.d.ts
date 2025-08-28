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
/**
 * React hook for managing Lisk bank account operations and transactions.
 *
 * Provides functionality to:
 * - Create or update a user's bank account (`upsertBankAccount`)
 * - Fetch a user's bank account (`getBankAccount`)
 * - Delete a user's bank account (`deleteBankAccount`)
 * - Create a transaction (deposit or withdrawal) (`createTransaction`)
 * - Submit withdrawal requests (`withdraw`)
 * - Submit deposit requests (`deposit`)
 *
 * Handles loading, error, and success states for each operation.
 * Utilizes caching for bank account retrieval.
 *
 * @param apiKey - Optional API key for authentication.
 * @param user - The current user object.
 * @returns An object containing:
 * - `bankAccount`: The user's bank account information.
 * - `bankLoading`: Loading state for bank account operations.
 * - `bankError`: Error message for bank account operations.
 * - `bankMessage`: Success message for bank account operations.
 * - `upsertBankAccount`: Function to create or update a bank account.
 * - `getBankAccount`: Function to fetch a bank account.
 * - `deleteBankAccount`: Function to delete a bank account.
 * - `createTransaction`: Function to create a transaction.
 * - `withdraw`: Function to submit a withdrawal request.
 * - `withdrawError`: Error message for withdrawal operations.
 * - `withdrawLoading`: Loading state for withdrawal operations.
 * - `withdrawMessage`: Success message for withdrawal operations.
 * - `deposit`: Function to submit a deposit request.
 * - `depositError`: Error message for deposit operations.
 * - `depositLoading`: Loading state for deposit operations.
 * - `depositMessage`: Success message for deposit operations.
 */
export declare function useLiskBank({ apiKey, user }: {
    apiKey?: string;
    user: any;
}): iUseLiskBank;
